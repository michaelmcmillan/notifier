var Affiliation = {
  debug: 0,
  
  // IMPORTANT: Keep the same order here as in options.html and in manifest.json
  org: {
    // Linjeforeninger Gløshaugen
    'berg': {
      'name': 'Bergstuderendes Forening',
      'feed': 'http://bergstud.no/feed/',
      'logo': '/org/berg/logo.png',
      'symbol': '/org/berg/symbol.png',
      'placeholder': '/org/berg/placeholder.png',
      'color': 'grey',
    },
    'delta': {
      'name': 'Delta',
      'feed': 'http://org.ntnu.no/delta/wp/?feed=rss2',
      'logo': '/org/delta/logo.png',
      'symbol': '/org/delta/symbol.png',
      'placeholder': '/org/delta/placeholder.png',
      'color': 'green',
    },
    'emil': {
      'name': 'Emil',
      'feed': 'http://emilweb.no/feed/',
      'logo': '/org/emil/logo.png',
      'symbol': '/org/emil/symbol.png',
      'placeholder': '/org/emil/placeholder.png',
      'color': 'green',
    },
    'leonardo': {
      'name': 'Leonardo',
      'feed': 'http://industrielldesign.com/feed',
      'logo': '/org/leonardo/logo.png',
      'symbol': '/org/leonardo/symbol.png',
      'placeholder': '/org/leonardo/placeholder.png',
      'color': 'cyan',
    },
    'online': {
      'name': 'Online',
      'feed': 'https://online.ntnu.no/feeds/news/',
      'logo': '/org/online/logo.png',
      'symbol': '/org/online/symbol.png',
      'placeholder': '/org/online/placeholder.png',
      'color': 'blue',
    },
    'nabla': {
      'name': 'Nabla',
      'feed': 'http://nabla.no/feed/',
      'logo': '/org/nabla/logo.png',
      'symbol': '/org/nabla/symbol.png',
      'placeholder': '/org/nabla/placeholder.png',
      'color': 'red',
    },
    'spanskrøret': {
      'name': 'Spanskrøret',
      'feed': 'http://spanskroret.no/feed/',
      'logo': '/org/spanskrøret/logo.png',
      'symbol': '/org/spanskrøret/symbol.png',
      'placeholder': '/org/spanskrøret/placeholder.png',
      'color': 'grey',
    },
    'volvox': {
      'name': 'Volvox & Alkymisten',
      'feed': 'http://org.ntnu.no/volvox/feed/',
      'logo': '/org/volvox/logo.png',
      'symbol': '/org/volvox/symbol.png',
      'placeholder': '/org/volvox/placeholder.png',
      'color': 'green',
    },

    // Linjeforeninger Dragvoll
    'dionysos': {
      'name': 'Dionysos',
      'feed': 'http://dionysosntnu.wordpress.com/feed/',
      'logo': '/org/dionysos/logo.png',
      'symbol': '/org/dionysos/symbol.png',
      'placeholder': '/org/dionysos/placeholder.png',
      'color': 'grey',
    },
    'erudio': {
      'name': 'Erudio',
      'feed': 'http://www.erudiontnu.org/?feed=rss2',
      'logo': '/org/erudio/logo.png',
      'symbol': '/org/erudio/symbol.png',
      'placeholder': '/org/erudio/placeholder.png',
      'color': 'red',
    },
    'geolf': {
      'name': 'Geolf',
      'feed': 'http://geolf.org/feed/',
      'logo': '/org/geolf/logo.png',
      'symbol': '/org/geolf/symbol.png',
      'placeholder': '/org/geolf/placeholder.png',
      'color': 'blue',
    },
    'gengangere': {
      'name': 'Gengangere',
      'feed': 'http://www.gengangere.no/feed/',
      'logo': '/org/gengangere/logo.png',
      'symbol': '/org/gengangere/symbol.png',
      'placeholder': '/org/gengangere/placeholder.png',
      'color': 'grey',
    },
    'jump cut': {
      'name': 'Jump Cut',
      'feed': 'http://jumpcutdragvoll.wordpress.com/feed/',
      'logo': '/org/jump cut/logo.png',
      'symbol': '/org/jump cut/symbol.png',
      'placeholder': '/org/jump cut/placeholder.png',
      'color': 'grey',
    },
    'ludimus': {
      'name': 'Ludimus',
      'feed': 'http://ludimus.org/feed/',
      'logo': '/org/ludimus/logo.png',
      'symbol': '/org/ludimus/symbol.png',
      'placeholder': '/org/ludimus/placeholder.png',
      'color': 'red',
    },
    'primetime': {
      'name': 'Primetime',
      'feed': 'http://www.primetime.trondheim.no/feed/',
      'logo': '/org/primetime/logo.png',
      'symbol': '/org/primetime/symbol.png',
      'placeholder': '/org/primetime/placeholder.png',
      'color': 'cyan',
    },
    'sturm und drang': {
      'name': 'Sturm Und Drang',
      'feed': 'http://www.sturm.ntnu.no/wordpress/?feed=rss2',
      'logo': '/org/sturm und drang/logo.png',
      'symbol': '/org/sturm und drang/symbol.png',
      'placeholder': '/org/sturm und drang/placeholder.png',
      'color': 'red',
    },

    // Linjeforeninger HiST/DMMH/TJSF/BI
    'fraktur': {
      'name': 'Fraktur',
      'feed': 'http://www.fraktur.no/feed/',
      'logo': '/org/fraktur/logo.png',
      'symbol': '/org/fraktur/symbol.png',
      'placeholder': '/org/fraktur/placeholder.png',
      'color': 'cyan',
    },
    'kom': {
      'name': 'KOM',
      'feed': 'http://kjemiogmaterial.wordpress.com/feed/',
      'logo': '/org/kom/logo.png',
      'symbol': '/org/kom/symbol.png',
      'placeholder': '/org/kom/placeholder.png',
      'color': 'cyan',
    },
    'logistikkstudentene': {
      'name': 'Logistikkstudentene',
      'feed': 'http://www.logistikkstudentene.no/?feed=rss2',
      'logo': '/org/logistikkstudentene/logo.png',
      'symbol': '/org/logistikkstudentene/symbol.png',
      'placeholder': '/org/logistikkstudentene/placeholder.png',
      'color': 'cyan',
    },
    'tihlde': {
      'name': 'TIHLDE',
      'feed': 'http://tihlde.org/feed/',
      'logo': '/org/tihlde/logo.png',
      'symbol': '/org/tihlde/symbol.png',
      'placeholder': '/org/tihlde/placeholder.png',
      'color': 'blue',
    },
    'tim og shænko': {
      'name': 'Tim & Shænko',
      'feed': 'http://bygging.no/feed/',
      'logo': '/org/tim og shænko/logo.png',
      'symbol': '/org/tim og shænko/symbol.png',
      'placeholder': '/org/tim og shænko/placeholder.png',
      'color': 'blue',
    },
    'tjsf': {
      'name': 'TJSF',
      'feed': 'http://tjsf.no/feed/',
      'logo': '/org/tjsf/logo.png',
      'symbol': '/org/tjsf/symbol.png',
      'placeholder': '/org/tjsf/placeholder.png',
      'color': 'grey',
    },

    // Studentmedier
    'dusken': {
      'name': 'Dusken.no',
      'feed': 'http://dusken.no/feed/',
      'logo': '/org/dusken/logo.png',
      'symbol': '/org/dusken/symbol.png',
      'placeholder': '/org/dusken/placeholder.png',
      'color': 'grå',
    },
    'universitetsavisa': {
      'name': 'Universitetsavisa',
      'feed': 'http://www.universitetsavisa.no/?service=rss',
      'logo': '/org/universitetsavisa/logo.png',
      'symbol': '/org/universitetsavisa/symbol.png',
      'placeholder': '/org/universitetsavisa/placeholder.png',
      'color': 'cyan',
    },

    // Store studentorganisasjoner
    'samfundet': {
      'name': 'Studentersamfundet',
      'feed': 'http://www.samfundet.no/arrangement/rss',
      'logo': '/org/samfundet/logo.png',
      'symbol': '/org/samfundet/symbol.png',
      'placeholder': '/org/samfundet/placeholder.png',
      'color': 'red',
    },

    // Studentdemokrati
    'velferdstinget': {
      'name': 'Velferdstinget',
      'feed': 'http://www.velferdstinget.no/feed/rss/',
      'logo': '/org/velferdstinget/logo.png',
      'symbol': '/org/velferdstinget/symbol.png',
      'placeholder': '/org/velferdstinget/placeholder.png',
      'color': 'cyan',
    },
    'studenttinget ntnu': {
      'name': 'Studenttinget NTNU',
      'feed': 'http://www.studenttinget.no/feed/',
      'logo': '/org/studenttinget ntnu/logo.png',
      'symbol': '/org/studenttinget ntnu/symbol.png',
      'placeholder': '/org/studenttinget ntnu/placeholder.png',
      'color': 'red',
    },
    'studentparlamentet hist': {
      'name': 'Studentparlamentet HiST',
      'feed': 'http://studentparlamentet.com/?feed=rss2',
      'logo': '/org/studentparlamentet hist/logo.png',
      'symbol': '/org/studentparlamentet hist/symbol.png',
      'placeholder': '/org/studentparlamentet hist/placeholder.png',
      'color': 'blue',
    },
    
    // Institusjoner
    'ntnu': {
      'name': 'NTNU',
      'feed': 'https://www.retriever-info.com/feed/2002900/generell_arkiv166/index.xml',
      'logo': '/org/ntnu/logo.png',
      'symbol': '/org/ntnu/symbol.png',
      'placeholder': '/org/ntnu/placeholder.png',
      'color': 'blue',
    },
    'rektoratet ntnu': {
      'name': 'Rektoratet NTNU',
      'feed': 'http://www.ntnu.no/blogger/rektoratet/feed/',
      'logo': '/org/rektoratet ntnu/logo.png',
      'symbol': '/org/rektoratet ntnu/symbol.png',
      'placeholder': '/org/rektoratet ntnu/placeholder.png',
      'color': 'blue',
    },
    'hist': {
      'name': 'HiST',
      'feed': 'http://hist.no/rss.ap?thisId=1393',
      'logo': '/org/hist/logo.png',
      'symbol': '/org/hist/symbol.png',
      'placeholder': '/org/hist/placeholder.png',
      'color': 'blue',
    },
    'dmmh': {
      'name': 'DMMH',
      'feed': 'http://www.dmmh.no/rss.php?type=site&id=10&location=393',
      'logo': '/org/dmmh/logo.png',
      'symbol': '/org/dmmh/symbol.png',
      'placeholder': '/org/dmmh/placeholder.png',
      'color': 'red',
    },
  },

  // Organization specific functions

  online_getImage: function(link, callback) {
    var id = link.split('/')[4]; // id is stored in the link
    var image = 'undefined';
    var api = 'https://online.ntnu.no/api/f5be90e5ec1d2d454ae9/news_image_by_id/';
    var self = this;
    $.getJSON(api + id, function(json) {
      if (json['online_news_image']) {
        image = json['online_news_image']['0']['image'];
        callback(link, image);
      }
      else {
        image = this.images['online'].image;
        if (self.debug) console.log('ERROR: no image exists for id: ' + id);
        callback(link, image);
      }
    })
    .error(function() {
      image = self.images['online'].image;
      if (self.debug) console.log('ERROR: couldn\'t connect API to get image links, returning default image');
      callback(link, image);
    });
  },

}