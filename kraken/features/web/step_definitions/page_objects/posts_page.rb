class PostsPage
  attr_reader :driver

  def initialize(driver)
    @driver = driver
  end

  def go_to_create_new_post
    @driver.find_element(
      :css, 'a[href="#/editor/post/"]'
    ).click
  end

  def open_post_type_filter_dropdown
    @driver.find_elements(
      :css, '.ember-power-select-selected-item'
    ).first.click
  end

  def open_post_tags_filter_dropdown
    @driver.find_elements(
      :css, '.ember-power-select-selected-item'
    )[2].click
  end

  def select_filter_by_published_posts_option
    @driver.find_elements(
      :css, '.ember-power-select-option'
    ).select do |element|
      element.text == 'Published posts'
    end.first.click
  end

  def select_filter_by_drafted_posts_option
    @driver.find_elements(
      :css, '.ember-power-select-option'
    ).select do |element|
      element.text == 'Draft posts'
    end.first.click
  end

  def select_filter_by_scheduled_posts_option
    @driver.find_elements(
      :css, '.ember-power-select-option'
    ).select do |element|
      element.text == 'Scheduled posts'
    end.first.click
  end

  def select_filter_by_tagname_posts_option(tagName)
    @driver.find_elements(
      :css, '.ember-power-select-option'
    ).select do |element|
      element.text == tagName
    end.first.click
  end

  def click_post_with_title(title)
    @driver.find_elements(
      :css, '.gh-content-entry-title'
    ).select do |element|
      element.text == title
    end.first.click
  end

  def first_post_title
    @driver.find_elements(
      :css, '.gh-content-entry-title'
    ).first.text
  end
end
