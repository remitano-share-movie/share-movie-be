const {list_films} = require('../src/controllers/film.controller')

describe("should", () => {
  beforeAll(() => {
    require('../src/database/connect.database')
  });
  
  
  afterAll(() => {
    require('../src/database/disconnect.database')
  });
  
  test('list all films', async () => {
    const films = await list_films();

    expect(Array.isArray(films)).toEqual(true);
  })
})