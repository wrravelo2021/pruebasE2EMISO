Feature: F03

  @user1 @web
  Scenario: As a user I should not be able to write future date for post
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F03"
    And I click login
    And I take screenshot of step 2 and scenario "F03"
    And I go to posts
    And I take screenshot of step 3 and scenario "F03"
    And I go to create new post
    And I take screenshot of step 4 and scenario "F03"
    And I enter title "New post F3" for new post
    And I enter body "Cuerpo 3" for new post
    And I take screenshot of step 5 and scenario "F03"
    And I publish the post
    And I take screenshot of step 6 and scenario "F03"
    And I return to posts list
    And I take screenshot of step 7 and scenario "F03"
    And I click post with title "New post F3"
    And I take screenshot of step 8 and scenario "F03"
    And I open post settings
    And I take screenshot of step 9 and scenario "F03"
    And I write future date
    And I take screenshot of step 10 and scenario "F03"
    Then I see future date error