import {
  cakeday,
  cakedayTitle,
  cakedayBirthday,
  cakedayBirthdayTitle
} from "discourse/plugins/discourse-cakeday/discourse/lib/cakeday";

function applyUser(user, currentUser, component) {
  if (user) {
    component.setProperties({
      isCakeday: cakeday(user.get("created_at")),
      isUserBirthday: cakedayBirthday(user.get("date_of_birth")),
      cakedayTitle: cakedayTitle(user, currentUser),
      cakedayBirthdayTitle: cakedayBirthdayTitle(user, currentUser)
    });
  }
}

export default {
  updateComponent(args, component) {
    applyUser(args.user, this.currentUser, component);
  }
};
