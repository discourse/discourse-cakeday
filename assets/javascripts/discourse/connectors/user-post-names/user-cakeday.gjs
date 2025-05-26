import Component from "@ember/component";
import { classNames, tagName } from "@ember-decorators/component";
import {
  birthday,
  birthdayTitle,
  cakeday,
  cakedayTitle,
} from "discourse/plugins/discourse-cakeday/discourse/lib/cakeday";
import EmojiImages from "../../components/emoji-images";

@tagName("div")
@classNames("user-post-names-outlet", "user-cakeday")
export default class UserCakeday extends Component {
  init() {
    super.init(...arguments);
    const { model } = this;
    this.set("isCakeday", cakeday(model.cakedate));
    this.set("isBirthday", birthday(model.birthdate));
    this.set("cakedayTitle", cakedayTitle(model, this.currentUser));
    this.set("birthdayTitle", birthdayTitle(model, this.currentUser));
  }

  <template>
    {{#if this.siteSettings.cakeday_birthday_enabled}}
      {{#if this.isBirthday}}
        <EmojiImages
          @list={{this.siteSettings.cakeday_birthday_emoji}}
          @title={{this.birthdayTitle}}
        />
      {{/if}}
    {{/if}}
    {{#if this.siteSettings.cakeday_enabled}}
      {{#if this.isCakeday}}
        <EmojiImages
          @list={{this.siteSettings.cakeday_emoji}}
          @title={{this.cakedayTitle}}
        />
      {{/if}}
    {{/if}}
  </template>
}
