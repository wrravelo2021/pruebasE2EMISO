if ENV['ADB_DEVICE_ARG'].nil?
  require 'kraken-mobile/steps/web/kraken_steps'
  Dir["#{File.dirname(__FILE__)}/page_objects/*.rb"]
    .sort_by { |file| File.mtime(file) }
    .each { |file| require file }

  user_email = 'drummerwilliam@gmail.com'
  user_password = 'pruebasmiso'

  When('I navigate to ghost admin') do
    @driver.navigate.to 'http://localhost:2369/ghost'
    sleep 1
  end

  ####################
  # Login page #######
  ####################
  When(/^I enter email "([^"]*)" in login page$/) do |email|
    login_page = LoginPage.new(@driver)
    login_page.enter_email(email)
    sleep 1
  end

  When(/^I enter password "([^"]*)" in login page$/) do |password|
    login_page = LoginPage.new(@driver)
    login_page.enter_password(password)
    sleep 1
  end

  When('I enter my email in login page') do
    login_page = LoginPage.new(@driver)
    login_page.enter_email(user_email)
    sleep 1
  end

  When('I enter my password in login page') do
    login_page = LoginPage.new(@driver)
    login_page.enter_password(user_password)
    sleep 1
  end

  When('I click login') do
    login_page = LoginPage.new(@driver)
    login_page.click_login
    sleep 1
  end

  ####################
  # Home page ########
  ####################
  When('I go to posts') do
    home_page = HomePage.new(@driver)
    home_page.go_to_posts
    sleep 1
  end

  When('I go to pages') do
    home_page = HomePage.new(@driver)
    home_page.go_to_pages
    sleep 1
  end

  When('I go to tags') do
    home_page = HomePage.new(@driver)
    home_page.go_to_tags
    sleep 1
  end

  When('I close the published post notification') do
    home_page = HomePage.new(@driver)
    home_page.close_published_post_notification
    sleep 1
  end

  When('I close the changed password notification') do
    home_page = HomePage.new(@driver)
    home_page.close_changed_password_notification
    sleep 1
  end

  When('I sign out') do
    home_page = HomePage.new(@driver)
    home_page.sign_out
    sleep 1
  end

  When('I go to my profile') do
    home_page = HomePage.new(@driver)
    home_page.go_to_my_profile
    sleep 1
  end

  ####################
  # Page detail page #
  ####################
  When(/^I enter title "([^"]*)" for new page$/) do |title|
    page_detail_page = PageDetailPage.new(@driver)
    page_detail_page.enter_title_for_new_page(title)
    sleep 1
  end

  When(/^I enter body "([^"]*)" for new page$/) do |body|
    page_detail_page = PageDetailPage.new(@driver)
    page_detail_page.enter_body_for_new_page(body)
    sleep 1
  end

  When('I publish the page') do
    page_detail_page = PageDetailPage.new(@driver)
    page_detail_page.publish_page
    sleep 1
  end

  When('I return to pages list') do
    page_detail_page = PageDetailPage.new(@driver)
    page_detail_page.return_to_pages_list
    sleep 1
  end

  When('I open page settings') do
    page_detail_page = PageDetailPage.new(@driver)
    page_detail_page.open_page_settings
    sleep 1
  end

  When('I close page settings') do
    page_detail_page = PageDetailPage.new(@driver)
    page_detail_page.close_page_settings
    sleep 1
  end

  When('I open page preview') do
    page_detail_page = PageDetailPage.new(@driver)
    page_detail_page.open_page_preview
    sleep 1
  end

  ####################
  # Pages page #######
  ####################
  When('I go to create new page') do
    pages_page = PagesPage.new(@driver)
    pages_page.go_to_create_new_page
    sleep 1
  end

  When('I open page type filter dropdown') do
    pages_page = PagesPage.new(@driver)
    pages_page.open_page_type_filter_dropdown
    sleep 1
  end

  When('I select filter by published pages option') do
    pages_page = PagesPage.new(@driver)
    pages_page.select_filter_by_published_pages_option
    sleep 1
  end

  When(/^I click page with title "([^"]*)"$/) do |title|
    pages_page = PagesPage.new(@driver)
    pages_page.click_page_with_title(title)
    sleep 1
  end

  ####################
  # Post detail page #
  ####################
  When(/^I enter title "([^"]*)" for new post$/) do |title|
    post_detail_page = PostDetailPage.new(@driver)
    post_detail_page.enter_title_for_new_post(title)
    sleep 1
  end

  When(/^I enter body "([^"]*)" for new post$/) do |body|
    post_detail_page = PostDetailPage.new(@driver)
    post_detail_page.enter_body_for_new_post(body)
    sleep 1
  end

  When('I publish the post') do
    post_detail_page = PostDetailPage.new(@driver)
    post_detail_page.publish_post
    sleep 1
  end

  When('I return to posts list') do
    post_detail_page = PostDetailPage.new(@driver)
    post_detail_page.return_to_posts_list
    sleep 1
  end

  When('I open post settings') do
    post_detail_page = PostDetailPage.new(@driver)
    post_detail_page.open_post_settings
    sleep 1
  end

  When('I close post settings') do
    post_detail_page = PostDetailPage.new(@driver)
    post_detail_page.close_post_settings
    sleep 1
  end

  When(/^I assign tag with name "([^"]*)"$/) do |name|
    post_detail_page = PostDetailPage.new(@driver)
    post_detail_page.assign_tag_with_name(name)
    sleep 1
  end

  ####################
  # Posts page #######
  ####################
  When('I go to create new post') do
    posts_page = PostsPage.new(@driver)
    posts_page.go_to_create_new_post
    sleep 1
  end

  When('I open post type filter dropdown') do
    posts_page = PostsPage.new(@driver)
    posts_page.open_post_type_filter_dropdown
    sleep 1
  end

  When('I select filter by published posts option') do
    posts_page = PostsPage.new(@driver)
    posts_page.select_filter_by_published_posts_option
    sleep 1
  end

  When('I select filter by drafted posts option') do
    posts_page = PostsPage.new(@driver)
    posts_page.select_filter_by_drafted_posts_option
    sleep 1
  end

  When(/^I click post with title "([^"]*)"$/) do |title|
    posts_page = PostsPage.new(@driver)
    posts_page.click_post_with_title(title)
    sleep 1
  end

  When(/^I see first post with title "([^"]*)"$/) do |title|
    posts_page = PostsPage.new(@driver)
    post_title = posts_page.first_post_title
    expect(post_title).to eq(title)

    sleep 1
  end

  ####################
  # Profile page #####
  ####################
  When(/^I enter old password "([^"]*)" in profile page$/) do |password|
    profile_page = ProfilePage.new(@driver)
    profile_page.enter_old_password(password)
    sleep 1
  end

  When(/^I enter old password in profile page$/) do
    profile_page = ProfilePage.new(@driver)
    profile_page.enter_old_password(user_password)
    sleep 1
  end

  When(/^I enter new password "([^"]*)" in profile page$/) do |password|
    profile_page = ProfilePage.new(@driver)
    profile_page.enter_new_password(password)
    sleep 1
  end

  When('I enter new password as original password in profile page') do
    profile_page = ProfilePage.new(@driver)
    profile_page.enter_new_password(user_password)
    sleep 1
  end

  When(
    /^I enter new password confirmation "([^"]*)" in profile page$/
  ) do |password|
    profile_page = ProfilePage.new(@driver)
    profile_page.enter_new_password_confirmation(password)
    sleep 1
  end

  When(
    'I enter new password confirmation as original password in profile page'
  ) do
    profile_page = ProfilePage.new(@driver)
    profile_page.enter_new_password_confirmation(user_password)
    sleep 1
  end

  When('I click change password') do
    profile_page = ProfilePage.new(@driver)
    profile_page.click_change_password
    sleep 1
  end

  When('I scroll to bottom in profile page') do
    profile_page = ProfilePage.new(@driver)
    profile_page.scroll_to_bottom
    sleep 1
  end

  ####################
  # Tag detail page ##
  ####################
  When(/^I enter title for new tag "([^"]*)"$/) do |name|
    tag_detail_page = TagDetailPage.new(@driver)
    tag_detail_page.enter_title_for_new_tag(name)
    sleep 1
  end

  When('I click save new tag') do
    tag_detail_page = TagDetailPage.new(@driver)
    tag_detail_page.click_save
    sleep 1
  end

  When('I click delete tag') do
    tag_detail_page = TagDetailPage.new(@driver)
    tag_detail_page.click_delete
    sleep 1
  end

  When('I click confirm delete tag') do
    tag_detail_page = TagDetailPage.new(@driver)
    tag_detail_page.click_confirm_delete
    sleep 1
  end

  ####################
  # Tags page ########
  ####################
  When('I go to create new tag') do
    tags_page = TagsPage.new(@driver)
    tags_page.go_to_create_new_tag
    sleep 1
  end

  When(/^I click tag with name "([^"]*)"$/) do |name|
    tags_page = TagsPage.new(@driver)
    tags_page.click_tag_with_name(name)
    sleep 1
  end
end
