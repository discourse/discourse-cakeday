import DatePicker from "discourse/components/date-picker";

export default DatePicker.extend({
  _opts() {
    return {
      minDate: null,
      yearRange: 1, // Set to one since year doesn't matter
      defaultDate: moment(this.get('value')).toDate(),
      setDefaultDate: true,
      format: 'MM/DD',
      theme: 'cakeday-date-picker'
    }
  }
});
