import {
  cakeday,
  cakedayTitle,
  cakedayBirthday,
  cakedayBirthdayTitle,
} from 'discourse/plugins/discourse-cakeday/discourse/lib/cakeday';

export default {
  setupComponent(args, component) {
    component.set('isCakeday', cakeday(args.user.get('created_at')));
    component.set('isUserBirthday', cakedayBirthday(args.user.get('date_of_birth')));
    component.set('cakedayTitle', cakedayTitle(args.user, this.currentUser));
    component.set('cakedayBirthdayTitle', cakedayBirthdayTitle(args.user, this.currentUser));
  }
};
