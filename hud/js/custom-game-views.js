// Custom games
// ===============================================================================

var CustomGameView = React.createClass({
    propTypes: {
        items: React.PropTypes.array,
    },
    render: function () {
        return (
            React.createElement('div', { id: 'CustomGameView' },
                React.createElement('div', {
                    className: 'fullscreen',
                    onMouseDown: function (e) { // v1.50
                        if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                        engine.trigger('enableChat', false)
                    },
                    style: {
                        pointerEvents: 'all'
                    }
                },
                    React.createElement(CustomGameMenu, { items: this.props.items })
                )
            )
        )
    }
})

var CustomGameMenu = React.createClass({
    propTypes: {
        items: React.PropTypes.array,
    },
    getInitialState: function () {
        return {
            owner: "",
            ownerPlayFabId: "",
            settings: {},
            humanCount: 0,
            showSettingsPopup: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.setCustomGameOwner = function (playFabId, displayName) {
            console.log("setCustomGameOwner from " + parent.state.owner + " to " + playFabId + " (" + displayName + ")")
            var is4v4BotGame = displayName == "Public 4v4" // ghetto for now

            parent.setState({
                ownerPlayFabId: playFabId,
                owner: displayName,
                settings: is4v4BotGame ? "This game will automatically start when full. Teams are automatically shuffled to improve fairness." : "(Default settings)"
            })
        }
        bindings.setCustomGameHumanCount = function (count) {
            //console.log("TEST: v8.04 setCustomGameHumanCount to " + count)
            parent.setState({
                humanCount: count
            })
        }
        bindings.setCustomGameSettings = function (settings) {
            parent.setState({ settings: settings })
        }
    },
    render: function () {
        var parent = this

        //console.log("rendering " + this.props.items.length + " items")
        //for (var i = 0; i < this.props.items.length; i++)
        //    console.log("item " + i + ": " + this.props.items[i].key + ", " + this.props.items[i].name)

        var locked = globalState.playFabId != this.state.ownerPlayFabId

        var summaryText = ""
        if (this.state.settings.customGameModesString) {
            if (_.includes(this.state.settings.customGameModesString, "chaos"))
                summaryText += locName('arcade_queue_chaos', "Chaos") + ", "
            if (_.includes(this.state.settings.customGameModesString, "hybrid"))
                summaryText += locName('arcade_queue_hybrid', "Hybrid") + ", "
            if (_.includes(this.state.settings.customGameModesString, "x2"))
                summaryText += locName('arcade_queue_x2', "X2") + ", "
            if (_.includes(this.state.settings.customGameModesString, "allVisible"))
                summaryText += locName('arcade_queue_allvisible', "All Visible") + ", "
            if (_.includes(this.state.settings.customGameModesString, "noSaving"))
                summaryText += locName('arcade_queue_nosaving', "No Saving") + ", "
            if (_.includes(this.state.settings.customGameModesString, "noT1s"))
                summaryText += locName('arcade_queue_not1s', "No T1s") + ", "
            if (_.includes(this.state.settings.customGameModesString, "prophet"))
                summaryText += locName('arcade_queue_prophet', "Prophet") + ", "
            if (_.includes(this.state.settings.customGameModesString, "mastermind"))
                summaryText += locName('arcade_queue_tournament', "Tournament") + ", "
            if (_.includes(this.state.settings.customGameModesString, "teammercs"))
                summaryText += locName('arcade_queue_teammercs', "Team Mercenaries") + ", "
            if (_.includes(this.state.settings.customGameModesString, "fog"))
                summaryText += locName('arcade_queue_fog', "Fog") + ", "
            if (_.includes(this.state.settings.customGameModesString, "autoHandicap"))
                summaryText += locName('arcade_queue_autohandicap', "Handicap") + ", "
        }
        if (summaryText.length > 0)
            summaryText = summaryText.substring(0, summaryText.length - 2) // Ghetto way to remove the trailing comma

        // Later it would be nice to support smaller games, but that would require some UI to represent being "in queue" while in a
        // custom game room
        var queueForClassicCorrectPlayerCount = parent.state.humanCount == 8

        return (
            React.createElement('div', { id: 'CustomGameMenu' },
                React.createElement('div', { className: 'centered-text overlay' },
                    React.createElement('div', { className: 'centered-text-wrapper' },
                        React.createElement('div', { id: 'CustomGameTools' },
                            React.createElement('h2', { className: 'title' }, loc('custom_game_room_title', parent.state.owner + "'s room", [parent.state.owner])),
                            React.createElement('div', {
                                className: 'button',
                                onClick: function () {
                                    //engine.trigger('loadPopup', 'sendcustomgameinvite')

                                    // v7.05
                                    globalState.inviteFriendStatus = '' // SMELLY
                                    engine.trigger('refreshFriendInvitationMenu', {
                                        header: loc('invite_to_game', 'Invite to game'),
                                        popupName: 'sendcustomgameinvite',
                                        friendTrigger: 'sendQuickCustomGameInvite'
                                    })
                                    showFullScreenPopup(React.createElement(FriendInvitationMenuView), false)

                                }
                            }, loc('custom_game_invite_players', "Invite Players")),
                            !locked && React.createElement('div', {
                                className: 'button',
                                onMouseDown: function (e) {
                                    if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                    engine.trigger('addAI')
                                }
                            }, loc('custom_game_add_ai', "Add AI")),
                            // todo needs to be implemented in lobby
                            //!locked && React.createElement('div', {
                            //    className: 'button',
                            //    onMouseDown: function (e) {
                            //        engine.call('OnCustomGameBalanceTeams')
                            //    }
                            //},
                            //    loc('custom_game_balance_teams', "Balance Teams")
                            //),
                            React.createElement('div', {
                                className: 'button',
                                onMouseDown: function (e) {
                                    //var left = e.nativeEvent.clientX
                                    //var top = e.nativeEvent.clientY
                                    var left = e.nativeEvent.target.offsetLeft
                                    var top = e.nativeEvent.target.offsetTop + 40

                                    if (e.nativeEvent.which == 2) return // v7.00: openContextMenu ingame doesn't like middle click for some reason

                                    openContextMenu('', '', customGameSettingsMenu, left, top, false,
                                        {
                                            width: '500px'
                                        })
                                }
                            },
                                loc('select_custom_modes', "Select Custom Modes")
                            ),
                            summaryText && React.createElement('div', { className: 'modes-summary-container' },
                                loc('custom_modes', "Custom Modes") + ": " + summaryText
                            )
                        ),
                        React.createElement('div', { id: 'CustomGameSlots' },
                            //React.createElement('div', { className: 'settings column' },
                            //    React.createElement('h2', { className: 'title' }, parent.state.owner + "'s room"),
                            //    React.createElement('div', { className: 'text-data' },
                            //        React.createElement('p', {}, JSON.stringify(this.state.settings))
                            //    )
                            //),
                            React.createElement('div', { className: 'team column' },
                                React.createElement('h2', { className: 'title' },
                                    loc('west_team', "West Team"),
                                    React.createElement('div', { className: 'tip'},
                                        loc('custom_game_team_hint', 'Use top two slots for 2v2 map')
                                    )
                                    //this.state.settings.bansEnabled && React.createElement(BanSlot, { owner: 1 })
                                ),
                                React.createElement(CustomGameSlot, { slot: 1, owner: this.state.owner }),
                                React.createElement(CustomGameSlot, { slot: 2, owner: this.state.owner }),
                                React.createElement(CustomGameSlot, { slot: 3, owner: this.state.owner }),
                                React.createElement(CustomGameSlot, { slot: 4, owner: this.state.owner })
                            ),
                            React.createElement('div', { className: 'team column' },
                                React.createElement('h2', { className: 'title' },
                                    loc('east_team', "East Team"),
                                    React.createElement('div', { className: 'tip' },
                                        loc('custom_game_team_hint', 'Use top two slots for 2v2 map')
                                    )
                                    //this.state.settings.bansEnabled && React.createElement(BanSlot, { owner: 5 })
                                ),
                                React.createElement(CustomGameSlot, { slot: 5, owner: this.state.owner }),
                                React.createElement(CustomGameSlot, { slot: 6, owner: this.state.owner }),
                                React.createElement(CustomGameSlot, { slot: 7, owner: this.state.owner }),
                                React.createElement(CustomGameSlot, { slot: 8, owner: this.state.owner })
                            ),
                            React.createElement('div', { className: 'team column' },
                                React.createElement('h2', { className: 'title' },
                                    loc('spectators', "Spectators"),
                                    React.createElement('div', {
                                        className: 'tip', style: { opacity: 0 } },
                                        "." // spacer
                                    )
                                ),
                                React.createElement(CustomGameSlot, { slot: 13, owner: this.state.owner }),
                                React.createElement(CustomGameSlot, { slot: 14, owner: this.state.owner }),
                                React.createElement(CustomGameSlot, { slot: 15, owner: this.state.owner }),
                                React.createElement(CustomGameSlot, { slot: 16, owner: this.state.owner })
                            )
                        ),
                        React.createElement('div', { id: 'CustomGameConfirmation' },
                            this.props.items && this.props.items.map(function (item) {
                                if (!item) return null // Codex patch, just prevents some dumb warnings

                                if (!locked) {
                                    return React.createElement(EmphasizedMenuButton, {
                                        key: item.key,
                                        name: item.name,
                                        displayName: (item.displayName != null) ? item.displayName : item.name,
                                        locked: locked,
                                        behavior: item.behavior
                                    }, item.name)
                                } else {
                                    return React.createElement('div', { className: 'simple-tooltip' },
                                        React.createElement(EmphasizedMenuButton, {
                                            key: item.key,
                                            name: item.name,
                                            displayName: (item.displayName != null) ? item.displayName : item.name,
                                            locked: locked,
                                            behavior: function () { }
                                        }, item.name),
                                        React.createElement('span', { className: 'tooltiptext' },
                                            loc('game_owner', "Game owner: " + parent.state.owner, [parent.state.owner])
                                        )
                                    )
                                }
                            }),
                            React.createElement('div', { className: 'simple-tooltip' },
                                React.createElement(EmphasizedMenuButton, {
                                    key: 'QueueForClassic',
                                    name: 'QueueForClassic',
                                    displayName: '<img class="queue-for-classic" src="hud/img/icons/Classic.png">' + loc('start_classic_in_custom_game', 'Start Classic'),
                                    locked: locked || !queueForClassicCorrectPlayerCount,
                                    behavior: function () {
                                        if (locked || !queueForClassicCorrectPlayerCount) return

                                        console.log('click OnCustomGameQueueForClassic')
                                        engine.call('OnCustomGameQueueForClassic')
                                    },
                                    style: {
                                        background: (locked || !queueForClassicCorrectPlayerCount) ? 'gray' : 'rgba(112, 48, 41, 0.85)',
                                        outline: (locked || !queueForClassicCorrectPlayerCount) ? '0' : '1px solid rgb(224, 175, 160)',
                                        marginLeft: '12px',
                                        WebkitFilter: (locked || !queueForClassicCorrectPlayerCount) ? 'grayscale(1)' : ''
                                    }
                                }),
                                React.createElement('span', { className: 'tooltiptext wide' },
                                    !queueForClassicCorrectPlayerCount && React.createElement('div', { style: { color: '#ffff33' } }, loc('requires_players', "Requires 8 players", [8])),
                                    queueForClassicCorrectPlayerCount && React.createElement('div', { style: { color: '#8ff110' } }, loc('recommended', "Recommended!")),
                                    queueForClassicCorrectPlayerCount && locked && React.createElement('div', { style: { color: '#ffff33' }}, loc('game_owner', "Game owner: " + parent.state.owner, [parent.state.owner])),
                                    React.createElement('div', {
                                        dangerouslySetInnerHTML: {
                                            __html: loc('start_classic_in_custom_game_long', "Start the game as a |desc(classic_queue) game, which auto-balances teams, enables card drops, and gives bonus essence.", [8])
                                        }
                                    })
                                )
                            )
                        ),
                        React.createElement('div', { className: 'confirmation-buttons' },
                            React.createElement(StandardMenuButton, {
                                name: 'leave',
                                displayName: loc('leave', 'Leave'),
                                behavior: function () {
                                    engine.trigger('loadPopup', 'leavecustomgame')
                                }
                            })
                        )
                    )
                )
            )
        )
    }
})


var CustomGameSlot = React.createClass({
    propTypes: {
        slot: React.PropTypes.number,
        owner: React.PropTypes.string,
    },
    getInitialState: function () {
        return {
            value: '...',
            playFabId: '',
            image: "icons/NoIcon.png",
            guildAbbreviation: '',
            level: 0,
            rating: 0,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.setCustomGameSlot[parent.props.slot] = function (displayName, playFabId) {
            console.log("setCustomGameSlot[" + parent.props.slot + "] to " + displayName + ", " + playFabId)
            parent.setState({ value: displayName, playFabId: playFabId })
        }
        bindings.setCustomGameSlotDetails[parent.props.slot] = function (image, level, rating, guildAbbreviation) {

            console.log('set slot ' + parent.props.slot + ', guildAbbreviation: ' + guildAbbreviation)

            parent.setState({ image: image, level: level, rating: rating, guildAbbreviation: guildAbbreviation })
        }
    },
    render: function () {
        var parent = this
        var name = this.state.value

        if (name == this.props.owner)
            name += " [*]"

        var locked = globalState.savedUsername != this.props.owner
        var isOpen = this.state.playFabId == "_open"
        var isClosed = this.state.playFabId == "_closed"
        var isBot = _.startsWith(this.state.playFabId, '_bot')
        var is4v4BotGame = this.props.owner == "Public 4v4" // ghetto for now
        var isSpectator = this.props.slot > 8
        var playerSettings = (!isSpectator && globalState.customGameSettingsObject && globalState.customGameSettingsObject.playerSettings) ? globalState.customGameSettingsObject.playerSettings[this.props.slot] : null

        var summaryText = ""
        if (playerSettings) {
            if (isBot) {
                summaryText += '(' + playerSettings.difficultyDisplayName + ')'
            }

            if (playerSettings.gold > 250)
                summaryText += "<img src='hud/img/icons/Gold.png'/><span style='color: #8ff110'>" + playerSettings.gold + "</span>"
            if (playerSettings.gold < 250)
                summaryText += "<img src='hud/img/icons/Gold.png'/><span style='color: #ff6666'>" + playerSettings.gold + "</span>"
            if (playerSettings.mythium > 20)
                summaryText += "<img src='hud/img/icons/Mythium.png'/><span style='color: #8ff110'>" + playerSettings.mythium + "</span>"
            if (playerSettings.mythium < 20)
                summaryText += "<img src='hud/img/icons/Mythium.png'/><span style='color: #ff6666'>" + playerSettings.mythium + "</span>"
        }

        var borderColor = ''
        switch (parent.props.slot) {
            case 1:
                borderColor = '#ff4d4d'
                break
            case 2:
                borderColor = '#3d81ff'
                break
            case 3:
                borderColor = '#FE8A0E'
                break
            case 4:
                borderColor = '#a964e5'
                break
            case 5:
                borderColor = '#FFFC00'
                break
            case 6:
                borderColor = '#1CE6B9'
                break
            case 7:
                borderColor = '#20C000'
                break
            case 8:
                borderColor = '#E55BB0'
                break
        }

        return (
            React.createElement('div', {},
                React.createElement('div', {
                    className: 'button' + (locked ? ' locked' : '') + (isOpen ? ' open' : '')
                        + (isBot ? ' bot' : '') + (isClosed ? ' closed' : ''),
                    style: {
                        borderLeft: borderColor.length > 0 ? '6px solid ' + borderColor : ''
                    },
                    onClick: function () {
                        if (locked) return

                        engine.call("OnCustomGameSlotClick", parent.props.slot)

                        // This will only have listeners if testing
                        engine.trigger("OnCustomGameSlotClick", parent.props.slot)
                    }
                },
                    (parent.state.level > 0) && React.createElement('span', { className: 'icon-label' }, parent.state.level),
                    (parent.state.level > 0) && React.createElement('img', {
                        className: 'icon', src: 'hud/img/' + parent.state.image,
                        onMouseDown: function (e) {
                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                            console.log('click player avatar: ' + e)
                        }
                    }),
                    summaryText && React.createElement('div', { className: 'player-name-container' },
                        parent.state.rating > 0 && React.createElement('img', { className: 'tooltip-icon', src: getRatingImage(parent.state.rating) }),
                        parent.state.rating > 0 && ' ',
                        React.createElement('span', { dangerouslySetInnerHTML: { __html: name } }),
                        parent.state.guildAbbreviation && React.createElement('span', { className: 'guild-abbr' }, parent.state.guildAbbreviation),
                        React.createElement('div', {
                            className: 'player-settings-summary',
                            dangerouslySetInnerHTML: {
                                __html: summaryText
                            }
                        })
                        //React.createElement('span', { className: 'tooltiptext' }, "tippy")
                    ),
                    !summaryText && React.createElement('span', {},
                        parent.state.rating > 0 && React.createElement('img', { className: 'tooltip-icon', src: getRatingImage(parent.state.rating) }),
                        parent.state.rating > 0 && ' ',
                        React.createElement('span', { dangerouslySetInnerHTML: { __html: name } }),
                        parent.state.guildAbbreviation && React.createElement('span', { className: 'guild-abbr' }, parent.state.guildAbbreviation)
                    )
                ),
                React.createElement('div', { className: 'button-container' },
                    !locked && !isSpectator && !isOpen && !isClosed && React.createElement('div', {
                        className: 'icon button',
                        style: { marginLeft: '8px', display: 'block' },
                        onMouseDown: function (e) {
                            var left = e.nativeEvent.target.offsetLeft
                            var top = e.nativeEvent.target.offsetTop + 20

                            if (e.nativeEvent.which == 2) return // v7.00: openContextMenu ingame doesn't like middle click for some reason

                            openContextMenu(parent.props.slot, '', customGamePlayerSettingsMenu, left, top, false,
                                {
                                })
                        }
                    },
                        React.createElement('img', {
                            src: 'hud/img/custom-game/player-options.png',
                            height: '24px',
                            width: '24px'
                        })
                    ),
                    !locked && isBot && React.createElement('div', {
                        className: 'icon button',
                        style: { marginLeft: '8px', display: 'block' },
                        onMouseDown: function (e) {
                            var left = e.nativeEvent.target.offsetLeft
                            var top = e.nativeEvent.target.offsetTop + 20

                            if (e.nativeEvent.which == 2) return // v7.00: openContextMenu ingame doesn't like middle click for some reason

                            openContextMenu(parent.props.slot, '', customGameAISettingsMenu, left, top, false,
                                {
                                })
                        }
                    },
                        React.createElement('img', {
                            src: 'hud/img/custom-game/player-ai-options.png',
                            height: '24px',
                            width: '24px'
                        })
                    ),
                    isOpen && React.createElement('div', {
                        className: 'icon button' + (!isOpen || is4v4BotGame ? ' disabled' : ''),
                        style: { marginLeft: '8px' },
                        onMouseDown: function (e) { // onClick behaves kinda weirdly if you click the corner
                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                            if (!isOpen || is4v4BotGame) {
                                console.log("This slot isn't open for swapping; its name was: " + name)
                                return
                            }

                            engine.call("OnCustomGameSlotSwap", parent.props.slot)

                            // This will only have listeners if testing
                            engine.trigger("OnCustomGameSlotSwap", parent.props.slot)
                        }
                    },
                        React.createElement('img', {
                            src: 'hud/img/custom-game/swap.png',
                            height: '24px',
                            width: '24px'
                        })
                    )
                )
            )
        )
    }
})

var BanSlot = React.createClass({
    propTypes: {
        owner: React.PropTypes.number.isRequired
    },
    getInitialState: function () {
        return {
            value: loc('ban', "Ban"),
            selections: []
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.setBanSlot[parent.props.owner] = function (value) {
            console.log("setBanSlot[" + parent.props.owner + "] to " + value)
            parent.setState({ value: value })
        }
        bindings.setBanSelections[parent.props.owner] = function (selections) {
            console.log("setBanSelections[" + parent.props.owner + "] to " + selections)
            parent.setState({ selections: selections, value: "Ban" })
        }
    },
    render: function () {
        var parent = this
        var name = this.state.value

        // Selections
        var selections = []
        this.state.selections.map(function (selection) {
            selections.push({
                text: selection.name,
                action: function () {
                    engine.trigger('setBanSlot', parent.props.owner, "<img src='hud/img/" + selection.image + "' />")
                },
                html: "<img src='hud/img/" + selection.image + "' />"
            })
        })

        return (
            React.createElement(DropdownLinks, {
                choices: selections,
                defaultValue: parent.state.value,
                actualValue: parent.state.value,
                inline: true,
            })
        )
    }
})

// Browser (Custom game room browser)
// =============================================================================================

var BrowserView = React.createClass({
    render: function () {
        return (
            React.createElement('div', { id: 'BrowserView' },
                React.createElement('div', {
                    className: 'fullscreen',
                    onMouseDown: function (e) { // v1.50
                        if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                        engine.trigger('enableChat', false)
                    },
                    style: {
                        pointerEvents: 'all'
                    }
                },
                    React.createElement(BrowserMenu, {})
                )
            )
        )
    }
})

var BrowserMenu = React.createClass({
    getInitialState: function () {
        return {
            rooms: [],
            selectedRoomNumber: -1,
            loading: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshBrowserRooms = function (rooms) {
            console.log("refreshBrowserRooms: " + parent.state.rooms.length + " --> " + rooms.length + " rooms")
            parent.setState({ rooms: rooms })
        }
        bindings.fakeBrowserRoomLoading = function () {
            parent.setState({ loading: true })
            setTimeout(function () {
                parent.setState({ loading: false })
            }, 1300)
        },
        bindings.setSelectedBrowserRoom = function (roomNumber) {

            // v7.05 Clicking already selected room = joins it?
            // Eh let's just try without this, double clicks lead to accidents
            //if (parent.state.selectedRoomNumber == roomNumber) {
            //    console.log('clicked ' + roomNumber + ' again, owner: ' + parent.state.rooms[roomNumber].ownerPlayFabId)
            //    engine.call('OnTryJoinCustomGame', parent.state.rooms[roomNumber].ownerPlayFabId)
            //    return
            //}

            parent.setState({ selectedRoomNumber: roomNumber })
        }
    },
    render: function () {
        var parent = this

        return (
            React.createElement('div', { className: 'centered-text overlay' },
                React.createElement('div', { className: 'centered-text-wrapper' },
                    React.createElement('div', { id: 'BrowserWindow', className: 'directory', },
                        React.createElement('h1', { style: { display: 'inline-block' } }, loc('custom_game_list_title', "Custom games")),
                        React.createElement('div', {
                            id: 'BrowserRefresh',
                        },
                            React.createElement(MenuButton, {
                                name: 'refresh',
                                displayName: loc('refresh', 'Refresh'),
                                behavior: function () {
                                    engine.call('OnTryRefreshCustomGames')
                                }
                            })
                        ),
                        React.createElement('ul', {},
                            this.state.loading && React.createElement('div', {},
                                //loc('loading', "Loading...")
                                React.createElement('img', {
                                    src: 'hud/img/ui/loading-small.gif',
                                })
                            ),
                            !this.state.loading && this.state.rooms.length == 0 && React.createElement('div', {},
                                loc('custom_game_list_no_rooms', "No rooms are currently being hosted")
                            ),
                            !this.state.loading && this.state.rooms.length > 0 && this.state.rooms.map(function (item) {
                                return React.createElement(BrowserRow, {
                                    key: item.key,
                                    number: item.key,
                                    owner: item.owner,
                                    ownerPlayFabId: item.ownerPlayFabId,
                                    active: parent.state.selectedRoomNumber == item.key,
                                    numOccupants: item.numOccupants,
                                    maxOccupants: item.maxOccupants,
                                })
                            })
                        )
                    ),
                    React.createElement('div', { className: 'confirmation-buttons' },
                        React.createElement(EmphasizedMenuButton, {
                            name: 'create',
                            displayName: loc('create', 'Create'),
                            behavior: function () {
                                engine.trigger('loadView', 'launcher')
                                engine.trigger('trySearchGame', 'custom')
                            }
                        }),
                        React.createElement(StandardMenuButton, {
                            name: 'back',
                            displayName: loc('back', 'Back'),
                            behavior: function () {
                                engine.trigger('escape')
                            }
                        })
                    )
                )
            )
        )
    }
})

var BrowserRow = React.createClass({
    propTypes: {
        number: React.PropTypes.number,
        ownerPlayFabId: React.PropTypes.string,
        owner: React.PropTypes.string,
        numOccupants: React.PropTypes.number,
        maxOccupants: React.PropTypes.number,
        active: React.PropTypes.bool,
    },
    render: function () {
        var parent = this

        var isBotGame = (this.props.ownerPlayFabId != null) && this.props.ownerPlayFabId.length > 0
            && this.props.ownerPlayFabId[0] == ("_")

        return (
            React.createElement('li', {
                className: 'browser-row' + (isBotGame ? ' botgame' : '') + (this.props.active ? ' active' : ''),
                onClick: function () {
                    engine.trigger('setSelectedBrowserRoom', parent.props.number)
                }
            },
                React.createElement('div', { style: { display: 'inline-block' } },
                    loc('custom_game_list_entry', this.props.owner + "'s game (" + this.props.numOccupants + "/" + this.props.maxOccupants + ")",
                        [this.props.owner, this.props.numOccupants, this.props.maxOccupants])
                ),
                this.props.active && React.createElement('div', {
                    className: 'join button-container',
                    style: {
                        height: '0'
                    }
                },
                    React.createElement(MenuButton, {
                        name: 'join',
                        className: 'em',
                        displayName: loc('join', 'Join'),
                        behavior: function () {
                            console.log("join " + parent.props.ownerPlayFabId + "'s game")
                            engine.call('OnTryJoinCustomGame', parent.props.ownerPlayFabId)
                        }
                    })
                )
            )
        )
    }
})
