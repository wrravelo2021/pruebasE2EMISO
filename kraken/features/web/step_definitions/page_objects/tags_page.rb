class TagsPage
  attr_reader :driver

  def initialize(driver)
    @driver = driver
  end

  def go_to_create_new_tag
    @driver.find_element(
      :css, 'a[href="#/tags/new/"]'
    ).click
  end

  def click_tag_with_name(name)
    @driver.find_elements(
      :css, '.gh-tag-list-name'
    ).select do |element|
      element.text == name
    end.first.click
  end
end
