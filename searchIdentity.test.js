// Import the functions to be tested
const { authenticateUser, setPreference } = require('./authorizationFunctions'); 

// Test Suite: User Search (Function) - Authorization Function
describe('User Search - Authorization Function', () => {
  // Pre-Condition: User successfully authenticated
  describe('Logged-in User', () => {
    let loggedInUser;

    // Run this block before each test case in this suite
    beforeEach(() => {
      // Simulate an existing user who has logged in on the previous login page
      loggedInUser = {
        id: 'user123',
        name: 'John Doe',
        preferences: [], // The user has not set any preferences initially
      };
    });

    // Test Case 1: Logged-in user is authorized and able to set 7 preferences
    it('should authorize as logged-in user and able to set 7 preferences', () => {
      // Simulate authentication of logged-in user
      authenticateUser(loggedInUser);

      // Simulate setting preferences
      setPreference(loggedInUser, 'Tax Rate');
      setPreference(loggedInUser, 'Salary Average (yr)');
      setPreference(loggedInUser, 'Crime Rate');
      setPreference(loggedInUser, 'Population');
      setPreference(loggedInUser, 'Cost of Living');
      setPreference(loggedInUser, 'Rent');
      setPreference(loggedInUser, 'Groceries');

      // Assertion: Check that the user's preferences array has 7 elements
      expect(loggedInUser.preferences).toHaveLength(7);
    });

    // Test Case 2: Post-Condition - User remains on the user search page
    it('should remain on the user search page', () => {
      // Simulate authentication of logged-in user
      authenticateUser(loggedInUser);

      // Make sure the user is on the user search page
      expect(loggedInUser.currentPage).toEqual('userSearch');
    });
  });

  // Pre-Condition: User clicked on "Skip as Visitor" button on login page
  describe('Visitor User', () => {
    let visitorUser;

    // Run this block before each test case in this suite
    beforeEach(() => {
      // Simulate a visitor user who chose "Skip as Visitor" on the previous login page
      visitorUser = {
        id: 'visitor456',
        name: 'Guest',
        preferences: [], // The user has not set any preferences initially
      };
    });

    // Test Case 3: Visitor user is authorized and able to set 3 preferences
    it('should authorize as Visitor and only able to set 3 preferences', () => {
      // Simulate authentication of the visitor user
      authenticateUser(visitorUser);

      // Simulate setting preferences
      setPreference(visitorUser, 'Tax Rate');
      setPreference(visitorUser, 'Salary Average (yr)');
      setPreference(visitorUser, 'Crime Rate');

      // Assertion: Check that the visitor user's preferences array has 3 elements
      expect(visitorUser.preferences).toHaveLength(3);
    });

    // Test Case 4: Post-Condition - Visitor remains on the user search page
    it('should remain on the user search page', () => {
      // Simulate authentication of the visitor user
      authenticateUser(visitorUser);

      // Make sure the user is on the user search page
      expect(visitorUser.currentPage).toEqual('userSearch');
    });
  });
});
