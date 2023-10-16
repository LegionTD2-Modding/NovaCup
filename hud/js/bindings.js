// Bindings should consist purely of engine.on() listeners
// This is how the GameClient ("client") talks to the GameClientUI ("view")
// ===============================================================================

console.log("--- START LOADING BINDINGS --- ")

// Common naming conventions/prefixes
// app_     : for globally triggerable events (in lib/aeon/js/bindings.js)
// enable*  : for showing/hiding something
// click*   : for something in response to a direct click or hotkey from the game
// refresh* : for something that updates rapidly (sometimes at framerate)
// set*     : for setting a bunch of properties (typically done sporadically)
// toggle*  : for toggling something on/off with the same event

// note: global state is moved to global-state.js

var bindings = {
    // Always on
    enableHud: Function.prototype,
    enableWallpaper: Function.prototype,
    setHudVisible: Function.prototype,
    setBackgroundImageOverride: Function.prototype,
    setBaseBackground: Function.prototype,
    refreshRandomizeBackground: Function.prototype,
    refreshRandomizeGameCoach: Function.prototype,
    enableHome: Function.prototype,
    enableCinematicMode: Function.prototype,
    clickHome: Function.prototype,
    clickAction: Function.prototype,
    rightClickAction: Function.prototype,
    setHudBackground: Function.prototype,
    setHudTheme: Function.prototype,
    refreshScreenResolution: Function.prototype,
    refreshVersionNumber: Function.prototype,

    // Data sources
    refreshUnitHp: [],
    refreshUnitMana: [],
    refreshUnitBuffs: [],

    // Popout
    enablePopout: Function.prototype,
    setTargetProperties: Function.prototype,
    refreshTargetBonusDamage: Function.prototype,
    refreshTargetDamageReduction: Function.prototype,
    refreshTargetArmorTypeTooltip: Function.prototype,
    refreshTargetBuffs: Function.prototype,
    refreshTargetAttackTarget: Function.prototype,

    // Match Modifiers
    refreshMatchModifiers: Function.prototype,

    // In Game Coach
    refreshInGameCoachDialogue: Function.prototype,
    enableInGameCoach: Function.prototype,
    setInGameCoachActive: Function.prototype,
    hideInGameCoachAfterDelay: Function.prototype,

    // Screen
    refreshGold: Function.prototype,
    refreshMythium: Function.prototype,
    refreshSupply: Function.prototype,
    refreshSupplyCap: Function.prototype,
    refreshResourceIncomeImage: Function.prototype,
    refreshResourceMythiumImage: Function.prototype,
    refreshMythiumGatherRate: Function.prototype,
    refreshGoldRemaining: Function.prototype,
    refreshEstimatedMythium: Function.prototype,

    // Actions
    enableActionTooltip: [],
    refreshActionStock: [],
    refreshActionText: [],
    refreshActionQueue: [],
    refreshActionPurchasingQueue: [],
    startActionCountdown: [],
    startActionProgress: [],
    showExtendedActionTooltip: [],

    // Modules
    startModuleDrag: [],
    enableModuleDragging: [],
    setModulePosition: [],
    resetModulePosition: [],

    // Dashboard
    refreshDashboardActions: Function.prototype,
    refreshRecommendedValues: Function.prototype,
    disableRecommendedValues: Function.prototype,

    // Glovebox
    enableGlovebox: Function.prototype,
    refreshGloveboxActions: Function.prototype,
    toggleGloveboxLock: Function.prototype,
    disableGlovebox: Function.prototype,

    // Windshield
    enableWindshield: Function.prototype,
    resetWindshield: Function.prototype,
    refreshWindshieldActions: Function.prototype,
    toggleWindshieldLock: Function.prototype,
    refreshWindshieldDefender: Function.prototype,
    disableWindshield: Function.prototype,
    refreshWindshieldCalloutText: Function.prototype,
    refreshAutosendEnabled: Function.prototype,

    // Masthead
    enableLeftKing: Function.prototype,
    setLeftKingProperties: Function.prototype,
    enableRightKing: Function.prototype,
    setRightKingProperties: Function.prototype,
    refreshLeftKingMaxHp: Function.prototype,
    refreshRightKingMaxHp: Function.prototype,
    refreshWaveTime: Function.prototype,
    startWaveTimer: Function.prototype,
    refreshWestEnemiesRemaining: Function.prototype,
    refreshEastEnemiesRemaining: Function.prototype,
    setEnableWaveInfoTooltip: Function.prototype,
    refreshTeamGold: Function.prototype,
    refreshKingUpgrades: Function.prototype,
    refreshMastheadText: Function.prototype,
    refreshMastheadBuildCursorXy: Function.prototype,
    refreshMastheadWavesBar: Function.prototype,
    refreshMastheadPauseValue: Function.prototype,

    // Minimap
    startMinimapDrag: Function.prototype,
    setMinimapLocation: Function.prototype,
    setMinimapSize: Function.prototype,
    setMinimapImage: Function.prototype,
    setMinimapStats: Function.prototype,
    setMinimapScale: Function.prototype,
    flipMinimapFix: Function.prototype,

    // Spells
    enablePowerupsWindow: Function.prototype,
    refreshPowerupChoices: Function.prototype,
    refreshPowerupUsed: Function.prototype,
    refreshPowerupsWindowTooltip: Function.prototype,
    refreshPowerupUnlockPercent: Function.prototype,

    // Pings
    enablePingChooser: Function.prototype,
    setPingChooserImage: Function.prototype,
    refreshPingWheelItems: Function.prototype,
    setPingChooserHoverIndex: Function.prototype,
    activatePingChooserIndex: Function.prototype,
    mouseoverPingChooser: Function.prototype,

    // Emotes
    enableEmoteChooser: Function.prototype,
    refreshEmoteChooserItems: Function.prototype,
    activateEmoteChooserIndex: Function.prototype,
    showEmote: Function.prototype,
    setEmoteButtonEnabled: Function.prototype,

    // Scoreboard
    enableScoreboard: Function.prototype,
    refreshScoreboard: Function.prototype,
    refreshScoreboardResourcesOnly: Function.prototype,
    refreshTimeElapsed: Function.prototype,
    refreshEnemyPlayers: Function.prototype,
    refreshMutedPlayers: Function.prototype,
    refreshPingMutedPlayers: Function.prototype,
    refreshMatchmakerQueue: Function.prototype,
    refreshHasEnemyHumans: Function.prototype,
    autoscrollScoreboardEvents: Function.prototype,
    updateGridUnitTooltip: Function.prototype,
    setEnemyFightersViewEnabled: Function.prototype,

    // Mini Scoreboard
    refreshPlayerScores: Function.prototype,

    // Stackrank
    refreshPlayerStackrank: Function.prototype,
    toggleStackrank: Function.prototype,
    enableStackrank: Function.prototype,

    // Feeds
    addFeedMessage: Function.prototype,
    closeFeedMessage: Function.prototype,
    removeFeedMessage: Function.prototype,
    clearFeed: Function.prototype,

    // Kill Tracker
    addKillTrackerMessage: Function.prototype,
    closeKillTrackerMessage: Function.prototype,
    removeKillTrackerMessage: Function.prototype,
    clearKillTracker: Function.prototype,

    // Watermark
    refreshWatermarkText: Function.prototype,
    refreshWatermarkValue: Function.prototype,

    // Client Watermark
    refreshClientWatermarkText: Function.prototype,

    // Client
    loadView: Function.prototype,
    setMenuRoot: Function.prototype,
    setMenuRootOnce: Function.prototype,
    blurView: Function.prototype,
    blurPopup: Function.prototype,
    blurFullScreenPopup: Function.prototype,
    goBack: Function.prototype,
    selectMenu: Function.prototype,
    activateMenu: [],
    selectSubmenu: Function.prototype,
    selectInlineSubmenu: Function.prototype,
    resetVideos: Function.prototype,
    activateSubmenu: [],
    activateInlineSubmenu: [],
    activateSubmenuButton: [],
    activateInlineSubmenuButton: [],
    applyMenuChanges: Function.prototype,
    setUsername: Function.prototype,
    setPassword: Function.prototype,
    closeWindow: Function.prototype,
    startSearchGame: Function.prototype,
    cancelSearchGame: Function.prototype,
    tryCancelSearchGame: Function.prototype,
    enableHurryUpSearch: Function.prototype,
    hurryUpSearch: Function.prototype,
    refreshExtraSearchText: Function.prototype,
    foundGame: Function.prototype,
    refreshSidebarProfile: Function.prototype,
    refreshFriends: Function.prototype,
    refreshInvites: Function.prototype,
    refreshParty: Function.prototype,
    refreshPartyRating: Function.prototype,
    openContextMenu: Function.prototype,
    closeContextMenu: Function.prototype,
    setContextMenuPosition: Function.prototype,
    setPlayersOnline: Function.prototype,
    setClientVersion: Function.prototype,
    setCurrentLobbyId: Function.prototype,
    updateLobbyClockTime: Function.prototype,
    enableVideoRendering: Function.prototype,
    refreshClientModifiers: Function.prototype,
    refreshCurrency: Function.prototype,
    refreshCardFragments: Function.prototype,
    refreshCardTraderRerolls: Function.prototype,
    automaticallyShowChatWindows: Function.prototype,

    // Legion select
    refreshLegionSelectTimer: Function.prototype,
    refreshMastermindVariantsTimer: Function.prototype,

    // Loading screen
    refreshLoadingProgress: Function.prototype,
    refreshLoadingSticker: [],
    refreshLoadingStickerProgress: [],
    refreshLeftTeamLoadingMessage: Function.prototype,
    refreshRightTeamLoadingMessage: Function.prototype,
    refreshLoadingTip: Function.prototype,
    refreshLoadingTip2: Function.prototype,

    loadPopup: Function.prototype,
    loadPopupExplicit: Function.prototype,
    hidePopup: Function.prototype,
    submitPopupMenuInput: Function.prototype,
    showFullScreenPopup: Function.prototype,
    hideFullScreenPopup: Function.prototype,

    // Custom game menu
    setCustomGameSlot: [],
    setCustomGameSlotDetails: [],
    onCustomGameMenuLoaded: Function.prototype,
    setCustomGameOwner: Function.prototype,
    setCustomGameHumanCount: Function.prototype,
    setCustomGameSettings: Function.prototype,
    setBanSlot: [],
    setBanSelections: [],

    // Browser menu
    refreshBrowserRooms: Function.prototype,
    setSelectedBrowserRoom: Function.prototype,
    fakeBrowserRoomLoading: Function.prototype,

    // Guilds
    requestGuildName: Function.prototype,
    requestGuildAbbreviation: Function.prototype,
    refreshGuildDirectory: Function.prototype,
    setSelectedGuildEntry: Function.prototype,
    refreshInvitationsList: Function.prototype,
    setSelectedInvitation: Function.prototype,
    refreshEmblem: Function.prototype,

    // Chat
    showBottomBar: Function.prototype,
    refreshChatConnectionStatus: Function.prototype,
    setChatRoomProperties: Function.prototype,
    //receiveChatRoomMessage: Function.prototype,
    renderChatRoomSubscribers: Function.prototype,
    toggleChat: [],
    enableChat: [],
    enableGlobalChat: Function.prototype,
    writeChatOutput: [],
    refreshChatInput: [],
    autoscrollChatOutput: Function.prototype,
    clearChat: [],
    enableClientMenuPopout: Function.prototype,
    refreshTwitchStreams: Function.prototype,
    refreshTwitchStreamCount: Function.prototype,
    enableTwitchPopout: Function.prototype,
    forceDisablePreview: Function.prototype,
    showTopBar: Function.prototype,
    enableChatAutoFill: [],

    // Preview: Global Chat
    updatePreviewOptions: [],
    updatePreviewDropdownPosition: [],
    updateMarkedPreview: [],
    updateAndUsePreview: [],
    switchMarkedPreviewByArrowKeys: [],

    // Profile
    viewProfile: Function.prototype,
    refreshProfile: Function.prototype,
    refreshInventory: Function.prototype,
    showProfileLoading: Function.prototype,
    forceSetProfilePlayFabId: Function.prototype,

    // Guild
    refreshGuild: Function.prototype,
    showDonateCardMenu: Function.prototype,

    // Leaderboards
    refreshLeaderboard: [],
    refreshTopCountries: [],
    refreshLeaderboardActiveStat: Function.prototype,

    // Options
    refreshHotkeyList: Function.prototype,
    setOptionEnabled: [],

    // Post game stats
    refreshPostGameStats: Function.prototype,
    refreshPostGameWaves: Function.prototype,
    refreshPostGameBuilds: Function.prototype,
    refreshPostGameGraphs: Function.prototype,

    // Reroll
    showRerollWindow: Function.prototype,
    hideRerollWindow: Function.prototype,
    showReadyButton: Function.prototype,
    hideReadyButton: Function.prototype,
    refreshRerollHint: Function.prototype,
    refreshRerollShowExtended: Function.prototype,
    updateReadyPlayers: Function.prototype,

    // Guide
    refreshGuideWaves: Function.prototype,
    enableGuideWaves: Function.prototype,
    toggleGuideWaves: Function.prototype,
    enableGuideAttackTypes: Function.prototype,
    toggleGuideAttackTypes: Function.prototype,
    refreshDamageTracker: Function.prototype,
    enableDamageTracker: Function.prototype,
    toggleDamageTracker: Function.prototype,

    // Singleplayer
    refreshSingleplayerMissions: Function.prototype,
    setSingleplayerMissionIndex: Function.prototype,
    renderTutorialArrowText: [],
    updateGroundArrowTextPosition: Function.prototype,
    refreshObjectives: Function.prototype,
    updateBackToLane: Function.prototype,

    // Legal Docs
    refreshPrivacyPolicy: Function.prototype,

    // News popup
    refreshNews: Function.prototype,
    getNextNews: Function.prototype,

    popupCheckboxToggled: Function.prototype,

    // Spectator Scoreboard
    refreshSpectatorScoreboard: Function.prototype,
    refreshSpectatorLeaks: Function.prototype,
    toggleSpectatorScoreboardView: Function.prototype,

    // Season
    refreshRankedSeason: Function.prototype,

    // Codex
    refreshCodexContent: Function.prototype,
    refreshCodexSelectedUnit: Function.prototype,
    refreshCodexSelectedHelp: Function.prototype,

    // Lag indicator
    enableLagIndicator: Function.prototype,

    // Throttle indicator
    enableThrottleIndicator: Function.prototype,

    // inbox
    refreshInboxMessages: Function.prototype,
    enableInboxPopout: Function.prototype,

    // Matchmaking heartbeat
    enteringMatchmakingHeartbeat: Function.prototype,

    // Shop
    refreshSelectedSkin: Function.prototype,
    refreshCatalog: [],
    forceRefreshShopView: Function.prototype,
    refreshSelectedCosmetic: Function.prototype,
    setCardWizardBackgroundAnimationState: Function.prototype,
    setCardWizardCardInfo: Function.prototype,

    // Mastermind variant
    refreshIconSelectionItems: Function.prototype,

    // Weekly challenge
    refreshWeeklyChallengeView: Function.prototype,

    // Weekly challenge
    refreshFeaturedModeView: Function.prototype,

    // Campaign
    refreshCampaignMap: Function.prototype,
    setSelectedCampaignMissionNumber: Function.prototype,
    setHoveredCampaignMissionNumber: Function.prototype,
    setCampaignFirstUnclearedMissionNumber: Function.prototype,
    setCampaignEnabled: Function.prototype,
    refreshTotalStars: Function.prototype,

    // Friends
    refreshFriendInvitationMenu: Function.prototype,
    handleInvitedFriend: Function.prototype,
    refreshFriendInvitationFriendsList: Function.prototype,

    // Leaderboard openings
    refreshLeaderboardOpenings: Function.prototype,

    // Announcement
    refreshAnnouncement: Function.prototype,
    refreshAnnouncementEnabled: Function.prototype,
    refreshSubAnnouncement: Function.prototype,
    refreshSubAnnouncementEnabled: Function.prototype,

    // Misc postgame stuff
    forceRefreshPostgame: [],

    // Tab helper
    onScrollbarMouseDown: [],
    onScrollbarMouseUp: [],

    // Versus
    enableVersus: Function.prototype,
    refreshVersusInfo: Function.prototype,
    refreshMasteries: Function.prototype,

    // Mode Voting
    refreshModeCheckedState: Function.prototype,
    refreshModeVotingPlayerStates: Function.prototype,
    refreshSpecialModeIndex: Function.prototype,
    refreshModeVotingTimer: Function.prototype,
    refreshModePickedState: Function.prototype,
    setModeVotingActive: Function.prototype,
    refreshHotModeIndex: Function.prototype,

    // Creator Code
    refreshCreatorCodePercentText: Function.prototype,

    // Limited Time Event
    refreshCurrentQuest: Function.prototype,

    // Menu
    getTournamentMenu: Function.prototype,

    // Tournament
    tournamentEnabled: true,
    tournamentNova: 'NovaCup',
    tournamentSubtitle: 'October 2023'
}

// Always on
engine.on('setPlayFabId', function (playFabId) { globalState.playFabId = playFabId })
engine.on('disconnectFromServer', function () { engine.call('OnDisconnectFromServer') })
engine.on('enableHud', function (enabled) { bindings.enableHud(enabled) })
engine.on('enableWallpaper', function (enabled) {
    bindings.enableWallpaper(enabled)
    bindings.setHudVisible(!enabled)
})
engine.on('setBackgroundImageOverride', function (imageOverride) { bindings.setBackgroundImageOverride(imageOverride) })
engine.on('setBaseBackground', function (image) { bindings.setBaseBackground(image) })
engine.on('refreshRandomizeBackground', function (enabled) {
    console.log('refreshRandomizeBackground: ' + enabled)
    globalState.randomizeBackground = enabled
    bindings.refreshRandomizeBackground()
})
engine.on('refreshRandomizeGameCoach', function (enabled) {
    console.log('refreshRandomizeGameCoach: ' + enabled)
    globalState.randomizeGameCoach = enabled
    bindings.refreshRandomizeGameCoach()
})
engine.on('enableCinematicMode', function (enabled) { bindings.enableCinematicMode(enabled) })
engine.on('clickAction', function (actionId) { bindings.clickAction(actionId) })
engine.on('rightClickAction', function (actionId, mouseDown) {
    if (mouseDown)
        bindings.rightClickAction(actionId)
})
engine.on('showExtendedTooltip', function (actionId, mouseDown) {
    if (typeof bindings.showExtendedActionTooltip[actionId] === "function") {
        bindings.showExtendedActionTooltip[actionId](mouseDown)
    }
})
engine.on('enableHome', function (enabled) { bindings.enableHome(enabled) })
engine.on('clickHome', function () { bindings.clickHome() })
engine.on('enableAiming', function (enabled) {
    globalState.aiming = enabled
    engine.trigger('exitWindshieldArea')
    engine.trigger('exitGloveboxArea')
})
engine.on('enableAltHeld', function (enabled) { globalState.isAltHeld = enabled })
engine.on('enableCtrlHeld', function (enabled) { globalState.isCtrlHeld = enabled })
engine.on('enableShiftHeld', function (enabled) { globalState.isShiftHeld = enabled })
engine.on('setHudBackground', function (imagePath) {
    bindings.setHudBackground(imagePath)
})
engine.on('setHudTheme', function (theme) {
    globalState.hudTheme = theme
    bindings.setHudTheme(theme)
})
engine.on('setSpectatorMode', function (enabled) {
    globalState.isSpectatorMode = enabled
    engine.trigger('toggleWindshieldLock')
    engine.trigger('toggleGloveboxLock')
    engine.trigger('refreshGlovebox')
    engine.trigger('refreshDashboardActions', [])
    engine.trigger('enableHome', false)
    engine.trigger('refreshGold', 0)
    engine.trigger('setMinimapStats', 0, 0, 0)
    engine.trigger('enablePowerupsWindow', false)
    engine.trigger('refreshRecommendedValues', 0, 0, 0, {
        redMin: 0,
        yellowMin: 0,
        greenMin: 0,
        greenMax: 0,
        yellowMax: 0,
        redMax: 0,
        thresholdPercents: [0.60, 0.70, 0.80, 0.90, 1.10, 1.20, 1.30, 1.40]
    })
    engine.trigger('setEmoteButtonEnabled', !enabled)
})

engine.on('refreshScreenResolution', function (width, height) {
    console.log('refreshScreenResolution to ' + width + ', ' + height)
    globalState.screenWidth = width
    globalState.screenHeight = height

    if (height < 800)
        globalState.smallResolution = true
    else
        globalState.smallResolution = false

    engine.trigger('enableHud', true)
})

engine.on('refreshIsMac', function (enabled) {
    globalState.isMac = enabled
})

// Don't rely on this value for any logic, since we sometimes override this with announcements like Nova Cup
engine.on('refreshVersionNumber', function (version) {
    console.log('refreshed version number: ' + version)
    globalState.versionNumber = version
})

engine.on('renderTick', function () {
    renderEvents()
})

engine.on('refreshPatchNotesImage', function (imageUrl) {
    console.log('refreshPatchNotesImage: ' + imageUrl)
    globalState.patchNotesImage = imageUrl
})

engine.on('refreshPatchNotesDate', function (dateString) {
    console.log('refreshPatchNotesDate: ' + dateString)
    globalState.patchNotesDate = dateString
})

engine.on('refreshPatchNotesDescription', function (description) {
    console.log('refreshPatchNotesDescription: ' + description)
    globalState.patchNotesDescription = description
})

// Popout
engine.on('enablePopout', function (enabled) { bindings.enablePopout(enabled) })
engine.on('setPopoutPosition', function (left, top) { bindings.setPopoutPosition(left, top) })
engine.on('refreshTargetBonusDamage', function (value) { bindings.refreshTargetBonusDamage(value) })
engine.on('refreshTargetDamageReduction', function (text) { bindings.refreshTargetDamageReduction(text) })
engine.on('refreshTargetArmorTypeTooltip', function (value) { bindings.refreshTargetArmorTypeTooltip(value) })
engine.on('refreshTargetBuffs', function (values) { bindings.refreshTargetBuffs(values) })
engine.on('setTargetProperties', function (properties) { bindings.setTargetProperties(properties) })
engine.on('setAdditionalTargets', function (targetProps) { console.log("Not implemented yet") })
engine.on('refreshTargetAttackTarget', function (value) { bindings.refreshTargetAttackTarget(value) })

// Match Modifiers
engine.on('refreshMatchModifiers', function (modifiers) { bindings.refreshMatchModifiers(modifiers) })

// In Game Coach
engine.on('refreshInGameCoachDialogue', function (message) { bindings.refreshInGameCoachDialogue(message) })
engine.on('enableInGameCoach', function (enabled) { bindings.enableInGameCoach(enabled) })
engine.on('setInGameCoachActive', function (active) { bindings.setInGameCoachActive(active) })
engine.on('hideInGameCoachAfterDelay', function (delay) { bindings.hideInGameCoachAfterDelay(delay) })


// Screen
engine.on('refreshGold', function (value) { bindings.refreshGold(value) })
engine.on('refreshMythium', function (value) { bindings.refreshMythium(value) })
engine.on('refreshSupply', function (value) { bindings.refreshSupply(value) })
engine.on('refreshSupplyCap', function (value) { bindings.refreshSupplyCap(value) })
engine.on('refreshResourceIncomeImage', function (image) { bindings.refreshResourceIncomeImage(image) })
engine.on('refreshResourceMythiumImage', function (image) { bindings.refreshResourceMythiumImage(image) })
engine.on('refreshMythiumGatherRate', function (rate) { bindings.refreshMythiumGatherRate(rate) })
engine.on('enableHomeButton', function (enabled) { bindings.enableHomeButton(enabled) })
engine.on('refreshGoldRemaining', function (goldNextWave, goldRemaining, income, goldRushGold) { bindings.refreshGoldRemaining(goldNextWave, goldRemaining, income, goldRushGold) })
engine.on('refreshEstimatedMythium', function (estimatedTotalMythium) { bindings.refreshEstimatedMythium(estimatedTotalMythium) })

// Actions
engine.on('enableActionTooltip', function (actionId, enabled) {
    if (actionId < 1 || actionId >= bindings.enableActionTooltip.length) return
    if (typeof bindings.enableActionTooltip[actionId] === "function") {
        bindings.enableActionTooltip[actionId](enabled)
        if (enabled)
            engine.call("OnShowTooltip", actionId)
    }
})
engine.on('refreshActionStock', function (actionId, value) {
    if (actionId < 1 || actionId >= bindings.refreshActionStock.length) return
    if (typeof bindings.refreshActionStock[actionId] === "function")
        bindings.refreshActionStock[actionId](value)
})
engine.on('refreshActionQueue', function (actionId, value) {
    if (actionId < 1 || actionId >= bindings.refreshActionQueue.length) return
    if (typeof bindings.refreshActionQueue[actionId] === "function")
        bindings.refreshActionQueue[actionId](value)
})
engine.on('refreshActionPurchasingQueue', function (actionId, value) {
    if (actionId < 1 || actionId >= bindings.refreshActionPurchasingQueue.length) return
    if (typeof bindings.refreshActionPurchasingQueue[actionId] === "function")
        bindings.refreshActionPurchasingQueue[actionId](value)
})
engine.on('refreshActionText', function (actionId, initial, seconds) {
    if (actionId < 1 || actionId >= bindings.refreshActionText.length) return
    if (typeof bindings.refreshActionText[actionId] === "function")
        bindings.refreshActionText[actionId](initial, seconds)
})
engine.on('startActionCountdown', function (actionId, initial, seconds) {
    if (actionId < 1 || actionId >= bindings.startActionCountdown.length) return
    if (typeof bindings.startActionCountdown[actionId] === "function")
        bindings.startActionCountdown[actionId](initial, seconds)
})
engine.on('startActionProgress', function (actionId, initial, seconds) {
    if (actionId < 1 || actionId >= bindings.startActionProgress.length) return
    if (typeof bindings.startActionProgress[actionId] === "function")
        bindings.startActionProgress[actionId](initial, seconds)
})

// Data sources
engine.on('refreshUnitHp', function (unitId, amount) {
    if (unitId < 1 || unitId >= bindings.refreshUnitHp.length) return
    if (typeof bindings.refreshUnitHp[unitId] === "function")
        bindings.refreshUnitHp[unitId](amount)
})

engine.on('refreshUnitMana', function (unitId, amount) {
    if (unitId < 1 || unitId >= bindings.refreshUnitMana.length) return
    if (typeof bindings.refreshUnitMana[unitId] === "function")
        bindings.refreshUnitMana[unitId](amount)
})

// Modules
engine.on('startModuleDrag', function (moduleId) {
    if (moduleId < 1 || moduleId >= bindings.startModuleDrag.length) return
    if (typeof bindings.startModuleDrag[moduleId] === "function")
        bindings.startModuleDrag[moduleId]()
})
engine.on('setModulePosition', function (moduleId, left, top) {
    if (typeof bindings.setModulePosition[moduleId] === "function") {
        bindings.setModulePosition[moduleId](left, top)
    } else {
        console.warn("setModulePosition called with invalid moduleId: " + moduleId + ", was missing from table")
    }

    globalState.modulePositionDefaults[moduleId + "_left"] = left
    globalState.modulePositionDefaults[moduleId + "_top"] = top
})
engine.on('resetModulePosition', function (moduleId) {
    if (moduleId < 1 || moduleId >= bindings.resetModulePosition.length) return
    if (typeof bindings.resetModulePosition[moduleId] === "function")
        bindings.resetModulePosition[moduleId]()
})
engine.on('resetDefaultLayout', function () {
    console.log('Reset HUD default layout')
    engine.call('OnPreResetDefaultUILayout')

    for (var moduleId in bindings.resetModulePosition)
        engine.trigger('resetModulePosition', moduleId)

    engine.call('OnResetDefaultUILayout')
})

engine.on('enableAllModuleDragging', function (enabled) {
    console.log('Enable all module dragging: ' + enabled)
    for (var moduleId in bindings.enableModuleDragging)
        bindings.enableModuleDragging[moduleId](enabled)
})

// Dashboard
engine.on('refreshDashboardActions', function (actions) { bindings.refreshDashboardActions(actions) })
engine.on('refreshRecommendedValues', function (waveNumber, currentValue, recommendedValue, thresholds) {
    bindings.refreshRecommendedValues(waveNumber, currentValue, recommendedValue, thresholds)
})
engine.on('disableRecommendedValues', function () { bindings.disableRecommendedValues() })
engine.on('refreshWaveNumber', function (waveNumber) { globalState.waveNumber = waveNumber })

// Windshield
engine.on('enableWindshield', function (enabled) { bindings.enableWindshield(!globalState.aiming && enabled) })
engine.on('resetWindshield', function () { bindings.resetWindshield() })
engine.on('toggleWindshieldLock', function () {
    engine.call("OnClickBigButton")
    bindings.toggleWindshieldLock()
})
engine.on('refreshWindshieldActions', function (actions) { bindings.refreshWindshieldActions(actions) })
engine.on('setWindshieldPosition', function (left, top) { bindings.setWindshieldPosition(left, top) })
engine.on('refreshWindshieldDefender', function (defenderName) { bindings.refreshWindshieldDefender(defenderName) })
engine.on('disableWindshield', function (message) { bindings.disableWindshield(message) })
engine.on('refreshPowerupCalloutText', function (text, effectType, fontSize) { bindings.refreshPowerupCalloutText(text, effectType, fontSize) })
engine.on('refreshAutosendEnabled', function (enabled) { bindings.refreshAutosendEnabled(enabled) })

// Glovebox
engine.on('refreshGlovebox', function () { bindings.refreshGlovebox() })
engine.on('enableGlovebox', function (enabled) { bindings.enableGlovebox(!globalState.aiming && enabled) })
engine.on('toggleGloveboxLock', function () {
    engine.call("OnClickBigButton")
    bindings.toggleGloveboxLock()
})
engine.on('refreshGloveboxActions', function (actions) { bindings.refreshGloveboxActions(actions) })
engine.on('disableGlovebox', function (actions) { bindings.disableGlovebox(actions) })

// Leftbox
engine.on('refreshLeftbox', function () { bindings.refreshLeftbox() })
engine.on('enableLeftbox', function (enabled) { bindings.enableLeftbox(!globalState.aiming && enabled) })
engine.on('toggleLeftboxLock', function () {
    engine.call("OnClickBigButton")
    bindings.toggleLeftboxLock()
})
engine.on('refreshLeftboxActions', function (actions) { bindings.refreshLeftboxActions(actions) })
engine.on('disableLeftbox', function (actions) { bindings.disableLeftbox(actions) })
engine.on('resetLeftbox', function () { bindings.resetLeftbox() })

// Masthead
engine.on('enableLeftKing', function (enabled) { bindings.enableLeftKing(enabled) })
engine.on('setLeftKingProperties', function (properties) { bindings.setLeftKingProperties(properties) })
engine.on('enableRightKing', function (enabled) { bindings.enableRightKing(enabled) })
engine.on('setRightKingProperties', function (properties) { bindings.setRightKingProperties(properties) })
engine.on('refreshLeftKingMaxHp', function (hp) { bindings.refreshLeftKingMaxHp(hp) })
engine.on('refreshRightKingMaxHp', function (hp) { bindings.refreshRightKingMaxHp(hp) })
engine.on('refreshWaveTime', function (value) { bindings.refreshWaveTime(value) })
engine.on('startWaveTimer', function (properties) { bindings.startWaveTimer(properties) })
engine.on('refreshWestEnemiesRemaining', function (value) { bindings.refreshWestEnemiesRemaining(value) })
engine.on('refreshEastEnemiesRemaining', function (value) { bindings.refreshEastEnemiesRemaining(value) })
engine.on('refreshMastheadText', function (value) { bindings.refreshMastheadText(value) })
engine.on('refreshMastheadBuildCursorXy', function (x, z) { bindings.refreshMastheadBuildCursorXy(x, z) })
engine.on('refreshMastheadWavesBar', function (waves) { bindings.refreshMastheadWavesBar(waves) })
engine.on('selectLeftKing', function () { engine.call('OnSelectLeftKing') })
engine.on('selectRightKing', function () { engine.call('OnSelectRightKing') })
engine.on('setEnableWaveInfoTooltip', function (enabled) { bindings.setEnableWaveInfoTooltip(enabled) })
engine.on('refreshTeamGold', function (leftGold, rightGold) { bindings.refreshTeamGold(leftGold, rightGold) })
engine.on('refreshKingUpgrades', function (leftKingUpgrades, rightKingUpgrades) { bindings.refreshKingUpgrades(leftKingUpgrades, rightKingUpgrades) })
engine.on('refreshMastheadPauseValue', function (pauseValue) { bindings.refreshMastheadPauseValue(pauseValue) })

// Minimap
engine.on('startMinimapDrag', function () { bindings.startMinimapDrag() })
engine.on('setMinimapLocation', function (x, y) { bindings.setMinimapLocation(x, y) })
engine.on('setMinimapSize', function (x, y) { bindings.setMinimapSize(x, y) })
engine.on('setMinimapImage', function (image) { bindings.setMinimapImage(image) })
engine.on('setMinimapStats', function (workers, income, value) { bindings.setMinimapStats(workers, income, value) })
engine.on('setMinimapScale', function (scale) { bindings.setMinimapScale(scale) })
engine.on('flipMinimapFix', function (enabled) { bindings.flipMinimapFix(enabled) })

// Spells
engine.on('enablePowerupsWindow', function (enabled) {
    console.log('enablePowerupsWindow ' + enabled)
    bindings.enablePowerupsWindow(enabled)
})
engine.on('refreshPowerupChoices', function (powerupChoices) { bindings.refreshPowerupChoices(powerupChoices) })
engine.on('refreshPowerupUsed', function (used) {
    bindings.refreshPowerupUsed(used)
})
engine.on('refreshPowerupsWindowTooltip', function (tooltip) { bindings.refreshPowerupsWindowTooltip(tooltip) })
engine.on('refreshPowerupUnlockPercent', function (percent) { bindings.refreshPowerupUnlockPercent(percent) })
engine.on('clickPowerup', function (apexId, isSubpowerup) {
    console.log("Clicked powerup: " + apexId)
    engine.call('OnClickPowerup', apexId, isSubpowerup)

    // moved to HudPowerups OnClickPowerup handler
    //engine.trigger('enablePowerupsWindow', false)
    //engine.trigger('refreshPowerupUsed', true)
})
engine.on('rightClickPowerup', function (apexId) {
    console.log("Right clicked powerup: " + apexId)
    engine.call('OnRightClickPowerup', apexId)
})

// Pings
engine.on('enablePingChooser', function (enabled, x, y, mini) { bindings.enablePingChooser(enabled, x, y, mini) })
engine.on('setPingChooserImage', function (image) { bindings.setPingChooserImage(image) })
engine.on('setPingChooserHoverIndex', function (index) { bindings.setPingChooserHoverIndex(index) })
engine.on('activatePingChooserIndex', function (index) { bindings.activatePingChooserIndex(index) })
engine.on('mouseoverPingChooser', function (screenX, screenY) { bindings.mouseoverPingChooser(screenX, screenY) })
engine.on('refreshPingWheelItems', function (items) { bindings.refreshPingWheelItems(items) })
engine.on('onClickPingChooser', function (index) {
    console.log("onClickPingChooser " + index)
})

// Emotes
engine.on('refreshEmoteChooserItems', function (items, showHint) {
    globalState.emoteChooserItems = items
    globalState.emoteChooserShowHint = showHint
    bindings.refreshEmoteChooserItems(items, showHint)
})
engine.on('activateEmoteChooserIndex', function (index) { bindings.activateEmoteChooserIndex(index) }) // maybe not needed
engine.on('enableEmoteChooser', function (enabled, x, y, active) { bindings.enableEmoteChooser(enabled, x, y, active) })
engine.on('showEmote', function (player, emote, animationType) { bindings.showEmote(player, emote, animationType) })
engine.on('setEmoteButtonEnabled', function (enabled) { bindings.setEmoteButtonEnabled(enabled) })

// Scoreboard
engine.on('enableScoreboard', function (enabled) {
    bindings.enableScoreboard(enabled)
    if (!isUnityHost)
        engine.trigger('refreshScoreboardInfo', testScoreboardInfo, globalState.isSpectatorMode)
})
engine.on('refreshScoreboardInfo', function (scoreboardInfo, spectator) { bindings.refreshScoreboard(scoreboardInfo, spectator) })
engine.on('refreshScoreboardResourcesOnly', function (scoreboardInfoResourcesOnly) { bindings.refreshScoreboardResourcesOnly(scoreboardInfoResourcesOnly) })


engine.on('refreshTimeElapsed', function (seconds) {
    globalState.gameTimeElapsedSeconds = seconds
    bindings.refreshTimeElapsed(seconds)
})
engine.on('refreshEnemyPlayers', function (players) { bindings.refreshEnemyPlayers(players) })
engine.on('refreshMutedPlayers', function (players) {
    globalState.mutedPlayers = players
    bindings.refreshMutedPlayers(players)
})
engine.on('refreshPingMutedPlayers', function (players) {
    bindings.refreshPingMutedPlayers(players)
})
engine.on('refreshReportedPlayers', function (players) {
    globalState.reportedPlayers = players
})
engine.on('clearThumbsUpPlayers', function () {
    globalState.thumbsUpPlayers = []
})
engine.on('refreshMatchmakerQueue', function (queue) {
    console.log('refreshMatchmakerQueue: ' + queue)
    globalState.matchmakerQueue = queue
})
engine.on('refreshHasEnemyHumans', function (hasEnemyHumans) { globalState.hasEnemyHumans = hasEnemyHumans })
engine.on('autoscrollScoreboardEvents', function () { bindings.autoscrollScoreboardEvents() })
engine.on('updateGridUnitTooltip', function (updatedText) { bindings.updateGridUnitTooltip(updatedText) })

// Mini Scoreboard
engine.on('refreshPlayerScores', function (playerScores) {
    if (playerScores == null || playerScores.length == 0) return
    bindings.refreshPlayerScores(playerScores)
})

// Stackrank
engine.on('refreshPlayerStackrank', function (playerStackrank) { bindings.refreshPlayerStackrank(playerStackrank) })
engine.on('toggleStackrank', function () { bindings.toggleStackrank() })
engine.on('enableStackrank', function (enabled) { bindings.enableStackrank(enabled) })

// In game chat
engine.on('toggleInGameChat', function () { bindings.toggleChat[ChatType.ingame]() })
engine.on('enableInGameChat', function (enabled) { bindings.enableChat[ChatType.ingame](enabled) })
engine.on('writeInGameChatOutput', function (lineContent) { bindings.writeChatOutput[ChatType.ingame](lineContent, true) })
engine.on('refreshInGameChatInput', function (lineContent) { bindings.refreshChatInput[ChatType.ingame](lineContent) })
engine.on('clearInGameChat', function () { bindings.clearChat[ChatType.ingame]() })
engine.on('forceDisablePreview', function () { bindings.forceDisablePreview() })
engine.on('refreshChatActiveState', function (enabled) { globalState.isChatActive = enabled })

// Lobby chat
engine.on('toggleChat', function () { bindings.toggleChat[ChatType.bottomBar]() })
engine.on('enableChat', function (enabled) {
    var wasEnabled = globalState.chatEnabled

    // v8.05.2 performance: only call these if changed - should help clicking around in main menu lag
    // v8.05.2 hotfix 1 to fix where the Twitch/Inbox didn't close when clicking empty space
    if (wasEnabled != enabled) {
        globalState.chatEnabled = enabled
        bindings.enableChat[ChatType.bottomBar](enabled)
    }

    if (!enabled) {
        bindings.enableClientMenuPopout(false)
        bindings.enableTwitchPopout(false)
        bindings.enableInboxPopout(false)
    }
})

engine.on('enableGlobalChat', function (enabled) {
    globalState.globalChatEnabled = enabled
    console.log('enableGlobalChat: ' + enabled)
    bindings.enableGlobalChat(enabled)
    engine.call('OnEnableGlobalChat', enabled)
})
engine.on('enableChatAutoFill', function (enabled) {
    console.log("enableChatAutoFill: " + enabled)
    bindings.enableChatAutoFill[ChatType.ingame](enabled)
    bindings.enableChatAutoFill[ChatType.bottomBar](enabled)
})
engine.on('forceUpdateChatOutput', function () { bindings.forceUpdateChatOutput() }) // v8.03.10 optimization
engine.on('writeChatOutput', function (lineContent, forceUpdate) { bindings.writeChatOutput[ChatType.bottomBar](lineContent, forceUpdate) })
engine.on('refreshChatInput', function (lineContent) { bindings.refreshChatInput[ChatType.bottomBar](lineContent) })
engine.on('autoscrollChatOutput', function () { bindings.autoscrollChatOutput() })
engine.on('enableSingleplayer', function (enabled) {
    globalState.singleplayerEnabled = enabled
})

engine.on('enableQueue1v1', function (enabled) {
    globalState.queue1v1Enabled = enabled
})

// Feeds
engine.on('resetFeed', function () { globalState.savedFeedMessages = [] })
engine.on('displayGameText', function (header, content, lifespan) { bindings.addFeedMessage(header, content, lifespan, null) })
engine.on('displayGameTextWithImage', function (header, content, lifespan, image) { bindings.addFeedMessage(header, content, lifespan, image) })
engine.on('closeFeedMessage', function (id) { bindings.closeFeedMessage(id) })
engine.on('removeFeedMessage', function (id) { bindings.removeFeedMessage(id) })
engine.on('clearFeed', function () { bindings.clearFeed() })

// Kill Tracker
engine.on('displayKillTrackerText', function (image, text, lifespan) { bindings.addKillTrackerMessage(image, text, lifespan) })
engine.on('closeKillTrackerMessage', function (id) { bindings.closeKillTrackerMessage(id) })
engine.on('removeKillTrackerMessage', function (id) { bindings.removeKillTrackerMessage(id) })
engine.on('clearKillTracker', function () { bindings.clearKillTracker() })

// Client notifications
engine.on('displayClientNotification', function (header, content, duration) {
    console.log('displayClientNotification ' + header + ', ' + content + ', ' + duration)
    bindings.addNotificationMessage(header, content, duration, {}, {})
})
engine.on('displayClientNotificationWithStyle', function (header, content, duration, customStyle, customHeaderStyle) {
    console.log('displayClientNotificationWithStyle ' + header + ', ' + content + ', ' + duration + ', ' + customStyle + ', ' + customHeaderStyle)
    bindings.addNotificationMessage(header, content, duration, customStyle, customHeaderStyle)
})
engine.on('displayClientNotificationWithImage', function (header, content, duration, image) {
    console.log('displayClientNotification ' + header + ', ' + content + ', ' + duration + ', ' + image)
    bindings.addNotificationMessage(header, content, duration, {}, {}, image)
})
engine.on('closeNotificationMessage', function (id, silent) {
    if (!silent)
        engine.call('OnCloseNotificationMessage')
    bindings.closeNotificationMessage(id)
})
engine.on('removeNotificationMessage', function (id) { bindings.removeNotificationMessage(id) })
engine.on('clearNotifications', function () { bindings.clearNotifications() })

// UX
// ================================================================================

// NOTE THIS IS HIT EVERY TIME YOU GO BACK!!! "escape" is misleadingly named.
engine.on('escape', function () {
    if (globalState.unclickablePopup)
        return
    if (globalState.unescapablePopup)
        return
    if (globalState.isCardWizardInProgress) {
        console.log("v9.00.7 MONITORING: Bail early from escape logic, since isCardWizardInProgress")
        return
    }

    if (globalState.fullScreenPopup) {
        engine.trigger('hideFullScreenPopup')
        return
    }

    if (globalState.chatEnabled) {
        bindings.refreshChatInput[ChatType.bottomBar]("")
        engine.trigger('enableChat', false)
        return
    }

    // v1.54
    if (globalState.inGameChatEnabled) {
        bindings.refreshChatInput[ChatType.ingame]("")
        engine.trigger('enableInGameChat', false)
        return
    }

    if (globalState.popup) {
        engine.trigger('hidePopup', true)
        return
    }

    engine.trigger('enableScoreboard', false)

    engine.call("OnBack")
    bindings.goBack()
    bindings.closeContextMenu() // v1.47
})

// Menus
// ================================================================================

engine.on('loadView', function (viewName) {
    globalState.currentView = viewName
    bindings.loadView(viewName)
    engine.call("OnLoadView", viewName)
    bindings.closeContextMenu() // v1.47

    if (viewName != 'launcher') // v1.50/1.51
        engine.trigger('enableChat', false) // A bit smelly since it will trigger state updates from within a render()
})
engine.on('setMenuRoot', function (menuRoot) {
    console.log('setMenuRoot to ' + menuRoot)
    bindings.setMenuRoot(menuRoot)
})
engine.on('setMenuRootOnce', function (menuRoot) {
    console.log('setMenuRootOnce to ' + menuRoot)
    bindings.setMenuRootOnce(menuRoot)
})
engine.on('blurView', function (blurred) {
    bindings.blurView(blurred)
    bindings.blurPopup(blurred)
})

engine.on('quitGame', function () {
    engine.call('OnQuitGame')
})
engine.on('quitApplication', function () { engine.call('OnQuitApplication') })

engine.on('requestDisplayName', function (previousAttempt) {
    var description = loc('display_name_permanent', 'This is permanent. Choose carefully!')
    if (previousAttempt.length > 0) {
        if (previousAttempt.length < 3)
            description = loc('display_name_too_short', previousAttempt + ' was too short', [previousAttempt])
        else if (previousAttempt.length > 16)
            description = loc('display_name_too_long', previousAttempt + ' was too long', [previousAttempt])
        else
            description = loc('display_name_invalid_or_taken', previousAttempt + ' was taken or invalid', [previousAttempt])
    }

    loadPopupExplicit('<img style="width: 500px; margin-bottom: 12px;" src="hud/img/backgrounds/sovereign_500.jpg"/><br>' + loc('choose_display_name', "Choose your display name"), description, null, acceptMenu, true, false, function (value) {
        engine.call('OnRequestDisplayName', value)
    }, false, {
        customInputStyle: {
            maxLength: '16',
            blockNonWordCharacters: true,
            blockCopyPaste: true,
            width: '200px',
            padding: '0.5rem',
            textAlign: 'center'
        },
        customHeaderStyle: {
            background: 'rgba(33, 34, 34, 0.9)',
            width: '500px',
            margin: 'auto'
        },
        customDescriptionStyle: {
            background: 'rgba(33, 34, 34, 0.9)',
            width: '500px',
            margin: 'auto',
            padding: '1rem'
        }//,
        //customFullScreenBackground: 'hud/img/backgrounds/sovereign.jpg'
    })
    globalState.unescapablePopup = true
})

engine.on('confirmRequestDisplayName', function (displayName) {
    console.log('confirmRequestDisplayName: ' + displayName)
    engine.call('OnConfirmRequestDisplayName', displayName)
})

engine.on('cancelConfirmRequestDisplayName', function (displayName) {
    console.log('cancelConfirmRequestDisplayName: ' + displayName)
    engine.trigger('requestDisplayName', '')
})

engine.on('requestTagline', function (previousAttempt) {
    var description = loc('edit_tagline_long', 'Your tagline must be 70 characters or less. You may update it as often as you like.')
    if (previousAttempt.length > 0) {
        description = loc('disallowed_entry', 'Entry was disallowed. Please try again.')
    }

    loadPopupExplicit(loc('edit_tagline', "Edit tagline"), description, null, acceptCancelMenu, true, false, function (value) {
        engine.call('OnRequestTagline', value)
    }, false, {
        customInputStyle: {
            maxLength: '100',
            blockNonWordCharacters: false,
            blockCopyPaste: true,
        },
    })
})

engine.on('requestGuildAbbreviation', function (previousAttempt, descriptionOverride) {
    var description = loc('choose_guild_abbreviation_long', 'Your guild abbreviation (2-5 chars) must be unique. Be sure to spell it correctly!')

    if (previousAttempt != null) {
        if (previousAttempt.length > 0) {
            if (previousAttempt.length < 2)
                description = loc('display_name_too_short', previousAttempt + ' was too short', [previousAttempt, 2])
            else if (previousAttempt.length > 5)
                description = loc('display_name_too_long', previousAttempt + ' was too long', [previousAttempt, 4])
            else
                description = loc('display_name_invalid_or_taken', previousAttempt + ' was taken or invalid', [previousAttempt])
        }
    }

    if (descriptionOverride != null && descriptionOverride.length > 0)
        description = descriptionOverride

    loadPopupExplicit(loc('choose_guild_abbreviation', 'Choose your guild abbreviation') + '<br><img style="height: 256px" src="hud/img/splashes/Guild.png"><br>', description, null, acceptMenu, true, false, function (value) {
        engine.call('OnRequestGuildAbbreviation', value)

        if (isBrowserTest) {
            engine.trigger('refreshGuild', testGuild)
        }
    }, false, {
        customInputStyle: {
            textTransform: 'uppercase',
            maxLength: '5',
            blockSpaces: true,
            blockNonWordCharacters: true,
            blockSpecialWordCharacters: true,
            blockCopyPaste: true,
        },
    })
    globalState.unescapablePopup = true
})

engine.on('confirmRequestGuildAbbreviation', function (abbreviation) {
    console.log('confirmRequestGuildAbbreviation: ' + abbreviation)
    engine.call('OnConfirmRequestGuildAbbreviation', abbreviation)
})

engine.on('cancelConfirmRequestGuildAbbreviation', function (abbreviation) {
    console.log('cancelConfirmRequestGuildAbbreviation: ' + abbreviation)
    engine.trigger('requestGuildAbbreviation', '')
})

engine.on('requestGuildName', function (previousAttempt, descriptionOverride) {
    // This is overwritten in Client
    var description = loc('choose_guild_name_long', 'Be sure to spell the name correctly!')

    if (previousAttempt != null) {
        if (previousAttempt.length > 0) {
            if (previousAttempt.length < 2)
                description = loc('display_name_too_short', previousAttempt + ' was too short', [previousAttempt, 3])
            else if (previousAttempt.length > 25)
                description = loc('display_name_too_long', previousAttempt + ' was too long', [previousAttempt, 25])
            else
                description = loc('display_name_invalid_or_taken', previousAttempt + ' was taken or invalid', [previousAttempt])
        }
    }

    if (descriptionOverride != null && descriptionOverride.length > 0)
        description = descriptionOverride

    loadPopupExplicit(loc('choose_guild_name', 'Choose your guild name'), description, null, acceptMenu, true, false, function (value) {
        engine.call('OnRequestGuildName', value)

        if (isBrowserTest) {
            engine.trigger('refreshGuild', testGuild)
        }
    }, false, {
        customInputStyle: {
            maxLength: '25',
            blockSpaces: false,
            blockNonWordCharacters: true,
            blockSpecialWordCharacters: false,
            blockCopyPaste: true,
        },
    })
    globalState.unescapablePopup = true
})

engine.on('confirmRequestGuildName', function (name) {
    console.log('confirmRequestGuildName: ' + name)
    engine.call('OnConfirmRequestGuildName', name)
})

engine.on('cancelConfirmRequestGuildName', function (name, descriptionOverride) {
    console.log('cancelConfirmRequestGuildName: ' + name + ', descriptionOverride: ' + descriptionOverride)
    engine.trigger('requestGuildName', '', descriptionOverride)
})

engine.on('requestGuildTagline', function (previousAttempt, descriptionOverride) {
    var description = loc('edit_tagline_long', 'Your tagline must be 100 characters or less. You may update it as often as you like.<br><br>Inappropriate taglines may be removed at any time. Repeat offenders may receive account penalties.')

    if (descriptionOverride != null && descriptionOverride.length > 0)
        description = descriptionOverride

    if (previousAttempt != null) {
        if (previousAttempt.length > 0) {
            if (previousAttempt.length > 70)
                description = loc('display_name_too_long', previousAttempt + ' was too long', [previousAttempt, 100])
        }
    }

    loadPopupExplicit(loc('edit_tagline', 'Edit Tagline'), description, null, confirmCancelMenu, true, false, function (value) {
        engine.call('OnRequestGuildTagline', value)

        if (isBrowserTest) {
            engine.trigger('refreshGuild', testGuild)
        }
    }, false, {
            defaultInputValue: previousAttempt,
            customInputStyle: {
                maxLength: '70',
                blockSpaces: false,
                blockNonWordCharacters: false,
                blockSpecialWordCharacters: false,
                blockCopyPaste: true,
            },
    })
})

engine.on('requestGuildNotice', function (previousAttempt, descriptionOverride) {
    var description = loc('edit_guild_notice_long', 'Your guild notice must be 300 characters or less. You may update it as often as you like. It is displayed to all guild members in chat.')

    if (descriptionOverride != null && descriptionOverride.length > 0)
        description = descriptionOverride

    if (previousAttempt != null) {
        if (previousAttempt.length > 0) {
            if (previousAttempt.length > 300)
                description = loc('display_name_too_long', previousAttempt + ' was too long', [previousAttempt, 300])
        }
    }

    loadPopupExplicit(loc('edit_guild_notice', 'Edit Guild Notice'), description, null, acceptCancelMenu, true, false, function (value) {
        engine.call('OnRequestGuildNotice', value)

        if (isBrowserTest) {
            engine.trigger('refreshGuild', testGuild)
        }
    }, false, {
            defaultInputValue: previousAttempt,
            customInputStyle: {
                maxLength: '300',
                blockSpaces: false,
                blockNonWordCharacters: false,
                blockSpecialWordCharacters: false,
                blockCopyPaste: true,
            },
    })
})

engine.on('requestGuildMemberTitle', function (playFabId, previousAttempt, descriptionOverride) {
    var description = loc('edit_guild_member_title_long', 'Guild member titles must be 25 characters or less. You may update them as often as you want.')

    if (descriptionOverride != null && descriptionOverride.length > 0)
        description = descriptionOverride

    if (previousAttempt != null) {
        if (previousAttempt.length > 0) {
            if (previousAttempt.length > 25)
                description = loc('display_name_too_long', previousAttempt + ' was too long', [previousAttempt, 100])
        }
    }
    loadPopupExplicit(loc('edit_guild_member_title', 'Edit Guild Member Title'), description, null, acceptCancelMenu, true, false, function (value) {
        engine.call('OnRequestGuildMemberTitle', playFabId, value)

        if (isBrowserTest) {
            engine.trigger('refreshGuild', testGuild)
        }
    }, false, {
        defaultInputValue: previousAttempt,
        customInputStyle: {
            maxLength: '25',
        }
    })
})

engine.on('requestGuildDisband', function () {
    var description = loc('disband_guild_long', 'Disbanding the guild is permanent. All members will be kicked out of the guild. However, members will keep their guild contribution when they join a new guild.<br><br><span style="color: #ffff00">If you are absolutely sure you want to do this, type "' + globalState.myGuildName + '" in the box below and press Accept.</span>', [globalState.myGuildName])

    loadPopupExplicit(loc('disband_guild', 'Disband Guild'), description, null, acceptCancelMenu, true, false, function (value) {
        engine.call('OnRequestDisbandGuild', value, globalState.myGuildName)

        if (isBrowserTest) {
            engine.trigger('escape')
        }
    }, false, {
        customHeaderStyle: {
            background: 'rgba(201, 26, 26, 0.75)',
        },
        customDescriptionStyle: {
            background: 'rgba(108, 41, 41, 0.75)',
        },
        customInputStyle: {
            maxLength: '25',
        }
    })
})

engine.on('logout', function () { engine.trigger('loadView', 'gateway') })

engine.on('selectMenu', function (menuId) {
    bindings.selectMenu(menuId)
})
engine.on('activateMenu', function (menuId, enabled, isSubmenu) {
    if (menuId < 1 || menuId >= bindings.activateMenu.length) return
    if (typeof bindings.activateMenu[menuId] === "function") {
        bindings.activateMenu[menuId](enabled)
    }
})
engine.on('activateSubmenu', function (menuId, active) {
    if (menuId < 1 || menuId >= bindings.activateSubmenu.length) return
    if (typeof bindings.activateSubmenu[menuId] === "function")
        bindings.activateSubmenu[menuId](active)
    if (typeof bindings.activateSubmenuButton[menuId] === "function")
        bindings.activateSubmenuButton[menuId](active)
})
engine.on('selectSubmenu', function (menuId) { bindings.selectSubmenu(menuId) })

engine.on('activateInlineSubmenu', function (menuId, active) {
    if (menuId < 1 || menuId >= bindings.activateInlineSubmenu.length) return
    if (typeof bindings.activateInlineSubmenu[menuId] === "function")
        bindings.activateInlineSubmenu[menuId](active)
    if (typeof bindings.activateInlineSubmenuButton[menuId] === "function")
        bindings.activateInlineSubmenuButton[menuId](active)
})
engine.on('selectInlineSubmenu', function (menuId) { bindings.selectInlineSubmenu(menuId) })

engine.on('resetVideos', function (menuId) { bindings.resetVideos() })

engine.on('loadPopup', function (popupName) {
    bindings.loadPopup(popupName)
    globalState.popup = true
    engine.trigger('blurView', true)
    bindings.blurFullScreenPopup(true)

    engine.trigger('enableScoreboard', false)
    engine.call('OnUpdatePopupName', popupName)
})

engine.on('loadPopupOk', function (header, description) {
    engine.trigger('loadPopupExplicit', header, description, null, okMenu, false, false, null)
    globalState.unescapablePopup = true
})
engine.on('loadPopupOkCompact', function (header, description) {
    var settings = {}
    settings.customHeaderStyle = {
        width: '800px',
        margin: 'auto',
        //background: 'rgba(72, 122, 118, 0.50)',
        background: 'rgba(32, 32, 32, 0.85)',
        borderTop: '1px solid rgba(218, 251, 248, 0.16)',
        borderLeft: '1px solid rgba(218, 251, 248, 0.16)',
        borderRight: '1px solid rgba(218, 251, 248, 0.16)'
    }
    settings.customDescriptionStyle = {
        width: '800px',
        margin: 'auto',
        padding: '0 1rem',
        background: 'rgba(53, 62, 61, 0.85)',
        borderBottom: '1px solid rgba(218, 251, 248, 0.08)',
        borderLeft: '1px solid rgba(218, 251, 248, 0.08)',
        borderRight: '1px solid rgba(218, 251, 248, 0.08)'
    }

    globalState.preventPopupOkBeforeTicks = Date.now() + (1 * 1000) // 1 second = 1000 ticks
    engine.trigger('loadPopupExplicit', header, description, null, okMenu, false, false, null, false, settings)
    globalState.unescapablePopup = true
})
engine.on('loadPopupOkSilent', function (header, description) {
    engine.trigger('loadPopupExplicit', header, description, null, okMenu, false, false, null, true)
    globalState.unescapablePopup = true
})
engine.on('loadPopupBlank', function (header, description) {
    // v10.06: let's just be safe and comment out some console.logs to avoid crashes
    //console.log("loadPopupBlank " + header + ", " + description)
    engine.trigger('loadPopupExplicit', header, description, null, blankMenu, false, false, null, true)
    globalState.unclickablePopup = true
})
engine.on('loadPopupExplicit', function (header, description, behavior, items, hasInput, hasParagraphInput, onSubmit, silent, settings) {
    // v10.06: This causes Russian long strings to sometimes HARD CRASH
    //console.log("loadPopupExplicit header: " + header + ", description: " + description + ", silent: " + silent)
    loadPopupExplicit(header, description, behavior, items, hasInput, hasParagraphInput, onSubmit, silent, settings)
})

engine.on('loadPopupCancel', function (header, description, behaviorIfCancel) {
    loadPopupExplicit(header, description, null, createCancelMenu(behaviorIfCancel), false, false, null, false)
})

engine.on('loadPopupOkWithCallback', function (header, description, callbackId) {
    engine.trigger('loadPopupExplicit', header, description, null, okWithCallbackMenu(callbackId), false, false, null)
    globalState.unescapablePopup = true
})

engine.on('connectingToServerPopup', function (name) {
    engine.trigger('loadPopupExplicit', '<img src="hud/img/brand/logo.png"><br/>' + loc('connecting_to', 'Connecting to') + " " + name, "", null, createCancelMenu(function () {
        engine.trigger('quitApplication')
    }), false, false, null, true, {
        hasLoader: true
    })
})

engine.on('loadingPopup', function (name) {
    engine.trigger('loadPopupExplicit', name, "", null, createCancelMenu(function () {
        engine.trigger('quitApplication')
    }), false, false, null, true)
})

engine.on('reconnectingToServerPopup', function (name) {
    engine.trigger('loadPopupExplicit', loc('reconnecting_to', 'Reconnecting to') + " " + name, "", null, createCancelMenu(function () {
        engine.call('OnVoluntarilyQuitGame') // This may lead to some false positives (cosmetic warning only though)
        engine.trigger('quitGame')
    }), false, false, null)
})

engine.on('crashPopup', function (header, description) {
    globalState.crashPopup = true

    description = linkify(description)

    engine.trigger('loadPopupExplicit', header, description, null, createOkMenu(function () {
        engine.trigger('quitApplication')
    }), false, false, null)
})

// todo: refactor to put stuff in 'settings' so we don't have a bunch of arguments, since it's super annoying to call this
function loadPopupExplicit(header, description, behavior, items, hasInput, hasParagraphInput, onSubmit, silent, settings) {
    if (globalState.isCardWizardInProgress) {
        console.warn('bailing early from loadPopupExplicit since card wizard in progress')
        return
    }

    globalState.popup = true
    bindings.loadPopupExplicit(header, description, behavior, items, hasInput, hasParagraphInput, onSubmit, silent, settings)
    engine.trigger('blurView', true)
    bindings.blurFullScreenPopup(true)

    engine.call('OnUpdatePopupName', header)
}

engine.on('confirmDeleteLogs', function (sizeOfLogs) {
    loadPopupExplicit(
        loc('confirm_delete_logs', 'Confirm Delete Logs'),
        loc('confirm_delete_logs_long', '', [sizeOfLogs]),
        null,
        createYesCancelMenu(
            function () {
                engine.call('OnConfirmDeleteLogs')
            },
            function () { }
        ),
        false,
        false,
        null,
        false)
})

engine.on('hidePopup', function (silent) {
    console.log('engine.on hidePopup lastPopupName: ' + globalState.lastPopupName + ', silent: ' + silent)

    if (globalState.crashPopup) {
        console.log('but globalState.crashPopup was true, so do not hide popup anymore')
        return
    }

    globalState.popup = false
    globalState.unclickablePopup = false
    globalState.unescapablePopup = false
    bindings.hidePopup(silent)
    engine.trigger('blurView', false)
    bindings.blurFullScreenPopup(false)
    engine.call('OnUpdatePopupName', '')
})
engine.on('submitPopupMenuInput', function () {
    bindings.hidePopup(true)
    engine.trigger('blurView', false)
    bindings.blurFullScreenPopup(false)
    bindings.submitPopupMenuInput()
})

engine.on('showCardArt', function (itemEntry) {
    showFullScreenPopup(getCardArt(itemEntry))
})

engine.on('showCardArtFromMatchModifier', function (matchModifier) {
    var itemEntry = {
        name: matchModifier.header,
        image: matchModifier.image,
        description: matchModifier.subheader,
        rarity: matchModifier.rarity
    }

    showFullScreenPopup(getCardArt(itemEntry))
})

engine.on('showTrophyFromMatchModifier', function (matchModifier) {
    var itemEntry = {
        name: matchModifier.header,
        image: matchModifier.image,
        description: matchModifier.subheader,
        rarity: matchModifier.rarity
    }

    showFullScreenPopup(getTrophyArt(itemEntry))
})

engine.on('showRankUpArt', function (item, rating) {
    showFullScreenPopup(getRankupArt(item, rating), false, function () {
        console.log('close rankup popup')
        engine.call('OnMaybeShowSeasonGoalPopup')
    })
})

engine.on('showEarnedSeasonGoalPopup', function (rating, essence, extraRewardText) {
    showFullScreenPopup(getSeasonGoalArt(rating, essence, extraRewardText), false)
})

engine.on('showBeatCampaignPopup', function (campaignMapIndex, callbackId) {
    showFullScreenPopup(getBeatCampaignArt(campaignMapIndex), false, function () {
        engine.call('OnHandleOkPopupCallback', callbackId)
    })
})

// This needs to go through View so we can get # of stacks, conversion rate, etc. which the view doesn't know
engine.on('loadConfirmConversionPopup', function (itemType, itemName, itemIcon, essence, newEssence, stacks, newStacks, isSecret) {
    itemName = '' // actually I like hiding item name/currencyName now. Cleaner, more aligned look
    currencyName = '' // loc('essence', 'Essence')
    deltaAmount = newEssence - essence
    var deltaText = ''
    if (deltaAmount > 0)
        deltaText = '(<span style="color: #8ff110"><img src="hud/img/recvalue/green_up.png"/>' + Math.abs(deltaAmount) + '</span>)'
    else if (deltaAmount < 0)
        deltaText = '(<span style="color: #ffff66"><img src="hud/img/recvalue/yellow_down.png"/>' + Math.abs(deltaAmount) + '</span>)'

    var secretWarningText = ''
    if (isSecret) {
        secretWarningText = '<br/><br/><img src="hud/img/icons/Warning.png" style="height: 16px"/> <span style="color: #ffff33">' + loc('donate_secret_card_warning', 'When you sell or donate a secret card, you lose access to the Monument slot that it unlocked!') + '</span>'
    }

    loadPopupExplicit(loc('confirm_conversion', 'Confirm Conversion'),
        '<div style="width: 300px; margin: auto; text-align: left">'
        + '<div style="display: inline-block; margin-right: 8px"><img class="tooltip-icon" src="hud/img/shop/currency/Essence_20.png"/>' + currencyName + '</div>' + essence + ' <img class="tooltip-icon" src="hud/img/small-icons/right-arrow.png" style="vertical-align: top"/> ' + newEssence + ' ' + deltaText + '<br/>'
        + '<div style="display: inline-block; margin-right: 8px"><img class="tooltip-icon" src="hud/img/' + itemIcon + '"/>' + itemName + '</div>' + stacks + 'x <img class="tooltip-icon" src="hud/img/small-icons/right-arrow.png" style="vertical-align: top"/> ' + newStacks + 'x'
        + '</div>'
        + secretWarningText,
        null, createConfirmConversionMenu(itemType),
        false, false, null, false, {
        customHeaderStyle: {
        }
    })
})

// This needs to go through View so we can get # of stacks, conversion rate, etc. which the view doesn't know
engine.on('loadConfirmDonatePopup', function (donateProps) {
    var itemName = donateProps.itemName
    var itemType = donateProps.itemType
    var itemIcon = donateProps.itemIcon
    var guildXp = donateProps.guildXp
    var newGuildXp = donateProps.newGuildXp
    var stacks = donateProps.stacks
    var newStacks = donateProps.newStacks
    var guildStacks = donateProps.guildStacks
    var newGuildStacks = donateProps.newGuildStacks
    var contribution = donateProps.contribution
    var newContribution = donateProps.newContribution

    deltaAmount = newGuildXp - guildXp
    var deltaText = ''
    if (deltaAmount > 0)
        deltaText = '(<span style="color: #8ff110"><img src="hud/img/recvalue/green_up.png"/>' + Math.abs(deltaAmount) + '</span>)'
    else if (deltaAmount < 0)
        deltaText = '(<span style="color: #ffff66"><img src="hud/img/recvalue/yellow_down.png"/>' + Math.abs(deltaAmount) + '</span>)'

    var deltaContributionText = ''
    if (deltaAmount > 0)
        deltaContributionText = '(<span style="color: #8ff110"><img src="hud/img/recvalue/green_up.png"/>' + Math.abs(deltaAmount) + '</span>)'
    else if (deltaAmount < 0)
        deltaContributionText = '(<span style="color: #ffff66"><img src="hud/img/recvalue/yellow_down.png"/>' + Math.abs(deltaAmount) + '</span>)'

    var extraBonusText = ''
    if (newGuildStacks == 1) {
        extraBonusText = '<br/><br/><span style="color: #8ff110">' + loc('donate_first_card_bonus', '2x Bonus for first ' + itemName, [itemName]) + '</span>'
    }

    var secretWarningText = ''
    if (donateProps.isSecret) {
        secretWarningText = '<br/><br/><img src="hud/img/icons/Warning.png" style="height: 16px"/> <span style="color: #ffff33">' + loc('donate_secret_card_warning', 'When you donate a secret card, you lose access to the Monument slot that it unlocked!') + '</span>'
    }

    loadPopupExplicit(loc('confirm_card_donation', 'Confirm Card Donation'),
        '<div style="width: 300px; margin: auto; text-align: left">'
        + '<div style="display: inline-block; margin-right: 8px"><span class="guild-xp">' + loc('gxp', 'GXP') + '</span></div>' + guildXp + ' <img class="tooltip-icon" src="hud/img/small-icons/right-arrow.png" style="vertical-align: top"/> ' + newGuildXp + ' ' + deltaText + '<br/>'
        + '<div style="display: inline-block; margin-right: 8px"><img class="tooltip-icon" src="hud/img/icons/GuildContribution.png"/></div>' + contribution + ' <img class="tooltip-icon" src="hud/img/small-icons/right-arrow.png" style="vertical-align: top"/> ' + newContribution + ' ' + deltaContributionText + '<br/>'
        + '<div style="display: inline-block; margin-right: 8px"><img class="tooltip-icon" src="hud/img/' + itemIcon + '"/>' + '</div>' + guildStacks + 'x <img class="tooltip-icon" src="hud/img/small-icons/right-arrow.png" style="vertical-align: top"/> ' + newGuildStacks + 'x' + ' (' + loc('guild', 'Guild') + ')' + '<br/>'
        + '<div style="display: inline-block; margin-right: 8px"><img class="tooltip-icon" src="hud/img/' + itemIcon + '"/>' + '</div>' + stacks + 'x <img class="tooltip-icon" src="hud/img/small-icons/right-arrow.png" style="vertical-align: top"/> ' + newStacks + 'x' + ' (' + globalState.savedUsername + ')'
        + extraBonusText
        + secretWarningText
        + '</div>',
        null, createConfirmDonationMenu(itemType),
        false, false, null, false, {
        customHeaderStyle: {
        }
    })
})

// can't do engine.on('showFullScreenPopup') with ReactJS element or coherent UI crashes
//showFullScreenPopup = function (reactElement) {
//    globalState.fullScreenPopup = true
//    bindings.showFullScreenPopup(reactElement)
//    engine.trigger('blurView', true)
//    engine.call('OnShowFullScreenPopup')
//}

showFullScreenPopup = function (reactElement, clickToClose, onClose, silent, skipBlur) {
    if (globalState.isCardWizardInProgress) {
        console.warn('was going to showFullScreenPopup, but isCardWizardInProgress so bail')
        return
    }

    globalState.fullScreenPopup = true

    if (clickToClose === undefined)
        clickToClose = true

    bindings.showFullScreenPopup(reactElement, clickToClose, onClose)
    if (!skipBlur)
        engine.trigger('blurView', true)

    if (!silent)
        engine.call('OnShowFullScreenPopup')
}

engine.on('hideFullScreenPopup', function (silent) {
    globalState.fullScreenPopup = false
    bindings.hideFullScreenPopup()
    engine.trigger('blurView', false)

    if (!silent)
        engine.call('OnHideFullScreenPopup')
})

engine.on('refreshWatermarkText', function (text) { bindings.refreshWatermarkText(text) })
engine.on('refreshWatermarkValue', function (text) { bindings.refreshWatermarkValue(text) })
engine.on('refreshClientWatermarkText', function (text) { bindings.refreshClientWatermarkText(text) })

var openForums = function () {
    console.log("open forums")
    engine.call("OnOpenURL", "http://legiontd2.com/community")
}

var pingPlayerGold = function (player) {
    console.log("ping gold player " + player)
    engine.call('OnPingPlayerGold', player)
}

// Lobby
// ================================================================================

//engine.on('showBetaWarning', function () {
//    if (!globalState.showBetaWarning) return // only show it once per session, otherwise it will be annoying
//    engine.trigger('loadPopup', 'beta')
//    globalState.showBetaWarning = false
//})

engine.on('refreshSidebarProfile', function (profile) {
    var previousLevel = globalState.level
    globalState.profile = profile
    globalState.level = profile.level
    bindings.refreshSidebarProfile(profile)

    // Refresh play menu
    if (previousLevel == 0 && globalState.currentView == 'launcher')
        engine.trigger('loadView', 'launcher')
})

engine.on('refreshFriends', function (players) {
    globalState.friends = players
    bindings.refreshFriends(players)
    globalState.friendPlayFabIds = []

    players.forEach(function (member) {
        globalState.friendPlayFabIds.push(member.playFabId)
    })

    bindings.refreshFriendInvitationFriendsList()
})

engine.on('refreshInvites', function (players) {
    globalState.invites = players
    bindings.refreshInvites(players)
})

engine.on('refreshParty', function (party) {
    globalState.party = party
    bindings.refreshParty(party)

    if (party == null || party.length == 0) {
        engine.call('OnLogError', 'refreshParty was passed an empty party')
        return
    }

    // Assume party leader is first person
    globalState.partyLeader = party[0].playFabId

    globalState.partyPlayFabIds = []
    globalState.partyDisplayNames = []
    party.forEach(function (member) {
        console.log('refreshParty member: ' + member.playFabId + ': ' + member.name)
        globalState.partyPlayFabIds.push(member.playFabId)
        globalState.partyDisplayNames.push(member.name)
    })
})

engine.on('refreshPartyRating', function (rating, bonus) {
    bindings.refreshPartyRating(rating, bonus)
})

engine.on('acceptFriendRequest', function (playFabId) {
    engine.call('OnAcceptFriendRequest', playFabId)
})

engine.on('rejectFriendRequest', function (playFabId) {
    engine.call('OnRejectFriendRequest', playFabId)
})

engine.on('removeFriend', function (displayName) {
    engine.call('OnRemoveFriend', displayName)
})

engine.on('sendFriendRequest', function (displayName) {
    engine.call('OnSendFriendRequest', displayName)
})

engine.on('sendPartyInvite', function (displayName, reprompt) {
    if (reprompt == null)
        reprompt = false

    if (globalState.searchingForMatch) {
        engine.trigger('displayClientNotification',
            loc('cannot_while_searching', 'Cannot do this while searching for a match'),
            loc('unable_to_invite_to_party', 'Unable to send party invite to ' + displayName, [displayName]),
            5)
        return
    }

    var isInParty = _.includes(globalState.partyDisplayNames, displayName)
    if (isInParty) {
        engine.trigger('displayClientNotification',
            loc('player_already_in_party', 'Player already in party'),
            loc('unable_to_invite_to_party', 'Unable to send party invite to ' + displayName, [displayName]),
            5)
        return
    }

    if (globalState.partyDisplayNames.length >= globalState.partySizeLimit) {
        engine.trigger('displayClientNotification',
            loc('party_is_full', 'Party is full'),
            loc('unable_to_invite_to_party', 'Unable to send party invite to ' + displayName, [displayName]),
            5)
        return
    }

    // Done on the client now, after we confirm
    //engine.trigger('displayClientNotification',
    //    loc('party_update', 'Party Update'),
    //    loc('sent_party_invite', 'Sent party invite to ' + displayName, [displayName]),
    //    5)

    engine.call('OnSendPartyInvite', displayName, reprompt)
})

engine.on('searchCustomGameInvite', function (status) {
    globalState.inviteFriendStatus = status
    engine.trigger('loadPopup', 'sendcustomgameinvite')
})

engine.on('sendCustomGameInvite', function (displayName) {
    engine.call('OnSendCustomGameInvite', displayName, true)
})

engine.on('sendQuickCustomGameInvite', function (displayName) {
    engine.call('OnSendCustomGameInvite', displayName, false)
})

engine.on('reportPlayer', function (playFabId, comment) {
    console.log('reportPlayer ' + playFabId + ', comment: ' + comment)
    engine.call('OnReportPlayer', playFabId, comment)
    globalState.reportedPlayers.push(playFabId)

    // v8.05 smelly
    if (globalState.currentView == 'postgame') {
        console.log('force refresh postgame since we reported a player')
        if (bindings.forceRefreshPostgame && bindings.forceRefreshPostgame['leftTeam']) {
            bindings.forceRefreshPostgame['leftTeam']()
        }
        if (bindings.forceRefreshPostgame && bindings.forceRefreshPostgame['rightTeam']) {
            bindings.forceRefreshPostgame['rightTeam']()
        }
    }
})

engine.on('reportPlayerTextCommand', function (playFabId, playerName) {
    globalState.contextMenuTarget = playFabId
    globalState.contextMenuDisplayTarget = playerName
    engine.trigger('loadPopup', 'reportPlayer')
})

engine.on('receiveCustomGameInvite', function (playFabId, displayName) {
    loadPopupYesCancel(
        loc('join_someones_game', "Join " + displayName + "'s game?", [displayName]),
        "",
        function () {
            engine.call("OnAcceptCustomGameInvite", playFabId, displayName)
        }, function () {
            engine.call("OnRejectCustomGameInvite", playFabId, displayName)
        }
    )
})

engine.on('receivePartyInvite', function (playFabId, displayName) {
    loadPopupYesCancel(
        loc('join_someones_party', "Join " + displayName + "'s party?", [displayName]),
        "",
        function () {
            engine.call("OnAcceptPartyInvite", playFabId)
        }, function () {
            engine.call("OnRejectPartyInvite", playFabId)
        }
    )
})

// Deprecated; I think this is covered by receivePartyInvite above
//engine.on('acceptPartyInvite', function (playFabId) {
//    engine.call('OnAcceptPartyInvite', playFabId)

//    // This should be displayName shouldn't it be...?
//    engine.trigger('displayClientNotification',
//        loc('party_update', 'Party Update'),
//        loc('accepted_party_invite', "Accepted party invite from " + playFabId, [playFabId]),
//        5)
//})

// Deprecated; I think this is covered by receivePartyInvite above
//engine.on('rejectPartyInvite', function (displayName) {
//    engine.call('OnRejectPartyInvite', displayName)

//    engine.trigger('displayClientNotification',
//        localizedStrings.partyUpdate,
//        localizedStrings.rejectedPartyInvite + playFabId,
//        5)
//})

engine.on('removeFromParty', function (playFabId) {
    engine.call('OnRemoveFromParty', playFabId)
})

engine.on('leaveParty', function () {
    engine.call('OnLeaveParty')
})

engine.on('forceRefreshFriends', function () {
    engine.call('OnForceRefreshFriends')
})

engine.on('closeContextMenu', function () {
    bindings.closeContextMenu()
})

engine.on('setPlayersOnline', function (count) {
    bindings.setPlayersOnline(count)
})

engine.on('setClientVersion', function (version) {
    globalState.clientVersion = version
    bindings.setClientVersion(version)
})

engine.on('setCurrentLobbyId', function (lobbyid) {
    bindings.setCurrentLobbyId(lobbyid)
})

engine.on('updateLobbyClockTime', function (timeString) {
    bindings.updateLobbyClockTime(timeString)
})

engine.on('enableVideoRendering', function (enabled) {
    console.log('enableVideoRendering: ' + enabled)
    globalState.enableVideoRendering = enabled
    bindings.enableVideoRendering(enabled)
})

engine.on('refreshClientModifiers', function (modifiers) {
    if (globalState.clientModifiers === modifiers) {
        console.log("No need to refresh client modifiers since they hadn't changed")
        return
    }

    if (modifiers != null)
        console.log("Refreshing client modifiers with " + modifiers.length + " modifiers")
    else
        console.log("Refreshing client modifiers with no modifiers")

    globalState.clientModifiers = modifiers
    bindings.refreshClientModifiers(modifiers)
    //if (globalState.currentView == "launcher" && !globalState.popup) { // if we already had a popup, don't reload launcher, or else it feels interruptive
    if (globalState.currentView == "launcher" && modifiers.length > 0) { // v2.40: actually this case kinda feels needed or else the alerts don't come up
        console.log("Already looking at launcher --> force reload launcher")
        engine.trigger('loadView', 'launcher')
    } else {
        console.log("Current view was: " + globalState.currentView)
    }
})

engine.on('refreshCurrency', function (ss, pe) {
    console.log('refreshCurrency ss: ' + ss + ', pe: ' + pe)
    globalState.currency = ss
    globalState.premiumEssence = pe
    bindings.refreshSidebarCurrency(ss, pe)
    bindings.refreshTabCurrency(ss, pe)
})

engine.on('refreshCardFragments', function (cardFragments, cardTraderPity) {
    console.log('refreshCardFragments: ' + cardFragments + ', cardTraderPity: ' + cardTraderPity)
    globalState.cardFragments = cardFragments
    globalState.cardTraderPity = cardTraderPity
    bindings.refreshCardFragments(cardFragments, cardTraderPity)
})

engine.on('refreshCardTraderRerolls', function (rerolls) {
    console.log('refreshCardTraderRerolls: ' + rerolls)
    globalState.cardTraderRerolls = rerolls
    bindings.refreshCardTraderRerolls(rerolls)
})

engine.on('automaticallyShowChatWindows', function (enabled) {
    console.log("automatically show chat windows: " + enabled)
    globalState.automaticallyShowChatWindows = enabled
    bindings.automaticallyShowChatWindows(enabled)
    engine.call('OnAutomaticallyShowChatWindows', enabled)
})

engine.on('refreshHasNewPatchNotes', function (hasNewPatchNotes) {
    if (globalState.hasNewPatchNotes === hasNewPatchNotes) {
        console.log("No need to refresh hasNewPatchNotes since they hadn't changed")
        return
    }

    globalState.hasNewPatchNotes = hasNewPatchNotes

    if (globalState.currentView == "launcher") {
        console.log("Already looking at launcher --> force reload launcher")
        engine.trigger('loadView', 'launcher')
    } else {
        console.log("Current view was: " + globalState.currentView)
    }
})

engine.on('refreshIsInGame', function (enabled) {
    console.log('refreshIsInGame ' + enabled)
    if (globalState.isInGame === enabled) {
        console.log("No need to refresh isInGame since they hadn't changed")
        return
    }

    globalState.isInGame = enabled
})

engine.on('refreshGuildWarActive', function (enabled) {
    if (!globalState.shopEnabled) {
        console.log('refreshGuildWarActive, but guilds were disabled so set it to false')
        globalState.guildWarActive = false
        return
    }

    console.log('refreshGuildWarActive ' + enabled)
    if (globalState.guildWarActive === enabled) {
        console.log("No need to refresh guildWarActive since they hadn't changed")
        return
    }

    globalState.guildWarActive = enabled
})

engine.on('setGoldRushEnabledUntilTicks', function (ticks) {
    console.log('setGoldRushEnabledUntilTicks ' + ticks)
    globalState.goldRushEnabledUntilTicks = ticks
})

engine.on('refreshHasNewItems', function (hasNewItems) {

    // v10.06.4 force it to be true if we have a new mastery
    if (globalState.hasMasteryReward) {
        console.log('hasMasteryReward')
        hasNewItems = true
    }

    if (globalState.hasNewItems === hasNewItems) {
        console.log("No need to refresh has new items since they hadn't changed")
        return
    }

    globalState.hasNewItems = hasNewItems

    console.log("Refreshing has new items")

    if (globalState.currentView == "launcher") {
        console.log("Already looking at launcher --> force reload launcher")
        engine.trigger('loadView', 'launcher')
    } else {
        console.log("Current view was: " + globalState.currentView)
    }
})

engine.on('refreshHasNewGuildInvites', function (hasNewGuildInvites) {
    if (globalState.hasNewGuildInvites === hasNewGuildInvites) {
        console.log("No need to refresh has new guild invites since they hadn't changed")
        return
    }

    globalState.hasNewGuildInvites = hasNewGuildInvites

    console.log("Refreshing has new guild invites: " + hasNewGuildInvites)

    if (globalState.currentView == "launcher") {
        console.log("Already looking at launcher --> force reload launcher")
        engine.trigger('loadView', 'launcher')
    } else {
        console.log("Current view was: " + globalState.currentView)
    }
})

engine.on('refreshHasNewWeeklyChallenge', function (hasNewChallenge) {
    if (globalState.hasNewChallenge === hasNewChallenge) {
        console.log("No need to refresh has new challenge since they hadn't changed")
        return
    }

    globalState.hasNewChallenge = hasNewChallenge

    console.log("Refreshing has new challenge: " + hasNewChallenge)

    if (globalState.currentView == "launcher") {
        console.log("Already looking at launcher --> force reload launcher")
        engine.trigger('loadView', 'launcher')
    } else {
        console.log("Current view was: " + globalState.currentView)
    }
})

// Legion select
engine.on('refreshLegionSelectTimer', function (timerText) {
    bindings.refreshLegionSelectTimer(timerText)
    bindings.refreshMastermindVariantsTimer(timerText)
})

engine.on('enableSearchingForMatch', function (enabled) {
    if (globalState.searchingForMatch == enabled) {
        console.log("Bailing early from enableSearchingForMatch because it was already " + enabled)
        return
    }

    globalState.searchingForMatch = enabled

    console.log('enable searching for match: ' + enabled)

    // Reload launcher if we are currently in launcher
    if (globalState.currentView == "launcher")
        engine.trigger('loadView', 'launcher')

    // Reload postgame if we are currently in postgame (v6.00)
    if (globalState.currentView == "postgame")
        engine.trigger('loadView', 'postgame')

    if (!enabled)
        engine.trigger('setMatchmakingStarted', false)
})

engine.on('setMatchmakingStarted', function (started) {
    console.log('setMatchmakingStarted: ' + started)
    globalState.matchmakingStarted = started

    if (globalState.currentView == 'postgame')
        engine.trigger('loadView', 'postgame')
})

engine.on('setCancelingSearch', function (canceling) {
    console.log('setCancelingSearch: ' + canceling)
    globalState.cancelingSearch = canceling

    if (globalState.currentView == 'postgame')
        engine.trigger('loadView', 'postgame')
})

engine.on('setPublicTestRealm', function (enabled) {
    globalState.publicTestRealm = enabled
})

engine.on('setDirectConnectionEnabled', function (enabled) {
    globalState.directConnectionEnabled = enabled
})

engine.on('setIsTestAccount', function (enabled) {
    globalState.isTestAccount = enabled
})

engine.on('setMatchmakingEnabled', function (enabled) {
    globalState.matchmakingEnabled = enabled
})

engine.on('setCasualEnabled', function (enabled) {
    globalState.casualEnabled = enabled
})

engine.on('setClassicEnabled', function (enabled) {
    globalState.classicEnabled = enabled
})

engine.on('setRankedDisabledWithMessage', function (message) {
    globalState.rankedDisabledMessage = message
})

engine.on('setPlayAgainEnabled', function (enabled) {
    globalState.playAgainEnabled = enabled
})

engine.on('setShopEnabled', function (enabled) {
    console.log('setShopEnabled: ' + enabled)
    globalState.shopEnabled = enabled
})

engine.on('setFreeAccountStatus', function (freeAccount) {
    globalState.freeAccount = freeAccount
})

engine.on('setArcadeMode', function (modeList) {
    globalState.arcadeMode = modeList
})

engine.on('setArcadeModeEnabledUntilTicks', function (ticks) {
    globalState.arcadeModeEnabledUntilTicks = ticks
})

engine.on('setDisablePracticeGames', function (enabled) {
    globalState.disablePracticeGames = enabled
})

engine.on('enteringMatchmakingHeartbeat', function () {
    bindings.enteringMatchmakingHeartbeat()
})

// Custom game menu
engine.on('onCustomGameMenuLoaded', function () {
    bindings.onCustomGameMenuLoaded()
})

engine.on('setCustomGameSlot', function (player, displayName, playFabId) {
    if (player < 1 || player >= bindings.setCustomGameSlot.length) return

    if (displayName == globalState.savedUsername)
        globalState.savedPlayerNumber = player

    if (typeof bindings.setCustomGameSlot[player] === "function") {
        bindings.setCustomGameSlot[player](displayName, playFabId)
    }
})

engine.on('setCustomGameSlotDetails', function (player, image, level, rating, guildAbbreviation) {
    if (player < 1 || player >= bindings.setCustomGameSlotDetails.length) return
    if (typeof bindings.setCustomGameSlotDetails[player] === "function") {
        bindings.setCustomGameSlotDetails[player](image, level, rating, guildAbbreviation)
    }
})

engine.on('setCustomGameOwner', function (playFabId, displayName) {
    bindings.setCustomGameOwner(playFabId, displayName)
})

engine.on('setCustomGameHumanCount', function (count) {
    bindings.setCustomGameHumanCount(count)
})

engine.on('setCustomGameSettings', function (settings, modesString) {
    //console.log('setCustomGameSettings settings ' + JSON.stringify(settings))
    settings.customGameModesString = modesString
    globalState.customGameSettingsObject = settings
    bindings.setCustomGameSettings(settings)
})

engine.on('setBanSlot', function (player, value) {
    if (typeof bindings.setBanSlot[player] === "function") {
        bindings.setBanSlot[player](value)
    }
})

engine.on('setBanSelections', function (player, selections) {
    if (typeof bindings.setBanSelections[player] === "function") {
        bindings.setBanSelections[player](selections)
    }
})

// deprecate
engine.on('setCustomGameMode', function (mode, enabled) {
    bindings.setCustomGameMode(mode, enabled)
})

engine.on('addAI', function () {
    engine.call('OnAddAI')
})

engine.on('refreshLoadingProgress', function (progress, text) {
    bindings.refreshLoadingProgress(progress, text)
})

engine.on('refreshLeftTeamLoadingMessage', function (message, tooltipText) {
    bindings.refreshLeftTeamLoadingMessage(message, tooltipText)
})

engine.on('refreshRightTeamLoadingMessage', function (message, tooltipText) {
    bindings.refreshRightTeamLoadingMessage(message, tooltipText)
})

engine.on('refreshLoadingTip', function (tip) {
    bindings.refreshLoadingTip(tip)
})

engine.on('refreshLoadingTip2', function (tip) {
    bindings.refreshLoadingTip2(tip)
})

engine.on('refreshLoadingStickerTest', function (player, name, guild, tagline, level, rating, image,
    countryCode, lastSeasonRating, countryName, disabled, suffix, isAlly, avatarStacks, guildAvatar, guildAvatarStacks) {

    var randomWins = Math.floor(Math.random() * 2000)

    var loadingStickerProperties = {
        player: player,
        name: name,
        guild: guild,
        tagline: tagline,
        level: level,
        rating: rating,
        image: image,
        avatarStacks: avatarStacks,
        countryCode: countryCode,
        lastSeasonRating: lastSeasonRating,
        countryName: countryName,
        disabled: disabled,
        suffix: suffix,
        isAlly: isAlly,
        guildAvatar: guildAvatar,
        guildAvatarStacks: guildAvatarStacks,
        overrideRatingWithWins: 0, //randomWins,
        overrideRatingWithLosses: 0, //Math.round(0.90 * randomWins + randomWins * Math.random() * 0.2),
    }

    if (player == 4)
        loadingStickerProperties.incomeBonus = 10
    if (player == 2)
        loadingStickerProperties.incomeBonus = 2
    if (player == 3)
        loadingStickerProperties.incomeBonus = 6

    engine.trigger('refreshLoadingSticker', loadingStickerProperties)
})

engine.on('refreshLoadingSticker', function (loadingStickerProperties) {
    var player = loadingStickerProperties.player
    if (player < 1 || player >= bindings.refreshLoadingSticker.length) return
    if (typeof bindings.refreshLoadingSticker[player] === "function") {
        bindings.refreshLoadingSticker[player](loadingStickerProperties)
    }
})

engine.on('refreshLoadingStickerProgress', function (player, progress) {
    if (player < 1 || player >= bindings.refreshLoadingStickerProgress.length) return
    if (typeof bindings.refreshLoadingStickerProgress[player] === "function") {
        bindings.refreshLoadingStickerProgress[player](progress)
    }
})

// Browser menu

engine.on('refreshBrowserRooms', function (rooms) {
    bindings.refreshBrowserRooms(rooms)
})

engine.on('setSelectedBrowserRoom', function (roomNumber) {
    bindings.setSelectedBrowserRoom(roomNumber)
})

engine.on('fakeBrowserRoomLoading', function () {
    bindings.fakeBrowserRoomLoading()
})

// Guilds menu

engine.on('refreshGuildDirectory', function (guilds) {
    bindings.refreshGuildDirectory(guilds)
    globalState.guildDirectory = guilds
})

engine.on('setSelectedGuildEntry', function (guildNumber) {
    bindings.setSelectedGuildEntry(guildNumber)
})

engine.on('refreshInvitationsList', function (invitationsList) {
    bindings.refreshInvitationsList(invitationsList)
    globalState.invitationsList = invitationsList
})

engine.on('setSelectedInvitation', function (inviteNumber) {
    bindings.setSelectedInvitation(inviteNumber)
})

// Chat room

engine.on('showBottomBar', function (show) {
    //console.log('showBottomBar: ' + show)
    bindings.showBottomBar(show)
})

engine.on('refreshChatConnectionStatus', function (status) {
    console.log('refreshChatConnectionStatus: ' + status)
    bindings.refreshChatConnectionStatus(status)
})

engine.on('showTopBar', function (text, url) {
    globalState.showTopBar = text.length > 0

    console.log('showTopBar ' + text)

    bindings.showTopBar(text, url)
})

engine.on('enableClientMenuPopout', function (enabled) {
    bindings.enableClientMenuPopout(enabled)
})

engine.on('refreshTwitchStreams', function (data) {
    bindings.refreshTwitchStreams(data)
})

engine.on('refreshTwitchStreamCount', function (count) {
    bindings.refreshTwitchStreamCount(count)
})

engine.on('enableTwitchPopout', function (enabled) {
    bindings.enableTwitchPopout(enabled)
})

engine.on('setChatRoomProperties', function (properties) {
    bindings.setChatRoomProperties(properties)

    console.log("setChatRoomProperties with name " + properties.chatRoomName + " and type " + properties.chatRoomType + " --> showBottomBar to true")
    engine.trigger('showBottomBar', true)

    if (properties.chatRoomType == "InGame") {
        console.log("this type of chat is autohidden --> enableChat to false")
        engine.trigger('enableChat', false)
    }
})

engine.on('renderChatRoomSubscribers', function (subscribers, amountOfSubscribers) {
    bindings.refreshChatSubscribers(subscribers, amountOfSubscribers)
})

engine.on('clearChat', function () {
    bindings.clearChat[ChatType.bottomBar]()
})

// Preview
engine.on('updatePreviewOptions', function (updatedList, markNoPreviewOption) {
    bindings.updatePreviewOptions[ChatType.bottomBar](updatedList, markNoPreviewOption)
    bindings.updatePreviewOptions[ChatType.ingame](updatedList, markNoPreviewOption)
})

var viewProfile = function (playFabId, viewName) {
    globalState.lastProfilePlayFabId = playFabId

    // Smelly way of triggering loading spinner
    globalState.currentProfileLoadingName = 'placeholder'
    bindings.showProfileLoading('placeholder')

    console.log('ViewProfile for user: ' + playFabId + ', viewName to load: ' + viewName)
    engine.call('GetProfileForPlayer', playFabId)
    engine.trigger('loadView', viewName)

    if (isBrowserTest) {
        setTimeout(function () {
            engine.trigger('refreshProfile', testProfile)
        }, 1500)
    }
}

// Profile
engine.on('viewProfile', function (playFabId) { viewProfile(playFabId, 'profile') })
// Smelly way of being able to view someone's profile, but go Back to the correct place
engine.on('viewLeaderboardProfile', function (playFabId) { viewProfile(playFabId, 'leaderboardProfile') })
engine.on('viewIngameProfile', function (playFabId) { viewProfile(playFabId, 'ingameProfile') })
engine.on('viewPostGameProfile', function (playFabId) { viewProfile(playFabId, 'postGameProfile') })
engine.on('viewGuildPlayerProfile', function (playFabId) { viewProfile(playFabId, 'guildPlayerProfile') })

engine.on('showProfileLoading', function (name) {
    globalState.currentProfileLoadingName = name
    bindings.showProfileLoading(name)
})

engine.on('refreshProfile', function (profile) {
    console.log('refreshProfile (UI Only) with name: ' + profile.name)

    // Smelly hotfix for profile overview sometimes showing infinite "Loading LiskTest2's profile" (placeholder txt)
    globalState.currentProfileLoadingName = ""

    bindings.refreshProfile(profile)
    globalState.mainProfile = profile

    if (typeof bindings.refreshInventory === "function")
        bindings.refreshInventory(profile)
    if (typeof bindings.refreshCosmetics === "function")
        bindings.refreshCosmetics(profile)
    if (typeof bindings.refreshMatchHistory === "function")
        bindings.refreshMatchHistory(profile)
    if (typeof bindings.refreshFighterStats === "function")
        bindings.refreshFighterStats(profile)
    if (typeof bindings.refreshWaveStats === "function")
        bindings.refreshWaveStats(profile)
    if (typeof bindings.refreshMonuments === "function")
        bindings.refreshMonuments(profile)
    if (typeof bindings.refreshMasteries === "function")
        bindings.refreshMasteries(profile)
})

// For browsing any Guild profile
engine.on('viewGuildProfile', function (guild) {
    console.log('viewGuildProfile')

    globalState.selectedGuild = guild

    if (globalState.currentView != 'guild'
        && globalState.currentView != 'ingameprofileguild'
        && globalState.currentView != 'profileguild'
        && globalState.currentView != 'leaderboardguild') {
        var viewName = 'guild'

        console.log('currentView when about to load guild profile was: ' + globalState.currentView)

        if (globalState.currentView == 'ingameprofile')
            viewName = 'ingameprofileguild'
        if (globalState.currentView == 'profile')
            viewName = 'profileguild'
        if (globalState.currentView == 'leaderboards')
            viewName = 'leaderboardguild'

        engine.trigger('loadView', viewName)
    }

    bindings.refreshGuild(guild)
})

engine.on('refreshMyGuildVitals', function (guildId, guildAbbreviation, guildName) {
    console.log('refreshMyGuildVitals ' + guildId + ', ' + guildAbbreviation + ', ' + guildName)
    globalState.myGuildId = guildId
    globalState.myGuildAbbreviation = guildAbbreviation
    globalState.myGuildName = guildName

    if (!globalState.refreshMyGuildVitalsCalledYet) {
        console.log('refreshMyGuildVitals called first time')
        globalState.refreshMyGuildVitalsCalledYet = true
    }

    // Force refresh sidebar
    engine.trigger('refreshSidebarProfile', globalState.profile)
})

engine.on('loadMyGuildProfile', function () {
    loadMyGuildProfile()
})

engine.on('refreshSelectableAvatars', function (avatars) {
    console.log('refreshSelectableAvatars: ' + avatars.length + ' avatars')
    globalState.selectableAvatars = avatars
})

engine.on('requestSelectAvatar', function (avatarImage) {
    console.log('requestSelectAvatar: ' + avatarImage)
    engine.call('OnRequestSelectAvatar', avatarImage)
})

engine.on('requestSelectGuildAvatar', function (avatarItemType) {
    console.log('requestSelectGuildAvatar: ' + avatarItemType)
    engine.call('OnRequestSelectGuildAvatar', avatarItemType)
})

engine.on('refreshSelectableGuildAvatars', function (avatars) {
    console.log('refreshSelectableGuildAvatars: ' + avatars.length + ' avatars')
    globalState.selectableGuildAvatars = avatars
})

engine.on('requestDonateCard', function (itemType) {
    console.log('requestDonateCard, itemType: ' + itemType)
    engine.call('OnRequestDonateCard', itemType)
})

engine.on('requestSellCard', function (itemType) {
    console.log('requestSellCard, itemType: ' + itemType)
    engine.call('OnClickConvertToEssence', itemType)
    if (!isUnityHost)
        engine.trigger('loadConfirmConversionPopup', itemType, 'Test Card', 'icons/Wileshroom.png', globalState.currency, globalState.currency + 1000, 1, 0, false)
})

engine.on('requestEquipCard', function (itemType, monumentSlot) {
    console.log('requestEquipCard, itemType: ' + itemType + ', monumentSlot: ' + monumentSlot)
    engine.call('OnRequestEquipCard', itemType, monumentSlot)
})

engine.on('requestUnequipCard', function (itemType, monumentSlot) {
    console.log('requestUnequipCard, itemType: ' + itemType + ', monumentSlot: ' + monumentSlot)
    engine.call('OnRequestUnequipCard', itemType, monumentSlot)
})

// Leaderboards

engine.on('refreshLeaderboard', function (statisticName, leaderboardEntries, leaderboardEntriesAroundMe) {
    console.log('refreshLeaderboard stat: ' + statisticName)
    bindings.refreshLeaderboard[statisticName](leaderboardEntries, leaderboardEntriesAroundMe)
})

engine.on('refreshTopCountries', function (statisticName, leaderboardEntries) {
    console.log('refreshTopCountries stat: ' + statisticName)
    bindings.refreshTopCountries[statisticName](leaderboardEntries)
})

// Make sure the statisticName is correct!
engine.on('refreshLeaderboardActiveStat', function (statisticName) {
    bindings.refreshLeaderboardActiveStat(statisticName)
})

// Post game stats
engine.on('refreshPostGameStats', function (stats) {
    console.log('refreshPostGameStats with result: ' + stats.personal.gameResultText)
    bindings.refreshPostGameStats(stats)
    globalState.postGameStats = stats
})

engine.on('refreshPostGameWaves', function (waveInfo) {
    console.log('refreshPostGameWaves with ' + waveInfo.length + ' waves')
    bindings.refreshPostGameWaves(waveInfo)
    globalState.postGameWaves = waveInfo
})

engine.on('refreshPostGameBuilds', function (buildInfo) {
    console.log('refreshPostGameBuilds with ' + buildInfo.builds.length + ' waves')
    bindings.refreshPostGameBuilds(buildInfo)
    globalState.postGameBuilds = buildInfo
})

engine.on('refreshPostGameGraphs', function (graphInfo) {
    console.log('refreshPostGameGraphs')
    bindings.refreshPostGameGraphs(graphInfo)
    globalState.postGameGraphs = graphInfo
})

// Debugging event recording

engine.on('beginEventRecording', function () {
    console.log("DEBUG: begin event recording")
    engine.beginEventRecording()
})

engine.on('endEventRecording', function () {
    console.log("DEBUG: ending event recording")
    engine.endEventRecording()
    engine.saveEventRecord()
})

engine.on('refreshUsername', function (savedUsername) {
    console.log("refreshUsername to: " + savedUsername)
    globalState.savedUsername = savedUsername
    globalState.currentProfileLoadingName = savedUsername
})

engine.call('GetSavedUsername').then(function (savedUsername) {
    console.log("Saved username was: " + savedUsername)
    globalState.savedUsername = savedUsername
})

engine.on('refreshCountryCode', function (countryCode) {
    console.log("refreshCountryCode to: " + countryCode)
    globalState.savedCountryCode = countryCode
})

// Options
engine.on('loadOptions', function (options) {
    console.log("loading options from dictionary")

    for (var key in options) {
        //console.log("found key: " + key + ": " + options[key] + ", optionType: " + options[key].optionType
        //    + ", defaultValue: " + options[key].defaultValue + ", min: " + options[key].min + ", max: " + options[key].max)

        if (!options[key].optionType) {
            console.warn("WARNING! no option type passed for option " + key)
            continue
        }

        if (options[key].optionType == "range")
            setOptionsValue(key, options[key].value, options[key].defaultValue, options[key].min, options[key].max)
        else if (options[key].optionType == "choice")
            setOptionsValue(key, options[key].value, options[key].defaultValue, options[key].possibleValues)
        else if (options[key].optionType == "hotkey")
            setOptionsValue(key, options[key].value)
    }
})

engine.on('confirmApplyOptions', function () {
    loadPopupExplicit(
        loc('confirm_new_options', 'Confirm new options'),
        loc('confirm_new_options_long', 'Press OK to confirm new settings. Otherwise they will be reverted in 10 seconds.'),
        null,
        [
            {
                key: 1, menuId: 1, name: "Cancel", displayName: loc('cancel', 'Cancel'),
                behavior: function () {
                    engine.call("CancelOptions")
                    engine.trigger("escape") // go back to launcher or game menu
                }
            },
            {
                key: 0, menuId: 0, name: "Confirm", displayName: loc('confirm', 'Confirm'),
                buttonStyle: 1, behavior: function () {
                    engine.call("SaveOptions")
                    engine.trigger("escape") // go back to launcher or game menu
                }
            }
        ]
        , false, null)
})

engine.on('setOptionsValue', function (key, value, defaultValue) {
    //console.log("setOptionsValue " + key + " --> " + value)
    setOptionsValue(key, value, defaultValue, [])
})

engine.on('refreshHotkeyList', function (hotkeyFieldsList) {
    bindings.refreshHotkeyList(hotkeyFieldsList)
})

engine.on('setOptionEnabled', function (field, enabled) {
    if (typeof bindings.setOptionEnabled[field] === "function") {
        bindings.setOptionEnabled[field](enabled)
        return
    } else {
        console.warn("WARNING! Tried to setOptionEnabled for a nonexistent field: " + field)
    }
})

// Matchmaking

engine.on('trySearchGame', function (gameType) {
    engine.call('OnTrySearchGame', gameType)

    if (gameType == 'normal')
        globalState.currentGameMode = 'Normal'
    else if (gameType == 'casual')
        globalState.currentGameMode = 'Casual'
    else if (gameType == 'practice'
        || gameType == 'beginnerbots'
        || gameType == 'easybots'
        || gameType == 'veryeasybots'
        || gameType == 'mediumbots'
        || gameType == 'hardbots'
        || gameType == 'insanebots'
        || gameType == 'expertbots'
        || gameType == 'masterbots'
        || gameType == 'seniormasterbots'
        || gameType == 'grandmasterbots')
        globalState.currentGameMode = 'Play vs. AI'
    else if (gameType == 'arcade')
        globalState.currentGameMode = 'Featured'
    else if (gameType == 'classic')
        globalState.currentGameMode = 'Classic'
    else
        globalState.currentGameMode = 'Custom'
})

engine.on('tryCancelSearchGame', function () {
    console.log('tryCancelSearchGame clicked --> trigger OnTryCancelSearchGame')
    engine.call('OnTryCancelSearchGame')
    bindings.tryCancelSearchGame()
})

// Mainly for partied clients of a canceled matchmaking to update their UI without triggering new cancels
engine.on('tryCancelSearchGameUIOnly', function () {
    console.log('tryCancelSearchGameUIOnly()')
    bindings.tryCancelSearchGame()
})

engine.on('enableHurryUpSearch', function (enabled) {
    bindings.enableHurryUpSearch(enabled)
})

engine.on('hurryUpSearch', function () {
    engine.call('OnHurryUpSearch')
    bindings.hurryUpSearch()
})

engine.on('startSearchGame', function (gameType, estimatedTime) {
    engine.trigger('enableSearchingForMatch', true)
    engine.trigger('refreshExtraSearchText', "")

    bindings.startSearchGame(gameType, estimatedTime)

    engine.call('OnStartSearchGame')
})

engine.on('enterMatchmakingQueue', function (gameType) {
    bindings.enterMatchmakingQueue(gameType)
})

engine.on('refreshExtraSearchText', function (text) {
    bindings.refreshExtraSearchText(text)
})

engine.on('cancelSearchGame', function () {
    engine.trigger('enableSearchingForMatch', false)

    bindings.cancelSearchGame()
})

engine.on('foundGame', function () {
    bindings.foundGame()
    engine.call("OnFoundGame")
})

engine.on('setSearchGameMessage', function (message) {
    bindings.setSearchGameMessage(message)
})

engine.on('setFontSize', function (value) {
    document.getElementsByTagName('body')[0].style = 'font-size: ' + value
})

// Pregame

engine.on('setForcePickLegionIndex', function (index) {
    globalState.forcePickLegionIndex = index
    if (index >= 0)
        engine.trigger('loadView', 'pregame')
})

// Rerolls

engine.on('showRerollWindow', function (rolls, mulligansRemaining) {
    bindings.showRerollWindow(rolls, mulligansRemaining)
})

engine.on('hideRerollWindow', function () {
    bindings.hideRerollWindow()
})

engine.on('showReadyButton', function (text) {
    bindings.showReadyButton(text)

    // Smelly: force hide announcement to take priority over it
    engine.trigger('refreshAnnouncementEnabled', false)
    engine.trigger('refreshSubAnnouncementEnabled', false)
})

engine.on('hideReadyButton', function () {
    bindings.hideReadyButton()
})

engine.on('updateReadyPlayers', function (readyPlayersInfo) {
    bindings.updateReadyPlayers(readyPlayersInfo)
})

engine.on('refreshRerollHint', function (hint) {
    bindings.refreshRerollHint(hint)
})

engine.on('refreshRerollShowExtended', function (hint) {
    bindings.refreshRerollShowExtended(hint)
})

// Guide

engine.on('refreshGuideWaves', function (waves) {
    bindings.refreshGuideWaves(waves)
})

engine.on('enableGuideWaves', function (enabled) {
    bindings.enableGuideWaves(enabled)
})

engine.on('toggleGuideWaves', function () {
    bindings.toggleGuideWaves()
})

engine.on('enableGuideAttackTypes', function (enabled) {
    bindings.enableGuideAttackTypes(enabled)
})

engine.on('toggleGuideAttackTypes', function () {
    bindings.toggleGuideAttackTypes()
})

engine.on('refreshDamageTracker', function (tracker) {
    bindings.refreshDamageTracker(tracker)
})

engine.on('enableDamageTracker', function (enabled) {
    bindings.enableDamageTracker(enabled)
})

engine.on('toggleDamageTracker', function () {
    bindings.toggleDamageTracker()
})

// Singleplayer
// ================================================================================

engine.on('refreshSingleplayerMissions', function (missions) {
    bindings.refreshSingleplayerMissions(missions)
})

// Tutorial
engine.on('setSingleplayerMissionIndex', function (index) {
    bindings.setSingleplayerMissionIndex(index)
})

engine.on('renderTutorialArrowText', function (props) {
    var uiKey = props.uiKey
    var message = props.message
    var showContinue = props.showContinue
    var buttonText = ''

    if (showContinue)
        buttonText = loc('continue', 'Continue')

    // This crashes some non-English languages
    //if (props != null && props.id != "")
    //    console.log('renderTutorialArrowText' + JSON.stringify(props))

    if (typeof bindings.renderTutorialArrowText[uiKey] === "function")
        bindings.renderTutorialArrowText[uiKey](props, buttonText)
    else
        console.warn('No renderTutorialArrowText defined for uiKey: ' + uiKey)
})

engine.on('clearArrowTexts', function () {
    var emptyProps = {
        id: '',
        uiKey: '',
        message: '',
        showContinue: false,
        arg1: '',
        hideArrow: false,
        mirror: false,
    }
    for (var uiKey in bindings.renderTutorialArrowText) {
        emptyProps.uiKey = uiKey
        bindings.renderTutorialArrowText[uiKey](emptyProps, '')
    }
})

engine.on('updateGroundArrowTextPosition', function (index, top, left) {
    bindings.updateGroundArrowTextPosition[index](top, left)
})

engine.on('refreshObjectives', function (objectives) {
    bindings.refreshObjectives(objectives)
})

engine.on('setMissionCompleteXpEarned', function (xpEarned) {
    globalState.missionCompleteXpEarned = xpEarned
    console.log('set mission complete xpearned to: ' + globalState.missionCompleteXpEarned)
})

engine.on('setCampaignStarsEarned', function (starsEarned) {
    globalState.campaignStarsEarned = starsEarned
    //console.log('set campaignStarsEarned to: ' + JSON.stringify(globalState.campaignStarsEarned))
})

engine.on('updateBackToLane', function (top, left, rotation) {
    bindings.updateBackToLane(top, left, rotation)
})

// Legal stuff
engine.on('refreshPrivacyPolicy', function (text) {
    globalState.privacyPolicy = text
})

// News stuff
engine.on('refreshNews', function (news) {
    globalState.newsIndex = -1 // Start at -1 because we have to increment in getNextNews to make sure we can call loadpopup with the current index
    //console.log("Refreshing news" + JSON.stringify(news))
    console.log("Refreshing news - count: " + news.length)


    if (!isBrowserTest) {
        for (i = 0; i < news.length; i++)
            news[i].Body = JSON.parse(news[i].Body)
    }

    globalState.news = news
    globalState.unescapablePopup = true // v10.01
    //console.log("Title subtitle:" + globalState.news[0].Body.subtitle);
})

engine.on('getNextNews', function (isArchive) {
    console.log('getNextNews, isArchive: ' + isArchive)
    globalState.newsIsArchive = isArchive

    if (!isArchive) {
        if (globalState.skipThisNews) {
            var update = !globalState.publicTestRealm && !globalState.directConnectionEnabled
            //update = true // JUST FOR TESTING - DISABLE THIS BEFORE COMITTING
            engine.call("MarkNewsIdAsRead", globalState.news[globalState.newsIndex].NewsId, update)
            engine.trigger('skipNewsNextTime')
        }
    }

    if (globalState.news[globalState.newsIndex + 1] == null) {
        console.log("No news left.")
        if (!isArchive)
            engine.call("LastNewsRead") // This will enable login (connect to lobby etc.)
        return
    }

    console.log("Getting next news with index " + globalState.newsIndex)
    globalState.newsIndex++
    engine.trigger('loadPopup', 'news')
})

engine.on('toggleSkipNewsNextTime', function () {
    globalState.skipThisNews = !globalState.skipThisNews
    console.log("Checkbox to skip news next time checked: " + globalState.skipThisNews + " at index " + globalState.newsIndex)
    bindings.popupCheckboxToggled(globalState.skipThisNews)
    engine.trigger('loadPopup', 'news') // reload popup to re-render checkbox
})

// Inbox for custom notifications - Set message first, then show popup
engine.on('refreshInboxMessages', function (messages) {
    bindings.refreshInboxMessages(messages)
})

engine.on('enableInboxPopout', function (enabled) {
    bindings.enableInboxPopout(enabled)
})

// Spectator
engine.on('refreshSpectatorScoreboard', function (scoreboardInfo) {
    bindings.refreshSpectatorScoreboard(scoreboardInfo)
})
engine.on('refreshSpectatorLeaks', function (leaks) {
    //console.log('refreshSpectatorLeaks ' + JSON.stringify(leaks))
    bindings.refreshSpectatorLeaks(leaks)
})
engine.on('toggleSpectatorScoreboardView', function () {
    bindings.toggleSpectatorScoreboardView()
})

// Tooltips
engine.on('alwaysShowExtendedTooltips', function (enabled) {
    globalState.alwaysShowExtendedTooltips = enabled
})

// Ranked season
engine.on('refreshRankedSeason', function (season) {
    globalState.season = season
})

// Codex
engine.on('refreshCodexContent', function (codexContent) {
    globalState.codexContent = codexContent
})

engine.on('refreshLegionColors', function (legionColors) {
    //console.log("refreshLegionColors:" + JSON.stringify(legionColors));
    Object.keys(legionColors).forEach(function (color) {
        var rgb = Helpers.hexToRgb(legionColors[color]);
        legionColors[color] = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",0.3)";
    })
    globalState.legionColors = legionColors
    //console.log("refreshLegionColors:" + JSON.stringify(legionColors));
})

engine.on('refreshCodexSelectedUnit', function (selectedUnitData) {
    globalState.lastCodexSelectedUnit = selectedUnitData
    bindings.refreshCodexSelectedUnit(selectedUnitData)
})

engine.on('refreshCodexSelectedHelp', function (selectedIndex) {
    bindings.refreshCodexSelectedHelp(selectedIndex)
})

engine.on('wasPartiedLastGame', function (enabled) {
    globalState.wasPartiedLastGame = enabled
})

engine.on('setEnemyFightersViewEnabled', function (enabled) {
    bindings.setEnemyFightersViewEnabled(enabled)
})

// Lag indicator
engine.on('enableLagIndicator', function (enabled) {
    bindings.enableLagIndicator(enabled)
})

// Throttle indicator
engine.on('enableThrottleIndicator', function (enabled) {
    bindings.enableThrottleIndicator(enabled)
})

// Usually used for loc to reload views
engine.on('forceReloadView', function () {
    console.log("Force reloading view...")
    loadConfig()
})

engine.on('setLanguage', function (language) {
    globalState.language = language

    console.log("setLanguage to " + language)

    var languageFont = getLocalizedFontName(language)
    console.log("setLanguageFont to " + languageFont)

    // v2.41a hotfix
    var englishLanguageFont = getLocalizedFontName('english')

    createCSSSelector('body', 'font-family: ' + languageFont + ', ' + englishLanguageFont + ' !important')

    /* These must be set explicitly because they don't inherit from body normally */
    //createCSSSelector('input', 'font-family: ' + languageFont + ' !important');
    //createCSSSelector('textarea', 'font-family: ' + languageFont + ' !important');
    /* v3.15 we should just use the noto universal font for all input stuff */

    if (languageFont == 'MenuFont_japanese' || languageFont == 'MenuFont_korean'
        || languageFont == 'MenuFont_chinese_simplified' || languageFont == 'MenuFont_chinese_traditional'){
        createCSSSelector('#Masthead .Wave .label', 'margin-top: 8px !important')
        createCSSSelector('#Masthead .Wave .label .time', 'font-size: 24px !important')
        createCSSSelector('.billboards .section', 'font-size: 14px !important')
    } else {
        createCSSSelector('#Masthead .Wave .label', 'margin-top: 6px !important')
        createCSSSelector('#Masthead .Wave .label .time', 'font-size: 32px !important')
        createCSSSelector('.billboards .section', 'font-size: 18px !important')
    }

    // Turkish override for wave timer
    if (language == 'turkish') {
        console.log('special turkish masthead style')
        createCSSSelector('#Masthead .Wave .label .text', 'font-size: 12px')
    } else {
        createCSSSelector('#Masthead .Wave .label .text', 'font-size: 16px')
    }

    // Russian override for main menu
    if (language == 'russian') {
        createCSSSelector('.button.textonly.huge', 'font-size: 4vh !important')
    } else {
        createCSSSelector('.button.textonly.huge', 'font-size: 6vh !important')
    }

    // Non-English Cards tend to be longer
    if (language != "english") {
        createCSSSelector('.small-card-art.card-art-container .front-description.metal', 'font-size: 8px !important')
        createCSSSelector('.small-card-art.card-art-container .front-description.metal', 'line-height: 8px !important')
    } else {
        createCSSSelector('.small-card-art.card-art-container .front-description.metal', 'font-size: 10px !important')
        createCSSSelector('.small-card-art.card-art-container .front-description.metal', 'line-height: 10px !important')
    }

    console.log("done setting language to " + language)
})

engine.on('refreshPlayersOnline', function (count) {
    globalState.playersOnline = count
})

engine.on('refreshGameId', function (gameId) {
    globalState.gameId = gameId
})

engine.on('refreshSelectedSkin', function (skinEntry, skin) {
    //console.log('refreshSelectedSkin with skinEntry ' + JSON.stringify(skinEntry) + ', skin ' + JSON.stringify(skin))
    bindings.refreshSelectedSkin(skinEntry, skin)

    // this just updates the crosshair thing I think
    engine.trigger('refreshSelectedCosmetic', skinEntry.key)
})

engine.on('refreshCatalog', function (catalog, mysteriousCardItem, mysteriousCardStock, mysteriousCardStockSecondsRemaining) {
    globalState.shopCatalog = catalog
    globalState.mysteriousCardStock = mysteriousCardStock

    var i = 0
    for (i = 0; i < bindings.refreshCatalog.length; i++) {
        if (typeof bindings.refreshCatalog[i] === "function")
            bindings.refreshCatalog[i](catalog, mysteriousCardItem, mysteriousCardStock, mysteriousCardStockSecondsRemaining)
    }
})

engine.on('refreshAllCardTypes', function (allCardTypes) {
    globalState.allCardTypes = allCardTypes
})

engine.on('forceRefreshShopView', function () {
    bindings.forceRefreshShopView()
})

engine.on('refreshSelectedCosmetic', function (skinKey) {
    bindings.refreshSelectedCosmetic(skinKey)
})

engine.on('loadItemUnlockedPopup', function (popupName, popupDescription, triggerToCallAfterOk, itemType, itemRarity) {
    loadPopupExplicit(popupName, popupDescription, null, createOkMenu(function () {
        if (triggerToCallAfterOk != "") {
            console.log('triggerToCallAfterOk: ' + triggerToCallAfterOk)
            engine.call(triggerToCallAfterOk, itemType)
        }
    }), false, false, null, true, {
        //customHeaderStyle: { background: 'transparent' },
        //customDescriptionStyle: { background: 'transparent' },
        customClasses: itemRarity
    })
    globalState.unescapablePopup = true // Generally don't want them ESC'ing out of this I think. Since that would side-step the triggerToCallAfterOk
})

engine.on('setCardWizardBackgroundAnimationState', function (stateNumber) {
    console.log('setCardWizardBackgroundAnimationState ' + stateNumber)
    bindings.setCardWizardBackgroundAnimationState(stateNumber)
})

engine.on('setCardWizardInProgress', function (enabled) {
    console.log('set isCardWizardInProgress: ' + enabled)
    globalState.isCardWizardInProgress = enabled
})

engine.on('setCardWizardCardInfo', function (name, description, splashImage, rarity) {
    console.log('setCardWizardCardInfo ' + name)
    bindings.setCardWizardCardInfo(name, description, splashImage, rarity)
})

engine.on('showCardWizardBackground', function () {
    showFullScreenPopup(getCardWizardBackgroundWindow(), false, null, true)
})

engine.on('showMiniShopWindow', function (items, payementProcessorIndex, miniShopData) {
    globalState.miniShopWindowItems = items

    //console.log('showMiniShopWindow with items ' + JSON.stringify(items))
    console.log('payementProcessorIndex: ' + payementProcessorIndex)

    // Use cached if nothing is passed
    if (!miniShopData)
        miniShopData = globalState.miniShopData

    //console.log('miniShopData: ' + JSON.stringify(miniShopData))

    showFullScreenPopup(getMiniShopWindow(items, payementProcessorIndex, miniShopData), false)
})

engine.on('refreshMiniShopData', function (miniShopData) {
    //console.log('refreshMiniShopData ' + JSON.stringify(miniShopData))

    globalState.miniShopData = miniShopData
})

engine.on('loadRechargeWindow', function () {
    engine.call('OnLoadRechargeWindow', globalState.isGiftingPE)
})

// todo: deprecate in favor of setAccountUpgradeOwned
engine.on('setMastermindVariantEnabled', function (variant, enabled) {
    console.log('setMastermindVariantEnabled ' + variant + ': ' + enabled)
    globalState.mastermindVariantEnabled[variant] = enabled
})

engine.on('setAccountUpgradeOwned', function (itemType, enabled) {
    console.log('setAccountUpgradeOwned ' + itemType + ': ' + enabled)
    globalState.accountUpgradeEnabled[itemType] = enabled

})

engine.on('refreshIconSelectionItems', function (handlerKey, title, items, maxSelections) {
    bindings.refreshIconSelectionItems(handlerKey, title, items, maxSelections)
})

engine.on('showChallengeVictory', function (props) {
    showFullScreenPopup(getChallengeVictoryWindow(props), false, null, true)
})

engine.on('refreshWeeklyChallengeView', function (weeklyChallengeProps, leaderboardEntries, leaderboardEntriesAroundMe) {
    console.log('refreshWeeklyChallengeView')
    bindings.refreshWeeklyChallengeView(weeklyChallengeProps, leaderboardEntries, leaderboardEntriesAroundMe)
})

engine.on('refreshFeaturedModeView', function (featuredModeProps, leaderboardEntries, leaderboardEntriesAroundMe) {
    console.log('refreshFeaturedModeView')
    bindings.refreshFeaturedModeView(featuredModeProps, leaderboardEntries, leaderboardEntriesAroundMe)
})

engine.on('showGuildDirectory', function () {
    showFullScreenPopup(React.createElement(GuildDirectoryView), false)
    engine.call('OnShowGuildDirectory')

    if (isBrowserTest)
        engine.trigger('refreshGuildDirectory', testGuildDirectory)
})

engine.on('showGuildInvitations', function () {
    showFullScreenPopup(React.createElement(GuildInvitationsView), false)
    engine.call('OnShowGuildInvitations', globalState.myGuildId)

    if (isBrowserTest)
        engine.trigger('refreshInvitationsList', testGuildInvitations)
})

engine.on('showGuildEmblem', function () {
    console.log('showGuildEmblem')

    showFullScreenPopup(React.createElement(GuildEmblemView), false)

    engine.trigger('refreshEmblem', '', 'hud/img/ui/loading-small.gif', 'hud/img/ui/loading-small.gif')
    setTimeout(function () {
        engine.call('OnShowGuildEmblem')

        if (isBrowserTest)
            engine.trigger('refreshEmblem', testEmblemFolder, testEmblemBlob, testEmblemBlobBackend)
    }, 500)
})

engine.on('refreshEmblem', function (emblemFolder, emblemBlob, emblemBlobBackend) {
    console.log('refreshEmblem')
    bindings.refreshEmblem(emblemFolder, emblemBlob, emblemBlobBackend)
})

engine.on('showLastWeekWinner', function (props) {
    showFullScreenPopup(getLastWeekWinnerWindow(props), false)
})

engine.on('searchFriendRequest', function (feedbackMessage) {
    var description = loc('enter_username', 'Enter username')

    if (feedbackMessage != null && feedbackMessage.length > 0)
        description = feedbackMessage + "<br><br>" + description

    var hasInput = true

    loadPopupExplicit(loc('add_friend', "Add Friend"), description, null, acceptCancelMenu, hasInput, false, function (value) {
        engine.trigger('sendFriendRequest', value)
    })
})

engine.on('refreshFriendInvitationMenu', function (props) {
    globalState.inviteFriendMenuProps = props
    bindings.refreshFriendInvitationMenu(props)
})

engine.on('handleInvitedFriend', function (invitedFriend) {
    bindings.handleInvitedFriend(invitedFriend)
    engine.call('OnHandleInvitedFriend', invitedFriend)
})

// Pass in ConfirmPopupProperties.cs
engine.on('showConfirmPopupInput', function (props) {
    console.log('showConfirmPopupInput with props.data: ' + props.data)

    loadPopupExplicit(props.header, props.description, null, createConfirmBackMenu(
        function () {
            console.log('triggerIfConfirm: ' + props.triggerIfConfirm)
            engine.trigger(props.triggerIfConfirm, props.data, props.data2)
        },
        function () {
            console.log('triggerIfBack: ' + props.triggerIfBack)
            engine.trigger(props.triggerIfBack, props.data, props.data2)
        },
        props.currencyType,
        props.currencyCost
    ),
        false, false, null
    )
    globalState.unescapablePopup = true // Generally don't want them ESC'ing out of this I think. They can still Back out of it.
})

engine.on('showConfirmGiftPEPopupInput', function (props) {
    console.log('showConfirmPopupInput with props.data: ' + props.data + ' and props.data2: ' + props.data2)

    loadPopupExplicit(props.header, props.description, null, createConfirmBackMenu(
        function () {
            console.log('triggerIfConfirm: ' + props.triggerIfConfirm)
            engine.trigger('submitPopupMenuInput')
            //engine.trigger(props.triggerIfConfirm, props.data, props.data2)
        },
        function () {
            console.log('triggerIfBack: ' + props.triggerIfBack)
            // Hide popup?
        },
        props.currencyType,
        props.currencyCost
    ),
        true, true,
        function (giftMessage) {
            console.log('showConfirmGiftPEPopupInput: ' + giftMessage)
            var receipientObj = props.data
            var paymentObj = props.data2
            // Init purchase for gift
            engine.call("OnBuyCurrency", paymentObj.item.id, paymentObj.paymentProcessorId, paymentObj.nexusCreatorId, true, giftMessage, receipientObj.targetPlayFabId)
        }
    )
    globalState.unescapablePopup = true // Generally don't want them ESC'ing out of this I think. They can still Back out of it.
})

// These get called via engine.trigger(triggerIfConfirm) type of things, so don't delete!!
engine.on('confirmFriendRequest', function (data) { engine.call('OnConfirmFriendRequest', data) })
engine.on('confirmPartyInvite', function (data) { engine.call('OnConfirmPartyInvite', data) })
engine.on('confirmGuildInvite', function (data) { engine.call('OnConfirmGuildInvite', data) })
engine.on('confirmAcceptInboxInvite', function (data) { engine.call('OnConfirmAcceptInboxInvite', data) })
engine.on('confirmRejectInboxInvite', function (data) { engine.call('OnConfirmRejectInboxInvite', data) })
engine.on('confirmLeaveGuild', function (data) { engine.call('OnConfirmLeaveGuild', data) })
engine.on('confirmKickFromGuild', function (data) { engine.call('OnConfirmKickFromGuild', data) })
engine.on('confirmSendCustomGameInvite', function (data) { engine.call('OnConfirmSendCustomGameInvite', data) })
engine.on('confirmApplyToGuild', function (data) { engine.call('OnConfirmTryApplyForGuild', data) })
engine.on('confirmGiftAFriend', function (data) { engine.call('OnConfirmGiftAFriend', data) })

engine.on('searchPartyInvite', function (feedbackMessage) {
    var description = loc('enter_username', 'Enter username')

    if (feedbackMessage != null && feedbackMessage.length > 0)
        description = feedbackMessage + "<br><br>" + description

    var hasInput = true

    loadPopupExplicit(loc('invite_to_party', "Invite To Party"), description, null, sendInviteMenu, hasInput, false, function (value) {
        engine.trigger('sendPartyInvite', value, true)
    })
})

engine.on('searchGuildInvite', function (feedbackMessage) {
    // v7.03: SMELLY fix for if we accidentally pass in a JSON object here
    if (_.startsWith(feedbackMessage, '{'))
        feedbackMessage = ''

    var description = loc('enter_username', 'Enter username')

    if (feedbackMessage != null && feedbackMessage.length > 0)
        description = feedbackMessage + "<br><br>" + description

    var hasInput = true

    loadPopupExplicit(loc('invite_to_guild', "Invite to guild"), description, null, sendInviteMenu, hasInput, false, function (value) {
        engine.trigger('sendGuildInvite', value)
    })
})

engine.on('sendGuildInvite', function (displayName) {
    engine.call('OnSendGuildInvite', displayName)
})

engine.on('showDonateCardMenu', function (cards) {
    globalState.donatableCards = cards

    // Only open the popup if we currently have the popup open (didn't already hit back while loading)
    if (cards == null || (globalState.popup && globalState.lastPopupName == 'donate'))
        engine.trigger('loadPopup', 'donate')
})

engine.on('showEquipCardMenu', function (cards) {

    var equippableCards = null
    if (cards != null) {
        equippableCards = []

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i]

            // Can't equip secret cards (we don't have art assets for them)
            if (card.rarity == 'secret') {
                continue
            }

            // v10.05.1: Can't equip NPC cards (don't have models for them)
            if (card.notEquippable) {
                console.log('Skip card ' + card.name + ' since it was marked as notEquippable')
                continue
            }

            equippableCards.push(card)
        }
    }

    globalState.equippableCards = equippableCards

    // Only open the popup if we currently have the popup open (didn't already hit back while loading)
    if (cards == null || (globalState.popup && globalState.lastPopupName == 'equipcard'))
        engine.trigger('loadPopup', 'equipcard')
})

engine.on('showSellCardMenu', function (cards) {
    globalState.donatableCards = cards

    // Only open the popup if we currently have the popup open (didn't already hit back)
    if (cards == null || (globalState.popup && globalState.lastPopupName == 'sellcard'))
        engine.trigger('loadPopup', 'sellcard')
})

engine.on('showGuildWarTally', function (props) {
    showFullScreenPopup(getGuildWarTallyPopup(props), false)
})

engine.on('showImagePopup', function (props) {
    showFullScreenPopup(getGenericImagePopup(props), false)
})

engine.on('showIconsPopup', function (props) {
    showFullScreenPopup(getGenericIconsPopup(props), false)
})

engine.on('openDonateCardMenu', function () {
    engine.trigger('showDonateCardMenu', null)
    engine.call('OnRefreshMyCards', 'showDonateCardMenu')

    if (isBrowserTest) {
        setTimeout(function () { engine.trigger('showDonateCardMenu', testDonatableCards) }, 1500)
    }
})

engine.on('openEquipCardMenu', function () {
    engine.trigger('showEquipCardMenu', null)
    engine.call('OnRefreshMyCards', 'showEquipCardMenu')

    if (isBrowserTest) {
        setTimeout(function () { engine.trigger('showEquipCardMenu', testEquippableCards) }, 1500)
    }
})

engine.on('openSellCardMenu', function () {
    engine.trigger('showSellCardMenu', null)
    engine.call('OnRefreshMyCards', 'showSellCardMenu')

    if (isBrowserTest) {
        setTimeout(function () { engine.trigger('showSellCardMenu', testDonatableCards) }, 1500)
    }
})

engine.on('showGuildCreationSplash', function () {
    showFullScreenPopup(getGuildCreationSplash(), false)
})

engine.on('enableGuildBattleMode', function (enabled) {
    console.log('enableGuildBattleMode: ' + enabled)
    globalState.enableGuildBattleMode = enabled
})

engine.on('notEnoughPE', function () {
    engine.call('OnLoadRechargeWindow', globalState.isGiftingPE)
    if (isBrowserTest)
        engine.trigger('showMiniShopWindow', testCurrencyItems, 0)
})

engine.on('notEnoughSS', function () {
    // Nvm feels weird to open recharge window if you clicked something SS
    //engine.call('OnLoadRechargeWindow')
    //if (isBrowserTest)
    //    engine.trigger('showMiniShopWindow', testCurrencyItems, 0)
})

// SMELLY!! Hardcoded to open a numbered tab
engine.on('clickGuildWar', function () {
    engine.trigger('loadView', 'leaderboards')
    engine.trigger('selectSubmenu', 5)
    // Ghetto
    //setTimeout(function () {
    //    console.log('config bindings.refreshLeaderboardActiveStat: ' + bindings.refreshLeaderboardActiveStat)
    //    engine.trigger('refreshLeaderboardActiveStat', 'guildWarVictoryPoints')
    //}, 1000)
})

engine.on('refreshCampaignMap', function (map) {
    bindings.refreshCampaignMap(map)
})

// Campaign
engine.on('setSelectedCampaignMissionNumber', function (missionNumber, missionId) {
    bindings.setSelectedCampaignMissionNumber(missionNumber, missionId)
    engine.call('OnSetSelectedCampaignMissionNumber', missionNumber, missionId)
})

engine.on('setHoveredCampaignMissionNumber', function (missionNumber) {
    bindings.setHoveredCampaignMissionNumber(missionNumber)
})

engine.on('setCampaignFirstUnclearedMissionNumber', function (missionNumber) {
    bindings.setCampaignFirstUnclearedMissionNumber(missionNumber)
})

engine.on('refreshTotalStars', function (campaignStarsEarnedPerMap, campaignMaxStarsPerMap) {
    globalState.campaignStarsEarnedPerMap = campaignStarsEarnedPerMap
    globalState.campaignMaxStarsPerMap = campaignMaxStarsPerMap
})

engine.on('setCampaignEnabled', function (enabled) {
    console.log('setCampaignEnabled: ' + enabled)
    globalState.campaignEnabled = enabled
})

engine.on('setCampaignDlcOwned', function (listOfDlcs) {
    globalState.campaignDlcOwned = listOfDlcs
})

engine.on('preloadGameImages', function () {
    preloadGameImages()
})

engine.on('setMissionId', function (missionId) { globalState.missionId = missionId })

engine.on('setForceHideAutosend', function (enabled) { globalState.forceHideAutosend = enabled })

engine.on('forceSetProfilePlayFabId', function (playFabId) {
    console.log('forceSetProfilePlayFabId: ' + playFabId)
    bindings.forceSetProfilePlayFabId(playFabId)
})

engine.on('refreshTimedReleaseFeaturesActive', function (enabled) {
    console.log('refreshTimedReleaseFeaturesActive: ' + enabled)
    globalState.timedReleaseFeaturesActive = enabled
})

engine.on('refreshTimedReleaseFeaturesLocalString', function (localString) {
    console.log('refreshTimedReleaseFeaturesLocalString: ' + localString)
    globalState.timedReleaseFeaturesLocalString = localString
})

engine.on('refreshLeaderboardOpenings', function (leaderboard) {
    console.log('refreshLeaderboardOpenings: ' + leaderboard)
    globalState.savedLeaderboardOpenings = leaderboard
    bindings.refreshLeaderboardOpenings(leaderboard)
})

engine.on('refreshAnnouncement', function (text, preset) {
    bindings.refreshAnnouncement(text, preset)
})

engine.on('refreshAnnouncementEnabled', function (enabled) {
    bindings.refreshAnnouncementEnabled(enabled)
})

engine.on('refreshSubAnnouncement', function (text, preset, bottom) {
    bindings.refreshSubAnnouncement(text, preset, bottom)
})

engine.on('refreshSubAnnouncementEnabled', function (enabled) {
    bindings.refreshSubAnnouncementEnabled(enabled)
})

engine.on('setUIScaling4KEnabled', function (enabled) {
    document.getElementsByTagName('link')[3].disabled = !enabled; 
    if (globalState.screenWidth == 3840 || globalState.screenWidth == 3841)
        globalState.screenWidth = enabled ? 3840 : 3841
})

engine.on('setCurrentPatchBetaFeaturesEnabled', function (enabled) {
    console.log('setCurrentPatchBetaFeaturesEnabled: ' + enabled)
    globalState.currentPatchBetaFeaturesEnabled = enabled
})

engine.on('refreshChallengeMode', function (enabled) {
    globalState.challengeMode = enabled
})

engine.on('searchGiftAFriend', function (feedbackMessage) {
    var description = loc('gift_a_friend_long', '|c(ffff33):ONE-TIME USE ONLY|r. Enter the name of a single player to give a FREE gift of |img(shop/currency/PremiumEssence_20.png) 1000', [1000])

    if (feedbackMessage != null && feedbackMessage.length > 0)
        description = feedbackMessage + "<br><br>" + description

    var hasInput = true

    loadPopupExplicit(loc('gift_a_friend', "Gift a Friend"), description, null, giftAFriendMenu,
        hasInput, false, function (value) {
            console.log('submit gift a friend: ' + value)
            engine.call('OnSubmitGiftAFriend', value)
    })
})

// Gifting PE Step 2: Search Player and confirm name
engine.on('searchGiftPE', function (feedbackMessage) {
    var description = loc('choose_gift_recipient_long', 'Enter the name of the player who will receive your gift')

    if (feedbackMessage != null && feedbackMessage.length > 0)
        description = feedbackMessage + "<br><br>" + description

    //description += "<br>" + item.name + " (<img src='hud/img/shop/currency/PremiumEssence_32.png' class='currency-icon' /> " + item.value + ")<br>"

    console.log("searchGiftPE " + feedbackMessage)

    loadPopupExplicit(loc('choose_gift_recipient', 'Choose Gift Recipient'), description, null, giftAFriendMenu,
        true, false, function (value) {
            console.log('submit gift PE: ' + value)
            engine.call('OnSubmitSearchGiftPE', value)

            if (isBrowserTest) {
                var playerData = {}
                playerData.playFabId = "BBAE0B45BB3E9AB2"
                playerData.displayName = "EpvpDani"
                playerData.avatarUrl = "Icons/Aag.png"
                playerData.guild = "CUTE"
                playerData.level = 6
                playerData.rating = "1246"
                engine.trigger("updateGiftRecipient", playerData, true)
            }
    })
})

// Gifting PE Step 3: Update target data and enable gifting mode
engine.on('updateGiftRecipient', function (playerData, isGifting) {

    if(typeof playerData === "string") playerData = JSON.parse(playerData)

    globalState.giftTargetId = playerData.playFabId
    globalState.giftTargetName = playerData.displayName
    globalState.giftTargetAvatar = playerData.avatarUrl
    globalState.isGiftingPE = isGifting
    globalState.giftTargetGuild = playerData.guild
    globalState.giftTargetRating = playerData.rating
    globalState.giftTargetLevel = playerData.level
    globalState.giftTargetIsFriend = playerData.isFriend
    engine.call('OnLoadRechargeWindow', isGifting) // Refresh window
})

engine.on('updateSavedGiftAFriend', function (friendDisplayName) {
    globalState.giftAFriend = friendDisplayName
})

engine.on('updateAutopauseState', function (secondsRemaining, disconnectedPlayers, enableSkip) {
    console.log('updateAutopauseState secondsRemaining: ' + secondsRemaining + ', disconnectedPlayers: ' + disconnectedPlayers + ', enableSkip: ' + enableSkip)
    globalState.autopauseSeconds = secondsRemaining
    globalState.autopauseDisconnectedPlayers = disconnectedPlayers
    globalState.autopauseEnableSkip = enableSkip
})

engine.on('refreshFeaturedTwitchStream', function (featuredTwitchStream) {
    console.log('refreshFeaturedTwitchStream: ' + featuredTwitchStream)

    globalState.featuredTwitchStream = featuredTwitchStream
})

engine.on('enterContentCreatorCode', function (previousAttempt) {
    //var description = loc('enter_content_creator_code', 'Support a Legion TD 2 Creator by entering their creator code.')
    var description = loc('enter_creator_code', 'Enter creator code')
    //var description = '<br><br>'
    if (previousAttempt.length > 0) {
        description = loc('creator_code_not_found', 'Creator code not found: ' + previousAttempt, [previousAttempt]) + '<br><br>' + description
    }

    loadPopupExplicit(locName('creator_boost', 'Creator Boost'), description, null, confirmCancelMenu, true, false, function (value) {
        // 1. Iterate through our creators
        // 2. Select the index of the first match
        var matchedId = ''
        globalState.miniShopData.nexusSelectedCreator = -1
        for (var i = 0; i < globalState.miniShopData.nexusPayload.creators.length; i++) {
            var creator = globalState.miniShopData.nexusPayload.creators[i]
            var creatorCode = creator.nexusUrl

            //console.log('checking if ' + value + ' matches ' + creatorCode)
            if (value.toLowerCase() == creatorCode.toLowerCase()) {
                console.log('matched!')
                globalState.miniShopData.nexusSelectedCreator = i
                matchedId = creator.id
            }
        }

        // No match
        if (globalState.miniShopData.nexusSelectedCreator == -1) {
            engine.trigger('enterContentCreatorCode', value)
            return
        }

        engine.trigger('loadPopupBlank', loc('loading', 'Loading') + '...')
        engine.call('OnEnterContentCreatorCode', matchedId)

        if (!isUnityHost) {
            setTimeout(function () {
                engine.trigger('ReloadMiniShopWindow', 'hud/img/icons/Zeus.png')
            }, 300)
        }

    }, false, {
        customInputStyle: {
            maxLength: '50',
            blockNonWordCharacters: false,
        },
    })
})

// Smelly/hacky, but I'm pressed for time and this shouldn't need to change
engine.on('ReloadMiniShopWindow', function (profilePicUrl) {
    engine.trigger('hidePopup') // hide loading popup
    console.log('ReloadMiniShopWindow() with globalState.miniShopData.nexusSelectedCreator: ' + globalState.miniShopData.nexusSelectedCreator
        + ', profilePicUrl: ' + profilePicUrl)
    globalState.selectedCreatorAvatar = profilePicUrl
    showFullScreenPopup(getMiniShopWindow(globalState.miniShopWindowItems, 0, globalState.miniShopData), false)
})

engine.on('onScrollbarMouseDown', function (elementName) {
    if (typeof bindings.onScrollbarMouseDown[elementName] === "function") {
        bindings.onScrollbarMouseDown[elementName]()
    }
})

engine.on('onScrollbarMouseUp', function (elementName) {
    if (typeof bindings.onScrollbarMouseUp[elementName] === "function") {
        bindings.onScrollbarMouseUp[elementName]()
    }
})

engine.on('refreshEquippedGameCoachItem', function (itemId) {
    globalState.equippedGameCoachItem = itemId
})

engine.on('refreshEquippedClientBackgroundItem', function (itemId) {
    globalState.equippedClientBackgroundItem = itemId
})

engine.on('refreshGameCoachShopTooltips', function (tooltips) {
    globalState.gameCoachShopTooltips = tooltips
})

engine.on('refreshGameManualRead', function (gameManualRead) {
    //console.log('refreshGameManualRead with ' + gameManualRead.length + ' items: ' + JSON.stringify(gameManualRead))
    globalState.gameManualRead = gameManualRead
})

engine.on('requestCouponCode', function (previousAttempt, errorMessage) {
    console.log('requestCouponCode, previousAttempt: ' + previousAttempt + ', errorMessage: ' + errorMessage)

    var description = loc('redeem_code', 'Enter a code to redeem an in-game gift.')
    if (previousAttempt.length > 0) {
        description = loc('redeem_code_unsuccessful', 'The system was unable to process the entered code.|n|nPlease double-check and try again.', [previousAttempt])
        if (errorMessage.length > 0)
            description += '<br/><span style="color: #ffff33">' + loc('error', 'Error') + ': ' + errorMessage + '</span>'
    }

    loadPopupExplicit(locName('redeem_code', "Redeem Code"), description, null, acceptCancelMenu, true, false, function (value) {
        console.log('OnRequestCouponCode: ' + value)
        engine.call('OnRequestCouponCode', value)
    }, false, {
        customInputStyle: {
            maxLength: '12',
            blockNonWordCharacters: false,
        },
    })
})

engine.on('requestTwitchLink', function (error) {
    console.log('requestTwitchLink - error: ', error)

    var description = loc('link_twitch_account', "This will allow you to earn Twitch Drops in Legion TD 2. This is also required if you'd like to enable Twitch Drops on your own stream.")

    if (error.length > 0) {
        description = loc('link_account_unsuccessful', 'Unable to link Twitch account: ' + error, [error])
    }

    if (isBrowserTest) globalState.twitchName = "TestName"

    if (globalState.twitchName.length > 0) {
        var refreshLinkText = loc('refresh', 'Refresh')
        description = loc('your_linked_twitch_account', 'Your linked Twitch account') + ': <br><br><img style="width: 20px; vertical-align: middle;" src="hud/img/hudv2/TwitchGlitchPurple.png"/>&nbsp;' + globalState.twitchName + "<br><br><a href='#' onClick=\"engine.call('OnRefreshTwitchAccount')\">" + refreshLinkText + "</a>";
        loadPopupExplicit(locName('link_twitch_account', 'Link Twitch Account'), description, null, backMenu, false, false, function (value) { }, false, false)
        return
    }

    loadPopupExplicit(locName('link_twitch_account', 'Link Twitch Account'), description, null, getLinkTwitchMenu(), false, false, function (value) {
        console.log('requestTwitchLink: ' + value)
        //engine.call('requestTwitchLink', value)
    }, false, false)
})

// Versus
engine.on('enableVersus', function (enabled) {
    bindings.enableVersus(enabled)
})

engine.on('setTwitchName', function (name) {
    console.log('setTwitchName: ', name)

    globalState.twitchName = name
})

engine.on('refreshVersusInfo', function (versusInfo) {
    bindings.refreshVersusInfo(versusInfo)
})

engine.on('refreshMyPlayerId', function (player) {
    globalState.savedPlayerNumber = player
})

// NOTE: This isn't reliable yet, just a WIP.
engine.on('refreshHasMasteryReward', function (value) {
    globalState.hasMasteryReward = value
})

engine.on('refreshModeCheckedState', function (modeIndex, checkedState) {
    bindings.refreshModeCheckedState(modeIndex, checkedState)
    engine.call('OnRefreshModeCheckedState', modeIndex, checkedState)
})

engine.on('refreshModeVotingPlayerStates', function (playerStates) {
    bindings.refreshModeVotingPlayerStates(playerStates)
})

engine.on('refreshSpecialModeIndex', function (index) {
    bindings.refreshSpecialModeIndex(index)
})

engine.on('refreshModeVotingTimer', function (time) {
    bindings.refreshModeVotingTimer(time)
})

engine.on('refreshModePickedState', function (modeIndex, pickedState, yesVotes, noVotes, done) {
    bindings.refreshModePickedState(modeIndex, pickedState, yesVotes, noVotes, done)
})

engine.on('setModeVotingActive', function (active) {
    bindings.setModeVotingActive(active)
})

engine.on('refreshHotModeIndex', function (modeIndex) {
    globalState.hotModeIndex = modeIndex
})

engine.on('refreshCreatorCodeCreatorPercentText', function (text) {
    globalState.creatorCodeCreatorPercentText = text
})

engine.on('refreshCreatorCodePurchaserPercentText', function (text) {
    globalState.creatorCodePurchaserPercentText = text
})

engine.on('refreshNovaCupSecondsRemaining', function (seconds) {
    globalState.novaCupEndDate = new Date()
    globalState.novaCupEndDate.setSeconds(globalState.novaCupEndDate.getSeconds() + seconds)
    console.log('now: ' + (new Date()) + ', novaCupEndDate: ' + globalState.novaCupEndDate)

    var secondsUntilNovaBoostEnd = Math.max(0, Math.round((globalState.novaCupEndDate - new Date()) / 1000))
    globalState.novaBoostActive = secondsUntilNovaBoostEnd > 0
})

engine.on('refreshCurrentQuest', function (props) {
    globalState.questProps = props // Maybe fix the tutorial --> new player quest case
    // since ClientModifiers wasn't set up yet for the binding to kick in

    bindings.refreshCurrentQuest(props)
})

engine.on('refreshFreeCampaign2Tooltip', function (title, tooltip) {
    console.log('refreshFreeCampaign2Tooltip ' + title)
    globalState.freeCampaign2Title = title
    globalState.freeCampaign2Tooltip = tooltip
})

engine.on('triggerMatchFoundPopup', function (text, subtext, dontReset) {
    globalState.matchFoundText = text
    globalState.matchFoundSubtext = subtext

    if (!dontReset) {
        globalState.matchFoundButtonPressed = false
        globalState.matchFoundDeclinePressed = false
        globalState.matchFoundDone = false
        globalState.matchFoundTimeRemaining = globalState.matchFoundTimeMax
    }

    showFullScreenPopup(getMatchFound(), false)
})

engine.on('triggerMatchFoundDone', function () {
    globalState.matchFoundDone = true
})

engine.on('triggerMatchFoundAccept', function () {
    console.log('triggerMatchFoundAccept via code')
    acceptMatchFound()
})

engine.on('handleMatchDeclined', function () {
    console.log('handleMatchDeclined')
    engine.trigger('triggerMatchFoundDone')
    engine.trigger('hideFullScreenPopup', true)
    globalState.matchFoundTimeRemaining = 0

    // SUPER JANKY FIX FOR THE INVISIBLE UNCLICKABLE POPUP BUG
    setTimeout(function () {
        engine.trigger('hideFullScreenPopup', true)
    }, 100)
})

// Messing around with trying to figure out the Russian characters sometimes crashing console.log
// It is simply TOO spooky to figure out, though...
//engine.on('log', function (text) {
//    //console.log(text) // does not crash
//    //console.log("a " + text) // does not crash
//    //console.log("a " + text + " b " + text) // does not crash
//    //console.log(": " + text + ", " + text) // does not crash
//    console.log("loadPopupExplicit header: " + text + ", description: " + text) // does crash O.o
//})

console.log("--- DONE LOADING BINDINGS --- ")