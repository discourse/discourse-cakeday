import DiscourseRoute from "discourse/routes/discourse";

export default (storeName, filter) => {
  return DiscourseRoute.extend({
    model(params) {
      if (filter) {
        params.filter = filter;
      }

      return this.store.find(storeName, params);
    },
  });
};
