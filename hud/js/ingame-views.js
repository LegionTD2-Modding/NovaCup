// Ingame
// =============================================================================================

var IngameView = React.createClass({
    propTypes: {
        items: React.PropTypes.array
    },
    render: function () {
        return (
            React.createElement('div', { id: 'IngameMenuView' },
                React.createElement('div', { className: 'anchor1' }),
                React.createElement('div', { className: 'anchor2' }),
                React.createElement('div', { className: 'anchor3' }),
                React.createElement('div', { className: 'anchor4' }),
                React.createElement('div', { className: 'anchor5' }),
                React.createElement('div', { className: 'anchor6' }),
                React.createElement('div', { className: 'anchor7' }),
                React.createElement('div', { className: 'anchor8' }),
                React.createElement('div', { className: 'fullscreen' },
                    React.createElement(IngameMenu, { items: this.props.items })
                )
            )
        )
    }
})

var IngameMenu = React.createClass({
    propTypes: {
        items: React.PropTypes.array.isRequired
    },
    render: function () {
        var parent = this
        return (
            React.createElement('div', { className: 'overlay centered-text' },
                React.createElement('div', { className: 'centered-text-wrapper' },
                    React.createElement('ul', {},
                        this.props.items.map(function (item) {
                            if (!item) return null // Codex patch, just prevents some dumb warnings

                            return React.createElement('div', {},
                                React.createElement(WideMenuButton, {
                                    key: item.menuId,
                                    name: item.name,
                                    displayName: (item.displayName != null) ? item.displayName : item.name,
                                    locked: item.disabled,
                                    behavior: item.behavior,
                                    extraClasses: (item.disabled ? ' disabled' : '') + (item.extraClasses ? ' ' + item.extraClasses : '')
                                })
                            )
                        })
                    )
                )
            )
        )
    }
})