require 'rails_helper'

describe "Cakeyday" do
  describe 'when not logged in' do
    it 'should return the right response' do
      expect { get "/cakeday/anniversaries.json", page: 0, month: 5 }
        .to raise_error(Discourse::NotLoggedIn)
    end
  end

  describe 'when logged in' do
    before do
      sign_in(Fabricate(:user))
    end

    describe "when viewing users anniversaries" do
      it "should return the right payload" do
        time = Time.zone.local(2016, 9, 30)

        Timecop.freeze(time) do
          user = Fabricate(:user, created_at: time - 1.day)

          user2 = Fabricate(:user, created_at: time)
          user2.user_stat.update!(likes_received: 1)

          user3 = Fabricate(:user, created_at: time + 1.day)
          user4 = Fabricate(:user, created_at: time + 2.day)
          user5 = Fabricate(:user, created_at: time - 1.year)

          get "/cakeday/anniversaries.json", page: 0, month: time.month

          body = JSON.parse(response.body)

          expect(body["anniversaries"].map { |user| user["id"] }).to eq(
            [user5.id, user.id, user2.id]
          )

          get "/cakeday/anniversaries.json",
            page: 0,
            month: time.month,
            filter: 'today'

          body = JSON.parse(response.body)

          expect(body["anniversaries"].map { |user| user["id"] }).to eq(
            [user2.id, user5.id]
          )

          get "/cakeday/anniversaries.json",
            page: 0,
            month: time.month,
            filter: 'upcoming'

          body = JSON.parse(response.body)

          expect(body["anniversaries"].map { |u| u["id"] }).to eq(
            [user3.id, user4.id]
          )
        end
      end

      context 'when a timezone offset is given' do
        it 'should return the right payload' do
          time = Time.zone.local(2016, 9, 30, 5, 30)

          Timecop.freeze(time) do
            user = Fabricate(:user, created_at: time - 6.hours)
            user.user_stat.update!(likes_received: 1)

            user2 = Fabricate(:user, created_at: time)
            user3 = Fabricate(:user, created_at: time + 1.day)
            user4 = Fabricate(:user, created_at: time + 2.day)
            user5 = Fabricate(:user, created_at: time - 1.year - 6.hours)

            get "/cakeday/anniversaries.json",
              page: 0,
              month: time.month,
              timezone_offset: "540"

            body = JSON.parse(response.body)

            expect(body["anniversaries"].map { |user| user["id"] }).to eq(
              [user5.id, user.id, user2.id]
            )

            get "/cakeday/anniversaries.json",
              page: 0,
              month: time.month,
              filter: 'today',
              timezone_offset: "540"

            body = JSON.parse(response.body)

            expect(body["anniversaries"].map { |user| user["id"] }).to eq(
              [user.id, user5.id]
            )

            get "/cakeday/anniversaries.json",
              page: 0,
              month: time.month,
              filter: 'upcoming',
              timezone_offset: "540"

            body = JSON.parse(response.body)

            expect(body["anniversaries"].map { |u| u["id"] }).to eq(
              [user2.id, user3.id, user4.id]
            )
          end
        end
      end
    end

    describe "when viewing users birthdays" do
      it "should return the right payload" do
        time = Time.zone.local(2016, 9, 30)

        Timecop.freeze(time) do
          user = Fabricate(:user, date_of_birth: "1904-9-28")
          user2 = Fabricate(:user, date_of_birth: "1904-9-29")
          user3 = Fabricate(:user, date_of_birth: "1904-9-30")
          user4 = Fabricate(:user, date_of_birth: "1904-10-1")

          get "/cakeday/birthdays.json", page: 0, month: time.month

          body = JSON.parse(response.body)

          expect(body["birthdays"].map { |user| user["id"] }).to eq(
            [user.id, user2.id, user3.id]
          )

          get "/cakeday/birthdays.json",
            page: 0,
            month: time.month,
            filter: 'today'

          body = JSON.parse(response.body)

          expect(body["birthdays"].map { |u| u["id"] }).to eq(
            [user3.id]
          )

          get "/cakeday/birthdays.json",
            page: 0,
            month: time.month,
            filter: 'upcoming'

          body = JSON.parse(response.body)

          expect(body["birthdays"].map { |u| u["id"] }).to eq(
            [user4.id]
          )
        end
      end

      context 'when a timezone offset is given' do
        it 'should return the right payload' do
          time = Time.zone.local(2016, 9, 30, 5, 30)

          Timecop.freeze(time) do
            user = Fabricate(:user, date_of_birth: "1904-9-28")
            user2 = Fabricate(:user, date_of_birth: "1904-9-29")
            user3 = Fabricate(:user, date_of_birth: "1904-9-30")
            user4 = Fabricate(:user, date_of_birth: "1904-10-1")

            get "/cakeday/birthdays.json",
              page: 0,
              month: time.month,
              timezone_offset: "540"

            body = JSON.parse(response.body)

            expect(body["birthdays"].map { |user| user["id"] }).to eq(
              [user.id, user2.id, user3.id]
            )

            get "/cakeday/birthdays.json",
              page: 0,
              month: time.month,
              timezone_offset: "540",
              filter: 'today'

            body = JSON.parse(response.body)

            expect(body["birthdays"].map { |u| u["id"] }).to eq(
              [user2.id]
            )

            get "/cakeday/birthdays.json",
              page: 0,
              month: time.month,
              timezone_offset: "540",
              filter: 'upcoming'

            body = JSON.parse(response.body)

            expect(body["birthdays"].map { |u| u["id"] }).to eq(
              [user3.id, user4.id]
            )
          end
        end
      end
    end
  end
end
