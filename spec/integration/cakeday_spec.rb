require 'rails_helper'

describe "Cakeyday" do
  describe "when viewing users anniversaries" do
    it "should return the right payload" do
      time = Time.zone.local(2016, 9, 29)

      Timecop.freeze(time) do
        user = Fabricate(:user, created_at: time - 1.day)
        user2 = Fabricate(:user, created_at: time)
        user3 = Fabricate(:user, created_at: time + 1.day)
        user4 = Fabricate(:user, created_at: time + 2.day)

        get "/cakeday/anniversaries.json", page: 0, month: time.month

        expect(response.status).to eq(200)

        body = JSON.parse(response.body)

        expect(body["anniversaries"].map { |user| user["id"] }).to eq(
          [user.id, user2.id, user3.id]
        )

        expect(body["extras"]["today"].map { |u| u["id"] }).to eq(
          [user2.id]
        )

        expect(body["extras"]["upcoming"].map { |u| u["id"] }).to eq(
          [user3.id, user4.id]
        )
      end
    end
  end

  describe "when viewing users birthdays" do
    it "should return the right payload" do
      time = Time.zone.local(2016, 9, 29)

      Timecop.freeze(time) do
        user = Fabricate(:user)
        user.custom_fields["date_of_birth"] = "1904-9-28"
        user.save!

        user2 = Fabricate(:user)
        user2.custom_fields["date_of_birth"] = "1904-9-29"
        user2.save!

        user3 = Fabricate(:user)
        user3.custom_fields["date_of_birth"] = "1904-9-30"
        user3.save!

        user4 = Fabricate(:user)
        user4.custom_fields["date_of_birth"] = "1904-10-1"
        user4.save!

        get "/cakeday/birthdays.json", page: 0, month: time.month

        expect(response.status).to eq(200)

        body = JSON.parse(response.body)

        expect(body["birthdays"].map { |user| user["id"] }).to eq(
          [user.id, user2.id, user3.id]
        )

        expect(body["extras"]["today"].map { |u| u["id"] }).to eq(
          [user2.id]
        )

        expect(body["extras"]["upcoming"].map { |u| u["id"] }).to eq(
          [user3.id, user4.id]
        )
      end
    end
  end
end
