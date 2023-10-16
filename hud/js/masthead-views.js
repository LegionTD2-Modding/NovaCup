// King bars, wave counter, etc. (the thing at the top of the screen in-game)
// ===============================================================================

var Masthead = React.createClass({
    propTypes: {
        theme: React.PropTypes.string
    },
    render: function () {
        return (
            React.createElement('div', { id: 'Masthead', className: this.props.theme },
                React.createElement(Kings, {}),
                React.createElement(Wave, {})
            )
        )
    }
})

var Kings = React.createClass({
    getInitialState: function () {
        return {
            showLeftKing: false,
            leftKingName: "",
            leftKingDescription: "",
            leftKingImage: "icons/NoIcon.png",
            leftKingHp: 0,
            leftKingMaxHp: 0,
            leftKingTooltip: false,
            leftKingDamaged: false,
            leftKingIsGreen: false,
            showRightKing: false,
            rightKingName: "",
            rightKingDescription: "",
            rightKingImage: "icons/NoIcon.png",
            rightKingHp: 0,
            rightKingMaxHp: 0,
            rightKingTooltip: false,
            rightKingDamaged: false,
            rightKingIsGreen: false,
            leftGold: 0,
            rightGold: 0,
            leftKingUpgrades: { attack: 0, regen: 0, spell: 0 },
            rightKingUpgrades: { attack: 0, regen: 0, spell: 0 },
        }
    },
    leftKingDamagedTimeout: null,
    rightKingDamagedTimeout: null,
    componentWillMount: function () {
        var parent = this;
        bindings.enableLeftKing = function (enabled) { parent.setState({ showLeftKing: enabled }) }
        bindings.setLeftKingProperties = function (properties) {
            parent.setState({
                showLeftKing: true,
                leftKingName: properties.name,
                leftKingDescription: properties.description,
                leftKingMaxHp: properties.maxHp,
                leftKingImage: properties.image,
                leftKingIsGreen: properties.isGreen
            })
        }
        bindings.refreshUnitHp[2] = function (value) {
            var damaged = value < parent.state.leftKingHp && (globalState.hudTheme != 'night')
            if (damaged) {
                if (parent.leftKingDamagedTimeout)
                    clearTimeout(parent.leftKingDamagedTimeout)
                parent.leftKingDamagedTimeout = setTimeout(function () {
                    parent.setState({ leftKingDamaged: false })
                }, 2000)
                parent.setState({ showLeftKing: true, leftKingHp: value, leftKingDamaged: true })
                engine.call('OnLeftKingDamaged') // v8.03
            } else {
                parent.setState({ showLeftKing: true, leftKingHp: value })
            }

            // Hot fix for if the max hp wasn't initialized properly
            if (parent.state.leftKingMaxHp == 0)
                parent.setState({ leftKingMaxHp: parent.state.leftKingHp })
        }
        bindings.enableRightKing = function (enabled) { parent.setState({ showRightKing: enabled }) }
        bindings.setRightKingProperties = function (properties) {
            parent.setState({
                showRightKing: true,
                rightKingName: properties.name,
                rightKingDescription: properties.description,
                rightKingMaxHp: properties.maxHp,
                rightKingImage: properties.image,
                rightKingIsGreen: properties.isGreen
            })
        }
        bindings.refreshUnitHp[3] = function (value) {
            var damaged = value < parent.state.rightKingHp && (globalState.hudTheme != 'night')
            if (damaged) {
                if (parent.rightKingDamagedTimeout)
                    clearTimeout(parent.rightKingDamagedTimeout)
                parent.rightKingDamagedTimeout = setTimeout(function () {
                    parent.setState({ rightKingDamaged: false })
                }, 2000)
                parent.setState({ showRightKing: true, rightKingHp: value, rightKingDamaged: true })
                engine.call('OnRightKingDamaged') // v8.03
            } else {
                parent.setState({ showRightKing: true, rightKingHp: value })
            }
        }
        bindings.refreshTeamGold = function (leftGold, rightGold) {
            parent.setState({ leftGold: leftGold, rightGold: rightGold })
        }
        bindings.refreshKingUpgrades = function (leftKingUpgrades, rightKingUpgrades) {
            //console.log('refreshKingUpgrades leftKingUpgrades: ' + leftKingUpgrades + ', rightKingUpgrades: ' + rightKingUpgrades)
            parent.setState({ leftKingUpgrades: leftKingUpgrades, rightKingUpgrades: rightKingUpgrades })
        }
        bindings.refreshLeftKingMaxHp = function (hp) {
            parent.setState({ leftKingMaxHp: hp })
        }
        bindings.refreshRightKingMaxHp = function (hp) {
            parent.setState({ rightKingMaxHp: hp })
        }
    },
    getLeftKing: function () {
        var parent = this;
        var leftKingPercentHp = Math.min(1, (this.state.leftKingHp / this.state.leftKingMaxHp))
        //console.log('getLeftKing leftKingPercentHp: ' + leftKingPercentHp
        //    + ", based on leftKingHp: " + this.state.leftKingHp + ", leftKingMaxHp: " + this.state.leftKingMaxHp)

        if (this.state.showLeftKing) {
            var percentHp = Math.min((this.state.leftKingMaxHp > 0) ? (this.state.leftKingHp / this.state.leftKingMaxHp) : 0, 1)
            return (
                React.createElement('div', {
                    style: { position: 'absolute', left: '-4px' },
                    onMouseOver: function () { parent.setState({ leftKingTooltip: true }) },
                    onMouseLeave: function () { parent.setState({ leftKingTooltip: false }) },
                    onMouseDown: function (e) {
                        if (e.nativeEvent.which == 3 || globalState.isAltHeld) {
                            console.log("OnPingLeftKing")
                            engine.call('OnPingLeftKing')
                            return // v8.04 no longer center camera on the king
                        }
                        engine.trigger('selectLeftKing')
                    }
                },
                    this.state.leftKingDamaged && React.createElement('div', { id: 'LeftKingGlow' }),
                    React.createElement('div', { id: 'LeftKingGlowCover' }), // v7.05 note this seems to do nothing?
                    React.createElement('img', {
                        src: 'hud/img/' + (this.state.leftKingImage ? this.state.leftKingImage : "icons/NoIcon.png"),
                        style: {
                            transform: 'scaleX(-1)',
                            marginRight: '11px',
                        }
                    }),
                    React.createElement('div', { className: "progress-container" },
                        React.createElement('div', {
                            className: "progress-bar hp" + (this.state.leftKingIsGreen ? ' green' : ''), style: {
                                width: (100 * percentHp) + "%"
                            }
                        }),
                        React.createElement('span', { className: 'value', style: { textAlign: 'left', marginLeft: '8px' } }, Math.ceil(leftKingPercentHp * 100).toFixed(0) + "%"),
                        //React.createElement('span', { className: 'value' }, this.state.leftKingHp + "/" + this.state.leftKingMaxHp)
                        React.createElement('div', {
                            className: "upgrades-container",
                            style: {
                                backgroundImage: 'url("hud/img/hudv2/kingupgrades_bar_spell.png")',
                                width: (((this.state.leftKingUpgrades.spell) / 30) * 128) + 'px',
                                //filter: 'hue-rotate(215deg)',
                            }
                        },
                            ""
                        ),
                        React.createElement('div', {
                            className: "upgrades-container",
                            style: {
                                backgroundImage: 'url("hud/img/hudv2/kingupgrades_bar_regen.png")',
                                width: (((this.state.leftKingUpgrades.regen) / 30) * 128) + 'px',
                                //filter: 'hue-rotate(25deg)',
                                right: (this.state.leftKingUpgrades.spell * 128 / 30) + 'px' 
                            }
                        },
                            ""
                        ),
                        React.createElement('div', {
                            className: "upgrades-container",
                            style: {
                                backgroundImage: 'url("hud/img/hudv2/kingupgrades_bar_attack.png")',
                                width: (((this.state.leftKingUpgrades.attack) / 30) * 128) + 'px',
                                //filter: 'hue-rotate(-65deg)',
                                right: ((this.state.leftKingUpgrades.regen + this.state.leftKingUpgrades.spell) * 128 / 30) + 'px'
                            }
                        },
                            ""
                        )
                    ),
                    React.createElement(Tooltip, {
                        header: this.state.leftKingName,
                        text: this.state.leftKingDescription,
                        enabled: this.state.leftKingTooltip && this.state.leftGold == 0,
                        valign: "below",
                        align: "left",
                        flex: true
                    }),
                    this.state.leftGold > 0 && React.createElement('div', {
                        className: "gold-advantage simple-tooltip",
                        style: { position: 'absolute', left: '70px', top: '48px' }
                    },
                        React.createElement('img', {
                            className: 'victory-icon', src: 'hud/img/small-icons/small-victory.png',
                            style: {
                                marginRight: '0px',
                                marginLeft: '6px'
                            }
                        }),
                        React.createElement('span', { className: 'value' }, this.state.leftGold + '%'), // v9.03
                        React.createElement('span', { className: 'tooltiptext' },
                            loc('win_probability', 'Win probability is based off of power score, king hp, and king upgrades')
                        )
                        //this.state.leftGold > 1000 && React.createElement('span', { className: 'value' }, (this.state.leftGold / 1000).toFixed(1) + 'k'),
                        //this.state.leftGold <= 1000 && React.createElement('span', { className: 'value' }, this.state.leftGold)
                    )
                )
            )
        } else {
            return null
        }
    },
    getRightKing: function () {
        var parent = this;
        var rightKingPercentHp = Math.min(1, (this.state.rightKingHp / this.state.rightKingMaxHp))

        //var rightKingCounter = []
        //for (var i = 0; i < this.state.rightKingUpgrades; i++) {
        //    if (i % 3 == 0)
        //        rightKingCounter.push(React.createElement('img', { className: 'king-upgrade-counter extra-space', src: 'hud/img/hudv2/kingupgrade_counter.png' }))
        //    else
        //        rightKingCounter.push(React.createElement('img', { className: 'king-upgrade-counter', src: 'hud/img/hudv2/kingupgrade_counter.png' }))
        //}

        if (this.state.showRightKing) {
            var percentHp = Math.min((this.state.rightKingMaxHp > 0) ? (this.state.rightKingHp / this.state.rightKingMaxHp) : 0, 1)
            return (
                React.createElement('div', {
                    style: { position: 'absolute', right: '-4px' },
                    onMouseOver: function () { parent.setState({ rightKingTooltip: true }) },
                    onMouseLeave: function () { parent.setState({ rightKingTooltip: false }) },
                    onMouseDown: function (e) {
                        if (e.nativeEvent.which == 3 || globalState.isAltHeld) {
                            console.log("OnPingRightKing")
                            engine.call('OnPingRightKing')
                            return // v8.04 no longer center camera on the king
                        }
                        engine.trigger('selectRightKing')
                    }
                },
                    this.state.rightKingDamaged && React.createElement('div', { id: 'RightKingGlow' }),
                    React.createElement('div', { id: 'RightKingGlowCover' }), // v7.05 note this seems to do nothing?
                    React.createElement('div', { className: "progress-container medium-bar" },
                        React.createElement('div', {
                            className: "progress-bar hp-flipped" + (this.state.rightKingIsGreen ? ' green' : ''), style: {
                                width: (100 * percentHp) + "%"
                            }
                        }),
                        React.createElement('span', { className: 'value', style: { textAlign: 'right', marginLeft: '-8px' } }, Math.ceil(rightKingPercentHp * 100).toFixed(0) + "%"),
                        //React.createElement('span', { className: 'value' }, this.state.rightKingHp + "/" + this.state.rightKingMaxHp)
                        React.createElement('div', {
                            className: "upgrades-container right",
                            style: {
                                backgroundImage: 'url("hud/img/hudv2/kingupgrades_bar_spell.png")',
                                width: (((this.state.rightKingUpgrades.spell) / 30) * 128) + 'px',
                                left: ((this.state.rightKingUpgrades.attack + this.state.rightKingUpgrades.regen) * 128 / 30) + 'px'
                                //filter: 'hue-rotate(215deg)',
                            }
                        },
                            ""
                        ),
                        React.createElement('div', {
                            className: "upgrades-container right",
                            style: {
                                backgroundImage: 'url("hud/img/hudv2/kingupgrades_bar_regen.png")',
                                width: (((this.state.rightKingUpgrades.regen) / 30) * 128) + 'px',
                                //filter: 'hue-rotate(25deg)',
                                left: (this.state.rightKingUpgrades.attack * 128 / 30) + 'px'
                            }
                        },
                            ""
                        ),
                        React.createElement('div', {
                            className: "upgrades-container right",
                            style: {
                                backgroundImage: 'url("hud/img/hudv2/kingupgrades_bar_attack.png")',
                                width: (((this.state.rightKingUpgrades.attack) / 30) * 128) + 'px',
                                //filter: 'hue-rotate(-65deg)',
                            }
                        },
                            ""
                        )
                    ),
                    React.createElement('img', {
                        src: 'hud/img/' + (this.state.rightKingImage ? this.state.rightKingImage : "icons/NoIcon.png"),
                        style: {
                            marginLeft: '11px',
                        }
                    }),
                    React.createElement(Tooltip, {
                        header: this.state.rightKingName,
                        text: this.state.rightKingDescription,
                        enabled: this.state.rightKingTooltip && this.state.rightGold == 0,
                        valign: "below",
                        align: "right",
                        flex: true
                    }),
                    this.state.rightGold > 0 && React.createElement('div', {
                        className: "gold-advantage simple-tooltip",
                        style: { position: 'absolute', right: '44px', top: '48px' }
                    },
                        React.createElement('img', {
                            className: 'victory-icon', src: 'hud/img/small-icons/small-victory.png',
                            style: {
                                marginRight: '0px',
                                marginLeft: '-2px'
                            }
                        }),
                        React.createElement('span', { className: 'value' }, this.state.rightGold + '%'), // v9.03
                        React.createElement('span', { className: 'tooltiptext' },
                            loc('win_probability', 'Win probability is based off of power score, king hp, and king upgrades')
                        )
                        //this.state.rightGold > 1000 && React.createElement('span', { className: 'value' }, (this.state.rightGold / 1000).toFixed(1) + 'k'),
                        //this.state.rightGold <= 1000 && React.createElement('span', { className: 'value' }, this.state.rightGold)
                    )
                )
            )
        } else {
            return null
        }
    },
    render: function () {
        var parent = this;
        return (
            React.createElement('div', { className: 'Kings' },
                this.getLeftKing(),
                this.getRightKing()
            )
        )
    }
})

var waveTimeout
var Wave = React.createClass({
    getInitialState: function () {
        return {
            time: 0,
            maxTime: 0,
            image: "icons/NoIcon.png",
            text: "",
            subText: "",
            doneText: "",
            doneSubText: "",
            westEnemies: 0,
            eastEnemies: 0,
            tooltip: false,
            arrowText: '',
            arrowButtonText: '',
            mastheadText: '',
            mastheadTextShow: false,
            mastheadBuildCursorX: -1,
            mastheadBuildCursorZ: -1,
            mastheadWavesTooltipText: '',
            mastheadWaves: [],
            pauseValue: 0
        }
    },
    componentWillMount: function () {
        var parent = this;
        bindings.refreshWaveTime = function (value) {
            parent.setState({
                time: value
            })
        }
        bindings.startWaveTimer = function (properties) {
            parent.setState({
                time: properties.time,
                maxTime: properties.maxTime,
                image: properties.image,
                text: properties.text,
                subText: properties.subText,
                doneText: properties.doneText,
                doneSubText: properties.doneSubText,
                tooltip: false,
            })

            // Autoshow
            //engine.trigger('setEnableWaveInfoTooltip', true)
            //setTimeout(function () { engine.trigger('setEnableWaveInfoTooltip', false) }, 5000)
        }
        bindings.setEnableWaveInfoTooltip = function (enabled) {
            parent.setState({
                tooltip: enabled
            })
        }
        bindings.refreshWestEnemiesRemaining = function (value) { parent.setState({ westEnemies: value }) }
        bindings.refreshEastEnemiesRemaining = function (value) { parent.setState({ eastEnemies: value }) }
        bindings.renderTutorialArrowText['timer'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowButtonText: buttonText })
        }
        bindings.refreshMastheadText = function (value) {
            parent.setState({
                mastheadText: value,
                mastheadTextShow: value.length > 0
            })

            if (value.length > 0)
                setTimeout(function () {
                    parent.setState({
                        mastheadTextShow: false
                    })
                }, 1000)

        }
        bindings.refreshMastheadBuildCursorXy = function (x, z) { parent.setState({ mastheadBuildCursorX: x, mastheadBuildCursorZ: z }) }
        // v8.05
        bindings.refreshMastheadWavesBar = function (waves) {
            parent.setState({ mastheadWaves: waves })
        }

        // v9.09
        // 0 = hide button
        // 1 = unpaused, show button
        // 2 = paused, show button
        bindings.refreshMastheadPauseValue = function (value) {
            parent.setState({ pauseValue: value })
        }
    },
    render: function () {
        var parent = this

        var currentWaveTooltip = ''

        return (
            React.createElement('div', {},
                React.createElement('div', {
                    className: 'Wave',
                    onMouseEnter: function () { parent.setState({ tooltip: true }) },
                    onMouseLeave: function () { parent.setState({ tooltip: false }) }
                },
                    React.createElement('div', { className: 'waves-bar ' },
                        parent.state.mastheadWaves.map(function (entry, index) {
                            var isCurrentWave = entry.waveNumber == globalState.waveNumber
                            var isInactive = entry.waveNumber < globalState.waveNumber
                            //console.log('entry.waveNumber: ' + entry.waveNumber + ', globalState.waveNumber: ' + globalState.waveNumber + ', --> isCurrentWave: ' + isCurrentWave
                            //    + ', isInactive: ' + isInactive)

                            if (isCurrentWave)
                                currentWaveTooltip = entry.tooltipText

                            return React.createElement('span', {
                                className: 'waves-bar-icon-container' + (isUnityHost ? ' coherent-hack' : '') + (isCurrentWave ? ' active' : '')
                                    + (isInactive ? ' inactive' : ''),
                                onMouseEnter: function () {
                                    parent.setState({
                                        mastheadWavesTooltipText: entry.tooltipText
                                        // Maybe QoL could add a tooltip here? but it feels noisy for everyone who already learned it
                                        //mastheadWavesTooltipText: entry.tooltipText + '<br><br>Left click: expecting a send<br>Right click: wants to send'
                                    })
                                },
                                onMouseLeave: function () {
                                    parent.setState({
                                        mastheadWavesTooltipText: ''
                                    })
                                },
                                onMouseDown: function (e) {
                                    console.log('OnPingMastheadWave ' + entry.waveNumber + ', clickType: ' + e.nativeEvent.which)
                                    engine.call('OnPingMastheadWave', entry.waveNumber, e.nativeEvent.which)
                                }
                            },
                                React.createElement('img', { className: 'waves-bar-icon', src: 'hud/img/' + entry.icon }),
                                entry.mythiumReceived >= 0 && React.createElement('span', {
                                    className: 'waves-bar-number',
                                    style: {
                                        right: (entry.mythiumReceived < 1000) ? '24px' : ''
                                    }
                                },
                                    // v8.05.ptr6 let's try no icon, so we don't crowd high numbers too much
                                    // we have precedent for having blue mythium text with no icon in chat
                                    //React.createElement('img', { className: 'waves-bar-number-icon', src: 'hud/img/icons/Mythium.png' }),
                                    (entry.mythiumReceived < 1000) && entry.mythiumReceived,
                                    (entry.mythiumReceived >= 1000) && ((entry.mythiumReceived / 1000).toFixed(1) + 'k')
                                )
                            )
                        })
                    ),
                    (this.state.pauseValue > 0) && React.createElement('img', {
                        className: 'pause',
                        src: 'hud/img/small-icons/' + (this.state.pauseValue == 1 ? 'pause.png' : 'unpause.png'),
                        onMouseDown: function (e) {
                            console.log('click pause/unpause')

                            engine.call('OnTogglePauseGame')

                            if (isBrowserTest) {
                                engine.trigger('refreshMastheadPauseValue', (parent.state.pauseValue == 1) ? 2 : 1)
                            }
                        }
                    }),
                    React.createElement('div', {
                        className: 'waves-shield',
                        onMouseDown: function (e) {
                            if (e.nativeEvent.which == 3 || globalState.isAltHeld) {
                                console.log("OnPingWave")
                                engine.call('OnPingWave')
                            } else {

                                // v2.25: show both of them
                                var shouldEnable = true
                                if (globalState.isGuideWavesOpen || globalState.isTypeChartOpen) {
                                    shouldEnable = false
                                }
                                engine.trigger('enableGuideAttackTypes', shouldEnable)
                                engine.trigger('enableGuideWaves', shouldEnable)
                                engine.call('OnWaveTimerClicked')

                                //engine.trigger('enableGuideWaves', true)
                            }
                        }
                    },
                        React.createElement('div', { className: 'label' },
                            (this.state.time > 0) && React.createElement('div', { className: 'time' }, this.state.time.toString().toTimeString()),
                            (this.state.time == 0) && React.createElement('div', {
                                className: 'time',
                                dangerouslySetInnerHTML: { __html: this.state.doneText }
                            }),
                            React.createElement('div', {
                                className: 'text',
                                dangerouslySetInnerHTML: { __html: (this.state.time > 0) ? this.state.text : '' } // this.state.doneSubText }
                            })
                        ),
                        this.state.time == 0 && React.createElement('div', { className: 'hudtext' },
                            React.createElement('img', { src: 'hud/img/small-icons/enemy.png' }),
                            React.createElement('div', { className: 'left' + (this.state.westEnemies > 0 ? '' : ' hidden'), },
                                this.state.westEnemies
                            ),
                            React.createElement('div', { className: 'right' + (this.state.eastEnemies > 0 ? '' : ' hidden'), },
                                this.state.eastEnemies
                            )
                        ),
                        // v8.05 disabled in favor of masthead waves bar
                        //React.createElement('img', { src: "hud/img/" + this.state.image, className: 'wave-image' }),
                        React.createElement(Tooltip, {
                            header: "",
                            //text: this.state.mastheadWavesTooltipText ? this.state.mastheadWavesTooltipText : this.state.subText,
                            text: this.state.mastheadWavesTooltipText ? this.state.mastheadWavesTooltipText : currentWaveTooltip,
                            enabled: this.state.tooltip,
                            image: "", // this.state.image,
                            valign: 'below',
                            align: 'center',
                            flex: true
                        }),
                        /* idk why this margin is different ingame than in view. very annoying to test. */
                        parent.state.mastheadBuildCursorX >= 0 && parent.state.mastheadBuildCursorZ >= 0 && React.createElement('div', {
                            style: {
                                margin: '26px auto',
                                background: 'rgba(0, 0, 0, 0.3)',
                                color: 'rgba(255, 255, 255, 0.8)',
                                textShadow: '0px 0px 3px black',
                                width: '80px'
                            }
                        },
                            parent.state.mastheadBuildCursorX.toFixed(1) + ", " + parent.state.mastheadBuildCursorZ.toFixed(1)
                        ),
                        React.createElement(
                            VelocityComponent,
                            GetAnimationPreset5(parent.state.mastheadTextShow, 0, 0),
                            React.createElement('div', {
                                className: 'masthead-text',
                                style: { marginTop: '80px' },
                                dangerouslySetInnerHTML: {
                                    __html: parent.state.mastheadText
                                }
                            })
                        )
                    )
                ),
                (parent.state.arrowText) &&
                    React.createElement('div', {
                        className: 'arrow-text',
                        style: {
                            top: '180px',
                            left: '100px',
                            width: '300px'
                        }
                    },
                        React.createElement('div', {
                            dangerouslySetInnerHTML: {
                                __html: parent.state.arrowText
                            }
                        }),
                        React.createElement('div', {
                            className: 'arrow-image up',
                            style: {
                                top: '-150px',
                                left: '130px'
                            }
                        }),
                        (parent.state.arrowButtonText) &&
                            React.createElement('div', {
                                className: 'button em',
                                dangerouslySetInnerHTML: {
                                    __html: parent.state.arrowButtonText
                                },
                                style: {
                                    marginTop: '24px',
                                    //fontSize: '24px'
                                },
                                onMouseDown: function (e) {
                                    engine.call('OnTutorialContinuePressed')
                                    parent.setState({ arrowText: '', arrowButtonText: '' })
                                }
                            })
                    )
            )
        )
    }
})


var SubAnnouncement = React.createClass({
    width: 552,
    height: 36,
    verticalMargin: 0,
    getInitialState: function () {
        return {
            text: "",
            preset: "income",
            enabled: false,
            hudenabled: true,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshSubAnnouncement = function (text, preset, bottom) {
            var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160

            var verticalMargin = uhd ? -17 : 0
            if (bottom)
                verticalMargin = uhd ? 165 : 130

            // HACKY image fix
            text = text.replace('Gold.png', 'Gold32.png')
            text = text.replace('Mythium.png', 'Mythium.png')

            parent.setState({ text: text, preset: preset, verticalMargin: verticalMargin })
        }

        bindings.enableHud = function (enabled) {
            parent.setState({ hudenabled: enabled })
        }

        bindings.refreshSubAnnouncementEnabled = function (enabled) {
            parent.setState({ enabled: enabled })

            if (enabled && parent.refs.subAnnouncement && parent.state.hudenabled) {
                var fxOffset = getAbsoluteOffset(parent.refs.subAnnouncement)
                fxOffset.x += parent.width / 2
                fxOffset.y += parent.height / 2

                var effectType = ''
                switch (parent.state.preset) {
                    case 'income':
                        effectType = 'big_income_effect_id'
                        break
                    case 'mythium':
                        effectType = 'incoming_mercenaries_effect_id'
                        break
                }

                if (effectType != '')
                    engine.call('OnCreateVFX', effectType, fxOffset.x, fxOffset.y + parent.state.verticalMargin)
            }
        }
    },
    render: function () {
        var parent = this

        var isNarrow = globalState.screenWidth < 1800
        var isUHD = globalState.screenWidth >= 1921

        return (
            React.createElement(Module, {
                moduleId: 'SubAnnouncement', width: parent.width, height: parent.height, defaultLeft: 'unset', defaultTop: 'unset', defaultBottom: '-22px', defaultRight: '0',
                unclickable: true
            },
                React.createElement(
                    VelocityComponent,
                    GetAnimationFade(parent.state.enabled, 200, 300),
                    React.createElement('div', {
                    },
                        React.createElement('div', {
                            id: 'SubAnnouncement', ref: 'subAnnouncement', style: {
                                marginTop: parent.state.verticalMargin + 'px'
                            }
                        },
                            React.createElement('div', {
                                className: 'content',
                                dangerouslySetInnerHTML: {
                                    __html: this.state.text
                                }
                            })
                        )
                    )
                )
            )
        )
    }
})

var Announcement = React.createClass({
    getInitialState: function () {
        return {
            text: "",
            preset: "defend",
            enabled: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshAnnouncement = function (text, preset) {
            parent.setState({ text: text, preset: preset })
        }

        bindings.refreshAnnouncementEnabled = function (enabled) {
            parent.setState({ enabled: enabled })
        }
    },
    render: function () {
        var parent = this

        var isNarrow = globalState.screenWidth < 1800
        var isUHD = globalState.screenWidth >= 1921

        var topImage = 'announcement/' + this.state.preset + '/top.png'
        var bottomImage = 'announcement/' + this.state.preset + '/bottom.png'
        
        return (
            React.createElement(Module, {
                moduleId: 'Announcement', width: 552, height: 36, defaultLeft: 'unset', defaultTop: 'unset', defaultBottom: '-40px', defaultRight: '0',
                unclickable: true
            },
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(parent.state.enabled, 0, -40),
                    React.createElement('div', {
                    },
                        React.createElement('div', { id: 'Announcement' },
                            React.createElement('div', {},
                                React.createElement('img', { src: 'hud/img/' + topImage, style: { width: '300px' } })
                            ),
                            React.createElement('div', {
                                className: 'content',
                                dangerouslySetInnerHTML: {
                                    __html: this.state.text
                                }
                            }),
                            React.createElement('div', {},
                                React.createElement('img', { src: 'hud/img/' + bottomImage, style: { width: '300px' } })
                            )
                        )
                    )
                )
            )
        )
    }
})