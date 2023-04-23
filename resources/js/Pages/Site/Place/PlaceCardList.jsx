import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ places }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-5">
            {places.map((place, i) => (
                <Link href={route('places.byPlaceIdentifier', place.slug)} key={i} className='cursor-pointer'>
                    <div className="card lg:card-side bg-base-100 shadow-xl mb-10 md:mb-4">
                        <figure><img src={place.image} alt="Album" className='md:w-56 md:h-48' /></figure>
                        <div className="card-body justify-between">
                            <h2 className="card-title">{place.name}</h2>
                            <div className="card-actions justify-end">
                                <button className="btn btn-outline btn-sm">Ver Mas</button>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            {places.length === 0 && (
                <div className='flex justify-center w-full text-center'>
                    <span>There is no places</span>
                </div>
            )}
        </div>
    );
}