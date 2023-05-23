import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index() {
    const { parent_categories, grouped_categories } = usePage().props;
    return (
        <AuthenticatedLayout header={
            <div className="flex justify-between mt-2" >
                <div className="">
                    <i className="fa-solid fa-list fa-fw mr-2"></i>
                    <span className="">Categorias</span>
                </div>
                <div className='px-2'>
                    <Link href={route('categories.create')} className="btn-success">
                        Crear nueva
                    </Link>
                </div>
            </div>
        }>
            <Head title="Categorias" />
            <div className='py-12'>
                <div className="max-w-7xl mx-auto sm:px-2">
                    <div className="overflow-x-auto bg-white rounded-xl shadow mb-3 p-4">
                        {parent_categories.length > 0 ? (
                            parent_categories.map((pc, index) =>
                                <div key={index} className='bg-white p-3 rounded-lg mb-3 border shadow-sm'>
                                    <div>
                                        <div className='mb-4'>
                                            <div className='flex justify-between items-center'>
                                                <div className='flex justify-start items-center mt-2'>
                                                    <div className='p-2 rounded-full' style={{ backgroundColor: pc.color }}>
                                                        <img src={pc.icon} alt={pc.name} className="w-10 h-10 rounded-full" />
                                                    </div>
                                                    <span className='font-semibold ml-3 text-2xl' >{pc.name}</span>
                                                </div>
                                                <div>
                                                    <Link href={route('categories.edit', pc.id)} className="btn btn-circle btn-outline btn-sm"> <i className="fa-solid fa-pencil"></i> </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {grouped_categories[pc.id] && grouped_categories[pc.id].length > 0 && (
                                                grouped_categories[pc.id].map((item, index) => {
                                                    return (
                                                        <div key={index} className='px-2 py-1 border rounded-lg mb-2'>
                                                            <div className='flex justify-between items-center'>
                                                                <div>
                                                                    {item.name}
                                                                </div>
                                                                <div>
                                                                    <Link href={route('categories.edit', item.id)} className="btn btn-circle btn-outline btn-sm border-stone-200 text-stone-600"> <i className="fa-solid fa-pencil"></i> </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>

                                        <div>
                                            <Link href={route('categories.create', { 'parent_id': pc.id })} className="btn btn-outline btn-sm mt-2">
                                                <i className="fa-solid fa-plus fa-fw mr-2"></i>
                                                <span className="">Agregar subcategoria</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div>
                                <div className="flex justify-center items-center">
                                    <div className="flex flex-col items-center">
                                        <div className="text-4xl font-bold text-gray-400 dark:text-gray-600">
                                            <span>There is no category</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
