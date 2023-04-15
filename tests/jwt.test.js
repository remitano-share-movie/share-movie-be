const { User } = require('../src/models/user.model');
const jwt = require('../src/services/jwt.service')
const jwtService = new jwt()

require("dotenv").config();

describe("should", () => {
  let user = new User({id: '123', username: 'user_test'});
  let access_token = '';

  test('generate jwt token', async () => {
    access_token = jwtService.generateJwt(user);

    expect(access_token).not.toEqual('');
  });

  test('verify jwt token', () => {
    const data = jwtService.verifyJwt(access_token);

    expect(data.username).toEqual(user.username);
    expect(data.id).toEqual(user._id)
  })

  test('not verify jwt token', () => {
    const data = jwtService.verifyJwt(access_token+'1');

    expect(data).toEqual(null);
  })
})