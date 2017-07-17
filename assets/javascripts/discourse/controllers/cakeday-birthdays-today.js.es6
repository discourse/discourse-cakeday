import computed from 'ember-addons/ember-computed-decorators';

export default Ember.Controller.extend({
  @computed
  title() {
    return I18n.t("birthdays.today.title", { date: moment().format("MMMM Do") });
  },

  actions: {
    loadMore() {
      this.get("model").loadMore();
    }
  }
});
