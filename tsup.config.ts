import { defineConfig } from 'tsup';

export default defineConfig({
    format: ['cjs', 'esm', 'iife'],
    clean: true,
    dts: true
});
