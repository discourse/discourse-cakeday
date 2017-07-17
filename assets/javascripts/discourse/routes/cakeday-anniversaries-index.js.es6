export default Discourse.Route.extend({
  beforeModel() {
    this.transitionTo("cakeday.anniversaries.today");
  }
});
