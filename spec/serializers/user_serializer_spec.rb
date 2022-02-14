# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserSerializer do
  let(:user) { Fabricate(:user, date_of_birth: '2017-04-05') }

  context 'when user is logged in' do
    let(:serializer) { described_class.new(user, scope: Guardian.new(user), root: false) }

    it "should include the user's date of birth" do
      expect(serializer.as_json[:date_of_birth]).to eq(user.date_of_birth)
    end

    context 'with plugin disabled' do
      before { SiteSetting.cakeday_enabled = false }

      it "should not include the user's date of birth" do
        expect(serializer.as_json[:date_of_birth]).to eq(nil)
      end
    end
  end

  context 'when user is not logged in' do
    let(:serializer) { described_class.new(user, scope: Guardian.new, root: false) }

    it "should not include the user's date of birth" do
      expect(serializer.as_json.has_key?(:date_of_birth)).to eq(false)
    end
  end
end
