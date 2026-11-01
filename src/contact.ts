export type ContactFields = { name: string; email: string; phone: string; location: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;
export function validateContact(values: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  if (values.name.trim().length < 2) errors.name = 'Kirjoita nimesi (vähintään 2 merkkiä).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Tarkista sähköpostiosoitteen muoto.';
  if (values.phone.trim() && (!/^[+\d\s()\-]+$/.test(values.phone) || values.phone.replace(/\D/g, '').length < 7)) errors.phone = 'Tarkista puhelinnumero tai jätä kenttä tyhjäksi.';
  if (!values.location.trim()) errors.location = 'Kerro remonttikohteen paikkakunta, alue tai postinumero.';
  if (values.message.trim().length < 10) errors.message = 'Kerro projektistasi vähintään 10 merkillä.';
  return errors;
}
// Web3Forms access keys are public browser-side form identifiers, not account secrets.
export async function submitContact(values: ContactFields): Promise<{ status: 'success' | 'error' }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        access_key: '361ced53-3447-4f8f-9d33-dcf162696145',
        name: values.name, email: values.email, phone: values.phone,
        location: values.location, message: values.message,
        subject: 'Uusi tarjouspyyntö – TehoPiha',
        from_name: 'TehoPihan verkkosivusto',
      }),
    });
    const result: unknown = await response.json();
    return { status: response.ok && typeof result === 'object' && result !== null && 'success' in result && result.success === true ? 'success' : 'error' };
  } catch {
    return { status: 'error' };
  } finally {
    clearTimeout(timeout);
  }
}
