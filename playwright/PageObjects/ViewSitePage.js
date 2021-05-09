module.exports = class ViewSitePage {
  constructor(page) {
    this.page = page;
  }

  async getFirstPostTitle() {
    await new Promise(r => setTimeout(r, 1000));
    const elementHandle = await this.page.$('.site-frame');
    const frame = await elementHandle.contentFrame();
    const postsTitles = await frame.$$(".post-card-title");
    return postsTitles[0].innerText();
  }
};
