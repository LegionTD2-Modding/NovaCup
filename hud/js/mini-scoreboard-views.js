// Mini scoreboard is in the bottom left in-game, shows your value/workers/mercs you are sending
// ===============================================================================

var MiniScoreboardApp = React.createClass({
    getInitialState: function () {
        return {
            playerScores: [],
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshPlayerScores = function (playerScores) {
            parent.setState({ playerScores: playerScores })
        }
    },
    convertToGoldNumber: function(amount) {
        if (amount > 0)
            return "<span style='color: #33ff33'>+" + amount + "</span>"
        else if (amount < 0)
            return "<span style='color: #ff3333'>" + amount + "</span>"
        else
            return "0"
    },
    convertToEnemyGoldNumber: function (amount) {
        if (amount > 0)
            return "<span style='color: #ff3333'>+" + amount + "</span>"
        else if (amount < 0)
            return "<span style='color: #33ff33'>" + amount + "</span>"
        else
            return "0"
    },
    render: function () {
        var parent = this

        var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160

        var mercenariesLimitIndex = 10
        if (globalState.screenWidth < 1900)
            mercenariesLimitIndex = 8
        if (globalState.screenWidth <= 1366)
            mercenariesLimitIndex = 5

        return (
            React.createElement('div', { id: 'MiniScoreboardApp' },
                React.createElement('div', { className: 'player-rows-container' },
                    parent.state.playerScores.map(function (playerScore, index) {
                        return React.createElement('div', {
                            key: playerScore.key,
                            className: 'player-row simple-tooltip',
                            onMouseEnter: function () {
                                engine.call("OnMiniScoreboardEnabled", true)
                            },
                            onMouseLeave: function () {
                                engine.call("OnMiniScoreboardEnabled", false)
                            }
                        },
                            playerScore.legionIcon && React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/' + playerScore.legionIcon, style: { marginRight: '3px' } }),
                            React.createElement('span', {
                                className: 'content name',
                                dangerouslySetInnerHTML: {
                                    __html: playerScore.playerNameHtml
                                }
                            }),
                            React.createElement('img', { className: 'tooltip-icon', src: uhd ? 'hud/img/icons/Value32.png' : 'hud/img/icons/Value.png', style: { marginLeft: '3px' } }),
                            React.createElement('span', { style: { marginRight: '3px' } }, playerScore.value + ""),
                            React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Worker.png' }),
                            React.createElement('span', {}, playerScore.workers + " "),
                            React.createElement('span', { className: 'mercenaries' },
                                mercenariesLimitIndex > 0 && playerScore.mercenaries.map(function (mercenary, index) {
                                    // v9.05 to fix being too wide and overlapping UI
                                    if (index == mercenariesLimitIndex) {
                                        return React.createElement('span', {
                                            style: {
                                                verticalAlign: 'top'
                                            }
                                        },
                                            '...'
                                        )
                                    }
                                    if (index > mercenariesLimitIndex)
                                        return null

                                    return React.createElement('span', { key: mercenary.key },
                                        React.createElement('img', {
                                            src: 'hud/img/' + mercenary.image,
                                            height: '24px',
                                            width: '24px',
                                            style: {
                                                opacity: mercenary.queued ? '0.4' : '1.0',
                                            }
                                        }),
                                        React.createElement('span', {
                                            style: {
                                                marginLeft: '-10px',
                                                textShadow: '2px 1px black',
                                            }
                                        },
                                            mercenary.amount
                                        )
                                    )
                                })
                            ),
                            playerScore.autosend && React.createElement('span', { style: { marginLeft: '4px' } },
                                React.createElement('img', { className: 'autosend-check tooltip-icon', src: 'hud/img/ui/accept-check.png', style: { verticalAlign: 'center' }}),
                                React.createElement('span', { style: { marginLeft: '1px' }}, locName('autosend', 'AUTO'))
                            ),
                            //playerScore.autosend && React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/ , style: { marginLeft: '3px' }}),
                            React.createElement('span', { className: 'tooltiptext wider'},
                                React.createElement('div', {
                                    className: 'content',
                                    dangerouslySetInnerHTML: {
                                        __html: playerScore.playerNameHtml
                                    }
                                }),
                                React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: loc('fighter_value', 'Fighter Value') + ': ' + "<img class='tooltip-icon' src='hud/img/icons/Value.png'/> " + playerScore.value + "<br/>"
                                            + loc('workers', 'Workers') + ': ' + "<img class='tooltip-icon' src='hud/img/icons/Worker.png'/> " + playerScore.workers + "<br/>"
                                            + loc('mini_scoreboard_income', "Total from income: <img src='hud/img/icons/Gold.png'/>" + parent.convertToGoldNumber(playerScore.goldFromIncome) + "", [parent.convertToGoldNumber(playerScore.goldFromIncome)])
                                    }
                                }),
                                playerScore.fiestaGold > 0 && React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: locName('mastermind_variant_7', 'Fiesta') + ": <img class='tooltip-icon' src='hud/img/icons/Gold.png'/>" + parent.convertToGoldNumber(playerScore.fiestaGold)
                                    }
                                }),
                                playerScore.dwarfBankerGold > 0 && React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: locName('dwarf_banker_unit', 'Dwarf Banker') + ": <img class='tooltip-icon' src='hud/img/icons/Gold.png'/>" + parent.convertToGoldNumber(playerScore.dwarfBankerGold)
                                    }
                                }),
                                playerScore.chloropixieMythium > 0 && React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: locName('chloropixie_unit', 'Chloropixie') + ": <img class='tooltip-icon' src='hud/img/icons/Mythium.png'/>" + parent.convertToGoldNumber(playerScore.chloropixieMythium)
                                    }
                                }),
                                playerScore.perfectionistGold > 0 && React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: locName('mastermind_variant_12', 'Perfectionist') + ": <img class='tooltip-icon' src='hud/img/icons/Gold.png'/>" + parent.convertToGoldNumber(playerScore.perfectionistGold)
                                    }
                                }),
                                playerScore.bureaucratGold > 0 && React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: locName('mastermind_variant_13', 'Bureaucrat') + ": <img class='tooltip-icon' src='hud/img/icons/Gold.png'/>" + parent.convertToGoldNumber(playerScore.bureaucratGold)
                                    }
                                }),
                                //React.createElement('div', {
                                //    dangerouslySetInnerHTML: {
                                //        __html: "Total from enemy leaks: <img src='hud/img/icons/Gold.png'/>" + parent.convertToGoldNumber(playerScore.goldFromEnemyLeaks) + ""
                                //    }
                                //}),
                                React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: loc('mini_scoreboard_lost_to_leaks', "Total lost to leaks: <img src='hud/img/icons/Gold.png'/>" + parent.convertToGoldNumber(-playerScore.goldLostFromLeaks) + "", [parent.convertToGoldNumber(-playerScore.goldLostFromLeaks)])
                                    }
                                }),
                                React.createElement('div', {
                                    className: 'content',
                                    style: { color: '#ffcc00', marginTop: '6px' }},
                                    loc('team_stats', 'Team Stats')
                                ),
                                React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: loc('mini_scoreboard_your_team_gained', "Your team gained from enemy team leaks: <img src='hud/img/icons/Gold.png'/>" + parent.convertToGoldNumber(playerScore.teamGoldFromEnemyLeaks) + "", [parent.convertToGoldNumber(playerScore.teamGoldFromEnemyLeaks)])
                                    }
                                }),
                                React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: loc('mini_scoreboard_enemy_team_gained', "Enemy team gained from your team leaks: <img src='hud/img/icons/Gold.png'/>" + parent.convertToEnemyGoldNumber(playerScore.enemyTeamGoldFromYourLeaks) + "", [parent.convertToEnemyGoldNumber(playerScore.enemyTeamGoldFromYourLeaks)])
                                    }
                                })
                            )
                        )
                    })
                )
            )
        )
    }
})