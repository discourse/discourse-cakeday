import computed from 'ember-addons/ember-computed-decorators';
import Post from 'discourse/models/post';

export default {
  name: 'cakeday',

  initialize() {
    Post.reopen({
      @computed('user_created_at')
      isCakeday(createdAt) {
        if (Ember.isEmpty(createdAt)) return false;
        return this.isSameDay(createdAt, { anniversary: true });
      },

      @computed('user_custom_fields.date_of_birth')
      isUserBirthday(dateOfBirth) {
        if (Ember.isEmpty(dateOfBirth)) return false;
        return this.isSameDay(dateOfBirth);
      },

      isSameDay: function(date, opts) {
        var formatString = 'YYYY';
        const current = moment();
        const currentDate = moment(date);

        if (opts.anniversary) {
          if (current.format(formatString) <= currentDate.format(formatString)) return false;
        }

        formatString = 'MMDD';

        return moment().format(formatString) === moment(date).format(formatString);
      }
    });
  }
}
