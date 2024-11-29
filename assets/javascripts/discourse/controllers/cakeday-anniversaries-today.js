import Controller from "@ember/controller";
import { action } from "@ember/object";
import computed from "discourse-common/utils/decorators";
import I18n from "I18n";

export default class CakedayAnniversariesTodayController extends Controller {
  @computed
  title() {
    return I18n.t("anniversaries.today.title", {
      date: moment().format(I18n.t("dates.full_no_year_no_time")),
    });
  }

  @action
  loadMore() {
    this.get("model").loadMore();
  }
}
