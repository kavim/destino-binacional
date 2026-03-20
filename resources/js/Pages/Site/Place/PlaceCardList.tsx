import { Link } from '@inertiajs/react';

export default function Index({ places }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-5">
            {places.map((place, i) => (
                <Link href={route('places.byPlaceIdentifier', place.slug)} key={i} className='cursor-pointer'>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm lg:flex lg:flex-row mb-10 md:mb-4">
                        <figure><img src={place.image} alt="Album" className='md:w-56 md:h-48' /></figure>
                        <div className="flex flex-col space-y-1.5 p-6 justify-between">
                            <h2 className="text-2xl font-semibold leading-none tracking-tight">{place.name}</h2>
                            <div className="flex items-center justify-end pt-2">
                                <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 h-9 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">Ver Mas</button>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            {places.length === 0 && (
                <div className='flex justify-center w-full text-center'>
                    <span>{trans('places.no_places')}</span>
                </div>
            )}
        </div>
    );
}