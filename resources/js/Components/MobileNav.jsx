import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import Flags from '@/Components/Flags';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

export default function MobileNav() {
    const { cats } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className='overflow-x-hidden'>
            <ResponsiveNavLink href={route('site.events.index')}>
                <label tabIndex={0} className="btn btn-ghost rounded-btn">
                    <div className='p-1 rounded-full bg-indigo-400'>
                        <img src='/images/icons/eventos.svg' alt='e' className="w-6 h-6 rounded-full" />
                    </div>
                    <span className='ml-2 font-semibold text-lg'>Eventos</span>
                </label>
            </ResponsiveNavLink>

            {cats.categories.map((cat, index) => (
                <ResponsiveNavLink key={index} href={route('site.categories.show', { CategoryParentIdentifier: cat.slug })}>
                    <div key={index} className='flex items-center'>
                        <label tabIndex={0} className="btn btn-ghost rounded-btn">
                            <div className='p-1 rounded-full' style={{ backgroundColor: cat.color }}>
                                <img src={cat.icon} alt={cat.name} className="w-6 h-6 rounded-full" />
                            </div>
                            <span className='ml-2 font-semibold text-lg'>{cat.name}</span>
                        </label>
                    </div>
                </ResponsiveNavLink>
            ))}

            <div className='flex justify-center p-3'>
                <Flags></Flags>
            </div>
        </div>
    );
}