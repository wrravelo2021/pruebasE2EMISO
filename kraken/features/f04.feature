Feature: F04

  @user1 @web
  Scenario: As a user I should publish a new page
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F04"
    And I click login
    And I take screenshot of step 2 and scenario "F04"
    And I go to pages
    And I take screenshot of step 3 and scenario "F04"
    And I go to create new page
    And I take screenshot of step 4 and scenario "F04"
    And I enter title "New page F4" for new page
    And I enter body "Cuerpo 4" for new page
    And I take screenshot of step 5 and scenario "F04"
    And I publish the page
    And I take screenshot of step 6 and scenario "F04"
    And I return to pages list
    And I take screenshot of step 7 and scenario "F04"
    And I open page type filter dropdown
    And I select filter by published pages option
    And I take screenshot of step 8 and scenario "F04"
    Then I see first post with title "New page F4"