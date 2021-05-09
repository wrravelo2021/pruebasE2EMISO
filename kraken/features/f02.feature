Feature: F02

  @user1 @web
  Scenario: As a user I should create and publish post on site
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to posts
    And I go to create new post
    And I enter title "New post F2" for new post
    And I enter body "Cuerpo 2" for new post
    And I publish the post
    And I return to posts list
    And I go to view site
    Then I see first post on site with title "New post F2"