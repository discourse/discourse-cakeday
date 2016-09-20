module Jobs
  class FixInvalidDateOfBirth < Jobs::Onceoff
    def execute_onceoff(args)
      UserCustomField
        .where(name: 'date_of_birth')
        .where("value != ''")
        .find_each do |custom_field|

        begin
          Date.parse(custom_field.value)
        rescue ArgumentError
          custom_field.update_attributes!(value: '')
        end
      end
    end
  end
end
