module.exports = class PagePreviewPage {
  constructor(page) {
    this.page = page;
  }

  async getPageBodyContent() {
    await this.page.waitForLoadState();
    return this.page.innerHTML('.post-content > p');
  }
};
