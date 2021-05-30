var Mockaroo = require('mockaroo');

module.exports = class MockarooClient {

  constructor() {};

  amount = 10;
  client = new Mockaroo.Client({ apiKey: '75a05b80' });
  slugClient = new Mockaroo.Client({ apiKey: '6e06b9b0' });
  client2 = new Mockaroo.Client({apiKey: '1c3adc60'});

  async getDataPoolPosts() {
    return this.client.generate({
      count: this.amount,
      schema: 'post_schema'
    }).then(function(records) {
      return records;
    });
  }

  async getDataPoolPages() {
    return this.client.generate({
      count: this.amount,
      schema: 'page_schema'
    }).then(function(records) {
      return records;
    });
  }

  async getDataPoolTags() {
    return this.client.generate({
      count: this.amount,
      schema: 'tag_schema'
    }).then(function(records) {
      return records;
    });
  }

  async getDataPoolSlugs() {
    return this.slugClient.generate({
      count: this.amount,
      schema: 'slug_schema'
    }).then(function(records) {
      return records;
    });
  }

  async getDataPoolGeneric() {
    return this.client2.generate({
      count: this.amount,
      schema: 'schema_dynamic'
    }).then(function(records) {
      return records;
    });
  }

  async getDataPoolRandom(records) {
    let random = this.getRandom(0, records.length);
    return records[random];
  }

  getRandom(min, max) {
    let random = Math.floor(Math.random() * (max - min)) + min;
    return random;
  }
}
