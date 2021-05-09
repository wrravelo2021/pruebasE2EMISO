module.exports = class TagsPage {
  constructor(page) {
    this.page = page;
  }

  async goToCreateNewTag() {
    return this.page.click('a[href="#/tags/new/"]');
  }

  async clickPostWithName(name) {
    return this.page.click(`.gh-tag-list-name:has-text("${name}")`);
  }
};
