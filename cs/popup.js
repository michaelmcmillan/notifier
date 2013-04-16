// Generated by CoffeeScript 1.4.0
(function() {
  var $, chatterText, clickDinnerLink, createBusDataRequest, displayItems, fadeButtonText, findUpdatedPosts, insertBusInfo, iteration, listDinners, ls, mainLoop, newsLimit, optionsText, tipsText, updateBus, updateCantinas, updateCoffee, updateHours, updateMeetings, updateNews, updateServant,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  ls = localStorage;

  iteration = 0;

  newsLimit = 4;

  mainLoop = function() {
    if (DEBUG) {
      console.log("\n#" + iteration);
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
    var feedItems, key, name;
    if (DEBUG) {
      console.log('updateNews');
    }
    feedItems = ls.feedItems;
    if (feedItems !== void 0) {
      return displayItems(JSON.parse(feedItems));
    } else {
      key = ls.affiliationKey;
      name = Affiliation.org[key].name;
      return $('#news').html('<div class="post"><div class="title">Nyheter</div><div class="item">Frakoblet fra ' + name + '</div></div>');
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

  optionsText = function(show) {
    return fadeButtonText(show, 'Innstillinger');
  };

  tipsText = function(show) {
    return fadeButtonText(show, '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Tips++');
  };

  chatterText = function(show) {
    return fadeButtonText(show, '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;\
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Bli med i samtalen');
  };

  fadeButtonText = function(show, msg) {
    var fadeInSpeed, fadeOutSpeed;
    fadeInSpeed = 150;
    fadeOutSpeed = 50;
    if (show) {
      $('#buttontext').html(msg);
      return $('#buttontext').fadeIn(fadeInSpeed);
    } else {
      $('#buttontext').fadeOut(fadeOutSpeed);
      return $('#buttontext').html('');
    }
  };

  $(function() {
    var affiliation, color, logo;
    $.ajaxSetup(AJAX_SETUP);
    if (ls.useInfoscreen === 'true') {
      Browser.openTab('infoscreen.html');
      setTimeout((function() {
        return window.close();
      }), 250);
    }
    if (ls.showOffice !== 'true') {
      $('#todays').hide();
    }
    if (ls.showCantina !== 'true') {
      $('#cantinas').hide();
    }
    if (ls.showBus !== 'true') {
      $('#bus').hide();
    }
    if (ls.affiliationKey !== 'online') {
      $('#chatter_button').hide();
      $('#mobile_text').hide();
      affiliation = ls.affiliationKey;
      logo = Affiliation.org[affiliation].logo;
      if (logo !== void 0 && logo !== '') {
        if (DEBUG) {
          console.log('Applying affiliation logo', logo);
        }
        $('#header #logo').prop('src', logo);
      }
    }
    color = ls['affiliationColor'];
    if (color !== 'undefined' && color !== '') {
      if (DEBUG) {
        console.log('Applying affiliation color', color);
      }
      $('#palette').attr('href', Palettes.getColor(color));
    }
    $('#logo').click(function() {
      var web;
      web = Affiliation.org[ls.affiliationKey].web;
      Browser.openTab(web);
      return window.close();
    });
    $('#options_button').click(function() {
      Browser.openTab('options.html');
      return window.close();
    });
    $('#chatter_button').click(function() {
      Browser.openTab('http://webchat.freenode.net/?channels=online');
      return window.close();
    });
    $('#options_button').mouseenter(function() {
      return optionsText(true);
    });
    $('#options_button').mouseleave(function() {
      return optionsText(false);
    });
    $('#chatter_button').mouseenter(function() {
      return chatterText(true);
    });
    $('#chatter_button').mouseleave(function() {
      return chatterText(false);
    });
    $('#tips_button').mouseenter(function() {
      return tipsText(true);
    });
    $('#tips_button').mouseleave(function() {
      return tipsText(false);
    });
    $('#tips_button').click(function() {
      if ($('#tips').filter(':visible').length === 1) {
        return $('#tips').fadeOut('fast');
      } else {
        return $('#tips').fadeIn('fast');
      }
    });
    $('#tips:not(a)').click(function() {
      return $('#tips').fadeOut('fast');
    });
    $('#tips a').click(function() {
      Browser.openTab($(this).attr('href'));
      return window.close();
    });
    $('#bus #atb_logo').click(function() {
      Browser.openTab('http://www.atb.no');
      return window.close();
    });
    $(document).konami({
      code: ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'],
      callback: function() {
        $('head').append('<style type="text/css">\
        @-webkit-keyframes adjustHue {\
          0% { -webkit-filter: hue-rotate(0deg); }\
          10% { -webkit-filter: hue-rotate(36deg); }\
          20% { -webkit-filter: hue-rotate(72deg); }\
          30% { -webkit-filter: hue-rotate(108deg); }\
          40% { -webkit-filter: hue-rotate(144deg); }\
          50% { -webkit-filter: hue-rotate(180deg); }\
          60% { -webkit-filter: hue-rotate(216deg); }\
          70% { -webkit-filter: hue-rotate(252deg); }\
          80% { -webkit-filter: hue-rotate(288deg); }\
          90% { -webkit-filter: hue-rotate(324deg); }\
          100% { -webkit-filter: hue-rotate(360deg); }\
        }</style>');
        return $('#background').attr('style', '-webkit-animation:adjustHue 10s alternate infinite;');
      }
    });
    return mainLoop();
  });

}).call(this);
