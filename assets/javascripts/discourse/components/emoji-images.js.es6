import computed from 'ember-addons/ember-computed-decorators';
import { emojiUnescape } from 'discourse/lib/text';

export default Ember.Component.extend({
  @computed('list')
  emojiHTML(list) {
    return list.split("|").map(et => emojiUnescape(`:${et}:`));
  }
});
