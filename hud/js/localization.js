// Localization
// All data is pulled from Apex descriptions
// ===============================================================================

var locTable = {}

engine.on('defineLocalizedString', function (lsp) {
    locTable[lsp.apexId] = lsp
})

// Parallel implementation of AENatives > Misc > Localization.Fetch
var loc = function (apexId, placeholder, customStringDynamicOverrides) {
    apexId += "_description" // so we don't have to type it out everywhere
    // Can't pass in null, or else Coherent crashes Unity
    if (placeholder == null) placeholder = ""
    if (customStringDynamicOverrides == null) customStringDynamicOverrides = []
    var isConverted = false
    if (_.startsWith(apexId, "_c_")) {
        isConverted = true
        apexId = apexId.substring("_c_".length, apexId.length)
    }

    var lsp = locTable[apexId]

    if (!isUnityHost) {
        lsp = {
            apexId: "placeholder_apexId",
            descriptionText: placeholder,
            customStrings: [ "", "", "", "", "" ]
        }
    }

    if (lsp == null) {
        if (isConverted) return placeholder
        console.error("Missing lsp for apexId: " + apexId)
        return "missingstr"
    }

    // Safety check
    if (lsp.descriptionText == null) {
        console.error("Missing descriptionText for lsp: " + JSON.stringify(lsp))
        return "missingstr"
    }

    // Safety check
    if (lsp.customStrings == null) {
        console.error("Missing customStrings for lsp: " + JSON.stringify(lsp))
        return "missingstr"
    }

    // Safety check
    if (customStringDynamicOverrides.length > lsp.customStrings.length)
    {
        console.error("Passed in too many customStringDynamicOverrides (" + customStringDynamicOverrides.length + "), expected a max of: " + lsp.customStrings.length);
        return "";
    }

    // Dynamic overrides always overwrite static ones
    for (var i = 0; i < customStringDynamicOverrides.length; i++) {
        //console.log("found dynamic override: " + customStringDynamicOverrides[i])
        lsp.customStrings[i] = customStringDynamicOverrides[i];
    }

    // Start with descriptionText then replace any $params
    var result = lsp.descriptionText
    for (var i = 0; i < lsp.customStrings.length; i++) {
        if (lsp.customStrings[i] == null || lsp.customStrings[i].length == 0) continue
        //console.log("evaluating " + result + " tryna replace: " + "$" + (i + 1) + " with " + lsp.customStrings[i])
        result = result.replaceAll(("$" + (i + 1)), lsp.customStrings[i])
        //console.log("result after: " + result)
    }

    return result
}

// Parallel implementation of AENatives > Misc > Localization.FetchProperName
var locName = function (apexId, placeholder) {
    apexId += "_description" // so we don't have to type it out everywhere
    // Can't pass in null, or else Coherent crashes Unity
    if (placeholder == null) placeholder = ""

    // Advanced/special case for language stuff, kinda smelly tbh
    // see convertDisplayNameToApexId
    var isConverted = false
    if (_.startsWith(apexId, "_c_")){
        isConverted = true
        apexId = apexId.substring("_c_".length, apexId.length)
    }

    var lsp = locTable[apexId]

    if (!isUnityHost) {
        lsp = {
            apexId: "placeholder_apexId",
            properName: placeholder,
        }
    }

    if (lsp == null) {
        if (isConverted) return placeholder
        console.error("Missing lsp for apexId: " + apexId)
        return "missingstr"
    }

    return lsp.properName
}

// E.g. "Brazilian Portuguese" becomes "_c_brazilian_portuguese"
// E.g. "Borderless Windowed" becomes "_c_borderless_windowed"
// this is so options can be stored in nice-to-view formats ?
var convertDisplayNameToApexId = function (displayName) {
    var result = displayName.toLowerCase()
    result = "_c_" + result.replaceAll(' ', '_')

    //console.log('convertDisplayNameToApexId ' + displayName + ' --> ' + result)

    return result
}

var getFlagHtml = function (locFieldName) {
    if (locFieldName == "_c_english")
        return "<img class='flag-icon' src='lib/flags/4x3/us.svg'>"
    if (locFieldName == "_c_chinese_simplified")
        return "<img class='flag-icon' src='lib/flags/4x3/cn.svg'>"
    if (locFieldName == "_c_chinese_traditional")
        return "<img class='flag-icon' src='lib/flags/4x3/tw.svg'>"
    if (locFieldName == "_c_korean")
        return "<img class='flag-icon' src='lib/flags/4x3/kr.svg'>"
    if (locFieldName == "_c_portuguese_br")
        return "<img class='flag-icon' src='lib/flags/4x3/br.svg'>"
    if (locFieldName == "_c_german")
        return "<img class='flag-icon' src='lib/flags/4x3/de.svg'>"
    if (locFieldName == "_c_russian")
        return "<img class='flag-icon' src='lib/flags/4x3/ru.svg'>"
    if (locFieldName == "_c_japanese")
        return "<img class='flag-icon' src='lib/flags/4x3/jp.svg'>"
    if (locFieldName == "_c_latvian")
        return "<img class='flag-icon' src='lib/flags/4x3/lv.svg'>"
    if (locFieldName == "_c_polish")
        return "<img class='flag-icon' src='lib/flags/4x3/pl.svg'>"
    if (locFieldName == "_c_spanish")
        return "<img class='flag-icon' src='lib/flags/4x3/es.svg'>"
    if (locFieldName == "_c_spanish_c")
        return "<img class='flag-icon' src='lib/flags/4x3/es.svg'>"
    if (locFieldName == "_c_swedish")
        return "<img class='flag-icon' src='lib/flags/4x3/se.svg'>"
    if (locFieldName == "_c_dutch")
        return "<img class='flag-icon' src='lib/flags/4x3/nl.svg'>"
    if (locFieldName == "_c_french")
        return "<img class='flag-icon' src='lib/flags/4x3/fr.svg'>"
    if (locFieldName == "_c_turkish")
        return "<img class='flag-icon' src='lib/flags/4x3/tr.svg'>"
    if (locFieldName == "_c_lithuanian")
        return "<img class='flag-icon' src='lib/flags/4x3/lt.svg'>"

    return ""
}


// If we don't have a font here, then use English font
var getLocalizedFontName = function (language) {
    language = language.toLowerCase()
    switch(language) {
        case 'english':
        case 'korean':
        case 'japanese':
        case 'russian':
        case 'chinese_simplified':
        case 'chinese_traditional':
        case 'ukrainian': // v7.07
        case 'persian': // v8.00
        case 'arabic': // v8.02
            return 'MenuFont_' + language
        default:
            return 'MenuFont_english'
    } 
}

var getLocalizedMenuTitle = function (viewName) {
    viewName = viewName.toLowerCase()

    switch (viewName) {
        case 'myprofile':
        case 'leaderboardprofile':
        case 'postgameprofile':
        case 'ingameprofile':
        case 'guildplayerprofile':
            viewName = 'profile'
            break
        case 'ingameprofileguild':
        case 'profileguild':
        case 'leaderboardguild':
            viewName = 'guild'
            break
        case 'campaignmap':
            viewName = 'campaign'
            break
        case 'openingsmatchhistory':
            viewName = 'matchhistory'
            break
        case 'initialexperience':
        case 'extragoldvariants':
        case 'modevoting':
            return ''
    }

    // Default case
    return loc(viewName, viewName)
}

var getLocalizedRankName = function (ratingClass, isClassic) {
    ratingKey = ratingClass.toLowerCase().replaceAll('rating-', '')

    var rankName = ''

    switch (ratingKey) {
        case 'none':
            rankName = loc('unranked_rank', 'unranked_rank')
            break
        case 'seniormaster':
            rankName = loc('senior_master_rank', 'senior_master_rank')
            break
        default:
            rankName = loc(ratingKey + '_rank', ratingKey + '_rank')
            break
    }

    return React.createElement('span', {},
        React.createElement('span', { className: ratingClass }, rankName),
        ' (' + getDisplayedEloRange(ratingClass, isClassic) + ')'
    )
}

var getDisplayedEloRange = function (ratingClass, isClassic) {
    switch (ratingClass) {
        case 'rating-none':
            return isClassic ? '0-999' : '0-999'
        case 'rating-bronze':
            return isClassic ? '1000-1199' : '1000-1199'
        case 'rating-silver':
            return isClassic ? '1200-1399' : '1200-1399'
        case 'rating-gold':
            return isClassic ? '1400-1599' : '1400-1599'
        case 'rating-platinum':
            return isClassic ? '1600-1799' : '1600-1799'
        case 'rating-diamond':
            return isClassic ? '1800-2099' : '1800-1999'
        case 'rating-expert':
            return isClassic ? '2100-2499' : '2000-2199'
        case 'rating-master':
            return isClassic ? '2500-2999' : '2200-2399'
        case 'rating-seniormaster':
            return isClassic ? '3000-3499' : '2400-2599'
        case 'rating-grandmaster':
            return isClassic ? '3500-3999' : '2600-2799'
        case 'rating-legend':
            return isClassic ? '4000+' : '2800+'
        return '?'
    }
}


// Must be the last line
console.log('OnReadyForLocalizationDefinitions')
engine.call('OnReadyForLocalizationDefinitions')