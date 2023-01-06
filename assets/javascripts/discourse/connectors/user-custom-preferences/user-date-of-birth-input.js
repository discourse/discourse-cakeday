export default {
  setupComponent({ model }, component) {
    const { birthdate } = model;

    const months = moment.months().map((month, index) => {
      return { name: month, value: index + 1 };
    });

    const days = [...Array(31).keys()].map((d) => (d + 1).toString());

    const month = birthdate
      ? moment(birthdate, "YYYY-MM-DD").month() + 1
      : null;

    const day = birthdate
      ? moment(birthdate, "YYYY-MM-DD").date().toString()
      : null;

    component.setProperties({ months, days, month, day });

    const updateBirthdate = () => {
      let date = "";
      let { month, day } = component;

      if (month && day) {
        date = `1904-${month}-${day}`;
      }

      // The property that is being serialized when sending the update
      // request to the server is called `date_of_birth`
      model.set("date_of_birth", date);
    };

    component.addObserver("month", updateBirthdate);
    component.addObserver("day", updateBirthdate);
  },
};
