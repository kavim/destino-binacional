import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { trans } from "@/utils";
import { Link } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";

const shortcutCardClass = cn(
  "group transition-colors",
  "hover:border-primary/40 hover:bg-accent/50",
  "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
);

export default function Dashboard(props) {
  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold leading-tight text-foreground">
            Dashboard
          </h2>
          <Badge variant="secondary" className="w-fit">
            CMS
          </Badge>
        </div>
      }
    >
      <Head title="Dashboard" />

      <div className="py-10">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden shadow-sm">
            <CardContent className="space-y-6 p-6 sm:p-8">
              <div className="text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  👋 {trans("dashboard.welcome")}, {props.auth.user.name}!
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {trans("dashboard.you_are_logged_in")}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={route("places.index")}
                  className="min-w-[140px] flex-1 sm:max-w-[200px]"
                >
                  <Card className={shortcutCardClass}>
                    <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                      <img
                        src="/images/icons/locale.svg"
                        alt=""
                        className="h-16 w-16 md:h-24 md:w-24"
                      />
                      <span className="text-sm font-medium text-foreground">
                        Locales
                      </span>
                    </CardContent>
                  </Card>
                </Link>
                <Link
                  href={route("events.index")}
                  className="min-w-[140px] flex-1 sm:max-w-[200px]"
                >
                  <Card className={shortcutCardClass}>
                    <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                      <img
                        src="/images/icons/eventos_dark.svg"
                        alt=""
                        className="h-16 w-16 md:h-24 md:w-24"
                      />
                      <span className="text-sm font-medium text-foreground">
                        Eventos
                      </span>
                    </CardContent>
                  </Card>
                </Link>
                <Link
                  href={route("tours.index")}
                  className="min-w-[140px] flex-1 sm:max-w-[200px]"
                >
                  <Card className={shortcutCardClass}>
                    <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                      <img
                        src="/images/icons/tours_dark.svg"
                        alt=""
                        className="h-16 w-16 md:h-24 md:w-24"
                      />
                      <span className="text-sm font-medium text-foreground">
                        Tours
                      </span>
                    </CardContent>
                  </Card>
                </Link>
                <Link
                  href={route("observability.index")}
                  className="min-w-[140px] flex-1 sm:max-w-[200px]"
                >
                  <Card className={shortcutCardClass}>
                    <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                      <span className="text-3xl" aria-hidden>
                        📊
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        Insights
                      </span>
                    </CardContent>
                  </Card>
                </Link>
                <Link
                  href={route("tracker.index")}
                  className="min-w-[140px] flex-1 sm:max-w-[200px]"
                >
                  <Card className={shortcutCardClass}>
                    <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
                      <span className="text-3xl" aria-hidden>
                        📈
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        Tracker
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
