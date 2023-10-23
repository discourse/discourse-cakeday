import DiscourseRoute from "discourse/routes/discourse";
import { inject as service } from "@ember/service";

export default class CakedayAnniversariesIndex extends DiscourseRoute {
  @service router;
  beforeModel() {
    this.router.replaceWith("cakeday.anniversaries.today");
  }
}
