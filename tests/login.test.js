const {user_login} = require('../src/controllers/user.controller')
const {userModel, User} = require('../src/models/user.model')
const config = require('dotenv');
const mongoose = require('mongoose');

config.config();

describe("should login", () => {
  const usernames = {
    correct_username: 'usertest1@gmail.com',
    wrong_username: 'usertest@gmail.com'
  }
  const passwords = {
    correct_password: 'Khoi123@',
    wrong_password: '123123123'
  }

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser:true});
  });
  
  /* Closing database connection after each test. */
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test("with corrrect account", async () => {
    let user = new User({username: usernames['correct_username'], password: passwords['correct_password']});
    const response = await user_login(user);

    expect(response.access_token.length).not.toEqual(0);
    expect(response.username).toEqual(user.username)
  })

  describe('with wrong', () => {
    test("username and password", async () => {
      let user = new User({username: usernames['wrong_username'], password: passwords['wrong_password']});
      try {
        await user_login(user);
      } catch (error) {
        expect(error.error).toEqual('Username or password invalid');
        expect(error.message).toEqual('Username or password invalid');
      }
    })
  
    test("username", async () => {
      let user = new User({username: usernames['wrong_username'], password: passwords['correct_password']});
      try {
        await user_login(user);
      } catch (error) {
        expect(error.error).toEqual('Username or password invalid');
        expect(error.message).toEqual('Username or password invalid');
      }
    })
  
    test("password", async () => {
      let user = new User({username: usernames['correct_username'], password: passwords['wrong_password']});
      try {
        await user_login(user);
      } catch (error) {
        expect(error.error).toEqual('Username or password invalid');
        expect(error.message).toEqual('Username or password invalid');
      }
    })
  })

  describe('without', () => {
    test("username", async () => {
      let user = new User({username: usernames['correct_username'], password: passwords['wrong_password']});
      try {
        await user_login(user);
      } catch (error) {
        expect(error.error).toEqual('Username or password invalid');
        expect(error.message).toEqual('Username or password invalid');
      }
    })

    test("password", async () => {
      let user = new User({username: usernames['correct_username'], password: passwords['wrong_password']});
      try {
        await user_login(user);
      } catch (error) {
        expect(error.error).toEqual('Username or password invalid');
        expect(error.message).toEqual('Username or password invalid');
      }
    })

    test("username and password", async () => {
      let user = new User({});
      try {
        await user_login(user);
      } catch (error) {
        expect(error.error).toEqual('Username or password invalid');
        expect(error.message).toEqual('Username or password invalid');
      }
    })
  })
})