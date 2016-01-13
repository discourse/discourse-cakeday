import computed from 'ember-addons/ember-computed-decorators';

export default Em.Component.extend({
  tagName: 'nav',

  @computed('list')
  emojiTitles(list) {
    return list.split("|");
  },

  render(buffer) {
    this.get('emojiTitles').forEach((emojiTitle) => {
      buffer.push(Discourse.Emoji.unescape(`:${emojiTitle}:`));
    });
  }
});
