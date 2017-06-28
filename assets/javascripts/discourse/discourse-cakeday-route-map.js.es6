export default function() {
  this.route('cakeday', { path: '/cakeday', resetNamespace: true }, function() {
    this.route('birthdays', { path: '/birthdays' }, function() {
      this.route('today', { path: '/today' });
      this.route('upcoming', { path: '/upcoming' });
      this.route('all', { path: '/all' });
    });

    this.route('anniversaries', { path: '/anniversaries' }, function() {
      this.route('today', { path: '/today' });
      this.route('upcoming', { path: '/upcoming' });
      this.route('all', { path: '/all' });
    });
  });
}
