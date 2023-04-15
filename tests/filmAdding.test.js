const request = require('supertest')
const app = require('../app');
const { filmModel } = require('../src/models/film.model');

beforeAll(() => {
  require('../src/database/connect.database')
});

afterAll( async () => {
  require('../src/database/disconnect.database')
});

describe("Should", () => {
  describe('add film after login', () => {
    let user_info = null;
    test('user login', async () => {
      const user = {username: 'usertest1@gmail.com', password: 'Khoi123@'};
      const res = await request(app).post('/users/login').send({username: user.username, password: user.password});
      const login_response = JSON.parse(res.text)
      user_info = login_response.data

      expect(login_response.message).toEqual('Login successfully')
      expect(user_info['access_token']).not.toBeNull();
      expect(user_info['username']).toEqual(user.username);
    })

    describe('with full information', () => {
      test('user adds new film', async () => {
        const film = {film_title: 'New film', film_link: 'https://www.youtube.com/watch?v=I0kVNMHo6fQ' };
        const res = await request(app).post('/films/add_film')
                                      .send(film)
                                      .set('Authorization', `Bearer ${user_info.access_token}`);
        const film_response = JSON.parse(res.text)
  
        expect(film_response.message).toEqual('Add film successfully');
        expect(film_response.data.id).not.toBeNull();
  
        await filmModel.deleteOne({_id: film_response.data.id})
      })
    })

    describe('without', () => {
      test('film tilte return fail', async () => {
        const film = { film_link: 'https://www.youtube.com/watch?v=I0kVNMHo6fQ' };
        const res = await request(app).post('/films/add_film')
                                      .send(film)
                                      .set('Authorization', `Bearer ${user_info.access_token}`);
        const film_response = JSON.parse(res.text)
  
        expect(film_response.message).toEqual('Add new film failed');
        expect(film_response.errors.film_title).toContain('Film_title invalid');
      })

      test('film link return fail', async () => {
        const film = { film_title: 'https://www.youtube.com/watch?v=I0kVNMHo6fQ' };
        const res = await request(app).post('/films/add_film')
                                      .send(film)
                                      .set('Authorization', `Bearer ${user_info.access_token}`);
        const film_response = JSON.parse(res.text)
  
        expect(film_response.message).toEqual('Add new film failed');
        expect(film_response.errors.film_link).toContain('Film_link invalid');
      })
    })
  })

  describe('not add film', () => {
    let user_info = null;

    beforeEach(async () => {
      const user = {username: 'usertest2@gmail.com', password: 'Khoi123@'};
      const res = await request(app).post('/users/login').send({username: user.username, password: user.password});
      const login_response = JSON.parse(res.text)
      user_info = login_response.data
    })

    test('without login', async () => {
      const film = {film_title: 'New film', film_link: 'https://www.youtube.com/watch?v=I0kVNMHo6fQ' };
      const res = await request(app).post('/films/add_film')
                                    .send(film);
      const film_response = JSON.parse(res.text)

      expect(film_response.message).toEqual('Access token invalid');
      expect(film_response.errorCode).toEqual(4)
    })

    test('with expired access token', async () => {
      //token in 7s
      const expired_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoie1wiaWRcIjpcIjY0MzYxYzBhMGI2OTcyNTRiNDc1NjRjNVwiLFwidXNlcm5hbWVcIjpcInVzZXJ0ZXN0MUBnbWFpbC5jb21cIn0iLCJpYXQiOjE2ODE1NDk4MTcsImV4cCI6MTY4MTU0OTgyNH0.gUvQqL0E5w_6crVuXqihKpsUTRk5Hkb1Co4u8i5-dck'
      const film = {film_title: 'New film', film_link: 'https://www.youtube.com/watch?v=I0kVNMHo6fQ' };
      const res = await request(app).post('/films/add_film')
                                    .send(film)
                                    .set('Authorization', `Bearer ${expired_token}`);
      const film_response = JSON.parse(res.text)

      expect(film_response.message).toEqual('Access token invalid');
      expect(film_response.errorCode).toEqual(1)
    })

    test('not exist user', async () => {
      const nonexist_user = {
        id: '6438350a0942d9130048a5b3',
        username: 'usertest123123133@gmail.com',
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoie1wiaWRcIjpcIjY0MzgzNTBhMDk0MmQ5MTMwMDQ4YTViM1wiLFwidXNlcm5hbWVcIjpcInVzZXJ0ZXN0MTY4MTQwNTE4ODExOEBnbWFpbC5jb21cIn0iLCJpYXQiOjE2ODE1NTUxNjV9.1sllVP4_EfA2QkTOIxSC9Hk_kXckJdKVQ3HKKkZ6CRE'
      }
      const film = {film_title: 'New film', film_link: 'https://www.youtube.com/watch?v=I0kVNMHo6fQ' };
      const response = await request(app).post('/films/add_film')
                                        .send(film)
                                        .set('Authorization', `Bearer ${nonexist_user.access_token}`);
      
      expect(JSON.parse(response.text).message).toEqual('Access token do not match');
      expect(JSON.parse(response.text).errorCode).toEqual(2)
    })
  })
})

