Feature: F06

  @user1 @web
  Scenario: Crear Draft post, validarlo en la lista
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F06"
    And I click login
    And I take screenshot of step 2 and scenario "F06"
    And I go to posts
    And I take screenshot of step 3 and scenario "F06"
    And I go to create new post
    And I take screenshot of step 4 and scenario "F06"
    And I enter title "New Drafted Post" for new post
    And I take screenshot of step 5 and scenario "F06"
    And I enter body "New Drafted Post body" for new post
    And I take screenshot of step 6 and scenario "F06"
    And I return to posts list
    And I take screenshot of step 7 and scenario "F06"
    And I open post type filter dropdown
    And I take screenshot of step 8 and scenario "F06"
    And I select filter by drafted posts option
    And I take screenshot of step 9 and scenario "F06"
    Then I see first post with title "New Drafted Post"
