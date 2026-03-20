import MainNav from "@/Components/MainNav";
import Footer from "@/Components/Footer";

interface Props {
    header?: React.ReactNode;
    children: React.ReactNode;
}

export default function SiteLayout({ header, children }: Props) {
    return (
        <div className="min-h-screen bg-background">
            <MainNav />
            {header && (
                <header className="bg-card shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}
            <main>{children}</main>
            <Footer />
        </div>
    );
}
