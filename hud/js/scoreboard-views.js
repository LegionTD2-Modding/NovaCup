// Tab scoreboard in-game
// ===============================================================================

var ScoreboardView = React.createClass({
    getInitialState: function () {
        return {
            enabled: false,
            scoreboardInfo: [],
            spectator: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.enableScoreboard = function (enabled) {
            if (enabled == parent.state.enabled) return

            parent.setState({ enabled: enabled })
            if (enabled)
                engine.trigger('autoscrollScoreboardEvents')

            console.log('OnScoreboardEnabled: ' + enabled)
            engine.call('OnScoreboardEnabled', enabled)
            //bindings.showAlliedFightersInScoreboard()
            engine.trigger('setEnemyFightersViewEnabled', false)
        }
        // v7.05 optimization let's make this a state actually
        //bindings.refreshScoreboard = function (scoreboardInfo, spectator) {
        //    parent.setState({
        //        scoreboardInfo: scoreboardInfo,
        //        spectator: spectator,
        //    })
        //}
        // This isn't really very useful since it will still have to rerender the full props
        //bindings.refreshScoreboardResourcesOnly = function (scoreboardInfoResourcesOnly) {
        //    console.log('refreshScoreboardResourcesOnly')

        //    parent.setState({ scoreboardInfoLite: scoreboardInfoResourcesOnly })

        //    //if (scoreboardInfoResourcesOnly.length != parent.state.scoreboardInfo.length) {
        //    //    console.warn('length mismatch!')
        //    //    console.warn('scoreboardInfoResourcesOnly.length: ' + scoreboardInfoResourcesOnly.length)
        //    //    console.warn('parent.state.scoreboardInfo.length: ' + parent.state.scoreboardInfo.length)
        //    //    return
        //    //}

        //    //for (var i = 0; i < parent.state.scoreboardInfo.length; i++) {
        //    //    var playerColumn = parent.state.scoreboardInfo[i]

        //    //    //console.log(playerColumn)
        //    //    playerColumn.gold = scoreboardInfoResourcesOnly[i].gold
        //    //    playerColumn.mythium = scoreboardInfoResourcesOnly[i].mythium
        //    //    playerColumn.income = scoreboardInfoResourcesOnly[i].income
        //    //    playerColumn.workers = scoreboardInfoResourcesOnly[i].workers
        //    //}
        //    //parent.forceUpdate()
        //}
    },
    render: function () {
        return (
            React.createElement('div', { id: 'ScoreboardView', className: (this.state.enabled ? '' : ' hidden') },
                React.createElement('div', { className: 'anchor1' }),
                React.createElement('div', { className: 'anchor2' }),
                React.createElement('div', { className: 'anchor3' }),
                React.createElement('div', { className: 'anchor4' }),
                React.createElement('div', { className: 'anchor5' }),
                React.createElement('div', { className: 'anchor6' }),
                React.createElement('div', { className: 'anchor7' }),
                React.createElement('div', { className: 'anchor8' }),
                React.createElement('div', { className: 'fullscreen' },
                    React.createElement('div', {
                        className: 'overlay cover', style: {
                            overflow: 'hidden' /* v1.23d: to prevent middle click scroll */
                        }
                    },
                        React.createElement(ScoreboardHeader, {}),
                        //React.createElement(ScoreboardMenu, {
                        //    id: 'ScoreboardMenu',
                        //    scoreboardInfo: this.state.scoreboardInfo,
                        //    spectator: this.state.spectator
                        //})
                        React.createElement(ScoreboardMenu, { id: 'ScoreboardMenu' })
                    )
                )
            )
        )
    }
})

var ScoreboardHeader = React.createClass({
    getInitialState: function () {
        return {
            timeElapsed: 0,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshTimeElapsed = function (seconds) {
            parent.setState({ timeElapsed: seconds })
        }
    },
    render: function () {
        return (
            React.createElement('div', {
                className: 'topbar',
                onMouseDown: function (event) {
                    engine.trigger('enableScoreboard', false)
                }
            },
                React.createElement('div', { className: 'title' },
                    React.createElement('div', {}, loc('legion_td_2', 'Legion TD 2') + ' (' + globalState.currentGameMode + ')')
                ),
                React.createElement('div', { className: 'subtitle' },
                    React.createElement('div', {}, loc('time_elapsed', 'Time') + ': ' + this.state.timeElapsed.toString().toTimeString())
                ),
                React.createElement('div', { className: 'helper' },
                    React.createElement('div', {}, loc('click_to_close', '(Click to close)'))
                )
            )
        )
    }
})

var ScoreboardMenu = React.createClass({
    propTypes: {
        scoreboardInfo: React.PropTypes.array,
        spectator: React.PropTypes.bool,
    },
    getInitialState: function () {
        return {
            scoreboardInfo: [],
            scoreboardInfoLite: [],
            spectator: false,
            enemyPlayers: [],
            mutedPlayers: [],
            pingMutedPlayers: [],
            showEnemyFighters: false
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshEnemyPlayers = function (players) {
            parent.setState({ enemyPlayers: players })
        }
        bindings.refreshMutedPlayers = function (players) {
            parent.setState({ mutedPlayers: players })
        }
        bindings.refreshPingMutedPlayers = function (players) {
            parent.setState({ pingMutedPlayers: players })
        }
        bindings.autoscrollScoreboardEvents = function () {
            parent.autoscroll()
        }
        bindings.updateGridUnitTooltip = function (updatedTooltip) {
            parent.setState({ tooltip: updatedTooltip })
        }
        bindings.setEnemyFightersViewEnabled = function (enabled) {
            parent.setState({ showEnemyFighters: enabled })
        }

        // v7.05 optimization let's make this a state actually in preparation for piece-wise updates
        bindings.refreshScoreboard = function (scoreboardInfo, spectator) {
            parent.setState({
                scoreboardInfo: scoreboardInfo,
                spectator: spectator,
            })
        }

        // v7.05 optimization - piecewise updates
        bindings.refreshScoreboardResourcesOnly = function (scoreboardInfoResourcesOnly) {
            parent.setState({
                scoreboardInfoLite: scoreboardInfoResourcesOnly
            })
        }
    },
    getNametag: function (player, isAlly) {
        var parent = this
        var playerName = player.name
        var isSelf = playerName == globalState.savedUsername
        var isMuted = parent.state.mutedPlayers.length > 0
            && _.includes(parent.state.mutedPlayers, playerName.toLowerCase())
        var isPingMuted = parent.state.pingMutedPlayers.length > 0
            && _.includes(parent.state.pingMutedPlayers, playerName.toLowerCase())
        var isDefender = player.attackerPlayerName == globalState.savedUsername
        var isAttacker = player.defenderPlayerName == globalState.savedUsername
        var isBot = _.startsWith(player.playFabId, '_bot') || player.playFabId == 'Blank'

        // Kinda smelly way to do this
        if (isSelf) {
            //console.log('isSelf --> refreshWindshieldDefender to: ' + player.defenderPlayerHtml)
            engine.trigger('refreshWindshieldDefender', player.defenderPlayerHtml)
        }
        
        //console.log('attackerPlayerName is: ' + player.attackerPlayerName)
        //console.log('defenderPlayerName is: ' + player.defenderPlayerName)
        //console.log('getNametag ' + player.number + ', name: ' + playerName + ', html: ' + player.html)
        //console.log(playerName + " is muted: " + isMuted)

        return (
            React.createElement('div', { key: player.number, style: { height: '29px' } },
                !globalState.isSpectatorMode && !isSelf && React.createElement('img', {
                    key: player.number + "mute",
                    src: isMuted ? 'hud/img/scoreboard/name-chat-muted.png' : 'hud/img/scoreboard/name-chat.png',
                    style: {
                        width: '1.5rem',
                        verticalAlign: 'bottom'
                    },
                    onMouseDown: function (event) {
                        console.log('toggle chat mute for ' + playerName)
                        engine.call('TogglePlayerMuted', playerName)
                    }
                }),
                !globalState.isSpectatorMode && !isSelf && React.createElement('img', {
                    key: player.number + "pingmute",
                    src: isPingMuted ? 'hud/img/scoreboard/ping-muted.png' : 'hud/img/scoreboard/ping.png',
                    style: {
                        width: '1.5rem',
                        verticalAlign: 'bottom'
                    },
                    onMouseDown: function (event) {
                        console.log('toggle ping mute for ' + playerName)
                        engine.call('TogglePingMutedPlayer', playerName)
                    }
                }),
                !globalState.isSpectatorMode && !isSelf && React.createElement('img', {
                    key: player.number + "report",
                    src: 'hud/img/scoreboard/report-flag.png',
                    style: {
                        width: '1.5rem',
                        marginRight: '6px',
                        verticalAlign: 'bottom'
                    },
                    onMouseDown: function (event) {
                        globalState.contextMenuTarget = player.playFabId
                        globalState.contextMenuDisplayTarget = playerName
                        engine.trigger('loadPopup', 'reportPlayer')
                    }
                }),
                React.createElement('span', {
                    key: player.number,
                    className: 'simple-tooltip',
                    onMouseDown: function (e) {
                        var left = e.nativeEvent.clientX
                        var top = e.nativeEvent.clientY

                        if (e.nativeEvent.which == 2) return // v2.22 fix

                        console.log("scoreboard click " + player.playFabId + " name: " + player.name)
                        var isBot = _.startsWith(player.playFabId, '_bot') || player.playFabId == 'Blank'
                        if (!isBot)
                            openContextMenu(player.playFabId, player.name, rightClickScoreboardNameMenu, left, top)
                    }
                },
                    React.createElement('span', {
                        className: 'name player-name',
                        dangerouslySetInnerHTML: {
                            __html: player.html
                            //+ '<span style="font-size: 1rem; vertical-align: middle; margin: 6px;">[' + player.number + ']</span>'
                            //+ (isAttacker ? ' [A]' : '')
                            //+ (isDefender ? ' [D]' : '')
                        },
                    })
                    //,
                    //!isAlly && React.createElement('span', {
                    //    className: 'tooltiptext',
                    //    style: {
                    //        fontSize: '1rem'
                    //    }
                    //},
                    //    React.createElement('span', {
                    //        dangerouslySetInnerHTML: {
                    //            __html: player.name + "'s mercenaries will attack " +
                    //                (isAttacker ? ' you' : player.defenderPlayerHtml)
                    //        }
                    //    })
                    //)
                )
            )
        )
    },
    createSentMercenariesBox: function (player) {
        var isSelf = player.name == globalState.savedUsername
        return React.createElement('div', {
            className: 'simple-tooltip section'
                + (player.summoned ? ' green' : '')
            , style: {
                borderBottom: '6px solid #' + (this.state.showEnemyFighters ? player.playerColor : player.defenderPlayerColor),
                display: 'block'
            }
        },
            React.createElement('div', {
                style: {
                    position: 'relative',
                    height: '72px',
                },
                onMouseDown: function (e) {
                    if (e.nativeEvent.which != 3) return
                    console.log("ping player " + player.number + " mercenaries")
                    engine.call("OnPingPlayerMercenaries", player.number)
                }
            },
                player.bottomBox.map(function (unit) {
                    return React.createElement('div', {
                        key: unit.key,
                        style: {
                            position: 'absolute',
                            left: (unit.index % 8) * 28,
                            top: (Math.floor(unit.index / 8)) * 28
                        }
                    },
                        unit.image && React.createElement('img', {
                            src: 'hud/img/' + unit.image,
                            height: '24px',
                            width: '24px',
                        }),
                        React.createElement('span', {
                            style: {
                                marginLeft: '-10px',
                                textShadow: '2px 1px black',
                            }
                        },
                            unit.amount
                        )
                    )
                })
            ),
            React.createElement('span', { className: 'tooltiptext' },
                isSelf && React.createElement('span', {
                    dangerouslySetInnerHTML: { __html: loc('your_mercenaries_will_attack', 'Your mercenaries will attack ' + player.defenderPlayerHtml, [player.defenderPlayerHtml]) }
                }),
                !isSelf && React.createElement('span', {
                    dangerouslySetInnerHTML: { __html: loc('player_mercenaries_will_attack', player.name + "'s mercenaries will attack " + player.defenderPlayerHtml, [player.name, player.defenderPlayerHtml]) }
                })
            )
        )
    },
    autoscroll: function () {
        var messages = this.refs.messages
        if (messages)
            messages.scrollTop = messages.scrollHeight
    },
    getTooltipElement: function (tower) {
        var tooltip = this.state.tooltip

        if (!tooltip)
            return null

        return React.createElement('div',
            {
                className: 'tooltiptext auto',
                style: { left: tower.x * 24 - 8, bottom: tower.y * 24 + 24 }
            },
            React.createElement('div', {},
                React.createElement('img', { className: 'tooltip-icon', style: { marginRight: '4px' }, src: 'hud/img/icons/' + tooltip.unitIcon + '.png' }),
                React.createElement('span', {}, tooltip.unit)
            ),
            React.createElement('div', {},
                React.createElement('img', { className: 'tooltip-icon', style: { marginRight: '4px' }, src: 'hud/img/icons/health.png' }),
                React.createElement('span', { style: { color: tooltip.currentHpPercent > 50 ? '#33ff33' : tooltip.currentHpPercent > 0.2 ? 'yellow' : 'red' } }, tooltip.currentHp),
                React.createElement('span', {}, '/' + tooltip.maxHp)
            ),
            tooltip.maxMana > 0 && React.createElement('div', {},
                React.createElement('img', { className: 'tooltip-icon', style: { marginRight: '4px' }, src: 'hud/img/icons/mana.png' }),
                React.createElement('span', {}, tooltip.currentMana),
                React.createElement('span', {}, '/' + tooltip.maxMana)
            ),
            React.createElement('div', {},
                React.createElement('img', { className: 'tooltip-icon', style: { marginRight: '4px' }, src: 'hud/img/icons/' + tooltip.attackType + '.png' }),
                React.createElement('span', { style: { color: tooltip.hasBonusDamage ? '#33ff33' : 'white' } }, tooltip.dpsText)
            ),
            React.createElement('div', {},
                React.createElement('img', { className: 'tooltip-icon', style: { marginRight: '4px' }, src: 'hud/img/icons/' + tooltip.defenseType + '.png' }),
                React.createElement('span', { style: { color: tooltip.dmgReduction ? '#33ff33' : 'white' } }, tooltip.dmgReduction + "%"),
                tooltip.flatDmgReduction > 0 && React.createElement('span', { style: { color: '#33ff33' } }, '+' + tooltip.flatDmgReduction)
            ),
            tooltip.killsThisRoundText && tooltip.killsThisRoundText.length > 0 && React.createElement('div', { style: { color: 'gray' } },
                React.createElement('span', {}, 'K: ' + tooltip.totalKills + ' (' + tooltip.killsThisRoundText + ')')
            ),
            tooltip.buffs.map(function (buff) {
                return React.createElement('span', {},
                    buff.stacks > 0 && React.createElement('span', {
                        style: {
                            position: 'absolute',
                            marginLeft: '0px',
                            marginTop: '3px',
                            textShadow: '2px 1px black',
                            zIndex: '1',
                        }
                    },
                        buff.stacks
                    ),
                    React.createElement('img', { className: 'icon tooltip-icon ' + buff.buffType, style: { marginRight: '3px' }, src: 'hud/img/' + buff.icon })
                )
            })
        )
    },
    render: function () {
        var parent = this
        var tooltip = parent.state.tooltip

        var hotkeyText = ' [<span style="color: #ffcc00">' + loc('spacebar', 'Space') + '</span>]'

        return (
            React.createElement('div', { className: 'centered-text overlay' }, // add no-background if we want to
                React.createElement('div', { className: 'centered-text-wrapper' },
                    React.createElement('div', { className: 'scoreboard billboards' },
                        React.createElement('ul', {
                            className: 'scrollable',
                            style: {
                                overflowX: 'auto',
                                whiteSpace: 'nowrap',
                                maxWidth: '100vw'
                            }
                        },
                            this.state.scoreboardInfo && this.state.scoreboardInfo.map(function (player, index) {

                                var scoreboardLitePlayer = player
                                if (parent.state.scoreboardInfoLite != null && parent.state.scoreboardInfoLite.length > index) {
                                    //console.log('tryna get index: ' + index)
                                    //console.log('parent.state.scoreboardInfoLite: ' + JSON.stringify(parent.state.scoreboardInfoLite))
                                    scoreboardLitePlayer = parent.state.scoreboardInfoLite[index]
                                }

                                var workerColor = '#33ff33'
                                if (player.mythiumGatherRate > 1)
                                    workerColor = '#33ffff'
                                //else if (player.mythiumGatherRate < 1)
                                else if (player.mythiumGatherRate < 0.80) // v7.00 for classic/ns mode tweak
                                    workerColor = '#ff3333'
                                var splashImage = player.image.replace("icons/", "splashes/")
                                splashImage = splashImage.replace("Icons/", "splashes/")
                                var isSelf = player.playFabId == globalState.playFabId
                                return React.createElement('div', {
                                    className: 'column' + (isSelf ? ' self' : '')
                                        + (parent.state.showEnemyFighters ? ' enemy-view' : ' self-view'),
                                    key: player.key,
                                    style: {
                                        margin: parent.state.spectator ? '1vh 6px' : ''
                                    }
                                },
                                    React.createElement('span', {
                                        style: {
                                            fontSize: '20px' /* todo: vh once HUD is smarter about UHD stuff */
                                        }
                                    },
                                        parent.getNametag(player, true)
                                    ),
                                    parent.state.showEnemyFighters && parent.createSentMercenariesBox(player),
                                    parent.state.showEnemyFighters && React.createElement('div', {
                                        style: { color: '#' + player.defenderPlayerColor },
                                        dangerouslySetInnerHTML: { __html: player.defenderPlayerHtml }
                                    }),
                                    !parent.state.showEnemyFighters && React.createElement('div', {
                                        className: 'section blue content background',
                                        style: {
                                            background: "url('hud/img/" + splashImage + "')",
                                            //backgroundSize: 'cover', // doesn't work in-game for some reason
                                            //backgroundSize: '224px',
                                            //backgroundRepeat: 'no-repeat',
                                            width: '224px',
                                            height: player.selectedPowerupDescription ? '120px' : '100px',
                                            position: 'absolute',
                                            opacity: '1',
                                            zIndex: '-1',
                                        }
                                    }),
                                    !parent.state.showEnemyFighters && React.createElement('div', {
                                        className: 'section blue content player-resources',
                                    },
                                        React.createElement('div', {
                                            style: {
                                                padding: '0 12px',
                                                verticalAlign: 'top',
                                                margin: '4px',
                                                textAlign: 'left',
                                                height: (scoreboardLitePlayer.gold < 0) ? '118px' : ''
                                            },
                                        },
                                            React.createElement('div', { className: 'rolls', style: { textAlign: 'center' } },
                                                player.rolls && player.rolls.map(function (roll) {
                                                    return React.createElement('img', { key: roll, src: 'hud/img/' + roll, className: 'emoji-icon', style: {} })
                                                }),
                                                !player.rolls && React.createElement('div', { // spacer
                                                    style: {
                                                        height: '28px',
                                                    }
                                                })
                                            ),
                                            scoreboardLitePlayer.gold >= 0 && React.createElement('span', {
                                                className: 'simple-tooltip',
                                                style: {
                                                    color: '#ffcc00'
                                                },
                                                onMouseDown: function (e) {
                                                    if (e.nativeEvent.which != 3) return
                                                    console.log("ping player " + player.number + " gold")
                                                    engine.call("OnPingPlayerGold", player.number)
                                                }
                                            },
                                                React.createElement('img', { className: 'tooltip-icon ', style: { marginRight: '3px' }, src: 'hud/img/icons/Gold.png' }),
                                                React.createElement('span', { className: 'tooltiptext' }, loc('gold_used_for', 'Gold is used for deploying fighters')),
                                                React.createElement('span', { style: { marginRight: '3px' } }, scoreboardLitePlayer.gold)
                                            ),
                                            scoreboardLitePlayer.income > 0 && React.createElement('span', {
                                                className: 'simple-tooltip',
                                                style: {
                                                    color: '#33ff33'
                                                },
                                                onMouseDown: function (e) {
                                                    if (e.nativeEvent.which != 3) return
                                                    console.log("ping player " + player.number + " income")
                                                    engine.call("OnPingPlayerIncome", player.number)
                                                }
                                            },
                                                " " + loc('scoreboard_income', "(+" + scoreboardLitePlayer.income + " per wave)", [scoreboardLitePlayer.income]),
                                                React.createElement('span', { className: 'tooltiptext' }, loc('mouseover_income', "After each wave is cleared, you receive gold equal to your income."))
                                            ),
                                            scoreboardLitePlayer.mythium >= 0 && React.createElement('div', {},
                                                React.createElement('span', {
                                                    className: 'simple-tooltip',
                                                    style: {
                                                        color: '#33bbbb',
                                                    },
                                                    onMouseDown: function (e) {
                                                        if (e.nativeEvent.which != 3) return
                                                        console.log("ping player " + player.number + " mythium")
                                                        engine.call("OnPingPlayerMythium", player.number)
                                                    }
                                                },
                                                    React.createElement('img', { className: 'tooltip-icon ', style: { marginRight: '3px' }, src: 'hud/img/icons/Mythium.png' }),
                                                    React.createElement('span', { className: 'tooltiptext' }, loc('mythium_used_for', 'Mythium is used for hiring mercenaries')),
                                                    React.createElement('span', { style: { marginRight: '3px' } }, scoreboardLitePlayer.mythium)),
                                                React.createElement('span', {
                                                    className: 'simple-tooltip',
                                                    style: {
                                                        color: workerColor
                                                    },
                                                    onMouseDown: function (e) {
                                                        if (e.nativeEvent.which != 3) return
                                                        console.log("ping player " + player.number + " workers")
                                                        engine.call("OnPingPlayerWorkers", player.number)
                                                    }
                                                },
                                                    " " + loc('scoreboard_workers', "(+" + Math.round((scoreboardLitePlayer.workers * player.mythiumGatherRate) * 100) / 100 + " per " + player.workerInterval + " sec)",
                                                        [Math.round((scoreboardLitePlayer.workers * player.mythiumGatherRate) * 10) / 10, player.workerInterval]),
                                                    React.createElement('span', { className: 'tooltiptext' }, loc('mouseover_workers', "Train workers to passively earn mythium."))
                                                )
                                            ),
                                            //player.supply >= 0 && React.createElement('div', {},
                                            //    React.createElement('span', {
                                            //        className: 'simple-tooltip',
                                            //        style: {
                                            //            color: '#ff8800',
                                            //        },
                                            //        onMouseDown: function (e) {
                                            //            if (e.nativeEvent.which != 3) return
                                            //            console.log("ping player " + player.number + " supply")
                                            //            engine.call("OnPingPlayerSupply", player.number)
                                            //        }
                                            //    },
                                            //        React.createElement('img', { className: 'tooltip-icon ', style: { marginRight: '3px' }, src: 'hud/img/icons/Supply.png' }),
                                            //        React.createElement('span', { className: 'tooltiptext' }, loc('supply_used_for', 'Your supply cap limits how many fighters you can deploy')),
                                            //        player.supply + "/" + player.supplyCap
                                            //    )
                                            //),
                                            React.createElement('div', {
                                                className: 'simple-tooltip',
                                                style: {
                                                    color: '#cccccc',
                                                    display: 'inline-block'
                                                },
                                                onMouseDown: function (e) {
                                                    if (e.nativeEvent.which != 3) return
                                                    console.log("ping player " + player.number + " value")
                                                    engine.call("OnPingPlayerValue", player.number)
                                                }
                                            },
                                                React.createElement('img', { className: 'tooltip-icon ', style: { marginRight: '3px' }, src: 'hud/img/icons/Value.png' }),
                                                React.createElement('span', { className: 'tooltiptext' }, loc('mouseover_value', "Your value is the sum of your fighter's gold values.")),
                                                React.createElement('span', {
                                                    dangerouslySetInnerHTML: {
                                                        __html: player.value + ' (' + player.valueDeltaString + ')'
                                                    }
                                                })
                                            ),
                                            player.selectedPowerupDescription && React.createElement('div', {},
                                                React.createElement('span', {
                                                    className: 'simple-tooltip',
                                                    style: {
                                                        color: '#d9de7c'
                                                    },
                                                    onMouseDown: function (e) {
                                                        if (e.nativeEvent.which != 3) return
                                                        console.log('ping player ' + player.number + " legionspell")
                                                        engine.call("OnPingPlayerPowerup", player.number)

                                                    }
                                                },
                                                    React.createElement('span', { className: 'tooltiptext' },
                                                        React.createElement('span', {
                                                            dangerouslySetInnerHTML: {
                                                                __html: player.selectedPowerupTooltip
                                                            }
                                                        })
                                                    ),
                                                    React.createElement('img', { className: 'tooltip-icon', style: { marginRight: '3px' }, src: 'hud/img/' + player.selectedPowerupImage }),
                                                    React.createElement('span', {
                                                        dangerouslySetInnerHTML: {
                                                            __html: player.selectedPowerupDescription
                                                        }
                                                    })
                                                )
                                            )
                                        )
                                    ),
                                    React.createElement('div', {
                                        className: 'section', style: {
                                            position: 'relative',
                                            height: '360px',
                                            borderTop: parent.state.showEnemyFighters ? '6px solid #' + player.defenderPlayerColor : ''
                                        },
                                        onMouseDown: function (e) {
                                            if (e.nativeEvent.which == 1) {
                                                console.log("click player " + player.number + " towers")
                                                engine.call("OnClickPlayerTowers", player.number)
                                            } else if (e.nativeEvent.which == 3) {
                                                console.log("ping player " + player.number + " towers")
                                                engine.call("OnPingPlayerTowers", player.number)
                                            }

                                        }
                                    },
                                        React.createElement('div', { className: 'building-grid' }),
                                        player.grid.map(function (tower, index) {

                                            // Doesn't work for enemy unit which died
                                            //var hasTooltip = tooltip && (tooltip.unitId == tower.key)

                                            var hasTooltip = tooltip && (tooltip.index == index) && (tooltip.player == player.number)

                                            //if (tooltip) {
                                            //    console.log('hasTooltip: ' + hasTooltip + ' based on tooltip.index: ' + tooltip.index
                                            //        + ', and index: ' + index +', tower.image: ' + tower.image + ', player.number: ' + player.number)
                                            //}

                                            return tower.image && React.createElement('div', {
                                                className: 'simple-tooltip',
                                                style: { display: 'inline', position: 'static' },
                                                onMouseEnter: function () { engine.call('OnEnterHoverOverUnitIcon', tower.key, tower.unitType, index, player.number) },
                                                onMouseLeave: function () { engine.call('OnExitHoverOverUnitIcon') }
                                            },
                                                React.createElement('img', {
                                                    key: tower.key,
                                                    src: 'hud/img/' + tower.image,
                                                    height: tower.powerup ? '22px' : '24px',
                                                    width: tower.powerup ? '22px' : '24px',
                                                    className: (tower.tint == '' ? ''
                                                        : tower.tint == 'gray' ? 'grayed-out' :
                                                            tower.tint == 'red' ? 'tint-red'
                                                                : tower.tint == 'yellow' ? 'tint-yellow' : '')
                                                        + (tower.powerup ? ' powerup' : ''),
                                                    style: {
                                                        position: 'absolute',
                                                        left: tower.x * 24 - 8,
                                                        bottom: tower.y * 24
                                                    }
                                                }), tower.powerup && React.createElement('img', {
                                                    src: 'hud/img/' + tower.powerup,
                                                    height: '12px',
                                                    width: '12px',
                                                    style: {
                                                        position: 'absolute',
                                                        left: tower.x * 24 + 3,
                                                        bottom: tower.y * 24 + 1
                                                    }
                                                }),
                                                // v7.05.1 performance rewrite
                                                hasTooltip && parent.getTooltipElement(tower)
                                            )
                                        })
                                    ),
                                    player.mythium >= 0 && !parent.state.showEnemyFighters && parent.createSentMercenariesBox(player)
                                )
                            }),
                            !this.state.spectator && React.createElement('div', { className: 'column side' },
                                React.createElement('h1', {}, loc('enemy_team', "Enemy Team")),
                                this.state.enemyPlayers.map(function (player) {
                                    return parent.getNametag(player, false)
                                }),
                                React.createElement('div', {
                                    className: 'button normal',
                                    style: { marginTop: '16px' },
                                    onMouseDown: function (e) {
                                        engine.call('OnSwitchScoreboardShowEnemies')
                                        //parent.setState({ showEnemyFighters: !parent.state.showEnemyFighters })
                                    }
                                },
                                    React.createElement('span', {
                                        dangerouslySetInnerHTML: {
                                            __html: parent.state.showEnemyFighters ? loc('back', "Back") + hotkeyText : loc('enemy_team', "Enemy Team") + hotkeyText
                                        }
                                    })
                                ),
                                //React.createElement('h1', {}, "Match Info"),
                                //    React.createElement('div', {}, "Your Team"),
                                //    React.createElement('div', {}, "1440, 1572, 1125, 1601 (+17/-15)"),
                                //    React.createElement('div', {}, "vs."),
                                //    React.createElement('div', {}, "1440, 1572, 1125, 1601 (+15/-17)")
                                //,
                                React.createElement('h3', {}, loc('event_history', "Event History")),
                                //React.createElement('div', {},
                                //    React.createElement('div', {}, 
                                //        React.createElement('div', { className: 'checkbox-box inline'},
                                //            //React.createElement('img', { className: 'checkbox-icon', src: 'hud/img/ui/accept-check.png' }),
                                //            ""
                                //        ),
                                //        React.createElement('span', {}, "All")
                                //    ),
                                //    React.createElement('div', {}, 
                                //        React.createElement('div', { className: 'checkbox-box inline'},
                                //            //React.createElement('img', { className: 'checkbox-icon', src: 'hud/img/ui/accept-check.png' }),
                                //            ""
                                //        ),
                                //        React.createElement('span', {}, "Important")
                                //    )
                                //),
                                React.createElement('ul', { id: 'ScoreboardNotifications', className: 'scrollable', ref: 'messages' },
                                    globalState.savedFeedMessages.map(function (feedObject) {
                                        if (feedObject.header.length == 0) return null
                                        return React.createElement('li', {
                                            key: feedObject.key,
                                            className: 'feedMessage',
                                        },
                                            feedObject.image && React.createElement('img', {
                                                className: 'left-icon',
                                                src: 'hud/img/' + feedObject.image
                                            }),
                                            React.createElement('div', { className: 'text-container' },
                                                React.createElement('div', {
                                                    className: 'header',
                                                    dangerouslySetInnerHTML: { __html: feedObject.content }
                                                })
                                            )
                                        )
                                    })
                                )
                            )
                        )
                    )
                )
            )
        )
    }
})