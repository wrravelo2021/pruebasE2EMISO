var Mockaroo = require('mockaroo');

module.exports = class MockarooClient {

  constructor() {};

  amount = 10;
  client = new Mockaroo.Client({ apiKey: 'b74b0480' });

  async getDataPoolPosts() {
    return this.client.generate({
      count: this.amount,
      schema: 'test_schema'
    }).then(function(records) {
      return records;
    });
  }

  async getDataPoolPost(records) {
    let random = this.getRandom(0, records.length);
    return records[random];
  }

  getRandom(min, max) {
    let random = Math.floor(Math.random() * (max - min)) + min;
    return random;
  }
}
