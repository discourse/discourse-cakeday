require 'rails_helper'

RSpec.describe User do
  describe '.valid' do
    it 'should return the right users' do
      Fabricate(:user, blocked: true)
      Fabricate(:user, active: false)
      Fabricate(:user, suspended_till: Time.zone.now + 1.day)
      Fabricate(:user, id: -3)

      expect(User.valid).to eq([])

      user = Fabricate(:user)

      expect(User.valid).to contain_exactly(user)
    end
  end
end
