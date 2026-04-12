/**
 * Cliente de observabilidade: erros globais, promises rejeitadas, Inertia e captura manual.
 *
 * Envia para POST /api/observability/errors (axios + CSRF do bootstrap).
 *
 * Variáveis Vite:
 * - VITE_OBSERVABILITY_ENABLED=false — desliga envio (útil em dev).
 */
import { router } from '@inertiajs/react';

export type ReportLevel = 'error' | 'warn';

/** Metadados opcionais (strings curtas) enviados em `client_meta` no JSON do erro. */
export type ObservabilityMeta = Record<string, string>;

export interface ReportFrontendErrorArgs {
    message: string;
    url?: string;
    file?: string;
    line?: number;
    stack?: string;
    level?: ReportLevel;
    /** Mesclado no payload como `client_meta` (apenas strings, limitado no backend). */
    meta?: ObservabilityMeta;
}

const DEDUPE_WINDOW_MS = 12_000;
const MAX_SENDS_PER_MINUTE = 24;
const DEFAULT_IGNORE_SUBSTRINGS = [
    'ResizeObserver loop',
    'ResizeObserver loop limit exceeded',
    'chrome-extension://',
    'moz-extension://',
    'safari-extension://',
    'Non-Error promise rejection',
    'cancelled',
    'AbortError',
    'The operation was aborted',
    'Loading chunk',
    'Failed to fetch dynamically imported module',
];

let inertiaHookRegistered = false;
const recentFingerprints = new Map<string, number>();
const sendTimestamps: number[] = [];

function isObservabilityEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    const flag = import.meta.env.VITE_OBSERVABILITY_ENABLED;
    if (flag === 'false' || flag === '0') return false;
    return true;
}

function getApiUrl(): string | null {
    if (typeof window === 'undefined' || typeof window.axios === 'undefined') return null;
    return '/api/observability/errors';
}

function simpleHash(input: string): string {
    let h = 0;
    for (let i = 0; i < input.length; i++) {
        h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
    }
    return String(h);
}

function fingerprintReport(args: ReportFrontendErrorArgs): string {
    const base = [args.message, args.stack ?? '', args.file ?? '', String(args.line ?? '')].join('|');
    return simpleHash(base);
}

function shouldIgnore(message: string, stack?: string): boolean {
    const hay = `${message}\n${stack ?? ''}`;
    return DEFAULT_IGNORE_SUBSTRINGS.some((s) => hay.includes(s));
}

function pruneRateLimitWindow(now: number): void {
    const cutoff = now - 60_000;
    while (sendTimestamps.length > 0 && sendTimestamps[0]! < cutoff) {
        sendTimestamps.shift();
    }
}

function allowSend(now: number): boolean {
    pruneRateLimitWindow(now);
    if (sendTimestamps.length >= MAX_SENDS_PER_MINUTE) return false;
    sendTimestamps.push(now);
    return true;
}

function allowDedupe(fp: string, now: number): boolean {
    const last = recentFingerprints.get(fp);
    if (last != null && now - last < DEDUPE_WINDOW_MS) return false;
    recentFingerprints.set(fp, now);
    if (recentFingerprints.size > 200) {
        const oldest = [...recentFingerprints.entries()].sort((a, b) => a[1] - b[1]).slice(0, 100);
        for (const [k] of oldest) recentFingerprints.delete(k);
    }
    return true;
}

function collectClientMeta(): ObservabilityMeta {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return {};
    const meta: ObservabilityMeta = {
        language: navigator.language || '',
        user_agent: (navigator.userAgent || '').slice(0, 500),
        viewport: `${typeof window.innerWidth === 'number' ? window.innerWidth : 0}x${typeof window.innerHeight === 'number' ? window.innerHeight : 0}`,
        ts: new Date().toISOString(),
    };
    try {
        const el = document.getElementById('app');
        const raw = el?.getAttribute('data-page');
        if (raw) {
            const page = JSON.parse(raw) as { component?: string; url?: string; version?: string | null };
            if (page.component) meta.inertia_component = page.component.slice(0, 500);
            if (page.version) meta.inertia_version = String(page.version).slice(0, 100);
        }
    } catch {
        /* ignore parse errors */
    }
    if (import.meta.env.MODE) meta.vite_mode = import.meta.env.MODE;
    return meta;
}

function mergeMeta(extra?: ObservabilityMeta): ObservabilityMeta {
    return { ...collectClientMeta(), ...extra };
}

/**
 * Envia um erro ao backend (respeita enable flag, ignore list, dedupe e rate limit client-side).
 */
export function reportFrontendError({
    message,
    url,
    file,
    line,
    stack,
    level = 'error',
    meta: metaArg,
}: ReportFrontendErrorArgs): void {
    if (!isObservabilityEnabled()) return;
    if (shouldIgnore(message, stack)) return;

    const now = Date.now();
    const fp = fingerprintReport({ message, url, file, line, stack, level });
    if (!allowDedupe(fp, now)) return;
    if (!allowSend(now)) return;

    const apiUrl = getApiUrl();
    if (!apiUrl) return;

    const client_meta = mergeMeta(metaArg);

    const stackTruncated =
        stack != null && stack.length > 9500 ? `${stack.slice(0, 9500)}\n…(truncated)` : stack;

    const payload = {
        message,
        url: url || window.location?.href,
        file,
        line,
        stack: stackTruncated,
        level,
        meta: client_meta,
    };

    void window.axios.post(apiUrl, payload).catch(() => {});
}

/** Erro ou valor rejeitado em promise. */
export function captureException(error: unknown, meta?: ObservabilityMeta): void {
    const err = error instanceof Error ? error : undefined;
    const message = err?.message ?? String(error);
    reportFrontendError({
        message,
        url: window.location?.href,
        stack: err?.stack,
        level: 'error',
        meta: { ...meta, kind: 'manual.exception' },
    });
}

export function captureMessage(message: string, level: ReportLevel = 'error', meta?: ObservabilityMeta): void {
    reportFrontendError({
        message,
        url: window.location?.href,
        level,
        meta: { ...meta, kind: 'manual.message' },
    });
}

/**
 * Para usar com `componentDidCatch` / error boundaries: envia stack de componentes React.
 */
export function captureReactBoundaryError(error: Error, componentStack?: string): void {
    reportFrontendError({
        message: error.message,
        url: window.location?.href,
        stack: [error.stack, componentStack && `Component stack:${componentStack}`].filter(Boolean).join('\n'),
        level: 'error',
        meta: { kind: 'react.error_boundary' },
    });
}

/**
 * Registra listener Inertia para `exception` (falhas fora de validação de formulário).
 * Chame uma vez a partir de `createInertiaApp` → `setup`.
 */
export function registerInertiaObservability(): void {
    if (typeof window === 'undefined' || inertiaHookRegistered) return;
    inertiaHookRegistered = true;

    router.on('exception', (event) => {
        const ex = event.detail.exception;
        reportFrontendError({
            message: `Inertia: ${ex.message}`,
            url: window.location?.href,
            stack: ex.stack,
            level: 'error',
            meta: { kind: 'inertia.exception' },
        });
    });
}

if (typeof window !== 'undefined') {
    window.addEventListener('error', (event: ErrorEvent) => {
        reportFrontendError({
            message: event.message || String(event.error),
            url: event.filename || window.location?.href,
            file: event.filename,
            line: event.lineno,
            stack: event.error instanceof Error ? event.error.stack : undefined,
            meta: { kind: 'window.error' },
        });
    });

    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
        const reason = event.reason;
        const err = reason instanceof Error ? reason : undefined;
        const message = err?.message ?? String(reason);
        reportFrontendError({
            message: `Unhandled promise: ${message}`,
            url: window.location?.href,
            stack: err?.stack,
            level: 'error',
            meta: { kind: 'window.unhandledrejection' },
        });
    });
}
