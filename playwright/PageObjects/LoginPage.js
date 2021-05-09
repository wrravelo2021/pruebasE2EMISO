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
};
