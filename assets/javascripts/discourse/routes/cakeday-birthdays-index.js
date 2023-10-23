import DiscourseRoute from "discourse/routes/discourse";
import { inject as service } from "@ember/service";

export default class CakedayBirthdaysIndex extends DiscourseRoute {
  @service router;
  beforeModel() {
    this.router.replaceWith("cakeday.birthdays.today");
  }
}
