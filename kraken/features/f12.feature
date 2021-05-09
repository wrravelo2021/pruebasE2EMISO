Feature: F12

  @user1 @web
  Scenario: As a user I should create a post, then modify it and validate that the modification was made
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
    And I go to view site
    Then I see first post on site with title "Test title"
    
    Given I navigate to ghost admin
    When I go to posts
    And I open post type filter dropdown
    And I select filter by published posts option
    And I click post with title "Test title"
    And I delete title the post
    And I delete body the post
    And I enter title "New title" for new post
    And I enter body "New body" for new post
    And I publish the post
    And I return to posts list
    And I close the published post notification
    And I go to view site
    Then I see first post on site with title "New title"
