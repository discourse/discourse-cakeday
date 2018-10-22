export default Discourse.Route.extend({
  beforeModel() {
    if (!this.siteSettings.cakeday_enabled) {
      this.transitionTo("unknown", window.location.pathname.replace(/^\//, ""));
    }
  },

  titleToken() {
    return I18n.t("anniversaries.title");
  }
});
