# frozen_string_literal: true

# name: discourse-cakeday
# about: Show a birthday cake beside the user's name on their birthday and/or on the date they joined Discourse.
# version: 0.3
# authors: Alan Tan
# url: https://github.com/discourse/discourse-cakeday
# transpile_js: true

register_asset "stylesheets/cakeday.scss"
register_asset "stylesheets/emoji-images.scss"
register_asset "stylesheets/mobile/user-date-of-birth-input.scss"

register_svg_icon "birthday-cake" if respond_to?(:register_svg_icon)

enabled_site_setting :cakeday_enabled

after_initialize do
  module ::DiscourseCakeday
    PLUGIN_NAME = "discourse-cakeday"

    class Engine < ::Rails::Engine
      engine_name PLUGIN_NAME
      isolate_namespace DiscourseCakeday
    end
  end

  ::DiscourseCakeday::Engine.routes.draw do
    get "birthdays" => "birthdays#index"
    get "birthdays/:filter" => "birthdays#index"
    get "anniversaries" => "anniversaries#index"
    get "anniversaries/:filter" => "anniversaries#index"
  end

  Discourse::Application.routes.append { mount ::DiscourseCakeday::Engine, at: "/cakeday" }

  %w[
    ../app/jobs/onceoff/fix_invalid_date_of_birth.rb
    ../app/jobs/onceoff/migrate_date_of_birth_to_users_table.rb
    ../app/serializers/discourse_cakeday/cakeday_user_serializer.rb
    ../app/controllers/discourse_cakeday/cakeday_controller.rb
    ../app/controllers/discourse_cakeday/anniversaries_controller.rb
    ../app/controllers/discourse_cakeday/birthdays_controller.rb
  ].each { |path| load File.expand_path(path, __FILE__) }

  # overwrite the user and user_card serializers to show
  # the cakes on the user card and on the user profile pages
  %i[user user_card].each do |serializer|
    add_to_serializer(serializer, :cakedate, include_condition: -> { scope.user.present? }) do
      timezone = scope.user.user_option&.timezone.presence || "UTC"
      object.created_at.in_time_zone(timezone).strftime("%Y-%m-%d")
    end

    add_to_serializer(
      serializer,
      :birthdate,
      include_condition: -> { SiteSetting.cakeday_birthday_enabled && scope.user.present? },
    ) { object.date_of_birth }
  end

  # overwrite the post serializer to show the cakes next to the
  # username in the posts stream
  add_to_serializer(
    :post,
    :user_cakedate,
    include_condition: -> { scope.user.present? && object.user&.created_at.present? },
  ) do
    timezone = scope.user.user_option&.timezone.presence || "UTC"
    object.user.created_at.in_time_zone(timezone).strftime("%Y-%m-%d")
  end

  add_to_serializer(
    :post,
    :user_birthdate,
    include_condition: -> do
      SiteSetting.cakeday_birthday_enabled && scope.user.present? &&
        object.user&.date_of_birth.present?
    end,
  ) { object.user.date_of_birth }
end
