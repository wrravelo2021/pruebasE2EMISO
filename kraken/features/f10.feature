Feature: F10

  @user1 @web
  Scenario: Crear page, ir a lista, editar el page, ingresamos fecha de publicación futura, validar error generado
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F10"
    And I click login
    And I take screenshot of step 2 and scenario "F10"
    And I go to pages
    And I take screenshot of step 3 and scenario "F10"
    And I go to create new page
    And I take screenshot of step 4 and scenario "F10"
    And I enter title "New drafted page" for new page
    And I take screenshot of step 5 and scenario "F10"
    And I enter body "New drafted page body" for new post
    And I take screenshot of step 6 and scenario "F10"
    And I return to pages list
    And I take screenshot of step 7 and scenario "F10"
    And I click page with title "New drafted page"
    And I take screenshot of step 8 and scenario "F10"
    And I open page settings
    And I take screenshot of step 9 and scenario "F10"
    And I write on page settings a future publish date
    And I take screenshot of step 10 and scenario "F10"
    Then I see expected error