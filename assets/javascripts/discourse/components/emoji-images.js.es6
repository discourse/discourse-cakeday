import computed from "discourse-common/utils/decorators";
import { emojiUnescape } from "discourse/lib/text";
import I18n from "I18n";

export default Ember.Component.extend({
  classNames: ["emoji-images"],

  @computed("list")
  emojiHTML(list) {
    return list
      .split("|")
      .map((et) => emojiUnescape(`:${et}:`, { skipTitle: true }));
  },

  @computed("title")
  titleText(title) {
    return I18n.t(title);
  },
});
