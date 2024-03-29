import Controller from "@ember/controller";
import { alias } from "@ember/object/computed";

export default Controller.extend({
  cakedayEnabled: alias("siteSettings.cakeday_enabled"),
  birthdayEnabled: alias("siteSettings.cakeday_birthday_enabled"),
});
