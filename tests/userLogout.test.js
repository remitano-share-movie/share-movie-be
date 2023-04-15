const request = require('supertest')
const app = require('../app')

describe("Should", () => {
  beforeAll(() => {
    require('../src/database/connect.database')
  });
  
  afterAll( async () => {
    
    require('../src/database/disconnect.database')
  });

  describe('log in then log out', () => {
    let user_info = null
    test('user login', async() => {
      const user = {username: 'usertest2@gmail.com', password: 'Khoi123@'};
      const res = await request(app).post('/users/login').send({username: user.username, password: user.password});
      const login_response = JSON.parse(res.text)
      user_info = login_response.data

      expect(login_response.message).toEqual('Login successfully')
      expect(user_info['access_token']).not.toBeNull();
      expect(user_info['username']).toEqual(user.username);
    })

    test("user logout", async () => {
      const res = await request(app).post('/users/logout').send(user_info).set('Authorization', `Bearer ${user_info.access_token}`);
      
      const response = JSON.parse(res.text);
      
      expect(response?.message).toEqual('Logged out');
    })
  })

  describe('not log out ', () => {
    let user_info = null;

    beforeEach(async () => {
      const user = {username: 'usertest2@gmail.com', password: 'Khoi123@'};
      const res = await request(app).post('/users/login').send({username: user.username, password: user.password});
      const login_response = JSON.parse(res.text)
      user_info = login_response.data
    })

    test("without access token", async () => {
      const response = await request(app).post('/users/logout');
      
      expect(JSON.parse(response.text).message).toEqual('Access token invalid');
      expect(JSON.parse(response.text).errorCode).toEqual(4)
    })

    test("with expired access token", async () => {
      //token in 7s
      const expired_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoie1wiaWRcIjpcIjY0MzYxYzBhMGI2OTcyNTRiNDc1NjRjNVwiLFwidXNlcm5hbWVcIjpcInVzZXJ0ZXN0MUBnbWFpbC5jb21cIn0iLCJpYXQiOjE2ODE1NDk4MTcsImV4cCI6MTY4MTU0OTgyNH0.gUvQqL0E5w_6crVuXqihKpsUTRk5Hkb1Co4u8i5-dck'
      const response = await request(app).post('/users/logout')
                                        .send(user_info)
                                        .set('Authorization', `Bearer ${expired_token}`);
      
      expect(JSON.parse(response.text).message).toEqual('Access token invalid');
      expect(JSON.parse(response.text).errorCode).toEqual(1)
    })

    test("with other access token", async () => {
      const user = {username: 'usertest2@gmail.com', password: 'Khoi123@'};
      const res = await request(app).post('/users/login').send({username: user.username, password: user.password});
      const login_response = JSON.parse(res.text)
      let user_info_temp = login_response.data
      
      const response = await request(app).post('/users/logout')
                                        .send(user_info_temp)
                                        .set('Authorization', `Bearer ${user_info.access_token}`);
      
      expect(JSON.parse(response.text).message).toEqual('Access token does not match');
      expect(JSON.parse(response.text).errorCode).toEqual(3)
    })

    test("if cannot find user", async () => {
      const nonexist_user = {
        id: '6438350a0942d9130048a5b3',
        username: 'usertest123123133@gmail.com',
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoie1wiaWRcIjpcIjY0MzgzNTBhMDk0MmQ5MTMwMDQ4YTViM1wiLFwidXNlcm5hbWVcIjpcInVzZXJ0ZXN0MTY4MTQwNTE4ODExOEBnbWFpbC5jb21cIn0iLCJpYXQiOjE2ODE1NTUxNjV9.1sllVP4_EfA2QkTOIxSC9Hk_kXckJdKVQ3HKKkZ6CRE'
      }
      const response = await request(app).post('/users/logout')
                                        .send(nonexist_user)
                                        .set('Authorization', `Bearer ${nonexist_user.access_token}`);
      
      expect(JSON.parse(response.text).message).toEqual('Access token do not match');
      expect(JSON.parse(response.text).errorCode).toEqual(2)
    })

    test('without user id', async () => {
      const response = await request(app).post('/users/logout')
                                        .send({username: user_info.username})
                                        .set('Authorization', `Bearer ${user_info.access_token}`);
      const response_json = JSON.parse(response.text)

      expect(response_json.message).toEqual('Logout failed!');
      expect(response_json.errors.id).toContain('Id invalid');
    })

    test('without username', async () => {
      const response = await request(app).post('/users/logout')
                                        .send({id: user_info.id})
                                        .set('Authorization', `Bearer ${user_info.access_token}`);
      const response_json = JSON.parse(response.text)

      expect(response_json.message).toEqual('Logout failed!');
      expect(response_json.errors.username).toContain('Username invalid');
    })

    test('without user infor', async () => {
      const response = await request(app).post('/users/logout').set('Authorization', `Bearer ${user_info.access_token}`);
      const response_json = JSON.parse(response.text)

      expect(response_json.message).toEqual('Logout failed!');
      expect(response_json.errors.username).toContain('Username invalid');
      expect(response_json.errors.id).toContain('Id invalid');
    })
  })
})