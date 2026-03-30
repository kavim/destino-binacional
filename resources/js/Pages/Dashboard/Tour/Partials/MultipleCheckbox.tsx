import { usePage } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';

export default function MultipleCheckbox({ catId, handleCheck }) {

    const { grouped_categories, category_ids } = usePage().props as unknown as {
        grouped_categories: Record<number, Array<{ id: number; name: string }>>;
        category_ids: number[];
    };

    return (
        <>
            {grouped_categories[catId].map((item, index) => {
                return (
                    <div key={index}>
                        <Checkbox onChange={handleCheck} label={item.name} value={item.id} isChecked={category_ids.some((e) => e === item.id)} />
                    </div>
                );
            })}
        </>
    );
}
