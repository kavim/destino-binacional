import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import Flags from '@/Components/Flags';
import MobileNav from '@/Components/MobileNav';
import { ThemeToggle } from '@/Components/ThemeToggle';

export default function MainNav() {
    const { cats } = (usePage().props as any);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <nav className="sticky top-0 z-40 border-b border-border/80 bg-card/80 shadow-sm shadow-black/5 backdrop-blur-md backdrop-saturate-150 dark:bg-card/85 dark:shadow-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="shrink-0 flex items-center">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-foreground" />
                            </Link>
                        </div>

                        <div className="hidden sm:-my-px sm:ml-10 sm:flex sm:align-middle items-center justify-end">
                            <div className="relative group">
                                <button className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                                    Categorias
                                    <i className="fa-solid fa-chevron-down ml-2"></i>
                                </button>
                                <div className="absolute left-0 pt-2 w-72 z-50 hidden group-hover:block">
                                    <ul className="w-full rounded-md border bg-popover p-2 text-popover-foreground shadow-md">
                                        {cats.categories.map((cat: any, index: number) => (
                                            <li key={index}>
                                                <Link href={route('site.categories.show', { CategoryParentIdentifier: cat.slug })}
                                                    className="w-full flex justify-between rounded-sm px-2 py-1.5 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                                                >
                                                    <div className='flex items-center'>
                                                        <div className='p-1 rounded-full' style={{ backgroundColor: cat.color }}>
                                                            <img src={cat.icon} alt={cat.name} className="w-6 h-6 rounded-full" />
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
                                <Link href={route('site.events.index')} className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                                    Eventos
                                </Link>
                            </div>
                            <div>
                                <Link href={route('site.tours.index')} className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
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

                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:bg-accent focus:text-foreground transition duration-150 ease-in-out"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
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

            <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                <div className="pt-2 pb-3 space-y-1">
                    <MobileNav />
                </div>
            </div>
        </nav>
    );
}
