/************************************ DOM ELEMENTS ************************************/

var DomID = {};
DomID.arrCaptions = new Array();
// AUTOMATICALLY GENERATES VARS FOR DOM ELEMENTS. ID MUST MATCH.
DomID.createDomIDs = function () {
    DomID.createDomIDsFromDivs();
}

DomID.createDomIDsFromDivs = function () {
    
    var arrDivs = document.getElementsByTagName("div");
    var currDiv;
    var currID;
    for (currDiv = 0; currDiv < arrDivs.length; ++currDiv) {
        currID = arrDivs[currDiv].id;
        try {
            // ONLY CREATE IF DIV HAS AN ID
            if (currID)
                DomID[currID] = Utils.id(currID);
        } catch (err) {
            console.log(err);
        }
    }
}

/****************** GRAB & PARSE EDITABLE DATA FROM HOXTON ******************/

var Utils = {};
hoxton.data.imagesLoaded = 0;
hoxton.data.numofImages = 0;

Utils.getData = function () {
    console.log("|| Utils: Get Hoxton Data");
    try { Utils.parseData(hoxton.data);} catch (err) { console.log(err); }
}
Utils.parseData = function (rawData) {
    var key, keyValue;

    for (key in rawData) {
        keyValue = rawData[key].value;
        Utils.updateDomWithData(rawData[key].type, rawData, key, keyValue);
    }
}

Utils.updateDomWithData = function (dataType, rawData, key, keyValue) {
    switch (dataType) {
        case "image":
            if (key !== "backup" && keyValue !== "" && String(keyValue) !== "null") {
                
                hoxton.data.numofImages++;
                
                // THIS "UNDEFINED" IS FOR THE CAPTIONS BECAUSE THEY DONT HAVE THEIR OWN DOM ID
                if (DomID[key] === undefined) {
                    if (key.indexOf("caption") >= 0) { Utils.dynamicCaptions(rawData, key); }
                } else {
                    Utils.emptyDomContent(key);
                }

                try {
                    DomID[key].appendChild(Utils.dynamicImg(keyValue));
                    Utils.dynamicImg(keyValue).onload = function imageLoaded() {
                        hoxton.data.imagesLoaded++;
                        if (hoxton.data.imagesLoaded == hoxton.data.numofImages) {
                            console.log("|| Utils: Hoxton images loaded: " + hoxton.data.numofImages)
                            Utils.createTL();
                        }
                    }
                } catch (err) { console.log(err + " DOM element " + key); }
            }
            break;
        case "video":
            var source = DomID[key].getElementsByTagName('source');
            if (hoxton.data.platform == "doubleclick") {
                source[0].src = Enabler.getUrl(keyValue);
            } else {
                source[0].src = keyValue;
            }
            hoxton.data[key].value = keyValue;

            break;
        case "css":
            var newKeyValue = keyValue.toString();
            newKeyValue = newKeyValue.replace(/;/g, '!important;');

            console.log(newKeyValue)

            Utils.updateCSSWithData(key, newKeyValue);
            break;
        default:
            hoxton.data[key].value = keyValue;


    }
}

Utils.updateCSSWithData = function (key, keyValue) {
    var targetID = key.replace("css-", "#");

    console.log("CSS: " + targetID + "  " + keyValue)

    if (!!(window.attachEvent && !window.opera)) {
        Utils.stylesheetOverride.styleSheet.cssText += targetID + keyValue;
    } else {
        var styleText = document.createTextNode(targetID + keyValue);
        Utils.stylesheetOverride.appendChild(styleText);
    }
}

Utils.stylesheetOverride;
Utils.embedStyleSheet = function () {
    Utils.stylesheetOverride = document.createElement("style");
    Utils.stylesheetOverride.type = "text/css";
    Utils.stylesheetOverride.appendChild(document.createTextNode(""));

    document.head.appendChild(Utils.stylesheetOverride);
}

Utils.emptyDomContent = function (key) {
    while (DomID[key].firstChild) {
        DomID[key].removeChild(DomID[key].firstChild);
    }
}
Utils.dynamicCaptions = function (rawData, key) {
    var dCaption = document.createElement("div");
    dCaption.setAttribute("id", key);
    dCaption.setAttribute("class", "sizeFull");

    DomID["captions"].appendChild(dCaption);
    DomID[key] = dCaption;

    TweenMax.set(dCaption, { autoAlpha: 0 });

    DomID.arrCaptions.push(dCaption);
}
Utils.dynamicImg = function (src) {
    var dImg = document.createElement("img");
    dImg.setAttribute("src", src);

    return dImg;
}

/************************************* CREATE BUTTONS FROM PNGS *************************************/

Utils.triggerAreaPixelDetection = function (element) {
    console.log("|| Utils: Create Button: " + element.name);
    var canvas = document.createElement('canvas');
    canvas.id = "canvas";
    canvas.width = hoxton.data.width * 2;
    canvas.height = hoxton.data.height * 2;

    var img = new Image;
    var w = canvas.width;
    var h = canvas.height;
    var ctx = canvas.getContext('2d');

    // img.crossOrigin = 'Anonymous';
    img.onload = getBounds;
    img.src = element.value;

    function getBounds() {

        ctx.drawImage(this, 0, 0, w, h);
        var idata = ctx.getImageData(0, 0, w, h),
            buffer = idata.data,
            buffer32 = new Uint32Array(buffer.buffer),
            x,
            y,
            x1 = w,
            y1 = h,
            x2 = 0,
            y2 = 0;

        // get left edge
        for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
                if (buffer32[x + y * w] > 0) {
                    if (x < x1)
                        x1 = x;
                }
            }
        }

        // get right edge
        for (y = 0; y < h; y++) {
            for (x = w; x >= 0; x--) {
                if (buffer32[x + y * w] > 0) {
                    if (x > x2)
                        x2 = x;
                }
            }
        }

        // get top edge
        for (x = 0; x < w; x++) {
            for (y = 0; y < h; y++) {
                if (buffer32[x + y * w] > 0) {
                    if (y < y1)
                        y1 = y;
                }
            }
        }

        // get bottom edge
        for (x = 0; x < w; x++) {
            for (y = h; y >= 0; y--) {
                if (buffer32[x + y * w] > 0) {
                    if (y > y2)
                        y2 = y;
                }
            }
        }

        var rectangleWidth = (x2 - x1) * .5;
        var rectangleHeight = (y2 - y1) * .5;
        var triggerDiv = DomID[element.name].getElementsByClassName("btn")[0];
        triggerDiv.style.width = rectangleWidth + "px";
        triggerDiv.style.height = rectangleHeight + "px";
        triggerDiv.style.left = x1 * .5 + "px";
        triggerDiv.style.top = y1 * .5 + "px";

    }
}

/*************************************** TIMELINE EVENTS ***************************************/

Utils.createFrameLabel = function (secsAdjust) {
    Creative.currFrame++;
    Creative.tl.addLabel("frame" + Creative.currFrame, secsAdjust);
}

Utils.eventCompleteTL = function (e) { Creative.tl.pause(); }

Utils.createTL = function () {
    //This funcion gets call from Utils.updateDomWithData in utils.js once all the data has been added to the Dom.
    const flow = Utils.isMobile == true ? 'Mobile' : 'Desktop';
    console.log("|| Utils: Flow:", flow);
    Creative.createTL();
}

// AUTO GENERATE CAPTIONS FROM EXISTING CAPTION IMAGES LOADED WITH HOXTON DATA

Utils.createCaptionsTL = function () {
    var prevCaptionID, currCaptionID;

    for (var index = 0; index < DomID.arrCaptions.length; ++index) {
        prevCaptionID = currCaptionID;
        currCaptionID = Utils.stringToCamelCase(DomID.arrCaptions[index].id);

        if (index === 0) {
            
            Utils.createFrameLabel("videoStart+=" + hoxton.data["video" + currCaptionID + "StartSecs"].value);
            Creative.tl.to(DomID.captions, 1, { autoAlpha: hoxton.data.showVideoCaptions.value }, "frame" + Creative.currFrame);
            
        } else {
            
            Utils.createFrameLabel("videoStart+=" + hoxton.data["video" + prevCaptionID + "EndSecs"].value);
            Creative.tl.to(DomID.arrCaptions[index - 1], .5, { autoAlpha: 0 }, "frame" + Creative.currFrame);
            Creative.tl.to(DomID.arrCaptions[index], .5, { autoAlpha: hoxton.data.showVideoCaptions.value }, "videoStart+=" + hoxton.data["video" + currCaptionID + "StartSecs"].value);
        }
    }
}

/************************************* CLICK & ROLLOVER EVENTS *************************************/

Utils.exitClickHandler = function (event) { hoxton.exit(); };

Utils.setupUserEvents = function () {
    try { DomID.cta.onclick = DomID.border.onclick = Utils.exitClickHandler } catch (error) { console.log(error) };
    try { DomID.ctaTrigger.addEventListener('mouseover', Creative.ctaRollover) } catch (error) { console.log(error) };
    try { DomID.ctaTrigger.addEventListener('mouseout', Creative.ctaRollout) } catch (error) { console.log(error) };
	DomID.ctaTrigger.onclick = function(){
		 DomID.ctaRollout.style.display = "none";
    	DomID.ctaRollover.style.display = "block";
	}
}

/**************************************** UTILITY FUNCTIONS ****************************************/

Utils.isMobile = function () {
    var isMobile = false;

    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)))
        isMobile = true;

    else if (window.location.href.split('.html')[1] == '?mobile') isMobile = true;
    else if (Utils.mobileOnly == true) isMobile = true;
    return isMobile;
}
Utils.id = function (ele) {
    return document.getElementById(ele);
}

Utils.isWindowFrameElement = function () {
    if (window.frameElement === null)
        return false;
    else if (window.frameElement.nodeName !== "IFRAME")
        return false
    else
        return true;
}
Utils.prevDef = function (e) {
    if (e) {
        evt = e || window.event;
        evt.preventDefault();
    }
}
Utils.handleVisibilityChange = function () {
    if (document[Utils.hidden])
        Creative.jumpToEndFrame();
}
Utils.getBrowserPrefix = function () {
    var str = "";

    if (typeof document.hidden !== "undefined") {
        // Opera 12.10 and Firefox 18 and later support
        str = "";
    } else if (typeof document.mozHidden !== "undefined") {
        str = "moz";
    } else if (typeof document.msHidden !== "undefined") {
        str = "ms";
    } else if (typeof document.webkitHidden !== "undefined") {
        str = "webkit";
    }

    return str;
}
Utils.hidden = String();
Utils.createVisibilityEvent = function () {
    var prefix = Utils.getBrowserPrefix();
    var visibilityChange = prefix + "visibilitychange";

    Utils.hidden = (prefix == "") ?
        "hidden" :
        prefix + "Hidden";

    if (typeof document.addEventListener === "undefined" || typeof document[Utils.hidden] === "undefined") {
        console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
    } else {
        // Handle page visibility change
        document.addEventListener(visibilityChange, Utils.handleVisibilityChange, false);
    }
}
Utils.stringToCamelCase = function (str) {
    return str.toLowerCase().replace(/(?:(^.)|(\s+.))/g, function (match) {
        return match.charAt(match.length - 1).toUpperCase();
    });
}