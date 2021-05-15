Feature: F01

  @user1 @web
  Scenario: As a user I should create and publish post
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F01"
    And I click login
    And I take screenshot of step 2 and scenario "F01"
    And I go to posts
    And I take screenshot of step 3 and scenario "F01"
    And I go to create new post
    And I take screenshot of step 4 and scenario "F01"
    And I enter title "New post F1" for new post
    And I enter body "Cuerpo 1" for new post
    And I take screenshot of step 5 and scenario "F01"
    And I publish the post
    And I take screenshot of step 6 and scenario "F01"
    And I return to posts list
    And I take screenshot of step 7 and scenario "F01"
    And I open post type filter dropdown
    And I select filter by published posts option
    And I take screenshot of step 8 and scenario "F01"
    Then I see first post with title "New post F1"