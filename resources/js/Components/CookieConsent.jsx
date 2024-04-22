import React, { useState, useEffect } from "react";

const CookieConsent = () => {
    const [showCookieConsent, setShowCookieConsent] = useState(false);

    useEffect(() => {
        const cookies = document.cookie.split("; ");
        const hasAcceptedCookies = cookies.some((cookie) =>
            cookie.includes("cookies_accepted=true")
        );

        // Se o cookie de aceitação de cookies não existe, exibe o aviso de consentimento.
        if (!hasAcceptedCookies) {
            setShowCookieConsent(true);
        }
    }, []); // Executa apenas uma vez no carregamento do componente.

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
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 p-4">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex justify-between items-center">
                    <p className="text-white">
                        Este site utiliza cookies para garantir a melhor
                        experiência possível. Ao continuar utilizando o site,
                        você concorda com a nossa{" "}
                        <button
                            className="underline"
                            onClick={openPrivacyPolicy}
                        >
                            Política de Privacidade
                        </button>
                        .
                    </p>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        onClick={acceptCookies}
                    >
                        Aceitar cookies
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
