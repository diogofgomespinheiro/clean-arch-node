const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*-protocols.ts',
    '!**/protocols/**',
    '!**/test/**'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>'
  }),
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: ['./src/test/setup.ts'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  watchPathIgnorePatterns: ['globalConfig']
};
