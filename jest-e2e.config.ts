import type { JestConfigWithTsJest } from 'ts-jest';
import type { TsConfigJson } from 'type-fest';
import { pathsToModuleNameMapper } from 'ts-jest';
import * as fs from 'node:fs';

const TSCONFIG_PATH = './tsconfig.json';

if (!fs.existsSync(TSCONFIG_PATH)) {
	throw new Error(`Cannot find tsconfig.json at path: ${TSCONFIG_PATH}`);
}

const tsConfig = JSON.parse(fs.readFileSync(TSCONFIG_PATH, 'utf8')) as TsConfigJson;
const compilerOptions = tsConfig.compilerOptions || {};

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
