const {user_register} = require('../src/controllers/user.controller')
const {userModel, User} = require('../src/models/user.model')

describe("should", () => {
  const usernames = {
    existent_username: 'usertest1@gmail.com',
    nonexistent_username: `usertest${Number(new Date())}@gmail.com`
  }
  const password = '132123123'

  beforeAll(() => {
    require('../src/database/connect.database')
  });
  
  
  afterAll(() => {
    require('../src/database/disconnect.database')
  });

  test("register with exist account", async () => {
    let user = new User({username: usernames['existent_username'], password: password});
    try {
      await user_register(user)
    } catch (error) {
      expect(error.error).toContain('duplicate key');
      expect(error.message).toEqual('Register fail! Username existed');
    }
  })

  test("not register with non-exist account", async () => {
    let user = new User({username: usernames['nonexistent_username'], password: password});
    await user_register(user);
    const registered_user = await userModel.findOne({username: usernames['nonexistent_username']});

    expect(registered_user).not.toBeNull();

  })

  describe('not register without', () => {
    test("username", async () => {
      let user = new User({password: password});
      try {
        await user_register(user);
      } catch (error) {
        expect(error.error).toContain('`username` is required');
      }
    })

    test("password", async () => {
      let user = new User({username: usernames['nonexistent_username']+'1'});
      try {
        await user_register(user);
      } catch (error) {
        expect(error.error).toContain('`username` is required');
      }
    })

    test("username and password", async () => {
      let user = new User({});
      try {
        await user_register(user);
      } catch (error) {
        expect(error.error).toContain('`username` is required');
      }
    })
  })
})