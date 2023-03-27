import React from 'react';
import classNames from 'classnames';

const Status = ({ status }) => {
    const className = classNames(
        [
            'text-xs text-center whitespace-nowrap align-baseline font-bold',
            'inline-block leading-none',
            'py-1 px-2.5',
            'text-sm',
            'text-white',
            'rounded-full',
            'hover:bg-stone-800',
            'focus:outline-none focus:border-primary focus:text-primary bg-stone-900',
            'flex',
            'items-center',
        ],
        {
            'bg-green-500': status === 'complete',
            'bg-green-600': status === 'paid',
            'bg-red-500': status === 'fail',
            'bg-yellow-500': status === 'pending',
            'bg-blue-400': status === 'processing',
            'bg-indigo-600': status === 'retrying',
            'bg-stone-400': !status,
        },
    );

    return (
        <div className={className}>
            <div>{status ?? 'none'}</div>
            <div>
                {status && status === 'pending' && (
                    <div className="ml-2">
                        <span className="animate-ping flex w-2 h-2 rounded-full bg-white opacity-75"></span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Status;
