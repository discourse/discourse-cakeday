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
  get isCakeday() {
    return cakeday(this.outletArgs.model.cakedate);
  }

  get isBirthday() {
    return birthday(this.outletArgs.model.birthdate);
  }

  get cakedayTitle() {
    return cakedayTitle(this.outletArgs.model, this.currentUser);
  }

  get birthdayTitle() {
    return birthdayTitle(this.outletArgs.model, this.currentUser);
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
