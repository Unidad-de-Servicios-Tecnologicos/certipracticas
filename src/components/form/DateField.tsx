import { Input, type InputProps } from '@/components/ui/Input';

export interface DateFieldProps extends Omit<InputProps, 'onChange' | 'type' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

export function DateField({ value, onChange, ...rest }: DateFieldProps) {
  return (
    <Input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}
