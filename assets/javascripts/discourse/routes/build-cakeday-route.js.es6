import DiscourseRoute from "discourse/routes/discourse";

export default (storeName, filter) => {
  return DiscourseRoute.extend({
    model(params) {
      params.timezone_offset = new Date().getTimezoneOffset();
      if (filter) params.filter = filter;
      return this.store.find(storeName, params);
    }
  });
};
