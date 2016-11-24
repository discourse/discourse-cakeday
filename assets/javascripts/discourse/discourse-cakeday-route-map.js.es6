export default function() {
  this.route('cakeday', { path: '/cakeday', resetNamespace: true }, function() {
    this.route('birthdays', { path: '/birthdays' });
    this.route('anniversaries', { path: '/anniversaries' });
  });
}
