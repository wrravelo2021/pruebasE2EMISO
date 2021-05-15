Feature: F08

  @user1 @web
  Scenario: F08 Crear post, ir al sitio web, validar que esté, volver y eliminarlo, ir de nuevo al sitio web y validar que NO esté
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F08"
    And I click login
    And I take screenshot of step 2 and scenario "F08"
    And I go to posts
    And I take screenshot of step 3 and scenario "F08"
    And I go to create new post
    And I take screenshot of step 4 and scenario "F08"
    And I enter title "Post Publicado" for new post
    And I take screenshot of step 5 and scenario "F08"
    And I enter body "Post Publicado body" for new post
    And I take screenshot of step 6 and scenario "F08"
    And I publish the post
    And I take screenshot of step 7 and scenario "F08"
    And I return to posts list
    And I take screenshot of step 8 and scenario "F08"
    And I go to view site
    And I take screenshot of step 9 and scenario "F08"
    And I see first post on site with title "Post Publicado"
    And I take screenshot of step 10 and scenario "F08"
    And I navigate to ghost admin
    And I take screenshot of step 11 and scenario "F08"
    And I go to posts again
    And I take screenshot of step 12 and scenario "F08"
    And I click post with title "Post Publicado"
    And I take screenshot of step 13 and scenario "F08"
    And I open post settings
    And I take screenshot of step 14 and scenario "F08"
    And I click delete post
    And I take screenshot of step 15 and scenario "F08"
    And I click confirm delete post
    And I take screenshot of step 16 and scenario "F08"
    And I go to view site
    And I take screenshot of step 17 and scenario "F08"
    Then I see first post on site with title different to "Post Publicado"