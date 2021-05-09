Feature: Example feature

  @user1 @web
  Scenario: As a first user I say hi to a second user
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to pages
    And I go to create new page
    And I enter title "Page title" for new page
    And I enter body "Page body" for new page
    And I publish the page
    And I return to pages list
    And I open page type filter dropdown
    And I select filter by published pages option
    And I click page with title "Page title"
    And I open page settings
    And I open page preview
    And I move to last tab
    And I see body content "Page body"
    And I move to first tab
    And I close page settings
    And I erase page body content
    And I enter body "Page new body" for new page
    And I publish the page
    And I open page settings
    And I open page preview
    And I move to last tab
    Then I see body content "Page new body"
