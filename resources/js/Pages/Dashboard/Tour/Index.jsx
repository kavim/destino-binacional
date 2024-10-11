import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Shared/Pagination';
import SearchFilter from './Partials/SearchFilter';

export default function Index() {

    const { tours } = usePage().props;
    const { data, links } = tours;

    return (
        <AuthenticatedLayout header={
            <div className="flex justify-between mt-2" >
                <div>
                    <div className="flex">
                        <img src="/images/icons/tours_dark.svg" alt="" className='w-6' />
                        <span className="ml-2">Tours</span>
                    </div>
                </div>
                <div className='px-2'>
                    <Link href={route('tours.create')} className="btn-success">
                        Crear nuevo
                    </Link>
                </div>
            </div>
        }>
            <Head title="Locales" />
            <div className='py-12'>
                <div className="max-w-7xl mx-auto sm:px-2">
                    <div className="overflow-x-auto bg-white rounded-xl shadow mb-3">
                        <div className='flex justify-end p-2'>
                            <SearchFilter></SearchFilter>
                        </div>
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th className='bg-white text-center'>Image</th>
                                    <th className='bg-white'>Titulo</th>
                                    <th className='bg-white'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(({ id, image, title }) => {
                                    return (
                                        <tr key={id}>
                                            <td>
                                                <img src={image} alt="logo" className="w-32 mx-auto rounded-lg" />
                                            </td>
                                            <td>
                                                <Link
                                                    href={route('tours.edit', id)}
                                                    className="flex items-center px-4 py-2 focus:text-primary focus:outline-none"
                                                >
                                                    {title}
                                                </Link>
                                            </td>
                                            <td>
                                                <Link
                                                    href={route('tours.edit', id)}
                                                    className="flex items-center px-4 py-2 focus:text-primary focus:outline-none"
                                                >
                                                    <i className="fa-solid fa-chevron-right"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {data.length === 0 && (
                                    <tr>
                                        <td className="px-6 py-4 border-t text-center" colSpan="3">
                                            ☹️ No tours found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Pagination links={links} />
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
