export function isSameDay(date, opts) {
  let formatString = 'YYYY';
  const current = moment();
  const currentDate = moment(date, 'YYYY-MM-DD');

  if (opts && opts.anniversary) {
    if (current.format(formatString) <= currentDate.format(formatString)) return false;
  }

  formatString = 'MMDD';

  return current.format(formatString) === currentDate.format(formatString);
}

export function cakeday(createdAt) {
  if (Ember.isEmpty(createdAt)) return false;
  return isSameDay(createdAt, { anniversary: true });
}

export function cakedayBirthday(dateOfBirth) {
  if (Ember.isEmpty(dateOfBirth)) return false;
  return isSameDay(dateOfBirth);
}

export function cakedayTitle(user, currentUser) {
  if (isSameUser(user, currentUser)) {
    return I18n.t("user.anniversary.user_title");
  } else {
    return I18n.t("user.anniversary.title");
  }
}

export function cakedayBirthdayTitle(user, currentUser) {
  if (isSameUser(user, currentUser)) {
    return I18n.t("user.date_of_birth.user_title");
  } else {
    return I18n.t("user.date_of_birth.title");
  }
}

function isSameUser(user, currentUser) {
  if (!currentUser) return false;
  return user.get('id') === currentUser.get('id');
}
