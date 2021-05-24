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

  async selectFilterByScheduledPagesOption() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.ember-power-select-option:has-text("Scheduled pages")');
  }

  async clickPageWithTitle(title) {
    return this.page.click(`.gh-content-entry-title:has-text("${title}")`);
  }

  async selectFilterByDraftedPagesOption() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.ember-power-select-option:has-text("Draft pages")');
  }

  async getFirstPageTitle() {
    await new Promise(r => setTimeout(r, 1000));
    const pagesTitles = await this.page.$$(".gh-content-entry-title");
    return pagesTitles[0].innerText();
  }

  async openPageTagsFilterDropdown() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('css=div.gh-contentfilter-menu.gh-contentfilter-tag');
  }

  async selectFilterByTagName(nameTag) {
    await new Promise(r => setTimeout(r, 1000));
    await this.page.click(`li:text("${nameTag}")`);
  }

  async searchPageByName(namePage) {
    await new Promise(r => setTimeout(r, 1000));
    const pageTitles = await this.page.$$("h3.gh-content-entry-title");
    for (var i = 0; i < pageTitles.length; i++) {
      if (await pageTitles[i].innerText() === namePage) {
        return true;
      }
    }
    return false;
  }

  async openPageSortByFilterDropdown() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.ember-power-select-selected-item:has-text("Newest")');
  }

  async selectFilterByNewestPageOption() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.ember-power-select-option:has-text("Newest")');
  }

  async selectFilterByRecentlyUpPagesOption() {
    await new Promise(r => setTimeout(r, 1000));
    return this.page.click('.ember-power-select-option:has-text("Recently updated")');
  }
};
