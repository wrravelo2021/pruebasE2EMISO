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

  def enter_description_for_new_tag(description)
    @driver.find_element(
      :css, 'textarea[name="description"]'
    ).send_keys(description)
  end

  def enter_meta_title_for_new_tag(metaTitle)
    @driver.find_element(
      :css, 'input[name="metaTitle"]'
    ).send_keys(metaTitle)
  end

  def enter_meta_description_for_new_ta(metaDescription)
    @driver.find_element(
      :css, 'textarea[name="metaDescription"]'
    ).send_keys(metaDescription)
  end

  def click_save
    @driver.find_element(
      :css, '.gh-btn.gh-btn-blue.gh-btn-icon.ember-view'
    ).click
  end

  def click_delete
    @driver.find_element(
      :css, '.gh-btn.gh-btn-red.gh-btn-icon.mb15'
    ).click
  end

  def click_confirm_delete
    @driver.find_element(
      :css, '.gh-btn.gh-btn-red.gh-btn-icon.ember-view'
    ).click
  end

  def click_expand_meta_data
    @driver.find_elements(
      :css, '.gh-btn'
    )[2].click
  end
end
