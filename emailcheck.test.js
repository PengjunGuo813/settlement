const { MongoClient } = require('mongodb');

// Function to check if an email exists in the MongoDB
async function checkEmailExists(email) {
  const uri = 'mongodb+srv://test:123@cap.hykyyvf.mongodb.net/';
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();

    const database = client.db('test');
    const collection = database.collection('users');

    const query = { email: email };
    const result = await collection.findOne(query);

    return result !== null;
  } catch (error) {
    console.error('Error occurred while connecting to MongoDB', error);
    return false;
  } finally {
    await client.close();
  }
}

// Jest test cases
describe('Check Email Exists', () => {
  // Test case for an existing email
  test('should return true for an existing email', async () => {
    const email = 'user@myseneca.ca';
    const emailExists = await checkEmailExists(email);
    expect(emailExists).toBe(true);
  });

  // Test case for a non-existing email
  test('should return false for a non-existing email', async () => {
    const email = 'nonexist@myseneca.ca';
    const emailExists = await checkEmailExists(email);
    expect(emailExists).toBe(false);
  });
});

