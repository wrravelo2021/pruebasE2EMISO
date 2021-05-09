class ViewSitePage
  attr_reader :driver

  def initialize(driver)
    @driver = driver
  end

  def first_post_title
    site_frame = @driver.find_element(
      :css, '.site-frame'
    )
    @driver.switch_to.frame site_frame
    @driver.find_elements(
      :css, '.post-card-title'
    ).first.text
  end
end
