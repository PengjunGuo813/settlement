// myaccount.test.js

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Read the content of the "myaccount.hbs" file
const html = fs.readFileSync(path.resolve(__dirname, 'myaccount.hbs'), 'utf8');

// Load the HTML content into a virtual DOM
const { window } = new JSDOM(html, { runScripts: 'dangerously' });
const { document } = window;

// Load the script containing the password validation function
const scriptElement = document.createElement('script');
scriptElement.textContent = `
  // Password regex pattern
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[%._!])[A-Za-z\\d%._!]{8,}$/;

  function validatePassword() {
      const passwordInput = document.getElementById("new-password").value;
      const isValid = passwordRegex.test(passwordInput);
      const passwordError = document.getElementById("password-error");

      if (!isValid) {
          passwordError.textContent = "Password must contain at least one lowercase letter, one uppercase letter, one special character (%._!), and be at least 8 characters long.";
      } else {
          passwordError.textContent = "";
      }
  }
`;

document.head.appendChild(scriptElement);

// Helper function to simulate input events
function simulateInputEvent(element, value) {
  element.value = value;
  const event = new window.Event('input', { bubbles: true });
  element.dispatchEvent(event);
}

// The actual Jest tests
describe('My Account Page', () => {
  let newPasswordInput;
  let passwordErrorSpan;

  beforeEach(() => {
    // Get the elements for testing
    newPasswordInput = document.getElementById('new-password');
    passwordErrorSpan = document.getElementById('password-error');
  });

  test('Invalid password shows correct error message', () => {
    // Set an invalid password (does not meet the criteria)
    simulateInputEvent(newPasswordInput, 'weakpassword');

    // Expect the error message to be displayed with the correct text
    expect(passwordErrorSpan.textContent).toBe(
      'Password must contain at least one lowercase letter, one uppercase letter, one special character (%._!), and be at least 8 characters long.'
    );
  });

  test('Valid password does not show error message', () => {
    // Set a valid password
    simulateInputEvent(newPasswordInput, 'StrongPassword%1');

    // Expect the error message to be empty (no error for valid password)
    expect(passwordErrorSpan.textContent).toBe('');
  });
});
