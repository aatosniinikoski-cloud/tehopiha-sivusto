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
// Integration boundary: replace this implementation with a server-mediated CRM request later.
// No API keys belong in the frontend. No data is sent or persisted in this local demo.
export async function submitContact(_values: ContactFields): Promise<{ status: 'not-connected' }> {
  return { status: 'not-connected' };
}
