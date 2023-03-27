import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/inertia-react';
import classNames from 'classnames';

const IconSuccess = () => (
    <svg
        className="ml-4 mr-2 flex-shrink-0 w-4 h-4 text-white fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
    >
        <polygon points="0 11 2 9 7 14 18 3 20 5 7 18" />
    </svg>
);

const IconDanger = () => (
    <svg
        className="ml-4 mr-2 flex-shrink-0 w-4 h-4 text-white fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
    >
        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z" />
    </svg>
);

const ButtonClose = ({ color, onClick }) => {
    const className = classNames('block  w-2 h-2 fill-current', {
        'text-red-700 group-hover:text-red-800': color === 'red',
        'text-green-700 group-hover:text-green-800': color === 'green',
    });
    return (
        <button onClick={onClick} type="button" className="focus:outline-none group mr-2 p-2">
            <svg
                className={className}
                xmlns="http://www.w3.org/2000/svg"
                width="235.908"
                height="235.908"
                viewBox="278.046 126.846 235.908 235.908"
            >
                <path d="M506.784 134.017c-9.56-9.56-25.06-9.56-34.62 0L396 210.18l-76.164-76.164c-9.56-9.56-25.06-9.56-34.62 0-9.56 9.56-9.56 25.06 0 34.62L361.38 244.8l-76.164 76.165c-9.56 9.56-9.56 25.06 0 34.62 9.56 9.56 25.06 9.56 34.62 0L396 279.42l76.164 76.165c9.56 9.56 25.06 9.56 34.62 0 9.56-9.56 9.56-25.06 0-34.62L430.62 244.8l76.164-76.163c9.56-9.56 9.56-25.06 0-34.62z" />
            </svg>

            <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </symbol>
                <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                </symbol>
                <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </symbol>
            </svg>
        </button>
    );
};

export default () => {
    const [visible, setVisible] = useState(true);
    const { flash, errors } = usePage().props;
    const numOfErrors = Object.keys(errors).length;

    useEffect(() => {
        setVisible(true);
    }, [flash, errors]);

    return (
        <div>
            {flash.success && visible && (
                <div className="mb-8 flex items-center justify-between bg-green-500 rounded max-w-3xl">
                    <div className="flex items-center">
                        <IconSuccess />
                        <div className="py-4 text-white text-sm font-medium">{flash.success}</div>
                    </div>
                    <ButtonClose onClick={() => setVisible(false)} color="green" />
                </div>
            )}
            {(flash.error || numOfErrors > 0) && visible && (
                <div className="mb-8 flex items-center justify-between bg-red-500 rounded max-w-3xl">
                    <div className="flex items-center">
                        <IconDanger />
                        <div className="py-4 text-white text-sm font-medium">
                            {flash.error && flash.error}
                            {numOfErrors === 1 && 'There is one form error'}
                            {numOfErrors > 1 && `There are ${numOfErrors} form errors.`}
                        </div>
                    </div>
                    <ButtonClose onClick={() => setVisible(false)} color="red" />
                </div>
            )}
        </div>
    );
};
