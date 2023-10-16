// Client Modifiers (e.g. safety mode is on, you are muted, patch coming soon, etc.)
// =============================================================================================

var ClientModifiers = React.createClass({
    propTypes: {
        modifiers: React.PropTypes.array,
    },
    getInitialState: function () {
        return {
            questProps: globalState.questProps
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshCurrentQuest = function (questProps) {
            globalState.questProps = questProps

            console.log('refreshCurrentQuest: ' + JSON.stringify(questProps))

            parent.setState({
                questProps: questProps
            })
        }
    },
    render: function () {
        var parent = this

        var claimable = parent.state.questProps.claimable

        return (
            React.createElement('div', { id: 'ClientModifiersContainer' },
                React.createElement('ul', { id: 'ClientModifiers', className: 'icons' },
                    this.props.modifiers.map(function (modifier) {
                        var headerHtml = modifier.header ? modifier.header + "<br />" : ""
                        return React.createElement('li', {
                            key: modifier.key,
                            className: 'modifier simple-tooltip flipped-y-right',
                            onMouseDown: function (e) {
                                if (modifier.url)
                                    engine.call("OnOpenURL", modifier.url)

                                if (modifier.trigger)
                                    engine.trigger(modifier.trigger)

                                e.stopPropagation()
                            }
                        },
                            React.createElement('img', { className: 'icon ', src: 'hud/img/' + modifier.image }),
                            modifier.stacks != null && modifier.stacks > 0 && React.createElement('div', { className: 'icon-stacks' },
                                modifier.stacks
                            ),
                            React.createElement('span', {
                                className: 'tooltiptext wide',
                                dangerouslySetInnerHTML: { __html: headerHtml + modifier.subheader }
                            })
                        )
                    })
                ),
                parent.state.questProps.progress != null && parent.state.questProps.progress >= 0 && React.createElement('div', { className: 'limited-time-goal' },
                    React.createElement('img', { className: 'limited-time-goal-prize', src: 'hud/img/icons/GameCoach.png' }),
                    React.createElement('span', { className: 'limited-time-goal-content' },
                        React.createElement('div', { className: 'limited-time-goal-title' },
                            parent.state.questProps.title,
                            React.createElement('span', { className: 'time-remaining' }, parent.state.questProps.subtitle)
                        ),
                        React.createElement('div', {
                            className: "progress-container"
                        },
                            React.createElement('div', {
                                className: "progress-bar slate", style: {
                                    width: (100 * parent.state.questProps.progress) + "%",
                                }
                            }),
                            React.createElement('span', {
                                className: 'value limited-time-goal-text',
                                dangerouslySetInnerHTML: {
                                    __html: parent.state.questProps.text
                                }
                            })
                        ),
                        React.createElement('div', {
                            className: 'button em ' + (claimable ? 'orange' : 'disabled'),
                            onMouseDown: function (e) {
                                if (!claimable) return

                                console.log('Clicked Claim')
                                engine.call('OnClaimQuestReward')

                                 // JANKY way to keep you on the main screen
                                setTimeout(function () {
                                    engine.trigger('loadView', 'launcher')
                                    engine.trigger('loadPopupBlank', loc('loading', 'Loading') + '...')
                                }, 10)
                            }
                        },
                            loc('claim', 'Claim'),
                            React.createElement('img', { className: 'small-icon', src: 'hud/img/shop/currency/Essence_20.png' }),
                            500 // Smelly hardcoded
                        )
                    )
                )
            )
        )
    }
})
