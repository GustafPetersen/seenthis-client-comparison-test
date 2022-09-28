var stringData = document.getElementsByTagName('hoxton')[0].getAttribute("data");
try {
  stringData = atob(stringData);
} catch (err) {} // not encoded no problem
var hoxton = {};
var videoTrackingModule;
hoxton.data = JSON.parse(stringData);
switch (hoxton.data.platform) {
  case 'sizmek':
    hoxton.init = function() {
      console.log("|| Hoxton: Init");
      console.log("|| Hoxton: Platform: Sizmek");
      if (!EB.isInitialized()) {
        EB.addEventListener(EBG.EventName.EB_INITIALIZED, Creative.init());
      } else {
        Creative.init();
      }
    }
    hoxton.exit = function(exitName) {
      exitName = exitName
        ? exitName
        : '';
      EB.clickthrough(exitName);
      console.log("|| Hoxton: Sizmek - Click Through");
    };
    hoxton.trackVideo = function(element) {
      try {
        videoTrackingModule = new EBG.VideoModule(element);
      } catch (error) {}
    }
    break;
  case 'doubleclick':
    hoxton.init = function() {
      console.log("|| Hoxton: Init");
      console.log("|| Hoxton: Platform: DoubleClick");
      if (Enabler.isInitialized()) {
        init();
      } else {
        Enabler.addEventListener(studio.events.StudioEvent.INIT, DC_Init);
      }

      function DC_Init() {
        if (Enabler.isPageLoaded()) {
          Creative.init();
        } else {
          Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, Creative.init);
        }
      }
    }
    hoxton.exit = function(exitName) {
      Enabler.exit("Exit");
      console.log("|| Hoxton: DoubleClick - Click Through");
    };

    hoxton.trackVideo = function(element) {
      Enabler.loadModule(studio.module.ModuleId.VIDEO, function() {
        studio.video.Reporter.attach(element.id, element);
      });
    }
    break;
  case 'generic':
    hoxton.init = function() {
      console.log("|| Hoxton: Init");
      console.log("|| Hoxton: Platform: Generic");
      Creative.init();
    }

    hoxton.exit = function(exitName) {
      window.open(window.clickTag);
      console.log("|| Hoxton: Generic - Click Through");
    };

    hoxton.trackVideo = function(element) {

    }
    break;
  default:
    break;
}
