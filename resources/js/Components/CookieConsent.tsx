import React, { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";

const CookieConsent = () => {
    const [showCookieConsent, setShowCookieConsent] = useState(false);

    useEffect(() => {
        const cookies = document.cookie.split("; ");
        const hasAcceptedCookies = cookies.some((cookie) =>
            cookie.includes("cookies_accepted=true")
        );

        if (!hasAcceptedCookies) {
            setShowCookieConsent(true);
        }
    }, []);

    const acceptCookies = () => {
        document.cookie =
            "cookies_accepted=true; max-age=" +
            365 * 24 * 60 * 60 +
            "; SameSite=None; Secure";
        setShowCookieConsent(false);
    };

    const openPrivacyPolicy = () => {
        window.location.href = "/privacy-policy";
    };

    if (!showCookieConsent) {
        return null;
    }

    return (
        <div
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-popover/95 p-4 text-popover-foreground shadow-lg backdrop-blur-md supports-[backdrop-filter]:bg-popover/85"
            role="dialog"
            aria-label="Consentimento de cookies"
        >
            <div className="mx-auto flex max-w-screen-xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-relaxed">
                    Este site utiliza cookies para garantir a melhor experiência
                    possível. Ao continuar utilizando o site, você concorda com a
                    nossa{" "}
                    <button
                        type="button"
                        className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
                        onClick={openPrivacyPolicy}
                    >
                        Política de Privacidade
                    </button>
                    .
                </p>
                <Button
                    type="button"
                    onClick={acceptCookies}
                    className="shrink-0 sm:min-w-[10rem]"
                >
                    Aceitar cookies
                </Button>
            </div>
        </div>
    );
};

export default CookieConsent;
