import computed from 'ember-addons/ember-computed-decorators';
import Post from 'discourse/models/post';
import { withPluginApi } from 'discourse/lib/plugin-api';

function isSameDay(date, opts) {
  let formatString = 'YYYY';
  const current = moment();
  const currentDate = moment(date);

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

  if (siteSettings.cakeday_enabled) {
    api.includePostAttributes('user_created_at');

    api.addPosterIcon((cfs, attrs) => {
      const createdAt = attrs.user_created_at;
      if (!Ember.isEmpty(createdAt) && isSameDay(createdAt, { anniversary: true })) {
        return {
          emoji: siteSettings.cakeday_emoji
        };
      }
    });
  }

  if (siteSettings.cakeday_birthday_enabled) {
    api.addPosterIcon(cfs => {
      const dob = cfs.date_of_birth;
      if (!Ember.isEmpty(dob) && isSameDay(dob)) {
        return {
          emoji: siteSettings.cakeday_birthday_emoji
        };
      }
    });
  }
}

export default {
  name: 'cakeday',

  initialize(container) {
    const siteSettings = container.lookup('site-settings:main');
    withPluginApi('0.1', api => initializeCakeday(api, siteSettings), { noApi: oldPluginCode });
  }
};
