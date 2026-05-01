import { describe, expect, it } from 'vitest';
import { createDefaultDocumentSchema, createLogoNode } from './editorSchemaService';
import { exportSchemaToJson, importSchemaFromJson } from './editorSchemaIO';

describe('editorSchemaIO', () => {
  it('exports and imports schema preserving logo nodes', () => {
    const schema = createDefaultDocumentSchema();
    schema.pages[0].elements.push(
      createLogoNode({ src: 'data:image/png;base64,abc', name: 'Logo A', section: 'header' })
    );

    const json = exportSchemaToJson(schema);
    const restored = importSchemaFromJson(json);
    const logos = restored.pages[0].elements.filter((node) => node.type === 'logo');

    expect(logos).toHaveLength(1);
    expect(logos[0]?.type === 'logo' ? logos[0].name : '').toBe('Logo A');
  });

  it('sanitizes malformed content during import', () => {
    const restored = importSchemaFromJson(
      JSON.stringify({
        version: 999,
        pages: [{ id: 'page-1', elements: [{ type: 'logo', opacity: 999, widthPx: -10, src: 'x' }] }],
      })
    );
    const logo = restored.pages[0].elements[0];
    expect(logo?.type === 'logo' ? logo.opacity : 0).toBe(1);
    expect(logo?.type === 'logo' ? logo.widthPx : 0).toBeGreaterThan(0);
  });
});
