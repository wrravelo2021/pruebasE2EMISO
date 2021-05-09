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
const ViewSitePage = require('./PageObjects/ViewSitePage.js');

// Credentials
const url = 'http://localhost:2368/ghost';
let email = "emilsonqp@gmail.com";
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

it('should change user password and login correctly.', async () => {
  // Test F13
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
  await homePage.closePublishedPostNotification();
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

it('should schedule a new page and filter it in the list of pages by scheduled status.', async () => {
  const test = 'F14';
  const titlePage = "Escenario de prueba: " + test +  ' - ' + Date.now();
  const bodyPage = "Esta es una nueva Page creada para el escenario de prueba: " + test;
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const pagePage = new PagesPage(page);
  const pageDetailPage = new PageDetailPage(page);

  await page.goto(url);
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(password);
  await loginPage.clickLogin();
  await homePage.goToPages();
  await pagePage.goToCreateNewPage();
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await pageDetailPage.schedulePage();
  await pageDetailPage.returnToPagesList();
  await homePage.closePublishedPostNotification();
  await pagePage.openPageTypeFilterDropdown();
  await pagePage.selectFilterByScheduledPagesOption();

  let firstPageTitle = await pagePage.getFirstPageTitle();
  assert.strictEqual(firstPageTitle, titlePage);
});

it('should create a tag and then create a new post with this tag.', async () => {
  const test = 'F15';
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

  await page.goto(url);
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(password);
  await loginPage.clickLogin();
  await homePage.goToTags();
  await tagsPage.goToCreateNewTag();
  await tagDetailPage.enterTitleForNewTag(tag);
  await tagDetailPage.enterDescriptionForNewTag(description);
  await tagDetailPage.enterMetaTitleForNewTag(tag);
  await tagDetailPage.enterMetaDescriptionForNewTag(description);
  await tagDetailPage.clickSave();
  await homePage.goToPosts();
  await postsPage.goToCreateNewPost();
  await postDetailPage.enterTitleForNewPost(titlePost);
  await postDetailPage.enterBodyForNewPost(bodyPost);
  await postDetailPage.openPostSettings();
  await postDetailPage.assignTagWithName(tag);
  await postDetailPage.closePostSettings();
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.closePublishedPostNotification();
  await postsPage.openPostTagsFilterDropdown();
  await postsPage.selectFilterByTagName(tag);

  let firstTagTitle = await postsPage.getFirstPostTitle();
  assert.strictEqual(firstTagTitle, titlePost);
});

it('F16 - should publish post and remain publish even if I log out and log in again', async () => {
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

it('F17 - should publish a drafted post', async () => {
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

it('F18 - should change user password and login whith wrong password', async () => {
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
  await homePage.closePublishedPostNotification();
  await homePage.signOut();
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(password);
  await loginPage.clickLogin();

  let messageError = await loginPage.getMessageError();
  assert.strictEqual(messageError.trim(), "Your password is incorrect.");

  await loginPage.clearPassword();
  await loginPage.enterPassword(newPassword);
  await loginPage.clickLogin();
  await homePage.goToMyProfile();
  await profilePage.scrollToBottom();
  await profilePage.enterOldPassword(newPassword);
  await profilePage.enterNewPassword(password);
  await profilePage.enterNewPasswordConfirmation(password);
  await profilePage.clickChangePassword();
});

it('F19 - should edit a page', async () => {
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

it('F20 - should create tag, assign that tag to a post, delete the tag and deassign the tag from the post', async () => {
  let tag = `${Date.now()}`;

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

it('F01 - should create and publish post', async () => {
  const title = `${Date.now()}`;

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
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.enterBodyForNewPost('Cuerpo 1');
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await postsPage.openPostTypeFilterDropdown();
  await postsPage.selectFilterByPublishedPostsOption();
  const publishedPostTitle = await postsPage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === title, "Title is not the expected");
});

it('F02 - should create and publish post on site', async () => {
  const title = `${Date.now()}`;

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
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.enterBodyForNewPost('Cuerpo 2');
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await homePage.goToViewSite();
  const publishedPostTitle = await viewSitePage.getFirstPostTitle();
  assert(publishedPostTitle != null, "Title is null");
  assert(publishedPostTitle === title, "Title is not the expected");
});

it('F03 - should not allow future date for post', async () => {
  const title = `${Date.now()}`;

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
  await postDetailPage.enterTitleForNewPost(title);
  await postDetailPage.enterBodyForNewPost('Cuerpo 3');
  await postDetailPage.publishPost();
  await postDetailPage.returnToPostsList();
  await postsPage.clickPostWithTitle(title);
  await postDetailPage.openPostSettings();

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  await postDetailPage.fillDate(tomorrow.toISOString().split('T')[0]);

  const dateError = await postDetailPage.getFutureDateError();
  const dateErrorText = dateError ? await dateError.innerText() : null;
  assert(dateErrorText != null, "Error message is null");
  assert(dateErrorText === "Must be in the past", "Error message is not the expected");
});

it('F04 - should publish new page', async () => {
  const title = `${Date.now()}`;

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
  await pageDetailPage.enterBodyForNewPage('Cuerpo 4');
  await pageDetailPage.publishPage();
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByPublishedPagesOption();

  const publishedPageTitle = await pagesPage.getFirstPageTitle();
  assert(publishedPageTitle != null, "Title is null");
  assert(publishedPageTitle === title, "Title is not the expected");
});

it('F05 - should save draft and publish page', async () => {
  const title = `${Date.now()}`;

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
  await pageDetailPage.enterBodyForNewPage('Cuerpo 5');
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

it('F06 Crear Draft post, validarlo en la lista', async () => {
  let title = "Last Draft Post";
  let body = "Last Draft Post Body";

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
});

it('F07 Crear 2 post, ordenar la lista por el mas nuevo, validar en la lista que el post mas reciente esté de primeras', async () => {
  let titlePost1 = "Oldest Post";
  let bodyPost1 = "Oldest Post Body";
  let titlePost2 = "Newest Post";
  let bodyPost2 = "Newest Post Body";

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

it('F08 Crear post, ir al sitio web, validar que esté, volver y eliminarlo, ir de nuevo al sitio web y validar que NO esté', async () => {
  let titlePost = "Post Publicado";
  let bodyPost = "Post Publicado Body";

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const viewSitePage = new ViewSitePage(page);
  const postsPage = new PostsPage(page);
  const postDetailPage = new PostDetailPage(page);

  await page.goto(url);
  await loginPage.enterEmail(email);
  await loginPage.enterPassword(password);
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

it('F09 Crear draft page, ir a lista y verificar que exista', async () => {
  let titlePage = "New Page";
  let bodyPage = "New Page Body";

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
  await pageDetailPage.enterTitleForNewPage(titlePage);
  await pageDetailPage.enterBodyForNewPage(bodyPage);
  await pageDetailPage.returnToPagesList();
  await pagesPage.openPageTypeFilterDropdown();
  await pagesPage.selectFilterByDraftedPagesOption();
  
  var firstPageTitle = await pagesPage.getFirstPageTitle();
  assert.equal(firstPageTitle, titlePage);
});

it('F10 Crear page, ir a lista, editar el page, ingresamos fecha de publicación futura, validar error generado', async () => {
  let titlePage = "New Page";
  let bodyPage = "New Page Body";

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


