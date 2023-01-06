import {
  birthday,
  birthdayTitle,
  cakeday,
  cakedayTitle,
} from "discourse/plugins/discourse-cakeday/discourse/lib/cakeday";

export default {
  setupComponent({ user }, component) {
    component.set("isCakeday", cakeday(user.cakedate));
    component.set("isBirthday", birthday(user.birthdate));
    component.set("cakedayTitle", cakedayTitle(user, this.currentUser));
    component.set("birthdayTitle", birthdayTitle(user, this.currentUser));
  },
};
