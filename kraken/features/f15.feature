Feature: F15

  @user1 @web
  Scenario: As a user I should create a tag and then create a new post with this tag
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F15"
    And I click login
    And I take screenshot of step 2 and scenario "F15"
    And I go to tags
    And I take screenshot of step 3 and scenario "F15"
    And I go to create new tag
    And I take screenshot of step 4 and scenario "F15"
    And I enter title for new tag "Tag name"
    And I enter description for new tag "Tag description"
    And I enter meta title for new tag "Tag name"
    And I enter meta description for new tag "Tag description"
    And I click save new tag
    And I take screenshot of step 5 and scenario "F15"
    And I go to posts
    And I take screenshot of step 6 and scenario "F15"
    And I go to create new post
    And I take screenshot of step 7 and scenario "F15"
    And I enter title "Test title" for new post
    And I enter body "Test body" for new post
    And I take screenshot of step 8 and scenario "F15"
    And I open post settings
    And I assign tag with name "Tag name"
    And I see tag with name "Tag name" assigned
    And I take screenshot of step 9 and scenario "F15"
    And I close post settings
    And I publish the post
    And I take screenshot of step 10 and scenario "F15"
    And I return to posts list
    And I take screenshot of step 11 and scenario "F15"
    And I close the published post notification
    And I open post tags filter dropdown
    And I take screenshot of step 12 and scenario "F15"
    And I select filter by "Tag name" posts option
    And I take screenshot of step 13 and scenario "F15"
    Then I see first post with title "Test title"