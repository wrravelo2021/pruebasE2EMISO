module.exports = class TagDetailPage {
  constructor(page) {
    this.page = page;
  }

  async enterTitleForNewTag(name) {
    return this.page.type('input[name="name"]', name);
  }

  async enterDescriptionForNewTag(description) {
    return this.page.type('id=tag-description', description);
  }

  async enterColorForNewTag(color) {
    return this.page.type('input[name="accent-color"]', color.replace('#', ''));
  }

  async enterMetaTitleForNewTag(metaTitle) {
    return this.page.type('id=meta-title', metaTitle);
  }

  async enterMetaDescriptionForNewTag(metaDescription) {
    return this.page.type('id=meta-description', metaDescription);
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

  async clickExpandMetaData() {
    return this.page.click('text=Expand');
  }

  async tagTitleError() {
    await new Promise(r => setTimeout(r, 1000));
    const message = await this.page.$$('.error > .response');
    return message[0].innerText();
  }

  async tagMetaTitleError() {
    await new Promise(r => setTimeout(r, 1000));
    const message = await this.page.$$('.form-group.error.ember-view > .response');
    return message[0].innerText();
  }

  async clearTagTitle() {
    await this.page.click('input[name="name"]');
    const inputValue = await this.page.$eval('input[name="name"]', el => el.value)
    for(var i = 0; i < inputValue.length; i++) {
      await this.page.keyboard.press("Backspace");
    }
    return await this.page.keyboard.press("Backspace");
  }
};
