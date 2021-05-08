//Importar Playwright
const playwright = require('playwright');
const assert = require('assert')

const url = 'http://localhost:2368/ghost';

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
})();//Llamado propio de la función
