// Persistent in-game scoreboard (v3.15)
// =============================================================================================

var StackrankApp = React.createClass({
    hideEmotesAfterTick: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    getInitialState: function () {
        return {
            enabled: false,
            playerStackrank: [],
            emotes: ['', '', '', '', '', '', '', '', ''],
            animationTypes: ['', '', '', '', '', '', '', '', ''],
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshPlayerStackrank= function (playerStackrank) {
            parent.setState({ playerStackrank: playerStackrank })
        }
        bindings.enableStackrank = function (enabled) {
            parent.setState({ enabled: enabled })
        }
        bindings.toggleStackrank = function () {
            parent.setState({ enabled: !parent.state.enabled })
        }
        bindings.showEmote = function (rowNumber, emote, animationType) {
            if (rowNumber < 0 || rowNumber >= parent.state.emotes.length) {
                console.warn('showEmote invalid rowNumber: ' + rowNumber)
                return
            }
            if (rowNumber < 0 || rowNumber >= parent.hideEmotesAfterTick.length) {
                console.warn('showEmote invalid rowNumber: ' + rowNumber)
                return
            }

            //console.log('showEmote, rowNumber: ' + rowNumber + ', emote: ' + emote)

            // Autohide
            if (emote != null && emote != '') {
                parent.hideEmotesAfterTick[rowNumber] = Date.now() + 3 * 1000 - 100 // 100 just for some padding so we don't hit rounding errors
                setTimeout(function () {
                    if (Date.now() > parent.hideEmotesAfterTick[rowNumber])
                        bindings.showEmote(rowNumber, '')
                }, 3000)
            }

            // Update rendering/state
            parent.state.emotes[rowNumber] = emote
            parent.state.animationTypes[rowNumber] = animationType
            parent.setState({ emotes: parent.state.emotes })

            // Trigger reflow for animations: https://stackoverflow.com/questions/6268508/restart-animation-in-css3-any-better-way-than-removing-the-element
            parent.refs['emote' + rowNumber].style.animation = 'none'
            parent.refs['emote' + rowNumber].offsetHeight;
            parent.refs['emote' + rowNumber].style.animation = null
            parent.refs['emoteContainer' + rowNumber].style.animation = 'none'
            parent.refs['emoteContainer' + rowNumber].offsetHeight;
            parent.refs['emoteContainer' + rowNumber].style.animation = null

            parent.forceUpdate()
        }
    },
    render: function () {
        var parent = this
        var isNarrow = globalState.screenWidth < 1800

        // To force redraw once we actually have screenWidth
        if (!globalState.screenWidth || globalState.screenWidth == 0) return null

        var moduleWidth = 312
        var barWidth = 264
        var defaultLeft = '-302px'

        var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160

        if (uhd) {
            defaultLeft = '-390px'
        }

        var isClassic = globalState.matchmakerQueue == 'Classic' || globalState.matchmakerQueue == 'ClassicNoob'

        //console.log('v10.00.4 monitoring: render stackrank, isClassic: ' + isClassic + ', based on globalState.matchmakerQueue: ' + globalState.matchmakerQueue)

        return (
            // v6.02
            React.createElement(Module, { moduleId: 'stackrank', width: moduleWidth, height: 165, defaultLeft: defaultLeft, defaultTop: isNarrow ? '-66px' : '-88px', defaultBottom: '0', defaultRight: '12px' },
                React.createElement('div', { id: 'StackrankApp' },
                    React.createElement('div', { className: 'player-rows-container' + (parent.state.enabled ? '' : ' hidden-forced')},
                        parent.state.playerStackrank.map(function (playerRow, index) {
                            var fillWidth = playerRow.percent * barWidth

                            var isSelf = playerRow.clientOnlyExtras != null && playerRow.clientOnlyExtras["name"] == globalState.savedUsername
                            var useSmallerFont = playerRow.leakRatioFirstNumber >= 10 || playerRow.leakRatioSecondNumber >= 10

                            return React.createElement('div', {
                                key: playerRow.key,
                                className: 'player-row simple-tooltip',
                                onMouseDown: function (e) {
                                    if (e.nativeEvent.which == 3) {
                                        engine.call('OnRightClickPlayerStackrank', playerRow)
                                    }

                                    if (e.nativeEvent.which == 1) {
                                        engine.call('OnLeftClickPlayerStackrank', playerRow)
                                    }
                                },
                                style: {
                                    borderLeft: isSelf ? '4px solid #57bec2' : '4px solid #1e4545'
                                }
                            },
                                React.createElement('div', { className: 'content' },
                                    React.createElement('span', { className: getAvatarStacksClass(playerRow.avatarStacks) },
                                        React.createElement('img', { className: 'avatar', src: 'hud/img/' + playerRow.image })
                                    ),
                                    React.createElement('span', { className: 'name' },
                                        React.createElement('span', {
                                            className: 'player-name-only',
                                            dangerouslySetInnerHTML: {
                                                __html: playerRow.playerNameHtml
                                            }
                                        }),
                                        React.createElement('span', {
                                            className: 'guild-abbr',
                                            dangerouslySetInnerHTML: {
                                                __html: playerRow.guildAbbreviation
                                            }
                                        })
                                    )
                                ),
                                // OLD backup
                                //React.createElement('div', {
                                //    className: 'content',
                                //    dangerouslySetInnerHTML: {
                                //        __html: "<img class='avatar' src='hud/img/" + playerRow.image + "'/>"
                                //            + "<span class='name'>" + playerRow.playerNameHtml + "</span>"
                                //    }
                                //}),
                                React.createElement('div', { className: 'score' + (useSmallerFont ? ' smaller-font' : '') },
                                    playerRow.shutdownBounty > 0 && React.createElement('img', { src: 'hud/img/small-icons/fire.png', style: { position: 'relative' } }),
                                    nFormatter(playerRow.score, 1),
                                    React.createElement('span', { style: { color: '#dbbe64' } }, ' (' + playerRow.leakRatioFirstNumber + "/" + playerRow.leakRatioSecondNumber + ')')
                                ),
                                React.createElement('div', { className: 'score-bar-hitbox', style: { width: barWidth + 'px' } },
                                    React.createElement('div', { className: 'score-bar', style: { width: barWidth + 'px' } }),
                                    React.createElement('div', {
                                        className: 'score-bar fill', style: {
                                            width: fillWidth + 'px',
                                            backgroundColor: playerRow.color,
                                        }
                                    })
                                ),
                                //React.createElement('span', {
                                //    className: 'tooltiptext wide', style: {
                                //        marginBottom: isNarrow ? '' : '10px',
                                //        left: isNarrow ? '-232px' : 'unset',
                                //        bottom: isNarrow ? 'unset' : '',
                                //        height: isNarrow ? '200px' : 'unset',
                                //    }
                                //},
                                React.createElement('span', {
                                    className: 'tooltiptext no-carat', style: {
                                        left: '-304px',
                                        height: '256px', /* smelly that we have to set this manually... */
                                        /* leave a bit of extra room for localizations */
                                        top: '0',
                                        width: '272px'
                                    }
                                },
                                    React.createElement('div', {
                                        className: 'player-name-only',
                                        dangerouslySetInnerHTML: {
                                            __html: playerRow.playerNameHtml + " " + playerRow.partyDescriptor
                                        }
                                    }),
                                    React.createElement('div', { className: 'tagline' },
                                        playerRow.clientOnlyExtras["tagline"]
                                    ),
                                    React.createElement('div', {},
                                        loc('power_score', 'Power Score'), ': ',
                                        React.createElement('span', { style: { color: '#ffcc00' } }, nFormatter(playerRow.score, 1))
                                    ),
                                    playerRow.shutdownBounty > 0 && React.createElement('div', {},
                                        loc('shutdown_bounty', 'Shutdown Bounty'), ': ',
                                        React.createElement('img', { src: 'hud/img/small-icons/fire.png', style: { position: 'relative' } }),
                                        playerRow.shutdownBounty
                                    ),
                                    React.createElement('div', { dangerouslySetInnerHTML: { __html: loc('leak_ratio_first_number', 'This player caused 40%+ leaks on ' + playerRow.leakRatioFirstNumber + ' waves', [playerRow.leakRatioFirstNumber]) } }),
                                    React.createElement('div', { dangerouslySetInnerHTML: { __html: loc('leak_ratio_second_number', 'This player leaked 40%+ on ' + playerRow.leakRatioSecondNumber + ' waves', [playerRow.leakRatioSecondNumber]) } }),
                                    React.createElement('div', {},
                                        loc('rating', 'Rating'),
                                        ': ',
                                        React.createElement('img', { className: 'medium-icon', src: getRatingImage(playerRow.rating, isClassic) }),
                                        getRatingImage(playerRow.rating, isClassic) && React.createElement('span', { className: 'rating-numeral', style: { bottom: '4px', right: '8px' } }, getRatingDivisionNumeral(playerRow.rating, isClassic))
                                    ),
                                    ' ',
                                    React.createElement('div', { style: { color: '#999999', marginTop: '12px' } },
                                        loc('power_score_long', "Power Score is based off of your value, gold, gold spent on workers, income, and current mythium. It is updated at the beginning of each day.")
                                    )
                                ),
                                React.createElement('div', {
                                    style: { opacity: parent.state.emotes[playerRow.key].length > 0 ? 1 : 0 }
                                },
                                    React.createElement('div', { ref: 'emoteContainer' + playerRow.key, className: 'emote-image-container' },
                                        React.createElement('img', { ref: 'emote' + playerRow.key, className: 'emote-image ' + parent.state.animationTypes[playerRow.key], src: parent.state.emotes[playerRow.key] ? ('hud/img/' + parent.state.emotes[playerRow.key]) : '' })
                                    )
                                )
                            )
                        })
                    )
                )
            )
        )
    }
})