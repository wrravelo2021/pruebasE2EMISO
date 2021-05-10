require "date"
class PageDetailPage
  attr_reader :driver

  def initialize(driver)
    @driver = driver
  end

  def enter_title_for_new_page(title)
    @driver.find_element(
      :css, '.gh-editor-title.ember-text-area.gh-input.ember-view'
    ).send_keys(title)
  end

  def enter_body_for_new_page(body)
    @driver.find_element(
      :css, '.koenig-editor__editor.__mobiledoc-editor'
    ).click
    @driver.find_element(
      :css, '.koenig-editor__editor.__mobiledoc-editor'
    ).send_keys(body)
  end

  def publish_page
    @driver.find_element(
      :css, '.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view'
    ).click
    sleep 1
    @driver.find_element(
      :css, '.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view'
    ).click
  end

  def schedule_page
    @driver.find_element(
      :css, '.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view'
    ).click
    sleep 1
    @driver.find_elements(
      :css, '.gh-publishmenu-radio-button' 
    )[1].click
    sleep 1
    @driver.find_element(
      :css, '.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view'
    ).click
  end

  def return_to_pages_list
    @driver.find_element(
      :css, 'a.blue.link.fw4.flex.items-center.ember-view'
    ).click
  end

  def open_page_settings
    @driver.find_element(
      :css, '.post-settings'
    ).click
  end

  def close_page_settings
    @driver.find_element(
      :css, '.close.settings-menu-header-action'
    ).click
  end

  def open_page_preview
    @driver.find_element(
      :css, '.post-view-link'
    ).click
  end

  def erase_body_content
    @driver.find_element(
      :css, '.koenig-editor__editor.__mobiledoc-editor'
    ).clear
  end

  def write_future_date 
    @driver.find_element(
      :css, '.gh-date-time-picker-date input'
    ).clear

    @driver.find_element(
      :css, '.gh-date-time-picker-date input'
    ).send_keys((Date.today + 2).to_s, :return)
  end

  def future_date_error
    @driver.find_element(
      :css, '.gh-date-time-picker-error'
    ).text
  end
end
