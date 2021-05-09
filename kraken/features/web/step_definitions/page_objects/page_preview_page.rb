class PagePreviewPage
  attr_reader :driver

  def initialize(driver)
    @driver = driver
  end

  def page_body_content
    @driver.find_element(
      :css, '.post-content > p'
    ).text
  end
end
