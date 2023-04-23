import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Pagination from '@/Shared/Pagination';

export default function Index() {

    const { places } = usePage().props;
    const { data, links } = places;

    return (
        <AuthenticatedLayout header={
            <div className="flex justify-between mt-2" >
                <div className="">
                    <i className="fa-solid fa-location-dot fa-fw"></i>
                    <span className="">Places</span>
                </div>
                <div className='px-2'>
                    <Link href={route('places.create')} className="btn-success">
                        Create new
                    </Link>
                </div>
            </div>
        }>
            <div className='py-12'>
                <div className="max-w-7xl mx-auto sm:px-2">
                    <div className="overflow-x-auto bg-white rounded-xl shadow mb-3">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th className='bg-white'>Image</th>
                                    <th className='bg-white'>name</th>
                                    <th className='bg-white'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(({ id, image, name }) => {
                                    return (
                                        <tr key={id}>
                                            <td>
                                                <img src={image} alt="logo" className="w-32 mx-auto rounde" />
                                            </td>
                                            <td>
                                                <Link
                                                    href={route('places.edit', id)}
                                                    className="flex items-center px-4 py-2 focus:text-primary focus:outline-none"
                                                >
                                                    {name}
                                                </Link>
                                            </td>
                                            <td>
                                                <Link
                                                    href={route('places.edit', id)}
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
                                            ☹️ No Places found.
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
