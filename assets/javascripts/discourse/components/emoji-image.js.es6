import computed from 'ember-addons/ember-computed-decorators';

export default Em.Component.extend({
  tagName: 'img',
  classNames: ['emoji'],
  attributeBindings: ['src', 'title', 'alt'],

  @computed('emoji')
  src(emoji) {
    return Discourse.Emoji.urlFor(this.get('emoji'));
  },

  @computed('emoji')
  title(emoji) {
    return emoji;
  },

  @computed('emoji')
  alt(emoji) {
    return emoji;
  }
});
