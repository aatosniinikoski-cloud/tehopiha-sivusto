import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { publicCompany } from './config/company.ts';
export default defineConfig({ plugins: [react(), tailwindcss()], define: { __COMPANY__: JSON.stringify(publicCompany) } });
