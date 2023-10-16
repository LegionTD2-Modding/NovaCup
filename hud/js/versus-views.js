// Versus window (v10.00)
// =============================================================================================

var VersusApp = React.createClass({
    getInitialState: function () {
        return {
            enabled: false,
            versusInfo: []
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.enableVersus = function (enabled) {
            parent.setState({ enabled: enabled })
        }
        bindings.refreshVersusInfo = function (versusInfo) {
            parent.setState({ versusInfo: versusInfo })
        }
    },
    render: function () {
        var parent = this

        var leftPlayers = 0
        var rightPlayers = 0
        parent.state.versusInfo.map(function (row) {
            if (row.playerNumber >= 1 && row.playerNumber <= 4)
                leftPlayers++
            if (row.playerNumber >= 5 && row.playerNumber <= 8)
                rightPlayers++
        })
        var maxPlayers = Math.max(leftPlayers, rightPlayers)

        var calculatedTop = globalState.screenHeight / 2 - 48 * maxPlayers
        //console.log('calculatedTop: ' + calculatedTop)
        var versusTop = -48 * leftPlayers + 14

        var animationDelay = 0.70
        var animationDelta = 0.25
        var backerAnimationDelay = 0

        //var arrowsAnimationDelay = animationDelay + animationDelta * globalState.savedPlayerNumber + 0.75
        var arrowsAnimationDelay = animationDelay + animationDelta * (leftPlayers + rightPlayers) + 0.25
        var arrowsPrefix = ''
        var versusArrowsTop = 0
        if (leftPlayers == 2 && rightPlayers == 2) {
            arrowsPrefix = '2v2_'
            versusArrowsBottom = '72px'
        }
        else if (leftPlayers == 4 && rightPlayers == 4) {
            arrowsPrefix = '4v4_'
            versusArrowsBottom = '202px'
        }

        //console.log('arrowsPrefix: ' + arrowsPrefix + ', based on leftPlayers: ' + leftPlayers + ', rightPlayers: ' + rightPlayers)

        return (
            React.createElement('div', { id: 'Versus' },
                React.createElement('div', { id: 'VersusLeftRightContainer'},
                    React.createElement(
                        VelocityComponent,
                        GetFullScreenHorizontalAnimation(parent.state.enabled, '-50vw'),
                        React.createElement('div', { id: 'VersusLeft', className: 'versus-container' },
                            React.createElement('div', {
                                className: 'versus-content',
                                style: {
                                    top: calculatedTop + 'px'
                                }
                            },
                                parent.state.versusInfo.map(function (row) {
                                    if (row.playerNumber >= 5) return null

                                    animationDelay += animationDelta
                                    backerAnimationDelay += 0.1

                                    if (parent.state.enabled)
                                        engine.call('OnVersusMasteryIconEnter', animationDelay)

                                    return React.createElement('div', { className: 'versus-row' },
                                        React.createElement('div', { className: 'versus-column' },
                                            React.createElement('div', { className: 'versus-profile' },
                                                React.createElement('div', { className: 'versus-avatar'},
                                                    React.createElement('span', { className: getAvatarStacksClass(row.avatarStacks) },
                                                        React.createElement('img', {
                                                            className: 'avatar', src: 'hud/img/' + row.avatar,
                                                            style: {
                                                                position: row.avatarStacks >= 3 ? 'absolute' : 'relative'
                                                            }
                                                        })
                                                    )
                                                ),
                                                React.createElement('div', { className: 'versus-name' },
                                                    React.createElement('div', {},
                                                        React.createElement('span', { dangerouslySetInnerHTML: { __html: row.playerNameHtml } }),
                                                        React.createElement('span', { className: 'guild-abbr'}, row.guild)
                                                    )//,
                                                    //React.createElement('div', { className: 'tagline' }, row.tagline)
                                                )
                                            )
                                        ),
                                        React.createElement('div', { className: 'versus-column' },
                                            React.createElement('div', {
                                                className: 'fancy-enter',
                                                style: {
                                                    animationDelay: animationDelay + 's'
                                                }
                                            },
                                                React.createElement('div', { className: 'mastery-icon-container ' },
                                                    React.createElement('img', { className: 'mastery-icon', src: 'hud/img/icons/Mastery/32px/' + row.masteryLevel + '.png' })
                                                ),
                                                React.createElement('img', { className: 'versus-icon', src: 'hud/img/' + row.openingIcon })
                                            ),
                                            React.createElement('div', {
                                                className: 'versus-icon-backer',
                                                style: {
                                                    animation: 'enterBacker 0.2s ease-in-out forwards',
                                                    animationDelay: 0.7 + 's'
                                                }
                                            })
                                        )
                                    )
                                })
                            )
                        )
                    ),
                    /* SMELLY COPY AND PASTED */
                    React.createElement(
                        VelocityComponent,
                        GetFullScreenHorizontalAnimation(parent.state.enabled, '50vw'),
                        React.createElement('div', { id: 'VersusRight', className: 'versus-container' },
                            React.createElement('div', {
                                className: 'versus-content',
                                style: { right: '0', top: calculatedTop + 'px' }
                            },
                                parent.state.versusInfo.map(function (row) {
                                    if (row.playerNumber <= 4) return null

                                    animationDelay += animationDelta
                                    backerAnimationDelay += 0.1

                                    if (parent.state.enabled)
                                        engine.call('OnVersusMasteryIconEnter', animationDelay)

                                    return React.createElement('div', { className: 'versus-row' },
                                        React.createElement('div', {
                                            className: 'versus-column'
                                        },
                                            React.createElement('div', {
                                                className: 'fancy-enter',
                                                style: {
                                                    animationDelay: animationDelay + 's'
                                                }
                                            },
                                                React.createElement('div', { className: 'mastery-icon-container ' },
                                                    React.createElement('img', { className: 'mastery-icon', src: 'hud/img/icons/Mastery/' + row.masteryLevel + '.png' })
                                                ),
                                                React.createElement('img', { className: 'versus-icon', src: 'hud/img/' + row.openingIcon })
                                            ),
                                            React.createElement('div', {
                                                className: 'versus-icon-backer',
                                                style: {
                                                    animation: 'enterBackerMirrored 0.2s ease-in-out forwards',
                                                    animationDelay: 0.7 + 's'
                                                }
                                            })
                                        ),
                                        React.createElement('div', { className: 'versus-column' },
                                            React.createElement('div', { className: 'versus-profile' },
                                                React.createElement('div', { className: 'versus-avatar' },
                                                    React.createElement('span', { className: getAvatarStacksClass(row.avatarStacks) },
                                                        React.createElement('img', {
                                                            className: 'avatar', src: 'hud/img/' + row.avatar,
                                                            style: {
                                                                position: row.avatarStacks >= 3 ? 'absolute' : 'relative'
                                                            }
                                                        })
                                                    )
                                                ),
                                                React.createElement('div', { className: 'versus-name' },
                                                    React.createElement('div', {},
                                                        React.createElement('span', { dangerouslySetInnerHTML: { __html: row.playerNameHtml } }),
                                                        React.createElement('span', { className: 'guild-abbr'}, row.guild)
                                                    )//,
                                                    //React.createElement('div', { className: 'tagline' }, row.tagline)
                                                )
                                            )
                                        )
                                    )
                                })
                            )
                        )
                    )
                ),
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset3(parent.state.enabled, 0, 0),
                    React.createElement('div', { id: 'VersusCenter' },
                        React.createElement('div', {
                            className: 'versus-text',
                            style: {
                                animation: arrowsPrefix == '4v4_' ? 'versusPulse4v4 0.9s ease-in-out forwards' : 'versusPulse2v2 0.9s ease-in-out forwards',
                                top: versusTop + 'px'
                            }
                        }, 'VS'),
                        arrowsPrefix != '' && React.createElement('img', {
                            className: 'versus-arrows', src: 'hud/img/versus/' + arrowsPrefix + globalState.savedPlayerNumber + '.png',
                            style: {
                                bottom: versusArrowsBottom,
                                animationDelay: arrowsAnimationDelay + 's'
                            }
                        })
                    )
                )
            )
        )
    }
})