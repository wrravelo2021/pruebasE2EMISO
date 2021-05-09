class PagesPage
  attr_reader :driver

  def initialize(driver)
    @driver = driver
  end

  def go_to_create_new_page
    @driver.find_element(
      :css, 'a[href="#/editor/page/"]'
    ).click
  end

  def open_page_type_filter_dropdown
    @driver.find_elements(
      :css, '.ember-power-select-selected-item'
    ).first.click
  end

  def select_filter_by_published_pages_option
    @driver.find_elements(
      :css, '.ember-power-select-option'
    ).select do |element|
      element.text == 'Published pages'
    end.first.click
  end

  def select_filter_by_drafted_pages_option
    @driver.find_elements(
      :css, '.ember-power-select-option'
    ).select do |element|
      element.text == 'Draft pages'
    end.first.click
  end

  def click_page_with_title(title)
    @driver.find_elements(
      :css, '.gh-content-entry-title'
    ).select do |element|
      element.text == title
    end.first.click
  end
end
