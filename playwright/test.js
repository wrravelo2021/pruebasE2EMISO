// Imports
const playwright = require('playwright');
const assert = require('assert');
const faker = require('faker');
const config = require("./config.json");
const aPrioriData = require("./apriori.json");
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
const ViewSitePage = require('./PageObjects/ViewSitePage.js');
const MockarooClient = require('./Mockaroo/MockarooClient');
const { fake } = require('faker');

// Settings
const {viewportHeight, viewportWidth, credentials, pathScreenshots} = config;

// Tests
let browser;
let page;
let context;
let test;
let mockaroo = new MockarooClient();

before(async() => {
  dataPoolPosts = await mockaroo.getDataPoolPosts();
  dataPoolPages = await mockaroo.getDataPoolPages();
  dataPoolTags = await mockaroo.getDataPoolTags();
  dataPoolSlugs = await mockaroo.getDataPoolSlugs();
  dataPoolGeneric = await mockaroo.getDataPoolGeneric();
});

beforeEach(async() => {
  browser = await playwright['chromium'].launch({ headless: false, viewport: { width: viewportWidth, height: viewportHeight }});
  context = await browser.newContext();
  page = await context.newPage();
  dataPoolPost = await mockaroo.getDataPoolRandom(dataPoolPosts);
  dataPoolPage = await mockaroo.getDataPoolRandom(dataPoolPages);
  dataPoolTag = await mockaroo.getDataPoolRandom(dataPoolTags);
  dataPoolSlug = await mockaroo.getDataPoolRandom(dataPoolSlugs);
  dataPoolGeneric = await mockaroo.getDataPoolRandom(dataPoolGeneric);
});

afterEach(async () => {
  await browser.close();
});

it('F061 - should schedule a new post and filter it in the list of posts by scheduled status.', async () => {
  test = 'F061';
  const titlePost = dataPoolPost.title_post;
  const bodyPost = dataPoolPost.body_post;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await generateScreenshot(3);
  await postDetailPage.schedulePost();
  await generateScreenshot(4);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(5);
  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(6);
  await postsPage.selectFilterByScheduledPostsOption();
  await generateScreenshot(7);

  let firstPostTitle = await postsPage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost);
});

it('F062 - should not schedule a new post when the title has more than 255 characters.', async () => {
  test = 'F062';
  const titlePost = faker.datatype.string(256);
  const bodyPost = dataPoolPost.body_post;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  const canPublish = await postDetailPage.isAvailableOptionPublishPost();
  assert.strictEqual(false, canPublish);

  const newTitle = faker.datatype.string(255);
  await postDetailPage.deleteTitlePost();
  await postDetailPage.enterTitleForNewPost(newTitle);
  await postDetailPage.clickTextareaBodyPost();
  await postDetailPage.schedulePost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByScheduledPostsOption();

  let firstPostTitle = await postsPage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, newTitle);
});

it('F063 - should schedule a new post and then unschedule it', async () => {
  test = 'F063';
  const titlePost = dataPoolPost.title_post;
  const bodyPost = dataPoolPost.body_post;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await generateScreenshot(3);
  await postDetailPage.schedulePost();
  await generateScreenshot(4);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(5);
  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(6);
  await postsPage.selectFilterByScheduledPostsOption();
  await generateScreenshot(7);

  let firstPostTitle = await postsPage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost);

  await postsPage.clickPostWithTitle(titlePost);
  await generateScreenshot(8);
  await postDetailPage.unschedulePost();
  await generateScreenshot(9);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(10);
  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(11);
  await postsPage.selectFilterByDraftedPostsOption();
  await generateScreenshot(12);

  firstPostTitle = await postsPage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost);
});

it('F064 - should schedule a new post with metadata', async () => {
  test = 'F064';
  const titlePost = dataPoolPost.title_post;
  const bodyPost = dataPoolPost.body_post;
  const metaTitlePost = dataPoolPost.meta_title_post;
  const metaDescriptionPost = dataPoolPost.meta_description_post;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await postDetailPage.openPostSettings();
  await postDetailPage.clickExpandMetaData();
  await postDetailPage.enterMetaTitleForPost(metaTitlePost);
  await postDetailPage.enterMetaDescriptionForPost(metaDescriptionPost);
  await postDetailPage.clickContractMetaData();
  await postDetailPage.closePostSettings();
  await postDetailPage.schedulePost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByScheduledPostsOption();

  let firstPostTitle = await postsPage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost);
});

it('F065 - should not schedule a new post when the meta title has more than 300 characters.', async () => {
  test = 'F065';
  const titlePost = dataPoolPost.title_post;
  const bodyPost = dataPoolPost.body_post;
  const metaTitlePost = faker.datatype.string(301);
  const metaDescriptionPost = dataPoolPost.meta_description_post;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await postDetailPage.openPostSettings();
  await postDetailPage.clickExpandMetaData();
  await postDetailPage.enterMetaTitleForPost(metaTitlePost);
  await postDetailPage.enterMetaDescriptionForPost(metaDescriptionPost);
  await postDetailPage.clickContractMetaData();
  await postDetailPage.closePostSettings();
  await postDetailPage.schedulePost();

  let message = await homePage.getMessageAlertNotification();
  assert.strictEqual(message, "Saving failed: Meta Title cannot be longer than 300 characters.");

  const newMetaTitlePost = faker.datatype.string(300);
  await postDetailPage.openPostSettings();
  await postDetailPage.clickExpandMetaData();
  await postDetailPage.deleteMetaTitlePost();
  await postDetailPage.enterMetaTitleForPost(newMetaTitlePost);
  await postDetailPage.clickContractMetaData();
  await postDetailPage.closePostSettings();
  await postDetailPage.schedulePost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByScheduledPostsOption();

  let firstPostTitle = await postsPage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost);
});

it('F066 - should schedule a new post and then reschedule it', async () => {
  test = 'F066';
  const titlePost = dataPoolPost.title_post;
  const bodyPost = dataPoolPost.body_post;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await postDetailPage.schedulePost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByScheduledPostsOption();

  let firstPostTitle = await postsPage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost);

  const newScheduleDate = faker.date.soon(1).toISOString().split('T')[0];
  await postsPage.clickPostWithTitle(titlePost);
  await postDetailPage.reschedulePost(newScheduleDate);
  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByScheduledPostsOption();

  firstPostTitle = await postsPage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost);
});

it('F067 should create a post, then modify it and validate that the modification was made.', async () => {
  test = 'F067';
  const titlePost = dataPoolPost.title_post;
  const bodyPost = dataPoolPost.body_post;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const viewSitePage = new ViewSitePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.goToViewSite();

  let firstPostTitle = await viewSitePage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost);

  const newTitlePost = faker.datatype.string(255);
  const newBodyPost = faker.lorem.paragraphs();
  await homePage.goToPosts();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByPublishedPostsOption();
  await postsPage.clickPostWithTitle(titlePost);
  await postDetailPage.deleteTitlePost();
  await postDetailPage.deleteBodyPost();
  await postDetailPage.enterTitleForNewPost(newTitlePost);
  await postDetailPage.enterBodyForNewPost(newBodyPost);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.closePublishedPostNotification();
  await homePage.goToViewSite();

  firstPostTitle = await viewSitePage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, newTitlePost);
});

it('F068 - should create a new page and then delete it.', async () => {
  test = 'F068';
  const titlePage = dataPoolPage.title_page;
  const bodyPage = dataPoolPage.body_page;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await pageDetailPage.schedulePage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByScheduledPagesOption();

  let firstPageTitle = await pagesPage.getFirstPageTitle();
  assert.strictEqual(firstPageTitle, titlePage);

  await pagesPage.clickPageWithTitle(titlePage);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.clickDeletePage();
  await pageDetailPage.clickConfirmDeletePage();

  const existsPage = await pagesPage.searchPageByName(titlePage);
  assert.strictEqual(existsPage, false);
});

it('F069 - should change user password and login correctly.', async () => {
  test = 'F069';
  let newPassword = faker.internet.password();
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToMyProfile();
  await generateScreenshot(3);
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(credentials.password);
  await profilePage.enterNewPassword(newPassword);
  await profilePage.enterNewPasswordConfirmation(newPassword);
  await generateScreenshot(4);
  await profilePage.clickChangePassword();
  await generateScreenshot(5);
  await homePage.closePublishedPostNotification();
  await homePage.signOut();
  await generateScreenshot(6);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(newPassword)
  await generateScreenshot(7);
  await loginPage.clickLogin();
  await generateScreenshot(8);
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(newPassword);
  await profilePage.enterNewPassword(credentials.password);
  await profilePage.enterNewPasswordConfirmation(credentials.password);
  await profilePage.clickChangePassword();
});

it('F070 - should schedule a new page and filter it in the list of pages by scheduled status.', async () => {
  test = 'F070';
  const titlePage = dataPoolPage.title_page;
  const bodyPage = dataPoolPage.body_page;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPages();
  await generateScreenshot(3);
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await generateScreenshot(4);
  await pageDetailPage.schedulePage();
  await generateScreenshot(5);
  await pageDetailPage.returnToPagesList();
  await generateScreenshot(6);
  await pagesPage.openPageTypeFilterDropdown();
  await generateScreenshot(7);
  await pagesPage.selectFilterByScheduledPagesOption();
  await generateScreenshot(8);

  let firstPageTitle = await pagesPage.getFirstPageTitle();
  assert.strictEqual(firstPageTitle, titlePage);
});

it('F071 - should not schedule a new page when the title has more than 255 characters.', async () => {
  test = 'F071';
  const titlePage = faker.datatype.string(256);
  const bodyPage = dataPoolPage.body_page;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  const canPublish = await pageDetailPage.isAvailableOptionPublishPage();
  assert.strictEqual(false, canPublish);

  const newTitle = faker.datatype.string(255);
  await pageDetailPage.deleteTitlePage();
  await pageDetailPage.enterTitleForNewPage(newTitle);
  await pageDetailPage.clickTextareaBodyPage();
  await pageDetailPage.schedulePage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByScheduledPagesOption();

  let firstPageTitle = await pagesPage.getFirstPageTitle();
  assert.strictEqual(firstPageTitle, newTitle);
});

it('F072 - should schedule a new page and then unschedule it', async () => {
  test = 'F072';
  const titlePage = dataPoolPage.title_page;
  const bodyPage = dataPoolPage.body_page;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await pageDetailPage.schedulePage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByScheduledPagesOption();

  let firstPageTitle = await pagesPage.getFirstPageTitle();
  assert.strictEqual(firstPageTitle, titlePage);

  await pagesPage.clickPageWithTitle(titlePage);
  await pageDetailPage.unschedulePage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();

  firstPageTitle = await pagesPage.getFirstPageTitle();
  assert.strictEqual(firstPageTitle, titlePage);
});

it('F073 - should schedule a new page with metadata', async () => {
  test = 'F073';
  const titlePage = dataPoolPage.title_page;
  const bodyPage = dataPoolPage.body_page;
  const metaTitlePage = dataPoolPage.meta_title_page;
  const metaDescriptionPage = dataPoolPage.meta_description_page;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.clickExpandMetaDataPage();
  await pageDetailPage.enterMetaTitleForPage(metaTitlePage);
  await pageDetailPage.enterMetaDescriptionForPage(metaDescriptionPage);
  await pageDetailPage.clickContractMetaDataPage();
  await pageDetailPage.closePageSettings();
  await pageDetailPage.schedulePage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByScheduledPagesOption();

  let firstPagesTitle = await pagesPage.getFirstPageTitle();
  assert.strictEqual(firstPagesTitle, titlePage);
});

it('F074 - should not schedule a new page when the meta title has more than 300 characters.', async () => {
  test = 'F074';
  const titlePage = dataPoolPage.title_page;
  const bodyPage = dataPoolPage.body_page;
  const metaTitlePage = faker.datatype.string(301);
  const metaDescriptionPage = dataPoolPage.meta_description_page;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.clickExpandMetaDataPage();
  await pageDetailPage.enterMetaTitleForPage(metaTitlePage);
  await pageDetailPage.enterMetaDescriptionForPage(metaDescriptionPage);
  await pageDetailPage.clickContractMetaDataPage();
  await pageDetailPage.closePageSettings();
  await pageDetailPage.schedulePage();

  let message = await homePage.getMessageAlertNotification();
  assert.strictEqual(message, "Saving failed: Meta Title cannot be longer than 300 characters.");

  const newMetaTitlePage = faker.datatype.string(300);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.clickExpandMetaDataPage();
  await pageDetailPage.deleteMetaTitlePage();
  await pageDetailPage.enterMetaTitleForPage(newMetaTitlePage);
  await pageDetailPage.clickContractMetaDataPage();
  await pageDetailPage.closePageSettings();
  await pageDetailPage.schedulePage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByScheduledPagesOption();

  let firstPageTitle = await pagesPage.getFirstPageTitle();
  assert.strictEqual(firstPageTitle, titlePage);
});

it('F075 - should schedule a new page and then reschedule it', async () => {
  test = 'F075';
  const titlePage = dataPoolPage.title_page;
  const bodyPage = dataPoolPage.body_page;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await pageDetailPage.schedulePage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByScheduledPagesOption();

  let firstPageTitle = await pagesPage.getFirstPageTitle();
  assert.strictEqual(firstPageTitle, titlePage);

  const newScheduleDate = faker.date.soon(1).toISOString().split('T')[0];
  await pagesPage.clickPageWithTitle(titlePage);
  await pageDetailPage.reschedulePage(newScheduleDate);
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByScheduledPagesOption();

  firstPageTitle = await pagesPage.getFirstPageTitle();
  assert.strictEqual(firstPageTitle, titlePage);
});

it('F076 - should create a tag and then create a new post with this tag.', async () => {
  test = 'F076';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = dataPoolTag.description_tag;
  const titlePost = dataPoolPost.title_post;
  const bodyPost = dataPoolPost.body_post;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToTags();
  await generateScreenshot(3);
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await generateScreenshot(4);
  await tagDetailPage.clickSave();
  await generateScreenshot(5);
  await homePage.goToPosts();
  await generateScreenshot(6);
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await generateScreenshot(7);
  await postDetailPage.openPostSettings();
  await postDetailPage.assignTagWithName(nameTag);
  await generateScreenshot(8);
  await postDetailPage.closePostSettings();
  await postDetailPage.publishPost();
  await generateScreenshot(9);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(10);
  await postsPage.openPostTagsFilterDropdown();
  await generateScreenshot(11);
  await postsPage.selectFilterByTagName(nameTag);
  await generateScreenshot(12);

  let firstTagTitle = await postsPage.getFirstPostTitle();
  assert.strictEqual(firstTagTitle, titlePost);
});

it('F077 - should create a tag and then create a new page with this tag.', async () => {
  test = 'F077';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = dataPoolTag.description_tag;
  const titlePage = dataPoolPage.title_page;
  const bodyPage = dataPoolPage.body_page;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickSave();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.assignTagWithName(nameTag);
  await pageDetailPage.closePageSettings();
  await pageDetailPage.publishPage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTagsFilterDropdown();
  await pagesPage.selectFilterByTagName(nameTag);

  let firstTagTitle = await pagesPage.getFirstPageTitle();
  assert.strictEqual(firstTagTitle, titlePage);
});

it('F078 - should create a tag with metadata.', async () => {
  test = 'F078';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = dataPoolTag.description_tag;
  const metaTitleTag = dataPoolTag.meta_title_tag;
  const metaDescriptionTag = dataPoolTag.meta_description_tag;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickExpandMetaData();
  await tagDetailPage.enterMetaTitleForNewTag(metaTitleTag);
  await tagDetailPage.enterMetaDescriptionForNewTag(metaDescriptionTag);
  await tagDetailPage.clickSave();
  await homePage.goToTags();

  let existsTag = await tagsPage.searchTagByName(nameTag);
  assert.strictEqual(existsTag, true);
});

it('F079 - should not create a new tag when the meta title has more than 300 characteres.', async () => {
  test = 'F079';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = dataPoolTag.description_tag;
  const metaTitleTag = faker.datatype.string(301);
  const metaDescriptionTag = dataPoolTag.meta_description_tag;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickExpandMetaData();
  await tagDetailPage.enterMetaTitleForNewTag(metaTitleTag);
  await tagDetailPage.enterMetaDescriptionForNewTag(metaDescriptionTag);
  await tagDetailPage.clickSave();

  let tagMetaTitleError = await tagDetailPage.tagMetaTitleError();
  assert.strictEqual(tagMetaTitleError.trim(), 'Meta Title cannot be longer than 300 characters.');

  const correctMetaTitleTag = faker.datatype.string(300);
  await homePage.goToTags();
  await homePage.confirmLeaveCurrentPage();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickExpandMetaData();
  await tagDetailPage.enterMetaTitleForNewTag(correctMetaTitleTag);
  await tagDetailPage.enterMetaDescriptionForNewTag(metaDescriptionTag);
  await tagDetailPage.clickSave();
  await homePage.goToTags();

  let existsTag = await tagsPage.searchTagByName(nameTag);
  assert.strictEqual(existsTag, true);
});

it('F080 - should not create a new tag when the meta description has more than 500 characteres.', async () => {
  test = 'F080';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = dataPoolTag.description_tag;
  const metaTitleTag = dataPoolTag.meta_title_tag;
  const metaDescriptionTag = faker.datatype.string(501);
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickExpandMetaData();
  await tagDetailPage.enterMetaTitleForNewTag(metaTitleTag);
  await tagDetailPage.enterMetaDescriptionForNewTag(metaDescriptionTag);
  await tagDetailPage.clickSave();

  let tagMetaTitleError = await tagDetailPage.tagMetaTitleError();
  assert.strictEqual(tagMetaTitleError.trim(), 'Meta Description cannot be longer than 500 characters.');

  const correctMetaDescriptionTag = faker.datatype.string(500);
  await homePage.goToTags();
  await homePage.confirmLeaveCurrentPage();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickExpandMetaData();
  await tagDetailPage.enterMetaTitleForNewTag(metaTitleTag);
  await tagDetailPage.enterMetaDescriptionForNewTag(correctMetaDescriptionTag);
  await tagDetailPage.clickSave();
  await homePage.goToTags();

  let existsTag = await tagsPage.searchTagByName(nameTag);
  assert.strictEqual(existsTag, true);
});

it('F081 - should not create a new tag when the name has more than 191 characteres.', async () => {
  test = 'F081';
  const nameTag = faker.datatype.string(192);
  const descriptionTag = dataPoolTag.description_tag;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickSave();

  let tagDescriptionError = await tagDetailPage.tagTitleError();
  assert.strictEqual(tagDescriptionError.trim(), 'Tag names cannot be longer than 191 characters.');

  const correctNameTag = faker.datatype.string(191);
  await homePage.goToTags();
  await homePage.confirmLeaveCurrentPage();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(correctNameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickSave();
  await homePage.goToTags();

  let existsTag = await tagsPage.searchTagByName(correctNameTag);
  assert.strictEqual(existsTag, true);
});

it('F082 - should not create a new tag when the description has more than 500 characteres.', async () => {
  test = 'F082';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = faker.datatype.string(501);
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickSave();

  let tagDescriptionError = await tagDetailPage.tagMetaTitleError();
  assert.strictEqual(tagDescriptionError.trim(), 'Description cannot be longer than 500 characters.');

  const correctDescriptionTag = faker.datatype.string(500);
  await homePage.goToTags();
  await homePage.confirmLeaveCurrentPage();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(correctDescriptionTag);
  await tagDetailPage.clickSave();
  await homePage.goToTags();

  let existsTag = await tagsPage.searchTagByName(nameTag);
  assert.strictEqual(existsTag, true);
});

it('F083 - should create a new tag with a color selected.', async () => {
  test = 'F083';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = dataPoolTag.description_tag;
  const colorTag = dataPoolTag.color_tag;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.enterColorForNewTag(colorTag);
  await tagDetailPage.clickSave();
  await homePage.goToTags();

  let existsTag = await tagsPage.searchTagByName(nameTag);
  assert.strictEqual(existsTag, true);
});

it('F084 - should not create a new tag when the color value is wrong.', async () => {
  test = 'F084';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = dataPoolTag.description_tag;
  const colorTag = faker.lorem.word(6);
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.enterColorForNewTag(colorTag);
  await tagDetailPage.clickSave();

  let titleError = await tagDetailPage.tagColorError();
  assert.strictEqual(titleError.trim(), 'The color should be in valid hex format');

  const correctColorTag = dataPoolTag.color_tag;
  await homePage.goToTags();
  await homePage.confirmLeaveCurrentPage();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.enterColorForNewTag(correctColorTag);
  await tagDetailPage.clickSave();
  await homePage.goToTags();

  let existsTag = await tagsPage.searchTagByName(nameTag);
  assert.strictEqual(existsTag, true);
});

it('F085 - should create a new tag with Canonical URL.', async () => {
  test = 'F085';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = dataPoolTag.description_tag;
  const canonicalUrl = dataPoolTag.canonical_url_tag;
  const metaTitleTag = dataPoolTag.meta_title_tag;
  const metaDescriptionTag = dataPoolTag.meta_description_tag;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickExpandMetaData();
  await tagDetailPage.enterMetaTitleForNewTag(metaTitleTag);
  await tagDetailPage.enterMetaDescriptionForNewTag(metaDescriptionTag);
  await tagDetailPage.enterCanonicalUrlForNewTag(canonicalUrl);
  await tagDetailPage.clickSave();
  await homePage.goToTags();

  let existsTag = await tagsPage.searchTagByName(nameTag);
  assert.strictEqual(existsTag, true);
});

it('F086 - should not create a new tag when the canonical URL is not in the correct format.', async () => {
  test = 'F086';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = dataPoolTag.description_tag;
  const metaTitleTag = dataPoolTag.meta_title_tag;
  const metaDescriptionTag = dataPoolTag.meta_description_tag;
  const canonicalUrl = faker.lorem.word();
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickExpandMetaData();
  await tagDetailPage.enterMetaTitleForNewTag(metaTitleTag);
  await tagDetailPage.enterMetaDescriptionForNewTag(metaDescriptionTag);
  await tagDetailPage.enterCanonicalUrlForNewTag(canonicalUrl)
  await tagDetailPage.clickSave();

  let tagDescriptionError = await tagDetailPage.tagMetaTitleError();
  assert.strictEqual(tagDescriptionError.trim(), 'The url should be a valid url');

  const correctcanonicalUrl = faker.internet.url();
  await homePage.goToTags();
  await homePage.confirmLeaveCurrentPage();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickExpandMetaData();
  await tagDetailPage.enterMetaTitleForNewTag(metaTitleTag);
  await tagDetailPage.enterMetaDescriptionForNewTag(metaDescriptionTag);
  await tagDetailPage.enterCanonicalUrlForNewTag(correctcanonicalUrl)
  await tagDetailPage.clickSave();
  await homePage.goToTags();

  let existsTag = await tagsPage.searchTagByName(nameTag);
  assert.strictEqual(existsTag, true);
});

it('F087 - should create a internal tag.', async () => {
  test = 'F087';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = dataPoolTag.description_tag;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag('#' + nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickSave();
  await homePage.goToTags();
  await tagsPage.clickInternalTags();

  let existsTag = await tagsPage.searchTagByName('#' + nameTag);
  assert.strictEqual(existsTag, true);
});

it('F088 - should create a internal tag and then make it public.', async () => {
  test = 'F088';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = dataPoolTag.description_tag;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag('#' + nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickSave();
  await homePage.goToTags();
  await tagsPage.clickInternalTags();

  let existsTag = await tagsPage.searchTagByName('#' + nameTag);
  assert.strictEqual(existsTag, true);

  await tagsPage.clickTagWithName(nameTag);
  await tagDetailPage.clearTagTitle();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.clickSave();
  await tagDetailPage.returnToTagsInternalList();
  await tagsPage.clickPublicTags();

  existsTag = await tagsPage.searchTagByName(nameTag);
  assert.strictEqual(existsTag, true);
});

it('F089 - should create a new tag with a Slug.', async () => {
  test = 'F089';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = dataPoolTag.description_tag;
  const slug = faker.internet.domainWord();
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.enterSlugForNewTag(slug);
  await tagDetailPage.clickSave();
  await homePage.goToTags();

  let existsTag = await tagsPage.searchTagByName(nameTag);
  assert.strictEqual(existsTag, true);
});

it('F090 - should create a new tag with a image.', async () => {
  test = 'F090';
  const nameTag = dataPoolTag.name_tag;
  const descriptionTag = dataPoolTag.description_tag;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(nameTag);
  await tagDetailPage.enterDescriptionForNewTag(descriptionTag);
  await tagDetailPage.clickUploadTagImageFromUnsplash();
  await tagDetailPage.selectImageFromUnsplash();
  await tagDetailPage.clickSave();
  await homePage.goToTags();

  let existsTag = await tagsPage.searchTagByName(nameTag);
  assert.strictEqual(existsTag, true);
});

it('F01 - should create post with fields ok', async () => {
  test = 'F01'
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  const title = randomData['word'];
  const body = randomData['sentence'];

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPosts();
  await generateScreenshot(3);
  await postsPage.goToCreateNewPost();
  await generateScreenshot(4);
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.enterBodyForNewPost(body);
  await generateScreenshot(5);
  await postDetailPage.publishPost();
  await generateScreenshot(6);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(7);
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByPublishedPostsOption();
  await generateScreenshot(8);
  const publishedPostTitle = await postsPage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === title, "Title is not the expected");
});

it('F02 - should create post with invalid HTML blocks', async () => {
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  const title = randomData['word'];
  const block = "<" + randomData['word'] + " " + randomData['sentence'] + ">";

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.clickBody();
  await postDetailPage.openPlusOptions();
  await postDetailPage.createHTMLBlock(block);
  await postDetailPage.publishPost();

  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByPublishedPostsOption();
  const publishedPostTitle = await postsPage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === title, "Title is not the expected");
});

it('F03 - should create post with invalid Youtube urls', async () => {
  const title = dataPoolGeneric.word;
  const link = dataPoolGeneric.word + dataPoolGeneric.url;

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.clickBody();
  await postDetailPage.openPlusOptions();
  await postDetailPage.createYoutubeLink(link);

  const urlError = await postDetailPage.getUrlParseError();
  assert(urlError != null, "URL error message is null");

  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByPublishedPostsOption();
  const publishedPostTitle = await postsPage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === title, "Title is not the expected");
});

it('F04 - should create post with unsplash images', async () => {
  const title = dataPoolGeneric.word;
  const image = dataPoolGeneric.animal;

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.clickBody();
  await postDetailPage.openPlusOptions();
  await postDetailPage.insertUnsplashImage(image);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByPublishedPostsOption();
  const publishedPostTitle = await postsPage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === title, "Title is not the expected");
});

it('F05 - should create post with maximum title length', async () => {
  const longTitle = faker.lorem.words(256);
  const okTitle = faker.lorem.words(10);
  const body = faker.lorem.sentences(10);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(longTitle);
  await postDetailPage.enterBodyForNewPost(body);
  await postDetailPage.cleanTitle();
  await postDetailPage.enterTitleForNewPost(okTitle);
  await postDetailPage.enterBodyForNewPost('');
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByPublishedPostsOption();
  const publishedPostTitle = await postsPage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === okTitle, "Title is not the expected");
});

it('F06 - should create post with maximum length of title and excerpt', async () => {
  const longTitle = faker.lorem.words(256);
  const okTitle = faker.lorem.words(10);
  const longExcerpt = faker.lorem.words(256);
  const body = faker.lorem.sentences(10);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(longTitle);
  await postDetailPage.enterBodyForNewPost(body);
  await postDetailPage.openPostSettings();
  await postDetailPage.fillExcerpt(longExcerpt);
  await postDetailPage.closePostSettings();
  await postDetailPage.cleanTitle();
  await postDetailPage.enterTitleForNewPost(okTitle);
  await postDetailPage.openPostSettings();

  const excerptError = await postDetailPage.getExcerptError();
  assert(excerptError === "Excerpt cannot be longer than 300 characters.");

  await postDetailPage.cleanExcerpt();
  await postDetailPage.closePostSettings();
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByPublishedPostsOption();
  const publishedPostTitle = await postsPage.getFirstPostTitle();

  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === okTitle, "Title is not the expected");
});

it('F07 - should create post with fields ok and publish post on site', async () => {
  test = 'F07';
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  const title = randomData['word'];
  const body = randomData['sentence'];

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const viewSitePage = new ViewSitePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPosts();
  await generateScreenshot(3);
  await postsPage.goToCreateNewPost();
  await generateScreenshot(4);
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.enterBodyForNewPost(body);
  await generateScreenshot(5);
  await postDetailPage.publishPost();
  await generateScreenshot(6);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(7);
  await homePage.goToViewSite();
  await generateScreenshot(8);
  const publishedPostTitle = await viewSitePage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === title, "Title is not the expected");
});

it('F08 - should create post with invalid HTMLs and publish post on site', async () => {
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  const title = randomData['word'];
  const block = "<" + randomData['word'] + " " + randomData['sentence'] + ">";

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const viewSitePage = new ViewSitePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.clickBody();
  await postDetailPage.openPlusOptions();
  await postDetailPage.createHTMLBlock(block);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.goToViewSite();
  const publishedPostTitle = await viewSitePage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === title, "Title is not the expected");
});

it('F09 - should create post with invalid Twitter urls and publish post on site', async () => {
  const title = dataPoolGeneric.word;
  const link = dataPoolGeneric.word + dataPoolGeneric.url;

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const viewSitePage = new ViewSitePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title);

  await postDetailPage.clickBody();
  await postDetailPage.openPlusOptions();
  await postDetailPage.createTwitterLink(link);

  const urlError = await postDetailPage.getUrlParseError();
  assert(urlError != null, "URL error message is null");

  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.goToViewSite();
  const publishedPostTitle = await viewSitePage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === title, "Title is not the expected");
});

it('F10 - should create post with unplash images and publish post on site', async () => {
  const title = dataPoolGeneric.word;
  const image = dataPoolGeneric.animal;

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const viewSitePage = new ViewSitePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title);

  await postDetailPage.clickBody();
  await postDetailPage.openPlusOptions();
  await postDetailPage.insertUnsplashImage(image);

  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.goToViewSite();
  const publishedPostTitle = await viewSitePage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === title, "Title is not the expected");
});

it('F11 - should create post with maximum title length and publish post on site', async () => {
  const longTitle = faker.lorem.words(256);
  const okTitle = faker.lorem.words(10);
  const body = faker.lorem.sentences(10);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const viewSitePage = new ViewSitePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(longTitle);
  await postDetailPage.enterBodyForNewPost(body);
  await postDetailPage.cleanTitle();
  await postDetailPage.enterTitleForNewPost(okTitle);
  await postDetailPage.enterBodyForNewPost('');
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.goToViewSite();
  const publishedPostTitle = await viewSitePage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === okTitle, "Title is not the expected");
});

it('F12 - should create post with maximum length of title and excerpt and publish it on site', async () => {
  const longTitle = faker.lorem.words(256);
  const okTitle = faker.lorem.words(10);
  const longExcerpt = faker.lorem.words(256);
  const body = faker.lorem.sentences(10);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const viewSitePage = new ViewSitePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();

  await postDetailPage.enterTitleForNewPost(longTitle);
  await postDetailPage.enterBodyForNewPost(body);
  await postDetailPage.openPostSettings();
  await postDetailPage.fillExcerpt(longExcerpt);
  await postDetailPage.closePostSettings();
  await postDetailPage.cleanTitle();
  await postDetailPage.enterTitleForNewPost(okTitle);
  await postDetailPage.openPostSettings();

  const excerptError = await postDetailPage.getExcerptError();
  assert(excerptError === "Excerpt cannot be longer than 300 characters.");

  await postDetailPage.cleanExcerpt();
  await postDetailPage.closePostSettings();

  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.goToViewSite();
  const publishedPostTitle = await viewSitePage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === okTitle, "Title is not the expected");
});

it('F13 - should not allow future date for post, with body and title ok', async () => {
  test = 'F13';
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  const title = randomData['word'];
  const body = randomData['sentence'];
  const futureDate = randomData['futureDate'];

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPosts();
  await generateScreenshot(3);
  await postsPage.goToCreateNewPost();
  await generateScreenshot(4);
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.enterBodyForNewPost(body);
  await generateScreenshot(5);
  await postDetailPage.publishPost();
  await generateScreenshot(6);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(7);
  await postsPage.openPostSortByFilterDropdown();
  await postsPage.selectFilterByRecentlyUpdatedPostOption();
  await postsPage.clickPostWithTitle(title);
  await generateScreenshot(8);
  await postDetailPage.openPostSettings();
  await generateScreenshot(9);
  await postDetailPage.fillDate(futureDate);
  await generateScreenshot(10);

  const dateError = await postDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Must be in the past", "Error message is not the expected");
});

it('F14 - should not allow future hour for post, with body and title ok', async () => {
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  const title = randomData['word'];
  const body = randomData['sentence'];

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.enterBodyForNewPost(body);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostSortByFilterDropdown();
  await postsPage.selectFilterByRecentlyUpdatedPostOption();
  await postsPage.clickPostWithTitle(title);
  await postDetailPage.openPostSettings();
  await postDetailPage.fillHour();

  const dateError = await postDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Must be in the past", "Error message is not the expected");
});

it('F15 - should not allow future date for post, with random tag', async () => {
  const title = dataPoolGeneric.word;
  const body = dataPoolGeneric.sentence;
  const futureDate = dataPoolGeneric.futureDate;
  const tagName = dataPoolGeneric.animal;

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.enterBodyForNewPost(body);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostSortByFilterDropdown();
  await postsPage.selectFilterByRecentlyUpdatedPostOption();
  await postsPage.clickPostWithTitle(title);
  await postDetailPage.openPostSettings();
  await postDetailPage.writeTagWithName(tagName);
  await postDetailPage.fillDate(futureDate);

  const dateError = await postDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Must be in the past", "Error message is not the expected");
});

it('F46 - should not allow future date for post, with invalid HTMLs', async () => {
  const title = dataPoolGeneric.word;
  const body = dataPoolGeneric.sentence;
  const futureDate = dataPoolGeneric.futureDate;
  const block = "<" + dataPoolGeneric.word + " " + dataPoolGeneric.animal + ">";

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.clickBody();
  await postDetailPage.openPlusOptions();
  await postDetailPage.createHTMLBlock(block);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostSortByFilterDropdown();
  await postsPage.selectFilterByRecentlyUpdatedPostOption();
  await postsPage.clickPostWithTitle(title);
  await postDetailPage.openPostSettings();
  await postDetailPage.fillDate(futureDate);

  const dateError = await postDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Must be in the past", "Error message is not the expected");
});

it('F47 - should not allow future date for post, invalid Vimeo urls', async () => {
  const title = faker.lorem.words(10);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.clickBody();
  await postDetailPage.openPlusOptions();
  await postDetailPage.createVimeoLink(faker.lorem.word(10));

  const urlError = await postDetailPage.getUrlParseError();
  assert(urlError != null, "URL error message is null");

  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostSortByFilterDropdown();
  await postsPage.selectFilterByRecentlyUpdatedPostOption();
  await postsPage.clickPostWithTitle(title);
  await postDetailPage.openPostSettings();
  const dateFuture = faker.date.future().toISOString();
  await postDetailPage.fillDate(dateFuture.split('T')[0]);

  const dateError = await postDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Must be in the past", "Error message is not the expected");
});

it('F48 - should not allow future date for post, maximum length of excerpt', async () => {
  const title = faker.lorem.words(10);
  const body = faker.lorem.sentences(10);
  const longExcerpt = faker.lorem.words(256);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.enterBodyForNewPost(body);
  await postDetailPage.openPostSettings();
  await postDetailPage.fillExcerpt(longExcerpt);
  await postDetailPage.closePostSettings();
  await postDetailPage.publishPost();

  const excerptError = await postDetailPage.getExcerptErrorSaving();
  assert(excerptError == "Saving failed: Excerpt cannot be longer than 300 characters.", "Error message doesn't match");

  await postDetailPage.openPostSettings();
  await postDetailPage.fillExcerpt('');
  await postDetailPage.closePostSettings();
  await postDetailPage.publishPost();

  await postDetailPage.returnToPostsList();
  await postsPage.openPostSortByFilterDropdown();
  await postsPage.selectFilterByRecentlyUpdatedPostOption();
  await postsPage.clickPostWithTitle(title);
  await postDetailPage.openPostSettings();
  const dateFuture = faker.date.future().toISOString();
  await postDetailPage.fillDate(dateFuture.split('T')[0]);

  const dateError = await postDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Must be in the past", "Error message is not the expected");
});

it('F49 - should publish new page with fields ok', async () => {
  test = "F49";
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  const title = randomData['word'];
  const body = randomData['sentence'];

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPages();
  await generateScreenshot(3);
  await pagesPage.goToCreateNewPage();
  await generateScreenshot(4);
  await pageDetailPage.enterTitleForNewPage(title);
  await pageDetailPage.enterBodyForNewPage(body);
  await generateScreenshot(5);
  await pageDetailPage.publishPage();
  await generateScreenshot(6);
  await pageDetailPage.returnToPagesList();
  await generateScreenshot(7);
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();
  await generateScreenshot(8);

  const publishedPageTitle = await pagesPage.getFirstPageTitle();
  assert(publishedPageTitle != null, "Title is null");
  assert(publishedPageTitle === title, "Title is not the expected");
});

it('F50 - should publish new page with invalid HTMLs', async () => {
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  const title = randomData['word'];
  const block = "<" + randomData['word'] + " " + randomData['sentence'] + ">";

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(title);
  await pageDetailPage.clickBody();
  await pageDetailPage.openPlusOptions();
  await pageDetailPage.createHTMLBlock(block);
  await pageDetailPage.publishPage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();

  const publishedPageTitle = await pagesPage.getFirstPageTitle();
  assert(publishedPageTitle != null, "Title is null");
  assert(publishedPageTitle === title, "Title is not the expected");
});

it('F51 - should publish new page with invalid CodePen urls', async () => {
  const title = dataPoolGeneric.word;
  const link = dataPoolGeneric.word + dataPoolGeneric.url;

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(title);

  await pageDetailPage.clickBody();
  await pageDetailPage.openPlusOptions();
  await pageDetailPage.createCodepenLink(link);

  const urlError = await pageDetailPage.getUrlParseError();
  assert(urlError != null, "URL error message is null");

  await pageDetailPage.publishPage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();

  const publishedPageTitle = await pagesPage.getFirstPageTitle();
  assert(publishedPageTitle != null, "Title is null");
  assert(publishedPageTitle === title, "Title is not the expected");
});

it('F52 - should publish new page with unsplash images', async () => {
  const title = dataPoolGeneric.word;
  const image = dataPoolGeneric.animal;

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(title);

  await pageDetailPage.clickBody();
  await pageDetailPage.openPlusOptions();
  await pageDetailPage.insertUnsplashImage(image);

  await pageDetailPage.publishPage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();

  const publishedPageTitle = await pagesPage.getFirstPageTitle();
  assert(publishedPageTitle != null, "Title is null");
  assert(publishedPageTitle === title, "Title is not the expected");
});

it('F53 - should publish new page with maximum title length', async () => {
  const longTitle = faker.lorem.words(256);
  const okTitle = faker.lorem.words(10);
  const body = faker.lorem.sentences(10);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(longTitle);
  await new Promise(r => setTimeout(r, 2000));
  await pageDetailPage.enterBodyForNewPage(body);
  await pageDetailPage.cleanTitle();
  await new Promise(r => setTimeout(r, 2000));
  await pageDetailPage.enterTitleForNewPage(okTitle);
  await pageDetailPage.clickBody();
  await pageDetailPage.publishPage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();

  const publishedPageTitle = await pagesPage.getFirstPageTitle();
  assert(publishedPageTitle != null, "Title is null");
  assert(publishedPageTitle === okTitle, "Title is not the expected");
});

it('F54 - should publish new page with maximum length of title and excerpt', async () => {
  const longTitle = faker.lorem.words(256);
  const longExcerpt = faker.lorem.words(256);
  const okTitle = faker.lorem.words(10);
  const body = faker.lorem.sentences(10);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(longTitle);
  await new Promise(r => setTimeout(r, 2000));
  await pageDetailPage.enterBodyForNewPage(body);

  await pageDetailPage.openPageSettings();
  await pageDetailPage.fillExcerpt(longExcerpt);
  await pageDetailPage.closePageSettings();
  await pageDetailPage.cleanTitle();
  await new Promise(r => setTimeout(r, 2000));
  await pageDetailPage.enterTitleForNewPage(okTitle);
  await pageDetailPage.openPageSettings();

  const excerptError = await pageDetailPage.getExcerptError();
  assert(excerptError === "Excerpt cannot be longer than 300 characters.");

  await pageDetailPage.cleanExcerpt();
  await pageDetailPage.closePageSettings();

  await pageDetailPage.publishPage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();

  const publishedPageTitle = await pagesPage.getFirstPageTitle();
  assert(publishedPageTitle != null, "Title is null");
  assert(publishedPageTitle === okTitle, "Title is not the expected");
});

it('F55 - should save draft and publish page with fields ok', async () => {
  test = 'F55';
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  const title = randomData['word'];
  const body = randomData['sentence'];

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPages();
  await generateScreenshot(3);
  await pagesPage.goToCreateNewPage();
  await generateScreenshot(4);
  await pageDetailPage.enterTitleForNewPage(title);
  await pageDetailPage.enterBodyForNewPage(body);
  await generateScreenshot(5);
  await pageDetailPage.returnToPagesList();
  await generateScreenshot(6);
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();
  await generateScreenshot(7);

  const draftPageTitle = await pagesPage.getFirstPageTitle();
  assert(draftPageTitle != null, "Page title is null");
  assert(draftPageTitle === title, "Page title is not the expected");

  await pagesPage.clickPageWithTitle(title);
  await generateScreenshot(8);
  await pageDetailPage.publishPage();
  await generateScreenshot(9);
  await pageDetailPage.returnToPagesList();
  await generateScreenshot(10);
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();
  await generateScreenshot(11);

  const publishedPageTitle = await pagesPage.getFirstPageTitle();
  assert(publishedPageTitle != null, "Title is null");
  assert(publishedPageTitle === title, "Title is not the expected");
});

it('F56 - should save draft and publish page with invalid spotify links', async () => {
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  const title = randomData['word'];
  const link = randomData['word'] + randomData['url'];

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(title);

  await pageDetailPage.clickBody();
  await pageDetailPage.openPlusOptions();
  await pageDetailPage.createSpotifyLink(link);

  const urlError = await pageDetailPage.getUrlParseError();
  assert(urlError != null, "URL error message is null");

  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();

  const draftPageTitle = await pagesPage.getFirstPageTitle();
  assert(draftPageTitle != null, "Page title is null");
  assert(draftPageTitle === title, "Page title is not the expected");

  await pagesPage.clickPageWithTitle(title);
  await pageDetailPage.publishPage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();

  const publishedPageTitle = await pagesPage.getFirstPageTitle();
  assert(publishedPageTitle != null, "Title is null");
  assert(publishedPageTitle === title, "Title is not the expected");
});

it('F57 - should try to save draft with title max length and publish page', async () => {
  const longTitle = dataPoolGeneric.word.repeat(256);
  const okTitle = dataPoolGeneric.word;
  const body = dataPoolGeneric.sentence;

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(longTitle);
  await pageDetailPage.enterBodyForNewPage(body);
  await pageDetailPage.returnToPagesList();
  await pageDetailPage.closeSaveModal();
  await pageDetailPage.cleanTitle();
  await pageDetailPage.enterTitleForNewPage(okTitle);
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();

  const draftPageTitle = await pagesPage.getFirstPageTitle();
  assert(draftPageTitle != null, "Page title is null");
  assert(draftPageTitle === okTitle, "Page title is not the expected");

  await pagesPage.clickPageWithTitle(okTitle);
  await pageDetailPage.publishPage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();

  const publishedPageTitle = await pagesPage.getFirstPageTitle();
  assert(publishedPageTitle != null, "Title is null");
  assert(publishedPageTitle === okTitle, "Title is not the expected");
});

it('F58 - should save draft with invalid SoundCloud urls and publish page', async () => {
  const title = dataPoolGeneric.word;
  const link = dataPoolGeneric.word + dataPoolGeneric.url;

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(title);
  await pageDetailPage.clickBody();
  await pageDetailPage.openPlusOptions();
  await pageDetailPage.createSoundCloudLink(link);

  const urlError = await pageDetailPage.getUrlParseError();
  assert(urlError != null, "URL error message is null");

  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();

  const draftPageTitle = await pagesPage.getFirstPageTitle();
  assert(draftPageTitle != null, "Page title is null");
  assert(draftPageTitle === title, "Page title is not the expected");

  await pagesPage.clickPageWithTitle(title);
  await pageDetailPage.publishPage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();

  const publishedPageTitle = await pagesPage.getFirstPageTitle();
  assert(publishedPageTitle != null, "Title is null");
  assert(publishedPageTitle === title, "Title is not the expected");
});

it('F59 - should save draft and publish page with max title length', async () => {
  const title = faker.lorem.words(10);
  const body = faker.lorem.sentences(10);
  const longTitle = faker.lorem.words(256);
  const okTitle = faker.lorem.words(10);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(title);
  await pageDetailPage.enterBodyForNewPage(body);
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();

  const draftPageTitle = await pagesPage.getFirstPageTitle();
  assert(draftPageTitle != null, "Page title is null");
  assert(draftPageTitle === title, "Page title is not the expected");

  await pagesPage.clickPageWithTitle(title);
  await new Promise(r => setTimeout(r, 1000));
  await pageDetailPage.enterTitleForNewPage(longTitle);
  await pageDetailPage.publishPage();

  const errorMessage = await pageDetailPage.getErrorSaving();
  assert(errorMessage == "Saving failed: Title cannot be longer than 255 characters.", "Error message doesn't match");

  await pageDetailPage.clickPublishButton();
  await pageDetailPage.cleanTitle();
  await new Promise(r => setTimeout(r, 2000));
  await pageDetailPage.enterTitleForNewPage(okTitle);
  await pageDetailPage.publishPage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();

  const publishedPageTitle = await pagesPage.getFirstPageTitle();
  assert(publishedPageTitle != null, "Title is null");
  assert(publishedPageTitle === okTitle, "Title is not the expected");
});

it('F60 - should save draft and publish page with max excerpt length', async () => {
  const title = faker.lorem.words(10);
  const body = faker.lorem.sentences(10);
  const longExcerpt = faker.lorem.words(256);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(title);
  await pageDetailPage.enterBodyForNewPage(body);
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();

  const draftPageTitle = await pagesPage.getFirstPageTitle();
  assert(draftPageTitle != null, "Page title is null");
  assert(draftPageTitle === title, "Page title is not the expected");

  await pagesPage.clickPageWithTitle(title);
  await new Promise(r => setTimeout(r, 1000));
  await pageDetailPage.openPageSettings();
  await pageDetailPage.fillExcerpt(longExcerpt);
  await pageDetailPage.closePageSettings();
  await pageDetailPage.publishPage();

  const errorMessage = await pageDetailPage.getErrorSaving();
  assert(errorMessage == "Saving failed: Excerpt cannot be longer than 300 characters.", "Error message doesn't match");

  await pageDetailPage.clickPublishButton();
  await pageDetailPage.openPageSettings();
  await pageDetailPage.cleanExcerpt();
  await pageDetailPage.closePageSettings();
  await pageDetailPage.publishPage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();

  const publishedPageTitle = await pagesPage.getFirstPageTitle();
  assert(publishedPageTitle != null, "Title is null");
  assert(publishedPageTitle === title, "Title is not the expected");
})

it('F91 - Crear Draft post, validarlo en la lista', async () => {
  let title = faker.name.title();
  let body = faker.lorem.sentence();

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
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
});

it('F92 - Editar Draft post, editar Post URL con texto valido', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();

  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByDraftedPostsOption();
  var firstPostTitle = await postsPage.getFirstPostTitle();
  await postsPage.clickPostWithTitle(firstPostTitle);
  await postDetailPage.openPostSettings();
  await postDetailPage.clickPostUrl();
  await postDetailPage.deleteInfoInputPrevSelected();
  await postDetailPage.enterPostUrl(faker.lorem.word(10));
  await postDetailPage.closePostSettings();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostSortByFilterDropdown();
  await postsPage.selectFilterByRecentlyUpdatedPostOption();

  var EditPostTitle = await postsPage.getFirstPostTitle();
  assert.equal(EditPostTitle, firstPostTitle);
});

it('F93 - Editar Draft post, editar Post URL con texto que supere el límite de chars', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();

  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByDraftedPostsOption();
  var firstPostTitle = await postsPage.getFirstPostTitle();
  await postsPage.clickPostWithTitle(firstPostTitle);
  await postDetailPage.openPostSettings();
  await postDetailPage.clickPostUrl();
  await postDetailPage.deleteInfoInputPrevSelected();
  await postDetailPage.enterPostUrl(faker.datatype.string(65001));
  await postDetailPage.closePostSettings();

  const urlError = await postDetailPage.getUrlError();
  const urlErrorText = urlError ? await urlError.innerText() : null;
  assert(urlErrorText != null, "Error message is null");
  assert(urlErrorText === "Request was formatted incorrectly.", "Error message is not the expected");

});

it('F94 - Editar Draft post, editar Excerpt con texto valido', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();

  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByDraftedPostsOption();
  var firstPostTitle = await postsPage.getFirstPostTitle();
  await postsPage.clickPostWithTitle(firstPostTitle);
  await postDetailPage.openPostSettings();
  await postDetailPage.clickExcerpt();
  await postDetailPage.enterExcerpt(dataPoolPost.Excerpt_OK_post);
  await postDetailPage.closePostSettings();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostSortByFilterDropdown();
  await postsPage.selectFilterByRecentlyUpdatedPostOption();

  var EditPostTitle = await postsPage.getFirstPostTitle();
  assert.equal(EditPostTitle, firstPostTitle);
});

it('F95 - Editar Draft post, editar Excerpt con texto que supere el límite de chars', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();

  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByDraftedPostsOption();
  var firstPostTitle = await postsPage.getFirstPostTitle();
  await postsPage.clickPostWithTitle(firstPostTitle);
  await postDetailPage.openPostSettings();
  await postDetailPage.clickExcerpt();
  await postDetailPage.enterExcerpt(dataPoolPost.Excerpt_FAIL_post);
  await postDetailPage.clickSettingsBody();

  const excError = await postDetailPage.getExcError();
  const excErrorText = excError ? await excError.innerText() : null;
  assert(excErrorText != null, "Error message is null");
  assert(excErrorText === "Excerpt cannot be longer than 300 characters.", "Error message is not the expected");
});

it('F96 - Editar Draft post, metadata, editar Canonical Url con texto valido', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();

  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByDraftedPostsOption();
  var firstPostTitle = await postsPage.getFirstPostTitle();
  await postsPage.clickPostWithTitle(firstPostTitle);
  await postDetailPage.openPostSettings();
  await postDetailPage.clickExpandMetaData();
  await postDetailPage.clickCanUrlMetaData();
  await postDetailPage.enterMetaCanUrlForPost(dataPoolPost.meta_url_post);
  await postDetailPage.goToBackSettingsPost();
  await postDetailPage.closePostSettings();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostSortByFilterDropdown();
  await postsPage.selectFilterByRecentlyUpdatedPostOption();

  var EditPostTitle = await postsPage.getFirstPostTitle();
  assert.equal(EditPostTitle, firstPostTitle);
});

it('F97 - Editar Draft post, metadata, editar Canonical Url con texto inválido', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();

  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByDraftedPostsOption();
  var firstPostTitle = await postsPage.getFirstPostTitle();
  await postsPage.clickPostWithTitle(firstPostTitle);
  await postDetailPage.openPostSettings();
  await postDetailPage.clickExpandMetaData();
  await postDetailPage.clickCanUrlMetaData();
  await postDetailPage.deleteInfoInputPrevSelected();
  await postDetailPage.enterMetaCanUrlForPost(faker.lorem.word());
  await postDetailPage.clickSettingsBodyMetadata();

  const canUrlError = await postDetailPage.getcanUrlError();
  const canUrlErrorText = canUrlError ? await canUrlError.innerText() : null;
  assert(canUrlErrorText != null, "Error message is null");
  assert(canUrlErrorText === "Please enter a valid URL", "Error message is not the expected");
});

it('F98 - Editar Draft post, settings, code intection, editar header con texto inválido', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();

  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByDraftedPostsOption();
  var firstPostTitle = await postsPage.getFirstPostTitle();
  await postsPage.clickPostWithTitle(firstPostTitle);
  await postDetailPage.enterbodyInterchangePost(faker.datatype.string(65536));
  await postDetailPage.openPostSettings();
  await postDetailPage.clickExpandCodeInjection();
  await postDetailPage.clickandFillPostheaderCodeInj();
  await postDetailPage.clickSettingsBodyMetadata();

  const titleCodInjError = await postDetailPage.getCodInjHeaderError();
  const titleCodInjErrorText = titleCodInjError ? await titleCodInjError.innerText() : null;
  assert(titleCodInjErrorText != null, "Error message is null");
  assert(titleCodInjErrorText === "Header code cannot be longer than 65535 characters.", "Error message is not the expected");
});

it('F99 - Editar Draft post, settings, code intection, editar footer con texto inválido', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();

  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByDraftedPostsOption();
  var firstPostTitle = await postsPage.getFirstPostTitle();
  await postsPage.clickPostWithTitle(firstPostTitle);
  await postDetailPage.enterbodyInterchangePost(faker.datatype.string(65536));
  await postDetailPage.openPostSettings();
  await postDetailPage.clickExpandCodeInjection();
  await postDetailPage.clickandFillPostfooterCodeInj();
  await postDetailPage.clickSettingsBodyMetadata();

  const titleCodInjError = await postDetailPage.getCodInjFooterError();
  const titleCodInjErrorText = titleCodInjError ? await titleCodInjError.innerText() : null;
  assert(titleCodInjErrorText != null, "Error message is null");
  assert(titleCodInjErrorText === "Footer code cannot be longer than 65535 characters.", "Error message is not the expected");
});

it('F100 - Editar Draft post, settings, ingresamos fecha de publicación en formato inválido, validar error generado', async () => {
  test = 'F100';
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPosts();
  await generateScreenshot(3);

  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(4);
  await postsPage.selectFilterByDraftedPostsOption();
  await generateScreenshot(5);
  var firstPostTitle = await postsPage.getFirstPostTitle();
  await postsPage.clickPostWithTitle(firstPostTitle);
  await generateScreenshot(6);
  await postDetailPage.openPostSettings();
  await generateScreenshot(7);
  await postDetailPage.fillDate(faker.lorem.word());
  await generateScreenshot(8);

  const dateError = await postDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Invalid date format, must be YYYY-MM-DD", "Error message is not the expected");
});

it('F101 - Editar Draft post, settings, ingresamos fecha de publicación inválida, validar error generado', async () => {
  test = 'F101';
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPosts();
  await generateScreenshot(3);

  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(4);
  await postsPage.selectFilterByDraftedPostsOption();
  await generateScreenshot(5);
  var firstPostTitle = await postsPage.getFirstPostTitle();
  await postsPage.clickPostWithTitle(firstPostTitle);
  await generateScreenshot(6);
  await postDetailPage.openPostSettings();
  await generateScreenshot(7);
  await postDetailPage.fillDate(dataPoolPost.Date_Invalid_post);
  await generateScreenshot(8);

  const dateError = await postDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Invalid date", "Error message is not the expected");
});

it('F102 - Editar Draft post, settings, ingresamos hora de publicación en formato inválido, validar error generado', async () => {
  test = 'F102';
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPosts();
  await generateScreenshot(3);

  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(4);
  await postsPage.selectFilterByDraftedPostsOption();
  await generateScreenshot(5);
  var firstPostTitle = await postsPage.getFirstPostTitle();
  await postsPage.clickPostWithTitle(firstPostTitle);
  await generateScreenshot(6);
  await postDetailPage.openPostSettings();
  await generateScreenshot(7);
  await postDetailPage.fillTime(faker.lorem.word());
  await generateScreenshot(8);

  const dateError = await postDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === 'Must be in format: "15:00"', "Error message is not the expected");
});

it('F103 - Editar Draft post, settings, ingresamos hora de publicación en formato inválido y fecha inválida, validar error compuesto', async () => {
  test = 'F103';
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPosts();
  await generateScreenshot(3);

  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(4);
  await postsPage.selectFilterByDraftedPostsOption();
  await generateScreenshot(5);
  var firstPostTitle = await postsPage.getFirstPostTitle();
  await postsPage.clickPostWithTitle(firstPostTitle);
  await generateScreenshot(6);
  await postDetailPage.openPostSettings();
  await generateScreenshot(7);
  await postDetailPage.fillTime(dataPoolPost.title_post);
  await generateScreenshot(8);
  await postDetailPage.fillDate(dataPoolPost.Date_Invalid_post);
  await generateScreenshot(9);

  const dateError = await postDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === 'Invalid dateMust be in format: "15:00"', "Error message is not the expected");
});

it('F104 - Editar Draft post, settings, ingresamos hora de publicación en formato inválido y fecha inválida, validar error compuesto', async () => {
  test = 'F104';
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPosts();
  await generateScreenshot(3);

  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(4);
  await postsPage.selectFilterByDraftedPostsOption();
  await generateScreenshot(5);
  var firstPostTitle = await postsPage.getFirstPostTitle();
  await postsPage.clickPostWithTitle(firstPostTitle);
  await generateScreenshot(6);
  await postDetailPage.openPostSettings();
  await generateScreenshot(7);
  await postDetailPage.fillTime(faker.lorem.word());
  await generateScreenshot(8);
  await postDetailPage.fillDate(faker.lorem.word());
  await generateScreenshot(9);

  const dateError = await postDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === 'Invalid date format, must be YYYY-MM-DDMust be in format: "15:00"', "Error message is not the expected");
});

it('F105 - Crear 2 post, ordenar la lista por el mas nuevo, validar en la lista que el post mas reciente esté de primeras', async () => {
  let titlePost1 = faker.name.title();
  let bodyPost1 = faker.lorem.sentence();
  let titlePost2 = faker.name.title();
  let bodyPost2 = faker.lorem.sentence();

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost1)
  await postDetailPage.enterBodyForNewPost(bodyPost1);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost2)
  await postDetailPage.enterBodyForNewPost(bodyPost2);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByPublishedPostsOption();
  await postsPage.openPostSortByFilterDropdown();
  await postsPage.selectFilterByNewestPostOption();

  var firstPostTitle = await postsPage.getFirstPostTitle();
  assert.equal(firstPostTitle, titlePost2);
});

it('F106 - Crear post, ir al sitio web, validar que esté, volver y eliminarlo, ir de nuevo al sitio web y validar que NO esté', async () => {
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];

  let titlePost = randomData['word'];
  let bodyPost = randomData['sentence'];

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const viewSitePage = new ViewSitePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost)
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.goToViewSite();

  var publishedPostTitle = await viewSitePage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === titlePost, "Title is not the expected");

  await homePage.goToPosts();
  await postsPage.clickPostWithTitle(titlePost);
  await postDetailPage.openPostSettings();
  await postDetailPage.clickDeletePost();
  await postDetailPage.clickConfirmDeletePost();
  await homePage.goToViewSite();

  publishedPostTitle = await viewSitePage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle != titlePost, "Title is not the expected");

});

it('F107 - Crear draft page, ir a lista y verificar que exista', async () => {
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];

  let titlePage = randomData['word'];
  let bodyPage = randomData['sentence'];

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();

  var firstPageTitle = await pagesPage.getFirstPageTitle();
  assert.equal(firstPageTitle, titlePage);
});

it('F108 - Editar Draft page, editar Page URL con texto valido', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagePage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();

  await pagePage.openPageTypeFilterDropdown();
  await pagePage.selectFilterByDraftedPagesOption();
  var firstPageTitle = await pagePage.getFirstPageTitle();
  await pagePage.clickPageWithTitle(firstPageTitle);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.clickPageUrl();
  await pageDetailPage.deleteInfoInputPrevSelected();
  await pageDetailPage.enterPageUrl(faker.lorem.word(10));
  await pageDetailPage.closePageSettings();
  await pageDetailPage.returnToPagesList();
  await pagePage.openPageSortByFilterDropdown();
  await pagePage.selectFilterByRecentlyUpPagesOption();

  var EditPostTitle = await pagePage.getFirstPageTitle();
  assert.equal(EditPostTitle, firstPageTitle);
});

it('F109 - Editar Draft page, editar Page URL con texto que supere el límite de chars', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();

  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();
  var firstPageTitle = await pagesPage.getFirstPageTitle();
  await pagesPage.clickPageWithTitle(firstPageTitle);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.clickPageUrl();
  await pageDetailPage.deleteInfoInputPrevSelected();
  await pageDetailPage.enterPageUrl(faker.datatype.string(65001));
  await pageDetailPage.closePageSettings();

  const urlError = await pageDetailPage.getUrlError();
  const urlErrorText = urlError ? await urlError.innerText() : null;
  assert(urlErrorText != null, "Error message is null");
  assert(urlErrorText === "Request was formatted incorrectly.", "Error message is not the expected");

});

it('F110 - Editar Draft page, settings, editar Excerpt con texto valido', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();

  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();
  var firstPageTitle = await pagesPage.getFirstPageTitle();
  await pagesPage.clickPageWithTitle(firstPageTitle);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.clickExcerpt();
  await pageDetailPage.enterExcerpt(dataPoolPage.Excerpt_OK_page);
  await pageDetailPage.closePageSettings();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageSortByFilterDropdown();
  await pagesPage.selectFilterByRecentlyUpPagesOption();

  var EditPageTitle = await pagesPage.getFirstPageTitle();
  assert.equal(EditPageTitle, firstPageTitle);
});

it('F111 - Editar Draft page, settings, editar Excerpt con texto que supere el límite de chars', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();

  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();
  var firstPageTitle = await pagesPage.getFirstPageTitle();
  await pagesPage.clickPageWithTitle(firstPageTitle);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.clickExcerpt();
  await pageDetailPage.enterExcerpt(dataPoolPage.Excerpt_FAIL_page);
  await pageDetailPage.clickSettingsBody();

  const excError = await pageDetailPage.getExcError();
  const excErrorText = excError ? await excError.innerText() : null;
  assert(excErrorText != null, "Error message is null");
  assert(excErrorText === "Excerpt cannot be longer than 300 characters.", "Error message is not the expected");
});

it('F112 - Editar Draft Page, metadata, editar Canonical Url con texto inválido', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();

  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();
  var firstPageTitle = await pagesPage.getFirstPageTitle();
  await pagesPage.clickPageWithTitle(firstPageTitle);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.clickExpandMetaDataPage();
  await pageDetailPage.clickCanUrlMetaData();
  await pageDetailPage.deleteInfoInputPrevSelected();
  await pageDetailPage.enterMetaCanUrlForPage(faker.lorem.word());
  await pageDetailPage.clickSettingsBodyMetadata();

  const canUrlError = await pageDetailPage.getcanUrlError();
  const canUrlErrorText = canUrlError ? await canUrlError.innerText() : null;
  assert(canUrlErrorText != null, "Error message is null");
  assert(canUrlErrorText === "Please enter a valid URL", "Error message is not the expected");
});

it('F113 - Editar Draft page, settings, code intection, editar header con texto inválido', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();

  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();
  var firstPageTitle = await pagesPage.getFirstPageTitle();
  await pagesPage.clickPageWithTitle(firstPageTitle);
  await pageDetailPage.enterbodyInterchangePage(faker.datatype.string(65536));
  await pageDetailPage.openPageSettings();
  await pageDetailPage.clickExpandCodeInjection();
  await pageDetailPage.clickandFillPageheaderCodeInj();
  await pageDetailPage.clickSettingsBodyMetadata();

  const titleCodInjError = await pageDetailPage.getCodInjHeaderError();
  const titleCodInjErrorText = titleCodInjError ? await titleCodInjError.innerText() : null;
  assert(titleCodInjErrorText != null, "Error message is null");
  assert(titleCodInjErrorText === "Header code cannot be longer than 65535 characters.", "Error message is not the expected");
});

it('F114 - Editar Draft page, settings, code intection, editar footer con texto inválido', async () => {

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();

  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();
  var firstPageTitle = await pagesPage.getFirstPageTitle();
  await pagesPage.clickPageWithTitle(firstPageTitle);
  await pageDetailPage.enterbodyInterchangePage(faker.datatype.string(65536));
  await pageDetailPage.openPageSettings();
  await pageDetailPage.clickExpandCodeInjection();
  await pageDetailPage.clickandFillPagefooterCodeInj();
  await pageDetailPage.clickSettingsBodyMetadata();

  const titleCodInjError = await pageDetailPage.getCodInjFooterError();
  const titleCodInjErrorText = titleCodInjError ? await titleCodInjError.innerText() : null;
  assert(titleCodInjErrorText != null, "Error message is null");
  assert(titleCodInjErrorText === "Footer code cannot be longer than 65535 characters.", "Error message is not the expected");
});

it('F115 - Crear page, ir a lista, editar el page, ingresamos fecha de publicación futura, validar error generado', async () => {
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];

  let titlePage = randomData['word'];
  let bodyPage = randomData['sentence'];

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagesPage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await pageDetailPage.returnToPagesList();
  await pagesPage.clickPageWithTitle(titlePage);
  await pageDetailPage.openPageSettings();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  await pageDetailPage.fillDate(tomorrow.toISOString().split('T')[0]);

  const dateError = await pageDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Must be in the past", "Error message is not the expected");
});

it('F116 - Editar Draft page, settings, ingresamos fecha de publicación en formato inválido, validar error generado', async () => {
  
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();

  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();
  var firstPageTitle = await pagesPage.getFirstPageTitle();
  await pagesPage.clickPageWithTitle(firstPageTitle);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.fillDate(faker.lorem.word());

  const dateError = await pageDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Invalid date format, must be YYYY-MM-DD", "Error message is not the expected");
});

it('F117 - Editar Draft page, settings, ingresamos fecha de publicación inválida, validar error generado', async () => {
  
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();

  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();
  var firstPageTitle = await pagesPage.getFirstPageTitle();
  await pagesPage.clickPageWithTitle(firstPageTitle);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.fillDate(dataPoolPage.Date_Invalid_page);

  const dateError = await pageDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Invalid date", "Error message is not the expected");
});

it('F118 - Editar Draft page, settings, ingresamos hora de publicación en formato inválido, validar error generado', async () => {
  
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();

  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();
  var firstPageTitle = await pagesPage.getFirstPageTitle();
  await pagesPage.clickPageWithTitle(firstPageTitle);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.fillTime(faker.lorem.word());

  const dateError = await pageDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === 'Must be in format: "15:00"', "Error message is not the expected");
});

it('F119 - Editar Draft page, settings, ingresamos hora de publicación en formato inválido y fecha inválida, validar error compuesto', async () => {
  
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();

  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();
  var firstPageTitle = await pagesPage.getFirstPageTitle();
  await pagesPage.clickPageWithTitle(firstPageTitle);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.fillTime(dataPoolPage.title_page);
  await pageDetailPage.fillDate(dataPoolPage.Date_Invalid_page);

  const dateError = await pageDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === 'Invalid dateMust be in format: "15:00"', "Error message is not the expected");
});

it('F120 - Editar Draft page, settings, ingresamos hora de publicación en formato inválido y fecha inválida, validar error compuesto', async () => {
  
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPages();

  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();
  var firstPageTitle = await pagesPage.getFirstPageTitle();
  await pagesPage.clickPageWithTitle(firstPageTitle);
  await pageDetailPage.openPageSettings();
  await pageDetailPage.fillTime(faker.lorem.word());
  await pageDetailPage.fillDate(faker.lorem.word());

  const dateError = await pageDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === 'Invalid date format, must be YYYY-MM-DDMust be in format: "15:00"', "Error message is not the expected");
});

it('F16 - should publish post and remain publish even if I log out and log in again', async () => {
  test = 'F16'
  let title = faker.name.title();
  let body = faker.lorem.word(14);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPosts();
  await generateScreenshot(3);
  await postsPage.goToCreateNewPost();
  await generateScreenshot(4);
  await postDetailPage.enterTitleForNewPost(title)
  await postDetailPage.enterBodyForNewPost(body);
  await generateScreenshot(5);
  await postDetailPage.publishPost();
  await generateScreenshot(6);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(7);
  await homePage.closePublishedPostNotification();
  await generateScreenshot(8);
  await homePage.signOut();
  await generateScreenshot(9);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(10);
  await loginPage.clickLogin();
  await generateScreenshot(11);
  await homePage.goToPosts();
  await generateScreenshot(12);
  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(13);
  await postsPage.selectFilterByPublishedPostsOption();
  await generateScreenshot(14);

  let firstPostTitle = await postsPage.getFirstPostTitle();
  assert.equal(firstPostTitle, title);
});

it('F17 - should publish post with long title and remain publish even if I log out and log in again', async () => {
  let title = faker.lorem.words(201).substring(0, 201);
  let body = faker.lorem.word(14);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.enterBodyForNewPost(body);
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.closePublishedPostNotification();
  await homePage.signOut();
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToPosts();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByPublishedPostsOption();

  let firstPostTitle = await postsPage.getFirstPostTitle();
  assert.equal(firstPostTitle, title);
});

it('F18 - should publish a drafted post', async () => {
  let title = faker.name.title();
  let body = faker.lorem.word(14);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
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

it('F19 - should publish a drafted post with long title', async () => {
  let title = faker.lorem.words(201).substring(0, 201);
  let body = faker.lorem.word(14);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
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

it('F20 - should change user password and login whith wrong password', async () => {
  let newPassword = faker.internet.password();
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(credentials.password);
  await profilePage.enterNewPassword(newPassword);
  await profilePage.enterNewPasswordConfirmation(newPassword);
  await profilePage.clickChangePassword();
  await homePage.closePublishedPostNotification();
  await homePage.signOut();
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();

  let messageError = await loginPage.getMessageError();
  assert.strictEqual(messageError.trim(), "Your password is incorrect.");

  await loginPage.clearPassword();
  await loginPage.enterPassword(newPassword);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(newPassword);
  await profilePage.enterNewPassword(credentials.password);
  await profilePage.enterNewPasswordConfirmation(credentials.password);
  await profilePage.clickChangePassword();
});

it('F21 - should try to change empty password then change user password and login whith wrong password', async () => {
  let newPassword = faker.internet.password();
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(credentials.password);
  await profilePage.enterNewPassword('');
  await profilePage.enterNewPasswordConfirmation('');
  await profilePage.clickChangePassword();

  let errorMessage = await profilePage.newPasswordErrorMessage();
  assert.strictEqual(errorMessage.trim(), "Sorry, passwords can't be blank");

  await profilePage.enterNewPassword(newPassword);
  await profilePage.enterNewPasswordConfirmation(newPassword);
  await profilePage.clickChangePassword();
  await homePage.closePublishedPostNotification();
  await homePage.signOut();
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();

  let messageError = await loginPage.getMessageError();
  assert.strictEqual(messageError.trim(), "Your password is incorrect.");

  await loginPage.clearPassword();
  await loginPage.enterPassword(newPassword);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(newPassword);
  await profilePage.enterNewPassword(credentials.password);
  await profilePage.enterNewPasswordConfirmation(credentials.password);
  await profilePage.clickChangePassword();
});

it('F22 - should try to change short password then change user password and login whith wrong password', async () => {
  let newPassword = faker.internet.password();
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(credentials.password);
  await profilePage.enterNewPassword(newPassword.substring(0,2));
  await profilePage.enterNewPasswordConfirmation(newPassword.substring(0,2));
  await profilePage.clickChangePassword();

  let errorMessage = await profilePage.newPasswordErrorMessage();
  assert.strictEqual(errorMessage.trim(), "Password must be at least 10 characters long");

  await profilePage.clearNewPassword();
  await profilePage.clearNewPasswordConfirmation();
  await profilePage.enterNewPassword(newPassword);
  await profilePage.enterNewPasswordConfirmation(newPassword);
  await profilePage.clickChangePassword();
  await homePage.closePublishedPostNotification();
  await homePage.signOut();
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();

  let messageError = await loginPage.getMessageError();
  assert.strictEqual(messageError.trim(), "Your password is incorrect.");

  await loginPage.clearPassword();
  await loginPage.enterPassword(newPassword);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(newPassword);
  await profilePage.enterNewPassword(credentials.password);
  await profilePage.enterNewPasswordConfirmation(credentials.password);
  await profilePage.clickChangePassword();
});

it('F23 - should try to change only numbers password then change user password and login whith wrong password', async () => {
  let insecurePassword = `${faker.datatype.number({max: 9})}`.repeat(10);
  let newPassword = faker.internet.password();
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(credentials.password);
  await profilePage.enterNewPassword(insecurePassword);
  await profilePage.enterNewPasswordConfirmation(insecurePassword);
  await profilePage.clickChangePassword();

  let errorMessage = await profilePage.newPasswordErrorMessage();
  assert.strictEqual(errorMessage.trim(), "Sorry, you cannot use an insecure password");

  await profilePage.clearNewPassword();
  await profilePage.clearNewPasswordConfirmation();
  await profilePage.enterNewPassword(newPassword);
  await profilePage.enterNewPasswordConfirmation(newPassword);
  await profilePage.clickChangePassword();
  await homePage.closePublishedPostNotification();
  await homePage.signOut();
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();

  let messageError = await loginPage.getMessageError();
  assert.strictEqual(messageError.trim(), "Your password is incorrect.");

  await loginPage.clearPassword();
  await loginPage.enterPassword(newPassword);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(newPassword);
  await profilePage.enterNewPassword(credentials.password);
  await profilePage.enterNewPasswordConfirmation(credentials.password);
  await profilePage.clickChangePassword();
});

it('F24 - should try to change with all characters insecure password then change user password and login whith wrong password', async () => {
  test = 'F24'
  let insecurePassword = `${faker.lorem.word().substring(0,1)}`.repeat(10);
  let newPassword = faker.internet.password();
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToMyProfile();
  await generateScreenshot(3);
  await profilePage.scrollToBottom();
  await generateScreenshot(4);
  await profilePage.enterOldPassword(credentials.password);
  await generateScreenshot(5);
  await profilePage.enterNewPassword(insecurePassword);
  await generateScreenshot(6);
  await profilePage.enterNewPasswordConfirmation(insecurePassword);
  await generateScreenshot(7);
  await profilePage.clickChangePassword();
  await generateScreenshot(8);

  let errorMessage = await profilePage.newPasswordErrorMessage();
  assert.strictEqual(errorMessage.trim(), "Sorry, you cannot use an insecure password");

  await profilePage.clearNewPassword();
  await generateScreenshot(9);
  await profilePage.clearNewPasswordConfirmation();
  await generateScreenshot(10);
  await profilePage.enterNewPassword(newPassword);
  await generateScreenshot(11);
  await profilePage.enterNewPasswordConfirmation(newPassword);
  await generateScreenshot(12);
  await profilePage.clickChangePassword();
  await generateScreenshot(13);
  await homePage.closePublishedPostNotification();
  await generateScreenshot(14);
  await homePage.signOut();
  await generateScreenshot(15);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(16);
  await loginPage.clickLogin();
  await generateScreenshot(17);

  let messageError = await loginPage.getMessageError();
  assert.strictEqual(messageError.trim(), "Your password is incorrect.");

  await loginPage.clearPassword();
  await generateScreenshot(18);
  await loginPage.enterPassword(newPassword);
  await generateScreenshot(19);
  await loginPage.clickLogin();
  await generateScreenshot(20);
  await homePage.goToMyProfile();
  await generateScreenshot(21);
  await profilePage.scrollToBottom();
  await generateScreenshot(22);
  await profilePage.enterOldPassword(newPassword);
  await generateScreenshot(23);
  await profilePage.enterNewPassword(credentials.password);
  await generateScreenshot(24);
  await profilePage.enterNewPasswordConfirmation(credentials.password);
  await generateScreenshot(25);
  await profilePage.clickChangePassword();
  await generateScreenshot(26);
});

it('F25 - should try to change with more than 60 characters then change user password and login whith wrong password', async () => {
  let newPassword = `${faker.lorem.word(15)}`.repeat(6);
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(credentials.password);
  await profilePage.enterNewPassword(newPassword);
  await profilePage.enterNewPasswordConfirmation(newPassword);
  await profilePage.clickChangePassword();
  await homePage.closePublishedPostNotification();
  await homePage.signOut();
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();

  let messageError = await loginPage.getMessageError();
  assert.strictEqual(messageError.trim(), "Your password is incorrect.");

  await loginPage.clearPassword();
  await loginPage.enterPassword(newPassword);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(newPassword);
  await profilePage.enterNewPassword(credentials.password);
  await profilePage.enterNewPasswordConfirmation(credentials.password);
  await profilePage.clickChangePassword();
});

it('F26 - should edit a page', async () => {
  let title = faker.name.title();
  let body = faker.lorem.word(14);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
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

  let newBody = faker.lorem.word(14);
  await pageDetailPage.closePageSettings();
  await pageDetailPage.clearBody();
  await pageDetailPage.enterBodyForNewPage(newBody);
  await pageDetailPage.publishPage();

  let [thirdPage] = await pageDetailPage.openPagePreviewWithContext(context);
  pagePreviewPage = new PagePreviewPage(thirdPage);
  pageBodyContent = await pagePreviewPage.getPageBodyContent();
  assert.equal(pageBodyContent.trim(), newBody);
});

it('F27 - should edit a page with long title', async () => {
  let title = faker.lorem.words(201).substring(0, 201);
  let body = faker.lorem.word(14);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagesPage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
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

  let newBody = faker.lorem.word(14);
  await pageDetailPage.closePageSettings();
  await pageDetailPage.clearBody();
  await pageDetailPage.enterBodyForNewPage(newBody);
  await pageDetailPage.publishPage();

  let [thirdPage] = await pageDetailPage.openPagePreviewWithContext(context);
  pagePreviewPage = new PagePreviewPage(thirdPage);
  pageBodyContent = await pagePreviewPage.getPageBodyContent();
  assert.equal(pageBodyContent.trim(), newBody);
});

it('F28 - should create tag, assign that tag to a post, delete the tag and deassign the tag from the post', async () => {
  let tag = faker.lorem.word();

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(tag);
  await tagDetailPage.clickSave();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();

  let title = faker.name.title();
  let body = faker.lorem.word();
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

it('F29 - should try create empty tag then create tag, assign that tag to a post, delete the tag and deassign the tag from the post', async () => {
  let tag = faker.lorem.word();

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.clickSave();

  let tagTitleError = await tagDetailPage.tagTitleError();
  assert.strictEqual(tagTitleError.trim(), "You must specify a name for the tag.");

  await tagDetailPage.enterTitleForNewTag(tag);
  await tagDetailPage.clickSave();

  await homePage.goToTags();
  await homePage.confirmLeaveCurrentPage();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(tag);
  await tagDetailPage.clickSave();

  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();

  let title = faker.name.title();
  let body = faker.lorem.word();
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

it('F30 - should try create tag with title that exceeds max characters, assign that tag to a post, delete the tag and deassign the tag from the post', async () => {
  let tag = faker.lorem.word();
  let invalidTag = `${faker.lorem.word().substring(0,1)}`.repeat(192);

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(invalidTag);
  await tagDetailPage.clickSave();

  let tagTitleError = await tagDetailPage.tagTitleError();
  assert.strictEqual(tagTitleError.trim(), "Tag names cannot be longer than 191 characters.");

  await tagDetailPage.enterTitleForNewTag(tag);
  await tagDetailPage.clickSave();

  await homePage.goToTags();
  await homePage.confirmLeaveCurrentPage();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(tag);
  await tagDetailPage.clickSave();

  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();

  let title = faker.name.title();
  let body = faker.lorem.word();
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

it('F31 - should change user email and login whith wrong email', async () => {
  let newEmail = faker.internet.email();
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearEmail();
  await profilePage.enterEmail(newEmail);
  await profilePage.clickSave();
  await homePage.signOut();
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();

  let messageError = await loginPage.getMessageError();
  assert.strictEqual(messageError.trim(), "There is no user with that email address.");

  await loginPage.clearEmailWithTripleClick();
  await loginPage.enterEmail(newEmail);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearEmail();
  await profilePage.enterEmail(credentials.email);
  await profilePage.clickSave();
});

it('F32 - should try to change empty email then change user email and login whith wrong email', async () => {
  test = 'F32'
  let newEmail = faker.internet.email();
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToMyProfile();
  await generateScreenshot(3);
  await profilePage.clearEmail();
  await generateScreenshot(4);
  await profilePage.enterEmail('');
  await generateScreenshot(5);
  await profilePage.clickSave();
  await generateScreenshot(6);

  let errorMessage = await profilePage.emailErrorMessage();
  assert.strictEqual(errorMessage.trim(), "Please supply a valid email address");

  await profilePage.enterEmail(newEmail);
  await generateScreenshot(7);
  await profilePage.clickSave();
  await generateScreenshot(8);
  await homePage.signOut();
  await generateScreenshot(9);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(10);
  await loginPage.clickLogin();
  await generateScreenshot(11);

  let messageError = await loginPage.getMessageError();
  assert.strictEqual(messageError.trim(), "There is no user with that email address.");

  await loginPage.clearEmailWithTripleClick();
  await generateScreenshot(12);
  await loginPage.enterEmail(newEmail);
  await generateScreenshot(13);
  await loginPage.clickLogin();
  await generateScreenshot(14);
  await homePage.goToMyProfile();
  await generateScreenshot(15);
  await profilePage.clearEmail();
  await generateScreenshot(16);
  await profilePage.enterEmail(credentials.email);
  await generateScreenshot(17);
  await profilePage.clickSave();
  await generateScreenshot(18);
});

it('F33 - should try to change URL email then change user email and login whith wrong email', async () => {
  let newEmail = faker.internet.email();
  let invalidEmail = faker.internet.url();
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearEmail();
  await profilePage.enterEmail(invalidEmail);
  await profilePage.clickSave();

  let errorMessage = await profilePage.emailErrorMessage();
  assert.strictEqual(errorMessage.trim(), "Please supply a valid email address");

  await profilePage.clearEmail();
  await profilePage.enterEmail(newEmail);
  await profilePage.clickSave();
  await homePage.signOut();
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();

  let messageError = await loginPage.getMessageError();
  assert.strictEqual(messageError.trim(), "There is no user with that email address.");

  await loginPage.clearEmailWithTripleClick();
  await loginPage.enterEmail(newEmail);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearEmail();
  await profilePage.enterEmail(credentials.email);
  await profilePage.clickSave();
});

it('F34 - should try to change email to one that exceeds max characters then change user email and login whith wrong email', async () => {
  let newEmail = faker.internet.email();
  let invalidEmail = `${faker.lorem.word().substring(0,1).repeat(250)}@gmail.com`;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearEmail();
  await profilePage.enterEmail(invalidEmail);
  await profilePage.clickSave();

  let errorMessage = await profilePage.emailErrorMessage();
  assert.strictEqual(errorMessage.trim(), "Email is too long");

  await profilePage.clearEmail();
  await profilePage.enterEmail(newEmail);
  await profilePage.clickSave();
  await homePage.signOut();
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();

  let messageError = await loginPage.getMessageError();
  assert.strictEqual(messageError.trim(), "There is no user with that email address.");

  await loginPage.clearEmailWithTripleClick();
  await loginPage.enterEmail(newEmail);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearEmail();
  await profilePage.enterEmail(credentials.email);
  await profilePage.clickSave();
});

it('F35 - should change slug in profile', async () => {
  let newSlug = dataPoolSlug.slug;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearSlug();
  await profilePage.enterSlug(newSlug);
  await profilePage.clickSave();
  await profilePage.clickSave();
});

it('F36 - should change slug in profile with URL', async () => {
  let newSlug = dataPoolSlug.url;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearSlug();
  await profilePage.enterSlug(newSlug);
  await profilePage.clickSave();
  await profilePage.clickSave();
});

it('F37 - should change slug in profile with empty text', async () => {
  test = 'F37'
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToMyProfile();
  await generateScreenshot(3);
  await profilePage.clearSlug();
  await generateScreenshot(4);
  await profilePage.enterSlug('');
  await generateScreenshot(5);
  await profilePage.clickSave();
  await profilePage.clickSave();
  await generateScreenshot(6);
});

it('F38 - should change slug in profile with empty text', async () => {
  let slug = dataPoolSlug.sentence;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearSlug();
  await profilePage.enterSlug(slug);
  await profilePage.clickSave();
  await profilePage.clickSave();
});

it('F39 - should change slug in profile with email', async () => {
  let slug = dataPoolSlug.email;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearSlug();
  await profilePage.enterSlug(slug);
  await profilePage.clickSave();
  await profilePage.clickSave();
});

it('F40 - should change slug in profile with number of characters exceeded', async () => {
  let slug = `${dataPoolSlug.word.substring(0,1)}`.repeat(200);
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearSlug();
  await profilePage.enterSlug(slug);
  await profilePage.clickSave();
  await profilePage.clickSave();
});

it('F41 - should change website', async () => {
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  let website = randomData['url'];
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearWebsite();
  await profilePage.enterWebsite(website);
  await profilePage.clickSave();
  await profilePage.clickSave();
});

it('F42 - should try to change website with email as website', async () => {
  test = 'F42'
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  let website = randomData['email'];
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToMyProfile();
  await generateScreenshot(3);
  await profilePage.clearWebsite();
  await generateScreenshot(4);
  await profilePage.enterWebsite(website);
  await generateScreenshot(5);
  await profilePage.clickSave();
  await profilePage.clickSave();
  await generateScreenshot(6);
});

it('F43 - should try to change website with integer as website', async () => {
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  let website = `${randomData['singleDigitNumber']}`.repeat(10);
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearWebsite();
  await profilePage.enterWebsite(website);
  await profilePage.clickSave();
  await profilePage.clickSave();

  let errorMessage = await profilePage.websiteErrorMessage();
  assert.strictEqual(errorMessage.trim(), "Website is not a valid url");
});

it('F44 - should try to change website with integer as sentence', async () => {
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  let website = randomData['sentence'];
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearWebsite();
  await profilePage.enterWebsite(website);
  await profilePage.clickSave();
  await profilePage.clickSave();

  let errorMessage = await profilePage.websiteErrorMessage();
  assert.strictEqual(errorMessage.trim(), "Website is not a valid url");
});

it('F45 - should try to change website with a website that exceeds max characters', async () => {
  const randomData = aPrioriData[Math.floor(Math.random() * aPrioriData.length)];
  let website = `http://${randomData['word'].substring(0,1).repeat(2000)}.com`;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearWebsite();
  await profilePage.enterWebsite(website);
  await profilePage.clickSave();
  await profilePage.clickSave();

  let errorMessage = await profilePage.websiteErrorMessage();
  assert.strictEqual(errorMessage.trim(), "Website is not a valid url");
});

async function generateScreenshot(id, customPage) {
  await new Promise(r => setTimeout(r, 1000));
  let screenshotPage = customPage ? customPage : page;
  return await screenshotPage.screenshot({ path: `${pathScreenshots}/${test}/${id}.png` });
}
