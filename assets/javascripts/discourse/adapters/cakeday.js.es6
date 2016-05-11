import RESTAdapter from 'discourse/adapters/rest';

export default RESTAdapter.extend({
  basePath(store, type) {
    return '/cakeday/';
  }
});
