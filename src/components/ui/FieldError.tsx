export interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return <span className="text-xs text-[var(--color-danger)]">{message}</span>;
}
