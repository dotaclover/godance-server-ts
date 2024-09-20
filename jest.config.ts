export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'], // 设定你的测试文件目录
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
    collectCoverageFrom: ['src/**/*.ts'],
  };
  