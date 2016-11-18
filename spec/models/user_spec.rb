require 'rails_helper'

describe User do
  let(:user) { Fabricate(:user) }

  context "custom fields" do
    describe "when date_of_birth is not valid" do
      it "should not be valid" do
        user.custom_fields['date_of_birth'] = '1904-2-31'
        user.save

        expect(user.custom_fields['date_of_birth']).to eq('')
      end
    end

    describe "when cakeday birthday is not enabled" do
      before do
        SiteSetting.cakeday_birthday_enabled = false
      end

      after do
        SiteSetting.cakeday_birthday_enabled = true
      end

      it "should be valid" do
        user.custom_fields['date_of_birth'] = '1904-2-31'
        expect(user.save).to eq(true)
      end
    end

    describe "when date_of_birth is valid" do
      it "should be valid" do
        user.custom_fields['date_of_birth'] = '1904-2-29'
        expect(user.save).to eq(true)
      end
    end
  end
end
