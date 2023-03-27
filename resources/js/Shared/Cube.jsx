import React, { useEffect, useState } from 'react';

export default ({ delay = 0 }) => {
    const [initializeAnimation, setInitializeAnimation] = useState(false);

    const animate = () => {
        setTimeout(() => {
            setInitializeAnimation(true);
        }, delay);
    };

    useEffect(() => {
        if (!initializeAnimation) {
            animate();
        }
    }, []);

    return (
        <svg
            className={!initializeAnimation ? 'text-stone-600' : 'animate-cube text-stone-500'}
            width="50"
            height="100"
            viewBox="0 0 46 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="m23.102 1 22.1 12.704v25.404M23.101 1l-22.1 12.704v25.404"
                stroke="currentColor"
                strokeWidth="1.435"
                strokeLinejoin="bevel"
            ></path>
            <path
                d="m45.202 39.105-22.1 12.702L1 39.105"
                stroke="currentColor"
                strokeWidth="1.435"
                strokeLinejoin="bevel"
            ></path>
            <path
                transform="matrix(.86698 .49834 .00003 1 1 13.699)"
                stroke="currentColor"
                strokeWidth="1.435"
                strokeLinejoin="bevel"
                d="M0 0h25.491v25.405H0z"
            ></path>
            <path
                transform="matrix(.86698 -.49834 -.00003 1 23.102 26.402)"
                stroke="currentColor"
                strokeWidth="1.435"
                strokeLinejoin="bevel"
                d="M0 0h25.491v25.405H0z"
            ></path>
            <path
                transform="matrix(.86701 -.49829 .86701 .49829 1 13.702)"
                stroke="currentColor"
                strokeWidth="1.435"
                strokeLinejoin="bevel"
                d="M0 0h25.491v25.491H0z"
            ></path>
        </svg>
    );
};
