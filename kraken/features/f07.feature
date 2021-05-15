Feature: F07

  @user1 @web
  Scenario: F07 Crear 2 post, ordenar la lista por el mas nuevo, validar en la lista que el post mas reciente esté de primeras
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F07"
    And I click login
    And I take screenshot of step 2 and scenario "F07"
    And I go to posts
    And I take screenshot of step 3 and scenario "F07"
    And I go to create new post
    And I take screenshot of step 4 and scenario "F07"
    And I enter title "Post Publicado 1" for new post
    And I take screenshot of step 5 and scenario "F07"
    And I enter body "Post Publicado 1 body" for new post
    And I take screenshot of step 6 and scenario "F07"
    And I publish the post
    And I take screenshot of step 7 and scenario "F07"
    And I return to posts list
    And I take screenshot of step 8 and scenario "F07"
    And I go to create new post
    And I take screenshot of step 9 and scenario "F07"
    And I enter title "Post Publicado 2" for new post
    And I take screenshot of step 10 and scenario "F07"
    And I enter body "Post Publicado 2 body" for new post
    And I take screenshot of step 11 and scenario "F07"
    And I publish the post
    And I take screenshot of step 12 and scenario "F07"
    And I return to posts list
    And I take screenshot of step 13 and scenario "F07"
    And I open post type filter dropdown
    And I take screenshot of step 14 and scenario "F07"
    And I select filter by published posts option
    And I take screenshot of step 15 and scenario "F07"
    And I select sort by Newest
    And I take screenshot of step 16 and scenario "F07"
    And I select option sort by Newest
    And I take screenshot of step 17 and scenario "F07"
    Then I see first post with title "Post Publicado 2"