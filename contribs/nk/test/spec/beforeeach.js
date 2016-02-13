beforeEach(function() {
  module('nk', function($provide) {
    $provide.value('nkTreeUrl', 'http://fake/nk/themes');
  });
});
