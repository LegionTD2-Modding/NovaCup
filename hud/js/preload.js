// Preload images that we want to load instantly
// ===============================================================================

// Main func
var preloadImages = function (imgList) {
    for (var i = 0; i < imgList.length; i++) {
        window.preloadedImages[i] = new Image()
        window.preloadedImages[i].src = imgList[i]
        console.log('preload ' + imgList[i] + ", " + window.preloadedImages[i])
    }
}

if (document.images) { 
    window.preloadedImages = new Array()
}

var preloadedCoreImagesAlready = false
var preloadCoreImages = function () {
    if (preloadedCoreImagesAlready) return
    preloadedCoreImagesAlready = true

    console.log('preloading core images')
    var imgList = [
        "hud/img/ui/loading-small.gif",
        "hud/img/brand/logo.png",
    ]

    preloadImages(imgList)
}

var preloadedShopImagesAlready = false
var preloadShopImages = function () {
    if (preloadedShopImagesAlready) return
    preloadedShopImagesAlready = true

    console.log('preloading shop images')
    var imgList = [
        "hud/img/shop/card-wizard-background.jpg",
        "hud/videos/shop/card-trader.jpg",
    ]

    preloadImages(imgList)
}

var preloadedCampaignImagesAlready = false
var preloadCampaignImages = function () {
    if (preloadedCampaignImagesAlready) return
    preloadedCampaignImagesAlready = true

    console.log('preloading campaign images')
    var imgList = [
        "hud/img/campaign/campaign-background.jpg",
        "hud/img/splashes/campaign/map/campaign_1_1.jpg",
        "hud/img/splashes/campaign/map/campaign_2_1.jpg",
        "hud/img/splashes/campaign/map/campaign_3_1.jpg",
    ]
    for (var i = 1; i <= 7; i++) {
        for (var j = 1; j <= 3; j++) {

            if (j == 3) continue // Campaign 3 isn't out yet

            imgList.push("hud/img/campaign/markers/" + j + "_" + i + ".png")
            imgList.push("hud/img/campaign/markers/" + j + "_" + i + "_s.png")
            imgList.push("hud/img/campaign/markers/" + j + "_" + i + "_h.png")
            imgList.push("hud/img/campaign/markers/" + j + "_" + i + "_u.png")
        }
    }

    preloadImages(imgList)
}

var preloadedGameImagesAlready = false
var preloadGameImages = function () {
    if (preloadedGameImagesAlready) return
    preloadedGameImagesAlready = true

    console.log('preloading game images')
    var imgList = ["hud/img/powerups/powerup-inactive-1.png",
        "hud/img/powerups/powerup-inactive-2.png",
        "hud/img/powerups/powerup-inactive-3.png",
        "hud/img/powerups/powerup-inactive-4.png",
        "hud/img/powerups/powerup-inactive-5.png",
        "hud/img/powerups/powerup-inactive-6.png",
        "hud/img/powerups/powerup-inactive-7.png",
        "hud/img/powerups/powerup-inactive-8.png",
        "hud/img/powerups/powerup-inactive-9.png",
        "hud/img/powerups/powerup-inactive-10.png",
        "hud/img/hudv2/kingupgrade_0.png",
        "hud/img/hudv2/kingupgrade_0_gray.png",
        "hud/img/hudv2/kingupgrade_1.png",
        "hud/img/hudv2/kingupgrade_2.png",
        "hud/img/victory/DefeatBG.png",
        "hud/img/victory/DefeatEmblem.png",
        "hud/img/victory/VictoryBG.png",
        "hud/img/victory/VictoryEmblem.png",
        "hud/img/recvalue/rec-value-v2_sheet.png",
        "hud/img/legionselect/Atlantean0.png",
        "hud/img/legionselect/Divine0.png",
        "hud/img/legionselect/Element0.png",
        "hud/img/legionselect/Forsaken0.png",
        "hud/img/legionselect/Grove0.png",
        "hud/img/legionselect/Mastermind0.png",
        "hud/img/legionselect/MastermindVariant1.png",
        "hud/img/legionselect/MastermindVariant2.png",
        "hud/img/legionselect/MastermindVariant3.png",
        "hud/img/legionselect/Mech0.png",
        "hud/img/legionselect/Nomad0.png",
        "hud/img/legionselect/Shrine0.png",
    ]

    preloadImages(imgList)
}