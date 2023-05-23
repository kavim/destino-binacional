import { router } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import Form from './Partials/Form';

export default function Create() {
    const { auth, category, parent } = usePage().props;

    const { data, setData, errors, put, processing } = useForm({
        name_es: category.name_es ? category.name_es : '',
        name_pt: category.name_pt ? category.name_pt : '',
        featured_image: category.featured_image ? category.featured_image : '',
        image: '',
        icon: category.icon ? category.icon : '',
        icon_image: '',
        color: category.color ? category.color : '#1c1c1c',
        parent_id: parent ? parent.id : '',
    });

    console.log(category);

    const handleOnChange = event => {
        console.log(event.target.name, event.target.value)
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const onIconChange = e => {
        let img = e.target.files[0];
        setData('icon_image', img);
    }

    const submit = e => {
        e.preventDefault();
        // put(route('categories.update', category.id));
        router.post(`/categories/${category.id}`, {
            forceFormData: true,
            _method: 'put',
            name_es: data.name_es,
            name_pt: data.name_pt,
            featured_image: data.featured_image,
            image: data.image,
            icon: data.icon,
            icon_image: data.icon_image,
            color: data.color,
            parent_id: data.parent_id,
        })
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
                        <Form handleOnChange={handleOnChange} submit={submit} data={data} errors={errors} processing={processing} parent={parent} onIconChange={onIconChange}></Form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
