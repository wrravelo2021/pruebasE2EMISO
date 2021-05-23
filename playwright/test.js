// Imports
const playwright = require('playwright');
const assert = require('assert')
const config = require("./config.json");
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

// Setings
const {viewportHeight, viewportWidth, credentials, pathScreenshots} = config;

// Tests
let browser;
let page;
let context;
let test;

beforeEach(async() => {
  browser = await playwright['chromium'].launch({ headless: false, viewport: { width: viewportWidth, height: viewportHeight }});
  context = await browser.newContext();
  page = await context.newPage();
});

afterEach(async () => {
  await browser.close();
});

it('F061 - should schedule a new post and filter it in the list of posts by scheduled status.', async () => {
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
});

it('F062 - should not schedule a new post when the title has more than 255 characters.', async () => {
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

  await postsPage.clickPostWithTitle(titlePost);
  await postDetailPage.unschedulePost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByDraftedPostsOption();

  firstPostTitle = await postsPage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost);
});

it('F12 - should create a post, then modify it and validate that the modification was made.', async () => {
  test = 'F12';
  const titlePost = "Escenario de prueba: " + test +  ' - ' + Date.now();
  const bodyPost = "Este es un nuevo post creado para el escenario de prueba: " + test;
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
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await generateScreenshot(3);
  await postDetailPage.publishPost();
  await generateScreenshot(4);
  await postDetailPage.returnToPostsList();
  await homePage.closePublishedPostNotification();
  await homePage.goToViewSite();
  await generateScreenshot(5);

  let firstPostTitle = await viewSitePage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost);

  await homePage.goToPosts();
  await generateScreenshot(6);
  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(7);
  await postsPage.selectFilterByPublishedPostsOption();
  await generateScreenshot(8);
  await postsPage.clickPostWithTitle(titlePost);
  await generateScreenshot(9);
  await postDetailPage.deleteTitlePost();
  await postDetailPage.deleteBodyPost();
  await generateScreenshot(10);
  await postDetailPage.enterTitleForNewPost(titlePost + ' (Modificado)');
  await postDetailPage.enterBodyForNewPost(bodyPost + ' (Modificado)');
  await generateScreenshot(11);
  await postDetailPage.publishPost();
  await generateScreenshot(12);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(13);
  await homePage.closePublishedPostNotification();
  await homePage.goToViewSite();
  await generateScreenshot(14);

  firstPostTitle = await viewSitePage.getFirstPostTitle();
  assert.strictEqual(firstPostTitle, titlePost + ' (Modificado)');
});

it('F13 - should change user password and login correctly.', async () => {
  test = "F13";
  let newPassword = "newpruebasmiso";
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
  await homePage.closePublishedPostNotification();
  await generateScreenshot(5);
  await homePage.signOut();
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(newPassword);
  await generateScreenshot(6);
  await loginPage.clickLogin();
  await generateScreenshot(7);
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(newPassword);
  await profilePage.enterNewPassword(credentials.password);
  await profilePage.enterNewPasswordConfirmation(credentials.password);
  await profilePage.clickChangePassword();
});

it('F14 - should schedule a new page and filter it in the list of pages by scheduled status.', async () => {
  test = 'F14';
  const titlePage = "Escenario de prueba: " + test +  ' - ' + Date.now();
  const bodyPage = "Esta es una nueva Page creada para el escenario de prueba: " + test;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagePage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(1);
  await loginPage.clickLogin();
  await generateScreenshot(2);
  await homePage.goToPages();
  await generateScreenshot(3);
  await pagePage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await generateScreenshot(4);
  await pageDetailPage.schedulePage();
  await generateScreenshot(5);
  await pageDetailPage.returnToPagesList();
  await generateScreenshot(6);
  await homePage.closePublishedPostNotification();
  await pagePage.openPageTypeFilterDropdown();
  await generateScreenshot(7);
  await pagePage.selectFilterByScheduledPagesOption();
  await generateScreenshot(8);

  let firstPageTitle = await pagePage.getFirstPageTitle();
  assert.strictEqual(firstPageTitle, titlePage);
});

it('F15 - should create a tag and then create a new post with this tag.', async () => {
  test = 'F15';
  const tag = 'F15-' + + Date.now();
  const description = "This Tag was created by Playwright";
  const titlePost = "Escenario de prueba: " + test +  ' - ' + Date.now();
  const bodyPost = "Esta es una nueva Page creada para el escenario de prueba: " + test;
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
  await generateScreenshot(4);
  await tagDetailPage.enterTitleForNewTag(tag);
  await tagDetailPage.enterDescriptionForNewTag(description);
  await tagDetailPage.clickExpandMetaData();
  await tagDetailPage.enterMetaTitleForNewTag(tag);
  await tagDetailPage.enterMetaDescriptionForNewTag(description);
  await tagDetailPage.clickSave();
  await generateScreenshot(5);
  await homePage.goToPosts();
  await generateScreenshot(6);
  await postsPage.goToCreateNewPost();
  await generateScreenshot(7);
  await postDetailPage.enterTitleForNewPost(titlePost);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await generateScreenshot(8);
  await postDetailPage.openPostSettings();
  await postDetailPage.assignTagWithName(tag);
  await generateScreenshot(9);
  await postDetailPage.closePostSettings();
  await postDetailPage.publishPost();
  await generateScreenshot(10);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(11);
  await homePage.closePublishedPostNotification();
  await postsPage.openPostTagsFilterDropdown();
  await generateScreenshot(12);
  await postsPage.selectFilterByTagName(tag);
  await generateScreenshot(13);

  let firstTagTitle = await postsPage.getFirstPostTitle();
  assert.strictEqual(firstTagTitle, titlePost);
});

it('F01 - should create and publish post', async () => {
  test = "F01";
  const title = `${Date.now()}`;

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
  await postDetailPage.enterBodyForNewPost('Cuerpo 1');
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

it('F02 - should create and publish post on site', async () => {
  test = "F02";
  const title = `${Date.now()}`;

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
  await postDetailPage.enterBodyForNewPost('Cuerpo 2');
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

it('F03 - should not allow future date for post', async () => {
  test = "F03";
  const title = `${Date.now()}`;

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
  await postDetailPage.enterBodyForNewPost('Cuerpo 3');
  await generateScreenshot(5);
  await postDetailPage.publishPost();
  await generateScreenshot(6);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(7);
  await postsPage.clickPostWithTitle(title);
  await generateScreenshot(8);
  await postDetailPage.openPostSettings();
  await generateScreenshot(9);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  await postDetailPage.fillDate(tomorrow.toISOString().split('T')[0]);
  await generateScreenshot(10);

  const dateError = await postDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Must be in the past", "Error message is not the expected");
});

it('F04 - should publish new page', async () => {
  test = "F04";
  const title = `${Date.now()}`;

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
  await pageDetailPage.enterBodyForNewPage('Cuerpo 4');
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

it('F05 - should save draft and publish page', async () => {
  test = "F05";
  const title = `${Date.now()}`;

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
  await pageDetailPage.enterBodyForNewPage('Cuerpo 5');
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

it('F06 - Crear Draft post, validarlo en la lista', async () => {
  let title = "Last Draft Post";
  let body = "Last Draft Post Body";
  test = "F06";

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
  await postDetailPage.enterTitleForNewPost(title)
  await generateScreenshot(5);
  await postDetailPage.enterBodyForNewPost(body);
  await generateScreenshot(6);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(7);
  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(8);
  await postsPage.selectFilterByDraftedPostsOption();
  await generateScreenshot(9);

  var firstPostTitle = await postsPage.getFirstPostTitle();
  assert.equal(firstPostTitle, title);
});

it('F07 - Crear 2 post, ordenar la lista por el mas nuevo, validar en la lista que el post mas reciente esté de primeras', async () => {
  let titlePost1 = "Oldest Post";
  let bodyPost1 = "Oldest Post Body";
  let titlePost2 = "Newest Post";
  let bodyPost2 = "Newest Post Body";
  test = "F07";

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
  await postDetailPage.enterTitleForNewPost(titlePost1)
  await generateScreenshot(5);
  await postDetailPage.enterBodyForNewPost(bodyPost1);
  await generateScreenshot(6);
  await postDetailPage.publishPost();
  await generateScreenshot(7);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(8);
  await postsPage.goToCreateNewPost();
  await generateScreenshot(9);
  await postDetailPage.enterTitleForNewPost(titlePost2)
  await generateScreenshot(10);
  await postDetailPage.enterBodyForNewPost(bodyPost2);
  await generateScreenshot(11);
  await postDetailPage.publishPost();
  await generateScreenshot(12);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(13);
  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(14);
  await postsPage.selectFilterByPublishedPostsOption();
  await generateScreenshot(15);
  await postsPage.openPostSortByFilterDropdown();
  await generateScreenshot(16);
  await postsPage.selectFilterByNewestPostOption();
  await generateScreenshot(17);

  var firstPostTitle = await postsPage.getFirstPostTitle();
  assert.equal(firstPostTitle, titlePost2);
});

it('F08 - Crear post, ir al sitio web, validar que esté, volver y eliminarlo, ir de nuevo al sitio web y validar que NO esté', async () => {
  let titlePost = "Post Publicado";
  let bodyPost = "Post Publicado Body";
  test = "F08";

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const viewSitePage = new ViewSitePage(page);
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
  await postDetailPage.enterTitleForNewPost(titlePost)
  await generateScreenshot(5);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await generateScreenshot(6);
  await postDetailPage.publishPost();
  await generateScreenshot(7);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(8);
  await homePage.goToViewSite();
  await generateScreenshot(9);

  var publishedPostTitle = await viewSitePage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === titlePost, "Title is not the expected");

  await homePage.goToPosts();
  await generateScreenshot(10);
  await postsPage.clickPostWithTitle(titlePost);
  await generateScreenshot(11);
  await postDetailPage.openPostSettings();
  await generateScreenshot(12);
  await postDetailPage.clickDeletePost();
  await generateScreenshot(13);
  await postDetailPage.clickConfirmDeletePost();
  await generateScreenshot(14);
  await homePage.goToViewSite();
  await generateScreenshot(15);

  publishedPostTitle = await viewSitePage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle != titlePost, "Title is not the expected");

});

it('F09 - Crear draft page, ir a lista y verificar que exista', async () => {
  let titlePage = "New Page";
  let bodyPage = "New Page Body";
  test = "F09";

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
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await generateScreenshot(5);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await generateScreenshot(6);
  await pageDetailPage.returnToPagesList();
  await generateScreenshot(7);
  await pagesPage.openPageTypeFilterDropdown();
  await generateScreenshot(8);
  await pagesPage.selectFilterByDraftedPagesOption();
  await generateScreenshot(9);

  var firstPageTitle = await pagesPage.getFirstPageTitle();
  assert.equal(firstPageTitle, titlePage);
});

it('F10 - Crear page, ir a lista, editar el page, ingresamos fecha de publicación futura, validar error generado', async () => {
  let titlePage = "New Page";
  let bodyPage = "New Page Body";
  test = "F10";

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
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await generateScreenshot(5);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await generateScreenshot(6);
  await pageDetailPage.returnToPagesList();
  await generateScreenshot(7);
  await pagesPage.clickPageWithTitle(titlePage);
  await generateScreenshot(8);
  await pageDetailPage.openPageSettings();
  await generateScreenshot(9);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  await pageDetailPage.fillDate(tomorrow.toISOString().split('T')[0]);
  await generateScreenshot(10);

  const dateError = await pageDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Must be in the past", "Error message is not the expected");
});

it('F16.1 - should publish post and remain publish even if I log out and log in again', async () => {
  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`

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

it('F16.2 - should publish post with long title and remain publish even if I log out and log in again', async () => {
  let title = "a".repeat(201);
  let body = `${Date.now()} body.`;

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

it('F17.1 - should publish a drafted post', async () => {
  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`

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

it('F17.2 - should publish a drafted post with long title', async () => {
  let title = "a".repeat(201);
  let body = `${Date.now()} body.`

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

it('F18.1 - should change user password and login whith wrong password', async () => {
  let newPassword = "newpruebasmiso";
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

it('F18.2 - should try to change empty password then change user password and login whith wrong password', async () => {
  let newPassword = "newpruebasmiso";
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

it('F18.3 - should try to change short password then change user password and login whith wrong password', async () => {
  let newPassword = "newpruebasmiso";
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

it('F18.4 - should try to change only numbers password then change user password and login whith wrong password', async () => {
  let insecurePassword = "1111111111";
  let newPassword = "newpruebasmiso";
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

it('F18.5 - should try to change with all characters insecure password then change user password and login whith wrong password', async () => {
  let insecurePassword = "aaaaaaaaaa";
  let newPassword = "newpruebasmiso";
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

it('F18.6 - should try to change with more than 60 characters then change user password and login whith wrong password', async () => {
  let newPassword = "newpruebasmiso".repeat(6);
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

it('F19.1 - should edit a page', async () => {
  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`

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

it('F19.2 - should edit a page with long title', async () => {
  let title = "a".repeat(201);
  let body = `${Date.now()} body.`

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

  let newBody = `${Date.now()} new body.`;
  await pageDetailPage.closePageSettings();
  await pageDetailPage.clearBody();
  await pageDetailPage.enterBodyForNewPage(newBody);
  await pageDetailPage.publishPage();

  let [thirdPage] = await pageDetailPage.openPagePreviewWithContext(context);
  pagePreviewPage = new PagePreviewPage(thirdPage);
  pageBodyContent = await pagePreviewPage.getPageBodyContent();
  assert.equal(pageBodyContent.trim(), newBody);
});

it('F20.1 - should create tag, assign that tag to a post, delete the tag and deassign the tag from the post', async () => {
  let tag = `${Date.now()}`;

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

it('F20.2 - should try create empty tag then create tag, assign that tag to a post, delete the tag and deassign the tag from the post', async () => {
  let tag = `${Date.now()}`;

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

it('F20.3 - should try create tag with title that exceeds max characters, assign that tag to a post, delete the tag and deassign the tag from the post', async () => {
  let tag = 'a'.repeat(25);

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

it('F21.1 - should change user email and login whith wrong email', async () => {
  let newEmail = "pruebasmiso@gmail.com";
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

it('F21.2 - should try to change empty email then change user email and login whith wrong email', async () => {
  let newEmail = "pruebasmiso@gmail.com";
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearEmail();
  await profilePage.enterEmail('');
  await profilePage.clickSave();

  let errorMessage = await profilePage.emailErrorMessage();
  assert.strictEqual(errorMessage.trim(), "Please supply a valid email address");

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

it('F21.3 - should try to change URL email then change user email and login whith wrong email', async () => {
  let newEmail = "pruebasmiso@gmail.com";
  let invalidEmail = "http://google.com";
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

it('F21.4 - should try to change email to one that exceeds max characters then change user email and login whith wrong email', async () => {
  let newEmail = "pruebasmiso@gmail.com";
  let invalidEmail = `${'a'.repeat(250)}@gmail.com`;
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

it('F22.1 - should change slug in profile', async () => {
  let newSlug = "slug";
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

it('F22.2 - should change slug in profile with URL', async () => {
  let newSlug = "http://google.com/";
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

it('F22.3 - should change slug in profile with empty text', async () => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const profilePage = new ProfilePage(page);

  await page.goto(config.url);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.clearSlug();
  await profilePage.enterSlug('');
  await profilePage.clickSave();
  await profilePage.clickSave();
});

it('F22.4 - should change slug in profile with empty text', async () => {
  let slug = 'algo algo algo';
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

it('F22.5 - should change slug in profile with email', async () => {
  let slug = 'drummerwilliam@gmail.com';
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

it('F22.6 - should change slug in profile with number of characters exceeded', async () => {
  let slug = 'a'.repeat(200);
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

it('F23.1 - should change website', async () => {
  let website = 'https://www.google.com';
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

it('F23.2 - should try to change website with email as website', async () => {
    let website = 'drummerwilliam@gmail.com';
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

it('F23.3 - should try to change website with integer as website', async () => {
  let website = '11111111';
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

it('F23.4 - should try to change website with integer as sentence', async () => {
  let website = 'algo algo algo';
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

it('F23.5 - should try to change website with a website that exceeds max characters', async () => {
  let website = `http://${'a'.repeat(2000)}.com`;
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
