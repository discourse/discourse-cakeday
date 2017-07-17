import computed from 'ember-addons/ember-computed-decorators';

export default Ember.Controller.extend({
  queryParams: ["month"],
  month: moment().month() + 1,

  @computed
  months() {
    return moment.months().map((month, index) => {
      return { name: month, value: index + 1 };
    });
  },

  actions: {
    loadMore() {
      this.get("model").loadMore();
    }
  }
});
