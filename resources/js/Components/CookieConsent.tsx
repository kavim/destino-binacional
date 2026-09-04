import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/Components/ui/button';
import {
    getCookieConsent,
    loadAnalytics,
    setCookieConsent,
    type CookieConsentValue,
} from '@/analytics';

const CookieConsent = () => {
    const [visible, setVisible] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);

    const persist = useCallback((value: CookieConsentValue) => {
        setCookieConsent(value);
        setVisible(false);

        if (value === 'accepted') {
            loadAnalytics();
        }
    }, []);

    useEffect(() => {
        setVisible(getCookieConsent() === null);
    }, []);

    useEffect(() => {
        if (!visible) {
            return;
        }

        dialogRef.current?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                persist('rejected');
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, [visible, persist]);

    if (!visible) {
        return null;
    }

    return (
        <div
            ref={dialogRef}
            tabIndex={-1}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-popover/95 p-4 text-popover-foreground shadow-lg backdrop-blur-md outline-none supports-[backdrop-filter]:bg-popover/85"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-description"
        >
            <div className="mx-auto flex max-w-screen-xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p id="cookie-consent-title" className="text-sm font-medium">
                        Cookies e analytics
                    </p>
                    <p id="cookie-consent-description" className="mt-1 text-sm leading-relaxed">
                        Usamos cookies essenciais e, se você aceitar, Google Analytics e Hotjar.
                        Recusar não impede a navegação.{' '}
                        <a
                            href="/privacy-policy"
                            className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
                        >
                            Política de Privacidade
                        </a>
                        .
                    </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:min-w-[16rem]">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => persist('rejected')}
                    >
                        Recusar
                    </Button>
                    <Button type="button" onClick={() => persist('accepted')}>
                        Aceitar cookies
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
