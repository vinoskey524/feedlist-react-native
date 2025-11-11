import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/main.tsx'],
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'dist',
    splitting: false,
    sourcemap: false,
    clean: true,
    external: ['react', 'react/jsx-runtime', 'react-native'],
});