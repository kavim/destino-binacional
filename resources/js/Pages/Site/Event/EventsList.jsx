import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { es } from 'dayjs/locale/es';

export default function EventList() {
    const { events } = usePage().props;
    dayjs.locale("es");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-5">
            {events.map(({ slug, title, image, start, end }, index) => {
                return (
                    <Link key={index} href={route('site.events.show', slug)}>
                        <div key={index} className="card w-full bg-base-100 shadow-xl mb-4 cursor-pointer">
                            <figure><img src={image} alt="Shoes" /></figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    {title}
                                </h2>
                                <div className="card-actions justify-start">
                                    <div className="badge badge-outline">{dayjs(start).format('DD/MM')}</div>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}