const {user_register} = require('../src/controllers/user.controller')
const {userModel, User} = require('../src/models/user.model')
const config = require('dotenv');
const mongoose = require('mongoose');

config.config();

describe("should register", () => {
  const usernames = {
    existent_username: 'usertest1@gmail.com',
    nonexistent_username: `usertest${Number(new Date())}@gmail.com`
  }
  const password = '132123123'

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser:true});
  });
  
  /* Closing database connection after each test. */
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("with exist account", async () => {
    let user = new User({username: usernames['existent_username'], password: password});
    try {
      await user_register(user)
    } catch (error) {
      expect(error.error).toEqual('Username existed');
      expect(error.message).toEqual('Register fail! Username existed');
    }
  })

  test("with non-exist account", async () => {
    console.log(usernames['nonexistent_username']);
    let user = new User({username: usernames['nonexistent_username'], password: password});
    await user_register(user);
    const registered_user = userModel.findOne({username: usernames['nonexistent_username']});

    console.log(registered_user);
    expect(registered_user).not.toBeNull();

  })

  // describe('with wrong', () => {
  //   test("username and password", async () => {
  //     let user = new User({username: usernames['wrong_username'], password: passwords['wrong_password']});
  //     try {
  //       await user_login(user);
  //     } catch (error) {
  //       expect(error.error).toEqual('Username or password invalid');
  //       expect(error.message).toEqual('Username or password invalid');
  //     }
  //   })
  
  //   test("username", async () => {
  //     let user = new User({username: usernames['wrong_username'], password: passwords['correct_password']});
  //     try {
  //       await user_login(user);
  //     } catch (error) {
  //       expect(error.error).toEqual('Username or password invalid');
  //       expect(error.message).toEqual('Username or password invalid');
  //     }
  //   })
  
  //   test("password", async () => {
  //     let user = new User({username: usernames['correct_username'], password: passwords['wrong_password']});
  //     try {
  //       await user_login(user);
  //     } catch (error) {
  //       expect(error.error).toEqual('Username or password invalid');
  //       expect(error.message).toEqual('Username or password invalid');
  //     }
  //   })
  // })

  // describe('without', () => {
  //   test("username", async () => {
  //     let user = new User({username: usernames['correct_username'], password: passwords['wrong_password']});
  //     try {
  //       await user_login(user);
  //     } catch (error) {
  //       expect(error.error).toEqual('Username or password invalid');
  //       expect(error.message).toEqual('Username or password invalid');
  //     }
  //   })

  //   test("password", async () => {
  //     let user = new User({username: usernames['correct_username'], password: passwords['wrong_password']});
  //     try {
  //       await user_login(user);
  //     } catch (error) {
  //       expect(error.error).toEqual('Username or password invalid');
  //       expect(error.message).toEqual('Username or password invalid');
  //     }
  //   })

  //   test("username and password", async () => {
  //     let user = new User({});
  //     try {
  //       await user_login(user);
  //     } catch (error) {
  //       expect(error.error).toEqual('Username or password invalid');
  //       expect(error.message).toEqual('Username or password invalid');
  //     }
  //   })
  // })
})