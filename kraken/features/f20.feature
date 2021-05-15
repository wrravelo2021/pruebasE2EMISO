Feature: F20

  @user1 @web
  Scenario: As a user I should create tag, assign that tag to a post, delete the tag and deassign the tag from the post
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F20"
    And I click login
    And I take screenshot of step 2 and scenario "F20"
    And I go to tags
    And I take screenshot of step 3 and scenario "F20"
    And I go to create new tag
    And I take screenshot of step 4 and scenario "F20"
    And I enter title for new tag "Tag name"
    And I take screenshot of step 5 and scenario "F20"
    And I click save new tag
    And I take screenshot of step 6 and scenario "F20"
    And I go to posts
    And I take screenshot of step 7 and scenario "F20"
    And I go to create new post
    And I take screenshot of step 8 and scenario "F20"
    And I enter title "Test title" for new post
    And I enter body "Test body" for new post
    And I take screenshot of step 9 and scenario "F20"
    And I open post settings
    And I take screenshot of step 10 and scenario "F20"
    And I assign tag with name "Tag name"
    And I take screenshot of step 11 and scenario "F20"
    And I see tag with name "Tag name" assigned
    And I take screenshot of step 12 and scenario "F20"
    And I close post settings
    And I take screenshot of step 13 and scenario "F20"
    And I publish the post
    And I take screenshot of step 14 and scenario "F20"
    And I return to posts list
    And I take screenshot of step 15 and scenario "F20"
    And I go to tags
    And I take screenshot of step 16 and scenario "F20"
    And I click tag with name "Tag name"
    And I take screenshot of step 17 and scenario "F20"
    And I click delete tag
    And I take screenshot of step 18 and scenario "F20"
    And I click confirm delete tag
    And I take screenshot of step 19 and scenario "F20"
    And I go to posts
    And I take screenshot of step 20 and scenario "F20"
    And I click post with title "Test title"
    And I take screenshot of step 21 and scenario "F20"
    And I open post settings
    And I take screenshot of step 21 and scenario "F20"
    Then I dont see tag with name "Tag name" assigned
