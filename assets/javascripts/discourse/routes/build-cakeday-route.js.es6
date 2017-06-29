export default (storeName, filter) => {
  return Discourse.Route.extend({
    model(params) {
      params.timezone_offset = (new Date().getTimezoneOffset());
      if (filter) params.filter = filter;
      return this.store.find(storeName, params);
    }
  });
};
