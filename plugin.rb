# name: discourse-cakeday
# about: Show a birthday cake beside the user's name on their birthday or on the date they joined Discourse.
# version: 0.0.2
# authors: Alan Tan
# url: https://github.com/tgxworld/discourse-cakeday

enabled_site_setting :cakeday_enabled

after_initialize do
  require_dependency 'post_serializer'
  require_dependency 'user_serializer'

  public_user_custom_fields_setting = SiteSetting.public_user_custom_fields

  if public_user_custom_fields_setting.empty?
    SiteSetting.set("public_user_custom_fields", "date_of_birth")
  elsif public_user_custom_fields_setting !~ /date_of_birth/
    SiteSetting.set(
      "public_user_custom_fields",
      [SiteSetting.public_user_custom_fields, "date_of_birth"].join("|")
    )
  end

  class ::UserSerializer
    alias_method :_custom_fields, :custom_fields
    def custom_fields
      if !object.custom_fields["date_of_birth"]
        object.custom_fields["date_of_birth"] = ""
        object.save
      end
      _custom_fields
    end
  end

  class ::PostSerializer
    attributes :user_created_at

    def user_created_at
      object.user.try(:created_at)
    end
  end
end
