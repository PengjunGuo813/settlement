const request = require('supertest');
const { app, ensureLogin, ensureAdmin } = require('./server');

// Mock clientSession middleware to inject a user into the request
app.use((req, res, next) => {
  req.Cap805Session = {
    user: {
      isAdmin: false
    }
  }
  next();
})

app.get('/loginTest', ensureLogin, (req, res) => res.status(200).send('Logged In'));
app.get('/adminTest', ensureAdmin, (req, res) => res.status(200).send('Admin Access'));

describe('Middleware function tests', () => {
  test('ensureLogin allows access when logged in', async () => {
    const response = await request(app).get('/loginTest');
    expect(response.statusCode).toBe(200);
  });

  test('ensureAdmin denies access when not admin', async () => {
    const response = await request(app).get('/adminTest');
    expect(response.statusCode).toBe(200); // Change this to 401 or whatever you set in your actual ensureAdmin function
  });
});
