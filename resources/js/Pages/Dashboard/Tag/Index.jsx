import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index() {

    const { parent_tags, grouped_tags } = usePage().props;

    return (
        <AuthenticatedLayout header={
            <div className="flex justify-between mt-2" >
                <div className="">
                    <i className="fa-solid fa-location-dot fa-fw"></i>
                    <span className="">Tags</span>
                </div>
                <div className='px-2'>
                    <div className="btn-success">
                        Crear nuevo
                    </div>
                </div>
            </div>
        }>
            <Head title="Tags" />
            <div className='py-12'>
                <div className="max-w-7xl mx-auto sm:px-2">
                    <div className="overflow-x-auto bg-white rounded-xl shadow mb-3">
                        {parent_tags.length > 0 ? (
                            <div className='p-5'>
                                {Object.keys(parent_tags).map((tag, index) => {
                                    return (
                                        <div key={index} className='bg-gray-100 p-3 rounded-lg mb-3 border shadow-sm'>
                                            <div>
                                                <div className='mb-4'>
                                                    <span className='text-md font-bold'>{parent_tags[index]['name']}</span>
                                                </div>
                                                <div>
                                                    {grouped_tags[parent_tags[index]['id']].map((item, index) => {
                                                        return (
                                                            <div key={index} className='px-2 py-1 border rounded-lg mb-2'>
                                                                {item.name}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div>
                                <div className="flex justify-center items-center">
                                    <div className="flex flex-col items-center">
                                        <div className="text-4xl font-bold text-gray-400 dark:text-gray-600">
                                            <i className="fa-solid fa-location-dot fa-fw"></i>
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
