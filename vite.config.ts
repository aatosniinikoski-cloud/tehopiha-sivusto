import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { publicCompany } from './config/company.ts';
export default defineConfig(({ command }) => {
  const base = command === 'build' ? '/tehopiha-sivusto/' : '/';
  return { base, plugins: [react(), tailwindcss()], define: { __COMPANY__: JSON.stringify({ ...publicCompany, logo: `${base}${publicCompany.logo.slice(1)}` }) } };
});
