export async function loadApiSchema() {
  try {
    const res = await fetch('/api/schema');
    if (!res.ok) {
      throw new Error(`Failed to fetch API schema: ${res.status}`);
    }
    const text = await res.text();
    console.log('API schema loaded. Length:', text.length);
    return text;
  } catch (e) {
    console.error('API schema load error', e);
    return null;
  }
}
