import { isEmpty } from "@ember/utils";
import I18n from "I18n";

export function isSameDay(date, opts) {
  let formatString = "YYYY";
  const current = moment();
  const currentDate = moment(date);

  if (opts && opts.anniversary) {
    if (current.format(formatString) <= currentDate.format(formatString)) {
      return false;
    }
  }

  formatString = "MMDD";

  return current.format(formatString) === currentDate.format(formatString);
}

export function cakeday(createdAt) {
  if (isEmpty(createdAt)) {
    return false;
  }
  return isSameDay(createdAt, { anniversary: true });
}

export function cakedayBirthday(dateOfBirth) {
  if (isEmpty(dateOfBirth)) {
    return false;
  }
  return isSameDay(dateOfBirth);
}

export function userAge(dateOfBirth) {
  return dateOfBirth ? (moment(dateOfBirth, "YYYY-MM-DD").year() !== 1904 ? moment().diff(dateOfBirth, 'years') : null) : null;
}

export function userAgeTitle(user) {
  return (user.date_of_birth && moment(user.date_of_birth, "YYYY-MM-DD").year() !== 1904) ? userAge(user.date_of_birth) + ' ' + I18n.default.t("relative_time_picker.years", {count: userAge(user.date_of_birth)}) : null;
}

export function userBirthdateTitle(user) {
  return (user.date_of_birth && moment(user.date_of_birth, "YYYY-MM-DD").year() !== 1904) ? moment(user.date_of_birth).format(I18n.t("dates.long_with_year_no_time")) : null;
}

export function cakedayTitle(user, currentUser) {
  if (isSameUser(user, currentUser)) {
    return "user.anniversary.user_title";
  } else {
    return "user.anniversary.title";
  }
}

export function cakedayBirthdayTitle(user, currentUser) {
  if (isSameUser(user, currentUser)) {
    return "user.date_of_birth.user_title";
  } else {
    return "user.date_of_birth.title";
  }
}

function isSameUser(user, currentUser) {
  if (!currentUser) {
    return false;
  }
  return user.get("id") === currentUser.get("id");
}
