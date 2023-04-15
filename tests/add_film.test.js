const mongoose = require('mongoose');
const {add_film} = require('../src/controllers/film.controller');
const { Film, filmModel } = require('../src/models/film.model');
const { User, userModel } = require('../src/models/user.model');

beforeAll(() => {
  require('../src/database/connect.database')
});

afterAll(() => {
  require('../src/database/disconnect.database')
});

describe("should", () => {
  const new_film = new Film({film_title: 'New Film', flatform: 'youtube', film_link: 'http://test.com'})
  beforeAll(() => {
    require('../src/database/connect.database')
  });
  
  afterAll( async () => {
    await filmModel.deleteOne({_id: new_film._id})
    require('../src/database/disconnect.database')
  });
  const user = {_id: new mongoose.Types.ObjectId('64361c0a0b697254b47564c5')}
  
  test('add film with full information', async () => {
    const film = await add_film(new_film, user);

    expect(film.user_id).toEqual(user._id);
    expect(film._id).not.toBeNull();
  })

  test('add film without user', async () => {
    try {
      await add_film(new_film, {});
    } catch (error) {
      expect(error.message).toContain('`user_id` is required');
    }
  })

  test('add film without film url', async () => {
    try {
      await add_film({film_title: new_film.film_title, platform: 'youtube'}, user);
    } catch (error) {
      expect(error.message).toContain('`film_link` is required');
    }
  })

  test('add film without film title', async () => {
    try {
      await add_film({film_link: new_film.film_link, platform: 'youtube'}, user);
    } catch (error) {
      expect(error.message).toContain('`film_title` is required');
    }
  })

  test('add film without film', async () => {
    try {
      await add_film({}, user);
    } catch (error) {
      expect(error.message).toContain('`film_title` is required');
      expect(error.message).toContain('`film_link` is required');
    }
  })
})