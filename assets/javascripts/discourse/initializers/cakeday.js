import I18n from "I18n";
import discourseComputed, { observes } from "discourse-common/utils/decorators";
import { withPluginApi } from "discourse/lib/plugin-api";
import {
  cakeday,
  cakedayBirthday,
  isSameDay,
} from "discourse/plugins/discourse-cakeday/discourse/lib/cakeday";
import { registerUnbound } from "discourse-common/lib/helpers";
import { isEmpty } from "@ember/utils";

function initializeCakeday(api) {
  const currentUser = api.getCurrentUser();
  if (!currentUser) {
    return;
  }

  const store = api.container.lookup("service:store");
  store.addPluralization("anniversary", "anniversaries");

  api.modifyClass("controller:preferences", {
    pluginId: "discourse-cakeday",

    days: [...Array(32).keys()].splice(1),

    @discourseComputed
    months() {
      return moment.months().map((month, index) => {
        return { name: month, value: index + 1 };
      });
    },

    @observes("userBirthdayMonth", "userBirthdayDay")
    _setUserDateOfBirth() {
      const userBirthdayMonth = this.get("userBirthdayMonth");
      const userBirthdayDay = this.get("userBirthdayDay");
      const user = this.get("model");
      let date = "";

      if (userBirthdayMonth !== "" && userBirthdayDay !== "") {
        date = `1904-${this.get("userBirthdayMonth")}-${this.get(
          "userBirthdayDay"
        )}`;
      }

      user.set("date_of_birth", date);
    },

    @discourseComputed("model.date_of_birth")
    userBirthdayMonth(dateOfBirth) {
      return moment(dateOfBirth, "YYYY-MM-DD").month() + 1;
    },

    @discourseComputed("model.date_of_birth")
    userBirthdayDay(dateOfBirth) {
      return moment(dateOfBirth, "YYYY-MM-DD").date();
    },
  });

  api.modifyClass("controller:user-card", {
    pluginId: "discourse-cakeday",

    @discourseComputed("model.created_at")
    isCakeday(createdAt) {
      return cakeday(createdAt);
    },

    @discourseComputed("model.date_of_birth")
    isUserBirthday(dateOfBirth) {
      return cakedayBirthday(dateOfBirth);
    },
  });

  api.modifyClass("controller:user", {
    pluginId: "discourse-cakeday",

    @discourseComputed("model.created_at")
    isCakeday(createdAt) {
      return cakeday(createdAt);
    },

    @discourseComputed("model.date_of_birth")
    isUserBirthday(dateOfBirth) {
      return cakedayBirthday(dateOfBirth);
    },
  });

  const siteSettings = api.container.lookup("site-settings:main");

  const emojiEnabled = siteSettings.enable_emoji;
  const cakedayEnabled = siteSettings.cakeday_enabled;
  const cakedayBirthdayEnabled = siteSettings.cakeday_birthday_enabled;

  if (cakedayEnabled) {
    api.includePostAttributes("user_created_at");
    api.includePostAttributes("user_date_of_birth");

    api.addPosterIcon((cfs, attrs) => {
      const createdAt = attrs.user_created_at;
      if (!isEmpty(createdAt) && isSameDay(createdAt, { anniversary: true })) {
        let result = {};

        if (emojiEnabled) {
          result.emoji = siteSettings.cakeday_emoji;
        } else {
          result.icon = "birthday-cake";
        }

        if (currentUser && attrs.user_id === currentUser.get("id")) {
          result.title = I18n.t("user.anniversary.user_title");
        } else {
          result.title = I18n.t("user.anniversary.title");
        }

        result.emojiTitle = false;

        return result;
      }
    });
  }

  if (cakedayBirthdayEnabled) {
    api.addPosterIcon((cfs, attrs) => {
      const dob = attrs.user_date_of_birth;
      if (!isEmpty(dob) && isSameDay(dob)) {
        let result = {};

        if (emojiEnabled) {
          result.emoji = siteSettings.cakeday_birthday_emoji;
        } else {
          result.icon = "birthday-cake";
        }

        if (currentUser && attrs.user_id === currentUser.get("id")) {
          result.title = I18n.t("user.date_of_birth.user_title");
        } else {
          result.title = I18n.t("user.date_of_birth.title");
        }

        result.emojiTitle = false;

        return result;
      }
    });
  }

  if (cakedayEnabled || cakedayBirthdayEnabled) {
    registerUnbound("cakeday-date", function (val, params) {
      const date = moment(val);

      if (params.isBirthday) {
        return date.format(I18n.t("dates.full_no_year_no_time"));
      } else {
        return date.format(I18n.t("dates.full_with_year_no_time"));
      }
    });

    if (siteSettings.enable_experimental_sidebar_hamburger) {
      if (cakedayEnabled) {
        api.addCommunitySectionLink({
          name: "anniversaries",
          route: "cakeday.anniversaries.today",
          title: I18n.t("anniversaries.title"),
          text: I18n.t("anniversaries.title"),
        });
      }

      if (cakedayBirthdayEnabled) {
        api.addCommunitySectionLink({
          name: "birthdays",
          route: "cakeday.birthdays.today",
          title: I18n.t("birthdays.title"),
          text: I18n.t("birthdays.title"),
        });
      }
    } else {
      api.decorateWidget("hamburger-menu:generalLinks", () => {
        let route;

        if (cakedayEnabled) {
          route = "cakeday.anniversaries.today";
        } else if (cakedayBirthdayEnabled) {
          route = "cakeday.birthdays.today";
        }

        return {
          route,
          label: "cakeday.title",
          className: "cakeday-link",
        };
      });
    }
  }
}

export default {
  name: "cakeday",

  initialize() {
    withPluginApi("0.1", (api) => initializeCakeday(api));
  },
};
