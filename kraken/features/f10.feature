Feature: F10

  @user1 @web
  Scenario: Crear page, ir a lista, editar el page, ingresamos fecha de publicación futura, validar error generado
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to pages
    And I go to create new page
    And I enter title "New drafted page" for new page
    And I enter body "New drafted page body" for new post
    And I return to pages list
    And I click page with title "New drafted page"
    And I open page settings
    And I write on page settings a future publish date
    Then I see expected error