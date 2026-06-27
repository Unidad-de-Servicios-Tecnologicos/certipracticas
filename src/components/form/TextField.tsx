import { Input, type InputProps } from '@/components/ui/Input';
import { MicButton } from './MicButton';

export interface TextFieldProps extends Omit<InputProps, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  voice?: boolean;
}

export function TextField({ value, onChange, voice, rightSlot, ...rest }: TextFieldProps) {
  const micSlot = voice ? (
    <MicButton value={value} onChange={onChange} disabled={rest.disabled} />
  ) : null;

  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rightSlot={rightSlot ?? micSlot}
      {...rest}
    />
  );
}
