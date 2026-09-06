export type UserRole = 'admin' | 'editor' | 'user';

export type AuthUser = {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    role?: UserRole;
    is_admin?: boolean;
    is_staff?: boolean;
};

export type NavCategory = {
    slug: string;
    name: string;
    description?: string | null;
    featured_image?: string | null;
    icon: string | null;
    color: string | null;
};

export type FlashProps = {
    message?: string | null;
    success?: string | null;
    error?: string | null;
    errors?: unknown;
};

export type ZiggyProps = {
    location: string;
    url?: string;
    port?: number | null;
    defaults?: Record<string, unknown>;
    routes?: Record<string, unknown>;
};

export type SharedPageProps = {
    auth: {
        user: AuthUser | null;
    };
    flash: FlashProps;
    cats: {
        categories: NavCategory[];
    };
    ziggy: ZiggyProps;
    csrf_token: string;
    tracker_enabled: boolean;
};

export type PageProps<T extends Record<string, unknown> = Record<string, never>> = SharedPageProps & T;

declare module '@inertiajs/core' {
    interface PageProps {
        auth: SharedPageProps['auth'];
        flash: FlashProps;
        cats: SharedPageProps['cats'];
        ziggy: ZiggyProps;
        csrf_token: string;
        tracker_enabled: boolean;
    }
}
