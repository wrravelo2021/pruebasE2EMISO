module.exports = class HomePage {
  constructor(page) {
    this.page = page;
  }

  async goToViewSite() {
    return this.page.click('a:text("View site")');
  }

  async goToPosts() {
    return this.page.click('.gh-nav-list-new.relative > a[href="#/posts/"]');
  }

  async classicError() {
    return this.page.click('.gh-nav-list-new.relative > a[href="#/posts/"]');
  }

  async goToPages() {
    return this.page.click('a[href="#/pages/"]');
  }

  async goToPages2() {
    return this.page.click('a[href="#/pages/"]');
  }

  async goToTags() {
    return this.page.click('a[href="#/tags/"]');
  }

  async goToTags2() {
    return this.page.click('a[href="#/tags/"]');
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

  async goToViewSite() {
    return this.page.click('.relative > span > a[href="#/site/"]');
  }

  async getMessageAlertNotification() {
    const notification = await this.page.$$(".gh-alert-content");
    return notification[0].innerText();
  }

  async getMessageAlertNotification2() {
    const notification = await this.page.$$(".gh-alert-content");
    return notification[0].innerText();
  }

  async confirmLeaveCurrentPage() {
    return await this.page.click('.modal-footer > .gh-btn.gh-btn-red');
  }

  async confirmLeaveCurrentPage() {
    return await this.page.click('.modal-footer > .gh-btn.gh-btn-red');
  }

  async confirmLeaveCurrentPage() {
    return await this.page.click('.modal-footer > .gh-btn.gh-btn-red');
  }

  async confirmLeaveCurrentPage() {
    return await this.page.click('.modal-footer > .gh-btn.gh-btn-red');
  }


  async please() {

  }
};
