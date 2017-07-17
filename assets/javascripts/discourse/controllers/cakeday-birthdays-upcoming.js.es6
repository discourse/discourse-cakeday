import computed from 'ember-addons/ember-computed-decorators';

export default Ember.Controller.extend({
  @computed
  title() {
    const date = moment();

    return I18n.t("birthdays.upcoming.title", {
      start_date: date.add(2, 'days').format('MMMM Do'),
      end_date: date.add(7, 'days').format('MMMM Do'),
    });
  },

  actions: {
    loadMore() {
      this.get("model").loadMore();
    }
  }
});
