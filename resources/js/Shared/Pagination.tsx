import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { stripHtmlToText } from "@/lib/sanitizeHtml";

export type PaginationLink = {
  active: boolean;
  label: string;
  url: string | null;
};

const PageLink = ({
  active,
  label,
  url,
}: {
  active: boolean;
  label: string;
  url: string;
}) => {
  const className = cn(
    "mr-1 mb-1 inline-flex rounded-md border px-4 py-2 text-sm font-medium transition-colors",
    "border-border bg-muted text-foreground",
    "hover:bg-accent hover:text-accent-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    active && "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
  );
  return (
    <Link className={className} href={url}>
      <span>{stripHtmlToText(label)}</span>
    </Link>
  );
};

const PageInactive = ({ label }: { label: string }) => {
  const className = cn(
    "mr-1 mb-1 inline-flex rounded-md border border-border bg-muted px-4 py-2 text-sm text-muted-foreground opacity-50"
  );
  return <div className={className}>{stripHtmlToText(label)}</div>;
};

export default function Pagination({ links = [] }: { links?: PaginationLink[] }) {
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
}
