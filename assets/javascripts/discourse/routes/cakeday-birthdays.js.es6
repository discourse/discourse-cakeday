export default Discourse.Route.extend({
  queryParams: {
    month: { refreshModel: true }
  },

  refreshQueryWithoutTransition: true,

  model(params) {
    return this.store.find("birthday", params);
  },

  titleToken() {
    return I18n.t("birthdays.title");
  }
});
