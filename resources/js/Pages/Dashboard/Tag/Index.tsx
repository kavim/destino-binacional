import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index() {

    const { parent_tags, grouped_tags } = usePage().props as unknown as {
        parent_tags: Array<{ id: number; name: string }>;
        grouped_tags: Record<number, Array<{ name: string }>>;
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex justify-between mt-2" >
                <div className="">
                    <i className="fa-solid fa-tags mr-2"></i>
                    <span className="">Tags</span>
                </div>
                <div className='px-2'>
                    <div className="inline-flex items-center justify-center rounded-md bg-success px-6 py-3 text-sm font-medium text-success-foreground shadow hover:bg-success/90 transition-colors">
                        Crear nuevo
                    </div>
                </div>
            </div>
        }>
            <Head title="Tags" />
            <div className='py-12'>
                <div className="max-w-7xl mx-auto sm:px-2">
                    <div className="overflow-x-auto bg-card rounded-xl shadow mb-3">
                        {parent_tags.length > 0 ? (
                            <div className='p-5'>
                                {Object.keys(parent_tags).map((tag, index) => {
                                    return (
                                        <div key={index} className='bg-muted p-3 rounded-lg mb-3 border shadow-sm'>
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
                                        <div className="text-4xl font-bold text-muted-foreground">
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
