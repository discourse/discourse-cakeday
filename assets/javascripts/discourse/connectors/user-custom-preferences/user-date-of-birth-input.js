export default {
  setupComponent(args, component) {
    const year = 1904;
    const months = moment.months().map((month, index) => {
      return { name: month, value: index + 1 };
    });

    const days = Array.from(Array(31).keys()).map((x) => (x + 1).toString());

    const dateOfBirth = args.model.get("date_of_birth");
    const userBirthdayYear = dateOfBirth
      ? (moment(dateOfBirth, "YYYY-MM-DD").year() !== year ? moment(dateOfBirth, "YYYY-MM-DD").year() : null)
      : null;
    const userBirthdayMonth = dateOfBirth
      ? moment(dateOfBirth, "YYYY-MM-DD").month() + 1
      : null;
    const userBirthdayDay = dateOfBirth
      ? moment(dateOfBirth, "YYYY-MM-DD").date().toString()
      : null;

    component.setProperties({
      year,
      months,
      days,
      userBirthdayYear,
      userBirthdayMonth,
      userBirthdayDay,
    });

    const updateBirthday = function () {
      let date = "";

      if (component.userBirthdayYear && component.userBirthdayMonth && component.userBirthdayDay) {
        date = `${component.userBirthdayYear}-${component.userBirthdayMonth}-${component.userBirthdayDay}`;
      }
      else if (component.userBirthdayMonth && component.userBirthdayDay) {
        date = `1904-${component.userBirthdayMonth}-${component.userBirthdayDay}`;
      }

      args.model.set("date_of_birth", date);
    };

    component.addObserver("userBirthdayYear", updateBirthday);
    component.addObserver("userBirthdayMonth", updateBirthday);
    component.addObserver("userBirthdayDay", updateBirthday);
  },
};
