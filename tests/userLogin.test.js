const request = require('supertest')
const app = require('../app')

beforeAll(() => {
  require('../src/database/connect.database')
});

afterAll(() => {
  require('../src/database/disconnect.database')
});

describe("Should", () => {
  const usernames = {
    correct_username: 'usertest1@gmail.com',
    wrong_username: 'usertest@gmail.com'
  }
  const passwords = {
    correct_password: 'Khoi123@',
    wrong_password: '123123123'
  }

  test("logs in with correct account", async () => {
    const res = await request(app).post('/users/login').send({username: usernames['correct_username'], password: passwords['correct_password']});
    
    const response = JSON.parse(res.text);
    
    expect(response?.message).toEqual('Login successfully');
    expect(response.data.access_token.length).not.toEqual(0);
  }, 100000)

  test("not logs in with wrong account", async () => {
    const res = await request(app).post('/users/login').send({username: usernames['wrong_username'], password: passwords['correct_password']});
    
    const response = JSON.parse(res.text);
    
    expect(response.error).toEqual('Username or password invalid');
    expect(response.message).toEqual('Username or password invalid');
  })

  test("not logs in with wrong password", async () => {
    const res = await request(app).post('/users/login').send({username: usernames['correct_username'], password: passwords['wrong_password']});
    
    const response = JSON.parse(res.text);
    
    expect(response.error).toEqual('Username or password invalid');
    expect(response.message).toEqual('Username or password invalid');
  })

  test("not logs in with wrong username and password", async () => {
    const res = await request(app).post('/users/login').send({username: usernames['wrong_username'], password: passwords['wrong_password']});
    
    const response = JSON.parse(res.text);
    
    expect(response.error).toEqual('Username or password invalid');
    expect(response.message).toEqual('Username or password invalid');
  })

  test("not logs in without username but correct password", async () => {
    const res = await request(app).post('/users/login').send({password: passwords['correct_password']});
    
    const response = JSON.parse(res.text);
    
    expect(response.errors.username[0]).toEqual("Username invalid");
    expect(response.message).toEqual('Login failed!');
  })

  test("not logs in without username and wrong password", async () => {
    const res = await request(app).post('/users/login').send({password: passwords['wrong_password']});
    
    const response = JSON.parse(res.text);
    
    expect(response.errors.username[0]).toEqual("Username invalid");
    expect(response.message).toEqual('Login failed!');
  })

  test("not logs in without password but correct username", async () => {
    const res = await request(app).post('/users/login').send({username: usernames['wrong_username']});
    
    const response = JSON.parse(res.text);
    
    expect(response.errors.password[0]).toEqual("Password invalid");
    expect(response.message).toEqual('Login failed!');
  })

  test("not logs in without password and wrong username", async () => {
    const res = await request(app).post('/users/login').send({username: usernames['wrong_username']});
    
    const response = JSON.parse(res.text);
    
    expect(response.errors.password[0]).toEqual("Password invalid");
    expect(response.message).toEqual('Login failed!');
  })

  test("not logs in without password and username", async () => {
    const res = await request(app).post('/users/login').send({});
    
    const response = JSON.parse(res.text);
    
    expect(response.errors.username[0]).toEqual("Username invalid");
    expect(response.errors.password[0]).toEqual("Password invalid");
    expect(response.message).toEqual('Login failed!');
  })
})