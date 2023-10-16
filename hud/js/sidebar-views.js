// Sidebar (Mini profile + friends list + party list)
// =============================================================================================

var SidebarMenu = React.createClass({
    getInitialState: function () {
        return {
            name: '...',
            image: 'icons/NoIcon.png',
            currentXp: 0,
            maxXp: 100,
            level: 0,
            rating: 0,
            friends: [],
            invites: [],
            party: [],
            ss: 0,
            pe: 0,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshSidebarProfile = function (profile) {
            parent.setState(profile)
        }
        bindings.refreshFriends = function (players) {
            parent.setState({ friends: players })
        }
        bindings.refreshInvites = function (players) {
            parent.setState({ invites: players })
        }
        bindings.refreshParty = function (party) {
            parent.setState({ party: party })
        }
        bindings.refreshSidebarCurrency = function (ss, pe) {
            console.log('refreshSidebarCurrency ss: ' + ss + ', pe: ' + pe)
            parent.setState({ ss: ss, pe: pe })
        }

        // Initial state
        parent.setState(globalState.profile)
        parent.setState({ friends: globalState.friends })
        parent.setState({ party: globalState.party })
    },
    render: function () {
        var parent = this

        var ratingImage = getRatingImage(this.state.rating)
        var ratingClass = getRatingClass(this.state.rating)
        var isPreMainMenu = globalState.currentView == '' || globalState.currentView == 'gateway'

        return (
            React.createElement('div', { id: 'SidebarMenu', className: isPreMainMenu ? ' invisible' : '' },
                React.createElement('div', { id: 'SidebarProfile' },
                    React.createElement('div', { style: { margin: '8px' } }, /* for some reason Coherent doesn't like when we make this bigger */
                        React.createElement('div', {
                            className: 'thumb',
                            onMouseDown: function (e) {
                                if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                engine.trigger('loadPopup', 'avatar')
                            },
                            onMouseEnter: function () { engine.call('OnMouseOverMedium', 0) }
                        },
                            //this.state.image && React.createElement('img', { src: 'hud/img/' + this.state.image })
                            this.state.image && React.createElement('div', { className: getAvatarStacksClass(this.state.avatarStacks) },
                                React.createElement('img', { src: 'hud/img/' + this.state.image })
                            )
                        ),
                        React.createElement('ul', { className: 'vitals' },
                            React.createElement('li', {
                                className: 'name',
                                style: {
                                    fontFamily: 'MenuFont_chat'
                                }
                            },
                                this.state.name,
                                globalState.myGuildAbbreviation && React.createElement('span', { className: 'guild-abbr' }, globalState.myGuildAbbreviation)
                            ),
                            //globalState.shopEnabled && !globalState.myGuildName && React.createElement('li', { className: 'guild', style: { color: '#909090'} }, loc("no_guild", "(No Guild)")),
                            //globalState.shopEnabled && globalState.myGuildName && React.createElement('li', { className: 'guild' }, globalState.myGuildName),
                            React.createElement(ProfileXp, { currentXp: this.state.currentXp, maxXp: this.state.maxXp, level: this.state.level }),
                            React.createElement('li', { className: 'ratings-and-currencies' },
                                this.state.rating > 0 && ratingImage && React.createElement('img', { className: 'rating-image', style: { width: '24px', height: '24px', marginRight: '4px' }, src: ratingImage }),
                                this.state.rating > 0 && React.createElement('span', { className: 'rating-numeral', style: { bottom: '4px', right: '8px' } }, getRatingDivisionNumeral(this.state.rating)),
                                this.state.rating > 0 && React.createElement('span', { style: { verticalAlign: 'top', marginLeft: isUnityHost ? '-6px' : '', lineHeight: '24px' }, className: ratingClass + ' rating-text' }, this.state.rating),
                                globalState.shopEnabled && React.createElement('span', {
                                    className: 'currency', style: { lineHeight: '24px' } },
                                    React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/Essence_32.png', style: { marginLeft: '3px' } }),
                                    React.createElement('span', { className: 'currency-text' + (this.state.ss > 999999 ? ' tiny' : '') }, this.state.ss),
                                    React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/PremiumEssence_32.png', style: { marginLeft: '5px' } }),
                                    React.createElement('span', { className: 'currency-text' + (this.state.pe > 999999 ? ' tiny' : '') }, this.state.pe)//,
                                    //React.createElement('div', {
                                    //    className: 'currency-recharge',
                                    //    onMouseDown: function (e) {
                                    //        engine.trigger('loadView', 'store')
                                    //    }
                                    //}, locName('visit_store', 'Visit store'))
                                )
                            )
                        )
                    )
                ),
                React.createElement('div', { id: 'SidebarFriends' },
                    React.createElement(FriendsTools, {}),
                    React.createElement(FriendsList, { friends: this.state.invites.concat(this.state.friends) })
                ),
                React.createElement('div', { id: 'SidebarParty' },
                    React.createElement(PartyTools, {}),
                    React.createElement(PartyList, { party: this.state.party })
                )
            )
        )
    }
})


var FriendsTools = React.createClass({
    render: function () {
        return (
            React.createElement('div', { id: 'FriendsTools' },
                React.createElement('div', { className: 'label' }, loc('friends', "Friends")),
                React.createElement('div', { className: 'tools' },
                    React.createElement('img', {
                        src: 'hud/img/friends/addfriend.png',
                        onClick: function () {
                            engine.trigger('searchFriendRequest', '')
                        }
                    }),
                    React.createElement('img', {
                        src: 'hud/img/friends/refresh.png',
                        onClick: function () {
                            engine.call("OnForceRefreshFriends")
                        }
                    })
                )
            )
        )
    }
})

var FriendsList = React.createClass({
    propTypes: {
        friends: React.PropTypes.array
    },
    getInitialState: function () {
        return {
            showContextMenu: false
        }
    },
    render: function () {

        if (this.props.friends.length == 0) {
            return React.createElement('ul', { className: 'friends scrollable' },
                React.createElement('li', {
                    className: 'sidebar-friend',
                    onMouseDown: function (e) {
                        if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                        engine.call("OnOpenURL", "https://www.howtogeek.com/336931/how-to-make-your-steam-profile-private/")
                    },
                    dangerouslySetInnerHTML: {
                        __html: loc('steam_private_profile', "If your friends list isn't showing up, change your Steam Profile settings to public. <br /><br />(Click here for help)")
                    }
                })
            )
        }

        return (
            React.createElement('ul', { className: 'friends scrollable' },
                this.props.friends.map(function (friend, index) {
                    // v9.02 note: ideally, we include the queue type here somewhere, but we don't have easy access yet
                    var isInGame = friend.playingAs != null && friend.playingAs.length > 0
                    var isInQueue = false
                    var isViewingScores = false
                    var inGameStatus = loc('rich_presence_playing_as', "Playing as " + friend.playingAs, [friend.playingAs])
                    if (friend.playingAs == "ingame") {
                        if (friend.wave == 0)
                            inGameStatus = loc('rich_presence_loading', "In Loading Screen")
                        else // v3.15b smelly failsafe: just guess they are MM, could hit this case in a custom game if everyone was hybrid for example, I think?
                            inGameStatus = loc('rich_presence_playing_as', "Playing as " + friend.playingAs, [locName('mastermind_legion_id', "Mastermind")])
                    }
                    if (friend.playingAs == "inqueue") {
                        inGameStatus = loc('rich_presence_in_queue', "In Queue")
                        isInGame = false
                        isInQueue = true
                    }
                    if (friend.playingAs == "custom") {
                        inGameStatus = loc('rich_presence_in_custom_game', "In Custom Game")
                        isInGame = false
                    }
                    if (friend.playingAs == "postgame") {
                        inGameStatus = loc('rich_presence_viewing_scores', "Viewing Scores")
                        isViewingScores = true
                        isInGame = false
                    }
                    if (friend.playingAs == "dev") {
                        inGameStatus = 'Developing the game'
                        isViewingScores = false
                        isInGame = true
                    }

                    //console.log("friend " + friend.name + " inGameStatus: " + inGameStatus + ", and wave: " + friend.wave + ", playingAs: " + friend.playingAs)

                    var waveSuffix = ""
                    if (isInGame && friend.wave > 0)
                        waveSuffix = " (" + loc('wave', 'Wave') + ' ' + friend.wave + ')'

                    // Default to "online" if no tagline
                    if (!friend.tagline || friend.tagline.length == 0)
                        friend.tagline = loc('rich_presence_online', "Online")

                    // Omit image folder if this is raw image data (Steam avatar)
                    var imageFolder = "hud/img/"
                    if (_.startsWith(friend.image, 'data:image'))
                        imageFolder = ""

                    var isConnecting = friend.currentView == 'connecting'

                    return React.createElement('li', {
                        key: friend.key,
                        className: 'sidebar-friend',
                        onMouseDown: function (e) {
                            //if (e.nativeEvent.which != 3) return // activate only on right click

                            var left = e.nativeEvent.clientX
                            var top = e.nativeEvent.clientY

                            if (e.nativeEvent.which == 2) return // v2.22 fix

                            if (friend.hasPlayFabData)
                                if (friend.isPlayingLegionTD2)
                                    if (isConnecting || (isInGame && !isViewingScores))
                                        openContextMenu(friend.playFabId, friend.name, rightClickBusyFriendsMenu, left, top)
                                    else
                                        openContextMenu(friend.playFabId, friend.name, rightClickFriendsMenu, left, top)
                                else
                                    if (friend.online)
                                        openContextMenu(friend.playFabId, friend.name, rightClickNotInGamePlayFabFriendMenu, left, top)
                                    else
                                        openContextMenu(friend.playFabId, friend.name, rightClickOfflinePlayFabFriendMenu, left, top)
                            else
                                openContextMenu(friend.playFabId, friend.name, rightClickNonPlayFabFriendMenu, left, top)
                        }
                    },
                        React.createElement('span', { className: getAvatarStacksClass(friend.avatarStacks) },
                            React.createElement('img', { src: imageFolder + (friend.image ? friend.image : 'icons/NoIcon.png') })
                        ),
                        !isConnecting && friend.isPlayingLegionTD2 && React.createElement('div', { className: 'vitals same-game' },
                            React.createElement('span', { className: 'name' }, friend.name),
                            friend.guildAbbreviation && React.createElement('span', { className: 'guild-abbr' }, friend.guildAbbreviation),
                            isInGame && !isInQueue && React.createElement('div', { className: 'tagline busy' }, inGameStatus + waveSuffix),
                            !isInGame && isInQueue && React.createElement('div', { className: 'tagline busy' }, inGameStatus + waveSuffix),
                            !isInGame && !isInQueue && !friend.away && React.createElement('div', { className: 'tagline' }, friend.tagline),
                            !isInGame && !isInQueue && friend.away && React.createElement('div', { className: 'tagline away' }, loc('away', 'Away'))
                        ),
                        isConnecting && friend.isPlayingLegionTD2 && friend.online && React.createElement('div', { className: 'vitals same-game' },
                            React.createElement('span', { className: 'name' }, friend.name),
                            friend.guildAbbreviation && React.createElement('span', { className: 'guild-abbr' }, friend.guildAbbreviation),
                            React.createElement('div', { className: 'tagline busy' }, loc('entering_main_menu', 'Entering main menu'))
                        ),
                        !friend.isPlayingLegionTD2 && friend.online && React.createElement('div', { className: 'vitals different-game' },
                            React.createElement('span', { className: 'name' }, friend.name),
                            friend.guildAbbreviation && React.createElement('span', { className: 'guild-abbr' }, friend.guildAbbreviation),
                            !friend.away && React.createElement('div', { className: 'tagline' }, loc('in_steam', 'In Steam')),
                            friend.away && React.createElement('div', { className: 'tagline' }, loc('in_steam', 'In Steam') + ' (' + loc('away', 'Away') + ')')
                        ),
                        !friend.isPlayingLegionTD2 && !friend.online && React.createElement('div', { className: 'vitals offline' },
                            React.createElement('span', { className: 'name' }, friend.name),
                            friend.guildAbbreviation && React.createElement('span', { className: 'guild-abbr' }, friend.guildAbbreviation),
                            React.createElement('div', { className: 'tagline' }, loc('offline', 'Offline'))
                        )
                        //status == 'invited' && React.createElement('div', {
                        //    className: 'friendRequestControls'
                        //},
                        //    React.createElement('img', {
                        //        src: 'hud/img/ui/accept-check.png',
                        //        onClick: function () {
                        //            engine.trigger('acceptFriendRequest', friend.playFabId)
                        //        }
                        //    }),
                        //    React.createElement('img', {
                        //        src: 'hud/img/ui/reject-x.png',
                        //        onClick: function () {
                        //            engine.trigger('rejectFriendRequest', friend.playFabId)
                        //        }
                        //    })
                        //)
                    )
                })
            )
        )
    }
})

var PartyList = React.createClass({
    propTypes: {
        party: React.PropTypes.array,
    },
    render: function () {
        var parent = this
        var friendIndex = 0

        // Check if anyone in my party is in queue --> we are all in queue
        var partyInQueue = false
        this.props.party && this.props.party.forEach(function (friend) {
            if (friend.playingAs == "inqueue")
                partyInQueue = true
        })

        return (
            React.createElement('ul', { className: 'party scrollable' },
                this.props.party.map(function (friend, index) {
                    if (friendIndex == 0)
                        friend.isLeader = true

                    // Override
                    if (!globalState.partyLeaderEnabled)
                        friend.isLeader = false

                    // In-game status
                    var isInGame = false
                    var isInGame = friend.playingAs != null && friend.playingAs.length > 0
                    var inGameStatus = ""

                    if (isInGame) {
                        // Copy & pasted from above (SMELLY)
                        var inGameStatus = loc('rich_presence_playing_as', "Playing as " + friend.playingAs, [friend.playingAs])
                        if (friend.playingAs == "ingame")
                            inGameStatus = loc('rich_presence_loading', "In Loading Screen")
                        if (friend.playingAs == "inqueue")
                            inGameStatus = loc('rich_presence_in_queue', "In Queue")
                        if (friend.playingAs == "custom")
                            inGameStatus = loc('rich_presence_in_custom_game', "In Custom Game")
                        if (friend.playingAs == "postgame")
                            inGameStatus = loc('rich_presence_viewing_scores', "Viewing Scores")
                        if (friend.playingAs == "dev") {
                            isInGame = false;
                        }
                    }

                    // Override with In Queue if any of our party is in queue
                    if (partyInQueue) {
                        isInGame = true
                        inGameStatus = loc('rich_presence_in_queue', "In Queue")
                    }

                    // Default to "online" if no tagline
                    //if (!friend.tagline || friend.tagline.length == 0)
                    //    friend.tagline = loc('rich_presence_online', "Online")

                    // Default to "online" always
                    friend.tagline = loc('rich_presence_online', "Online")
                    //console.log('friend.playingAs: ' + friend.playingAs + ', isInGame: ' + isInGame + ', partyInQueue: ' + partyInQueue + ', friend.tagline: ' + friend.tagline)

                    // Omit image folder if this is raw image data (Steam avatar)
                    var imageFolder = "hud/img/"
                    if (_.startsWith(friend.image, 'data:image'))
                        imageFolder = ""

                    friendIndex++
                    return React.createElement('li', {
                        key: friend.key,
                        className: 'sidebar-friend',
                        onMouseDown: function (e) {
                            var left = e.nativeEvent.clientX
                            var top = e.nativeEvent.clientY

                            if (e.nativeEvent.which == 2) return // v2.22 fix

                            openContextMenu(friend.playFabId, friend.name, rightClickPartyPersonMenu, left, top)
                        }
                    },
                        React.createElement('span', { className: getAvatarStacksClass(friend.avatarStacks) },
                            React.createElement('img', { src: imageFolder + (friend.image ? friend.image : 'icons/NoIcon.png') })
                        ),
                        React.createElement('div', { className: 'vitals same-game' },
                            //React.createElement('span', {
                            //    className: 'name',
                            //    dangerouslySetInnerHTML: { __html: friend.name + (friend.isLeader ? ' [<span style="color: #ffcc00">L</span>]' : '') }
                            //}),
                            React.createElement('span', { className: 'name' }, friend.name),
                            friend.guildAbbreviation && React.createElement('span', { className: 'guild-abbr' }, friend.guildAbbreviation),
                            !isInGame && React.createElement('div', { className: 'tagline' }, friend.tagline),
                            isInGame && React.createElement('div', { className: 'tagline busy' }, inGameStatus)
                        )
                    )
                })
            )
        )
    }
})

var PartyTools = React.createClass({
    getInitialState: function () {
        return {
            partyRating: 0,
            bonus: 0,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshPartyRating = function (rating, bonus) {
            parent.setState({ partyRating: rating, bonus: bonus })
        }
    },
    render: function () {
        var parent = this
        return (
            React.createElement('div', { id: 'PartyTools' },
                React.createElement('div', { className: 'label' },
                    loc('party', "Party"),
                    ' [',
                    React.createElement('span', { style: { color: '#ffcc00' }},
                        globalState.partyDisplayNames.length + '/' + globalState.partySizeLimit
                    ),
                    ']'
                ),
                globalState.partyDisplayNames.length <= 2 && React.createElement('div', { className: 'simple-tooltip' },
                    React.createElement('div', {
                        className: 'small-label',
                        dangerouslySetInnerHTML: {
                            __html: " " + loc('party_avg_rating', "avg " + this.state.partyRating + "", [this.state.partyRating])
                        }
                    }),
                    React.createElement('span', { className: 'tooltiptext' },
                        loc('party_avg_rating_long', "A bonus is added to your rating depending on party size and the highest rated player.")
                    )
                    // Future feature (if we want more transparency), it would show in red if it's a high bonus + explain context
                    //parent.state.bonus < 100 && React.createElement('span', { className: 'tooltiptext' },
                    //    loc('party_avg_rating_long', "A bonus is added to your rating depending on party size and the highest rated player.")
                    //),
                    //parent.state.bonus >= 100 && React.createElement('span', { className: 'tooltiptext' },
                    //    loc('party_avg_rating_disparity', "There is a large skill gap between your teammates. This may result in harder matchups.")
                    //)
                ),
                //globalState.partyDisplayNames.length >= globalState.partySizeLimit && parent.state.partyRating >= 1800 && React.createElement('div', {
                // v7.00: just show for everyone since it feels bad to be split without knowing why
                // v7.02: no longer show, since we won't split people anymore
                //globalState.partyDisplayNames.length >= globalState.partySizeLimit && React.createElement('div', {
                //    className: 'small-label party-warning',
                //    dangerouslySetInnerHTML: {
                //        __html: loc('large_party_warning', 'Your party may be put on separate teams for fairness.')
                //    }
                //}),
                React.createElement('div', { className: 'tools' },
                    React.createElement('img', {
                        src: 'hud/img/friends/addfriend.png',
                        onClick: function () {
                            if (globalState.searchingForMatch) {
                                engine.trigger('displayClientNotification', loc('cannot_while_searching', 'Cannot do this while searching for a match'), loc('cannot_send_party_invite', 'Cannot send party invite'), 5)
                                return
                            }

                            if (globalState.partyDisplayNames.length >= globalState.partySizeLimit) {
                                engine.trigger('displayClientNotification', loc('party_is_full', 'Party Is Full'), loc('cannot_send_party_invite', 'Cannot send party invite'), 5)
                                return
                            }

                            // pre-v7.05
                            engine.trigger('searchPartyInvite', '')

                            // v7.05
                            // eventually could do this kind of approach, but needs some tricky stuff figured out
                            // like what to pass in for popupName
                            // also, this isn't that important since when you're adding friends to party, you can
                            // just add them via regular sidebar friends list
                            //globalState.inviteFriendStatus = '' // SMELLY
                            //engine.trigger('refreshFriendInvitationMenu', {
                            //    header: loc('invite_to_party', 'Invite to party'),
                            //    popupName: 'todoooooooo',
                            //    friendTrigger: 'sendPartyInvite'
                            //})
                            //showFullScreenPopup(React.createElement(FriendInvitationMenuView), false)
                        }
                    })
                )
            )
        )
    }
})