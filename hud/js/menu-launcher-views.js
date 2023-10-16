// Launcher
// =============================================================================================

LauncherView = React.createClass({
    propTypes: {
        items: React.PropTypes.array
    },
    render: function () {
        return (
            React.createElement('div', {
                id: 'LauncherView',
                onMouseDown: function (e) { // v1.50
                    engine.trigger('enableChat', false)
                },
                style: {
                    pointerEvents: 'all'
                }
            },
                //React.createElement(LogoCentered, {}),
                React.createElement(LogoTopLeft, {}),
                React.createElement('div', { className: 'anchor1', style: { bottom: '2vh', top: 'auto' } },
                    React.createElement('div', { className: 'centered-text', style: { height: '98vh', margin: '0 3vw' } },
                        React.createElement('div', { className: 'centered-text-wrapper' },
                            //React.createElement(Logo, {}),
                            React.createElement(LauncherMenu, { name: "root", items: this.props.items.filter(function (item) { return item.huge }) }),
                            React.createElement(LauncherMenu, { name: "subroot", items: this.props.items.filter(function (item) { return !item.huge }) })
                        )
                    )
                ),
                React.createElement('div', { className: 'anchor2' },
                    React.createElement(SearchingForGame, {})
                ),
                React.createElement('div', { className: 'anchor3' },
                    React.createElement(ClientNotifications, {}),
                    React.createElement(SidebarMenu, {})
                ),
                React.createElement('div', { className: 'anchor4' }),
                React.createElement('div', { className: 'anchor5' }),
                React.createElement('div', { className: 'anchor6' }),
                React.createElement('div', { className: 'anchor7' }),
                React.createElement('div', { className: 'anchor8' }),
                React.createElement('div', {
                    className: 'fullscreen',
                    onMouseDown: function (e) { // v1.50
                        engine.trigger('enableChat', false)

                        if (e.button === 1) e.preventDefault(); // Disable middle-click scroll
                    },
                    style: {
                        pointerEvents: 'all'
                    }
                })
            )
        )
    }
})

LauncherMenu = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        items: React.PropTypes.array.isRequired
    },
    render: function () {
        parent = this
        return (
            React.createElement('div', { className: 'launcher-buttons' },
                React.createElement('ul', {},
                    this.props.items.map(function (item) {
                        if (!item) return null // Codex patch, just prevents some dumb warnings

                        return React.createElement('div', { key: item.key },
                            React.createElement(LauncherMenuButton, {
                                key: item.menuId,
                                name: item.name,
                                displayName: (item.displayName != null) ? item.displayName : item.name,
                                behavior: item.behavior,
                                disabled: item.disabled,
                                huge: item.huge,
                                smallText: item.smallText,
                                tooltip: item.tooltip,
                                style: item.style,
                            })
                        )
                    })
                )
            )
        )
    }
})

LauncherMenuButton = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        behavior: React.PropTypes.func,
        disabled: React.PropTypes.bool,
        huge: React.PropTypes.bool,
        smallText: React.PropTypes.object,
        tooltip: React.PropTypes.object,
        style: React.PropTypes.object,
    },
    getInitialState: function () {
        return {
            active: false
        }
    },
    render: function () {
        parent = this
        return (
            React.createElement(TextMenuButton, this.props)
        )
    }
})