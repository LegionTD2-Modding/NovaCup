// Tutorial
// =============================================================================================

var SingleplayerView = React.createClass({
    propTypes: {
        hideVideo: React.PropTypes.bool,
    },
    getInitialState: function () {
        return {
            missions: [],
            selectedMissionIndex: 0,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshSingleplayerMissions = function (missions) {
            //console.log('refreshSingleplayerMissions: ')
            parent.setState({ missions: missions })
        }
        bindings.setSingleplayerMissionIndex = function (index) {
            parent.setState({ selectedMissionIndex: index })
        }
    },
    getMissionSplash: function (missionVideo) {
        if (this.props.hideVideo) return null

        if (!globalState.enableVideoRendering) {
            return React.createElement('img', {
                src: missionVideo.replace('.webm', '.gif'),
                style: { width: '100%' }
            })
        }

        // todo: add fallback handlers if missing a video
        return React.createElement('video', {
            src: missionVideo,
            className: 'media',
            muted: 'true', autoPlay: 'true', loop: 'true',
            style: { width: '100%' }
        })
    },
    render: function () {
        var parent = this

        var missions = parent.state.missions
        var missionName = loc('loading', "Loading...")
        var missionVideo = loc('loading', "Loading...")
        var missionDescription = loc('loading', "Loading...")
        var selectedMissionIndex = parent.state.selectedMissionIndex
        var missionId = ""

        if (missions == null) {
            console.warn("Missions was missing")
            return null
        }

        if (missions.length > selectedMissionIndex) {
            missionName = missions[selectedMissionIndex].name
            missionVideo = missions[selectedMissionIndex].video
            missionDescription = missions[selectedMissionIndex].description
            missionId = missions[selectedMissionIndex].missionId
        } else {
            //console.warn("Missions was length 0")
            return null
        }

        //console.log('missionVideo: ' + missionVideo)

        var startTutorialText = loc('start_tutorial', "Start Tutorial")
        //var startTutorialFontSize = startTutorialText.length >= 15 ? '1.25rem' : (globalState.language == 'english' ? '2rem' : '1.75rem')
        var startTutorialFontSize = '1.25rem' // let's just be safe

        return React.createElement('div', { id: 'Singleplayer' },
            React.createElement('div', {
                className: 'fullscreen',
                onMouseDown: function (e) { // v1.50
                    engine.trigger('enableChat', false)
                },
                style: {
                    pointerEvents: 'all'
                }
            },
                React.createElement('div', { className: 'centered-text overlay' },
                    React.createElement('div', { className: 'centered-text-wrapper' },
                        React.createElement('div', { className: 'content-container' },
                            React.createElement('div', { className: 'main' },
                                React.createElement('div', { className: 'title' }, missionName),
                                React.createElement('div', { className: 'mission-splash' },
                                    parent.getMissionSplash(missionVideo),
                                    React.createElement('div', {
                                        style: {
                                            position: 'relative',
                                            width: '692px', 
                                            top: '-230px',
                                            zIndex: '-1',
                                            height: '0',
                                        }
                                    },
                                        React.createElement('img', {
                                            src: 'hud/img/ui/loading-small.gif',
                                        })
                                    )
                                ),
                                React.createElement('div', {
                                    className: 'mission-description',
                                    dangerouslySetInnerHTML: {
                                        __html: missionDescription
                                    }
                                })
                            ),
                            React.createElement('div', { className: 'sidebar' },
                                React.createElement('div', { className: 'subtitle' }, loc('choose_tutorial_mission', "Choose a Tutorial Mission")),
                                React.createElement('div', { className: 'mission-container scrollable' },
                                    parent.state.missions.map(function (mission, index) {
                                        if (!mission.discovered) {
                                            return React.createElement('div', {
                                                key: index,
                                                className: 'undiscovered-mission',
                                                style: {
                                                    background: 'url(hud/img/' + mission.image + ')',
                                                    backgroundSize: 'cover',
                                                }
                                            }, '(' + loc('to_be_unlocked', 'To be unlocked') + ')')
                                        }

                                        return React.createElement('div', {
                                            key: index,
                                            className: 'mission' + (index == parent.state.selectedMissionIndex ? ' selected' : ''),
                                            style: {
                                                background: 'url(hud/img/' + mission.image + ')',
                                                backgroundSize: 'cover',
                                            },
                                            onMouseDown: function (e) {
                                                engine.trigger('setSingleplayerMissionIndex', index)
                                                engine.call('OnClickPage')
                                            }
                                        },
                                            React.createElement('div', { className: 'checkbox-box' },
                                                mission.beaten && React.createElement('img', { className: 'checkbox-icon', src: 'hud/img/ui/accept-check.png' })
                                            ),
                                            React.createElement('div', { className: 'mission-title' },
                                                mission.name
                                            ),
                                            (index <= 2) && React.createElement('span', { className: 'mission-subtitle required' },
                                                ' (' + loc('required', "REQUIRED") + ')'
                                            ),
                                            (index > 2) && React.createElement('span', { className: 'mission-subtitle optional' },
                                                ' (' + loc('optional', "OPTIONAL") + ')'
                                            )
                                        )
                                    })
                                ),
                                React.createElement('div', { className: 'mission-select' },
                                    React.createElement(EmphasizedMenuButton, {
                                        name: "Start Tutorial",
                                        displayName: startTutorialText,
                                        behavior: function () {
                                            console.log('call OnChooseMission with index ' + parent.state.selectedMissionIndex + ' which is mission: ' + missionName)
                                            engine.call('OnChooseMission', missionId, false)
                                        },
                                        style: {
                                            fontSize: startTutorialFontSize
                                        }
                                    })
                                )
                            )
                        )
                    )
                ),
                React.createElement('div', { className: 'confirmation-buttons' },
                    React.createElement(StandardMenuButton, {
                        name: loc('back', 'Back'),
                        displayName: loc('back', 'Back'),
                        behavior: function () {
                            engine.trigger('escape')
                        }
                    })
                )
            )
        )
    }
})

//var BigMessage = React.createClass({
//    getInitialState: function () {
//        return {
//            bigText: '',
//            buttonText: '',
//            hideArrow: false,
//        }
//    },
//    componentWillMount: function () {
//        var parent = this
//        bindings.renderTutorialArrowText['big'] = function (props, buttonText) {
//            parent.setState({ bigText: props.message, buttonText: buttonText, hideArrow: props.hideArrow, mirror: props.mirror })
//        }
//    },
//    render: function () {
//        var parent = this
//        if (!parent.state.bigText)
//            return null

//        var marginTopValue = this.state.mirror ? 200 : -350

//        if (globalState.screenHeight < 1080)
//            marginTopValue *= 0.5

//        console.log('marginTopValue: ' + marginTopValue)

//        return (
//            React.createElement('div', { className: 'centered-text', style: { height: '100vh', width: '100vw' } },
//                React.createElement('div', { className: 'centered-text-wrapper' },
//                    React.createElement('div', {
//                        className: 'big-text',
//                        style: {
//                            marginTop: marginTopValue + 'px',
//                        }
//                    },
//                        React.createElement('div', {
//                            className: 'big-text-content',
//                            dangerouslySetInnerHTML: {
//                                __html: parent.state.bigText
//                            }
//                        }),
//                        (parent.state.buttonText) &&
//                        React.createElement('div', { className: 'button-container' },
//                            React.createElement('div', {
//                                className: 'button em',
//                                dangerouslySetInnerHTML: {
//                                    __html: parent.state.buttonText
//                                },
//                                style: {
//                                },
//                                onMouseDown: function (e) {
//                                    parent.setState({ bigText: '', buttonText: '' })
//                                    engine.call('OnTutorialContinuePressed')
//                                }
//                            }),
//                            (!parent.state.hideArrow) && React.createElement('div', {
//                                className: 'arrow-image down',
//                                style: {
//                                    left: 'calc(50vw - 45px)',
//                                }
//                            })
//                        )
//                    )
//                )
//            )
//        )
//    }
//})

var SmallMessage = React.createClass({
    getInitialState: function () {
        return {
            text: '',
            buttonText: '',
            hideArrow: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.renderTutorialArrowText['small'] = function (props, buttonText) {
            parent.setState({ text: props.message, buttonText: buttonText, hideArrow: props.hideArrow, mirror: props.mirror })
        }
    },
    render: function () {
        var parent = this
        if (!parent.state.text)
            return null

        var shortMessage = parent.state.text.length < 25
        var isShortHeight = globalState.screenHeight < 900

        var marginTop = '200px'
        if (this.state.mirror)
            marginTop = '-350px'

        if (isShortHeight)
            marginTop = '75px'

        return (
            React.createElement('div', { className: 'centered-text', style: { height: '100vh', width: '100vw' } },
                React.createElement('div', { className: 'centered-text-wrapper' },
                    React.createElement('div', {
                        className: 'small-text',
                        style: {
                            marginTop: marginTop,
                            textAlign: shortMessage ? 'center' : 'left',
                        }
                    },
                        React.createElement('div', {
                            dangerouslySetInnerHTML: {
                                __html: parent.state.text
                            }
                        }),
                        (parent.state.buttonText) &&
                        React.createElement('div', {
                            className: 'button em',
                            dangerouslySetInnerHTML: {
                                __html: parent.state.buttonText
                            },
                            style: {
                                //marginTop: '24px',
                                //fontSize: '24px'
                            },
                            onMouseDown: function (e) {
                                parent.setState({ text: '', buttonText: '' })
                                engine.call('OnTutorialContinuePressed')
                            }
                        })
                        //,

                        // I don't think small txtbox should ever have an arrow
                        //(!parent.state.hideArrow) && React.createElement('div', {
                        //    className: 'arrow-image down',
                        //    style: {
                        //        left: 'calc(50vw - 45px)',
                        //    }
                        //})
                    )
                )
            )
        )
    }
})

var GroundMessage = React.createClass({
    propTypes: {
        index: React.PropTypes.number.isRequired,
    },
    getInitialState: function () {
        return {
            message: '',
            buttonText: '',
            top: 0,
            left: 0,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.renderTutorialArrowText['ground' + this.props.index] = function (props, buttonText) {
            parent.setState({ message: props.message, buttonText: buttonText })
        }
        bindings.updateGroundArrowTextPosition[this.props.index] = function (top, left) {
            parent.setState({ top: top - 200, left: left - 270 })
        }
    },
    render: function () {
        //console.log("render ground " + this.props.index + " with message: " + this.state.message + ", top: " + this.state.top + ", left: " + this.state.left)

        var parent = this
        if (!parent.state.message)
            return null

        var hideMessage = parent.state.message == '[none]'
        var leftOffset = 100
        var width = 300
        if (parent.state.message.length < 20) {
            width = 150
            leftOffset = 175
        }
        var arrowLeftOffset = (width / 2 - 26)
        var topOffset = 20
        if (parent.state.buttonText)
            topOffset = -60

        return (
            React.createElement('div', {
                className: 'ground-message',
                style: {
                    position: 'absolute',
                    top: topOffset + parent.state.top - 50,
                    left: leftOffset + parent.state.left,
                }
            },
                React.createElement('div', {
                    className: 'arrow-text',
                    style: {
                        width: width + 'px',
                        textAlign: 'center',
                        color: !hideMessage ? '' : 'transparent',
                        background: !hideMessage ? '' : 'transparent',
                        border: !hideMessage ? '' : 'transparent',
                    }
                },
                    React.createElement('div', {
                        dangerouslySetInnerHTML: {
                            __html: parent.state.message
                        }
                    }),
                    React.createElement('div', {
                        className: 'arrow-image down',
                        style: {
                            top: (100 - 0.95 * topOffset) + 'px',
                            left: arrowLeftOffset + 'px',
                        }
                    }),
                    (parent.state.buttonText) &&
                    React.createElement('div', {
                        className: 'button em',
                        dangerouslySetInnerHTML: {
                            __html: parent.state.buttonText
                        },
                        style: {
                            marginTop: '48px',
                            //fontSize: '24px'
                        },
                        onMouseDown: function (e) {
                            engine.call('OnTutorialContinuePressed')
                            parent.setState({ message: '', buttonText: '' })
                        }
                    })
                )
            )
        )
    }
})

var Objectives = React.createClass({
    getInitialState: function () {
        return {
            objectives: []
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshObjectives = function (objectives) {
            parent.setState({ objectives: objectives })
        }
    },
    removeButton: function () {
        var parent = this

        var newObjectives = []

        this.state.objectives.map(function (objective, index) {

            var isButton = objective.total == -2

            if (isButton) return

            newObjectives.push(objective)
        })

        this.setState({
            objectives: newObjectives
        })
    },
    render: function () {
        var parent = this

        if (this.state.objectives.length == 0) return null

        return (
            React.createElement('div', { id: 'Objectives' },
                React.createElement('div', { className: 'title' }, loc('tutorial_objectives', 'Objectives')),
                React.createElement('div', { className: 'content' },
                    this.state.objectives.map(function (objective) {
                        var isCheckbox = true

                        var isHint = objective.total == -1
                        if (isHint) isCheckbox = false

                        var isButton = objective.total == -2
                        if (isButton) isCheckbox = false

                        //console.log('isCheckbox: ' + isCheckbox)
                        //console.log('isHint: ' + isHint)
                        //console.log('isButton: ' + isButton)

                        var beaten = objective.current == objective.total
                        return React.createElement('div', {
                            key: objective.name
                        },
                            isCheckbox && React.createElement('div', { className: 'checkbox-box' },
                                beaten && React.createElement('img', { className: 'checkbox-icon', src: 'hud/img/ui/accept-check.png' })
                            ),
                            isButton && React.createElement('div', {
                                className: 'button em',
                                style: {
                                    marginTop: '1vh'
                                },
                                onMouseDown: function (e) {
                                    console.log('click objectives button')
                                    engine.call('OnClickObjectivesButton', objective.actionString)

                                    // Special case: for -loadbest, don't remove the button
                                    var skipRemoveButton = objective.actionString == "loadbest"

                                    if (!skipRemoveButton) {
                                        parent.removeButton()
                                    }
                                }
                            },
                                objective.name
                            ),
                            !isButton && React.createElement('div', {
                                className: 'objective-title' + (isHint ? ' hint' : ''),
                                style: {
                                    textDecoration: beaten ? 'line-through' : ''
                                }
                            },
                                React.createElement('span', {
                                    dangerouslySetInnerHTML: {
                                        __html: objective.name
                                    }
                                }),
                                objective.total > 1 && React.createElement('span', { className: 'objective-progress' },
                                    React.createElement('span', {}, ' ('),
                                    React.createElement('span', { style: { color: '#ffcc00' } }, objective.current + '/' + objective.total),
                                    React.createElement('span', {}, ')')
                                )
                            )
                        )
                    })
                )
            )
        )
    }
})

/* Not used, since it overlaps with other UI elements on the screen edge which looks kinda bad */
var BackToLane = React.createClass({
    getInitialState: function () {
        return {
            top: 0,
            left: 0,
            rotation: 0,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.updateBackToLane = function (top, left, rotation) {
            parent.setState({ top: top, left: left, rotation: rotation })
        }
    },
    render: function () {
        // to hide it
        if (this.state.top == 0 && this.state.left == 0 && this.state.rotation == 0) return null

        return (
            React.createElement('div', {
                id: 'BackToLane',
                style: {
                    top: this.state.top + 'px',
                    left: this.state.left + 'px',
                }
            },
                React.createElement('div', {
                    className: 'triangle',
                    style: {
                        transform: 'rotate(' + this.state.rotation + 'deg)'
                    }
                }),
                React.createElement('div', { className: 'triangle-description' },
                    'Press spacebar to return to lane'
                )
            )
        )
    }
})

var WeeklyChallengeView = React.createClass({
    getInitialState: function () {
        return {
            weeklyChallengeProps: null,
            leaderboardEntries: [],
            leaderboardEntriesAroundMe: [],
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshWeeklyChallengeView = function (weeklyChallengeProps, leaderboardEntries, leaderboardEntriesAroundMe) {
            parent.setState({
                weeklyChallengeProps: weeklyChallengeProps,
                leaderboardEntries: leaderboardEntries,
                leaderboardEntriesAroundMe: leaderboardEntriesAroundMe
            })
        }
    },
    render: function () {
        var parent = this

        if (this.state.weeklyChallengeProps == null) {
            return React.createElement('div', { style: { height: '100vh', width: '100vw', position: 'absolute' } },
                React.createElement('div', { className: 'centered-text overlay' },
                    React.createElement('div', { className: 'centered-text-wrapper' },
                        React.createElement('div', { className: 'content-container' },
                            React.createElement('img', {
                                src: 'hud/img/ui/loading-small.gif',
                            })
                        )
                    )
                )
            )
        }

        var isZero = false
        this.state.leaderboardEntriesAroundMe.map(function (entry, index) {
            if (entry.elo == 0)
                isZero = true
        })

        var checkBackSoon = this.state.weeklyChallengeProps.secondsRemaining < 600
        var lastWeekRating = parent.state.weeklyChallengeProps.lastWeekWinner.rating

        return React.createElement('div', { id: 'WeeklyChallenge' },
            React.createElement('div', {
                className: 'fullscreen',
                onMouseDown: function (e) { // v1.50
                    engine.trigger('enableChat', false)
                },
                style: {
                    pointerEvents: 'all'
                }
            },
                React.createElement('div', { className: 'centered-text overlay' },
                    React.createElement('div', { className: 'centered-text-wrapper' },
                        React.createElement('div', { className: 'content-container' },
                            React.createElement('div', { className: 'main' },
                                React.createElement('div', { className: 'title' },
                                    React.createElement('img', { className: 'title-icon', src: 'hud/img/icons/WeeklyChallenge.png' }),
                                    loc('weekly_challenge_leaderboard', 'Weekly Challenge Leaderboard'),
                                    React.createElement('img', { className: 'title-icon', src: 'hud/img/icons/WeeklyChallenge.png' })
                                ),
                                React.createElement('div', { className: 'time-remaining' },
                                    React.createElement('span', { className: 'challenge-label' }, loc('next_challenge_date', 'Next challenge date') + ': '),
                                    React.createElement('span', { style: { color: "#fff" } }, this.state.weeklyChallengeProps.timeLeftString)
                                ),
                                React.createElement('div', {},
                                    React.createElement('table', {
                                        ref: 'leaderboard', className: 'leaderboard scrollable weekly-challenge-main-leaderboard',
                                        style: {
                                            overflowY: 'auto',
                                            height: '394px',
                                            display: 'block'
                                        }
                                    },
                                        React.createElement('thead', {},
                                            React.createElement('tr', {},
                                                React.createElement('td', { className: 'rank' }, loc('leaderboard_rank', "Rank")),
                                                React.createElement('td', { className: 'unclickable name' }, loc('player', "Player")),
                                                React.createElement('td', { className: 'unclickable country' }, loc('country', "Country")),
                                                React.createElement('td', { className: 'unclickable', style: { minWidth: '90px' } }, loc('rating', "Rating")),
                                                React.createElement('td', { style: { minWidth: '60px' }}, loc('score', "Score"))
                                            )
                                        ),
                                        React.createElement('tbody', { className: 'addspace' },
                                            React.createElement('tr', { style: { height: '12px' } }, React.createElement('td', { style: { background: 'rgba(0, 0, 0, 0.5)' }, colSpan: '5' })),
                                            this.state.leaderboardEntries.map(function (entry, index) {
                                                var isSelf = entry.name == globalState.savedUsername
                                                var green = isSelf || entry.isFriend
                                                //console.log('Rendering leaderboard entry with name: ' + entry.name)
                                                return React.createElement('tr', { className: isSelf ? 'highlighted' : '' },
                                                    React.createElement('td', { className: 'rank' }, entry.rank),
                                                    React.createElement('td', {
                                                        className: 'name',
                                                        onMouseDown: function (e) {
                                                            var left = e.nativeEvent.clientX
                                                            var top = e.nativeEvent.clientY

                                                            if (e.nativeEvent.which == 2) return // v2.22 fix

                                                            openContextMenu(entry.playFabId, entry.name, rightClickLeaderboardEntryMenu, left, top)
                                                        },
                                                    },
                                                        React.createElement('span', { className: getAvatarStacksClass(entry.avatarStacks) },
                                                            React.createElement('img', { src: 'hud/img/' + entry.avatar })
                                                        ),
                                                        ' ',
                                                        green && React.createElement('span', { style: { color: '#81ff10' } }, entry.name),
                                                        !green && React.createElement('span', {}, entry.name)
                                                    ),
                                                    // NOTE: For some reason this country code is causing Coherent to complain about
                                                    // Missing texture for image, see email for more details about that, but basically it
                                                    // doesn't like when we are rendering to canvas something that hasn't been added to DOM
                                                    // yet or something... seems harmless for now though?
                                                    React.createElement('td', { className: 'country' },
                                                        React.createElement('span', { className: 'simple-tooltip flag-icon flag-icon-' + entry.countryCode },
                                                            React.createElement('span', { className: 'tooltiptext' }, entry.countryName)
                                                        )
                                                    ),
                                                    // ^
                                                    React.createElement('td', { className: 'elo' },
                                                        getRatingImage(entry.elo) && React.createElement('img', { src: getRatingImage(entry.elo) }),
                                                        getRatingImage(entry.elo) && React.createElement('span', {
                                                            className: 'rating-numeral', style: {
                                                                right: '20px', marginRight: '-25px', width: '20px', display: 'inline-block'
                                                            }
                                                        }, getRatingDivisionNumeral(entry.elo)),
                                                        React.createElement('span', { style: { position: 'relative' } }, entry.elo)
                                                    ),
                                                    React.createElement('td', { className: 'score' },
                                                        React.createElement('span', { style: { position: 'relative' } }, entry.challengeScore)
                                                    )
                                                )
                                            })
                                        )
                                    ),
                                    !isZero && this.state.leaderboardEntriesAroundMe.length > 0 && React.createElement('table', {
                                        className: 'leaderboard scrollable weekly-challenge-around-me-leaderboard', style: {
                                            marginTop: '12px',
                                            borderRight: this.state.leaderboardEntries.length > 11 ? '10px solid #1e1e1e' : ''/* HACK */
                                        }
                                    },
                                        React.createElement('tbody', { className: 'addspace' },
                                            React.createElement('tr', { style: { height: '12px' } }, React.createElement('td', { style: { background: 'rgba(0, 0, 0, 0.5)' }, colSpan: '5' })),
                                            this.state.leaderboardEntriesAroundMe.map(function (entry, index) {
                                                var isSelf = entry.name == globalState.savedUsername
                                                var green = isSelf || entry.isFriend

                                                //console.log('Rendering leaderboard entry with name: ' + entry.name)
                                                return React.createElement('tr', { className: isSelf ? 'highlighted' : '' },
                                                    React.createElement('td', { className: 'rank' }, entry.rank),
                                                    React.createElement('td', {
                                                        className: 'name',
                                                        onMouseDown: function (e) {
                                                            var left = e.nativeEvent.clientX
                                                            var top = e.nativeEvent.clientY

                                                            if (e.nativeEvent.which == 2) return // v2.22 fix

                                                            openContextMenu(entry.playFabId, entry.name, rightClickLeaderboardEntryMenu, left, top)
                                                        }
                                                    },
                                                        React.createElement('span', { className: getAvatarStacksClass(entry.avatarStacks) },
                                                            React.createElement('img', { src: 'hud/img/' + entry.avatar })
                                                        ),
                                                        ' ',
                                                        green && React.createElement('span', { style: { color: '#81ff10' } }, entry.name),
                                                        !green && React.createElement('span', {}, entry.name)
                                                    ),
                                                    React.createElement('td', { className: 'country' },
                                                        React.createElement('span', { className: 'simple-tooltip flag-icon flag-icon-' + entry.countryCode },
                                                            React.createElement('span', { className: 'tooltiptext' }, entry.countryName)
                                                        )
                                                    ),
                                                    React.createElement('td', { className: 'elo' },
                                                        getRatingImage(entry.elo) && React.createElement('img', { src: getRatingImage(entry.elo) }),
                                                        getRatingImage(entry.elo) && React.createElement('span', {
                                                            className: 'rating-numeral', style: {
                                                                right: '20px', marginRight: '-25px', width: '20px', display: 'inline-block'
                                                            }
                                                        }, getRatingDivisionNumeral(entry.elo)),
                                                        entry.elo
                                                    ),
                                                    React.createElement('td', { className: 'score' },
                                                        React.createElement('span', { style: { position: 'relative' } }, entry.challengeScore)
                                                    )
                                                )
                                            })
                                        )
                                    )
                                )
                            ),
                            React.createElement('div', { className: 'sidebar' },
                                //React.createElement('div', { className: 'subtitle' }, loc('this_week_challenge', "This Week's Challenge")),
                                !checkBackSoon && React.createElement('div', { className: 'challenge-details scrollable' },
                                    React.createElement('div', {
                                        style: { marginBottom: '12px' },
                                        dangerouslySetInnerHTML: {
                                            __html: this.state.weeklyChallengeProps.welcomeString
                                        }
                                    }),
                                    React.createElement('div', { className: 'challenge-label' }, loc('wave', 'Wave')),
                                    React.createElement('div', { style: { color: "#fff" } },
                                        React.createElement('img', { style: { height: '24px', verticalAlign: 'middle', marginRight: '3px' }, src: 'hud/img/' + this.state.weeklyChallengeProps.waveIcon }),
                                        this.state.weeklyChallengeProps.wave
                                    ),
                                    React.createElement('div', { className: 'challenge-label' }, loc('fighters', 'Fighters')),
                                    React.createElement('div', { style: { color: "#fff" } },
                                        React.createElement('span', { className: 'build' },
                                            this.state.weeklyChallengeProps.units && this.state.weeklyChallengeProps.units.map(function (entry) {
                                                if (entry.count == 0) return
                                                return React.createElement('div', { className: 'tower' },
                                                    React.createElement('img', { src: 'hud/img/' + entry.image }),
                                                    React.createElement('span', { className: 'count' + (entry.count == 1 ? ' one' : '') }, entry.count)
                                                )
                                            })
                                        ),
                                        React.createElement('span', { style: { color: "#fff" } },
                                            React.createElement('img', { style: { height: '16px', verticalAlign: 'middle', marginRight: '3px' }, src: 'hud/img/icons/Value.png' }),
                                            this.state.weeklyChallengeProps.value
                                        )
                                    ),
                                    this.state.weeklyChallengeProps.legionSpellName.length > 0 && React.createElement('div', { className: 'challenge-label' }, loc('spell', 'Legion Spell')),
                                    this.state.weeklyChallengeProps.legionSpellName.length > 0 && React.createElement('div', { style: { color: "#fff" } },
                                        React.createElement('img', { style: { height: '24px', verticalAlign: 'middle', margin: '0 3px 0 3px' }, src: 'hud/img/' + this.state.weeklyChallengeProps.legionSpellIcon }),
                                        React.createElement('span', { dangerouslySetInnerHTML: { __html: this.state.weeklyChallengeProps.legionSpellName } })
                                    ),
                                    React.createElement('div', { className: 'challenge-label' }, loc('mercenary_value_received', 'Mercenaries Received')),
                                    React.createElement('div', { style: { color: "#fff" } },
                                        this.state.weeklyChallengeProps.mercenariesReceivedIcons.map(function (icon) {
                                            return React.createElement('img', { className: 'challenge-icon', src: 'hud/img/' + icon })
                                        }),
                                        React.createElement('img', { className: 'tooltip-icon', style: { verticalAlign: 'middle', marginLeft: '3px' }, src: 'hud/img/icons/Mythium.png' }),
                                        React.createElement('span', { style: { marginRight: '4px' } }, this.state.weeklyChallengeProps.mercenariesReceivedValue)
                                    ),
                                    React.createElement('div', { className: 'challenge-label' }, loc('leaks', 'Leaks')),
                                    React.createElement('div', { style: { color: "#fff" } }, this.state.weeklyChallengeProps.leakPercent.toFixed(0) + '%'),
                                    React.createElement('div', { className: 'challenge-label' }, loc('score', 'Score')),
                                    React.createElement('div', { style: { color: "#fff" } }, (Math.max(0, 100 - this.state.weeklyChallengeProps.leakPercent)).toFixed(0))
                                ),
                                !checkBackSoon && React.createElement('div', { className: 'mission-select' },
                                    React.createElement(EmphasizedMenuButton, {
                                        name: "Start Challenge",
                                        displayName: loc('start_challenge', "Start Challenge"),
                                        locked: checkBackSoon,
                                        behavior: function () {
                                            if (checkBackSoon) return
                                            engine.trigger('trySearchGame', 'challenge')
                                        }
                                    })
                                ),
                                checkBackSoon && React.createElement('div', {
                                    className: 'mission-select-subtext', style: { color: '#ffff00' } },
                                    React.createElement('div', {}, loc('weekly_challenge_tallying_scores', 'Scores are tallying. Check back soon to try the new challenge!'))
                                ),
                                parent.state.weeklyChallengeProps.lastWeekWinner.playFabId.length > 0 && React.createElement('div', {
                                    className: 'mission-select-subtext', style: {
                                        color: '#c0c0c0'
                                    }
                                },
                                    React.createElement('span', {
                                        dangerouslySetInnerHTML: {
                                            __html: loc('last_week_winner', "Previous winner: " + parent.state.weeklyChallengeProps.lastWeekWinner.displayNameWithAvatar, [parent.state.weeklyChallengeProps.lastWeekWinner.displayNameWithAvatar])
                                        }
                                    }),
                                    React.createElement('span', {
                                        onMouseDown: function (e) {
                                            engine.trigger('showLastWeekWinner', parent.state.weeklyChallengeProps.lastWeekWinner)
                                        }
                                    },
                                        ' [',
                                        React.createElement('span', { style: { color: '#8ff110' } }, loc('view', 'View')),
                                        ']'
                                    )
                                )
                            )
                        )
                    )
                ),
                React.createElement('div', { className: 'confirmation-buttons' },
                    React.createElement(StandardMenuButton, {
                        name: loc('back', 'Back'),
                        displayName: loc('back', 'Back'),
                        behavior: function () {
                            engine.trigger('escape')
                        }
                    })
                )
            )
        )
    }
})


var CampaignMapView = React.createClass({
    lastClicked: 0,
    getInitialState: function () {
        return {
            map: {},
            selectedMissionNumber: 1,
            hoveredMissionNumber: 0,
            firstUnclearedMissionNumber: 1,
        }
    },
    componentWillMount: function () {
        var parent = this

        bindings.refreshCampaignMap = function (map) {
            parent.setState({ map: map })
        }

        bindings.setSelectedCampaignMissionNumber = function (missionNumber, missionId) {
            parent.setState({ selectedMissionNumber: missionNumber })
        }

        bindings.setHoveredCampaignMissionNumber = function (missionNumber) {
            parent.setState({ hoveredMissionNumber: missionNumber })
        }

        bindings.setCampaignFirstUnclearedMissionNumber = function (missionNumber) {
            parent.setState({ firstUnclearedMissionNumber: missionNumber })
        }
    },
    playMission: function (mission, starsHtml, hardModeEnabled) {
        var parent = this

        var ownedDlc = _.includes(globalState.campaignDlcOwned, 'Campaign' + parent.state.map.mapNumber)
        if (parent.state.map.mapNumber == 1) // Campaign 1 is included in the base game
            ownedDlc = true

        if (!ownedDlc) {
            console.log('playMission but didnt own mission -> open store page for mapNumber: ' + parent.state.map.mapNumber)
            switch (parent.state.map.mapNumber) {
                case 2:
                    engine.call('OnOpenURL', 'https://store.steampowered.com/app/2162190/Legion_TD_2__Desert_Ridge_Campaign/')
                    break
                case 3:
                    engine.call('OnOpenURL', 'https://store.steampowered.com/app/562150/Legion_TD_2__Floating_Isles_Campaign/')
                    break
                default:
                    console.warn('Unexpected mission number --> load desert ridge by default')
                    engine.call('OnOpenURL', 'https://store.steampowered.com/app/2162190/Legion_TD_2__Desert_Ridge_Campaign/')
                    break
            }
            return
        }

        showFullScreenPopup(getPlayCampaignWindow(mission.props.MissionId, mission.props.Name, mission.props.HardDescription, starsHtml, hardModeEnabled), false)
    },
    render: function () {
        var parent = this

        if (this.state.map == null) {
            return React.createElement('div', { style: { height: '100vh', width: '100vw', position: 'absolute' } },
                React.createElement('div', { className: 'centered-text overlay' },
                    React.createElement('div', { className: 'centered-text-wrapper' },
                        React.createElement('div', { className: 'content-container' },
                            React.createElement('img', {
                                src: 'hud/img/ui/loading-small.gif',
                            })
                        )
                    )
                )
            )
        }

        var isNarrow = globalState.screenHeight < 900

        var ownedDlc = _.includes(globalState.campaignDlcOwned, 'Campaign' + parent.state.map.mapNumber)
        if (parent.state.map.mapNumber == 1) // Campaign 1 is included in the base game
            ownedDlc = true

        return React.createElement('div', { id: 'CampaignMap'  },
            React.createElement('div', {
                className: 'fullscreen',
                onMouseDown: function (e) { // v1.50
                    engine.trigger('enableChat', false)
                },
                style: {
                    pointerEvents: 'all'
                }
            },
                !isNarrow && React.createElement('div', { className: 'TabbedMenu', style: { height: '64px' } },
                    React.createElement('div', { className: 'tabbed-menu-title', style: { lineHeight: 'normal' } },
                        loc('campaign', 'Campaign') + ': ' + parent.state.map.name
                    )
                ),
                React.createElement('div', { className: 'centered-text overlay no-background' },
                    React.createElement('div', { className: 'centered-text-wrapper' },
                        React.createElement('div', { className: 'content-container' },
                            React.createElement('div', { className: 'main' },
                                parent.state.map != null && parent.state.map.missions != null && parent.state.map.missions.map(function (mission, index) {
                                    if (parent.state.selectedMissionNumber != mission.props.MissionNumber) return null

                                    var earnedStar1 = _.includes(mission.stars, 1)
                                    var earnedStar2 = _.includes(mission.stars, 2)
                                    var earnedStar3 = _.includes(mission.stars, 3)

                                    var starsHtml = ''
                                    starsHtml += '<img src="hud/img/icons/campaign/' + (!earnedStar1 ? 'no-' : '') + 'star.png"/>'
                                    starsHtml += '<img src="hud/img/icons/campaign/' + (!earnedStar2 ? 'no-' : '') + 'star.png"/>'
                                    starsHtml += '<img src="hud/img/icons/campaign/' + (!earnedStar3 ? 'no-' : '') + 'star.png"/>'

                                    var ratingImage = getRatingImage(mission.props.DisplayRating)
                                    var splashImage = ''
                                    if (mission.props.Icon)
                                        splashImage = mission.props.Icon.replace('Icons', 'splashes').replace('icons', 'splashes')

                                    var hardModeEnabled = earnedStar1 && earnedStar2

                                    return React.createElement('div', { className: 'selected-mission' },
                                        React.createElement('div', { className: 'content-bar' + (isNarrow ? ' narrow' : '') },
                                            React.createElement('img', { className: 'avatar', src: 'hud/img/' + splashImage }),
                                            React.createElement('div', {
                                                style: {
                                                    position: 'relative',
                                                    top: '0',
                                                    zIndex: '-1',
                                                    display: 'inline',
                                                    left: '-96px',
                                                    marginRight: '-64px'
                                                }
                                            },
                                                React.createElement('img', {
                                                    src: 'hud/img/ui/loading-small.gif',
                                                })
                                            ),
                                            React.createElement('div', { className: 'selected-mission-vitals' },
                                                React.createElement('span', { className: 'name' }, mission.props.Name),
                                                ratingImage && React.createElement('img', { className: 'rating', src: ratingImage }),
                                                React.createElement('span', { className: 'simple-tooltip flag-icon flag-icon-' + mission.props.DisplayCountryCode },
                                                    React.createElement('span', { className: 'tooltiptext auto' }, mission.displayCountryName)
                                                ),
                                                React.createElement('div', {
                                                    className: 'description',
                                                    dangerouslySetInnerHTML: {
                                                        __html: mission.props.Description
                                                    }
                                                }),
                                                React.createElement('div', {
                                                    className: 'view-hint simple-tooltip'
                                                },
                                                    React.createElement('span', {
                                                        className: 'tooltiptext extra-wide ',
                                                        dangerouslySetInnerHTML: {
                                                            __html: loc('campaign_' + parent.state.map.mapNumber + '_' + mission.props.MissionNumber + '_hint', 'Strike a good balance between building fighters and training workers, and you\'ll be sure to come out on top.')
                                                        }
                                                    }),
                                                    loc('view_hint', 'View Hint')
                                                )
                                            ),
                                            React.createElement('div', { className: 'right-column' },
                                                React.createElement('div', { className: 'stars' },
                                                    React.createElement('div', { className: 'star' },
                                                        earnedStar1 && React.createElement('img', { src: 'hud/img/icons/Campaign/star.png' }),
                                                        !earnedStar1 && React.createElement('img', { src: 'hud/img/icons/Campaign/no-star.png' }),
                                                        React.createElement('span', { className: 'star-description' }, loc('campaign_star_1', 'Any victory')),
                                                        React.createElement('span', { style: { textTransform: 'uppercase', color: '#8ff110' } }, ' (+' + mission.props.RewardXP + ' ' + loc('xp', 'Xp') + ')')
                                                    ),
                                                    React.createElement('div', { className: 'star' },
                                                        earnedStar2 && React.createElement('img', { src: 'hud/img/icons/Campaign/star.png' }),
                                                        !earnedStar2 && React.createElement('img', { src: 'hud/img/icons/Campaign/no-star.png' }),
                                                        React.createElement('span', { className: 'star-description' }, loc('campaign_star_2', 'Victory with no leaks'))
                                                    ),
                                                    React.createElement('div', { className: 'star' },
                                                        earnedStar3 && React.createElement('img', { src: 'hud/img/icons/Campaign/star.png' }),
                                                        !earnedStar3 && React.createElement('img', { src: 'hud/img/icons/Campaign/no-star.png' }),
                                                        React.createElement('span', { className: 'star-description' }, loc('campaign_star_3', 'Victory on Hard mode'))
                                                    )//,
                                                    //React.createElement('div', { style: {  color: '#c0c0c0' } }, 'Each star gives bonus Essence!')
                                                ),
                                                ownedDlc && React.createElement('div', {
                                                    ref: 'playCampaignButton',
                                                    className: 'selected-mission-play button big em',
                                                    onMouseEnter: function (e) {
                                                        engine.call("OnMouseOverMedium", mission.props.MissionNumber) // just use length so we don't leak strings
                                                    },
                                                    onMouseDown: function (e) {
                                                        console.log('click play mission')
                                                        parent.playMission(mission, starsHtml, hardModeEnabled)
                                                    }
                                                },
                                                    loc('play', 'Play')
                                                ),
                                                !ownedDlc && React.createElement('div', {
                                                    ref: 'playCampaignButton',
                                                    className: 'selected-mission-play button big em simple-tooltip',
                                                    onMouseEnter: function (e) {
                                                        engine.call("OnMouseOverMedium", mission.props.MissionNumber) // just use length so we don't leak strings
                                                    },
                                                    onMouseDown: function (e) {
                                                        console.log('click play mission')
                                                        parent.playMission(mission, starsHtml, hardModeEnabled)
                                                    }
                                                },
                                                    React.createElement('span', { className: 'tooltiptext' },
                                                        loc('campaign_requires_dlc', 'Requires DLC to be owned by at least one party member')
                                                    ),
                                                    loc('play', 'Play')
                                                )
                                            )
                                        ),
                                        React.createElement('div', { className: 'map' },
                                            React.createElement('img', { className: 'splash first-campaign-image', src: 'hud/img/splashes/Campaign/map/campaign_' + parent.state.map.mapNumber + '_1.jpg', style: { position: 'absolute', left: '0' }, ref: 'map' }), // Backer that is preloaded
                                            React.createElement('img', { className: 'splash second-campaign-image', src: 'hud/img/splashes/Campaign/map/campaign_' + parent.state.map.mapNumber + '_' + parent.state.map.firstUnclearedMissionNumber + '.jpg', style: { position: 'relative', zIndex: '1'} }),
                                            parent.state.map.missions.map(function (mission, index) {

                                                var innerEarnedStar1 = _.includes(mission.stars, 1)
                                                var innerEarnedStar2 = _.includes(mission.stars, 2)
                                                var innerEarnedStar3 = _.includes(mission.stars, 3)

                                                var isUndiscovered = mission.props.MissionNumber > parent.state.firstUnclearedMissionNumber && mission.stars.length == 0
                                                var isSelected = mission.props.MissionNumber == parent.state.selectedMissionNumber
                                                var isHovered = mission.props.MissionNumber == parent.state.hoveredMissionNumber

                                                var imgName = parent.state.map.mapNumber + '_' + mission.props.MissionNumber
                                                var markerImage = 'hud/img/campaign/markers/' + imgName + '.png'
                                                if (isUndiscovered)
                                                    markerImage = 'hud/img/campaign/markers/' + imgName + '_u.png'
                                                else if (isSelected)
                                                    markerImage = 'hud/img/campaign/markers/' + imgName + '_s.png'
                                                else if (isHovered)
                                                    markerImage = 'hud/img/campaign/markers/' + imgName + '_h.png'

                                                return React.createElement('div', {
                                                    className: 'campaign-marker',
                                                    style: {
                                                        position: 'absolute',
                                                        left: mission.props.ImageLeftPixels + 'px',
                                                        bottom: mission.props.ImageBottomPixels + 'px',
                                                        zIndex: '2',
                                                    },
                                                    onMouseEnter: function (e) {
                                                        if (isUndiscovered) return

                                                        if (!isSelected)
                                                            engine.call('OnHoveredAnotherMission')
                                                        engine.trigger('setHoveredCampaignMissionNumber', mission.props.MissionNumber)
                                                    },
                                                    onMouseLeave: function (e) {
                                                        if (isUndiscovered) return

                                                        engine.trigger('setHoveredCampaignMissionNumber', 0)
                                                    },
                                                    onMouseDown: function (e) {
                                                        if (isUndiscovered) return

                                                        var currentTicks = new Date().getTime()
                                                        var agoSeconds = (currentTicks - parent.lastClicked) / 1000
                                                        //console.log('lastClicked: ' + parent.lastClicked)
                                                        //console.log('agoSeconds: ' + agoSeconds)
                                                        parent.lastClicked = currentTicks

                                                        // Already selected --> Play instead
                                                        if (isSelected && agoSeconds < 0.5) {
                                                            console.log('already selected and doubleclick --> try to click play btn')
                                                            parent.playMission(mission, starsHtml, hardModeEnabled)
                                                            return
                                                        }

                                                        engine.call('OnClickedMission')

                                                        // PTR11: only do it if it's a change, to ensure we don't accidentally keep relooping BGM when we click
                                                        if (!isSelected) {
                                                            console.log('select mission ' + mission.props.MissionId + ' (number: ' + mission.props.MissionNumber + ')')
                                                            engine.trigger('setSelectedCampaignMissionNumber', mission.props.MissionNumber, mission.props.MissionId)
                                                        }

                                                        // Vfx
                                                        var rect = parent.refs.map.getBoundingClientRect();
                                                        //console.log(rect.top, rect.right, rect.bottom, rect.left);
                                                        //console.log('fxOffset: ' + fxOffset.x + ', ' + fxOffset.y)
                                                        var screenLeft = rect.left + (mission.props.ImageLeftPixels + 64)
                                                        var screenTop = rect.bottom - (mission.props.ImageBottomPixels - 64)
                                                        //console.log('screenLeft: ' + screenLeft + ', screenTop: ' + screenTop)
                                                        engine.call('OnCreateVFX', 'choose_mission_effect_id', screenLeft, screenTop)
                                                    },
                                                },
                                                    React.createElement('img', {
                                                        src: markerImage,
                                                        style: {
                                                            position: 'absolute',
                                                        }
                                                    }),
                                                    //React.createElement('img', {
                                                    //    src: 'hud/img/icons/Campaign/campaign_' + parent.state.map.mapNumber + '_' + mission.props.MissionNumber + '.png',
                                                    //    style: {
                                                    //        position: 'absolute',
                                                    //        pointerEvents: 'none',
                                                    //        left: '8px',
                                                    //        top: '10px',
                                                    //        height: '48px'
                                                    //    }
                                                    //}),
                                                    (isSelected || isHovered) && React.createElement('img', {
                                                        src: 'hud/img/Campaign/campaign_cursor.png',
                                                        className: 'cursor' + (isSelected ? ' selected' : '') + (isHovered ? ' hovered' : ''),
                                                        style: {
                                                            position: 'absolute',
                                                            left: '50px',
                                                            top: '-48px'
                                                        }
                                                    }),
                                                    React.createElement('div', { className: 'stars' },
                                                        React.createElement('span', { className: 'star' },
                                                            innerEarnedStar1 && React.createElement('img', { src: 'hud/img/icons/Campaign/star.png' }),
                                                            !innerEarnedStar1 && React.createElement('img', { src: 'hud/img/icons/Campaign/no-star.png' })
                                                        ),
                                                        React.createElement('span', { className: 'star' },
                                                            innerEarnedStar2 && React.createElement('img', { src: 'hud/img/icons/Campaign/star.png' }),
                                                            !innerEarnedStar2 && React.createElement('img', { src: 'hud/img/icons/Campaign/no-star.png' })
                                                        ),
                                                        React.createElement('span', { className: 'star' },
                                                            innerEarnedStar3 && React.createElement('img', { src: 'hud/img/icons/Campaign/star.png' }),
                                                            !innerEarnedStar3 && React.createElement('img', { src: 'hud/img/icons/Campaign/no-star.png' })
                                                        )
                                                    )
                                                )
                                            }),
                                            React.createElement('div', { className: 'map-name' },
                                                React.createElement('span', { className: 'name' }, parent.state.map.name),
                                                React.createElement('img', { src: 'hud/img/icons/Campaign/star.png', style: { height: '16px', marginLeft: '6px' } }),
                                                React.createElement('span', { className: 'stars-text' }, parent.state.map.starsEarned + '/' + parent.state.map.maxStars)
                                            )
                                        )
                                    )
                                })
                            )
                        )
                    )
                ),
                React.createElement('div', { className: 'confirmation-buttons' },
                    React.createElement(StandardMenuButton, {
                        name: loc('back', 'Back'),
                        displayName: loc('back', 'Back'),
                        behavior: function () {
                            engine.trigger('escape')
                        }
                    })
                )
            )
        )
    }
})

var FeaturedModeView = React.createClass({
    getInitialState: function () {
        return {
            featuredModeProps: null,
            leaderboardEntries: [],
            leaderboardEntriesAroundMe: [],
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshFeaturedModeView = function (featuredModeProps, leaderboardEntries, leaderboardEntriesAroundMe) {
            parent.setState({
                featuredModeProps: featuredModeProps,
                leaderboardEntries: leaderboardEntries,
                leaderboardEntriesAroundMe: leaderboardEntriesAroundMe
            })
        }
    },
    render: function () {
        var parent = this

        if (this.state.featuredModeProps == null) {
            return React.createElement('div', { style: { height: '100vh', width: '100vw', position: 'absolute' } },
                React.createElement('div', { className: 'centered-text overlay' },
                    React.createElement('div', { className: 'centered-text-wrapper' },
                        React.createElement('div', { className: 'content-container' },
                            React.createElement('img', {
                                src: 'hud/img/ui/loading-small.gif',
                            })
                        )
                    )
                )
            )
        }

        var isZero = false
        this.state.leaderboardEntriesAroundMe.map(function (entry, index) {
            if (entry.elo == 0)
                isZero = true
        })

        var modeTooltip = ''
        globalState.arcadeMode.forEach(function (mode) {
            modeTooltip += '<img src="' + icons[mode.toLowerCase()] + '" class="tooltip-icon"> '
            modeTooltip += loc('arcade_queue_' + mode.toLowerCase(), mode + " Mode: To build a tower, you pick a tier. A fighter is then randomly selected from that tier! (Placeholder descript)") + "<br/>"
        })
        modeTooltip = modeTooltip.replace(/,\s*$/, ""); // Remove last comma

        return React.createElement('div', { id: 'WeeklyChallenge' },
            React.createElement('div', {
                className: 'fullscreen',
                onMouseDown: function (e) { // v1.50
                    engine.trigger('enableChat', false)
                },
                style: {
                    pointerEvents: 'all'
                }
            },
                React.createElement('div', { className: 'centered-text overlay' },
                    React.createElement('div', { className: 'centered-text-wrapper' },
                        React.createElement('div', { className: 'content-container' },
                            React.createElement('div', { className: 'main' },
                                React.createElement('div', {
                                    className: 'title', style: { marginBottom: '12px' } },
                                    React.createElement('img', { className: 'title-icon', src: 'hud/img/icons/EventPoints.png' }),
                                    loc('featured_mode_leaderboard', 'Featured Mode Leaderboard'),
                                    React.createElement('img', { className: 'title-icon', src: 'hud/img/icons/EventPoints.png' })
                                ),
                                React.createElement('div', {},
                                    React.createElement('table', {
                                        ref: 'leaderboard', className: 'leaderboard scrollable weekly-challenge-main-leaderboard',
                                        style: {
                                            overflowY: 'auto',
                                            height: '394px',
                                            display: 'block'
                                        }
                                    },
                                        React.createElement('thead', {},
                                            React.createElement('tr', {},
                                                React.createElement('td', { className: 'rank' }, loc('leaderboard_rank', "Rank")),
                                                React.createElement('td', { className: 'unclickable name' }, loc('player', "Player")),
                                                React.createElement('td', { className: 'unclickable country' }, loc('country', "Country")),
                                                React.createElement('td', { className: 'unclickable', style: { minWidth: '90px' } }, loc('rating', "Rating")),
                                                React.createElement('td', { style: { minWidth: '120px' } }, locName('event_points', 'Event Points') + ' (EP)')
                                            )
                                        ),
                                        React.createElement('tbody', { className: 'addspace' },
                                            React.createElement('tr', { style: { height: '12px' } }, React.createElement('td', { style: { background: 'rgba(0, 0, 0, 0.5)' }, colSpan: '5' })),
                                            this.state.leaderboardEntries.map(function (entry, index) {
                                                var isSelf = entry.name == globalState.savedUsername
                                                var green = isSelf || entry.isFriend
                                                //console.log('Rendering leaderboard entry with name: ' + entry.name)
                                                return React.createElement('tr', { className: isSelf ? 'highlighted' : '' },
                                                    React.createElement('td', { className: 'rank' }, entry.rank),
                                                    React.createElement('td', {
                                                        className: 'name',
                                                        onMouseDown: function (e) {
                                                            var left = e.nativeEvent.clientX
                                                            var top = e.nativeEvent.clientY

                                                            if (e.nativeEvent.which == 2) return // v2.22 fix

                                                            openContextMenu(entry.playFabId, entry.name, rightClickLeaderboardEntryMenu, left, top)
                                                        },
                                                    },
                                                        React.createElement('span', { className: getAvatarStacksClass(entry.avatarStacks) },
                                                            React.createElement('img', { src: 'hud/img/' + entry.avatar })
                                                        ),
                                                        ' ',
                                                        green && React.createElement('span', { style: { color: '#81ff10' } }, entry.name),
                                                        !green && React.createElement('span', {}, entry.name)
                                                    ),
                                                    // NOTE: For some reason this country code is causing Coherent to complain about
                                                    // Missing texture for image, see email for more details about that, but basically it
                                                    // doesn't like when we are rendering to canvas something that hasn't been added to DOM
                                                    // yet or something... seems harmless for now though?
                                                    React.createElement('td', { className: 'country' },
                                                        React.createElement('span', { className: 'simple-tooltip flag-icon flag-icon-' + entry.countryCode },
                                                            React.createElement('span', { className: 'tooltiptext' }, entry.countryName)
                                                        )
                                                    ),
                                                    // ^
                                                    React.createElement('td', { className: 'elo' },
                                                        getRatingImage(entry.elo) && React.createElement('img', { src: getRatingImage(entry.elo) }),
                                                        getRatingImage(entry.elo) && React.createElement('span', {
                                                            className: 'rating-numeral', style: {
                                                                right: '20px', marginRight: '-25px', width: '20px', display: 'inline-block'
                                                            }
                                                        }, getRatingDivisionNumeral(entry.elo)),
                                                        React.createElement('span', { style: { position: 'relative' } }, entry.elo)
                                                    ),
                                                    React.createElement('td', { className: 'score'},
                                                        React.createElement('span', { style: { position: 'relative' } }, entry.eventPoints)
                                                    )
                                                )
                                            })
                                        )
                                    ),
                                    !isZero && this.state.leaderboardEntriesAroundMe.length > 0 && React.createElement('table', {
                                        className: 'leaderboard scrollable weekly-challenge-around-me-leaderboard', style: {
                                            marginTop: '12px',
                                            borderRight: this.state.leaderboardEntries.length > 11 ? '10px solid #1e1e1e' : ''/* HACK */
                                        }
                                    },
                                        React.createElement('tbody', { className: 'addspace' },
                                            React.createElement('tr', { style: { height: '12px' } }, React.createElement('td', { style: { background: 'rgba(0, 0, 0, 0.5)' }, colSpan: '5' })),
                                            this.state.leaderboardEntriesAroundMe.map(function (entry, index) {
                                                var isSelf = entry.name == globalState.savedUsername
                                                var green = isSelf || entry.isFriend

                                                //console.log('Rendering leaderboard entry with name: ' + entry.name)
                                                return React.createElement('tr', { className: isSelf ? 'highlighted' : '' },
                                                    React.createElement('td', { className: 'rank' }, entry.rank),
                                                    React.createElement('td', {
                                                        className: 'name',
                                                        onMouseDown: function (e) {
                                                            var left = e.nativeEvent.clientX
                                                            var top = e.nativeEvent.clientY

                                                            if (e.nativeEvent.which == 2) return // v2.22 fix

                                                            openContextMenu(entry.playFabId, entry.name, rightClickLeaderboardEntryMenu, left, top)
                                                        }
                                                    },
                                                        React.createElement('span', { className: getAvatarStacksClass(entry.avatarStacks) },
                                                            React.createElement('img', { src: 'hud/img/' + entry.avatar })
                                                        ),
                                                        ' ',
                                                        green && React.createElement('span', { style: { color: '#81ff10' } }, entry.name),
                                                        !green && React.createElement('span', {}, entry.name)
                                                    ),
                                                    React.createElement('td', { className: 'country' },
                                                        React.createElement('span', { className: 'simple-tooltip flag-icon flag-icon-' + entry.countryCode },
                                                            React.createElement('span', { className: 'tooltiptext' }, entry.countryName)
                                                        )
                                                    ),
                                                    React.createElement('td', { className: 'elo' },
                                                        getRatingImage(entry.elo) && React.createElement('img', { src: getRatingImage(entry.elo) }),
                                                        getRatingImage(entry.elo) && React.createElement('span', {
                                                            className: 'rating-numeral', style: {
                                                                right: '20px', marginRight: '-25px', width: '20px', display: 'inline-block'
                                                            }
                                                        }, getRatingDivisionNumeral(entry.elo)),
                                                        entry.elo
                                                    ),
                                                    React.createElement('td', { className: 'score', style: { minWidth: '120px' }  },
                                                        React.createElement('span', { style: { position: 'relative' } }, entry.eventPoints)
                                                    )
                                                )
                                            })
                                        )
                                    )
                                )
                            ),
                            React.createElement('div', { className: 'sidebar' },
                                //React.createElement('div', { className: 'subtitle' }, loc('this_week_challenge', "This Week's Challenge")),
                                React.createElement('div', {
                                    className: 'challenge-details scrollable',
                                    style: {
                                        height: 'calc(100% - 120px)'
                                    }
                                },
                                    React.createElement('div', {
                                        style: {
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            padding: '10px',
                                            marginBottom: '10px'
                                        }
                                    },
                                        React.createElement('div', { className: 'challenge-label' }, loc('featuredmode', 'Featured Mode')),
                                        React.createElement('div', {
                                            dangerouslySetInnerHTML: {
                                                __html: modeTooltip
                                            }
                                        })
                                    ),
                                    React.createElement('div', { className: 'challenge-label' }, loc('how_to_earn_event_points', 'How to earn Event Points (EP)')),
                                    React.createElement('div', {
                                        style: { color: "#fff" },
                                        dangerouslySetInnerHTML: {
                                            __html: loc('event_points', 'EP is gained/lost after each game. You gain +2 EP after each game, plus an amount depending on the Event Ratings of you and your opponents. The system is elo-based, just like in Ranked.')
                                        }
                                    }),
                                    React.createElement('div', { className: 'challenge-label' }, locName('event_rating', 'Event Rating')),
                                    React.createElement('div', {
                                        style: { color: "#fff" },
                                        dangerouslySetInnerHTML: {
                                            __html: loc('event_rating', 'Your initial rating is based on your Ranked & Classic ratings at the start of the event. It rises/falls just like a normal rating. It is used only for matchmaking and bragging rights.')
                                        }
                                    }),
                                    React.createElement('div', { className: 'challenge-label' }, loc('rewards', 'Rewards')),
                                    React.createElement('div', {
                                        style: {
                                            color: "#fff"
                                        },
                                        dangerouslySetInnerHTML: {
                                            __html: loc('event_rewards', 'Rewards are based off of your final EP.<br>Top 10: 2,000 Premium Essence<br>Top 100: 1,000 Premium Essence<br>Top 500: 500 Premium Essence')
                                        }
                                    })
                                ),
                                React.createElement('div', { className: 'mission-select' },
                                    React.createElement(EmphasizedMenuButton, {
                                        name: "Enter Queue",
                                        displayName: loc('play', "Play"),
                                        locked: false,
                                        behavior: function () {
                                            engine.trigger('loadView', 'launcher')
                                            engine.trigger('trySearchGame', 'arcade')
                                        }
                                    })
                                )
                            )
                        )
                    )
                ),
                React.createElement('div', { className: 'confirmation-buttons' },
                    React.createElement(StandardMenuButton, {
                        name: loc('back', 'Back'),
                        displayName: loc('back', 'Back'),
                        behavior: function () {
                            engine.trigger('escape')
                        }
                    })
                )
            )
        )
    }
})