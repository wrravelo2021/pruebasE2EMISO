Feature: F19

  @user1 @web
  Scenario: As a user I should edit a page
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F19"
    And I click login
    And I take screenshot of step 2 and scenario "F19"
    And I go to pages
    And I take screenshot of step 3 and scenario "F19"
    And I go to create new page
    And I take screenshot of step 4 and scenario "F19"
    And I enter title "Page title" for new page
    And I enter body "Page body" for new page
    And I take screenshot of step 5 and scenario "F19"
    And I publish the page
    And I take screenshot of step 6 and scenario "F19"
    And I return to pages list
    And I take screenshot of step 7 and scenario "F19"
    And I open page type filter dropdown
    And I take screenshot of step 8 and scenario "F19"
    And I select filter by published pages option
    And I take screenshot of step 9 and scenario "F19"
    And I click page with title "Page title"
    And I take screenshot of step 10 and scenario "F19"
    And I open page settings
    And I take screenshot of step 11 and scenario "F19"
    And I open page preview
    And I move to last tab
    And I take screenshot of step 12 and scenario "F19"
    And I see body content "Page body"
    And I move to first tab
    And I close page settings
    And I erase page body content
    And I take screenshot of step 13 and scenario "F19"
    And I enter body "Page new body" for new page
    And I take screenshot of step 14 and scenario "F19"
    And I publish the page
    And I take screenshot of step 15 and scenario "F19"
    And I open page settings
    And I open page preview
    And I move to last tab
    And I take screenshot of step 16 and scenario "F19"
    Then I see body content "Page new body"
