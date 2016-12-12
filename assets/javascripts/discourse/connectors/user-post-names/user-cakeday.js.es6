import { cakeday, cakedayBirthday} from 'discourse/plugins/discourse-cakeday/discourse/lib/cakeday';

export default {
  setupComponent(args, component) {
    component.set('isCakeday', cakeday(args.model.get('created_at')));
    component.set('isUserBirthday', cakedayBirthday(args.model.get('date_of_birthday')));
  }
};

