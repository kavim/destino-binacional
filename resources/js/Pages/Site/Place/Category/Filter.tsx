import SelectInput from '@/Shared/SelectInput';
import React from 'react';
export default function CategoryHeader({ category: _category }: { category?: unknown }) {

    return (
        <div className="w-full">

            <div>
                <SelectInput label="" className="w-full" name="category" value="" onChange={() => {}}>
                    <option value="">Select</option>
                </SelectInput>
            </div>

        </div >
    );
}
