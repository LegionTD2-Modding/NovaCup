// Top bar (server warnings)
// ===============================================================================
var TopBar = React.createClass({
    getInitialState: function () {
        return {
            notificationText: "",
            notificationURL: "",
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.showTopBar = function (notificationText, notificationURL) {
            parent.setState({ notificationText: notificationText, notificationURL: notificationURL })
        }
    },
    render: function () {
        var parent = this

        // console.log('render top bar, current view: ' + globalState.currentView)

        // v7.02: hide the msg outside the launcher view so it doesn't get in the way
        if (globalState.currentView != '' && globalState.currentView != 'launcher')
            return null

        return (
            React.createElement('div', {},
                this.state.notificationText && this.state.notificationText.length > 0 && React.createElement('div', {
                    id: 'TopBar',
                    className: 'warning'
                },
                    this.state.notificationText + " ",
                    this.state.notificationURL && this.state.notificationURL.length > 0 && React.createElement('a', {
                        href: "#",
                        onClick: function () {
                            engine.call("OnOpenURL", parent.state.notificationURL)
                        }
                    },
                        " " + this.state.notificationURL
                    )
                )
            )
        )
    }
})

// Bottom bar in the game lobby
// ===============================================================================
var chatRefreshTimer
var BottomBar = React.createClass({
    getInitialState: function () {
        return {
            enabled: globalState.bottomBarLastEnabledState,
            showChatRefreshButton: false,
            connectionStatus: '',
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.showBottomBar = function (show) {
            // v8.03.12 performance - bail early if no change
            if (parent.state.enabled == show) {
                return
            }

            parent.setState({ enabled: show, showChatRefreshButton: false })
            globalState.bottomBarLastEnabledState = show
            clearTimeout(chatRefreshTimer)
            if (!show) {
                chatRefreshTimer = setTimeout(function () {
                    parent.setState({ showChatRefreshButton: true })
                }, 5000)
            }
        }
        bindings.refreshChatConnectionStatus = function (status) {
            parent.setState({ connectionStatus: status })
        }
    },
    render: function () {
        //console.log("BottomBar.render() with enabled: " + this.state.enabled + ", isInGame: " + globalState.isInGame + " showChatRefreshButton: " + this.state.showChatRefreshButton
        //    + ", connectionStatus: " + this.state.connectionStatus)

        var parent = this
        return (
            React.createElement('div', {},
                React.createElement('div', {
                    id: this.state.enabled ? 'BottomBar' : 'BottomBarLoading',
                    className: (!globalState.isInGame || this.state.enabled) ? '' : 'hidden'
                },
                    React.createElement(BottomBarMenuIcons),
                    React.createElement('span', { className: this.state.enabled ? '' : 'hidden' },
                        React.createElement(ChatView, { chatType: ChatType.bottomBar })
                    ),
                    !this.state.enabled && React.createElement('div', { id: 'ChatViewContainer' },
                        React.createElement('div', {
                            id: 'ChatViewLabel',
                            style: { textAlign: 'center' }
                        },
                            loc('connecting_to_chat_server', "Connecting to Chat Server..."),
                            React.createElement('span', { style: { color: '#909090' } },
                                parent.state.connectionStatus && (' ' + parent.state.connectionStatus)
                            )
                        ),
                        this.state.showChatRefreshButton && React.createElement('div', {
                            className: 'button',
                            id: 'RefreshChatButton',
                            onMouseDown: function (e) {
                                engine.call('OnChatReloadButtonPressed')
                            }
                        },
                            "Reload Chat"
                        )
                    ),

                    React.createElement(PlayerCount)
                )
            )
        )
    }
})

var BottomBarMenuIcons = React.createClass({
    render: function () {
        var parent = this

        return (
            React.createElement('div', { id: "BottomBarIconContainer" },
                !globalState.isInGame && React.createElement('div', {
                    className: 'simple-tooltip',
                    onMouseEnter: function () { engine.call('OnMouseOverLight', 0) }
                },
                    React.createElement('img', {
                        className: 'client-menu-button',
                        src: 'hud/img/hudv2/PowerButton3.png',
                        onMouseDown: function (e) {
                            engine.trigger('loadPopup', 'exit')
                        }
                    }),
                    React.createElement('span', { className: 'tooltiptext auto' },
                        loc("quit", "Quit")
                    )
                ),
                // v9.00.7 disabled adjusting options via bottom bar if you're in-game, since I think it causes some problems
                // where people can't pick their rolls, etc. depending on race conditions?
                !globalState.isInGame && React.createElement('div', {
                    className: 'simple-tooltip',
                    onMouseEnter: function () { engine.call('OnMouseOverLight', 1) }
                },
                    React.createElement('img', {
                        className: 'client-menu-button',
                        src: 'hud/img/small-icons/options.png',
                        onMouseDown: function (e) {
                            // experimental
                            engine.trigger('setMenuRootOnce', globalState.currentView)

                            engine.trigger('loadView', 'options')
                        }
                    }),
                    React.createElement('span', { className: 'tooltiptext auto' },
                        loc("adjust_settings", "Adjust client & in-game settings")
                    )
                ),
                shouldShowGameGuide() && React.createElement('div', {
                    className: 'simple-tooltip',
                    onMouseEnter: function () { engine.call('OnMouseOverLight', 2) }
                },
                    React.createElement('img', {
                        className: 'client-menu-button',
                        src: 'hud/img/small-icons/guide.png',
                        onMouseDown: function (e) {
                            var left = e.nativeEvent.clientX - 24
                            var top = e.nativeEvent.clientY - 280 // SUPER SMELLY way to position it up a bit

                            if (globalState.screenHeight >= 1440)
                                top -= 40;
                            if (globalState.screenHeight >= 2160)
                                top -= 120;
                            
                            if (e.nativeEvent.which == 2) return // v2.22 fix

                            openContextMenu("", locName('open_help', "Help Menu"), helpMenu, left, top, false)
                        }
                    }),
                    React.createElement('span', { className: 'tooltiptext auto' },
                        loc("open_help", "Open the help menu")
                    )
                ),
                shouldShowDiscord() && React.createElement('div', {
                    className: 'simple-tooltip',
                    onMouseEnter: function () { engine.call('OnMouseOverLight', 3) }
                },
                    React.createElement('img', {
                        className: 'client-menu-button',
                        src: 'hud/img/hudv2/discord24.png',
                        onMouseDown: function (e) {
                            engine.call("OnOpenURL", "http://legiontd2.com/chat")
                        }
                    }),
                    React.createElement('span', { className: 'tooltiptext auto' },
                        React.createElement('span', {
                            dangerouslySetInnerHTML: {
                                __html: loc("join_discord_chat", "Join Legion TD 2 Discord Chat")
                            }
                        })
                    )
                ),
                !globalState.isInGame && React.createElement(InboxWidget),
                React.createElement(TwitchStreamWidget),
                React.createElement('div', { className: 'simple-tooltip' },
                    React.createElement('img', {
                        className: 'client-menu-button',
                        src: 'hud/img/small-icons/reddit.png',
                        onMouseDown: function (e) {
                            engine.call("OnOpenURL", "http://reddit.com/r/LegionTD2")
                        }
                    }), 
                    React.createElement('span', { className: 'tooltiptext auto' },
                        React.createElement('span', {
                            dangerouslySetInnerHTML: {
                                __html: loc("legion_td_2_reddit", "Legion TD 2 reddit")
                            }
                        })
                    )
                ),
                React.createElement('div', { className: 'simple-tooltip' },
                    React.createElement('img', {
                        className: 'client-menu-button',
                        src: 'hud/img/small-icons/announcement.png',
                        onMouseDown: function (e) {
                            engine.call('OnReadNewsArchive')
                        }
                    }),
                    React.createElement('span', { className: 'tooltiptext auto' },
                        React.createElement('span', {
                            dangerouslySetInnerHTML: {
                                __html: loc("legion_td_2_announcements", "Legion TD 2 Announcements")
                            }
                        })
                    )
                )
                // No need for this button, it's too much clutter
                //React.createElement('div', { className: 'simple-tooltip' },
                //    React.createElement('img', {
                //        className: 'client-menu-button' + (!globalState.shopEnabled ? ' disabled' : ''),
                //        src: 'hud/img/small-icons/store.png',
                //        onMouseDown: function (e) {
                //            if (globalState.shopEnabled) {
                //                engine.trigger('loadView', 'store')
                //            }
                //        }
                //    }), 
                //    React.createElement('span', { className: 'tooltiptext auto' },
                //        loc("visit_store", "Visit the in-game store to spend Essence"),
                //        !globalState.shopEnabled && React.createElement('div', {
                //            style: { color: '#ff3333' }
                //        },
                //            loc("not_yet_implemented", "Not yet implemented")
                //        )
                //    )
                //)
            )
        )
    }
})

var TwitchStreamWidget = React.createClass({
    getInitialState: function () {
        return {
            count: 0,
            data: [],
            showPopup: false,
            featured: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshTwitchStreams = function (data) {
            //console.log('refreshTwitchStreams data to: ' + data["data"])
            parent.setState({ data: data["data"] })

            var streamCount = 0
            var featuredIsOnline = false
            parent.state.data.map(function (entry, index) {
                streamCount += entry.viewer_count

                // Janky way to get the username
                var thumbnail = entry['thumbnail_url']
                thumbnail = thumbnail.replace('{width}', '320')
                thumbnail = thumbnail.replace('{height}', '180')
                var re = new RegExp('live_user_[a-z0-9_]+')
                var reResult = re.exec(thumbnail)
                var username = ""
                if (reResult != null && reResult.length > 0) {
                    username = reResult[0].replace('live_user_', '')
                }

                if (username == globalState.featuredTwitchStream) {
                    featuredIsOnline = true
                }
            })

            if (streamCount != parent.state.count) {
                parent.setState({ count: streamCount, featured: featuredIsOnline })
            }
        }

        bindings.enableTwitchPopout = function (enabled) {
            // v8.05.1 bail early if no change
            if (parent.state.showPopup == enabled) return

            parent.setState({ showPopup: enabled })
        }
    },
    render: function () {
        var parent = this


        return (
            React.createElement('div', { id: "TwitchWidgetWrapper" },

                React.createElement('div', {
                    id: 'TwitchPlayerCount',
                    className: 'simple-tooltip',
                    onMouseDown: function (e) {
                        if (parent.state.count == 0) return

                        engine.call('OnRequestTwitchStreams')
                        parent.setState({ showPopup: !parent.state.showPopup })
                        engine.trigger('enableInboxPopout', false) // Make sure the popups dont overlap, hide other popup just in case
                    },
                    onMouseEnter: function () { engine.call('OnMouseOverLight', 4) }
                },
                    React.createElement('img', {
                        className: 'client-menu-button' + (parent.state.showPopup ? ' active' : ''),
                        src: 'hud/img/hudv2/twitch24.png'
                    }),
                    parent.state.count > 0 && React.createElement('span', {
                        className: 'stream-count' + (parent.state.featured ? ' featured' : ''),
                        dangerouslySetInnerHTML: {
                            __html: parent.state.count +
                                (parent.state.featured ?
                                    (' <img src="hud/img/small-icons/blackstar.png"> '
                                    + loc('special_event', 'Special Event') + '!')
                                : '')
                        }
                    }),
                    parent.state.count > 0 && React.createElement('span', { className: 'tooltiptext' },
                        loc("view_twitch_streams", "View Twitch streams")
                    ),
                    parent.state.count == 0 && React.createElement('span', { className: 'tooltiptext' },
                        loc("no_streams_online", "No Twitch streams currently online")
                    )
                ),

                parent.state.count > 0 && parent.state.showPopup && React.createElement('div', {
                    id: 'TwitchPopout', className: 'scrollable'
                },
                    React.createElement('div', { className: 'consoleWindow content' },
                        React.createElement('div', { className: 'topbar' },
                            React.createElement('div', {},
                                React.createElement('div', {
                                    id: 'TwitchHeader',
                                    dangerouslySetInnerHTML: {
                                        __html: loc("live_streams", "Live streams on Twitch ($1)", [this.state.count])
                                    }
                                })
                            )
                        ),
                        // Show featured first (SMELLY COPY AND PASTE BELOW)
                        parent.state.data != null && parent.state.data.length > 0 && React.createElement('div', { className: 'streams' },
                            parent.state.data.map(function (entry, index) {
                                var thumbnail = entry['thumbnail_url']
                                thumbnail = thumbnail.replace('{width}', '320')
                                thumbnail = thumbnail.replace('{height}', '180')

                                var viewerCount = entry['viewer_count']
                                var title = entry['title']
                                var streamId = entry['id']

                                // ghetto 
                                var re = new RegExp('live_user_[a-z0-9_]+')
                                var reResult = re.exec(thumbnail)
                                var username = ""

                                if (reResult != null && reResult.length > 0) {
                                    username = reResult[0].replace('live_user_', '')
                                }

                                var featured = username == globalState.featuredTwitchStream

                                // v10.06.6: only allow featured in this pass
                                if (!featured) return null

                                return React.createElement('div', {
                                    className: 'stream-container' + (featured ? ' featured' : ''),
                                    onMouseDown: function (e) {
                                        var url = "http://twitch.tv/" + username
                                        console.log('open url: ' + url)
                                        engine.call("OnOpenURL", url)
                                    }
                                },
                                    React.createElement('img', { className: 'twitch-thumb', src: thumbnail }),
                                    React.createElement('div', {
                                        style: {
                                            width: '200px',
                                            height: '95px',
                                            marginTop: '24px',
                                            textAlign: 'center',
                                            zIndex: '-1'
                                        }
                                    },
                                        React.createElement('img', {
                                            src: 'hud/img/ui/loading-small.gif'
                                        })
                                    ),
                                    React.createElement('div', { className: 'twitch-name' }, username),
                                    React.createElement('div', { className: 'twitch-viewers' }, loc('viewers', viewerCount + " viewers", [viewerCount])),
                                    React.createElement('div', { className: 'twitch-title' }, title)
                                )
                            }),
                            // Then the rest (SMELLY COPY PASTE)
                            parent.state.data.map(function (entry, index) {
                                var thumbnail = entry['thumbnail_url']
                                thumbnail = thumbnail.replace('{width}', '320')
                                thumbnail = thumbnail.replace('{height}', '180')

                                var viewerCount = entry['viewer_count']
                                var title = entry['title']
                                var streamId = entry['id']

                                // ghetto 
                                var re = new RegExp('live_user_[a-z0-9_]+')
                                var reResult = re.exec(thumbnail)
                                var username = ""

                                if (reResult != null && reResult.length > 0) {
                                    username = reResult[0].replace('live_user_', '')
                                }

                                var featured = username == globalState.featuredTwitchStream
                                // v10.06.6: skip featured in this pass
                                if (featured) return null

                                return React.createElement('div', {
                                    className: 'stream-container' + (featured ? ' featured' : ''),
                                    onMouseDown: function (e) {
                                        var url = "http://twitch.tv/" + username
                                        console.log('open url: ' + url)
                                        engine.call("OnOpenURL", url)
                                    }
                                },
                                    React.createElement('img', { className: 'twitch-thumb', src: thumbnail }),
                                    React.createElement('div', {
                                        style: {
                                            width: '200px',
                                            height: '95px',
                                            marginTop: '24px',
                                            textAlign: 'center',
                                            zIndex: '-1'
                                        }
                                    },
                                        React.createElement('img', {
                                            src: 'hud/img/ui/loading-small.gif'
                                        })
                                    ),
                                    React.createElement('div', { className: 'twitch-name' }, username),
                                    React.createElement('div', { className: 'twitch-viewers' }, loc('viewers', viewerCount + " viewers", [viewerCount])),
                                    React.createElement('div', { className: 'twitch-title' }, title)
                                )
                            })
                        )
                    )
                )
            )
        )
    }
})

var InboxWidget = React.createClass({
    getInitialState: function () {
        return {
            inboxCount: 0,
            unreadInboxCount: 0,
            showInbox: false,
            inboxMessages: [],
            checkboxStates: []
        }
    },
    componentWillMount: function () {
        var parent = this

        bindings.refreshInboxMessages = function (messages) {
             // Smelly Dani code: we should just pass in the messages object directly I think
            if (typeof messages == 'string')
                messages = JSON.parse(messages)

            var unreadInboxCount = 0
            _.forEach(messages, function (m, index) {
                if (!m.read)
                    unreadInboxCount++
            });

            parent.setState({ inboxMessages: messages, inboxCount: messages.length, unreadInboxCount: unreadInboxCount })
            parent.forceUpdate()
        }

        bindings.enableInboxPopout = function (enabled) {
            // v8.05.1 bail early if no change
            if (parent.state.showInbox == enabled) return

            parent.setState({ showInbox: enabled })
            engine.call('OnEnableInboxPopout', enabled)
        }
    },
    render: function () {
        var parent = this
        return (
            React.createElement('div', { id: "InboxWidgetWrapper" },
                React.createElement('div', {
                    id: 'InboxMessageCount',
                    className: 'simple-tooltip',
                    onMouseDown: function (e) {
                        if (parent.state.inboxCount == 0) return

                        // what is this? doesn't do anything I think
                        //engine.call('OnRequestInboxMessages')

                        engine.trigger('enableInboxPopout', !parent.state.showInbox)
                        engine.trigger('enableTwitchPopout', false)  // Make sure the popups dont overlap, hide other popup just in case
                    },
                    onMouseEnter: function () { engine.call('OnMouseOverLight', 5) }
                },
                    React.createElement('img', {
                        className: 'client-menu-button' + (this.state.showInbox ? ' active' : ''),
                        src: 'hud/img/small-icons/inbox.png'
                    }),
                    this.state.unreadInboxCount > 0 && React.createElement('span', { className: 'stream-count' }, this.state.unreadInboxCount),
                    this.state.inboxCount > 0 && React.createElement('span', { className: 'tooltiptext' },
                        loc("view_inbox_messages", "Read inbox messages")
                    ),
                    this.state.inboxCount == 0 && React.createElement('span', { className: 'tooltiptext' },
                        loc("no_new_inbox_messages", "No current messages")
                    )
                ),

                this.state.inboxCount > 0 && this.state.showInbox && React.createElement('div', {
                    id: 'InboxPopout', className: 'scrollable'
                },
                    React.createElement('div', { className: 'consoleWindow content' },
                        globalState.inboxMessagesToDelete.length > 0 && React.createElement('div', {
                            className: 'delete-inbox',
                            onMouseDown: function (e) {
                                console.log("Submit ids for deletion: " + globalState.inboxMessagesToDelete)
                                engine.call("OnDeleteInboxMessage", globalState.inboxMessagesToDelete)

                                globalState.inboxMessagesToDelete = []
                                parent.setState({ checkboxStates: [] })

                                if (isBrowserTest) {
                                    engine.trigger('refreshInboxMessages', testInboxEntries2)
                                    parent.forceUpdate()
                                }
                            }
                        }),
                        React.createElement('div', { className: 'topbar' },
                            React.createElement('div', {},
                                React.createElement('div', {
                                    id: 'InboxHeader',
                                    dangerouslySetInnerHTML: {
                                        __html: loc('inbox', "Inbox messages", [this.state.inboxCount])
                                    }
                                })
                            )
                        ),
                        parent.state.inboxMessages != null && parent.state.inboxMessages.length > 0 && React.createElement('div', { className: 'inboxmessage' },
                            parent.state.inboxMessages.map(function (entry, index) {

                                var messageTypeString = ''
                                switch (entry.messageType) {
                                    case 1:
                                        messageTypeString = 'guild'
                                        break
                                    case 2:
                                        messageTypeString = 'guildmanage'
                                        break
                                    case 3:
                                        messageTypeString = ''
                                        break
                                    case 5: // Review the game v7.06
                                        messageTypeString = 'review'
                                        break
                                    case 8: // Polls
                                        messageTypeString = 'poll'
                                        break
                                }
                                entry.message = Helpers.decodeHTMLstring(entry.message)
                                console.log('entry.messageType: ' + entry.messageType + ', messageTypeString: ' + messageTypeString)

                                return React.createElement('div', {
                                    className: 'inboxmessage-wrapper',
                                    onMouseDown: function (e) {
                                        engine.call("onSubmitInboxMessage", true)
                                    }
                                },
                                    React.createElement('div',
                                        {
                                            className: 'checkbox-container',
                                            onClick: function () {
                                                parent.state.checkboxStates[index] = !parent.state.checkboxStates[index]

                                                if (parent.state.checkboxStates[index]) {
                                                    globalState.inboxMessagesToDelete.push(entry.id)
                                                } else {
                                                    globalState.inboxMessagesToDelete = Helpers.filterArray(globalState.inboxMessagesToDelete, entry.id)
                                                }

                                                parent.forceUpdate()
                                            }
                                        },

                                        React.createElement('div',
                                            {
                                                className: 'checkbox-box inline'
                                            },
                                            parent.state.checkboxStates[index] && React.createElement('img',
                                                {
                                                    className: 'checkbox-icon',
                                                    src: 'hud/img/ui/accept-check.png',
                                                    id: 'skip-news-checkbox'
                                                })
                                        )
                                    ),

                                    React.createElement('details', {
                                        className: 'inboxmessage-details',
                                        onMouseDown: function (e) {
                                            console.log('click inboxmessage details')
                                            engine.call('OnReadInboxMessage', JSON.stringify(entry))
                                        }
                                    },
                                        React.createElement('summary', { className: 'inboxmessage-summary' },
                                            !entry.read && React.createElement('img', { className: 'unread', src: 'hud/img/small-icons/unread.png'}),
                                            React.createElement('div', { className: 'inboxmessage-title' }, entry.title,
                                                React.createElement('div', {
                                                    className: 'inboxmessage-subtitle',
                                                    dangerouslySetInnerHTML: {
                                                        __html: " - " + entry.sender + " (" + entry.formattedDate + ")"
                                                    }
                                                })
                                            )
                                        ),
                                        React.createElement('div', {
                                            className: 'inboxmessage-message',
                                            dangerouslySetInnerHTML: {
                                                __html: entry.message
                                            }
                                        }),
                                        messageTypeString && messageTypeString == 'guild' && React.createElement('span', {
                                            style: { display: 'inline-block', margin: '6px' },
                                            className: 'button green',
                                            onMouseDown: function (e) {
                                                console.log('accept inbox invite: ' + messageTypeString + ', ' + entry.inviteId)
                                                engine.call('OnAcceptInboxInvite', JSON.stringify(entry))
                                            }
                                        }, loc('accept', 'Accept')),
                                        messageTypeString && messageTypeString == 'guild' && React.createElement('span', {
                                            style: { display: 'inline-block', margin: '6px' },
                                            className: 'button red',
                                            onMouseDown: function (e) {
                                                console.log('reject inbox invite: ' + messageTypeString + ', ' + entry.inviteId)
                                                engine.call('OnRejectInboxInvite', JSON.stringify(entry))
                                            }
                                        }, loc('reject', 'Reject')),
                                        messageTypeString && messageTypeString == 'guild' && React.createElement('span', {
                                            style: { display: 'inline-block', margin: '6px' },
                                            className: 'button',
                                            onMouseDown: function (e) {
                                                console.log('view guild profile ' + entry.inviteId)
                                                engine.call('OnViewGuildProfile', entry.inviteId)

                                            }
                                        }, loc('view_guild', 'View Guild')),
                                        messageTypeString && messageTypeString == 'guildmanage' && React.createElement('span', {
                                            style: { display: 'inline-block', margin: '6px' },
                                            className: 'button',
                                            onMouseDown: function (e) {
                                                console.log('manage')
                                                engine.call('OnManageInboxInvite', JSON.stringify(entry))

                                                if (isBrowserTest)
                                                    engine.trigger('viewGuildProfile', testGuild)
                                            }
                                        }, loc('manage', 'Manage')),
                                        messageTypeString && messageTypeString == 'review' && React.createElement('span', {
                                            style: { display: 'inline-block', margin: '6px' },
                                            className: 'button',
                                            onMouseDown: function (e) {
                                                console.log('review the game')
                                                engine.call("OnOpenURL", "https://store.steampowered.com/app/469600/Legion_TD_2__Multiplayer_Tower_Defense/")
                                            }
                                        }, loc('review_button', 'Write a review')),
                                        messageTypeString && messageTypeString == 'poll' && React.createElement('div', { className: 'poll-option-wrapper' },
                                            entry.voteOptions.map(function (pollOption, pollIndex) {
                                                return React.createElement('span', {
                                                    style: { display: 'inline-block', margin: '6px' },
                                                    className: 'button',
                                                    onMouseDown: function (e) {
                                                        console.log('clicked option ' + pollIndex + ': ' + pollOption)
                                                        engine.call('OnCastInboxVote', pollIndex, pollOption, entry.id, entry.message)
                                                    }
                                                }, pollOption)
                                            })
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

var PlayerCount = React.createClass({
    getInitialState: function () {
        return {
            count: "",
            showClientMenu: false,
            tag: "",
            notificationText: "",
            notificationURL: "",
            dateString: "",
            clientVersion: "",
            currentLobbyId: "",
            clockTime: "",
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.setClientVersion = function (version) {
            parent.setState({ clientVersion: version })
        }
        bindings.setCurrentLobbyId = function (lobbyid) {
            parent.setState({ currentLobbyId: lobbyid })
        }
        bindings.setPlayersOnline = function (count) {
            parent.setState({ count: count })
        }
        bindings.enableClientMenuPopout = function (enabled) {
            parent.setState({ showClientMenu: enabled })
        }
        bindings.updateLobbyClockTime = function (timeString) {
            parent.setState({ clockTime: timeString })
        }
    },
    render: function () {
        var parent = this
        return (
            React.createElement('div', {
                id: "PlayerCountContainer", className: 'simple-tooltip'
            },
                // v9.01 disabled since now we have super long gameids, and we never use this anyways
                //React.createElement('span', { style: { marginRight: "10px" }}, parent.state.currentLobbyId),
                // todo: enable this line once we have accurate player count
                //React.createElement('span', {}, parent.state.clientVersion + ", " + this.state.count)//,
                // v5.00 we lost the ability to track total players so just hide it for now
                React.createElement('span', {}, parent.state.clientVersion)
                //React.createElement('span', { className: 'tooltiptext', style: { width: '140px' } },
                //    loc('client_version', 'Client Version') + ' ' + parent.state.clientVersion)
                // v8.05: POC
                //React.createElement('span', { style: { marginLeft: "10px" } }, parent.state.clockTime)
            )
        )
    }
})