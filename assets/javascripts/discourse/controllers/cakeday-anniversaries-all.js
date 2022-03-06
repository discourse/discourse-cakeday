import Controller from "@ember/controller";
import computed from "discourse-common/utils/decorators";

export default Controller.extend({
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
    },
  },
});
