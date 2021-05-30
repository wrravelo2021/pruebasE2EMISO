module.exports = class PostDetailPage {
  constructor(page) {
    this.page = page;
  }

  async enterTitleForNewPost(title) {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.type('.gh-editor-title.ember-text-area.gh-input.ember-view', title);
  }

  async enterBodyForNewPost(body) {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
    return this.page.keyboard.type(body);
  }

  async clickBody() {
    return await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
  }

  async deleteTitlePost() {
    await this.page.click('.gh-editor-title.ember-text-area.gh-input.ember-view');
    await this.page.keyboard.press("Meta+A");
    await this.page.keyboard.press("Control+A");
    return this.page.keyboard.press("Delete");
  }

  async cleanTitle(){
    const title = await this.page.$('.gh-editor-title.ember-text-area.gh-input.ember-view');
    await title.fill('');
  }

  async deleteBodyPost() {
    await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
    await this.page.keyboard.press("Meta+A");
    await this.page.keyboard.press("Control+A");
    return this.page.keyboard.press("Delete");
  }

  async publishPost(body) {
    await new Promise(r => setTimeout(r, 2000));
    await this.page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    await this.page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
    await new Promise(r => setTimeout(r, 2000));
  }

  async schedulePost() {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    await this.page.click('div:text("Schedule it for later")');
    return this.page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
  }

  async unschedulePost() {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.gh-publishmenu.ember-view');
    await this.page.click('div:text("Revert to draft")');
    return this.page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
  }

  async reschedulePost(newScheduleDate) {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    await this.deleteDatePublishPost();
    await this.page.type('.gh-date-time-picker-date', newScheduleDate);
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

  async fillExcerpt(text) {
    const excerpt = await this.page.$('#custom-excerpt');
    await excerpt.fill(text);
  }

  async cleanExcerpt(){
    const title = await this.page.$('#custom-excerpt');
    await title.fill('');
  }

  async getExcerptError(){
    await new Promise(r => setTimeout(r, 1000));
    const error = await this.page.$('.response');
    return error.innerText();
  }

  async openPlusOptions() {
    await new Promise(r => setTimeout(r, 1000));
    return await this.page.click('.koenig-plus-menu-button');
  }

  async createVimeoLink(url){
    await this.page.click('div[title="Vimeo"]');
    const vimeoUrl = await this.page.$('input[name="url"]');
    await vimeoUrl.fill(url);
    await vimeoUrl.press('Enter');
    await new Promise(r => setTimeout(r, 1000));
  }

  async createYoutubeLink(url){
    await this.page.click('div[title="YouTube"]');
    const youtubeUrl = await this.page.$('input[name="url"]');
    await youtubeUrl.fill(url);
    await youtubeUrl.press('Enter');
    await new Promise(r => setTimeout(r, 1000));
  }

  async createTwitterLink(url){
    await this.page.click('div[title="Twitter"]');
    const twitterUrl = await this.page.$('input[name="url"]');
    await twitterUrl.fill(url);
    await twitterUrl.press('Enter');
    await new Promise(r => setTimeout(r, 1000));
  }

  async insertUnsplashImage(text){
    await this.page.click('div[title="Unsplash"]');
    const unsplashSearch = await this.page.$('.gh-unsplash-search');
    await unsplashSearch.fill(text);
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.absolute.top-6.right-6');
    await new Promise(r => setTimeout(r, 1000));
  }

  async createHTMLBlock(body){
    await this.page.click('div[title="HTML"]');
    await this.page.type('.CodeMirror-line span', body);
    await new Promise(r => setTimeout(r, 1000));
  }

  async getUrlParseError(){
    await new Promise(r => setTimeout(r, 1000));
    return await this.page.$('.bg-error-red');
  }

  async getExcerptErrorSaving(){
    const error = await this.page.$('.gh-alert-content');
    return error.innerText();
  }

  async assignTagWithName(name) {
    await this.page.type('.ember-power-select-trigger-multiple-input:nth-child(1)', name);
    return this.page.click('.ember-power-select-option');
  }

  async writeTagWithName(name) {
    await this.page.type('.ember-power-select-trigger-multiple-input:nth-child(1)', name);
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

  async fillHour(){
    const value = await this.page.$eval(".gh-date-time-picker-time input", e => e.value)
    const hour = parseInt(value.split(':')[0]) + 1;
    const minutes = parseInt(value.split(':')[1]);

    const hourField = await this.page.$('.gh-date-time-picker-time input');
    await hourField.fill(hour + ':' + minutes);    
    await this.page.click('.gh-date-time-picker');
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

  async clickTextareaBodyPost() {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
  }

  async isAvailableOptionPublishPost() {
    await new Promise(r => setTimeout(r, 1000));
    const optionPublishPost = await this.page.$$('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    return optionPublishPost.length ? true : false;
  }

  async clickExpandMetaData() {
    await new Promise(r => setTimeout(r, 1000));
    this.page.click('b:text("Meta data")');
  }

  async clickContractMetaData() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.back.settings-menu-header-action');
  }

  async enterMetaTitleForPost(metaTitle) {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.type('id=meta-title', metaTitle);
  }

  async enterMetaDescriptionForPost(metaDescription) {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.type('id=meta-description', metaDescription);
  }

  async goToBackSettingsPost() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.back');
  }

  async deleteMetaTitlePost() {
    await this.page.click('id=meta-title');
    await this.page.keyboard.press("Meta+A");
    await this.page.keyboard.press("Control+A");
    return this.page.keyboard.press("Delete");
  }

  async deleteDatePublishPost() {
    await this.page.click('.gh-date-time-picker-date');
    await this.page.keyboard.press("Meta+A");
    await this.page.keyboard.press("Control+A");
    return this.page.keyboard.press("Delete");
  }

  async clickPostUrl() {
    await new Promise(r => setTimeout(r, 1000));
    this.page.click('id=url');
  }

  async enterPostUrl(url) {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.fill('id=url', url);
  }

  async getUrlError(){
    await new Promise(r => setTimeout(r, 1000));
    return await this.page.$('article.gh-alert:nth-child(2) > div:nth-child(1)');
  }

  async clickExcerpt() {
    await new Promise(r => setTimeout(r, 1000));
    this.page.click('id=custom-excerpt');
  }

  async enterExcerpt(exc) {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.fill('id=custom-excerpt', exc);
  }

  async getExcError(){
    await new Promise(r => setTimeout(r, 1000));
    return await this.page.$('div.form-group:nth-child(4) > p:nth-child(3)');
  }

  async deleteInfoInputPrevSelected(){
    await new Promise(r => setTimeout(r, 1000));
    await this.page.keyboard.press("Control+A");
    await this.page.keyboard.press("Delete");
  }

  async clickSettingsBody() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.settings-menu-content');
  }

  async clickSettingsBodyMetadata() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.active > .settings-menu-content');
  }

  async clickCanUrlMetaData() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.post-setting-canonicalUrl');
  }

  async enterMetaCanUrlForPost(canUrl) {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.type('.post-setting-canonicalUrl', canUrl);
  }

  async getcanUrlError(){
    await new Promise(r => setTimeout(r, 1000));
    return await this.page.$('.error > p:nth-child(3)');
  }

  async enterbodyInterchangePost(body) {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
    await this.page.fill('.koenig-editor__editor.__mobiledoc-editor', body);
    await this.page.keyboard.press("Control+A");
    return this.page.keyboard.press("Control+C");
  }

  async clickExpandCodeInjection() {
    await new Promise(r => setTimeout(r, 1000));
    this.page.click('b:text("Code injection")');
  }

  async clickandFillPostheaderCodeInj() {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('#post-setting-codeinjection-head > div:nth-child(2) > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > div:nth-child(1) > pre:nth-child(2)');
    return this.page.keyboard.press("Control+V");
  }

  async getCodInjHeaderError(){
    await new Promise(r => setTimeout(r, 1000));
    return await this.page.$('.error > p:nth-child(3)');
  }

  async clickandFillPostfooterCodeInj() {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('#post-setting-codeinjection-foot > div:nth-child(2) > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > div:nth-child(1) > pre:nth-child(2)');
    return this.page.keyboard.press("Control+V");
  }

  async getCodInjFooterError(){
    await new Promise(r => setTimeout(r, 1000));
    return await this.page.$('div.error:nth-child(2) > p:nth-child(3)');
  }

  async fillTime(time){
    await new Promise(r => setTimeout(r, 1000));
    const dateField = await this.page.$('.gh-date-time-picker-time > input:nth-child(1)');
    await this.pressDeleteOnElement(dateField, 10);
    await dateField.type(time);
    await dateField.press('Tab');
  }
};
