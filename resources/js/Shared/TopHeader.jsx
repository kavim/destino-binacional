import React, { useState } from 'react';
import MainMenu from '@/Shared/MainMenu';
import { Link } from '@inertiajs/inertia-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default () => {
    const [menuOpened, setMenuOpened] = useState(false);
    return (
        <div className="hidden md:flex items-center justify-between p-0 m-0 bg-stone-800 md:flex-shrink-0 md:w-56 md:justify-center">
            <Link href={route('dashboard')} className="p-0 border-none m-0">
                <ApplicationLogo className="w-24 mx-auto my-0 p-0 " />
            </Link>
        </div>
    );
};
