
const User = require('../src/models/user');
const { register, login } = require('../src/controllers/authController');
const { request, express, mongoose, bcrypt } = require('../tests/base');

const app = express();
app.use(express.json());
app.post('/register', register);
app.post('/login', login);

beforeAll(async () => {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(201);
    expect(response.text).toBe('User successfully created!');

    const user = await User.findOne({ username: 'testuser' });
    expect(user).not.toBeNull();
    const isPasswordValid = await bcrypt.compare('testpassword', user.password);
    expect(isPasswordValid).toBe(true);
  });

  test('should login an existing user', async () => {
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const user = new User({ username: 'testuser', password: hashedPassword });
    await user.save();

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Sucefully logged in!');
  });

  test('should not login with incorrect password', async () => {
    const hashedPassword = await bcrypt.hash('testpassword', 10);
    const user = new User({ username: 'testuser', password: hashedPassword });
    await user.save();

    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Incorrect password');
  });

  test('should not login non-existing user', async () => {
    const response = await request(app)
      .post('/login')
      .send({ username: 'nonexistentuser', password: 'testpassword' });

    expect(response.status).toBe(400);
    expect(response.text).toBe('User not found');
  });

  test('should reset a new password', async () => {
    const response = await request(app)
      .post('/reset_password')
      .send({ username: 'testuser', password: 'newpassword' });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Senha atualizada com sucesso!');
  })
});