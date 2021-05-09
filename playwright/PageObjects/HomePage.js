module.exports = class HomePage {
  constructor(page) {
    this.page = page;
  }

  async goToPosts() {
    return this.page.click('.gh-nav-list-new.relative > a[href="#/posts/"]');
  }

  async goToPages() {
    return this.page.click('a[href="#/pages/"]');
  }

  async closePublishedPostNotification() {
    return this.page.click('.gh-notification-close');
  }

  async signOut() {
    await this.page.click('.gh-user-name.mb1');
    return this.page.click('a[href="#/signout/"]');
  }

  async goToMyProfile() {
    await this.page.click('.gh-user-name.mb1');
    return this.page.click('a:has-text("Your profile")');
  }
};
