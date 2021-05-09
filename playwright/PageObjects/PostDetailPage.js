module.exports = class PostDetailPage {
  constructor(page) {
    this.page = page;
  }

  async enterTitleForNewPost(title) {
    return this.page.type('.gh-editor-title.ember-text-area.gh-input.ember-view', title);
  }

  async enterBodyForNewPost(body) {
    await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
    this.page.keyboard.type(body);
  }

  async publishPost(body) {
    await this.page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    return this.page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
  }

  async returnToPostsList(body) {
    return this.page.click('a.blue.link.fw4.flex.items-center.ember-view');
  }
};
