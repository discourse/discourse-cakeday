import computed from "ember-addons/ember-computed-decorators";

export default Ember.Controller.extend({
  @computed
  title() {
    return I18n.t("birthdays.today.title", {
      date: moment()
        .add(1, "day")
        .format(I18n.t("dates.full_no_year_no_time"))
    });
  },

  actions: {
    loadMore() {
      this.get("model").loadMore();
    }
  }
});
