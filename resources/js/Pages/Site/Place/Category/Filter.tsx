import SelectInput from '@/Shared/SelectInput';
import React from 'react';
export default function CategoryHeader({ category }) {

    return (
        <div className="w-full">

            <div>
                <SelectInput
                    placeholder="Select"
                    name="category"
                />
            </div>

        </div >
    );
}
