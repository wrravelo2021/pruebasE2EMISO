Feature: Example feature

  @user1 @web
  Scenario: As a first user I say hi to a second user
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to posts
    And I go to create new post
    And I enter title "Test title" for new post
    And I enter body "Test body" for new post
    And I publish the post
    And I return to posts list
    And I close the published post notification
    And I sign out
    And I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to posts
    And I open post type filter dropdown
    And I select filter by published posts option
    Then I see first post with title "Test title"
