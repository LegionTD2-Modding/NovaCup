// Legion select
// =============================================================================================

// SMELLY COPY AND PASTED CODE WITH BillboardView
var LegionSelectView = React.createClass({
    propTypes: {
        items: React.PropTypes.array.isRequired,
        disableBackButton: React.PropTypes.bool,
        narrow: React.PropTypes.bool,
    },
    getInitialState: function () {
        return {
            timerText: '',
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshLegionSelectTimer = function (timerText) {

            // Cosmetic: just hide it if it says 0, helpful for tutorial
            if (timerText == '0' || timerText == 0)
                timerText = ''

            parent.setState({ timerText: timerText })
        }
    },
    render: function () {

        //var hybridAndChaosLevelReqToSeeButton = 3
        //var hybridAndChaosLevelReqToSeeButton = 1
        //var hybridAndChaosLevelReq = 5
        //var ownedChaos = globalState.level >= hybridAndChaosLevelReq
        //var ownedChaos = globalState.accountUpgradeEnabled['unlock_chaos_item_id'] == true
        //var ownedHybrid = globalState.accountUpgradeEnabled['unlock_hybrid_item_id'] == true
        var ownedMastermind = globalState.level >= 2

        // I hate doing this, wish I could make the UI from scratch to be responsive...
        var bottomMargin = '80px'
        if (globalState.screenHeight < 900)
            bottomMargin = '50px'
        else if (globalState.screenHeight >= 900 && globalState.screenHeight < 1080)
            bottomMargin = '64px'
        else if (globalState.screenHeight == 1080)
            bottomMargin = '72px'
        else if (globalState.screenHeight == 1440)
            bottomMargin = '80px'
        else
            bottomMargin = '6vh'

        //var mastermindWidthOverride = ''
        //if (globalState.screenHeight <= 768)
        //    mastermindWidthOverride = '37vw'
        //else if (globalState.screenHeight <= 900)
        //    mastermindWidthOverride = '39vw'
        //else if (globalState.screenHeight <= 1080)
        //    mastermindWidthOverride = '41vw'
        //else if (globalState.screenHeight <= 1440)
        //    mastermindWidthOverride = '43vw'
        //else if (globalState.screenHeight <= 2160)
        //    mastermindWidthOverride = '45.5vw'
        //else
        //    mastermindWidthOverride = '47vw'

        // v9.00
        var mastermindWidthOverride = ''
        if (globalState.screenHeight <= 768)
            mastermindWidthOverride = '58vw'
        else if (globalState.screenHeight <= 900)
            mastermindWidthOverride = '58vw'
        else if (globalState.screenHeight <= 1080)
            mastermindWidthOverride = '58vw'
        else if (globalState.screenHeight <= 1440)
            mastermindWidthOverride = '58vw'
        else if (globalState.screenHeight <= 2160)
            mastermindWidthOverride = '58vw'
        else
            mastermindWidthOverride = '58vw'

        return (
            React.createElement('div', { id: 'LegionSelectView' },
                React.createElement('div', {
                    className: 'fullscreen',
                    onMouseDown: function (e) { // v1.50
                        engine.trigger('enableChat', false)
                    },
                    style: {
                        pointerEvents: 'all'
                    }
                },
                    React.createElement('div', {
                        className: 'timer',
                        dangerouslySetInnerHTML: { __html: this.state.timerText }
                    }),
                    React.createElement(BillboardMenu, this.props),
                    React.createElement('div', {
                        className: 'actions', style: {
                            bottom: bottomMargin
                        }},
                        globalState.forcePickLegionIndex == -1 && React.createElement('div', {
                            className: 'simple-tooltip ' + (ownedMastermind ? 'border-on-hover' : 'grayed-out'),
                            style: { margin: '10px 0 0 0', verticalAlign: 'bottom' }
                        },
                            React.createElement('div', {
                                className: 'mastermind',
                                style: { width: mastermindWidthOverride },
                                onMouseEnter: function () {
                                    engine.call("OnMouseOverHeavy", 4)
                                },
                                onMouseDown: function (e) {
                                    if (!ownedMastermind) return

                                    if (e.nativeEvent.which == 3) {
                                        engine.call('OnRightClickMenuButton', 'Mastermind')
                                    } else {
                                        engine.call('OnSelectLegion', 4)
                                    }
                                }
                            },
                                React.createElement('img', {
                                    className: 'button-icon ' + (ownedMastermind ? '' : 'grayed-out'),
                                    src: 'hud/img/icons/Mastermind.png',
                                    style: { verticalAlign: 'middle' }
                                }),
                                locName('mastermind_legion_id', 'Mastermind')
                            ),
                            ownedMastermind && React.createElement('span', { className: 'tooltiptext' },
                                loc('mastermind_legion_id', "Play with randomized fighters from each legion.")
                            ),
                            !ownedMastermind && React.createElement('span', { className: 'tooltiptext' },
                                loc('unlock_after_level', "Unlocked after level " + 2, [2])
                            )
                        )//,
                        // v9.00 now Hybrid is part of mastermind options
                        //globalState.forcePickLegionIndex == -1 && globalState.level >= hybridAndChaosLevelReqToSeeButton && React.createElement('div', {
                        //    className: 'simple-tooltip ' + (ownedHybrid ? 'border-on-hover' : 'grayed-out'),
                        //    style: { margin: '10px 10px 0 10px' }
                        //},
                        //    React.createElement('div', {
                        //        className: 'hybrid',
                        //        style: {
                        //            background: ownedHybrid ? 'linear-gradient(0deg, rgba(255,59,255,0.4) 0%, rgba(81,30,161,0.1) 100%)' : 'rgba(128, 128, 128, 0.5)'
                        //        },
                        //        onMouseEnter: function () {
                        //            engine.call("OnMouseOverHeavy", 5)
                        //        },
                        //        onMouseDown: function (e) {
                        //            if (!ownedHybrid) return

                        //            if (e.nativeEvent.which == 3) {
                        //                engine.call('OnRightClickMenuButton', 'Hybrid')
                        //            } else {
                        //                engine.trigger('test_SelectLegion')
                        //                engine.call('OnSelectLegion', -100)
                        //            }
                        //        }
                        //    },
                        //        React.createElement('img', {
                        //            className: 'button-icon ' + (ownedHybrid ? '' : 'grayed-out'),
                        //            src: 'hud/img/icons/Hybrid.png',
                        //            style: { verticalAlign: 'middle' }
                        //        }),
                        //        locName('hybrid_legion_id', 'Hybrid')
                        //    ),
                        //    ownedHybrid && React.createElement('span', {
                        //        className: 'tooltiptext',
                        //        dangerouslySetInnerHTML: {
                        //            __html: loc('hybrid_legion_id', "Every time you build a fighter, it is randomized.")
                        //        }
                        //    }),
                        //    !ownedHybrid && React.createElement('span', {
                        //        className: 'tooltiptext',
                        //        dangerouslySetInnerHTML: {
                        //            __html: loc('must_be_unlocked_from_shop', 'Must be unlocked from shop')
                        //        }
                        //    })
                        //),
                        //globalState.forcePickLegionIndex == -1 && globalState.level >= hybridAndChaosLevelReqToSeeButton && React.createElement('div', {
                        //    className: 'simple-tooltip ' + (ownedChaos ? 'border-on-hover' : 'grayed-out'),
                        //},
                        //    React.createElement('div', {
                        //        className: 'hybrid',
                        //        style: {
                        //            background: ownedChaos ? 'linear-gradient(0deg, rgba(254,23,59,0.4) 0%, rgba(146,29,40,0.1) 100%)' : 'rgba(128, 128, 128, 0.5)'
                        //        },
                        //        onMouseEnter: function () {
                        //            engine.call("OnMouseOverHeavy", 6)
                        //        },
                        //        onMouseDown: function (e) {
                        //            if (!ownedChaos) return

                        //            if (e.nativeEvent.which == 3) {
                        //                engine.call('OnRightClickMenuButton', 'Chaos')
                        //            } else {
                        //                engine.trigger('test_SelectLegion')
                        //                engine.call('OnSelectLegion', -200)
                        //            }
                        //        },
                        //    },
                        //        React.createElement('img', {
                        //            className: 'button-icon ' + (ownedChaos ? '' : 'grayed-out'),
                        //            src: 'hud/img/icons/Chaos.png',
                        //            style: { verticalAlign: 'middle' }
                        //        }),
                        //        locName('chaos_legion_id', 'Chaos')
                        //    ),
                        //    ownedChaos && React.createElement('span', {
                        //        className: 'tooltiptext',
                        //        dangerouslySetInnerHTML: {
                        //            __html: loc('chaos_legion_id', "Every wave, receive a new set of randomized fighters.")
                        //        }
                        //    }),
                        //    !ownedChaos && React.createElement('span', {
                        //        className: 'tooltiptext',
                        //        dangerouslySetInnerHTML: {
                        //            __html: loc('must_be_unlocked_from_shop', 'Must be unlocked from shop')
                        //        }
                        //    })
                        //)
                    )
                )
            )
        )
    }
})

// SMELLY COPY AND PASTED CODE WITH BillboardView
var MastermindVariantsView = React.createClass({
    propTypes: {
        items: React.PropTypes.array.isRequired,
        disableBackButton: React.PropTypes.bool,
        narrow: React.PropTypes.bool,
    },
    getInitialState: function () {
        return {
            timerText: '',
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshMastermindVariantsTimer = function (timerText) {

            // Cosmetic: just hide it if it says 0, helpful for tutorial
            if (timerText == '0' || timerText == 0)
                timerText = ''

            parent.setState({ timerText: timerText })
        }
    },
    render: function () {
        // I hate doing this, wish I could make the UI from scratch to be responsive...
        var bottomMargin = '240px'
        if (globalState.screenHeight < 900)
            bottomMargin = '150px'
        else if (globalState.screenHeight >= 900 && globalState.screenHeight < 1080)
            bottomMargin = '192px'
        else if (globalState.screenHeight == 1080)
            bottomMargin = '216px'
        else if (globalState.screenHeight == 1440)
            bottomMargin = '240px'
        else
            bottomMargin = '16vh'

        var isExtraWide = (globalState.screenWidth / globalState.screenHeight > 1.78)
        if (isExtraWide)
            bottomMargin = '12vh'

        return (
            React.createElement('div', { id: 'MastermindVariantsView' },
                React.createElement('div', {
                    className: 'fullscreen',
                    onMouseDown: function (e) { // v1.50
                        engine.trigger('enableChat', false)
                    },
                    style: {
                        pointerEvents: 'all'
                    }
                },
                    React.createElement('div', {
                        className: 'timer',
                        dangerouslySetInnerHTML: { __html: this.state.timerText }
                    }),
                    React.createElement(BillboardMenu, this.props),
                    React.createElement('div', {
                        className: 'actions', style: {
                            bottom: bottomMargin
                        }
                    },
                        this.props.items.length == 3 && React.createElement('div', { className: 'simple-tooltip' },
                            React.createElement('img', { style: { height: '2vh' }, src: 'hud/img/small-icons/help_bigger.png' }),
                            React.createElement('span', {
                                className: 'tooltiptext extra-wide',
                                dangerouslySetInnerHTML: {
                                    __html: loc('mastermind_playstyles_in_ranked', 'In Ranked, Lock-In and Greed are always available. The third playstyle is random every game, but it is the same for all players in a given game.')
                                }
                            })
                        )
                    )
                )
            )
        )
    }
})

// Smelly :( just needed right now because popups clear their state every time?
var savedPlayerStates = []
var savedSpecialModeIndex = -1
var savedTime = 0
var savedPickedStates = [false, false]
var timerLength = 15

var ModeVotingView = React.createClass({
    timerEndUtcTicks: 0,
    propTypes: {
        disableBackButton: React.PropTypes.bool,
    },
    getInitialState: function () {
        return {
            // Configured by server
            specialModeIndex: savedSpecialModeIndex,
            playerStates: savedPlayerStates,
            time: savedTime,
            pickedStates: savedPickedStates,

            // UI-only
            checkedStates: [0, 0],
            voted: false,
            active: true,
            done: false,
            yesVotes: [0, 0],
            noVotes: [0, 0]
        }
    },
    updateTimer: function () {
        var parent = this
        var timeRemaining = Math.max(timerEndUtcTicks - Date.now(), 0)
        parent.setState({ time: timeRemaining })
        savedTime = timeRemaining

        if (timeRemaining > 0 && parent.state.active) {
            setTimeout(function () {
                parent.updateTimer(timeRemaining)
            }, 50)
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.setModeVotingActive = function (active) {
            console.log('setModeVotingActive: ' + active)
            parent.setState({ active: active })

            if (active && parent.state.time > 0)
                bindings.refreshModeVotingTimer(parent.state.time)
        }
        bindings.refreshModeVotingTimer = function (time) {
            timerEndUtcTicks = Date.now() + (timerLength * 1000)
            parent.updateTimer()
            //parent.setState({ time: time })
            //savedTime = time
        }
        bindings.refreshModeVotingPlayerStates = function (playerStates) {
            console.log('refreshModeVotingPlayerStates')
            parent.setState({ playerStates: playerStates })
            savedPlayerStates = playerStates
        }
        bindings.refreshSpecialModeIndex = function (specialModeIndex) {
            console.log('refreshSpecialModeIndex: ' + specialModeIndex)
            parent.setState({ specialModeIndex: specialModeIndex })
            savedSpecialModeIndex = specialModeIndex
        }
        bindings.refreshModeCheckedState = function (modeIndex, checkedState) {
            console.log('refreshModeCheckedState[' + modeIndex + ']: ' + checkedState)
            if (modeIndex < 0 || modeIndex >= parent.state.checkedStates.length) {
                console.warn('bad index: ' + modeIndex)
                return
            }

            parent.state.checkedStates[modeIndex] = checkedState
            parent.setState({ checkedStates: parent.state.checkedStates })
        }
        bindings.refreshModePickedState = function (modeIndex, pickedState, yes, no, done) {
            console.log('refreshModePickedState[' + modeIndex + ']: ' + pickedState)
            if (modeIndex < 0 || modeIndex >= parent.state.checkedStates.length) {
                console.warn('bad index: ' + modeIndex)
                return
            }

            parent.state.pickedStates[modeIndex] = pickedState
            parent.state.yesVotes[modeIndex] = yes
            parent.state.noVotes[modeIndex] = no
            parent.setState({ done: done, pickedStates: parent.state.pickedStates, yesVotes: parent.state.yesVotes, noVotes: parent.state.noVotes })
            savedPickedStates = parent.state.pickedStates
        }
    },
    render: function () {
        var parent = this

        var timerPercent = (this.state.time / (timerLength * 1000))

        if (parent.state.specialModeIndex < 0) return null

        var classicModeImage = 'hud/img/icons/ClassicModes/' + parent.state.specialModeIndex + '.png'
        var classicModeName = locName('classic_special_mode_' + parent.state.specialModeIndex, 'Super Fiesta')
        var classicModeDescription = loc('classic_special_mode_' + parent.state.specialModeIndex, 'Super Fiesta')

        var notYetVoted = parent.state.checkedStates[0] == 0 || parent.state.checkedStates[1] == 0

        return (
            React.createElement('div', { id: 'ModeVotingView' },
                React.createElement('div', {
                    className: 'fullscreen',
                    onMouseDown: function (e) { // v1.50
                        engine.trigger('enableChat', false)
                    },
                    style: {
                        pointerEvents: 'all'
                    }
                },
                    React.createElement('div', { className: 'centered-text overlay' },
                        React.createElement('div', { className: 'centered-text-wrapper' },
                            React.createElement('div', { className: 'title' }, loc('vote_for_game_modes', 'Vote for Game Modes')),
                            React.createElement('div', { className: 'timer' },
                                React.createElement('div', { className: "progress-container" + (!parent.state.active ? ' inactive' : '') },
                                    React.createElement('div', {
                                        className: "progress-bar" + (notYetVoted && timerPercent <= 0.25 ? ' red' : ' slate'), style: {
                                            width: (100 * timerPercent) + "%"
                                        }
                                    })
                                )
                            ),
                            React.createElement('div', { className: 'column-container' },
                                React.createElement('div', { className: 'column player-names-left' },
                                    parent.state.playerStates.length > 0 && React.createElement(ModeVotingPlayer, { playerState: parent.state.playerStates[1]}),
                                    parent.state.playerStates.length > 0 && React.createElement(ModeVotingPlayer, { playerState: parent.state.playerStates[2]}),
                                    parent.state.playerStates.length > 0 && React.createElement(ModeVotingPlayer, { playerState: parent.state.playerStates[3]}),
                                    parent.state.playerStates.length > 0 && React.createElement(ModeVotingPlayer, { playerState: parent.state.playerStates[4]})
                                ),
                                React.createElement('div', { className: 'column middle' },
                                    React.createElement(ModeVotingMode, { index: 0, checkedState: parent.state.checkedStates[0], image: 'hud/img/icons/ClassicModes/IncomeAndChill.png', name: locName('income_and_chill', 'Income and Chill'), description: loc('income_and_chill', 'Autosending grants bonus gold'), voted: parent.state.voted && parent.state.active, picked: parent.state.pickedStates[0], yes: parent.state.yesVotes[0], no: parent.state.noVotes[0], done: parent.state.done }),
                                    parent.state.specialModeIndex >= 0 && React.createElement(ModeVotingMode, { index: 1, checkedState: parent.state.checkedStates[1], name: classicModeName, image: classicModeImage, description: classicModeDescription, voted: parent.state.voted && parent.state.active, picked: parent.state.pickedStates[1], yes: parent.state.yesVotes[1], no: parent.state.noVotes[1], done: parent.state.done })
                                ),
                                React.createElement('div', { className: 'column player-names-right' },
                                    parent.state.playerStates.length > 0 && React.createElement(ModeVotingPlayer, { playerState: parent.state.playerStates[5] }),
                                    parent.state.playerStates.length > 0 && React.createElement(ModeVotingPlayer, { playerState: parent.state.playerStates[6] }),
                                    parent.state.playerStates.length > 0 && React.createElement(ModeVotingPlayer, { playerState: parent.state.playerStates[7] }),
                                    parent.state.playerStates.length > 0 && React.createElement(ModeVotingPlayer, { playerState: parent.state.playerStates[8] })
                                )
                            )
                        )
                    )
                )
            )
        )
    }
})

var ModeVotingPlayer = React.createClass({
    propTypes: {
        playerState: React.PropTypes.object.isRequired
    },
    render: function () {
        var parent = this

        if (!this.props.playerState.enabled) return null

        return React.createElement('div', { className: 'player'
        },
            this.props.playerState.key >= 5 && !this.props.playerState.ready && React.createElement('img', { className: 'checkbox-icon', src: 'hud/img/ui/small-check-inactive.png' }),
            this.props.playerState.key >= 5 && this.props.playerState.ready && React.createElement('img', { className: 'checkbox-icon', src: 'hud/img/ui/small-check.png' }),
            React.createElement('div', { className: 'player-name', dangerouslySetInnerHTML: { __html: this.props.playerState.name } }),
            this.props.playerState.key <= 4 && !this.props.playerState.ready && React.createElement('img', { className: 'checkbox-icon', src: 'hud/img/ui/small-check-inactive.png' }),
            this.props.playerState.key <= 4 && this.props.playerState.ready && React.createElement('img', { className: 'checkbox-icon', src: 'hud/img/ui/small-check.png' })
        )
    }
})

// Old checkbox style: https://i.imgur.com/h6jBZYj.png
//var ModeVotingMode = React.createClass({
//    propTypes: {
//        index: React.PropTypes.number.isRequired,
//        checkedState: React.PropTypes.bool.isRequired,
//        image: React.PropTypes.string.isRequired,
//        description: React.PropTypes.string.isRequired,
//        clickable: React.PropTypes.bool.isRequired,
//        picked: React.PropTypes.bool.isRequired,
//        yes: React.PropTypes.num,
//        no: React.PropTypes.num,
//    },
//    render: function () {
//        var parent = this
//        return React.createElement('div', {
//            className: 'mode' + (this.props.clickable ? ' clickable' : '') + (this.props.picked ? ' picked' : '') + (this.props.index == 1 ? ' special' : ''), onMouseDown: function (e) {
//                if (!parent.props.clickable) return
//                engine.trigger('refreshModeCheckedState', parent.props.index, !parent.props.checkedState)
//            }
//        },
//            React.createElement('div', { className: 'checkbox-box' },
//                this.props.checkedState && React.createElement('img', { className: 'checkbox-icon', src: 'hud/img/ui/accept-check.png' })
//            ),
//            React.createElement('img', { className: 'mode-image', src: this.props.image }),
//            React.createElement('div', {
//                className: 'mode-description', dangerouslySetInnerHTML: {
//                    __html: this.props.description + ((this.props.yes + this.props.no > 0) ?
//                        '<div class="votes"><span class="yes-votes">' + this.props.yes + '</span>/<span class="no-votes">' + this.props.no + '</span></div>'
//                        : '')
//                }
//            })
//        )
//    }
//})

var ModeVotingMode = React.createClass({
    propTypes: {
        index: React.PropTypes.number.isRequired,
        image: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        description: React.PropTypes.string.isRequired,
        picked: React.PropTypes.bool.isRequired,
        yes: React.PropTypes.num,
        no: React.PropTypes.num,
        voted: React.PropTypes.bool.isRequired,
        done: React.PropTypes.bool.isRequired,
        // 0 = nothing selected, 1 = yes, 2 = no, 3 = skip
        checkedState: React.PropTypes.number.isRequired,
    },
    render: function () {
        var parent = this

        return React.createElement('div', {
            className: 'mode' + (this.props.index == 1 ? ' special' : '')
        },
            globalState.level <= 5 && this.props.index == 0 && React.createElement('div', { className: 'recommended' },
                loc('recommended', 'Recommended!')
            ),
            React.createElement('div', { className: 'mode-description-container' + (this.props.picked ? ' picked' : '') },
                React.createElement('img', { className: 'mode-image', src: this.props.image }),
                React.createElement('div', {
                    className: 'mode-description', dangerouslySetInnerHTML: {
                        __html: '<span style="color: #ffcc00">' + this.props.name + ':</span> ' + this.props.description
                    }
                })
            ),
            React.createElement('div', { className: 'vote-container'},
                this.props.done && React.createElement('div', {
                    dangerouslySetInnerHTML: {
                        __html: '<div class="votes"><span class="yes-votes">' + this.props.yes + '</span>/<span class="no-votes">' + this.props.no + '</span></div>'
                    }
                }),
                !this.props.done && React.createElement('div', {
                    className: 'vote-button yes' + (parent.props.checkedState == 1 ? ' selected' : ''),
                    onMouseEnter: function (e) {
                        engine.call("OnMouseOverMedium", 1)
                    },
                    onMouseDown: function (e) {
                        if (parent.props.checkedState == 1) return
                        engine.trigger('refreshModeCheckedState', parent.props.index, 1)
                    }
                }, React.createElement('img', { src: 'hud/img/ui/white-check-16.png' })),
                !this.props.done && React.createElement('div', {
                    className: 'vote-button no' + (parent.props.checkedState == 2 ? ' selected' : ''),
                    onMouseEnter: function (e) {
                        engine.call("OnMouseOverMedium", 2)
                    },
                    onMouseDown: function (e) {
                        if (parent.props.checkedState == 2) return
                        engine.trigger('refreshModeCheckedState', parent.props.index, 2)
                    }
                }, React.createElement('img', { src: 'hud/img/ui/white-x-16.png' })),
                !this.props.done && React.createElement('div', {
                    className: 'vote-button skip' + (parent.props.checkedState == 3 ? ' selected' : ''),
                    onMouseEnter: function (e) {
                        engine.call("OnMouseOverMedium", 3)
                    },
                    onMouseDown: function (e) {
                        if (parent.props.checkedState == 3) return
                        engine.trigger('refreshModeCheckedState', parent.props.index, 3)
                    }
                }, React.createElement('img', { src: 'hud/img/ui/white-dash-16.png' }))
            )
        )
    }
})