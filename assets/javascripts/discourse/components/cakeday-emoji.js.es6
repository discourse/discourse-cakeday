export default Em.Component.extend({
  tagName: 'img',
  classNames: ['emoji'],
  attributeBindings: ['src', 'title', 'alt'],
  src: Discourse.Emoji.urlFor(Discourse.SiteSettings.cakeday_emoji),
  title: Discourse.SiteSettings.cakeday_emoji,
  alt: Discourse.SiteSettings.cakeday_emoji
});
