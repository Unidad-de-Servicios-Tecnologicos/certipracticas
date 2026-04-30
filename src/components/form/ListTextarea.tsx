import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Textarea } from '@/components/ui/Textarea';

interface ListTextareaProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  rightSlot?: ReactNode;
}

export function ListTextarea({ items, onChange, placeholder, label, error, rightSlot }: ListTextareaProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    const currentItems = text.split(/[\n\r]+|\s+-\s+/).map(s => s.replace(/^-?\s*/, '').trim()).filter(Boolean);
    const arraysEqual = currentItems.length === items.length && currentItems.every((v, i) => v === items[i]);
    
    if (!arraysEqual) {
      if (items.length === 1 && items[0] === '') {
        setText('');
      } else {
        setText(items.map(i => `- ${i}`).join('\n'));
      }
    }
  }, [items]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    const newItems = val.split(/[\n\r]+|\s+-\s+/).map(s => s.replace(/^-?\s*/, '').trim()).filter(Boolean);
    onChange(newItems.length > 0 ? newItems : ['']);
  };

  return (
    <Textarea
      label={label}
      value={text}
      onChange={handleChange}
      placeholder={placeholder}
      error={error}
      rows={5}
      rightSlot={rightSlot}
    />
  );
}
