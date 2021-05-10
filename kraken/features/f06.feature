Feature: F06

  @user1 @web
  Scenario: Crear Draft post, validarlo en la lista
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to posts
    And I go to create new post
    And I enter title "New Drafted Post" for new post
    And I enter body "New Drafted Post body" for new post
    And I return to posts list
    And I open post type filter dropdown
    And I select filter by drafted posts option
    Then I see first post with title "New Drafted Post"
