const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    
    await user.save();
    res.status(201).json({ message: 'User successfully created!'});
  } catch (error) {
    res.status(400).send('Error to create the user: ' + error.message);
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  const jwtSecret = process.env.JWT_SECRET;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send('Incorrect password');
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Successfully logged in!', username: user.username, token });
  } catch (error) {
    res.status(500).send('Error on login: ' + error.message);
  }
}

async function forgotPassword(req, res) {
  const { username, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }
 
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { username },
      { password: hashedPassword }
    );

    res.json({ message: 'Senha atualizada com sucesso!' });
  } catch (error) {
    res.status(500).send('Erro ao recuperar a senha: ' + error.message);
  }
}

module.exports = { register, login, forgotPassword };