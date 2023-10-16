// Spectator mode (in Custom games only atm)
// =============================================================================================

var SpectatorScoreboard = React.createClass({
    getInitialState: function() {
        return {
            viewIndex: 0,
            scoreboardInfo: {},
            leaks: {},
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshSpectatorScoreboard = function (scoreboardInfo) {
            parent.setState({
                scoreboardInfo: scoreboardInfo
            })
        }
        bindings.refreshSpectatorLeaks = function (leaks) {
            parent.setState({
                leaks: leaks,
            })
        }
        bindings.toggleSpectatorScoreboardView = function () {
            parent.cycleNextViewIndex()
        }
    },
    cycleNextViewIndex: function() {
        var nextViewIndex = this.state.viewIndex + 1
        if (nextViewIndex > 2)
            nextViewIndex = 0
        this.setState({ viewIndex: nextViewIndex})
    },
    render: function () {
        if (!globalState.isSpectatorMode) return null

        var parent = this
        var info = this.state.scoreboardInfo

        if (info.westRows == null || info.eastRows == null) return null

        //console.log("rendering spectator scoreboard with viewIndex: " + parent.state.viewIndex)

        var transformOverride = ''
        var marginBottomOverride = ''

        if (globalState.screenWidth == 2560 && globalState.screenHeight == 1440) {
            transformOverride = 'scale(1.4)'
            marginBottomOverride = '28px'
        }


        return React.createElement('div', {
            id: 'SpectatorScoreboard',
            style: {
                transform: transformOverride,
                marginBottom: marginBottomOverride
            }
        },
            React.createElement('div', { className: 'title' },
                React.createElement('div', {
                    className: 'change-view-button',
                    onMouseDown: function (e) {
                        parent.cycleNextViewIndex()
                    }
                },
                    React.createElement('span', {}, loc('change_view', "Change View")),
                    React.createElement('span', {}, " ("),
                    React.createElement('span', { style: { color: '#fff' }}, "Q"),
                    React.createElement('span', {}, ")"),
                    React.createElement('img', { src: 'hud/img/spectator/swap.png', style: { marginLeft: '6px' } })
                )
            ),
            React.createElement('table', {},
                React.createElement('table', { className: 'headers' },
                    this.state.viewIndex == 0 && React.createElement('tr', {},
                        //React.createElement('th', { className: 'column-name' }, React.createElement('img', { src: 'hud/img/spectator/PlayerIcon.png' })),
                        React.createElement('th', { className: 'column-name' }, ""),
                        React.createElement('th', { className: 'column-rolls column-rolls-slim' }, loc('fighters', "Fighters")),
                        React.createElement('th', { className: 'column-number' }, React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Mastermind.png' })),
                        React.createElement('th', { className: 'column-rolls column-rolls-slim' }, loc('opening', "Opening")),
                        //React.createElement('th', { className: 'column-rolls' }, loc('post_game_builds', "Builds")),
                        React.createElement('th', { className: 'column-number' }, React.createElement('img', { src: 'hud/img/icons/Gold.png' })),
                        React.createElement('th', { className: 'column-number' }, React.createElement('img', { src: 'hud/img/icons/Mythium.png' })),
                        //React.createElement('th', { className: 'column-number' }, React.createElement('img', { src: 'hud/img/icons/Supply.png' })),
                        React.createElement('th', { className: 'column-number' }, React.createElement('img', { src: 'hud/img/icons/Worker.png', className: 'tooltip-icon' })),
                        React.createElement('th', { className: 'column-number' }, React.createElement('img', { src: 'hud/img/icons/Income.png', className: 'tooltip-icon' })),
                        React.createElement('th', { className: 'column-wide-number' }, React.createElement('img', { src: 'hud/img/icons/Value32.png', className: 'tooltip-icon' })),
                        /*React.createElement('th', { className: 'column-number' }, React.createElement('img', { src: 'hud/img/small-icons/networth32.png', className: 'tooltip-icon' })),*/
                        React.createElement('th', { className: 'column-number' }, React.createElement('img', { src: 'hud/img/icons/Reroll.png', className: 'tooltip-icon' })),
                        React.createElement('th', { className: 'column-slightly-bigger-number' },
                            info.legionSpellChoices.map(function(legionSpell) {
                                return React.createElement('img', { key: legionSpell, src: 'hud/img/' + legionSpell, className: 'tooltip-icon' })
                            })
                        )
                        //React.createElement('th', { className: 'column-number' }, React.createElement('img', { src: 'hud/img/spectator/LegionSpell.png' }))
                    ),
                    this.state.viewIndex == 1 && React.createElement('tr', {},
                        //React.createElement('th', { className: 'column-name' }, React.createElement('img', { src: 'hud/img/spectator/PlayerIcon.png' })),
                        React.createElement('th', { className: 'column-name' }, ""),
                        React.createElement('th', { className: 'column-fancystat' }, loc('net_worth', "Net Worth")),
                        React.createElement('th', { className: 'column-fancystat' }, loc('lost_to_leaks', "Lost To Leaks")),
                        React.createElement('th', { className: 'column-fancystat' }, loc('gained_from_leaks', "Gained from Leaks")),
                        React.createElement('th', { className: 'column-fancystat' }, loc('leak_value', "Leak Value")),
                        React.createElement('th', { className: 'column-fancystat' }, loc('catch_value', "Catch Value")),
                        React.createElement('th', { className: 'column-fancystat' }, loc('total_mythium', "Total Mythium"))
                    )
                ),
                React.createElement('table', { className: 'team orange' },
                    this.state.viewIndex == 0 && info.westRows.map(function (row) {
                        //console.log('row.build: ' + JSON.stringify(row.build))
                        return React.createElement('tr', { key: row.key, className: 'player-row orange' },
                            React.createElement('td', { className: 'column-name name' },
                                React.createElement('span', { dangerouslySetInnerHTML: { __html: row.name } })
                            ),
                            React.createElement('td', { className: 'column-rolls column-rolls-slim' },
                                row.rolls.map(function(roll) {
                                     return React.createElement('img', { key: roll, src: 'hud/img/' + roll, className: 'tooltip-icon', style: {} })
                                })
                            ),
                            row.mastermindIcon !=  null && row.mastermindIcon.length > 0 && React.createElement('td', { className: 'column-number' }, React.createElement('img', { src: 'hud/img/' + row.mastermindIcon, className: 'tooltip-icon' })),
                            (row.mastermindIcon == null || row.mastermindIcon.length == 0) && React.createElement('td', { className: 'column-number' }, ""),
                            React.createElement('td', { className: 'column-rolls column-rolls-slim' },
                                row.opening && row.opening.map(function (entry) {
                                    if (entry.count == 0) return
                                    return React.createElement('div', { className: 'tower' },
                                        React.createElement('img', { key: entry.icon, src: entry.icon, className: 'tooltip-icon', style: {} }),
                                        React.createElement('span', { className: 'count' + (entry.count == 1 ? ' one' : '') }, entry.count)
                                    )
                                })
                            ),
                            //React.createElement('td', { className: 'column-rolls' },
                            //    row.build && row.build.map(function (entry) {
                            //        if (entry.count == 0) return
                            //        return React.createElement('div', { className: 'tower' },
                            //            React.createElement('img', { key: entry.icon, src: entry.icon, className: 'tooltip-icon', style: {} }),
                            //            React.createElement('span', { className: 'count' + (entry.count == 1 ? ' one' : '') }, entry.count)
                            //        )
                            //    })
                            //),
                            React.createElement('td', { className: 'column-number' }, row.gold),
                            React.createElement('td', { className: 'column-number' }, row.mythium),
                            //React.createElement('td', { className: 'column-number' }, row.supply + '/' + row.supplyCap),
                            React.createElement('td', { className: 'column-number' }, row.workers),
                            React.createElement('td', { className: 'column-number' }, row.income),
                            React.createElement('td', { className: 'column-wide-number' },
                                row.value,
                                React.createElement('span', {
                                    dangerouslySetInnerHTML: {
                                        __html: ' (' + row.valueDeltaString + ')'
                                    }
                                })
                            ),
                            //React.createElement('td', { className: 'column-number' }, row.netWorth),
                            React.createElement('td', { className: 'column-number' }, row.rerollsMax > 0 ? row.rerollsRemaining + '/' + row.rerollsMax : ''),
                            row.legionSpell.length > 0 && React.createElement('td', { className: 'column-slightly-bigger-number' }, React.createElement('img', { src: 'hud/img/' + row.legionSpell, className: 'tooltip-icon' })),
                            row.legionSpell.length == 0 && React.createElement('td', { className: 'column-slightly-bigger-number' }, "")
                        )
                    }),
                    this.state.viewIndex == 1 && info.westRows.map(function (row) {
                        return React.createElement('tr', { key: row.key, className: 'player-row orange' },
                            React.createElement('td', { className: 'column-name name' },
                                React.createElement('span', { dangerouslySetInnerHTML: { __html: row.name } })
                            ),
                            React.createElement('td', { className: 'column-fancystat' }, row.netWorth),
                            React.createElement('td', { className: 'column-fancystat' }, row.lostToLeaks),
                            React.createElement('td', { className: 'column-fancystat' }, row.gainedFromLeaks),
                            React.createElement('td', { className: 'column-fancystat' }, row.leakValue),
                            React.createElement('td', { className: 'column-fancystat' }, row.catchValue),
                            React.createElement('td', { className: 'column-fancystat' }, row.totalMythium)
                        )
                    })
                ),
                React.createElement('table', { className: 'team blue' },
                    this.state.viewIndex == 0 && info.eastRows.map(function (row) {
                        return React.createElement('tr', { key: row.key, className: 'player-row blue' },
                            React.createElement('td', { className: 'column-name name' },
                                React.createElement('span', { dangerouslySetInnerHTML: { __html: row.name } })
                            ),
                            React.createElement('td', { className: 'column-rolls column-rolls-slim' },
                                row.rolls.map(function (roll) {
                                    return React.createElement('img', { key: roll, src: 'hud/img/' + roll, className: 'tooltip-icon', style: {} })
                                })
                            ),
                            row.mastermindIcon != null && row.mastermindIcon.length > 0 && React.createElement('td', { className: 'column-number' }, React.createElement('img', { src: 'hud/img/' + row.mastermindIcon, className: 'tooltip-icon' })),
                            (row.mastermindIcon == null || row.mastermindIcon.length == 0) && React.createElement('td', { className: 'column-number' }, ""),
                            // SMELLY COPY AND PASTED
                            // SMELLY COPY AND PASTED
                            // SMELLY COPY AND PASTED
                            // SMELLY COPY AND PASTED
                            // SMELLY COPY AND PASTED
                            React.createElement('td', { className: 'column-rolls column-rolls-slim' },
                                row.opening && row.opening.map(function (entry) {
                                    if (entry.count == 0) return
                                    return React.createElement('div', { className: 'tower' },
                                        React.createElement('img', { key: entry.icon, src: entry.icon, className: 'tooltip-icon', style: {} }),
                                        React.createElement('span', { className: 'count' + (entry.count == 1 ? ' one' : '') }, entry.count)
                                    )
                                })
                            ),
                            //React.createElement('td', { className: 'column-rolls' },
                            //    row.build && row.build.map(function (entry) {
                            //        if (entry.count == 0) return
                            //        return React.createElement('div', { className: 'tower' },
                            //            React.createElement('img', { key: entry.icon, src: entry.icon, className: 'tooltip-icon', style: {} }),
                            //            React.createElement('span', { className: 'count' + (entry.count == 1 ? ' one' : '') }, entry.count)
                            //        )
                            //    })
                            //),
                            React.createElement('td', { className: 'column-number' }, row.gold),
                            React.createElement('td', { className: 'column-number' }, row.mythium),
                            //React.createElement('td', { className: 'column-number' }, row.supply + '/' + row.supplyCap),
                            React.createElement('td', { className: 'column-number' }, row.workers),
                            React.createElement('td', { className: 'column-number' }, row.income),
                            React.createElement('td', { className: 'column-wide-number' },
                                row.value,
                                React.createElement('span', {
                                    dangerouslySetInnerHTML: {
                                        __html: ' (' + row.valueDeltaString + ')'
                                    }
                                })
                            ),
                            //React.createElement('td', { className: 'column-number' }, row.netWorth),
                            React.createElement('td', { className: 'column-number' }, row.rerollsMax > 0 ? row.rerollsRemaining + '/' + row.rerollsMax : ''),
                            React.createElement('td', { className: 'column-slightly-bigger-number' }, row.legionSpell.length > 0 && React.createElement('img', { src: 'hud/img/' + row.legionSpell, className: 'tooltip-icon' }))
                        )
                    }),
                    this.state.viewIndex == 1 && info.eastRows.map(function (row) {
                        return React.createElement('tr', { key: row.key, className: 'player-row blue' },
                            React.createElement('td', { className: 'column-name name' },
                                React.createElement('span', { dangerouslySetInnerHTML: { __html: row.name } })
                            ),
                            React.createElement('td', { className: 'column-fancystat' }, row.netWorth),
                            React.createElement('td', { className: 'column-fancystat' }, row.lostToLeaks),
                            React.createElement('td', { className: 'column-fancystat' }, row.gainedFromLeaks),
                            React.createElement('td', { className: 'column-fancystat' }, row.leakValue),
                            React.createElement('td', { className: 'column-fancystat' }, row.catchValue),
                            React.createElement('td', { className: 'column-fancystat' }, row.totalMythium)
                        )
                    })
                ),
                this.state.viewIndex == 2 && React.createElement('div', {
                    className: 'player-leaks scrollable',
                    style: {
                        overflowX: this.state.leaks.players.length <= 4 ? 'hidden' : '',
                    }
                },
                    React.createElement('table', { className: 'leaks-table' },
                        React.createElement('thead', { className: '' },
                            React.createElement('tr', { className: 'leak-headers' },
                                React.createElement('th', { className: 'leak-header' }),
                                this.state.leaks.players.map(function(player) {
                                    return React.createElement('th', { className: 'leak-header' }, // top left corner
                                        React.createElement('span', { dangerouslySetInnerHTML: { __html: player.name } })
                                    )
                                })
                            )
                        ),
                        this.state.leaks.rows.map(function (row) {
                            return React.createElement('tr', { className: 'leak-row' },
                                React.createElement('td', { className: 'leak-label' },
                                    React.createElement('span', { dangerouslySetInnerHTML: { __html: row.label } })
                                ),
                                row.percents.map(function (percent) {
                                    var color = '#ffff33'
                                    if (percent >= 80)
                                        color = '#ff3333'
                                    else if (percent >= 40)
                                        color = '#ff8800'

                                    return React.createElement('td', { className: 'leak-value' },
                                        percent > 0 && React.createElement('span', { style: { color: color }}, percent + '%'),
                                        percent == 0 && React.createElement('img', { src: 'hud/img/ui/accept-check.png', style: { width: '16px' } }),
                                        percent < 0 && React.createElement('span', {}, "")
                                    )
                                })
                            )
                        })
                    )
                )
            )
        )
    }
})