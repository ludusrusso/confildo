module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 20000,
  runner: 'jest-serial-runner',
  globalSetup: '<rootDir>/test/globalsetup.ts',
  globalTeardown: '<rootDir>/test/globalteardonw.ts',
};
