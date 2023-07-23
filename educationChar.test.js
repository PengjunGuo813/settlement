// Function to check if the description exceeds the character limit
function isDescriptionOverLimit(description) {
  return description.length > 1000;
}

// Test scenario: Description within the character limit
test('Description within character limit', () => {
  const description = 'This is a valid description within the character limit.';
  
  expect(isDescriptionOverLimit(description)).toBe(false);
});

// Test scenario: Description at the character limit
test('Description at character limit', () => {
  const description = 'x'.repeat(1000);
  
  expect(isDescriptionOverLimit(description)).toBe(false);
});

// Test scenario: Description exceeding the character limit
test('Description exceeding character limit', () => {
  const description = 'x'.repeat(1001);
  
  expect(isDescriptionOverLimit(description)).toBe(true);
});
