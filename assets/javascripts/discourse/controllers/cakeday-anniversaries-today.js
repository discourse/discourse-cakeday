import Controller from "@ember/controller";
import computed from "discourse-common/utils/decorators";
import I18n from "I18n";

export default Controller.extend({
  @computed
  title() {
    return I18n.t("anniversaries.today.title", {
      date: moment().format(I18n.t("dates.full_no_year_no_time")),
    });
  },

  actions: {
    loadMore() {
      this.get("model").loadMore();
    },
  },
});
