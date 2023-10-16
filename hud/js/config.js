// Configurable menu items
// ==================================================================================

//import BracketsRender from "./brackets-render";
//import {createElement} from "lib/react/react-with-addons";

loadConfig = function () {
    Filler = React.createClass({
        propTypes: {
            index: React.PropTypes.number
        },
        render: function () {
            index = this.props.index
            return (
                React.createElement('div', {},
                    index === 0 && React.createElement('div', {},
                        "The original Legion TD went beyond our wildest dreams to become played by over a million people! "
                        + " It's now becoming a full-fledged game. The first ever competitive TD for PC."
                    ),
                    index === 1 && React.createElement('div', {},
                        "Legion TD 2 is an online free-to-play game that will be available on Steam. "
                        + "It's free-to-play, but not pay-to-win. It's the standalone successor to Legion TD, "
                        + "the hugely popular Warcraft III mod that became the inspiration for StarCraft II's Squadron TD "
                        + "and Dota 2's Legion TD: Reborn. "
                    ),
                    index === 2 && React.createElement('div', {},
                        "A Legion TD 2 match is played by two teams of four players on a symmetric playing field, "
                        + "each side consisting of four lanes and a throne room. Each player defends their own lane "
                        + "against waves of enemy creatures that threaten the team's king. The team whose king survives longer, "
                        + "wins. From start to finish, a match lasts about 25 minutes. "
                    ),
                    (index < 0 || index > 2) && React.createElement('div', {},
                        "Hire mercenaries. Spend mythium, a secondary resource, to hire mercenaries to attack the opposing team. "
                        + "Each mercenary you hire also permanently increases the gold income you receive at the end of each "
                        + "round. Mythium is passively harvested by workers. You can spend gold to train more workers at your "
                        + "Town."
                    )
                )
            )
        }
    })

    VideoOptions = React.createClass({
        componentDidMount: function () {
            //console.log("video options mounted --> ask client to load options")

            // Browser testing
            if (!isUnityHost)
                engine.trigger('loadOptions', testOptions)

            engine.call('LoadOptions')
        },
        render: function () {

            return (
                React.createElement('ul', { className: 'options-container' },
                    React.createElement('h1', { style: { color: "white" } }, loc('video_options', 'Video Options')),
                    React.createElement('p', {
                        style: { color: "#ffcc00" }
                    },
                        loc('right_click_to_restore_default', 'Right-click a value to restore to default')
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('display_mode', 'Display Mode')),
                        // v7.07 let's try enabling this always
                        React.createElement('div', { className: 'value dropdown' },
                            React.createElement(DropdownMenu, { field: 'DisplayMode' })
                        )
                        //!globalState.isInGame && React.createElement('div', { className: 'value dropdown' },
                        //    React.createElement(DropdownMenu, { field: 'DisplayMode' })
                        //),
                        //globalState.isInGame && React.createElement('div', { className: 'value' },
                        //    loc('cannot_change_setting_while_ingame', 'Cannot change while in-game')
                        //)
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('resolution', 'Resolution')),
                        // v7.07 let's try enabling this always
                        React.createElement('div', { className: 'value dropdown' },
                            React.createElement(DropdownMenu, { field: 'Resolution' })
                        )
                        // v8.03.10 changing resolution won't work in-game for 4K overrides, so let's just disalow again
                        //!globalState.isInGame && React.createElement('div', { className: 'value dropdown' },
                        //    React.createElement(DropdownMenu, { field: 'Resolution' })
                        //),
                        //globalState.isInGame && React.createElement('div', { className: 'value' },
                        //    loc('cannot_change_setting_while_ingame', 'Cannot change while in-game')
                        //)
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('graphics_quality', 'Graphics Quality')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(DropdownMenu, { field: 'GraphicsQuality' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('shadow_quality', 'Shadow Quality (Turn OFF to improve performance)')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(DropdownMenu, { field: 'ShadowQuality' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('confine_cursor_to_screen', 'Confine cursor to screen')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(DropdownMenu, { field: 'CursorLockMode' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('color_style', 'Color Style')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(DropdownMenu, { field: 'ColorStyle' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' },
                            loc('max_game_fps', 'Max Game FPS'),
                            React.createElement('div', { className: 'simple-tooltip' },
                                React.createElement('img', {
                                    src: 'hud/img/small-icons/help.png', style: {
                                        width: '16px',
                                        marginLeft: '8px'
                                    }
                                }),
                                React.createElement('span', { className: 'tooltiptext' },
                                    loc('option_is_experimental', 'This is an experimental option. Changing it from the defaults may have side effects.')
                                )
                            )
                        ),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'InGameFPS' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' },
                            loc('max_lobby_fps', 'Max Lobby FPS'),
                            React.createElement('div', { className: 'simple-tooltip' },
                                React.createElement('img', {
                                    src: 'hud/img/small-icons/help.png', style: {
                                        width: '16px',
                                        marginLeft: '8px'
                                    }
                                }),
                                React.createElement('span', { className: 'tooltiptext' },
                                    loc('option_is_experimental', 'This is an experimental option. Changing it from the defaults may have side effects.')
                                )
                            )
                        ),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'LobbyFPS' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('vertical_sync', 'Vertical Sync')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'VerticalSync' })
                        )
                    ),
                    // v10.05.1 silent hotfix, this setting is really glitchy, causing Boone Bug
                    // https://i.imgur.com/0N8OP5u.png
                    globalState.isMac && React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('enable_animated_background', 'Enable High Quality Videos')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'AnimatedBackground' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('enable_dissolve_effects', 'Enable Dissolve FX')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'EnableDissolveEffect' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('enable_seasonal_decorations', 'Enable Seasonal Decorations')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'EnableSeasonalDecorations' })
                        )
                    )
                    //React.createElement('li', {},
                    //    React.createElement('div', { className: 'description' }, loc('max_background_fps', 'Max Background FPS')),
                    //    React.createElement('div', { className: 'value' },
                    //        React.createElement(Slider, { field: 'BackgroundFPS' })
                    //    )
                    //),
                    //React.createElement('li', {},
                    //    React.createElement('div', { className: 'description' }, loc('enable_ingame_workers', 'Enable Ingame Workers (Turn OFF to improve performance)')),
                    //    React.createElement('div', { className: 'value' },
                    //        React.createElement(ToggleButton, { field: 'EnableIngameWorkers' })
                    //    )
                    //),
                    //React.createElement('li', {},
                    //    React.createElement('div', { className: 'description' }, loc('enable_high_quality_terrain', 'Enable High Quality Terrain (Turn OFF to improve performance)')),
                    //    React.createElement('div', { className: 'value' },
                    //        React.createElement(ToggleButton, { field: 'EnableHighQualityTerrain' })
                    //    )
                    //),
                    //React.createElement('li', {},
                    //    React.createElement('div', { className: 'description' }, loc('toggle_environment_assets', 'Toggle Environment Assets')),
                    //    React.createElement('div', { className: 'value' },
                    //        React.createElement(ToggleButton, { field: 'EnableDoodads' })
                    //    )
                    //),
                    //React.createElement('li', {},
                    //    React.createElement('div', { className: 'description' }, loc('toggle_environment_effects', 'Toggle Environment Effects (dust, etc.)')),
                    //    React.createElement('div', { className: 'value' },
                    //        React.createElement(ToggleButton, { field: 'EnableEnvironmentEffects' })
                    //    )
                    //)//,
                    //React.createElement('li', {},
                    //    React.createElement('div', { className: 'description' }, loc('enable_model_outlines', 'Enable Model Outlines (Turn OFF to improve performance)')),
                    //    React.createElement('div', { className: 'value' },
                    //        React.createElement(ToggleButton, { field: 'EnableModelOutlines' })
                    //    )
                    //)
                )
            )
        }
    })

    SoundOptions = React.createClass({
        render: function () {
            return (
                React.createElement('ul', { className: 'options-container' },
                    React.createElement('h1', { style: { color: "white" } }, loc('sound_options', 'Sound Options')),
                    React.createElement('p', {
                        style: { color: "#ffcc00" }
                    }, loc('right_click_to_restore_default', 'Right-click a value to restore to default')),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('master_volume', 'Master Volume')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'MasterVolume' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('sound_effects', 'Sound Effects')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'SoundEffects' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('music', 'Music')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'Music' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('special_music', 'Special Music')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'SpecialMusic' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('ui_sounds', 'UI Sounds')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'UISounds' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('mute_sound_on_minimize', 'Mute sound when minimized')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'MuteSoundOnMinimize' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('mute_insufficient_resources_alert', 'Mute insufficient resources alerts')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'MuteInsufficientResourceSounds' })
                        )
                    )
                )
            )
        }
    })

    ControlsOptions = React.createClass({
        getInitialState: function () {
            return {
                hotkeyFields: []
            }
        },
        componentWillMount: function () {
            parent = this
            bindings.refreshHotkeyList = function (hotkeyFieldsList) {
                parent.setState({ hotkeyFields: hotkeyFieldsList })
            }

            if (!isUnityHost)
                engine.trigger('refreshHotkeyList', testHotkeysList)
        },
        render: function () {
            parent = this
            return (
                React.createElement('ul', { className: 'options-container' },
                    React.createElement('h1', { style: { color: "white" } }, loc('adjust_controls', 'Adjust Controls')),
                    React.createElement('p', {
                        style: { color: "#ffcc00" }
                    }, loc('right_click_to_unbind', "Right-click to unbind")),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, "(" + loc('restore_defaults', 'Restore Defaults') + ")"),
                        React.createElement('div', {
                            className: 'button value',
                            onClick: function () { engine.call('RestoreDefaultHotkeys') }
                        }, loc('restore_all_defaults_button', 'Click to restore all defaults'))
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('clear_all_hotkeys', "(Clear All Hotkeys)")),
                        React.createElement('div', {
                            className: 'button value',
                            onClick: function () { engine.call('ClearAllHotkeys') }
                        }, loc('clear_all_hotkeys_button', 'Click to clear all hotkeys'))
                    ),
                    parent.state.hotkeyFields.map(function (item) {
                        locFieldName = convertDisplayNameToApexId(item.description)
                        return React.createElement('li', {},
                            React.createElement('div', { className: 'description' }, loc(locFieldName, item.description)),
                            React.createElement('div', { className: 'value' },
                                React.createElement(Hotkey, { field: item.field })
                            )
                        )
                    })
                )
            )
        }
    })

    SocialOptions = React.createClass({
        render: function () {
            return (
                React.createElement('ul', { className: 'options-container' },
                    React.createElement('h1', { style: { color: "white" } }, loc('social_options', 'Social Options')),
                    React.createElement('p', {
                        style: { color: "#ffcc00" }
                    }, loc('right_click_to_restore_default', 'Right-click a value to restore to default')),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('allow_game_chat_from', 'Allow game chat from')),
                        React.createElement('div', { className: 'value dropdown' },
                            React.createElement(DropdownMenu, { field: 'AllowChatFrom' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('allow_pings_from', 'Allow pings from')),
                        React.createElement('div', { className: 'value dropdown' },
                            React.createElement(DropdownMenu, { field: 'AllowPingsFrom' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', {
                            className: 'description',
                            dangerouslySetInnerHTML: {
                                __html: loc('show_in_ping_wheel', 'Show ' + '<img class="tooltip-icon" src="hud/img/emotes/smiley.png">' + ' button in ping wheel', ['<img class="tooltip-icon" src="hud/img/emotes/smiley.png">'])
                            }
                        }),
                        React.createElement('div', { className: 'value dropdown' },
                            React.createElement(ToggleButton, { field: 'ShowEmoteButtonInPingWheel' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', {
                            className: 'description',
                            dangerouslySetInnerHTML: {
                                __html: loc('show_in_ping_wheel', 'Show ' + '<img class="tooltip-icon" src="hud/img/smartping/thinking.png">' + ' button in ping wheel', ['<img class="tooltip-icon" src="hud/img/smartping/thinking.png">'])
                            }
                        }),
                        React.createElement('div', { className: 'value dropdown' },
                            React.createElement(ToggleButton, { field: 'ShowThinkingButtonInPingWheel' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', {
                            className: 'description',
                            dangerouslySetInnerHTML: {
                                __html: loc('show_in_ping_wheel', 'Show ' + '<img class="tooltip-icon" src="hud/img/smartping/save.png">' + ' button in ping wheel', ['<img class="tooltip-icon" src="hud/img/smartping/save.png">'])
                            }
                        }),
                        React.createElement('div', { className: 'value dropdown' },
                            React.createElement(ToggleButton, { field: 'ShowSaveButtonInPingWheel' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', {
                            className: 'description',
                            dangerouslySetInnerHTML: {
                                __html: loc('show_in_ping_wheel', 'Show ' + '<img class="tooltip-icon" src="hud/img/smartping/unsure.png">' + ' button in ping wheel', ['<img class="tooltip-icon" src="hud/img/smartping/unsure.png">'])
                            }
                        }),
                        React.createElement('div', { className: 'value dropdown' },
                            React.createElement(ToggleButton, { field: 'ShowUnsureButtonInPingWheel' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', {
                            className: 'description',
                            dangerouslySetInnerHTML: {
                                __html: loc('show_in_ping_wheel', 'Show ' + '<img class="tooltip-icon" src="hud/img/emotes/thumbs_up.png">' + ' button in ping wheel', ['<img class="tooltip-icon" src="hud/img/emotes/thumbs_up.png">'])
                            }
                        }),
                        React.createElement('div', { className: 'value dropdown' },
                            React.createElement(ToggleButton, { field: 'ShowThumbsUpButtonInPingWheel' })
                        )
                    ),
                    // Deprecated in v6.00
                    //React.createElement('li', {},
                    //    React.createElement('div', { className: 'description' }, loc('allow_pings_from_muted_players', 'Allow pings from muted players')),
                    //    React.createElement('div', { className: 'value dropdown' },
                    //        React.createElement(DropdownMenu, { field: 'AllowPingsFromMutedPlayers' })
                    //    )
                    //),
                    // Deprecated in v9.03
                    //React.createElement('li', {},
                    //    React.createElement('div', { className: 'description' }, loc('enable_global_chat', 'Enable Global Chat')),
                    //    React.createElement('div', { className: 'value dropdown' },
                    //        React.createElement(ToggleButton, { field: 'GlobalChatEnable' })
                    //    )
                    //),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('notify_when_friend_online', 'Notifications when friends come online')),
                        React.createElement('div', { className: 'value ' },
                            React.createElement(ToggleButton, { field: 'NotifyWhenFriendComesOnline' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('receive_whispers_from', 'Receive whispers from')),
                        React.createElement('div', { className: 'value dropdown' },
                            React.createElement(DropdownMenu, { field: 'ReceiveWhispersFrom' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('receive_party_invites_from', 'Receive party invites from')),
                        React.createElement('div', { className: 'value dropdown' },
                            React.createElement(DropdownMenu, { field: 'ReceivePartyInvitesFrom' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('receive_friend_requests', 'Receive friend requests')),
                        React.createElement('div', { className: 'value ' },
                            React.createElement(ToggleButton, { field: 'ReceiveFriendRequests' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('show_whispers_in_chat', 'Show whispers in chat')),
                        React.createElement('div', { className: 'value ' },
                            React.createElement(ToggleButton, { field: 'ShowWhispers' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('hide_from_friends_list', "Hide yourself from your friends' friends lists")),
                        React.createElement('div', { className: 'value ' },
                            React.createElement(ToggleButton, { field: 'HideFromFriendsList' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('chat_auto_fill_option', 'Keep /p and /g in chat after sending a message')),
                        React.createElement('div', { className: 'value ' },
                            React.createElement(ToggleButton, { field: 'ChatAutoFill' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('allow_emotes_from', 'Allow emotes from')),
                        React.createElement('div', { className: 'value ' },
                            React.createElement(ToggleButton, { field: 'ReceiveEmotesFrom' })
                        )
                    ),
                    globalState.emoteChooserItems.map(function (item, index) {
                        filename = item.image.replace(/^.*[\\\/]/, '')
                        //console.log('emoji filename: ' + filename)
                        return React.createElement('li', {},
                            React.createElement('div', {
                                className: 'description'
                            },
                                React.createElement('img', { style: { height: '24px' }, src: 'hud/img/' + item.image })//,
                                //' ' + loc('enabled', 'Enabled')
                            ),
                            React.createElement('div', {
                                className: 'value',
                                style: {
                                    width: '100px',
                                    marginLeft: '-400px'
                                }
                            },
                                React.createElement(ToggleButton, { field: 'EmoteEnabled/' + filename })
                            ),
                            React.createElement('div', {
                                className: 'value',
                                style: {
                                    width: '100px',
                                    marginLeft: '300px'
                                }
                            },
                                React.createElement(DropdownMenu, { field: 'EmoteAnimation/' + filename })
                            )
                        )
                    })//,
                    //globalState.emoteChooserItems.map(function (item, index) {
                    //    var filename = item.image.replace(/^.*[\\\/]/, '')
                    //    //console.log('emoji filename: ' + filename)
                    //    return React.createElement('li', {},
                    //        React.createElement('div', { className: 'description' },
                    //            React.createElement('img', { style: { height: '24px' }, src: 'hud/img/' + item.image }),
                    //            ' ' + locName('animation', 'Animation')
                    //        ),
                    //        React.createElement('div', { className: 'value ' },
                    //            React.createElement(DropdownMenu, { field: 'EmoteAnimation/' + filename })
                    //        )
                    //    )
                    //})
                )
            )
        }
    })

    GameCoachOptions = React.createClass({
        render: function () {
            return (
                React.createElement('ul', { className: 'options-container' },
                    React.createElement('h1', { style: { color: "white" } }, loc('game_coach_options', 'Game Coach Options')),
                    React.createElement('p', {
                        style: { color: "#ffcc00" }
                    }, loc('right_click_to_restore_default', 'Right-click a value to restore to default')),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('game_coach_enable_post_game_tips', 'Enable post-game tips')),
                        React.createElement('div', { className: 'value ' },
                            React.createElement(ToggleButton, { field: 'GameCoachPostgameTipsEnabled' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('game_coach_enable_in_game_tips', 'Enable in-game tips')),
                        React.createElement('div', { className: 'value ' },
                            React.createElement(ToggleButton, { field: 'GameCoachIngameTipsEnabled' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('game_coach_enable_in_game_reactions', 'Enable in-game reactions')),
                        React.createElement('div', { className: 'value ' },
                            React.createElement(ToggleButton, { field: 'GameCoachIngameReactionsEnabled' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('game_coach_enable_in_game_sounds', 'Enable in-game sounds')),
                        React.createElement('div', { className: 'value ' },
                            React.createElement(ToggleButton, { field: 'GameCoachIngameSoundsEnabled' })
                        )
                    )
                )
            )
        }
    })

    InterfaceOptions = React.createClass({
        render: function () {
            return (
                React.createElement('ul', { className: 'options-container' },
                    React.createElement('h1', { style: { color: "white" } }, loc('interface_options', 'Interface Options')),
                    React.createElement('p', {
                        style: { color: "#ffcc00" }
                    }, loc('right_click_to_restore_default', 'Right-click a value to restore to default')),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('restore_default_hud_layout', 'Restore default HUD layout')),
                        React.createElement('div', {
                            className: 'button value',
                            onClick: function () {
                                engine.trigger('resetDefaultLayout')
                            }
                        }, loc('restore_hud_layout', "Click to restore"))
                    ),
                    //React.createElement('li', {},
                    //    React.createElement('div', { className: 'description' }, loc('enable_show_game_coach', 'Show Game Coach')),
                    //    React.createElement('div', { className: 'value' },
                    //        React.createElement(ToggleButton, { field: 'ShowGameCoach' })
                    //    )
                    //),
                    //React.createElement('li', {},
                    //    React.createElement('div', {
                    //        className: 'description',
                    //        dangerouslySetInnerHTML: {
                    //            __html: loc('automatically_show_game_coach_tips', 'Automatically Show Game Coach Tips')
                    //        }
                    //    }),
                    //    React.createElement('div', { className: 'value' },
                    //        React.createElement(ToggleButton, { field: 'AutoshowGameCoachTips' })
                    //    )
                    //),
                    // v8.00: Managed via Store
                    //React.createElement('li', {},
                    //    React.createElement('div', { className: 'description' }, loc('clientbg', 'Client Background')),
                    //    React.createElement('div', { className: 'value' },
                    //        React.createElement(DropdownMenu, { field: 'ClientBackground' })
                    //    )
                    //),
                    // v8.01: moved to Video options
                    //React.createElement('li', {},
                    //    React.createElement('div', { className: 'description' }, loc('enable_animated_background', 'Enable Animated Client Background')),
                    //    React.createElement('div', { className: 'value' },
                    //        React.createElement(ToggleButton, { field: 'AnimatedBackground' })
                    //    )
                    //),

                    // todo: reenable in future if we can get it stable
                    //globalState.currentPatchBetaFeaturesEnabled && React.createElement('li', {},
                    //    React.createElement('div', { className: 'description' }, loc('auto_accept_match_found', 'Enable Match Found Confirmation')),
                    //    React.createElement('div', { className: 'value' },
                    //        React.createElement(ToggleButton, { field: 'AutoAcceptMatchFound' })
                    //    )
                    //),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('show_quests', 'Show Quests')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'ShowQuests' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('unit_tooltip_style', 'Unit Tooltip Style')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(DropdownMenu, { field: 'UnitTooltipStyle' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('window_focus_grabbing', 'Window Focus Grabbing')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(DropdownMenu, { field: 'WindowFocusGrabbing' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('enable_deploy_grid_position_text', 'Enable Deploy Grid Position Text')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'ShowDeployGridPosition' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('health_bar_visibility', 'Health Bar Visibility')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(DropdownMenu, { field: 'HealthBarVisibility' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('health_bar_size', 'Health Bar Size')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'HealthBarSize' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('enable_health_bar_segments', 'Enable Health Bar Segments')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'HealthBarSegments' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('show_battle_texts', 'Show Battle Texts')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'ShowBattleTexts' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('max_zoom', 'Max Zoom')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'MaxZoom' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('minimap_scale', 'Minimap Scale')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'MinimapScale' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' },
                            loc('enable_4k_ui_scaling', 'Enable 4K UI Scaling'),
                            React.createElement('div', { className: 'simple-tooltip' },
                                React.createElement('img', {
                                    src: 'hud/img/icons/Caution.png', style: {
                                        width: '16px',
                                        marginLeft: '8px'
                                    }
                                }),
                                React.createElement('span', { className: 'tooltiptext' },
                                    loc('only_applies_to_4k', 'Only applies to 3840x2160 (4K) resolution.')
                                )
                            )
                        ),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'UIScale4K' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' },
                            loc('ui_scaling', 'UI Scaling (Experimental)'),
                            React.createElement('div', { className: 'simple-tooltip' },
                                React.createElement('img', {
                                    src: 'hud/img/icons/Warning.png', style: {
                                        width: '16px',
                                        marginLeft: '8px'
                                    }
                                }),
                                React.createElement('span', { className: 'tooltiptext' },
                                    loc('option_is_experimental', 'This is an experimental option. Changing it from the defaults may have side effects.')
                                )
                            )
                        ),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'UIScaleV2' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('screen_edges_pan_camera', 'Screen Edges Pan Camera')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'ScreenEdgePanCamera' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('enable_advanced_camera', 'Enable Advanced Camera (Turn off to improve performance)')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'EnableAdvancedCamera' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('camera_pan_sensitivity_arrow_keys', 'Camera Pan Sensitivity - Arrow Keys')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'CameraPanSensitivity' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('camera_pan_sensitivity_mouse', 'Camera Pan Sensitivity - Mouse')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'CameraMouseSensitivity' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('camera_zoom_sensitivity', 'Camera Zoom Sensitivity')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'CameraZoomSensitivity' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('camera_rotation_sensitivity', 'Camera Rotation Sensitivity')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(Slider, { field: 'CameraRotationSensitivity' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('camera_smoothing', 'Camera Smoothing')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'CameraSmoothing' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('save_screenshots_to_desktop', 'Save Screenshots To Desktop')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'SaveScreenshotsToDesktop' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('enable_show_all_ratings', 'Show All Rating Changes')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'ShowAllRatingChanges' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('enable_confirm_sell', 'Enable sell confirmation popup')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'EnableConfirmSell' })
                        )
                    ),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('enable_legion_spell_hotkeys', 'Enable Legion Spell Hotkeys')),
                        React.createElement('div', { className: 'value' },
                            React.createElement(ToggleButton, { field: 'EnableLegionSpellHotkeys' })
                        )
                    )
                )
            )
        }
    })

    SystemOptions = React.createClass({
        render: function () {
            return (
                React.createElement('ul', { className: 'options-container' },
                    React.createElement('h1', { style: { color: "white" } }, loc('language', 'Language')),
                    //React.createElement('h1', { style: { color: "white" } }, loc('system_options', 'System Options')),
                    React.createElement('p', {
                        style: { color: "#ff8800" },
                        dangerouslySetInnerHTML: {
                            __html: linkify(loc('help_translate_the_game', 'Help translate the game at http://legiontd2.com/translate'))
                        }
                    }),
                    React.createElement('li', {},
                        React.createElement('div', { className: 'description' }, loc('language', 'Language')),
                        React.createElement('div', { className: 'value dropdown' },
                            React.createElement(DropdownMenu, { field: 'Language' })
                        )
                    )
                )
            )
        }
    })

    // Menus
    // ==================================================================================

    menuUUID = 0
    gatewayMenu = [
        //{ key: menuUUID++, menuId: menuUUID, name: "Play Alpha", huge: true, behavior: function () { engine.trigger('alpha') } },
        //{ key: menuUUID++, menuId: menuUUID, name: "Singleplayer", huge: true, behavior: function () { engine.trigger('singlePlayer') } },
        //{ key: menuUUID++, menuId: menuUUID, name: "Options", huge: true, },
        //{ key: menuUUID++, menuId: menuUUID, name: "Quit", huge: true, behavior: function () { engine.trigger('loadPopup', 'exit') } }
    ]

    getLauncherMenu = function () {
        console.log('getLauncherMenu, guildsEnabled: ' + globalState.shopEnabled + ', globalState.level: ' + globalState.level)

        shopDisabledTooltip = ''
        if (!globalState.shopEnabled)
            shopDisabledTooltip = loc('feature_disabled', 'This feature is disabled')
        //if (globalState.freeAccount)
        //    shopDisabledTooltip = loc('requires_paid_account', 'Requires paid account')

        var multiplayerDisabled = globalState.level === 1
        var soloAndCoopRecommended = globalState.level === 2
        var soloAndCoopDisabled = globalState.level === 1
        var shopDisabled = shopDisabledTooltip.length > 0
        var learnDisabled = globalState.level === 1
        var tournamentDisabled = globalState.tournamentEnabled === false

        var widerPatchNotes = globalState.screenWidth === 2560 && globalState.screenHeight === 1440

        return [
            !multiplayerDisabled && {
                key: menuUUID++, menuId: menuUUID, name: "play", displayName: loc('multiplayer', 'Multiplayer'), huge: true, disabled: globalState.searchingForMatch,
                smallText: React.createElement(ClientModifiers, { modifiers: globalState.clientModifiers })
            },
            !soloAndCoopDisabled && soloAndCoopRecommended && {
                key: menuUUID++, menuId: menuUUID, name: "training", displayName: loc('solo_and_coop', 'Solo & Co-op'), huge: true, disabled: globalState.searchingForMatch,
                smallText: React.createElement('span', { className: 'smallText label' }, loc('recommended', 'Recommended!'))
            },
            !soloAndCoopDisabled && !soloAndCoopRecommended && {
                key: menuUUID++, menuId: menuUUID, name: "training", displayName: loc('solo_and_coop', 'Solo & Co-op'), huge: true, disabled: globalState.searchingForMatch,
                smallText: globalState.hasNewChallenge && React.createElement('span', { className: 'smallText label' }, loc('new_challenge', 'New Challenge!'))
            },
            !soloAndCoopDisabled && !multiplayerDisabled && !tournamentDisabled && {
                key: menuUUID++, menuId: menuUUID, name: "tournament", displayName: globalState.tournamentNova, huge: true, disabled: globalState.searchingForMatch,
                smallText: globalState.tournamentSubtitle && React.createElement('span', { className: 'smallText label' }, globalState.tournamentSubtitle)
            },
            globalState.level === 1 && { key: menuUUID++, menuId: menuUUID, name: "tutorial", displayName: loc('tutorial', 'Tutorial'), huge: true, behavior: function () { engine.trigger('loadView', 'tutorial') } },
            globalState.learnMenuEnabled && !learnDisabled && { key: menuUUID++, menuId: menuUUID, name: "learn", huge: false, disabled: false, displayName: loc('learn', 'Learn'), behavior: function () { engine.trigger('loadView', 'learn') } },
            { key: menuUUID++, menuId: menuUUID, name: "profile", huge: false, disabled: false, displayName: loc('profile', 'Profile'), smallText: globalState.hasNewItems && React.createElement('span', { className: 'smallText label' }, loc('new_item', 'New!')), behavior: function () { engine.trigger('loadView', 'myprofile') } },
            !multiplayerDisabled && { key: menuUUID++, menuId: menuUUID, name: "leaderboards", displayName: loc('leaderboards', 'Leaderboards'), huge: false, disabled: false },
            globalState.level !== 1 && {
                key: menuUUID++, menuId: menuUUID, name: "store", displayName: loc('store', 'Shop'), disabled: shopDisabled, huge: false, tooltip: shopDisabledTooltip,
                smallText: globalState.novaBoostActive && React.createElement('span', { className: 'smallText label' }, locName('nova_boost', 'Nova Boost!'))
            },
            globalState.level !== 1 && {
                key: menuUUID++, menuId: menuUUID, name: "guild", displayName: loc('guild', 'Guild'), disabled: !globalState.shopEnabled, behavior: function () {
                    if (globalState.refreshMyGuildVitalsCalledYet) {
                        loadMyGuildProfile()
                    } else {
                        engine.call('OnLoadMyGuildProfileAfterGuildVitalsRefreshed')
                        console.log('clicked guild button, but we have not yet loaded our guild --> queue up')
                    }
                },
                tooltip: shopDisabledTooltip,
                smallText: React.createElement('span', {},
                    globalState.hasNewGuildInvites && React.createElement('span', { className: 'smallText label' }, loc('new_application', 'New Application!'))
                    // Can add new stuff here if we wanted
                )
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "", displayName: "", huge: false, smallText:
                    React.createElement('div', {
                        style: {
                            backgroundColor: 'rgba(16, 23, 24, 0.5)',
                            border: '1px solid black',
                            marginBottom: '12px',
                            marginTop: '16px',
                            fontSize: '0',
                        }
                    },
                        React.createElement('div', {
                            className: 'patch-image',
                            style: {
                                backgroundImage: 'url("' + globalState.patchNotesImage + '")',
                                //backgroundSize: 'contain',
                                height: '144px',
                                width: '256px',
                                display: 'inline-block',
                            }
                        }),
                        React.createElement('div', {
                            className: 'patch-summary smallText', style: {
                                float: 'right',
                                width: widerPatchNotes ? '315px' : '280px',
                            }
                        },
                            globalState.hasNewPatchNotes && React.createElement('span', {
                                className: 'smallText em', style: { padding: '0 4px 0 0' }
                            }, loc('new_item', 'New!')),
                            React.createElement('span', {
                                style: {
                                    whiteSpace: 'nowrap'
                                }
                            },
                                React.createElement('span', {
                                    dangerouslySetInnerHTML: {
                                        __html: globalState.versionNumber
                                    }
                                }),
                                React.createElement('img', { src: 'hud/img/small-icons/external-link.png', style: { marginLeft: '8px' } })
                            ),
                            React.createElement('div', { className: 'patch-date', style: { fontSize: '0.75rem', color: 'rgb(160, 160, 160)' } },
                                React.createElement('span', { dangerouslySetInnerHTML: { __html: globalState.patchNotesDate }})
                            ),
                            shouldShowPatchNotes() && React.createElement('div', { className: 'paragraphText', style: { display: '', marginTop: '4px' } },
                                React.createElement('span', { dangerouslySetInnerHTML: { __html: globalState.patchNotesDescription } })
                            ),
                            !shouldShowPatchNotes() && React.createElement('div', { className: 'paragraphText', style: { display: '' } }, loc('patch_notes_placeholder', "View full Patch Notes (English only)"))
                        )
                    ),
                behavior: function () { engine.call("OnShowPatchNotes") }
            }
        ]
    }

    menuUUID = 0
    getInGameMenu = function () {
        result = []

        if (isPauseEnabled()) {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: "pause", displayName: loc('pause_game', 'Pause/Unpause'), disabled: false, behavior: function () {
                    console.log("click pause/unpause")
                    engine.trigger('escape')
                    engine.call('OnTogglePauseGame')
                }
            })
        }

        isCampaign = globalState.missionId !== '' && !_.startsWith(globalState.missionId, 'tutorial')

        // v8.04 later can enable for other modes, maybe. Although campaign seems to be the main use-case, since it's more like a puzzle
        // whereas Play vs. AI you kinda wanna simulate a real game (and get essence, etc anyways)

        if (globalState.matchmakerQueue === 'Custom' && isCampaign) {
            
            if (globalState.gameTimeElapsedSeconds >= 1200) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: "restart", displayName: loc('restart_available_before_minutes', 'Restart available before 20 minutes'), disabled: true, extraClasses: 'restart-button-disabled', behavior: function () { }
                })
            }
            else if (globalState.waveNumber >= 21) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: "restart", displayName: loc('restart_available_before_wave', 'Restart available before wave 21'), disabled: true, extraClasses: 'restart-button-disabled', behavior: function () { }
                })
            } else if (globalState.waveNumber === 1) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: "restart", displayName: loc('restart_available_after_wave', 'Restart available after wave 1'), disabled: true, extraClasses: 'restart-button-disabled', behavior: function () { }
                })
            } else {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: "restart", displayName: loc('restart', 'Restart'), disabled: false, extraClasses: 'restart-button', behavior: function () {
                        console.log("click restart")
                        engine.trigger('escape')
                        engine.call('OnClickRestart')
                    }
                })
            }
        }

        if (!globalState.challengeMode) {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: "ff", displayName: loc('surrender', 'Surrender'), disabled: false, extraClasses: 'ff-button', behavior: function () {
                    console.log("click surrender")
                    engine.trigger('escape')
                    engine.call('OnClickSurrender')
                }
            })
        }
        // v9.05: I don't think this is necessary and it takes up so much valuable room. People can still use tab scoreboard to check their profile.
        //result.push({ key: menuUUID++, menuId: menuUUID, name: "profile", displayName: loc('profile', 'Profile'), disabled: false, behavior: function () { engine.trigger('loadView', 'myprofile') } })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "codex", displayName: loc('codex', 'Codex'), disabled: false, behavior: function () {
                engine.trigger('loadView', 'codex')
                //engine.trigger('selectSubmenu', 6)
            }
        })
        result.push({ key: menuUUID++, menuId: menuUUID, name: "options", displayName: loc('options', 'Options'), disabled: false })
        result.push({
            key: menuUUID++, menuId: menuUUID, name: "Quit", displayName: loc('quit', 'Quit'), behavior: function () {
                if (globalState.hasEnemyHumans && !globalState.isSpectatorMode)
                    engine.trigger('loadPopup', 'quitpvp')
                else
                    engine.trigger('loadPopup', 'quit')
            }
        })
        result.push({ key: menuUUID++, menuId: menuUUID, name: "Return to game", displayName: loc('return_to_game', 'Return to game'), behavior: function () { engine.trigger('escape') } })

        return result
    }

    // new play menu
    getPlayMenu = function () {
        menuUUID = 0
        result = []

        var normalQueueDisabledTooltip = ""
        if (globalState.level < 2 && !globalState.disablePracticeGames)
            normalQueueDisabledTooltip = loc('ranked_matches_requirement',
                "Ranked matches require level 2. Play the Campaign or Play vs. AI to level up.")
        if (globalState.publicTestRealm && !globalState.directConnectionEnabled && !globalState.isTestAccount)
            normalQueueDisabledTooltip = loc('disabled_on_ptr', "Disabled on PTR")
        if (!globalState.matchmakingEnabled)
            normalQueueDisabledTooltip = "Matchmaking is temporarily disabled"
        if (globalState.rankedDisabledMessage)
            normalQueueDisabledTooltip = globalState.rankedDisabledMessage;

        console.log('classicEnabled: ' + globalState.classicEnabled + " rankedDisabledMessage " + globalState.rankedDisabledMessage + " normalQueueDisabledTooltip " + normalQueueDisabledTooltip);

        var normalIcons = []
        if (globalState.guildWarActive) {
            normalIcons.push('hud/img/icons/GuildWarMode.png')
        }

        var showRankedRecommendedTooltip = globalState.level >= 4 && globalState.level <= 5
        var showMatchmadeCautionTooltip = globalState.level >= 2 && globalState.level <= 3

        // Smelly name, this should be called rankedEnabled I think
        if (globalState.classicEnabled) {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: "Ranked",
                displayName: loc('ranked_queue', 'Ranked'),
                description: loc('ranked_queue_long', '2v2 mastermind-only, match against similarly skilled players.'),
                image: "play/Ranked.png", content: null, disabled: normalQueueDisabledTooltip !== "",
                disabledTooltip: normalQueueDisabledTooltip,
                behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'normal') },
                attachedIcons: normalIcons,
                attachedLinkText: loc('ranked_faq_title', 'Ranked FAQ'),
                attachedLinkAction: function () {
                    showFullScreenPopup(getRankedFAQ(), false)
                },
                greenTooltip: !showRankedRecommendedTooltip ? '' : loc('ranked_recommended_new_player', 'This is the recommended way to play, even if you are new! You will be matched with players near your skill level.'),
                greenTooltipTitle: !showRankedRecommendedTooltip ? '' : loc('recommended', 'Recommended!'),
                yellowTooltip: !showMatchmadeCautionTooltip ? '' : loc('matchmade_caution_new_player', 'It is recommended to play the Campaign or practice against AI before entering Multiplayer.'),
                yellowTooltipTitle: !showMatchmadeCautionTooltip ? '' : loc('caution', 'Caution')
            })
        } else {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: "Normal",
                displayName: loc('normal_queue', 'Normal'),
                description: loc('normal_queue_long', 'Match against players of all skill levels. No rating changes.'),
                image: "play/Ranked.png", content: null, disabled: normalQueueDisabledTooltip !== "",
                disabledTooltip: normalQueueDisabledTooltip,
                behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'normal') }
            })
        }

        var classicQueueDisabledTooltip = ""

        if (globalState.publicTestRealm && !globalState.directConnectionEnabled && !globalState.isTestAccount)
            classicQueueDisabledTooltip = loc('disabled_on_ptr', "Disabled on PTR")

        if (globalState.level < 3)
            classicQueueDisabledTooltip = loc('classic_matches_requirement',
                "Classic matches require level 3. Play the Campaign or Play vs. AI to level up.")

        if (!globalState.classicEnabled)
            classicQueueDisabledTooltip = loc('temporarily_disabled', "Classic queue is temporarily disabled", [loc('classic_queue', 'Classic Queue')])

        var classicIcons = []
        if (globalState.guildWarActive) {
            classicIcons.push('hud/img/icons/GuildWarMode.png')
        }

        var classicExtraDescription = ''

        // v10.02 no longer display gold rush, since it's default
        //if (globalState.goldRushEnabledUntilTicks > 0) {
        //    classicIcons.push('hud/img/icons/GoldRush.png')

        //    var goldRushHours = 0
        //    var ticks = ((new Date().getTime() * 10000) + 621355968000000000);
        //    goldRushHours = (globalState.goldRushEnabledUntilTicks - ticks) / (10000 * 1000 * 60 * 60)

        //    console.log("ticks: " + ticks)
        //    console.log("goldRushEnabledUntilTicks: " + globalState.goldRushEnabledUntilTicks)
        //    console.log("goldRushHours: " + goldRushHours)

        //    // v10.00 let's not display this anymore now that gold rush is the default mode
        //    //classicExtraDescription = "<br/> " + '<span style="color: #ffcc00">' + locName('gold_rush', 'GOLD RUSH!') + '</span>'
        //    //    + "<br/>" + loc('hours_remaining', '<span style="color: #ff8800">' + goldRushHours.toFixed(1) + ' hours remaining</span>', [goldRushHours.toFixed(1)])
        //}

        if (globalState.hotModeIndex !== -1) {
            classicIcons.push('hud/img/icons/ClassicModes/' + globalState.hotModeIndex + '.png')

            classicExtraDescription = "<br/> " + '<span style="color: #ffcc00">'
                + '<img src="hud/img/small-icons/fire.png" />'
                + locName('hot_mode', "Hot Mode") + ': '
                + locName('classic_special_mode_' + globalState.hotModeIndex, 'Super Fiesta') + '</span>'
        }

        console.log('classicQueueDisabledTooltip: ' + classicQueueDisabledTooltip)

        // Pre-v10.00
        //var classicWarningTooltip = !showMatchmadeCautionTooltip ? '' : loc('matchmade_caution_new_player', 'It is recommended to play the Campaign or practice against AI before entering Multiplayer.')

        // v10.00 more aggressively dissuade people from Classic
        var classicWarningTooltip = !showMatchmadeCautionTooltip && !showRankedRecommendedTooltip ? '' : loc('classic_matchmaking_caution_new_player', 'Classic is not recommended for new players. You will match with veteran players.<br><br>Consider playing Ranked, which will give you much fairer matches.')

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "Classic",
            displayName: loc('classic_queue', 'Classic'),
            description: loc('classic_queue_long', '4v4 vs. players of all skill levels.<br>Party up to 8 players.') + classicExtraDescription,
            //+ ' <span style="color: #8ff110; text-transform: uppercase">' + loc('new_item', 'New!') + '</span>',
            image: "play/Classic.png", content: null, disabled: classicQueueDisabledTooltip !== "",
            disabledTooltip: classicQueueDisabledTooltip,
            //yellowTooltip: classicWarningTooltip ,
            //yellowTooltipTitle: classicWarningTooltip == '' ? '' : loc('caution', 'Caution'),
            redTooltip: classicWarningTooltip ,
            redTooltipTitle: classicWarningTooltip === '' ? '' : loc('warning', 'Warning'),
            attachedIcons: classicIcons,
            behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'classic') }
        })

        if (globalState.level >= 3 && globalState.arcadeMode && globalState.arcadeMode.length > 0) {
            var hours = 0
            if (globalState.arcadeModeEnabledUntilTicks) {
                var ticks = ((new Date().getTime() * 10000) + 621355968000000000);
                hours = (globalState.arcadeModeEnabledUntilTicks - ticks) / (10000 * 1000 * 60 * 60)

                console.log("ticks: " + ticks)
                console.log("arcadeModeEnabledUntilTicks: " + globalState.arcadeModeEnabledUntilTicks)
                console.log("hours: " + hours)
            }

            //console.log('globalState.arcadeMode: ' + globalState.arcadeMode)
            var modeDescription = loc('arcade_queue_long', "Special modes:")
            var modeTooltip = ''
            var modeIcons = []
            var modeIconsHtml = ''
            globalState.arcadeMode.forEach(function (mode) {
                //console.log('looking at mode: ' + mode)
                modeDescription += " " + locName('arcade_queue_' + mode.toLowerCase(), mode) + ","
                modeTooltip += '<img src="' + icons[mode.toLowerCase()] + '" class="tooltip-icon"> '
                modeTooltip += loc('arcade_queue_' + mode.toLowerCase(), "Hybrid Mode: To build a tower, you pick a tier. A fighter is then randomly selected from that tier!") + "<br/>"
                modeIcons.push(icons[mode.toLowerCase()])
            })
            modeDescription = modeDescription.replace(/,\s*$/, ""); // Remove last comma
            modeTooltip = modeTooltip.replace(/,\s*$/, ""); // Remove last comma

            result.push({
                key: menuUUID++, menuId: menuUUID, name: "Arcade",
                displayName: loc('arcade_queue', 'Featured'),
                description: modeDescription + '<br/>' + loc('no_rating_change', 'No rating changes.')//+ modeIconsHtml
                    + "<br/> " + loc('hours_remaining', '<span style="color: #ff8800">' + hours.toFixed(1) + ' hours remaining</span>', [hours.toFixed(1)]),
                image: "play/Featured.png", content: null, disabled: false,
                attachedIcons: modeIcons,
                disabledTooltip: "",
                yellowTooltip: !showMatchmadeCautionTooltip ? '' : loc('matchmade_caution_new_player', 'It is recommended to play the Campaign or practice against AI before entering Multiplayer.'),
                yellowTooltipTitle: !showMatchmadeCautionTooltip ? '' : loc('caution', 'Caution'),
                // Pre-v8.06: OLD featured mode one-click queue
                //behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'arcade') },
                // v8.06: New Featured Mode window
                behavior: function () { engine.trigger('loadView', 'featuredmode'); },
                tooltip: modeTooltip,
                tooltipTitle: ' '//loc('how_to_play', 'How to play')
            })
        }

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "Custom",
            disabled: !globalState.matchmakingEnabled || globalState.disablePracticeGames,
            disabledTooltip: "",
            displayName: loc('custom_queue', 'Custom'),
            description: loc('custom_queue_long', 'Create or join a custom game.'),
            image: "play/Custom.png", content: null, behavior: function () { engine.trigger('loadView', 'browser'); }
        })

        if (globalState.queue1v1Enabled) {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: "1v1",
                disabled: !globalState.matchmakingEnabled || globalState.disablePracticeGames,
                disabledTooltip: "",
                displayName: "1v1 Test",
                description: "Local test queue",
                image: "legionselect/Mastermind1.png",
                content: null,
                behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'test1v1'); }
            })
        }

        return result
    }

    menuUUID = 0
    getTrainingPlayMenu = function () {

        // todo: deprecate casualQueueDisabledTooltip - we don't have casual queue anymore, just Classic
        var casualQueueDisabledTooltip = ""
        var classicQueueDisabledTooltip = ""
        if (globalState.level < 2 && !globalState.disablePracticeGames)
            casualQueueDisabledTooltip = "Casual queue requires level 2. Play the Tutorial to learn the game first."
        if (globalState.publicTestRealm)
            casualQueueDisabledTooltip = "Disabled on PTR"
        if (!globalState.casualEnabled)
            casualQueueDisabledTooltip = "Casual queue is temporarily disabled"
        if (!globalState.classicEnabled)
            classicQueueDisabledTooltip = "Classic queue is temporarily disabled"

        if (!globalState.learnMenuEnabled) {
            var showTutorialRecommendedTooltip = globalState.level <= 2
            result.push({
                key: menuUUID++, menuId: menuUUID, name: "tutorial",
                displayName: loc('tutorial_queue', 'Tutorial'),
                description: loc('tutorial_queue_long', 'Learn the game.'),
                image: "play/Tutorial.png", content: null, disabled: false,
                behavior: function () { engine.trigger('loadView', 'singleplayer'); },
                greenTooltip: !showTutorialRecommendedTooltip ? '' : loc('recommended_learn_game', 'Recommended way to learn the game!'),
                greenTooltipTitle: !showTutorialRecommendedTooltip ? '' : loc('recommended', 'Recommended!'),
            })
        }

        var showCampaignRecommendedTooltip = globalState.level <= 3
        if (globalState.campaignEnabled && globalState.level !== 1) {
            result.push({
                key: menuUUID++, menuId: menuUUID,
                name: "campaign",
                displayName: loc('campaign', 'Campaign'),
                description: loc('campaign_long', 'Play the campaign.'),
                image: "play/Campaign.png", content: null, disabled: false,
                behavior: function () { engine.trigger('loadView', 'campaign'); },
                greenTooltip: !showCampaignRecommendedTooltip ? '' : loc('recommended_learn_game', 'Recommended way to learn the game!'),
                greenTooltipTitle: !showCampaignRecommendedTooltip ? '' : loc('recommended', 'Recommended!'),
            })
        }

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "play_vs_ai_queue",
            displayName: loc('play_vs_ai_queue', 'Play vs. AI'),
            description: loc('play_vs_ai_queue_long', 'Play the game against a team of AI-controlled opponents.'),
            image: "play/AI.png", content: null, disabled: false,
            disabledTooltip: "",
            behavior: function () { engine.trigger('loadView', 'bots') }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "weekly_challenge",
            displayName: loc('weekly_challenge', 'Weekly Challenge'),
            description: loc('weekly_challenge_long', 'Hone your positioning skills with a new challenge every week.'),
            image: "play/WeeklyChallenge.png", content: null, disabled: false,
            disabledTooltip: "",
            behavior: function () { engine.trigger('loadView', 'challenge') }
            //behavior: function () { engine.trigger('trySearchGame', 'challenge'); }
        })

        if (!globalState.learnMenuEnabled) {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: "sandbox",
                displayName: loc('sandbox_queue', 'Sandbox'),
                description: loc('sandbox_queue_long', 'Test out builds with debug commands.'),
                image: "play/Godmode.png", content: null, disabled: false,
                disabledTooltip: "",
                behavior: function () { engine.trigger('trySearchGame', 'sandbox') }
            })
        }

        return result
    }

    menuUUID = 0
    getLearnMenu = function () {

        result = []
        var showTutorialRecommendedTooltip = globalState.level <= 2

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "tutorial",
            displayName: loc('tutorial_queue', 'Tutorial'),
            description: loc('tutorial_queue_long', 'Learn the game.'),
            image: "play/Tutorial.png", content: null, disabled: false,
            behavior: function () { engine.trigger('loadView', 'singleplayer'); },
            greenTooltip: !showTutorialRecommendedTooltip ? '' : loc('recommended_learn_game', 'Recommended way to learn the game!'),
            greenTooltipTitle: !showTutorialRecommendedTooltip ? '' : loc('recommended', 'Recommended!'),
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "topGames",
            displayName: locName('leaderboard_top_games', 'Top Games'),
            description: loc('leaderboard_top_games', 'Featuring recent top ranked games for every fighter. Select a game to view builds.'),
            image: "play/TopGames.png", content: null, disabled: false,
            disabledTooltip: "",
            behavior: function () {
                engine.trigger('setMenuRootOnce', 'learn')

                engine.trigger('loadView', 'leaderboards')
                engine.trigger('selectSubmenu', 2)
            }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "codex",
            displayName: loc('codex', 'codex'),
            description: loc('codex_long', 'View detailed information about units, spells, and more.'),
            image: "play/Codex.png", content: null, disabled: false,
            disabledTooltip: "",
            behavior: function () {
                //engine.trigger('loadView', 'codex')

                // v8.05.2 VERY HACKY to fix UI lockup bug
                engine.trigger('loadView', 'launcher')
                setTimeout(function () {
                    engine.trigger('loadView', 'codex')
                }, 50)
            }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "sandbox",
            displayName: loc('sandbox_queue', 'Sandbox'),
            description: loc('sandbox_queue_long', 'Test out builds with debug commands.'),
            image: "play/Godmode.png", content: null, disabled: false,
            disabledTooltip: "",
            behavior: function () { engine.trigger('trySearchGame', 'sandbox') }
        })

        return result
    }

    getBotsPlayMenu = function () {
        menuUUID = 0
        result = []

        var beginnerLevelRequirement = 2
        var veryEasyLevelRequirement = 2
        var easyLevelRequirement = 2
        var mediumLevelRequirement = 3
        var hardLevelRequirement = 4
        var insaneLevelRequirement = 5

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "beginner_bots",
            displayName: '<img class="half-icon" src="hud/img/icons/Ranks/Unranked.png" style="vertical-align: top">' + loc('unranked_ai', 'Unranked AI'),
            description: '', //loc('beginner_bots_long', 'Practice against beginner difficulty AI opponents.'),
            image: "play/AIBeginner.png", content: null,
            disabled: globalState.level < beginnerLevelRequirement,
            disabledTooltip: (globalState.level < beginnerLevelRequirement) ? loc('bots_requirement', 'Requires level ' + beginnerLevelRequirement + '. Play against easier AI or play Classic games to level up. The tutorial also gives lots of XP!', [beginnerLevelRequirement]) : '',
            behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'beginnerbots') }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "very_easy_bots",
            displayName: '<img class="half-icon" src="hud/img/icons/Ranks/Bronze.png" style="vertical-align: top"">' + loc('bronze_ai', 'Bronze AI'),
            description: '', //loc('easy_bots_long', 'Practice against easy difficulty AI opponents.'),
            image: "play/AIVeryEasy.png", content: null,
            disabled: globalState.level < veryEasyLevelRequirement,
            disabledTooltip: (globalState.level < veryEasyLevelRequirement) ? loc('bots_requirement', 'Requires level ' + veryEasyLevelRequirement + '. Play against easier AI or play Classic games to level up. The tutorial also gives lots of XP!', [veryEasyLevelRequirement]) : '',
            behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'veryeasybots') }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "easy_bots",
            displayName: '<img class="half-icon" src="hud/img/icons/Ranks/Silver.png" style="vertical-align: top">' + loc('silver_ai', 'Silver AI'),
            description: '', //loc('easy_bots_long', 'Practice against easy difficulty AI opponents.'),
            image: "play/AIEasy.png",
            content: null, disabled: (globalState.level),
            disabledTooltip: (globalState.level < easyLevelRequirement) ? loc('bots_requirement', 'Requires level ' + easyLevelRequirement + '. Play against easier AI or play Classic games to level up. The tutorial also gives lots of XP!', [easyLevelRequirement]) : '',
            behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'easybots') }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "medium_bots",
            displayName: '<img class="half-icon" src="hud/img/icons/Ranks/Gold.png" style="vertical-align: top">' + loc('gold_ai', 'Gold AI'),
            description: '', // loc('medium_bots_long', 'Practice against medium difficulty AI opponents.'),
            image: "play/AIMedium.png", content: null,
            disabled: globalState.level < mediumLevelRequirement,
            disabledTooltip: (globalState.level < mediumLevelRequirement) ? loc('harder_bots_requirement', 'Requires level ' + mediumLevelRequirement + '. Play against easier AI or play Classic games to level up. The tutorial also gives lots of XP!', [mediumLevelRequirement]) : '',
            behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'mediumbots') }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "hard_bots",
            displayName: '<img class="half-icon" src="hud/img/icons/Ranks/Platinum.png" style="vertical-align: top">' + loc('platinum_ai', 'Platinum AI'),
            description: '', //loc('hard_bots_long', 'Practice against hard difficulty AI opponents.'),
            image: "play/AIHard.png", content: null,
            disabled: globalState.level < hardLevelRequirement,
            disabledTooltip: (globalState.level < hardLevelRequirement) ? loc('harder_bots_requirement', 'Requires level ' + hardLevelRequirement + '. Play against easier AI or play Classic games to level up. The tutorial also gives lots of XP!', [hardLevelRequirement]) : '',
            behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'hardbots') }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "diamond_bots",
            displayName: '<img class="half-icon" src="hud/img/icons/Ranks/Diamond.png" style="vertical-align: top">' + loc('diamond_ai', 'Diamond AI'),
            description: '', //loc('insane_bots_long', 'Practice against insane difficulty AI opponents.'),
            image: "play/AIInsane.png", content: null,
            disabled: globalState.level < insaneLevelRequirement,
            disabledTooltip: (globalState.level < insaneLevelRequirement) ? loc('harder_bots_requirement', 'Requires level ' + insaneLevelRequirement + '. Play against easier AI or play Classic games to level up. The tutorial also gives lots of XP!', [insaneLevelRequirement]) : '',
            behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'insanebots') }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "expert_bots",
            displayName: '<img class="half-icon" src="hud/img/icons/Ranks/Expert.png" style="vertical-align: top">' + loc('expert_rank', 'Expert') + ' ' + loc('ai', 'AI'),
            description: '', //loc('insane_bots_long', 'Practice against insane difficulty AI opponents.'),
            image: "play/AIExpert.png", content: null,
            disabled: globalState.level < insaneLevelRequirement,
            disabledTooltip: (globalState.level < insaneLevelRequirement) ? loc('harder_bots_requirement', 'Requires level ' + insaneLevelRequirement + '. Play against easier AI or play Classic games to level up. The tutorial also gives lots of XP!', [insaneLevelRequirement]) : '',
            behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'expertbots') }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "master_bots",
            displayName: '<img class="half-icon" src="hud/img/icons/Ranks/Master.png" style="vertical-align: top">' + loc('master_rank', 'Master') + ' ' + loc('ai', 'AI'),
            description: '', //loc('insane_bots_long', 'Practice against insane difficulty AI opponents.'),
            image: "play/AIMaster.png", content: null,
            disabled: globalState.level < insaneLevelRequirement,
            disabledTooltip: (globalState.level < insaneLevelRequirement) ? loc('harder_bots_requirement', 'Requires level ' + insaneLevelRequirement + '. Play against easier AI or play Classic games to level up. The tutorial also gives lots of XP!', [insaneLevelRequirement]) : '',
            behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'masterbots') }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "senior_master_bots",
            displayName: '<img class="half-icon" src="hud/img/icons/Ranks/SeniorMaster.png" style="vertical-align: top">' + '<span style="font-size: 1.05vw">' + loc('senior_master_rank', 'Senior Master') + ' ' + loc('ai', 'AI') + '</span>',
            description: '',
            image: "play/AISeniorMaster.png", content: null,
            disabled: globalState.level < insaneLevelRequirement,
            disabledTooltip: (globalState.level < insaneLevelRequirement) ? loc('harder_bots_requirement', 'Requires level ' + insaneLevelRequirement + '. Play against easier AI or play Classic games to level up. The tutorial also gives lots of XP!', [insaneLevelRequirement]) : '',
            behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'seniormasterbots') }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "grandmaster_bots",
            displayName: '<img class="half-icon" src="hud/img/icons/Ranks/Grandmaster.png" style="vertical-align: top">' + '<span style="font-size: 1.05vw">' + loc('grandmaster_rank', 'Grandmaster') + ' ' + loc('ai', 'AI') + '</span>',
            description: '',
            image: "play/AIGrandmaster.png", content: null,
            disabled: globalState.level < insaneLevelRequirement,
            disabledTooltip: (globalState.level < insaneLevelRequirement) ? loc('harder_bots_requirement', 'Requires level ' + insaneLevelRequirement + '. Play against easier AI or play Classic games to level up. The tutorial also gives lots of XP!', [insaneLevelRequirement]) : '',
            behavior: function () { engine.trigger('loadView', 'launcher'); engine.trigger('trySearchGame', 'grandmasterbots') }
        })

        return result
    }

    getCampaignsMenu = function () {
        menuUUID = 0
        result = []

        result.push(getCampaignMenuEntry(1))
        result.push(getCampaignMenuEntry(2))
        result.push(getCampaignMenuEntry(3))
        // Add more maps here if we want
        // Ideally this pulled from Apex, but probably not worth the implementation
        // since we prob won't have that many maps

        return result
    }

    getCampaignMenuEntry = function (mapNumber) {
        var starsEarned = 0
        var maxStars = 0

        if (globalState.campaignStarsEarnedPerMap[mapNumber])
            starsEarned = globalState.campaignStarsEarnedPerMap[mapNumber]
        if (globalState.campaignMaxStarsPerMap[mapNumber])
            maxStars = globalState.campaignMaxStarsPerMap[mapNumber]

        var ownedDlc = _.includes(globalState.campaignDlcOwned, 'Campaign' + mapNumber)
        if (mapNumber === 1) // Campaign 1 is included in the base game
            ownedDlc = true

        console.log('ownedDlc: ' + ownedDlc + ', mapNumber: ' + mapNumber)

        // v10.08 deprecated
        // Old: https://i.imgur.com/LAXBYJ1.png --> click --> DLC store page
        // New: https://i.imgur.com/dywj1zk.png --> click --> https://i.imgur.com/JVucQsN.png (can select any opponent) --> click Play or double-click any mission --> DLC store page
        //if (!ownedDlc && maxStars > 0) {
        //    return {
        //        key: mapNumber, menuId: mapNumber, name: "campaign_map_" + mapNumber,
        //        displayName: locName('campaign_' + mapNumber, 'Map ' + mapNumber),
        //        description: loc('campaign_' + mapNumber, 'Description for map ' + mapNumber)
        //            + '<br><br><img class="campaign-star-icon" src="hud/img/icons/Campaign/star.png"/> <span class="campaign-menu-stars" style="font-size: 1.25rem">' + starsEarned + '/' + maxStars + '</span>',
        //        image: "campaign/Campaign" + mapNumber + "_Locked.png", content: null, disabled: false,
        //        disabledTooltip: loc('campaign_requires_dlc', 'Requires DLC to be owned by at least one party member'),
        //        behavior: function () {
        //            console.log('click campaign ' + mapNumber + ' which requires dlc')
        //            engine.call('OnOpenURL', 'https://store.steampowered.com/app/2162190/Legion_TD_2__Desert_Ridge_Campaign/')
        //        }
        //    }
        //}

        return {
            key: mapNumber, menuId: mapNumber, name: "campaign_map_" + mapNumber,
            displayName: locName('campaign_' + mapNumber, 'Map ' + mapNumber),
            description: (maxStars > 0) ? loc('campaign_' + mapNumber, 'Description for map ' + mapNumber)
                + '<br><br><img class="campaign-star-icon" src="hud/img/icons/Campaign/star.png"/> <span class="campaign-menu-stars" style="font-size: 1.25rem">' + starsEarned + '/' + maxStars + '</span>' : '',
            image: (maxStars === 0) ? "campaign/CampaignDisabled.png" : "campaign/Campaign" + mapNumber + ".png", content: null, disabled: (maxStars === 0),
            disabledTooltip: (maxStars === 0) ? loc('coming_soon', 'Coming soon!') : '',
            greenTooltip: mapNumber === 2 ? globalState.freeCampaign2Tooltip : '',
            greenTooltipTitle: mapNumber === 2 ? globalState.freeCampaign2Title : '',
            behavior: function () {
                console.log('click campaign ' + mapNumber)

                if (maxStars === 0) {
                    console.log('no max stars yet, probably this map is not yet released so bail')
                    return
                }

                engine.trigger('loadView', 'campaignmap')
                engine.call('OnClickCampaignMap', mapNumber)

                if (isBrowserTest) {
                    engine.trigger('refreshCampaignMap', testCampaignMap)
                }
            }
        }
    }

    menuUUID = 0
    customGameMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Start",
            displayName: loc('start', 'Start'),
            description: loc('start_custom_game_long', 'Start the game'),
            content: null, behavior: function () { engine.trigger('test_onStartGame'); engine.call('OnStartGame') }
        },
    ]

    menuUUID = 0
    browserMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Create",
            displayName: loc('create', 'Create'),
            description: loc('create_custom_game_room_long', 'Create a custom game room'),
            content: null, behavior: function () { console.log("Create a custom game room not yet implemented") }
        },
    ]

    getTournamentMenu = function() {
        menuUUID = 0
        return [
            {
                key: menuUUID++, menuId: menuUUID, name: "TournamentHome",
                displayName: globalState.tournamentNova,
                description: 'October 2023',
                behavior: function () {
                    //engine.trigger('test_SelectLegion');
                    //engine.call('OnSelectLegion', 0)
                }
            },
        ]
    }

    getPregameMenu = function () {
        menuUUID = 0

        var divineDisabled = _.startsWith(globalState.clientVersion, '8.03') && !globalState.timedReleaseFeaturesActive
        //console.log('getPregameMenu, divineDisabled: ' + divineDisabled + ', globalState.clientVersion: ' + globalState.clientVersion)

        return [
            {
                key: menuUUID++, menuId: menuUUID, name: "Element",
                displayName: locName('element_legion_id', 'Element'),
                description: loc('element_legion_id', 'Wield forces of nature older than life itself.'), content: null,
                descriptionClass: 'billboard-description-compact ',
                disabled: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 0,
                disabledTooltip: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 0 ? loc('select_different_legion_for_mission', 'Select a different legion for this mission.') : '',
                image: "legionselect/Element0.png", inverted: false,
                mouseoverImage: "legionselect/Element1.png",
                behavior: function () { engine.trigger('test_SelectLegion'); engine.call('OnSelectLegion', 0) }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "Forsaken",
                displayName: locName('forsaken_legion_id', 'Forsaken'),
                description: loc('forsaken_legion_id', 'Command the walking dead from an ancient kingdom.'), content: null,
                descriptionClass: 'billboard-description-compact ',
                disabled: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 1,
                disabledTooltip: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 1 ? loc('select_different_legion_for_mission', 'Select a different legion for this mission.') : '',
                image: "legionselect/Forsaken0.png", inverted: false,
                mouseoverImage: "legionselect/Forsaken1.png",
                behavior: function () { engine.trigger('test_SelectLegion'); engine.call('OnSelectLegion', 1) }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "Grove",
                displayName: locName('grove_legion_id', 'Grove'),
                description: loc('grove_legion_id', 'Bewitch your enemies with enchanted flora and fauna.'), content: null,
                descriptionClass: 'billboard-description-compact ',
                disabled: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 2,
                disabledTooltip: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 2 ? loc('select_different_legion_for_mission', 'Select a different legion for this mission.') : '',
                image: "legionselect/Grove0.png", inverted: false,
                mouseoverImage: "legionselect/Grove1.png",
                behavior: function () { engine.trigger('test_SelectLegion'); engine.call('OnSelectLegion', 2) }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "Mech",
                displayName: locName('mech_legion_id', 'Mech'),
                description: loc('mech_legion_id', 'Reign supreme with advanced technology.'), content: null,
                descriptionClass: 'billboard-description-compact ',
                disabled: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 3,
                disabledTooltip: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 3 ? loc('select_different_legion_for_mission', 'Select a different legion for this mission.') : '',
                image: "legionselect/Mech0.png", inverted: false,
                mouseoverImage: "legionselect/Mech1.png",
                behavior: function () { engine.trigger('test_SelectLegion'); engine.call('OnSelectLegion', 3) }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "Atlantean",
                displayName: locName('atlantean_legion_id', 'Atlantean'),
                description: loc('atlantean_legion_id', 'Unleash fearsome monsters from the depths of the sea.'), content: null,
                descriptionClass: 'billboard-description-compact ',
                disabled: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 5,
                disabledTooltip: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 5 ? loc('select_different_legion_for_mission', 'Select a different legion for this mission.') : '',
                image: "legionselect/Atlantean0.png", inverted: false,
                mouseoverImage: "legionselect/Atlantean1.png",
                behavior: function () { engine.trigger('test_SelectLegion'); engine.call('OnSelectLegion', 5) }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "Nomad",
                displayName: locName('nomad_legion_id', 'Nomad'),
                description: loc('nomad_legion_id', 'Fight as an alliance of beasts from the badlands.'), content: null,
                descriptionClass: 'billboard-description-compact ',
                disabled: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 6,
                disabledTooltip: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 6 ? loc('select_different_legion_for_mission', 'Select a different legion for this mission.') : '',
                image: "legionselect/Nomad0.png", inverted: false,
                mouseoverImage: "legionselect/Nomad1.png",
                behavior: function () { engine.trigger('test_SelectLegion'); engine.call('OnSelectLegion', 6) }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "Shrine",
                displayName: locName('shrine_legion_id', 'Shrine'),
                description: loc('shrine_legion_id', 'Find redemption from the curse of the afterlife.'), content: null,
                descriptionClass: 'billboard-description-compact ',
                disabled: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 7,
                disabledTooltip: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 7 ? loc('select_different_legion_for_mission', 'Select a different legion for this mission.') : '',
                image: "legionselect/Shrine0.png", inverted: false,
                mouseoverImage: "legionselect/Shrine1.png",
                behavior: function () { engine.trigger('test_SelectLegion'); engine.call('OnSelectLegion', 7) }
            },
            !divineDisabled && {
                key: menuUUID++, menuId: menuUUID, name: "Divine",
                displayName: locName('divine_legion_id', 'Divine'),
                description: loc('divine_legion_id', 'Bring transgressors to justice with a holy order.'), content: null,
                descriptionClass: 'billboard-description-compact ',
                disabled: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 8,
                disabledTooltip: globalState.forcePickLegionIndex !== -1 && globalState.forcePickLegionIndex !== 8 ? loc('select_different_legion_for_mission', 'Select a different legion for this mission.') : '',
                image: "legionselect/Divine0.png", inverted: false,
                mouseoverImage: "legionselect/Divine1.png",
                behavior: function () { engine.trigger('test_SelectLegion'); engine.call('OnSelectLegion', 8) }
            },
            divineDisabled && {
                key: menuUUID++, menuId: menuUUID, name: "Divine",
                displayName: locName('divine_legion_id', 'Divine'),
                description: loc('divine_legion_id', 'Bring transgressors to justice with a holy crusade.'), content: null,
                descriptionClass: 'billboard-description-compact ',
                disabled: true,
                disabledTooltip: loc('unlocks_in', 'Unlocks in: ' + globalState.timedReleaseFeaturesLocalString, [globalState.timedReleaseFeaturesLocalString]),
                image: "legionselect/Divine0.png", inverted: false,
                mouseoverImage: "legionselect/Divine1.png",
                behavior: function () { }
            }
            //{
            //    key: menuUUID++, menuId: menuUUID, name: "Mastermind",
            //    displayName: locName('mastermind_legion_id', 'Mastermind'),
            //    description: loc('mastermind_legion_id', 'Play with randomized fighters from each legion.'), content: null,
            //    descriptionClass: 'billboard-description-compact ',
            //    disabled: globalState.level < 2 || (globalState.forcePickLegionIndex != -1 && globalState.forcePickLegionIndex != 4),
            //    disabledTooltip: (globalState.level < 2) ? loc('mastermind_requirements', 'Mastermind requires level 2. Play with legions to level up.') :
            //        loc('select_different_legion_for_mission', 'Select a different legion for this mission.'),
            //    image: "legionselect/Mastermind0.png", inverted: false,
            //    mouseoverImage: "legionselect/Mastermind1.png",
            //    behavior: function () { engine.trigger('test_SelectLegion'); engine.call('OnSelectLegion', 4) }
            //},
        ]
    }

    menuUUID = 0
    storeMenu = [
        { key: menuUUID++, menuId: menuUUID, name: "Skins", displayName: loc('store_skins', 'Skins'), narrow: true, content: React.createElement(StorePage, { categories: 'skinCategories', menuIndex: 0 }) },
        { key: menuUUID++, menuId: menuUUID, name: "Consumables", displayName: loc('store_consumable', 'Account'), narrow: true, content: React.createElement(StorePage, { categories: 'consumableCategories', menuIndex: 1 }) },
        { key: menuUUID++, menuId: menuUUID, name: "Account", displayName: loc('store_account', 'Playstyles'), narrow: true, content: React.createElement(StorePage, { categories: 'accountCategories', menuIndex: 2 }) },
        { key: menuUUID++, menuId: menuUUID, name: "Client", displayName: loc('store_tab_backgrounds', 'Backgrounds'), narrow: true, content: React.createElement(StorePage, { categories: 'clientBackgroundCategories', menuIndex: 3 }) },
        { key: menuUUID++, menuId: menuUUID, name: "GameCoach", displayName: loc('game_coach', 'Game Coach'), narrow: true, content: React.createElement(StorePage, { categories: 'gameCoachCategories', menuIndex: 4 }) },
        { key: menuUUID++, menuId: menuUUID, name: "Card Trader", displayName: loc('card_trader', 'Card Trader'), narrow: false, content: React.createElement(StorePage, { categories: 'cardCategories', menuIndex: 5 }) }
    ]
    globalState.storeMenuTabCount = menuUUID

    getProfileMenu = function () {
        menuUUID = 0
        result = []

        //console.log('getProfileMenu ' + globalState.lastProfilePlayFabId)
        // In case later we want to hide some stuff for non-self profiles..
        var isSelf = globalState.lastProfilePlayFabId === globalState.playFabId

        // in theory we could check if you have new masteries here...?
        var hasMasteryReward = false

        // v10.00
        var masteriesSuffix = ''
        if (isSelf && globalState.hasMasteryReward)
            masteriesSuffix = ' (<span style="color: #ffcc00">!</span>)'

        result.push({ key: 0, menuId: 1, name: "Overview", displayName: loc('profile_overview', 'Overview'), narrow: true, content: React.createElement(ProfileOverview) })
        result.push({ key: 1, menuId: 2, name: "Game Stats", displayName: loc('profile_game_stats', 'Game Stats'), narrow: true, content: React.createElement(GameStats) })
        result.push({ key: 2, menuId: 3, name: "Collection", displayName: loc('profile_collection', 'Collection'), narrow: true, content: React.createElement(Inventory) })
        result.push({ key: 6, menuId: 7, name: "Trophies", displayName: loc('trophies', 'Trophies'), narrow: true, content: React.createElement(Trophies) })
        result.push({ key: 7, menuId: 8, name: "Masteries", displayName: locName('masteries', 'Masteries') + masteriesSuffix, narrow: true, content: React.createElement(Masteries) })
        //result.push({ key: 5, menuId: 6, name: "Monuments", displayName: loc('profile_monuments', 'Monuments'), narrow: true, content: React.createElement(Monuments) })
        // SMELLY!!! We assume this is menuId 6 in the client, for music playing. See GameClient > HudApi.Submenu
        result.push({ key: 5, menuId: 6, name: "Monuments", displayName: loc('profile_monuments', 'Monuments'), narrow: true, content: React.createElement(Monuments) })
        result.push({ key: 3, menuId: 4, name: "Customization", displayName: loc('profile_customization', 'Equips'), narrow: true, content: React.createElement(Cosmetics) })
        // SMELLY!!!! We assume this is menuId 5 in the client, for lazy loading. See GameClient > HudApi.Submenu
        result.push({ key: 4, menuId: 5, name: "Match History", displayName: loc('profile_match_history', 'Match History'), narrow: true, content: React.createElement(MatchHistory) })

        return result
    }

    getGuildMenu = function () {
        menuUUID = 0
        result = []

        result.push({ key: menuUUID++, menuId: menuUUID, name: "Info", displayName: loc('guild_overview', 'Guild Info'), narrow: true, content: React.createElement(GuildOverview) })

        //if (globalState.selectedGuild == null || globalState.selectedGuild.name == "") {
        //    console.log("Trying to get own guild");
        //    engine.call('OnTryGetOwnGuild');
        //    //result.push({ key: menuUUID++, menuId: menuUUID, name: "Create", displayName: loc('guild_create', 'Create Guild'), narrow: true, content: React.createElement(GuildCreate) })
        //} else {
        //    result.push({ key: menuUUID++, menuId: menuUUID, name: "Info", displayName: loc('guild_overview', 'Guild Info'), narrow: true, content: React.createElement(GuildOverview) })
        //    result.push({ key: menuUUID++, menuId: menuUUID, name: "Members", displayName: loc('guild_members', 'Guild Members'), narrow: true, content: React.createElement(GuildMembers) })
        //    result.push({ key: menuUUID++, menuId: menuUUID, name: "Manage", displayName: loc('guild_manage', 'Manage Guild'), narrow: true, content: React.createElement(GuildManage) })
        //}

        //result.push({ key: menuUUID++, menuId: menuUUID, name: "Directory", displayName: loc('guild_directory', 'Browse Guilds'), narrow: true, content: React.createElement(GuildDirectoryView) })

        return result
    }

    menuUUID = 0
    clickGuildMemberMenu = function (guildMemberOptions) {

        if (globalState.isInGame) {
            guildMemberOptions.canKickThisPlayer = false
            guildMemberOptions.canTransferToThisPlayer = false
            guildMemberOptions.canChangeToOfficer = false
            guildMemberOptions.canChangeToMember = false
            guildMemberOptions.canChangeTitle = false
        }

        // TODO: IMPLEMENT (This seems rather complicated though so I'm not really sure I wanna do it tbh)
        guildMemberOptions.canTransferToThisPlayer = false

        var playFabId = globalState.contextMenuTarget
        var displayName = globalState.contextMenuDisplayTarget
        var isMyGuild = guildMemberOptions.isMyGuild

        var result = []

        result.push({
            key: menuUUID++, menuId: menuUUID, name: 'View Profile', displayName: loc('view_profile', 'View Profile'),
            disabled: false, behavior: function () { engine.trigger('viewGuildPlayerProfile', globalState.contextMenuTarget) }
        })

        if (guildMemberOptions.canAddFriend) {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: 'Add Friend',
                displayName: loc('add_friend', 'Add Friend'),
                behavior: function () {
                    engine.trigger('sendFriendRequest', globalState.contextMenuDisplayTarget)
                }
            })
        }

        if (isMyGuild) {
            if (guildMemberOptions.canChangeToOfficer) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Promote to Officer', displayName: loc('promote_to_officer', 'Promote to Officer'),
                    disabled: false, behavior: function () {
                        engine.call('OnChangeGuildMemberRole', playFabId, displayName, 'officers')
                    }
                })
            }

            if (guildMemberOptions.canChangeToOfficerLocked) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Promote to Officer Locked', displayName: loc('promote_to_officer', 'Promote to Officer') + ' (' + loc('locked', 'Locked') + ')',
                    disabled: true, behavior: function () { }
                })
            }

            if (guildMemberOptions.canChangeTitle) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Edit Title', displayName: loc('edit_guild_member_title', 'Edit Guild Member Title'),
                    disabled: false, behavior: function () {
                        engine.trigger('requestGuildMemberTitle', playFabId, guildMemberOptions.title)
                    }
                })
            }

            if (guildMemberOptions.canChangeTitleLocked) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Edit Title Locked', displayName: loc('edit_guild_member_title', 'Edit Guild Member Title') + ' (' + loc('locked', 'Locked') + ')',
                    disabled: true, behavior: function () { }
                })
            }


            if (guildMemberOptions.canChangeToMember) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Demote to Member', displayName: loc('demote_to_member', 'Demote to Member'),
                    disabled: false, behavior: function () {
                        engine.call('OnChangeGuildMemberRole', playFabId, displayName, 'members')
                    }
                })
            }

            if (guildMemberOptions.canKickThisPlayer) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Kick', displayName: loc('guild_kick', 'Kick From Guild'),
                    disabled: false, behavior: function () {
                        engine.trigger('showConfirmPopupInput', {
                            header: loc('kick_from_guild', 'Kick ' + displayName + ' from guild', [displayName]),
                            description: loc('kick_from_guild_long'),
                            triggerIfConfirm: 'confirmKickFromGuild',
                            triggerIfBack: '',
                            data: playFabId,
                            data2: '',
                            currencyType: '',
                            currencyAmount: 0,
                        })
                    }
                })
            }

            if (guildMemberOptions.canTransferToThisPlayer) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Transfer', displayName: loc('guild_transfer', 'Transfer Guild Ownership'),
                    disabled: false, behavior: function () { console.log("todo: transfer guild ownership: " + globalState.contextMenuTarget) }
                })
            }
        }

        return result
    }

    getLeaderboardsMenu = function () {
        menuUUID = 0
        result = []

        result.push({ key: menuUUID++, menuId: menuUUID, name: "Rank", displayName: loc('leaderboard_rank', 'Rank'), narrow: true, content: React.createElement(LeaderboardTab, { statsList: ['overallEloThisSeasonAtLeastOneGamePlayed', 'overallPeakEloThisSeasonAtLeastOneGamePlayed', 'overallPeakElo', 'rankedWinsThisSeason', 'classicWinsThisSeason', 'vipOverallPeakElo', 'vipTotalMatchmadeWins', 'eventPoints', 'ladderPoints'] }) })
        result.push({ key: menuUUID++, menuId: menuUUID, name: "Top Games", displayName: locName('leaderboard_top_games', 'Top Games'), narrow: true, content: React.createElement(LeaderboardOpenings) })
        result.push({ key: menuUUID++, menuId: menuUUID, name: "Level", displayName: loc('level', 'Level'), narrow: true, content: React.createElement(LeaderboardTab, { statsList: ['totalXp', 'atlanteanXp', 'elementXp', 'forsakenXp', 'groveXp', 'mechXp', 'nomadXp', 'shrineXp', 'mastermindXp'] }) })
        result.push({ key: menuUUID++, menuId: menuUUID, name: "Challenges", displayName: loc('weekly_challenge', 'Weekly Challenge'), narrow: true, content: React.createElement(LeaderboardTab, { statsList: ['weeklyChallengeFirstPlaceWins', 'weeklyChallengeWins'] }) })

        if (globalState.shopEnabled) {
            // Smelly way to make guildWarVictoryPoints first during guild war
            if (globalState.guildWarActive)
                result.push({ key: menuUUID++, menuId: menuUUID, name: "Guilds", displayName: loc('guild', 'Guild'), narrow: true, content: React.createElement(LeaderboardTab, { statsList: ['guildWarVictoryPoints', 'guildXp', 'guildWarWins'] }) })
            else
                result.push({ key: menuUUID++, menuId: menuUUID, name: "Guilds", displayName: loc('guild', 'Guild'), narrow: true, content: React.createElement(LeaderboardTab, { statsList: ['guildXp', 'guildWarVictoryPoints', 'guildWarWins'] }) })
        }

        //    // Eventually enable Behavior Score leaderboard later, but we need to probably have
        //    // - Minimum of 20 MatchmadeGamesPlayed
        //    // - At least one game played this season
        //    // - Better support for classic queue
        //result.push({ key: menuUUID++, menuId: menuUUID, name: "Behavior", displayName: loc('behavior', 'Behavior'), narrow: true, content: React.createElement(LeaderboardTab, { statsList: ['behaviorScore'] }) })

        result.push({ key: menuUUID++, menuId: menuUUID, name: "Collection", displayName: loc('profile_collection', 'Collection'), narrow: true, content: React.createElement(LeaderboardTab, { statsList: ['collectionValue', 'countryCollectionValue'] }) })

        return result
    }

    menuUUID = 0
    optionsMenu = [
        { key: menuUUID++, menuId: menuUUID, name: "Video", displayName: loc('video', 'Video'), content: React.createElement(VideoOptions, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Sound", displayName: loc('sound', 'Sound'), content: React.createElement(SoundOptions, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Controls", displayName: loc('controls', 'Controls'), content: React.createElement(ControlsOptions, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Interface", displayName: loc('interface', 'Interface'), content: React.createElement(InterfaceOptions, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Social", displayName: loc('social', 'Social'), content: React.createElement(SocialOptions, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "GameCoach", displayName: loc('game_coach', 'Game Coach'), content: React.createElement(GameCoachOptions, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "System", displayName: loc('language', 'Language'), content: React.createElement(SystemOptions, {}), narrow: true },
    ]

    menuUUID = 0
    tournamentMenu = [
        { key: menuUUID++, menuId: menuUUID, name: "Home", displayName: globalState.tournamentNova, content: React.createElement(BracketsRender, {}), narrow: true },
    ]

    menuUUID = 0
    creditsMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Main Credits",
            displayName: loc('main_credits', 'Main Credits'),
            content: React.createElement(MainCreditsMenu, {
                header: "Thank you for playing Legion TD 2. Ever since we created the original Legion TD mod in 2009, it has been our dream to create a standalone version of Legion TD. Through your purchase, you've helped make that dream a reality. -Lisk & Jules",
                lines: CreatorCredits
            }), narrow: true
        },
        {
            key: menuUUID++, menuId: menuUUID, name: "Special Thanks",
            displayName: loc('special_thanks', 'Special Thanks'),
            content: React.createElement(CreditsMenu, {
                header: "Special thanks to the individuals and studios who have contributed to the development of Legion TD 2 in some way.",
                lines: MajorContributorsCredits
            }), narrow: true
        },
        {
            key: menuUUID++, menuId: menuUUID, name: "Community Testers",
            displayName: loc('community_testers', 'Community Testers'),
            content: React.createElement(CreditsMenu, {
                header: "To our community testers, thank you for all your bug reports, logs, videos, and tier lists. See you in-game!",
                lines: CommunityTestersCredits
            }), narrow: true
        },
        {
            key: menuUUID++, menuId: menuUUID, name: "Kickstarter Backers",
            displayName: loc('kickstarter_backers', 'Kickstarter Backers'),
            content: React.createElement(CreditsMenu, {
                header: "To our Kickstarter backers, we are grateful you that you took the chance and believed in our vision. The game wouldn't exist without you.",
                lines: KickstarterBackersCredits
            }), narrow: true
        }//,
        //{
        //    key: menuUUID++, menuId: menuUUID, name: "Founder's Edition",
        //    displayName: loc('founders_edition', "Founder's Edition"),
        //    content: React.createElement(CreditsMenu, {
        //        header: "To our Founder's Edition backers, thank you for pre-ordering the game and supporting us before the game was even playable.",
        //        lines: FoundersEditionCredits
        //    }), narrow: true
        //},
    ]

    menuUUID = 0
    gameGuideMenu = [
        { key: menuUUID++, menuId: menuUUID, name: "Game Overview", content: React.createElement(GameGuideOverview, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Deploy Fighters", content: React.createElement(GameGuideDeployFighters, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Fighters Come Alive", content: React.createElement(GameGuideFightersComeAlive, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Clear Your Waves", content: React.createElement(GameGuideClearYourWaves, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Attack Your Opponents", content: React.createElement(GameGuideAttackYourOpponents, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Manage Resources", content: React.createElement(GameGuideManageResources, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Win The Game", content: React.createElement(GameGuideWinTheGame, {}), narrow: true },
    ]

    menuUUID = 0
    faqMenu = [
        { key: menuUUID++, menuId: menuUUID, name: "Matchmaking", displayName: loc('matchmaking', 'Matchmaking'), content: React.createElement(RatingsGuide, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "FairPlay", displayName: loc('fairplay', 'FairPlay'), content: React.createElement(FairPlayGuide, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Cards", displayName: loc('cards', 'Cards'), content: React.createElement(CardsGuide, {}), narrow: true },
    ]

    menuUUID = 0
    codexMenu = [
        { key: menuUUID++, menuId: menuUUID, name: "Game Manual", displayName: loc('game_manual', 'Game Manual'), content: React.createElement(CodexHelp, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Units", displayName: loc('units', 'Units'), content: React.createElement(CodexUnits, {}), narrow: false },
        { key: menuUUID++, menuId: menuUUID, name: "King", displayName: loc('king', 'King'), content: React.createElement(CodexKing, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Legion Spells", displayName: loc('legion_spells', 'Legion Spells'), content: React.createElement(CodexSpells, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Emojis", displayName: locName('emojis', 'Emojis'), content: React.createElement(CodexEmojis, {}), narrow: true },
        { key: menuUUID++, menuId: menuUUID, name: "Debug Commands", displayName: locName('debug_commands', 'Debug Commands (Sandbox)'), content: React.createElement(CodexDebugCommands, {}), narrow: true },
    ]

    menuUUID = 0
    postGameMenu = [
        { key: menuUUID++, menuId: menuUUID, name: "Overview", displayName: loc('post_game_overview', 'Overview'), narrow: true, content: React.createElement(PostGameOverview) },
        //{ key: menuUUID++, menuId: menuUUID, name: "Waves", displayName: loc('post_game_waves', 'Waves'), narrow: true, content: React.createElement(PostGameWaves) }, // v5.00 no longer show
        { key: menuUUID++, menuId: menuUUID, name: "Builds", displayName: loc('post_game_builds', 'Builds'), narrow: false, content: React.createElement(PostGameBuilds) },
        { key: menuUUID++, menuId: menuUUID, name: "Graphs", displayName: loc('post_game_graphs', 'Graphs'), narrow: true, content: React.createElement(PostGameGraphs) },
    ]

    menuUUID = 0
    quitMenu = [
        { key: menuUUID++, menuId: menuUUID, name: "Cancel", displayName: loc('cancel', 'Cancel'), behavior: null },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Yes",
            displayName: loc('yes', 'Yes'),
            behavior: function () {
                engine.trigger('quitGame')
                engine.call('OnVoluntarilyQuitGame')
            }
        },
    ]

    menuUUID = 0
    endGameMenu = [
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Continue",
            displayName: loc('continue', 'Continue'),
            behavior: function () { engine.trigger('quitGame') }
        },
    ]

    menuUUID = 0
    exitMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Cancel",
            displayName: loc('cancel', 'Cancel'), behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Yes",
            displayName: loc('yes', 'Yes'),
            behavior: function () { engine.trigger('quitApplication') }
        },
    ]

    menuUUID = 0
    okMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Ok",
            displayName: loc('ok', 'Ok'),
            behavior: null
        },
    ]

    okWithCallbackMenu = function (callbackId) {
        menuUUID = 0
        menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: "Ok",
                displayName: loc('ok', 'Ok'),
                behavior: function () {
                    engine.call('OnHandleOkPopupCallback', callbackId)
                }
            }
        ]
        return menu
    }

    menuUUID = 0
    newsPopupMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Ok",
            displayName: loc('ok', 'Ok'),
            behavior: function () { engine.trigger('getNextNews', globalState.newsIsArchive) }
        },
    ]

    menuUUID = 0
    continuePlayingMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: 'Continue Playing',
            displayName: loc('continue_playing', 'Continue Playing'),
            behavior: function () { engine.call('OnContinuePlaying') }
        },
    ]

    menuUUID = 0
    understandMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "I understand",
            displayName: loc('i_understand', 'I understand'),
            behavior: null
        },
    ]

    menuUUID = 0
    alphaPopupMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "I understand",
            displayName: loc('i_understand', 'I understand'),
            behavior: function () {
                loadPopupYesRecommendedSkip("Read the game guide first?", "",
                    function () {
                        engine.trigger('loadView', 'gameguide')
                    }, function () {
                        engine.trigger('loadView', 'launcher')
                    }
                )
            }
        },
    ]

    menuUUID = 0
    blankMenu = [
    ]

    menuUUID = 0
    acceptCancelMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Accept",
            displayName: loc('accept', 'Accept'),
            behavior: function () { engine.trigger('submitPopupMenuInput') }
        },
    ]

    menuUUID = 0
    getLinkTwitchMenu = function () {
        //var disabled = globalState.level == 1
        return [
            {
                key: menuUUID++, menuId: menuUUID, name: "Back",
                displayName: loc('back', 'Back'),
                behavior: null
            },
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Link Account",
                //locked: disabled,
                displayName: "<img src='hud/img/hudv2/twitch24.png'> " + locName('link_twitch_account', 'Link Twitch Account'),
                behavior: function () {
                    //if (disabled) return // Let's just have the view handle it so we can give them a loud message
                    engine.call('OnLinkTwitchAccount')
                }
            },
        ]
    }

    menuUUID = 0
    confirmCancelMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Confirm",
            displayName: loc('confirm', 'Confirm'),
            behavior: function () { engine.trigger('submitPopupMenuInput') }
        },
    ]

    menuUUID = 0
    privacyMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Decline",
            displayName: loc('decline', 'Decline'),
            behavior: function () { engine.call('OnRejectPrivacyPolicy') }
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Accept",
            displayName: loc('accept', 'Accept'),
            behavior: function () { engine.call('OnAcceptPrivacyPolicy') }
        },
    ]

    menuUUID = 0
    acceptMenu = [
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Accept",
            displayName: loc('accept', 'Accept'),
            behavior: function () { engine.trigger('submitPopupMenuInput') }
        },
    ]

    menuUUID = 0
    sendFriendRequestMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Send Request",
            displayName: loc('send_request', 'Send Request'),
            behavior: function () { engine.trigger('submitPopupMenuInput') }
        },
    ]

    menuUUID = 0
    reportPlayerMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Submit Report",
            displayName: loc('submit_report', 'Submit Report'),
            behavior: function () { engine.trigger('submitPopupMenuInput') }
        },
    ]

    menuUUID = 0
    selectAvatarMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Save Avatar",
            displayName: loc('save', 'Save'),
            behavior: function () { engine.trigger('submitPopupMenuInput') }
        },
    ]

    menuUUID = 0
    donateCardMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Donate",
            //displayName: loc('donate', 'Donate'),
            displayName: loc('select', 'Select'),
            behavior: function () { engine.trigger('submitPopupMenuInput') }
        },
    ]

    menuUUID = 0
    sellCardMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Select",
            displayName: loc('select', 'Select'),
            behavior: function () { engine.trigger('submitPopupMenuInput') }
        },
    ]

    menuUUID = 0
    equipCardMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Equip",
            displayName: loc('select', 'Select'),
            behavior: function () { engine.trigger('submitPopupMenuInput') }
        },
    ]

    menuUUID = 0
    backMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: null
        }
    ]

    menuUUID = 0
    loadTowerBuildMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Confirm",
            displayName: loc('confirm', 'Confirm'),
            behavior: function () { engine.trigger('submitPopupMenuInput') }
        },
    ]

    menuUUID = 0
    sendInviteMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Send Invite",
            displayName: loc('send_invite', 'Send Invite'),
            behavior: function () { engine.trigger('submitPopupMenuInput') }
        },
    ]

    menuUUID = 0
    sendCustomGameInviteMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Send Invite",
            displayName: loc('send_invite', 'Send Invite'),
            behavior: function () { engine.trigger('submitPopupMenuInput') }
        },
    ]

    createYesCancelMenu = function (behaviorIfYes, behaviorIfCancel) {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: "Cancel",
                displayName: loc('cancel', 'Cancel'),
                behavior: behaviorIfCancel
            },
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Yes",
                displayName: loc('yes', 'Yes'),
                behavior: behaviorIfYes
            },
        ]
        return menu
    }

    createYesRecommendedSkipMenu = function (behaviorIfYes, behaviorIfCancel) {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: "Skip",
                displayName: loc('skip', 'Skip'),
                behavior: behaviorIfCancel
            },
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Yes (Recommended)",
                displayName: loc('yes_recommended', 'Yes (Recommended)'),
                behavior: behaviorIfYes
            },
        ]
        return menu
    }

    createOkCancelMenu = function (behaviorIfYes, behaviorIfCancel) {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: "Cancel",
                displayName: loc('cancel', 'Cancel'),
                behavior: behaviorIfCancel
            },
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Ok",
                displayName: loc('ok', 'Ok'),
                behavior: behaviorIfYes
            },
        ]
        return menu
    }

    createReconnectCancelMenu = function () {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: "Cancel",
                displayName: loc('cancel', 'Cancel'),
                behavior: function () { engine.call('OnCancelReconnectToGame') }
            },
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Reconnect",
                displayName: loc('reconnect', 'Reconnect'),
                behavior: function () { engine.call('OnReconnectToGame') }
            },
        ]
        return menu
    }

    createMatchFoundMenu = function () {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: "Decline",
                displayName: loc('decline', 'Decline'),
                behavior: function () { engine.call('OnDeclineMatchFound') }
            },
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Accept",
                displayName: loc('accept', 'Accept'),
                behavior: function () { engine.call('OnAcceptMatchFound') }
            },
        ]
        return menu
    }

    createCancelMenu = function (behaviorIfCancel) {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: "Cancel",
                buttonStyle: 3,
                displayName: 'x',
                behavior: behaviorIfCancel
            },
        ]
        return menu
    }

    createSkipMenu = function (behaviorIfSkip) {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: "Skip",
                displayName: loc('skip', 'Skip'),
                behavior: behaviorIfSkip
            },
        ]
        return menu
    }

    createSkipDisabledMenu = function () {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: "Skip",
                displayName: loc('skip', 'Skip') + ' (' + loc('only_from_allies', 'Only From Allies') + ')',
                locked: true
            },
        ]
        return menu
    }

    createOkMenu = function (behaviorIfOk) {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: 'ok',
                displayName: loc('ok', 'Ok'),
                behavior: behaviorIfOk
            },
        ]
        return menu
    }

    menuUUID = 0
    leaveCustomGameMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Cancel",
            displayName: loc('cancel', 'Cancel'),
            behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Leave",
            displayName: loc('leave', 'Leave'),
            behavior: function () {
                engine.call('OnLeaveCustomGameLobby')
                engine.trigger('escape')
                engine.trigger('loadView', 'launcher')
            }
        },
    ]

    menuUUID = 0
    quitOnlyMenu = [
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Quit",
            displayName: loc('quit', 'Quit'),
            behavior: function () {
                engine.trigger('quitGame')
            }
        },
    ]

    // Context menus
    // Intended to be used with openContextMenu()
    // =====================================================

    // Helper
    amIPartyLeader = function () {
        return globalState.partyLeader === globalState.playFabId && globalState.partyLeaderEnabled
    }

    rightClickChatPersonMenu = function () {
        var result = []
        var playFabId = globalState.contextMenuTarget
        var displayName = globalState.contextMenuDisplayTarget
        var amILeader = amIPartyLeader()
        var isInParty = _.includes(globalState.partyPlayFabIds, playFabId)
        var isInFriends = _.includes(globalState.friendPlayFabIds, playFabId)
        var isSelf = playFabId === globalState.playFabId
        var isMuted = _.includes(globalState.mutedPlayers, displayName.toLowerCase())

        console.log('playFabId: ' + playFabId + ", displayName: " + displayName + ", partyLeader: " + globalState.partyLeader)
        console.log('amILeader: ' + amILeader + ", isSelf: " + isSelf, ", isInParty: " + isInParty + ", isInFriends: " + isInFriends + ", party: " + globalState.partyPlayFabIds)
        console.log('isMuted: ' + isMuted)

        if (!isSelf) {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: 'Send Message',
                displayName: loc('send_message', 'Send Message'),
                disabled: false, behavior: function () { engine.call('OnWhisper', displayName) }
            })
        }

        result.push({
            key: menuUUID++, menuId: menuUUID, name: 'View Profile',
            displayName: loc('view_profile', 'View Profile'),
            disabled: false, behavior: function () {
                // v2.30
                // v8.06: commented out, since this actually just breaks the back button if you view profile via chat right click
                // whenever you're on basically every view other than profile... wonder what usecase I had in v2.30...
                //if (globalState.currentView != 'profile')
                //    engine.trigger('setMenuRoot', globalState.currentView)
                engine.trigger('viewProfile', playFabId)
            }
        })

        if (amILeader && !isSelf && isInParty) {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: 'Promote to Party Leader',
                displayName: "Promote to Party Leader",
                behavior: function () { engine.trigger('loadPopup', 'wip') }
            })
            result.push({
                key: menuUUID++, menuId: menuUUID, name: 'Kick From Party',
                displayName: loc('kick_from_party', 'Kick From Party'),
                behavior: function () {
                    engine.trigger('removeFromParty', playFabId)
                    engine.trigger('displayClientNotification',
                        loc('party_update', 'Party Update'),
                        loc('kicked_party_member', 'Kicked party member ' + displayName),
                        [displayName],
                        5)
                }
            })
        }

        if (isSelf && globalState.partyPlayFabIds.length > 1) {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: 'Leave Party',
                displayName: loc('leave_party', 'Leave Party'),
                behavior: function () {
                    engine.trigger('leaveParty')

                    // This is now sent by Lobby
                    //engine.trigger('displayClientNotification', loc('party_update', 'Party Update'), loc('left_the_party', 'You left the party'), 5)
                }
            })
        }

        if (!isSelf) {
            // Invite to party
            if (!isInParty && !globalState.searchingForMatch) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Invite To Party',
                    displayName: loc('invite_to_party', 'Invite to party'),
                    behavior: function () {
                        engine.trigger('sendPartyInvite', globalState.contextMenuDisplayTarget)
                    }
                })
            } else {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Invite To Party',
                    displayName: loc('invite_to_party', 'Invite to party'),
                    disabled: true
                })
            }

            // Invite to guild
            result.push({
                key: menuUUID++, menuId: menuUUID, name: 'Invite To Guild',
                displayName: loc('invite_to_guild', 'Invite to guild'),
                behavior: function () {
                    if (globalState.myGuildName === '') return

                    engine.trigger('sendGuildInvite', displayName)
                },
                disabled: globalState.myGuildName === ''
            })

            // Add friend
            if (!isInFriends) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Add Friend',
                    displayName: loc('add_friend', 'Add Friend'),
                    behavior: function () {
                        engine.trigger('sendFriendRequest', globalState.contextMenuDisplayTarget)
                    }
                })
            } else {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Add Friend',
                    displayName: loc('add_friend', 'Add Friend'),
                    disabled: true
                })
            }

            // Mute
            if (!isSelf) {
                if (!isMuted) {
                    result.push({
                        key: menuUUID++, menuId: menuUUID, name: 'Mute',
                        displayName: loc('mute', 'Mute'),
                        behavior: function () {
                            engine.call('TogglePlayerMuted', globalState.contextMenuDisplayTarget)
                        }
                    })
                } else {
                    result.push({
                        key: menuUUID++, menuId: menuUUID, name: 'Unmute',
                        displayName: loc('unmute', 'Unmute'),
                        behavior: function () {
                            engine.call('TogglePlayerMuted', globalState.contextMenuDisplayTarget)
                        }
                    })
                }
            }

            // Report
            // v7.02 disabled
            //if (!isSelf) {
            //    result.push({
            //        key: menuUUID++, menuId: menuUUID, name: 'Report Player', displayName: loc('report_player', 'Report Player'), behavior: function () {
            //            engine.trigger('loadPopup', 'reportplayerpostgame')
            //            //engine.call("OnOpenURL", "https://legiontd2.com/community/forums/player-reports-ban-appeals.50/create-thread?title=Report " + displayName)
            //        }
            //    })
            //}
        }

        return result
    }

    rightClickChatPersonMenuInGame = function () {
        var result = []
        var playFabId = globalState.contextMenuTarget
        var displayName = globalState.contextMenuDisplayTarget
        var amILeader = amIPartyLeader()
        var isInParty = _.includes(globalState.partyPlayFabIds, playFabId)
        var isInFriends = _.includes(globalState.friendPlayFabIds, playFabId)
        var isSelf = playFabId === globalState.playFabId
        var isMuted = _.includes(globalState.mutedPlayers, displayName.toLowerCase())

        if (!isSelf) {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: 'Send Message',
                displayName: loc('send_message', 'Send Message'),
                disabled: false, behavior: function () { engine.call('OnWhisper', displayName) }
            })
        }

        result.push({
            key: menuUUID++, menuId: menuUUID, name: 'View Profile',
            displayName: loc('view_profile', 'View Profile'),
            disabled: false, behavior: function () {
                // v2.30
                if (globalState.currentView !== 'profile')
                    engine.trigger('setMenuRoot', globalState.currentView)
                engine.trigger('viewProfile', playFabId)
            }
        })

        // Invite to Party (grayed out because they are in-game)
        result.push({
            key: menuUUID++, menuId: menuUUID, name: 'Invite To Party',
            displayName: loc('invite_to_party', 'Invite to party'),
            disabled: true
        })

        // Invite to guild
        result.push({
            key: menuUUID++, menuId: menuUUID, name: 'Invite To Guild',
            displayName: loc('invite_to_guild', 'Invite to guild'),
            behavior: function () {
                if (globalState.myGuildName === '') return

                engine.trigger('sendGuildInvite', displayName)
            },
            disabled: globalState.myGuildName === ''
        })

        // Add friend
        if (!isInFriends) {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: 'Add Friend',
                displayName: loc('add_friend', 'Add Friend'),
                behavior: function () {
                    engine.trigger('sendFriendRequest', globalState.contextMenuDisplayTarget)
                }
            })
        } else {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: 'Add Friend',
                displayName: loc('add_friend', 'Add Friend'),
                disabled: true
            })
        }

        // Mute
        if (!isSelf) {
            if (!isMuted) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Mute',
                    displayName: loc('mute', 'Mute'),
                    behavior: function () {
                        engine.call('TogglePlayerMuted', globalState.contextMenuDisplayTarget)
                    }
                })
            } else {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Unmute',
                    displayName: loc('unmute', 'Unmute'),
                    behavior: function () {
                        engine.call('TogglePlayerMuted', globalState.contextMenuDisplayTarget)
                    }
                })
            }
        }

        return result
    }

    menuUUID = 0
    helpMenu = function () {
        return [
            {
                key: menuUUID++, menuId: menuUUID, name: "Game Guide",
                displayName: loc('game_guide', 'Game Guide'),
                disabled: false, behavior: function () {
                    engine.call("OnOpenURL", "https://steamcommunity.com/sharedfiles/filedetails/?id=1793195628")
                    //engine.trigger('loadView', 'gameguide')
                }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "Codex",
                displayName: loc('codex', 'Codex'),
                disabled: false, behavior: function () {
                    engine.trigger('setMenuRootOnce', globalState.currentView)

                    // v9.00 fix maybe for Codex in loading screen
                    if (globalState.isInGame) {
                        engine.trigger('loadView', 'codex')
                        return
                    }

                    // v8.05.2 VERY HACKY to fix UI lockup bug
                    engine.trigger('loadView', 'launcher')
                    setTimeout(function () {
                        engine.trigger('loadView', 'codex')
                    }, 50)

                    //engine.trigger('loadView', 'codex')
                }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "Report Bug",
                displayName: loc('report_bug', 'Report Bug'),
                disabled: false, behavior: function () { engine.call("OnOpenURL", "http://legiontd2.com/bugs") }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "View Game Files",
                displayName: loc('view_game_files', 'View Game Files'),
                disabled: false, behavior: function () { engine.call("OnViewGameFiles") }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "Translations",
                displayName: locName('help_translate_the_game', 'Translations'),
                disabled: false, behavior: function () { engine.call("OnOpenURL", "http://legiontd2.com/translate") }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "Link Twitch",
                displayName: "Link Twitch Account", //TODO: locName('link_twitch_account', 'Link Twitch Account'),
                disabled: false, behavior: function () {
                    engine.trigger('setMenuRootOnce', globalState.currentView)
                    engine.trigger('requestTwitchLink', '')
                }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "Credits",
                displayName: loc('credits', 'Credits'),
                disabled: false, behavior: function () {
                    engine.trigger('setMenuRootOnce', globalState.currentView)

                    engine.trigger('loadView', 'credits')
                }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "Redeem Code",
                displayName: locName('redeem_code', 'Redeem Code'),
                disabled: false, behavior: function () {
                    engine.trigger('setMenuRootOnce', globalState.currentView)
                    engine.trigger('requestCouponCode', '')
                }
            },
        ]
    }

    menuUUID = 0
    chatMenu = function () {
        //var checkbox = React.createElement('div', { className: 'checkbox-box' },
        //  globalState.automaticallyShowChatWindows && React.createElement('img', { className: 'checkbox-icon', src: 'hud/img/ui/accept-check.png' })
        //)

        var checkboxHtml = "<div class='checkbox-box inline'>"
        if (globalState.automaticallyShowChatWindows)
            checkboxHtml += "<img class='checkbox-icon' src='hud/img/ui/accept-check.png' />";
        checkboxHtml += "</div>"

        return [
            {
                key: menuUUID++, menuId: menuUUID, name: 'Chat Settings',
                displayName: checkboxHtml + " " + loc('automatically_show_chat_windows', 'Automatically show chat windows'),
                disabled: false, behavior: function () {
                    engine.trigger('automaticallyShowChatWindows', !globalState.automaticallyShowChatWindows)
                }
            },
        ]
    }

    menuUUID = 0
    rightClickFriendRequestMenu = function () {
        return [
            {
                key: menuUUID++, menuId: menuUUID, name: 'View Profile',
                displayName: loc('view_profile', 'View Profile'),
                disabled: false, behavior: function () { engine.trigger('viewProfile', globalState.contextMenuTarget) }
            },
        ]
    }

    menuUUID = 0
    rightClickFriendsMenu = function () {
        var result = []
        var playFabId = globalState.contextMenuTarget
        var displayName = globalState.contextMenuDisplayTarget
        var amILeader = amIPartyLeader()
        var isInParty = _.includes(globalState.partyPlayFabIds, playFabId)
        var isInFriends = _.includes(globalState.friendPlayFabIds, playFabId)
        var isSelf = playFabId === globalState.playFabId

        return [
            { key: menuUUID++, menuId: menuUUID, name: 'Invite To Party', displayName: loc('invite_to_party', 'Invite To Party'), disabled: isInParty, behavior: function () { engine.trigger('sendPartyInvite', globalState.contextMenuDisplayTarget) } },
            { key: menuUUID++, menuId: menuUUID, name: 'Invite To Guild', displayName: loc('invite_to_guild', 'Invite To Guild'), disabled: globalState.myGuildName === '', behavior: function () { engine.trigger('sendGuildInvite', displayName) } },
            { key: menuUUID++, menuId: menuUUID, name: 'Send Message', displayName: loc('send_message', 'Send Message'), disabled: false, behavior: function () { engine.call("OnWhisper", globalState.contextMenuDisplayTarget) } },
            { key: menuUUID++, menuId: menuUUID, name: 'View Profile', displayName: loc('view_profile', 'View Profile'), disabled: false, behavior: function () { engine.trigger('viewProfile', globalState.contextMenuTarget) } },
            //{ key: menuUUID++, menuId: menuUUID, name: 'Add To Favorites', displayName: loc('add_to_favorites', 'Add To Favorites'), disabled: true, behavior: function () { engine.trigger('loadPopup', 'wip') } },
            { key: menuUUID++, menuId: menuUUID, name: 'Unfriend', displayName: loc('unfriend', 'Unfriend'), behavior: function () { engine.trigger('removeFriend', globalState.contextMenuTarget) } },
        ]
    }

    menuUUID = 0
    rightClickNonPlayFabFriendMenu = function () {
        var playFabId = globalState.contextMenuTarget
        var isInFriends = _.includes(globalState.friendPlayFabIds, playFabId)

        return [
            { key: menuUUID++, menuId: menuUUID, name: 'Send Message', displayName: loc('send_message', 'Send Message'), disabled: false, behavior: function () { engine.call("OnWhisper", globalState.contextMenuDisplayTarget) } },
            { key: menuUUID++, menuId: menuUUID, name: 'No Account', displayName: loc('no_account', 'No Legion TD 2 Account'), disabled: true, behavior: function () { } },
            { key: menuUUID++, menuId: menuUUID, name: 'Unfriend', displayName: loc('unfriend', 'Unfriend'), behavior: function () { engine.trigger('removeFriend', globalState.contextMenuTarget) } },
        ]
    }

    menuUUID = 0
    rightClickOfflinePlayFabFriendMenu = function () {
        var playFabId = globalState.contextMenuTarget
        var displayName = globalState.contextMenuDisplayTarget

        return [
            { key: menuUUID++, menuId: menuUUID, name: 'Invite To Game', displayName: loc('invite_to_game', 'Invite To Game'), disabled: true, behavior: function () { /* Can't invite offline people to game */ } },
            { key: menuUUID++, menuId: menuUUID, name: 'Invite To Guild', displayName: loc('invite_to_guild', 'Invite To Guild'), disabled: globalState.myGuildName === '', behavior: function () { engine.trigger('sendGuildInvite', displayName) } },
            { key: menuUUID++, menuId: menuUUID, name: 'Send Message', displayName: loc('send_message', 'Send Message'), disabled: false, behavior: function () { engine.call("OnWhisper", globalState.contextMenuDisplayTarget) } },
            { key: menuUUID++, menuId: menuUUID, name: 'View Profile', displayName: loc('view_profile', 'View Profile'), disabled: false, behavior: function () { engine.trigger('viewProfile', globalState.contextMenuTarget) } },
            //{ key: menuUUID++, menuId: menuUUID, name: 'Add To Favorites', displayName: loc('add_to_favorites', 'Add To Favorites'), disabled: true, behavior: function () { engine.trigger('loadPopup', 'wip') } },
            { key: menuUUID++, menuId: menuUUID, name: 'Unfriend', displayName: loc('unfriend', 'Unfriend'), behavior: function () { engine.trigger('removeFriend', globalState.contextMenuTarget) } },
        ]
    }

    menuUUID = 0
    rightClickNotInGamePlayFabFriendMenu = function () {
        var playFabId = globalState.contextMenuTarget
        var displayName = globalState.contextMenuDisplayTarget

        return [
            // v8.03.8 temporarily disabled for now until we can test it properly.
            //{ key: menuUUID++, menuId: menuUUID, name: 'Invite To Game', displayName: loc('invite_to_game', 'Invite To Game'), disabled: false, behavior: function () { engine.call('OnRichInviteToGame', globalState.contextMenuTarget) } },
            { key: menuUUID++, menuId: menuUUID, name: 'Invite To Guild', displayName: loc('invite_to_guild', 'Invite To Guild'), disabled: globalState.myGuildName === '', behavior: function () { engine.trigger('sendGuildInvite', displayName) } },
            { key: menuUUID++, menuId: menuUUID, name: 'Send Message', displayName: loc('send_message', 'Send Message'), disabled: false, behavior: function () { engine.call("OnWhisper", globalState.contextMenuDisplayTarget) } },
            { key: menuUUID++, menuId: menuUUID, name: 'View Profile', displayName: loc('view_profile', 'View Profile'), disabled: false, behavior: function () { engine.trigger('viewProfile', globalState.contextMenuTarget) } },
            //{ key: menuUUID++, menuId: menuUUID, name: 'Add To Favorites', displayName: loc('add_to_favorites', 'Add To Favorites'), disabled: true, behavior: function () { engine.trigger('loadPopup', 'wip') } },
            { key: menuUUID++, menuId: menuUUID, name: 'Unfriend', displayName: loc('unfriend', 'Unfriend'), behavior: function () { engine.trigger('removeFriend', globalState.contextMenuTarget) } },
        ]
    }

    menuUUID = 0
    rightClickBusyFriendsMenu = function () {
        return [
            { key: menuUUID++, menuId: menuUUID, name: 'Invite To Party', displayName: loc('invite_to_party', 'Invite To Party'), disabled: true, behavior: function () { } },
            { key: menuUUID++, menuId: menuUUID, name: 'Invite To Guild', displayName: loc('invite_to_guild', 'Invite To Guild'), disabled: true, behavior: function () { } },
            { key: menuUUID++, menuId: menuUUID, name: 'Send Message', displayName: loc('send_message', 'Send Message'), disabled: false, behavior: function () { engine.call("OnWhisper", globalState.contextMenuDisplayTarget) } },
            { key: menuUUID++, menuId: menuUUID, name: 'View Profile', displayName: loc('view_profile', 'View Profile'), disabled: false, behavior: function () { engine.trigger('viewProfile', globalState.contextMenuTarget) } },
            //{ key: menuUUID++, menuId: menuUUID, name: 'Add To Favorites', displayName: loc('add_to_favorites', 'Add To Favorites'), disabled: true, behavior: function () { engine.trigger('loadPopup', 'wip') } },
            { key: menuUUID++, menuId: menuUUID, name: 'Unfriend', displayName: loc('unfriend', 'Unfriend'), behavior: function () { engine.trigger('removeFriend', globalState.contextMenuTarget) } },
        ]
    }

    menuUUID = 0
    rightClickLeaderboardEntryMenu = function () {
        return [
            {
                key: menuUUID++, menuId: menuUUID, name: 'View Profile', displayName: loc('view_profile', 'View Profile'),
                disabled: false, behavior: function () { engine.trigger('viewLeaderboardProfile', globalState.contextMenuTarget) }
            },
        ]
    }

    menuUUID = 0
    rightClickGuildLeaderboardEntryMenu = function () {
        return [
            {
                key: menuUUID++, menuId: menuUUID, name: 'View Guild', displayName: loc('view_guild', 'View Guild'),
                disabled: false, behavior: function () {
                    engine.trigger('viewGuildProfile', null) // load instantly with loading spinner
                    engine.call('OnLoadGuildProfileByMemberPlayFabId', globalState.contextMenuTarget)

                    if (isBrowserTest)
                        engine.trigger('viewGuildProfile', testGuild)
                }
            },
        ]
    }

    menuUUID = 0
    rightClickPostGameNameMenu = function () {
        var playFabId = globalState.contextMenuTarget
        var displayName = globalState.contextMenuDisplayTarget
        var amILeader = amIPartyLeader()
        var isInParty = _.includes(globalState.partyPlayFabIds, playFabId)
        var isInFriends = _.includes(globalState.friendPlayFabIds, playFabId)
        var isSelf = playFabId === globalState.playFabId
        var isAlreadyReported = _.includes(globalState.reportedPlayers, playFabId)
        var isPostgame = globalState.currentView === 'postgame' // to differentiate from matchhistory

        console.log("Right click post game user: " + playFabId + ", currentView: " + globalState.currentView)

        var result = []

        result.push({ key: menuUUID++, menuId: menuUUID, name: 'Invite To Party', displayName: loc('invite_to_party', 'Invite To Party'), disabled: isInParty, behavior: function () { engine.trigger('sendPartyInvite', globalState.contextMenuDisplayTarget) } })
        result.push({ key: menuUUID++, menuId: menuUUID, name: 'Invite To Guild', displayName: loc('invite_to_guild', 'Invite To Guild'), disabled: globalState.myGuildName === '', behavior: function () { engine.trigger('sendGuildInvite', displayName) } })
        result.push({ key: menuUUID++, menuId: menuUUID, name: 'View Profile', displayName: loc('view_profile', 'View Profile'), disabled: false, behavior: function () { engine.trigger('viewPostGameProfile', globalState.contextMenuTarget) } })
        result.push({ key: menuUUID++, menuId: menuUUID, name: 'Add Friend', displayName: loc('add_friend', 'Add Friend'), disabled: isInFriends, behavior: function () { engine.trigger('sendFriendRequest', globalState.contextMenuDisplayTarget) } })

        if (!isAlreadyReported && isPostgame) {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: 'Report Player', displayName: loc('report_player', 'Report Player'), disabled: false, behavior: function () {
                    engine.trigger('loadPopup', 'reportplayerpostgame')
                    //engine.call("OnOpenURL", "https://legiontd2.com/community/forums/player-reports-ban-appeals.50/create-thread?title=[" + globalState.gameId + "] Report " + displayName)
                }
            })
        } else {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: 'Report Player', displayName: loc('report_player', 'Report Player'), disabled: true, behavior: function () { }
            })
        }
        //{ key: menuUUID++, menuId: menuUUID, name: 'Report Player', displayName: loc('report_player', 'Report Player'), disabled: false, behavior: function () { engine.trigger('loadPopup', 'reportPlayer') } },

        return result
    }

    menuUUID = 0
    rightClickPostGameNameSelfMenu = function () {
        return [
            { key: menuUUID++, menuId: menuUUID, name: 'View Profile', displayName: loc('view_profile', 'View Profile'), disabled: false, behavior: function () { engine.trigger('viewPostGameProfile', globalState.contextMenuTarget) } },
            //{ key: menuUUID++, menuId: menuUUID, name: 'Report Player', displayName: loc('report_player', 'Report Player'), disabled: true, behavior: function () { engine.trigger('loadPopup', 'reportPlayer') } },
        ]
    }

    menuUUID = 0
    rightClickPostGameNameBotMenu = function () {
        return [
            { key: menuUUID++, menuId: menuUUID, name: 'View Profile', displayName: loc('view_profile', 'View Profile'), disabled: true, behavior: function () { } },
            //{ key: menuUUID++, menuId: menuUUID, name: 'Report Player', displayName: loc('report_player', 'Report Player'), disabled: true, behavior: function () { } },
        ]
    }

    menuUUID = 0
    rightClickScoreboardNameMenu = function () {
        var playFabId = globalState.contextMenuTarget
        var isInFriends = _.includes(globalState.friendPlayFabIds, playFabId)
        var isBot = _.startsWith(playFabId, '_bot') || playFabId === 'Blank'
        var isSelf = playFabId === globalState.playFabId
        //var isAlreadyReported = _.includes(globalState.reportedPlayers, playFabId)
        var isAlreadyReported = false // v1.60 just allow dual reporting, especially since you could have different reasons

        console.log("Right click scoreboard user: " + playFabId)

        // todo: add ability to Mute/Unmute here
        return [
            { key: menuUUID++, menuId: menuUUID, name: 'Send Message', displayName: loc('send_message', 'Send Message'), disabled: false, behavior: function () { engine.call("OnWhisper", globalState.contextMenuDisplayTarget) } },
            { key: menuUUID++, menuId: menuUUID, name: 'Report Player', displayName: loc('report_player', 'Report Player'), disabled: isBot || isSelf || isAlreadyReported, behavior: function () { engine.trigger('loadPopup', 'reportPlayer') } },
            { key: menuUUID++, menuId: menuUUID, name: 'View Profile', displayName: loc('view_profile', 'View Profile'), disabled: isBot, behavior: function () { engine.trigger('viewIngameProfile', globalState.contextMenuTarget) } },
        ]
    }

    rightClickPartyPersonMenu = function () {
        var playFabId = globalState.contextMenuTarget
        var displayName = globalState.contextMenuDisplayTarget
        var amILeader = amIPartyLeader()
        var isSelf = playFabId === globalState.playFabId
        var isInFriends = _.includes(globalState.friendPlayFabIds, playFabId)
        var result = []
        var menuUUID = 0

        //console.log('playFabId: ' + playFabId + ", displayName: " + displayName + ", partyLeader: " + globalState.partyLeader)
        //console.log('amILeader: ' + amILeader + ", isSelf: " + isSelf)

        if (!isSelf) {
            result.push({ key: menuUUID++, menuId: menuUUID, name: 'Send Message', displayName: loc('send_message', 'Send Message'), disabled: false, behavior: function () { engine.call('OnWhisper', displayName) } })
        }

        result.push({ key: menuUUID++, menuId: menuUUID, name: 'View Profile', displayName: loc('view_profile', 'View Profile'), disabled: false, behavior: function () { engine.trigger('viewProfile', playFabId) } })

        if (amILeader && !isSelf) {
            result.push({
                key: menuUUID++, menuId: menuUUID, name: 'Promote To Party Leader', behavior: function () {
                    engine.trigger('displayClientNotification', loc('party_update', 'Party Update'), loc('not_yet_implemented', 'Not yet implemented') + " (Promote to party leader)", 5)
                }
            })
            result.push({
                key: menuUUID++, menuId: menuUUID, name: 'Kick From Party',
                displayName: loc('kick_from_party', 'Kick From Party'),
                behavior: function () {
                    engine.trigger('removeFromParty', playFabId)

                    engine.trigger('displayClientNotification', loc('party_update', 'Party Update'),
                        loc('kicked_party_member', 'Kicked party member ' + displayName),
                        [displayName],
                        5)
                }
            })
        }

        if (isSelf && globalState.partyPlayFabIds.length > 1) {
            var menuText = amILeader ? loc('disband_party', 'Disband Party') : loc('leave_party', 'Leave Party')
            result.push({
                key: menuUUID++, menuId: menuUUID, name: menuText, behavior: function () {
                    engine.trigger('leaveParty')

                    // This is now sent by lobby
                    //engine.trigger('displayClientNotification', loc('party_update', 'Party Update'), loc('left_the_party', 'You left the party'), 5)
                }
            })
        }

        // Add friend
        if (!isSelf) {
            if (!isInFriends) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Add Friend', displayName: loc('add_friend', 'Add Friend'), behavior: function () {
                        engine.trigger('sendFriendRequest', globalState.contextMenuDisplayTarget)
                    }
                })
            } else {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: 'Add Friend', displayName: loc('add_friend', 'Add Friend'), disabled: true
                })
            }
        }

        return result
    }

    menuUUID = 0
    guideMenu = function () {
        return [
            {
                key: menuUUID++, menuId: menuUUID, name: "Wave Info (F10)",
                displayName: loc('wave_info', 'Wave Info') + ' (F10)',
                behavior: function () { engine.trigger('toggleGuideWaves') }
            },
            {
                key: menuUUID++, menuId: menuUUID, name: "Attack Types (F11)",
                displayName: loc('attack_type_table', 'Attack Type Table') + ' (F11)',
                behavior: function () { engine.trigger('toggleGuideAttackTypes') }
            }
        ]
    }

    menuUUID = 0
    customGamePlayerSettingsMenu = function () {
        var result = []

        var player = parseInt(globalState.contextMenuTarget)
        //console.log('customGamePlayerSettingsMenu for player ' + player)
        //console.log('customGameSettingsObject is: ' + JSON.stringify(globalState.customGameSettingsObject))
        var playerSettings = globalState.customGameSettingsObject.playerSettings[player]

        result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'Gold', displayName: loc('gold', 'Gold') + ": " + '<img class="tooltip-icon" src="hud/img/icons/Gold.png"/> ' + playerSettings.gold, behavior: function () { console.log("click gold"); globalState.contextMenuCustomValue1 = playerSettings.gold; globalState.contextMenuCustomValue2 = 'gold'; engine.trigger('loadPopup', 'setcustomgameplayersetting') }, },
            { key: menuUUID++, menuId: menuUUID, name: 'Mythium', displayName: loc('mythium', 'Mythium') + ": " + '<img class="tooltip-icon" src="hud/img/icons/Mythium.png"/> ' + playerSettings.mythium, behavior: function () { console.log("click mythium"); globalState.contextMenuCustomValue1 = playerSettings.mythium; globalState.contextMenuCustomValue2 = 'mythium'; engine.trigger('loadPopup', 'setcustomgameplayersetting') }, },
            { key: menuUUID++, menuId: menuUUID, name: 'Set for all players', displayName: loc('set_for_all_players', 'Set for all players'), behavior: function () { console.log("click set for all"); engine.call('OnTrySetPlayerSettingsForAllPlayers', playerSettings.gold, playerSettings.mythium) } },
            { key: menuUUID++, menuId: menuUUID, name: 'Restore Defaults', displayName: loc('restore_defaults', 'Restore defaults'), behavior: function () { console.log("click restore"); engine.call('OnTryRestorePlayerSettingsDefaults', player) } }
        )

        return result
    }

    menuUUID = 0
    customGameAISettingsMenu = function () {
        var result = []

        var player = parseInt(globalState.contextMenuTarget)
        //console.log('customGameAISettingsMenu for player ' + player)
        //console.log('customGameSettingsObject is: ' + JSON.stringify(globalState.customGameSettingsObject))
        //var playerSettings = globalState.customGameSettingsObject.playerSettings[player]

        result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'Beginner', displayName: '<img class="tooltip-icon" src="hud/img/icons/Ranks/Unranked.png"/> ' + loc('beginner', 'Beginner'), behavior: function () { console.log("click difficulty"); engine.call('OnTrySetBotDifficulty', player, 'beginner') }, },
            { key: menuUUID++, menuId: menuUUID, name: 'Easy', displayName: '<img class="tooltip-icon" src="hud/img/icons/Ranks/Bronze.png"/> ' + loc('easy_bots', 'Easy'), behavior: function () { console.log("click difficulty"); engine.call('OnTrySetBotDifficulty', player, 'easy') }, },
            { key: menuUUID++, menuId: menuUUID, name: 'Medium', displayName: '<img class="tooltip-icon" src="hud/img/icons/Ranks/Silver.png"/> ' + loc('medium_bots', 'Medium'), behavior: function () { console.log("click difficulty"); engine.call('OnTrySetBotDifficulty', player, 'medium') }, },
            { key: menuUUID++, menuId: menuUUID, name: 'Hard', displayName: '<img class="tooltip-icon" src="hud/img/icons/Ranks/Gold.png"/> ' + loc('hard_bots', 'Hard'), behavior: function () { console.log("click difficulty"); engine.call('OnTrySetBotDifficulty', player, 'hard') }, }
        )

        return result
    }

    getPostGameGraphTypes = function () {
        return [
            {
                text: loc('team_win_probability', 'Team Win Probability'),
                category: 'winProbability',
                key: 'winprobability',
                suggestedMin: 0,
                suggestedMax: 100,
            },
            {
                text: loc('team_power_score_advantage', 'Team Power Score Advantage'),
                category: 'powerScoreAdvantage',
                key: 'powerscoreadvantage',
                suggestedMin: -500,
                suggestedMax: 500,
            },
            {
                text: loc('team_gold_advantage', 'Team Gold Advantage'),
                category: 'goldAdvantage',
                key: 'goldadvantage',
                suggestedMin: -500,
                suggestedMax: 500,
            },
            {
                text: loc('team_net_worth', 'Team Net Worth'),
                category: 'team',
                key: 'teamnetworth',
                suggestedMin: 0,
                suggestedMax: 5000,
            },
            {
                text: loc('team_king_upgrades', 'Team King Upgrades'),
                category: 'team',
                key: 'teamkingupgrades',
                suggestedMin: 0,
                suggestedMax: 24,
            },
            {
                text: loc('player_power_score', 'Player Power Scores'),
                category: 'player',
                key: 'playerpowerscore',
                suggestedMin: 0,
                suggestedMax: 1000,
            },
            {
                text: loc('player_net_worth', 'Player Net Worth'),
                category: 'player',
                key: 'playernetworth',
                suggestedMin: 0,
                suggestedMax: 1000,
            },
            {
                text: loc('player_fighter_value', 'Player Fighter Value'),
                category: 'player',
                key: 'playerfightervalue',
                suggestedMin: 0,
                suggestedMax: 1000,
            },
            {
                text: loc('player_workers', 'Player Workers'),
                category: 'player',
                key: 'playerworkers',
                suggestedMin: 0,
                suggestedMax: 5,
            },
            {
                text: loc('player_income', 'Player Income'),
                category: 'player',
                key: 'playerincome',
                suggestedMin: 0,
                suggestedMax: 30,
            },
            {
                text: loc('player_mythium_sent', 'Player Mythium Sent'),
                category: 'player',
                key: 'playermythiumsent',
                suggestedMin: 0,
                suggestedMax: 100,
            },
            {
                text: loc('player_mythium_received', 'Player Mythium Received'),
                category: 'player',
                key: 'playermythiumreceived',
                suggestedMin: 0,
                suggestedMax: 100,
            }
        ]
    }

    getWaveGraphTypes = function () {
        return [
            {
                text: loc('workers_on_wave', 'Workers On Wave'),
                category: 'wave',
                key: 'workers',
                suggestedMin: 0,
                suggestedMax: 0,
                units: ' ' + loc('workers', 'Workers')
            },
            {
                text: loc('income_on_wave', 'Income On Wave'),
                category: 'wave',
                key: 'income',
                suggestedMin: 0,
                suggestedMax: 0,
                units: ' ' + loc('income', 'Income')
            },
            {
                text: loc('big_leaks_on_wave', '40%+ Leaks On Wave'),
                category: 'wave',
                key: 'bigleaks',
                suggestedMin: 0,
                suggestedMax: 0,
                units: '%'
            },
            {
                text: loc('avg_leak_percent_on_wave', 'Avg Leak % On Wave'),
                category: 'wave',
                key: 'leakspercent',
                suggestedMin: 0,
                suggestedMax: 0,
                units: '%'
            },
            {
                text: loc('win_rate_on_wave', 'Win Rate On Wave'),
                category: 'wave',
                key: 'winrate',
                suggestedMin: 0,
                suggestedMax: 0,
                units: '%'
            },
            {
                text: loc('game_ended_on_wave', 'Game Ended On Wave'),
                category: 'wave',
                key: 'gameended',
                suggestedMin: 0,
                suggestedMax: 0,
                units: '%'
            }
        ]
    }

    menuUUID = 0
    customGameSettingsMenu = function () {
        var result = []

        var customGameModesString = globalState.customGameSettingsObject.customGameModesString
        console.log('customGameModesString: ' + customGameModesString)

        var checkboxHtml = '<div class="checkbox-box" style="position: static; display: inline-block; margin-right: 3px;"><img class="checkbox-icon" src="hud/img/ui/accept-check.png"/></div>'
        var uncheckedHtml = '<div class="checkbox-box" style="position: static; display: inline-block; margin-right: 3px;"></div>'
        var grayHtml = '<div class="checkbox-box" style="position: static; display: inline-block; margin-right: 3px; background: #606060"></div>'

        var disableChaos = _.includes(customGameModesString, 'hybrid') || _.includes(customGameModesString, 'prophet') || _.includes(customGameModesString, 'mastermind')
        var disableHybrid = _.includes(customGameModesString, 'chaos') || _.includes(customGameModesString, 'noT1s') || _.includes(customGameModesString, 'prophet') || _.includes(customGameModesString, 'mastermind')
        var disableNoT1s = _.includes(customGameModesString, 'hybrid') || _.includes(customGameModesString, 'prophet') || _.includes(customGameModesString, 'mastermind')
        var disableProphet = _.includes(customGameModesString, 'chaos') || _.includes(customGameModesString, 'noT1s') || _.includes(customGameModesString, 'hybrid') || _.includes(customGameModesString, 'mastermind')
        var disableMastermind = _.includes(customGameModesString, 'chaos') || _.includes(customGameModesString, 'noT1s') || _.includes(customGameModesString, 'prophet') || _.includes(customGameModesString, 'hybrid')
        var disableGuildBattle = !globalState.enableGuildBattleMode

        // I think these need to match (case sensitive) the enum in Natives > Tags.cs
        !disableChaos && result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'Chaos', displayName: (_.includes(customGameModesString, "chaos") ? checkboxHtml : uncheckedHtml) + loc('arcade_queue_chaos', '|c(FF8800):Chaos Mode:|r You get new random rolls every wave!'), behavior: function () { console.log("click chaos"); engine.call('OnTrySetCustomGameSetting', 'chaos', !_.includes(customGameModesString, "chaos")) }, }
        )
        disableChaos && result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'Chaos', displayName: grayHtml + loc('arcade_queue_chaos', '|c(FF8800):Chaos Mode:|r You get new random rolls every wave!'), behavior: function () { }, }
        )

        !disableHybrid && result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'Hybrid', displayName: (_.includes(customGameModesString, "hybrid") ? checkboxHtml : uncheckedHtml) + loc('arcade_queue_hybrid', '|c(FF8800):Hybrid Mode:|r Every time you place a tower, it is random'), behavior: function () { console.log("click hybrid"); engine.call('OnTrySetCustomGameSetting', 'hybrid', !_.includes(customGameModesString, "hybrid")) }, }
        )
        disableHybrid && result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'Hybrid', displayName: grayHtml + loc('arcade_queue_hybrid', '|c(FF8800):Hybrid Mode:|r Every time you place a tower, it is random'), behavior: function () { }, }
        )

        !disableProphet && result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'Prophet', displayName: (_.includes(customGameModesString, "prophet") ? checkboxHtml : uncheckedHtml) + loc('arcade_queue_prophet', '|c(FF8800):Prophet Mode:|r Your mastermind roll is autopicked. You can reroll any wave for a cost.'), behavior: function () { console.log("click prophet"); engine.call('OnTrySetCustomGameSetting', 'prophet', !_.includes(customGameModesString, "prophet")) } }
        )
        disableProphet && result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'Prophet', displayName: grayHtml + loc('arcade_queue_prophet', '|c(FF8800):Prophet Mode:|r Your mastermind roll is autopicked. You can reroll any wave for a cost. !'), behavior: function () { } }
        )

        !disableMastermind && result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'Mastermind', displayName: (_.includes(customGameModesString, "mastermind") ? checkboxHtml : uncheckedHtml) + loc('arcade_queue_tournament', '|c(FF8800):Tournament:|r Mastermind-only with random playstyle option for all players'), behavior: function () { console.log("click mastermind"); engine.call('OnTrySetCustomGameSetting', 'mastermind', !_.includes(customGameModesString, "mastermind")) } }
        )
        disableMastermind && result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'Mastermind', displayName: grayHtml + loc('arcade_queue_tournament', '|c(FF8800):Tournament:|r Mastermind-only with random playstyle option for all players'), behavior: function () { } }
        )

        !disableNoT1s && result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'No T1s', displayName: (_.includes(customGameModesString, "noT1s") ? checkboxHtml : uncheckedHtml) + loc('arcade_queue_not1s', '|c(FF8800):No T1s Mode:|r All mastermind, but no T1s are in your rolls!'), behavior: function () { console.log("click not1s"); engine.call('OnTrySetCustomGameSetting', 'noT1s', !_.includes(customGameModesString, "noT1s")) } }
        )
        disableNoT1s && result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'No T1s', displayName: grayHtml + loc('arcade_queue_not1s', '|c(FF8800):No T1s Mode:|r All mastermind, but no T1s are in your rolls!'), behavior: function () { } }
        )

        // v5.04: disabled, since it is laggy, especially in 4v4
        //result.push(
        //    { key: menuUUID++, menuId: menuUUID, name: 'X2', displayName: (_.includes(customGameModesString, "x2") ? checkboxHtml : uncheckedHtml) + loc('arcade_queue_x2', '|c(33BBBB):X2 Mode:|r 2x creature spawns!'), behavior: function () { console.log("click x2"); engine.call('OnTrySetCustomGameSetting', 'x2', !_.includes(customGameModesString, "x2")) }, }
        //)

        result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'All Visible', displayName: (_.includes(customGameModesString, "allVisible") ? checkboxHtml : uncheckedHtml) + loc('arcade_queue_allvisible', '|c(33BBBB):All Visible Mode:|r No fog of war'), behavior: function () { console.log("click all visible"); engine.call('OnTrySetCustomGameSetting', 'allVisible', !_.includes(customGameModesString, "allVisible")) }, }
        )

        result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'Team Mercs', displayName: (_.includes(customGameModesString, "teammercs") ? checkboxHtml : uncheckedHtml) + loc('arcade_queue_teammercs', '|c(33BBBB):Team Mercenaries Mode:|r Mercenaries are distributed across the whole team'), behavior: function () { console.log("click team mercs"); engine.call('OnTrySetCustomGameSetting', 'teammercs', !_.includes(customGameModesString, "teammercs")) }, }
        )

        result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'Fog', displayName: (_.includes(customGameModesString, "fog") ? checkboxHtml : uncheckedHtml) + loc('arcade_queue_fog', '|c(33BBBB):Fog Mode:|r Fog of war covers the enemy team, except for the King area'), behavior: function () { console.log("click fog"); engine.call('OnTrySetCustomGameSetting', 'fog', !_.includes(customGameModesString, "fog")) }, }
        )

        result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'No Saving', displayName: (_.includes(customGameModesString, "noSaving") ? checkboxHtml : uncheckedHtml) + loc('arcade_queue_nosaving', '|c(33BBBB):No Saving Mode:|r Limits the amount of mythium you can save'), behavior: function () { console.log("click no saving"); engine.call('OnTrySetCustomGameSetting', 'noSaving', !_.includes(customGameModesString, "noSaving")) }, }
        )

        result.push(
            { key: menuUUID++, menuId: menuUUID, name: 'Auto Handicap', displayName: (_.includes(customGameModesString, "autoHandicap") ? checkboxHtml : uncheckedHtml) + loc('arcade_queue_autohandicap', '|c(33BBBB):Handicap:|r Gives bonus income to lower rated players.'), behavior: function () { console.log("click auto handicap"); engine.call('OnTrySetCustomGameSetting', 'autoHandicap', !_.includes(customGameModesString, "autoHandicap")) }, }
        )

        if (!disableGuildBattle) {
            result.push(
                { key: menuUUID++, menuId: menuUUID, name: 'Guild Battle', displayName: (_.includes(customGameModesString, "guildBattle") ? checkboxHtml : uncheckedHtml) + loc('arcade_queue_guildbattle', '|c(33BBBB):Guild Battle:|r Arranged 4v4 match between two guilds'), behavior: function () { console.log("click guild battle"); engine.call('OnTrySetCustomGameSetting', 'guildBattle', !_.includes(customGameModesString, "guildBattle")) }, }
            )
        }

        return result
    }

    createRevealMenu = function (behaviorIfReveal) {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Reveal",
                displayName: loc('reveal', 'Reveal'),
                behavior: behaviorIfReveal
            },
        ]
        return menu
    }

    createJoinDiscordOkMenu = function () {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: "Ok",
                displayName: loc('ok', 'Ok'),
                behavior: null
            },
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Discord",
                displayName: loc('join_discord_chat', 'Join Legion TD 2 Discord Chat'),
                behavior: function () { engine.call("OnOpenURL", "http://discord.gg/legiontd2") }
            }
        ]
        return menu
    }

    createInitialExperienceMenu = function () {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: "Skip Tutorial",
                displayName: loc('skip_tutorial', 'Skip Tutorial'),
                behavior: function () {
                    console.log('skip tutorial clicked')
                    engine.call('OnSkipTutorial')
                }
            },
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Play Tutorial",
                displayName: loc('play_tutorial', 'Play Tutorial'),
                behavior: function () {
                    console.log('play tutorial clicked --> load tutorial view')
                    engine.trigger('loadView', 'tutorial')
                }
            }
        ]
        return menu
    }

    createEquipsOkMenu = function () {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: "Ok",
                displayName: loc('ok', 'Ok'),
                behavior: null
            },
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Equips",
                displayName: loc('open_equips_menu', 'Open Equips'),
                behavior: function () {
                    engine.trigger('loadView', 'myprofile')
                    engine.trigger('selectSubmenu', 4)
                }
            }
        ]
        return menu
    }

    getMastermindVariantsMenu = function () {
        menuUUID = 0
        var result = []

        var testVariantNames = [
            "",
            "Lock-In",
            "Greed",
            "Redraw",
            "Yolo",
            "Chaos",

            "Hybrid",
            "Fiesta",
            "Cash Out",
            "Castle",
            "Cartel",

            "Champion",
            "Perfectionist",
            "Beaurocrat",
            "Double Lock-In",
        ]

        var testVariantDescriptions = [
            "",
            "Lock 1 Fighter<br>+3 Income",
            "+5 Income",
            "+3x Rerolls<br>+3 Income",
            "+7 Income<br>Fully random roll",
            "+5 Income<br>New roll every wave",

            "Every time you build a fighter, it rerolls",
            "Get gold every time you leak",
            "+21 Gold",
            "+30 Income after Wave 10",
            "+9 income, but -30 income after Wave 10",

            "The first unit you build has +12% attack speed and damage reduction",
            "When you clear a wave, gain 5-19 gold based on wave number",
            "Each wave you don't spend mythium, you gain 6-23 gold based on wave number",
            "Lock 2 Fighters<br>+2 Income",
        ]

        // Super annoying, not sure how to do this inside the iterator
        var onClickFunctions = [
            function () { console.log('variant ' + 0 + ' clicked'); engine.call('OnMastermindVariant', 0) },
            function () { console.log('variant ' + 1 + ' clicked'); engine.call('OnMastermindVariant', 1) },
            function () { console.log('variant ' + 2 + ' clicked'); engine.call('OnMastermindVariant', 2) },
            function () { console.log('variant ' + 3 + ' clicked'); engine.call('OnMastermindVariant', 3) },
            function () { console.log('variant ' + 4 + ' clicked'); engine.call('OnMastermindVariant', 4) },
            function () { console.log('variant ' + 5 + ' clicked'); engine.call('OnMastermindVariant', 5) },
            function () { console.log('variant ' + 6 + ' clicked'); engine.call('OnMastermindVariant', 6) },
            function () { console.log('variant ' + 7 + ' clicked'); engine.call('OnMastermindVariant', 7) },
            function () { console.log('variant ' + 8 + ' clicked'); engine.call('OnMastermindVariant', 8) },
            function () { console.log('variant ' + 9 + ' clicked'); engine.call('OnMastermindVariant', 9) },
            function () { console.log('variant ' + 10 + ' clicked'); engine.call('OnMastermindVariant', 10) },
            function () { console.log('variant ' + 11 + ' clicked'); engine.call('OnMastermindVariant', 11) },
            function () { console.log('variant ' + 12 + ' clicked'); engine.call('OnMastermindVariant', 12) },
            function () { console.log('variant ' + 13 + ' clicked'); engine.call('OnMastermindVariant', 13) },
            function () { console.log('variant ' + 14 + ' clicked'); engine.call('OnMastermindVariant', 14) },
        ]

        for (var i = 1; i <= 10; i++) { // Pre-v11.0
        //for (var i = 1; i <= 14; i++) { // v11.00+

            var selectable = globalState.mastermindVariantEnabled[i] === 0
            var locked = globalState.mastermindVariantEnabled[i] === 1
            var unavailable = globalState.mastermindVariantEnabled[i] === 2
            var shuffling = globalState.mastermindVariantEnabled[i] === 3
            var glowing = globalState.mastermindVariantEnabled[i] === 4
            var disabledInRanked = globalState.mastermindVariantEnabled[i] === 5
            var disabledGeneric = globalState.mastermindVariantEnabled[i] === 6
            var selectableVariant = globalState.mastermindVariantEnabled[i] === 7

            //console.log('selectable: ' + selectable + ', locked: ' + locked + ', unavailable: ' + unavailable + ', globalState.mastermindVariantEnabled[i]: ' + globalState.mastermindVariantEnabled[i]
            //+ ', loading: ' + loading)

            if (unavailable) continue

            if (shuffling) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: "mastermind_variant_loading",
                    displayName: '',
                    description: '',
                    image: "legionselect/MastermindVariantLoading.gif", 
                    //image: "legionselect/MastermindVariant" + getRandomInt(1, 10) + ".png", content: null,
                    //image: "cards/metal/front_bg.png", 
                    content: null,
                    disabled: true,
                    disabledTooltip: '',
                    behavior: null
                })
                continue
            }

            if (glowing) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: "mastermind_variant_glowing",
                    displayName: '',
                    description: '',
                    image: "legionselect/MastermindVariant" + i + ".png",
                    //image: "legionselect/MastermindVariantGlowing.gif",
                    content: null,
                    disabled: true,
                    disabledTooltip: '',
                    behavior: null,
                    extraClasses: 'glowing',
                })
                continue
            }

            if (disabledInRanked) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: "mastermind_variant_" + i,
                    displayName: locName('mastermind_variant_' + i, testVariantNames[i]),
                    description: loc('mastermind_variant_' + i, testVariantDescriptions[i]),
                    image: "legionselect/MastermindVariant" + i + ".png", content: null,
                    disabled: disabledInRanked,
                    disabledTooltip: disabledInRanked ? loc('not_playable_in_ranked', 'Not playable in Ranked') : '',
                    behavior: onClickFunctions[i]
                })
                continue
            }

            if (disabledGeneric) {
                result.push({
                    key: menuUUID++, menuId: menuUUID, name: "mastermind_variant_" + i,
                    displayName: locName('mastermind_variant_' + i, testVariantNames[i]),
                    description: loc('mastermind_variant_' + i, testVariantDescriptions[i]),
                    image: "legionselect/MastermindVariant" + i + ".png", content: null,
                    disabled: disabledGeneric,
                    disabledTooltip: disabledGeneric ? loc('shop_filter_unavailable', 'Unavailable') : '',
                    behavior: onClickFunctions[i]
                })
                continue
            }

            var displayName = locName('mastermind_variant_' + i, testVariantNames[i])
            var description = loc('mastermind_variant_' + i, testVariantDescriptions[i])
            var image = "legionselect/MastermindVariant" + i + ".png"
            var extraClasses = ''

            if (selectableVariant) {
                switch (i) {
                    case 1:
                        displayName = locName('classic_special_mode_2', 'Double Lock-In')
                        description = loc('classic_special_mode_2', 'Double Lock-In')
                        extraClasses = 'glowing'
                        break
                    case 5:
                        displayName = locName('classic_special_mode_1', 'Ordered Chaos')
                        description = loc('classic_special_mode_1', 'Ordered Chaos')
                        extraClasses = 'glowing'
                        break
                    case 7:
                        displayName = locName('classic_special_mode_0', 'Super Fiesta')
                        description = loc('mastermind_variant_7_special', 'When you leak, gain $1 |desc(gold) based on the wave number. Your allies gain 50% of the amount.')
                        extraClasses = 'glowing'
                        break
                    default:
                        console.error('Missing variant configuration for ' + i)
                }
            }

            result.push({
                key: menuUUID++, menuId: menuUUID, name: "mastermind_variant_" + i,
                displayName: displayName,
                description: description,
                image: image, content: null,
                disabled: locked,
                disabledTooltip: locked ? loc('must_be_unlocked_from_shop', 'Must be unlocked from shop') : '',
                behavior: onClickFunctions[i],
                extraClasses: extraClasses
            })
        }

        return result
    }

    getExtraGoldVariantsMenu = function () {
        menuUUID = 0
        var result = []

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "extra_gold_1",
            displayName: loc('allowance_powerup', '+50 gold', [50]),
            description: '',
            image: "legionselect/ExtraGold1.png", content: null,
            behavior: function () { engine.call('OnExtraGoldVariant', 1) }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "extra_gold_2",
            displayName: loc('bonus_per_wave', 'Bonus <img src="hud/img/icons/Mythium.png">10 per wave', ['<img src="hud/img/icons/Mythium.png">10']),
            description: '',
            image: "legionselect/ExtraGold2.png", content: null,
            behavior: function () { engine.call('OnExtraGoldVariant', 2) }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "extra_gold_3",
            displayName: loc('investment_powerup', '+20 income', [20]),
            description: '',
            image: "legionselect/ExtraGold3.png", content: null,
            behavior: function () { engine.call('OnExtraGoldVariant', 3) }
        })


        return result
    }

    menuUUID = 0
    createConfirmConversionMenu = function (itemType) {
        return [
            {
                key: menuUUID++, menuId: menuUUID, name: "Cancel",
                displayName: loc('cancel', 'Cancel'),
                behavior: function () {
                    engine.trigger('hideFullScreenPopup')
                }
            },
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Confirm",
                displayName: loc('confirm', 'Confirm'),
                behavior: function () {
                    //engine.trigger('hideFullScreenPopup')
                    console.log('confirm converting ' + itemType)
                    engine.call('OnConfirmConversion', itemType)
                }
            },
        ]
    }

    menuUUID = 0
    createConfirmDonationMenu = function (itemType) {
        return [
            {
                key: menuUUID++, menuId: menuUUID, name: "Cancel",
                displayName: loc('cancel', 'Cancel'),
                behavior: function () {
                    engine.trigger('hideFullScreenPopup')
                }
            },
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Confirm",
                displayName: loc('confirm', 'Confirm'),
                behavior: function () {
                    engine.trigger('hideFullScreenPopup')
                    console.log('confirm donating ' + itemType)
                    engine.call('OnConfirmDonateCard', itemType)
                }
            },
        ]
    }

    menuUUID = 0
    createConfirmPurchaseMenu = function (itemType, actionOnConfirm) {
        return [
            {
                key: menuUUID++, menuId: menuUUID, name: "Cancel",
                displayName: loc('cancel', 'Cancel'),
                behavior: function () {
                    engine.trigger('hideFullScreenPopup')
                }
            },
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Confirm",
                displayName: loc('confirm', 'Confirm'),
                behavior: function () {
                    engine.trigger('hideFullScreenPopup', true)
                    engine.call('OnClickConfirmPurchase')
                    console.log('confirm purchasing ' + itemType)

                    if (actionOnConfirm != null)
                        actionOnConfirm()
                }
            },
        ]
    }

    createConfirmCancelMenu = function (behaviorIfYes, behaviorIfCancel) {
        var menuUUID = 0
        var menu = [
            {
                key: menuUUID++, menuId: menuUUID, name: "Cancel",
                displayName: loc('cancel', 'Cancel'),
                behavior: behaviorIfCancel
            },
            {
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Confirm",
                displayName: loc('confirm', 'Confirm'),
                behavior: behaviorIfYes
            },
        ]
        return menu
    }

    createConfirmBackMenu = function (behaviorIfYes, behaviorIfBack, currencyType, currencyCost) {
        var menuUUID = 0

        var menu = []

        menu.push({
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: behaviorIfBack
        })

        if (currencyType != null && currencyType.length > 0) {
            menu.push({
                key: menuUUID++, menuId: menuUUID, buttonStyle: 2, name: "Confirm",
                displayName: loc('confirm', 'Confirm'),
                behavior: behaviorIfYes,
                currencyType: currencyType,
                currencyCost: currencyCost
            })
        } else {
            menu.push({
                key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Confirm",
                displayName: loc('confirm', 'Confirm'),
                behavior: behaviorIfYes
            })
        }


        return menu
    }

    getInitialExperienceMenu = function () {
        menuUUID = 0
        var result = []

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "initial_experience_1",
            displayName: locName('initial_experience_1', 'Most Experience'),
            description: loc('initial_experience_1', 'I\'ve already played Legion TD 2'),
            image: "play/AIHard.png", content: null, disabled: false,
            behavior: function () {
                console.log('select initial_experience_1')
                engine.call('OnSelectInitialExperience', 'initial_experience_1')
            }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "initial_experience_2",
            displayName: locName('initial_experience_2', 'Some Experience'),
            description: loc('initial_experience_2', 'I\'ve played competitive games, but not Legion TD 2'),
            image: "play/AIMedium.png", content: null, disabled: false,
            behavior: function () {
                console.log('select initial_experience_2')
                engine.call('OnSelectInitialExperience', 'initial_experience_2')
            }
        })

        result.push({
            key: menuUUID++, menuId: menuUUID, name: "initial_experience_3",
            displayName: locName('initial_experience_3', 'Least Experience'),
            description: loc('initial_experience_3', 'I\'m a beginner!'),
            image: "play/AIBeginner.png", content: null, disabled: false,
            behavior: function () {
                console.log('select initial_experience_3')
                engine.call('OnSelectInitialExperience', 'initial_experience_3')
            }
        })

        return result
    }

    menuUUID = 0
    giftAFriendMenu = [
        {
            key: menuUUID++, menuId: menuUUID, name: "Back",
            displayName: loc('back', 'Back'),
            behavior: null
        },
        {
            key: menuUUID++, menuId: menuUUID, buttonStyle: 1, name: "Search",
            displayName: loc('search', 'Search'),
            behavior: function () { engine.trigger('submitPopupMenuInput') }
        },
    ]
}

loadConfig()
console.log("--- DONE LOADING CONFIG --- ")
