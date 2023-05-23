import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import Form from './Partials/Form';

export default function Create() {
    const { auth, parent } = usePage().props;

    const generateRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const { data, setData, errors, post, processing } = useForm({
        name_es: '',
        name_pt: '',
        icon: '',
        icon_image: '',
        featured_image: '',
        image: '',
        color: generateRandomColor(),
        parent_id: parent ? parent.id : null,
    });

    const handleOnChange = event => {
        console.log(event.target.name, event.target.value)
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const onCorte = (image) => {
        setData('image', image);
        setData('image', null);
    }

    const submit = e => {
        e.preventDefault();
        post(route('categories.store'));
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Crear {data.parent_id ? 'SubCategoria' : 'Categoria'}</h2>}
        >
            <Head title="Crear Categoria" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        {parent ? (
                            <div>
                                <div>
                                    <small>Agregando SubCategoria en:</small>
                                </div>
                                <div className='flex justify-start items-center mt-2'>
                                    <div className='p-2 rounded-full' style={{ backgroundColor: parent.color }}>
                                        <img src={parent.icon} alt={parent.name} className="w-10 h-10 rounded-full" />
                                    </div>
                                    <span className='font-semibold ml-3 text-lg' >{parent.name}</span>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className='font-bold text-lg'>Agregando una categoria principal</h2>
                            </div>
                        )}
                        <Form handleOnChange={handleOnChange} submit={submit} data={data} errors={errors} onCorte={onCorte} processing={processing} parent={parent}></Form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
