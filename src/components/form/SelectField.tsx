import { Select, type SelectProps } from '@/components/ui/Select';

export interface SelectFieldProps extends Omit<SelectProps, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

export function SelectField({ value, onChange, ...rest }: SelectFieldProps) {
  return <Select value={value} onChange={(e) => onChange(e.target.value)} {...rest} />;
}
