// Global functions
// ===============================================================================

// For testing stuff in browser
var isUnityHost = navigator.vendor == 'Apple Computer, Inc.'
if (isUnityHost) {
    bindings.clickAction = function (actionId) { engine.call('OnUIAction', actionId) }
    bindings.rightClickAction = function (actionId) { engine.call('OnUIRightAction', actionId) }
    bindings.clickHome = function () {
        engine.call('OnClickBigButton')
        engine.call('OnUIHome')
    }
    engine.on('dragMinimap', function (x, y) {
        engine.call('OnUIMinimapDragged', x, y)
    })
} else {
    engine.on('dragMinimap', function (x, y) {
        engine.trigger('setMinimapLocation', x, y)
    })
}

// Prevent right-click bringing context menu. If you want the context menu (for, say, inspect element), 
// just shift+right click in the browser
window.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false)

// v8.04: Prevent space from scrolling the damage tracker (and potentially other stuff)
window.onkeydown = function (e) {
    //console.log('onKeyDown: ' + e.keyCode + ', target: ' + e.target + ', body: ' + (e.target == document.body))
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    }
};

// animationFrame stuff for rendering things at ~60 fps
// Request animationFrame https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
var requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Cancel animationFrame https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
window.cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function (callback) {
            clearTimeout(callback)
        };
})();

var util = {
    onMouseLeaveWindow: function (callback) {
        return function (e) {
            if (e.relatedTarget == null)
                callback()
        }
    }
}

//https://stackoverflow.com/questions/18699182/c-sharp-like-events-in-javascript
function createEvent() {
    var invokeList = [];

    var event = function () {
        for (var key in invokeList) {
            invokeList[key].apply();
        }
    }

    event.define = function (key, value) {
        //console.log("define createEvent key: " + key)
        invokeList[key] = value;
    }

    return event;
}
var renderEvents = createEvent()

// See http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
String.prototype.toTimeString = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var minutes = Math.floor(sec_num / 60);
    var seconds = sec_num - (minutes * 60);
    if (seconds < 10) { seconds = "0" + seconds; }
    return minutes + ':' + seconds;
}

// https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript?page=1&tab=votes#tab-top
// The regex way doesn't work with $1 notation
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// https://stackoverflow.com/questions/1720320/how-to-dynamically-create-css-class-in-javascript-and-apply
function createCSSSelector(selector, style) {
    if (!document.styleSheets) return;
    if (document.getElementsByTagName('head').length == 0) return;

    var styleSheet, mediaType;

    if (document.styleSheets.length > 0) {
        for (var i = 0, l = document.styleSheets.length; i < l; i++) {
            if (document.styleSheets[i].disabled)
                continue;
            var media = document.styleSheets[i].media;
            mediaType = typeof media;

            if (mediaType === 'string') {
                if (media === '' || (media.indexOf('screen') !== -1)) {
                    styleSheet = document.styleSheets[i];
                }
            }
            else if (mediaType == 'object') {
                if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
                    styleSheet = document.styleSheets[i];
                }
            }

            if (typeof styleSheet !== 'undefined')
                break;
        }
    }

    if (typeof styleSheet === 'undefined') {
        var styleSheetElement = document.createElement('style');
        styleSheetElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleSheetElement);

        for (i = 0; i < document.styleSheets.length; i++) {
            if (document.styleSheets[i].disabled) {
                continue;
            }
            styleSheet = document.styleSheets[i];
        }

        mediaType = typeof styleSheet.media;
    }

    if (mediaType === 'string') {
        for (var i = 0, l = styleSheet.rules.length; i < l; i++) {
            if (styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                styleSheet.rules[i].style.cssText = style;
                return;
            }
        }
        styleSheet.addRule(selector, style);
    }
    // This doesn't work in browser, some kind of CORS protection. Seems to work ingame though?
    // v6.05.2: just added an isUnityHost check for testing
    else if (mediaType === 'object' && isUnityHost) {
        var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
        for (var i = 0; i < styleSheetLength; i++) {
            if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
                styleSheet.cssRules[i].style.cssText = style;
                return;
            }
        }
        styleSheet.insertRule(selector + '{' + style + '}', styleSheetLength);
    }
}

// Coherent 1.15 workaround
var loadPopupYesCancel = function (header, description, behaviorIfYes, behaviorIfCancel) {
    engine.trigger('loadPopupExplicit',
        header,
        description,
        null,
        createYesCancelMenu(behaviorIfYes, behaviorIfCancel),
        false, false, null)
}

// Coherent 1.15 workaround
var loadPopupYesRecommendedSkip = function (header, description, behaviorIfYes, behaviorIfCancel) {
    engine.trigger('loadPopupExplicit',
        header,
        description,
        null,
        createYesRecommendedSkipMenu(behaviorIfYes, behaviorIfCancel),
        false, false, null)
}

// Coherent 1.15 workaround
var loadPopupCancel = function (header, description, behaviorIfCancel) {
    engine.trigger('loadPopupExplicit',
        header,
        description,
        null,
        createCancelMenu(behaviorIfCancel),
        false, false, null)
}

// v10.00.4
var ratingThresholdsClassic = [
    1000, // 0: Bronze
    1200, // 1: Silver
    1400, // 2: Gold
    1600, // 3: Platinum
    1800, // 4: Diamond
    2100, // 5: Expert
    2500, // 6: Master
    3000, // 7: Senior Master
    3500, // 8: Grandmaster
    4000  // 9: Legend
]

// todo: use this
//var ratingThresholdsRanked = [
//]

// Copy and pasted in Natives, but hopefully this is unlikely to change
getRatingImage = function (rating, isClassic) {
    if (isClassic) return getRatingImageClassic(rating) // v9.00
    var ratingImage = "hud/img/icons/Ranks/Unranked.png"
    if (rating >= 2800)
        ratingImage = "hud/img/icons/Ranks/Legend.png"
    else if (rating >= 2600)
        ratingImage = "hud/img/icons/Ranks/Grandmaster.png"
    else if (rating >= 2400)
        ratingImage = "hud/img/icons/Ranks/SeniorMaster.png"
    else if (rating >= 2200)
        ratingImage = "hud/img/icons/Ranks/Master.png"
    else if (rating >= 2000)
        ratingImage = "hud/img/icons/Ranks/Expert.png"
    else if (rating >= 1800)
        ratingImage = "hud/img/icons/Ranks/Diamond.png"
    else if (rating >= 1600)
        ratingImage = "hud/img/icons/Ranks/Platinum.png"
    else if (rating >= 1400)
        ratingImage = "hud/img/icons/Ranks/Gold.png"
    else if (rating >= 1200)
        ratingImage = "hud/img/icons/Ranks/Silver.png"
    else if (rating >= 1000)
        ratingImage = "hud/img/icons/Ranks/Bronze.png"
    return ratingImage
}

getRatingImageClassic = function (rating) {
    var ratingImage = "hud/img/icons/Ranks/Unranked.png"
    if (rating >= ratingThresholdsClassic[9])
        ratingImage = "hud/img/icons/Ranks/Legend.png"
    else if (rating >= ratingThresholdsClassic[8])
        ratingImage = "hud/img/icons/Ranks/Grandmaster.png"
    else if (rating >= ratingThresholdsClassic[7])
        ratingImage = "hud/img/icons/Ranks/SeniorMaster.png"
    else if (rating >= ratingThresholdsClassic[6])
        ratingImage = "hud/img/icons/Ranks/Master.png"
    else if (rating >= ratingThresholdsClassic[5])
        ratingImage = "hud/img/icons/Ranks/Expert.png"
    else if (rating >= ratingThresholdsClassic[4])
        ratingImage = "hud/img/icons/Ranks/Diamond.png"
    else if (rating >= ratingThresholdsClassic[3])
        ratingImage = "hud/img/icons/Ranks/Platinum.png"
    else if (rating >= ratingThresholdsClassic[2])
        ratingImage = "hud/img/icons/Ranks/Gold.png"
    else if (rating >= ratingThresholdsClassic[1])
        ratingImage = "hud/img/icons/Ranks/Silver.png"
    else if (rating >= ratingThresholdsClassic[0])
        ratingImage = "hud/img/icons/Ranks/Bronze.png"
    return ratingImage
}

// Copy and pasted in Natives, but hopefully this is unlikely to change
getRatingDivisionNumeral = function (rating, isClassic) {
    if (isClassic) return getRatingDivisionNumeralClassic(rating) // v9.00

    if (rating >= 2800 || rating < 1000)
        return ''
    var ratingDivisionNumber = rating % 200
    if (ratingDivisionNumber >= 150)
        return 'I'
    else if (ratingDivisionNumber >= 100)
        return 'II'
    else if (ratingDivisionNumber >= 50)
        return 'III'
    else
        return 'IV'
    return ''
}

getRatingDivisionNumeralClassic = function (rating) {
    return 'c'
}

getRatingImageSimplified = function (rating, isClassic) {
    if (isClassic) return getRatingImageSimplifiedClassic(rating) // v9.00

    var ratingImage = "hud/img/icons/Ranks/Simple/Unranked.png" // v9.00
    if (rating >= 2800)
        ratingImage = "hud/img/icons/Ranks/Simple/Legend.png"
    else if (rating >= 2600)
        ratingImage = "hud/img/icons/Ranks/Simple/Grandmaster.png"
    else if (rating >= 2400)
        ratingImage = "hud/img/icons/Ranks/Simple/SeniorMaster.png"
    else if (rating >= 2200)
        ratingImage = "hud/img/icons/Ranks/Simple/Master.png"
    else if (rating >= 2000)
        ratingImage = "hud/img/icons/Ranks/Simple/Expert.png"
    else if (rating >= 1800)
        ratingImage = "hud/img/icons/Ranks/Simple/Diamond.png"
    else if (rating >= 1600)
        ratingImage = "hud/img/icons/Ranks/Simple/Platinum.png"
    else if (rating >= 1400)
        ratingImage = "hud/img/icons/Ranks/Simple/Gold.png"
    else if (rating >= 1200)
        ratingImage = "hud/img/icons/Ranks/Simple/Silver.png"
    else if (rating >= 1000)
        ratingImage = "hud/img/icons/Ranks/Simple/Bronze.png"

    return ratingImage
}

getRatingImageSimplifiedClassic = function (rating) {
    var ratingImage = "hud/img/icons/Ranks/Simple/Unranked.png"
    if (rating >= ratingThresholdsClassic[9])
        ratingImage = "hud/img/icons/Ranks/Simple/Legend.png"
    else if (rating >= ratingThresholdsClassic[8])
        ratingImage = "hud/img/icons/Ranks/Simple/Grandmaster.png"
    else if (rating >= ratingThresholdsClassic[7])
        ratingImage = "hud/img/icons/Ranks/Simple/SeniorMaster.png"
    else if (rating >= ratingThresholdsClassic[6])
        ratingImage = "hud/img/icons/Ranks/Simple/Master.png"
    else if (rating >= ratingThresholdsClassic[5])
        ratingImage = "hud/img/icons/Ranks/Simple/Expert.png"
    else if (rating >= ratingThresholdsClassic[4])
        ratingImage = "hud/img/icons/Ranks/Simple/Diamond.png"
    else if (rating >= ratingThresholdsClassic[3])
        ratingImage = "hud/img/icons/Ranks/Simple/Platinum.png"
    else if (rating >= ratingThresholdsClassic[2])
        ratingImage = "hud/img/icons/Ranks/Simple/Gold.png"
    else if (rating >= ratingThresholdsClassic[1])
        ratingImage = "hud/img/icons/Ranks/Simple/Silver.png"
    else if (rating >= ratingThresholdsClassic[0])
        ratingImage = "hud/img/icons/Ranks/Simple/Bronze.png"
    return ratingImage
}

// SMELLY COPY AND PASTED ABOVE
getRatingClass = function (rating, isClassic) {
    if (isClassic) return getRatingClassClassic(rating) // v9.00

    var ratingClass = "rating-none"
    if (rating >= 2800)
        ratingClass = "rating-legend"
    else if (rating >= 2600)
        ratingClass = "rating-grandmaster"
    else if (rating >= 2400)
        ratingClass = "rating-seniormaster"
    else if (rating >= 2200)
        ratingClass = "rating-master"
    else if (rating >= 2000)
        ratingClass = "rating-expert"
    else if (rating >= 1800)
        ratingClass = "rating-diamond"
    else if (rating >= 1600)
        ratingClass = "rating-platinum"
    else if (rating >= 1400)
        ratingClass = "rating-gold"
    else if (rating >= 1200)
        ratingClass = "rating-silver"
    else if (rating >= 1000)
        ratingClass = "rating-bronze"

    return ratingClass
}

// SMELLY COPY AND PASTED ABOVE
getRatingClassClassic = function (rating) {
    var ratingClass = "rating-none"
    if (rating >= 4000)
        ratingClass = "rating-legend"
    else if (rating >= 3500)
        ratingClass = "rating-grandmaster"
    else if (rating >= 3000)
        ratingClass = "rating-seniormaster"
    else if (rating >= 2500)
        ratingClass = "rating-master"
    else if (rating >= 2100)
        ratingClass = "rating-expert"
    else if (rating >= 1800)
        ratingClass = "rating-diamond"
    else if (rating >= 1600)
        ratingClass = "rating-platinum"
    else if (rating >= 1400)
        ratingClass = "rating-gold"
    else if (rating >= 1200)
        ratingClass = "rating-silver"
    else if (rating >= 1000)
        ratingClass = "rating-bronze"

    return ratingClass
}

getWinsColorClass = function (wins) {
    var result = "rating-unranked"
    if (wins >= 2000)
        result = "rating-legend"
    else if (wins >= 1500)
        result = "rating-grandmaster"
    else if (wins >= 1000)
        result = "rating-seniormaster"
    else if (wins >= 500)
        result = "rating-master"
    else if (wins >= 200)
        result = "rating-expert"
    else if (wins >= 100)
        result = "rating-diamond"
    else if (wins >= 50)
        result = "rating-platinum"
    else if (wins >= 15)
        result = "rating-gold"
    else if (wins >= 5)
        result = "rating-silver"
    //else if (wins >= 1) // Julian thought it looked weird
    //    result = "rating-bronze"
    return result
}

getStatisticSuffix = function (statisticName) {
    //var suffix = " (S" + globalState.season + ")"
    //if (statisticName == "overallPeakElo")
    //    suffix = " (" + loc('all', 'All') + ")"

    var suffix = ""
    if (statisticName == "overallPeakElo" || statisticName == "vipOverallPeakElo" || statisticName == "vipMatchmadeWins")
        suffix = " (" + loc('all', 'All') + ")"
    else if (_.endsWith(statisticName, 'ThisSeason') || _.endsWith(statisticName, 'AtLeastOneGamePlayed') || statisticName == 'vipOverallElo') {
        if (globalState.season <= 8)
            suffix = " (S" + globalState.season + ")"
        else
            suffix = " (" + getSeasonDisplayNumber(globalState.season) + ")"
    }

    return suffix
}

isSkinADefaultSkin = function (skin) {
    if (skin == null) return true
    if (skin == {}) return true
    if (skin.id == null || skin.id == '') return true
    if (skin.key == null || skin.key == '') return true
    return false
}

// SMELLY: DOES NOT WORK WITH MIDDLE CLICK FOR SOME REASON... Only reproable ingame
var openContextMenu = function (target, displayTarget, getActions, left, top, flipY, newStyle) {
    globalState.contextMenuTarget = target
    console.log('openContextMenu globalState.contextMenuTarget: ' + globalState.contextMenuTarget + ', displayTarget: ' + displayTarget + ', left: ' + left + ', top: ' + top)

    globalState.contextMenuDisplayTarget = displayTarget
    bindings.refreshContextMenuActions(getActions())
    bindings.openContextMenu()
    bindings.setContextMenuPosition(left, top, flipY, newStyle)

    engine.call('OnOpenContextMenu')
}

// https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
function nFormatter(num, digits) {
    var si = [
        //{ value: 1, symbol: "" }, // Uncomment this if you wanted like 440 to display as 440 instead of 0.4k
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }

    // Use this version if you want to make 2000 display as 2k instead of 2.0k
    //var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    // return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;

    return (num / si[i].value).toFixed(digits) + si[i].symbol;
}

var isChinese = function () {
    if (globalState.language == 'chinese_simplified') return true
    if (globalState.language == 'chinese_traditional') return true
    return false
}

var shouldShowDiscord = function () {
    // Chinese players strongly dislike non-Chinese/untranslated stuff
    //if (isChinese()) return false // v7.05 let's just show them based on Chinese player feedback
    return true
}

var shouldShowGameGuide = function () {
    // Chinese players strongly dislike non-Chinese/untranslated stuff
    //if (isChinese()) return false // v7.05 let's just show them based on Chinese player feedback
    return true
}

var shouldShowPatchNotes = function () {
    // Chinese players strongly dislike non-Chinese/untranslated stuff
    //if (isChinese()) return false // v7.05 let's just show them based on Chinese player feedback
    return true
}

// Seems kinda bugged, I'm not sure... might only work for absolute positioned elements?
// Seems like it mainly just works for certain in-game stuff like Powerups Window
// Consider instead using getBoundingClientRect - see singleplayer-views.js OnClickedMission
var getAbsoluteOffset = function (element) {
    return getAbsoluteOffsetHelper(element, element.offsetWidth * 0.5, element.offsetHeight * 0.5)
}

var getAbsoluteOffsetHelper = function (element, offsetLeft, offsetTop) {
    if (element.parentNode == null) {
        return {
            x: offsetLeft,
            y: offsetTop
        }
    }

    //console.log(element.parentNode)
    //console.log('getAbsoluteOffsetHelper had offsetTop: ' + element.offsetTop + ', offsetLeft: ' + element.offsetLeft)

    return getAbsoluteOffsetHelper(element.parentNode, offsetLeft + element.offsetLeft, offsetTop + element.offsetTop)
}

var getAvatarStacksClass = function (stacks) {
    if (!globalState.shopEnabled) stacks = 0

    return 'avatar-border-with-' + getAvatarStacksThreshold(stacks) + '-stacks'
        + (stacks >= 3 ? ' with-border' : '')
}

var getGuildAvatarStacksClass = function (stacks) {
    if (!globalState.shopEnabled) stacks = 0

    var guildStacks = Math.floor(stacks / 5)
    //console.log('guildStacks: ' + guildStacks + ' based on ' + stacks + ' actual stacks')

    return 'avatar-border-with-' + getAvatarStacksThreshold(guildStacks) + '-stacks'
        + (stacks >= 3 ? ' with-border' : '')
}

var getAvatarStacksThreshold = function (stacks) {
    if (!globalState.shopEnabled) return 0

    if (stacks <= 0) return 0
    if (stacks >= 1 && stacks < 3) return 1
    if (stacks >= 3 && stacks < 10) return 3
    if (stacks >= 10) return 10

    return 0
}

// If we want this to be able to coexist with the Current Skin window, we could maybe convert this
// to a full-screen popup...
var loadConfirmPurchasePopup = function (props, actionOnConfirm) {
    itemName = '' // actually I like hiding item name/currencyName now. Cleaner, more aligned look
    var deltaEssence = props.newEssence - props.essence
    var deltaEssenceText = ''
    if (deltaEssence > 0)
        deltaEssenceText = '(<span style="color: #8ff110"><img src="hud/img/recvalue/green_up.png"/>' + Math.abs(deltaEssence) + '</span>)'
        //deltaEssenceText = '(<span style="color: #8ff110">+' + deltaEssence + '</span>)'
    else if (deltaEssence < 0)
        deltaEssenceText = '(<span style="color: #ffff66"><img src="hud/img/recvalue/yellow_down.png"/>' + Math.abs(deltaEssence) + '</span>)'
        //deltaEssenceText = '(<span style="color: #ffff66">' + deltaEssence + '</span>)'

    var deltaPremiumEssence = props.newPremiumEssence - props.premiumEssence
    var deltaPremiumEssenceText = ''
    if (deltaPremiumEssence > 0)
        deltaPremiumEssenceText = '(<span style="color: #8ff110"><img src="hud/img/recvalue/green_up.png"/>' + Math.abs(deltaPremiumEssence) + '</span>)'
        //deltaPremiumEssenceText = '(<span style="color: #8ff110">+' + deltaPremiumEssence + '</span>)'
    else if (deltaPremiumEssence < 0)
        deltaPremiumEssenceText = '(<span style="color: #ffff66"><img src="hud/img/recvalue/yellow_down.png"/>' + Math.abs(deltaPremiumEssence) + '</span>)'
        //deltaPremiumEssenceText = '(<span style="color: #ffff66">' + deltaPremiumEssence + '</span>)'

    if (isNaN(props.newCardFragments)) props.newCardFragments = 0
    if (isNaN(props.cardFragments)) props.cardFragments = 0
    var deltaCardFragments = props.newCardFragments - props.cardFragments
    var deltaCardFragmentsText = ''
    if (deltaCardFragments > 0)
        deltaCardFragmentsText = '(<span style="color: #8ff110"><img src="hud/img/recvalue/green_up.png"/>' + Math.abs(deltaCardFragments) + '</span>)'
    else if (deltaCardFragments < 0)
        deltaCardFragmentsText = '(<span style="color: #ffff66"><img src="hud/img/recvalue/yellow_down.png"/>' + Math.abs(deltaCardFragments) + '</span>)'

    console.log('deltaEssence: ' + deltaEssence)
    console.log('deltaEssenceText: ' + deltaEssenceText)
    console.log('deltaPremiumEssence: ' + deltaPremiumEssence)
    console.log('deltaPremiumEssenceText: ' + deltaPremiumEssenceText)
    console.log('deltaCardFragments: ' + deltaCardFragments)
    console.log('deltaCardFragmentsText: ' + deltaCardFragmentsText)

    var descriptionText = ''
    descriptionText += '<div style="width: 320px; margin: auto; text-align: left">'

    if (deltaEssence != 0)
        descriptionText += '<div style="display: inline-block; margin-right: 8px"><img class="tooltip-icon" src="hud/img/shop/currency/Essence_20.png"/></div>' + props.essence + ' <img class="tooltip-icon" src="hud/img/small-icons/right-arrow.png" style="vertical-align: top"/> ' + props.newEssence + ' ' + deltaEssenceText + '<br/>'

    if (deltaPremiumEssence != 0)
        descriptionText += '<div style="display: inline-block; margin-right: 8px"><img class="tooltip-icon" src="hud/img/shop/currency/PremiumEssence_20.png"/></div>' + props.premiumEssence + ' <img class="tooltip-icon" src="hud/img/small-icons/right-arrow.png" style="vertical-align: top"/> ' + props.newPremiumEssence + ' ' + deltaPremiumEssenceText + '<br/>'

    if (deltaCardFragments != 0)
        descriptionText += '<div style="display: inline-block; margin-right: 8px"><img class="tooltip-icon" src="hud/img/shop/currency/CardFragments_20.png"/></div>' + props.cardFragments + ' <img class="tooltip-icon" src="hud/img/small-icons/right-arrow.png" style="vertical-align: top"/> ' + props.newCardFragments + ' ' + deltaCardFragmentsText + '<br/>'

    descriptionText += '<div style="display: inline-block; margin-right: 8px; margin-top: 12px;">' + loc('you_receive', 'You receive') + ': <img class="tooltip-icon-big" src="hud/img/' + props.image + '"/> ' + props.name + '</div>'
    descriptionText += '</div>'

    loadPopupExplicit(loc('confirm_purchase', 'Confirm Purchase'),
        descriptionText,
        null, createConfirmPurchaseMenu(props.itemType, actionOnConfirm),
        false, false, null, false, {
        customHeaderStyle: {
        }
    })
}

// Testing purposes only. See StyledText for the copy and pasted real copy
//var generateRatingImageHtml = function (rating) {
//    return "<span>" + "<img src='" + getRatingImage(rating) + "' style='height: 24px; display: inline-block' />"
//        + "<span class='rating-numeral' style='right: 8px; bottom: 0px; height: 0px; display: inline; width: 0; margin-right: -4px'>"
//        + getRatingDivisionNumeral(rating)
//        + "</span>"
//        + "</span>"
//}

var loadMyGuildProfile = function () {
    console.log('loadMyGuildProfile()')

    if (globalState.myGuildId != null && globalState.myGuildId.length > 0) {
        // Loading state
        globalState.selectedGuild = null
        engine.trigger('loadView', 'guild')

        engine.call('OnLoadGuildProfileByGuildId', globalState.myGuildId)
        if (isBrowserTest)
            engine.trigger('viewGuildProfile', testGuild)
    }
    else {
        engine.trigger('showGuildDirectory')
    }
}

var getFullLeaderboardHeight = function () {
    var leaderboardHeight = '45vh'
    if (globalState.screenHeight >= 1440)
        leaderboardHeight = '70vh'
    else if (globalState.screenHeight >= 1080)
        leaderboardHeight = '65vh'
    else if (globalState.screenHeight >= 900)
        leaderboardHeight = '57.5vh'
    else if (globalState.screenHeight >= 768)
        leaderboardHeight = '55vh'
    else
        leaderboardHeight = '50vh'

    console.log('getFullLeaderboardHeight returned ' + leaderboardHeight)

    return leaderboardHeight
}

var getSeasonDisplayNumber = function (season) {
    if (season <= 8) return season

    return (2021 - 8) + season
}

var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

var getGameCoachIcon = function () {
    return getGameCoachIconExplicit(globalState.equippedGameCoachItem)
}

var getGameCoachIconExplicit = function (itemId) {
    switch (itemId) {
        case 'cheerful_game_coach_item_id':
            return 'icons/Coach/CheerfulGameCoach40'
        case 'darth_game_coach_item_id':
            return 'icons/Coach/DarthGameCoach40'
        case 'pirate_game_coach_item_id':
            return 'icons/Coach/PirateCoach40'
        case '200_iq_game_coach_item_id':
            return 'icons/Coach/200IQCoach40'
        case 'dude_game_coach_item_id':
            return 'icons/Coach/DudeCoach40'
        default:
            return 'icons/Coach/StandardGameCoach40'
    }
}

var isPauseEnabled = function () {
    switch (globalState.matchmakerQueue) {
        case 'Custom':
        case 'BeginnerBots':
        case 'VeryEasyBots':
        case 'EasyBots':
        case 'MediumBots':
        case 'HardBots':
        case 'InsaneBots':
        case 'ExpertBots':
        case 'MasterBots':
        case 'SeniorMasterBots':
        case 'GrandmasterBots':
            return true
    }
}

function log10(val) {
    return Math.log(val) / Math.LN10;
}

var getGameStatsPerformanceScore = function (wins, losses) {
    // Pre-v10.02
    //var performanceRaw = (100 * ((wins + 1.9208) / (wins + losses) - 1.96 * Math.sqrt((wins * losses) / (wins + losses) + 0.9604) / (wins + losses)) / (1 + 3.8416 / (wins + losses)))
    //return performanceRaw

    // v10.02
    if (wins + losses == 0) return 0
    return 100 * (wins / (wins + losses) - (wins / (wins + losses) - 0.5) * Math.pow(2, - log10(wins + losses + 1)))
}