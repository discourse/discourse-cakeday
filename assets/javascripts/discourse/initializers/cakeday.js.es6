import { observes } from 'ember-addons/ember-computed-decorators';
import computed from 'ember-addons/ember-computed-decorators';
import Post from 'discourse/models/post';
import PreferencesController from 'discourse/controllers/preferences';
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

function oldPluginCode() {
  Post.reopen({
    @computed('user_created_at')
    isCakeday(createdAt) {
      if (Ember.isEmpty(createdAt)) return false;
      return isSameDay(createdAt, { anniversary: true });
    },

    @computed('user_custom_fields.date_of_birth')
    isUserBirthday(dateOfBirth) {
      if (Ember.isEmpty(dateOfBirth)) return false;
      return isSameDay(dateOfBirth);
    },
  });
}

function initializeCakeday(api, siteSettings) {
  const emojiEnabled = siteSettings.enable_emoji;

  if (siteSettings.cakeday_enabled) {
    api.decorateWidget("hamburger-menu:generalLinks", _ => {
      return { route: 'cakeday.anniversaries', label: 'anniversaries.title' };
    });

    api.includePostAttributes('user_created_at');

    api.addPosterIcon((cfs, attrs) => {
      const createdAt = attrs.user_created_at;
      if (!Ember.isEmpty(createdAt) && isSameDay(createdAt, { anniversary: true })) {
        if (emojiEnabled) {
          return { emoji: siteSettings.cakeday_emoji };
        } else {
          return { icon: 'birthday-cake', title: I18n.t("user.anniversary.title") };
        }
      }
    });
  }

  if (siteSettings.cakeday_birthday_enabled) {
    api.decorateWidget("hamburger-menu:generalLinks", _ => {
      return { route: 'cakeday.birthdays', label: 'birthdays.title' };
    });

    api.addPosterIcon(cfs => {
      const dob = cfs.date_of_birth;
      if (!Ember.isEmpty(dob) && isSameDay(dob)) {
        if (emojiEnabled) {
          return { emoji: siteSettings.cakeday_birthday_emoji };
        } else {
          return { icon: 'birthday-cake', title: I18n.t("user.date_of_birth.title") };
        }
      }
    });
  }
}

export default {
  name: 'cakeday',

  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    const store = container.lookup('store:main')

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

        user.custom_fields.date_of_birth = date;
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

    withPluginApi('0.1', api => initializeCakeday(api, siteSettings), { noApi: oldPluginCode });
  }
};
