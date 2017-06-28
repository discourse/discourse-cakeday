export default Discourse.Route.extend({
  model(params) {
    params.timezone_offset = (new Date().getTimezoneOffset());
    params.filter = 'upcoming';
    return this.store.find("anniversary", params);
  }
});
