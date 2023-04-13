var express = require('express');
var router = express.Router();
const {
  user_register,
  check_exist_username,
  user_login,
  user_logout
} = require('../controllers/user.controller')
const {User} = require('../models/user.model')
const ValidateService = require('../services/validate.service');
const { middleware } = require('../middlewares/jwt.middleware');

router.post('/register', async (req, res, next) => {
  let user = new User(req.body);

  let validate = new ValidateService(user);
  validate.required(["username", "password"]);
  validate.validatePassword()

  if (validate.hasError())
    return res
      .send({ message: "Register failed", errors: validate.errors });

  try {
    let userQuery = null;
    // const exist_username = await check_exist_username(user.username)
    await user_register(user)
    user.password = req.body.password
    userQuery = await user_login(user)
    res.send({message: 'Login successfully', data: userQuery})
  } catch (error) {
    res.send({message: error.message, error: error.error})
  }
});

router.post('/login', async (req, res, next) => {
  let user = new User(req.body);

  let validate = new ValidateService(user);
  validate.required(["username", "password"]);
  if (validate.hasError())
    return res.send({ message: "Login failed!", errors: validate.errors });

  try {
    const userQuery = await user_login(user)

    res.send({message: 'Login successfully', data: userQuery})
  } catch (error) {
    res.send({message: error.message, error: error.error})
  }
})

router.use(middleware);;
router.post('/logout', async (req, res, next) => {
  let user = new User(req.body);
  try {
    await user_logout(user);
    res.send({message: 'Logged out'})
  } catch (error) {
    
  }
})

module.exports = router;
