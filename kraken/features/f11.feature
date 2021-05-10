Feature: F11

  @user1 @web
  Scenario: As a user I should schedule a new post and filter it in the list of posts by scheduled status
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to posts
    And I go to create new post
    And I enter title "Test title" for new post
    And I enter body "Test body" for new post
    And I schedule the post
    And I return to posts list
    And I close the published post notification
    And I open post type filter dropdown
    And I select filter by scheduled posts option
    Then I see first post with title "Test title"
