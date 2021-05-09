class TagDetailPage
  attr_reader :driver

  def initialize(driver)
    @driver = driver
  end

  def enter_title_for_new_tag(name)
    @driver.find_element(
      :css, 'input[name="name"]'
    ).send_keys(name)
  end

  def click_save
    @driver.find_elements(
      :css, '.gh-btn.gh-btn-blue.gh-btn-icon.ember-view'
    ).click
  end

  def click_delete
    @driver.find_elements(
      :css, '.gh-btn.gh-btn-red.gh-btn-icon.mb15'
    ).click
  end

  def click_confirm_delete
    @driver.find_elements(
      :css, '.gh-btn.gh-btn-red.gh-btn-icon.ember-view'
    ).click
  end
end
