export default {
  setupComponent(args, component) {
    component.set(
      "months",
      moment.months().map((month, index) => {
        return { name: month, value: index + 1 };
      })
    );
    component.set("days", _.range(1, 32));
    const dateOfBirth = args.model.get("date_of_birth");
    component.set(
      "userBirthdayMonth",
      moment(dateOfBirth, "YYYY-MM-DD").month() + 1
    );
    component.set("userBirthdayDay", moment(dateOfBirth, "YYYY-MM-DD").date());

    const updateBirthday = function() {
      const userBirthdayMonth = component.get("userBirthdayMonth");
      const userBirthdayDay = component.get("userBirthdayDay");
      const user = args.model;
      var date = "";

      if (userBirthdayMonth !== "" && userBirthdayDay !== "") {
        date = `1904-${component.get("userBirthdayMonth")}-${component.get(
          "userBirthdayDay"
        )}`;
      }

      user.set("date_of_birth", date);
    };

    component.addObserver("userBirthdayMonth", updateBirthday);
    component.addObserver("userBirthdayDay", updateBirthday);
  }
};
