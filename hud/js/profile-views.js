// Profile (your full profile)
// ===============================================================================

var ProfileOverview = React.createClass({
    getInitialState: function () {

        var savedQueueType = 0
        // v8.00.4 maybe
        if (globalState.mainProfile != null && globalState.mainProfile.advancedProfile != null)
            savedQueueType = globalState.mainProfile.advancedProfile.mainQueueType

        return {
            placeholderText: globalState.currentProfileLoadingName ? loc('loading_profile', "Loading " + name + "'s profile...", [globalState.currentProfileLoadingName]) : "",
            profile: globalState.mainProfile,
            loadingPastStats: false,
            noGamesPlayed: false,
            playstylePointsCache: {},
            queueType: savedQueueType,
            searchInputText: "",
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.showProfileLoading = function (name) {
            console.log('profile-views: showProfileLoading ' + name)
            parent.setState({
                placeholderText: loc('loading_profile', "Loading " + name + "'s profile...", [name]),
            })
        }

        bindings.refreshProfile = function (profile) {
            console.log('profile-views: refreshProfile ' + profile.name)

            parent.setState({
                placeholderText: "",
                profile: profile,
                loadingPastStats: false,
                queueType: profile.advancedProfile.mainQueueType,
            })

            globalState.currentProfileLoadingName = "" // Set it to "" because it is no longer loading now
        }

        console.log("profile componentWillMount")

        if (!isUnityHost && parent.state.profile.name != testProfile.name) {
            engine.trigger('showProfileLoading', "Lisk")
            setTimeout(function () {
                engine.trigger('refreshProfile', testProfile)
            }, 1000)
        }
    },
    componentDidMount: function () {
        console.log("profile componentDidMount --> createChart()")
        this.createChart()
    },
    componentDidUpdate: function () {
        console.log("profile componentDidUpdate --> createChart()")
        this.createChart()
    },
    handleSearchChange: function (e) {
        this.setState({ searchInputText: e.target.value })
    },
    handleChange: function (e) {
        if (e.key === 'Enter') {
            if (this.state.searchInputText == "") {
                return;
            }

            var searchedName = this.state.searchInputText

            //debugger; // neat trick for debugging!!!

            e.target.value = "" // clear the search box

            // Spinner
            this.setState({
                searchInputText: '',
                placeholderText: loc('loading_profile', "Loading " + searchedName + "'s profile...", [searchedName])
            })

            var currentProfilePlayFabId = this.state.profile.playFabId

            console.log('try to get profile for player: ' + searchedName + ', currentProfilePlayFabId: ' + currentProfilePlayFabId)
            engine.call('GetProfileForPlayerDisplayName', searchedName, currentProfilePlayFabId)
        }
    },
    getExtremefiedScore: function (score) {
        //return score
        return Math.max(0, Math.min(1, Math.pow(score + 1, 1.6) / 1.25 - 1))
    },
    createChart: function () {
        var parent = this

        var dataToRender = []
        var chart = this.refs.spider
        if (chart == null || chart.length == 0) return

        if (parent.state.profile.advancedProfile.advancedProfiles == null) {
            console.log('null advancedProfiles')
            return
        }
        var advancedProfileEntry = parent.state.profile.advancedProfile.advancedProfiles[parent.state.queueType]

        if (advancedProfileEntry.playstylePoints == null) return

        // Pre-process rescaling to make it feel less extreme at the edges (for a more rounded spider chart)
        // see https://docs.google.com/document/d/1TcWsaRuV4Unz0TcZg_sDFlG5jGQpymMKCW_vYo33R6M/edit
        var total = 0
        var edge = 0
        var overEdgeOverflow = 0
        var underEdgeSum = 0

        for (var playstyle in advancedProfileEntry.playstylePoints) {
            total += advancedProfileEntry.playstylePoints[playstyle].score
        }
        edge = total / 3

        for (var playstyle in advancedProfileEntry.playstylePoints) {
            if (advancedProfileEntry.playstylePoints[playstyle].score >= edge)
                overEdgeOverflow += advancedProfileEntry.playstylePoints[playstyle].score - edge
            else
                underEdgeSum += advancedProfileEntry.playstylePoints[playstyle].score
        }

        var multiplier = 1 + (1 * overEdgeOverflow) / underEdgeSum

        //console.log('noGamesPlayed: ' + parent.state.noGamesPlayed)
        //console.log('total: ' + total)
        //console.log('overEdgeOverflow: ' + overEdgeOverflow)
        //console.log('underEdgeSum: ' + underEdgeSum)
        //console.log('edge: ' + edge)
        //console.log('multiplier: ' + multiplier)

        if (total == 0 && !parent.state.noGamesPlayed) {
            parent.setState({ noGamesPlayed: true })
            return
        }
        else if (total > 0 && parent.state.noGamesPlayed) {
            parent.setState({ noGamesPlayed: false })
        }

        if (total == 0) return

        var performanceMultiplier = (1 + ((total / advancedProfileEntry.adjustedGamesThisSeason) / 100)).toFixed(2)
        //console.log('adjustedGamesThisSeason: ' + advancedProfileEntry.adjustedGamesThisSeason)
        //console.log('performanceMultiplier: ' + performanceMultiplier)
        for (var playstyle in advancedProfileEntry.playstylePoints) {
            //console.log('original ' + playstyle + ': ' + advancedProfileEntry.playstylePoints[playstyle].score)
            advancedProfileEntry.playstylePoints[playstyle].score *= performanceMultiplier
            //console.log('adjusted ' + playstyle + ': ' + advancedProfileEntry.playstylePoints[playstyle].score)
        }

        var refreshPlaystylePointsCache = false
        var playstylePoints = {}
        for (var playstyle in advancedProfileEntry.playstylePoints) {
            advancedProfileEntry.playstylePoints[playstyle].score = Math.min(1, multiplier * advancedProfileEntry.playstylePoints[playstyle].score / edge)
            //console.log('advancedProfileEntry.playstylePoints[' + playstyle + '].score: ' + advancedProfileEntry.playstylePoints[playstyle].score)

            playstylePoints[playstyle] = advancedProfileEntry.playstylePoints[playstyle].score

            if (parent.state.playstylePointsCache == null) {
                console.log('playstylePointsCache was null, so refresh state after the loop')
                refreshPlaystylePointsCache = true
                continue
            }

            var delta = Math.abs(advancedProfileEntry.playstylePoints[playstyle].score - parent.state.playstylePointsCache[playstyle])
            // v5.00.ptr7 probably we should just check if it's close enough
            // otherwise we infinite loop if we have some floating point error I think
            //if (parent.state.playstylePointsCache[playstyle] != advancedProfileEntry.playstylePoints[playstyle].score) {

            var isCacheEntryUndefined = parent.state.playstylePointsCache[playstyle] === undefined
            if (isCacheEntryUndefined || delta >= 0.03) {
                if (isCacheEntryUndefined) {
                    //console.log('cached was undefined, recomputed was: ' + advancedProfileEntry.playstylePoints[playstyle].score
                    //    + ', which was a bit different, so refreshPlaystylePointsCache set to true')
                } else {
                    //console.log('cached was ' + parent.state.playstylePointsCache[playstyle] + ', recomputed was: ' + advancedProfileEntry.playstylePoints[playstyle].score
                    //    + ', which was a bit different, so refreshPlaystylePointsCache set to true')
                }
                refreshPlaystylePointsCache = true
            } else {
                //console.log('cached was ' + parent.state.playstylePointsCache[playstyle] + ', recomputed was: ' + advancedProfileEntry.playstylePoints[playstyle].score
                //    + ', delta was: ' + delta + ', which was close enough, so dont refreshPlaystylePointsCache set to true')
            }
        }

        if (refreshPlaystylePointsCache)
            parent.setState({ playstylePointsCache: playstylePoints })

        var myChart = new Chart(chart, {
            type: 'radar',
            data: {
                labels: [
                    //loc('playstyle_economist', 'Economist'),
                    //loc('playstyle_kingsguard', 'Kingsguard'),
                    //loc('playstyle_architect', 'Architect'),
                    //loc('playstyle_guardian', 'Guardian'),
                    //loc('playstyle_breaker', 'Breaker'),
                    //loc('playstyle_tactician', 'Tactician')
                    'Economist',
                    'Kingsguard',
                    'Architect',
                    'Guardian',
                    'Breaker',
                    'Tactician'
                ],
                datasets: [{
                    data: [
                        parent.getExtremefiedScore(advancedProfileEntry.playstylePoints['Economist'].score),
                        parent.getExtremefiedScore(advancedProfileEntry.playstylePoints['Kingsguard'].score),
                        parent.getExtremefiedScore(advancedProfileEntry.playstylePoints['Architect'].score),
                        parent.getExtremefiedScore(advancedProfileEntry.playstylePoints['Guardian'].score),
                        parent.getExtremefiedScore(advancedProfileEntry.playstylePoints['Breaker'].score),
                        parent.getExtremefiedScore(advancedProfileEntry.playstylePoints['Tactician'].score)
                    ],
                    //backgroundColor: 'rgba(55, 89, 101, 0.75)',
                    //borderColor: 'rgba(126, 174, 191, 1)',
                    backgroundColor: 'rgba(255, 204, 0, 0.66)',
                    borderColor: 'rgba(255, 232, 140, 1)',
                    //backgroundColor: 'rgba(0, 204, 255, 0.75)',
                    //borderColor: 'rgba(0, 204, 255, 1)',
                    borderWidth: '1px'
                }],
            },
            options: {
                //responsive: false,
                //maintainAspectRatio: false,
                //aspectRatio: 1,
                animation: false,
                tooltips: { // Hides tooltips
                    enabled: false
                },
                elements: { // Hides the dots
                    point: {
                        radius: 0
                    }
                },
                legend: {
                    display: false,
                    labels: {
                        fontColor: 'transparent'
                    }
                },
                scale: {
                    ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 4,
                        stepSize: 0.25,
                        display: false,
                        suggestedMin: 0,
                        suggestedMax: 1,
                    },
                    angleLines: {
                        display: true,
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    gridLines: {
                        color: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.66)'],
                    },
                    pointLabels: {
                        fontColor: 'transparent',
                    }
                }
            }
        });
    },
    render: function () {
        if (this.state.placeholderText && this.state.placeholderText.length > 0) {
            console.log('profile-views: render placeholder: ' + this.state.placeholderText)
            //return React.createElement('div', { style: { fontSize: '2rem' } }, this.state.placeholderText)

            return React.createElement('div', { className: 'profile-container' },
                React.createElement('div', {
                    className: 'profile-main', style: { textAlign: 'center' }
                },
                    React.createElement('img', {
                        src: 'hud/img/ui/loading-small.gif',
                    })
                )
            )
        }

        // If this gets spammed, we have an optimization problem
        // note: this currently gets spammed when typing in the input box for profile search
        // (that should probably fixed, since that currently causes lag when it shouldn't)
        //console.log('profile-views: render full: ' + JSON.stringify(this.state.profile))

        var parent = this
        var highestElo = 0
        var highestPeakElo = 0
        var highestPeakEloThisSeason = 0
        var highestWinRate = 0
        var lowestRank = 9999999

        // Compute highest values
        this.state.profile.stats && this.state.profile.stats.map(function (entry, index) {
            var winRate = (entry.wins + entry.losses > 0) ? ((entry.wins / (entry.wins + entry.losses)) * 100).toFixed(0) : 0
            if (Number(entry.elo) >= Number(highestElo))
                highestElo = entry.elo
            if (Number(entry.peak) >= Number(highestPeakElo))
                highestPeakElo = entry.peak
            if (Number(entry.peakThisSeason) >= Number(highestPeakEloThisSeason))
                highestPeakEloThisSeason = entry.peakThisSeason
            if (Number(winRate) >= Number(highestWinRate))
                highestWinRate = winRate
            if (Number(entry.rank) <= Number(lowestRank))
                lowestRank = entry.rank

        })

        var isSelf = this.state.profile.name == globalState.savedUsername
        var isRawIcon = _.startsWith(this.state.profile.avatar, 'data')
        var ratingImage = getRatingImage(this.state.profile.rating)
        var ratingClass = getRatingClass(this.state.profile.rating)
        var peakImage = getRatingImage(this.state.profile.peakThisSeason)
        var peakClass = getRatingClass(this.state.profile.peakThisSeason)
        var peakImageAllTime = getRatingImage(this.state.profile.peak)
        var peakClassAllTime = getRatingClass(this.state.profile.peak)
        var overallRankPercent = (Math.min(100, (this.state.profile.rank / this.state.profile.rankedTotalPlayers) * 100)).toFixed(1)
        var overallRankPercentAllTime = (Math.min(100, (this.state.profile.rankAllTime / this.state.profile.totalPlayers)) * 100).toFixed(1)
        var overallRankPercentThisSeason = (Math.min(100, (this.state.profile.rankThisSeason / this.state.profile.rankedTotalPlayers)) * 100).toFixed(1)
        var rankedWinRate = (this.state.profile.rankedWins + this.state.profile.rankedLosses > 0) ? ((this.state.profile.rankedWins / (this.state.profile.rankedWins + this.state.profile.rankedLosses)) * 100).toFixed(0) : 0
        var classicWinRate = (this.state.profile.classicWins + this.state.profile.classicLosses > 0) ? ((this.state.profile.classicWins / (this.state.profile.classicWins + this.state.profile.classicLosses)) * 100).toFixed(0) : 0
        var goals = parent.state.profile.goals

        // Build dropdown menu items
        var dropdownChoices = []
        var seasonChoices = []
        for (var i = 0; i < this.state.profile.latestSeason; i++) {
            seasonChoices[i] = this.state.profile.latestSeason - i
        }

        seasonChoices.map(function (seasonNumber, index) {

            dropdownChoices.push({
                text: seasonNumber,
                action: function () {
                    console.log("leaderboard selected " + seasonNumber)
                    var profileCopy = parent.state.profile
                    profileCopy.season = seasonNumber
                    parent.setState({
                        profile: profileCopy,
                        loadingPastStats: true,
                    })

                    engine.call('OnViewSeasonStatistics', seasonNumber)
                },
                html: loc('season', 'Season ' + getSeasonDisplayNumber(seasonNumber), [getSeasonDisplayNumber(seasonNumber)])
            })
        })

        // Queuetype dropdown (SMELLY copy and pasted some places)
        var queueTypeDropdownChoices = []
        var queueTypeKeys = Object.keys(parent.state.profile.advancedProfile.advancedProfiles)
        queueTypeKeys.map(function (entry, loopIndex) {
            var index = parseInt(queueTypeKeys[loopIndex])
            var advancedProfileAtIndex = parent.state.profile.advancedProfile.advancedProfiles[index]
            if (advancedProfileAtIndex != null) {
                //console.log('index: ' + index + ', entry: ' + entry)
                var queueName = advancedProfileAtIndex.queueName
                queueTypeDropdownChoices.push({
                    text: index,
                    action: function () {
                        console.log("queueType selected " + index + ", name: " + queueName)
                        parent.setState({ queueType: index })
                    },
                    html: queueName
                })
            }
        })

        var advancedProfileEntry = parent.state.profile.advancedProfile.advancedProfiles[parent.state.queueType]
        var gamesPlayed = this.state.profile.wins + this.state.profile.losses
        var winRate = 0
        if (gamesPlayed > 0)
            winRate = (100 * this.state.profile.wins / gamesPlayed).toFixed(0)

        // Favorite units sorting/total
        var totalUnitPoints = 0
        var unitDetails = advancedProfileEntry.unitDetails
        var unitDetailsKeys = Object.keys(unitDetails)
        //console.log('unitDetails: ' + JSON.stringify(unitDetails))

        // Picks don't include upgrades
        var unitDetailsBaseOnly = {}
        unitDetailsKeys.forEach(function (unitType) {
            if (unitDetails[unitType].isBaseForm)
                unitDetailsBaseOnly[unitType] = unitDetails[unitType]
        })
        //console.log('unitDetailsBaseOnly: ' + JSON.stringify(unitDetailsBaseOnly))
        var unitDetailsSortedByPicked = Object.keys(unitDetailsBaseOnly)
        //console.log('unitDetailsSortedByPicked: ' + JSON.stringify(unitDetailsSortedByPicked))
        if (unitDetailsSortedByPicked.length > 0) {
            unitDetailsSortedByPicked.sort(function (a, b) {
                return unitDetails[b].truePickRate - unitDetails[a].truePickRate;
            })
            for (key in unitDetails) {
                totalUnitPoints += unitDetails[key].picked
            }
        }
        //console.log('unitDetailsSortedByPicked: ' + JSON.stringify(unitDetailsSortedByPicked))

        // Openings include upgrades
        var unitDetailsSortedByOpened = Object.keys(unitDetails)
        if (unitDetailsSortedByOpened.length > 0) {
            unitDetailsSortedByOpened.sort(function (a, b) {
                return unitDetails[b].opened - unitDetails[a].opened;
            })
        }
        //console.log('unitDetailsSortedByOpened: ' + JSON.stringify(unitDetailsSortedByOpened))

        var cardTypesOwned = 0
        for (var i in this.state.profile.cards) {
            var card = this.state.profile.cards[i]
            if (card.stacks > 0)
                cardTypesOwned++
        }

        var rankedGamesThisSeason = this.state.profile.rankedWins + this.state.profile.rankedLosses

        var isUHD = globalState.screenWidth >= 1921
        var isMyProfile = this.state.profile.name == globalState.savedUsername

        //console.log('TEST: Overview queueType is: ' + parent.state.queueType + ', mainQueueType is: ' + parent.state.profile.advancedProfile.mainQueueType)
        //console.log('TEST: !this.state.loadingPastStats: ' + !this.state.loadingPastStats)
        //console.log('TEST: this.state.profile.season: ' + this.state.profile.season)
        //console.log('TEST: globalState.season: ' + globalState.season)
        //console.log('TEST: globalState.rankedDisabledMessage: ' + globalState.rankedDisabledMessage)

        return (
            React.createElement('div', { className: 'profile-container' },
                React.createElement('div', { className: 'profile-main' },
                    React.createElement('div', { className: 'vitals' },
                        this.state.profile.avatar && React.createElement('div', {
                            style: { display: 'inline-block', position: 'relative' }
                        },
                            React.createElement('div', {
                                className: 'img-container ' + getAvatarStacksClass(this.state.profile.avatarStacks) + ' bottomfix'
                            },
                                React.createElement('div', { className: 'avatar ' },
                                    React.createElement('img', {
                                        src: (isRawIcon ? this.state.profile.avatar : 'hud/img/' + this.state.profile.avatar),
                                        className: isSelf ? ' clickable' : '',
                                        onMouseDown: function (e) {
                                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness
                                            if (!isSelf) return
                                            if (globalState.isInGame) return
                                            // if ingame bail also
                                            engine.trigger('loadPopup', 'avatar')
                                        }
                                    })
                                )
                            )
                        ),
                        React.createElement('div', { className: 'identity' },
                            React.createElement('div', { className: 'name' },
                                this.state.profile.name,
                                ' ',
                                this.state.profile.countryCode && React.createElement('span', {
                                    className: 'simple-tooltip flag-icon flag-icon-' + this.state.profile.countryCode,
                                    style: { marginRight: '4px', marginBottom: '4px', height: '32px', verticalAlign: 'bottom' }
                                },
                                    React.createElement('span', {
                                        className: 'tooltiptext no-carat', style: {
                                            top: '-14px', bottom: '0px', left: '65px'
                                        }
                                    }, this.state.profile.countryName)
                                ),
                                ' ',
                                React.createElement('div', { className: 'items badges' },
                                    this.state.profile.badges && this.state.profile.badges.map(function (entry, index) {
                                        var stacks = 0
                                        if (entry.stacks != null && entry.stacks > 0)
                                            stacks = entry.stacks

                                        if (entry.hideInProfile) return null

                                        return (
                                            React.createElement('div', {
                                                className: 'simple-tooltip flipped-y',
                                                onMouseDown: function (e) {
                                                    if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                                    showFullScreenPopup(getTrophyArt(entry))
                                                },
                                                onMouseEnter: function () {
                                                    if (stacks == 0) return

                                                    engine.call("OnMouseOverLight", index)
                                                },
                                            },
                                                React.createElement('img', { src: 'hud/img/' + entry.image, className: entry.rarity }),
                                                // No glow?
                                                //React.createElement('img', { src: 'hud/img/' + entry.image }),
                                                stacks > 1 && React.createElement('div', {
                                                    className: 'icon-text icon-stacks' + ' ' + entry.rarity
                                                }, stacks),
                                                entry.isNew && React.createElement('div', {
                                                    className: 'icon-text icon-new' + ' ' + entry.rarity
                                                }, loc('new_item', 'New!')),
                                                React.createElement('div', { className: 'tooltiptext no-carat' },
                                                    React.createElement('div', { className: entry.rarity }, entry.name),
                                                    React.createElement('div', {
                                                        dangerouslySetInnerHTML: {
                                                            __html: entry.description
                                                        }
                                                    }),
                                                    React.createElement('div', { className: 'value' }, 'Value: ' + entry.value)
                                                )
                                            )
                                        )
                                    })
                                )
                            ),
                            React.createElement('div', { className: 'guild' },
                                globalState.shopEnabled && this.state.profile.guild.length > 0 && React.createElement('span', {
                                    className: 'guild-name',
                                    onMouseDown: function (e) {
                                        if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                        console.log('click guild: ' + parent.state.profile.guildId)

                                        engine.call('OnLoadGuildProfileByGuildId', parent.state.profile.guildId)

                                        if (isBrowserTest)
                                            engine.trigger('viewGuildProfile', testGuild)
                                    }
                                },
                                    this.state.profile.guild,
                                    this.state.profile.guildMemberTitle && this.state.profile.guildMemberTitle.length > 0 && React.createElement('span', {},
                                        ' [',
                                        React.createElement('span', { className: 'guild-title' }, this.state.profile.guildMemberTitle),
                                        ']'
                                    )
                                ),
                                globalState.shopEnabled && this.state.profile.guild.length == 0 && React.createElement('span', { style: { color: '#c0c0c0' } }, loc("no_guild", "(No Guild)")),
                                React.createElement('div', {
                                    className: 'simple-tooltip', style: { display: 'block' },
                                    onMouseDown: function (e) {
                                        if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness
                                        if (!isMyProfile) return
                                        if (globalState.isInGame) return

                                        engine.call('OnEditTagline')
                                    }
                                },
                                    //React.createElement('span', { className: 'category' }, loc('tagline', "Tagline") + ": "),
                                    this.state.profile.tagline && this.state.profile.tagline.length > 0 && React.createElement('span', { className: 'value tagline' }, this.state.profile.tagline),
                                    isMyProfile && (!this.state.profile.tagline || this.state.profile.tagline.length == 0) && React.createElement('span', { className: 'value tagline' },
                                        loc('click_to_edit_tagline', "[Click to edit tagline]")
                                    ),
                                    isMyProfile && !globalState.isInGame && React.createElement('span', { className: 'tooltiptext' }, loc('edit_tagline', "Edit Tagline")),
                                    isMyProfile && globalState.isInGame && React.createElement('span', { className: 'tooltiptext' }, loc('cannot_change_setting_while_ingame', 'Cannot change while in-game'))
                                    //React.createElement('span', { className: 'tooltiptext' }, loc('tagline_how_to', "Type '/tagline Hello' in Global Chat to set your tagline."))
                                )
                            ),
                            React.createElement('div', {
                                style: { color: '#c0c0c0' }
                            },
                                React.createElement('span', { className: '' }, loc('profile_last_game', "Last Game:") + ' '),
                                React.createElement('span', {
                                    className: 'value',
                                    onMouseDown: function (e) {
                                        if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                        if (parent.state.profile.name == globalState.savedUsername)
                                            engine.call('OnTryShowPostGameStats')
                                    }
                                },
                                    this.state.profile.lastGame,
                                    (this.state.profile.winStreak != null) && Number(this.state.profile.winStreak) > 2
                                    && React.createElement('span', {},
                                        React.createElement('span', {}, " - "),
                                        React.createElement('span', { className: 'winstreak' },
                                            loc('profile_win_streak', this.state.profile.winStreak + "x Normal game win streak", [this.state.profile.winStreak])
                                        )
                                    )
                                )
                            )
                        ),
                        React.createElement('div', { className: 'profile-search-container' },
                            React.createElement('input', {
                                ref: 'input',
                                className: 'profile-search',
                                placeholder: loc('search', 'Search'),
                                onChange: this.handleSearchChange,
                                onKeyDown: this.handleChange,
                                maxLength: "50",
                            })
                        ),
                        React.createElement('div', {
                            className: 'simple-tooltip search-x',
                            style: {
                                color: 'white',
                                display: 'inline',
                                position: 'absolute',
                                right: '40px',
                                top: '30px',
                                color: 'rgba(255, 255, 255, 0.5)'
                            },
                            onMouseDown: function (e) {
                                if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                parent.refs.input.value = ''
                                parent.setState({ filterSearch: parent.refs.input.value })
                            },
                        },
                            React.createElement('img', { src: 'hud/img/small-icons/input-x.png' }),
                            React.createElement('span', { className: 'tooltiptext auto tight' }, loc('clear', 'Clear'))
                        )
                    ),
                    // Left side
                    React.createElement('div', { className: 'block' },
                        React.createElement('div', {
                            className: 'dropdown-container queue-type',
                            style: {
                                position: 'absolute',
                                top: '196px',
                                left: isUHD ? '450px' : '476px'
                            }
                        },
                            React.createElement(DropdownLinks, {
                                choices: queueTypeDropdownChoices,
                                defaultValue: advancedProfileEntry.queueName,
                                actualValue: advancedProfileEntry.queueName
                            })
                        ),
                        React.createElement('div', {},
                            React.createElement('span', { className: 'category simple-tooltip' },
                                locName('playstyle', 'Playstyle') + ":",
                                React.createElement('span', { className: 'tooltiptext' },
                                    loc('playstyle', 'Your playstyle reflects your overall strategy in recent games')
                                )
                            )
                        ),
                        React.createElement('div', { className: 'simple-tooltip' },
                            React.createElement('img', {
                                src: 'hud/img/spider/Small/IconsOverlay.png', style: {
                                    position: 'absolute', top: (isUnityHost ? '-50px' : '-35px'), left: '55px'
                                }
                            }),
                            React.createElement('span', {
                                className: 'tooltiptext no-carat playstyle-tooltip', style: { left: '400px', bottom: '-200px', width: '540px' }
                            },
                                React.createElement('div', {
                                    style: { marginBottom: '12px' }
                                },
                                    loc('playstyle', 'Your playstyle reflects your overall strategy in recent games')
                                ),
                                React.createElement('div', {},
                                    React.createElement('img', { src: 'hud/img/spider/Small/Economist.png' }),
                                    React.createElement('span', { style: { color: '#ffcc00' } },
                                        locName('playstyle_economist', 'Economist'),
                                        !parent.state.noGamesPlayed && (' (' + (100 * parent.getExtremefiedScore(parent.state.playstylePointsCache['Economist'])).toFixed(0) + '%)')
                                    ),
                                    ': ',
                                    React.createElement('span', {}, loc('playstyle_economist', "Highest income. It's all about that late-game scaling."))
                                ),
                                React.createElement('div', {},
                                    React.createElement('img', { src: 'hud/img/spider/Small/Kingsguard.png' }),
                                    React.createElement('span', { style: { color: '#ffcc00' } },
                                        locName('playstyle_kingsguard', 'Kingsguard'),
                                        !parent.state.noGamesPlayed && (' (' + (100 * parent.getExtremefiedScore(parent.state.playstylePointsCache['Kingsguard'])).toFixed(0) + '%)')
                                    ),
                                    ': ',
                                    React.createElement('span', {}, loc('playstyle_kingsguard', "Most king upgrades. Teamwork is OP."))
                                ),
                                React.createElement('div', {},
                                    React.createElement('img', { src: 'hud/img/spider/Small/Architect.png' }),
                                    React.createElement('span', { style: { color: '#ffcc00' } },
                                        locName('playstyle_architect', 'Architect'),
                                        !parent.state.noGamesPlayed && (' (' + (100 * parent.getExtremefiedScore(parent.state.playstylePointsCache['Architect'])).toFixed(0) + '%)')
                                    ),
                                    ': ',
                                    React.createElement('span', {}, loc('playstyle_architect', "Highest value. Money is power."))
                                ),
                                React.createElement('div', {},
                                    React.createElement('img', { src: 'hud/img/spider/Small/Guardian.png' }),
                                    React.createElement('span', { style: { color: '#ffcc00' } },
                                        locName('playstyle_guardian', 'Guardian'),
                                        !parent.state.noGamesPlayed && (' (' + (100 * parent.getExtremefiedScore(parent.state.playstylePointsCache['Guardian'])).toFixed(0) + '%)')
                                    ),
                                    ': ',
                                    React.createElement('span', {}, loc('playstyle_guardian', "Most leaks caught. Sometimes, you just have to carry."))
                                ),
                                React.createElement('div', {},
                                    React.createElement('img', { src: 'hud/img/spider/Small/Breaker.png' }),
                                    React.createElement('span', { style: { color: '#ffcc00' } },
                                        locName('playstyle_breaker', 'Breaker'),
                                        !parent.state.noGamesPlayed && (' (' + (100 * parent.getExtremefiedScore(parent.state.playstylePointsCache['Breaker'])).toFixed(0) + '%)')
                                    ),
                                    ': ',
                                    React.createElement('span', {}, loc('playstyle_breaker', "Caused the most opponent leaks. The best defense is a good offense."))
                                ),
                                React.createElement('div', {},
                                    React.createElement('img', { src: 'hud/img/spider/Small/Tactician.png' }),
                                    React.createElement('span', { style: { color: '#ffcc00' } },
                                        locName('playstyle_tactician', 'Tactician'),
                                        !parent.state.noGamesPlayed && (' (' + (100 * parent.getExtremefiedScore(parent.state.playstylePointsCache['Tactician'])).toFixed(0) + '%)')
                                    ),
                                    ': ',
                                    React.createElement('span', {}, loc('playstyle_tactician', "Fewest waves leaked. No such thing as a pro-leak."))
                                )
                            )
                        ),
                        parent.state.noGamesPlayed && React.createElement('div', {
                            style: {
                                position: 'absolute',
                                top: (isUnityHost ? '300px' : '310px'),
                                left: '245px',
                                width: '120px',
                                textAlign: 'center',
                                wordWrap: 'normal',
                                pointerEvents: 'none'
                            }
                        },
                            loc('play_more_games_first', 'Play more games first')
                        ),
                        React.createElement('div', { className: 'spider-chart-container' + (isUnityHost ? ' coherent-hack' : '') },
                            React.createElement('canvas', {
                                className: 'spider-chart',
                                style: {
                                    opacity: !parent.state.noGamesPlayed ? '1' : '0'
                                },
                                ref: 'spider',
                            })
                        ),
                        React.createElement('div', { className: 'favorite-units' },
                            /* janky v8.05 fix for margin with no games played */
                            React.createElement('div', { style: { display: 'block', marginTop: parent.state.noGamesPlayed ? '44px' : '24px' } },
                                React.createElement('span', { className: 'category simple-tooltip' },
                                    locName('favorite_rolls', 'Favorite Rolls') + ":",
                                    React.createElement('span', { className: 'tooltiptext' },
                                        loc('favorite_rolls', 'Your most commonly picked towers this season')
                                    )
                                )
                            ),
                            (!unitDetailsSortedByPicked || unitDetailsSortedByPicked.length == 0) && React.createElement('div',
                                {}, React.createElement('div', { className: 'no-items-spacer' },
                                    loc('play_more_games_first', 'Play more games first')
                                )
                            ),
                            unitDetailsSortedByPicked && unitDetailsSortedByPicked.length > 0 && unitDetailsSortedByPicked.map(function (unitType, index) {
                                var unit = unitDetails[unitType]

                                // Only show first 6 units
                                if (index >= 6) return null

                                var pickRatePercent = 0
                                //if (totalUnitPoints > 0)
                                //    pickRatePercent = ((100 * 6 * unit.picked) / totalUnitPoints).toFixed(0)
                                pickRatePercent = unit.truePickRate.toFixed(0)

                                return React.createElement('span', { className: 'simple-tooltip' },
                                    React.createElement('img', { className: 'favorite-unit', src: 'hud/img/' + unit.icon }),
                                    React.createElement('span', { className: 'favorite-unit-text' + (isUnityHost ? ' coherent-hack' : '') }, pickRatePercent + '%'),
                                    React.createElement('span', { className: 'tooltiptext narrow' }, unit.name)
                                )
                            }),
                            React.createElement('div', { style: { display: 'block', marginTop: '24px' } },
                                React.createElement('span', { className: 'category simple-tooltip' },
                                    locName('favorite_openings', 'Favorite Openings') + ":",
                                    React.createElement('span', { className: 'tooltiptext' },
                                        loc('favorite_openings', 'Your most commonly wave 1 openings this season')
                                    )
                                )
                            ),
                            (!unitDetailsSortedByOpened || unitDetailsSortedByOpened.length == 0 || unitDetails[unitDetailsSortedByOpened[0]].opened == 0) && React.createElement('div',
                                {}, React.createElement('div', { className: 'no-items-spacer' },
                                    loc('play_more_games_first', 'Play more games first')
                                )
                            ),
                            unitDetailsSortedByOpened && unitDetailsSortedByOpened.length > 0 && unitDetails[unitDetailsSortedByOpened[0]].opened > 0 && unitDetailsSortedByOpened.map(function (unitType, index) {
                                var unit = unitDetails[unitType]
                                //console.log('Considering showing favorite opening unit ' + unit.name)

                                // Only show first 6 units
                                if (index >= 6) return null

                                var openedRatePercent = 0

                                // Pre-v8.00.4
                                //if (totalUnitPoints > 0)
                                //    openedRatePercent = Math.min(100, ((100 * 6 * unit.opened) / totalUnitPoints)).toFixed(0)
                                //console.log('unit.opened: ' + unit.opened)
                                //console.log('totalUnitPoints: ' + totalUnitPoints)
                                //console.log('advancedProfileEntry.gamesThisSeason: ' + advancedProfileEntry.gamesThisSeason)

                                // v8.00.4
                                openedRatePercent = (100 * (unit.opened / Math.max(1, advancedProfileEntry.gamesThisSeason))).toFixed(0)
                                //console.log('openedRatePercent: ' + openedRatePercent)

                                // Looks kinda silly to display 0%'s
                                if (unit.opened == 0) return null

                                return React.createElement('span', { className: 'simple-tooltip' },
                                    React.createElement('img', { className: 'favorite-unit', src: 'hud/img/' + unit.icon }),
                                    React.createElement('span', { className: 'favorite-unit-text' + (isUnityHost ? ' coherent-hack' : '') }, openedRatePercent + '%'),
                                    React.createElement('span', { className: 'tooltiptext narrow' }, unit.name)
                                )
                            })
                        )
                    ),
                    // Right side
                    React.createElement('div', { className: 'stats-container' },
                        React.createElement('div', {
                            className: 'dropdown-container season',
                            style: {
                                position: 'absolute',
                                top: '-44px',
                                right: '32px',
                                width: '175px',
                            }
                        },
                            React.createElement(DropdownLinks, {
                                choices: dropdownChoices,
                                defaultValue: this.state.profile.season == globalState.season ? loc('current_season', 'Current Season')
                                    : loc('season', 'Season ' + this.state.profile.season, [this.state.profile.season]),
                                actualValue: this.state.profile.season == globalState.season ? loc('current_season', 'Current Season')
                                    : loc('season', 'Season ' + this.state.profile.season, [this.state.profile.season])
                            })
                        ),
                        this.state.loadingPastStats && React.createElement('img', {
                            src: 'hud/img/ui/loading-small.gif',
                            style: {
                                //position: 'absolute',
                                //top: '400px',
                                //right: '270px'
                            }
                        }),
                        !this.state.loadingPastStats && React.createElement('table', { className: 'ranked' },
                            React.createElement('tr', {},
                                this.state.profile.season != globalState.season && React.createElement('td', { className: 'category' },
                                    loc('season_x_stats', "Season " + getSeasonDisplayNumber(this.state.profile.season) + " Stats", [getSeasonDisplayNumber(this.state.profile.season)]) + ':'
                                ),
                                this.state.profile.season == globalState.season && React.createElement('td', { className: 'category' },
                                    loc('current_season', "Current Season") + ':'
                                )
                            ),
                            this.state.profile.season == this.state.profile.latestSeason && React.createElement('tr', {},
                                React.createElement('td', { className: 'label' },
                                    loc('profile_current_rating', "Current Rating")
                                ),
                                rankedGamesThisSeason < 0 && React.createElement('td', { className: 'value big' },
                                    React.createElement('span', { className: 'value big' }, loc('no_data', 'No Data'))
                                ),
                                // v8.01 added rankedGamesThisSeason to make sure it's hidden when a player hasn't played this season yet
                                rankedGamesThisSeason == 0 && React.createElement('td', {
                                    className: 'value big'
                                },
                                    loc('unlocked_after_ranked_matches', 'Unlocked after 1 ranked matches', [1])
                                ),
                                rankedGamesThisSeason >= 1 && React.createElement('td', { className: 'value big' },
                                    ratingImage && React.createElement('img', { src: ratingImage }),
                                    getRatingImage(this.state.profile.rating) && React.createElement('span', {
                                        className: 'rating-numeral', style: {
                                            right: '8px', bottom: isUnityHost ? '12px' : '0', height: '0px', display: 'inline-block',
                                            width: '30px', marginRight: '-25px'
                                        }
                                    }, getRatingDivisionNumeral(this.state.profile.rating)),
                                    React.createElement('span', { className: ratingClass + ' rating-text' }, this.state.profile.rating),
                                    React.createElement('span', { className: 'value rank' },
                                        loc('rank', 'Rank'),
                                        " #" + this.state.profile.rank,
                                        React.createElement('span', {
                                            style: {
                                                fontSize: '0.75rem',
                                                color: '#9c9c9c',
                                                fontWeight: 'normal',
                                            }
                                        },
                                            " " + loc('profile_top', "(Top " + overallRankPercent + "%)", [overallRankPercent])
                                        )
                                    )
                                )
                            ),
                            React.createElement('tr', {},
                                React.createElement('td', { className: 'label' },
                                    loc('profile_peak_rating_this_season', "Peak Rating")
                                ),
                                (rankedGamesThisSeason < 0 || this.state.profile.season < 3) && React.createElement('td', { className: 'value big' },
                                    React.createElement('span', { className: 'value big' }, loc('no_data', 'No Data'))
                                ),
                                rankedGamesThisSeason >= 0 && this.state.profile.season >= 3 && rankedGamesThisSeason < 10 && React.createElement('td', {
                                    className: 'value big'
                                },
                                    loc('unlocked_after_ranked_matches', 'Unlocked after 10 ranked matches', [10])
                                ),
                                rankedGamesThisSeason >= 0 && this.state.profile.season >= 3 && rankedGamesThisSeason >= 10 && React.createElement('td', { className: 'value big' },
                                    ratingImage && React.createElement('img', { src: peakImage }),
                                    getRatingImage(this.state.profile.peakThisSeason) && React.createElement('span', {
                                        className: 'rating-numeral', style: {
                                            right: '8px', bottom: isUnityHost ? '12px' : '0', height: '0px', display: 'inline-block',
                                            width: '30px', marginRight: '-25px'
                                        }
                                    }, getRatingDivisionNumeral(this.state.profile.peakThisSeason)),
                                    React.createElement('span', { className: peakClass + ' rating-text' }, this.state.profile.peakThisSeason),
                                    this.state.profile.season == globalState.season && rankedGamesThisSeason >= 10 && React.createElement('span', { className: 'value rank' },
                                        loc('rank', 'Rank'),
                                        " #" + this.state.profile.rankThisSeason,
                                        React.createElement('span', {
                                            style: {
                                                fontSize: '0.75rem',
                                                color: '#9c9c9c',
                                                fontWeight: 'normal',
                                            }
                                        },
                                            " " + loc('profile_top', "(Top " + overallRankPercentThisSeason + "%)", [overallRankPercentThisSeason])
                                        )
                                    )
                                )
                            ),
                            !this.state.loadingPastStats && this.state.profile.season == globalState.season && globalState.rankedDisabledMessage == '' && React.createElement('tr', {},
                                React.createElement('td', { className: 'label' },
                                    loc('season_goal', "Season Goal")
                                ),
                                React.createElement('td', { className: 'value big simple-tooltip profile-season-goals' },
                                    /* SMELLY COPY AND PASTED BETWEEN HERE AND POSTGAME-VIEWS.JS */
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
                                )
                            ),
                            React.createElement('tr', {},
                                React.createElement('td', { className: 'label' },
                                    loc('ranked_wins', "Ranked W/L")
                                ),
                                (this.state.profile.rankedWins < 0 || this.state.profile.season < 3) && React.createElement('td', { className: 'value big' }, loc('no_data', 'No Data')),
                                this.state.profile.rankedWins >= 0 && this.state.profile.season >= 3 && React.createElement('td', { className: 'value big' },
                                    this.state.profile.rankedWins,
                                    " - ",
                                    this.state.profile.rankedLosses,
                                    " (" + rankedWinRate + "%)"
                                )
                            ),
                            React.createElement('tr', {},
                                React.createElement('td', { className: 'label' },
                                    loc('classic_wins', "Classic W/L")
                                ),
                                (this.state.profile.classicWins < 0 || this.state.profile.season < 3) && React.createElement('td', { className: 'value big' }, loc('no_data', 'No Data')),
                                this.state.profile.classicWins >= 0 && this.state.profile.season >= 3 && React.createElement('td', { className: 'value big' },
                                    this.state.profile.classicWins,
                                    " - ",
                                    this.state.profile.classicLosses,
                                    " (" + classicWinRate + "%)"
                                )
                            )
                        ),
                        React.createElement('table', { className: 'ranked all-time' },
                            React.createElement('tr', {},
                                React.createElement('td', { className: 'category' },
                                    loc('all_time_stats', "All-Time Stats") + ':'
                                )
                            ),
                            React.createElement('tr', {},
                                React.createElement('td', { className: 'label' },
                                    loc('profile_peak_rating_all_time', "Peak Rating")
                                ),
                                React.createElement('td', { className: 'value big' },
                                    ratingImage && React.createElement('img', { src: peakImageAllTime }),
                                    getRatingImage(this.state.profile.peak) && React.createElement('span', {
                                        className: 'rating-numeral', style: {
                                            right: '8px', bottom: isUnityHost ? '12px' : '0', height: '0px', display: 'inline-block',
                                            width: '30px', marginRight: '-25px'
                                        }
                                    }, getRatingDivisionNumeral(this.state.profile.peak)),
                                    React.createElement('span', { className: peakClassAllTime + ' rating-text' }, this.state.profile.peak),
                                    React.createElement('span', { className: 'value rank' },
                                        loc('rank', 'Rank'),
                                        " #" + this.state.profile.rankAllTime,
                                        React.createElement('span', {
                                            className: 'rank-percentile',
                                            style: {
                                                fontSize: '0.75rem',
                                                color: '#9c9c9c',
                                                fontWeight: 'normal',
                                            }
                                        },
                                            " " + loc('profile_top', "(Top " + overallRankPercentAllTime + "%)", [overallRankPercentAllTime])
                                        )
                                    )
                                )
                            ),
                            React.createElement('tr', {},
                                React.createElement('td', { className: 'label' },
                                    loc('total_w_l', "Total W-L")
                                ),
                                React.createElement('td', { className: 'value big' },
                                    React.createElement('span', {}, this.state.profile.wins + ' - ' + this.state.profile.losses),
                                    React.createElement('span', {}, ' (' + winRate + '%)')
                                )
                            ),
                            React.createElement('tr', {},
                                React.createElement('td', { className: 'label' },
                                    loc('games_played', "Games played")
                                ),
                                React.createElement('td', { className: 'value big' },
                                    React.createElement('span', {}, this.state.profile.gamesPlayed)
                                )
                            ),
                            React.createElement('tr', {},
                                React.createElement('td', { className: 'label' },
                                    loc('level', "Level")
                                ),
                                React.createElement('td', { className: 'value big' },
                                    React.createElement('span', {}, this.state.profile.level)
                                )
                            ),
                            React.createElement('tr', {},
                                React.createElement('td', { className: 'label' },
                                    loc('collection_value', "Collection Value")
                                ),
                                React.createElement('td', { className: 'value big' },
                                    React.createElement('span', {}, this.state.profile.collectionValue)
                                )
                            ),
                            React.createElement('tr', {},
                                React.createElement('td', { className: 'label' },
                                    loc('cards', "Cards")
                                ),
                                React.createElement('td', { className: 'value big' },
                                    React.createElement('span', {}, cardTypesOwned + '/' + this.state.profile.cards.length)
                                )
                            ),
                            React.createElement('tr', {},
                                React.createElement('td', { className: 'label simple-tooltip' },
                                    loc('pity_points', "Pity points"),
                                    React.createElement('span', { className: 'tooltiptext' },
                                        loc('pity_points_long', 'Each pity point increases the chance of finding a card. Every game you finish without finding a card, you gain a pity point. Once you find a card, your pity points reset to 0.')
                                    )
                                ),
                                React.createElement('td', { className: 'value big' },
                                    React.createElement('span', {}, this.state.profile.gamesSinceLastCard)
                                )
                            ),
                            React.createElement('tr', {},
                                React.createElement('td', { className: 'label' },
                                    loc('statistic_behaviorScore', "Behavior score")
                                ),
                                React.createElement('td', { className: 'value big' },
                                    React.createElement('span', {}, (this.state.profile.behaviorScore / 10).toFixed(1))
                                )
                            )
                            //React.createElement('tr', {}, // nvm this might look weird for test accounts
                            //    React.createElement('td', { className: 'label' },
                            //        loc('account_created', "Account Created")
                            //    ),
                            //    React.createElement('td', { className: 'value big' },
                            //        React.createElement('span', {}, this.state.profile.accountCreated)
                            //    )
                            //)
                        )
                    )
                )
            )
        )
    }
})

// v9.03: this is purely just Cards now
var Inventory = React.createClass({
    forceOpacityCallback: null,
    getInitialState: function () {
        return {
            profile: globalState.mainProfile,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshInventory = function (profile) {
            parent.setState({
                profile: profile,
            })
        },
        bindings.onScrollbarMouseDown['Collection'] = function () {
            console.log('onScrollbarMouseDown Collection')
            parent.removeBlackTearing()
        },
        bindings.onScrollbarMouseUp['Collection'] = function () {
            console.log('onScrollbarMouseUp Collection')
            parent.removeBlackTearing()
        }
    },
    removeBlackTearing: function () {
        var parent = this

        // hotfix for missing/cutoff cards
        // It has to do with the webkit filter grayscale performance optimization
        // So we force opacity change slightly to force a redraw
        // See Coherent email thread for explanation

        // v8.00 throttle
        if (parent.forceOpacityCallback != null) {
            clearTimeout(parent.forceOpacityCallback)
        }

        parent.forceOpacityCallback = setTimeout(function () {
            var elem = parent.refs.main
            elem.style.opacity = "0.99"
            elem.offsetHeight;
            elem.style.opacity = "1"
        }, 100)
    },
    render: function () {
        var parent = this

        if (this.state.profile == null) return

        var name = this.state.profile.name
        if (!name)
            name = globalState.currentProfileLoadingName

        var isMyProfile = name == globalState.savedUsername
        var indexThisLegionSecret = 0

        var stillLoading = this.state.profile.skinRowNames == null || this.state.profile.skinRowNames.length == 0
        if (stillLoading) {
            return React.createElement('div', { className: 'profile-container' },
                React.createElement('div', {
                    className: 'profile-main', style: { textAlign: 'center' }
                },
                    React.createElement('img', {
                        src: 'hud/img/ui/loading-small.gif',
                    })
                )
            )
        }

        // Card counts
        var ownedCards = {}
        var totalCards = {}
        parent.state.profile.cards && parent.state.profile.cards.map(function (card, index) {
            if (!ownedCards[card.legion])
                ownedCards[card.legion] = 0
            if (!totalCards[card.legion])
                totalCards[card.legion] = 0

            if (card.rarity == 'secret') {
                if (!ownedCards['Secret'])
                    ownedCards['Secret'] = 0
                if (!totalCards['Secret'])
                    totalCards['Secret'] = 0
                totalCards['Secret']++
                if (card.stacks != null && card.stacks > 0)
                    ownedCards['Secret']++
                return
            }

            totalCards[card.legion]++
            if (card.stacks != null && card.stacks > 0)
                ownedCards[card.legion]++
        })

        return (
            React.createElement('div', {
                className: 'profile-container',
                onWheel: function (e) {
                    parent.removeBlackTearing()
                }
            },
                React.createElement('div', { className: 'profile-main', ref: 'main' },
                    React.createElement('div', { className: 'block' },
                        React.createElement('span', { className: 'name' }, loc('profile_persons_collection', name + "'s collection", [name])),
                        React.createElement('span', {
                            className: 'simple-tooltip flipped-y',
                            style: {
                                fontSize: '14px',
                                color: '#c0c0c0',
                                marginLeft: '6px'
                            },
                        },
                            '[?]',
                            React.createElement('span', {
                                className: 'tooltiptext ultra-wide',
                                dangerouslySetInnerHTML: {
                                    __html: loc('what_cards_used_for_long', "Every enemy you kill, you have a small chance to find a rare collectible card. This card is usable as an avatar. It also adds to your collection value.<br /><br /><span style='color: #909090'>Cards only drop in Normal games</span>")
                                },
                                style: {
                                    marginLeft: '20px'
                                }
                            })
                        )
                    ),
                    React.createElement('div', { className: 'block' },
                        React.createElement('div', { className: 'items' },
                            (!this.state.profile.skins || this.state.profile.skins.length == 0) && React.createElement('div',
                                {}, React.createElement('div', { className: 'no-items-spacer' })
                            ),
                            this.state.profile.skinRowNames && this.state.profile.skinRowNames.map(function (legionName) {
                                var indexThisLegion = 0
                                return React.createElement('div', { className: 'card-collection legion-row' },
                                    React.createElement('div', { className: 'legion-header' },
                                        React.createElement('img', { className: 'legion-icon', src: 'hud/img/legionselect/' + legionName + '2.png' }),
                                        React.createElement('div', { style: { display: 'inline-block' } },
                                            React.createElement('div', {}, locName(legionName.toLowerCase() + '_legion_id', legionName)),
                                            React.createElement('div', { className: 'ownership' },
                                                ownedCards[legionName] + '/' + totalCards[legionName],
                                                (ownedCards[legionName] >= totalCards[legionName]) && React.createElement('span', {
                                                    dangerouslySetInnerHTML: {
                                                        __html: '[' + loc('research_maxed', '<span style="color: #8ff110">MAXED</span>') + ']'
                                                    },
                                                    style: {
                                                        marginLeft: '4px'
                                                    }
                                                })
                                            )
                                        )
                                    ),
                                    parent.state.profile.cards && parent.state.profile.cards.map(function (card, index) {
                                        if (card.legion != legionName) return null

                                        // Don't show explicitly hidden stuff
                                        if (card.hideInProfile) return null

                                        var stacks = 0
                                        if (card.stacks != null && card.stacks > 0)
                                            stacks = card.stacks

                                        // Don't show non-owned cards
                                        //if (stacks == 0) return null

                                        // Don't show secret cards in Legions view
                                        if (card.rarity == 'secret') return null

                                        indexThisLegion++

                                        var extraTooltipStyle = ''
                                        if (indexThisLegion % 16 > 13)
                                            extraTooltipStyle = ' flipped'

                                        //if (indexThisLegion / 14 > 1 && indexThisLegion % 14 == 1)
                                        //    extraTooltipStyle = ' fake-icon-bullet-indent'

                                        var rarity = card.rarity
                                        var name = card.name

                                        return (
                                            React.createElement('div', {
                                                className: 'simple-tooltip ' + extraTooltipStyle + ' equipped'
                                                    + (stacks == 0 ? ' locked' : ''),
                                                onMouseDown: function (e) {
                                                    if (stacks == 0) return
                                                    if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                                    card.stacks = stacks
                                                    var showSellButton = isMyProfile && globalState.shopEnabled
                                                    // Actually I think it might be better without Sell button, so you are forced
                                                    // to go through Card Trader
                                                    // Plus, more importantly, the sell button is kind of ugly
                                                    showSellButton = false

                                                    showFullScreenPopup(getCardArt(card, showSellButton, false))
                                                    engine.call('OnOpenCardPopup', card.id)
                                                },
                                                onMouseEnter: function () {
                                                    if (stacks == 0) {
                                                        engine.call("OnMouseOverVeryLight", index)
                                                        return
                                                    }
                                                    engine.call("OnMouseOverMedium", index)
                                                }
                                            },
                                                getSmallCardArt(card)
                                                //React.createElement('img', { className: 'skin-icon collection-card-icon', src: 'hud/img/' + card.image }),
                                                //React.createElement('span', { className: getAvatarStacksClass(stacks) },
                                                //    React.createElement('img', { src: 'hud/img/shop/rarity/' + card.rarity + '.png', className: 'rarity' })
                                                //),
                                                //stacks > 1 && React.createElement('div', { className: 'icon-text skin-stacks' + ' ' + card.rarity }, stacks),
                                                //card.isNew && React.createElement('div', { className: 'icon-text icon-new' + ' ' + card.rarity }, loc('new_item', 'New!')),
                                                //React.createElement('div', { className: 'tooltiptext auto' },
                                                //    React.createElement('div', { className: card.rarity }, card.name)
                                                //    //React.createElement('div', {}, entry.description), // too much upkeep to have description
                                                //    // Unless we want flavor text, COULD BE FUN!
                                                //)
                                            )
                                        )
                                    })
                                )
                            }),
                            // Secret cards
                            globalState.shopEnabled && React.createElement('div', { className: 'card-collection legion-row' },
                                React.createElement('div', { className: 'legion-header' },
                                    React.createElement('img', { className: 'legion-icon', src: 'hud/img/icons/Secret.png' }),
                                    React.createElement('div', { style: { display: 'inline-block' } },
                                        React.createElement('div', {}, loc('secret_card', 'Secret Card')),
                                        React.createElement('div', { className: 'ownership' },
                                            ownedCards['Secret'] + '/' + totalCards['Secret'],
                                            (ownedCards['Secret'] >= totalCards['Secret']) && React.createElement('span', {
                                                dangerouslySetInnerHTML: {
                                                    __html: '[' + loc('research_maxed', '<span style="color: #8ff110">MAXED</span>') + ']'
                                                },
                                                style: {
                                                    marginLeft: '4px'
                                                }
                                            })
                                        )
                                    )
                                ),
                                parent.state.profile.cards && parent.state.profile.cards.map(function (card, index) {
                                    // Don't show non-secret cards in the secret row
                                    if (card.rarity != 'secret') return null

                                    // Don't show explicitly hidden stuff
                                    if (card.hideInProfile) return null

                                    var stacks = 0
                                    if (card.stacks != null && card.stacks > 0)
                                        stacks = card.stacks

                                    indexThisLegionSecret++

                                    var extraTooltipStyle = ''
                                    //if (indexThisLegionSecret % 16 > 13)
                                    //    extraTooltipStyle = ' flipped'

                                    //if (indexThisLegionSecret / 14 > 1 && indexThisLegionSecret % 14 == 1)
                                    //    extraTooltipStyle = ' fake-icon-bullet-indent'

                                    var rarity = card.rarity
                                    var name = card.name

                                    return (
                                        React.createElement('div', {
                                            className: 'simple-tooltip ' + extraTooltipStyle + ' equipped'
                                                + (stacks == 0 ? ' locked' : ''),
                                            onMouseDown: function (e) {
                                                if (stacks == 0) return
                                                if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness
                                                showFullScreenPopup(getCardArt(card, false))
                                                engine.call('OnOpenCardPopup', card.id)
                                            },
                                            onMouseEnter: function () {
                                                if (stacks == 0) {
                                                    engine.call("OnMouseOverVeryLight", index)
                                                    return
                                                }
                                                engine.call("OnMouseOverMedium", index)
                                            },
                                        },
                                            getSmallCardArt(card)
                                            //stacks == 0 && React.createElement('img', { src: 'hud/img/icons/SecretCard.png', className: 'skin-icon' }),
                                            //stacks >= 1 && React.createElement('img', { src: 'hud/img/' + card.image, className: 'skin-icon' }),
                                            ////stacks >= 1 && React.createElement('img', { src: 'hud/img/shop/rarity/' + card.rarity + '.png', className: 'rarity' }),
                                            //React.createElement('span', { className: getAvatarStacksClass(stacks) },
                                            //    React.createElement('img', { src: 'hud/img/shop/rarity/' + card.rarity + '.png', className: 'rarity' })
                                            //),
                                            //stacks > 1 && React.createElement('div', { className: 'icon-text skin-stacks' + ' ' + card.rarity }, stacks),
                                            //stacks >= 1 && card.isNew && React.createElement('div', { className: 'icon-text icon-new' + ' ' + card.rarity }, loc('new_item', 'New!')),
                                            //stacks == 0 && React.createElement('div', { className: 'tooltiptext auto' },
                                            //    React.createElement('div', { className: card.rarity }, loc('secret_card', 'Secret Card'))
                                            //),
                                            //stacks >= 1 && React.createElement('div', { className: 'tooltiptext auto' },
                                            //    React.createElement('div', { className: card.rarity }, card.name)
                                            //    //React.createElement('div', {}, entry.description), // too much upkeep to have description
                                            //    // Unless we want flavor text, COULD BE FUN!
                                            //)
                                        )
                                    )
                                })
                            )
                        )
                        // OLD pre-shop cards view
                        //React.createElement('div', { className: 'items collection' },
                        //    this.state.profile.cards && this.state.profile.cards.map(function (entry, index) {
                        //        var stacks = 0
                        //        if (entry.stacks != null && entry.stacks > 0)
                        //            stacks = entry.stacks

                        //        var extraTooltipStyle = ''
                        //        if (index % 15 > 12)
                        //            extraTooltipStyle = ' flipped'

                        //        // Special case: 0 stacks
                        //        if (stacks == 0) {
                        //            return (
                        //                React.createElement('div', { className: 'simple-tooltip locked' + extraTooltipStyle },
                        //                    React.createElement('div', { className: 'img-container' },
                        //                        React.createElement('img', { src: 'hud/img/' + entry.image })
                        //                    ),
                        //                    React.createElement('div', { className: 'tooltiptext' },
                        //                        React.createElement('div', { className: 'undiscovered' }, entry.name),
                        //                        React.createElement('div', { className: 'requires', }, loc('to_be_discovered', 'To be discovered')),
                        //                        //React.createElement('div', {}, entry.description),
                        //                        React.createElement('div', { className: 'undiscovered' }, loc('item_value', 'Value') + ": " + entry.value)
                        //                    )
                        //                )
                        //            )
                        //        }

                        //        return (
                        //            React.createElement('div', {
                        //                className: 'simple-tooltip' + extraTooltipStyle,
                        //                onMouseDown: function (e) {
                        //                    showFullScreenPopup(getCardArt(entry, isMyProfile))
                        //                },
                        //                onMouseEnter: function () {
                        //                    engine.call("OnMouseOverLight", index)
                        //                },
                        //            },
                        //                //React.createElement('img', { src: 'hud/img/' + entry.image, className: entry.rarity }),
                        //                //React.createElement('img', { src: 'hud/img/' + entry.image, className: 'avatar-border-with-' + stacks + '-stacks' }),
                        //                React.createElement('div', { className: 'img-container ' + getAvatarStacksClass(stacks) },
                        //                    React.createElement('img', { src: 'hud/img/' + entry.image })
                        //                ),
                        //                stacks > 1 && React.createElement('div', {
                        //                    className: 'icon-text icon-stacks' + ' ' + entry.rarity
                        //                    //className: 'icon-text icon-stacks'
                        //                }, stacks),
                        //                entry.isNew && React.createElement('div', {
                        //                    className: 'icon-text icon-new' + ' ' + entry.rarity
                        //                    //className: 'icon-text icon-new'
                        //                }, loc('new_item', 'New!')),
                        //                React.createElement('img', { src: 'hud/img/shop/rarity/' + entry.rarity + '.png', className: 'rarity' }),
                        //                React.createElement('div', { className: 'tooltiptext' },
                        //                    React.createElement('div', { className: entry.rarity }, entry.name),
                        //                    React.createElement('div', {}, entry.description),
                        //                    React.createElement('div', { className: 'value' }, loc('item_value', 'Value') + ": " + entry.value)
                        //                )
                        //            )
                        //        )
                        //    })
                        //)
                    )
                )
            )
        )
    }
})

var Trophies = React.createClass({
    forceOpacityCallback: null,
    getInitialState: function () {
        return {
            profile: globalState.mainProfile,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshInventory = function (profile) {
            parent.setState({
                profile: profile,
            })
        },
        bindings.onScrollbarMouseDown['Trophies'] = function () {
            console.log('onScrollbarMouseDown Trophies')
            parent.removeBlackTearing()
        },
        bindings.onScrollbarMouseUp['Trophies'] = function () {
            console.log('onScrollbarMouseUp Trophies')
            parent.removeBlackTearing()
        }
    },
    removeBlackTearing: function () {
        var parent = this

        // hotfix for missing/cutoff cards
        // It has to do with the webkit filter grayscale performance optimization
        // So we force opacity change slightly to force a redraw
        // See Coherent email thread for explanation

        // v8.00 throttle
        if (parent.forceOpacityCallback != null) {
            clearTimeout(parent.forceOpacityCallback)
        }
        parent.forceOpacityCallback = setTimeout(function () {
            var elem = parent.refs.main
            elem.style.opacity = "0.99"
            elem.offsetHeight;
            elem.style.opacity = "1"
        }, 100)
    },
    getTrophies: function (categoryName, icon, listOfTrophyIds) {
        var ownedTrophies = 0
        var totalTrophies = 0
        this.state.profile.trophies && this.state.profile.trophies.map(function (entry, index) {
            if (!_.includes(listOfTrophyIds, entry.id)) return null

            if (entry.stacks > 0)
                ownedTrophies++

            if (!(entry.stacks == 0 && entry.hideIfUndiscovered))
                totalTrophies++
        })

        var actualIndex = 0
        return React.createElement('div', {},
            React.createElement('div', { className: 'legion-header' },
                React.createElement('img', { className: 'legion-icon', src: icon }),
                React.createElement('div', { style: { display: 'inline-block' } },
                    React.createElement('div', {}, categoryName),
                    React.createElement('div', { className: 'ownership' },
                        ownedTrophies + '/' + totalTrophies,
                        (ownedTrophies >= totalTrophies) && React.createElement('span', {
                            dangerouslySetInnerHTML: {
                                __html: '[' + loc('research_maxed', '<span style="color: #8ff110">MAXED</span>') + ']'
                            },
                            style: {
                                marginLeft: '4px'
                            }
                        })
                    )
                )
            ),
            this.state.profile.trophies && this.state.profile.trophies.map(function (entry, index) {
                if (!_.includes(listOfTrophyIds, entry.id)) return null
                actualIndex++

                var stacks = 0
                if (entry.stacks != null && entry.stacks > 0)
                    stacks = entry.stacks

                var extraTooltipStyle = ''
                if (actualIndex % 7 == 0)
                    extraTooltipStyle = ' flipped'

                // Special case: 0 stacks
                if (stacks == 0) {
                    // Special case: some icons we want to hide if they are undiscovered
                    if (entry.hideIfUndiscovered) {
                        actualIndex--
                        return null
                    }

                    // Normal case: show "Undiscovered" icon
                    return (
                        React.createElement('div', { className: 'simple-tooltip locked' + extraTooltipStyle },
                            getTrophyArt(entry, true)
                        )
                    )
                }

                return (
                    React.createElement('div', {
                        className: 'simple-tooltip' + extraTooltipStyle,
                        onMouseDown: function (e) {
                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                            showFullScreenPopup(getTrophyArt(entry))
                        },
                        onMouseEnter: function () {
                            if (stacks == 0) {
                                engine.call("OnMouseOverVeryLight", index)
                                return
                            }
                            engine.call("OnMouseOverMedium", index)
                        }
                    },
                        getTrophyArt(entry, true)
                    )
                )
            })
        )
    },
    getBadges: function (categoryName, icon) {
        var actualIndex = 0
        return React.createElement('div', {},
            React.createElement('div', { className: 'legion-header' },
                React.createElement('img', { className: 'legion-icon', src: icon }),
                React.createElement('div', { style: { display: 'inline-block' } },
                    React.createElement('div', {}, categoryName),
                    React.createElement('div', { className: 'ownership' },
                        React.createElement('span', {
                            className: 'simple-tooltip flipped-y'
                        },
                            '[?]',
                            React.createElement('span', {
                                className: 'tooltiptext wide',
                                dangerouslySetInnerHTML: {
                                    __html: loc('badges_how_to', "Badges are awarded only for special events. They are very rare.")
                                }
                            })
                        )
                    )
                )
            ),
            this.state.profile.badges && this.state.profile.badges.map(function (entry, index) {
                actualIndex++

                var stacks = 0
                if (entry.stacks != null && entry.stacks > 0)
                    stacks = entry.stacks

                var extraTooltipStyle = ''
                if (actualIndex % 7 == 0)
                    extraTooltipStyle = ' flipped'

                // Special case: 0 stacks
                if (stacks == 0) {

                    // Special case: some icons we want to hide if they are undiscovered
                    if (entry.hideIfUndiscovered) {
                        return null
                    }

                    // Normal case: show "Undiscovered" icon
                    return (
                        React.createElement('div', { className: 'simple-tooltip locked' + extraTooltipStyle },
                            getTrophyArt(entry, true)
                        )
                    )
                }

                return (
                    React.createElement('div', {
                        className: 'simple-tooltip' + extraTooltipStyle,
                        onMouseDown: function (e) {
                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                            showFullScreenPopup(getTrophyArt(entry))
                        },
                        onMouseEnter: function () {
                            if (stacks == 0) {
                                engine.call("OnMouseOverVeryLight", index)
                                return
                            }
                            engine.call("OnMouseOverMedium", index)
                        }
                    },
                        getTrophyArt(entry, true)
                    )
                )
            })
        )
    },
    render: function () {
        var parent = this

        if (this.state.profile == null) return

        var name = this.state.profile.name
        if (!name)
            name = globalState.currentProfileLoadingName

        var isMyProfile = name == globalState.savedUsername
        var indexThisLegionSecret = 0

        var stillLoading = this.state.profile.skinRowNames == null || this.state.profile.skinRowNames.length == 0
        if (stillLoading) {
            return React.createElement('div', { className: 'profile-container' },
                React.createElement('div', {
                    className: 'profile-main', style: { textAlign: 'center' }
                },
                    React.createElement('img', {
                        src: 'hud/img/ui/loading-small.gif',
                    })
                )
            )
        }

        return (
            React.createElement('div', {
                className: 'profile-container',
                onWheel: function (e) {
                    parent.removeBlackTearing()
                }
            },
                React.createElement('div', { className: 'profile-main', ref: 'main' },
                    React.createElement('div', { className: 'block' },
                        React.createElement('span', { className: 'name', ref: 'firstElement' }, loc('profile_persons_trophies', name + "'s trophies", [name])),
                        React.createElement('span', {
                            className: 'simple-tooltip flipped-y',
                            style: {
                                fontSize: '14px',
                                color: '#c0c0c0',
                                marginLeft: '6px'
                            },
                        },
                            '[?]',
                            React.createElement('span', {
                                className: 'tooltiptext wide',
                                dangerouslySetInnerHTML: {
                                    __html: loc('trophies_long', "Trophies are unlocked by achieving milestones in the game. They add to your collection value.")
                                },
                                style: {
                                    marginLeft: '20px'
                                }
                            })
                        )
                    ),
                    React.createElement('div', { className: 'block' },
                        React.createElement('div', { className: 'items collection trophies' },
                            parent.getTrophies(loc('item_repeatable', 'Repeatable'), 'hud/img/icons/Hypercarry.png', [
                                'value_10000_item_id',
                                'reach_wave_21_item_id',
                                'winstreak_10_item_id',
                                'close_call_item_id',
                                'terminator_item_id',
                                'ultimate_terminator_item_id',
                                'challenger_item_id',
                                'challenger_elite_item_id',
                            ]),
                            parent.getTrophies(loc('ranked_queue', 'Ranked'), 'hud/img/icons/Ranked.png', [
                                'rating_silver_item_id',
                                'rating_c_item_id',
                                'rating_b_item_id',
                                'rating_a_item_id',
                                'rating_expert_item_id',
                                'rating_master_item_id',
                                'rating_seniormaster_item_id',
                                'rating_grandmaster_item_id',
                                'rating_legend_item_id',
                            ]),
                            parent.getTrophies(loc('wins', 'Wins'), 'hud/img/icons/LeadershipAura.png',  [
                                'win_100_item_id',
                                'win_250_item_id',
                                'win_500_item_id',
                                'win_1000_item_id',
                                'win_2000_item_id',
                                'win_4000_item_id',
                                'element_100_item_id',
                                'element_250_item_id',
                                'forsaken_100_item_id',
                                'forsaken_250_item_id',
                                'grove_100_item_id',
                                'grove_250_item_id',
                                'mech_100_item_id',
                                'mech_250_item_id',
                                'mastermind_100_item_id',
                                'mastermind_250_item_id',
                                'atlantean_100_item_id',
                                'atlantean_250_item_id',
                                'nomad_100_item_id',
                                'nomad_250_item_id',
                                'shrine_100_item_id',
                                'shrine_250_item_id',
                                'shrine_250_item_id',
                                'divine_100_item_id',
                                'divine_250_item_id',
                                'mastermind_lords_bronze_item_id',
                                'mastermind_lords_silver_item_id',
                                'mastermind_lords_gold_item_id',
                                'mastermind_lords_caster_item_id',
                            ]),
                            parent.getBadges(loc('badges', 'Badges'), 'hud/img/icons/Badges.png')
                        )
                    )
                )
            )
        )
    }
})

var Cosmetics = React.createClass({
    forceOpacityCallback: null,
    getInitialState: function () {
        return {
            profile: globalState.mainProfile,
            selectedSkinKey: ''
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshCosmetics = function (profile) {
            parent.setState({
                profile: profile,
            })
        }
        bindings.refreshSelectedCosmetic = function (skinKey) {
            if (skinKey === undefined)
                parent.setState({ selectedSkinKey: '' })
            else
                parent.setState({ selectedSkinKey: skinKey })
        },
        bindings.onScrollbarMouseDown['Customization'] = function () {
            console.log('onScrollbarMouseDown Customization')
            parent.removeBlackTearing()
        },
            bindings.onScrollbarMouseUp['Customization'] = function () {
            console.log('onScrollbarMouseUp Customization')
            parent.removeBlackTearing()
        }
    },
    removeBlackTearing: function () {
        var parent = this 

        // hotfix for missing/cutoff cards
        // It has to do with the webkit filter grayscale performance optimization
        // So we force opacity change slightly to force a redraw
        // See Coherent email thread for explanation

        // v8.00 throttle
        if (parent.forceOpacityCallback != null) {
            clearTimeout(parent.forceOpacityCallback)
        }

        parent.forceOpacityCallback = setTimeout(function () {
            var elem = parent.refs.main
            elem.style.opacity = "0.99"
            elem.offsetHeight;
            elem.style.opacity = "1"
        }, 100)
    },
    render: function () {
        var parent = this

        var name = this.state.profile.name
        if (!name)
            name = globalState.currentProfileLoadingName

        var isMyProfile = name == globalState.savedUsername

        // Smelly but works
        var stillLoading = !parent.state.profile.skins || globalState.currentProfileLoadingName == 'placeholder'
        if (stillLoading) {
            return React.createElement('div', { className: 'profile-container' },
                React.createElement('div', {
                    className: 'profile-main', style: { textAlign: 'center' }
                },
                    React.createElement('img', {
                        src: 'hud/img/ui/loading-small.gif',
                    })
                )
            )
        }

        return (
            React.createElement('div', {
                className: 'profile-container',
                onWheel: function (e) {
                    parent.removeBlackTearing()
                }
            },
                React.createElement('div', {
                    className: 'profile-main',
                    ref: 'main'
                },
                    React.createElement('div', { className: 'block' },
                        React.createElement('div', { className: 'name' }, loc('profile_persons_equips', name + "'s equips", [name]))
                    ),
                    React.createElement('div', { className: 'block' },
                        React.createElement('div', { className: 'items' },
                            (!this.state.profile.skins || this.state.profile.skins.length == 0) && React.createElement('div',
                                {}, React.createElement('div', { className: 'no-items-spacer' })
                            ),
                            this.state.profile.skinRowNames && this.state.profile.skinRowNames.map(function (skinRowName) {

                                if (skinRowName == 'Creature') return null // v9.05

                                var indexThisLegion = 0
                                return React.createElement('div', { className: 'legion-row' },
                                    React.createElement('img', { className: 'legion-icon', src: 'hud/img/legionselect/' + skinRowName + '2.png' }),
                                    parent.state.profile.skins && parent.state.profile.skins.map(function (skinEntry, index) {
                                        if (skinEntry.rowType != skinRowName) return null

                                        var isCurrentSkinDefaultSkin = isSkinADefaultSkin(skinEntry.currentSkin)

                                        var ownedSkins = 0
                                        if (skinEntry.ownedSkins != null && skinEntry.ownedSkins > 0)
                                            ownedSkins = skinEntry.ownedSkins

                                        var extraTooltipStyle = ''
                                        if (indexThisLegion % 15 > 12)
                                            extraTooltipStyle = ' flipped'

                                        //console.log('TEST rendering ' + skinEntry.rowType + ', ' + skinEntry.name + ', indexThisLegion: ' + indexThisLegion
                                        //    + ', extraTooltipStyle: ' + extraTooltipStyle)

                                        var rarity = (isCurrentSkinDefaultSkin ? 'common' : skinEntry.currentSkin.rarity)
                                        var skinName = (isCurrentSkinDefaultSkin ? skinEntry.name : skinEntry.currentSkin.name)

                                        indexThisLegion++

                                        return (
                                            React.createElement('div', {
                                                className: 'simple-tooltip ' + extraTooltipStyle + ' equipped'
                                                    + (skinEntry.key == parent.state.selectedSkinKey ? ' equipped-on' : '')
                                                    + (ownedSkins == 0 ? ' locked' : ''),
                                                onMouseDown: function (e) {
                                                    if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                                    // Actually it feels nice to view other people's skins, so keep this commented out imo
                                                    //if (!isMyProfile) {
                                                    //    console.log('This (' + name + ') was not my profile (' + globalState.savedUsername + '), so bail early from showing equip window')
                                                    //    return
                                                    //}

                                                    // Select the currently-equipped skin by default
                                                    engine.trigger('refreshSelectedSkin', skinEntry, skinEntry.currentSkin)
                                                },
                                                onMouseEnter: function () {
                                                    if (ownedSkins == 0) return

                                                    engine.call("OnMouseOverLight", index)
                                                },
                                            },
                                                !isCurrentSkinDefaultSkin && React.createElement('img', {
                                                    src: 'hud/img/' + skinEntry.currentSkin.image,
                                                    className: 'skin-icon',
                                                    //className: skinEntry.currentSkin.rarity
                                                }),
                                                isCurrentSkinDefaultSkin && React.createElement('img', {
                                                    src: 'hud/img/' + skinEntry.icon,
                                                    className: 'skin-icon',
                                                    //className: 'common',
                                                }),
                                                ownedSkins >= 0 && ownedSkins < 5 && skinEntry.allSkins.map(function (skin, index) {
                                                    return React.createElement('img', {
                                                        src: 'hud/img/shop/skin-circle' + (index < ownedSkins ? '-filled' : '') + '.png',
                                                        className: 'skin-circle',
                                                        style: {
                                                            // Left-to-right layout
                                                            //left: (16 * index) + 'px'

                                                            // Bottom-to-top layout
                                                            left: '2px',
                                                            bottom: (6 + 14 * index) + 'px'
                                                        }
                                                    })
                                                }),
                                                !isCurrentSkinDefaultSkin && React.createElement('img', { src: 'hud/img/shop/rarity/' + rarity + '.png', className: 'rarity' }),
                                                ownedSkins >= 5 && React.createElement('div', {
                                                    className: 'icon-text skin-stacks' + ' ' + rarity
                                                }, ownedSkins + '/' + skinEntry.allSkins.length),
                                                skinEntry.isNew && React.createElement('div', {
                                                    className: 'icon-text icon-new' + ' ' + rarity
                                                }, loc('new_item', 'New!')),
                                                React.createElement('div', { className: 'tooltiptext auto' },
                                                    React.createElement('div', { className: rarity }, skinName)
                                                    //React.createElement('div', {}, entry.description), // too much upkeep to have description
                                                    // Unless we want flavor text, COULD BE FUN!
                                                )
                                            )
                                        )
                                    })
                                )
                            })
                        )
                    )
                )
            )
        )
    }
})

var Monuments = React.createClass({
    getInitialState: function () {
        return {
            profile: globalState.mainProfile,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshMonuments = function (profile) {
            parent.setState({
                profile: profile,
            })
        }
    },
    render: function () {
        var parent = this

        var name = this.state.profile.name
        if (!name)
            name = globalState.currentProfileLoadingName

        var isMyProfile = name == globalState.savedUsername

        // Smelly but works
        var stillLoading = !parent.state.profile.cards || globalState.currentProfileLoadingName == 'placeholder'
        if (stillLoading) {
            return React.createElement('div', { className: 'profile-container' },
                React.createElement('div', {
                    className: 'profile-main', style: { textAlign: 'center' }
                },
                    React.createElement('img', {
                        src: 'hud/img/ui/loading-small.gif',
                    })
                )
            )
        }

        // Empty slots first
        var monuments = []
        for (var i = 1; i <= 10; i++)
            monuments[i] = ''

        // Populate with equipped cards
        //parent.state.profile.cards && parent.state.profile.cards.map(function (card, index) {
        globalState.equippableCardsSecretCardCount = 0
        for (var i = 0; i < parent.state.profile.cards.length; i++) {
            var card = parent.state.profile.cards[i]

            var stacks = 0
            if (card.stacks != null && card.stacks > 0)
                stacks = card.stacks

            // Can't donate secret cards
            if (card.rarity == 'secret') {
                //console.log('TEST found secret card ' + card.name + ' with stacks: ' + card.stacks)
                if (card.stacks > 0)
                    globalState.equippableCardsSecretCardCount += card.stacks
                continue
            }

            if (card.monumentSlots != null) {
                for (var j = 0; j < card.monumentSlots.length; j++) {
                    var slot = card.monumentSlots[j]

                    // Skip "0" slot since that just means it is unassigned
                    if (slot == 0) continue

                    console.log('card ' + card.name + ' parsed slot: ' + slot + ' from raw: ' + card.monumentSlots[j])
                    monuments[slot] = card
                }
            }
        }
        //console.log('TEST equippableCardsSecretCardCount: ' + globalState.equippableCardsSecretCardCount)

        var isMyProfile = globalState.mainProfile.name == globalState.savedUsername

        return (
            React.createElement('div', {
                className: 'profile-container',
                // No need for hotfix since we shouldn't have to scroll here
                //onWheel: function (e) {
                //    // hotfix for missing/cutoff cards
                //    // It has to do with the webkit filter grayscale performance optimization
                //    // So we force opacity change slightly to force a redraw
                //    // See Coherent email thread for explanation
                //    var elem = parent.refs.main
                //    elem.style.opacity = "0.99"
                //    elem.offsetHeight;
                //    elem.style.opacity = "1"
                //}
            },
                React.createElement('div', {
                    className: 'profile-main',
                    ref: 'main'
                },
                    React.createElement('div', { className: 'block' },
                        React.createElement('span', { className: 'name' }, loc('profile_persons_monuments', name + "'s monuments", [name])),
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
                                className: 'tooltiptext wide',
                                dangerouslySetInnerHTML: {
                                    __html: loc('bind_card_long', 'Bind a card to activate an in-game monument that decorates your lane. You can unbind the card at any time. 3x/10x of the same card unlock silver/gold pedestals.')
                                },
                                style: {
                                    marginLeft: '20px'
                                }
                            })
                        )
                    ),
                    React.createElement('div', { className: 'items monument-slots' },
                        monuments.map(function (monument, index) {
                            var monumentSlot = index

                            var requiredSecretCards = (monumentSlot - 6)
                            if (monumentSlot >= 7 && globalState.equippableCardsSecretCardCount < requiredSecretCards) {
                                return React.createElement('div', {
                                    className: 'simple-tooltip locked monument-' + monumentSlot
                                },
                                    React.createElement('img', { className: 'skin-icon', src: 'hud/img/monuments/LockedSlot.png' }),
                                    React.createElement('span', {
                                        className: 'tooltiptext',
                                        dangerouslySetInnerHTML: {
                                            __html: loc('slot_unlock_requirement', 'Secret cards required to unlock this slot: ' + globalState.equippableCardsSecretCardCount + '/' + requiredSecretCards,
                                                [globalState.equippableCardsSecretCardCount, requiredSecretCards])
                                        }
                                    })
                                )
                            }

                            if (monument == '') {
                                return React.createElement('div', {
                                    className: 'simple-tooltip monument-' + monumentSlot,
                                    onMouseDown: function (e) {
                                        if (!isMyProfile) return
                                        if (globalState.isInGame) return
                                        if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness
                                        if (e.nativeEvent.which == 3) return // Right click does nothing
                                        globalState.selectedMonumentSlot = monumentSlot
                                        engine.trigger('openEquipCardMenu')
                                    }
                                },
                                    React.createElement('img', { className: 'skin-icon', src: 'hud/img/monuments/EmptySlot.png' }),
                                    isMyProfile && !globalState.isInGame && React.createElement('span', { className: 'tooltiptext' },
                                        loc('bind_card', 'Bind Card')
                                    ),
                                    isMyProfile && globalState.isInGame && React.createElement('span', { className: 'tooltiptext' },
                                        loc('cannot_change_setting_while_ingame', 'Cannot change while in-game')
                                    )
                                )
                            }

                            return React.createElement('div', {
                                className: 'simple-tooltip monument-' + monumentSlot,
                                onMouseDown: function (e) {
                                    if (!isMyProfile) return
                                    if (globalState.isInGame) return
                                    if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                    // For now: just always unequip if you click something already equipped
                                    engine.trigger('requestUnequipCard', monument.key, monumentSlot)

                                    // Fancy later: right click to unequip, left click to swap
                                    //if (e.nativeEvent.which == 3) {
                                    //    engine.trigger('requestUnequipCard', monument.key, monumentSlot)
                                    //    return
                                    //}
                                    //globalState.selectedMonumentSlot = monumentSlot
                                    //engine.trigger('openEquipCardMenu')
                                }
                            },
                                React.createElement('img', { className: 'skin-icon', src: 'hud/img/' + monument.image }),
                                !isMyProfile && React.createElement('span', { className: 'tooltiptext' },
                                    monument.name
                                ),
                                isMyProfile && !globalState.isInGame && React.createElement('span', { className: 'tooltiptext' },
                                    loc('unbind_card', 'Unbind ' + monument.name, [monument.name])
                                ),
                                isMyProfile && globalState.isInGame && React.createElement('span', { className: 'tooltiptext' },
                                    loc('cannot_change_setting_while_ingame', 'Cannot change while in-game')
                                )
                            )
                        })
                    ),
                    React.createElement('div', {
                        className: 'monuments-background',
                        style: {
                            background: "url('hud/img/monuments/background.jpg')",
                            backgroundSize: '100%',
                            backgroundRepeat: 'no-repeat',
                            width: '100%',
                            height: '500px',
                            border: '1px solid rgba(0, 0, 0, 0.5)',
                            //marginTop: '16px' /* weirdly in v10.05 the icons were offset */
                        }
                    })
                    // Empty spacer if we don't want to use splash backer
                    //React.createElement('div', {
                    //    style: {
                    //        display: 'block',
                    //        height: '600px'
                    //    }
                    //})
                )
            )
        )
    }
})

var ProfileXp = React.createClass({
    propTypes: {
        currentXp: React.PropTypes.number,
        maxXp: React.PropTypes.number,
        level: React.PropTypes.number,
    },
    render: function () {
        var parent = this
        var fillPercent = (this.props.maxXp > 0) ? this.props.currentXp / this.props.maxXp : 0;
        fillPercent = Math.min(1, fillPercent)
        return (
            React.createElement('li', {
                className: 'hp',
            },

                React.createElement('div', {
                    className: "progress-container simple-tooltip",
                    style: { width: '128px', height: '20px' }
                },
                    React.createElement('div', {
                        className: "progress-bar custom", style: {
                            width: (100 * fillPercent) + "%",
                        }
                    }),
                    (this.props.maxXp > 0) && React.createElement('span', { className: 'value' },
                        loc('level', "Level") + " " + this.props.level
                    ),
                    React.createElement('span', { className: 'tooltiptext small' },
                        React.createElement('div', {}, this.props.currentXp + "/" + this.props.maxXp + ' XP')
                    )
                )
            )
        )
    }
})

var MatchHistory = React.createClass({
    getInitialState: function () {
        return {
            profile: globalState.mainProfile,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshMatchHistory = function (profile) {
            parent.setState({
                profile: profile,
            })
        }
        bindings.forceSetProfilePlayFabId = function (playFabId) {
            console.log('bindings.forceSetProfilePlayFabId: ' + playFabId)
            parent.state.profile.playFabId = playFabId
            parent.setState({
                profile: parent.state.profile
            })
        }
    },
    render: function () {
        var parent = this

        var name = this.state.profile.name
        if (!name)
            name = globalState.currentProfileLoadingName

        //console.log('test render(): parent.state.profile.playFabId: ' + parent.state.profile.playFabId)

        // v7.02.6+
        var notYetQueried = parent.state.profile && parent.state.profile.compactMatchHistoryCombined && parent.state.profile.compactMatchHistoryCombined.wins == -1
        if (notYetQueried) {
            console.log('Match history lazy loading --> call GetProfileForPlayerWithMatchHistory, playFabId: ' + parent.state.profile.playFabId)
            engine.call('GetProfileForPlayerWithMatchHistory', parent.state.profile.playFabId)
        }

        var stillLoading = !parent.state.profile.compactMatchHistoryCombined || notYetQueried
        if (stillLoading) {
            return React.createElement('div', { className: 'profile-container' },
                React.createElement('div', {
                    className: 'profile-main', style: { textAlign: 'center' }
                },
                    React.createElement('img', {
                        src: 'hud/img/ui/loading-small.gif',
                    })
                )
            )
        }


        var hasRecentMatches = parent.state.profile.compactMatchHistoryCombined && parent.state.profile.compactMatchHistoryCombined.matchHistories && parent.state.profile.compactMatchHistoryCombined.matchHistories.length > 0

        return (
            React.createElement('div', { className: 'profile-container' },
                React.createElement('div', { className: 'profile-main' },
                    React.createElement('div', { className: 'block' },
                        React.createElement('div', { className: 'name' }, loc('profile_persons_match_history', name + "'s match history", [name])),
                        hasRecentMatches && React.createElement('div', { className: 'win-loss' },
                            parent.state.profile.compactMatchHistoryCombined.wins + 'W '
                            + parent.state.profile.compactMatchHistoryCombined.losses + 'L'
                            + (parent.state.profile.compactMatchHistoryCombined.ties > 0 ? (' ' + parent.state.profile.compactMatchHistoryCombined.ties + 'T') : '')
                        ),
                        React.createElement('ul', { className: 'match-history-container' },
                            !hasRecentMatches && React.createElement('div', {
                                style: {
                                    padding: '28px', textAlign: 'center'
                                }
                            },
                                loc('match_history_no_recent_matches', 'No recent matches, or recent matches are on an older patch')
                            ),
                            hasRecentMatches && parent.state.profile.compactMatchHistoryCombined.matchHistories.map(function (row, index) {

                                return React.createElement('li', {
                                    className: 'match-history-row',
                                    onMouseDown: function (e) {
                                        if (e.nativeEvent.which == 3) return
                                        if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                        console.log('OnOpenMatchHistoryGame index: ' + index)
                                        engine.call('OnOpenMatchHistoryGame', index)

                                        if (isBrowserTest) {
                                            console.log('view match history loadview')
                                            engine.trigger('loadView', 'matchhistory')
                                        }
                                    }
                                },
                                    React.createElement('div', { style: { display: 'inline-block' } },
                                        React.createElement('div', { className: 'wave-icon' },
                                            React.createElement('img', { src: row.waveIcon })
                                        ),
                                        React.createElement('div', { className: 'vitals' },
                                            React.createElement('div', { className: 'gameresult' },
                                                row.gameResult == 'Won' && React.createElement('div', { className: 'victory' }, loc('victory', 'Victory!')),
                                                row.gameResult == 'Lost' && React.createElement('div', { className: 'defeat' }, loc('defeat', 'Defeat!')),
                                                row.gameResult == 'Tied' && React.createElement('div', { className: 'tie' }, loc('tie', 'Tie')),
                                                React.createElement('span', { className: 'queue' }, row.queueName),
                                                row.queueType == 'Normal' && (row.eloGain >= 0) && React.createElement('span', { className: 'elo-gain' }, ' (+' + row.eloGain + ')'),
                                                row.queueType == 'Normal' && (row.eloGain < 0) && React.createElement('span', { className: 'elo-loss' }, ' (' + row.eloGain + ')'),
                                                //React.createElement('div', { className: 'game-length' }, row.elapsedTime), // prob not needed if we show wave #
                                                React.createElement('div', { className: 'game-length' }, loc('wave', 'Wave') + ' ' + row.wave),
                                                React.createElement('div', { className: 'game-date' }, row.date)
                                            )
                                        ),
                                        React.createElement('div', { className: 'stats' },
                                            React.createElement('span', { className: 'stat' },
                                                React.createElement('img', { src: 'hud/img/icons/Value.png' }),
                                                React.createElement('span', { style: { color: '#fff' } }, row.value)
                                            ),
                                            React.createElement('span', { className: 'stat' },
                                                React.createElement('img', { src: 'hud/img/icons/Worker.png' }),
                                                React.createElement('span', { style: { color: '#fff' } }, row.workers)
                                            ),
                                            React.createElement('span', { className: 'stat' },
                                                React.createElement('img', { src: 'hud/img/icons/Income.png' }),
                                                React.createElement('span', { style: { color: '#fff' } }, row.income)
                                            ),
                                            row.wave >= 11 && React.createElement('br'),
                                            //row.wave >= 11 && React.createElement('span', { className: 'stat' },
                                            //    React.createElement('img', { src: 'hud/img/icons/ValueAfter10.png' }),
                                            //    React.createElement('span', { style: { color: '#fff' } }, row.valueAfter10)
                                            //),
                                            row.wave >= 11 && React.createElement('span', { className: 'stat' },
                                                React.createElement('img', { src: 'hud/img/icons/WorkerAfter10.png' }),
                                                React.createElement('span', { style: { color: '#fff' } }, row.workersAfter10)
                                            ),
                                            //row.wave >= 11 && React.createElement('span', { className: 'stat' },
                                            //    React.createElement('img', { src: 'hud/img/icons/IncomeAfter10.png' }),
                                            //    React.createElement('span', { style: { color: '#fff' } }, row.incomeAfter10)
                                            //),
                                            React.createElement('div', { className: 'stat' },
                                                //React.createElement('span', { className: 'label' }, locName('leak_ratio', "Leak Ratio")),
                                                React.createElement('img', { src: 'hud/img/icons/LeakRatio.png' }),
                                                React.createElement('span', { style: { textAlign: 'center' } },
                                                    React.createElement('span', { style: { color: '#fff' } }, row.leakRatioFirstNumber),
                                                    React.createElement('span', { style: { color: '#fff' } }, '/'),
                                                    React.createElement('span', { style: { color: '#fff' } }, row.leakRatioSecondNumber)
                                                )
                                            ),
                                            row.mvpRank >= 1 && row.mvpRank <= 8 && React.createElement('div', { className: 'stat' },
                                                React.createElement('img', { src: 'hud/img/icons/AlphaTop10.png' }),
                                                React.createElement('span', { style: { textAlign: 'center' } },
                                                    row.mvpRank == 1 && React.createElement('span', { style: { color: '#fff' } }, "MVP"),
                                                    row.mvpRank == 2 && React.createElement('span', { style: { color: '#fff' } }, "2nd"),
                                                    row.mvpRank == 3 && React.createElement('span', { style: { color: '#fff' } }, "3rd"),
                                                    row.mvpRank == 4 && React.createElement('span', { style: { color: '#fff' } }, "4th"),
                                                    row.mvpRank == 5 && React.createElement('span', { style: { color: '#fff' } }, "5th"),
                                                    row.mvpRank == 6 && React.createElement('span', { style: { color: '#fff' } }, "6th"),
                                                    row.mvpRank == 7 && React.createElement('span', { style: { color: '#fff' } }, "7th"),
                                                    row.mvpRank == 8 && React.createElement('span', { style: { color: '#fff' } }, "8th")
                                                )
                                            )
                                        ),
                                        React.createElement('div', { className: 'build' },
                                            React.createElement('div', { className: 'build-container' },
                                                row.build && row.build.map(function (entry) {
                                                    if (entry.count == 0) return
                                                    return React.createElement('div', { className: 'tower' },
                                                        React.createElement('img', { src: entry.icon }),
                                                        React.createElement('span', { className: 'count' + (entry.count == 1 ? ' one' : '') }, entry.count)
                                                    )
                                                })
                                            ),
                                            React.createElement('div', { className: 'build-container', style: {} },
                                                React.createElement('span', { className: 'label' },
                                                    loc('opening', 'Opening') + ': '
                                                ),
                                                row.openingBuild && row.openingBuild.map(function (entry) {
                                                    if (entry.count == 0) return
                                                    return React.createElement('div', { className: 'tower' },
                                                        React.createElement('img', { src: entry.icon }),
                                                        React.createElement('span', { className: 'count' + (entry.count == 1 ? ' one' : '') }, entry.count)
                                                    )
                                                })
                                            ),
                                            React.createElement('div', { className: 'build-container', style: {} },
                                                row.mastermindIcon && React.createElement('span', { className: 'label' },
                                                    loc('legion', 'Legion') + ': '
                                                ),
                                                row.mastermindIcon && React.createElement('div', { className: 'spell' },
                                                    React.createElement('img', { src: 'hud/img/' + row.mastermindIcon })
                                                ),
                                                // Margin if we have a mastermindIcon
                                                row.mastermindIcon && row.legionSpellIcon && React.createElement('span', { className: 'label', style: { marginLeft: '8px' } },
                                                    loc('spell', 'Spell') + ': '
                                                ),
                                                // No margin otherwise
                                                !row.mastermindIcon && row.legionSpellIcon && React.createElement('span', { className: 'label' },
                                                    loc('spell', 'Spell') + ': '
                                                ),
                                                row.legionSpellIcon && React.createElement('div', { className: 'spell' },
                                                    React.createElement('img', { src: 'hud/img/' + row.legionSpellIcon })
                                                )
                                            )
                                        ),
                                        React.createElement('div', { className: 'team' },
                                            row.leftTeam.map(function (entry) {
                                                var ratingImage = getRatingImage(entry.rating, row.queueType == 'Classic' || row.queueType == 'ClassicNoob')
                                                return React.createElement('div', { className: 'player' + (name == entry.name ? ' emphasized' : '') },
                                                    ratingImage && React.createElement('img', { src: ratingImage }),
                                                    React.createElement('span', {
                                                        dangerouslySetInnerHTML: {
                                                            __html: entry.name
                                                        }
                                                    })
                                                )
                                            })
                                        ),
                                        React.createElement('div', { className: 'team' },
                                            row.rightTeam.map(function (entry) {
                                                var ratingImage = getRatingImage(entry.rating, row.queueType == 'Classic' || row.queueType == 'ClassicNoob')
                                                return React.createElement('div', { className: 'player' + (name == entry.name ? ' emphasized' : '') },
                                                    ratingImage && React.createElement('img', { src: ratingImage }),
                                                    React.createElement('span', {
                                                        dangerouslySetInnerHTML: {
                                                            __html: entry.name
                                                        }
                                                    })
                                                )
                                            })
                                        )
                                        //JSON.stringify(row)
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

var GameStats = React.createClass({
    verboseDebugging: false,
    lastRefreshedName: "",
    lastRefreshedQueueType: -1,
    graphTypes: [],
    getInitialState: function () {
        var savedQueueType = 0
        if (globalState.mainProfile != null
            && globalState.mainProfile.advancedProfile != null
            && globalState.mainProfile.advancedProfile.mainQueueType != null) {
            savedQueueType = globalState.mainProfile.advancedProfile.mainQueueType
        }

        return {
            profile: globalState.mainProfile,
            //queueType: 0,
            queueType: savedQueueType,
            graphInfo: null,
            graphInfoQueueType: 0,
            selectedGraphIndex: 0,
            statsTab: 0,
        }
    },
    componentWillMount: function () {
        var parent = this

        bindings.refreshFighterStats = function (profile) {
            //console.log('refreshFighterStats, queueType: ' + profile.advancedProfile.mainQueueType)
            parent.setState({
                profile: profile,
                queueType: profile.advancedProfile.mainQueueType
            })
        }

        bindings.refreshWaveStats = function (profile) {
            //console.log('refreshWaveStats, queueType: ' + profile.advancedProfile.mainQueueType)
            parent.setState({
                profile: profile,
                graphInfo: null, // force a refresh if we have new data
                queueType: profile.advancedProfile.mainQueueType,
            })
        }
    },
    getGraphInfo: function () {
        var parent = this

        // Cache hit
        if (this.state.graphInfo != null && parent.state.queueType == parent.state.graphInfoQueueType)
            return this.state.graphInfo

        var waveGraphs = {
            waveCount: 21
        }

        var profile = this.state.profile

        if (!profile.advancedProfile)
            return null

        console.log('getGraphInfo, queueType is: ' + parent.state.queueType)

        var advancedProfileEntry = profile.advancedProfile.advancedProfiles[parent.state.queueType]
        if (advancedProfileEntry.waveDetails) {
            var workers = []
            var income = []
            var bigLeaks = []
            var leaksPercent = []
            var winRate = []
            var gameEnded = []

            for (var wave = 0; wave <= 21; wave++) {
                if (advancedProfileEntry.waveDetails[wave]) {

                    var gamesEndedThisWave = advancedProfileEntry.waveDetails[wave].wins + advancedProfileEntry.waveDetails[wave].losses

                    var gamesMadeItToThisWave = advancedProfileEntry.waveDetails[wave].games

                    //console.log('gamesMadeItToThisWave wave ' + wave + ': ' + gamesMadeItToThisWave + ", advancedProfileEntry.waveDetails[wave].bigLeaks: " + advancedProfileEntry.waveDetails[wave].bigLeaks)

                    if (gamesMadeItToThisWave > 0) {
                        workers.push((advancedProfileEntry.waveDetails[wave].workers / gamesMadeItToThisWave).toFixed(1))
                        income.push((advancedProfileEntry.waveDetails[wave].income / gamesMadeItToThisWave).toFixed(1))
                        bigLeaks.push((100 * advancedProfileEntry.waveDetails[wave].bigLeaks / gamesMadeItToThisWave).toFixed(1))
                        leaksPercent.push((1 * advancedProfileEntry.waveDetails[wave].leaksPercent / gamesMadeItToThisWave).toFixed(1))
                    } else {
                        workers.push((0).toFixed(1))
                        income.push((0).toFixed(1))
                        bigLeaks.push((0).toFixed(1))
                        leaksPercent.push((0).toFixed(1))
                    }
                    if (gamesEndedThisWave > 0)
                        winRate.push((100 * advancedProfileEntry.waveDetails[wave].wins / gamesEndedThisWave).toFixed(1))
                    else
                        winRate.push(0)
                    gameEnded.push((100 * gamesEndedThisWave / advancedProfileEntry.gamesThisSeason).toFixed(1))
                } else {
                    workers.push(0)
                    income.push(0)
                    bigLeaks.push(0)
                    leaksPercent.push(0)
                    winRate.push(0)
                    gameEnded.push(0)
                }
            }

            waveGraphs.workers = workers
            waveGraphs.income = income
            waveGraphs.bigLeaks = bigLeaks
            waveGraphs.leaksPercent = leaksPercent
            waveGraphs.winRate = winRate
            waveGraphs.gameEnded = gameEnded
        }

        parent.setState({ graphInfoQueueType: parent.state.queueType })

        return waveGraphs
    },
    setSelectedGraphIndex: function (selectedGraphIndex) {
        var parent = this

        if (selectedGraphIndex < 0) return
        if (selectedGraphIndex >= this.graphTypes.length) return

        parent.setState({ selectedGraphIndex: selectedGraphIndex })
    },
    componentDidMount: function () {
        var parent = this

        if (parent.state.graphInfo == null) return
        console.log("graph componentDidMount --> createChart()")
        this.createChart()
        this.refreshSort()
    },
    componentDidUpdate: function () {
        var parent = this

        if (parent.state.graphInfo == null) return
        console.log("graph componentDidUpdate --> createChart()")
        this.createChart()

        this.lastRefreshedName = "" // Force sort
        this.refreshSort()
    },
    refreshSort: function () {
        var parent = this
        var leaderboard = this.refs.leaderboard
        if (leaderboard != null) {
            sorttable.makeSortable(leaderboard);

            if (parent.verboseDebugging) {
                console.log("profile table update: lastRefreshedName: " + parent.lastRefreshedName + ", name: " + parent.state.profile.name + ", lastRefreshedQueueType: " + parent.lastRefreshedQueueType
                    + ", queueType: " + parent.state.queueType)
            }

            if (parent.lastRefreshedQueueType != parent.state.queueType || parent.lastRefreshedName != parent.state.profile.name) {
                sorttable.innerSortFunction.apply(this.refs.defaultSortColumn, []);
            }
        }
        parent.lastRefreshedQueueType = parent.state.queueType
        parent.lastRefreshedName = parent.state.profile.name
    },
    createChart: function () {
        var parent = this

        var dataToRender = []
        var chart = null

        // Smelly hardcoded association since the chart refs are hardcoded
        // See getWaveGraphTypes to update graph info
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
        else
            chart = this.refs.chart10

        if (chart == null || chart.length == 0) {
            console.log('chart was null or length 0')
            return
        }

        if (this.state.graphInfo == null) {
            console.log('graphinfo was null')
            return
        }

        var labels = []
        for (var i = 0; i <= this.state.graphInfo.waveCount; i++)
            labels.push(loc('wave', 'Wave') + ' ' + i)

        var datasets = []
        var graphItem = parent.graphTypes[parent.state.selectedGraphIndex]

        if (graphItem.category == 'wave') {
            //this.state.graphInfo.players.map(function (players, index) {
            // far in the future, a cool feature would be to compare you to another player and overlay the two graphs... lol #mightbeoutofscope

            var dataToRender = []

            if (graphItem.key == 'workers')
                dataToRender = this.state.graphInfo.workers
            else if (graphItem.key == 'income')
                dataToRender = this.state.graphInfo.income
            else if (graphItem.key == 'bigleaks')
                dataToRender = this.state.graphInfo.bigLeaks
            else if (graphItem.key == 'leakspercent')
                dataToRender = this.state.graphInfo.leaksPercent
            else if (graphItem.key == 'winrate')
                dataToRender = this.state.graphInfo.winRate
            else if (graphItem.key == 'gameended')
                dataToRender = this.state.graphInfo.gameEnded
            else
                console.warn("unknown data key: " + graphItem.key)

            console.log('dataToRender: ' + JSON.stringify(dataToRender))

            datasets.push({
                label: parent.state.profile.name,
                data: dataToRender,
                borderColor: '#ffcc00',
                backgroundColor: '#ffcc00',
                fill: false,
                pointRadius: 5,
                pointHitRadius: 10,
                lineTension: 0,
                yAxisID: 'y-axis-0',
            })
        } else {
            console.warn("invalid category: " + graphItem.category)
            console.log("invalid category: " + graphItem.category)
        }

        var myChart = new Chart(chart, {
            type: (graphItem.category == 'goldAdvantage' || graphItem.category == 'powerScoreAdvantage') ? 'NegativeTransparentLine' : 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                tooltips: {
                    mode: 'index',
                    position: 'average',
                    intersect: true,
                    callbacks: {
                        label: function (item) { return item.yLabel + graphItem.units }
                    }
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
                            suggestedMax: parent.graphTypes[parent.state.selectedGraphIndex].suggestedMax
                        }
                    }]
                },
                legend: {
                    display: (graphItem.category == 'goldAdvantage' || graphItem.category == 'powerScoreAdvantage') ? false : true,
                }
            }
        });
    },
    renderWaveStats: function () {
        var parent = this

        var name = this.state.profile.name
        if (!name)
            name = globalState.currentProfileLoadingName

        var advancedProfile = this.state.profile.advancedProfile
        if (!advancedProfile) {
            return React.createElement('div', { className: 'profile-container' },
                React.createElement('div', {
                    className: 'profile-main', style: { textAlign: 'center' }
                },
                    React.createElement('img', {
                        src: 'hud/img/ui/loading-small.gif',
                    })
                )
            )
        }
        var advancedProfileEntry = advancedProfile.advancedProfiles[parent.state.queueType]

        // Play more games
        //console.log('graphs length was: ' + Object.keys(advancedProfileEntry.waveDetails).length)
        //console.log('totalWavesPlayed: ' + advancedProfileEntry.totalWavesPlayed)
        var mustPlayMoreGames = !advancedProfileEntry || advancedProfileEntry.totalWavesPlayed == 0

        return (
            React.createElement('div', { className: 'block wave-stats' },
                React.createElement('div', { class: 'wave-graphs', ref: 'waveGraphs' },
                    mustPlayMoreGames && React.createElement('div', {
                        style: {
                            padding: '28px',
                            textAlign: 'center',
                            wordWrap: 'normal',
                            pointerEvents: 'none'
                        }
                    },
                        loc('play_more_games_first', 'Play more games first')
                    ),
                    !mustPlayMoreGames && parent.graphTypes.map(function (item, index) {
                        if (parent.state.selectedGraphIndex != index)
                            return null

                        return (
                            React.createElement('canvas', {
                                className: 'post-game-graph',
                                style: {
                                },
                                ref: 'chart' + index,
                            })
                        )
                    })
                )

            )
        )
    },
    render: function () {
        var parent = this


        var name = this.state.profile.name
        if (!name)
            name = globalState.currentProfileLoadingName

        var advancedProfile = this.state.profile.advancedProfile
        if (!advancedProfile) {
            return React.createElement('div', { className: 'profile-container' },
                React.createElement('div', {
                    className: 'profile-main', style: { textAlign: 'center' }
                },
                    React.createElement('img', {
                        src: 'hud/img/ui/loading-small.gif',
                    })
                )
            )
        }

        //console.log('TEST: Game Stats queueType is: ' + parent.state.queueType + ', mainQueueType is: ' + advancedProfile.mainQueueType)

        var advancedProfileEntry = advancedProfile.advancedProfiles[parent.state.queueType]
        var unitDetails = advancedProfileEntry.unitDetails
        var unitDetailsList = Object.keys(unitDetails)
        var builderDetails = advancedProfileEntry.builderDetails
        var builderDetailsList = Object.keys(builderDetails)

        //var totalUnitPoints = 0
        //if (unitDetailsList.length > 0) {
        //    for (key in unitDetails) {
        //        totalUnitPoints += unitDetails[key].picked
        //    }
        //    if (parent.verboseDebugging)
        //        console.log('totalUnitPoints: ' + totalUnitPoints)
        //}

        if (parent.state.graphInfo == null || parent.state.graphInfoQueueType != parent.state.queueType) {
            console.warn('graphInfo was null or for wrong queue --> try to rebuild it')
            parent.setState({
                graphInfo: parent.getGraphInfo()
            })
            return null
        }
        console.log("render graph with selectedGraphIndex: " + parent.state.selectedGraphIndex)
        if (this.graphTypes.length == 0) {
            //console.log("graph types not loaded; try to refresh it")
            this.graphTypes = getWaveGraphTypes()
        }

        // Queuetype dropdown (SMELLY copy and pasted some places)
        var queueTypeDropdownChoices = []
        var queueTypeKeys = Object.keys(parent.state.profile.advancedProfile.advancedProfiles)
        queueTypeKeys.map(function (entry, loopIndex) {
            var index = parseInt(queueTypeKeys[loopIndex])
            var advancedProfileAtIndex = parent.state.profile.advancedProfile.advancedProfiles[index]
            if (advancedProfileAtIndex != null) {
                if (parent.verboseDebugging)
                    console.log('index: ' + index + ', entry: ' + entry)
                var queueName = advancedProfileAtIndex.queueName
                queueTypeDropdownChoices.push({
                    text: index,
                    action: function () {
                        if (parent.verboseDebugging)
                            console.log("queueType selected " + index + ", name: " + queueName)
                        parent.setState({ queueType: index })
                    },
                    html: queueName
                })
            }
        })

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

        var statsTypeDropdownChoices = []
        statsTypeDropdownChoices.push({ text: 'fighters', action: function () { parent.setState({ statsTab: 0 }) }, html: loc('profile_fighter_stats', 'Fighter Stats') })
        statsTypeDropdownChoices.push({ text: 'waves', action: function () { parent.setState({ statsTab: 1 }) }, html: loc('profile_wave_stats', 'Wave Stats') })
        statsTypeDropdownChoices.push({ text: 'builders', action: function () { parent.setState({ statsTab: 2 }) }, html: loc('profile_builder_stats', 'Builder Stats') })

        var mustPlayMoreGames = !unitDetailsList || unitDetailsList.length == 0

        var statsTypeDropdownValue = loc('profile_fighter_stats', 'Fighter Stats')
        if (parent.state.statsTab == 1) statsTypeDropdownValue = loc('profile_wave_stats', 'Wave Stats')
        if (parent.state.statsTab == 2) statsTypeDropdownValue = loc('profile_builder_stats', 'Builder Stats')

        return (
            React.createElement('div', { className: 'profile-container game-stats' },
                React.createElement('div', { className: 'profile-main' },
                    React.createElement('div', { className: 'block' },
                        parent.state.statsTab == 0 && React.createElement('div', { className: 'name' }, loc('profile_persons_fighter_stats', name + "'s fighter stats", [name])),
                        parent.state.statsTab == 1 && React.createElement('h1', { style: { fontSize: '2.5rem', padding: '0' } }, name + "'s " + parent.graphTypes[parent.state.selectedGraphIndex].text),
                        parent.state.statsTab == 2 && React.createElement('div', { className: 'name' }, loc('profile_persons_builder_stats', name + "'s builder stats", [name])),
                        React.createElement('div', { className: 'game-stats-dropdown-containers' },
                            React.createElement('div', {
                                className: 'dropdown-container wave-graph',
                                style: {
                                    opacity: (parent.state.statsTab == 1) ? '1' : '0'
                                }
                            },
                                React.createElement(DropdownLinks, {
                                    choices: dropdownChoices,
                                    defaultValue: parent.graphTypes[0].text,
                                    actualValue: parent.graphTypes[parent.state.selectedGraphIndex].text
                                })
                            ),
                            React.createElement('div', {
                                className: 'dropdown-container queue-type',
                                style: {
                                }
                            },
                                React.createElement(DropdownLinks, {
                                    choices: queueTypeDropdownChoices,
                                    defaultValue: advancedProfileEntry.queueName,
                                    actualValue: advancedProfileEntry.queueName
                                })
                            ),
                            React.createElement('div', {
                                className: 'dropdown-container stats-type',
                                style: {
                                }
                            },
                                React.createElement(DropdownLinks, {
                                    choices: statsTypeDropdownChoices,
                                    defaultValue: loc('profile_fighter_stats', 'Fighter Stats'),
                                    actualValue: statsTypeDropdownValue
                                })
                            )
                        ),
                        parent.state.statsTab == 1 && parent.renderWaveStats(),
                        parent.state.statsTab == 0 && mustPlayMoreGames && React.createElement('div', {
                            style: {
                                padding: '28px',
                                textAlign: 'center',
                                wordWrap: 'normal',
                                pointerEvents: 'none'
                            }
                        },
                            loc('play_more_games_first', 'Play more games first')
                        ),
                        parent.state.statsTab == 0 && !mustPlayMoreGames && React.createElement('table', {
                            ref: 'leaderboard', className: 'leaderboard scrollable fighter-stats',
                            style: {
                                overflowY: 'auto',
                                maxHeight: '45vh',
                                width: '100%',
                            }
                        },
                            React.createElement('thead', {},
                                React.createElement('tr', {},
                                    React.createElement('td', { className: 'fighter' }, 'Fighter'),
                                    React.createElement('td', {
                                        ref: 'defaultSortColumn', className: 'simple-tooltip',
                                        style: { display: 'table-cell' }
                                    },
                                        locName('profile_performance', 'Performance'),
                                        React.createElement('span', { className: 'tooltiptext' },
                                            loc('profile_performance', 'Performance is based off of win rate and number of games played..')
                                        )
                                    ),
                                    React.createElement('td', {}, loc('usage_rate', 'Usage Rate')),
                                    React.createElement('td', {
                                        className: 'simple-tooltip',
                                        style: { display: 'table-cell' }
                                    },
                                        loc('pick_rate', 'Pick Rate'),
                                        React.createElement('span', { className: 'tooltiptext' },
                                            loc('pick_rate_long', 'Pick rate is the % that you pick a fighter when it is in your roll.')
                                        )
                                    ),
                                    React.createElement('td', {}, loc('win_rate', 'Win Rate')),
                                    React.createElement('td', {
                                        className: 'simple-tooltip',
                                        style: {
                                            display: 'table-cell'
                                        }
                                    },
                                        locName('profile_opening_performance', 'Opening Performance'),
                                        React.createElement('span', { className: 'tooltiptext' },
                                            loc('profile_performance', 'Performance is based off of win rate and number of games played..')
                                        )
                                    ),
                                    React.createElement('td', {}, loc('openings', 'Openings')),
                                    React.createElement('td', {}, loc('opening_win_rate', 'Opening Win Rate'))
                                    //React.createElement('td', {}, loc('picks', 'Picks')),
                                    //React.createElement('td', {}, loc('wins', 'Wins')),
                                    //React.createElement('td', {}, loc('losses', 'Losses')),
                                    //React.createElement('td', {}, loc('openings', 'Openings'))
                                )
                            ),
                            React.createElement('tbody', { className: 'addspace' },
                                unitDetailsList && unitDetailsList.length > 0 && unitDetailsList.map(function (unitType, index) {
                                    var unit = unitDetails[unitType]

                                    var gamesUsed = unit.wins + unit.losses
                                    var openingGamesUsed = unit.openingWins + unit.openingLosses

                                    // Skip anything where we didn't actually use it
                                    if (gamesUsed == 0) return null

                                    var winRate = (0).toFixed(1)
                                    var winRateSort = 0
                                    var openingWinRate = (0).toFixed(1)
                                    var openingWinRateSort = 0
                                    if (gamesUsed > 0) {
                                        winRateSort = Math.min(99.99, ((unit.wins / gamesUsed) * 100).toFixed(5))
                                        winRate = Math.min(100, ((unit.wins / gamesUsed) * 100).toFixed(1))
                                    }
                                    if (openingGamesUsed > 0) {
                                        openingWinRateSort = Math.min(99.99, ((unit.openingWins / openingGamesUsed) * 100) + 0.001 * winRate).toFixed(5)
                                        openingWinRate = Math.min(100, ((unit.openingWins / openingGamesUsed) * 100).toFixed(1))
                                    }
                                    var pickRate = unit.truePickRate.toFixed(1)
                                    var usageRate = Math.min(100, ((unit.used / advancedProfileEntry.gamesThisSeason) * 100)).toFixed(1)
                                    var performance = (0).toFixed(1)

                                    //var performanceRaw = (100 * ((unit.wins + 1.9208) / (unit.wins + unit.losses) - 1.96 * Math.sqrt((unit.wins * unit.losses) / (unit.wins + unit.losses) + 0.9604) / (unit.wins + unit.losses)) / (1 + 3.8416 / (unit.wins + unit.losses)))
                                    var performanceRaw = getGameStatsPerformanceScore(unit.wins, unit.losses)
                                    var performanceRawRounded = Math.round(performanceRaw * 10) / 10
                                    var performanceSort = _.pad((1000 * Number(performanceRawRounded + 0.001 * unit.wins - 0.001 * unit.losses)).toFixed(0), 2, '0')
                                    if (gamesUsed > 0) {
                                        performance = performanceRaw.toFixed(1)
                                    } else {
                                        performanceSort = 0
                                    }

                                    var openingGamesUsed = unit.openingWins + unit.openingLosses
                                    var openingPerformance = (0).toFixed(1)
                                    //var openingPerformanceRaw = (100 * ((unit.openingWins + 1.9208) / (unit.openingWins + unit.openingLosses) - 1.96 * Math.sqrt((unit.openingWins * unit.openingLosses) / (unit.openingWins + unit.openingLosses) + 0.9604) / (unit.openingWins + unit.openingLosses)) / (1 + 3.8416 / (unit.openingWins + unit.openingLosses)))
                                    var openingPerformanceRaw = getGameStatsPerformanceScore(unit.openingWins, unit.openingLosses)
                                    //openingPerformanceRaw *= 1.25 // just since opening games are lower sample size
                                    var openingPerformanceRawRounded = Math.round(openingPerformanceRaw * 10) / 10
                                    var openingPerformanceSort = _.pad((1000 * Number(openingPerformanceRawRounded + 0.001 * unit.wins - 0.001 * unit.openingLosses)).toFixed(0), 2, '0')
                                    if (openingGamesUsed > 0) {
                                        openingPerformance = openingPerformanceRaw.toFixed(1)
                                    }
                                    else {
                                        openingPerformanceSort = 0
                                    }

                                    //console.log('winRate: ' + winRate)
                                    //console.log('pickRate: ' + pickRate)
                                    //console.log('usageRate: ' + usageRate)
                                    //console.log('performance: ' + performance)  
                                    //console.log('performanceRawRounded: ' + performanceRawRounded)
                                    //console.log('performanceSort: ' + performanceSort)
                                    //console.log('openingWinRateSort: ' + openingWinRateSort)
                                    //console.log('openingPerformance: ' + openingPerformance + ' based on ' + unit.openingWins + ' wins and ' + unit.openingLosses + ' losses')
                                    //console.log('openingPerformanceSort: ' + openingPerformanceSort + ' based on ' + unit.openingWins + ' wins and ' + unit.openingLosses + ' losses')

                                    return React.createElement('tr', { className: '' },
                                        React.createElement('td', {
                                            className: ''
                                        },
                                            React.createElement('img', { src: 'hud/img/' + unit.icon }),
                                            React.createElement('span', { style: {} }, unit.name)
                                        ),
                                        React.createElement('td', { 'data-st-key': performanceSort },
                                            performance >= 60 && React.createElement('span', { style: { color: '#8ff110' } }, performance),
                                            performance >= 40 && performance < 60 && React.createElement('span', {}, performance),
                                            performance < 40 && React.createElement('span', { style: { color: '#ff3333' } }, performance)
                                        ),
                                        React.createElement('td', { className: '' }, usageRate + '%'),
                                        React.createElement('td', { className: '' }, pickRate + '%'),
                                        React.createElement('td', { className: '', 'data-st-key': winRateSort },
                                            winRate,
                                            '%',
                                            React.createElement('span', { style: { fontSize: '0.8rem', color: 'gray' } }, ' (' + unit.wins + 'W ' + unit.losses + 'L)')),
                                        React.createElement('td', { 'data-st-key': openingPerformanceSort },
                                            openingGamesUsed == 0 ? '' : openingPerformance >= 60 && React.createElement('span', { style: { color: '#8ff110' } }, openingPerformance),
                                            openingGamesUsed == 0 ? '' : openingPerformance >= 40 && openingPerformance < 60 && React.createElement('span', {}, openingPerformance),
                                            openingGamesUsed == 0 ? '' : openingPerformance < 40 && React.createElement('span', { style: { color: '#ccc' } }, openingPerformance)
                                        ),
                                        React.createElement('td', { className: '', 'data-st-key': unit.opened },
                                            openingGamesUsed == 0 ? '' : unit.opened
                                        ),
                                        React.createElement('td', { className: '', 'data-st-key': openingWinRateSort },
                                            openingGamesUsed == 0 ? '' : openingWinRate,
                                            openingGamesUsed == 0 ? '' : '%',
                                            openingGamesUsed == 0 ? '' : React.createElement('span', { style: { fontSize: '0.8rem', color: 'gray' } }, ' (' + unit.openingWins + 'W ' + unit.openingLosses + 'L)')
                                        )
                                    )
                                })
                            )
                        ),
                        parent.state.statsTab == 2 && mustPlayMoreGames && React.createElement('div', {
                            style: {
                                padding: '28px',
                                textAlign: 'center',
                                wordWrap: 'normal',
                                pointerEvents: 'none'
                            }
                        },
                            loc('play_more_games_first', 'Play more games first')
                        ),
                        parent.state.statsTab == 2 && !mustPlayMoreGames && React.createElement('table', {
                            ref: 'leaderboard', className: 'leaderboard scrollable fighter-stats',
                            style: {
                                overflowY: 'auto',
                                maxHeight: '45vh',
                                width: '100%',
                            }
                        },
                            React.createElement('thead', {},
                                React.createElement('tr', {},
                                    React.createElement('td', { className: 'fighter' }, 'Fighter'),
                                    React.createElement('td', {
                                        ref: 'defaultSortColumn', className: 'simple-tooltip',
                                        style: { display: 'table-cell' }
                                    },
                                        locName('profile_performance', 'Performance'),
                                        React.createElement('span', { className: 'tooltiptext' },
                                            loc('profile_performance', 'Performance is based off of win rate and number of games played..')
                                        )
                                    ),
                                    React.createElement('td', {}, loc('usage_rate', 'Usage Rate')),
                                    React.createElement('td', {}, loc('win_rate', 'Win Rate'))
                                )
                            ),
                            React.createElement('tbody', { className: 'addspace' },
                                builderDetailsList && builderDetailsList.length > 0 && builderDetailsList.map(function (builderType, index) {
                                    var builder = builderDetails[builderType]
                                    var gamesUsed = builder.wins + builder.losses

                                    // Skip anything where we didn't actually use it
                                    if (gamesUsed == 0) return null

                                    var winRate = (0).toFixed(1)
                                    var winRateSort = 0
                                    if (gamesUsed > 0) {
                                        winRateSort = Math.min(99.99, ((builder.wins / gamesUsed) * 100).toFixed(5))
                                        winRate = Math.min(100, ((builder.wins / gamesUsed) * 100).toFixed(1))
                                    }
                                    var usageRate = (0).toFixed(1)
                                    if (advancedProfileEntry.builderGamesPlayed > 0)
                                        usageRate = (100 * gamesUsed / advancedProfileEntry.builderGamesPlayed).toFixed(1)
                                    var performance = (0).toFixed(1)
                                    //var performanceRaw = (100 * ((builder.wins + 1.9208) / (builder.wins + builder.losses) - 1.96 * Math.sqrt((builder.wins * builder.losses) / (builder.wins + builder.losses) + 0.9604) / (builder.wins + builder.losses)) / (1 + 3.8416 / (builder.wins + builder.losses)))
                                    var performanceRaw = getGameStatsPerformanceScore(builder.wins, builder.losses)
                                    var performanceRawRounded = Math.round(performanceRaw * 10) / 10
                                    var performanceSort = _.pad((1000 * Number(performanceRawRounded - 0.001 * builder.losses)).toFixed(0), 2, '0')
                                    if (gamesUsed > 0) {
                                        performance = performanceRaw.toFixed(1)
                                    } else {
                                        performanceSort = 0
                                    }

                                    // TESTING
                                    //console.log('winRate: ' + winRate)
                                    //console.log('usageRate: ' + usageRate)
                                    //console.log('performance: ' + performance)  
                                    //console.log('performanceRawRounded: ' + performanceRawRounded)
                                    //console.log('performanceSort: ' + performanceSort)

                                    return React.createElement('tr', { className: '' },
                                        React.createElement('td', {
                                            className: ''
                                        },
                                            React.createElement('img', { src: 'hud/img/' + builder.icon }),
                                            React.createElement('span', { style: {} }, builder.name)
                                        ),
                                        React.createElement('td', { 'data-st-key': performanceSort },
                                            performance >= 60 && React.createElement('span', { style: { color: '#8ff110' } }, performance),
                                            performance >= 40 && performance < 60 && React.createElement('span', {}, performance),
                                            performance < 40 && React.createElement('span', { style: { color: '#ff3333' } }, performance)
                                        ),
                                        React.createElement('td', { className: '' }, usageRate + '%'),
                                        React.createElement('td', { className: '', 'data-st-key': winRateSort },
                                            winRate,
                                            '%',
                                            React.createElement('span', { style: { fontSize: '0.8rem', color: 'gray' } }, ' (' + builder.wins + 'W ' + builder.losses + 'L)')
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

// v10.00
var Masteries = React.createClass({
    forceOpacityCallback: null,
    getInitialState: function () {
        return {
            profile: globalState.mainProfile,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshMasteries = function (profile) {
            parent.setState({
                profile: profile,
            })
        },
            bindings.onScrollbarMouseDown['Masteries'] = function () {
                console.log('onScrollbarMouseDown Mastery')
                parent.removeBlackTearing()
            },
            bindings.onScrollbarMouseUp['Masteries'] = function () {
                console.log('onScrollbarMouseUp Mastery')
                parent.removeBlackTearing()
            }
    },
    removeBlackTearing: function () {
        var parent = this

        // hotfix for missing/cutoff cards
        // It has to do with the webkit filter grayscale performance optimization
        // So we force opacity change slightly to force a redraw
        // See Coherent email thread for explanation

        // v8.00 throttle
        if (parent.forceOpacityCallback != null) {
            clearTimeout(parent.forceOpacityCallback)
        }

        parent.forceOpacityCallback = setTimeout(function () {
            var elem = parent.refs.main
            elem.style.opacity = "0.99"
            elem.offsetHeight;
            elem.style.opacity = "1"
        }, 100)
    },
    render: function () {
        var parent = this

        if (this.state.profile == null) return

        var name = this.state.profile.name
        if (!name)
            name = globalState.currentProfileLoadingName

        var isMyProfile = name == globalState.savedUsername
        var indexThisLegionSecret = 0

        var stillLoading = this.state.profile.skinRowNames == null || this.state.profile.skinRowNames.length == 0
        if (stillLoading) {
            return React.createElement('div', { className: 'profile-container' },
                React.createElement('div', {
                    className: 'profile-main', style: { textAlign: 'center' }
                },
                    React.createElement('img', {
                        src: 'hud/img/ui/loading-small.gif',
                    })
                )
            )
        }

        return (
            React.createElement('div', {
                className: 'profile-container',
                onWheel: function (e) {
                    parent.removeBlackTearing()
                }
            },
                React.createElement('div', { className: 'profile-main', ref: 'main' },
                    React.createElement('div', { className: 'block' },
                        React.createElement('span', { className: 'name' }, loc('profile_persons_masteries', name + "'s masteries", [name])),
                        React.createElement('span', {
                            className: 'simple-tooltip flipped-y',
                            style: {
                                fontSize: '14px',
                                color: '#c0c0c0',
                                marginLeft: '6px'
                            },
                        },
                            '[?]',
                            React.createElement('span', {
                                className: 'tooltiptext ultra-wide',
                                dangerouslySetInnerHTML: {
                                    __html: loc('masteries', "Masteries show how much you love a specific opening, etc.")
                                },
                                style: {
                                    marginLeft: '20px'
                                }
                            })
                        )
                    ),
                    React.createElement('div', { className: 'block' },
                        React.createElement('div', { className: 'items' },
                            (!this.state.profile.skins || this.state.profile.skins.length == 0) && React.createElement('div',
                                {}, React.createElement('div', { className: 'no-items-spacer' })
                            ),
                            this.state.profile.masteries && this.state.profile.masteries.map(function (mastery) {
                                var indexThisLegion = 0
                                indexThisLegion++

                                var extraTooltipStyle = ''
                                if (indexThisLegion % 16 > 13)
                                    extraTooltipStyle = ' flipped'

                                var fillPercent = mastery.mpProgress
                                var isUnused = mastery.level == 0 && fillPercent == 0

                                return (
                                    React.createElement('div', {
                                        className: 'simple-tooltip ' + extraTooltipStyle + ' equipped',
                                        onMouseDown: function (e) {
                                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness
                                            if (mastery.hasReward) return
                                            engine.call('OnClickMasteryNoReward', mastery.unitType)
                                        },
                                        onMouseEnter: function () {
                                            engine.call("OnMouseOverMedium", mastery.unitType.length)
                                        }
                                    },
                                        // v10.00
                                        React.createElement('div', { className: 'mastery' },
                                            mastery.hasReward && React.createElement('div', {
                                                className: 'mastery-reward', 
                                                onMouseDown: function (e) {
                                                    if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness
                                                    console.log('click mastery reward')
                                                    engine.call('OnCollectMasteryRewardSingle', mastery.unitType)
                                                }
                                            },
                                                React.createElement('img', { className: 'mastery-reward-image', src: 'hud/img/shop/currency/Essence_64_Glow.png' })
                                            ),
                                            React.createElement('img', { className: 'mastery-image' + (isUnused ? ' unused' : '') + (mastery.hasReward ? ' has-reward' : ''), src: 'hud/img/' + mastery.image }),
                                            //React.createElement('img', { className: 'mastery-badge', src: 'hud/img/icons/Mastery/1.png'}),
                                            React.createElement('div', { className: 'mastery-name' + (isUnused ? ' unused' : '') + (mastery.hasReward ? ' has-reward' : '') },
                                                mastery.name
                                            ),
                                            React.createElement('div', { className: 'mastery-bar' + (isUnused ? ' unused' : '') + (mastery.hasReward ? ' has-reward' : '') },
                                                React.createElement('div', {
                                                    className: "progress-container simple-tooltip",
                                                    style: { width: 'calc(100% - 28px)', height: '14px', marginLeft: '20px' }
                                                },
                                                    React.createElement('div', {
                                                        className: "progress-bar", style: {
                                                            width: (100 * fillPercent) + "%",
                                                        }
                                                    }),
                                                    React.createElement('span', { className: 'value' },
                                                        React.createElement('img', { className: 'value-img', src: 'hud/img/icons/Mastery/40px/' + mastery.level + '.png' })
                                                    ),
                                                    React.createElement('span', { className: 'tooltiptext small' },
                                                        React.createElement('div', {}, mastery.mpFirstNumber + "/" + mastery.mpSecondNumber + ' MP')
                                                    )
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
    }
})
