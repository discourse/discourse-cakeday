import computed from 'ember-addons/ember-computed-decorators';

export default Ember.Controller.extend({
  cakedayEnabled: Ember.computed.alias("siteSettings.cakeday_enabled"),
  cakedayBirthdayEnabled: Ember.computed.alias("siteSettings.cakeday_birthday_enabled")
})
