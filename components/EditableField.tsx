
import React, { useState, useEffect, useRef } from 'react';

interface EditableFieldProps {
  initialValue: string | number;
  onSave: (value: string) => void;
  className?: string;
  as?: 'input' | 'textarea' | 'number';
}

export const EditableField: React.FC<EditableFieldProps> = ({ initialValue, onSave, className, as = 'input' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(String(initialValue));
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (as !== 'textarea') {
         (inputRef.current as HTMLInputElement).select();
      }
    }
  }, [isEditing, as]);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && as !== 'textarea') {
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(String(initialValue));
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const commonProps = {
      ref: inputRef as any,
      value: value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(e.target.value),
      onBlur: handleSave,
      onKeyDown: handleKeyDown,
      className: `w-full p-1 border border-blue-500 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 ${className}`,
    };
    
    if (as === 'textarea') {
      return <textarea {...commonProps} rows={3} />;
    }
    
    return <input type={as === 'number' ? 'number' : 'text'} {...commonProps} />;
  }

  return (
    <div onClick={() => setIsEditing(true)} className={`cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded ${className}`}>
      {initialValue || (as === 'number' ? '0' : 'Click para editar')}
    </div>
  );
};
