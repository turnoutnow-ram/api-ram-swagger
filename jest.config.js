// Jest configuration for API testing
module.exports = {
  testEnvironment: 'node',
  // Force Jest to exit after tests complete
  forceExit: true,
  // Detect open handles to help debug hanging tests
  detectOpenHandles: true,
  // Set test timeout
  testTimeout: 10000
};
