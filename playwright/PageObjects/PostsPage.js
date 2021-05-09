module.exports = class PostsPage {
  constructor(page) {
    this.page = page;
  }

  async goToCreateNewPost() {
    return this.page.click('a[href="#/editor/post/"]');
  }

  async openPostTypeFilterDropdown() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.ember-power-select-selected-item:nth-child(1)');
  }

  async selectFilterByPublishedPostsOption() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.ember-power-select-option:has-text("Published posts")');
  }

  async selectFilterByScheduledPostsOption() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.ember-power-select-option:has-text("Scheduled posts")');
  }

  async selectFilterByDraftedPostsOption() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.ember-power-select-option:has-text("Draft posts")');
  }

  async getFirstPostTitle() {
    await new Promise(r => setTimeout(r, 1000));
    const postsTitles = await this.page.$$(".gh-content-entry-title");
    return postsTitles[0].innerText();
  }

  async clickPostWithTitle(title) {
    return this.page.click(`.gh-content-entry-title:has-text("${title}")`);
  }
};
