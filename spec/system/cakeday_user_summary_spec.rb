# frozen_string_literal: true

describe "Cakeday/Birthday emojis", type: :system do
  CONTROL_DATE = Time.zone.local(2020, 6, 10)
  fab!(:admin_w_birthday) { Fabricate(:admin, date_of_birth: CONTROL_DATE.prev_year(14)) }

  let(:user_page) { PageObjects::Pages::User.new }
  let(:user_menu) { PageObjects::Components::UserMenu.new }

  before { sign_in(admin_w_birthday) }

  context "for users with `created_at` and `date_of_brith` dates" do
    fab!(:user_w_cakeday) { Fabricate(:user, created_at: CONTROL_DATE.prev_year) }

    it "correctly shows emojis in users' profiles" do
      page.driver.with_playwright_page do |pw_page|
        pw_page.clock.install(time: CONTROL_DATE)
      end

      user_page.visit(user_w_cakeday)

      expect(page).to have_current_path("/u/#{user_w_cakeday.username}/summary")
      user_page.assert_selector(".user-cakeday div[title='Today is the anniversary of the day I joined this community!']")

      user_menu.open.click_profile_tab
      find(".summary").click

      expect(page).to have_current_path("/u/#{admin_w_birthday.username}/summary")
      user_page.assert_selector(".user-cakeday div[title='Today is your birthday!']")
    end
  end
end