import type { DocumentSchema } from '@/types/editorSchema';
import { sanitizeDocumentSchema } from './editorSchemaService';

export function exportSchemaToJson(schema: DocumentSchema): string {
  return JSON.stringify(schema, null, 2);
}

export function importSchemaFromJson(raw: string): DocumentSchema {
  const parsed = JSON.parse(raw);
  return sanitizeDocumentSchema(parsed);
}
