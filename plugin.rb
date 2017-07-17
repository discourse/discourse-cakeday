# name: discourse-cakeday
# about: Show a birthday cake beside the user's name on their birthday or on the date they joined Discourse.
# version: 0.2
# authors: Alan Tan
# url: https://github.com/discourse/discourse-cakeday

PLUGIN_NAME = "discourse-cakeday"

register_asset 'stylesheets/cakeday.scss'
register_asset 'stylesheets/emoji-images.scss'
register_asset 'stylesheets/mobile/user-date-of-birth-input.scss'

after_initialize do
  module ::DiscourseCakeday
    class Engine < ::Rails::Engine
      engine_name PLUGIN_NAME
      isolate_namespace DiscourseCakeday
    end
  end

  ::DiscourseCakeday::Engine.routes.draw do
    get "birthdays" => "birthdays#index"
    get "birthdays/(:filter)" => "birthdays#index"
    get "anniversaries" => "anniversaries#index"
    get "anniversaries/(:filter)" => "anniversaries#index"
  end

  Discourse::Application.routes.append do
    mount ::DiscourseCakeday::Engine, at: "/cakeday"
  end

  load File.expand_path("../app/jobs/onceoff/fix_invalid_date_of_birth.rb", __FILE__)
  load File.expand_path("../app/jobs/onceoff/migrate_date_of_birth_to_users_table.rb", __FILE__)
  load File.expand_path("../app/serializers/discourse_cakeday/anniversary_user_serializer.rb", __FILE__)
  load File.expand_path("../app/serializers/discourse_cakeday/birthday_user_serializer.rb", __FILE__)
  load File.expand_path("../app/controllers/discourse_cakeday/cakeday_controller.rb", __FILE__)
  load File.expand_path("../app/controllers/discourse_cakeday/anniversaries_controller.rb", __FILE__)
  load File.expand_path("../app/controllers/discourse_cakeday/birthdays_controller.rb", __FILE__)

  if OnceoffLog.where(job_name: 'MigrateDateOfBirthToUsersTable').exists?
    UserCustomField.where(name: 'date_of_birth').delete_all
  end

  require_dependency 'user'
  class ::User
    scope :valid, ->() {
      activated.not_blocked.not_suspended.real
    }

    scope :order_by_likes_received, ->() {
      joins(:user_stat)
      .order("user_stats.likes_received DESC")
    }
  end

  require_dependency 'post_serializer'
  require_dependency 'user_serializer'

  class ::UserSerializer
    attributes :date_of_birth

    def include_date_of_birth?
      scope.user.present?
    end
  end

  class ::PostSerializer
    attributes :user_created_at, :user_date_of_birth

    def include_user_created_at?
      scope.user.present?
    end

    def user_created_at
      object.user&.created_at
    end

    def include_user_date_of_birth?
      scope.user.present?
    end

    def user_date_of_birth
      object.user&.date_of_birth
    end
  end
end
