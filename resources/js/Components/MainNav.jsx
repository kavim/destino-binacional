import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import Categories from '@/Pages/Site/Home/Categories';

export default function MainNav() {
    const { cats, auth } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    console.log(cats);

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="shrink-0 flex items-center">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                            </Link>
                        </div>

                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex sm:align-middle items-center">
                            <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost rounded-btn">
                                    Destinos
                                    <i className="fa-solid fa-chevron-down ml-2"></i>
                                </label>
                                <ul tabIndex={0} className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-72 mt-4">
                                    {cats.categories.map((cat, index) => (
                                        <li key={index}>
                                            <Link href={route('site.categories.show', { CategoryParentIdentifier: cat.slug })}
                                                className="w-full flex justify-between text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100"
                                            >
                                                <div className='flex items-center'>
                                                    <div className='p-1 rounded-full' style={{ backgroundColor: cat.color }}>
                                                        <img src={cat.icon} alt={cat.name} className="w-6 h-6 rounded-full" />
                                                    </div>
                                                    <span className='ml-2 font-semibold text-lg'>{cat.name}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    )
                                    )}
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
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
                    {/* <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                        Places
                    </ResponsiveNavLink> */}
                    <div tabIndex={0} className="collapse collapse-arrow  border border-base-300 bg-base-100 rounded-box">
                        <div className="collapse-title text-xl font-medium">
                            Destinos
                        </div>
                        <div className="collapse-content">

                            {cats.categories.map((cat, index) => (
                                <div key={index} className='w-full p-3 flex justify-between'>
                                    <Link href={route('site.categories.show', { CategoryParentIdentifier: cat.slug })}
                                        className="w-full flex justify-between text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100"
                                    >
                                        <div className='flex items-center'>
                                            <div className='p-1 rounded-full' style={{ backgroundColor: cat.color }}>
                                                <img src={cat.icon} alt={cat.name} className="w-8 h-8 rounded-full" />
                                            </div>
                                            <span className='ml-2 font-semibold text-2xl'>{cat.name}</span>
                                        </div>

                                        <i className="fa-solid fa-chevron-right ml-2"></i>
                                    </Link>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}