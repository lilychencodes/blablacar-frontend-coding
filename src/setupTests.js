// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import TestUtils from 'react-dom/test-utils'

export const mockTripsData = {
  trips: [
    {
      distance_in_meters: 10000,
      duration_in_seconds: 10000,
      link: 'google.com',
      price: {
        amount: 20,
        currency: 'EUR',
      },
      vehicle: {
        make: 'toyoga',
        model: 'prius',
      },
      waypoints: [
        { date_time: new Date().toISOString(), place: { city: 'Paris' } },
        { date_time: new Date().toISOString(), place: { city: 'Lyon' } }
      ],
    }
  ],
  next_cursor: 'foobar',
  search_info: { count: 40 }
}

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation((): jest.MockedFunction<any> => {
    return Promise.resolve({ json: () => Promise.resolve(mockTripsData)})
  });
  setupIntersectionObserverMock();
});

// Makes sure `act()` returns the container. https://github.com/facebook/react/issues/16366#issuecomment-520794083
export async function act(callback){
  let ret;
  await TestUtils.act(async () => {
    ret = await callback();
  });
  return ret;
}

/**
 * From: https://stackoverflow.com/questions/44249985/js-testing-code-that-uses-an-intersectionobserver
 * Utility function that mocks the `IntersectionObserver` API. Necessary for components that rely
 * on it, otherwise the tests will crash. Recommended to execute inside `beforeEach`.
 * @param intersectionObserverMock - Parameter that is sent to the `Object.defineProperty`
 * overwrite method. `jest.fn()` mock functions can be passed here if the goal is to not only
 * mock the intersection observer, but its methods.
 */
function setupIntersectionObserverMock({
  root = null,
  rootMargin = '',
  thresholds = [],
  disconnect = () => null,
  observe = () => null,
  takeRecords = () => [],
  unobserve = () => null,
} = {}) {
  class MockIntersectionObserver {
    constructor() {
      this.root = root;
      this.rootMargin = rootMargin;
      this.thresholds = thresholds;
      this.disconnect = disconnect;
      this.observe = observe;
      this.takeRecords = takeRecords;
      this.unobserve = unobserve;
    }
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver
  });

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver
  });
}
