import computed from 'ember-addons/ember-computed-decorators';
import { emojiUnescape } from 'discourse/lib/text';
import { iconHTML } from 'discourse/helpers/fa-icon';

export default Em.Component.extend({
  @computed('list')
  emojiTitles(list) {
    return list.split("|");
  },

  render(buffer) {
    if (this.siteSettings.enable_emoji) {
      this.get('emojiTitles').forEach((emojiTitle) => {
        buffer.push(emojiUnescape(`:${emojiTitle}:`));
      });
    } else {
      buffer.push(iconHTML('birthday-cake', { title: this.get('title') }));
    }
  }
});
