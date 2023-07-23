// Function to check if the uploaded file is of type "image"
function isImageFile(file) {
    if (!file) {
      return false; // No file uploaded
    }
    return file.type && file.type.startsWith('image/');
  }
  
  // Test scenario: Valid image file type
  test('Valid image file type', () => {
    const imageFile = { type: 'image/png' };
    expect(isImageFile(imageFile)).toBe(true);
  });
  
  // Test scenario: Invalid image file type
  test('Invalid image file type', () => {
    const nonImageFile = { type: 'text/plain' };
    expect(isImageFile(nonImageFile)).toBe(false);
  });
  
  // Test scenario: No file uploaded
  test('No file uploaded', () => {
    const noFile = null;
    expect(isImageFile(noFile)).toBe(false);
  });
  
  // Test scenario: Undefined file
  test('Undefined file', () => {
    const undefinedFile = undefined;
    expect(isImageFile(undefinedFile)).toBe(false);
  });
  