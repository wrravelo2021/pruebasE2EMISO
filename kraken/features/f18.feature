Feature: F18

  @user1 @web
  Scenario: As a user I should change user password and login whith wrong password
    Given I navigate to ghost admin
    When I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 1 and scenario "F18"
    And I click login
    And I take screenshot of step 2 and scenario "F18"
    And I go to my profile
    And I take screenshot of step 3 and scenario "F18"
    And I scroll to bottom in profile page
    And I enter old password in profile page
    And I enter new password "nuevapruebasmiso" in profile page
    And I enter new password confirmation "nuevapruebasmiso" in profile page
    And I take screenshot of step 4 and scenario "F18"
    And I click change password
    And I take screenshot of step 5 and scenario "F18"
    And I close the changed password notification
    And I take screenshot of step 6 and scenario "F18"
    And I sign out
    And I take screenshot of step 7 and scenario "F18"
    And I enter my email in login page
    And I enter my password in login page
    And I take screenshot of step 8 and scenario "F18"
    And I click login
    And I take screenshot of step 9 and scenario "F18"
    And I see wrong password error
    And I clear password input in login page
    And I take screenshot of step 10 and scenario "F18"
    And I enter password "nuevapruebasmiso" in login page
    And I take screenshot of step 11 and scenario "F18"
    And I click login
    And I take screenshot of step 12 and scenario "F18"
    And I go to my profile
    And I take screenshot of step 13 and scenario "F18"
    And I scroll to bottom in profile page
    And I enter old password "nuevapruebasmiso" in profile page
    And I enter new password as original password in profile page
    And I enter new password confirmation as original password in profile page
    And I take screenshot of step 14 and scenario "F18"
    And I click change password
    And I take screenshot of step 15 and scenario "F18"
