import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import SearchFilter from './Partials/SearchFilter';
import Pagination from '@/Shared/Pagination';

export default function Index() {

    const { events } = usePage().props;
    const { data, links } = events;

    return (
        <AuthenticatedLayout header={
            <div className="flex justify-between mt-2" >
                <div className="">
                    <i className="fa-solid fa-location-dot fa-fw"></i>
                    <span className="">Event</span>
                </div>
                <div className='px-2'>
                    <Link href={route('events.create')} className="btn-success">
                        nuevo
                    </Link>
                </div>
            </div>
        }>
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
                                            <td className="border-t">
                                                <div className='flex flex-col justify-middle align-center'>
                                                    <img src={image} alt="logo" className="w-32 mx-auto rounded" />
                                                </div>
                                            </td>
                                            <td className="border-t">
                                                <Link
                                                    href={route('events.edit', id)}
                                                    className="flex items-center px-4 py-2 focus:text-primary focus:outline-none"
                                                >
                                                    {title}
                                                </Link>
                                            </td>
                                            <td className="border-t">
                                                <Link
                                                    href={route('events.edit', id)}
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
                                            ☹️ No events found.
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
