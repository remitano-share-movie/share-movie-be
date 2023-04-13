const request = require('supertest')
const app = require('../app')

describe("User logout", () => {
  const user = {
    correct_username: 'usertest1@gmail.com',
    wrong_username: 'usertest@gmail.com'
  }
  const passwords = {
    correct_password: 'Khoi123@',
    wrong_password: '123123123'
  }

  test("user logs in with correct account", async () => {
    const res = await request(app).post('/users/login').send({username: usernames['correct_username'], password: passwords['correct_password']});
    
    const response = JSON.parse(res.text);
    
    expect(response?.message).toEqual('Login successfully');
    expect(response.data.access_token.length).not.toEqual(0);
  }, 100000)
})