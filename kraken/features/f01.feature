Feature: F01

  @user1 @web
  Scenario: As a user I should create and publish post
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to posts
    And I go to create new post
    And I enter title "New post F1" for new post
    And I enter body "Cuerpo 1" for new post
    And I publish the post
    And I return to posts list
    And I open post type filter dropdown
    And I select filter by published posts option
    Then I see first post with title "New post F1"