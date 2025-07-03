export function extractPlayerNamesOnly(ocrText: string): string[] {
  if (!ocrText) {
    return [];
  }

  const lines = ocrText.split('\n');
  const names: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.length > 2) { 
      names.push(trimmedLine);
    }
  }

  return names;
}