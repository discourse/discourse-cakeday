import computed from 'ember-addons/ember-computed-decorators';
import Post from 'discourse/models/post';

export default {
  name: 'its-your-birthday',

  initialize() {
    Post.reopen({
      @computed('user_created_at')
      isUserBirthday(createdAt) {
        const formatString = 'MMDD';
        return moment().format(formatString) === moment(createdAt).format(formatString);
      }
    });
  }
}
