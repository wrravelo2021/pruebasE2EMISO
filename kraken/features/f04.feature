Feature: F04

  @user1 @web
  Scenario: As a user I should publish a new page
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to pages
    And I go to create new page
    And I enter title "New page F4" for new page
    And I enter body "Cuerpo 4" for new page
    And I publish the page
    And I return to pages list
    And I open page type filter dropdown
    And I select filter by published pages option
    Then I see first post with title "New page F4"