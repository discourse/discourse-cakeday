import Controller from "@ember/controller";
import I18n from "I18n";
import computed from "discourse-common/utils/decorators";

export default Controller.extend({
  @computed
  title() {
    return I18n.t("birthdays.today.title", {
      date: moment().add(1, "day").format(I18n.t("dates.full_no_year_no_time")),
    });
  },

  actions: {
    loadMore() {
      this.get("model").loadMore();
    },
  },
});
