module DiscourseCakeday
  class AnniversaryUserSerializer < ::UserNameSerializer
    attributes :cakeday_date

    def cakeday_date
      object.created_at
    end
  end
end
