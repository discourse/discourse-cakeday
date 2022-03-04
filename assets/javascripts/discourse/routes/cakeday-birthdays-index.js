import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  beforeModel() {
    this.replaceWith("cakeday.birthdays.today");
  },
});
