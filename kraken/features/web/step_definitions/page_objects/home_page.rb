class HomePage
  attr_reader :driver

  def initialize(driver)
    @driver = driver
  end

  def go_to_posts
    @driver.find_element(
      :css, '.gh-nav-list-new.relative > a[href="#/posts/"]'
    ).click
  end

  def go_to_pages
    @driver.find_element(
      :css, 'a[href="#/pages/"]'
    ).click
  end

  def go_to_tags
    @driver.find_element(
      :css, 'a[href="#/tags/"]'
    ).click
  end

  def close_published_post_notification
    @driver.find_element(
      :css, '.gh-notification-close'
    ).click
  end

  def close_changed_password_notification
    @driver.find_element(
      :css, '.gh-notification-close'
    ).click
  end

  def sign_out
    @driver.find_element(
      :css, '.gh-user-name.mb1'
    ).click
    sleep 1
    @driver.find_element(
      :css, 'a[href="#/signout/"]'
    ).click
  end

  def go_to_my_profile
    @driver.find_element(
      :css, '.gh-user-name.mb1'
    ).click
    sleep 1
    @driver.find_elements(
      :css, 'a'
    ).select do |element|
      element.text == 'Your Profile'
    end.first.click
  end
end
