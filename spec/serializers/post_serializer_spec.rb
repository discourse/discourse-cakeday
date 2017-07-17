require 'rails_helper'

RSpec.describe PostSerializer do
  let(:user) { Fabricate(:user, date_of_birth: '2017-04-05') }
  let(:post) { Fabricate(:post, user: user) }

  context 'when user is logged in' do
    let(:serializer) { described_class.new(post, scope: Guardian.new(user), root: false) }

    it "should include the user's date of birth" do
      expect(serializer.as_json[:user_date_of_birth]).to eq(user.date_of_birth)
      expect(serializer.as_json[:user_created_at]).to eq(user.created_at)
    end
  end

  context 'when user is not logged in' do
    let(:serializer) { described_class.new(post, scope: Guardian.new, root: false) }

    it "should not include the user's date of birth" do
      expect(serializer.as_json.has_key?(:user_date_of_birth)).to eq(false)
      expect(serializer.as_json.has_key?(:user_created_at)).to eq(false)
    end
  end
end
