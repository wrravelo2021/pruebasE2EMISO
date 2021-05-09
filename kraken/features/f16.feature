Feature: Example feature

  @user1 @web
  Scenario: As a first user I say hi to a second user
    Given I navigate to page "http://localhost:2369/ghost"
    When I enter email "drummerwilliam@gmail.com" in login page
    And I enter password "pruebasmiso" in login page
    And I click login
    And I go to posts
    And I go to create new post
    And I enter title "Test" for new post
    And I enter body "Test" for new post
    And I publish the post
    And I return to posts list
    And I close the published post notification
