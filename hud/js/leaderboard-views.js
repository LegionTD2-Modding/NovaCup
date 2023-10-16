// Leaderboards
// ===============================================================================

var LeaderboardTab = React.createClass({
    propTypes: {
        statsList: React.PropTypes.array,
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshLeaderboardActiveStat = function (statisticName) {
            parent.setState({ activeStat: statisticName })
        }
    },
    getInitialState: function() {
        var defaultActiveStat = ''
        if (this.props.statsList && this.props.statsList.length > 0)
            defaultActiveStat = this.props.statsList[0]

        return {
            activeStat: defaultActiveStat,
        }
    },
    render: function () {
        var parent = this
        if (!this.props.statsList) return

        // Build dropdown menu items
        var dropdownChoices = []
        this.props.statsList.map(function (item, index) {

            console.log("Found leaderboard stat: " + item)

            dropdownChoices.push({
                text: item,
                action: function () {
                    console.log("leaderboard selected " + item)
                    parent.setState({ activeStat: item })
                },
                html: '<img class="tooltip-icon" src="' + icons[item] + '" /> ' + loc('statistic_' + item, 'Loc: ' + item) + getStatisticSuffix(item)
            })
        })

        if (this.state.activeStat == "")
            console.warn("activeStat should not have been empty")

        console.log('render leaderboardTab with activeStat: ' + this.state.activeStat)

        return (
            React.createElement('div', {},
                React.createElement('div', { style: { height: '70px' }},
                    React.createElement('h1', { style: { float: 'left', padding: '0' } },
                        React.createElement('img', { style: { verticalAlign: 'middle', marginRight: '12px' }, src: icons[this.state.activeStat] }),
                        loc('statistic_' + this.state.activeStat, 'Loc: ' + this.state.activeStat) + getStatisticSuffix(this.state.activeStat)
                    ),
                    React.createElement('div', { className: 'dropdown-container' },
                        // Render dropdown
                        React.createElement(DropdownLinks, {
                            choices: dropdownChoices,
                            defaultValue: this.props.statsList[0],
                            actualValue: '<img class="tooltip-icon" src="' + icons[parent.state.activeStat] + '" /> ' + loc('statistic_' + parent.state.activeStat, 'Loc: ' + parent.state.activeStat) + getStatisticSuffix(this.state.activeStat)
                        })
                    )
                ),
                // Change the key every time to force it to reinitialize with default state
                // https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
                React.createElement(Leaderboard, { key: this.state.activeStat, statisticName: 'totalXp', eloStatisticName: this.state.activeStat })
            )
        )
    }
})

var Leaderboard = React.createClass({
    propTypes: {
        statisticName: React.PropTypes.string.isRequired,
        eloStatisticName: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            leaderboardEntries: null,
            leaderboardEntriesAroundMe: null,
            selectedColumn: "",
            previousStatisticName: "",
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshLeaderboard[parent.props.statisticName] = function (leaderboardEntries, testLeaderboardEntriesAroundMe) {
            parent.setState({
                leaderboardEntries: leaderboardEntries,
                leaderboardEntriesAroundMe: testLeaderboardEntriesAroundMe,
                selectedColumn: "level",
            })
        }

        bindings.refreshLeaderboard[parent.props.eloStatisticName] = function (leaderboardEntries, testLeaderboardEntriesAroundMe) {
            parent.setState({
                leaderboardEntries: leaderboardEntries,
                leaderboardEntriesAroundMe: testLeaderboardEntriesAroundMe,
                selectedColumn: "elo",
            })
        }

        console.log('Leaderboard componentWillMount, props.eloStatisticName: ' + parent.props.eloStatisticName)
    },
    render: function () {
        var parent = this

        // Fetch new if this isn't the page we previously loaded (kinda ghetto caching)
        var needToRefresh = this.state.previousStatisticName != this.props.eloStatisticName
        if (needToRefresh) {
            console.log('fetch leaderboard for stat: ' + parent.props.eloStatisticName)
            engine.call('GetLeaderboardAroundPlayer', parent.props.eloStatisticName)

            if (!isUnityHost) {
                setTimeout(function () {
                    engine.trigger('refreshLeaderboard', parent.props.eloStatisticName, testLeaderboardEntriesElo, testLeaderboardEntriesAroundMeElo)
                }, 2000)
            }

            this.setState({ previousStatisticName: this.props.eloStatisticName })
        }

        if (needToRefresh || this.state.leaderboardEntries == null) {
            return (
                React.createElement('div', { style: { margin: 'auto', textAlign: 'center' } },
                    React.createElement('img', {
                        src: 'hud/img/ui/loading-small.gif',
                    })
                )
            )
        }

        if (this.state.leaderboardEntries.length == 0) {
            return (
                React.createElement('div', { style: { margin: 'auto', textAlign: 'center' } },
                    loc('no_entries_found', 'No entries found')
                )
            )
        }

        console.log('render leaderboard for stat: ' + this.props.eloStatisticName + ', previously was looking at: ' + this.state.previousStatisticName + ', needToRefresh: ' + needToRefresh + ', entriesLength: ' + this.state.leaderboardEntries.length)

        var showCollectionValue = parent.props.eloStatisticName == "collectionValue" || parent.props.eloStatisticName == "countryCollectionValue"
        var showCountries = parent.props.eloStatisticName == "countryCollectionValue"
        var showXp = _.endsWith(parent.props.eloStatisticName, 'Xp')
        var showWins = _.endsWith(parent.props.eloStatisticName, 'rankedWinsThisSeason') || parent.props.eloStatisticName == 'vipTotalMatchmadeWins'
        var showClassicWins = _.endsWith(parent.props.eloStatisticName, 'classicWinsThisSeason')
        var showBehaviorScore = _.endsWith(parent.props.eloStatisticName, 'behaviorScore')
        var showTopFinishes = parent.props.eloStatisticName == "weeklyChallengeFirstPlaceWins"
        var showTop100Finishes = parent.props.eloStatisticName == "weeklyChallengeWins"
        var showGuildWarVictoryPoints = parent.props.eloStatisticName == "guildWarVictoryPoints"
        var showGuildWarWins = parent.props.eloStatisticName == "guildWarWins"
        var showGuildXp = parent.props.eloStatisticName == "guildXp"
        var isVipTotalMatchmadeWins = parent.props.eloStatisticName == 'vipTotalMatchmadeWins'
        var eventPoints = parent.props.eloStatisticName == 'eventPoints'
        var ladderPoints = parent.props.eloStatisticName == 'ladderPoints'
        var isMainLeaderboard = parent.props.eloStatisticName == 'overallEloThisSeasonAtLeastOneGamePlayed'

        var showLevel = true
        var wideNames = (showCollectionValue || showBehaviorScore || showTopFinishes || showTop100Finishes
            || showGuildWarVictoryPoints || showGuildWarWins || showGuildXp)

        var showElo = true
        if (showClassicWins || showWins || showCountries || showCollectionValue || showBehaviorScore
            || showGuildWarVictoryPoints || showGuildWarWins || showGuildXp) {
            showElo = false
        }

        if (showCollectionValue || showBehaviorScore || showTopFinishes || showTop100Finishes) {
            showLevel = false
        }

        if (showGuildXp) {
            showXp = false
        }

        var isGuildStat = (showGuildWarVictoryPoints || showGuildWarWins || showGuildXp)

        var hideCountry = false
        if (isGuildStat) {
            hideCountry = true
        }

        var isZero = false
        this.state.leaderboardEntriesAroundMe.map(function (entry, index) {
            //var isSelf = entry.name == globalState.savedUsername
            //if (isSelf && entry.elo == 0)
            //    isZero = true

            if (entry.elo == 0)
                isZero = true

            if (showGuildWarVictoryPoints && entry.guildWarVictoryPoints == 0)
                isZero = true

            console.log("leaderboard around me, name: " + entry.name + ", elo: " + entry.elo)
        })

        var showLeaderboardAroundMe = this.state.leaderboardEntriesAroundMe.length > 0 && !isVipTotalMatchmadeWins

        var leaderboardHeight = '45vh'
        if (!showLeaderboardAroundMe) {
            leaderboardHeight = getFullLeaderboardHeight()
        }

        // https://www.delftstack.com/howto/javascript/javascript-get-week-number/
        // Smelly copy & pasted in cloudscript
        var now = new Date();
        var oneJan = new Date(now.getFullYear(), 0, 1);
        var numberOfDays = Math.floor((now - oneJan) / (24 * 60 * 60 * 1000));
        var weekNumber = Math.ceil((now.getDay() + 1 + numberOfDays) / 7);
        var ladderPointsBonus = weekNumber * 0.02
        var ladderPointsMultiplier = (1.00 + weekNumber * 0.02)

        return (
            React.createElement('div', { id: 'Leaderboard' },
                React.createElement('table', {
                    ref: 'leaderboard', className: 'leaderboard main-leaderboard scrollable',
                    style: {
                        overflowY: 'auto',
                        height: leaderboardHeight,
                        display: 'block'
                    }
                },
                    React.createElement('thead', {},
                        React.createElement('tr', {},
                            React.createElement('td', { className: 'rank' }, loc('leaderboard_rank', "Rank")),
                            showCountries && React.createElement('td', { className: 'unclickable name' }, loc('country', "Country")),
                            !showCountries && React.createElement('td', { className: 'unclickable name' }, loc('player', "Player")),
                            !showCountries && !hideCountry && React.createElement('td', { className: 'unclickable country' }, loc('country', "Country")),
                            showLevel && React.createElement('td', {
                                className: 'level',
                                onMouseDown: function (event) {
                                    engine.call('GetLeaderboardAroundPlayer', parent.props.statisticName)
                                    if (!isUnityHost)
                                        engine.trigger('refreshLeaderboard', parent.props.statisticName, testLeaderboardEntries, testLeaderboardEntriesAroundMe)
                                }
                            },
                                loc('level', "Level"),
                                (parent.state.selectedColumn == "level" ? React.createElement('img', { style: { height: '16px', width: '16px' }, src: 'hud/img/small-icons/sort-triangle.png' }) : "")
                            ),
                            isMainLeaderboard && React.createElement('td', {
                                className: 'elo simple-tooltip flipped-y'
                            },
                                locName('ladder_points', "Ladder Points"),
                                React.createElement('span', {
                                    className: 'tooltiptext wide',
                                    dangerouslySetInnerHTML: {
                                        __html: loc('ladder_points', 'Ladder Points (LP) are earned by the top 100 ranked players each week.')
                                    }
                                })
                            ),
                            showElo && !showXp && !showCollectionValue && React.createElement('td', {
                                onMouseDown: function (event) {
                                    engine.call('GetLeaderboardAroundPlayer', parent.props.eloStatisticName)
                                    if (!isUnityHost)
                                        engine.trigger('refreshLeaderboard', parent.props.eloStatisticName, testLeaderboardEntriesElo, testLeaderboardEntriesAroundMeElo)
                                }
                            },
                                loc('rating', "Rating"),
                                (parent.state.selectedColumn == "elo" ? React.createElement('img', { style: { height: '16px', width: '16px' }, src: 'hud/img/small-icons/sort-triangle.png' }) : "")
                            ),
                            showElo && !showXp && !showCountries && showCollectionValue && React.createElement('td', {
                                className: 'unclickable'
                            },
                                loc('rating', "Rating")
                            ),
                            showXp && React.createElement('td', {
                                className: 'unclickable'
                            },
                                loc('xp', "Xp")
                            ),
                            showGuildXp && React.createElement('td', {
                                className: 'unclickable'
                            },
                                loc('gxp', "GXP")
                            ),
                            showBehaviorScore && React.createElement('td', {
                                className: 'level unclickable'
                            },
                                loc('statistic_behaviorScore', "Behavior score")
                            ),
                            showTopFinishes && React.createElement('td', {
                                className: 'level unclickable'
                            },
                                loc('statistic_weeklyChallengeFirstPlaceWins', "1st Place Finishes")
                            ),
                            showTop100Finishes && React.createElement('td', {
                                className: 'level unclickable'
                            },
                                loc('statistic_weeklyChallengeWins', "Top 100 Finishes")
                            ),
                            showGuildWarVictoryPoints && React.createElement('td', {
                                className: 'level unclickable'
                            },
                                loc('statistic_guildWarVictoryPoints', "Guild War Victory Points")
                            ),
                            showGuildWarWins && React.createElement('td', {
                                className: 'level unclickable'
                            },
                                loc('statistic_guildWarWins', "Guild War Wins")
                            ),
                            eventPoints && React.createElement('td', {
                                className: 'level unclickable'
                            },
                                locName('event_points', "Event Points")
                            ),
                            ladderPoints && React.createElement('td', {
                                className: 'level simple-tooltip flipped flipped-y'
                            },
                                locName('ladder_points', "Ladder Points"),
                                React.createElement('span', {
                                    className: 'tooltiptext wide',
                                    dangerouslySetInnerHTML: {
                                        __html: loc('ladder_points', 'Ladder Points (LP) are earned by the top 100 ranked players each week.',
                                            [
                                                100,
                                                '1-100'
                                            ])
                                    }
                                })
                            ),
                            showWins && React.createElement('td', {
                                className: 'unclickable'
                            },
                                !isVipTotalMatchmadeWins && loc('statistic_rankedWinsThisSeason', "Ranked Wins"),
                                isVipTotalMatchmadeWins && loc('wins', "Wins")
                            ),
                            showClassicWins && React.createElement('td', {
                                className: 'unclickable'
                            },
                                loc('statistic_classicWinsThisSeason', "Classic Wins")
                            ),
                            showCollectionValue && React.createElement('td', {
                                className: 'level unclickable' + (showCountries ? ' wide' : ''),
                            },
                                loc('collection_value', "Collection Value")
                            )
                        )
                    ),
                    React.createElement('tbody', { className: 'addspace' },
                        React.createElement('tr', { style: { height: '12px' } }, React.createElement('td', { style: { background: 'rgba(0, 0, 0, 0.5)' }, colSpan: '5' })),
                        this.state.leaderboardEntries.map(function (entry, index) {
                            var isSelf = entry.name == globalState.savedUsername
                            isSelf |= (isGuildStat && entry.name == globalState.myGuildName)
                            var green = isSelf || entry.isFriend

                            //console.log('Rendering leaderboard entry with name: ' + entry.name)
                            return React.createElement('tr', { className: isSelf ? 'highlighted' : '' },
                                React.createElement('td', { className: 'rank' }, entry.rank),
                                React.createElement('td', {
                                    className: wideNames ? 'name wide' : 'name',
                                    onMouseDown: function (e) {
                                        var left = e.nativeEvent.clientX
                                        var top = e.nativeEvent.clientY

                                        if (e.nativeEvent.which == 2) return // v2.22 fix

                                        if (isGuildStat)
                                            openContextMenu(entry.playFabId, entry.name, rightClickGuildLeaderboardEntryMenu, left, top)
                                        else
                                            openContextMenu(entry.playFabId, entry.name, rightClickLeaderboardEntryMenu, left, top)
                                    },
                                },
                                    !isGuildStat && !showCountries && React.createElement('span', { className: getAvatarStacksClass(entry.avatarStacks) },
                                        React.createElement('img', { src: 'hud/img/' + entry.avatar })
                                    ),
                                    isGuildStat && !showCountries && React.createElement('span', { className: getGuildAvatarStacksClass(entry.avatarStacks) },
                                        React.createElement('img', { src: 'hud/img/' + entry.avatar })
                                    ),
                                    showCountries && !hideCountry && React.createElement('span', { className: 'simple-tooltip flag-icon flag-icon-' + entry.countryCode },
                                        React.createElement('span', { className: 'tooltiptext' }, entry.countryName)
                                    ),
                                    ' ',
                                    green && React.createElement('span', { style: { color: '#81ff10' } }, entry.name),
                                    !green && React.createElement('span', {}, entry.name),
                                    entry.guildAbbreviation && React.createElement('span', { className: 'guild-abbr' }, entry.guildAbbreviation)
                                ),
                                !showCountries && !hideCountry && React.createElement('td', { className: 'country' }, 
                                    React.createElement('span', { className: 'simple-tooltip flag-icon flag-icon-' + entry.countryCode },
                                        React.createElement('span', { className: 'tooltiptext' }, entry.countryName)
                                    )
                                ),
                                showLevel && React.createElement('td', {},
                                    React.createElement('div', {
                                        className: "progress-container",
                                        style: { width: '128px', height: '20px' }
                                    },
                                        React.createElement('div', {
                                            className: "progress-bar custom", style: {
                                                width: (100 * entry.levelProgress) + "%",
                                            }
                                        }),
                                        (entry.level > 0) && React.createElement('span', { className: 'value' }, "Level " + entry.level),
                                        React.createElement('span', { className: 'hidden' }, entry.totalXp) // for sorting
                                    )
                                ),
                                isMainLeaderboard && React.createElement('td', {},
                                    React.createElement('span', { style: { position: 'relative' } }, entry.ladderPoints)
                                ),
                                showElo && !showXp && !showCountries && React.createElement('td', { className: 'elo' },
                                    getRatingImage(entry.elo) && React.createElement('img', { src: getRatingImage(entry.elo) }),
                                    getRatingImage(entry.elo) && React.createElement('span', {
                                        className: 'rating-numeral', style: {
                                            right: '20px', marginRight: '-25px', width: '20px', display: 'inline-block'
                                        }
                                    }, getRatingDivisionNumeral(entry.elo)),
                                    React.createElement('span', { style: { position: 'relative' } }, entry.elo)
                                ),
                                showXp && React.createElement('td', { className: 'elo' },
                                    entry.totalXp
                                ),
                                showGuildXp && React.createElement('td', { className: 'elo' },
                                    entry.guildXp
                                ),
                                showBehaviorScore && React.createElement('td', { className: 'elo' },
                                    (entry.behaviorScore / 10).toFixed(1)
                                ),
                                showTopFinishes && React.createElement('td', { className: 'elo' },
                                    entry.weeklyChallengeFirstPlaceWins
                                ),
                                showTop100Finishes && React.createElement('td', { className: 'elo' },
                                    entry.weeklyChallengeWins
                                ),
                                showGuildWarVictoryPoints && React.createElement('td', { className: 'elo' },
                                    entry.guildWarVictoryPoints
                                ),
                                showGuildWarWins && React.createElement('td', { className: 'elo' },
                                    entry.guildWarWins
                                ),
                                eventPoints && React.createElement('td', { className: 'elo' },
                                    entry.eventPoints
                                ),
                                ladderPoints && React.createElement('td', { className: 'elo' },
                                    entry.ladderPoints
                                ),
                                showWins && React.createElement('td', { className: 'elo' },
                                    !isVipTotalMatchmadeWins && entry.rankedWinsThisSeason,
                                    isVipTotalMatchmadeWins && entry.wins
                                ),
                                showClassicWins && React.createElement('td', { className: 'elo' },
                                    entry.classicWinsThisSeason
                                ),
                                showCollectionValue && React.createElement('td', { className: 'level' },
                                    entry.collectionValue
                                )
                            )
                        })
                    )
                ),
                !isZero && !showCountries && showLeaderboardAroundMe && React.createElement('table', {
                    className: 'leaderboard scrollable', style: {
                        //width: 'calc(100% - 10px)'
                        //borderRight: '10px solid transparent'
                        //borderRight: '20px solid #1e1e1e' /* HACK */
                        borderRight: '10px solid #1e1e1e' /* HACK */
                    }
                },
                    React.createElement('tbody', { className: 'addspace' },
                        React.createElement('tr', { style: { height: '12px' } }, React.createElement('td', { style: { background: 'rgba(0, 0, 0, 0.5)' }, colSpan: '5' })),
                        this.state.leaderboardEntriesAroundMe.map(function (entry, index) {
                            var isSelf = entry.name == globalState.savedUsername
                            isSelf |= (isGuildStat && entry.name == globalState.myGuildName)
                            var green = isSelf || entry.isFriend

                            //console.log('Rendering leaderboard entry with name: ' + entry.name)
                            return React.createElement('tr', { className: isSelf ? 'highlighted' : '' },
                                React.createElement('td', { className: 'rank' }, entry.rank),
                                React.createElement('td', {
                                    className: wideNames ? 'name wide' : 'name',
                                    onMouseDown: function (e) {
                                        var left = e.nativeEvent.clientX
                                        var top = e.nativeEvent.clientY

                                        if (e.nativeEvent.which == 2) return // v2.22 fix

                                        if (isGuildStat)
                                            openContextMenu(entry.playFabId, entry.name, rightClickGuildLeaderboardEntryMenu, left, top)
                                        else
                                            openContextMenu(entry.playFabId, entry.name, rightClickLeaderboardEntryMenu, left, top)
                                    }
                                },
                                    !isGuildStat && React.createElement('span', { className: getAvatarStacksClass(entry.avatarStacks) },
                                        React.createElement('img', { src: 'hud/img/' + entry.avatar })
                                    ),
                                    isGuildStat && React.createElement('span', { className: getGuildAvatarStacksClass(entry.avatarStacks) },
                                        React.createElement('img', { src: 'hud/img/' + entry.avatar })
                                    ),
                                    ' ',
                                    green && React.createElement('span', { style: { color: '#81ff10' } }, entry.name),
                                    !green && React.createElement('span', {}, entry.name),
                                    entry.guildAbbreviation && React.createElement('span', { className: 'guild-abbr' }, entry.guildAbbreviation)
                                ),
                                !hideCountry && React.createElement('td', { className: 'country' },
                                    React.createElement('span', { className: 'simple-tooltip flag-icon flag-icon-' + entry.countryCode },
                                        React.createElement('span', { className: 'tooltiptext' }, entry.countryName)
                                    )
                                ),
                                showLevel && React.createElement('td', { className: 'level' },
                                    React.createElement('div', {
                                        className: "progress-container",
                                        style: { width: '128px', height: '20px' }
                                    },
                                        React.createElement('div', {
                                            className: "progress-bar custom", style: {
                                                width: (100 * entry.levelProgress) + "%",
                                            }
                                        }),
                                        (entry.level > 0) && React.createElement('span', { className: 'value' }, "Level " + entry.level),
                                        React.createElement('span', { className: 'hidden' }, entry.totalXp) // for sorting
                                    )
                                ),
                                isMainLeaderboard && React.createElement('td', { className: 'elo' },
                                    entry.ladderPoints
                                ),
                                showElo && !showXp && !showCountries && React.createElement('td', { className: 'elo' },
                                    getRatingImage(entry.elo) && React.createElement('img', { src: getRatingImage(entry.elo) }),
                                    getRatingImage(entry.elo) && React.createElement('span', {
                                        className: 'rating-numeral', style: {
                                            right: '20px', marginRight: '-25px', width: '20px', display: 'inline-block'
                                        }
                                    }, getRatingDivisionNumeral(entry.elo)),
                                    entry.elo
                                ),
                                showXp && React.createElement('td', { className: 'elo' },
                                    entry.totalXp
                                ),
                                showGuildXp && React.createElement('td', { className: 'elo' },
                                    entry.guildXp
                                ),
                                showBehaviorScore && React.createElement('td', { className: 'level' },
                                    (entry.behaviorScore / 10).toFixed(1)
                                ),
                                showTopFinishes && React.createElement('td', {
                                    className: 'level unclickable'
                                },
                                    entry.weeklyChallengeFirstPlaceWins
                                ),
                                showTop100Finishes && React.createElement('td', {
                                    className: 'level unclickable'
                                },
                                    entry.weeklyChallengeWins
                                ),
                                showGuildWarVictoryPoints && React.createElement('td', {
                                    className: 'level unclickable'
                                },
                                    entry.guildWarVictoryPoints
                                ),
                                showGuildWarWins && React.createElement('td', {
                                    className: 'level unclickable'
                                },
                                    entry.guildWarWins
                                ),
                                eventPoints && React.createElement('td', { className: 'elo' },
                                    entry.eventPoints
                                ),
                                ladderPoints && React.createElement('td', { className: 'elo' },
                                    entry.ladderPoints
                                ),
                                showWins && React.createElement('td', { className: 'elo' },
                                    entry.rankedWinsThisSeason
                                ),
                                showClassicWins && React.createElement('td', { className: 'elo' },
                                    entry.classicWinsThisSeason
                                ),
                                showCollectionValue && React.createElement('td', { className: 'level' },
                                    entry.collectionValue
                                )
                            )
                        })
                    )
                )
            )
        )
    }
})

var LeaderboardOpenings = React.createClass({
    propTypes: {
    },
    getInitialState: function () {
        return {
            leaderboard: globalState.savedLeaderboardOpenings,
            filterSearch: ''
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshLeaderboardOpenings = function (leaderboard) {
            parent.setState({ leaderboard: leaderboard })
        }
    },
    handleSearchChange: function (e) {
        this.setState({ filterSearch: e.target.value })
    },
    render: function () {
        var parent = this

        var leaderboardHeight = getFullLeaderboardHeight()

        //console.log('render leaderboard openings with leaderboard: ' + JSON.stringify(this.state.leaderboard))

        var showLoading = !this.state.leaderboard.loaded

        var leaderboardKeys = []
        if (!showLoading)
            leaderboardKeys = Object.keys(this.state.leaderboard.rows)

        // Refresh every time, then just let the client throttle it
        engine.call('OnRenderLeaderboardOpenings')

        var nextResetDateString = ''
        if (!showLoading) {
            nextResetDateString = this.state.leaderboard.nextResetDateString
        }

        var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160

        return (
            React.createElement('div', {},
                React.createElement('div', { className: 'top-games-top-spacer', style: { height: '70px' } },
                    React.createElement('h1', { style: { float: 'left', padding: '0' } },
                        React.createElement('img', {
                            style: { verticalAlign: 'middle', marginRight: '12px', display: 'inline-block' },
                            src: 'hud/img/icons/TopGames.png'
                        }),
                        React.createElement('div', {
                            style: { display: 'inline-block', verticalAlign: 'middle', }
                        },
                            locName('leaderboard_top_games', 'Top Games'),
                            React.createElement('span', {
                                className: 'simple-tooltip flipped-y',
                                style: {
                                    fontSize: '14px',
                                    color: '#c0c0c0',
                                    marginLeft: '6px'
                                },
                            },
                                '[?]',
                                //React.createElement('img', { src: 'hud/img/small-icons/help.png' }),
                                React.createElement('span', {
                                    className: 'tooltiptext extra-wide',
                                    dangerouslySetInnerHTML: {
                                        __html: loc('leaderboard_top_games_long', 'Helpful tooltip explaining stuff')
                                    },
                                    style: {
                                        marginLeft: '20px'
                                    }
                                })
                            ),
                            React.createElement('div', {
                                className: 'top-games-intro',
                                style: { fontSize: '16px', color: '#c0c0c0' },
                                dangerouslySetInnerHTML: {
                                    __html: loc('leaderboard_top_games', "Featuring this week's top ranked games for every fighter.<br>Next reset: " + nextResetDateString, [nextResetDateString])
                                }
                            })
                        )
                    )
                ),
                !showLoading && React.createElement('input', {
                    ref: 'input',
                    className: 'unit-search',
                    placeholder: loc('search', 'Search'),
                    onChange: this.handleSearchChange,
                    maxLength: "50",
                    style: {
                        position: 'absolute',
                        right: '0',
                        top: '25px',
                    }
                }),
                showLoading && React.createElement('div', { style: { margin: 'auto', textAlign: 'center' } },
                    React.createElement('img', {
                        src: 'hud/img/ui/loading-small.gif',
                    })
                ),
                !showLoading && React.createElement('div', { id: 'OpeningsLeaderboard' },
		            React.createElement('table', {
			            ref: 'leaderboard', className: 'leaderboard scrollable',
			            style: {
				            overflowY: 'auto',
				            height: leaderboardHeight,
				            display: 'block'
			            }
		            },
			            React.createElement('thead', {},
				            React.createElement('tr', {},
                                React.createElement('td', { className: 'unclickable', style: { width: '50px' } }, loc('rank', 'Rank')),
                                React.createElement('td', { className: 'unclickable', style: { width: '150px' } }, loc('opening', 'Opening')),
                                React.createElement('td', { className: 'unclickable', style: { width: '250px' } }, loc('wave', "Wave") + ' 10'),
                                React.createElement('td', { className: 'unclickable', style: { width: '150px' } }, loc('player', "Player")),
                                React.createElement('td', { className: 'unclickable', style: { width: '150px' } }, loc('country', "Country")),
                                React.createElement('td', { className: 'unclickable', style: { width: uhd ? '400px' : '150px' } }, loc('game_rating', "Game Rating")),
                                React.createElement('td', { className: 'unclickable', style: { width: uhd ? '550px ' : '150px' } }, React.createElement('img',
                                    {
                                        src: 'hud/img/small-icons/date.png',
                                        style: { height: '16px', width: '16px' }
                                    })
                                )
				            )
			            ),
			            React.createElement('tbody', { className: 'addspace' },
				            React.createElement('tr', { style: { height: '12px' } }, React.createElement('td', { style: { background: 'rgba(0, 0, 0, 0.5)' }, colSpan: '7' })),
                            leaderboardKeys.map(function (unitType, index) {

                                var entry = parent.state.leaderboard.rows[unitType]
					            //console.log(unitType + ': ' + JSON.stringify(entry))			

                                if (parent.state.filterSearch.length > 0 && (entry.unitName.toLowerCase().indexOf(parent.state.filterSearch.toLowerCase()) == -1)) return
					
                                return React.createElement('tr', {
                                    onMouseDown: function (e) {
                                        if (e.nativeEvent.which == 2) return // v2.22 fix

                                        console.log('OnRequestOpeningMatch ' + entry.data.u)
                                        engine.call('OnRequestOpeningMatch', entry.data.u)

                                        if (isBrowserTest) {
                                            engine.trigger('loadView', 'openingsmatchhistory')
                                        }
                                    }
                                },
                                    React.createElement('td', { className: 'rank' },
                                        index + 1
                                    ),
                                    React.createElement('td', { className: 'name' },
                                        React.createElement('img', { style: { height: '24px', width: '24px' }, src: 'hud/img/' + entry.unitIcon }),
                                        entry.unitName
                                    ),
                                    entry.data.nw == 0 && React.createElement('td', { className: 'score' }),
                                    entry.data.nw > 0 && React.createElement('td', { className: 'score' },
                                        React.createElement('span', { className: 'simple-tooltip' },
                                            React.createElement('img', { style: { height: '16px', width: '16px', padding: '0' }, src: 'hud/img/small-icons/powerscore.png' }),
                                            entry.data.nw,
                                            React.createElement('span', { className: 'tooltiptext' }, loc('power_score', 'Power Score'))
                                        ),
                                        ' ',
                                        React.createElement('img', { style: { height: '16px', width: '16px', padding: '0' }, src: 'hud/img/icons/Worker.png' }),
                                        entry.data.w
                                    ),
                                    React.createElement('td', { className: 'name' },
                                        entry.data.a && React.createElement('img', { src: 'hud/img/' + entry.data.a }),
                                        entry.data.n,
                                        entry.data.g && React.createElement('span', { className: 'guild-abbr' }, entry.data.g)
                                    ),
                                    React.createElement('td', { className: 'country' },
                                        !entry.data.c && '',
                                        entry.data.c && React.createElement('span', { className: 'simple-tooltip flag-icon flag-icon-' + entry.data.c },
                                            React.createElement('span', { className: 'tooltiptext' }, entry.countryName)
                                        )
                                    ),
                                    React.createElement('td', { className: 'rating' },
                                        getRatingImage(entry.data.r) && React.createElement('img', {
                                            src: getRatingImage(entry.data.r),
                                            style: {
                                                opacity: entry.data.r == 0 ? '0' : ''
                                            }
                                        }),
                                        entry.data.r > 0 && getRatingImage(entry.data.r) && React.createElement('span', {
                                            className: 'rating-numeral', style: {
                                                right: '20px', marginRight: '-25px', width: '20px', display: 'inline-block'
                                            }
                                        }, getRatingDivisionNumeral(entry.data.r)),
                                        entry.data.r > 0 && React.createElement('span', { style: { position: 'relative' } }, entry.data.r)
                                    ),
                                    React.createElement('td', { className: 'date' },
                                        entry.timeString
                                    )
					            )
				            })
			            )
		            )
	            )
            )
        )
    }
})