module.exports = class PageDetailPage {
  constructor(page) {
    this.page = page;
  }

  async enterTitleForNewPage(title) {
    await new Promise(r => setTimeout(r, 1000));
    const element = await this.page.$('.gh-editor-title.ember-text-area.gh-input.ember-view');
    return await element.fill(title);
  }

  async cleanTitle(){
    const title = await this.page.$('.gh-editor-title.ember-text-area.gh-input.ember-view');
    await title.fill('');
  }

  async enterBodyForNewPage(body) {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
    this.page.keyboard.type(body);
  }

  async clickBody() {
    return await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
  }

  async publishPage() {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    await this.page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
    await new Promise(r => setTimeout(r, 1000));
  }

  async clickPublishButton(){
    await this.page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
  }

  async schedulePage() {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    await this.page.click('div:text("Schedule it for later")');
    return this.page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
  }

  async unschedulePage() {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.gh-publishmenu.ember-view');
    await this.page.click('div:text("Revert to draft")');
    return this.page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
  }

  async reschedulePage(newScheduleDate) {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    await this.deleteDatePublishPage();
    await this.page.type('.gh-date-time-picker-date', newScheduleDate);
    return this.page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
  }

  async returnToPagesList() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('a.blue.link.fw4.flex.items-center.ember-view');
  }

  async openPageSettings() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.post-settings');
  }

  async closePageSettings() {
    await new Promise(r => setTimeout(r, 1000));
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

  async getErrorSaving(){
    const error = await this.page.$('.gh-alert-content');
    return error.innerText();
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

  async clearBody() {
    await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
    const inputValue = await this.page.$eval('.koenig-editor__editor.__mobiledoc-editor', el => el.innerText)
    for(var i = 0; i < inputValue.length; i++) {
      await this.page.keyboard.press("Backspace");
    }
    return await this.page.keyboard.press("Backspace");
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

  async isAvailableOptionPublishPage() {
    await new Promise(r => setTimeout(r, 1000));
    const optionPublishPage = await this.page.$$('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    return optionPublishPage.length ? true : false;
  }

  async deleteTitlePage() {
    await this.page.click('.gh-editor-title.ember-text-area.gh-input.ember-view');
    await this.page.keyboard.press("Meta+A");
    await this.page.keyboard.press("Control+A");
    return this.page.keyboard.press("Delete");
  }

  async clickTextareaBodyPage() {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.koenig-editor__editor.__mobiledoc-editor');
  }

  async clickExpandMetaDataPage() {
    await new Promise(r => setTimeout(r, 1000));
    this.page.click('b:text("Meta data")');
  }

  async clickContractMetaDataPage() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.back.settings-menu-header-action');
  }

  async enterMetaTitleForPage(metaTitle) {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.type('id=meta-title', metaTitle);
  }

  async enterMetaDescriptionForPage(metaDescription) {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.type('id=meta-description', metaDescription);
  }

  async deleteMetaTitlePage() {
    await this.page.click('id=meta-title');
    await this.page.keyboard.press("Meta+A");
    await this.page.keyboard.press("Control+A");
    return this.page.keyboard.press("Delete");
  }

  async deleteDatePublishPage() {
    await this.page.click('.gh-date-time-picker-date');
    await this.page.keyboard.press("Meta+A");
    await this.page.keyboard.press("Control+A");
    return this.page.keyboard.press("Delete");
  }

  async assignTagWithName(name) {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.type('.ember-power-select-trigger-multiple-input:nth-child(1)', name);
    return this.page.click('.ember-power-select-option');
  }

  async openPlusOptions() {
    await new Promise(r => setTimeout(r, 1000));
    return await this.page.click('.koenig-plus-menu-button');
  }

  async createHTMLBlock(body){
    await this.page.click('div[title="HTML"]');
    await this.page.type('.CodeMirror-line span', body);
    await new Promise(r => setTimeout(r, 1000));
  }

  async createSpotifyLink(url){
    await this.page.click('div[title="Spotify"]');
    const spotifyUrl = await this.page.$('input[name="url"]');
    await spotifyUrl.fill(url);
    await spotifyUrl.press('Enter');
    await new Promise(r => setTimeout(r, 1000));
  }

  async createCodepenLink(url){
    await this.page.click('div[title="CodePen"]');
    const codepenUrl = await this.page.$('input[name="url"]');
    await codepenUrl.fill(url);
    await codepenUrl.press('Enter');
    await new Promise(r => setTimeout(r, 1000));
  }

  async createSoundCloudLink(url){
    await this.page.click('div[title="SoundCloud"]');
    const codepenUrl = await this.page.$('input[name="url"]');
    await codepenUrl.fill(url);
    await codepenUrl.press('Enter');
    await new Promise(r => setTimeout(r, 1000));
  }

  async getUrlParseError(){
    await new Promise(r => setTimeout(r, 1000));
    return await this.page.$('.bg-error-red');
  }

  async insertUnsplashImage(text){
    await this.page.click('div[title="Unsplash"]');
    const unsplashSearch = await this.page.$('.gh-unsplash-search');
    await unsplashSearch.fill(text);
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.absolute.top-6.right-6');
    await new Promise(r => setTimeout(r, 1000));
  }

  async closeSaveModal(){
    await this.page.click('.modal-content a');
  }

  async clickDeletePage() {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('.gh-btn.gh-btn-hover-red.gh-btn-icon.settings-menu-delete-button');
  }

  async clickConfirmDeletePage() {
    return this.page.click('.gh-btn.gh-btn-red.gh-btn-icon.ember-view');
  }

  async clickPageUrl() {
    await new Promise(r => setTimeout(r, 1000));
    this.page.click('id=url');
  }

  async enterPageUrl(url) {
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
    await this.page.keyboard.press("Control+A");
    await this.page.keyboard.press("Delete");
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

  async enterMetaCanUrlForPage(canUrl) {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.type('.post-setting-canonicalUrl', canUrl);
  }

  async getcanUrlError(){
    await new Promise(r => setTimeout(r, 1000));
    return await this.page.$('.error > p:nth-child(3)');
  }

  async enterbodyInterchangePage(body) {
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

  async clickandFillPageheaderCodeInj() {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click('#post-setting-codeinjection-head > div:nth-child(2) > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(5) > div:nth-child(1) > pre:nth-child(2)');
    return this.page.keyboard.press("Control+V");
  }

  async getCodInjHeaderError(){
    await new Promise(r => setTimeout(r, 1000));
    return await this.page.$('.error > p:nth-child(3)');
  }

  async clickandFillPagefooterCodeInj() {
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
