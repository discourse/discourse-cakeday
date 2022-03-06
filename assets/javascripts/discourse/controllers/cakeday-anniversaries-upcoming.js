import Controller from "@ember/controller";
import I18n from "I18n";
import computed from "discourse-common/utils/decorators";

export default Controller.extend({
  @computed
  title() {
    const date = moment();
    const dateFormat = I18n.t("dates.full_no_year_no_time");

    return I18n.t("anniversaries.upcoming.title", {
      start_date: date.add(2, "days").format(dateFormat),
      end_date: date.add(7, "days").format(dateFormat),
    });
  },

  actions: {
    loadMore() {
      this.get("model").loadMore();
    },
  },
});
