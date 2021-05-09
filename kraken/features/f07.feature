Feature: F07

  @user1 @web
  Scenario: F07 Crear 2 post, ordenar la lista por el mas nuevo, validar en la lista que el post mas reciente esté de primeras
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to posts
    And I go to create new post
    And I enter title "Post Publicado 1" for new post
    And I enter body "Post Publicado 1 body" for new post
    And I publish the post
    And I return to posts list
    And I go to create new post
    And I enter title "Post Publicado 2" for new post
    And I enter body "Post Publicado 2 body" for new post
    And I publish the post
    And I return to posts list
    And I open post type filter dropdown
    And I select filter by published posts option
    And I select sort by Newest
    And I select option sort by Newest
    Then I see first post with title "Post Publicado 2"