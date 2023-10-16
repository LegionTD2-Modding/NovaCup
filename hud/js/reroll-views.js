// Mastermind rolls window (and Reroll powerup)
// ===============================================================================

var KeepRollsWindow = React.createClass({
    getInitialState: function () {
        return {
            rolls: [],
            enabled: false,
            mulligansRemaining: 0,
            hint: "",
            showExtended: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.showRerollWindow = function (rolls, mulligansRemaining) {
            parent.setState({ enabled: true, rolls: rolls, mulligansRemaining: mulligansRemaining })
            engine.call('OnShowRerollWindow') // Confirm we are able to show the reroll window
        }

        bindings.hideRerollWindow = function () {
            console.log('Hide reroll window')
            parent.setState({ enabled: false })
        }

        bindings.refreshRerollHint = function (hint) {
            parent.setState({ hint: hint })
        }

        bindings.refreshRerollShowExtended = function (enabled) {
            parent.setState({ showExtended: enabled })
        }
    },
    render: function () {
        var parent = this

        if (this.state.rolls.length == 0)
            return null

        if (!this.state.enabled)
            return null

        //var disabled = false
        //if (this.state.rolls.length == 0 || !this.state.enabled)
        //    disabled = true

        var checkedTowerIndexes = []

        var isNarrow = globalState.screenWidth < 1800
        
        var incomeCost = 0
        if (!globalState.shopEnabled) {
            if (this.state.mulligansRemaining == 2)
                incomeCost = 1
            else if (this.state.mulligansRemaining == 1)
                incomeCost = 2
            else
                incomeCost = 0
        }

        var showExtendedTooltips = globalState.alwaysShowExtendedTooltips || parent.state.showExtended

        /* v9.06 trying to fix resetting hud position of roll window */
        var topOffset = globalState.screenHeight > 1440 ? '-800px' : '-500px'
        //var topOffset = 'unset' /* pre-v9.06 */

        return (
            React.createElement(Module, { moduleId: 'rerollWindow', width: 746, height: 200, defaultLeft: isNarrow ? '0px' : '0px', defaultTop: topOffset, defaultBottom: '320px', defaultRight: '0', simple: true },
                //!disabled && React.createElement('div', { id: 'RerollWindow', className: 'wide' },
                React.createElement('div', { id: 'RerollWindow', className: 'wide' },
                    React.createElement('ul', { className: '' },
                        this.state.rolls.map(function (roll, i) {
                            if (roll.isChecked)
                                checkedTowerIndexes.push(i + 1)

                            var hasRole = roll.role != null && roll.role.length > 0

                            return React.createElement('li', {
                                key: roll.key,
                                className: 'simple-tooltip',
                                onMouseDown: function (e) {
                                    var newRolls = parent.state.rolls.slice()
                                    if (newRolls[i].isChecked != null)
                                        newRolls[i].isChecked = !newRolls[i].isChecked
                                    else
                                        newRolls[i].isChecked = true
                                    parent.setState({ rolls: newRolls })

                                    var checkedUnitTypes = []
                                    newRolls.map(function (roll, i) {
                                        if (roll.isChecked) {
                                            checkedUnitTypes.push(roll.unitType)
                                        }
                                    })

                                    engine.call("OnRefreshRerollHint", checkedUnitTypes)
                                    engine.call("OnClickRollCheckbox")
                                }
                            },
                                React.createElement('img', { className: 'icon' + (roll.isChecked ? ' selected' : ''), src: 'hud/img/' + roll.icon, onMouseEnter: function () { engine.call("OnMouseOverRoll") } }),
                                hasRole && React.createElement('div', { className: 'action-role' }, React.createElement('img', { src: 'hud/img/small-icons/' + roll.role + '.png' })),
                                React.createElement('div', { className: 'checkbox-box' },
                                    roll.isChecked && React.createElement('img', { className: 'checkbox-icon', src: 'hud/img/ui/accept-check.png' })
                                ),
                                React.createElement('div', { className: 'types' },
                                    React.createElement('img', { className: 'small-icon', src: 'hud/img/' + roll.attackIcon }),
                                    React.createElement('img', { className: 'small-icon', src: 'hud/img/' + roll.defenseIcon })
                                ),
                                React.createElement('span', {
                                    className: 'tooltiptext wide', style: {
                                        marginBottom: '16px'
                                    }
                                },
                                    React.createElement('div', {}, loc('keep', "Keep " + roll.name, [roll.name])),
                                    React.createElement('div', {
                                        dangerouslySetInnerHTML: {
                                            __html: roll.subheader
                                        }
                                    }),
                                    !showExtendedTooltips && React.createElement('div', {
                                        style: { color: '#94d4e5' },
                                        dangerouslySetInnerHTML: {
                                            __html: roll.description
                                        }
                                    }),
                                    showExtendedTooltips && React.createElement('div', {
                                        style: { color: '#94d4e5' },
                                        dangerouslySetInnerHTML: {
                                            __html: roll.longDescription
                                        }
                                    })
                                )
                            )
                        })
                    ),
                    React.createElement('table', { style: { marginTop: '-4px', width: '100%' } },
                        // v8.03.10 replaced td with div due to inconsistencies between HTML and Ingame
                        (checkedTowerIndexes.length == 6) && React.createElement('div', {
                            className: 'button accept-rolls' + (checkedTowerIndexes.length > 0 ? ' em' : ''),
                            onMouseDown: function (e) {
                                console.log("Keep with indexes: " + checkedTowerIndexes)
                                engine.call('OnSubmitKeep', checkedTowerIndexes)
                                engine.trigger('hideRerollWindow')
                            }
                        },
                            React.createElement('div', {}, loc('keep_these_fighters', "Keep these fighters"))
                        ),
                        (checkedTowerIndexes.length < 6) && React.createElement('td', {
                            className: 'button disabled accept-rolls'
                        },
                            React.createElement('div', {}, loc('you_must_keep_fighters', "You must keep 6 fighters (You have only " + checkedTowerIndexes.length + ")", [checkedTowerIndexes.length]))
                        ),
                        (checkedTowerIndexes.length > 6) && React.createElement('td', {
                            className: 'button disabled accept-rolls'
                        },
                            React.createElement('div', {}, loc('you_must_keep_only_fighters', "You must keep only 6 fighters (You have " + checkedTowerIndexes.length + ")", [checkedTowerIndexes.length]))
                        )//,
                        // v8.03.10 just disable this UI for now since we never want people rerolling on wave 1
                        // and this is causing some issues for UHD UI
                        //this.state.mulligansRemaining > 0 && React.createElement('td',
                        //    {
                        //        className: 'simple-tooltip',
                        //    },
                        //    React.createElement('div', {
                        //        className: 'button mulligan',
                        //        onMouseDown: function (e) {
                        //            console.log('clicked mulligan')
                        //            engine.call('OnMulligan')
                        //        }
                        //    },
                        //        React.createElement('img', { style: { width: '33px' }, src: 'hud/img/icons/Dice.png' }),
                        //        incomeCost > 0 && React.createElement('span', {
                        //            className: 'tooltiptext wide',
                        //            dangerouslySetInnerHTML: {
                        //                __html: loc('mulligan', "Roll new fighters (<img class='tooltip-icon' src='hud/img/icons/Income.png'> -" + incomeCost + " income)", [incomeCost])
                        //            }
                        //        }),
                        //        incomeCost == 0 && React.createElement('span', {
                        //            className: 'tooltiptext wide',
                        //            dangerouslySetInnerHTML: {
                        //                __html: loc('mulligan_free', "Roll new fighters")
                        //            }
                        //        })
                        //    )
                        //)//,
                        // v8.01 just hide this now that we don't have any mastermind variants with redraws anymore
                        //this.state.mulligansRemaining == 0 && React.createElement('td',
                        //    {
                        //        className: 'simple-tooltip',
                        //    },
                        //    React.createElement('div', {
                        //        className: 'button disabled mulligan',
                        //    },
                        //        React.createElement('img', { style: { width: '33px' }, src: 'hud/img/icons/Dice.png' }),
                        //        React.createElement('span', { className: 'tooltiptext' },
                        //            loc('no_more_mulligan', "Cannot roll new fighters", [incomeCost])
                        //        )
                        //    )
                        //)
                    ),
                    React.createElement('div', {
                        className: 'hint',
                        dangerouslySetInnerHTML: {
                            __html: parent.state.hint
                        }
                    })
                )
            )
        )
    }
})

var ReadyButton = React.createClass({
    getInitialState: function () {
        return {
            text: "",
            enabled: false,
            active: false,
            message: "",
            readyPlayers: 0,
            totalPlayers: 0,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.showReadyButton = function (text) {
            parent.setState({ enabled: true, active: false, text: text })
        }

        bindings.hideReadyButton = function () {
            parent.setState({ enabled: false, active: false })
        }

        bindings.updateReadyPlayers = function (readyPlayersInfo) {
            parent.setState({
                message: readyPlayersInfo.message,
                active: readyPlayersInfo.active,
                readyPlayers: readyPlayersInfo.readyPlayers,
                totalPlayers: readyPlayersInfo.totalPlayers,
            })
        }
    },
    render: function () {
        var parent = this

        if (!this.state.enabled)
            return null

        var isNarrow = globalState.screenWidth < 1800
        var isUHD = globalState.screenWidth >= 1921

        return (
            React.createElement(Module, { moduleId: 'ReadyButton', width: 552, height: 36, defaultLeft: 'unset', defaultTop: 'unset', defaultBottom: '-24px', defaultRight: '0' },
                React.createElement('div', { id: 'ReadyButton' },
                    React.createElement('div', {
                        className: 'content',
                        dangerouslySetInnerHTML: {
                            __html: this.state.text
                        }
                    }),
                    React.createElement('div', {
                        className: 'button em' + (parent.state.active ? ' pressed' : ''),
                        style: {
                            position: 'absolute',
                            left: isUHD ? '200px' : '200px',
                            right: isUHD ? '200px' : '200px',
                            bottom: '0',
                        },
                        onMouseDown: function (e) {
                            if (!parent.state.active) {
                                engine.call('OnReady')
                                parent.setState({ active: true, })
                            } else {
                                engine.call('OnReadyCancel')
                                parent.setState({ active: false, })
                            }
                        }
                    },
                        React.createElement('span', {}, loc('ready', 'Ready') + " (" + parent.state.readyPlayers + "/" + parent.state.totalPlayers + ")")
                    ),
                    parent.state.active && React.createElement('span', {
                        className: 'message',
                        dangerouslySetInnerHTML: {
                            __html: this.state.message
                        }
                    })
                )
            )
        )
    }
})