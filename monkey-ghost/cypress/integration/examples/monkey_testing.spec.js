// Credentials
let url = 'http://localhost:2372/ghost';
let email = 'drummerwilliam@gmail.com';
let password = 'pruebasmiso';

describe('Los estudiantes under monkeys', function() {
    it('visits los ghost, logs in and survives monkeys', function() {
        cy.visit(`${url}/#/signin`);
        cy.wait(1000);
        cy.get('input[name="identification"]').click();
        cy.get('input[name="identification"]').type(email);
        cy.get('input[name="password"]').click();
        cy.get('input[name="password"]').type(password);
        cy.get('.login.gh-btn.gh-btn-blue.gh-btn-block.gh-btn-icon.ember-view').click();
        cy.wait(1000);
        randomEvent(10);
    })
})

function randomEvent(eventNumber) {
  let RANDOM_LINK = 'random_link';
  let RANDOM_INPUT = 'fill_random_input';
  let RANDOM_COMBO = 'random_combo';
  let RANDOM_CLICK = 'random_click';

  function getRandomEvenType() {
    let eventTypes = [
      RANDOM_LINK,
      RANDOM_INPUT,
      RANDOM_COMBO,
      RANDOM_CLICK
    ];
    return eventTypes[
      Math.floor(Math.random() * eventTypes.length)
    ];
  }

  function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
  };

  var eventsLeft = eventNumber;
  var eventToGenerate = null;
  if(eventsLeft > 0) {
    eventToGenerate = getRandomEvenType();
    if(eventToGenerate == RANDOM_LINK) {
      cy.get('a').then($links => {
          if($elements.length <= 0)  { return ; }

          var randomLink = $links.get(getRandomInt(0, $links.length));
          if(!Cypress.dom.isHidden(randomLink)) {
              cy.wrap(randomLink).click({force: true});
          }
          cy.wait(1000);
      });
    } else if(eventToGenerate == RANDOM_INPUT) {
      cy.get('input').then($inputs => {
          if($elements.length <= 0)  { return ; }

          var randomInput = $inputs.get(getRandomInt(0, $inputs.length));
          if(!Cypress.dom.isHidden(randomInput)) {
            cy.wrap(randomInput).type('Hello, World', {force: true});
          }
          cy.wait(1000);
      });
    } else if(eventToGenerate == RANDOM_COMBO) {
      cy.get('select').then($elements => {
          if($elements.length <= 0)  { return ; }

          var randomElement = $elements.get(getRandomInt(0, $elements.length));
          if(!Cypress.dom.isHidden(randomElement)) {
            let children = randomElement.children;
            var randomChildren = children[getRandomInt(0, children.length)];
              cy.wrap(randomElement).select(randomChildren.innerText, {force: true});
          }
          cy.wait(1000);
      });
    } else if(eventToGenerate == RANDOM_CLICK) {
      cy.get('button').then($elements => {
          if($elements.length <= 0)  { return ; }

          var randomElement = $elements.get(getRandomInt(0, $elements.length));
          if(!Cypress.dom.isHidden(randomElement)) {
              cy.wrap(randomElement).click({force: true});
          }
          cy.wait(1000);
      });
    }
    eventsLeft = eventsLeft - 1;
    randomEvent(eventsLeft);
  }
}
