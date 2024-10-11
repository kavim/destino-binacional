import { Link, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';

export default function TourList() {
    const { tours } = usePage().props;
    dayjs.locale("es");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-3 md:gap-8 p-5 md:max-w-4xl mx-auto lg:max-w-6xl">
            {tours.map(({ slug, title, image, start, end }, index) => {
                return (
                    <Link key={index} href={route('site.tours.show', slug)}>
                        <div key={index} className="card w-full bg-base-100 shadow-xl mb-4 cursor-pointer">
                            <figure><img src={image} /></figure>
                            <div className="card-body">
                                {start && end && (
                                    <div className="card-actions justify-start">
                                        <div className="badge badge-outline"><i className="fa-solid fa-calendar-days mr-2 shadow-sm"></i>{dayjs(start).format('DD/MM')}</div>
                                    </div>
                                )}
                                <h2 className="card-title">
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
