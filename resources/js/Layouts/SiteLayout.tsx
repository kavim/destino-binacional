import MainNav from "@/Components/MainNav";
import Footer from "@/Components/Footer";

interface Props {
    header?: React.ReactNode;
    children: React.ReactNode;
}

export default function SiteLayout({ header, children }: Props) {
    return (
        <div className="relative flex min-h-screen flex-col bg-transparent">
            <MainNav />
            {header && (
                <header className="border-b border-border/80 bg-card/90 shadow-sm shadow-black/[0.04] backdrop-blur-sm dark:bg-card/80 dark:shadow-black/15">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}
            <main className="relative flex-1">{children}</main>
            <Footer />
        </div>
    );
}
