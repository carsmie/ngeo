goog.require('nk.Themes');
goog.require('nk.ThemesEventType');
goog.require('nk.test.data.themes');

describe('nk.Themes', function() {
  var nkThemes;
  var treeUrl;

  beforeEach(function() {
    inject(function($injector) {
      nkThemes = $injector.get('nkThemes');
      treeUrl = $injector.get('nkTreeUrl');
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', treeUrl).respond(themes);
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Get background layers', function() {
    var spy = jasmine.createSpy();
    ol.events.listenOnce(nkThemes, nk.ThemesEventType.LOAD, function(evt) {
      nkThemes.getBgLayers().then(spy);
    });

    $httpBackend.expectGET(treeUrl);
    themes.background_layers.forEach(function(bgLayer) {
      var response = bgLayer.name == 'map' ? capabilities.map :
          capabilities.asitvd;
      $httpBackend.when('GET', bgLayer.url).respond(response);
      $httpBackend.expectGET(bgLayer.url);
    });
    nkThemes.loadThemes();
    $httpBackend.flush();

    expect(spy.calls.length).toBe(1);
    var response = spy.mostRecentCall.args[0];
    expect(response.length).toBe(4);
    var responseFirstBgName = response[1].get('label');
    var firstBgName = themes.background_layers[0].name;
    expect(responseFirstBgName).toBe(firstBgName);
  });

  it('Load themes', function() {
    var spy = jasmine.createSpy();
    ol.events.listenOnce(nkThemes, nk.ThemesEventType.LOAD, function(evt) {
      nkThemes.promise_.then(spy);
    });

    $httpBackend.expectGET(treeUrl);
    nkThemes.loadThemes();
    $httpBackend.flush();

    expect(spy.calls.length).toBe(1);
    var data = spy.mostRecentCall.args[0];
    expect(Object.keys(data)[0]).toBe(Object.keys(themes)[0]);
  });

  it('Get themes object', function() {
    var spy = jasmine.createSpy();
    ol.events.listenOnce(nkThemes, nk.ThemesEventType.LOAD, function(evt) {
      nkThemes.getThemesObject().then(spy);
    });

    $httpBackend.expectGET(treeUrl);
    nkThemes.loadThemes();
    $httpBackend.flush();

    expect(spy.calls.length).toBe(1);
    var resultThemes = spy.mostRecentCall.args[0];
    var dataFirstKey = Object.keys(resultThemes[0])[0];
    var themesThemesFirstKey = Object.keys(themes.themes[0])[0];
    expect(dataFirstKey).toBe(themesThemesFirstKey);
  });

  it('Get a theme object (find a specific theme)', function() {
    var themeName = 'Enseignement';
    var spy = jasmine.createSpy();
    ol.events.listenOnce(nkThemes, nk.ThemesEventType.LOAD, function(evt) {
      nkThemes.getThemeObject(themeName).then(spy);
    });

    $httpBackend.expectGET(treeUrl);
    nkThemes.loadThemes();
    $httpBackend.flush();

    expect(spy.calls.length).toBe(1);
    var resultTheme = spy.mostRecentCall.args[0];
    expect(resultTheme.name).toBe(themeName);
  });
});
