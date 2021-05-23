module.exports = class PostDetailPage {
  constructor(page) {
    this.page = page;
  }

  async enterTitleForNewPost(title) {
    return this.page.type('.gh-editor-title.ember-text-area.gh-input.ember-view', title);
  }

  async enterBodyForNewPost(body) {
    await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
    return this.page.keyboard.type(body);
  }

  async deleteTitlePost() {
    await this.page.click('.gh-editor-title.ember-text-area.gh-input.ember-view');
    await this.page.keyboard.press("Meta+A");
    await this.page.keyboard.press("Control+A");
    return this.page.keyboard.press("Delete");
  }

  async deleteBodyPost() {
    await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
    await this.page.keyboard.press("Meta+A");
    await this.page.keyboard.press("Control+A");
    return this.page.keyboard.press("Delete");
  }

  async publishPost(body) {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    return this.page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
  }

  async schedulePost() {
    await this.page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    await this.page.click('div:text("Schedule it for later")');
    return this.page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
  }

  async returnToPostsList(body) {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('a.blue.link.fw4.flex.items-center.ember-view');
  }

  async openPostSettings() {
    return this.page.click('.post-settings');
  }

  async closePostSettings() {
    return this.page.click('.close.settings-menu-header-action');
  }

  async assignTagWithName(name) {
    await this.page.type('.ember-power-select-trigger-multiple-input:nth-child(1)', name);
    return this.page.click('.ember-power-select-option');
  }

  async getTagsName() {
    return this.page.$$(".ember-power-select-multiple-option.tag-token.js-draggableObject.draggable-object.ember-view");
  }

  async pressDeleteOnElement(element, n){
    for (var i = 0; i <= n; i++) {
      await element.press('Delete');
    }
  }

  async fillDate(date){
    await new Promise(r => setTimeout(r, 1000));
    const dateField = await this.page.$('.gh-date-time-picker-date input');
    await this.pressDeleteOnElement(dateField, 10);
    await dateField.type(date);
    await dateField.press('Enter');
  }

  async getFutureDateError(){
    await new Promise(r => setTimeout(r, 1000));
    return await this.page.$('.gh-date-time-picker-error');
  }
  async clickDeletePost() {
    return this.page.click('#entry-controls > div.settings-menu-pane-in.settings-menu.settings-menu-pane > div.settings-menu-content > form > button');
  }

  async clickConfirmDeletePost() {
    return this.page.click('.gh-btn.gh-btn-red.gh-btn-icon.ember-view');
  }
};
