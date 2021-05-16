Feature: F11

  @user1 @web
  Scenario: As a user I should schedule a new post and filter it in the list of posts by scheduled status
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F11"
    And I click login
    And I take screenshot of step 2 and scenario "F11"
    And I go to posts
    And I go to create new post
    And I enter title "Test title" for new post
    And I enter body "Test body" for new post
    And I take screenshot of step 3 and scenario "F11"
    And I schedule the post
    And I take screenshot of step 4 and scenario "F11"
    And I return to posts list
    And I take screenshot of step 5 and scenario "F11"
    And I open post type filter dropdown
    And I take screenshot of step 6 and scenario "F11"
    And I select filter by scheduled posts option
    And I take screenshot of step 7 and scenario "F11"
    Then I see first post with title "Test title"
