Feature: F13

  @user1 @web
  Scenario: As a user I should change user password and login correctly
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F13"
    And I click login
    And I take screenshot of step 2 and scenario "F13"
    And I go to my profile
    And I take screenshot of step 3 and scenario "F13"
    And I scroll to bottom in profile page
    And I enter old password in profile page
    And I enter new password "nuevapruebasmiso" in profile page
    And I enter new password confirmation "nuevapruebasmiso" in profile page
    And I take screenshot of step 4 and scenario "F13"
    And I click change password
    And I close the changed password notification
    And I take screenshot of step 5 and scenario "F13"
    And I sign out
    And I enter my email in login page
    And I enter password "nuevapruebasmiso" in login page
    And I take screenshot of step 6 and scenario "F13"
    And I click login
    And I take screenshot of step 7 and scenario "F13"
    And I go to my profile
    And I scroll to bottom in profile page
    And I enter old password "nuevapruebasmiso" in profile page
    And I enter new password as original password in profile page
    And I enter new password confirmation as original password in profile page
    And I click change password