import { Input, type InputProps } from '@/components/ui/Input';


export interface TextFieldProps extends Omit<InputProps, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
}

export function TextField({ value, onChange, ...rest }: TextFieldProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}
