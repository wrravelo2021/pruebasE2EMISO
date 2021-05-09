// Imports
const playwright = require('playwright');
const assert = require('assert')
const LoginPage = require('./PageObjects/LoginPage.js');
const HomePage = require('./PageObjects/HomePage.js');
const PostsPage = require('./PageObjects/PostsPage.js');
const PostDetailPage = require('./PageObjects/PostDetailPage.js');
const ProfilePage = require('./PageObjects/ProfilePage.js');

// Credentials
const url = 'http://localhost:2368/ghost';
let email = "drummerwilliam@gmail.com";
let password = "pruebasmiso";

// Tests
let browser;
let page;
let context;

beforeEach(async() => {
  browser = await playwright['chromium'].launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
});

afterEach(async () => {
  await browser.close();
});

it('should publish post and remain publish even if I log out and log in again', async () => {
  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(url);
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title)
  await postDetailPage.enterBodyForNewPost(body);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.closePublishedPostNotification();
  await homePage.signOut();
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByPublishedPostsOption();

  let firstPostTitle = await postsPage.getFirstPostTitle();
  assert.equal(firstPostTitle, title);
});

it('should publish a drafted post', async () => {
  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(url);
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title)
  await postDetailPage.enterBodyForNewPost(body);
  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByDraftedPostsOption();

  var firstPostTitle = await postsPage.getFirstPostTitle();
  assert.equal(firstPostTitle, title);

  await postsPage.clickPostWithTitle(title);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.closePublishedPostNotification();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByPublishedPostsOption();

  var firstPostTitle = await postsPage.getFirstPostTitle();
  assert.equal(firstPostTitle, title);
});

it('should change user password', async () => {
  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`
  let newPassword = "newpruebasmiso";

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(url);
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(password);
  await profilePage.enterNewPassword(newPassword);
  await profilePage.enterNewPasswordConfirmation(newPassword);
  await profilePage.clickChangePassword();
  await homePage.signOut();
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(newPassword);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(newPassword);
  await profilePage.enterNewPassword(password);
  await profilePage.enterNewPasswordConfirmation(password);
  await profilePage.clickChangePassword();
});

describe.skip('buenas', () => {

it('should edit a page', async () => {
  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`

  await page.goto(url);
  await page.type('input[name="identification"]', email);
  await page.type('input[name="password"]', password);
  await page.click('css=button.login');
  await page.click('a[href="#/pages/"]');
  await page.click('a[href="#/editor/page/"]');
  await page.type('.gh-editor-title.ember-text-area.gh-input.ember-view', title);
  await page.click('.koenig-editor__editor.__mobiledoc-editor');
  await page.keyboard.type(body);
  await page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
  await page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
  await page.click('a[href="#/pages/"].blue.link.fw4.flex.items-center.ember-view');
  await page.click('span:has-text("All pages")');
  await new Promise(r => setTimeout(r, 1000));
  await page.click('.ember-power-select-option:has-text("Published pages")');
  await new Promise(r => setTimeout(r, 1000));
  await page.click(`.gh-content-entry-title:has-text("${title}")`);
  await page.click('.post-settings');

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('.post-view-link')
  ])
  await newPage.waitForLoadState();
  var bodyText = await newPage.innerHTML('.post-content > p');
  assert.equal(bodyText, body);

  let newBody = `${Date.now()} new body.`;
  await page.click('.close.settings-menu-header-action');
  await page.click('.koenig-editor__editor.__mobiledoc-editor');
  for(var i = 0; i < body.length + 1; i++) {
    await page.keyboard.press("Backspace");
  }
  await page.keyboard.type(newBody);
  await page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
  await page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
  await page.click('.post-settings');
  const [thirdPage] = await Promise.all([
    context.waitForEvent('page'),
    page.click('.post-view-link')
  ])
  await thirdPage.waitForLoadState();
  bodyText = await thirdPage.innerHTML('.post-content > p');
  assert.equal(bodyText, newBody);
});

it('should create tag, assign that tag to a post, delete the tag and deassign the tag from the post', async () => {
  let tag = `${Date.now()}`;
  let newPassword = "newpruebasmiso";

  await page.goto(url);
  await page.type('input[name="identification"]', email);
  await page.type('input[name="password"]', password);
  await page.click('css=button.login');
  await page.click('a[href="#/tags/"]');
  await page.click('a[href="#/tags/new/"]');
  await page.type('input[name="name"]', tag);
  await page.click('.gh-btn.gh-btn-blue.gh-btn-icon.ember-view');
  await page.click('.gh-nav-list-new.relative > a[href="#/posts/"]');
  await page.click('a[href="#/editor/post/"]');

  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`;
  await page.type('.gh-editor-title.ember-text-area.gh-input.ember-view', title);
  await page.click('.koenig-editor__editor.__mobiledoc-editor');
  page.keyboard.type(body);
  await page.click('.post-settings');
  await page.type('.ember-power-select-trigger-multiple-input:nth-child(1)', tag);
  await page.click('.ember-power-select-option');

  var tags = await page.$$(".ember-power-select-multiple-option.tag-token.js-draggableObject.draggable-object.ember-view");
  assert.equal(tags.length, 1);

  let addedTagText = await tags[0].innerText();
  assert.equal(addedTagText.trim(), tag);

  await page.click('.close.settings-menu-header-action');
  await page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
  await page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
  await page.click('a[href="#/posts/"].blue.link.fw4.flex.items-center.ember-view');
  await page.click('a[href="#/tags/"]');
  await page.click(`.gh-tag-list-name:has-text("${tag}")`);
  await page.click('.gh-btn.gh-btn-red.gh-btn-icon.mb15');
  await page.click('.gh-btn.gh-btn-red.gh-btn-icon.ember-view');
  await page.click('.gh-nav-list-new.relative > a[href="#/posts/"]');
  await page.click(`.gh-content-entry-title:has-text("${title}")`);
  await page.click('.post-settings');

  tags = await page.$$(".ember-power-select-multiple-option.tag-token.js-draggableObject.draggable-object.ember-view");
  assert.equal(tags.length, 0);
});
})
