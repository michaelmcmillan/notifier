var Office = {
  debug: 1,
  debugStatus: {enabled: 1, data: 'cake\nKake på kontoret!'},

  // Light limit, 0-860 is ON, 860-1023 is OFF
  lightLimit: 860,
  // Basic statuses have titles and messages (icons are fetched from affiliation)
  statuses: {
    'error': {title: 'Oops', message: 'Klarte ikke hente kontorstatus'},
    'open': {title: 'Åpent', message: 'Gratis kaffe og te til alle!'},
    'closed': {title: 'Lukket', message: 'Finn et komitemedlem for å åpne opp.'},
    'meeting': {title: 'Møte', message: 'Kontoret er opptatt'}, // titled meetings get names from calendar entries
  },
  // Food statuses have titles and icons (messages exist as calendar titles)
  foods: {
    'bun': {title: 'Boller', icon: './img/icon-bun.png'},
    'cake': {title: 'Kake', icon: './img/icon-cake.png'},
    'coffee': {title: 'Kaffekos', icon: './img/icon-coffee.png'},
    'pizza': {title: 'Pizza', icon: './img/icon-pizza.png'},
    'waffle': {title: 'Vafler', icon: './img/icon-waffle.png'},
  },

  get: function(callback) {
    if (callback == undefined) {
      console.log('ERROR: Callback is required. In the callback you should insert the results into the DOM.');
      return;
    }

    var self = this;
    this.getEventData( function(status, title, message) {
      
      // If no events are active we'll have to check the lights as well
      if (status == 'free') {
        self.getLightData(callback);
      }
      else {
        // status: "closed"
        // title: "Lukket"
        // message: "Finn et komitemedlem for å åpne opp"
        if (self.debug) console.log('Office:\n- status is', status, '\n- title is', title, '\n- message is', message);
        callback(status, title, message);
      }
    });
  },

  getEventData: function(callback) {
    if (callback == undefined) {
      console.log('ERROR: Callback is required. In the callback you should insert the results into the DOM.');
      return;
    }

    var eventApi = Affiliation.org[localStorage.affiliationKey1].eventApi;
    
    // Receives info on current event from Onlines servers (without comments)
    // meeting        // current status
    // Møte: dotKom   // event title or 'No title'-meeting or nothing
    var self = this;
    Ajaxer.getPlainText({
      url: eventApi,
      success: function(data) {

        // Debug particular status?
        if (self.debug && self.debugStatus.enabled) {
          data = self.debugStatus.data;
        }

        var status = data.split('\n',2)[0]; // 'meeting'
        var title = data.split('\n',2)[1]; // 'Arbeidskveld med arrKom'

        // empty meeting title?
        if (status == 'meeting' && title == '')
          title = self.statuses['meeting'].message;

        // Temporary support for the old system, backwards compatibility
        if (isNumber(status)) {
          switch(Number(status)) {
            case 0: callback('free'); break;
            case 1: callback('meeting', self.statuses['meeting'].title, title); break;
            case 2: callback('waffle', self.foods.waffle.title, title); break;
            case 3:
            default: callback('error', self.statuses['error'].title, self.statuses['error'].message);
          }
        }

        // set the status from fetched data
        switch(status) {
          
          case 'free': callback('free'); break;

          case 'meeting': callback('meeting', self.statuses['meeting'].title, title); break;
          
          case 'bun': callback('bun', self.foods.bun.title, title); break;
          case 'cake': callback('cake', self.foods.cake.title, title); break;
          case 'coffee': callback('coffee', self.foods.coffee.title, title); break;
          case 'waffle': callback('waffle', self.foods.waffle.title, title); break;
          case 'pizza': callback('pizza', self.foods.pizza.title, title); break;
          
          case 'error':
          default: callback('error', self.statuses['error'].title, self.statuses['error'].message);
        }
      },
      error: function(jqXHR, text, err) {
        if (self.debug) console.log('ERROR: Failed to get event data.');
        callback('error', self.statuses['error'].title, self.statuses['error'].message);
      },
    });
  },

  getLightData: function(callback) {
    if (callback == undefined) {
      console.log('ERROR: Callback is required. In the callback you should insert the results into the DOM.');
      return;
    }

    var lightApi = Affiliation.org[localStorage.affiliationKey1].lightApi;

    // Receives current light intensity from the office: OFF 0-lightLimit-1023 ON
    var self = this;
    Ajaxer.getPlainText({
      url: lightApi,
      success: function(data) {
        if (data > self.lightLimit) {
          if (self.debug) console.log('Office:\n- status is closed\n- title is', self.statuses['closed'].title, '\n- message is', self.statuses['closed'].message);
          callback('closed', self.statuses['closed'].title, self.statuses['closed'].message);
        }
        else {
          if (self.debug) console.log('Office:\n- status is open\n- title is', self.statuses['open'].title, '\n- message is', self.statuses['open'].message);
          callback('open', self.statuses['open'].title, self.statuses['open'].message);
        }
      },
      error: function(jqXHR, err) {
        if (self.debug) console.log('ERROR: Failed to get light data.');
        callback('error', self.statuses['error'].title, self.statuses['error'].message);
      },
    });
  },

}
