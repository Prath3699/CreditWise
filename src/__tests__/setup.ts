import '@testing-library/jest-dom/vitest';

// framer-motion uses these in jsdom
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = globalThis.ResizeObserver || (ResizeObserverStub as unknown as typeof ResizeObserver);

if (!window.matchMedia) {
  // @ts-ignore
  window.matchMedia = () => ({ matches: false, addListener: () => {}, removeListener: () => {}, addEventListener: () => {}, removeEventListener: () => {} });
}
