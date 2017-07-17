import { observes } from 'ember-addons/ember-computed-decorators';
import computed from 'ember-addons/ember-computed-decorators';
import PreferencesController from 'discourse/controllers/preferences';
import UserCardController from 'discourse/controllers/user-card';
import UserController from 'discourse/controllers/user';
import { withPluginApi } from 'discourse/lib/plugin-api';
import { isSameDay, cakeday, cakedayBirthday} from 'discourse/plugins/discourse-cakeday/discourse/lib/cakeday';
import { registerUnbound } from 'discourse-common/lib/helpers';

function initializeCakeday(api, siteSettings) {
  const emojiEnabled = siteSettings.enable_emoji;
  const cakedayEnabled = siteSettings.cakeday_enabled;
  const cakedayBirthdayEnabled = siteSettings.cakeday_birthday_enabled;

  if (cakedayEnabled) {
    api.includePostAttributes('user_created_at');
    api.includePostAttributes('user_date_of_birth');

    api.addPosterIcon((cfs, attrs) => {
      const createdAt = attrs.user_created_at;
      if (!Ember.isEmpty(createdAt) && isSameDay(createdAt, { anniversary: true })) {
        let result = {};

        if (emojiEnabled) {
          result.emoji = siteSettings.cakeday_emoji;
        } else {
          result.icon = 'birthday-cake';
        }

        const currentUser = api.getCurrentUser();

        if (currentUser && attrs.user_id === currentUser.get('id')) {
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
      if (!Ember.isEmpty(dob) && isSameDay(dob)) {
        let result = {};

        if (emojiEnabled) {
          result.emoji = siteSettings.cakeday_birthday_emoji;
        } else {
          result.icon = 'birthday-cake';
        }

        const currentUser = api.getCurrentUser();

        if (currentUser && attrs.user_id === currentUser.get('id')) {
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
    registerUnbound('cakeday-date', function(val, params) {
      const date = moment(val);

      if (params.isBirthday) {
        return date.format("MM/DD");
      } else {
        return date.format("YYYY/MM/DD");
      }
    });

    api.decorateWidget("hamburger-menu:generalLinks", () => {
      let route;

      if (cakedayEnabled) {
        route = 'cakeday.anniversaries';
      } else if (cakedayBirthdayEnabled) {
        route = 'cakeday.birthdays';
      }

      return { route: route, label: 'cakeday.title', className: 'cakeday-link' };
    });
  }
}

export default {
  name: 'cakeday',

  initialize(container) {
    const currentUser = container.lookup('current-user:main');
    if (!currentUser) return;

    const siteSettings = container.lookup('site-settings:main');
    const store = container.lookup('store:main');

    store.addPluralization('anniversary', 'anniversaries');

    PreferencesController.reopen({
      days: _.range(1, 32),

      @computed
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
        var date = '';

        if (userBirthdayMonth !== '' && userBirthdayDay !== '') {
          date = `1904-${this.get('userBirthdayMonth')}-${this.get('userBirthdayDay')}`;
        }

        user.set("date_of_birth", date);
      },

      @computed("model.date_of_birth")
      userBirthdayMonth(dateOfBirth) {
        return moment(dateOfBirth, 'YYYY-MM-DD').month() + 1;
      },

      @computed("model.date_of_birth")
      userBirthdayDay(dateOfBirth) {
        return moment(dateOfBirth, 'YYYY-MM-DD').date();
      }
    });

    UserCardController.reopen({
      @computed('model.created_at')
      isCakeday(createdAt) {
        return cakeday(createdAt);
      },

      @computed('model.date_of_birth')
      isUserBirthday(dateOfBirth) {
        return cakedayBirthday(dateOfBirth);
      },
    });

    UserController.reopen({
      @computed('model.created_at')
      isCakeday(createdAt) {
        return cakeday(createdAt);
      },

      @computed('model.date_of_birth')
      isUserBirthday(dateOfBirth) {
        return cakedayBirthday(dateOfBirth);
      },
    });

    withPluginApi('0.1', api => initializeCakeday(api, siteSettings));
  }
};
