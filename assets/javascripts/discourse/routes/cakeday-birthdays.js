import { service } from "@ember/service";
import DiscourseRoute from "discourse/routes/discourse";
import I18n from "I18n";

export default class CakedayBirthdays extends DiscourseRoute {
  @service router;

  beforeModel() {
    if (!this.siteSettings.cakeday_birthday_enabled) {
      this.router.transitionTo(
        "unknown",
        window.location.pathname.replace(/^\//, "")
      );
    }
  }

  titleToken() {
    return I18n.t("birthdays.title");
  }
}
