export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function buildLetterFilename(internName: string, issueDate: string, ext: 'pdf' | 'docx'): string {
  const safeName = internName.trim().replace(/\s+/g, '_').replace(/[^\w\-]/g, '');
  const safeDate = issueDate.replace(/-/g, '');
  return `Carta_${safeName || 'aprendiz'}_${safeDate || 'fecha'}.${ext}`;
}
