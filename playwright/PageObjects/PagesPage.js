module.exports = class PagesPage {
  constructor(page) {
    this.page = page;
  }

  async goToCreateNewPage() {
    return this.page.click('a[href="#/editor/page/"]');
  }

  async openPageTypeFilterDropdown() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.ember-power-select-selected-item:nth-child(1)');
  }

  async selectFilterByPublishedPagesOption() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.ember-power-select-option:has-text("Published pages")');
  }

  async clickPageWithTitle(title) {
    return this.page.click(`.gh-content-entry-title:has-text("${title}")`);
  }
};