module.exports = class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async enterEmail(email) {
    return this.page.type('input[name="identification"]', email);
  }

  async enterPassword(password) {
    return this.page.type('input[name="password"]', password);
  }

  async clickLogin() {
    return this.page.click('css=button.login');
  }

  async clearEmail() {
    await this.page.click('input[name="identification"]');
    await this.page.keyboard.press("Meta+A");
    await this.page.keyboard.press("Control+A");
    await this.page.keyboard.press("Delete");
  }

  async clearPassword() {
    await this.page.click('input[name="password"]');
    await this.page.keyboard.press("Meta+A");
    await this.page.keyboard.press("Control+A");
    await this.page.keyboard.press("Delete");
  }

  async getMessageError() {
    await new Promise(r => setTimeout(r, 1000));
    const message = await this.page.$$(".main-error");
    return message[0].innerText();
  }
};
