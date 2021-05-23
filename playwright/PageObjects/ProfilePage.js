module.exports = class ProfilePage {
  constructor(page) {
    this.page = page;
  }

  async scrollToBottom() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.$eval('#user-password-old', (element) => {
      element.scrollIntoView();
    });
  }

  async enterEmail(email) {
    return this.page.type('#user-email', email);
  }

  async enterWebsite(website) {
    return this.page.type('#user-website', website);
  }

  async enterOldPassword(password) {
    return this.page.type('#user-password-old', password);
  }

  async enterNewPassword(password) {
    return this.page.type('#user-password-new', password);
  }

  async enterNewPasswordConfirmation(password) {
    return this.page.type('#user-new-password-verification', password);
  }

  async clickChangePassword() {
    return this.page.click('.gh-btn.gh-btn-red.gh-btn-icon.button-change-password.ember-view');
  }

  async newPasswordErrorMessage() {
    await new Promise(r => setTimeout(r, 1000));
    const message = await this.page.$$('.form-group.error.ember-view > .response');
    return message[0].innerText();
  }

  async emailErrorMessage() {
    await new Promise(r => setTimeout(r, 1000));
    const message = await this.page.$$('.form-group.error.ember-view > .response');
    return message[0].innerText();
  }

  async websiteErrorMessage() {
    await new Promise(r => setTimeout(r, 1000));
    const message = await this.page.$$('.form-group.error.ember-view > .response');
    return message[0].innerText();
  }

  async clearNewPassword() {
    await this.page.click('#user-password-new');
    const inputValue = await this.page.$eval('#user-password-new', el => el.value)
    for(var i = 0; i < inputValue.length; i++) {
      await this.page.keyboard.press("Backspace");
    }
    return await this.page.keyboard.press("Backspace");
  }

  async clearNewPasswordConfirmation() {
    await this.page.click('#user-new-password-verification');
    const inputValue = await this.page.$eval('#user-new-password-verification', el => el.value)
    for(var i = 0; i < inputValue.length; i++) {
      await this.page.keyboard.press("Backspace");
    }
    return await this.page.keyboard.press("Backspace");
  }

  async clearEmail() {
    await this.page.click('#user-email', { clickCount: 3 });
    await new Promise(r => setTimeout(r, 1000));
    return await this.page.keyboard.press("Backspace");
  }

  async clickSave() {
    await new Promise(r => setTimeout(r, 2000));
    return this.page.click('.gh-btn.gh-btn-blue.gh-btn-icon.ember-view');
  }

  async enterSlug(slug) {
    return this.page.type('#user-slug', slug);
  }

  async clearSlug() {
    await this.page.click('#user-slug', { clickCount: 3 });
    return await this.page.keyboard.press("Backspace");
  }

  async clearWebsite() {
    await this.page.click('#user-website', { clickCount: 3 });
    return await this.page.keyboard.press("Backspace");
  }
};
