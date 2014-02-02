// Generated by CoffeeScript 1.4.0
(function() {
  var $, animateCreatorName, changeCreatorName, createBusDataRequest, displayItems, findUpdatedPosts, insertBusInfo, iteration, listDinners, ls, mainLoop, newsLimit, officeFontRotate, updateAffiliationNews, updateBus, updateCantinas, updateCoffee, updateHours, updateMeetings, updateOffice, updateServant,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  ls = localStorage;

  iteration = 0;

  newsLimit = 8;

  mainLoop = function() {
    var first;
    console.lolg("\n#" + iteration);
    first = iteration === 0;
    if (navigator.onLine) {
      if (iteration % UPDATE_HOURS_INTERVAL === 0 && ls.showCantina === 'true') {
        updateHours();
      }
      if (iteration % UPDATE_CANTINAS_INTERVAL === 0 && ls.showCantina === 'true') {
        updateCantinas(first);
      }
      if (iteration % UPDATE_NEWS_INTERVAL === 0 && ls.showAffiliation1 === 'true') {
        updateAffiliationNews('1');
      }
      if (iteration % UPDATE_NEWS_INTERVAL === 0 && ls.showAffiliation2 === 'true') {
        updateAffiliationNews('2');
      }
    }
    if (Affiliation.org[ls.affiliationKey1].hw) {
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
    }
    if (iteration % UPDATE_BUS_INTERVAL === 0 && ls.showBus === 'true') {
      updateBus();
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

  updateOffice = function(debugStatus) {
    console.lolg('updateOffice');
    return Office.get(function(status, message) {
      if (DEBUG && debugStatus) {
        status = debugStatus;
        message = 'debugging';
      }
      if (ls.infoscreenOfficeStatus !== status || ls.infoscreenOfficeStatusMessage !== message) {
        if (__indexOf.call(Object.keys(Office.foods), status) >= 0) {
          if (Office.foods[status].image !== void 0) {
            $('#office #status img').attr('src', Office.foods[status].image);
            $('#office #status #text').hide();
            $('#office #status img').show();
          } else {
            $('#office #status #text').text(Office.foods[status].title);
            $('#office #status #text').css('color', Office.foods[status].color);
            $('#office #status img').hide();
            $('#office #status #text').show();
          }
        } else {
          $('#office #status #text').html(Office.statuses[status].title);
          $('#office #status #text').css('color', Office.statuses[status].color);
          $('#office #status img').hide();
          $('#office #status #text').show();
        }
        $('#office #subtext').html(message);
        ls.infoscreenOfficeStatus = status;
        return ls.infoscreenOfficeStatusMessage = message;
      }
    });
  };

  updateServant = function() {
    console.lolg('updateServant');
    return Servant.get(function(servant) {
      return $('#todays #schedule #servant').html('- ' + servant);
    });
  };

  updateMeetings = function() {
    console.lolg('updateMeetings');
    return Meetings.get(function(meetings) {
      meetings = meetings.replace(/\n/g, '<br />');
      return $('#todays #schedule #meetings').html(meetings);
    });
  };

  updateCoffee = function() {
    console.lolg('updateCoffee');
    return Coffee.get(true, function(pots, age) {
      $('#todays #coffee #pots').html('- ' + pots);
      return $('#todays #coffee #age').html(age);
    });
  };

  updateCantinas = function(first) {
    var menu1, menu2, update;
    console.lolg('updateCantinas');
    update = function(shortname, menu, selector) {
      var name;
      name = Cantina.names[shortname];
      $('#cantinas #' + selector + ' .title').html(name);
      return $('#cantinas #' + selector + ' #dinnerbox').html(listDinners(menu));
    };
    if (first) {
      menu1 = JSON.parse(ls.leftCantinaMenu);
      menu2 = JSON.parse(ls.rightCantinaMenu);
      update(ls.leftCantina, menu1, 'left');
      return update(ls.rightCantina, menu2, 'right');
    } else {
      Cantina.get(ls.leftCantina, function(menu) {
        return update(ls.leftCantina, menu, 'left');
      });
      return Cantina.get(ls.rightCantina, function(menu) {
        return update(ls.rightCantina, menu, 'right');
      });
    }
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
          dinner.price = dinner.price + ',-';
          dinnerlist += '<li id="' + dinner.index + '">' + dinner.price + ' ' + dinner.text + '</li>';
        } else {
          dinnerlist += '<li class="message" id="' + dinner.index + '">"' + dinner.text + '"</li>';
        }
      }
    }
    return dinnerlist;
  };

  updateHours = function() {
    console.lolg('updateHours');
    Hours.get(ls.leftCantina, function(hours) {
      return $('#cantinas #left .hours').html(hours);
    });
    return Hours.get(ls.rightCantina, function(hours) {
      return $('#cantinas #right .hours').html(hours);
    });
  };

  updateBus = function() {
    console.lolg('updateBus');
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
    spans = ['first', 'second', 'third', 'fourth'];
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

  updateAffiliationNews = function(number) {
    var affiliation, affiliationKey, selector;
    console.lolg('updateAffiliationNews' + number);
    selector = number === '1' ? '#left' : '#right';
    if (ls.showAffiliation2 !== 'true') {
      selector = '#full';
    }
    affiliationKey = ls['affiliationKey' + number];
    affiliation = Affiliation.org[affiliationKey];
    if (affiliation === void 0) {
      return console.lolg('ERROR: chosen affiliation', ls['affiliationKey' + number], 'is not known');
    } else {
      newsLimit = 10;
      return News.get(affiliation, newsLimit, function(items) {
        var key, name, newsList;
        if (typeof items === 'string' || items.length === 0) {
          console.lolg('ERROR:', items);
          key = ls['affiliationKey' + number];
          name = Affiliation.org[key].name;
          return $('#news ' + selector).html('<div class="post"><div class="title">Nyheter</div><div class="item">Frakoblet fra ' + name + '</div></div>');
        } else {
          newsList = 'affiliationNewsList' + number;
          ls[newsList] = News.refreshNewsList(items);
          return displayItems(items, selector, 'affiliationNewsList' + number, 'affiliationViewedList' + number, 'affiliationUnreadCount' + number);
        }
      });
    }
  };

  displayItems = function(items, column, newsListName, viewedListName, unreadCountName) {
    var altLink, feedKey, index, link, newsList, updatedList, viewedList;
    $('#news ' + column).html('');
    feedKey = items[0].feedKey;
    newsList = JSON.parse(ls[newsListName]);
    viewedList = JSON.parse(ls[viewedListName]);
    updatedList = findUpdatedPosts(newsList, viewedList);
    viewedList = [];
    $.each(items, function(index, item) {
      var altLink, date, descLimit, htmlItem, readUnread, unreadCount, _ref;
      if (index < newsLimit) {
        viewedList.push(item.link);
        unreadCount = Number(ls[unreadCountName]);
        readUnread = '';
        if (index < unreadCount) {
          if (_ref = item.link, __indexOf.call(updatedList.indexOf, _ref) >= 0) {
            readUnread += '<span class="unread">UPDATED <b>::</b> </span>';
          } else {
            readUnread += '<span class="unread">NEW <b>::</b> </span>';
          }
        }
        date = altLink = '';
        if (item.altLink !== null) {
          altLink = ' name="' + item.altLink + '"';
        }
        if (item.date !== null && ls.showAffiliation2 === 'false') {
          date = ' den ' + item.date;
        }
        descLimit = 140;
        if (ls.showAffiliation2 === 'true') {
          descLimit = 100;
        }
        if (item.description.length > descLimit) {
          item.description = item.description.substr(0, descLimit) + '...';
        }
        htmlItem = '\
        <div class="post">\
          <div class="item" data="' + item.link + '"' + altLink + '>\
            <div class="title">' + readUnread + item.title + '</div>\
            <img src="' + item.image + '" width="107" />\
            ' + item.description + '\
            <div class="author">&ndash; Av ' + item.creator + date + '</div>\
          </div>\
        </div>';
        return $('#news ' + column).append(htmlItem);
      }
    });
    ls[viewedListName] = JSON.stringify(viewedList);
    Browser.setBadgeText('');
    ls[unreadCountName] = 0;
    $('.item').click(function() {
      var altLink, useAltLink;
      altLink = $(this).attr('name');
      useAltLink = Affiliation.org[ls.affiliationKey1].useAltLink;
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
          if ($('.item[data="' + link + '"] img').attr('src').indexOf('http') === -1) {
            return $('.item[data="' + link + '"] img').attr('src', image);
          }
        });
      }
    }
    if (Affiliation.org[feedKey].getImages !== void 0) {
      return Affiliation.org[feedKey].getImages(viewedList, function(links, images) {
        var _results;
        _results = [];
        for (index in links) {
          if ($('.item[data="' + links[index] + '"] img').attr('src').indexOf('http') === -1) {
            _results.push($('.item[data="' + links[index] + '"] img').attr('src', images[index]));
          } else {
            _results.push(void 0);
          }
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

  officeFontRotate = function(font) {
    var chosenFont, fonts;
    fonts = ['fondamento', 'mysteryquest', 'oleoscript', 'sancreek'];
    if (__indexOf.call(fonts, font) >= 0) {
      chosenFont = font;
    } else {
      chosenFont = fonts[Math.floor(Math.random() * fonts.length)];
    }
    $('#office #status #text').prop('class', chosenFont);
    if (DEBUG) {
      return $('#office #subtext').html(ls.infoscreenOfficeStatusMessage + '<br />' + chosenFont);
    }
  };

  changeCreatorName = function(name) {
    clearTimeout(ls.changeCreatorNameTimeoutId);
    return animateCreatorName(name);
  };

  animateCreatorName = function(name, build) {
    var random, text;
    text = $('#pagefliptyping').text();
    if (text.length === 0) {
      build = true;
      name = name + " with <3";
    }
    random = Math.floor(350 * Math.random() + 50);
    if (!build) {
      $('#pagefliptyping').text(text.slice(0, text.length - 1));
      return ls.animateCreatorNameTimeoutId = setTimeout((function() {
        return animateCreatorName(name);
      }), random);
    } else {
      if (text.length !== name.length) {
        if (text.length === 0) {
          $('#pagefliptyping').text(name.slice(0, 1));
        } else {
          $('#pagefliptyping').text(name.slice(0, text.length + 1));
        }
        return ls.animateCreatorNameTimeoutId = setTimeout((function() {
          return animateCreatorName(name, true);
        }), random);
      }
    }
  };

  $(function() {
    var icon, key, logo, placeholder, sponsor;
    if (DEBUG) {
      $('html').css('cursor', 'auto');
      $('#container').css('overflow-y', 'auto');
      $('body').on('keypress', function(e) {
        if (e.which === 13) {
          $('#overlay').toggle();
          $('#fadeOutNews').toggle();
          $('#logo').toggle();
          $('#pageflip').toggle();
        }
        if (e.which === 32) {
          e.preventDefault();
          switch (ls.infoscreenOfficeStatus) {
            case 'waffle':
              return updateOffice('error');
            case 'error':
              return updateOffice('open');
            case 'open':
              return updateOffice('closed');
            case 'closed':
              return updateOffice('meeting');
            case 'meeting':
              return updateOffice('bun');
            case 'bun':
              return updateOffice('cake');
            case 'cake':
              return updateOffice('coffee');
            case 'coffee':
              return updateOffice('pizza');
            case 'pizza':
              return updateOffice('taco');
            case 'taco':
              return updateOffice('waffle');
            default:
              return updateOffice('error');
          }
        }
      });
    }
    $.ajaxSetup(AJAX_SETUP);
    ls.removeItem('infoscreenOfficeStatus');
    ls.removeItem('infoscreenOfficeStatusMessage');
    if (ls.showAffiliation2 !== 'true') {
      $('#news #right').hide();
      $('#news #left').attr('id', 'full');
      Analytics.trackEvent('loadSingleAffiliation', ls.affiliationKey1);
      Analytics.trackEvent('loadAffiliation1', ls.affiliationKey1);
    } else {
      Analytics.trackEvent('loadDoubleAffiliation', ls.affiliationKey1 + ' - ' + ls.affiliationKey2);
      Analytics.trackEvent('loadAffiliation1', ls.affiliationKey1);
      Analytics.trackEvent('loadAffiliation2', ls.affiliationKey2);
    }
    if (ls.showOffice !== 'true') {
      $('#office').hide();
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
    key = ls.affiliationKey1;
    logo = Affiliation.org[key].logo;
    icon = Affiliation.org[key].icon;
    placeholder = Affiliation.org[key].placeholder;
    sponsor = Affiliation.org[key].sponsor;
    if (sponsor !== void 0) {
      $('#logo').prop('src', sponsor);
    } else {
      $('#logo').prop('src', logo);
    }
    $('link[rel="shortcut icon"]').attr('href', icon);
    $('#news .post img').attr('src', placeholder);
    Analytics.trackEvent('loadPalette', ls.affiliationPalette);
    if (OPERATING_SYSTEM === 'Windows') {
      $('#pfText').attr("style", "bottom:9px;");
      $('#pfLink').attr("style", "bottom:9px;");
    }
    changeCreatorName(ls.extensionCreator);
    setInterval((function() {
      return $(".pageflipcursor").animate({
        opacity: 0
      }, "fast", "swing", function() {
        return $(this).animate({
          opacity: 1
        }, "fast", "swing");
      });
    }), 600);
    officeFontRotate();
    setInterval((function() {
      return officeFontRotate();
    }), 1800000);
    setInterval((function() {
      var hours, minutes, _d;
      _d = new Date();
      minutes = _d.getMinutes();
      hours = _d.getHours();
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (hours < 10) {
        hours = '0' + hours;
      }
      $("#bus #clock #minutes").html(minutes);
      return $("#bus #clock #hours").html(hours);
    }), 1000);
    setInterval((function() {
      var linebreaks, num, random;
      random = Math.ceil(Math.random() * 25);
      linebreaks = ((function() {
        var _i, _results;
        _results = [];
        for (num = _i = 0; 0 <= random ? _i <= random : _i >= random; num = 0 <= random ? ++_i : --_i) {
          _results.push('<br />');
        }
        return _results;
      })()).join(' ');
      $('#overlay').html(linebreaks + 'preventing image burn-in...');
      $('#overlay').css('opacity', 1);
      return setTimeout((function() {
        return $('#overlay').css('opacity', 0);
      }), 3500);
    }), 1800000);
    return mainLoop();
  });

}).call(this);
