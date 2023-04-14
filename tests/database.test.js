const mongoose = require('mongoose');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("should", () => {
  test('connect to database', async () => {
    require('../src/database/connect.database')
    console.log = jest.fn();
    await sleep(5000)
    expect(console.log.mock.calls[0][0]).toBe('Connected successfully')
    expect(mongoose.connection.readyState).toEqual(1)
  });
  
  test('disconnect to database', async () => {
    require('../src/database/disconnect.database')
    await sleep(5000)
    expect(mongoose.connection.readyState).toEqual(0)
  });
})