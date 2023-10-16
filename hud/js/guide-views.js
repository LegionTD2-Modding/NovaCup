// In-game attack & armor types window, wave info window, etc.
// Also help menu content, from the bottom bar
// ===============================================================================

// Menu button in the bottom right of the HUD
var InGameCoachMenuButton = React.createClass({
    lastClicked: 0,
    getInitialState: function () {
        return {
            enabled: false,
            active: false,
            message: '',
        }
    },
    componentWillMount: function () {
        var parent = this

        bindings.refreshInGameCoachDialogue = function (message) {
            parent.setState({ message: message })
        }

        bindings.setInGameCoachActive = function (active) {
            parent.setState({ active: active })
        }

        bindings.hideInGameCoachAfterDelay = function (delay) {
            //console.log('hideAfterDelay parent.lastClicked: ' + parent.lastClicked)
            var lastClickedBeforeTimeout = parent.lastClicked
            setTimeout(function () {
                //console.log('timeout lastClickedBeforeTimeout: ' + lastClickedBeforeTimeout
                //    + ', parent.lastClicked: ' + parent.lastClicked)

                // Bail early if other stuff was clicked
                if (lastClickedBeforeTimeout != parent.lastClicked) return 

                parent.setState({ active: false })
            }, delay)
        }

        bindings.enableInGameCoach = function (enabled) {
            parent.setState({ enabled: enabled })
        }
    },
    render: function () {
        var parent = this

        if (!parent.state.enabled) {
            return React.createElement('div', {
                style: {
                    display: 'block',
                    float: 'right',
                    height: '32px',
                    width: '32px',
                    margin: '6px 6px 6px 6px'
                }
            })
        }

        // Use plaintext length to strip HTML tags, so that something like a :proleak: emoji
        // isn't accidentally treated like a long message
        var plainText = parent.state.message.replace(/(<([^>]+)>)/ig, '')
        //console.log('plainText: ' + plainText)
        //console.log('plainText length: ' + plainText.length)
        //console.log('msglength: ' + parent.state.message.length)
        var dialogueWidth = 'auto'
        if (plainText.length > 50)
            dialogueWidth = 300 + 'px'
        else if (plainText.length > 20)
            dialogueWidth = 190 // v9.05
        else if (plainText.length > 5)
            dialogueWidth = 'auto'

        var iconSuffix = (globalState.isMac ? '_Mac' : '') + '.png'

        return (
            React.createElement('div', {
                className: 'simple-tooltip' + (globalState.isMac ? '' : ' flipped'),
                style: {
                    background: 'url(hud/img/' + getGameCoachIcon() + iconSuffix + ')',
                    backgroundSize: '40px',
                    border: '1px solid #86afb5',
                    float: 'right',
                    height: '40px', /* v9.05 enlarged to 40px */
                    width: '40px',
                    margin: '6px 6px 6px 6px',
                    transform: globalState.isMac ? 'scale(-1)' : ''
                },
                onMouseDown: function (e) {
                    var left = e.nativeEvent.clientX
                    var top = e.nativeEvent.clientY - 180

                    if (e.nativeEvent.which == 2) return // v2.22 fix

                    var newActive = !parent.state.active
                    console.log('Click in-game coach, newActive: ' + newActive)
                    parent.lastClicked = Date.now()

                    // NEW way: always close it, then reopen once we hear back from server
                    parent.setState({ active: false })

                    if (newActive)
                        engine.call('OnRequestRefreshInGameCoach')
                    else
                        engine.call('OnCloseGameCoachTip')
                }
            },
                parent.state.active && React.createElement('div', {
                    className: 'in-game-coach-dialogue',
                    style: {
                        width: dialogueWidth,
                        whiteSpace: dialogueWidth == 'auto' ? 'nowrap' : '',
                        display: dialogueWidth == 'auto' ? 'inline-block' : '',
                        transform: globalState.isMac ? 'scale(-1)' : '',
                        bottom: globalState.isMac ? '-60px' : '',
                        right: globalState.isMac ? '' : '',
                        left: globalState.isMac ? '0' : '',
                        position: globalState.isMac ? 'relative' : '',
                    },
                    dangerouslySetInnerHTML: {
                        __html: parent.state.message
                    }
                })//,
                // v8.06 maybe try commenting out the opacity thing to see if it fixes the stuck game coach tooltip?
                // If not, can remove later.
                // v8.06.2 yeah still borked feelsbad.
                //React.createElement('span', {
                //    className: 'tooltiptext auto no-carat', style: {
                //        right: globalState.isMac ? '' : '120%',
                //        left: globalState.isMac ? '120%' : '',
                //        bottom: '0',
                //        //opacity: !parent.state.active ? '1' : '0', // unsure why I had this
                //        pointerEvents: parent.state.active ? 'none' : '', // doesn't actually really fix tooltip stuck bug
                //        transform: globalState.isMac ? 'scale(-1)' : '',
                //    }
                //},
                //    loc('game_coach', "Game Coach")
                //)
            )
        )
    }
})


// Menu button in the bottom right of the HUD
var GuideMenuButton = React.createClass({
    render: function () {
        return (
            React.createElement('div', {
                className: 'hud-button simple-tooltip flipped',
                style: {
                    background: 'url(hud/img/small-icons/guide.png)',
                    float: 'right'
                },
                onMouseDown: function (e) {
                    var left = e.nativeEvent.clientX
                    var top = e.nativeEvent.clientY - 180

                    if (e.nativeEvent.which == 2) return // v2.22 fix

                    // v2.25: show both of them
                    var shouldEnable = true
                    if (globalState.isGuideWavesOpen || globalState.isTypeChartOpen) {
                        shouldEnable = false
                    }
                    engine.trigger('enableGuideAttackTypes', shouldEnable)
                    engine.trigger('enableGuideWaves', shouldEnable)
                    //openContextMenu("", "", guideMenu, left, top)
                }
            },
                React.createElement('span', { className: 'tooltiptext auto no-carat', style: { right: '120%', bottom: '0' } },
                    loc('wave_guide', "Wave Guide")
                )
            )
        )
    }
})

var GuideWavesWindow = React.createClass({
    getInitialState: function () {
        return {
            enabled: false,
            waves: [],
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshGuideWaves = function (waves) {
            parent.setState({ waves: waves })
        }
        bindings.enableGuideWaves = function (enabled) {
            console.log('enableGuideWaves ' + enabled)
            parent.setState({ enabled: enabled })
            engine.call('OnEnableGuideWaves', enabled)
        }
        bindings.toggleGuideWaves = function () {
            //parent.setState({ enabled: !parent.state.enabled })
            // v8.04 wait, we should go through enableGuideWaves so prefs actually update. DUH.
            engine.trigger('enableGuideWaves', !parent.state.enabled)
        }
    },
    render: function () {
        var parent = this

        globalState.isGuideWavesOpen = this.state.enabled

        if (!this.state.enabled)
            return null

        var isNarrow = globalState.screenWidth < 1800
        var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160

        /* NOTE: Don't use defaultRight since it doesn't load from disk properly */
        //var defaultRight = '310px'
        var defaultLeft = '0px'
        var defaultTop = '0px'

        if (globalState.screenWidth == 3840 && globalState.screenHeight == 2160) {
            //defaultRight = '630px'
            defaultTop = '-984px'
            defaultLeft = '-1051px'
        } else if (globalState.screenWidth == 2560 && globalState.screenHeight == 1440) {
            //defaultRight = '387px'
            defaultTop = '-672px'
            defaultLeft = '-788px'
        } else if (globalState.screenWidth == 1920 && globalState.screenHeight == 1080) {
            //defaultRight = '100px'
            defaultTop = '320px'
            defaultLeft = '-533px'
        } else if (globalState.screenWidth == 1920 && globalState.screenHeight == 1200) {
            defaultTop = '380px'
            defaultLeft = '-533px'
        } else if (globalState.screenWidth == 1440 && globalState.screenHeight == 900) {
            //defaultRight = '994px'
            defaultTop = '-59px'
            defaultLeft = '-1414px'
        } else if (globalState.screenWidth == 1366 && globalState.screenHeight == 768) {
            //defaultRight = '925px'
            defaultTop = '-59px'
            defaultLeft = '-1345px'
        } else {
            //defaultRight = '841px'
            defaultTop = '-59px'
            defaultLeft = '-1261px'
        }

        console.log('render guideWaves, defaultLeft: ' + defaultLeft)

        return (
            React.createElement(Module, { moduleId: 'guideWaves', width: 420, height: 175, defaultLeft: defaultLeft, defaultTop: defaultTop, defaultBottom: 'unset', defaultRight: 'unset', simple: true },
                React.createElement('div', { className: 'guideWindow' },
                    React.createElement('div', {
                        className: 'button x-button',
                        onMouseDown: function (e) {
                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness
                            if (e.nativeEvent.which == 3) return
                            engine.trigger('enableGuideWaves', false)
                        }
                    },
                        "X"
                    ),
                    React.createElement('div', { className: 'title' }, loc('wave_info', "Wave Info")),
                    React.createElement('div', { className: 'content' },
                        React.createElement('table', {
                            ref: 'leaderboard', className: 'leaderboard scrollable',
                            style: {
                                width: 'calc(100% - 10px)',
                                margin: '5px',
                                display: 'block',
                                height: isNarrow ? '125px' : '169px',
                            }
                        },
                            React.createElement('thead', {},
                                React.createElement('tr', {},
                                    React.createElement('td', { style: { width: '64px' } }, loc('wave', "Wave")),
                                    React.createElement('td', { style: { width: '64px' } }, loc('types', "Types")),
                                    React.createElement('td', { className: 'recommended-types', style: { width: '85px', fontSize: '0.8em' } }, loc('chart_recommended_types', 'Recommended Types')),
                                    React.createElement('td', { className: 'recommended-types', style: { width: '64px', fontSize: '0.8em' } }, loc('chart_recommended_value', 'Recommended Value')),
                                    React.createElement('td', { style: { width: '85px' } }, locName('ability', "Ability"))
                                )
                            ),
                            React.createElement('tbody', { className: '' },
                                this.state.waves.map(function (wave, i) {
                                    return (
                                        React.createElement('tr', { className: 'wave-info' + (wave.isCurrentWave ? ' highlighted' : '') },
                                            React.createElement('td', { className: 'simple-tooltip', style: { width: '64px' } },
                                                React.createElement('span', { style: { marginRight: '6px' } }, (wave.key)),
                                                React.createElement('img', {
                                                    src: "hud/img/" + wave.icon
                                                }),
                                                React.createElement('span', { className: 'tooltiptext small' },
                                                    React.createElement('div', {},
                                                        React.createElement('span', {
                                                            dangerouslySetInnerHTML: {
                                                                __html: wave.name
                                                            }
                                                        }),
                                                        React.createElement('span', { style: { color: '#ff8800' } }, ' (' + wave.amount + 'x)')
                                                    )
                                                )
                                                //React.createElement('span', {}, wave.name),
                                                //React.createElement('span', { className: 'tooltiptext' },
                                                //    React.createElement('span', {}, wave.name + " types"),
                                                //    React.createElement('div', {},
                                                //        React.createElement('img', { className: 'resource-icon', src: "hud/img/icons/" + wave.attackType + ".png"}),
                                                //        wave.attackType
                                                //    ),
                                                //    React.createElement('div', {},
                                                //        React.createElement('img', { className: 'resource-icon', src: "hud/img/icons/" + wave.defenseType + ".png" }),
                                                //        wave.defenseType
                                                //    )
                                                //)
                                            ),
                                            React.createElement('td', {},
                                                wave.attackType && React.createElement('div', { className: 'simple-tooltip' },
                                                    React.createElement('img', { src: "hud/img/icons/" + wave.attackType + ".png", className: 'guide-attack-type' }),
                                                    React.createElement('span', { className: 'tooltiptext small' },
                                                        loc('chart_wave_has_attack', wave.name + " have " + wave.attackType + " attack", [wave.name, wave.attackTypeDisplay])
                                                    )
                                                ),
                                                !wave.attackType && React.createElement('div', { className: 'icon-placeholder' }),
                                                wave.defenseType && React.createElement('div', { className: 'simple-tooltip' },
                                                    React.createElement('img', { src: "hud/img/icons/" + wave.defenseType + ".png", className: 'guide-attack-type' }),
                                                    React.createElement('span', { className: 'tooltiptext small' },
                                                        loc('chart_wave_has_defense', wave.name + " have " + wave.defenseType + " defense", [wave.name, wave.defenseTypeDisplay])
                                                    )
                                                ),
                                                !wave.defenseType && React.createElement('div', { className: 'icon-placeholder' })
                                            ),
                                            React.createElement('td', {},
                                                wave.strongAttackType && React.createElement('div', { className: 'simple-tooltip' },
                                                    React.createElement('img', { src: "hud/img/icons/" + wave.strongAttackType + ".png", className: 'guide-attack-type recommended' }),
                                                    React.createElement('span', { className: 'tooltiptext small' },
                                                        loc('chart_good_attack_vs', wave.strongAttackType + " is good vs. this wave", [wave.strongAttackTypeDisplay])
                                                    )
                                                ),
                                                !wave.strongAttackType && React.createElement('div', { className: 'icon-placeholder' }),
                                                wave.strongDefenseType && React.createElement('div', { className: 'simple-tooltip' },
                                                    React.createElement('img', { src: "hud/img/icons/" + wave.strongDefenseType + ".png", className: 'guide-attack-type recommended' }),
                                                    React.createElement('span', { className: 'tooltiptext small' },
                                                        loc('chart_good_defense_vs', wave.strongDefenseType + " is good vs. this wave", [wave.strongDefenseTypeDisplay])
                                                    )
                                                ),
                                                !wave.strongDefenseType && React.createElement('div', { className: 'icon-placeholder' })
                                            ),
                                            React.createElement('td', {},
                                                React.createElement('span', { className: 'simple-tooltip' },
                                                    wave.recommendedValue,
                                                    React.createElement('span', {
                                                        className: 'tooltiptext small',
                                                        dangerouslySetInnerHTML: {
                                                            __html: loc('chart_total_reward', wave.totalReward + ' reward', [wave.totalReward])
                                                        }
                                                    })
                                                )
                                            ),
                                            React.createElement('td', {},
                                                wave.abilityName && React.createElement('div', { className: 'simple-tooltip flipped' },
                                                    React.createElement('img', { src: "hud/img/" + wave.abilityIcon }),
                                                    React.createElement('span', { className: 'tooltiptext small' },
                                                        React.createElement('div', { style: { color: '#ffffff' } }, wave.abilityName),
                                                        React.createElement('div', {
                                                            style: { color: '#ccc' },
                                                            dangerouslySetInnerHTML: {
                                                                __html: wave.abilityDescription
                                                            }
                                                        })
                                                    )
                                                )
                                            )
                                        )
                                    )
                                })
                            )
                        )
                    )
                )
            )
        )
    }
})

var GuideAttackTypesWindow = React.createClass({
    getInitialState: function () {
        return {
            enabled: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.enableGuideAttackTypes = function (enabled) {
            console.log('enableGuideAttackTypes ' + enabled)
            parent.setState({ enabled: enabled })
            engine.call('OnEnableGuideAttackTypes', enabled)
        }
        bindings.toggleGuideAttackTypes = function () {
            //parent.setState({ enabled: !parent.state.enabled })
            // v8.04 wait, we should go through enableGuideWaves so prefs actually update. DUH.
            engine.trigger('enableGuideAttackTypes', !parent.state.enabled)
        }
    },
    render: function () {
        var parent = this

        globalState.isTypeChartOpen = this.state.enabled

        if (!this.state.enabled)
            return null

        var isNarrow = globalState.screenWidth < 1800
        var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160

        /* NOTE: Don't use defaultRight since it doesn't load from disk properly */
        var defaultLeft = '0px'
        var defaultTop = '0px'
        if (globalState.screenWidth == 3840 && globalState.screenHeight == 2160) {
            defaultTop = '-566px'
            defaultLeft = '-458px'
        } else if (globalState.screenWidth == 2560 && globalState.screenHeight == 1440) {
            defaultTop = '-407px'
            defaultLeft = '-323px'
        } else if (globalState.screenWidth == 1920 && globalState.screenHeight == 1080) {
            defaultTop = '-522px'
            defaultLeft = '-586px'
        } else if (globalState.screenWidth == 1920 && globalState.screenHeight == 1200) {
            defaultTop = '-582px'
            defaultLeft = '-586px'
        } else if (globalState.screenWidth == 1440 && globalState.screenHeight == 900) {
            defaultTop = '-234px'
            defaultLeft = '-1414px'
        } else if (globalState.screenWidth == 1366 && globalState.screenHeight == 768) {
            defaultTop = '-234px'
            defaultLeft = '-1345px'
        } else {
            defaultTop = '-185px'
            defaultLeft = '-1261px'
        }

        return (
            React.createElement(Module, { moduleId: 'guideAttackTypes', width: 336, height: 170, defaultLeft: defaultLeft, defaultTop: defaultTop, defaultBottom: 'unset', defaultRight: 'unset', simple: true },
                React.createElement('div', {
                    className: 'guideWindow attack-types-guide', style: { width: '334px' }
                },
                    React.createElement('div', {
                        className: 'button x-button',
                        onMouseDown: function (e) {
                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness
                            if (e.nativeEvent.which == 3) return
                            engine.trigger('enableGuideAttackTypes', false)
                        }
                    },
                        "X"
                    ),
                    React.createElement('div', {
                        className: 'button x-button help-button simple-tooltip flipped-y',
                    },
                        "?",
                        React.createElement('span', {
                            className: 'tooltiptext wide',
                            style: {
                                left: '100px'
                            },
                            dangerouslySetInnerHTML: {
                                __html: loc('chart_help_text_attack', "<span style='color: #869e3b'>Attack</span> <span style='color: #999'>(strong = good)</span>")
                                    + "<br />"
                                    + loc('chart_help_text_impact', "<img class='tooltip-icon' src='hud/img/icons/Impact.png'/> Impact is strong vs. Fort/Arc")
                                    + "<br />"
                                    + loc('chart_help_text_pierce', "<img class='tooltip-icon' src='hud/img/icons/Pierce.png'/> Pierce is strong vs. Swift/Arc")
                                    + "<br />"
                                    + loc('chart_help_text_magic', "<img class='tooltip-icon' src='hud/img/icons/Magic.png'/> Magic is strong vs. Nat/Fort")
                                    + "<br />"
                                    + loc('chart_help_text_defense', "<span style='color: #b27c42'>Defense</span> <span style='color: #999'>(resistant = good)</span>")
                                    + "<br />"
                                    + loc('chart_help_text_swift', "<img class='tooltip-icon' src='hud/img/icons/Swift.png'/> Swift is resistant vs. Impact")
                                    + "<br />"
                                    + loc('chart_help_text_natural', "<img class='tooltip-icon' src='hud/img/icons/Natural.png'/> Nat is resistant vs. Impact/Pierce")
                                    + "<br />"
                                    + loc('chart_help_text_fortified', "<img class='tooltip-icon' src='hud/img/icons/Fortified.png'/> Fort is resistant vs. Pierce")
                                    + "<br />"
                                    + loc('chart_help_text_arcane', "<img class='tooltip-icon' src='hud/img/icons/Arcane.png'/> Arc is resistant vs. Magic")
                            }
                        })
                    ),
                    React.createElement('div', { className: 'title' }, loc('chart_types_label', "Attack Effectiveness")),
                    React.createElement('div', { className: 'content' },
                        React.createElement('img', {
                            className: 'attack-types-grid',
                            src: 'hud/img/guide/attack-types-grid-v3.png',
                            style: {
                                //width: '100%',
                                pointerEvents: 'none',
                            }
                        }),
                        React.createElement('div', {
                            className: 'attack-type',
                            style: { position: 'absolute', top: '85px', left: '4px', }
                        },
                            locName('ImpactAttack', 'Impact')
                        ),
                        React.createElement('div', {
                            className: 'attack-type',
                            style: { position: 'absolute', top: '108px', left: '4px', }
                        },
                            locName('PierceAttack', 'Pierce')
                        ),
                        React.createElement('div', {
                            className: 'attack-type',
                            style: { position: 'absolute', top: '131px', left: '4px', }
                        },
                            locName('MagicAttack', 'Magic')
                        ),
                        React.createElement('div', {
                            className: 'attack-type',
                            style: { position: 'absolute', top: '153px', left: '4px', }
                        },
                            locName('PureAttack', 'Pure')
                        ),
                        React.createElement('div', {
                            className: 'armor-type',
                            style: { position: 'absolute', top: '48px', left: '100px', }
                        },
                            locName('SwiftArmor', 'Swift')
                        ),
                        React.createElement('div', {
                            className: 'armor-type',
                            style: { position: 'absolute', top: '48px', left: '146px', }
                        },
                            locName('NaturalArmor', 'Natural')
                        ),
                        React.createElement('div', {
                            className: 'armor-type',
                            style: { position: 'absolute', top: '48px', left: '192px', }
                        },
                            locName('FortifiedArmor', 'Fortified')
                        ),
                        React.createElement('div', {
                            className: 'armor-type',
                            style: { position: 'absolute', top: '48px', left: '238px', }
                        },
                            locName('ArcaneArmor', 'Arcane')
                        ),
                        React.createElement('div', {
                            className: 'armor-type',
                            style: { position: 'absolute', top: '48px', left: '284px', }
                        },
                            locName('ImmaterialArmor', 'Immaterial')
                        )
                    )
                )
            )
        )
    }
})

/* Guide book */

var GameGuideOverview = React.createClass({
    render: function () {
        return (
            React.createElement('div', { className: 'credits-menu game-guide-menu' },
                React.createElement('div', { className: 'category' }, "Game Overview"),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "Legion TD 2 is played by two teams of two."),
                    React.createElement('li', { className: '' }, "To win, you must defeat the opposing team's king before they defeat yours."),
                    React.createElement('li', { className: '' }, "From start to finish, a match lasts around 25 minutes.")
                ),
                React.createElement('div', { className: '' },
                    React.createElement('img', {
                        src: 'hud/img/guide/map.jpg',
                        className: 'media',
                    })
                )
            )
        )
    }
})

var GameGuideDeployFighters = React.createClass({
    render: function () {
        var parent = this
        return (
            React.createElement('div', { className: 'credits-menu game-guide-menu' },
                React.createElement('div', { className: 'category' }, "Deploy Fighters"),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "At night, you deploy fighters to defend your lane. Fighters can only be deployed in your own lane."),
                    React.createElement('li', { className: '' }, "Once deployed, fighters cannot be moved, so plan your formation carefully."),
                    React.createElement('li', { className: '' }, "To upgrade a fighter, select an already-deployed fighter.")
                ),
                React.createElement('div', { className: '' },
                    React.createElement('video', {
                        src: 'hud/videos/guide/DeployFighters.webm',
                        className: 'media',
                        muted: 'true', autoPlay: 'true', loop: 'true',
                        //ref: 'video',
                        //onMouseEnter: function () {
                        //    parent.refs.video.play()

                        //},
                        //onMouseLeave: function () {
                        //    parent.refs.video.pause()
                        //}
                    })
                )
            )
        )
    }
})

var GameGuideFightersComeAlive = React.createClass({
    render: function () {
        return (
            React.createElement('div', { className: 'credits-menu game-guide-menu' },
                React.createElement('div', { className: 'category' }, "Fighters Come Alive"),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "During the day, your fighters come to life and battle against enemies. Fighters move, attack, and cast spells automatically."),
                    React.createElement('li', { className: '' }, "You cannot deploy or upgrade fighters during the day."),
                    React.createElement('li', { className: '' }, "Even if your fighters die in battle, they return fully restored the following night.")
                ),
                React.createElement('div', { className: '' },
                    React.createElement('video', {
                        src: 'hud/videos/guide/FightersComeAlive.webm',
                        muted: 'true', autoPlay: 'true', loop: 'true',
                        className: 'media',
                    })
                )
            )
        )
    }
})

var GameGuideClearYourWaves = React.createClass({
    render: function () {
        return (
            React.createElement('div', { className: 'credits-menu game-guide-menu' },
                React.createElement('div', { className: 'category' }, "Clear Your Waves"),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "Enemy creatures spawn at the top of the lane and move downwards towards your fighters. Fighters move upwards to challenge them."),
                    React.createElement('li', { className: '' }, "If the enemy creatures win the battle (\"leaking\"), they attack your king."),
                    React.createElement('li', { className: '' }, "If your fighters win the battle (\"clearing\"), they teleport to the king to defend.")
                ),
                React.createElement('div', { className: '' },
                    React.createElement('video', {
                        src: 'hud/videos/guide/CreepsSpawning.webm',
                        muted: 'true', autoPlay: 'true', loop: 'true',
                        className: 'media',
                    })
                )
            )
        )
    }
})

var GameGuideAttackYourOpponents = React.createClass({
    render: function () {
        return (
            React.createElement('div', { className: 'credits-menu game-guide-menu' },
                React.createElement('div', { className: 'category' }, "Attack Your Opponents"),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "Hire mercenaries to attack your opponents. Mercenaries can be hired during the day or night."),
                    React.createElement('li', { className: '' }, "Mercenaries are always sent to attack your opponent at the start of the next day."),
                    React.createElement('li', { className: '' }, "Hiring mercenaries also increases your income, which is given to you at the start of each night.")
                ),
                React.createElement('div', { className: '' },
                    React.createElement('video', {
                        src: 'hud/videos/guide/HireMercenaries.webm',
                        muted: 'true', autoPlay: 'true', loop: 'true',
                        className: 'media',
                    })
                )
            )
        )
    }
})

var GameGuideManageResources = React.createClass({
    render: function () {
        return (
            React.createElement('div', { className: 'credits-menu game-guide-menu' },
                React.createElement('div', { className: 'category' }, "Manage Resources"),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "Gold is used to deploy fighters and train workers. Gold can be earned by clearing waves, incoming, and forcing opponents to leak."),
                    React.createElement('li', { className: '' }, "Supply limits how many fighters and workers you can have. Supply only matters when you hit the cap, in which case it can be upgraded."),
                    React.createElement('li', { className: '' }, "Mythium is used to hire mercenaries and upgrade supply. Mythium is harvested by workers.")
                ),
                React.createElement('div', { className: '' },
                    React.createElement('video', {
                        src: 'hud/videos/guide/TrainWorker.webm',
                        muted: 'true', autoPlay: 'true', loop: 'true',
                        className: 'media',
                    })
                )
            )
        )
    }
})

var GameGuideWinTheGame = React.createClass({
    render: function () {
        return (
            React.createElement('div', { className: 'credits-menu game-guide-menu' },
                React.createElement('div', { className: 'category' }, "Win The Game"),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "To win, you must defeat the opposing team's king before they defeat yours."),
                    React.createElement('li', { className: '' }, "By hiring mercenaries to attack your opponents, you can damage the enemy king."),
                    React.createElement('li', { className: '' }, "If their king takes too much damage, they will be defeated, and you will be victorious.")
                ),
                React.createElement('div', { className: '' },
                    React.createElement('video', {
                        src: 'hud/videos/guide/KingAttacked.webm',
                        muted: 'true', autoPlay: 'true', loop: 'true',
                        className: 'media',
                    })
                )
            )
        )
    }
})

var RatingsGuide = React.createClass({
    render: function () {
        return (
            React.createElement('div', { className: 'credits-menu game-guide-menu' },
                React.createElement('div', { className: 'category' }, "Ratings"),
                React.createElement('p', { className: '' },
                    "Legion TD 2 uses an Elo rating system. Your rating change at the end of each game is based on:"
                ),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "Your team rating"),
                    React.createElement('li', { className: '' }, "Their team rating"),
                    React.createElement('li', { className: '' }, "Whether you win or lose")
                ),
                React.createElement('p', {
                    dangerouslySetInnerHTML: {
                        __html: "Your rating increases if you win and decreases if you lose. The amount that your rating changes depends on the difference between your team rating and their team rating. The harder your opponent, the more your rating increases if you win and the less your rating decreases if you lose."
                    }
                }),
                React.createElement('p', {
                    dangerouslySetInnerHTML: {
                        __html: "We intentionally use an <em>outcome-based</em> (win/loss) rating system rather than a <em>performance-based</em> (value, income, leaks, etc.) rating system. An outcome-based system cannot be gamed, doesn't create sub-optimal incentives, accounts for intangibles such as positive attitude and teamwork, and properly rewards selfless players."
                    }
                }),
                React.createElement('p', {
                    dangerouslySetInnerHTML: {
                        __html: "Your <em>overall rating</em> is used for matchmaking and most achievements and rewards. <em>Legion-specific ratings</em> are for bragging rights and proof of expertise."
                    }
                }),
                React.createElement('p', {
                    dangerouslySetInnerHTML: {
                        __html: "<em>New player adjustments.</em>"
                    }
                }),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "If you are a new player with fewer than 10 games, your rating gain/loss will be 2x the standard amount. This helps new players and smurfs converge to their proper rating faster."),
                    React.createElement('li', { className: '' }, "If you are partied with a new player with fewer than 10 games, your rating gain/loss will be 0.5x the standard amount. This makes it less punishing to help introduce your friend to the game and also discourages players from smurf boosting."),
                    React.createElement('li', { className: '' }, "New players start at 1000 rating and automatically gain +20 rating per game for their first 10 Normal games, in addition to the standard rating gain/loss from winning/losing.")
                ),
                React.createElement('div', { className: 'category' }, "Matchmaking"),
                React.createElement('p', {
                    dangerouslySetInnerHTML: {
                        __html: "Legion TD 2 matchmakes games based on:"
                    }
                }),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "The fairness of teams (tries to find evenly-matched teams)"),
                    React.createElement('li', { className: '' }, "The rating differences of parties (tries to find closely-rated parties)"),
                    React.createElement('li', { className: '' }, "Time spent waiting in queue")
                ),
                React.createElement('p', {
                    dangerouslySetInnerHTML: {
                        __html: "The longer players wait, the more likely the matchmaker is to allow uneven games. Even if games are uneven, your rating change accounts for differences in skill."
                    }
                }),
                React.createElement('p', {
                    dangerouslySetInnerHTML: {
                        __html: "<em>Duo adjustment</em> accounts for communication and strategic advantages that partied players have."
                    }
                }),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "+40 rating (two 1200s duoing are treated as 1240)"),
                    React.createElement('li', { className: '' }, "Additionally, the highest rated member of the party is given extra weight when determining the average.")
                )
            )
        )
    }
})

var FairPlayGuide = React.createClass({
    render: function () {
        return (
            React.createElement('div', { className: 'credits-menu game-guide-menu' },
                React.createElement('div', { className: 'category' }, "FairPlay"),
                React.createElement('p', { className: '' },
                    "The FairPlay system discourages players from ruining games by punishing leaving, AFKing, griefing, or verbal abuse."
                ),
                React.createElement('div', { className: 'category' }, "Punishable Behavior"),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "Leaving a game early and not returning"),
                    React.createElement('li', { className: '' }, "Going AFK at the start of the game (Wave 1) or for 3 minutes"),
                    React.createElement('li', { className: '' }, "Intentionally trying to lose the game by selling fighters"),
                    React.createElement('li', { className: '' }, "Verbally abusing other players")
                ),
                React.createElement('div', { className: 'category' }, "Reporting other players"),
                React.createElement('p', { className: '' },
                    "Players are encouraged to report players that do any of the above. Though FairPlay can automatically detect some punishable behavior, it relies on player reports to be certain."
                ),
                React.createElement('ul', { className: '' },
                    React.createElement('li', {
                        dangerouslySetInnerHTML: {
                            __html: "To report a player, open the <em>Scoreboard (TAB)</em> in-game"
                        }
                    }),
                    React.createElement('li', { className: '' }, "Then, click the flag next to a player's name to file a report")
                ),
                React.createElement('div', { className: 'category' }, "Types of Punishments"),
                React.createElement('p', {
                    dangerouslySetInnerHTML: {
                        __html: "FairPlay punishments are meant to protect players, so they are short-term only"
                    }
                }),
                React.createElement('ul', { className: '' },
                    React.createElement('li', {
                        dangerouslySetInnerHTML: {
                            __html: "<em class='red'>Alert Level:</em> If you are in danger of being suspended or muted, your alert level will warn you ahead of time."
                        }
                    }),
                    React.createElement('li', {
                        dangerouslySetInnerHTML: {
                            __html: "<em class='red'>Suspension:</em> If you are frequently detected for punishable behavior, you may receive a 24 hour suspension."
                        }
                    }),
                    React.createElement('li', {
                        dangerouslySetInnerHTML: {
                            __html: "<em class='red'>Chat Mute:</em> If you are frequently reported for verbal abuse, you may be chat muted, which prevents you from chatting for 24 hours."
                        }
                    }),
                    React.createElement('li', {
                        dangerouslySetInnerHTML: {
                            __html: "If you were punished unfairly, it could be a bug in our system. Please make a post on the forums in the Help and Support section and we'll resolve it asap."
                        }
                    })
                )
            )
        )
    }
})

var CardsGuide = React.createClass({
    render: function () {
        return (
            React.createElement('div', { className: 'credits-menu game-guide-menu' },
                React.createElement('div', { className: 'category' }, "Cards"),
                React.createElement('p', { className: '' },
                    "Every enemy you kill, you have a small chance to find a rare collectible card. Cards have several uses: "
                ),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "Usable as an avatar"),
                    React.createElement('li', { className: '' }, "Adds to your collection value"),
                    React.createElement('li', { className: '' }, "Looks cool in your profile collection")
                ),
                React.createElement('div', { className: 'category' }, "Finding Cards"),
                React.createElement('p', { className: '' },
                    "If your Aqua Spirit kills a unit, you have a tiny chance to find an Aqua Spirit card."
                ),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, "Cards can be found in Normal and Casual games. They cannot be found in Play vs. AI games or Custom games."),
                    React.createElement('li', { className: '' }, "The drop rate is very low, so it may take hundreds of games to find a single card.")
                ),
                React.createElement('div', { className: '' },
                    React.createElement('img', {
                        src: 'hud/img/guide/findcard.jpg',
                        className: '',
                    })
                )
            )
        )
    }
})

var DamageTrackerWindow = React.createClass({
    getInitialState: function () {
        return {
            enabled: false,
            tracker: {},
            damageTrackerType: 0,
            hoveredIndex: -1,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshDamageTracker = function (tracker) {
            parent.setState({ tracker: tracker })
        }
        bindings.enableDamageTracker = function (enabled) {
            console.log('enableDamageTracker: ' + enabled)
            parent.setState({ enabled: enabled })
            engine.call('OnEnableDamageTracker', enabled)
        }
        bindings.toggleDamageTracker = function () {
            //parent.setState({ enabled: !parent.state.enabled })
            // v8.04 wait, we should go through enableGuideWaves so prefs actually update. DUH.
            engine.trigger('enableDamageTracker', !parent.state.enabled)
        }
    },
    render: function () {
        var parent = this

        globalState.isDamageTrackerOpen = this.state.enabled

        if (!this.state.enabled)
            return null

        var isNarrow = globalState.screenWidth < 1800
        var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160

        var customBarClass = ''
        switch (parent.state.damageTrackerType) {
            case 0:
                break
            case 1:
                customBarClass = 'damage-taken'
                break
            case 2:
                customBarClass = 'mercenary-damage'
                break
        }

        var defaultLeft = '-543px'
        var defaultTop = '322px'

        if (globalState.screenWidth == 3840 && globalState.screenHeight == 2160) {
            defaultLeft = '-1075px'
            defaultTop = '750px'
        } else if (globalState.screenWidth == 2560 && globalState.screenHeight == 1440) {
            defaultLeft = '-258px'
            defaultTop = '138px'
        } else if (globalState.screenWidth == 1920 && globalState.screenHeight == 1080) {
            defaultLeft = '-1508px'
            defaultTop = '-522px'
        } else if (globalState.screenWidth == 1920 && globalState.screenHeight == 1200) {
            defaultLeft = '-1508px'
            defaultTop = '-582px'
        } else if (globalState.screenWidth == 1440 && globalState.screenHeight == 900) {
            defaultLeft = '-312px'
            defaultTop = '266px'
        } else if (globalState.screenWidth == 1366 && globalState.screenHeight == 768) {
            defaultLeft = '-1345px'
            defaultTop = '-371px'
        } else {
            defaultLeft = '-1261px'
            defaultTop = '-355px'
        }

        var sortedList = parent.state.tracker.sortedListFighters
        if (parent.state.damageTrackerType == 2)
            sortedList = parent.state.tracker.sortedListMercenaries

        return (
            React.createElement(Module, { moduleId: 'damageTracker', width: 274, height: 175, defaultLeft: defaultLeft, defaultTop: defaultTop, defaultBottom: 'unset', defaultRight: 'unset', simple: true },
                React.createElement('div', {
                    className: 'guideWindow damageTracker'
                },
                    React.createElement('div', {
                        className: 'button x-button',
                        onMouseDown: function (e) {
                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness
                            if (e.nativeEvent.which == 3) return
                            engine.trigger('enableDamageTracker', false)
                        }
                    },
                        "X"
                    ),
                    parent.state.damageTrackerType == 0 && React.createElement('div', {
                        className: 'button x-button help-button',
                        onMouseDown: function (e) {
                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness
                            if (e.nativeEvent.which == 3) return
                            parent.setState({ damageTrackerType: 1 })
                            engine.call('OnSetDamageTrackerType', 1)
                        },
                        style: {
                            background: 'rgb(194, 99, 20)',
                            border: '1px solid rgb(239, 183, 136)'
                        }
                    },
                        React.createElement('img', { src: 'hud/img/small-icons/dps_tank_switch.png' })
                    ),
                    parent.state.damageTrackerType == 1 && React.createElement('div', {
                        className: 'button x-button help-button',
                        onMouseDown: function (e) {
                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness
                            if (e.nativeEvent.which == 3) return
                            parent.setState({ damageTrackerType: 2 })
                            engine.call('OnSetDamageTrackerType', 2)
                        },
                        style: {
                            background: 'rgb(115, 20, 194)',
                            border: '1px solid rgb(194, 131, 247)'
                        }
                    },
                        React.createElement('img', { src: 'hud/img/small-icons/dps_tank_switch.png' })
                    ),
                    parent.state.damageTrackerType == 2 && React.createElement('div', {
                        className: 'button x-button help-button',
                        onMouseDown: function (e) {
                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness
                            if (e.nativeEvent.which == 3) return
                            parent.setState({ damageTrackerType: 0 })
                            engine.call('OnSetDamageTrackerType', 0 )
                        }
                    },
                        React.createElement('img', { src: 'hud/img/small-icons/dps_tank_switch.png' })
                    ),

                    parent.state.damageTrackerType == 0 && React.createElement('div', { className: 'title' },
                        React.createElement('img', { src: 'hud/img/small-icons/role_dps.png' }),
                        loc('damage_dealt', "Damage Dealt")
                    ),
                    parent.state.damageTrackerType == 1 && React.createElement('div', { className: 'title' },
                        React.createElement('img', { src: 'hud/img/small-icons/role_tank.png' }),
                        loc('damage_taken', "Damage Taken")
                    ),
                    parent.state.damageTrackerType == 2 && React.createElement('div', { className: 'title' },
                        React.createElement('img', { src: 'hud/img/small-icons/mercenary_12.png' }),
                        loc('mercenary_damage', "Mercenary Damage")
                    ),
                    React.createElement('div', { className: 'content' },
                        React.createElement('table', {
                            ref: 'leaderboard', className: 'leaderboard scrollable',
                            style: {
                                width: 'calc(100% - 10px)',
                                margin: '5px',
                                display: 'block',
                                height: isNarrow ? '125px' : '169px',
                            }
                        },
                            React.createElement('tbody', { className: '' },
                                (sortedList == null || sortedList.length == 0) && React.createElement('div', {},
                                    React.createElement('tr', { className: 'damage-tracker-entry simple-tooltip' },
                                        React.createElement('td', { style: { padding: '16px 10px' } },
                                            loc('no_data', 'No Data')
                                        )
                                    )
                                ),
                                sortedList != null && sortedList.length > 0 && sortedList.map(function (rawEntry, index) {
                                    var unit = rawEntry.Key
                                    var entry = rawEntry.Value
                                    var stats = entry.value
                                    //console.log('entry: ' + JSON.stringify(entry))

                                    var valueToRender = 0
                                    switch (parent.state.damageTrackerType) {
                                        case 0:
                                            valueToRender = stats.damage
                                            break
                                        case 1:
                                            valueToRender = stats.damageTaken
                                            break
                                        case 2:
                                            valueToRender = stats.damage
                                            break
                                    }

                                    var barWidth = 0
                                    if (parent.state.tracker.maxValue > 0)
                                        barWidth = Math.max(1, Math.min(100, 100 * (valueToRender / parent.state.tracker.maxValue)))

                                    return (
                                        React.createElement('tr', {
                                            className: 'damage-tracker-entry simple-tooltip bar-container',
                                            onMouseEnter: function () {
                                                //console.log('onMouseEnter index: ' + index + ', unit: ' + unit)
                                                engine.call('OnDamageTrackerHoverUnit', unit, index)
                                                parent.setState({ hoveredIndex: index })
                                            },
                                            onMouseLeave: function () {
                                                engine.call('OnDamageTrackerUnhoverUnit', unit, index)
                                                parent.setState({ hoveredIndex: -1})
                                            },
                                            onMouseDown: function (e) {
                                                if (e.nativeEvent.which == 2) return // v2.22 fix
                                                engine.call('OnDamageTrackerClickUnit', unit, index)
                                            }
                                        },
                                            React.createElement('div', {
                                                className: "bar custom" + (parent.state.hoveredIndex == index ? ' hovered' : '')
                                                    + (customBarClass ? ' ' + customBarClass : '')
                                                    + (entry.dead ? ' dead' : '')
                                                , style: {
                                                    width: (barWidth + 1.5) + "%",
                                                }
                                            }),
                                            React.createElement('td', {},
                                                React.createElement('img', {
                                                    className: 'damage-tracker-image',
                                                    src: "hud/img/" + entry.icon
                                                })
                                            ),
                                            React.createElement('td', { className: 'damage-tracker-name' },
                                                React.createElement('span', {
                                                    dangerouslySetInnerHTML: {
                                                        __html: entry.unitName
                                                    }
                                                })
                                            ),
                                            React.createElement('td', { className: 'damage-tracker-value' },
                                                React.createElement('span', {}, valueToRender)
                                                //stats.damage <= 1000 && React.createElement('span', {}, valueToRender),
                                                //stats.damage > 1000 && React.createElement('span', {}, (valueToRender / 1000).toFixed(1) + 'k')
                                            )
                                        )
                                    )
                                })
                            )
                        )
                    )
                )
            )
        )
    }
})

// Menu button in the bottom right of the HUD
var EmoteButton = React.createClass({
    getInitialState: function () {
        return {
            enabled: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.setEmoteButtonEnabled = function (enabled) {
            parent.setState({ enabled: enabled })
        }
    },
    render: function () {
        var parent = this
        if (!parent.state.enabled) {
            return React.createElement('div', {
                style: {
                    display: 'block',
                    float: 'right',
                    height: '32px',
                    width: '32px',
                    margin: '6px 6px 6px 6px'
                }
            })
        }

        return (
            React.createElement('div', {
                className: 'hud-button simple-tooltip flipped',
                style: {
                    background: 'url(hud/img/small-icons/emote.png)',
                    backgroundSize: '32px',
                    float: 'right'
                },
                onMouseDown: function (e) {
                    //var left = e.nativeEvent.clientX - (324/2)
                    //var top = e.nativeEvent.clientY - (400/2)

                    // for now let's just do center of screen since it's too annoying to calculate left/top
                    // properly
                    var left = globalState.screenWidth / 2
                    var top = globalState.screenHeight / 2

                    //console.log('left: ' + left)
                    //console.log('top: ' + top)

                    engine.call('OnClickedEmoteHudButton')
                    engine.trigger('enableEmoteChooser', true, left, top, true)
                }
            },
                React.createElement('span', { className: 'tooltiptext auto no-carat', style: { right: '120%', bottom: '0' } },
                    loc('emotes', "Emotes"),
                    React.createElement('span', { style: { color: '#ffcc00' } }, ' (Shift+E)')
                )
            )
        )
    }
})