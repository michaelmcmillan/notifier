// Generated by CoffeeScript 1.3.3
(function() {
  var $, bindBusFields, bindSuggestions, displayOnPageNotification, fadeInCanvas, getDirections, getLines, loadBus, ls, pageFlipCursorBlinking, resizeBackgroundImage, revertInfoscreen, saveBus, testDesktopNotification, toggleInfoscreen, updateOfficeStatus,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  ls = localStorage;

  resizeBackgroundImage = function() {
    if (1550 < $(window).width()) {
      return $('#background').attr("style", "background:url('img/background-large.png') center center no-repeat;");
    } else if (1200 < $(window).height()) {
      return $('#background').attr("style", "background:url('img/background-large-vertical.png') center center no-repeat;");
    } else {
      return $('#background').attr("style", "background:url('img/background-medium.png') center center no-repeat;");
    }
  };

  displayOnPageNotification = function() {
    $("#notification").fadeIn(200);
    return setTimeout((function() {
      return $("#notification").fadeOut(200);
    }), 800);
  };

  pageFlipCursorBlinking = function() {
    return $(".pageflipcursor").animate({
      opacity: 0
    }, "fast", "swing", function() {
      return $(this).animate({
        opacity: 1
      }, "fast", "swing");
    });
  };

  updateOfficeStatus = function() {
    return Office.get(function(status, title, message) {
      chrome.browserAction.setIcon({
        path: 'img/icon-' + status + '.png'
      });
      ls.currentStatus = status;
      return Office.getTodaysEvents(function(meetingPlan) {
        var today;
        meetingPlan = $.trim(meetingPlan);
        today = '### Nå\n' + title + ": " + message + "\n\n### Resten av dagen\n" + meetingPlan;
        chrome.browserAction.setTitle({
          title: today
        });
        return ls.currentStatusMessage = message;
      });
    });
  };

  testDesktopNotification = function() {
    var notification;
    notification = webkitNotifications.createHTMLNotification('notification.html');
    return notification.show();
  };

  bindBusFields = function(busField) {
    var cssSelector, direction, fadeTime, lines, stop;
    cssSelector = '#' + busField;
    if (DEBUG) {
      console.log('Binding bus fields for ' + cssSelector);
    }
    fadeTime = 50;
    stop = $(cssSelector + ' input');
    direction = $(cssSelector + ' select');
    lines = $(cssSelector + ' .lines .line');
    loadBus(busField);
    $(stop).focus(function() {
      if (DEBUG) {
        console.log('focus - clear field and show saved value as placeholder');
      }
      ls.busStopClickedAway = ls[busField + '_name'];
      $(stop).val('');
      return $(stop).attr('placeholder', ls.busStopClickedAway);
    });
    $(stop).focusout(function() {
      var correctStop, partialStop, suggestions;
      partialStop = $(stop).val();
      suggestions = Bus.getPotentialStops(partialStop);
      if (partialStop === '' || suggestions.length === 0) {
        if (DEBUG) {
          console.log('focusout - empty field or invalid input, return to last saved value');
        }
        if (ls.busStopClickedAway !== null) {
          $(stop).val(ls.busStopClickedAway);
        }
        return $('#bus_suggestions').html('');
      } else if (suggestions.length === 1) {
        if (DEBUG) {
          console.log('focusout - 1 suggestion, save it');
        }
        correctStop = suggestions[0];
        $(stop).val(correctStop);
        $('#bus_suggestions').html('');
        getDirections(busField, correctStop);
        getLines(busField);
        return saveBus(busField);
      } else if (suggestions.length > 1) {
        if (DEBUG) {
          console.log('focusout - several suggestions, remove them');
        }
        return setTimeout((function() {
          return $('#bus_suggestions .suggestion').fadeOut(function() {
            return $('#bus_suggestions').html('');
          });
        }), 5000);
      } else {
        if (DEBUG) {
          return console.log('focusout - nothing to do');
        }
      }
    });
    $(stop).keyup(function(event) {
      var correctStop, i, nameStart, possibleStop, realStopName, suggestion, suggestions, _ref, _ref1, _text;
      if ((_ref = event.keyCode, __indexOf.call([37, 38, 39, 40], _ref) >= 0) || (_ref1 = event.keyCode, __indexOf.call([17, 18], _ref1) >= 0) || event.keyCode === 91) {
        if (DEBUG) {
          return console.log('keyup - arrow key or function key, do nothing');
        }
      } else if (event.keyCode === 13) {
        if (DEBUG) {
          console.log('keyup - enter, checking input');
        }
        possibleStop = $(stop).val();
        suggestions = Bus.getStopIds(possibleStop);
        if (suggestions.length !== 0) {
          realStopName = Bus.getStopName(suggestions[0]);
          $(stop).val(realStopName);
          $('#bus_suggestions').html('');
          suggestion = $('<div class="correct">' + realStopName + '</div>').hide();
          $('#bus_suggestions').append(suggestion);
          $(suggestion).fadeIn();
          setTimeout((function() {
            $('#bus_suggestions .correct').fadeOut(fadeTime);
            return setTimeout((function() {
              return $('#bus_suggestions').html('');
            }), 300);
          }), 1200);
          getDirections(busField, realStopName);
          getLines(busField);
          return saveBus(busField);
        }
      } else {
        if (DEBUG) {
          console.log('keyup - getting suggestions');
        }
        ls.busInFocus = $(stop).parent().attr('id');
        nameStart = $(stop).val();
        if (nameStart.length > 0) {
          suggestions = Bus.getPotentialStops(nameStart);
          $('#bus_suggestions').html('');
          for (i in suggestions) {
            _text = suggestions[i];
            suggestion = $('<div class="suggestion">' + _text + '</div>').hide();
            $('#bus_suggestions').append(suggestion);
            $(suggestion).fadeIn();
          }
          if (suggestions.length === 1) {
            correctStop = suggestions[0];
            $(stop).val(correctStop);
            $(stop).blur();
            $('#bus_suggestions').html('');
            suggestion = $('<div class="correct">' + correctStop + '</div>').hide();
            $('#bus_suggestions').append(suggestion);
            $(suggestion).fadeIn();
            setTimeout((function() {
              $('#bus_suggestions .correct').fadeOut(fadeTime);
              return setTimeout((function() {
                return $('#bus_suggestions').html('');
              }), 300);
            }), 1200);
            getDirections(busField, correctStop);
            getLines(busField);
            saveBus(busField);
          }
        } else {
          $('#bus_suggestions .suggestion').fadeOut(fadeTime, function() {
            return $('#bus_suggestions').html('');
          });
        }
        return bindSuggestions();
      }
    });
    $(direction).change(function() {
      return saveBus(busField);
    });
    return $(lines).click(function() {
      return console.log(this);
    });
  };

  getDirections = function(busField, correctStop) {
    var allDirections, cssSelector, direction, i, stopName, _i, _len, _results;
    cssSelector = '#' + busField;
    stopName = $(cssSelector + ' input');
    direction = $(cssSelector + ' select');
    allDirections = Bus.getDirections(correctStop);
    $(direction).html('');
    _results = [];
    for (_i = 0, _len = allDirections.length; _i < _len; _i++) {
      i = allDirections[_i];
      _results.push($(direction).append('<option>' + i + '</option>'));
    }
    return _results;
  };

  getLines = function(busField) {
    var busStopId, cssSelector, direction, lines, stopName;
    cssSelector = '#' + busField;
    $(cssSelector + ' .lines').html('<img class="loading_left" src="img/loading.gif" />');
    stopName = $(cssSelector + ' input').val();
    direction = $(cssSelector + ' select').val();
    busStopId = Bus.getStop(stopName, direction);
    busStopId = Bus.getStop(stopName, direction);
    return lines = Bus.getStopLines(busStopId, function(json) {
      var arrayOfLines, item, line, _i, _j, _len, _len1, _ref, _results;
      arrayOfLines = [];
      _ref = json.lines;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (-1 === arrayOfLines.indexOf(String(item.line))) {
          arrayOfLines.push(item.line);
        }
      }
      arrayOfLines = arrayOfLines.sort();
      arrayOfLines = arrayOfLines.reverse();
      $(cssSelector + ' .lines').html('');
      _results = [];
      for (_j = 0, _len1 = arrayOfLines.length; _j < _len1; _j++) {
        line = arrayOfLines[_j];
        _results.push($(cssSelector + ' .lines').append('<span class="active">' + line + '</span>&nbsp;&nbsp;'));
      }
      return _results;
    });
  };

  saveBus = function(busField) {
    var activeLines, busStopId, cssSelector, direction, inactiveLines, stopName;
    cssSelector = '#' + busField;
    stopName = $(cssSelector + ' input').val();
    direction = $(cssSelector + ' select').val();
    busStopId = Bus.getStop(stopName, direction);
    activeLines = [];
    $(cssSelector + ' .lines .active').each(function() {
      return activeLines.push($(this).text());
    });
    inactiveLines = [];
    $(cssSelector + ' .lines .inactive').each(function() {
      return inactiveLines.push($(this).text());
    });
    ls[busField] = busStopId;
    ls[busField + '_name'] = stopName;
    ls[busField + '_direction'] = direction;
    ls[busField + '_active_lines'] = activeLines;
    ls[busField + '_inactive_lines'] = inactiveLines;
    if (DEBUG) {
      alert('activeLines', activeLines);
    }
    if (DEBUG) {
      alert('inactiveLines', inactiveLines);
    }
    displayOnPageNotification();
    if (DEBUG) {
      return console.log('saved http://api.visuweb.no/bybussen/1.0/Departure/Realtime/' + busStopId + '/f6975f3c1a3d838dc69724b9445b3466');
    }
  };

  loadBus = function(busField) {
    var activeLines, cssSelector, direction, inactiveLines, line, lines, stopName, _i, _j, _len, _len1;
    cssSelector = '#' + busField;
    stopName = ls[busField + '_name'];
    direction = ls[busField + '_direction'];
    activeLines = ls[busField + '_active_lines'];
    inactiveLines = ls[busField + '_inactive_lines'];
    if (stopName !== void 0 && direction !== void 0) {
      $(cssSelector + ' input').val(stopName);
      $(cssSelector + ' select').val(direction);
      if (DEBUG) {
        console.log('loaded ' + stopName + ' to ' + busField);
      }
    }
    if (activeLines !== void 0 && inactiveLines !== void 0) {
      lines = {};
      for (_i = 0, _len = activeLines.length; _i < _len; _i++) {
        line = activeLines[_i];
        lines[line] = true;
      }
      for (_j = 0, _len1 = inactiveLines.length; _j < _len1; _j++) {
        line = inactiveLines[_j];
        lines[line] = false;
      }
      return alert('all lines for ', cssSelector, lines);
    }
  };

  bindSuggestions = function() {
    return $('.suggestion').click(function() {
      var text;
      if (ls.busInFocus !== void 0) {
        text = $(this).text();
        $('#' + ls.busInFocus + ' input').val(text);
        getDirections(ls.busInFocus, text);
        getLines(ls.busInFocus);
        saveBus(ls.busInFocus);
        return $('#bus_suggestions .suggestion').fadeOut(50, function() {
          return $('#bus_suggestions').html('');
        });
      }
    });
  };

  toggleInfoscreen = function(activate, force) {
    var id, speed;
    speed = 400;
    id = 'useInfoscreen';
    if (activate) {
      $('#' + id).attr('checked', false);
      $('#logo_subtext').fadeOut();
      return $('#container #left').animate({
        'width': '0pt'
      }, speed, function() {
        $('#container #left').hide();
        return $('#infoscreen_slider').slideUp(speed, function() {
          return $('#infoscreen_preview').fadeIn(speed, function() {
            $('#logo_subtext').html('infoscreen&nbsp;&nbsp;&nbsp;&nbsp;');
            return $('#logo_subtext').fadeIn(function() {
              $('header #logo_subtext').animate({
                'margin-left': '265pt'
              }, speed);
              $('header #logo').animate({
                'margin-left': '75pt'
              }, speed);
              $('#container #right').animate({
                'margin-left': '180pt'
              }, speed);
              $('header').animate({
                'top': '40%'
              }, speed);
              return $('#container').animate({
                'top': '40%'
              }, speed, function() {
                if (force || confirm('Sikker på at du vil skru på Online Infoscreen?\n\n- Krever full-HD skjerm som står på høykant\n- Popup-knappen åpner Infoskjerm i stedet\n- Infoskjermen skjuler musepekeren\n- Infoskjermen åpnes hver gang Chrome starter\n- Infoskjermen åpnes nå!')) {
                  ls[id] = 'true';
                  $('#' + id).attr('checked', true);
                  chrome.browserAction.setIcon({
                    path: 'img/icon-default.png'
                  });
                  chrome.browserAction.setTitle({
                    title: 'Online Infoscreen'
                  });
                  chrome.browserAction.setBadgeText({
                    text: ''
                  });
                  if (!force) {
                    return chrome.tabs.create({
                      url: chrome.extension.getURL("infoscreen.html"),
                      selected: false
                    });
                  }
                } else {
                  return revertInfoscreen();
                }
              });
            });
          });
        });
      });
    } else {
      ls[id] = 'false';
      updateOfficeStatus();
      return revertInfoscreen();
    }
  };

  revertInfoscreen = function() {
    var speed;
    speed = 300;
    return $('#logo_subtext').fadeOut(speed, function() {
      $('#container').animate({
        'top': '50%'
      }, speed);
      $('header').animate({
        'top': '50%'
      }, speed);
      $('#container #right').animate({
        'margin-left': '0'
      }, speed);
      $('header #logo_subtext').animate({
        'margin-left': '215pt'
      }, speed);
      return $('header #logo').animate({
        'margin-left': '25pt'
      }, speed, function() {
        return $('#infoscreen_preview').fadeOut(speed, function() {
          return $('#infoscreen_slider').slideDown(speed, function() {
            $('#container #left').show();
            return $('#container #left').animate({
              'width': '54%'
            }, speed, function() {
              $('#logo_subtext').html('notifier options');
              return $('#logo_subtext').fadeIn();
            });
          });
        });
      });
    });
  };

  fadeInCanvas = function() {
    webGLStart();
    return $('#LessonCanvas').animate({
      opacity: 1
    }, 1300, 'swing', function() {
      return setTimeout((function() {
        return $('#LessonCanvas').animate({
          opacity: 0
        }, 1300, 'swing');
      }), 200);
    });
  };

  $(function() {
    if (DEBUG) {
      less.watch();
    }
    if (DEBUG) {
      $('#debug_links').show();
    }
    $('input:checkbox').each(function(index, element) {
      if (ls[element.id] === 'true') {
        return element.checked = true;
      }
    });
    if (ls.useInfoscreen === 'true') {
      setTimeout((function() {
        return toggleInfoscreen(true, true);
      }), 300);
    }
    $(window).bind("resize", resizeBackgroundImage);
    resizeBackgroundImage();
    if (OPERATING_SYSTEM === 'Windows') {
      $('#pagefliptext').attr("style", "bottom:9px;");
      $('#pagefliplink').attr("style", "bottom:9px;");
    }
    setInterval((function() {
      return pageFlipCursorBlinking();
    }), 600);
    setTimeout((function() {
      return $('#plusonebutton').fadeIn(150);
    }), 1100);
    bindBusFields('first_bus');
    bindBusFields('second_bus');
    return $('input:checkbox').click(function() {
      if (this.id === 'useInfoscreen') {
        return toggleInfoscreen(this.checked);
      } else {
        ls[this.id] = this.checked;
        if (this.id === 'showOffice' && this.checked === false) {
          chrome.browserAction.setIcon({
            path: 'img/icon-default.png'
          });
          chrome.browserAction.setTitle({
            title: EXTENSION_NAME
          });
        } else if (this.id === 'showOffice' && this.checked === true) {
          updateOfficeStatus();
        }
        if (this.id === 'showNotifications' && this.checked === true) {
          testDesktopNotification();
        }
        return displayOnPageNotification();
      }
    });
  });

}).call(this);
