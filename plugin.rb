# name: discourse-cakeday
# about: Show a birthday cake beside the user's name on their birthday or on the date they joined Discourse.
# version: 0.0.1
# authors: Alan Tan
# url: https://github.com/tgxworld/discourse-cakeday

after_initialize do
  require_dependency 'post_serializer'
  class ::PostSerializer
    attributes :user_created_at

    def user_created_at
      object.user.created_at
    end
  end
end
