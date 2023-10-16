// Guilds
// ===============================================================================

var GuildDirectoryView = React.createClass({
    render: function () {
        return (
            React.createElement('div', { id: 'GuildListView' },
                React.createElement('div', {
                    className: 'fullscreen',
                    onMouseDown: function (e) { // v1.50
                        engine.trigger('enableChat', false)
                    },
                    style: {
                        pointerEvents: 'all'
                    }
                },
                    React.createElement(GuildDirectoryMenu, {})
                )
            )
        )
    }
})

var GuildDirectoryMenu = React.createClass({
    getInitialState: function () {
        return {
            guildDirectory: globalState.guildDirectory,
            selectedGuildNumber: -1,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshGuildDirectory = function (guildDirectory) {
            console.log('refreshGuildDirectory with ' + guildDirectory.directory.length + ' guilds')
            parent.setState({
                guildDirectory: guildDirectory,
                selectedGuildNumber: -1,
            })
        }
        bindings.setSelectedGuildEntry = function (guildNumber) {
            parent.setState({ selectedGuildNumber: guildNumber })
        }
    },
    handleSearchChange: function (e) {
        console.log('handleSearchChange ' + e.target.value)
        this.setState({ searchInputText: e.target.value })

        if (e.target.value == '') {
            console.log('OnBrowseSearchGuildReset')
            engine.call('OnBrowseSearchGuildReset')
        }
    },
    handleChange: function (e) {
        if (e.key === 'Enter') {
            if (this.state.searchInputText == "") {
                return;
            }

            var regex = new RegExp("^[a-zA-Z0-9.' -]+");
            if (!regex.test(e.key)) {
                e.preventDefault();
                return false;
            }

            var regex = new RegExp("^[a-zA-Z0-9]+");
            if (!regex.test(e.key)) {
                e.preventDefault();
                return false;
            }

            if (e.key === ' ') {
                e.preventDefault();
                return false
            }

            var searchedAbbreviation = this.state.searchInputText

            //e.target.value = "" // clear the search box

            // Spinner
            this.setState({
                //searchInputText: '',
                placeholderText: 'todo',
                //placeholderText: loc('loading_profile', "Loading " + searchedAbbreviation + "'s profile...", [searchedAbbreviation])
            })

            console.log('try to search guild for abbreviation: ' + searchedAbbreviation)
            engine.call('OnTryBrowseSearchGuild', searchedAbbreviation)
        }
    },
    render: function () {
        var parent = this

        if (this.state.guildDirectory == null) {
            return React.createElement('div', { className: 'centered-text overlay no-background' },
                React.createElement('div', {
                    className: 'centered-text-wrapper', style: { background: 'rgba(0, 0, 0, 0.5)' }
                },
                    React.createElement('div', {
                        id: 'GuildDirectory', className: 'full-screen directory',
                        style: {
                            textAlign: 'center',
                            padding: '4vh'
                        }
                    },
                        React.createElement('img', {
                            src: 'hud/img/ui/loading-small.gif',
                        })
                    )
                )
            )
        }

        var guilds = this.state.guildDirectory.directory

        var alreadyInGuild = globalState.myGuildId && globalState.myGuildId.length > 0
        var enableCreateGuild = !alreadyInGuild

        return (
            React.createElement('div', { className: 'centered-text overlay no-background' },
                React.createElement('div', {
                    className: 'centered-text-wrapper', style: { background: 'rgba(0, 0, 0, 0.5)' } },
                    React.createElement('div', { id: 'GuildDirectory', className: 'full-screen directory' },
                        React.createElement('div', { className: 'directory-content' },
                            React.createElement('h1', { style: { display: 'inline-block' } }, loc('guild_directory', "Browse guilds")),
                            parent.refs.input && parent.refs.input.value.length > 0 && React.createElement('div', {
                                className: 'simple-tooltip',
                                style: {
                                    color: 'white',
                                    position: 'relative',
                                    float: 'right',
                                    right: '18px',
                                    top: '20px',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    width: '0'
                                },
                                onMouseDown: function (e) {
                                    var shouldReset = parent.refs.input.value.length > 0
                                    parent.refs.input.value = ''
                                    if (shouldReset) {
                                        console.log('OnBrowseSearchGuildReset')
                                        engine.call('OnBrowseSearchGuildReset')
                                    }
                                }
                            },
                                React.createElement('img', { src: 'hud/img/small-icons/input-x.png' }),
                                React.createElement('span', { className: 'tooltiptext auto tight' }, loc('clear', 'Clear'))
                            ),
                            React.createElement('div', { className: 'search-container' },
                                React.createElement('input', {
                                    ref: 'input',
                                    placeholder: loc('search_abbreviation', 'Search Abbreviation'),
                                    onChange: this.handleSearchChange,
                                    onKeyDown: this.handleChange,
                                    maxLength: "5"
                                })
                            ),
                            React.createElement('ul', { className: 'full-screen-entry-list scrollable' },
                                guilds == null || guilds.length == 0 && React.createElement('div', {},
                                    loc('guild_directory_no_guilds', "No guilds found")
                                ),
                                guilds && guilds.length > 0 && guilds.map(function (guild, index) {
                                    var enableApplications = guild.guildSpecificApplicationDisabledMessage == null || guild.guildSpecificApplicationDisabledMessage.length == 0

                                    var guildProps = guild.props
                                    guildProps.key = guild.key
                                    guildProps.active = parent.state.selectedGuildNumber == index
                                    guildProps.number = index
                                    guildProps.enableApply = enableApplications
                                    guildProps.enableApplicationsWarningMessage = guild.guildSpecificApplicationDisabledMessage

                                    return React.createElement(GuildEntry, guildProps)
                                })//,
                                //parent.state.guildDirectory.searchString && React.createElement('div', {
                                //    className: 'full-screen-entry-list clear-search'
                                //},
                                //    loc('clear_search', "Clear Search: " + parent.state.guildDirectory.searchString, [parent.state.guildDirectory.searchString])
                                //),
                            ),
                            React.createElement('div', { className: 'front-description-buttons' },
                                React.createElement('div', { className: 'confirmation-buttons' },
                                    React.createElement('div', {
                                        className: 'button em big' + (!enableCreateGuild ? ' disabled simple-tooltip' : ''),
                                        onMouseDown: function (e) {
                                            if (!enableCreateGuild) return
                                            showFullScreenPopup(React.createElement(CreateGuildMenu(parent.state.guildDirectory)), false)
                                        }
                                    },
                                        loc('create_guild', 'Create Guild'),
                                        !enableCreateGuild && React.createElement('span', { className: 'tooltiptext' }, !enableCreateGuild ? loc('already_in_a_guild', 'Already in a guild') : '')
                                    ),
                                    React.createElement(MenuButton, {
                                        name: 'back',
                                        displayName: loc('guild_faq', 'Guild Rewards'),
                                        className: 'big',
                                        behavior: function () {
                                            showFullScreenPopup(getGuildFAQ(), false)
                                        }
                                    }),
                                    React.createElement(MenuButton, {
                                        name: 'back',
                                        displayName: loc('back', 'Back'),
                                        className: 'big',
                                        behavior: function () {
                                            engine.trigger('escape')
                                        }
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

var GuildEntry = React.createClass({
    propTypes: {
        number: React.PropTypes.number,
        active: React.PropTypes.bool,
    },
    render: function () {
        var parent = this

        var enableApply = parent.props.enableApply
        var applyWarningMessage = this.props.enableApplicationsWarningMessage

        if (parent.props.membersCount >= parent.props.membersLimit) {
            enableApply = false
            applyWarningMessage = loc('guild_is_full', 'Guild is full')
        }

        return (
            React.createElement('li', {
                className: 'browser-row' + (this.props.active ? ' active' : ''),
                style: {},
                onClick: function () {
                    console.log('setSelectedGuildEntry: ' + parent.props.number)
                    engine.trigger('setSelectedGuildEntry', parent.props.number)
                }
            },
                React.createElement('div', {},
                    React.createElement('div', { className: 'img-container ' + getGuildAvatarStacksClass(this.props.avatarStacks) },
                        React.createElement('img', { className: 'avatar', src: 'hud/img/' + this.props.avatar })
                    ),
                    React.createElement('span', { className: 'guild-abbr' }, this.props.abbreviation),
                    React.createElement('div', { className: 'name' },
                        this.props.guildName,
                        React.createElement('span', { className: 'guild-stats' },
                            React.createElement('img', { src: 'hud/img/icons/GuildLevel.png', style: { height: '20px', marginLeft: '6px', verticalAlign: 'middle' } }),
                            this.props.guildLevel,
                            React.createElement('img', { src: 'hud/img/small-icons/1.png', style: { marginLeft: '6px', height: '12px' } }),
                            ' ',
                            this.props.membersCount + "/" + this.props.membersLimit,
                            ' '
                        )
                    ),
                    this.props.active && React.createElement('div', {},
                        React.createElement('div', { className: 'button-container' },
                            React.createElement('div', { className: 'join' },
                                React.createElement(MenuButton, {
                                    name: 'applyToGuild',
                                    displayName: loc('apply', 'Apply'),
                                    className: 'em' + (!enableApply ? ' disabled' : ''),
                                    behavior: function () {
                                        if (!enableApply) return
                                        console.log('apply for guild clicked')
                                        engine.call('OnTryApplyForGuild', parent.props.guildId)
                                    },
                                    tooltip: applyWarningMessage
                                })
                            ),
                            React.createElement('div', { className: 'join' },
                                React.createElement(MenuButton, {
                                    name: 'viewGuildProfile',
                                    displayName: loc('view_guild', 'View Guild'),
                                    behavior: function () {
                                        console.log('view guild profile: ' + parent.props.guildId)
                                        engine.trigger('hideFullScreenPopup')
                                        engine.trigger('viewGuildProfile', null) // load instantly with loading spinner
                                        engine.call('OnLoadGuildProfileByGuildId', parent.props.guildId)
                                    }
                                })
                            )
                        ),
                        React.createElement('div', {
                            className: 'guild-tagline',
                            dangerouslySetInnerHTML: {
                                __html: linkify(this.props.tagline)
                            }
                        }),
                        React.createElement('div', { className: 'guild-owner' }, loc('role_guild_leader', 'Leader') + ": " + this.props.guildLeaderDisplayName)
                    )
                )
            )
        )
    }
})

var GuildOverview = React.createClass({
    getInitialState: function () {
        return {
            guild: globalState.selectedGuild,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshGuild = function (guild) {
            parent.setState({
                guild: guild,
            })
        }
    },
    render: function () {
        var parent = this

        if (this.state.guild == null || this.state.guild.props == null) {
            return React.createElement('div', { id: 'GuildOverview', className: 'profile-container' },
                React.createElement('div', {
                    className: 'profile-main', style: { textAlign: 'center' }
                },
                    React.createElement('img', {
                        src: 'hud/img/ui/loading-small.gif',
                    })
                )
            )
        }

        var guild = this.state.guild

        // v9.05 support multiple leaders now
        var isLeader = guild.props.guildLeaderPlayFabId == globalState.playFabId
        var isLeaderOrCoLeader = guild.isLeader

        var isOfficer = guild.canInvite

        var canManageMembers = guild.canKick
        var canDisband = isLeader
        var canChangeAvatar = isLeaderOrCoLeader
        // v9.05.1 reverted to support coleaders instead of too-strong officers
        var canChangeGuildEmblem = isLeaderOrCoLeader && guild.props.guildLevel >= 9
        var canChangeGuildEmblemLocked = isLeaderOrCoLeader && guild.props.guildLevel < 9
        var canChangeTagline = isLeaderOrCoLeader
        var canChangeNotice = isLeaderOrCoLeader

        var canKick = guild.canKick
        var canInvite = isOfficer
        var canLeave = !canDisband && guild.props.guildId == globalState.myGuildId
        var canApply = guild.props.guildId != globalState.myGuildId
        var canDonate = !canApply

        //canApply = true
        //guild.applyDisabledMessage = 'Wait until 28th August, 2020, 3:40 pm'
        //guild.applyDisabledMessage = 'Already in a guild'
        var hideGuildControls = globalState.isInGame

        if (canApply && (guild.props.membersCount >= guild.props.membersLimit)) {
            guild.applyDisabledMessage  = loc('guild_is_full', 'Guild is full')
        }

        var canApplyDisabled = guild.applyDisabledMessage != null && guild.applyDisabledMessage.length > 0

        var guildMenuDropdownChoices = []
        var dropdownIndex = 0

        // Probably can remove this in production, just kinda convenient here for debugging
        //guildMenuDropdownChoices.push({
        //    text: dropdownIndex++,
        //    action: function () {
        //        console.log('guild dropdown selected browse guilds')
        //        engine.trigger('showGuildDirectory')
        //    },
        //    html: loc('guild_directory', 'Browse Guilds')
        //})

        if (canInvite) {
            guildMenuDropdownChoices.push({
                text: dropdownIndex++,
                action: function () {
                    console.log('guild dropdown selected guild invitations')
                    engine.trigger('showGuildInvitations')
                },
                html: loc('guild_invitations_and_applications', 'Invitations & Applications')
            })

            // Relocated to the Invitations & Applications menu
            //guildMenuDropdownChoices.push({
            //    text: dropdownIndex++,
            //    action: function () {
            //        console.log('guild dropdown selected invite player')
            //        engine.trigger('searchGuildInvite')
            //    },
            //    html: loc('invite_to_guild', 'Invite player to guild')
            //})
        }

        if (canChangeTagline) {
            guildMenuDropdownChoices.push({
                text: dropdownIndex++,
                action: function () {
                    console.log('guild dropdown selected change tagline')
                    engine.trigger('requestGuildTagline', guild.props.tagline)
                },
                html: loc('edit_tagline', 'Edit Tagline')
            })
        }

        if (canChangeNotice) {
            guildMenuDropdownChoices.push({
                text: dropdownIndex++,
                action: function () {
                    console.log('guild dropdown selected change notice')
                    engine.trigger('requestGuildNotice', guild.props.notice)
                },
                html: loc('edit_guild_notice', 'Edit Guild Notice')
            })
        }

        if (canChangeGuildEmblem) {
            guildMenuDropdownChoices.push({
                text: dropdownIndex++,
                action: function () {
                    console.log('guild dropdown selected change guild emblem')
                    engine.trigger('showGuildEmblem')
                },
                html: loc('edit_guild_emblem', 'Edit Guild Emblem')
            })
        }

        if (canChangeGuildEmblemLocked) {
            guildMenuDropdownChoices.push({
                text: dropdownIndex++,
                action: function () { },
                html: '<span style="color: rgba(255, 255, 255, 0.25)">' + loc('edit_guild_emblem', 'Edit Guild Emblem') + ' (' + loc('locked', 'Locked') + ')</span>'
            })
        }

        if (canDisband) {
            guildMenuDropdownChoices.push({
                text: dropdownIndex++,
                action: function () {
                    console.log('guild dropdown selected disband guild')
                    engine.trigger('requestGuildDisband')
                },
                html: loc('disband_guild', 'Disband Guild')
            })
        }

        if (canLeave) {
            guildMenuDropdownChoices.push({
                text: dropdownIndex++,
                action: function () {
                    console.log('guild dropdown selected leave guild')
                    engine.trigger('showConfirmPopupInput', {
                        header: loc('leave_guild', 'Leave Guild'),
                        description: loc('leave_guild_long', 'If you leave the guild, you cannot rejoin unless you are reinvited. You still keep your guild contribution progress/bonuses.'),
                        triggerIfConfirm: 'confirmLeaveGuild',
                        triggerIfBack: '',
                        data: '',
                        data2: '',
                        currencyType: '',
                        currencyAmount: 0,
                    })
                },
                html: loc('leave_guild', 'Leave Guild')
            })
        }

        var avatarSplash = ''
        if (guild.props.avatar && guild.props.avatar.length > 0) {
            avatarSplash = guild.props.avatar.replace('Icons/', 'splashes/');
            avatarSplash = avatarSplash.replace('icons/', 'splashes/');
        }

        // Smelly :(
        var tooltipWidthClass = ''
        if (canApplyDisabled) {
            if (guild.applyDisabledMessage.length < 25)
                tooltipWidthClass = 'auto'
            if (guild.applyDisabledMessage.length > 35)
                tooltipWidthClass = '' // 'wide'
        }

        return (
            React.createElement('div', { id: 'GuildOverview', className: 'profile-container' },
                React.createElement('div', { className: 'profile-main' },
                    React.createElement('div', { className: 'vitals' },
                        guild.props.avatar && React.createElement('div', {
                            style: { display: 'inline-block', position: 'relative' }
                        },
                            React.createElement('div', {
                                className: 'img-container ' + getGuildAvatarStacksClass(guild.props.avatarStacks) + ' bottomfix'
                            },
                                React.createElement('div', { className: 'avatar' },
                                    React.createElement('img', {
                                        src: ('hud/img/' + avatarSplash),
                                        //className: canChangeAvatar ? 'clickable' : '',
                                        className: 'clickable',
                                        onMouseDown: function (e) {
                                            // Actually let's let you VIEW the avatars as a visitor/ingame
                                            // just not CHANGE them
                                            //if (!canChangeAvatar) return
                                            //if (globalState.isInGame) return // if ingame bail also
                                            engine.trigger('loadPopup', 'guildavatar')
                                        }
                                    })
                                )
                            )
                        ),
                        React.createElement('div', { className: 'identity' },
                            React.createElement('div', {
                                className: 'name',
                                style: {
                                    fontSize: guild.props.guildName.length > 20 ? '2rem' : ''
                                }
                            }, guild.props.guildName),
                            React.createElement('div', { className: 'abbreviation' }, guild.props.abbreviation),
                            React.createElement('div', { className: 'members' },
                                React.createElement('img', {
                                    src: 'hud/img/small-icons/1.png', style: {
                                        height: '16px', marginBottom: '-2px'
                                    }
                                }),
                                guild.props.membersCount + '/' + guild.props.membersLimit,
                                guild.emblemBlob && React.createElement('img', {
                                    src: guild.emblemBlob,
                                    className: 'emblem',
                                    onMouseDown: function (e) {
                                        showFullScreenPopup(getFullScreenImagePreview(guild.emblemBlob), true)
                                    }
                                })
                            ),
                            React.createElement('div', {
                                className: 'tagline',
                                dangerouslySetInnerHTML: {
                                    __html: linkify(guild.props.tagline)
                                }
                            }),
                            React.createElement('div', { className: 'stats' },
                                React.createElement('div', { className: 'level' },
                                    React.createElement('div', {
                                        className: "progress-container simple-tooltip",
                                        style: { width: '128px', height: '28px', background: 'rgba(0, 0, 0, 0.75)', border: 'none' }
                                    },
                                        React.createElement('div', {
                                            className: "progress-bar custom", style: {
                                                width: (100 * guild.levelProgress) + "%",
                                            }
                                        }),
                                        React.createElement('span', { className: 'value', style: { lineHeight: '28px' } },
                                            React.createElement('img', {
                                                src: 'hud/img/icons/GuildLevel.png', style: {
                                                    height: '24px', position: 'relative', zIndex: '1', top: '2px', verticalAlign: 'top'
                                                }
                                            }),
                                            loc('level', 'Level') + ' ' + guild.level
                                        ),
                                        React.createElement('span', { className: 'tooltiptext auto' },
                                            guild.leftoverXp + '/' + guild.xpNeededThisLevel + ' ' + loc('gxp', 'GXP')
                                        )
                                    ),
                                    //React.createElement('img', {
                                    //    src: 'hud/img/guilds/Reward.png',
                                    React.createElement('div', {
                                        className: 'reward-icon',
                                        onMouseDown: function (e) {
                                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                            showFullScreenPopup(getGuildFAQ(), false)
                                        }
                                    }),
                                    canDonate && React.createElement('div', {
                                        className: 'donate button',
                                        onMouseDown: function (e) {
                                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                            console.log('click donate')
                                            engine.trigger('openDonateCardMenu')
                                        }
                                    },
                                        loc('donate', 'Donate')
                                    )
                                )
                            )
                        ),
                        !hideGuildControls && React.createElement('div', { className: 'guild-menu' },
                            !canApply && React.createElement('div', {
                                className: 'dropdown-container',
                                style: {
                                    //position: 'absolute',
                                    //top: '32px',
                                    //right: '236px',
                                }
                            },
                                React.createElement(DropdownLinks, {
                                    choices: guildMenuDropdownChoices,
                                    defaultValue: loc('guild_menu', 'Guild Menu'),
                                    actualValue: loc('guild_menu', 'Guild Menu')
                                })
                            ),
                            canApply && React.createElement('div', {
                                className: 'simple-tooltip flipped flipped-y button em' + (canApplyDisabled ? ' disabled' : ''),
                                style: {
                                    margin: '1vh 1vw'
                                },
                                onMouseDown: function (e) {
                                    if (canApplyDisabled) return
                                    console.log('click apply')

                                    guild.applyDisabledMessage = loc('please_wait', 'Please wait...')
                                    parent.setState({
                                        guild: guild
                                    })

                                    engine.call('OnTryApplyForGuild', guild.props.guildId)
                                }
                            },
                                loc('apply', 'Apply'),
                                canApplyDisabled && React.createElement('span', {
                                    className: 'tooltiptext no-carat ' + tooltipWidthClass,
                                    dangerouslySetInnerHTML: {
                                        __html: guild.applyDisabledMessage
                                    }
                                })
                            )
                        )
                    )
                ),
                React.createElement(GuildMembers, {})
            )
        )
    }
})

var GuildMembers = React.createClass({
    getInitialState: function () {
        return {
            guild: globalState.selectedGuild, // hacky way to share state
        }
    },
    render: function () {
        if (this.state.guild == null) {
            return React.createElement('img', {
                src: 'hud/img/ui/loading-small.gif',
            })
        }

        var guild = this.state.guild

        // v9.05 support multiple leaders now
        var isLeader = guild.props.guildLeaderPlayFabId == globalState.playFabId
        var isLeaderOrCoLeader = guild.isLeader

        var canManageMembers = guild.canKick
        var canChangeAvatar = isLeaderOrCoLeader
        var canKick = guild.canKick
        var canInvite = guild.canInvite

        return (
            React.createElement('div', { id: 'GuildMembers' },
                React.createElement('table', {
                    ref: 'leaderboard', className: 'leaderboard scrollable',
                    style: {
                        overflowY: 'auto',
                        height: '45vh',
                        display: 'block'
                    }
                },
                    React.createElement('thead', {},
                        React.createElement('tr', {},
                            React.createElement('td', { className: '', dangerouslySetInnerHTML: { __html: loc('name', "Name") } }),
                            React.createElement('td', { className: '', dangerouslySetInnerHTML: { __html: loc('guild_title', "Title") } }),
                            React.createElement('td', { className: '', dangerouslySetInnerHTML: { __html: loc('country', "Country") } }),
                            React.createElement('td', { className: '', dangerouslySetInnerHTML: { __html: loc('level', "Level") } }),
                            React.createElement('td', { className: '', dangerouslySetInnerHTML: { __html: loc('rating', "Rating") } }),
                            React.createElement('td', { className: '', dangerouslySetInnerHTML: { __html: loc('guild_last_played', "Last Played") } }),
                            React.createElement('td', { className: 'simple-tooltip flipped flipped-y', style: { display: 'table-cell' } },
                                React.createElement('span', {
                                    dangerouslySetInnerHTML: {
                                        __html: loc('guild_contribution', "Guild Contribution")
                                    }
                                }),
                                React.createElement('span', {
                                    className: 'tooltiptext no-carat', style: { left: '-120px' }
                                },
                                    loc('guild_contribution_long', 'Guild Contribution is the total GXP you have contributed to the current guild. Members with higher guild contribution appear closer to the top of the members list.')
                                )
                            ),
                            React.createElement('td', { className: 'simple-tooltip flipped flipped-y', style: { display: 'table-cell' } },
                                React.createElement('span', {
                                    dangerouslySetInnerHTML: {
                                        __html: loc('total_contribution', "Total Contribution")
                                    }
                                }),
                                React.createElement('span', {
                                    className: 'tooltiptext no-carat', style: { left: '-130px' }
                                },
                                    loc('total_contribution_long', 'Total Contribution is the total GXP you have contributed to all guilds. Every $1 Contribution gives you a permanent $2% Essence gain.')
                                )
                            )
                        )
                    ),
                    React.createElement('tbody', { className: '' },
                        React.createElement('tr', { style: { height: '12px' } }, React.createElement('td', { style: { background: 'rgba(0, 0, 0, 0.5)' }, colSpan: '7' })),
                        guild.members.map(function (entry, index) {
                            var isSelf = entry.props.playFabMasterId == globalState.playFabId
                            var guildMemberOptions = {}
                            guildMemberOptions.isMyGuild = guild.props.guildId == globalState.myGuildId
                            guildMemberOptions.canKickThisPlayer = entry.kickableByCurrentPlayer
                            guildMemberOptions.canTransferToThisPlayer = isLeader && !isSelf
                            guildMemberOptions.canChangeToOfficer = guild.props.guildLevel >= 2 && entry.canChangeToOfficer
                            guildMemberOptions.canChangeToMember = guild.props.guildLevel >= 2 && entry.canChangeToMember
                            guildMemberOptions.canChangeToOfficerLocked = !isSelf && guild.props.guildLevel < 2
                            guildMemberOptions.canChangeTitle = guild.props.guildLevel >= 4 && entry.canChangeTitle
                            guildMemberOptions.canChangeTitleLocked = guild.props.guildLevel < 4
                            
                            guildMemberOptions.canAddFriend = !isSelf && !_.includes(globalState.friendPlayFabIds, entry.props.playFabMasterId)
                            guildMemberOptions.title = entry.title
                            if (guildMemberOptions.title == null || guildMemberOptions.title.length == 0)
                                guildMemberOptions.title = entry.roleName
                            var isTitleSameAsRole = guildMemberOptions.title == entry.roleName

                            var ratingImage = getRatingImage(entry.props.overallElo)


                            return React.createElement('tr', {
                                className: (isSelf ? 'self' : '') + ' guild-player-row',
                                onMouseDown: function (e) {
                                    var left = e.nativeEvent.clientX
                                    var top = e.nativeEvent.clientY

                                    if (e.nativeEvent.which == 2) return // v7.00: openContextMenu ingame doesn't like middle click for some reason

                                    openContextMenu(entry.props.playFabMasterId, entry.props.displayName, function () { return clickGuildMemberMenu(guildMemberOptions) }, left, top)
                                }
                            },
                                React.createElement('td', { className: 'name guild-player-name' },
                                    React.createElement('img', { src: 'hud/img/' + entry.props.avatar }),
                                    entry.props.displayName),
                                React.createElement('td', { className: 'guild-member-title' },
                                    React.createElement('span', {
                                        style: { color: !isTitleSameAsRole ? '#ffe98e' : '' } },
                                        guildMemberOptions.title
                                    ),
                                    React.createElement('span', {
                                        style: {
                                            color: '#909090', textTransform: 'uppercase', marginLeft: '4px', fontSize: '1vh'
                                        }
                                    },
                                        entry.roleName
                                    )
                                ),
                                React.createElement('td', { className: 'country' },
                                    React.createElement('span', { className: 'simple-tooltip flag-icon flag-icon-' + entry.props.countryCode },
                                        React.createElement('span', { className: 'tooltiptext' }, entry.countryName)
                                    )
                                ),
                                React.createElement('td', { className: 'guild-member-level' },
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
                                        React.createElement('span', { className: 'hidden' }, entry.props.totalXp) // for sorting
                                    )
                                ),
                                React.createElement('td', { className: 'guild-member-rating' },
                                    React.createElement('span', {
                                        style: { position: 'relative', top: '0px', left: '6px' }
                                    },
                                        ratingImage && React.createElement('img', { style: { width: '24px', height: '24px' }, src: ratingImage }),
                                        React.createElement('span', { className: 'rating-numeral', style: { bottom: '-6px', right: '16px' } }, getRatingDivisionNumeral(entry.props.overallElo))
                                    )//,
                                    //entry.props.overallElo
                                ),
                                React.createElement('td', { className: 'guild-member-last-played' },
                                    entry.lastPlayedString
                                ),
                                React.createElement('td', { className: 'guild-member-contribution' },
                                    React.createElement('img', { style: { width: '24px', height: '24px', paddingRight: '2px' }, src: 'hud/img/icons/GuildContribution.png' }),
                                    entry.props.guildContributionThisGuild
                                ),
                                React.createElement('td', { className: 'guild-member-contribution' },
                                    React.createElement('img', { style: { width: '24px', height: '24px', paddingRight: '2px' }, src: 'hud/img/icons/GuildContribution.png' }),
                                    entry.props.guildContribution
                                )
                            )
                        }),
                        React.createElement('tr', { style: { height: '12px' } }, React.createElement('td', { style: { background: 'rgba(0, 0, 0, 0.5)' }, colSpan: '7' }))
                    )
                )
            )
        )
    }
})

var CreateGuildMenu = function (guildDirectory) {
    return React.createClass({
        render: function () {

            var guildTicketItemId = guildDirectory.guildTicketItemId
            var guildTicketDescription = 'create_guild'
            var createGuildSSCost = guildDirectory.createGuildPriceSS
            var createGuildPECost = guildDirectory.createGuildPricePE
            var newEssenceBalance = globalState.currency - createGuildSSCost
            var newPEBalance = globalState.premiumEssence - createGuildPECost
            var enoughSS = newEssenceBalance >= 0
            var enoughPE = newPEBalance >= 0
            var ssCurrencyName = loc('essence', 'Essence')
            var peCurrencyName = loc('premium_essence', 'Premium Essence')

            return (
                React.createElement('div', { className: 'create-guild-popup' },
                    React.createElement('div', { className: 'header' },
                        React.createElement('h1', {}, loc('create_guild', "Create Guild")),
                        React.createElement('div', {
                            className: 'description',
                            dangerouslySetInnerHTML: {
                                __html: loc('create_guild_long', "After your purchase, you will immediately be prompted to choose a guild name.")
                            }
                        })
                    ),
                    React.createElement('div', { className: 'front-description-buttons' },
                        React.createElement('div', { className: 'confirmation-buttons' },
                            React.createElement('div', {
                                className: 'button currency em orange' + (!enoughSS ? ' disabled' : ''),
                                onMouseDown: function (e) {
                                    if (!enoughSS) {
                                        engine.trigger('notEnoughSS')
                                        return
                                    }

                                    // Close previewer
                                    engine.trigger('hideFullScreenPopup')

                                    // Buy item ask for confirmation first
                                    loadConfirmPurchasePopup({
                                        itemType: guildTicketItemId,
                                        name: locName(guildTicketDescription, 'Create Guild'),
                                        image: 'icons/Guild.png',
                                        essence: globalState.currency,
                                        newEssence: newEssenceBalance,
                                        premiumEssence: globalState.premiumEssence,
                                        newPremiumEssence: globalState.premiumEssence
                                    },
                                        function () {
                                            engine.call('OnBuyItem', guildTicketItemId, 'SS')

                                            if (isBrowserTest) {
                                                engine.trigger('requestGuildAbbreviation')
                                            }
                                        }
                                    )
                                }
                            },
                                React.createElement('div', { className: 'currency-button-container' },
                                    React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/Essence_32.png' }),
                                    createGuildSSCost,
                                    //enoughSS && React.createElement('div', { className: 'currency-balance' }, loc('new_balance', 'New balance: ' + newEssenceBalance, [newEssenceBalance])),
                                    enoughSS && React.createElement('div', { className: 'currency-balance' }, loc('unlock_with', 'Unlock with Essence', [ssCurrencyName])),
                                    !enoughSS && React.createElement('div', { className: 'currency-balance' }, loc('not_enough_money', 'Not enough ' + ssCurrencyName, [ssCurrencyName]))
                                )
                            ),
                            React.createElement('div', {
                                className: 'button currency em purple' + (!enoughPE ? ' disabled simple-tooltip' : ''),
                                onMouseDown: function (e) {
                                    if (!enoughPE) {
                                        engine.trigger('notEnoughPE')
                                        return
                                    }

                                    // Close previewer
                                    engine.trigger('hideFullScreenPopup')

                                    loadConfirmPurchasePopup({
                                        itemType: guildTicketItemId,
                                        name: loc(guildTicketDescription, 'Create Guild'),
                                        image: 'icons/Guild.png',
                                        essence: globalState.currency,
                                        newEssence: globalState.currency,
                                        premiumEssence: globalState.premiumEssence,
                                        newPremiumEssence: newPEBalance
                                    },
                                        function () {
                                            engine.call('OnBuyItem', guildTicketItemId, 'PE')
                                            if (isBrowserTest) {
                                                engine.trigger('requestGuildAbbreviation')
                                            }
                                        }
                                    )
                                }
                            },
                                React.createElement('div', {
                                    className: 'currency-button-container',
                                },
                                    React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/PremiumEssence_32.png' }),
                                    createGuildPECost,
                                    //enoughPE && React.createElement('div', { className: 'currency-balance' }, loc('new_balance', 'New balance: ' + newPEBalance, [newPEBalance])),
                                    enoughPE && React.createElement('div', { className: 'currency-balance' }, loc('unlock_with', 'Unlock with Premium Essence', [peCurrencyName])),
                                    !enoughPE && React.createElement('div', { className: 'currency-balance' }, loc('not_enough_money', 'Not enough ' + peCurrencyName, [peCurrencyName])),
                                    !enoughPE && React.createElement('span', { className: 'tooltiptext auto' }, loc('buy_item', 'Buy Premium Essence', [loc('premium_essence', 'Premium Essence')]))
                                )
                            ),
                            React.createElement('span', {
                                className: 'button big',
                                style: { marginRight: '16px' },
                                onMouseDown: function (e) {
                                    engine.trigger('escape')
                                }
                            }, loc('back', 'Back'))
                        )
                    )
                )
            )
        }
    })
}

var GuildInvitationsView = React.createClass({
    render: function () {
        return (
            React.createElement('div', { id: 'GuildInvitationsView' },
                React.createElement('div', {
                    className: 'fullscreen',
                    onMouseDown: function (e) { // v1.50
                        engine.trigger('enableChat', false)
                    },
                    style: {
                        pointerEvents: 'all'
                    }
                },
                    React.createElement(GuildInvitationsMenu, {})
                )
            )
        )
    }
})

var GuildInvitationsMenu = React.createClass({
    getInitialState: function () {
        return {
            invitationsList: globalState.invitationsList,
            selectedInvitationNumber: -1,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshInvitationsList = function (invitationsList) {
            console.log('refreshInvitationsList with ' + invitationsList.invitations.length + ' invitations')
            parent.setState({
                invitationsList: invitationsList,
                selectedInvitationNumber: -1,
            })
        }
        bindings.setSelectedInvitation = function (inviteNumber) {
            console.log('setState setSelectedInvitation: ' + inviteNumber)
            parent.setState({ selectedInvitationNumber: inviteNumber })
        }
    },
    render: function () {
        var parent = this

        // v8.05 this causes things to crash maybe with special characters!!!
        //console.log('invitationsList: ' + JSON.stringify(this.state.invitationsList))

        if (this.state.invitationsList == null || this.state.invitationsList.invitations == null || this.state.invitationsList.showLoading) {
            return React.createElement('div', { className: 'centered-text overlay no-background' },
                React.createElement('div', {
                    className: 'centered-text-wrapper', style: { background: 'rgba(0, 0, 0, 0.5)' }
                },
                    React.createElement('div', {
                        id: 'GuildInvitations', className: 'full-screen directory',
                        style: {
                            textAlign: 'center',
                            padding: '4vh'
                        }
                    },
                        React.createElement('img', {
                            src: 'hud/img/ui/loading-small.gif',
                        })
                    )
                )
            )
        }

        var invitations = this.state.invitationsList.invitations

        return (
            React.createElement('div', { className: 'centered-text overlay no-background' },
                React.createElement('div', {
                    className: 'centered-text-wrapper', style: { background: 'rgba(0, 0, 0, 0.5)' } },
                    React.createElement('div', { id: 'GuildInvitations', className: 'full-screen directory' },
                        React.createElement('div', { className: 'directory-content' },
                            React.createElement('h1', { style: { display: 'inline-block' } }, loc('guild_invitations_and_applications', "Guild Invitations and Applications")),
                            React.createElement('div', {
                                className: 'button em',
                                onMouseDown: function (e) {
                                    engine.trigger('searchGuildInvite')
                                },
                                style: {
                                    float: 'right', marginTop: '1vh'
                                }
                            },
                                loc('invite_to_guild', 'Invite to guild')
                            ),
                            React.createElement('ul', { className: 'full-screen-entry-list scrollable' },
                                invitations == null || invitations.length == 0 && React.createElement('div', {},
                                    loc('guild_invitations_blank', "No invitations or applications found")
                                ),
                                invitations && invitations.length > 0 && invitations.map(function (invitation, index) {

                                    invitation.key = invitation.key
                                    invitation.active = parent.state.selectedInvitationNumber == index
                                    invitation.number = index

                                    return React.createElement(GuildInvitation, invitation)
                                })
                            ),
                            React.createElement('div', { className: 'front-description-buttons' },
                                React.createElement('div', { className: 'confirmation-buttons' },
                                    React.createElement(MenuButton, {
                                        name: 'back',
                                        displayName: loc('back', 'Back'),
                                        className: 'big',
                                        behavior: function () {
                                            engine.trigger('escape')
                                        }
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

var GuildInvitation = React.createClass({
    propTypes: {
        number: React.PropTypes.number,
        active: React.PropTypes.bool
    },
    render: function () {
        var parent = this

        var player = this.props.props
        var ratingImage = getRatingImage(player.overallElo)

        if (!player.avatar)
            player.avatar = "icons/DefaultAvatar.png"

        return (
            React.createElement('li', {
                className: 'browser-row' + (this.props.active ? ' active' : ''),
                onClick: function () {
                    console.log('setSelectedInvitation: ' + parent.props.number)
                    engine.trigger('setSelectedInvitation', parent.props.number)
                }
            },
                React.createElement('div', {},
                    React.createElement('img', { className: 'avatar big', src: 'hud/img/' + player.avatar }),
                    React.createElement('div', { className: 'name' },
                        React.createElement('span', {
                            style: { position: 'relative', top: '5px' }},
                            ratingImage && React.createElement('img', { style: { width: '24px', height: '24px' }, src: ratingImage }),
                            React.createElement('span', { className: 'rating-numeral', style: { bottom: '4px', right: '8px' } }, getRatingDivisionNumeral(player.overallElo))
                        ),
                        player.displayName,
                        ' ',
                        React.createElement('span', { className: 'country' },
                            React.createElement('span', {
                                className: 'simple-tooltip flag-icon flag-icon-' + player.countryCode,
                                style: {
                                    height: '16px', lineHeight: '16px'
                                }
                            },
                                React.createElement('span', { className: 'tooltiptext auto' }, player.countryCode) // todo
                            )
                        ),
                        ' ',
                        React.createElement('div', { className: 'subtitle' },
                            //this.props.invitationType == 'invite' && React.createElement('span', { className: 'invitation-type', style: {} }, loc('guild_invitation', 'Guild Invitation')),
                            //this.props.invitationType == 'application' && React.createElement('span', { className: 'invitation-type', style: {} }, loc('guild_application', 'Guild Application')),
                            React.createElement('span', {
                                dangerouslySetInnerHTML: {
                                    __html: this.props.invitedString
                                },
                                style: {
                                    color: 'rgba(255, 255, 255, 0.66)'
                                }
                            })
                        )
                    ),
                    this.props.active && React.createElement('div', {
                        style: {
                            float: 'right',
                            marginTop: '2vh'
                        }
                    },
                        React.createElement('div', { className: 'button-container' },
                            React.createElement('div', { className: 'join' },
                                this.props.invitationType == 'invite' && React.createElement(MenuButton, {
                                    name: 'invite',
                                    displayName: loc('revoke', 'Revoke'),
                                    className: 'em red',
                                    behavior: function () {
                                        engine.call('OnRevokeGuildInvite', player.playFabMasterId)
                                    }
                                }),
                                this.props.invitationType == 'application' && React.createElement(MenuButton, {
                                    name: 'application',
                                    displayName: loc('accept', 'Accept'),
                                    className: 'em green',
                                    behavior: function () {
                                        engine.call('OnAcceptGuildApplication', player.playFabMasterId)
                                    }
                                })
                            ),
                            this.props.invitationType == 'application' && React.createElement('div', { className: 'join' },
                                React.createElement(MenuButton, {
                                    name: 'application',
                                    displayName: loc('reject', 'Reject'),
                                    className: 'em red',
                                    behavior: function () {
                                        engine.call('OnRejectGuildApplication', player.playFabMasterId)
                                    }
                                })
                            ),
                            React.createElement('div', { className: 'join' },
                                React.createElement(MenuButton, {
                                    name: 'viewProfile',
                                    displayName: loc('view_profile', 'View Profile'),
                                    behavior: function () {
                                        console.log('Clicked View Profile on player ' + player.playFabMasterId)
                                        engine.trigger('hideFullScreenPopup')
                                        engine.trigger('viewGuildPlayerProfile', player.playFabMasterId)
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

var GuildEmblemView = React.createClass({
    render: function () {
        return (
            React.createElement('div', { id: 'GuildEmblemView' },
                React.createElement('div', {
                    className: 'fullscreen',
                    onMouseDown: function (e) { // v1.50
                        engine.trigger('enableChat', false)
                    },
                    style: {
                        pointerEvents: 'all'
                    }
                },
                    React.createElement(GuildEmblemMenu, {})
                )
            )
        )
    }
})

var GuildEmblemMenu = React.createClass({
    getInitialState: function () {
        return {
            emblemFolder: '',
            emblemBlob: 'hud/img/ui/loading-small.gif',
            emblemBlobBackend: 'hud/img/ui/loading-small.gif',
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshEmblem = function (emblemFolder, emblemBlob, emblemBlobBackend) {
            // Failsafe
            if (emblemBlob == null) emblemBlob = ''
            if (emblemBlobBackend == null) emblemBlobBackend = ''
            console.log('refreshEmblem emblemFolder: ' + emblemFolder + ', blob length: ' + emblemBlob.length + ', backend blob length: ' + emblemBlobBackend.length)
            parent.setState({
                emblemFolder: emblemFolder,
                emblemBlob: emblemBlob,
                emblemBlobBackend: emblemBlobBackend,
            })
        }
    },
    render: function () {
        var parent = this

        return (
            React.createElement('div', { className: 'centered-text overlay no-background' },
                React.createElement('div', {
                    className: 'centered-text-wrapper', style: { background: 'rgba(0, 0, 0, 0.5)' }
                },
                    React.createElement('div', { id: 'GuildEmblem', className: 'full-screen directory' },
                        React.createElement('h1', { style: { display: 'inline-block' } }, loc('edit_guild_emblem', "Edit Guild Emblem")),
                        React.createElement('div', { className: 'emblem-container' },
                            React.createElement('div', { className: 'emblem-blob-label' }, loc('saved', 'Saved')),
                            React.createElement('div', { className: 'emblem-blob-container' },
                                this.state.emblemBlobBackend.length > 0 && React.createElement('img', { src: this.state.emblemBlobBackend, className: 'emblem-blob' }),
                                this.state.emblemBlobBackend.length == 0 && React.createElement('img', { src: 'hud/img/splashes/NoIcon.png', className: 'emblem-blob' })
                            ),
                            React.createElement('div', { className: 'emblem-blob-label' }, loc('current', 'Current')),
                            React.createElement('div', { className: 'emblem-blob-container' },
                                this.state.emblemBlob.length > 0 && React.createElement('img', { src: this.state.emblemBlob, className: 'emblem-blob' }),
                                this.state.emblemBlob.length == 0 && React.createElement('img', { src: 'hud/img/splashes/NoIcon.png', className: 'emblem-blob' })
                            ),
                            React.createElement('div', {
                                className: '',
                                style: {
                                    marginTop: '28px'
                                },
                                dangerouslySetInnerHTML: {
                                    __html: loc('edit_guild_emblem_long', 'To make changes, edit emblem.png located in H:\\Program Files (x86)\\Steam\\steamapps\\common\\Legion TD 2\\Upload<br>After saving the file, click Refresh.', ['emblem.png', parent.state.emblemFolder])
                                }
                            })
                        ),
                        React.createElement('div', { className: 'emblem-adjustment-buttons' },
                            React.createElement('div', {
                                className: 'button',
                                onMouseDown: function (e) {
                                    console.log('click OnOpenFilePath')
                                    engine.call('OnOpenFilePath', parent.state.emblemFolder)
                                }
                            },
                                loc('open_file_path', 'Open File Path'),
                                React.createElement('img', { src: 'hud/img/small-icons/external-link.png', style: { marginLeft: '8px' } })
                            ),
                            React.createElement('div', {
                                className: 'button',
                                onMouseDown: function (e) {
                                    console.log('clicked Refresh Guild Emblem')
                                    engine.trigger('showGuildEmblem')
                                }
                            },
                                loc('refresh', 'Refresh')
                            ),
                            React.createElement('div', {
                                className: 'button',
                                onMouseDown: function (e) {
                                    console.log('clicked Revert Guild Emblem')
                                    engine.trigger('refreshEmblem', '', 'hud/img/ui/loading-small.gif', 'hud/img/ui/loading-small.gif')
                                    setTimeout(function () {
                                        engine.call('OnRevertGuildEmblem')

                                        if (isBrowserTest)
                                            engine.trigger('refreshEmblem', testEmblemFolder, testEmblemBlob, testEmblemBlobBackend)
                                    }, 500)
                                }
                            },
                                loc('revert', 'Revert')
                            )
                        ),
                        React.createElement('div', { className: 'front-description-buttons' },
                            React.createElement('div', { className: 'confirmation-buttons' },
                                React.createElement(EmphasizedMenuButton, {
                                    name: 'save',
                                    displayName: loc('save', 'Save'),
                                    className: 'big',
                                    behavior: function () {
                                        console.log('click save emblem')
                                        engine.call('OnSaveGuildEmblem', parent.state.emblemBlob)
                                    }
                                }),
                                React.createElement(MenuButton, {
                                    name: 'back',
                                    displayName: loc('back', 'Back'),
                                    className: 'big',
                                    behavior: function () {
                                        engine.trigger('escape')
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