Feature: F08

  @user1 @web
  Scenario: F08 Crear post, ir al sitio web, validar que esté, volver y eliminarlo, ir de nuevo al sitio web y validar que NO esté
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I click login
    And I go to posts
    And I go to create new post
    And I enter title "Post Publicado" for new post
    And I enter body "Post Publicado body" for new post
    And I publish the post
    And I return to posts list
    And I go to view site
    And I see first post on site with title "Post Publicado"
    And I navigate to ghost admin
    And I go to posts again
    And I click post with title "Post Publicado"
    And I open post settings
    And I click delete post
    And I click confirm delete post
    And I go to view site
    Then I see first post on site with title different to "Post Publicado"