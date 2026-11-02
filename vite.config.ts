import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { publicCompany } from './config/company.ts';
export default defineConfig(() => {
  const base = '/';
  return { base, plugins: [react(), tailwindcss()], define: { __COMPANY__: JSON.stringify({ ...publicCompany, logo: `${base}${publicCompany.logo.slice(1)}` }) } };
});
