class LoginPage
  attr_reader :driver

  def initialize(driver)
    @driver = driver
  end

  def enter_email(email)
    @driver.find_element(
      :css, 'input[name="identification"]'
    ).send_keys(email)
  end

  def enter_password(password)
    @driver.find_element(
      :css, 'input[name="password"]'
    ).send_keys(password)
  end

  def click_login
    @driver.find_element(
      :css, 'button.login'
    ).click
  end

  def error_message
    @driver.find_element(
      :css, '.main-error'
    ).text
  end

  def clear_password
    @driver.find_element(
      :css, 'input[name="password"]'
    ).clear
  end
end
