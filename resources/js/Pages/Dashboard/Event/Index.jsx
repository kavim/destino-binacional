import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

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
                <div className="overflow-x-auto bg-white rounded shadow p-4 mb-3">
                    <table className="list-table">
                        <thead>
                            <tr>
                                <th className="px-6 pt-5 pb-4">Image</th>
                                <th className="px-6 pt-5 pb-4">Title</th>
                                <th className="px-6 pt-5 pb-4"></th>
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
        </AuthenticatedLayout >
    );
}
