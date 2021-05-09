// Imports
const playwright = require('playwright');
const assert = require('assert')
const LoginPage = require('./PageObjects/LoginPage.js');
const HomePage = require('./PageObjects/HomePage.js');
const PostsPage = require('./PageObjects/PostsPage.js');
const PostDetailPage = require('./PageObjects/PostDetailPage.js');
const ProfilePage = require('./PageObjects/ProfilePage.js');
const PagesPage = require('./PageObjects/PagesPage.js');
const PageDetailPage = require('./PageObjects/PageDetailPage.js');
const PagePreviewPage = require('./PageObjects/PagePreviewPage.js');
const TagsPage = require('./PageObjects/TagsPage.js');
const TagDetailPage = require('./PageObjects/TagDetailPage.js');
const ViewSitePage = require('./PageObjects/ViewSitePage');

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

it('should schedule a new post and filter it in the list of posts by scheduled status.', async () => {
  const test = 'F11';
  const titlePost = "Escenario de prueba: " + test +  ' - ' + Date.now();
  const bodyPost = "Este es un nuevo post creado para el escenario de prueba: " + test;
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
  await postDetailPage.enterTitleForNewPost(titlePost);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await postDetailPage.schedulePost();
  await postDetailPage.returnToPostsList();
  await homePage.closePublishedPostNotification();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByScheduledPostsOption();

  let firstPostTitle = await postsPage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost);
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

it('should create a post, then modify it and validate that the modification was made.', async () => {
  const test = 'F12';
  const titlePost = "Escenario de prueba: " + test +  ' - ' + Date.now();
  const bodyPost = "Este es un nuevo post creado para el escenario de prueba: " + test;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const viewSitePage = new ViewSitePage(page);

  await page.goto(url);
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.closePublishedPostNotification();
  await homePage.goToViewSite();

  let firstPostTitle = await viewSitePage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost);

  await homePage.goToPosts();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByPublishedPostsOption();
  await postsPage.clickPostWithTitle(titlePost);
  await postDetailPage.deleteTitlePost();
  await postDetailPage.deleteBodyPost();
  await postDetailPage.enterTitleForNewPost(titlePost + ' (Modificado)');
  await postDetailPage.enterBodyForNewPost(bodyPost + ' (Modificado)');
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.closePublishedPostNotification();
  await homePage.goToViewSite();

  firstPostTitle = await viewSitePage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost + ' (Modificado)');
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

it('should edit a page', async () => {
  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(url);
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(title);
  await pageDetailPage.enterBodyForNewPage(body);
  await pageDetailPage.publishPage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();
  await pagesPage.clickPageWithTitle(title)
  await pageDetailPage.openPageSettings();

  let [secondPage] = await pageDetailPage.openPagePreviewWithContext(context);
  var pagePreviewPage = new PagePreviewPage(secondPage);
  var pageBodyContent = await pagePreviewPage.getPageBodyContent();
  assert.equal(pageBodyContent.trim(), body);

  let newBody = `${Date.now()} new body.`;
  await pageDetailPage.closePageSettings();
  for(var i = 0; i < body.length + 1; i++) {
    await pageDetailPage.eraseOneCharacterFromBodyContent();
  }
  await pageDetailPage.enterBodyForNewPage(newBody);
  await pageDetailPage.publishPage();

  let [thirdPage] = await pageDetailPage.openPagePreviewWithContext(context);
  pagePreviewPage = new PagePreviewPage(thirdPage);
  pageBodyContent = await pagePreviewPage.getPageBodyContent();
  assert.equal(pageBodyContent.trim(), newBody);
});

it('should create tag, assign that tag to a post, delete the tag and deassign the tag from the post', async () => {
  let tag = `${Date.now()}`;
  let newPassword = "newpruebasmiso";

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(url);
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(tag);
  await tagDetailPage.clickSave();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();

  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`;
  await postDetailPage.enterTitleForNewPost(title)
  await postDetailPage.enterBodyForNewPost(body);
  await postDetailPage.openPostSettings();
  await postDetailPage.assignTagWithName(tag);

  var tags = await postDetailPage.getTagsName();
  assert.equal(tags.length, 1);

  let addedTagText = await tags[0].innerText();
  assert.equal(addedTagText.trim(), tag);

  await postDetailPage.closePostSettings();
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.goToTags();
  await tagsPage.clickTagWithName(tag);
  await tagDetailPage.clickDelete();
  await tagDetailPage.clickConfirmDelete();
  await homePage.goToPosts();
  await postsPage.clickPostWithTitle(title);
  await postDetailPage.openPostSettings();

  tags = await postDetailPage.getTagsName();
  assert.equal(tags.length, 0);
});
