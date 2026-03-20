import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";

const PageLink = ({ active, label, url }) => {
  const className = cn(
    "mr-1 mb-1 inline-flex rounded-md border px-4 py-2 text-sm font-medium transition-colors",
    "border-border bg-muted text-foreground",
    "hover:bg-accent hover:text-accent-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    active && "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
  );
  return (
    <Link className={className} href={url}>
      <span dangerouslySetInnerHTML={{ __html: label }}></span>
    </Link>
  );
};

const PageInactive = ({ label }) => {
  const className = cn(
    "mr-1 mb-1 inline-flex rounded-md border border-border bg-muted px-4 py-2 text-sm text-muted-foreground opacity-50"
  );
  return <div className={className} dangerouslySetInnerHTML={{ __html: label }} />;
};

export default ({ links = [] }) => {
  if (links.length === 3) return null;

  return (
    <div className="-mb-1 mt-6 flex flex-wrap">
      {links.map(({ active, label, url }) => {
        return url === null ? (
          <PageInactive key={label} label={label} />
        ) : (
          <PageLink key={label} label={label} active={active} url={url} />
        );
      })}
    </div>
  );
};
