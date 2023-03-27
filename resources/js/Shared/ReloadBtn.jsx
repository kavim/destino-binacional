import React, { useState, useEffect, Children } from 'react';
import classNames from 'classnames';
import { useForm } from '@inertiajs/inertia-react';

export default function ProductLinkGenerator({ href, btnStyle, children, title = '' }) {
    const { data, setData, get, processing, errors, reset } = useForm();
    const submit = () => {
        get(href);
        return;
    };

    const className = btnStyle ? btnStyle : 'btn-round-light ml-2 [&>.child]:hover:rotate-180';

    return (
        <div>
            <button
                title={title}
                onClick={submit}
                className={classNames(className, {
                    'opacity-25': processing,
                })}
                disabled={processing}
            >
                <i
                    className={classNames('fa-solid fa-rotate-right transition duration-400 ease-in-out', {
                        'animate-spin': processing,
                        child: !processing,
                    })}
                ></i>
                {children}
            </button>
        </div>
    );
}
