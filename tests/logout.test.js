const {user_logout, user_login} = require('../src/controllers/user.controller')
const {userModel, User} = require('../src/models/user.model')

describe("should", () => {
  const usernames = ['usertest1@gmail.com', 'usertest2@gmail.com']
  const passwords = ['Khoi123@', 'Khoi123@']
  let login_user_1 = null
  let login_user_2 = null

  beforeAll(() => {
    require('../src/database/connect.database')
  });
  
  
  afterAll(() => {
    require('../src/database/disconnect.database')
  });

  describe('log out', () => {
    beforeEach(async () => {
      const user = new User({username: usernames[0], password: passwords[0]})
      login_user_1 = await user_login(user)
    })

    test("with logged in user", async () => {
      const user = {_id: login_user_1.id, username: login_user_1.username};
      
      const logged_in_user = await userModel.findOne({_id: login_user_1.id})
      await user_logout(user)
      const logged_out_user = await userModel.findOne({_id: login_user_1.id})
      expect(logged_in_user.access_token.length).not.toEqual(0);
      expect(logged_out_user.access_token).toEqual('');
    })
  })

  describe('not log out', () => {
    test('without login', async () => {
      try {
        await user_logout({})
      } catch (error) {
        expect(error.message).toEqual(undefined)
      }
    })
  })
})