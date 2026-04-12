import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/Components/ui/card';

interface Props {
    children: React.ReactNode;
}

export default function Guest({ children }: Props) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-transparent pt-6 sm:justify-center sm:pt-0">
            <div className="relative z-[1]">
                <Link href="/">
                    <ApplicationLogo
                        size="md"
                        className="h-20 w-20 text-muted-foreground drop-shadow-sm"
                    />
                </Link>
            </div>

            <Card className="relative z-[1] mt-6 w-full overflow-hidden shadow-md shadow-black/10 dark:shadow-black/30 sm:max-w-md">
                <CardContent className="p-6 sm:p-8">{children}</CardContent>
            </Card>
        </div>
    );
}
