module DiscourseCakeday
  class BirthdayUserSerializer < ::UserNameSerializer
    attributes :cakeday_date

    def cakeday_date
      object.date_of_birth.strftime("%m/%d")
    end
  end
end
