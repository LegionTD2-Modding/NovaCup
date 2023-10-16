// Reusable components used across multiple views
// If it's specialized for a single view, just make a new -views.js file
// ===============================================================================

var ContextMenu = React.createClass({
    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
    },
    getInitialState: function () {
        var menuUUID = 0
        return {
            enabled: false,
            customStyle: {},
            actions: [],
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.openContextMenu = function () {
            parent.setState({
                enabled: true,
            })
        }
        bindings.closeContextMenu = function () {
            parent.setState({ enabled: false })
        }
        bindings.setContextMenuPosition = function (left, top, flipY, newStyle) {
            left = Math.max(Math.min(left, window.innerWidth - parent.props.width - 6), 0)

            var flipYOffset = 70
            if (globalState.screenWidth >= 2561)
                flipYOffset = 160

            if (!flipY)
                top = Math.max(Math.min(top, window.innerHeight - parent.props.height - flipYOffset), 0)
            else
                top = Math.max(Math.min(top, window.innerHeight - parent.props.height), 0)

            var defaultStyle = {
                position: 'fixed',
                top: top + 'px',
                right: 'unset',
                bottom: 'unset',
                left: left + 'px',
                width: parent.props.width + 'px',
            }

            var mergedStyle = _.merge(defaultStyle, newStyle)
            parent.setState({ customStyle: mergedStyle })
        }
        bindings.refreshContextMenuActions = function (actions) {
            parent.setState({ actions: actions })
        }
    },
    render: function () {
        var parent = this
        return (
            React.createElement('div', { id: 'ContextMenuContainer' },
                React.createElement('div', {
                    id: "ContextMenuBacker",
                    className: this.state.enabled ? '' : ' hidden',
                    onMouseDown: function (e) {
                        //console.log("clicked context menu backer " + e)
                        engine.trigger('closeContextMenu')
                    }
                }),
                React.createElement('div', {
                    id: "ContextMenu",
                    className: this.state.enabled ? '' : ' hidden',
                    style: this.state.customStyle,
                },
                    globalState.contextMenuDisplayTarget && React.createElement('div', { className: 'header' }, globalState.contextMenuDisplayTarget),
                    React.createElement('ul', { className: 'content' },
                        this.state.actions && this.state.actions.map(function (action) {
                            var displayName = (action.displayName != null) ? action.displayName : action.name
                            return React.createElement('li', {
                                key: action.menuId,
                                className: action.disabled ? 'disabled' : '',
                                onClick: function () {
                                    engine.trigger('closeContextMenu')
                                    if (action.behavior && !action.disabled)
                                        action.behavior()
                                },
                                dangerouslySetInnerHTML: {
                                    __html: displayName
                                }
                            })
                        })
                    )
                )
            )
        )
    }
})

var DropdownLinks = React.createClass({
    propTypes: {
        choices: React.PropTypes.array, // array of objects of type: { text: "Display Text", action: function() { do stuff } }
        defaultValue: React.PropTypes.string,
        actualValue: React.PropTypes.string, // optional (advanced: for using arrow keys in post-game builds for example)
        inline: React.PropTypes.bool, // optional
    },
    getInitialState: function () {
        return {
            value: this.props.defaultValue,
            show: false,
        }
    },
    componentWillMount: function () {
        var parent = this
    },
    render: function () {
        var parent = this
        var valueToRender = parent.props.actualValue
        if (valueToRender == null)
            valueToRender = parent.state.value

        return (
            React.createElement('div', { className: this.props.inline ? 'dropdown-links-inline' : '' },
                React.createElement('div', {
                    className: "hide-popup-backer fixed" + (this.state.show ? '' : ' hidden'),
                    onMouseDown: function (event) {
                        parent.setState({ show: false })
                    }
                }),
                React.createElement('div', {
                    className: 'button square',
                    onMouseDown: function (event) {
                        if (event.nativeEvent.which == 1) {
                            parent.setState({ show: true })
                            engine.call('OnClickDropdownOption')
                        }
                    },
                    dangerouslySetInnerHTML: {
                        // 9662 was nice, but missing on Mac
                        //__html: valueToRender + '<span style="float: right; width: 0px;">' + String.fromCharCode(9662) + '</span>'
                        __html: valueToRender + '<span style="float: right; width: 0px;"><img src="hud/img/small-icons/sort-triangle.png"></span>'
                    }
                }),
                React.createElement('div', { className: 'dropdown-panel' + (this.state.show ? '' : ' hidden') },
                    this.props.choices.map(function (item) {
                        var text = item.text
                        return React.createElement('div', {
                            key: text,
                            className: 'dropdown-item' + ((text == parent.state.value) ? ' selected' : ''),
                            onMouseDown: function (e) {
                                parent.setState({ show: false, value: text })
                                item.action()
                                engine.call('OnClickDropdownOption')
                            },
                            dangerouslySetInnerHTML: {
                                __html: item.html != null ? item.html : item.text
                            }
                        })
                    })
                )
            )
        )
    }
})

var Logo = React.createClass({
    render: function () {
        return (
            //React.createElement('img', { style: { height: '25vh' }, src: 'hud/img/brand/legiontd2.png' })
            React.createElement('img', { style: { height: '64px', marginBottom: '64px' }, src: 'hud/img/brand/legiontd2horizontal.png' })
        )
    }
})

var LogoCentered = React.createClass({
    render: function () {
        var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160
        return (
            React.createElement('div', {
                style: {
                    position: 'absolute',
                    width: '100vw',
                    textAlign: 'center',
                    top: uhd ? '128px' : '64px'
                }
            },
                React.createElement('img', {
                    style: {
                        height: uhd ? '128px' : '64px',
                        margin: 'auto'
                    }, src: 'hud/img/brand/legiontd2horizontal.png'
                })
            )
        )
    }
})

var LogoTopLeft = React.createClass({
    render: function () {
        var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160
        return (
            React.createElement('div', {
                id: 'MenuLogo',
                style: {
                    position: 'absolute',
                    width: '100vw',
                    textAlign: 'left',
                    top: uhd ? '128px' : '64px',
                    left: '4vw'
                }
            },
                React.createElement('img', {
                    style: {
                        height: uhd ? '128px' : '64px',
                        margin: 'auto'
                    }, src: 'hud/img/brand/legiontd2horizontal.png'
                }),
                React.createElement('div', {
                    style:
                    {
                        margin: '8px 0 0 8px',
                        color: '#909090'
                    }
                },
                    globalState.clientVersion
                )
            )
        )
    }
})

var Aag = React.createClass({
    render: function () {
        return (
            React.createElement('img', { src: 'hud/img/brand/aag.png' })
        )
    }
})

var Copyright = React.createClass({
    render: function () {
        return (
            React.createElement('div', {
                style: {
                    color: 'rgba(255, 255, 255, 0.75)',
                    padding: '1vh 1vw',
                    width: '40vw',
                    lineHeight: 'normal',
                }
            },
                loc('copyright', String.fromCharCode(169) + "2019 AutoAttack Games, Inc. Legion TD and Legion TD 2 are trademarks or registered trademarks of AutoAttack Games, Inc.")
            )
        )
    }
})