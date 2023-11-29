import Controller from "@ember/controller";
import computed from "discourse-common/utils/decorators";
import I18n from "I18n";

export default Controller.extend({
  @computed
  title() {
    const dateFormat = I18n.t("dates.full_no_year_no_time");

    return I18n.t("anniversaries.upcoming.title", {
      start_date: moment().add(2, "days").format(dateFormat),
      end_date: moment().add(2, "days").add(1, "week").format(dateFormat),
    });
  },

  actions: {
    loadMore() {
      this.get("model").loadMore();
    },
  },
});
