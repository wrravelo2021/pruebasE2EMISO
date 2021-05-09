Feature: F15

  @user1 @web
  Scenario: As a user I should create a tag and then create a new post with this tag
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to tags
    And I go to create new tag
    And I enter title for new tag "Tag name"
    And I enter description for new tag "Tag description"
    And I enter meta title for new tag "Tag name"
    And I enter meta description for new tag "Tag description"
    And I click save new tag
    And I go to posts
    And I go to create new post
    And I enter title "Test title" for new post
    And I enter body "Test body" for new post
    And I open post settings
    And I assign tag with name "Tag name"
    And I see tag with name "Tag name" assigned
    And I close post settings
    And I publish the post
    And I return to posts list
    And I close the published post notification
    And I open post tags filter dropdown
    And I select filter by "Tag name" posts option
    Then I see first post with title "Test title"