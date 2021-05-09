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
};
