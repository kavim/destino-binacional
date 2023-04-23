import { Link, usePage } from '@inertiajs/react';

export default function Categories() {
    const { categories } = usePage().props;

    console.log(categories);
    return (
        <div className='grid sm:grid-cols-2 sm:gap-2 md:grid-cols-2 gap-4 py-3 px-2'>
            {Object.keys(categories).map((key, i) => (
                <Link href={route('site.categories.show', categories[key].slug)} key={i} className='cursor-pointer'>
                    <div className="card bg-base-100 shadow-xl image-full">
                        <figure><img src={categories[key].image} alt={categories[key].name} /></figure>
                        <div className="card-body">
                            <div className='flex flex-col justify-center align-middle text-center'>
                                <img src={categories[key].icon} alt={categories[key].name} className='w-24 mx-auto' />
                                <h2 className='mt-3 font-semibold text-4xl'>
                                    {categories[key].name}
                                </h2>
                                <span className='mt-4'>
                                    <button
                                        type='button'
                                        className='btn btn-outline btn-dark text-white btn-xs'>
                                        Ver más <i className="fa-solid fa-chevron-right ml-2"></i>
                                    </button>
                                </span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
