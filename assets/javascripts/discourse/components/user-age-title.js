import Component from "@ember/component";
import computed from "discourse-common/utils/decorators";
import I18n from "I18n";

export default Component.extend({
  classNames: ["user-age-title"],

  @computed("title")
  titleText(title) {
    return I18n.t('js.user.date_of_birth.label') + ': ' + title;
  },
});
