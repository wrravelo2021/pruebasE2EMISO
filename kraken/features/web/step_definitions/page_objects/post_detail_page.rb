require "date"
class PostDetailPage
  attr_reader :driver

  def initialize(driver)
    @driver = driver
  end

  def enter_title_for_new_post(title)
    @driver.find_element(
      :css, '.gh-editor-title.ember-text-area.gh-input.ember-view'
    ).send_keys(title)
  end

  def enter_body_for_new_post(body)
    @driver.find_element(
      :css, '.koenig-editor__editor.__mobiledoc-editor'
    ).click
    @driver.find_element(
      :css, '.koenig-editor__editor.__mobiledoc-editor'
    ).send_keys(body)
  end

  def publish_post
    @driver.find_element(
      :css, '.gh-btn.gh-btn-outline.gh-publishmenu-trigger.ember-basic-dropdown-trigger.ember-view'
    ).click
    sleep 1
    @driver.find_element(
      :css, '.gh-btn.gh-btn-blue.gh-publishmenu-button.gh-btn-icon.ember-view'
    ).click
  end

  def return_to_posts_list
    @driver.find_element(
      :css, 'a.blue.link.fw4.flex.items-center.ember-view'
    ).click
  end

  def open_post_settings
    @driver.find_element(
      :css, '.post-settings'
    ).click
  end

  def close_post_settings
    @driver.find_element(
      :css, '.close.settings-menu-header-action'
    ).click
  end

  def assign_tag_with_name(name)
    @driver.find_elements(
      :css, '.ember-power-select-trigger-multiple-input'
    ).first.send_keys(name)
    sleep 1
    @driver.find_element(
      :css, '.ember-power-select-option'
    ).click
  end

  def tags_name
    @driver.find_elements(
      :css, '.ember-power-select-multiple-option.tag-token.js-draggableObject.draggable-object.ember-view'
    ).map(&:text)
  end

  def write_future_date 
    @driver.find_element(
      :css, '.gh-date-time-picker-date input'
    ).clear

    @driver.find_element(
      :css, '.gh-date-time-picker-date input'
    ).send_keys((Date.today + 1).to_s, :return)
  end

  def future_date_error
    @driver.find_element(
      :css, '.gh-date-time-picker-error'
    ).text
  end
end
