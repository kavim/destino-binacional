import { useEffect, useId, useRef, useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import Flags from '@/Components/Flags';
import MobileNav from '@/Components/MobileNav';
import { ThemeToggle } from '@/Components/ThemeToggle';
import { trans } from '@/utils';

export default function MainNav() {
    const { cats } = usePage().props;
    const categories = cats?.categories ?? [];
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const categoriesRef = useRef<HTMLDivElement>(null);
    const menuId = useId();

    useEffect(() => {
        if (!categoriesOpen) {
            return;
        }

        const onPointerDown = (event: MouseEvent) => {
            if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
                setCategoriesOpen(false);
            }
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setCategoriesOpen(false);
            }
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [categoriesOpen]);

    return (
        <nav className="sticky top-0 z-40 border-b border-border bg-card/80 pt-[env(safe-area-inset-top)] shadow-sm shadow-black/5 backdrop-blur-md backdrop-saturate-150 dark:bg-card/85 dark:shadow-black/20">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
                <div className="flex min-h-[3.5rem] items-center justify-between py-2 sm:h-16 sm:py-0">
                    <div className="flex">
                        <div className="shrink-0 flex items-center">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-foreground" />
                            </Link>
                        </div>

                        <div className="hidden sm:-my-px sm:ml-10 sm:flex sm:align-middle items-center justify-end">
                            <div className="relative" ref={categoriesRef}>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    aria-expanded={categoriesOpen}
                                    aria-haspopup="true"
                                    aria-controls={menuId}
                                    onClick={() => setCategoriesOpen((open) => !open)}
                                >
                                    {trans('nav.categories')}
                                    <i className="fa-solid fa-chevron-down ml-2" aria-hidden></i>
                                </button>
                                <div
                                    id={menuId}
                                    hidden={!categoriesOpen}
                                    className="absolute left-0 z-50 w-72 pt-2"
                                >
                                    <ul className="w-full rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-md dark:shadow-black/35">
                                        {categories.map((cat) => (
                                            <li key={cat.slug}>
                                                <Link href={route('site.categories.show', { CategoryParentIdentifier: cat.slug })}
                                                    className="w-full flex justify-between rounded-sm px-2 py-1.5 text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                                                    onClick={() => setCategoriesOpen(false)}
                                                >
                                                    <div className='flex items-center'>
                                                        <div className='p-1 rounded-full' style={{ backgroundColor: cat.color ?? undefined }}>
                                                            <img src={cat.icon ?? ''} alt={cat.name} className="w-6 h-6 rounded-full" />
                                                        </div>
                                                        <span className='ml-2 font-semibold text-lg'>{cat.name}</span>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <Link href={route('site.events.index')} className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                    Eventos
                                </Link>
                            </div>
                            <div>
                                <Link href={route('site.tours.index')} className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                    Tours
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:flex justify-end items-center gap-2 mr-5">
                        <ThemeToggle />
                        <div className="relative">
                            <Flags />
                        </div>
                    </div>

                    <div className="-mr-2 flex items-center gap-0.5 sm:hidden">
                        <div className="flex h-11 w-11 items-center justify-center">
                            <ThemeToggle />
                        </div>
                        <button
                            type="button"
                            aria-expanded={showingNavigationDropdown}
                            aria-controls="mobile-site-nav"
                            aria-label={
                                showingNavigationDropdown
                                    ? trans('nav.close_menu')
                                    : trans('nav.open_menu')
                            }
                            onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:bg-accent focus:text-foreground focus-visible:ring-2 focus-visible:ring-ring transition duration-150 ease-in-out"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden>
                                <path
                                    className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div
                id="mobile-site-nav"
                className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}
            >
                <div className="space-y-1 pt-2 pb-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                    <MobileNav />
                </div>
            </div>
        </nav>
    );
}
