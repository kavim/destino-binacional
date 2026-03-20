import { usePage } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';

export default function MultipleCheckbox({ tagId, handleCheck }) {

    const { grouped_tags, tag_ids = [] } = usePage().props;

    return (
        <>
            {grouped_tags[tagId].map((item, index) => {
                return (
                    <div key={index}>
                        <Checkbox onChange={handleCheck} label={item.name} value={item.id} isChecked={tag_ids.some((e) => e === item.id)} />
                    </div>
                );
            })}
        </>
    );
}
