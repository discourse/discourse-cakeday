import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";
import {
  birthday,
  cakeday,
} from "discourse/plugins/discourse-cakeday/discourse/lib/cakeday";

function initializeCakeday(api) {
  const currentUser = api.getCurrentUser();
  if (!currentUser) {
    return;
  }

  const store = api.container.lookup("service:store");
  store.addPluralization("anniversary", "anniversaries");

  const siteSettings = api.container.lookup("service:site-settings");
  const emojiEnabled = siteSettings.enable_emoji;
  const cakedayEnabled = siteSettings.cakeday_enabled;
  const birthdayEnabled = siteSettings.cakeday_birthday_enabled;

  if (cakedayEnabled) {
    api.includePostAttributes("user_cakedate");

    api.addPosterIcon((_, { user_cakedate, user_id }) => {
      if (cakeday(user_cakedate)) {
        let result = {};

        if (emojiEnabled) {
          result.emoji = siteSettings.cakeday_emoji;
        } else {
          result.icon = "birthday-cake";
        }

        if (user_id === currentUser?.id) {
          result.title = I18n.t("user.anniversary.user_title");
        } else {
          result.title = I18n.t("user.anniversary.title");
        }

        return result;
      }
    });
  }

  if (birthdayEnabled) {
    api.includePostAttributes("user_birthdate");

    api.addPosterIcon((_, { user_birthdate, user_id }) => {
      if (birthday(user_birthdate)) {
        let result = {};

        if (emojiEnabled) {
          result.emoji = siteSettings.cakeday_birthday_emoji;
        } else {
          result.icon = "birthday-cake";
        }

        if (user_id === currentUser?.id) {
          result.title = I18n.t("user.date_of_birth.user_title");
        } else {
          result.title = I18n.t("user.date_of_birth.title");
        }

        return result;
      }
    });
  }

  if (cakedayEnabled || birthdayEnabled) {
    if (cakedayEnabled) {
      api.addCommunitySectionLink(
        {
          name: "anniversaries",
          route: "cakeday.anniversaries.today",
          title: I18n.t("anniversaries.title"),
          text: I18n.t("anniversaries.title"),
          icon: "birthday-cake",
        },
        true
      );
    }

    if (birthdayEnabled) {
      api.addCommunitySectionLink(
        {
          name: "birthdays",
          route: "cakeday.birthdays.today",
          title: I18n.t("birthdays.title"),
          text: I18n.t("birthdays.title"),
          icon: "birthday-cake",
        },
        true
      );
    }
  }
}

export default {
  name: "cakeday",

  initialize() {
    withPluginApi("0.1", (api) => initializeCakeday(api));
  },
};
