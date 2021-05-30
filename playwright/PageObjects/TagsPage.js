module.exports = class TagsPage {
  constructor(page) {
    this.page = page;
  }

  async goToCreateNewTag() {
    return this.page.click('a[href="#/tags/new/"]');
  }

  async clickTagWithName(name) {
    return this.page.click(`.gh-tag-list-name:has-text("${name}")`);
  }

  async searchTagByName(nameTag) {
    await new Promise(r => setTimeout(r, 1000));
    const tagsTitles = await this.page.$$("h3.gh-tag-list-name");
    for (var i = 0; i < tagsTitles.length; i++) {
      if (await tagsTitles[i].innerText() === nameTag) {
        return true;
      }
    }
    return false;
  }

  async clickInternalTags() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('span:text("Internal tags")');
  }

  async clickPublicTags() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('span:text("Public tags")');
  }
};
