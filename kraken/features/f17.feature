Feature: F17

  @user1 @web
  Scenario: As a user I should publish a drafted post
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F17"
    And I click login
    And I take screenshot of step 2 and scenario "F17"
    And I go to posts
    And I take screenshot of step 3 and scenario "F17"
    And I go to create new post
    And I take screenshot of step 4 and scenario "F17"
    And I enter title "Test title" for new post
    And I enter body "Test body" for new post
    And I take screenshot of step 5 and scenario "F17"
    And I return to posts list
    And I take screenshot of step 6 and scenario "F17"
    And I open post type filter dropdown
    And I take screenshot of step 7 and scenario "F17"
    And I select filter by drafted posts option
    And I take screenshot of step 8 and scenario "F17"
    And I see first post with title "Test title"
    And I click post with title "Test title"
    And I take screenshot of step 9 and scenario "F17"
    And I publish the post
    And I take screenshot of step 10 and scenario "F17"
    And I return to posts list
    And I take screenshot of step 11 and scenario "F17"
    And I close the published post notification
    And I take screenshot of step 12 and scenario "F17"
    And I open post type filter dropdown
    And I take screenshot of step 13 and scenario "F17"
    And I select filter by published posts option
    And I take screenshot of step 14 and scenario "F17"
    Then I see first post with title "Test title"
