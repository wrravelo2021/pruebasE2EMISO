Feature: F20

  @user1 @web
  Scenario: As a user I should create tag, assign that tag to a post, delete the tag and deassign the tag from the post
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to tags
    And I go to create new tag
    And I enter title for new tag "Tag name"
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
    And I go to tags
    And I click tag with name "Tag name"
    And I click delete tag
    And I click confirm delete tag
    And I go to posts
    And I click post with title "Test title"
    And I open post settings
    Then I dont see tag with name "Tag name" assigned
