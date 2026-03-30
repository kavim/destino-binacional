import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export default function TourList() {
    const { tours } = usePage().props as unknown as {
        tours: Array<{ slug: string; title: string; image: string; start: string; end: string }>;
    };
    dayjs.locale("es");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-3 md:gap-8 p-5 md:max-w-4xl mx-auto lg:max-w-6xl">
            {tours.map(({ slug, title, image, start, end }, index) => {
                return (
                    <Link key={index} href={route('site.tours.show', slug)}>
                        <div key={index} className="rounded-lg border bg-card text-card-foreground shadow-sm w-full mb-4 cursor-pointer">
                            <figure><img src={image} /></figure>
                            <div className="flex flex-col space-y-1.5 p-6">
                                {start && end && (
                                    <div className="flex items-center gap-2 pt-2">
                                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"><i className="fa-solid fa-calendar-days mr-2 shadow-sm"></i>{dayjs(start).format('DD/MM')}</div>
                                    </div>
                                )}
                                <h2 className="text-2xl font-semibold leading-none tracking-tight">
                                    {title}
                                </h2>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
