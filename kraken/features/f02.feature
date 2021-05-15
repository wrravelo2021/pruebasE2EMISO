Feature: F02

  @user1 @web
  Scenario: As a user I should create and publish post on site
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F02"
    And I click login
    And I take screenshot of step 2 and scenario "F02"
    And I go to posts
    And I take screenshot of step 3 and scenario "F02"
    And I go to create new post
    And I take screenshot of step 4 and scenario "F02"
    And I enter title "New post F2" for new post
    And I enter body "Cuerpo 2" for new post
    And I take screenshot of step 5 and scenario "F02"
    And I publish the post
    And I take screenshot of step 6 and scenario "F02"
    And I return to posts list
    And I take screenshot of step 7 and scenario "F02"
    And I go to view site
    And I take screenshot of step 8 and scenario "F02"
    Then I see first post on site with title "New post F2"