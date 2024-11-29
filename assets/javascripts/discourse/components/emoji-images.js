import Component from "@ember/component";
import { classNames } from "@ember-decorators/component";
import { emojiUnescape } from "discourse/lib/text";
import computed from "discourse-common/utils/decorators";
import I18n from "I18n";

@classNames("emoji-images")
export default class EmojiImages extends Component {
  @computed("list")
  emojiHTML(list) {
    return list
      .split("|")
      .map((et) => emojiUnescape(`:${et}:`, { skipTitle: true }));
  }

  @computed("title")
  titleText(title) {
    return I18n.t(title);
  }
}
