import "@inertiajs/core";

declare module "@inertiajs/core" {
  interface PageProps {
    [key: string]: any;
  }
}
