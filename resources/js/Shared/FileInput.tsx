import React, { useState, useRef } from 'react';
import { filesize } from './utils';

const Button = ({ text, onClick }: { text: string; onClick: () => void }) => (
  <button
    type="button"
    className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background dark:shadow-black/20"
    onClick={onClick}
  >
    {text}
  </button>
);

type FileInputProps = {
    className?: string;
    name: string;
    label?: string;
    accept?: string;
    errors?: string[];
    onChange: (file: File | null) => void;
};

export default function FileInput({ className, name, label, accept, errors = [], onChange }: FileInputProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  function browse() {
    fileInput.current?.click();
  }

  function remove() {
    setFile(null);
    onChange(null);
    if (fileInput.current) {
      fileInput.current.value = '';
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    onChange(selectedFile);
  }

  return (
    <div className={className}>
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}:
        </label>
      )}
      <div className={`form-input p-0 ${errors.length && 'error'}`}>
        <input
          id={name}
          ref={fileInput}
          accept={accept}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        {!file && (
          <div className="p-2">
            <Button text="Browse" onClick={browse} />
          </div>
        )}
        {file && (
          <div className="flex items-center justify-between p-2">
            <div className="flex-1 pr-1">
              {file.name}
              <span className="ml-1 text-xs text-muted-foreground">
                ({filesize(file.size)})
              </span>
            </div>
            <Button text="Remove" onClick={remove} />
          </div>
        )}
      </div>
      {errors.length > 0 && <div className="form-error">{errors}</div>}
    </div>
  );
};
