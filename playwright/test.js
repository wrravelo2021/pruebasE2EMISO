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
  browser = await playwright['chromium'].launch({ headless: true, viewport: { width: viewportWidth, height: viewportHeight }});
  context = await browser.newContext();
  page = await context.newPage();
});

afterEach(async () => {
  await browser.close();
});

it('F11 - should schedule a new post and filter it in the list of posts by scheduled status.', async () => {
  test = 'F11';
  const titlePost = "Escenario de prueba: " + test +  ' - ' + Date.now();
  const bodyPost = "Este es un nuevo post creado para el escenario de prueba: " + test;
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
  await homePage.closePublishedPostNotification();
  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(6);
  await postsPage.selectFilterByScheduledPostsOption();
  await generateScreenshot(7);

  let firstPostTitle = await postsPage.getFirstPostTitle();
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
  await generateScreenshot(18);

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

it('F16 - should publish post and remain publish even if I log out and log in again', async () => {
  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`
  test = "F16";

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

it('F17 - should publish a drafted post', async () => {
  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`
  test = "F17";

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
  await postDetailPage.enterBodyForNewPost(body);
  await generateScreenshot(5);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(6);
  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(7);
  await postsPage.selectFilterByDraftedPostsOption();
  await generateScreenshot(8);
  var firstPostTitle = await postsPage.getFirstPostTitle();
  assert.equal(firstPostTitle, title);

  await postsPage.clickPostWithTitle(title);
  await generateScreenshot(9);
  await postDetailPage.publishPost();
  await generateScreenshot(10);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(11);
  await homePage.closePublishedPostNotification();
  await generateScreenshot(12);
  await postsPage.openPostTypeFilterDropdown();
  await generateScreenshot(13);
  await postsPage.selectFilterByPublishedPostsOption();
  await generateScreenshot(14);

  var firstPostTitle = await postsPage.getFirstPostTitle();
  assert.equal(firstPostTitle, title);
});

it('F18 - should change user password and login whith wrong password', async () => {
  test = "F18";
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
  await generateScreenshot(5);
  await homePage.closePublishedPostNotification();
  await generateScreenshot(6);
  await homePage.signOut();
  await generateScreenshot(7);
  await loginPage.enterEmail(credentials.email);
  await loginPage.enterPassword(credentials.password);
  await generateScreenshot(8);
  await loginPage.clickLogin();
  await generateScreenshot(9);

  let messageError = await loginPage.getMessageError();
  assert.strictEqual(messageError.trim(), "Your password is incorrect.");

  await loginPage.clearPassword();
  await generateScreenshot(10);
  await loginPage.enterPassword(newPassword);
  await generateScreenshot(11);
  await loginPage.clickLogin();
  await generateScreenshot(12);
  await homePage.goToMyProfile();
  await generateScreenshot(13);
  await profilePage.scrollToBottom();
  await generateScreenshot(14);
  await profilePage.enterOldPassword(newPassword);
  await profilePage.enterNewPassword(credentials.password);
  await profilePage.enterNewPasswordConfirmation(credentials.password);
  await generateScreenshot(15);
  await profilePage.clickChangePassword();
  await generateScreenshot(16);
});

it('F19 - should edit a page', async () => {
  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`
  test = "F19";

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
  await generateScreenshot(8);
  await pagesPage.selectFilterByPublishedPagesOption();
  await generateScreenshot(9);
  await pagesPage.clickPageWithTitle(title)
  await generateScreenshot(10);
  await pageDetailPage.openPageSettings();
  await generateScreenshot(11);

  let [secondPage] = await pageDetailPage.openPagePreviewWithContext(context);
  await generateScreenshot(12, secondPage);
  var pagePreviewPage = new PagePreviewPage(secondPage);
  var pageBodyContent = await pagePreviewPage.getPageBodyContent();
  assert.equal(pageBodyContent.trim(), body);

  let newBody = `${Date.now()} new body.`;
  await pageDetailPage.closePageSettings();
  for(var i = 0; i < body.length + 1; i++) {
    await pageDetailPage.eraseOneCharacterFromBodyContent();
  }
  await generateScreenshot(13,);
  await pageDetailPage.enterBodyForNewPage(newBody);
  await generateScreenshot(14);
  await pageDetailPage.publishPage();
  await generateScreenshot(15);

  let [thirdPage] = await pageDetailPage.openPagePreviewWithContext(context);
  await generateScreenshot(16, thirdPage);
  pagePreviewPage = new PagePreviewPage(thirdPage);
  pageBodyContent = await pagePreviewPage.getPageBodyContent();
  assert.equal(pageBodyContent.trim(), newBody);
});

it('F20 - should create tag, assign that tag to a post, delete the tag and deassign the tag from the post', async () => {
  let tag = `${Date.now()}`;
  test = "F20";

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);
  const tagsPage = new TagsPage(page);
  const tagDetailPage = new TagDetailPage(page);

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
  await generateScreenshot(5);
  await tagDetailPage.clickSave();
  await generateScreenshot(6);
  await homePage.goToPosts();
  await generateScreenshot(7);
  await postsPage.goToCreateNewPost();
  await generateScreenshot(8);

  let title = `${Date.now()}`;
  let body = `${Date.now()} body.`;
  await postDetailPage.enterTitleForNewPost(title)
  await postDetailPage.enterBodyForNewPost(body);
  await generateScreenshot(9);
  await postDetailPage.openPostSettings();
  await generateScreenshot(10);
  await postDetailPage.assignTagWithName(tag);
  await generateScreenshot(11);

  var tags = await postDetailPage.getTagsName();
  assert.equal(tags.length, 1);

  let addedTagText = await tags[0].innerText();
  assert.equal(addedTagText.trim(), tag);

  await postDetailPage.closePostSettings();
  await generateScreenshot(12);
  await postDetailPage.publishPost();
  await generateScreenshot(13);
  await postDetailPage.returnToPostsList();
  await generateScreenshot(14);
  await homePage.goToTags();
  await generateScreenshot(15);
  await tagsPage.clickTagWithName(tag);
  await generateScreenshot(16);
  await tagDetailPage.clickDelete();
  await generateScreenshot(17);
  await tagDetailPage.clickConfirmDelete();
  await generateScreenshot(18);
  await homePage.goToPosts();
  await generateScreenshot(19);
  await postsPage.clickPostWithTitle(title);
  await generateScreenshot(20);
  await postDetailPage.openPostSettings();
  await generateScreenshot(21);

  tags = await postDetailPage.getTagsName();
  assert.equal(tags.length, 0);
});

async function generateScreenshot(id, customPage) {
  await new Promise(r => setTimeout(r, 1000));
  let screenshotPage = customPage ? customPage : page;
  return await screenshotPage.screenshot({ path: `${pathScreenshots}/${test}/${id}.png` });
}
