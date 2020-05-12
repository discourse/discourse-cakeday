import DiscourseRoute from "discourse/routes/discourse";

export default DiscourseRoute.extend({
  beforeModel() {
    if (!this.siteSettings.cakeday_birthday_enabled) {
      this.transitionTo("unknown", window.location.pathname.replace(/^\//, ""));
    }
  },

  titleToken() {
    return I18n.t("birthdays.title");
  }
});
