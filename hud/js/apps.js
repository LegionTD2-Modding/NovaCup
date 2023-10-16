// An App is a view that is always rendered. We are typically rendering like ~10 apps at any given time in the game.
// ==================================================================================

var MainApp = React.createClass({
    getInitialState: function () {
        return {
            enabled: true,
            visible: true,
            theme: "",
            backgroundImage: "",
        }
    },
    componentWillMount: function () {
        var parent = this

        bindings.enableHud = function (enabled) {
            parent.setState({ enabled: enabled })
        }
        bindings.setHudBackground = function (imagePath) {
            console.log('setHudBackground (should only be for browser testing): ' + imagePath) // v10.05.1 monitoring
            parent.setState({ backgroundImage: imagePath })
        }
        bindings.setHudTheme = function (theme) {
            parent.setState({ theme: theme })
        }
        bindings.enableCinematicMode = function (enabled) {
            parent.setState({ cinematic: enabled })
        }
        bindings.setHudVisible = function (visible) {
            parent.setState({ visible: visible })
        }
    },
    render: function () {
        // This pattern isn't good, because react won't fully rerender things when you change res
        //var isNarrow = globalState.screenWidth < 1800
        //var consoleBottomOffset = isNarrow ? '275px' : '128px'

        // Note: the further down, the more "on top" the module will be.
        return (
            React.createElement('div', {
                id: 'MainApp',
                className: ((this.state.enabled) ? '' : ' hidden'),
                style: {
                    opacity: (this.state.visible) ? '1' : '0'
                }
            },
                React.createElement('div', { className: 'anchor8' + ((this.state.cinematic) ? ' transparent' : '') },
                    React.createElement(Feed, {})
                ),
                React.createElement('div', { className: 'anchor1' + ((this.state.cinematic) ? ' transparent' : '') },
                    React.createElement(Module, { moduleId: 'targetFrame', width: 330, height: 93, defaultLeft: '1vw', defaultTop: '0', defaultBottom: '0', defaultRight: 'unset' },
                        React.createElement(TargetFrame, { theme: this.state.theme })
                    )
                ),
                React.createElement('div', { className: 'anchor4' },
                    globalState.screenWidth > 0 && React.createElement(Module, { moduleId: 'objectives', width: 320, height: 150, defaultTop: '0', defaultBottom: 'unset', defaultRight: '-10px' },
                        React.createElement(Objectives, {})
                    )
                ),
                React.createElement('div', { className: 'anchor4' + ((this.state.cinematic) ? ' transparent' : '') },
                    React.createElement(StackrankApp, {})
                ),
                React.createElement('div', {
                    className: 'anchor4' + ((this.state.cinematic) ? ' transparent' : ''),
                    style: { height: '0' } /* v6.02 WEIRD game-only fix for hitbox overlapping with stackrank */
                },
                    React.createElement(GuideAttackTypesWindow, {}),
                    React.createElement(GuideWavesWindow, {}),
                    React.createElement(DamageTrackerWindow, {})
                ),
                React.createElement('div', { className: 'anchor2' + ((this.state.cinematic) ? ' transparent' : '') },
                    React.createElement(Module, { moduleId: 'masthead', width: 552, height: 145, defaultLeft: '0', defaultTop: '14px', defaultBottom: '0', defaultRight: '0' },
                        React.createElement(Masthead, { theme: this.state.theme }),
                        React.createElement(ReadyButton, {}),
                        React.createElement(SubAnnouncement, {}),
                        React.createElement(Announcement, {})
                    )
                ),
                React.createElement('div', { className: 'anchor3' + ((this.state.cinematic) ? ' transparent' : '') },
                    // I think auto doesn't work in Coherent if I recall.. ?
                    React.createElement(Module, { moduleId: 'minimap', width: 175, height: 160, defaultLeft: 'auto', defaultTop: '0', defaultBottom: '0', defaultRight: '1vw', rtl: true },
                        React.createElement(MinimapLiveView, {}),
                        React.createElement(Minimap, {})
                    )
                ),
                React.createElement('div', { className: 'anchor5' + ((this.state.cinematic) ? ' transparent' : '') },
                    React.createElement(Module, { moduleId: 'menubuttons', width: 40, height: 180, defaultLeft: '-40px', defaultTop: '-220px', defaultBottom: '0px', defaultRight: '0' },
                        //React.createElement(HudStackrankButton, {}), // v6.03 disabled, not needed
                        React.createElement(InGameCoachMenuButton, {}),
                        React.createElement(EmoteButton, {}),
                        React.createElement(DamageTrackerButton, {}),
                        React.createElement(GuideMenuButton, {}),
                        React.createElement(HudMenuButton, {})
                    )
                ),
                React.createElement('div', { className: 'anchor6' + ((this.state.cinematic) ? ' transparent' : '') },
                    React.createElement(KeepRollsWindow, {})
                ),
                React.createElement('div', { className: 'anchor6' + ((this.state.cinematic) ? ' transparent' : '') },
                    // v8.03.10 moved above Screen to fix tooltip ordering...? annoying since for UHD, transform(scale) breaks z index order
                    React.createElement(Module, { moduleId: 'powerups', width: 187, height: 117, defaultLeft: '595px', defaultTop: '-246px', defaultBottom: '11px', defaultRight: '0' },
                        React.createElement(Powerups, {})
                    ),
                    React.createElement(Module, { moduleId: 'resources', width: 187, height: 127, defaultLeft: '595px', defaultTop: '-131px', defaultBottom: '11px', defaultRight: '0' },
                        React.createElement(Screen, { theme: this.state.theme }),
                        React.createElement(MinimapStats, {}),
                        React.createElement(RecommendedValue, {})
                    ),
                    React.createElement(Windshield, { theme: this.state.theme }),
                    React.createElement(Module, { moduleId: 'dashboard', width: 600, height: 154, defaultLeft: '0', defaultTop: '-158px', defaultBottom: '11px', defaultRight: '0' },
                        React.createElement(Home, { theme: this.state.theme }),
                        React.createElement(WindshieldLock, { theme: this.state.theme }),
                        React.createElement(Dashboard, { theme: this.state.theme }),
                        React.createElement(Glovebox, { theme: this.state.theme }),
                        React.createElement(LeftboxLock, { theme: this.state.theme })
                    ),
                    React.createElement(Leftbox, { theme: this.state.theme }),
                    //React.createElement(Module, { moduleId: 'powerups', width: 187, height: 117, defaultLeft: '595px', defaultTop: '-244px', defaultBottom: '11px', defaultRight: '0' },
                    //    React.createElement(Powerups, {})
                    //),
                    React.createElement(Module, { moduleId: 'spectator', width: 1200, defaultLeft: '-250px', defaultTop: 'auto', defaultBottom: '12px', defaultRight: '0' },
                        React.createElement(SpectatorScoreboard, {})
                    )
                ),
                React.createElement('div', { className: 'anchor7' + ((this.state.cinematic) ? ' transparent' : '') },
                    React.createElement(ChatView, { chatType: ChatType.ingame }),
                    //React.createElement(WatermarkApp, {}), // v8.04 no longer needed
                    React.createElement(Module, { moduleId: 'miniscoreboard', width: 200, height: 74, defaultLeft: '-19px', defaultTop: 'auto', defaultBottom: '-22px', defaultRight: '0' },
                        React.createElement(MiniScoreboardApp, {})
                    )
                ),
                React.createElement('div', { className: 'anchor5' },
                    globalState.screenWidth > 0 && React.createElement(Module, { moduleId: 'matchModifiers', width: 200, height: 42, defaultLeft: '-250px', defaultTop: '-38px', defaultBottom: '0', defaultRight: '50px' },
                        React.createElement(MatchModifiers, {})
                    )
                ),
                React.createElement('div', { className: 'anchor8' + ((this.state.cinematic) ? ' transparent' : '') }),
                React.createElement('div', { className: 'fullscreen' + ((this.state.cinematic) ? ' transparent' : '') }),
                !isUnityHost && React.createElement('div', { className: 'fullscreen-behind' },
                    this.state.backgroundImage && React.createElement('div', {
                        className: 'fullscreen-background',
                        style: {
                            background: 'url(' + this.state.backgroundImage + ')',
                            zIndex: -2,
                        }
                    })
                ),
                React.createElement(VersusApp, {}),
                React.createElement(LagIndicator, {}),
                React.createElement(ThrottleIndicator, {}),
                React.createElement(BigMessage, {}),
                React.createElement(SmallMessage, {}),
                React.createElement(Previewer, {}),
                React.createElement(GroundMessage, { index: 0 }),
                React.createElement(GroundMessage, { index: 1 }),
                React.createElement(GroundMessage, { index: 2 }),
                React.createElement(GroundMessage, { index: 3 })
            )
        )
    }
})

var PreloaderApp = React.createClass({
    getInitialState: function () {
        return {
            imageIndex: -1,
        }
    },
    componentWillMount: function () {
        //console.log('preloader app will mount')
        this.setState({ imageIndex: 0 })
        this.forceUpdate()
    },
    componentDidUpdate: function () {
        var parent = this
        //console.log('preloader did update')
        if (this.state.imageIndex < window.preloadedImages.length) {
            // It's necessary to have the delay or else React is too smart about only rendering the last one
            setTimeout(function () {
                //console.log('increment imageIndex to: ' + (parent.state.imageIndex + 1))
                parent.setState({ imageIndex: parent.state.imageIndex + 1 })
            }, 100)
        }
    },
    render: function () {
        //console.log('render with imageIndex: ' + this.state.imageIndex + ', and preloaded images length: ' + window.preloadedImages.length)
        if (this.state.imageIndex >= window.preloadedImages.length) {
            return null
        }

        var image = window.preloadedImages[this.state.imageIndex]
        //console.log('render with img: ' + image.src)
        return React.createElement('img', { src: image.src })
    }
})

var WallpaperApp = React.createClass({
    getInitialState: function () {
        return {
            baseBackground: 'earthking/earthking',
            enabled: true,
            animated: false, // v7.03: let's default have it off, to improve compatibility
            // so that people who can't load the video can at least make it into the game long enough
            // for the config file to be written to disk
            imageOverride: '',
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.enableWallpaper = function (enabled) {
            parent.setState({ enabled: enabled })
        }
        bindings.setBaseBackground = function (image) {
            parent.setState({ baseBackground: image })
        }
        bindings.enableVideoRendering = function (enabled) {
            parent.setState({ animated: enabled })
        }
        bindings.setBackgroundImageOverride = function (imageOverride) {
            console.log('setBackgroundImageOverride: ' + imageOverride)

            // Bail early if no change
            if (parent.state.imageOverride == imageOverride) {
                //console.log('setBackgroundImageOverride bail early since no change')
                return
            }

            var fromImagePath = parent.state.imageOverride

            parent.setState({ imageOverride: imageOverride })
            engine.call('OnSetBackgroundImageOverride', fromImagePath, imageOverride)
        }
    },
    render: function () {

        console.log('v10.05.1 monitoring: wallpaper, enabled: ' + this.state.enabled + ', animated: ' + this.state.animated
            + ', baseBackground: ' + this.state.baseBackground + ', imageOverride: ' + this.state.imageOverride)

        var parent = this
        return (
            this.state.enabled && React.createElement('div', {
                id: 'WallpaperApp', className: 'fullscreen-blank ' + (this.state.enabled ? '' : 'hidden ')
            },
                React.createElement('div', { className: 'fullscreen-behind menu-backer' },
                    !this.state.animated && React.createElement('div', {
                        className: 'fullscreen-background',
                        style: {
                            backgroundImage: 'url(hud/videos/bg/' + parent.state.baseBackground + '.gif)'
                        }
                    }),
                    this.state.animated && React.createElement('video', {
                        id: 'background-video',
                        src: 'hud/videos/bg/' + parent.state.baseBackground + '.webm',
                        autoPlay: 'true', loop: 'true', muted: 'true'
                    }),
                    // First frame placeholder (very compressed) to prevent black flickering
                    React.createElement('div', {
                        className: 'fullscreen-background',
                        style: {
                            backgroundImage: 'url(hud/videos/bg/' + parent.state.baseBackground + '_first_frame.jpg)',
                            zIndex: '-2'
                        }
                    })
                ),
                this.state.imageOverride && React.createElement('div', {
                    className: 'fullscreen-behind menu-backer',
                    style: {
                        zIndex: '0'
                    }
                },
                    React.createElement('img', {
                        className: 'fullscreen-background',
                        src: this.state.imageOverride
                    })
                )
            )
        )
    }
})

var ClientApp = React.createClass({
    getInitialState: function () {
        this.currentView = "undefined"
        return {
            menuRoot: "set this to either gateway, launcher, or gamemenu",
            menuRootOnce: '',
            items: [],
            menuStyle: 0,
            enableApplyButton: false,
            disableBackButton: false,
            narrow: false,
            blurred: false,
            customButton: {},
            standaloneTabs: false,
            defaultInputValue: "",
            showCurrency: false,
            showGuildCurrency: false,
            menuName: '',
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.blurView = function (blurred) {
            parent.setState({ blurred: blurred })
        },
        bindings.setMenuRoot = function (menuRoot) {
            parent.setState({ menuRoot: menuRoot })
        },
        bindings.setMenuRootOnce = function (menuRoot) {
            parent.setState({ menuRootOnce: menuRoot })
        },
        bindings.loadView = function (viewName) {
            console.log("viewName is " + viewName)
            viewName = viewName.toLowerCase()
            parent.currentView = viewName
            if (viewName != 'game') {
                engine.trigger('enableWallpaper', true)
            }

            // Hide a popup if there is one (hide silently)
            // v5.04g: StickyPopup (Experimental)
            if (!IsStickyPopupOpen(viewName))
                engine.trigger('hidePopup', true)

            // Reset to defaults:
            parent.setState({
                items: [],
                enableApplyButton: false,
                disableBackButton: false,
                customButton: {},
                standaloneTabs: false,
                defaultInputValue: "",
                narrow: false,
                showCurrency: false,
                showGuildCurrency: false,
                menuName: viewName,
            })

            // Reset to first tab (v1.43)
            engine.trigger('selectSubmenu', 1)

            // Reset to blank background
            backgroundOverride = ''

            switch (viewName) {
                case 'gateway':
                    parent.setState({ items: gatewayMenu, menuStyle: 4, menuRoot: 'launcher' }, function () { console.log("Done " + Date.now()) })
                    break
                case 'launcher':
                    preloadCoreImages()
                    parent.setState({ items: getLauncherMenu(), menuStyle: 0, menuRoot: 'launcher' }, function () { console.log("Done " + Date.now()) })
                    if (!isUnityHost) engine.trigger('refreshIsInGame', false) // Smelly test code
                    break
                case 'game':
                    parent.setState({ items: [], menuStyle: -1, menuRoot: 'game' }, function () { console.log("Done " + Date.now()) })
                    engine.trigger('enableHud', true)
                    engine.trigger('enableWallpaper', false)
                    engine.trigger('showBottomBar', false)
                    if (!isUnityHost) engine.trigger('refreshIsInGame', true) // Smelly test code
                    break
                case 'gamemenu':
                    parent.setState({ items: getInGameMenu(), menuRoot: 'gamemenu', menuStyle: 3 })
                    break
                case 'play':
                    parent.setState({ items: getPlayMenu(), menuStyle: 2 })
                    break
                case 'training':
                    parent.setState({ items: getTrainingPlayMenu(), menuStyle: 2 })
                    break
                case 'learn':
                    parent.setState({ items: getLearnMenu(), menuStyle: 2 })
                    break
                case 'bots':
                    parent.setState({ items: getBotsPlayMenu(), menuStyle: 2.1 })
                    break
                case 'campaign':
                    preloadCampaignImages()
                    parent.setState({ items: getCampaignsMenu(), menuStyle: 2.1 })
                    break
                case 'initialexperience':
                    parent.setState({ items: getInitialExperienceMenu(), menuStyle: 2.1, disableBackButton: true })
                    break
                case 'patch notes':
                    parent.setState({ items: [], menuStyle: 8 })
                    break
                case 'store':
                    preloadShopImages()
                    parent.setState({ items: storeMenu, menuStyle: 1, showCurrency: true })
                    break
                case 'myprofile':
                    engine.trigger('viewProfile', globalState.playFabId)
                    break
                case 'profile':
                case 'leaderboardprofile':
                case 'postgameprofile':
                case 'ingameprofile':
                case 'guildplayerprofile':
                case 'guildprofile':
                    if (viewName == 'ingameprofile')
                        engine.trigger('enableScoreboard', false)
                    parent.setState({ items: getProfileMenu(), menuStyle: 1, standaloneTabs: true })
                    break
                case 'guild':
                    parent.setState({ items: getGuildMenu(), menuStyle: 1 })
                    break
                case 'leaderboardguild':
                    parent.setState({ items: getGuildMenu(), menuStyle: 1 })
                    break
                case 'ingameprofileguild':
                    parent.setState({ items: getGuildMenu(), menuStyle: 1 })
                    break
                case 'profileguild':
                    parent.setState({ items: getGuildMenu(), menuStyle: 1 })
                    break
                case 'options':
                    parent.setState({ items: optionsMenu, menuStyle: 1, enableApplyButton: true }, function () { console.log("Done " + Date.now().toString()) })
                    break
                case 'leaderboards':
                    parent.setState({ items: getLeaderboardsMenu(), menuStyle: 1, standaloneTabs: true })
                    break
                case 'custom':
                    parent.setState({ items: customGameMenu, menuStyle: 5, menuRoot: 'custom' })
                    engine.trigger('onCustomGameMenuLoaded')
                    break
                case 'pregame':
                    if (globalState.forcePickLegionIndex == -2) {
                        engine.trigger('loadView', 'game')
                        return
                    }

                    parent.setState({ items: getPregameMenu(), menuStyle: 8, disableBackButton: true, narrow: true, menuRoot: 'pregame' })
                    break
                case 'loading':
                    parent.setState({ items: [], menuStyle: 6, disableBackButton: true, menuRoot: 'loading' })
                    break
                case 'browser':
                    parent.setState({ items: [], menuStyle: 7 })
                    engine.call('OnTryRefreshCustomGames')
                    break
                case 'matchhistory':
                    parent.setState({
                        items: postGameMenu, menuStyle: 1
                    })
                    break
                case 'openingsmatchhistory':
                    parent.setState({
                        items: postGameMenu, menuStyle: 1
                    })
                    break
                case 'postgame':
                    // parties 2.0: just never show Stay As Team anymore since it is tricky to implement if the party members
                    // are on different channels
                    //parent.setState({
                    //    items: postGameMenu, menuStyle: 1, menuRoot: 'postgame' // v1.56
                    //})
                    //if (globalState.partyPlayFabIds.length > 1) {
                    //    console.log("our party is length: " + globalState.partyPlayFabIds.length + " so don't show stay as team")
                    //    parent.setState({
                    //        items: postGameMenu, menuStyle: 1, menuRoot: 'postgame' // v1.56
                    //    })
                    //} else {
                    //    parent.setState({
                    //        items: postGameMenu, menuStyle: 1, customButton: {
                    //            name: loc('stay_as_team', 'Stay As Team'), action: function () {
                    //                console.log("clicked stay as team")
                    //                engine.call('OnStayAsTeam')
                    //                engine.call('OnTryJoinHomeChat')
                    //                engine.trigger('loadView', 'launcher')
                    //            }
                    //        },
                    //        menuRoot: 'postgame' // v1.56
                    //    })
                    //}

                    var isPlayAgainQueue = globalState.matchmakerQueue == "Normal"
                        || globalState.matchmakerQueue == "Classic"
                        || globalState.matchmakerQueue == "Arcade"
                        || globalState.matchmakerQueue == "BeginnerBots"
                        || globalState.matchmakerQueue == "EasyBots"
                        || globalState.matchmakerQueue == "VeryEasyBots"
                        || globalState.matchmakerQueue == "MediumBots"
                        || globalState.matchmakerQueue == "HardBots"
                        || globalState.matchmakerQueue == "InsaneBots"
                        || globalState.matchmakerQueue == "ExpertBots"
                        || globalState.matchmakerQueue == "MasterBots"
                        || globalState.matchmakerQueue == "SeniorMasterBots"
                        || globalState.matchmakerQueue == "GrandmasterBots"
                        || globalState.matchmakerQueue == "Test1v1"

                    // If we have a party or if we aren't in a play-again queue, don't show Play Again
                    if (!isPlayAgainQueue || globalState.wasPartiedLastGame || !globalState.playAgainEnabled) {
                        parent.setState({
                            items: postGameMenu, menuStyle: 1, menuRoot: 'postgame'
                        })
                    } else { // Otherwise, show Play Again/Cancel Search
                        if (!globalState.searchingForMatch && !globalState.cancelingSearch) {
                            parent.setState({
                                items: postGameMenu, menuStyle: 1, customButton: {
                                    name: loc('play_again', 'Play Again'), action: function () {
                                        console.log("clicked play again")
                                        engine.call('OnPlayAgain')

                                        if (isBrowserTest) {
                                            engine.trigger('startSearchGame', 'Classic', 12)
                                        }

                                        engine.trigger('loadView', 'postgame')
                                    }
                                },
                                menuRoot: 'postgame'
                            })
                        } else {
                            if (!globalState.matchmakingStarted) {
                                parent.setState({
                                    items: postGameMenu, menuStyle: 1, customButton: {
                                        name: loc('entering_queue', 'Entering queue...').replace('...', '')
                                            + "<img src='hud/img/ui/loading-small-white.gif' style='height: 24px'>",
                                        action: function () { },
                                        locked: true
                                    },
                                })
                            } else if (globalState.cancelingSearch) {
                                parent.setState({
                                    items: postGameMenu, menuStyle: 1, customButton: {
                                        name: loc('canceling_search', 'Canceling search ...').replace('...', '')
                                            + "<img src='hud/img/ui/loading-small-white.gif' style='height: 24px'>",
                                        action: function () { },
                                        locked: true
                                    },
                                })
                            } else {
                                parent.setState({
                                    items: postGameMenu, menuStyle: 1, customButton: {
                                        name: loc('cancel_search', 'Cancel search ')
                                            + "<img src='hud/img/ui/loading-small-white.gif' style='height: 24px'>",
                                        action: function () {
                                            console.log("clicked cancel search")
                                            engine.trigger('tryCancelSearchGame')
                                            engine.trigger('setCancelingSearch', true)
                                            // Ah this is too quick <<<<
                                            //globalState.searchingForMatch = false
                                            //engine.trigger('loadView', 'postgame')
                                        }
                                    },
                                })
                            }
                        }
                    }

                    break
                case 'credits':
                    parent.setState({ items: creditsMenu, menuStyle: 1 })
                    break
                case 'gameguide':
                    parent.setState({ items: gameGuideMenu, menuStyle: 1, standaloneTabs: true })
                    break
                case 'faq':
                    parent.setState({ items: faqMenu, menuStyle: 1, standaloneTabs: true })
                    break
                case 'codex':
                    parent.setState({ items: codexMenu, menuStyle: 1, standaloneTabs: true })
                    break
                case 'singleplayer':
                    parent.setState({ items: [], menuStyle: 9 })
                    break
                case 'tutorial':
                    parent.setState({ items: [], menuStyle: 9 })
                    break
                case 'campaignmap':
                    backgroundOverride = 'hud/img/campaign/campaign-background.jpg'
                    parent.setState({ items: [], menuStyle: 12 })
                    break
                case 'mastermindvariants':
                    parent.setState({ items: getMastermindVariantsMenu(), menuStyle: 14, disableBackButton: true, menuRoot: 'mastermindvariants' })
                    engine.trigger('showBottomBar', true)
                    break
                case 'modevoting':
                    parent.setState({ items: [], menuStyle: 15, disableBackButton: true, menuRoot: 'modevoting' })
                    engine.trigger('showBottomBar', true)
                    break
                case 'extragoldvariants':
                    parent.setState({ items: getExtraGoldVariantsMenu(), menuStyle: 2, disableBackButton: true })
                    break
                case 'selectguaranteedroll':
                    parent.setState({ items: [], menuStyle: 10, disableBackButton: true })
                    if (!isUnityHost)
                        engine.trigger('refreshIconSelectionItems', 'guaranteeroll', loc('lock_one_fighter_your_choice', 'Lock one fighter of your choice'), testIconSelectionItems, 1)
                    engine.trigger('showBottomBar', true)
                    break
                case 'challenge':
                    parent.setState({ items: [], menuStyle: 11 })
                    engine.call('RefreshWeeklyChallengeLeaderboard')
                    break
                case 'featuredmode':
                    parent.setState({ items: [], menuStyle: 13 })
                    engine.call('RefreshFeaturedModeLeaderboard')
                    break
            }

            engine.trigger('setBackgroundImageOverride', backgroundOverride)
        }

        bindings.goBack = function () {
            console.log("go back from " + parent.currentView + ", menuRoot: " + parent.state.menuRoot + ", menuRootOnce: " + parent.state.menuRootOnce)

            var menuRoot = parent.state.menuRoot
            if (parent.state.menuRootOnce != '') {
                if (parent.state.menuRootOnce != parent.currentView) // Loop check, so you never go "back" to yourself
                    menuRoot = parent.state.menuRootOnce
                parent.setState({ menuRootOnce: '' })
            }

            switch (parent.currentView) {
                case 'gateway':
                    engine.trigger('loadPopup', 'exit')
                    break
                case 'launcher':
                    engine.trigger('loadPopup', 'exit')
                    break
                case 'game':
                    engine.trigger('loadView', 'gamemenu')
                    break
                case 'gamemenu':
                    engine.trigger('loadView', 'game')
                    break;
                case 'play':
                    engine.trigger('loadView', 'launcher')
                    break
                case 'training':
                    engine.trigger('loadView', 'launcher')
                    break
                case 'learn':
                    engine.trigger('loadView', 'launcher')
                    break
                case 'bots':
                    engine.trigger('loadView', 'training')
                    break
                case 'campaign':
                    engine.trigger('loadView', 'training')
                    break
                case 'patch notes':
                    engine.trigger('loadView', 'launcher')
                    break
                case 'store':
                    engine.trigger('loadView', menuRoot)
                    break
                case 'profile':
                    engine.trigger('loadView', menuRoot)
                    break
                case 'leaderboardprofile':
                    engine.trigger('loadView', 'leaderboards')
                    break
                case 'postgameprofile':
                    if (!globalState.isInGame)
                        engine.trigger('loadView', 'postgame')
                    else
                        engine.trigger('loadView', 'matchhistory')
                    break
                case 'ingameprofile':
                    engine.trigger('loadView', 'game')
                    break
                case 'guildplayerprofile':
                    engine.trigger('loadView', 'guild')
                    break
                case 'guildprofile':
                    engine.trigger('loadView', 'guild')
                    break
                case 'guild':
                    engine.trigger('loadView', menuRoot)
                    break
                case 'leaderboardguild':
                    engine.trigger('loadView', 'leaderboards')
                    engine.trigger('selectSubmenu', 5)
                    break
                case 'ingameprofileguild': // ingame --> someone's profile --> guild
                    engine.trigger('loadView', 'ingameprofile')
                    break
                case 'profileguild': // someone's profile --> guild
                    engine.trigger('loadView', 'profile')
                    break
                case 'options':
                    engine.trigger('loadView', menuRoot)
                    break
                case 'leaderboards':
                    engine.trigger('loadView', menuRoot)
                    break
                case 'custom':
                    engine.trigger('loadPopup', 'leavecustomgame')
                    break
                case 'pregame':
                    console.log("Can't go back from this menu")
                    break
                case 'browser':
                    engine.trigger('loadView', 'play')
                    break
                case 'postgame':
                    // Rejoin home chat
                    engine.call('OnTryJoinHomeChat')
                    engine.trigger('loadView', 'launcher')
                    break
                case 'credits':
                    //engine.trigger('loadView', 'launcher')
                    engine.trigger('loadView', menuRoot) // v1.64
                    break
                case 'gameguide':
                    console.log("going back from game guide, menuRoot is: " + menuRoot)

                    if (menuRoot != null && menuRoot.length > 0)
                        engine.trigger('loadView', menuRoot) // v1.64
                    else
                        engine.trigger('loadView', 'launcher') // v1.65 fix
                    break
                case 'faq':
                    engine.trigger('loadView', menuRoot)
                    break
                case 'codex':
                    if (globalState.learnMenuEnabled && menuRoot == 'launcher')
                        engine.trigger('loadView', 'learn')
                    else
                        engine.trigger('loadView', menuRoot)
                    break
                case 'singleplayer':
                    if (globalState.learnMenuEnabled)
                        engine.trigger('loadView', 'learn')
                    else
                        engine.trigger('loadView', 'training')
                    break
                case 'tutorial':
                    engine.trigger('loadView', menuRoot)
                    break
                case 'campaignmap':
                    engine.trigger('loadView', 'campaign')
                    break
                case 'matchhistory':
                    engine.trigger('loadView', 'profile')
                    engine.trigger('selectSubmenu', 5)
                    break
                case 'openingsmatchhistory':
                    engine.trigger('loadView', 'leaderboards')
                    engine.trigger('selectSubmenu', 2)
                    break
                case 'challenge':
                    engine.trigger('loadView', 'training')
                    break
                case 'featuredmode':
                    engine.trigger('loadView', 'play')
                    break
            }
        }
    },
    //componentDidUpdate: function() {
    //    console.log('loadView did update')
    //    var elem = this.refs.main
    //    elem.style.opacity = "0.99"
    //    elem.offsetHeight
    //    elem.style.opacity = "0.8" // testing if htis actually is working
    //},
    render: function () {
        if (this.state.menuStyle == -1)// || this.state.items.length == 0)
            return null

        //console.log("rendering " + this.state.items.length + " items")
        //for (var i = 0; i < this.state.items.length; i++)
        //    console.log("item " + i + ": " + this.state.items[i].key + ", " + this.state.items[i].name)

        var showBottomBar = this.currentView != "gateway" && this.currentView != "game"
            && this.currentView != "gamemenu"
        var showTopBar = globalState.showTopBar

        var isPreMainMenu = globalState.currentView == '' || globalState.currentView == 'gateway'

        return (
            React.createElement('div', { ref: 'main' },
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(showTopBar, 0, 0),
                    React.createElement('div', {
                        className: (showTopBar ? '' : 'hidden'),
                        style: {
                            position: 'absolute',
                            zIndex: '3',
                        }
                    },
                        React.createElement(TopBar, {})
                    )
                ),
                // v6.xx shop, no need to animate bottom bar, right?
                //React.createElement(
                //    VelocityComponent,
                //    GetAnimationPreset3(showBottomBar, 0, 0),
                //    React.createElement('div', {
                //        className: (showBottomBar ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') + (isPreMainMenu ? ' invisible' : ''),
                //        style: {
                //            position: "absolute",
                //            zIndex: this.state.blurred ? "-1" : "1" /* feels ghetto */
                //        }
                //    },
                //        React.createElement(ChatApp, {})
                //    )
                //),
                React.createElement('div', {
                    className: (showBottomBar ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') + (isPreMainMenu ? ' invisible' : ''),
                    style: {
                        position: "absolute",
                        zIndex: this.state.blurred ? "-1" : "1" /* feels ghetto */
                    }
                },
                    React.createElement(ChatApp, {})
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 0, -200, 0),
                    React.createElement('div', {
                        className: (this.state.menuStyle == 0 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') + (isPreMainMenu ? ' invisible' : '')
                    },
                        React.createElement(LauncherView, { items: this.state.items })
                    )
                ),
                /* v1.47 disabled animation for these, for now, since it messes up refreshing - weird race condition or something. */
                React.createElement('div', { className: (this.state.menuStyle == 1 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                    React.createElement(TabbedView, {
                        className: this.state.menuName,
                        active: this.state.menuStyle == 1, items: this.state.items, enableApplyButton: this.state.enableApplyButton,
                        customButton: this.state.customButton, standaloneTabs: this.state.standaloneTabs,
                        showCurrency: this.state.showCurrency, showGuildCurrency: this.state.showGuildCurrency
                    })
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 2, -200, 0),
                    React.createElement('div', { className: (this.state.menuStyle == 2 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(BillboardView, { items: this.state.items, disableBackButton: this.state.disableBackButton, narrow: this.state.narrow })
                    )
                ),
                // I think this is copy pasted version of menuStyle 2, but different so that they can transition to each other, otherwise
                // I think React maybe thinks going from a menuStyle 2 to another menuStyle 2 is no change (but we want it to change,
                // so that it animates + rerenders)
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 2.1, -200, 0),
                    React.createElement('div', { className: (this.state.menuStyle == 2.1 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(BillboardView, { items: this.state.items, disableBackButton: this.state.disableBackButton, narrow: this.state.narrow })
                    )
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 3, 0, 200),
                    React.createElement('div', { className: (this.state.menuStyle == 3 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(IngameView, { items: this.state.items })
                    )
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 5, -200, 0),
                    React.createElement('div', { className: (this.state.menuStyle == 5 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(CustomGameView, { items: this.state.items })
                    )
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 6, 0, 0),
                    React.createElement('div', { className: (this.state.menuStyle == 6 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(LoadingView, {})
                    )
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 7, 0, 0),
                    React.createElement('div', { className: (this.state.menuStyle == 7 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(BrowserView, {})
                    )
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 8, -200, 0),
                    React.createElement('div', { className: (this.state.menuStyle == 8 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(LegionSelectView, { items: this.state.items, disableBackButton: this.state.disableBackButton, narrow: this.state.narrow })
                    )
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 9, -200, 0),
                    React.createElement('div', { className: (this.state.menuStyle == 9 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(SingleplayerView, { items: this.state.items, disableBackButton: this.state.disableBackButton, hideVideo: this.state.menuStyle != 9 })
                    )
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 10, -200, 0),
                    React.createElement('div', { className: (this.state.menuStyle == 10 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(IconSelectionView, { items: this.state.items, disableBackButton: this.state.disableBackButton })
                    )
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 11, -200, 0),
                    React.createElement('div', { className: (this.state.menuStyle == 11 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(WeeklyChallengeView, { items: this.state.items, disableBackButton: this.state.disableBackButton })
                    )
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 12, -200, 0),
                    React.createElement('div', { className: (this.state.menuStyle == 12 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(CampaignMapView, { items: this.state.items, disableBackButton: this.state.disableBackButton })
                    )
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 13, -200, 0),
                    React.createElement('div', { className: (this.state.menuStyle == 13 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(FeaturedModeView, { items: this.state.items, disableBackButton: this.state.disableBackButton })
                    )
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 14, -200, 0),
                    React.createElement('div', { className: (this.state.menuStyle == 14 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(MastermindVariantsView, { items: this.state.items, disableBackButton: this.state.disableBackButton })
                    )
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(this.state.menuStyle == 15, -200, 0),
                    React.createElement('div', { className: (this.state.menuStyle == 15 ? '' : 'hidden') + (!this.state.blurred ? '' : ' blurred') },
                        React.createElement(ModeVotingView, { items: this.state.items, disableBackButton: this.state.disableBackButton })
                    )
                )
            )
        )
    }
})

var ScoreboardApp = React.createClass({
    render: function () {
        return (
            React.createElement(ScoreboardView, {})
        )
    }
})

var PingChooserApp = React.createClass({
    render: function () {
        return (
            React.createElement(ImagePingChooser, {})
        )
    }
})

var EmoteChooserApp = React.createClass({
    render: function () {
        return (
            React.createElement(EmoteChooser, {})
        )
    }
})

var PopupApp = React.createClass({
    firstItem: null,
    getInitialState: function () {
        return {
            items: [],
            name: "",
            header: "",
            description: "",
            enabled: false,
            hasInput: false,
            hasParagraphInput: false,
            hasLoader: false,
            onSubmit: function () { },
            customFullScreenBackground: '',
            customHeaderStyle: {},
            customDescriptionStyle: {},
            multipleChoiceItems: [],
            multipleChoiceItemsDisplay: [],
            customClasses: '',
            customParagraphStyle: {},
            defaultInputValue: '',
            checkboxText: "",
            onCheckboxClicked: function () { }
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.loadPopup = function (popupName) {
            console.log("popupName is " + popupName)
            popupName = popupName.toLowerCase()
            globalState.lastPopupName = popupName

            parent.setState({
                name: popupName, header: "", description: "", items: okMenu, hasInput: false, hasParagraphInput: false, hasLoader: false, onSubmit: function () { },
                customFullScreenBackground: '', customHeaderStyle: {}, customDescriptionStyle: {}, customInputStyle: {}, multipleChoiceItems: [], multipleChoiceItemsDisplay: [],
                customClasses: '', customParagraphStyle: {}, defaultInputValue: "", checkboxText: "", onCheckboxClicked: function () { },
            })

            var isSilent = false
            switch (popupName) {
                case 'quitpvp':
                    parent.setState({
                        header: loc('confirm_quit', 'Leaving game early. Are you sure?'),
                        description: loc('confirm_quit_long', 'THIS IS A TEAM GAME. LEAVING THE GAME EARLY RUINS THE GAME FOR EVERYONE.'),
                        items: quitMenu,
                        customHeaderStyle: {
                            background: 'rgba(201, 26, 26, 0.75)',
                        },
                        customDescriptionStyle: {
                            background: 'rgba(108, 41, 41, 0.75)',
                        }
                    })
                    break
                case 'quit':
                    parent.setState({ header: loc('confirm_quit', 'Leaving game early. Are you sure?'), items: quitMenu })
                    break
                case 'exit':
                    parent.setState({ header: loc('confirm_exit', 'Exiting game. Are you sure?'), items: exitMenu })
                    break
                //case 'beta':
                //    parent.setState({
                //        header: localizedStrings.betaWarningHeader, description: localizedStrings.betaWarning, items: alphaPopupMenu,
                //        customHeaderStyle: {
                //            //background: 'rgba(111, 197, 74, 0.9)', //'rgba(0, 0, 0, 0.66)', // transparent also looks cool
                //            background: 'rgb(39, 39, 39)',
                //            //fontSize: '4em',
                //            //color: '#ffcc00',
                //            //webkitTextStroke: '2px #ff9000',
                //            textShadow: '0 0 20px #d78666',
                //            textTransform: 'uppercase',
                //        },
                //        customDescriptionStyle: {
                //            background: 'rgb(143, 53, 53)',
                //            //display: 'none',
                //            //background: 'transparent',
                //        }
                //    })
                //    break
                case 'privacy':
                    parent.setState({
                        header: loc('terms_of_service', 'TERMS OF SERVICE'),
                        description: globalState.privacyPolicy, // Loaded from a separate file
                        items: privacyMenu,
                        customHeaderStyle: {
                            background: 'rgba(30, 30, 30, 0.8)',
                            padding: '0 30vw',
                            height: '50vh',
                        },
                        customDescriptionStyle: {
                            background: 'rgba(53, 53, 53, 0.8)',
                        },
                        customParagraphStyle: {
                            overflowY: 'auto',
                            height: '32vh',
                            textAlign: 'left'
                        },
                        customClasses: 'scrollable'
                    })
                    break
                case 'news':
                    if (globalState.news[globalState.newsIndex] != null) {
                        //console.log("newsbody: " + JSON.stringify(globalState.news[globalState.newsIndex].Body));
                        switch (globalState.news[globalState.newsIndex].Body.Layout) {
                            case "text":
                            default:
                                var linkProp = "";
                                if (globalState.news[globalState.newsIndex].Body.LinkURL != null && globalState.news[globalState.newsIndex].Body.LinkText != null)
                                    linkProp = "<div class='news-link'><a onClick='engine.call(\"OnOpenURL\", \"" + globalState.news[globalState.newsIndex].Body.LinkURL + "\")' href='#'>" + globalState.news[globalState.newsIndex].Body.LinkText + "</a></div>" + "</div>";
                                parent.setState({
                                    header: "",
                                    description:
                                        "<div class='news-image'><img src='" + globalState.news[globalState.newsIndex].Body.Image + "'/>&nbsp;</div>" +
                                        "<div class='news-wrapper'>" +
                                        "<div class='news-subtitle'>" + globalState.news[globalState.newsIndex].Body.Subtitle + "</div>" +
                                        "<div class='news-title'>" + globalState.news[globalState.newsIndex].Title + "</div>" +
                                        "<div class='news-content scrollable'>" + globalState.news[globalState.newsIndex].Body.Content + "</div><br>" +
                                        linkProp,
                                    items: newsPopupMenu,
                                    checkboxText: globalState.newsIsArchive ? "" : loc('dont_show_this_again', "Don't show this again"),
                                    customHeaderStyle: {
                                        background: 'rgba(30, 30, 30, 0.9)',
                                        padding: '0',
                                        height: '50vh',
                                        width: '100%'
                                    },
                                    customDescriptionStyle: {
                                        background: 'rgba(53, 53, 53, 0.8)',
                                    },
                                    customParagraphStyle: {
                                        height: '50vh',
                                        width: '100%',
                                        textAlign: 'left',
                                        display: 'flex'
                                    },
                                    customClasses: 'news',
                                    onCheckboxClicked: function () { engine.trigger('toggleSkipNewsNextTime') }
                                })
                                break;
                            case "image":
                                parent.setState({
                                    header: globalState.news[globalState.newsIndex].Title,
                                    description: "<a href='" + globalState.news[globalState.newsIndex].Body.LinkURL + "'>"
                                        + "<div class='news-image'><img src='" + globalState.news[globalState.newsIndex].Body.Image + "' /></div></a>",
                                    items: newsPopupMenu,
                                    checkboxText: globalState.newsIsArchive ? "" : loc('dont_show_this_again', "Don't show this again"),
                                    customHeaderStyle: {
                                        background: 'rgba(30, 30, 30, 0.9)',
                                        padding: '0',
                                        width: '100%'
                                    },
                                    customDescriptionStyle: {
                                        background: 'rgba(53, 53, 53, 0.8)',
                                    },
                                    customParagraphStyle: {
                                        overflowY: 'auto',
                                        //height: '50vh',
                                        padding: '0',
                                        width: '100%',
                                        textAlign: 'left',
                                        display: 'flex'
                                    },
                                    customClasses: 'newsimage',
                                    onCheckboxClicked: function () { engine.trigger('toggleSkipNewsNextTime') }
                                })
                                break;
                        }

                    }

                    break
                case 'victory':
                    globalState.unescapablePopup = true
                    isSilent = true
                    // todo: reenable later when Coherent fixes their bug
                    //engine.trigger('enableHud', false) // v1.50 workaround for crash
                    parent.setState({
                        header: '<div class="victory" style="padding-top: 35.18vh">' + loc('victory', 'Victory!') + '</div>',
                        description: '',
                        items: endGameMenu,
                        customClasses: 'scrollable', // don't think this works
                        customHeaderStyle: {
                            background: 'url(hud/img/victory/VictoryEmblem.png) no-repeat, url(hud/img/victory/VictoryBG.png) no-repeat',
                            backgroundPosition: 'center, center 26.41vh',
                            backgroundSize: '39.0625vw, 39.0625vw',
                            fontSize: '3vw',
                            color: '#fff',
                            //webkitTextStroke: '2px #ff9000',
                            marginTop: '-18.51vh',
                            textShadow: '0 0 20px #2e98bb',
                            textTransform: 'uppercase',
                            padding: '0 0 2vh 0',
                            animation: 'fadein 1s',
                        },
                        customDescriptionStyle: {
                            background: 'transparent',
                        }
                    })
                    break
                case 'defeat':
                    globalState.unescapablePopup = true
                    isSilent = true
                    // todo: reenable later when Coherent fixes their bug
                    //engine.trigger('enableHud', false) // v1.50 workaround for crash
                    parent.setState({
                        header: '<div class="defeat" style="padding-top: 35.18vh">' + loc('defeat', 'Defeat!') + '</div>',
                        description: '',
                        items: endGameMenu,
                        customClasses: 'scrollable', // don't think this works
                        customHeaderStyle: {
                            background: 'url(hud/img/victory/DefeatEmblem.png) no-repeat, url(hud/img/victory/DefeatBG.png) no-repeat',
                            backgroundPosition: 'center, center 26.41vh',
                            backgroundSize: '39.0625vw, 39.0625vw',
                            fontSize: '3vw',
                            color: '#fff',
                            //webkitTextStroke: '2px #ff9000',
                            marginTop: '-18.51vh',
                            textShadow: '0 0 20px #d22929',
                            textTransform: 'uppercase',
                            padding: '0 0 2vh 0',
                            animation: 'fadein 1s',
                        },
                        customDescriptionStyle: {
                            background: 'transparent',
                        }
                    })
                    break
                case 'tie':
                    globalState.unescapablePopup = true
                    parent.setState({
                        header: loc('match_canceled', 'Match Canceled'),
                        description: '<span class="tie" style="display: block; margin-top: -1rem; font-size: 1rem">'
                            + loc('tie_long', 'A player failed to connect to the game.') + ' </span>',
                        items: endGameMenu,
                        customHeaderStyle: {
                            background: 'rgba(255, 192, 00, 0.9)', //'transparent', //'rgba(0, 0, 0, 0.66)',  // transparent also looks cool
                            fontSize: '3em',
                            color: 'rgba(255, 255, 255, 1)',
                            //webkitTextStroke: '2px rgba(255, 0, 0, 1)',
                            textShadow: '0 0 20px rgb(120, 90, 30)',
                            textTransform: 'uppercase',
                        },
                        customDescriptionStyle: {
                            background: 'transparent',
                        }
                    })
                    break
                case 'tie-warning':
                    globalState.unescapablePopup = true
                    parent.setState({
                        header: loc('match_canceled', 'Match Canceled'),
                        description: '<span class="tie" style="display: block; margin-top: -1rem; font-size: 1rem">'
                            + loc('tie_warning_long', 'Your account has been warned for not taking any action on wave 1.') + ' </span>',
                        items: endGameMenu,
                        customHeaderStyle: {
                            background: 'rgba(201, 26, 26, 0.75)',
                            fontSize: '3em',
                            color: 'rgba(255, 255, 255, 1)',
                            textShadow: '0 0 20px rgb(120, 90, 30)',
                            textTransform: 'uppercase',
                        },
                        customDescriptionStyle: {
                            background: 'rgba(108, 41, 41, 0.75)',
                            background: 'transparent',
                        }
                    })
                    break
                case 'actual-tie':
                    globalState.unescapablePopup = true
                    parent.setState({
                        header: loc('tie', 'Tie'),
                        description: '<span style="display: block; margin-top: -1rem; font-size: 1rem">'
                            + 'Forfeitted too early' + ' </span>',
                        items: endGameMenu,
                        customHeaderStyle: {
                            background: 'rgba(255, 192, 00, 0.9)', //'transparent', //'rgba(0, 0, 0, 0.66)',  // transparent also looks cool
                            fontSize: '3em',
                            color: 'rgba(255, 255, 255, 1)',
                            //webkitTextStroke: '2px rgba(255, 0, 0, 1)',
                            textShadow: '0 0 20px rgb(120, 90, 30)',
                            textTransform: 'uppercase',
                        },
                        customDescriptionStyle: {
                            //fontSize: '1rem',
                            background: 'transparent',
                        }
                    })
                    break
                case 'mission-complete':
                    globalState.unescapablePopup = true

                    console.log('mission complete xp is: ' + globalState.missionCompleteXpEarned)
                    parent.setState({
                        header: '<div style="padding-top: 35.18vh">' + loc('victory', 'Victory!') + '</div>',
                        description: globalState.missionCompleteXpEarned > 0 ?
                            '<div style="font-size: 2vh; color: white;">' + loc('mission_complete_xp', 'You earned ' + globalState.missionCompleteXpEarned + ' XP for completing this mission for the first time!', [globalState.missionCompleteXpEarned]) + '</div>' : '',
                        items: endGameMenu,
                        customClasses: 'scrollable',
                        customHeaderStyle: {
                            background: 'url(hud/img/victory/VictoryEmblem.png) no-repeat, url(hud/img/victory/VictoryBG.png) no-repeat',
                            backgroundPosition: 'center, center 26.41vh',
                            backgroundSize: '39.0625vw, 39.0625vw',
                            fontSize: '3vw',
                            color: '#fff',
                            //webkitTextStroke: '2px #ff9000',
                            marginTop: '-18.51vh',
                            textShadow: '0 0 20px #2e98bb',
                            textTransform: 'uppercase',
                            padding: '0 0 2vh 0',
                            animation: 'fadein 1s',
                        },
                        customDescriptionStyle: {
                            background: 'transparent',
                        }
                    })
                    isSilent = true
                    break
                case 'campaign-victory':
                    globalState.unescapablePopup = true

                    console.log('campaignStarsEarned xp is: ' + JSON.stringify(globalState.campaignStarsEarned))
                    console.log('missionCompleteXpEarned is: ' + globalState.missionCompleteXpEarned)
                    parent.setState({
                        header: '<div style="padding-top: 35.18vh">' + loc('victory', 'Victory!') + '</div>',
                        description:
                            /* SMELLY HARDCODED FOR NOW...  */
                            globalState.campaignStarsEarned.length > 0 ? (
                                (_.includes(globalState.campaignStarsEarned, 1) ? ('<div style="font-size: 2vh; color: white;">' + loc('mission_complete_xp', 'Earned ' + globalState.missionCompleteXpEarned + ' XP for first time completion', [globalState.missionCompleteXpEarned]) + '</div>' + '<div style="font-size: 2vh; color: white;">' + loc('earned_star', 'Earned 100 SS for', [500]) + ' <img src="hud/img/icons/Campaign/star.png"> ' + loc('campaign_star_1', 'Any victory') + '</div>') : '') +
                                (_.includes(globalState.campaignStarsEarned, 2) ? ('<div style="font-size: 2vh; color: white;">' + loc('earned_star', 'Earned 1000 SS for', [1000]) + ' <img src="hud/img/icons/Campaign/star.png"><img src="hud/img/icons/Campaign/star.png"> ' + loc('campaign_star_2', 'Victory with no leaks') + '</div>') : '') +
                                (_.includes(globalState.campaignStarsEarned, 3) ? ('<div style="font-size: 2vh; color: white;">' + loc('earned_star', 'Earned 1500 SS for', [1500]) + ' <img src="hud/img/icons/Campaign/star.png"><img src="hud/img/icons/Campaign/star.png"><img src="hud/img/icons/Campaign/star.png"> ' + loc('campaign_star_3', 'Victory on Hard mode') + '</div>') : '')
                            ) : '<div style="font-size: 2vh; color: white;">' + loc('no_new_stars', 'No new stars earned') + '</div>',
                        items: endGameMenu,
                        customClasses: 'scrollable',
                        customHeaderStyle: {
                            background: 'url(hud/img/victory/VictoryEmblem.png) no-repeat, url(hud/img/victory/VictoryBG.png) no-repeat',
                            backgroundPosition: 'center, center 26.41vh',
                            backgroundSize: '39.0625vw, 39.0625vw',
                            fontSize: '3vw',
                            color: '#fff',
                            //webkitTextStroke: '2px #ff9000',
                            marginTop: '-18.51vh',
                            textShadow: '0 0 20px #2e98bb',
                            textTransform: 'uppercase',
                            padding: '0 0 2vh 0',
                            animation: 'fadein 1s',
                        },
                        customDescriptionStyle: {
                            background: 'transparent',
                        }
                    })
                    isSilent = true
                    break
                case 'mission-incomplete':
                    globalState.unescapablePopup = true
                    parent.setState({
                        header: '<div style="padding-top: 35.18vh">' + loc('defeat', 'Defeat!') + '</div>',
                        description: '',
                        items: endGameMenu,
                        customClasses: 'scrollable',
                        customHeaderStyle: {
                            background: 'url(hud/img/victory/DefeatEmblem.png) no-repeat, url(hud/img/victory/DefeatBG.png) no-repeat',
                            backgroundPosition: 'center, center 26.41vh',
                            backgroundSize: '39.0625vw, 39.0625vw',
                            fontSize: '3vw',
                            color: '#fff',
                            //webkitTextStroke: '2px #ff9000',
                            marginTop: '-18.51vh',
                            textShadow: '0 0 20px #d22929',
                            textTransform: 'uppercase',
                            padding: '0 0 2vh 0',
                            animation: 'fadein 1s',
                        },
                        customDescriptionStyle: {
                            background: 'transparent',
                        }
                    })
                    isSilent = true
                    break
                case 'wip':
                    parent.setState({ header: loc('not_yet_implemented', 'Not yet implemented') })
                    break
                case 'addfriend':
                    parent.setState({
                        header: loc('add_friend', 'Add Friend'),
                        description: loc('enter_username', 'Enter username'),
                        hasInput: true, items: sendFriendRequestMenu,
                        onSubmit: function (value) { engine.trigger('sendFriendRequest', value) }
                    })
                    break
                case 'sendpartyinvite':
                    parent.setState({
                        header: loc('invite_to_party', 'Invite To Party'),
                        description: loc('enter_username', 'Enter username'),
                        hasInput: true, items: sendInviteMenu,
                        onSubmit: function (value) { engine.trigger('sendPartyInvite', value, true) }
                    })
                    break
                case 'sendcustomgameinvite':
                    var statusText = ''
                    if (globalState.inviteFriendStatus && globalState.inviteFriendStatus.length > 0) {
                        statusText = globalState.inviteFriendStatus + '<br><br>'
                    }

                    parent.setState({
                        header: loc('invite_to_custom_game', 'Invite To Custom Game'),
                        description: statusText + loc('enter_username', 'Enter username'),
                        hasInput: true, items: sendCustomGameInviteMenu,
                        onSubmit: function (value) { engine.trigger('sendCustomGameInvite', value) }
                    })
                    break
                case 'setcustomgameplayersetting':
                    var key = globalState.contextMenuCustomValue2
                    var player = parseInt(globalState.contextMenuTarget) // Ghetto hack
                    var defaultValue = globalState.contextMenuCustomValue1

                    console.log("defaultValue is: " + defaultValue)
                    console.log("key is: " + key)

                    parent.setState({
                        header: loc('modify_setting', 'Modify setting'),
                        description: loc('enter_number', 'Enter number'),
                        hasInput: true, items: createOkCancelMenu(function () { engine.trigger('submitPopupMenuInput') }, null),
                        defaultInputValue: defaultValue,
                        onSubmit: function (value) {
                            console.log("submitted value is: " + value)
                            engine.call('OnTrySetCustomGamePlayerSetting', key, player, value)
                        }
                    })
                    break
                case 'reportplayer':
                    parent.setState({
                        header: loc('report_player', 'Report Player') + ": " + globalState.contextMenuDisplayTarget,
                        description: loc('report_player_long', 'Explain what they did wrong'),
                        hasParagraphInput: true, items: reportPlayerMenu,
                        onSubmit: function (value) { engine.trigger('reportPlayer', globalState.contextMenuTarget, value) },
                        customHeaderStyle: {
                            background: 'rgba(201, 26, 26, 0.75)',
                        },
                        customDescriptionStyle: {
                            background: 'rgba(108, 41, 41, 0.75)',
                        },
                        // DO NOT CHANGE THESE STRINGS
                        // Or if you do, make sure to update GameClient > PlayFabApi.cs which infers the category based on this string
                        // This one is sent to server
                        multipleChoiceItems: ["Intentionally lost the game", "Verbal abuse", "Left the game early", "Cheating", "Offensive Name"],
                        // Displayed to user
                        multipleChoiceItemsDisplay: [
                            loc('report_intentionally_lost_game', "Intentionally Lost"),
                            loc('report_verbal_abuse', "Verbal Abuse"),
                            loc('report_left_the_game_early', "Left the game early"),
                            loc('report_cheating', "Cheater"),
                            loc('report_offensive_name', "Offensive Name/Tagline")]
                    })
                    break
                case 'loadbuild':
                    parent.setState({
                        header: locName('load_build', 'Load Tower Build'),
                        description: loc('load_build', 'Use the -save command to generate text. Paste that text here.'),
                        hasParagraphInput: true, items: loadTowerBuildMenu,
                        onSubmit: function (value) { engine.call('OnLoadTowerBuild', value) },
                    })
                    break
                case 'avatar':
                    var avatarMenuDescription = loc('cards_long', 'Every enemy you kill, you have a small chance to find a rare collectible card. This card is usable as an avatar. It also adds to your collection value.|n|n|c(909090):Cards do not drop in Custom games|r')

                    if (globalState.shopEnabled)
                        avatarMenuDescription += "<br><br>" + loc('avatar_borders_tip', '3x/10x of the same card unlocks a silver/gold border.')

                    parent.setState({
                        header: loc('select_avatar', 'Change Avatar'),
                        description: avatarMenuDescription,
                        hasParagraphInput: false, items: selectAvatarMenu,
                        onSubmit: function (value) { engine.trigger('requestSelectAvatar', value.image) },
                        multipleChoiceItems: globalState.selectableAvatars
                    })

                    break
                case 'guildavatar':
                    var guildAvatarDescription = loc('guild_avatar_long', 'Your |c(ffcc00):guild avatar|r is displayed next to your guild name in leaderboards and guild profile pages. <br><br>Unlock new guild avatars by donating cards to your guild.<br>Once the guild owns at least |c|c(8ff110):5 stacks|r of a card, it may be used as an avatar.')

                    // v9.05.1 support multiple leaders now
                    var isLeader = globalState.selectedGuild.props.guildLeaderPlayFabId == globalState.playFabId
                    var isLeaderOrCoLeader = globalState.selectedGuild.isLeader
                    var canChangeAvatar = isLeaderOrCoLeader

                    if (globalState.selectableGuildAvatars != null && globalState.selectableGuildAvatars.length == 0) {
                        guildAvatarDescription = loc('guild_avatar_long', 'Your |c(ffcc00):guild avatar|r is displayed next to your guild name in leaderboards and guild profile pages. <br><br>Unlock new guild avatars by donating cards to your guild.<br>Once the guild owns at least |c|c(8ff110):5 stacks|r of a card, it may be used as an avatar.')
                            + '<br><br><span style="color: #ffff00">' + loc('you_have_no_cards_yet', 'You don\'t have any cards yet.') + '</span>'
                    }

                    parent.setState({
                        header: canChangeAvatar ? loc('select_guild_avatar', 'Change Guild Avatar') : loc('guild_avatar', 'Guild Avatar'),
                        description: guildAvatarDescription,
                        hasParagraphInput: false, items: canChangeAvatar ? selectAvatarMenu : backMenu,
                        onSubmit: function (value) {
                            console.log('guildavatar onSubmit: ' + value)

                            if (value == null || value.length == 0) {
                                console.log('no guildavatar was selected')
                                return
                            }

                            engine.trigger('requestSelectGuildAvatar', value.key)
                        },
                        multipleChoiceItems: globalState.selectableGuildAvatars
                    })
                    break
                case 'donate':
                    var donateDescription = loc('donate_card_long', 'Donating a card to your guild instantly gives your guild |c(8ff110:+250 GXP|r.|nOnce your guild owns 5 stacks of a card, the guild leader can also |c(ffcc00):equip|r it as an avatar.')

                    if (globalState.donatableCards == null) {
                        donateDescription = "<img src='hud/img/ui/loading-small.gif'>"
                    } else if (globalState.donatableCards != null && globalState.donatableCards.length == 0) {
                        donateDescription = loc('cards_long', 'Every enemy you kill, you have a small chance to find a rare collectible card.')
                            + '<br><br><span style="color: #ffff00">' + loc('you_have_no_cards_yet', 'You don\'t have any cards yet.') + '</span>'
                    }

                    parent.setState({
                        header: loc('donate_card', 'Donate Card'),
                        description: donateDescription,
                        hasParagraphInput: false, items: globalState.donatableCards != null ? donateCardMenu : backMenu,
                        onSubmit: function (value) {
                            if (value == null || value.length == 0) {
                                console.log('no card was selected')
                                return
                            }

                            engine.trigger('requestDonateCard', value.key)
                        },
                        multipleChoiceItems: globalState.donatableCards
                    })
                    break
                case 'sellcard':
                    var sellCardDescription = loc('sell_cards_long', 'Convert unwanted cards into essence!<br><br>Uncommon: 1000<br>Rare: 1250<br>Epic: 2000<br>Legendary: 3000<br>Secret: 5000')

                    if (globalState.donatableCards == null) {
                        sellCardDescription = "<img src='hud/img/ui/loading-small.gif'>"
                    } else if (globalState.donatableCards != null && globalState.donatableCards.length == 0) {
                        sellCardDescription = loc('cards_long', 'Every enemy you kill, you have a small chance to find a rare collectible card.')
                            + '<br><br><span style="color: #ffff00">' + loc('you_have_no_cards_yet', 'You don\'t have any cards yet.') + '</span>'
                    }

                    parent.setState({
                        header: loc('sell_cards', 'Sell Cards'),
                        description: sellCardDescription,
                        hasParagraphInput: false, items: globalState.donatableCards != null ? sellCardMenu : backMenu,
                        onSubmit: function (value) {
                            if (value == null || value.length == 0) {
                                console.log('no card was selected')
                                return
                            }

                            engine.trigger('requestSellCard', value.key)
                        },
                        multipleChoiceItems: globalState.donatableCards
                    })
                    break
                case 'equipcard':
                    var equipDescription = loc('bind_card_long', 'Bind a card to activate an in-game monument that decorates your lane. You can unbind the card at any time. 3x/10x of the same card unlock silver/gold pedestals.')
                    if (globalState.equippableCards == null) {
                        equipDescription = "<img src='hud/img/ui/loading-small.gif'>"
                    } else if (globalState.equippableCards != null && globalState.equippableCards.length == 0) {
                        equipDescription = loc('cards_long', 'Every enemy you kill, you have a small chance to find a rare collectible card.')
                            + '<br><br><span style="color: #ffff00">' + loc('you_have_no_cards_yet', 'You don\'t have any cards yet.') + '</span>'
                    }

                    parent.setState({
                        header: loc('bind_card', 'Bind Card'),
                        description: equipDescription,
                        hasParagraphInput: false, items: globalState.equippableCards != null ? equipCardMenu : backMenu,
                        onSubmit: function (value) {
                            if (value == null || value.length == 0) {
                                console.log('no card was selected')
                                return
                            }

                            engine.trigger('requestEquipCard', value.key, globalState.selectedMonumentSlot)
                        },
                        multipleChoiceItems: globalState.equippableCards
                    })
                    break
                case 'loggingin':
                    parent.setState({
                        header: '<img src="hud/img/brand/logo.png"><br/>' + loc('connecting_to_steam', 'Connecting to Steam'),
                        description: '',
                        items: createCancelMenu(function () {
                            engine.trigger('quitApplication')
                        }),
                        hasLoader: true
                    })
                    break
                case 'reconnecttogame':
                    isSilent = true
                    parent.setState({
                        header: loc('game_abandoned', 'Game Abandoned'),
                        description: loc('game_in_progress', 'Game In Progress'),
                        items: createReconnectCancelMenu(),
                    })
                    break
                case 'connectingtoalpha':
                case 'connectingtosingleplayer':
                    parent.setState({
                        header: loc('connecting_to_steam', 'Connecting to Steam'), description: "", items: createCancelMenu(function () {
                            engine.trigger('disconnectFromServer')
                            engine.trigger('loadView', 'gateway')
                        }),
                        hasLoader: true
                    })
                    break
                case 'connectingtocustomgame':
                    parent.setState({
                        header: loc('connecting_to_steam', 'Connecting to Steam'), description: "", items: createCancelMenu(function () {
                            engine.trigger('disconnectFromServer')
                            engine.trigger('loadView', 'play')
                        }),
                        hasLoader: true
                    })
                    break
                case 'leavecustomgame':
                    parent.setState({
                        header: loc('leave_custom_game', 'Leave Custom Game'),
                        description: '', items: leaveCustomGameMenu,
                    })
                    break
                case 'disconnectedfromserver':
                    parent.setState({
                        header: loc('disconnected_from_server', 'Disconnected from server'), description: "", items: quitOnlyMenu,
                    })
                    break
                case 'featuredisabled':
                    parent.setState({
                        header: loc('feature_disabled', 'This feature is disabled'), description: "", items: okMenu,
                    })
                    break
                case 'afk':
                    parent.setState({
                        header: loc('afk_detected', 'AFK Detected'),
                        description: loc('afk_marked_as_afk', 'Repeatedly AFK is bad'),
                        items: continuePlayingMenu,
                        customHeaderStyle: {
                            background: 'rgba(201, 26, 26, 0.75)',
                        },
                        customDescriptionStyle: {
                            background: 'rgba(108, 41, 41, 0.75)',
                        },
                    })
                    break
                case 'afkfriendly':
                    parent.setState({
                        header: loc('afk_detected', 'AFK Detected'),
                        description: loc('afk_marked_as_afk_friendly', 'Repeatedly AFK is bad'),
                        items: continuePlayingMenu,
                        customHeaderStyle: {
                            background: 'rgba(160, 160, 160, 0.75)',
                        },
                        customDescriptionStyle: {
                            background: 'rgba(90, 90, 90, 0.75)',
                        },
                    })
                    break
                case 'confirmsurrender':
                    parent.setState({
                        header: loc('confirm_surrender', 'Confirm Surrender?'),
                        description: '',
                        items: createYesCancelMenu(
                            function () { engine.call('OnConfirmSurrender') },
                            function () { }),
                    })
                    isSilent = true
                    break
                case 'confirmrestart':
                    parent.setState({
                        header: loc('confirm_restart', 'Confirm Restart?'),
                        description: '',
                        items: createYesCancelMenu(
                            function () { engine.call('OnConfirmRestart') },
                            function () { }),
                    })
                    isSilent = true
                    break
                case 'confirmsell':
                    parent.setState({
                        header: loc('confirm_sell', 'Confirm Undeploy'),
                        description: '',
                        items: createYesCancelMenu(
                            function () { engine.call('OnConfirmUndeploy') },
                            function () { }),
                    })
                    isSilent = true
                    break
                case 'confirmsellall':
                    parent.setState({
                        header: loc('confirm_sell', 'Confirm Undeploy'),
                        description: loc('confirm_sell_griefer', 'THIS IS A TEAM GAME. SELLING ALL YOUR TOWERS WITHOUT YOUR TEAMMATE\'S PERMISSION RUINS THE GAME FOR EVERYONE'),
                        items: createYesCancelMenu(
                            function () { engine.call('OnConfirmUndeploy') },
                            function () { }),
                        customHeaderStyle: {
                            background: 'rgba(201, 26, 26, 0.75)',
                        },
                        customDescriptionStyle: {
                            background: 'rgba(108, 41, 41, 0.75)',
                        }
                    })
                    break
                case 'confirmsupplyupgrade':
                    parent.setState({
                        header: loc('confirm_upgrade_supply', 'Confirm Upgrade Supply'),
                        description: '',
                        items: createYesCancelMenu(
                            function () { engine.call('OnConfirmSupplyUpgrade') },
                            function () { }),
                    })
                    break
                //case 'confirmdeletelogs':
                //    parent.setState({
                //        header: loc('confirm_delete_logs', 'Confirm Delete Logs'),
                //        description: loc('confirm_delete_logs_long', 'Your game has 250 mb of debug logs older than 14 days. You can delete them safely to free up hard drive space.'),
                //        items: createYesCancelMenu(
                //            function () { engine.call('OnConfirmDeleteLogs') },
                //            function () { }),
                //    })
                //    break
                case 'confirmnobuild':
                    parent.setState({
                        header: locName('confirm_no_build', 'Confirm Worker'),
                        description: loc('confirm_no_build', 'Not deploying fighters requires permission from a majority of your allies'),
                        items: createYesCancelMenu(
                            function () { engine.call('OnConfirmNoBuild') },
                            function () { }),
                        customHeaderStyle: {
                            background: 'rgba(201, 26, 26, 0.75)',
                        },
                        customDescriptionStyle: {
                            background: 'rgba(108, 41, 41, 0.75)',
                        }
                    })
                    isSilent = true
                    break
                //case 'mysteriouscard':
                //    parent.setState({
                //        header: locName('mysterious_card_item', 'Mysterious Card'),
                //        description: '<div class="news-image"><img src="hud/img/cards/lava/back.png"/></div>',
                //        items: createRevealMenu(
                //            function () {
                //                console.log('trigger OnConsumeMysteriousCard')
                //                engine.call('OnConsumeMysteriousCard')
                //            }
                //        ),
                //        customHeaderStyle: {
                //            background: 'rgba(0, 0, 0, 0.75)',
                //        },
                //        customDescriptionStyle: {
                //            background: 'rgba(0, 0, 0, 0.75)',
                //        }
                //    })
                //    break
                case 'beattutorials':
                    parent.setState({
                        header: loc('congratulations', 'Congratulations') + '!',
                        description: loc('beat_intro_tutorials', 'Good job!', [globalState.savedUsername]),
                        items: createJoinDiscordOkMenu()
                    })
                    isSilent = true
                    break
                case 'reportplayerpostgame':
                    // Popup approach
                    //parent.setState({
                    //    header: loc('report_player', 'Report Player'),
                    //    description: loc('report_player_postgame', 'Reporting players must be done in-game using the TAB scoreboard. This allows the FairPlay system to take into account in-game info, which makes the report much more accurate. <br><br>If you still want to make a manual report, you may do so at: <span style="color: #ffcc00">legiontd2.com/bans</span>'), items: okMenu
                    //})

                    // v7.02
                    parent.setState({
                        header: loc('report_player', 'Report Player') + ": " + globalState.contextMenuDisplayTarget,
                        description: loc('report_player_long', 'Explain what they did wrong') + '<br><br>' + loc('report_player_postgame_note', 'extra note for postgame'),
                        hasParagraphInput: true, items: reportPlayerMenu,
                        onSubmit: function (value) { engine.trigger('reportPlayer', globalState.contextMenuTarget, value) },
                        customHeaderStyle: {
                            background: 'rgba(201, 26, 26, 0.75)',
                        },
                        customDescriptionStyle: {
                            background: 'rgba(108, 41, 41, 0.75)',
                        },
                        // DO NOT CHANGE THESE STRINGS
                        // Or if you do, make sure to update GameClient > PlayFabApi.cs which infers the category based on this string
                        // This one is sent to server
                        multipleChoiceItems: ["Verbal abuse"],
                        // Displayed to user
                        multipleChoiceItemsDisplay: [
                            loc('report_verbal_abuse', "Verbal Abuse")
                        ]
                    })

                    break
                case 'confirmconversion':
                    parent.setState({
                        header: loc('confirm_conversion', 'Confirm Conversion'),
                        description: '',
                        items: createYesCancelMenu(
                            function () { engine.call('OnConfirmConversion') },
                            function () { }),
                    })
                    break
                case 'initialexperience':
                    parent.setState({
                        header: '<img style="width: 500px; margin-bottom: 12px;" src="hud/img/backgrounds/sovereign_500.jpg"/><br>' + locName('initial_experience_popup', 'Welcome to Legion TD 2!'),
                        description: loc('initial_experience_popup', "If you're new, it is strongly recommended to play the short tutorial to learn the fundamentals."),
                        items: createInitialExperienceMenu(),
                        customHeaderStyle: {
                            background: 'rgba(33, 34, 34, 0.9)',
                            width: '524px',
                            margin: 'auto'
                        },
                        customDescriptionStyle: {
                            background: 'rgba(33, 34, 34, 0.9)',
                            width: '556px',
                            margin: 'auto',
                            padding: '0'
                        }
                    })
                    isSilent = true
                    break
                case 'autopause':
                    // ideally we make it so you can't click this too fast, but this popup is "reopened" every time it updates
                    // so it's a little tricky to do...
                    parent.setState({
                        header: loc('autopause_waiting_for_players', 'Waiting 60s for players to reconnect', [globalState.autopauseSeconds]),
                        description: globalState.autopauseDisconnectedPlayers.join('<br>'),
                        items: globalState.autopauseEnableSkip ? createSkipMenu(
                            function () { engine.call('OnSkipAutopause') }) : createSkipDisabledMenu(),
                        customHeaderStyle: {
                            background: '#606060'
                        },
                        customDescriptionStyle: {
                            background: '#404040'
                        }
                    })
                    break
                case 'twitchlinked':
                    parent.setState({
                        header: '<img style="width: 350px; margin-bottom: 20px;" src="hud/img/splashes/TwitchLogo.png"/><br>' + loc('link_account_successful', 'Your accounts have been linked!'),
                        //TODO: description: loc('link_account_popup', 'Note: the streamer you are watching must have Twitch Drops enabled on their stream. <br>Check to make sure that this notification appears:<br><br><img style="width: 350px; margin-bottom: 20px;" src="hud/img/guide/twitchdrops.png"/>'),
                        //description: 'Note: the streamer you are watching must have Twitch Drops enabled on their stream. <br>Check to make sure that this notification appears:<br><br><img style="width: 350px; margin-bottom: 20px;" src="hud/img/guide/twitchdrops.png"/>',
                        description: loc('link_account_popup', 'Note: the streamer you are watching must have Twitch Drops enabled on their stream.|nCheck to make sure that this notification appears') + ': <br><br><img style="width: 350px; margin-bottom: 20px;" src="hud/img/guide/twitchdrops.png"/>',
                        items: createOkMenu(),
                        customHeaderStyle: {
                            background: 'rgba(33, 34, 34, 0.9)',
                            width: '524px',
                            margin: 'auto'
                        },
                        customDescriptionStyle: {
                            background: 'rgba(33, 34, 34, 0.9)',
                            width: '556px',
                            margin: 'auto',
                            padding: '0'
                        }
                    })
                    isSilent = true
                    break
            }

            engine.call("OnLoadAnyPopup")

            if (!isSilent)
                engine.call("OnLoadPopupSound")

            parent.setState({ enabled: true })
        }

        // todo: refactor to put stuff in 'settings' so we don't have a bunch of arguments, since it's super annoying to call this
        bindings.loadPopupExplicit = function (header, description, behavior, items, hasInput, hasParagraphInput, onSubmit, silent, settings) {
            engine.call("OnLoadAnyPopup")

            globalState.lastPopupName = header

            if (!silent)
                engine.call("OnLoadPopupSound")

            var customClasses = ''
            var customFullScreenBackground = ''
            var customHeaderStyle = {}
            var customDescriptionStyle = {}
            var customInputStyle = {}
            var defaultInputValue = ''

            if (settings != null && settings.customFullScreenBackground)
                customFullScreenBackground = settings.customFullScreenBackground
            if (settings != null && settings.customHeaderStyle)
                customHeaderStyle = settings.customHeaderStyle
            if (settings != null && settings.customDescriptionStyle)
                customDescriptionStyle = settings.customDescriptionStyle
            if (settings != null && settings.customClasses)
                customClasses = settings.customClasses
            if (settings != null && settings.defaultInputValue)
                defaultInputValue = settings.defaultInputValue
            if (settings != null && settings.customInputStyle)
                customInputStyle = settings.customInputStyle

            parent.setState({
                header: header,
                description: description,
                behavior: behavior,
                items: items,
                hasLoader: (settings != null && settings.hasLoader) ? true : false,
                enabled: true,
                hasInput: hasInput,
                hasParagraphInput: hasParagraphInput,
                onSubmit: onSubmit,
                customFullScreenBackground: customFullScreenBackground,
                customHeaderStyle: customHeaderStyle,
                customDescriptionStyle: customDescriptionStyle,
                customInputStyle: customInputStyle,
                multipleChoiceItems: [], // later maybe support multiple choice items explicitly? Maybe...
                multipleChoiceItemsDisplay: [], // later maybe support multiple choice items explicitly? Maybe...
                customClasses: customClasses,
                customParagraphStyle: {},
                checkboxText: "",
                onCheckboxClicked: function () { },
                defaultInputValue: defaultInputValue
            })
        }

        bindings.hidePopup = function (silent) {
            engine.call("OnHideAnyPopup")

            if (!silent)
                engine.call("OnHidePopupSound")

            parent.setState({ enabled: false })
        }
    },
    render: function () {

        if (this.state.items && this.state.items.length > 0) {
            this.firstItem = this.state.items[0]
            //console.log("firstItem is " + this.firstItem.name + " with behavior: " + this.firstItem.behavior)
        } else {
            this.firstItem = null // to clean any old values
        }

        var animation = GetAnimationPreset5(this.state.enabled)
        if (this.state.customFullScreenBackground.length > 0) {
            console.log('animation 6 override')
            animation = GetAnimationFade(this.state.enabled, 400, 400)
        }

        return (
            React.createElement(
                VelocityComponent,
                animation,
                React.createElement(PopupView, {
                    name: this.state.name,
                    items: this.state.items,
                    header: this.state.header,
                    description: this.state.description,
                    hasInput: this.state.hasInput,
                    hasParagraphInput: this.state.hasParagraphInput,
                    hasLoader: this.state.hasLoader,
                    onSubmit: this.state.onSubmit,
                    customFullScreenBackground: this.state.customFullScreenBackground,
                    customHeaderStyle: this.state.customHeaderStyle,
                    customDescriptionStyle: this.state.customDescriptionStyle,
                    customInputStyle: this.state.customInputStyle,
                    multipleChoiceItems: this.state.multipleChoiceItems,
                    multipleChoiceItemsDisplay: this.state.multipleChoiceItemsDisplay,
                    customClasses: this.state.customClasses,
                    customParagraphStyle: this.state.customParagraphStyle,
                    defaultInputValue: this.state.defaultInputValue,
                    checkboxText: this.state.checkboxText,
                    onCheckboxClicked: this.state.onCheckboxClicked,
                })
            )
        )
    }
})

var FullScreenPopupApp = React.createClass({
    getInitialState: function () {
        return {
            enabled: false,
            blurred: false,
            reactElement: "",
            clickToClose: true,
            onClose: null,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.showFullScreenPopup = function (reactElement, clickToClose, onClose) {
            parent.setState({
                reactElement: reactElement,
                enabled: true,
                clickToClose: clickToClose,
                onClose: onClose
            })
        }

        bindings.hideFullScreenPopup = function () {
            if (typeof parent.state.onClose === "function")
                parent.state.onClose()

            parent.setState({
                enabled: false,
                onClose: null
            })
        }

        bindings.blurFullScreenPopup = function (blurred) {
            parent.setState({ blurred: blurred })
        }
    },
    render: function () {
        var parent = this
        return (
            React.createElement(
                VelocityComponent,
                GetAnimationPreset5(this.state.enabled),
                /* top: 0 added in v6.xx shop. Hope its ok. Otherwise the Card Trader stuff doesnt show up for some reason */
                /* zIndex: 1 also added in v6.xx shop. Hope its ok. This will cover up the BottomBar when its up */
                /* This is causing weird black bar issues when ingame only, so maybe try some weird shit */
                React.createElement('div', {
                    id: 'FullScreenPopupView', style: {
                        position: 'fixed', height: '100%', width: '100%', top: '0',
                        zIndex: '1'
                    }
                },
                    React.createElement('div', {
                        className: 'fullscreen',
                        style: {
                            top: parent.state.blurred ? '-200px' : '', /* SUPER WEIRD BLACK BAR COHERENT FIX, ONLY IN-GAME AND ONLY WHEN UN-INSPECTED */
                            bottom: parent.state.blurred ? '-200px' : '' /* SUPER WEIRD BLACK BAR COHERENT FIX, ONLY IN-GAME AND ONLY WHEN UN-INSPECTED */
                        }
                    },
                        React.createElement('div', { className: 'popup centered-text' },
                            React.createElement('div', { className: 'centered-text-wrapper' },
                                // Click anywhere to close
                                this.state.clickToClose && React.createElement('div', {
                                    id: "ContextMenuBacker",
                                    className: this.state.enabled ? '' : ' hidden',
                                    onMouseDown: function (e) {
                                        engine.trigger('hideFullScreenPopup')
                                    }
                                }),
                                this.state.reactElement
                            )
                        )
                    )
                )
            )
        )
    }
})

var WatermarkApp = React.createClass({
    getInitialState: function () {
        return {
            text: "",
            value: "",
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshWatermarkText = function (text) {
            parent.setState({ text: text })
        }
        bindings.refreshWatermarkValue = function (text) {
            parent.setState({ value: text })
        }
    },
    render: function () {
        return (
            React.createElement('div', { id: 'WatermarkApp' },
                React.createElement('div', { className: 'text-watermark' },
                    React.createElement('span', {
                        className: 'content',
                        dangerouslySetInnerHTML: { __html: this.state.text + " " }
                    }),
                    this.state.value && React.createElement('span', {
                        className: 'content',
                        dangerouslySetInnerHTML: { __html: this.state.value }
                    })
                )
            )
        )
    }
})

var ClientWatermarkApp = React.createClass({
    getInitialState: function () {
        return {
            text: "",
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshClientWatermarkText = function (text) {
            parent.setState({ text: text })
        }
    },
    render: function () {
        if (this.state.text == "") return null

        return (
            React.createElement('div', { id: 'ClientWatermarkApp' },
                React.createElement('div', { className: 'text-watermark' },
                    React.createElement('span', {
                        className: 'content',
                        dangerouslySetInnerHTML: { __html: this.state.text + " " }
                    })
                )
            )
        )
    }
})

var ChatApp = React.createClass({
    render: function () {
        return (
            React.createElement('div', { id: 'ChatApp' },
                React.createElement(BottomBar, {})
            )
        )
    }
})
