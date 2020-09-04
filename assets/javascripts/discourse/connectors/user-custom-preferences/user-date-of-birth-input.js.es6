export default {
  setupComponent(args, component) {
    const months = moment.months().map((month, index) => {
      return { name: month, value: index + 1 };
    });

    const days = Array.from(Array(31).keys()).map((x) => (x + 1).toString());

    const dateOfBirth = args.model.get("date_of_birth");
    const userBirthdayMonth = dateOfBirth
      ? moment(dateOfBirth, "YYYY-MM-DD").month() + 1
      : null;
    const userBirthdayDay = dateOfBirth
      ? moment(dateOfBirth, "YYYY-MM-DD").date().toString()
      : null;

    component.setProperties({
      months,
      days,
      userBirthdayMonth,
      userBirthdayDay,
    });

    const updateBirthday = function () {
      let date = "";

      if (component.userBirthdayMonth && component.userBirthdayDay) {
        date = `1904-${component.userBirthdayMonth}-${component.userBirthdayDay}`;
      }

      args.model.set("date_of_birth", date);
    };

    component.addObserver("userBirthdayMonth", updateBirthday);
    component.addObserver("userBirthdayDay", updateBirthday);
  },
};
