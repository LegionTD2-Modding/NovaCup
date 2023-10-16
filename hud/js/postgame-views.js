var PostGameOverview = React.createClass({
    getInitialState: function () {
        return {
            stats: globalState.postGameStats,
            mouseoverBottomSection: false,
            hideGameCoach: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshPostGameStats = function (stats) {
            parent.setState({ stats: stats })
        }

        // Testing
        if (!isUnityHost)
            engine.trigger('refreshPostGameStats', testPostGameStats)
    },
    render: function () {
        var parent = this
        var stats = this.state.stats
        var personal = this.state.stats.personal
        var leftTeamRows = this.state.stats.leftTeamRows
        var rightTeamRows = this.state.stats.rightTeamRows
        var showAllRatingChanges = this.state.stats.showAllRatingChanges
        var isClassic = this.state.stats.queueType == 'Classic' || this.state.stats.queueType == 'ClassicNoob'
        var isRanked = this.state.stats.queueType == 'Normal'

        var newRating = personal.rating + personal.ratingDelta
        var ratingImage = getRatingImage(newRating, isClassic)
        var goals = personal.goals
        var isCurrentGame = this.state.stats.isCurrentGame
        var ratingClass = getRatingClass(newRating, isClassic)

        var highestPowerScoreBothTeams = 0
        leftTeamRows.map(function (row, index) {
            if (row.powerScore > highestPowerScoreBothTeams)
                highestPowerScoreBothTeams = row.powerScore
        })
        rightTeamRows.map(function (row, index) {
            if (row.powerScore > highestPowerScoreBothTeams)
                highestPowerScoreBothTeams = row.powerScore
        })

        //console.log('v10.00.4 monitoring: render postgame, isClassic: ' + isClassic + ', based on globalState.matchmakerQueue: ' + globalState.matchmakerQueue
        //    + ', ratingImage: ' + ratingImage)

        return (
            React.createElement('div', { className: 'postgame-container scrollable' },
                React.createElement('div', { className: 'postgame-main' },
                    React.createElement('div', { className: 'avatar' },
                        React.createElement('img', { src: stats.image })
                    ),
                    React.createElement('div', { className: 'vitals' },
                        React.createElement('div', { className: 'gameresult' },
                            (personal.gameResult == 0) && React.createElement('div', { className: 'header victory' }, personal.gameResultText),
                            (personal.gameResult == 1) && React.createElement('div', { className: 'header defeat' }, personal.gameResultText),
                            (personal.gameResult == 2) && React.createElement('div', { className: 'header tie' }, personal.gameResultText),
                            React.createElement('div', { className: 'subtitle', dangerouslySetInnerHTML: { __html: stats.postGameResultDescription } })
                        )
                    ),
                    React.createElement('div', { className: 'rewards' },
                        React.createElement('div', { className: 'rating simple-tooltip' },
                            ratingImage && React.createElement('img', { src: ratingImage }),
                            getRatingImage(newRating, isClassic) && React.createElement('span', { className: 'rating-numeral', style: {} }, getRatingDivisionNumeral(newRating, isClassic)),
                            //React.createElement('span', { className: getRatingClass(personal.rating) },
                            //    (personal.rating + personal.ratingDelta)
                            //),
                            !isClassic && newRating,
                            (isClassic || (personal.ratingDelta < 0 && !showAllRatingChanges)) && React.createElement('div', { className: 'label' }, loc('new_rating', 'New Rating')),
                            !isClassic && (personal.ratingDelta >= 0 || showAllRatingChanges) && React.createElement('div', { className: 'label' }, loc('new_rating', 'New Rating'),
                                " (",
                                (personal.ratingDelta > 0) && React.createElement('span', { className: 'delta' },
                                    "+" + personal.ratingDelta
                                ),
                                (personal.ratingDelta < 0) && React.createElement('span', { className: 'delta negative' },
                                    personal.ratingDelta
                                ),
                                (personal.ratingDelta == 0) && React.createElement('span', { className: 'nodelta' },
                                    loc('no_change', 'No change')
                                ),
                                ")"),
                            React.createElement('span', {
                                className: 'tooltiptext auto no-carat',
                                style: {
                                    marginBottom: '-78px'
                                }
                            }, getLocalizedRankName(ratingClass, isClassic))
                        ),
                        isCurrentGame && !isClassic && globalState.rankedDisabledMessage == '' && React.createElement('div', { className: 'postgame-season-goals simple-tooltip flipped flipped-y' },
                            /* SMELLY COPY AND PASTED BETWEEN HERE AND PROFILE-VIEWS.JS */
                            React.createElement('span', { className: 'tooltiptext wide' },
                                React.createElement('div', {}, loc('season_goal', 'Season Goal'), ' ', 1, ': ',
                                    React.createElement('img', { className: 'goal-status', src: 'hud/img/goals/' + goals.goal1.status + '.png' }),
                                    React.createElement('span', { style: { marginLeft: '4px' }, dangerouslySetInnerHTML: { __html: goals.goal1.statusText } })
                                ),
                                React.createElement('div', {
                                    className: 'season-goal-objective' + (goals.goal1.status != 1 ? ' locked' : ''),
                                    dangerouslySetInnerHTML: {
                                        __html: loc('season_goal_objective', 'Achieve a rating of ' + goals.goal1.rating + ' by ' + goals.goal1.dateString + ' to earn ' + goals.goal1.rewardString, [goals.goal1.rating, goals.goal1.dateString, goals.goal1.rewardString])
                                    }
                                }),
                                React.createElement('div', { style: { marginTop: '10px' } }, loc('season_goal', 'Season Goal'), ' ', 2, ': ',
                                    React.createElement('img', { className: 'goal-status', src: 'hud/img/goals/' + goals.goal2.status + '.png' }),
                                    React.createElement('span', { style: { marginLeft: '4px' }, dangerouslySetInnerHTML: { __html: goals.goal2.statusText } })
                                ),
                                React.createElement('div', {
                                    className: 'season-goal-objective' + (goals.goal2.status != 1 ? ' locked' : ''),
                                    dangerouslySetInnerHTML: {
                                        __html: loc('season_goal_objective', 'Achieve a rating of ' + goals.goal2.rating + ' by ' + goals.goal2.dateString + ' to earn ' + goals.goal2.rewardString, [goals.goal2.rating, goals.goal2.dateString, goals.goal2.rewardString])
                                    }
                                }),
                                React.createElement('div', { style: { marginTop: '10px' } }, loc('season_goal', 'Season Goal'), ' ', 3, ': ',
                                    React.createElement('img', { className: 'goal-status', src: 'hud/img/goals/' + goals.goal3.status + '.png' }),
                                    React.createElement('span', { style: { marginLeft: '4px' }, dangerouslySetInnerHTML: { __html: goals.goal3.statusText } })
                                ),
                                React.createElement('div', {
                                    className: 'season-goal-objective' + (goals.goal3.status != 1 ? ' locked' : ''),
                                    dangerouslySetInnerHTML: {
                                        __html: loc('season_goal_objective', 'Achieve a rating of ' + goals.goal3.rating + ' by ' + goals.goal3.dateString + ' to earn ' + goals.goal3.rewardString, [goals.goal3.rating, goals.goal3.dateString, goals.goal3.rewardString])
                                    }
                                }),
                                goals.specialSkinText.length > 0 && React.createElement('div', {
                                    style: {
                                        marginTop: '10px'
                                    },
                                    dangerouslySetInnerHTML: {
                                        __html: goals.specialSkinText
                                    }
                                })
                            ),
                            React.createElement('img', { src: 'hud/img/goals/backer.png', className: 'season-goal-backer' }),
                            React.createElement('img', { src: 'hud/img/goals/' + goals.goal1.status + '.png', className: 'season-goal-1' }),
                            React.createElement('img', { src: 'hud/img/goals/' + goals.goal2.status + '.png', className: 'season-goal-2' }),
                            React.createElement('img', { src: 'hud/img/goals/' + goals.goal3.status + '.png', className: 'season-goal-3' })
                        ),
                        !isClassic && personal.ratingModifiersText && React.createElement('div', {
                            className: 'small-label',
                            dangerouslySetInnerHTML: {
                                __html: personal.ratingModifiersText
                            }
                        })
                    ),
                    React.createElement('div', { className: 'rewards' },
                        React.createElement('div', { className: 'rating' },
                            React.createElement('img', { src: 'hud/img/shop/currency/Essence_32.png' }),
                            isCurrentGame && globalState.currency,
                            !isCurrentGame && 'N/A'
                        ),
                        React.createElement('div', { className: 'label' }, loc('essence', 'Essence'),
                            Number(personal.currencyEarned) > 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'delta' }, "+" + personal.currencyEarned), ")"),
                            Number(personal.currencyEarned) == 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'nodelta' }, loc('no_change', "No change")), ")")
                        ),
                        personal.currencyBoostText && React.createElement('div', {
                            className: 'small-label',
                            dangerouslySetInnerHTML: {
                                __html: personal.currencyBoostText
                            }
                        })
                    ),
                    /* v10.00 for now since we don't actually store XP in match history, we should only show XP for current game */
                    isCurrentGame && React.createElement('div', { className: 'rewards' },
                        React.createElement('div', { className: 'xp' },
                            React.createElement(ProfileXp, { currentXp: personal.currentXp, maxXp: personal.maxXp, level: personal.level })
                        ),
                        React.createElement('div', {
                            className: 'label', style: { marginTop: '5px' }
                        }, loc('experience', 'Experience'),
                            Number(personal.xpGained) > 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'delta' }, "+" + personal.xpGained), ")"),
                            Number(personal.xpGained) == 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'nodelta' }, loc('no_change', "No change")), ")")
                        ),
                        personal.xpBoostText && React.createElement('div', {
                            className: 'small-label',
                            dangerouslySetInnerHTML: {
                                __html: personal.xpBoostText
                            }
                        })
                    ),
                    personal.guildXpEarned > 0 && React.createElement('div', { className: 'rewards' },
                        React.createElement('div', { className: 'rating' },
                            React.createElement('img', { src: 'hud/img/icons/Guild.png' })
                        ),
                        (globalState.guildWarActive || Number(personal.guildVpEarned) > 0) && React.createElement('div', { className: 'label', style: { color: '#ff8800' } }, loc('guild_vp', 'Guild VP'),
                            Number(personal.guildVpEarned) > 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'delta' }, "+" + personal.guildVpEarned), ")"),
                            Number(personal.guildVpEarned) == 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'nodelta' }, loc('no_change', "No change")), ")")
                        ),
                        React.createElement('div', { className: 'label' }, loc('guild_xp', 'Guild XP'),
                            React.createElement('span', {}, " (", React.createElement('span', { className: 'delta' }, "+" + personal.guildXpEarned), ")")
                        ),
                        React.createElement('div', {
                            className: 'small-label',
                            dangerouslySetInnerHTML: {
                                __html: personal.guildXpModifiersText
                            }
                        })
                    ),
                    personal.eventPointsGained != 0 && React.createElement('div', { className: 'rewards' },
                        React.createElement('div', { className: 'rating' },
                            React.createElement('img', { src: 'hud/img/icons/EventPoints.png' }),
                            personal.eventPoints
                        ),
                        React.createElement('div', { className: 'label' }, locName('event_points', 'Event Points'),
                            Number(personal.eventPointsGained) > 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'delta' }, "+" + personal.eventPointsGained), ")"),
                            Number(personal.eventPointsGained) == 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'nodelta' }, loc('no_change', "No change")), ")")//,
                            //Number(personal.eventPointsGained) < 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'delta negative' }, personal.eventPointsGained), ")")
                            // nvm let's not display negative, feelsbad
                        )
                    ),
                    isRanked && React.createElement('div', { className: 'rewards' },
                        React.createElement('div', { className: 'rating' },
                            React.createElement('img', { src: 'hud/img/icons/LadderPoints.png' }),
                            personal.lp
                        ),
                        React.createElement('div', { className: 'label' }, locName('ladder_points', 'Ladder Points'),
                            Number(personal.lpGained) > 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'delta' }, "+" + personal.lpGained), ")"),
                            Number(personal.lpGained) == 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'nodelta' }, loc('no_change', "No change")), ")")//,
                            //Number(personal.eventPointsGained) < 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'delta negative' }, personal.eventPointsGained), ")")
                            // nvm let's not display negative, feelsbad
                        ),
                        React.createElement('div', {
                            className: 'small-label'
                        },
                            loc('games_this_week', 'Games this week: ' + personal.lpGamesThisWeek + '/' + personal.lpGamesThisWeekMax,
                                [personal.lpGamesThisWeek, personal.lpGamesThisWeekMax])
                        )
                    ),
                    personal.mpGained != null && personal.mpGained != 0 && React.createElement('div', { className: 'rewards' },
                        React.createElement('div', { className: 'rating' },
                            React.createElement('div', { className: 'mastery-bar' },
                                React.createElement('img', { className: 'mastery-icon', src: 'hud/img/' + personal.mpOpeningIcon }),
                                React.createElement('div', {
                                    className: "progress-container simple-tooltip",
                                    style: { width: '80px', height: '14px', marginLeft: '25px' }
                                },
                                    React.createElement('div', {
                                        className: "progress-bar", style: {
                                            width: (100 * personal.mpProgress) + "%",
                                        }
                                    }),
                                    React.createElement('span', { className: 'value' },
                                        //personal.mpLevel
                                        React.createElement('img', { className: 'value-img', src: 'hud/img/icons/Mastery/40px/' + personal.mpLevel + '.png' })
                                    ),
                                    !personal.mpMaxed && React.createElement('span', { className: 'tooltiptext small' },
                                        React.createElement('div', {}, personal.mpProgressFirstNumber + "/" + personal.mpProgressSecondNumber + ' MP')
                                    )
                                )
                            )
                        ),
                        React.createElement('div', { className: 'label' },
                            React.createElement('div', { className: 'simple-tooltip flipped-y' },
                                React.createElement('span', {
                                    className: 'tooltiptext ultra-wide',
                                    dangerouslySetInnerHTML: {
                                        __html: loc('masteries', "Masteries show how much you love a specific opening, etc.")
                                    }
                                }),
                                locName('mastery_points', 'Mastery Points')
                            ),
                            personal.mpMaxed && React.createElement('span', {}, " (", React.createElement('span', {
                                className: 'delta',
                                dangerouslySetInnerHTML: {
                                    __html: loc('research_maxed', 'MAXED')
                                }
                            }), ")"),
                            !personal.mpMaxed && Number(personal.mpGained) > 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'delta' }, "+" + personal.mpGained), ")"),
                            !personal.mpMaxed && Number(personal.mpGained) == 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'nodelta' }, loc('no_change', "No change")), ")")//,
                        ),
                        React.createElement('div', {
                            className: 'small-label',
                            dangerouslySetInnerHTML: {
                                __html: personal.mpModifiersText
                            }
                        })
                    ),
                    React.createElement('div', { className: 'teams' },
                        //React.createElement('div', { className: 'postgame-masteries' },
                        //    React.createElement('img', { className: 'postgame-masteries-icon', src: 'hud/img/icons/Zeus.png '}),
                        //    React.createElement('div', { className: 'label' }, locName('mastery_points', 'Mastery Points'),
                        //        Number(personal.masteryPointsGained) > 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'delta' }, "+" + personal.masteryPointsGained), ")"),
                        //        Number(personal.masteryPointsGained) == 0 && React.createElement('span', {}, " (", React.createElement('span', { className: 'nodelta' }, loc('no_change', "No change")), ")")//,
                        //    )
                        //),
                        React.createElement(PostGameTeam, { name: 'leftTeam', teamRows: leftTeamRows, won: stats.postGameResult == 0, tied: stats.postGameResult == 2, isClassic: isClassic, highestPowerScoreBothTeams: highestPowerScoreBothTeams }),
                        React.createElement(PostGameTeam, { name: 'rightTeam', teamRows: rightTeamRows, won: stats.postGameResult == 1, tied: stats.postGameResult == 2, isClassic: isClassic, highestPowerScoreBothTeams: highestPowerScoreBothTeams })
                    ),
                    stats.gameId && React.createElement('div', { className: 'game-coach-container' },
                        React.createElement('div', {
                            className: 'game-id',
                            onMouseDown: function (e) {
                                if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                console.log('copy gameID to clipboard')
                                engine.call('OnCopyToClipboard', stats.gameId)
                            }
                        },
                            loc('game_id', "Game ID") + ": ",
                            React.createElement('img', { src: 'hud/img/small-icons/copy.png', className: 'tooltip-icon' }),
                            stats.gameId
                        ),
                        // No longer can hide game coach (v7.05)
                        //this.state.stats.localizedGameCoachMessage.length > 0 && parent.state.hideGameCoach && React.createElement('div', {
                        //    style: {
                        //        marginTop: '-16px', fontSize: '0.8rem'
                        //    }
                        //},
                        //    loc('you_can_hide_game_coach', 'Note: You can hide the Game Coach in Interface Options')
                        //),
                        this.state.stats.localizedGameCoachMessage.length > 0 && !parent.state.hideGameCoach && React.createElement('div', {
                            className: 'game-coach',
                            onMouseEnter: function (e) {
                                parent.setState({ mouseoverBottomSection: true })
                            },
                            onMouseLeave: function (e) {
                                parent.setState({ mouseoverBottomSection: false })
                            }
                        },
                            React.createElement('img', { src: 'hud/img/' + getGameCoachIcon() + '.png', className: 'game-coach-icon' }),
                            React.createElement('div', { className: 'game-coach-name' },
                                loc('game_coach', 'Game Coach')
                            ),
                            React.createElement('div', { className: 'game-coach-text' },
                                parent.state.mouseoverBottomSection && React.createElement('div', {
                                    className: 'game-coach-button',
                                    onMouseDown: function (e) {
                                        if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                        parent.setState({
                                            hideGameCoach: true
                                        })
                                    }
                                }, 'x'),
                                React.createElement('span', {
                                    dangerouslySetInnerHTML: {
                                        __html: this.state.stats.localizedGameCoachMessage
                                    }
                                })
                            )
                        )
                    )
                )
            )
        )
    }
})

var PostGameTeam = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        teamRows: React.PropTypes.array,
        won: React.PropTypes.bool,
        tied: React.PropTypes.bool,
        isClassic: React.PropTypes.bool,
        highestPowerScoreBothTeams: React.PropTypes.number
    },
    componentWillMount: function () {
        var parent = this
        bindings.forceRefreshPostgame[parent.props.name] = function () {
            console.log('forceRefreshPostgame ' + parent.props.name)
            parent.forceUpdate()
        }
    },
    componentDidMount: function () {
        var leaderboard = this.refs.leaderboard
        if (leaderboard != null) {
            sorttable.makeSortable(leaderboard);
            sorttable.innerSortFunction.apply(this.refs.defaultSortColumn, []);
        }
    },
    render: function () {
        var parent = this
        var teamRows = this.props.teamRows

        var playerCount = 0
        var sumNetWorth = 0
        var sumValue = 0
        var sumLeakPercentValue = 0
        var sumLeaks = 0
        var sumLeaksCaught = 0
        var sumWorkers = 0
        var sumIncome = 0
        var sumMythiumHarvested = 0
        var sumMythiumReceived = 0
        var sumRating = 0
        var sumScore = 0
        var sumLeakRatioFirstNumber = 0
        var sumLeakRatioSecondNumber = 0
        var sumPressureApplied = 0

        var highestNetWorth = 0
        var highestValue = 0
        var lowestLeaks = 9999
        var lowestLeakPercentValue = 9999
        var highestLeakRatio = -9999
        var highestLeaksCaught = 0
        var highestWorkers = 0
        var highestIncome = 0
        var highestMythiumHarvested = 0
        var highestMythiumReceived = 0
        var highestPressureApplied = 0
        var highestRating = 0
        var highestPowerScore = 0
        var highestMvpScore = -9999
        var mvpPlayerPowerScore = 0

        teamRows && teamRows.map(function (row, index) {
            playerCount++
            sumNetWorth += row.netWorth
            sumValue += row.value
            sumLeakPercentValue += row.leakPercentValue
            sumLeaks += row.leaks
            sumLeaksCaught += row.leaksCaught
            sumWorkers += row.workers
            sumIncome += row.income
            sumMythiumHarvested += row.totalMythium
            sumMythiumReceived += row.totalMythiumReceived
            sumPressureApplied += row.pressureApplied
            sumRating += row.rating
            sumScore += row.powerScore
            sumLeakRatioFirstNumber += row.leakRatioFirstNumber
            sumLeakRatioSecondNumber += row.leakRatioSecondNumber

            row.leakRatio = row.leakRatioFirstNumber - row.leakRatioSecondNumber // for sorting

            //console.log('Printing team row')
            //console.log(JSON.stringify(row))

            if (row.netWorth > highestNetWorth) highestNetWorth = row.netWorth
            if (row.value >= highestValue) highestValue = row.value
            if (row.leaks <= lowestLeaks) lowestLeaks = row.leaks
            if (row.leakPercentValue <= lowestLeakPercentValue) lowestLeakPercentValue = row.leakPercentValue
            if (row.leaksCaught >= highestLeaksCaught) highestLeaksCaught = row.leaksCaught
            if (row.workers >= highestWorkers) highestWorkers = row.workers
            if (row.income >= highestIncome) highestIncome = row.income
            if (row.totalMythium >= highestMythiumHarvested) highestMythiumHarvested = row.totalMythium
            if (row.totalMythiumReceived >= highestMythiumReceived) highestMythiumReceived = row.totalMythiumReceived
            if (row.pressureApplied >= highestPressureApplied) highestPressureApplied = row.pressureApplied
            if (row.rating >= highestRating) highestRating = row.rating
            if (row.powerScore >= highestPowerScore) highestPowerScore = row.powerScore
            if (row.mvpScore >= highestMvpScore) {
                highestMvpScore = row.mvpScore
                mvpPlayerPowerScore = row.powerScore
            }
            if (row.leakRatio >= highestLeakRatio) highestLeakRatio = row.leakRatio
        })

        var numGreens = {}
        teamRows && teamRows.map(function (row, index) {
            numGreens[row.number] = 0
        })

        teamRows && teamRows.map(function (row, index) {
            if (row.netWorth == highestNetWorth) numGreens[row.number] += 3.1 // break ties on net worth
            if (row.value == highestValue) numGreens[row.number] += 2
            if (row.leaks == lowestLeaks) numGreens[row.number] += 1
            if (row.leakPercentValue == lowestLeakPercentValue) numGreens[row.number] += 1
            if (row.leaksCaught == highestLeaksCaught) numGreens[row.number] += 1
            if (row.workers == highestWorkers) numGreens[row.number] += 1
            if (row.income == highestIncome) numGreens[row.number] += 1
            if (row.totalMythium == highestMythiumHarvested) numGreens[row.number] += 2
            if (row.totalMythiumReceived == highestMythiumReceived) numGreens[row.number] += 1
            if (row.pressureApplied == highestPressureApplied) numGreens[row.number] += 1
            if (row.leakRatio == highestLeakRatio) numGreens[row.number] += 1
            console.log("numGreens[" + row.number + "] = " + numGreens[row.number])
        })

        var mostGreens = 0
        teamRows && teamRows.map(function (row, index) {
            if (numGreens[row.number] >= mostGreens)
                mostGreens = numGreens[row.number]
        })

        var teamAverageRating = (sumRating / playerCount).toFixed(0)

        var isAlly = false
        teamRows && teamRows.map(function (row, index) {
            if (row.name == globalState.savedUsername) {
                isAlly = true
            }
        })

        var isClassic = this.props.isClassic
        var hideRatingColumn = isClassic // v9.00 for people who would complain about matchmaking in classic
        var isCurrentGame = globalState.currentView == 'postgame'
        
        return (
            React.createElement('div', { className: 'team' },
                React.createElement('div', { className: 'header' },
                    (!this.props.tied && this.props.won) && React.createElement('div', { className: 'victory' },
                        loc('victory', 'Victory!')
                        //React.createElement('img', { src: 'hud/img/icons/Guild.png', style: { height: '16px' } }),
                        //React.createElement('span', { style: { color: 'white', marginLeft: '-5px' } }, ' +10')
                    ),
                    (!this.props.tied && !this.props.won) && React.createElement('div', { className: 'defeat' }, loc('defeat', 'Defeat!')),
                    (this.props.tied) && React.createElement('div', { className: 'tie' }, loc('tie', 'Tie'))
                ),
                React.createElement('table', { ref: 'leaderboard', className: 'leaderboard sortable' },
                    React.createElement('thead', {},
                        React.createElement('tr', {},
                            React.createElement('td', { className: "column1", ref: 'defaultSortColumn' }, "#"),
                            React.createElement('td', { className: "column2" }, loc('name', 'Name')),
                            !hideRatingColumn && React.createElement('td', { style: { width: '45px' } }, loc('rating', 'Rating')),
                            (sumScore > 0) && React.createElement('td', { className: "column3" },
                                //React.createElement('img', { src: 'hud/img/icons/Gold.png', style: { height: '12px', padding: '0 2px 0 0' } }),
                                loc('power_score', "Power Score")),
                            //React.createElement('td', { className: "column3" },
                            //    //React.createElement('img', { src: 'hud/img/icons/Gold.png', style: { height: '12px', padding: '0 2px 0 0' } }),
                            //    loc('net_worth', "Net Worth")),
                            React.createElement('td', { className: "column4" },
                                //React.createElement('img', { src: 'hud/img/icons/Gold.png', style: { height: '12px', padding: '0 2px 0 0' } }),
                                loc('fighter_value', "Fighter Value")),
                            React.createElement('td', { className: "column5" },
                                //React.createElement('img', { src: 'hud/img/icons/Gold.png', style: { height: '12px', padding: '0 2px 0 0' } }),
                                locName('avg_leak', "Avg Leak")),
                            React.createElement('td', { className: "column5" },
                                //React.createElement('img', { src: 'hud/img/icons/Gold.png', style: { height: '12px', padding: '0 2px 0 0' } }),
                                locName('leak_ratio', "Leak Ratio")),
                            //React.createElement('td', { className: "column5" },
                            //    //React.createElement('img', { src: 'hud/img/icons/Gold.png', style: { height: '12px', padding: '0 2px 0 0' } }),
                            //    loc('leak_value', "Leak Value")),
                            React.createElement('td', { className: "column6" },
                                //React.createElement('img', { src: 'hud/img/icons/Gold.png', style: { height: '12px', padding: '0 2px 0 0' } }),
                                loc('catch_value', "% Caught")),
                            React.createElement('td', { className: "column7" },
                                //React.createElement('img', { src: 'hud/img/icons/Mythium.png', style: { height: '12px', padding: '0 2px 0 0' } }),
                                loc('workers', "Workers")),
                            React.createElement('td', { className: "column8" },
                                //React.createElement('img', { src: 'hud/img/icons/Mythium.png', style: { height: '12px', padding: '0 2px 0 0' } }),
                                loc('income', "Income")),
                            React.createElement('td', { className: "column9" },
                                //React.createElement('img', { src: 'hud/img/icons/Mythium.png', style: { height: '12px', padding: '0 2px 0 0' } }),
                                loc('mythium', "Mythium")),
                            //React.createElement('td', { className: "column9" },
                            //    //React.createElement('img', { src: 'hud/img/icons/Mythium.png', style: { height: '12px', padding: '0 2px 0 0' } }),
                            //    loc('mercenary_value_received', "Mercenaries Received")),
                            React.createElement('td', { className: "column3" },
                                loc('pressure_applied', "Pressure Applied")),
                            React.createElement('td', { className: "column10 unclickable" },
                                loc('spell', "Spell")),
                            React.createElement('td', { className: "column10 unclickable" },
                                loc('legion', "Legion")),
                            isCurrentGame && React.createElement('td', { className: "column11 unclickable" },
                                loc('rate', "Rate"))
                        )
                    ),
                    React.createElement('tbody', {},
                        teamRows && teamRows.map(function (row, index) {
                            var isSelf = row.name == globalState.savedUsername
                            var isBot = _.startsWith(row.playFabId, '_') || row.playFabId == 'Blank'
                            //var isBot = row.playFabId[0] == ("_")
                            //    || row.playFabId[0] == "bot_random_profile" || row.playFabId[0] == "Blank"
                            var isMvp = numGreens[row.number] == mostGreens

                            // v8.04.2: MVP is now given to the highest power score if the highest power score is at least 10%
                            // higher than the MVP's power score
                            var usePowerScoreMvpOverride = false // v8.06.2 disabled
                            //var usePowerScoreMvpOverride = mvpPlayerPowerScore / highestPowerScore < 0.90

                            // v1.55 mvpScore override
                            if (sumScore > 0) {
                                if (usePowerScoreMvpOverride)
                                    isMvp = row.powerScore == highestPowerScore
                                else
                                    isMvp = row.mvpScore == highestMvpScore
                            }

                            var isReportGrayedOut = isBot || isSelf || _.includes(globalState.reportedPlayers, row.playFabId)
                            var isThumbsUpGrayedOut = isBot || isSelf || _.includes(globalState.thumbsUpPlayers, row.playFabId)
                            var ratingClass = getRatingClass(row.rating, isClassic)

                            console.log('isAlly: ' + isAlly + ', row.number: ' + row.number)

                            return React.createElement('tr', { key: row.number, className: isSelf ? 'highlighted' : '' },
                                React.createElement('td', {},
                                    React.createElement('span', { className: 'hidden' }, row.number),
                                    row.number
                                ),
                                React.createElement('td', {
                                    onMouseDown: function (e) {
                                        var left = e.nativeEvent.clientX
                                        var top = e.nativeEvent.clientY

                                        if (e.nativeEvent.which == 2) return // v2.22 fix

                                        if (isSelf)
                                            openContextMenu(row.playFabId, row.name, rightClickPostGameNameSelfMenu, left, top)
                                        else if (isBot)
                                            openContextMenu(row.playFabId, row.name, rightClickPostGameNameBotMenu, left, top)
                                        else
                                            openContextMenu(row.playFabId, row.name, rightClickPostGameNameMenu, left, top)
                                    }
                                },
                                    React.createElement('span', { className: getAvatarStacksClass(row.imageStacks) },
                                        React.createElement('img', {
                                            src: row.image,
                                            style: {
                                                marginTop: (index == 0) ? '2px' : 0
                                            }
                                        })
                                    ),
                                    //React.createElement('img', { src: row.image }),
                                    row.countryCode && React.createElement('span', { className: 'simple-tooltip small flag-icon flag-icon-' + row.countryCode },
                                        React.createElement('span', { className: 'tooltiptext' }, row.countryName)
                                    ),
                                    row.countryCode && ' ',
                                    React.createElement('span', {
                                        className: 'postgame-name',
                                        dangerouslySetInnerHTML: {
                                            __html: row.displayName
                                        }
                                    }),
                                    row.guildAbbreviation && React.createElement('span', { className: 'guild-abbr' },
                                        row.guildAbbreviation
                                    ),
                                    isMvp && React.createElement('span', {
                                        className: 'simple-tooltip',
                                        style: {
                                            marginLeft: "3px"
                                        }
                                    },
                                        "[MVP]",
                                        React.createElement('span', {
                                            className: 'tooltiptext',
                                            dangerouslySetInnerHTML: {
                                                __html: row.renderedMvpTooltip
                                            }
                                        })
                                    ),
                                    row.reported && React.createElement('span', { className: 'simple-tooltip' },
                                        React.createElement('span', { style: { marginLeft: '3px', color: "#ffff00" } }, "[!]"),
                                        React.createElement('span', { className: 'tooltiptext' },
                                            loc('evaluated_by_fairplay', "This player is being evaluated by FairPlay.")
                                        )
                                    )
                                ),
                                !hideRatingColumn && React.createElement('td', {
                                    className: 'simple-tooltip',
                                    style: {
                                        display: 'block'
                                    }
                                },
                                    React.createElement('img', { src: getRatingImage(row.rating, isClassic) }),
                                    getRatingImage(row.rating, isClassic) && React.createElement('span', {
                                        className: 'rating-numeral', style: {
                                            right: '-24px', bottom: '16px', height: '0px', display: 'block'
                                        }
                                    }, getRatingDivisionNumeral(row.rating, isClassic)),
                                    React.createElement('span', { className: 'tooltiptext auto' }, getLocalizedRankName(ratingClass, isClassic))
                                    //,
                                    //React.createElement('span', { className: getRatingClass(row.rating) },
                                    //    row.rating
                                    //)
                                ),
                                (sumScore > 0) && React.createElement('td', {
                                    style: {
                                        //color: row.mvpScore == highestMvpScore ? '#c0f96e' : '',
                                        //fontWeight: row.mvpScore == highestMvpScore ? 'bold' : ''
                                    }
                                },
                                    React.createElement('div', {
                                        className: "progress-container",
                                        style: { width: '80px', height: '20px' }
                                    },
                                        React.createElement('div', {
                                            className: "progress-bar " + (row.powerScore == parent.props.highestPowerScoreBothTeams ? 'custom' : 'gray'), style: {
                                                width: (100 * row.powerScore / parent.props.highestPowerScoreBothTeams) + "%",
                                            }
                                        }),
                                        React.createElement('span', { className: 'value' }, row.powerScore),
                                        React.createElement('span', { className: 'hidden' }, row.powerScore) // for sorting
                                    )
                                ),
                                //React.createElement('td', {
                                //    style: {
                                //        color: row.netWorth == highestNetWorth ? '#c0f96e' : '',
                                //        fontWeight: row.netWorth == highestNetWorth ? 'bold' : '',
                                //    }
                                //},
                                //    row.netWorth
                                //),
                                React.createElement('td', {
                                    style: {
                                        color: row.value == highestValue ? '#c0f96e' : '',
                                        fontWeight: row.value == highestValue ? 'bold' : ''
                                    }
                                }, row.value),
                                React.createElement('td', {
                                    style: {
                                        color: row.leakPercentValue == lowestLeakPercentValue ? '#c0f96e' : '',
                                        fontWeight: row.leakPercentValue == lowestLeakPercentValue ? 'bold' : ''
                                    }
                                }, row.leakPercentValue.toFixed(1) + "%"),
                                React.createElement('td', {
                                    style: {
                                        color: row.leakRatio == highestLeakRatio ? '#c0f96e' : '',
                                        fontWeight: row.leakRatio == highestLeakRatio ? 'bold' : ''
                                    }
                                }, row.leakRatioFirstNumber + "/" + row.leakRatioSecondNumber),
                                //React.createElement('td', {
                                //    style: {
                                //        color: row.leaks == lowestLeaks ? '#c0f96e' : '',
                                //        fontWeight: row.leaks == lowestLeaks ? 'bold' : ''
                                //    }
                                //}, row.leaks),
                                React.createElement('td', {
                                    style: {
                                        color: row.leaksCaught == highestLeaksCaught ? '#c0f96e' : '',
                                        fontWeight: row.leaksCaught == highestLeaksCaught ? 'bold' : ''
                                    }
                                }, row.leaksCaught.toFixed(1) + "%"),
                                React.createElement('td', {
                                    style: {
                                        color: row.workers == highestWorkers ? '#c0f96e' : '',
                                        fontWeight: row.workers == highestWorkers ? 'bold' : ''
                                    }
                                }, row.workers),
                                React.createElement('td', {
                                    style: {
                                        color: row.income == highestIncome ? '#c0f96e' : '',
                                        fontWeight: row.income == highestIncome ? 'bold' : ''
                                    }
                                }, row.income),
                                React.createElement('td', {
                                    style: {
                                        color: row.totalMythium == highestMythiumHarvested ? '#c0f96e' : '',
                                        fontWeight: row.totalMythium == highestMythiumHarvested ? 'bold' : ''
                                    }
                                }, row.totalMythium),
                                //React.createElement('td', {
                                //    style: {
                                //        color: row.totalMythiumReceived == highestMythiumReceived ? '#c0f96e' : '',
                                //        fontWeight: row.totalMythiumReceived == highestMythiumReceived ? 'bold' : ''
                                //    }
                                //}, row.totalMythiumReceived),
                                React.createElement('td', {
                                    style: {
                                        color: row.pressureApplied == highestPressureApplied ? '#c0f96e' : '',
                                        fontWeight: row.pressureApplied == highestPressureApplied ? 'bold' : ''
                                    }
                                }, row.pressureApplied),
                                React.createElement('td', {
                                    style: {}
                                },
                                    row.spell != null && row.spell.length > 0 && React.createElement('span', {
                                        className: 'simple-tooltip flipped',
                                        style: { width: '32px' }
                                    },
                                        React.createElement('img', {
                                            className: 'postgame-spell',
                                            //src: 'hud/img/icons/' + (row.spell.replace(/\s/g, '')) + '.png',
                                            src: 'hud/img/' + row.spellIcon,
                                            style: {
                                                width: '16px',
                                                height: '16px'
                                            }
                                        }),
                                        React.createElement('span', { className: 'tooltiptext auto' }, row.spell)
                                    )
                                ),
                                React.createElement('td', {
                                    style: {}
                                },
                                    row.playstyle != null && row.playstyle.length > 0 && React.createElement('span', {
                                        className: 'simple-tooltip flipped',
                                        style: { width: '32px' }
                                    },
                                        React.createElement('img', {
                                            className: 'postgame-spell',
                                            src: 'hud/img/' + row.playstyleIcon,
                                            style: {
                                                width: '16px',
                                                height: '16px'
                                            }
                                        }),
                                        React.createElement('span', { className: 'tooltiptext auto' }, row.playstyle)
                                    )
                                ),
                                isCurrentGame && React.createElement('td', { },
                                    React.createElement('img', {
                                        className: 'postgame-rate-icon',
                                        src: 'hud/img/emotes/thumbs_up.png',
                                        style: {
                                            marginRight: '3px',
                                            WebkitFilter: isThumbsUpGrayedOut ? 'grayscale(1) brightness(50%)' : ''
                                        },
                                        onMouseDown: function () {
                                            console.log('thumbs up ' + row.name + ', ' + row.playFabId)

                                            if (isThumbsUpGrayedOut) return

                                            var isAlreadyThumbsUp = _.includes(globalState.thumbsUpPlayers, row.playFabId)
                                            if (isAlreadyThumbsUp) {
                                                // Not really worth loccing something specific for this imo
                                                //engine.trigger('loadPopupOk', loc('warning', 'Warning'), loc('cant_do_this_yet', "Can't do this yet"))
                                                return
                                            }
                                            globalState.thumbsUpPlayers.push(row.playFabId)
                                            parent.forceUpdate()

                                            engine.call('OnPostgameThumbsUp', row.name)
                                        }
                                    }),
                                    React.createElement('img', {
                                        className: 'postgame-rate-icon',
                                        src: 'hud/img/icons/Warning.png',
                                        style: {
                                            WebkitFilter: isReportGrayedOut ? 'grayscale(1) brightness(50%)' : ''
                                        },
                                        onMouseDown: function () {
                                            console.log('postgame report up ' + row.displayName + ', ' + row.playFabId)

                                            if (isReportGrayedOut) return

                                            var isAlreadyReported = _.includes(globalState.reportedPlayers, row.playFabId)
                                            if (isAlreadyReported) {
                                                // Not really worth loccing something specific for this imo
                                                engine.trigger('loadPopupOk', loc('warning', 'Warning'), loc('cant_do_this_yet', "Can't do this yet"))
                                                return
                                            }
                                            // SMELLY since this won't support the use-case if they go back without reporting
                                            //globalState.reportedPlayers.push(row.playFabId)
                                            parent.forceUpdate()

                                            // SMELLY
                                            globalState.contextMenuDisplayTarget = row.displayName
                                            globalState.contextMenuTarget = row.playFabId
                                            engine.trigger('loadPopup', 'reportplayerpostgame')
                                        }
                                    })
                                )
                            )
                        })
                    ),
                    React.createElement('tfoot', {},
                        React.createElement('tr', {},
                            React.createElement('td', { style: { color: "#ffcc00" } }, ""),
                            React.createElement('td', { style: { color: "#ffcc00" } }, loc('team_average', "Team Average")),
                            !hideRatingColumn && React.createElement('td', {
                                className: 'simple-tooltip',
                                style: {
                                    display: 'block'
                                }
                            },
                                React.createElement('img', { src: getRatingImage(teamAverageRating, isClassic) }),
                                React.createElement('span', { className: 'tooltiptext auto' }, getLocalizedRankName(getRatingClass(teamAverageRating, isClassic)))
                            ),
                            (sumScore > 0) && React.createElement('td', {}, (sumScore / playerCount).toFixed(0)),
                            //React.createElement('td', {}, (sumNetWorth / playerCount).toFixed(0)),
                            React.createElement('td', {}, (sumValue / playerCount).toFixed(0)),
                            React.createElement('td', {}, (sumLeakPercentValue / playerCount).toFixed(1) + "%"),
                            React.createElement('td', {}, (sumLeakRatioFirstNumber + "/" + sumLeakRatioSecondNumber)),
                            //React.createElement('td', {}, (sumLeaks / playerCount).toFixed(0)),
                            React.createElement('td', {}, (sumLeaksCaught / playerCount).toFixed(1) + "%"),
                            React.createElement('td', {}, (sumWorkers / playerCount).toFixed(0)),
                            React.createElement('td', {}, (sumIncome / playerCount).toFixed(0)),
                            React.createElement('td', {}, (sumMythiumHarvested / playerCount).toFixed(0)),
                            //React.createElement('td', {}, (sumMythiumReceived / playerCount).toFixed(0)),
                            React.createElement('td', {}, (sumPressureApplied / playerCount).toFixed(0)),
                            React.createElement('td', {}, ""),
                            React.createElement('td', {}, ""),
                            isCurrentGame && React.createElement('td', {}, "") // The "Rate" column spacer
                        )
                    )
                )
            )
        )
    }
})

var PostGameWaves = React.createClass({
    getInitialState: function () {
        return {
            waveInfo: globalState.postGameWaves
        }
    },
    componentWillMount: function () {
        var parent = this

        bindings.refreshPostGameWaves = function (waveInfo) {
            parent.setState({ waveInfo: waveInfo })
        }

        // Testing
        if (!isUnityHost)
            engine.trigger('refreshPostGameWaves', testPostGameWaves)
    },
    render: function () {
        var info = this.state.waveInfo

        return (
            React.createElement('div', { id: 'PostGameWaves', className: 'postgame-columns' },
                React.createElement('table', { className: 'leaderboard' },
                    React.createElement('thead', {},
                        React.createElement('tr', {},
                            React.createElement('td', { className: "column1" }, loc('wave', "Wave")),
                            React.createElement('td', { className: "column2 small" },
                                React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Value.png' }),
                                " ",
                                loc('west_value', "West Value")
                            ),
                            React.createElement('td', { className: "column2" },
                                React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Mercenaries.png' }),
                                " ",
                                loc('west_mercs_sent', "West Sent")
                            ),
                            React.createElement('td', { className: "column3" },
                                React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/LeakedThem.png' }),
                                " ",
                                loc('east_leaks', "East Leaks")
                            ),
                            React.createElement('td', { className: "column4 small" },
                                React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Value.png' }),
                                " ",
                                loc('east_value', "East Value")
                            ),
                            React.createElement('td', { className: "column4" },
                                React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Mercenaries.png' }),
                                " ",
                                loc('east_mercs_sent', "East Sent")
                            ),
                            React.createElement('td', { className: "column5" },
                                React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/LeakedThem.png' }),
                                " ",
                                loc('west_leaks', "West Leaks")
                            )
                        )
                    ),
                    React.createElement('tbody', {},
                        info && info.map(function (wave, index) {
                            return React.createElement('tr', { key: wave.number },
                                React.createElement('td', { className: 'column1' }, wave.number),
                                React.createElement('td', { className: 'column2 small' },
                                    wave.leftTeamValue
                                ),
                                React.createElement('td', { className: 'column2' },
                                    wave.leftSends.length > 0 && wave.leftSends.map(function (icon) {
                                        return React.createElement('img', { src: icon })
                                    })
                                ),
                                React.createElement('td', { className: 'column3' },
                                    wave.rightLeaks.length > 0 && wave.rightLeaks.map(function (icon) {
                                        return React.createElement('img', { src: icon })
                                    })
                                ),
                                React.createElement('td', {},
                                    wave.rightTeamValue
                                ),
                                React.createElement('td', {},
                                    wave.rightSends.length > 0 && wave.rightSends.map(function (icon) {
                                        return React.createElement('img', { src: icon })
                                    })
                                ),
                                React.createElement('td', {},
                                    wave.leftLeaks.length > 0 && wave.leftLeaks.map(function (icon) {
                                        return React.createElement('img', { src: icon })
                                    })
                                )
                            )
                        })
                    )
                )
            )
        )
    }
})

var buildInfoDebug
var PostGameBuilds = React.createClass({
    getInitialState: function () {
        var initialIndex = 0
        if (globalState.postGameBuilds != null
            && globalState.postGameBuilds.builds != null
            && globalState.postGameBuilds.builds.length > 0)
            initialIndex = globalState.postGameBuilds.builds.length - 1
        return {
            buildInfo: globalState.postGameBuilds,
            selectedWaveIndex: initialIndex,
        }
    },
    componentWillMount: function () {
        var parent = this

        // This seems to never really be called on time..
        bindings.refreshPostGameBuilds = function (buildInfo) {
            var initialIndex = (buildInfo.builds.length > 0) ? (buildInfo.builds.length - 1) : 0
            //console.log('refreshPostGameBuilds with ' + buildInfo.builds.length + ' builds, initialIndex: ' + initialIndex)
            parent.setState({
                buildInfo: buildInfo,
                selectedWaveIndex: initialIndex
            })
        }

        // Testing
        if (!isUnityHost)
            engine.trigger('refreshPostGameBuilds', testPostGameBuilds)

        //console.log("componentWillUnmount --> add keydown listener")
        document.addEventListener("keydown", this.handleKey, false);
    },
    handleKey: function (evt) {
        var parent = this

        // Hack to disable arrow keys if this element is not visible
        var reactObject = this.refs.postGameBuilds
        var top = 0
        if (reactObject != null)
            top = reactObject.getBoundingClientRect().top
        if (top == 0)
            return

        evt = evt || window.event;
        if (evt.keyCode == 38)
            this.setSelectedWave(parent.state.selectedWaveIndex + 1)
        if (evt.keyCode == 40)
            this.setSelectedWave(parent.state.selectedWaveIndex - 1)
    },
    setSelectedWave: function (waveIndex) {
        if (globalState.postGameBuilds.builds == null) return
        var parent = this

        if (waveIndex < 0) waveIndex = 0
        if (waveIndex >= globalState.postGameBuilds.builds.length - 1) waveIndex = globalState.postGameBuilds.builds.length - 1

        parent.setState({ selectedWaveIndex: waveIndex })
    },
    componentWillUnmount: function () {
        document.removeEventListener('keydown', this.handleKey, false);
    },
    render: function () {
        var parent = this
        var info = this.state.buildInfo
        buildInfoDebug = info

        // Failsafe for if you -debug and end on wave 1 or something
        if (info.builds.length == 0) return null

        //console.log("Rendering post game builds with buildInfoDebug: " + buildInfoDebug)

        var dropdownChoices = []
        info.builds.map(function (build, index) {
            dropdownChoices.push({
                text: loc('wave', 'Wave') + ' ' + build.number,
                action: function () {
                    parent.setState({ selectedWaveIndex: index })
                    //console.log("set selectedWaveIndex to: " + index)
                },
                html: '<img class="tooltip-icon" src="' + icons['wave' + build.number] + '" />' + ' ' + loc('wave', 'Wave') + ' ' + build.number
            })
        })
        dropdownChoices.reverse()

        var leftKingPercentHpString = (100 * info.builds[parent.state.selectedWaveIndex].leftKingPercentHp).toFixed(0)
        var rightKingPercentHpString = (100 * info.builds[parent.state.selectedWaveIndex].rightKingPercentHp).toFixed(0)
        var isUHD = globalState.screenWidth >= 1921

        return (
            React.createElement('div', {
                id: 'PostGameBuilds', className: 'postgame-columns', ref: 'postGameBuilds', style: {
                    marginTop: '20px'
                }
            },
                React.createElement('div', { className: 'postgame-builds-container', style: { width: '1096px', height: '48px', margin: 'auto' } },
                    React.createElement('h1', { style: { float: 'left' } }, loc('wave', 'Wave') + ' ' + (1 + parent.state.selectedWaveIndex)),
                    React.createElement('div', { style: { position: 'absolute', left: '0', right: '0', top: '40px', textAlign: 'center', pointerEvents: 'none' } },
                        // Left king
                        React.createElement('img', { className: 'postgame-king', style: { width: '28px' }, src: 'hud/img/icons/EarthKing.png' }),
                        React.createElement('div', {
                            className: "progress-container",
                            style: { width: '128px', height: '20px', marginRight: '12px' }
                        },
                            React.createElement('div', {
                                className: "progress-bar custom", style: {
                                    width: leftKingPercentHpString + "%",
                                }
                            }),
                            React.createElement('span', { className: 'value' }, leftKingPercentHpString + "%"),
                            React.createElement('div', {
                                className: "upgrades-container",
                                style: {
                                    width: (((info.builds[parent.state.selectedWaveIndex].leftKingUpgradeCount) / 30) * 128) + 'px',
                                    left: '0',
                                    backgroundImage: 'url("hud/img/hudv2/kingupgrades_bar.png")'
                                }
                            },
                                ""
                            )
                        ),
                        // Right king
                        React.createElement('img', { className: 'postgame-king', style: { width: '28px' }, src: 'hud/img/icons/SkyKing.png' }),
                        React.createElement('div', {
                            className: "progress-container",
                            style: { width: '128px', height: '20px' }
                        },
                            React.createElement('div', {
                                className: "progress-bar custom", style: {
                                    width: rightKingPercentHpString + "%",
                                }
                            }),
                            React.createElement('span', { className: 'value' }, rightKingPercentHpString + "%"),
                            React.createElement('div', {
                                className: "upgrades-container",
                                style: {
                                    width: (((info.builds[parent.state.selectedWaveIndex].rightKingUpgradeCount) / 30) * 128) + 'px',
                                    left: '0',
                                    backgroundImage: 'url("hud/img/hudv2/kingupgrades_bar.png")'
                                }
                            },
                                ""
                            )
                        )
                    ),
                    React.createElement('div', {
                        className: 'dropdown-container'
                    },
                        React.createElement(DropdownLinks, {
                            choices: dropdownChoices,
                            defaultValue: loc('wave', 'Wave') + ' ' + (1 + parent.state.selectedWaveIndex),
                            actualValue: '<img class="tooltip-icon" src="' + icons['wave' + (1 + parent.state.selectedWaveIndex)] + '" />' + ' ' + loc('wave', 'Wave') + ' ' + (1 + parent.state.selectedWaveIndex)
                        })
                    )
                ),
                React.createElement('div', {
                    style: { /* SMELLY TABLE STYLING FIX */
                        position: isUHD ? 'absolute' : '',
                        width: isUHD ? '100vw' : '',
                    }
                },
                    React.createElement('table', {
                        className: 'leaderboard no-hover',
                        style: {
                            width: (info.playerNames.length * 243 + 95) + 'px'
                        }
                    },
                        React.createElement('thead', {},
                            React.createElement('tr', {},
                                React.createElement('td', { className: "column1" }, ""),
                                info.playerNames && info.playerNames.map(function (name, index) {
                                    return React.createElement('td', {
                                        className: "column" + (2 + index) + ' postgame-name',
                                        dangerouslySetInnerHTML: { __html: name }
                                    })
                                })
                            )
                        ),
                        React.createElement('tbody', {},
                            info.builds && info.builds.map(function (build, index) {
                                // Hide waves other than the currently selected one
                                if (build.number != (1 + parent.state.selectedWaveIndex))
                                    return null

                                return React.createElement('tr', { key: build.number },
                                    //React.createElement('td', {}, build.number),
                                    React.createElement('td', {}, loc('fighters', 'Fighters')),
                                    build.playerBuilds && build.playerBuilds.map(function (playerBuild, index) {

                                        // Don't display extra players (mainly just useful for testing)
                                        if (index >= info.playerNames.length)
                                            return null

                                        // Fallback
                                        if (!playerBuild.recommendedValue)
                                            playerBuild.recommendedValue = playerBuild.fightersValue

                                        var percentOfRecValue = 0
                                        if (playerBuild.recommendedValue > 0)
                                            percentOfRecValue = playerBuild.fightersValue / playerBuild.recommendedValue
                                        var recValueDelta = playerBuild.fightersValue - playerBuild.recommendedValue
                                        var colorString = '33ff33'
                                        // SMELLY COPY AND PASTED from WaveInfo
                                        if (percentOfRecValue < 0.60)
                                            colorString = 'ff3333'
                                        else if (percentOfRecValue < 0.70)
                                            colorString = 'ff3333'
                                        else if (percentOfRecValue < 0.80)
                                            colorString = 'ffff33'
                                        else if (percentOfRecValue < 0.90)
                                            colorString = 'ffff33'
                                        else if (percentOfRecValue < 1.00)
                                            colorString = 'cccccc'
                                        else if (percentOfRecValue < 1.10)
                                            colorString = 'cccccc'
                                        else if (percentOfRecValue < 1.20)
                                            colorString = 'ffff33'
                                        else if (percentOfRecValue < 1.30)
                                            colorString = 'ffff33'
                                        else
                                            colorString = 'ff3333'
                                        var recValueDeltaString = recValueDelta >= 0 ? '<span style="color: #' + colorString + '">+' + recValueDelta + '</span>' : '<span style="color: #' + colorString + '">' + recValueDelta + '</span>'

                                        return React.createElement('td', {
                                            className: 'builds',
                                            style: {
                                                position: 'relative',
                                                height: '372px', //'360px',
                                            }
                                        },
                                            React.createElement('div', {
                                                //className: 'building-grid simple-tooltip',
                                                className: 'building-grid',
                                                onMouseDown: function (e) {
                                                    if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                                    console.log('Click postgame grid, wave ' + build.number)
                                                    engine.call('OnClickPostGameGrid', JSON.stringify(playerBuild.fighters), build.number, playerBuild.mercenariesReceivedValue)
                                                }
                                            }//,
                                                //React.createElement('span', { className: 'tooltiptext' },
                                                //    React.createElement('span', {
                                                //        dangerouslySetInnerHTML: {
                                                //            __html: loc('click_to_copy_build_to_clipboard', 'Click to copy build to clipboard. Use -load to load it.')
                                                //        }
                                                //    })
                                                //)
                                            ),
                                            React.createElement('div', {
                                                style: {
                                                    color: '#ffcc00',
                                                    position: 'absolute',
                                                    top: '3px',
                                                    left: '0',
                                                    width: '100%',
                                                    textAlign: 'center',
                                                }
                                            },
                                                React.createElement('span', { className: 'simple-tooltip', style: { marginRight: '3px' } },
                                                    React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Value.png' }),
                                                    " ",
                                                    playerBuild.fightersValue,
                                                    React.createElement('span', { className: 'tooltiptext auto' },
                                                        React.createElement('span', {
                                                            dangerouslySetInnerHTML: {
                                                                __html: loc('chart_recommended_value', 'Recommended')
                                                                    + ': ' + playerBuild.recommendedValue + ' (' + recValueDeltaString + ')'
                                                            }
                                                        })
                                                    )
                                                ),
                                                React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Worker.png' }),
                                                " " + playerBuild.workers + " ",
                                                React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Income.png' }),
                                                " " + playerBuild.income + " ",
                                                React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/small-icons/networth.png' }),
                                                " " + playerBuild.netWorth,
                                                playerBuild.rolls && React.createElement('div', {},
                                                    playerBuild.rolls.map(function (rollIcon) {
                                                        return React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/' + rollIcon })
                                                    })
                                                )
                                            ),
                                            playerBuild.fighters.map(function (fighterPosition) {
                                                return React.createElement('div', {
                                                    className: 'simple-tooltip',
                                                    style: {
                                                        position: 'absolute',
                                                        left: fighterPosition.x * 24,
                                                        bottom: fighterPosition.y * 24 + 8
                                                    }
                                                },
                                                    React.createElement('img', {
                                                        src: fighterPosition.icon
                                                    }),
                                                    React.createElement('span', { className: 'tooltiptext' },
                                                        fighterPosition.name
                                                    )
                                                )
                                            })
                                        )
                                    })
                                )
                            }),

                            // Workers & King upgrades row
                            //info.builds && info.builds.map(function (build, index) {
                            //    // Hide waves other than the currently selected one
                            //    if (build.number != (1 + parent.state.selectedWaveIndex))
                            //        return null

                            //    return React.createElement('tr', {},
                            //        React.createElement('td', { className: 'upgrades' }, 'Workers'),
                            //        build.playerBuilds && build.playerBuilds.map(function (build, index) {
                            //            // Don't display extra players (mainly just useful for testing)
                            //            if (index >= info.playerNames.length)
                            //                return null

                            //            if (build.workersThisWave == null)
                            //                return React.createElement('td', { className: 'workers' }, '')

                            //            return React.createElement('td', { className: 'workers' },
                            //                build.workersThisWave > 0 && React.createElement('span', { style: { whiteSpace: 'nowrap' } },
                            //                    " ",
                            //                    React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Worker.png' }),
                            //                    React.createElement('span', { style: {} }, " " + build.workersThisWave)
                            //                )
                            //            )
                            //        })
                            //    )
                            //}),

                            info.builds && info.builds.map(function (build, index) {
                                // Hide waves other than the currently selected one
                                if (build.number != (1 + parent.state.selectedWaveIndex))
                                    return null

                                return React.createElement('tr', {},
                                    React.createElement('td', { className: 'mercenaries' }, loc('mercenary_value_received', 'Received')),
                                    build.playerBuilds && build.playerBuilds.map(function (build, index) {
                                        // Don't display extra players (mainly just useful for testing)
                                        if (index >= info.playerNames.length)
                                            return null

                                        if (build.mercenariesReceived == null)
                                            return React.createElement('td', { className: 'mercenaries' }, '')

                                        return React.createElement('td', { className: 'mercenaries' },
                                            (build.mercenariesReceivedValue + build.opponentKingUpgradesValue) > 0 && React.createElement('span', {
                                                style: {
                                                    whiteSpace: 'nowrap',
                                                    marginRight: '6px'
                                                }
                                            },
                                                " ",
                                                React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Mythium.png' }),
                                                (build.mercenariesReceivedValue + build.opponentKingUpgradesValue)
                                            ),
                                            build.mercenariesReceived.map(function (mercenaryReceivedIcon) {
                                                return React.createElement('img', {
                                                    src: mercenaryReceivedIcon
                                                })
                                            }),
                                            build.opponentKingUpgrades.map(function (researchIcon) {
                                                return React.createElement('img', {
                                                    src: researchIcon
                                                })
                                            })
                                            // v6.00: no need to show separate mythium for king upgrades; just combine with total myth received
                                            //build.opponentKingUpgradesValue > 0 && React.createElement('span', { style: { whiteSpace: 'nowrap' } },
                                            //    " ",
                                            //    React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/KingUpgrade.png'}),
                                            //    React.createElement('span', { style: { color: '#9a84d6' } }, " " + build.opponentKingUpgradesValue)
                                            //)
                                        )
                                    })
                                )
                            })
                        ),
                        info.builds && info.builds.map(function (build, index) {
                            // Hide waves other than the currently selected one
                            if (build.number != (1 + parent.state.selectedWaveIndex))
                                return null

                            return React.createElement('tr', {},
                                React.createElement('td', { className: 'leaks' }, loc('leaks', 'Leaks')),
                                build.playerBuilds && build.playerBuilds.map(function (build, index) {
                                    // Don't display extra players (mainly just useful for testing)
                                    if (index >= info.playerNames.length)
                                        return null

                                    if (build.unitsLeaked == null)
                                        return React.createElement('td', { className: 'leaks' }, '')

                                    return React.createElement('td', { className: 'leaks' },
                                        //build.unitsLeakedValue > 0 && React.createElement('span', { style: { whiteSpace: 'nowrap' } },
                                        //    " ",
                                        //    React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Gold.png' }),
                                        //    React.createElement('span', { style: { color: '#ff3333' } }, "-" + build.unitsLeakedValue)
                                        //)
                                        build.unitsLeakedValue > 0 && React.createElement('div', { style: { whiteSpace: 'nowrap', marginBottom: '1vh' } },
                                            " ",
                                            //React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Gold.png' }),
                                            build.unitsLeakedPercent >= 0.80 && React.createElement('span', { style: { color: '#ff3333' } }, ' ' + (100 * build.unitsLeakedPercent).toFixed(0) + '%'),
                                            build.unitsLeakedPercent >= 0.40 && build.unitsLeakedPercent < 0.80 && React.createElement('span', { style: { color: '#ff8800' } }, ' ' + (100 * build.unitsLeakedPercent).toFixed(0) + '%'),
                                            build.unitsLeakedPercent > 0 && build.unitsLeakedPercent < 0.40 && React.createElement('span', { style: { color: '#ffff33' } }, ' ' + (100 * build.unitsLeakedPercent).toFixed(0) + '%')
                                        ),
                                        build.unitsLeaked.map(function (unitLeakedIcon) {
                                            return React.createElement('img', {
                                                src: unitLeakedIcon
                                            })
                                        })
                                    )
                                })
                            )
                        })
                    ),
                    React.createElement('div', {
                        className: 'postgame-arrow-hint',
                        style: { textAlign: 'center', margin: '6px' }
                    }, loc('you_can_use_arrows', 'You can use up/down arrows to navigate'))
                )
            )
        )
    }
})

Chart.defaults.global.defaultFontColor = 'white';
var PostGameGraphs = React.createClass({
    graphTypes: [],
    getInitialState: function () {
        return {
            graphInfo: globalState.postGameGraphs,
            selectedGraphIndex: 0,
        }
    },
    componentWillMount: function () {
        var parent = this

        bindings.refreshPostGameGraphs = function (graphInfo) {
            parent.setState({ graphInfo: graphInfo })
        }

        document.addEventListener("keydown", this.handleKey, false);
    },
    handleKey: function (evt) {
        var parent = this

        // Hack to disable arrow keys if this element is not visible
        var reactObject = this.refs.postGameGraphs
        var top = 0
        if (reactObject != null)
            top = reactObject.getBoundingClientRect().top
        if (top == 0)
            return

        evt = evt || window.event;
        if (evt.keyCode == 38)
            this.setSelectedGraphIndex(parent.state.selectedGraphIndex - 1)
        if (evt.keyCode == 40)
            this.setSelectedGraphIndex(parent.state.selectedGraphIndex + 1)
    },
    setSelectedGraphIndex: function (selectedGraphIndex) {
        var parent = this

        if (selectedGraphIndex < 0) return
        if (selectedGraphIndex >= this.graphTypes.length) return

        parent.setState({ selectedGraphIndex: selectedGraphIndex })
    },
    componentWillUnmount: function () {
        document.removeEventListener('keydown', this.handleKey, false);
    },
    componentDidMount: function () {
        var parent = this
        if (parent.state.graphInfo == null) return
        console.log("graph componentDidMount --> createChart()")
        this.createChart()
    },
    componentDidUpdate: function () {
        var parent = this
        if (parent.state.graphInfo == null) return
        console.log("graph componentDidUpdate --> createChart()")
        this.createChart()
    },
    createChart: function () {
        var parent = this

        var dataToRender = []
        var chart = null

        // Smelly hardcoded association since the chart refs are hardcoded
        // See getPostGameGraphTypes to update graph info
        if (parent.state.selectedGraphIndex == 0)
            chart = this.refs.chart0
        else if (parent.state.selectedGraphIndex == 1)
            chart = this.refs.chart1
        else if (parent.state.selectedGraphIndex == 2)
            chart = this.refs.chart2
        else if (parent.state.selectedGraphIndex == 3)
            chart = this.refs.chart3
        else if (parent.state.selectedGraphIndex == 4)
            chart = this.refs.chart4
        else if (parent.state.selectedGraphIndex == 5)
            chart = this.refs.chart5
        else if (parent.state.selectedGraphIndex == 6)
            chart = this.refs.chart6
        else if (parent.state.selectedGraphIndex == 7)
            chart = this.refs.chart7
        else if (parent.state.selectedGraphIndex == 8)
            chart = this.refs.chart8
        else if (parent.state.selectedGraphIndex == 9)
            chart = this.refs.chart9
        else if (parent.state.selectedGraphIndex == 10)
            chart = this.refs.chart10
        else if (parent.state.selectedGraphIndex == 11)
            chart = this.refs.chart11
        else if (parent.state.selectedGraphIndex == 12)
            chart = this.refs.chart12
        else if (parent.state.selectedGraphIndex == 13)
            chart = this.refs.chart13
        else if (parent.state.selectedGraphIndex == 14)
            chart = this.refs.chart14
        else if (parent.state.selectedGraphIndex == 15)
            chart = this.refs.chart15
        else
            chart = this.refs.chart16

        if (chart == null || chart.length == 0) return

        if (this.state.graphInfo == null || this.state.graphInfo.players == null || this.state.graphInfo.players.length == 0)
            return

        var graphItem = parent.graphTypes[parent.state.selectedGraphIndex]
        var datasets = []
        var labels = []

        // This one is mainly special for power score because the power scores are computed a wave in advance
        // compared to how you talk about them
        var addOneToWaveForCategoriesAndKeys = [
            'powerScoreAdvantage',
            'playerpowerscore',
            'winProbability',
        ]

        var addEndOfGameForCategoriesAndKeys = [
            'winProbability'
            //'playernetworth',
            //'goldAdvantage',
            //'teamnetworth',
            //'playerincome'
        ]

        var skipFirstIndex = [
            'goldAdvantage',

            'playermythiumsent',
            'playermythiumreceived',
            'playerworkers',
            'playerincome',
            'playerfightervalue',
            'playernetworth',

            'teamnetworth',
            'teamkingupgrades',
        ]

        var startingWave = 0
        if (_.includes(skipFirstIndex, graphItem.category)
            || _.includes(skipFirstIndex, graphItem.key)) { // v7.02 exception case
            startingWave = 1
        }

        if (_.includes(addOneToWaveForCategoriesAndKeys, graphItem.category)
            || _.includes(addOneToWaveForCategoriesAndKeys, graphItem.key)) { // v7.02 exception case
            for (var i = startingWave; i <= this.state.graphInfo.waveCount - 1; i++)
                labels.push(loc('wave', 'Wave') + ' ' + (i + 1))
        } else { // Typical case
            for (var i = startingWave; i <= this.state.graphInfo.waveCount; i++)
                labels.push(loc('wave', 'Wave') + ' ' + i)
        }

        if (_.includes(addEndOfGameForCategoriesAndKeys, graphItem.category)
            || _.includes(addEndOfGameForCategoriesAndKeys, graphItem.key)) {
            labels.push(loc('end_of_game', 'End of Game'))
        }

        // v9.04 smelly holy CRAP this took a long time to figure out
        // it's SUPER annoying because we're on v2.7.3 of the library, but latest is like 3.7.x so a lot of StackOverflow
        // stuff is for latest version or even older versions
        // but if we upgrade the library, it breaks a lot of things that aren't trivial to fix
        var tooltipCallbacks = {}
        var ticksCallback = function (value) {
            return value;
        }

        if (graphItem.category == 'team') {
            this.state.graphInfo.teams.map(function (team, index) {
                var dataToRender = []

                if (graphItem.key == 'teamnetworth')
                    dataToRender = team.netWorth
                else if (graphItem.key == 'teamkingupgrades')
                    dataToRender = team.kingUpgrades
                else
                    console.warn("unknown data key: " + graphItem.key)

                if (_.includes(skipFirstIndex, graphItem.category)
                    || _.includes(skipFirstIndex, graphItem.key)) {
                    dataToRender = dataToRender.slice(1)
                }

                datasets.push({
                    label: team.name,
                    data: dataToRender,
                    borderColor: '#' + team.color,
                    backgroundColor: '#' + team.color,
                    fill: false,
                    pointRadius: 5,
                    pointHitRadius: 10,
                    lineTension: 0,
                    yAxisID: 'y-axis-0',
                })
            })
        } else if (graphItem.category == 'player') {
            this.state.graphInfo.players.map(function (player, index) {
                var dataToRender = []

                if (graphItem.key == 'playernetworth')
                    dataToRender = player.netWorth
                else if (graphItem.key == 'playerfightervalue')
                    dataToRender = player.fighterValue
                else if (graphItem.key == 'playerworkers')
                    dataToRender = player.workers
                else if (graphItem.key == 'playerincome')
                    dataToRender = player.incomes
                else if (graphItem.key == 'playerpowerscore') {
                    dataToRender = player.powerScore
                    // v8.01 smelly fix for player power score (it's computed kind of weirdly), so let's just add a 370 hardcode at start
                    if (dataToRender != null && dataToRender.length >= 0)
                        dataToRender[0] = 370
                }
                else if (graphItem.key == 'playermythiumsent')
                    dataToRender = player.mythiumSent
                else if (graphItem.key == 'playermythiumreceived')
                    dataToRender = player.mythiumReceived
                else
                    console.log("unknown data key: " + graphItem.key)

                if (_.includes(skipFirstIndex, graphItem.category)
                    || _.includes(skipFirstIndex, graphItem.key)) {
                    dataToRender = dataToRender.slice(1)
                }

                datasets.push({
                    label: player.name,
                    data: dataToRender,
                    borderColor: '#' + player.color,
                    backgroundColor: '#' + player.color,
                    fill: false,
                    pointRadius: 5,
                    pointHitRadius: 10,
                    lineTension: 0,
                    yAxisID: 'y-axis-0',
                })
            })
        } else if (graphItem.category == 'goldAdvantage') {
            var dataToRender = parent.state.graphInfo.goldAdvantage
            if (_.includes(skipFirstIndex, graphItem.category)
                || _.includes(skipFirstIndex, graphItem.key)) {
                dataToRender = dataToRender.slice(1)
            }

            // Your team gold advantage style
            datasets.push({
                label: loc('team_gold_advantage', 'Your Team Gold Advantage'),
                data: dataToRender,
                borderColor: 'white',
                borderWidth: 2,
                backgroundColor: 'rgba(64, 255, 64, 1)',
                pointBackgroundColor: 'white',
                fill: 'origin',
                pointRadius: 5,
                pointHitRadius: 10,
                lineTension: 0,
                yAxisID: 'y-axis-0',
            })
        } else if (graphItem.category == 'powerScoreAdvantage') {
            var dataToRender = parent.state.graphInfo.powerScoreAdvantage
            if (_.includes(skipFirstIndex, graphItem.category)
                || _.includes(skipFirstIndex, graphItem.key)) {
                dataToRender = dataToRender.slice(1)
            }

            // Your team gold advantage style
            datasets.push({
                label: loc('team_power_score_advantage', 'Your Team Power Score Advantage'),
                data: dataToRender,
                borderColor: 'white',
                borderWidth: 2,
                backgroundColor: 'rgba(64, 255, 64, 1)',
                pointBackgroundColor: 'white',
                fill: 'origin',
                pointRadius: 5,
                pointHitRadius: 10,
                lineTension: 0,
                yAxisID: 'y-axis-0',
            })
        } else if (graphItem.category == 'winProbability') {
            var dataToRender = parent.state.graphInfo.winProbability
            if (_.includes(skipFirstIndex, graphItem.category)
                || _.includes(skipFirstIndex, graphItem.key)) {
                dataToRender = dataToRender.slice(1)
            }

            // Your team gold win probability style
            datasets.push({
                label: loc('team_win_probability', 'Your Team Win Probability'),
                data: dataToRender,
                borderColor: 'white',
                borderWidth: 2,
                backgroundColor: 'rgba(255, 64, 255, 1)', // replace with dynamic fill
                pointBackgroundColor: 'white',
                fill: '+1',
                pointRadius: 5,
                pointHitRadius: 10,
                lineTension: 0,
                yAxisID: 'y-axis-0',
            })

            //var dataToRenderFillWith50s = []
            //for (var i = 0; i < dataToRender.length; i++)
            //    dataToRenderFillWith50s.push(50)

            datasets.push({
                label: '',
                fill: false,
                data: dataToRender.map(function (index) { return 50 }),
                yAxisID: 'y-axis-0', // Dunno why we need it, but we do
                borderColor: 'gray',
                pointBackgroundColor: 'gray',
                pointRadius: 0,
                pointHitRadius: 0,
            })

            tooltipCallbacks = {
                label: function (tooltipItem, data) {
                    // Smelly, to hide the 50 line dataset
                    if (tooltipItem.datasetIndex == 1) return
                    return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel + '%'
                }
            }

            ticksCallback = function (value) {
                return value + '%';
            }
        } else {
            console.log("invalid category: " + graphItem.category)
        }

        var myChart = new Chart(chart, {
            type: GetChartType(graphItem.category),
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                tooltips: {
                    mode: 'index',
                    position: 'average',
                    intersect: true,
                    callbacks: tooltipCallbacks
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: loc('wave', 'Wave')
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: parent.graphTypes[parent.state.selectedGraphIndex].text
                        },
                        ticks: {
                            suggestedMin: parent.graphTypes[parent.state.selectedGraphIndex].suggestedMin,
                            suggestedMax: parent.graphTypes[parent.state.selectedGraphIndex].suggestedMax,
                            callback: ticksCallback
                        }
                    }]
                },
                legend: {
                    display: (graphItem.category == 'goldAdvantage' || graphItem.category == 'powerScoreAdvantage' || graphItem.category == 'winProbability') ? false : true,
                }
            }
        });
    },
    render: function () {
        var parent = this

        if (parent.state.graphInfo == null) return null
        console.log("render graph with selectedGraphIndex: " + parent.state.selectedGraphIndex)

        if (this.graphTypes.length == 0) {
            //console.log("graph types not loaded; try to refresh it") // we have to dynamically refresh for localization
            this.graphTypes = getPostGameGraphTypes()
        }

        var dropdownChoices = []
        parent.graphTypes.map(function (item, index) {
            dropdownChoices.push({
                text: item.text,
                action: function () {
                    parent.setState({ selectedGraphIndex: index })
                    console.log("set selectedGraphIndex to: " + index)
                }
            })
        })

        return (
            React.createElement('div', { id: 'PostGameGraphs', ref: 'postGameGraphs' },
                React.createElement('h1', {}, parent.graphTypes[parent.state.selectedGraphIndex].text),
                React.createElement('div', {
                    style: {
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        minWidth: '256px',
                    }
                },
                    React.createElement(DropdownLinks, {
                        choices: dropdownChoices,
                        defaultValue: parent.graphTypes[0].text,
                        actualValue: parent.graphTypes[parent.state.selectedGraphIndex].text
                    })
                ),
                parent.graphTypes.map(function (item, index) {
                    if (parent.state.selectedGraphIndex != index)
                        return null

                    return (
                        //React.createElement('div', { className: 'post-game-graph-container' },
                        React.createElement('canvas', {
                            className: 'post-game-graph',
                            style: {
                                //display: (parent.state.selectedGraphIndex != index) ? 'none' : '',
                            },
                            ref: 'chart' + index,
                        })
                        //)
                    )
                }),
                React.createElement('div', {
                    style: { textAlign: 'center', margin: '6px' }
                }, loc('you_can_use_arrows', 'You can use up/down arrows to navigate'))
            )
        )
    }
})

Chart.defaults.global.defaultFontFamily = "MenuFont_chat";

// https://stackoverflow.com/questions/36916867/chart-js-line-different-fill-color-for-negative-point
// http://jsfiddle.net/g2r2q5Lu/
Chart.defaults.NegativeTransparentLine = Chart.helpers.clone(Chart.defaults.line);
Chart.controllers.NegativeTransparentLine = Chart.controllers.line.extend({
    update: function () {
        if (!this.getDataset().yAxisID) return

        // get the min and max values
        var min = Math.min.apply(null, this.chart.data.datasets[0].data);
        var max = Math.max.apply(null, this.chart.data.datasets[0].data);
        var yScale = this.getScaleForId(this.getDataset().yAxisID);

        // figure out the pixels for these and the value 0
        var top = yScale.getPixelForValue(max);
        var zero = yScale.getPixelForValue(0);
        var bottom = yScale.getPixelForValue(min);

        if (isNaN(top)) top = 0
        if (isNaN(bottom)) bottom = 0

        // build a gradient that switches color at the 0 point
        var ctx = this.chart.chart.ctx;
        var gradient = ctx.createLinearGradient(0, top, 0, bottom);
        var ratio = Math.max(0, Math.min((zero - top) / (bottom - top), 1));
        // v8.05.1 max(0) to prevent this bug: https://i.imgur.com/iype1QQ.png

        //console.log('top: ' + top + ", zero: " + zero + ", bottom: " + bottom + ", ratio: " + ratio)

        if (ratio == 0) {
            gradient.addColorStop(0, 'rgba(255,64,64,0.4)');
        }
        else if (ratio == 1) {
            gradient.addColorStop(0, 'rgba(64,255,64,0.4)');
        }
        else if (!isNaN(ratio)) {
            gradient.addColorStop(0, 'rgba(64,255,64,0.4)');
            gradient.addColorStop(ratio, 'rgba(64,255,64,0.4)');
            gradient.addColorStop(ratio, 'rgba(255,64,64,0.4)');
            gradient.addColorStop(1, 'rgba(255,64,64,0.4)');
        }

        this.chart.data.datasets[0].backgroundColor = gradient;

        return Chart.controllers.line.prototype.update.apply(this, arguments);
    }
});

Chart.defaults.NegativeTransparentLineWinProbability = Chart.helpers.clone(Chart.defaults.line);
Chart.controllers.NegativeTransparentLineWinProbability = Chart.controllers.line.extend({
    update: function () {
        if (!this.getDataset().yAxisID) return

        var data = []

        for (var i = 0; i < this.chart.data.datasets[0].data.length; i++) {
            data.push(this.chart.data.datasets[0].data[i] - 50)
            //data.push(this.chart.data.datasets[0].data[i])
        }

        // get the min and max values
        var min = Math.min.apply(null, this.chart.data.datasets[0].data);
        var max = Math.max.apply(null, this.chart.data.datasets[0].data);
        var shiftedMin = Math.min.apply(null, data);
        var shiftedMax = Math.max.apply(null, data);
        var yScale = this.getScaleForId(this.getDataset().yAxisID);

        // figure out the pixels for these and the value 0
        var top = yScale.getPixelForValue(max);
        var zero = yScale.getPixelForValue(0);
        var bottom = yScale.getPixelForValue(min);

        var shiftedTop = yScale.getPixelForValue(shiftedMax);
        var shiftedBottom = yScale.getPixelForValue(shiftedMin);

        if (isNaN(top)) top = 0
        if (isNaN(bottom)) bottom = 0

        // build a gradient that switches color at the 0 point
        var ctx = this.chart.chart.ctx;
        var gradient = ctx.createLinearGradient(0, top, 0, bottom);
        var ratio = Math.max(0, Math.min((zero - shiftedTop) / (shiftedBottom - shiftedTop), 1));

        //console.log('top: ' + top + ", zero: " + zero + ", bottom: " + bottom + ", ratio: " + ratio)

        if (ratio == 0) {
            gradient.addColorStop(0, 'rgba(255,64,64,0.4)');
        }
        else if (ratio == 1) {
            gradient.addColorStop(0, 'rgba(64,255,64,0.4)');
        }
        else if (!isNaN(ratio)) {
            gradient.addColorStop(0, 'rgba(64,255,64,0.4)');
            gradient.addColorStop(ratio, 'rgba(64,255,64,0.4)');
            gradient.addColorStop(ratio + 0.01, 'rgba(255,64,64,0.4)');
            gradient.addColorStop(1, 'rgba(255,64,64,0.4)');
        }

        this.chart.data.datasets[0].backgroundColor = gradient;

        return Chart.controllers.line.prototype.update.apply(this, arguments);
    }
});

var GetChartType = function (category) {
    switch (category) {
        case 'goldAdvantage':
        case 'powerScoreAdvantage':
            return 'NegativeTransparentLine'
        case 'winProbability':
            return 'NegativeTransparentLineWinProbability'
    }
    return 'line'
}