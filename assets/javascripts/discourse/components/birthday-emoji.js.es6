export default Em.Component.extend({
  tagName: 'img',
  classNames: ['emoji'],
  attributeBindings: ['src', 'title', 'alt'],
  src: Discourse.Emoji.urlFor(Discourse.SiteSettings.its_your_birthday_emoji),
  title: Discourse.SiteSettings.its_your_birthday_emoji,
  alt: Discourse.SiteSettings.its_your_birthday_emoji
});
