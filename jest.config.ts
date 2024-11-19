import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.build.json';

export default {
	moduleFileExtensions: ['js', 'json', 'ts'],
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': '@swc/jest'
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: './coverage',
	maxWorkers: 10,
	maxConcurrency: 4,
	coveragePathIgnorePatterns: [
		'dist',
		'index.ts',
		'node_modules',
		'jest.config.ts',
		'jest-e2e.config.ts',
		'coverage',
		'test'
	],
	testEnvironment: 'node',
	modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths /*, { prefix: '<rootDir>/' } */)
} as JestConfigWithTsJest;
