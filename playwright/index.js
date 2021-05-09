//Importar Playwright
const playwright = require('playwright');
const assert = require('assert')

const url = 'http://localhost:2368/ghost';
let email = "drummerwilliam@gmail.com";
let password = "pruebasmiso";

//Función flecha asíncrona
(async () => {
  //Definir los navegadores en los que se quiere hacer la prueba
  for (const browserType of ['chromium']){//, 'firefox', 'webkit']) {
    //Contenido de la prueba
    console.log(browserType+'-------------------------------------------')

    let title = `${Date.now()}`;
    let body = `${Date.now()} body.`

    //Creación del objeto browser, el contexto del mismo y el objeto page para manejar la página
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    //Abrir la URL a probar en la página y cargar el proyecto en una SPA
    await page.goto(url);
    //await page.screenshot({path: './pagina.png'})
    await page.type('input[name="identification"]', 'drummerwilliam@gmail.com');
    await page.type('input[name="password"]', 'pruebasmiso');
    await page.click('css=button.login');
    await page.click('.gh-nav-list-new.relative > a[href="#/posts/"]');
    await page.click('a[href="#/editor/post/"]');
    await page.type('.gh-editor-title.ember-text-area.gh-input.ember-view', title);
    await page.click('.koenig-editor__editor.__mobiledoc-editor');
    page.keyboard.type(body);
    await page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    await page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
    await page.click('a[href="#/posts/"].blue.link.fw4.flex.items-center.ember-view');
    await page.click('.gh-notification-close');
    await page.click('.gh-user-name.mb1');
    await page.click('a[href="#/signout/"]');
    await page.type('input[name="identification"]', 'drummerwilliam@gmail.com');
    await page.type('input[name="password"]', 'pruebasmiso');
    await page.click('css=button.login');
    await page.click('.gh-nav-list-new.relative > a[href="#/posts/"]');
    await new Promise(r => setTimeout(r, 1000));
    await page.click('span:has-text("All posts")');
    await new Promise(r => setTimeout(r, 1000));
    await page.click('.ember-power-select-option:has-text("Published posts")');
    await new Promise(r => setTimeout(r, 1000));

    const postsTitles = await page.$$(".gh-content-entry-title");
    let text = await postsTitles[0].innerText()
    assert.equal(text, title);

    await new Promise(r => setTimeout(r, 1000));
    await browser.close();
  }
  return;
});


(async () => {
  //Definir los navegadores en los que se quiere hacer la prueba
  for (const browserType of ['chromium']){//, 'firefox', 'webkit']) {
    //Contenido de la prueba
    console.log(browserType+'-------------------------------------------')

    let title = `${Date.now()}`;
    let body = `${Date.now()} body.`

    //Creación del objeto browser, el contexto del mismo y el objeto page para manejar la página
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    //Abrir la URL a probar en la página y cargar el proyecto en una SPA
    await page.goto(url);
    //await page.screenshot({path: './pagina.png'})
    await page.type('input[name="identification"]', 'drummerwilliam@gmail.com');
    await page.type('input[name="password"]', 'pruebasmiso');
    await page.click('css=button.login');
    await page.click('.gh-nav-list-new.relative > a[href="#/posts/"]');
    await page.click('a[href="#/editor/post/"]');
    await page.type('.gh-editor-title.ember-text-area.gh-input.ember-view', title);
    await page.click('.koenig-editor__editor.__mobiledoc-editor');
    page.keyboard.type(body);
    await page.click('a[href="#/posts/"].blue.link.fw4.flex.items-center.ember-view');
    await new Promise(r => setTimeout(r, 1000));
    await page.click('span:has-text("All posts")');
    await new Promise(r => setTimeout(r, 1000));
    await page.click('.ember-power-select-option:has-text("Draft posts")');
    await new Promise(r => setTimeout(r, 1000));

    var postsTitles = await page.$$(".gh-content-entry-title");
    var text = await postsTitles[0].innerText();
    assert.equal(text, title);

    await page.click(`.gh-content-entry-title:has-text("${title}")`);
    await page.click('.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view');
    await page.click('.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view');
    await page.click('a[href="#/posts/?type=draft"].blue.link.fw4.flex.items-center.ember-view');
    await page.click('.gh-notification-close');
    await new Promise(r => setTimeout(r, 1000));
    await page.click('span:has-text("Draft posts")');
    await new Promise(r => setTimeout(r, 1000));
    await page.click('.ember-power-select-option:has-text("Published posts")');
    await new Promise(r => setTimeout(r, 1000));

    postsTitles = await page.$$(".gh-content-entry-title");
    text = await postsTitles[0].innerText();
    assert.equal(text, title);

    await new Promise(r => setTimeout(r, 1000));

    await browser.close();
  }
  return;
});//Llamado propio de la función

(async () => {
  //Definir los navegadores en los que se quiere hacer la prueba
  for (const browserType of ['chromium']){//, 'firefox', 'webkit']) {
    //Contenido de la prueba
    console.log(browserType+'-------------------------------------------')

    let title = `${Date.now()}`;
    let body = `${Date.now()} body.`
    let newPassword = "newpruebasmiso";

    //Creación del objeto browser, el contexto del mismo y el objeto page para manejar la página
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    //Abrir la URL a probar en la página y cargar el proyecto en una SPA
    await page.goto(url);
    //await page.screenshot({path: './pagina.png'})
    await page.type('input[name="identification"]', email);
    await page.type('input[name="password"]', password);
    await page.click('css=button.login');
    await page.click('.gh-nav-list-new.relative > a[href="#/posts/"]');
    await page.click('.gh-user-name.mb1');
    await page.click('a:has-text("Your profile")');
    await new Promise(r => setTimeout(r, 1000));
    await page.$eval('#user-password-old', (element) => {
      element.scrollIntoView();
    });
    await page.type('#user-password-old', password);
    await page.type('#user-password-new', newPassword);
    await page.type('#user-new-password-verification', newPassword);
    await page.click('.gh-btn.gh-btn-red.gh-btn-icon.button-change-password.ember-view');
    await page.click('.gh-user-name.mb1');
    await page.click('a[href="#/signout/"]');
    await page.type('input[name="identification"]', email);
    await page.type('input[name="password"]', newPassword);
    await page.click('css=button.login');

    // Reset password
    await page.click('.gh-user-name.mb1');
    await page.click('a:has-text("Your profile")');
    await new Promise(r => setTimeout(r, 1000));
    await page.$eval('#user-password-old', (element) => {
      element.scrollIntoView();
    });
    await page.type('#user-password-old', newPassword);
    await page.type('#user-password-new', password);
    await page.type('#user-new-password-verification', password);
    await page.click('.gh-btn.gh-btn-red.gh-btn-icon.button-change-password.ember-view');

    await new Promise(r => setTimeout(r, 3000));

    await browser.close();
  }
  return;
});//Llamado propio de la función

(async () => {
  //Definir los navegadores en los que se quiere hacer la prueba
  for (const browserType of ['chromium']){//, 'firefox', 'webkit']) {
    //Contenido de la prueba
    console.log(browserType+'-------------------------------------------')

    let title = `${Date.now()}`;
    let body = `${Date.now()} body.`

    //Creación del objeto browser, el contexto del mismo y el objeto page para manejar la página
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    //Abrir la URL a probar en la página y cargar el proyecto en una SPA
    await page.goto(url);
    //await page.screenshot({path: './pagina.png'})
    await page.type('input[name="identification"]', 'drummerwilliam@gmail.com');
    await page.type('input[name="password"]', 'pruebasmiso');
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
      page.click('.post-view-link') // Opens a new tab
    ])
    await newPage.waitForLoadState();
    var bodyText = await newPage.innerHTML('.post-content > p');
    //await new Promise(r => setTimeout(r, 3000));
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
    //await new Promise(r => setTimeout(r, 3000));
    const [thirdPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click('.post-view-link') // Opens a new tab
    ])
    await thirdPage.waitForLoadState();
    bodyText = await thirdPage.innerHTML('.post-content > p');
    assert.equal(bodyText, newBody);

    await new Promise(r => setTimeout(r, 3000));
    await browser.close();
  }
  return;
});

(async () => {
  //Definir los navegadores en los que se quiere hacer la prueba
  for (const browserType of ['chromium']){//, 'firefox', 'webkit']) {
    //Contenido de la prueba
    console.log(browserType+'-------------------------------------------')

    let tag = `${Date.now()}`;
    let newPassword = "newpruebasmiso";

    //Creación del objeto browser, el contexto del mismo y el objeto page para manejar la página
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    //Abrir la URL a probar en la página y cargar el proyecto en una SPA
    await page.goto(url);
    //await page.screenshot({path: './pagina.png'})
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


    await new Promise(r => setTimeout(r, 3000));

    await browser.close();
  }
  return;
})();//Llamado propio de la función
