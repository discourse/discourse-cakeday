import computed from 'ember-addons/ember-computed-decorators';

export default Ember.Controller.extend({
  queryParams: ["month"],

  @computed
  months() {
    return moment.months().map((month, index) => {
      return { name: month, value: index + 1 };
    });
  },

  @computed("months")
  month(months) {
    return months[moment().month()].value;
  },

  actions: {
    loadMore() {
      this.get("model").loadMore();
    }
  }
});
