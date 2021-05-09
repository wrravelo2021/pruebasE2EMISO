module.exports = class PageDetailPage {
  constructor(page) {
    this.page = page;
  }

  async enterTitleForNewPage(title) {
    return this.page.type('.gh-editor-title.ember-text-area.gh-input.ember-view', title);
  }

  async enterBodyForNewPage(body) {
    await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
    this.page.keyboard.type(body);
  }

  async publishPage() {
    await this.page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    return this.page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
  }

  async returnToPagesList() {
    return this.page.click('a.blue.link.fw4.flex.items-center.ember-view');
  }

  async openPageSettings() {
    return this.page.click('.post-settings');
  }

  async closePageSettings() {
    return this.page.click('.close.settings-menu-header-action');
  }

  async openPagePreviewWithContext(context) {
    return Promise.all([
      context.waitForEvent('page'),
      this.page.click('.post-view-link')
    ])
  }

  async eraseOneCharacterFromBodyContent() {
    await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
    return this.page.keyboard.press("Backspace");
  }
};
