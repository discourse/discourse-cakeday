import { observes } from 'ember-addons/ember-computed-decorators';
import computed from 'ember-addons/ember-computed-decorators';
import Post from 'discourse/models/post';
import PreferencesController from 'discourse/controllers/preferences';
import UserCardController from 'discourse/controllers/user-card';
import UserController from 'discourse/controllers/user';
import { withPluginApi } from 'discourse/lib/plugin-api';

function isSameDay(date, opts) {
  let formatString = 'YYYY';
  const current = moment();
  const currentDate = moment(date, 'YYYY-MM-DD');

  if (opts && opts.anniversary) {
    if (current.format(formatString) <= currentDate.format(formatString)) return false;
  }

  formatString = 'MMDD';

  return current.format(formatString) === currentDate.format(formatString);
}

function cakeday(createdAt) {
  if (Ember.isEmpty(createdAt)) return false;
  return isSameDay(createdAt, { anniversary: true });
}

function cakedayBirthday(dateOfBirth) {
  if (Ember.isEmpty(dateOfBirth)) return false;
  return isSameDay(dateOfBirth);
}

function oldPluginCode() {
  Post.reopen({
    @computed('user_created_at')
    isCakeday(createdAt) {
      return cakeday(createdAt);
    },

    @computed('user_custom_fields.date_of_birth')
    isUserBirthday(dateOfBirth) {
      return cakedayBirthday(dateOfBirth);
    },
  });
}

function initializeCakeday(api, siteSettings) {
  const emojiEnabled = siteSettings.enable_emoji;
  const cakedayEnabled = siteSettings.cakeday_enabled;
  const cakedayBirthdayEnabled = siteSettings.cakeday_birthday_enabled;

  if (cakedayEnabled) {
    api.includePostAttributes('user_created_at');

    api.addPosterIcon((cfs, attrs) => {
      const createdAt = attrs.user_created_at;
      if (!Ember.isEmpty(createdAt) && isSameDay(createdAt, { anniversary: true })) {
        let result = {};

        if (emojiEnabled) {
          result.emoji = siteSettings.cakeday_emoji;
        } else {
          result.icon = 'birthday-cake';
        }


        if (attrs.user_id === api.getCurrentUser().get('id')) {
          result.title = I18n.t("user.anniversary.user_title");
        } else {
          result.title = I18n.t("user.anniversary.title");
        }

        return result;
      }
    });
  }

  if (cakedayBirthdayEnabled) {
    api.addPosterIcon((cfs, attrs) => {
      const dob = cfs.date_of_birth;
      if (!Ember.isEmpty(dob) && isSameDay(dob)) {
        let result = {};

        if (emojiEnabled) {
          result.emoji = siteSettings.cakeday_birthday_emoji;
        } else {
          result.icon = 'birthday-cake';
        }

        if (attrs.user_id === api.getCurrentUser().get('id')) {
          result.title = I18n.t("user.date_of_birth.user_title");
        } else {
          result.title = I18n.t("user.date_of_birth.title");
        }

        return result;
      }
    });
  }

  if (cakedayEnabled || cakedayBirthdayEnabled) {
    api.decorateWidget("hamburger-menu:generalLinks", () => {
      let route;

      if (cakedayEnabled) {
        route = 'cakeday.anniversaries';
      } else if (cakedayBirthdayEnabled) {
        route = 'cakeday.birthdays';
      }

      return { route: route, label: 'cakeday.title' };
    });
  }
}

export default {
  name: 'cakeday',

  initialize(container) {
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

        user.set("custom_fields.date_of_birth", date);
      },

      @computed("model.custom_fields.date_of_birth")
      userBirthdayMonth(dateOfBirth) {
        return moment(dateOfBirth, 'YYYY-MM-DD').month() + 1;
      },

      @computed("model.custom_fields.date_of_birth")
      userBirthdayDay(dateOfBirth) {
        return moment(dateOfBirth, 'YYYY-MM-DD').date();
      }
    });

    UserCardController.reopen({
      @computed('user.created_at')
      isCakeday(createdAt) {
        return cakeday(createdAt);
      },

      @computed('user.custom_fields.date_of_birth')
      isUserBirthday(dateOfBirth) {
        return cakedayBirthday(dateOfBirth);
      },
    });

    UserController.reopen({
      @computed('model.created_at')
      isCakeday(createdAt) {
        return cakeday(createdAt);
      },

      @computed('model.custom_fields.date_of_birth')
      isUserBirthday(dateOfBirth) {
        return cakedayBirthday(dateOfBirth);
      },
    });

    withPluginApi('0.1', api => initializeCakeday(api, siteSettings), { noApi: oldPluginCode });
  }
};
