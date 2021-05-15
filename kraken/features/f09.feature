Feature: F09

  @user1 @web
  Scenario: F09 Crear draft page, ir a lista y verificar que exista
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F09"
    And I click login
    And I take screenshot of step 2 and scenario "F09"
    And I go to pages
    And I take screenshot of step 3 and scenario "F09"
    And I go to create new page
    And I take screenshot of step 4 and scenario "F09"
    And I enter title "New Drafted page" for new page
    And I take screenshot of step 5 and scenario "F09"
    And I enter body "New Drafted page body" for new page
    And I take screenshot of step 6 and scenario "F09"
    And I return to pages list
    And I take screenshot of step 7 and scenario "F09"
    And I open page type filter dropdown
    And I take screenshot of step 8 and scenario "F09"
    And I select filter by drafted pages option
    And I take screenshot of step 9 and scenario "F09"
    Then I see first post with title "New Drafted page"