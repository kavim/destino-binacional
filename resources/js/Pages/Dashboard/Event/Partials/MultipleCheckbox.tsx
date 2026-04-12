import { usePage } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';

type MultipleCheckboxProps = {
    tagId: number;
    handleCheck: (e: {
        target: { value?: string | number; checked: boolean };
    }) => void;
};

export default function MultipleCheckbox({ tagId, handleCheck }: MultipleCheckboxProps) {

    const { grouped_tags, tag_ids = [] } = usePage().props as unknown as {
        grouped_tags: Record<number, Array<{ id: number; name: string }>>;
        tag_ids?: number[];
    };

    return (
        <>
            {(grouped_tags[tagId] ?? []).map((item, index) => {
                return (
                    <div key={index}>
                        <Checkbox onChange={handleCheck} label={item.name} value={item.id} isChecked={tag_ids.some((e) => e === item.id)} />
                    </div>
                );
            })}
        </>
    );
}
