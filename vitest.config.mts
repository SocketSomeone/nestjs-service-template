import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
	resolve: {
		alias: {
			'@src': fileURLToPath(new URL('./src', import.meta.url)),
			'@common': fileURLToPath(new URL('./src/common', import.meta.url)),
			'@shared': fileURLToPath(new URL('./src/shared', import.meta.url))
		}
	},
	oxc: {
		decorator: {
			legacy: true,
			emitDecoratorMetadata: true
		},
		assumptions: {
			setPublicClassFields: true
		},
		typescript: {
			removeClassFieldsWithoutInitializer: true
		}
	},
	test: {
		globals: true,
		environment: 'node',
		include: ['**/*.spec.ts', '**/*.e2e-spec.ts'],
		setupFiles: ['reflect-metadata'],
		passWithNoTests: true,
		coverage: {
			provider: 'v8',
			reportsDirectory: './coverage',
			reporter: ['text', 'json', 'clover', 'lcov'],
			reportOnFailure: true,
			include: ['src/**/*.{ts,js}'],
			exclude: ['src/**/index.ts']
		}
	}
});
