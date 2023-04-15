const { filmModel } = require('../src/models/film.model');
const request = require('supertest')
const app = require('../app')

describe('Should', () => {
  beforeAll(() => {
    require('../src/database/connect.database')
  });
  
  afterAll(() => {
    require('../src/database/disconnect.database')
  });

  test('list all films', async () => {
    const res = await request(app).get('/films/list_films');
    const all_films_request = JSON.parse(res.text);
    const all_films_query = await filmModel.find({});
    
    expect(all_films_request.message).toEqual('Success');
    expect(all_films_request.data.length).toEqual(all_films_query.length);
  })
})