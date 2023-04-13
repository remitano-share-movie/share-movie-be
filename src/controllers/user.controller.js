const { userModel, User } = require("../models/user.model")
const messages = require("../helpers/messages")
const CrytoJs = require('crypto-js')
const JwtService = require("../services/jwt.service");
const jwtService = new JwtService();

const user_register = async (user) => {
  let datetime = Number(new Date())
  user.password = CrytoJs.MD5(user.password).toString();
  user.created_at = datetime;
  user.updated_at = datetime;

  try {
    console.log(1);
    await userModel.create(user);
    console.log(2);
  }
  catch(err){
    console.log(3);
    throw {
      error: 'Username existed',
      message: 'Register fail! Username existed'
    }
  }
}
// usertest1681404728319@gmail.com
// usertest1681404766575@gmail.com
const user_login = async (user) => {
  
  let userQuery = await userModel.findOne({
    username: user.username,
    password: CrytoJs.MD5(user.password).toString()
  })
  
  if (!userQuery) {
    throw {error: 'Username or password invalid', message: 'Username or password invalid'}
  }

  // userQuery = new User(userQuery._doc);
  userQuery.access_token = jwtService.generateJwt(userQuery);
  userQuery.updated_at = Number(new Date());

  try {
    await userModel.updateOne({ _id: userQuery.id }, userQuery);
    
    return {
      id: userQuery._id,
      username: userQuery.username,
      access_token: userQuery.access_token,
    }
  } catch (error) {
    throw {message: 'Login Fail!', error: error.message}
  }
}

const check_exist_username = async (username) => {
  let existed_username = await userModel.findOne({username: username});
  
  return !!existed_username;
}

const user_logout = async (user) => {
  try {
    await userModel.updateOne({ _id: user._id }, { access_token: "", updated_at: Number(new Date()) });
  } catch (error) {
    return { message: "An error has occurred" };
  }
}

module.exports = {
  user_register,
  check_exist_username,
  user_login,
  user_logout
}