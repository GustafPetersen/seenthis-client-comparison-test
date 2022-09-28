/************************************** CREATIVE ************************************/
var Creative = {};
Creative.numOfImages = 0;
Creative.currFrame = 0;
var watchPlayed = false;

var imageZoomStart;
var imageZoomEnd;

Creative.tl = new TimelineMax();
Creative.init = function () {

    imageZoomStart = hoxton.data.imageZoomStart.value;
    imageZoomEnd = hoxton.data.imageZoomEnd.value;

    Utils.embedStyleSheet();
    DomID.createDomIDs();
    Utils.getData();
    Utils.createVisibilityEvent();
    Utils.setupUserEvents();
    Creative.setUpActors();
    //Utils.triggerAreaPixelDetection(hoxton.data.cta);
}

Creative.setUpActors = function () {

    TweenMax.set([
        DomID.copy2,
        DomID.cta, 
		DomID.watchHolder,
		DomID.globalWatch,
		DomID.watchName,
        DomID.perpetual,
        DomID.whiteFrame
    ], { autoAlpha: 0 });

    TweenMax.set([
        DomID.logos,
		DomID.overlay
    ], { autoAlpha: 1 });

}

Creative.createTL = function () {
    // THIS IS CALLED FROM WITHIN UTILS
    console.log('|| Creative: Create Timeline');
    Creative.tl.addLabel("start");
    Creative.tl.to(DomID.mainContainer, .5, { autoAlpha: 1 }, "start");

    //FRAME01---------------------------------------------------------------------
    //Utils.createFrameLabel("+=0");
    Creative.tl.to(DomID.img1, 4, {  scale:1.05, ease: Linear.easeNone, rotationY: 0.1, rotationZ: 0.1, force3D: false }, "frame" + Creative.currFrame);

    //FRAME02---------------------------------------------------------------------
    Utils.createFrameLabel("+=0");
    Creative.tl.to([DomID.img1, DomID.copy1,DomID.overlay], .5, { autoAlpha: 0 }, "frame" + Creative.currFrame);
    Creative.tl.to([DomID.whiteFrame], .4, { autoAlpha: 1 }, "frame" + Creative.currFrame);
	Creative.tl.call( Creative.showWatch, null , this , "frame5" )
    Creative.tl.to([DomID.copy2, DomID.cta, DomID.perpetual, DomID.watchHolder, DomID.globalWatch, DomID.watchName], .7, { autoAlpha: 1 }, "frame" + Creative.currFrame);

   //FRAME END------------------------------------------------------------------
   Creative.tl.addLabel("frameEnd");
   Creative.tl.eventCallback("onComplete", Utils.eventCompleteTL, null, this);

   console.log("|| Creative: Timeline Duration: " + Math.floor(Creative.tl.duration()));
   console.log(Creative.tl.duration());
}

Creative.ctaRollover = function (event) {
   DomID.ctaRollout.style.display = "none";
   DomID.ctaRollover.style.display = "block";
};

Creative.ctaRollout = function (event) {
   DomID.ctaRollout.style.display = "block";
   DomID.ctaRollover.style.display = "none";
};

Creative.jumpToEndFrame = function () {
    Creative.ctaRollout();
    Creative.tl.seek("frameEnd", false);
    TweenMax.killAll(); // kill delayed call if looping
}

Creative.showWatch = function(){
	playWatch();
}

/*******************************************************************************************/

// Start creative once all elements in window are loaded.
window.onload = function () { hoxton.init() };
