Feature: F14

  @user1 @web
  Scenario: As a user I should schedule a new page and filter it in the list of pages by scheduled status
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to pages
    And I go to create new page
    And I enter title "Page title" for new page
    And I enter body "Page body" for new page
    And I schedule the page
    And I return to pages list
    And I close the published post notification
    And I open page type filter dropdown
    And I select filter by scheduled pages option
    Then I see first page with title "Page title"
