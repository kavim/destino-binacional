import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { trans } from '@/utils';
import { Link } from '@inertiajs/react';

export default function Dashboard(props) {
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-foreground leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg p-5 text-center">
                        <div>
                            <h1 className="text-2xl">
                                👋 {trans('dashboard.welcome')}, {props.auth.user.name}!
                            </h1>
                            <h3>
                                {trans('dashboard.you_are_logged_in')}
                            </h3>
                        </div>

                        <div className="flex justify-center mt-5">
                            <Link href={route('places.index')} active={
                                    route().current('places.index') || route().current('places.edit')
                                }>
                                    <div className="flex flex-col align-middle justify-center border border-stone-700 rounded-lg p-2 my-2 mx-4 hover:border-muted-foreground">
                                        <div>
                                            <img src="/images/icons/locale.svg" alt="" className='w-16 md:w-24' />
                                        </div>
                                        <p>Locales</p>
                                    </div>
                            </Link>
                            <Link href={route('events.index')} active={
                                    route().current('events.index') || route().current('events.edit')
                                }>
                                    <div className="flex flex-col align-middle justify-center border border-stone-700 rounded-lg p-2 my-2 mx-4 hover:border-muted-foreground">
                                        <div>
                                            <img src="/images/icons/eventos_dark.svg" alt="" className='w-16 md:w-24' />
                                        </div>
                                        <p>Eventos</p>
                                    </div>
                            </Link>
                            <Link href={route('tours.index')} active={
                                    route().current('tours.index') || route().current('tours.edit')
                                }>
                                    <div className="flex flex-col align-middle justify-center border border-stone-700 rounded-lg p-2 my-2 mx-4 hover:border-muted-foreground">
                                        <div>
                                            <img src="/images/icons/tours_dark.svg" alt="" className='w-16 md:w-24' />
                                        </div>
                                        <p>Tours</p>
                                    </div>
                            </Link>
                            <Link href={route('observability.index')} active={route().current('observability.index')}>
                                    <div className="flex flex-col align-middle justify-center border border-stone-700 rounded-lg p-2 my-2 mx-4 hover:border-muted-foreground">
                                        <div>
                                            <span className="text-3xl">📊</span>
                                        </div>
                                        <p>Insights</p>
                                    </div>
                            </Link>
                            <Link href={route('tracker.index')} active={route().current('tracker.index')}>
                                    <div className="flex flex-col align-middle justify-center border border-stone-700 rounded-lg p-2 my-2 mx-4 hover:border-muted-foreground">
                                        <div>
                                            <span className="text-3xl">📈</span>
                                        </div>
                                        <p>Tracker</p>
                                    </div>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
