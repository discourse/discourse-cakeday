export default Discourse.Route.extend({
  beforeModel() {
    this.replaceWith("cakeday.birthdays.today");
  }
});
