Feature: F09

  @user1 @web
  Scenario: F09 Crear draft page, ir a lista y verificar que exista
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to pages
    And I go to create new page
    And I enter title "New Drafted page" for new page
    And I enter body "New Drafted page body" for new page
    And I return to pages list
    And I open page type filter dropdown
    And I select filter by drafted pages option
    Then I see first post with title "New Drafted page"