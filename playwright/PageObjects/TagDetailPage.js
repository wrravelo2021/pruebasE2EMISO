module.exports = class TagDetailPage {
  constructor(page) {
    this.page = page;
  }

  async enterTitleForNewTag(name) {
    return this.page.type('input[name="name"]', name);
  }

  async clickSave() {
    return this.page.click('.gh-btn.gh-btn-blue.gh-btn-icon.ember-view');
  }

  async clickDelete() {
    return this.page.click('.gh-btn.gh-btn-red.gh-btn-icon.mb15');
  }

  async clickConfirmDelete() {
    return this.page.click('.gh-btn.gh-btn-red.gh-btn-icon.ember-view');
  }
};
