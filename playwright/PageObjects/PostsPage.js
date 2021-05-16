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

  async openPostTagsFilterDropdown() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('css=div.gh-contentfilter-menu.gh-contentfilter-tag');
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

  async selectFilterByTagName(nameTag) {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click(`li:text("${nameTag}")`);
  }

  async getFirstPostTitle() {
    await new Promise(r => setTimeout(r, 1000));
    const postsTitles = await this.page.$$(".gh-content-entry-title");
    return postsTitles[0].innerText();
  }

  async clickPostWithTitle(title) {
    return this.page.click(`.gh-content-entry-title:has-text("${title}")`);
  }

  async openPostSortByFilterDropdown() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.ember-power-select-selected-item:has-text("Newest")');
  }

  async selectFilterByNewestPostOption() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.ember-power-select-option:has-text("Newest")');
  }
};
