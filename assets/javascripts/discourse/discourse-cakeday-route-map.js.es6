export default function() {
  this.resource('cakeday', { path: '/cakeday' }, function() {
    this.route('birthdays', { path: '/birthdays' });
    this.route('anniversaries', { path: '/anniversaries' });
 })
}
