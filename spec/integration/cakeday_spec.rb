# frozen_string_literal: true

require 'rails_helper'

describe "Cakeyday" do
  describe 'when not logged in' do
    it 'should return the right response' do
      get "/cakeday/anniversaries.json", params: { page: 0, month: 5 }
      expect(response.status).to eq(403)
    end
  end

  describe 'when logged in' do
    before do
      sign_in(Fabricate(:user, created_at: time - 10.days))
    end

    describe "when plugin disabled" do
      before { SiteSetting.cakeday_enabled = false }
      let(:time) { Time.zone.local(2016, 9, 30) }

      it "doesn't respond" do
        get "/cakeday/anniversaries.json"
        expect(response.status).to eq(404)

        get "/cakeday/birthdays.json"
        expect(response.status).to eq(404)
      end

    end

    describe "when viewing users anniversaries" do
      let(:time) { Time.zone.local(2016, 9, 30) }

      it "should return the right payload" do
        freeze_time(time) do
          created_at = time - 1.year

          user = Fabricate(:user, created_at: created_at - 1.day)

          user2 = Fabricate(:user, created_at: created_at)
          user2.user_stat.update!(likes_received: 1)

          user3 = Fabricate(:user, created_at: created_at + 1.day)
          user4 = Fabricate(:user, created_at: created_at + 2.day)
          _user5 = Fabricate(:user, created_at: created_at + 1.year)
          user6 = Fabricate(:user, created_at: created_at - 2.year)

          get "/cakeday/anniversaries.json", params: { page: 0, month: time.month }

          body = JSON.parse(response.body)

          expect(body["anniversaries"].map { |u| u["id"] }).to eq(
            [user6.id, user.id, user2.id]
          )

          get "/cakeday/anniversaries.json", params: {
            page: 0,
            month: time.month,
            filter: 'today'
          }

          body = JSON.parse(response.body)

          expect(body["anniversaries"].map { |u| u["id"] }).to eq(
            [user2.id, user6.id]
          )

          get "/cakeday/anniversaries.json", params: {
            page: 0,
            month: time.month,
            filter: 'tomorrow'
          }

          body = JSON.parse(response.body)

          expect(body["anniversaries"].map { |u| u["id"] }).to eq(
            [user3.id]
          )

          get "/cakeday/anniversaries.json", params: {
            page: 0,
            month: time.month,
            filter: 'upcoming'
          }

          body = JSON.parse(response.body)

          expect(body["anniversaries"].map { |u| u["id"] }).to eq(
            [user4.id]
          )
        end
      end

      context 'when a timezone offset is given' do
        let(:time) { Time.zone.local(2016, 10, 1) }

        it 'should return the right payload' do
          freeze_time(time) do
            created_at = time - 1.year

            user = Fabricate(:user, created_at: created_at - 1.day + 2.hours)
            user.user_stat.update!(likes_received: 2)

            user2 = Fabricate(:user, created_at: created_at - 1.year)
            user2.user_stat.update!(likes_received: 1)

            user3 = Fabricate(:user, created_at: created_at + 1.hours)
            user4 = Fabricate(:user, created_at: created_at + 2.hours)
            user5 = Fabricate(:user, created_at: created_at + 2.hours + 8.days)
            _user6 = Fabricate(:user, created_at: created_at + 1.year)

            get "/cakeday/anniversaries.json", params: {
              page: 0,
              month: 9,
              timezone_offset: "120"
            }

            body = JSON.parse(response.body)

            expect(body["anniversaries"].map { |u| u["id"] }).to eq(
              [user2.id, user.id, user3.id]
            )

            get "/cakeday/anniversaries.json", params: {
              page: 0,
              month: 9,
              filter: 'today',
              timezone_offset: "120"
            }

            body = JSON.parse(response.body)

            expect(body["anniversaries"].map { |u| u["id"] }).to eq(
              [user.id, user2.id, user3.id]
            )

            get "/cakeday/anniversaries.json", params: {
              page: 0,
              month: 10,
              filter: 'tomorrow',
              timezone_offset: "120"
            }

            body = JSON.parse(response.body)

            expect(body["anniversaries"].map { |u| u["id"] }).to eq(
              [user4.id]
            )

            get "/cakeday/anniversaries.json", params: {
              page: 0,
              month: 10,
              filter: 'upcoming',
              timezone_offset: "120"
            }

            body = JSON.parse(response.body)

            expect(body["anniversaries"].map { |u| u["id"] }).to eq(
              [user5.id]
            )
          end
        end
      end

      it 'should respect 30 minutes offset' do
        freeze_time(time) do
          created_at = time - 1.year

          user = Fabricate(:user, created_at: created_at + 6.hours)
          user2 = Fabricate(:user, created_at: created_at + 18.hours + 10.minutes)
          user3 = Fabricate(:user, created_at: created_at + 18.hours + 40.minutes)
          user4 = Fabricate(:user, created_at: created_at + 1.day + 20.minutes)

          get "/cakeday/anniversaries.json", params: {
            page: 0,
            month: 9,
            filter: 'today',
            timezone_offset: "-330" #UTC+05:30
          }

          body = JSON.parse(response.body)
          expect(body["anniversaries"].map { |u| u["id"] }).to contain_exactly(user.id, user2.id)

          get "/cakeday/anniversaries.json", params: {
            page: 0,
            month: 10,
            filter: 'tomorrow',
            timezone_offset: "-330"
          }

          body = JSON.parse(response.body)
          expect(body["anniversaries"].map { |u| u["id"] }).to contain_exactly(user3.id, user4.id)
        end
      end

    end

    describe "when viewing users birthdays" do
      let(:time) { Time.zone.local(2016, 9, 30) }

      it "should return the right payload" do
        freeze_time(time) do
          user = Fabricate(:user, date_of_birth: "1904-9-28")
          user2 = Fabricate(:user, date_of_birth: "1904-9-29")
          user3 = Fabricate(:user, date_of_birth: "1904-9-30")
          user4 = Fabricate(:user, date_of_birth: "1904-10-1")
          user5 = Fabricate(:user, date_of_birth: "1904-10-2")

          get "/cakeday/birthdays.json",  params: { page: 0, month: time.month }

          body = JSON.parse(response.body)

          expect(body["birthdays"].map { |u| u["id"] }).to eq(
            [user.id, user2.id, user3.id]
          )

          get "/cakeday/birthdays.json", params: {
            page: 0,
            month: time.month,
            filter: 'today'
          }

          body = JSON.parse(response.body)

          expect(body["birthdays"].map { |u| u["id"] }).to eq(
            [user3.id]
          )

          get "/cakeday/birthdays.json", params: {
            page: 0,
            month: time.month,
            filter: 'tomorrow'
          }

          body = JSON.parse(response.body)

          expect(body["birthdays"].map { |u| u["id"] }).to eq(
            [user4.id]
          )

          get "/cakeday/birthdays.json", params: {
            page: 0,
            month: time.month,
            filter: 'upcoming'
          }

          body = JSON.parse(response.body)

          expect(body["birthdays"].map { |u| u["id"] }).to eq(
            [user5.id]
          )
        end
      end

      context 'when a timezone offset is given' do
        let(:time) { Time.zone.local(2016, 9, 30, 5, 30) }

        it 'should return the right payload' do
          freeze_time(time) do
            user = Fabricate(:user, date_of_birth: "1904-9-28")
            user2 = Fabricate(:user, date_of_birth: "1904-9-29")
            user3 = Fabricate(:user, date_of_birth: "1904-9-30")
            user4 = Fabricate(:user, date_of_birth: "1904-10-1")

            get "/cakeday/birthdays.json", params: {
              page: 0,
              month: time.month,
              timezone_offset: "540"
            }

            body = JSON.parse(response.body)

            expect(body["birthdays"].map { |u| u["id"] }).to eq(
              [user.id, user2.id, user3.id]
            )

            get "/cakeday/birthdays.json", params: {
              page: 0,
              month: time.month,
              timezone_offset: "540",
              filter: 'today'
            }

            body = JSON.parse(response.body)

            expect(body["birthdays"].map { |u| u["id"] }).to eq(
              [user2.id]
            )

            get "/cakeday/birthdays.json", params: {
              page: 0,
              month: time.month,
              timezone_offset: "540",
              filter: 'tomorrow'
            }

            body = JSON.parse(response.body)

            expect(body["birthdays"].map { |u| u["id"] }).to eq(
              [user3.id]
            )

            get "/cakeday/birthdays.json", params: {
              page: 0,
              month: time.month,
              timezone_offset: "540",
              filter: 'upcoming'
            }

            body = JSON.parse(response.body)

            expect(body["birthdays"].map { |u| u["id"] }).to eq(
              [user4.id]
            )
          end
        end
      end
    end
  end
end
