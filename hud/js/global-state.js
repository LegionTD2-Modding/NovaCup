// Global state
// ===============================================================================

var globalState = {
    versionNumber: 'SAFETY MOLE PLUSHIE', // Don't rely on this value for any logic, since we sometimes override this with announcements like Nova Cup
    patchNotesImage: 'hud/img/patch/patch.png',
    patchNotesDate: "March 7, 2018",
    patchNotesDescription: "",
    savedUsername: "testuser",
    savedCountryCode: "",
    savedPlayerNumber: 0,
    playFabId: "",
    aiming: false,
    popup: false,
    lastPopupName: "",
    fullScreenPopup: false,
    unclickablePopup: false,
    unescapablePopup: false,
    chatEnabled: false,
    globalChatEnabled: false,
    isChatActive: false,
    consoleEnabled: false,
    showBetaWarning: false,
    singleplayerEnabled: false,
    currentView: "",
    currentGameMode: "",
    matchmakerQueue: "Unset",
    hasEnemyHumans: false, // useful for determining if this is a PvP game
    isAltHeld: false,
    isShiftHeld: false,
    isCtrlHeld: false,
    isSpectatorMode: false,
    gameTimeElapsedSeconds: 0,
    searchingForMatch: false, // if true, will disable some buttons
    matchmakingEnabled: true,
    matchmakingStarted: false, // for Play Again
    cancelingSearch: false, // for Play Again
    directConnectionEnabled: false,
    publicTestRealm: false,
    isTestAccount: false,
    casualEnabled: true,
    disablePracticeGames: false,
    partyLeaderEnabled: false,
    alwaysShowExtendedTooltips: false, // v1.49: always show extended // v3.15 now we wanna go back to the old ways
    screenWidth: 0,
    screenHeight: 0,
    chatTimeout: 10000, // in milliseconds
    guidePromptUsed: false,
    smallResolution: false,
    language: "",
    playersOnline: -1,
    gameId: "",
    rankedDisabledMessage: "",
    isMac: false,

    profile: {}, // sidebar profile I think
    level: 0, // account level
    mainProfile: {},
    selectableAvatars: [],
    selectableGuildAvatars: [],
    donatableCards: null,
    equippableCards: null,
    equippableCardsSecretCardCount: 0,
    selectedMonumentSlot: 0,
    friends: [], // For rendering
    inviteFriendMenuProps: {},
    party: [], // For rendering
    partyPlayFabIds: [],
    partyDisplayNames: [],
    partyLeader: "", // PlayFabId
    wasPartiedLastGame: false,
    friendPlayFabIds: [],
    mutedPlayers: [],
    reportedPlayers: [],
    thumbsUpPlayers: [],
    postGameStats: {},
    postGameWaves: [],
    postGameBuilds: {},
    postGameGraphs: null,
    contextMenuTarget: "",
    contextMenuDisplayTarget: "",
    contextMenuCustomValue1: "",
    contextMenuCustomValue2: "",
    clientModifiers: [],
    currency: 0,
    premiumEssence: 0,
    cardFragments: 0,
    cardTraderPity: 0,
    cardTraderRerolls: 0,
    hasNewItems: false,
    hasNewPatchNotes: false,
    hasNewGuildInvites: false,
    hasNewChallenge: false,
    currentProfileLoadingName: "",
    lastProfilePlayFabId: "",
    isInGame: false,
    automaticallyShowChatWindows: true,
    savedFeedMessages: [],
    queue1v1Enabled: false,

    // Guilds
    guildsEnabled: false,
    myGuildId: '',
    myGuildAbbreviation: '',
    myGuildName: '',
    refreshMyGuildVitalsCalledYet: false,
    selectedGuild: null,
    guildDirectory: null,
    invitationsList: null,
    guildWarActive: false,

    news: '',
    newsIndex: 0,
    skipThisNews: false,
    newsIsArchive: false, // Smelly :(

    forcePickLegionIndex: -1,
    privacyPolicy: '',
    isGuideWavesOpen: false,
    isTypeChartOpen: false,
    isDamageTrackerOpen: false,

    missionCompleteXpEarned: 0,
    campaignStarsEarned: [], // for Victory popup
    campaignStarsEarnedPerMap: [], // for Billboard view after Play > Campaign
    campaignMaxStarsPerMap: [], // for Billboard view after Play > Campaign
    campaignDlcOwned: [], 
    hudTheme: "night",
    season: 1,
    missionId: '',
    challengeMode: false,
    forceHideAutosend: false,

    customGameSettingsObject: {},
    modulePositionDefaults: {},
    codexContent: null,
    lastCodexSelectedUnit: null,
    legionColors: {},

    bottomBarLastEnabledState: false,
    lastChatViewTitle: "",

    crashPopup: false,

    inboxMessagesToDelete: [],
    playAgainEnabled: false,
    shopEnabled: false,
    freeAccount: false,
    campaignEnabled: false,
    shopCatalog: {},
    mysteriousCardStock: {},

    cardStockUntilRemainingSeconds: 0,
    mastermindVariantEnabled: [], // todo: deprecate
    accountUpgradeEnabled: {},

    clientVersion: '',
    storeMenuTabCount: 0,
    enableVideoRendering: false,

    enableGuildBattleMode: false,
    isCardWizardInProgress: false, // Smelly pattern to stop some UI stuff from interfering

    partySizeLimit: 8,
    inviteFriendStatus: '',

    timedReleaseFeaturesActive: false,
    timedReleaseFeaturesLocalString: '',

    savedLeaderboardOpenings: {},
    waveNumber: 0,
    currentPatchBetaFeaturesEnabled: true,

    giftAFriend: '',

    autopauseSeconds: 0,
    autopauseDisconnectedPlayers: [],

    learnMenuEnabled: true,
    featuredTwitchStream: '',
    miniShopData: {
        nexusSelectedCreator: -1
    },
    miniShopWindowItems: [],
    selectedCreatorAvatar: '',
    equippedGameCoachItem: '',
    equippedClientBackgroundItem: '',

    gameCoachShopTooltipIndex: 0,
    gameCoachShopTooltips: ["Something", "Another quote", "A third quote"],
    preventPopupOkBeforeTicks: 0,
    gameManualRead: [],

    goldRushEnabledUntilTicks: 0,

    getCardArtShowSecretCardSelection: false,
    allCardTypes: [],

    twitchName: '',

    randomizeBackground: false, // v10.00
    randomizeGameCoach: false, // v10.05
    hasMasteryReward: false,

    hotModeIndex: -1,

    creatorCodeCreatorPercentText: '<span style="color: #8ff110">10%</span>',
    creatorCodePurchaserPercentText: '',
    novaCupEndDate: null,
    novaBoostActive: false,

    isGiftingPE: false,
    giftTargetId: "",
    giftTargetName: "",
    giftTargetAvatar: "",
    giftTargetGuild: "",
    giftTargetRating: "",
    giftTargetLevel: 0,
    giftTargetIsFriend: false,

    emoteChooserItems: [],
    emoteChooserShowHint: false,
    questProps: {},

    freeCampaign2Title: '',
    freeCampaign2Tooltip: '',

    matchFoundText: '',
    matchFoundSubtext: '',
    matchFoundTimeRemaining: 0,
    matchFoundTimeMax: 12 * 1000,
    matchFoundButtonPressed: false,
    matchFoundDeclinePressed: false,
}