import React from 'react';

export type SelectInputProps = {
  label?: React.ReactNode;
  name: string;
  className?: string;
  children: React.ReactNode;
  errors?: unknown[];
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'name'>;

export default function SelectInput({
  label = '',
  name,
  className = '',
  children,
  errors = [],
  ...props
}: SelectInputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}:
        </label>
      )}
      <select
        id={name}
        name={name}
        {...props}
        className={`form-select m-0 mt-1 block w-full appearance-none rounded-md border border-solid border-input bg-background bg-clip-padding bg-no-repeat px-3 py-1.5 text-base font-normal text-foreground transition ease-in-out focus:border-primary focus:bg-background focus:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:ring-offset-2 focus:ring-offset-background dark:border-input ${errors.length ? 'error' : ''}`}
      >
        {children}
      </select>
      {errors && errors.length > 0 && (
        <div className="form-error">{errors as React.ReactNode}</div>
      )}
    </div>
  );
}
