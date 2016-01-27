import DatePicker from "discourse/components/date-picker";

export default DatePicker.extend({
  _opts() {
    return {
      minDate: null,
      yearRange: 50, // Set 50 as a sane default now
      setDefaultDate: this.get('value')
    }
  }
});
