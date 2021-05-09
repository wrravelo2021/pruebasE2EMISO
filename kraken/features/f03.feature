Feature: F03

  @user1 @web
  Scenario: As a user I should not be able to write future date for post
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to posts
    And I go to create new post
    And I enter title "New post F3" for new post
    And I enter body "Cuerpo 3" for new post
    And I publish the post
    And I return to posts list
    And I click post with title "New post F3"
    And I open post settings
    And I write future date
    Then I see future date error