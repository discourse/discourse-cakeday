import Component from "@ember/component";
import { classNames } from "@ember-decorators/component";
import computed from "discourse/lib/decorators";
import { emojiUnescape } from "discourse/lib/text";
import { i18n } from "discourse-i18n";

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
    return i18n(title);
  }
}
