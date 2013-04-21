// Generated by CoffeeScript 1.4.0
(function() {
  var $, busLoading, clickDinnerLink, createBusDataRequest, displayItems, findUpdatedPosts, insertBusInfo, iteration, listDinners, ls, mainLoop, newsLimit, updateBus, updateCantinas, updateCoffee, updateHours, updateMeetings, updateNews, updateOffice, updateServant,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  ls = localStorage;

  iteration = 0;

  newsLimit = 4;

  window.IS_MOBILE = 1;

  mainLoop = function() {
    if (DEBUG) {
      console.log("\n#" + iteration);
    }
    if (iteration % UPDATE_OFFICE_INTERVAL === 0 && ls.showOffice === 'true') {
      updateOffice();
    }
    if (iteration % UPDATE_SERVANT_INTERVAL === 0 && ls.showOffice === 'true') {
      updateServant();
    }
    if (iteration % UPDATE_MEETINGS_INTERVAL === 0 && ls.showOffice === 'true') {
      updateMeetings();
    }
    if (iteration % UPDATE_COFFEE_INTERVAL === 0 && ls.showOffice === 'true') {
      updateCoffee();
    }
    if (iteration % UPDATE_CANTINAS_INTERVAL === 0 && ls.showCantina === 'true') {
      updateCantinas();
    }
    if (iteration % UPDATE_HOURS_INTERVAL === 0 && ls.showCantina === 'true') {
      updateHours();
    }
    if (iteration % UPDATE_BUS_INTERVAL === 0 && ls.showBus === 'true') {
      updateBus();
    }
    if (iteration % UPDATE_NEWS_INTERVAL === 0) {
      updateNews();
    }
    if (10000 < iteration) {
      iteration = 0;
    } else {
      iteration++;
    }
    return setTimeout((function() {
      return mainLoop();
    }), PAGE_LOOP);
  };

  updateOffice = function() {
    if (DEBUG) {
      console.log('updateOffice');
    }
    return Office.get(function(status, title, message) {
      if (ls.currentStatus !== status || ls.currentStatusMessage !== message) {
        $('#office #status').html(title);
        $('#office #status').attr('class', status);
        $('#office #subtext').html(message);
        ls.currentStatus = status;
        return ls.currentStatusMessage = message;
      }
    });
  };

  updateServant = function() {
    if (DEBUG) {
      console.log('updateServant');
    }
    return Servant.get(function(servant) {
      return $('#todays #schedule #servant').html('- ' + servant);
    });
  };

  updateMeetings = function() {
    if (DEBUG) {
      console.log('updateMeetings');
    }
    return Meetings.get(function(meetings) {
      meetings = meetings.replace(/\n/g, '<br />');
      return $('#todays #schedule #meetings').html(meetings);
    });
  };

  updateCoffee = function() {
    if (DEBUG) {
      console.log('updateCoffee');
    }
    return Coffee.get(true, function(pots, age) {
      $('#todays #coffee #pots').html('- ' + pots);
      return $('#todays #coffee #age').html(age);
    });
  };

  updateCantinas = function() {
    if (DEBUG) {
      console.log('updateCantinas');
    }
    Cantina.get(ls.left_cantina, function(menu) {
      $('#cantinas #left .title').html(ls.left_cantina);
      $('#cantinas #left #dinnerbox').html(listDinners(menu));
      return clickDinnerLink('#cantinas #left #dinnerbox li');
    });
    return Cantina.get(ls.right_cantina, function(menu) {
      $('#cantinas #right .title').html(ls.right_cantina);
      $('#cantinas #right #dinnerbox').html(listDinners(menu));
      return clickDinnerLink('#cantinas #right #dinnerbox li');
    });
  };

  listDinners = function(menu) {
    var dinner, dinnerlist, _i, _len;
    dinnerlist = '';
    if (typeof menu === 'string') {
      ls.noDinnerInfo = 'true';
      dinnerlist += '<li>' + menu + '</li>';
    } else {
      ls.noDinnerInfo = 'false';
      for (_i = 0, _len = menu.length; _i < _len; _i++) {
        dinner = menu[_i];
        if (dinner.price !== null) {
          dinner.price = dinner.price + ',- ';
          dinnerlist += '<li id="' + dinner.index + '">' + dinner.price + dinner.text + '</li>';
        } else {
          dinnerlist += '<li class="message" id="' + dinner.index + '">"' + dinner.text + '"</li>';
        }
      }
    }
    return dinnerlist;
  };

  clickDinnerLink = function(cssSelector) {
    return $(cssSelector).click(function() {
      Browser.openTab(Cantina.url);
      return window.close();
    });
  };

  updateHours = function() {
    if (DEBUG) {
      console.log('updateHours');
    }
    Hours.get(ls.left_cantina, function(hours) {
      return $('#cantinas #left .hours').html(hours);
    });
    return Hours.get(ls.right_cantina, function(hours) {
      return $('#cantinas #right .hours').html(hours);
    });
  };

  updateBus = function() {
    if (DEBUG) {
      console.log('updateBus');
    }
    if (!navigator.onLine) {
      $('#bus #firstBus .name').html(ls.firstBusName);
      $('#bus #secondBus .name').html(ls.secondBusName);
      $('#bus #firstBus .first .line').html('<div class="error">Frakoblet fra api.visuweb.no</div>');
      return $('#bus #secondBus .first .line').html('<div class="error">Frakoblet fra api.visuweb.no</div>');
    } else {
      createBusDataRequest('firstBus', '#firstBus');
      return createBusDataRequest('secondBus', '#secondBus');
    }
  };

  createBusDataRequest = function(bus, cssIdentificator) {
    var activeLines;
    activeLines = ls[bus + 'ActiveLines'];
    activeLines = JSON.parse(activeLines);
    return Bus.get(ls[bus], activeLines, function(lines) {
      return insertBusInfo(lines, ls[bus + 'Name'], cssIdentificator);
    });
  };

  insertBusInfo = function(lines, stopName, cssIdentificator) {
    var busStop, i, spans, _results;
    busStop = '#bus ' + cssIdentificator;
    spans = ['first', 'second', 'third'];
    $(busStop + ' .name').html(stopName);
    for (i in spans) {
      $(busStop + ' .' + spans[i] + ' .line').html('');
      $(busStop + ' .' + spans[i] + ' .time').html('');
    }
    if (typeof lines === 'string') {
      return $(busStop + ' .first .line').html('<div class="error">' + lines + '</div>');
    } else {
      if (lines['departures'].length === 0) {
        return $(busStop + ' .first .line').html('<div class="error">....zzzZZZzzz....</div>');
      } else {
        _results = [];
        for (i in spans) {
          $(busStop + ' .' + spans[i] + ' .line').append(lines['destination'][i]);
          _results.push($(busStop + ' .' + spans[i] + ' .time').append(lines['departures'][i]));
        }
        return _results;
      }
    }
  };

  updateNews = function() {
    var affiliation, affiliationKey, getNewsAmount;
    if (DEBUG) {
      console.log('updateNews');
    }
    affiliationKey = ls['affiliationKey'];
    affiliation = Affiliation.org[affiliationKey];
    if (affiliation === void 0) {
      if (DEBUG) {
        return console.log('ERROR: chosen affiliation', affiliationKey, 'is not known');
      }
    } else {
      getNewsAmount = 10;
      return News.get(affiliation, getNewsAmount, function(items) {
        var name;
        if (typeof items === 'string') {
          if (DEBUG) {
            console.log('ERROR:', items);
          }
          name = Affiliation.org[affiliationKey].name;
          return $('#news').html('<div class="post"><div class="title">Nyheter</div><div class="item">Frakoblet fra ' + name + '</div></div>');
        } else {
          ls.feedItems = JSON.stringify(items);
          News.refreshNewsIdList(items);
          return displayItems(items);
        }
      });
    }
  };

  displayItems = function(items) {
    var altLink, feedKey, index, link, newsList, updatedList, viewedList;
    $('#news').html('');
    feedKey = items[0].feedKey;
    newsList = JSON.parse(ls.newsList);
    viewedList = JSON.parse(ls.viewedNewsList);
    updatedList = findUpdatedPosts(newsList, viewedList);
    viewedList = [];
    $.each(items, function(index, item) {
      var altLink, date, htmlItem, _ref;
      if (index < newsLimit) {
        viewedList.push(item.link);
        htmlItem = '<div class="post"><div class="title">';
        if (index < ls.unreadCount) {
          if (_ref = item.link, __indexOf.call(updatedList.indexOf, _ref) >= 0) {
            htmlItem += '<span class="unread">UPDATED <b>::</b> </span>';
          } else {
            htmlItem += '<span class="unread">NEW <b>::</b> </span>';
          }
        }
        date = altLink = '';
        if (item.date !== null) {
          date = ' den ' + item.date;
        }
        if (item.altLink !== null) {
          altLink = ' name="' + item.altLink + '"';
        }
        htmlItem += item.title + '\
        </div>\
          <div class="item" data="' + item.link + '"' + altLink + '>\
            <img src="' + item.image + '" width="107" />\
            <div class="textwrapper">\
              <div class="emphasized">- Skrevet av ' + item.creator + date + '</div>\
              ' + item.description + '\
            </div>\
          </div>\
        </div>';
        return $('#news').append(htmlItem);
      }
    });
    ls.viewedNewsList = JSON.stringify(viewedList);
    Browser.setBadgeText('');
    ls.unreadCount = 0;
    $('.item').click(function() {
      var altLink, useAltLink;
      altLink = $(this).attr('name');
      useAltLink = Affiliation.org[ls.affiliationKey].useAltLink;
      if (altLink !== void 0 && useAltLink === true) {
        Browser.openTab($(this).attr('name'));
      } else {
        Browser.openTab($(this).attr('data'));
      }
      return window.close();
    });
    if (Affiliation.org[feedKey].useAltLink) {
      altLink = $('.item[data="' + link + '"]').attr('name');
      if (altLink !== 'null') {
        $('.item[data="' + link + '"]').attr('data', altLink);
      }
    }
    if (Affiliation.org[feedKey].getImage !== void 0) {
      for (index in viewedList) {
        link = viewedList[index];
        Affiliation.org[feedKey].getImage(link, function(link, image) {
          return $('.item[data="' + link + '"] img').attr('src', image);
        });
      }
    }
    if (Affiliation.org[feedKey].getImages !== void 0) {
      return Affiliation.org[feedKey].getImages(viewedList, function(links, images) {
        var _results;
        _results = [];
        for (index in links) {
          _results.push($('.item[data="' + links[index] + '"] img').attr('src', images[index]));
        }
        return _results;
      });
    }
  };

  findUpdatedPosts = function(newsList, viewedList) {
    var i, j, updatedList;
    updatedList = [];
    for (i in newsList) {
      if (newsList[i] === viewedList[0]) {
        break;
      }
      for (j in viewedList) {
        if (j === 0) {
          continue;
        }
        if (newsList[i] === viewedList[j]) {
          updatedList.push(newsList[i]);
        }
      }
    }
    return updatedList;
  };

  busLoading = function(cssIdentificator) {
    var cssSelector, loading, span, spans, _i, _len, _results;
    if (DEBUG) {
      console.log('busLoading:', cssIdentificator);
    }
    cssSelector = '#' + cssIdentificator;
    loading = cssIdentificator === 'first_bus' ? 'loading_left' : 'loading_right';
    $(cssSelector + ' .name').html('<img class="' + loading + '" src="mimg/loading.gif" />');
    spans = ['first', 'second', 'third', 'fourth'];
    _results = [];
    for (_i = 0, _len = spans.length; _i < _len; _i++) {
      span = spans[_i];
      $(cssSelector + ' .' + span + ' .line').html('');
      _results.push($(cssSelector + ' .' + span + ' .time').html(''));
    }
    return _results;
  };

  $(function() {
    var firstBusOk, firstBusProps, prop, secondBusOk, secondBusProps, _i, _j, _len, _len1;
    $.ajaxSetup(AJAX_SETUP);
    if (DEBUG) {
      ls.clear();
    }
    ls.removeItem('currentStatus');
    ls.removeItem('currentStatusMessage');
    if (ls.showAffiliation === void 0) {
      ls.showAffiliation = 'true';
    }
    if (ls.affiliationKey === void 0) {
      ls.affiliationKey = 'online';
    }
    if (ls.affiliationIcon === void 0) {
      ls.affiliationIcon = '/img/icon-default.png';
    }
    if (ls.affiliationPalette === void 0) {
      ls.affiliationPalette = 'online';
    }
    if (ls.newsList === void 0) {
      ls.newsList = JSON.stringify([]);
    }
    if (ls.viewedNewsList === void 0) {
      ls.viewedNewsList = JSON.stringify([]);
    }
    if (ls.showBus === void 0) {
      ls.showBus = 'true';
    }
    firstBusProps = [ls.firstBus, ls.firstBusName, ls.firstBusDirection, ls.firstBusActiveLines, ls.firstBusInactiveLines];
    secondBusProps = [ls.secondBus, ls.secondBusName, ls.secondBusDirection, ls.secondBusActiveLines, ls.secondBusInactiveLines];
    firstBusOk = true;
    secondBusOk = true;
    for (_i = 0, _len = firstBusProps.length; _i < _len; _i++) {
      prop = firstBusProps[_i];
      if (prop === void 0) {
        firstBusOk = false;
      }
    }
    for (_j = 0, _len1 = secondBusProps.length; _j < _len1; _j++) {
      prop = secondBusProps[_j];
      if (prop === void 0) {
        secondBusOk = false;
      }
    }
    if (!firstBusOk) {
      ls.firstBus = 16011333;
      ls.firstBusName = 'Gløshaugen Nord';
      ls.firstBusDirection = 'til byen';
      ls.firstBusActiveLines = JSON.stringify([5, 22]);
      ls.firstBusInactiveLines = JSON.stringify([169]);
    }
    if (!secondBusOk) {
      ls.secondBus = 16010333;
      ls.secondBusName = 'Gløshaugen Nord';
      ls.secondBusDirection = 'fra byen';
      ls.secondBusActiveLines = JSON.stringify([5, 22]);
      ls.secondBusInactiveLines = JSON.stringify([169]);
    }
    if (ls.showOffice === void 0) {
      ls.showOffice = 'true';
    }
    if (ls.showCantina === void 0) {
      ls.showCantina = 'true';
    }
    if (ls.left_cantina === void 0) {
      ls.left_cantina = 'hangaren';
    }
    if (ls.right_cantina === void 0) {
      ls.right_cantina = 'realfag';
    }
    ls.everConnected = ls.wasConnected = 'false';
    busLoading('first_bus');
    busLoading('second_bus');
    if (ls.background_image !== void 0) {
      $('body').attr('style', 'background-attachment:fixed;background-image:' + ls.background_image);
    } else {
      $('head').append('<script src="mimg/background_image.js"></script>');
      $('body').attr('style', 'background-attachment:fixed;background-image:' + BACKGROUND_IMAGE);
      ls.background_image = BACKGROUND_IMAGE;
    }
    return mainLoop();
  });

}).call(this);
