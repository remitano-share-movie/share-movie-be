const request = require('supertest')
const app = require('../app')
const { userModel } = require('../src/models/user.model')

describe("Should", () => {
  const usernames = {
    new_username: `usertest${Number(new Date())}@gmail.com`,
    exist_username: 'usertest@gmail.com'
  }
  const passwords = {
    correct_password: 'Khoi123@',
    short_password: 'Aa1@',
    non_uppercase_password: 'aa11@@',
    non_lowercase_password: 'AA11@@',
    non_digit_password: 'aaAA@@',
    non_special_char_password: 'aaAA11',
  }

  beforeAll(() => {
    require('../src/database/connect.database')
  });
  
  afterAll( async () => {
    await userModel.deleteOne({username: usernames['new_username']});
    require('../src/database/disconnect.database')
  });

  test("register with correct account", async () => {
    const res = await request(app).post('/users/register').send({username: usernames['new_username'], password: passwords['correct_password']});
    
    const response = JSON.parse(res.text);
    
    expect(response?.message).toEqual('Login successfully');
    expect(response.data.access_token.length).not.toEqual(0);
  })

  describe('not register in with', () => {
    test("exist account", async () => {
      try {
        await request(app).post('/users/regiser').send({username: usernames['exist_username'], password: passwords['correct_password']});
      } catch (error) {
        expect(error.error).toContain('duplicate key');
        expect(error.message).toEqual('Register fail! Username existed');
      }      
    })

    test("password less than 5", async () => {
      try {
        await request(app).post('/users/regiser').send({username: usernames['new_username'], password: passwords['short_password']});
      } catch (error) {
        expect(error.error).toEqual('Password needs to be longer than 4 characters');
        expect(error.message).toEqual('Register failed');
      }     
    })

    test("password without uppercase", async () => {
      try {
        await request(app).post('/users/regiser').send({username: usernames['new_username'], password: passwords['non_uppercase_password']});
      } catch (error) {
        expect(error.error).toEqual('Password contains uppercase letters');
        expect(error.message).toEqual('Register failed');
      }     
    })

    test("password without lowercase", async () => {
      try {
        await request(app).post('/users/regiser').send({username: usernames['new_username'], password: passwords['non_lowercase_password']});
      } catch (error) {
        expect(error.error).toContain('Password contains lowercase letters');
        expect(error.message).toEqual('Register failed');
      }     
    })

    test("password without digit", async () => {
      try {
        await request(app).post('/users/regiser').send({username: usernames['new_username'], password: passwords['non_digit_password']});
      } catch (error) {
        expect(error.error).toContain('Password contains digits');
        expect(error.message).toEqual('Register failed');
      }     
    })

    test("password without special character", async () => {
      try {
        await request(app).post('/users/regiser').send({username: usernames['new_username'], password: passwords['non_special_char_password']});
      } catch (error) {
        expect(error.error).toContain('Password contains special characters');
        expect(error.message).toEqual('Register failed');
      }     
    })
  })

  describe('verify required attribute', () => {
    test('missing username', async () => {
      const response = await request(app).post('/users/register').send({password: passwords['correct_password']})
      const res = JSON.parse(response.text);
      
      expect(res.message).toEqual('Register failed');
      expect(res.errors.username).toContain('Username invalid')
    })

    test('missing password', async () => {
      const response = await request(app).post('/users/register').send({username: usernames['new_username']})
      const res = JSON.parse(response.text);
      
      expect(res.message).toEqual('Register failed');
      expect(res.errors.password).toContain('Password invalid')
    })
  })
})