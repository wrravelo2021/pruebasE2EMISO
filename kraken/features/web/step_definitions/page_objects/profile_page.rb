class ProfilePage
  attr_reader :driver

  def initialize(driver)
    @driver = driver
  end

  def scroll_to_bottom
    element = @driver.find_element(
      :css, '#user-password-old'
    )
    @driver.execute_script(
      'arguments[0].scrollIntoView(true);',
      element
    )
  end

  def enter_old_password(password)
    @driver.find_element(
      :css, '#user-password-old'
    ).send_keys(password)
  end

  def enter_new_password(password)
    @driver.find_element(
      :css, '#user-password-new'
    ).send_keys(password)
  end

  def enter_new_password_confirmation(password)
    @driver.find_element(
      :css, '#user-new-password-verification'
    ).send_keys(password)
  end

  def click_change_password
    @driver.find_element(
      :css, '.gh-btn.gh-btn-red.gh-btn-icon.button-change-password.ember-view'
    ).click
  end
end
