import computed from 'ember-addons/ember-computed-decorators';
import Post from 'discourse/models/post';

export default {
  name: 'cakeday',

  initialize() {
    Post.reopen({
      @computed('user_created_at')
      isCakeday(createdAt) {
        return this.isSameDay(createdAt);
      },

      @computed('user_date_of_birth')
      isUserBirthday(dateOfBirth) {
        return this.isSameDay(dateOfBirth);
      },

      isSameDay: function(date) {
        const formatString = 'MMDD';
        return moment().format(formatString) === moment(date).format(formatString);
      }
    });
  }
}
