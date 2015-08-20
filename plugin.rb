# name: discourse-its-your-birthday
# about: Show a birthday cake beside the user's name on their birthday!
# version: 0.0.1
# authors: Alan Tan
# url: https://github.com/tgxworld/discourse-its-your-birthday

enabled_site_setting :its_your_birthday_enabled

after_initialize do
  require_dependency 'post_serializer'
  class ::PostSerializer
    attributes :user_created_at

    def user_created_at
      object.user.created_at
    end
  end
end
