export default Discourse.Route.extend({
  queryParams: {
    month: { refreshModel: true }
  },

  refreshQueryWithoutTransition: true,

  model(params) {
    params.timezone_offset = (new Date().getTimezoneOffset());
    return this.store.find("birthday", params);
  }
});
