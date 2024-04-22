import MainNav from "@/Components/MainNav";
import Footer from "@/Components/Footer";
import CookieConsent from "@/Components/CookieConsent";

export default function SiteLayout({ header, children }) {
    return (
        <div className="min-h-screen bg-white md:bg-gray-100 dark:bg-gray-900">
            <MainNav></MainNav>
            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}
            <main>{children}</main>
            <CookieConsent></CookieConsent>
            <Footer></Footer>
        </div>
    );
}
