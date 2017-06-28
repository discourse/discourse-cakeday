export default Discourse.Route.extend({
  beforeModel() {
    this.transitionTo("cakeday.birthdays.today");
  }
});
