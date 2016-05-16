import computed from 'ember-addons/ember-computed-decorators';

export default Ember.Controller.extend({
  queryParams: ["month"],
  months: moment.months(),

  @computed("months")
  month(months) {
    return months[moment().month()];
  },

  actions: {
    loadMore() {
      this.get("model").loadMore();
    }
  }
});
