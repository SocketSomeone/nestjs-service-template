import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.build.json';
import type { JestConfigWithTsJest } from 'ts-jest';

export const jestConfig: JestConfigWithTsJest = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	testEnvironment: 'node',
	testRegex: '.e2e-spec.ts$',
	transform: {
		'^.+\\.(t|j)s$': '@swc/jest'
	},
	modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths /*, { prefix: '<rootDir>/' } */)
};

export default jestConfig;
