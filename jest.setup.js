require('react-native-gesture-handler/jestSetup');

// react-native-worklets tries to load a native module that does not exist in the
// Jest environment, and reanimated/mock still imports its real entry point, which
// pulls in worklets. A Proxy that answers every property with a no op function
// stands in without needing to track its full API surface.
jest.mock('react-native-worklets', () => {
  const overrides = {
    __esModule: true,
    default: {},
    isWorkletFunction: () => false,
    WorkletsModule: {},
  };
  function createStub() {
    const fn = (...args) => args[0];
    return new Proxy(fn, {
      get(target, prop) {
        if (prop in overrides) return overrides[prop];
        if (prop in target) return target[prop];
        return createStub();
      },
    });
  }
  return createStub();
});

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  impactAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
  };
});
