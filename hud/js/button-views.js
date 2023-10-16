// Buttons
// =============================================================================================

var MenuButton = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        behavior: React.PropTypes.func,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        content: React.PropTypes.object,
        smallText: React.PropTypes.object,
        style: React.PropTypes.object,
    },
    getInitialState: function () {
        return {
            active: false
        }
    },
    render: function () {
        var parent = this

        var tooltipInnerLength = 0
        if (this.props.tooltip)
            tooltipInnerLength = this.props.tooltip.replace(/<(?:.|\n)*?>/gm, '').length

        return (
            React.createElement('div', { // used to be <li> but then it gets dom errors if we put this inside an li
                className: (this.props.tooltip ? 'simple-tooltip ' : '') + 'button ' + (this.props.className ? this.props.className : '') + ((this.state.active && !this.state.disabled) ? ' active' : ''),
                onMouseOver: function () {
                    if (parent.props.disabled) return

                    parent.setState({ active: true })
                },
                onMouseEnter: function () {
                    if (_.includes(parent.props.className, 'billboard'))
                        engine.call("OnMouseOverHeavy", parent.props.name.length) // just use length so we don't leak strings
                    else
                        engine.call("OnMouseOverMedium", parent.props.name.length) // just use length so we don't leak strings
                },
                onMouseOut: function () {
                    if (parent.props.disabled) return
                    parent.setState({ active: false })
                },
                onMouseDown: function (e) {
                    if (parent.props.disabled) {
                        console.log("Clicked menu item " + parent.props.name + ", but it is disabled")
                        return
                    }

                    console.log("Clicked menu item " + parent.props.name + ', clickType: ' + e.nativeEvent.which)
                    engine.call("OnClickMenuButton")

                    if (e.nativeEvent.which == 3) { // right click
                        console.log("right click " + parent.props.name)
                        engine.call("OnRightClickMenuButton", parent.props.name)
                        return
                    }

                    if (parent.props.behavior) {
                        console.log("running menubutton " + parent.props.name + " behavior")
                        parent.props.behavior()
                    }
                    else
                        engine.trigger('loadView', parent.props.name)
                },
                style: this.props.style,
            },
                this.props.content ? this.props.content : React.createElement('span', { dangerouslySetInnerHTML: { __html: this.props.displayName }}),
                this.props.smallText && this.props.smallText,
                this.props.tooltip && React.createElement('span', {
                    className: 'tooltiptext' + ((tooltipInnerLength > 50) ? ' wide' : ''),
                    dangerouslySetInnerHTML: {
                        __html: this.props.tooltip
                    }
                })
            )
        )
    }
})

var EmphasizedMenuButton = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        locked: React.PropTypes.bool, // todo: should rename to 'disabled'
        behavior: React.PropTypes.func,
        style: React.PropTypes.object,
    },
    render: function () {
        var parent = this
        return (
            React.createElement(MenuButton, {
                name: this.props.name,
                displayName: this.props.displayName,
                behavior: this.props.behavior,
                disabled: this.props.locked,
                className: 'big em' + (this.props.locked ? ' disabled' : ''),
                style: this.props.style,
            })
        )
    }
})

var StandardMenuButton = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        locked: React.PropTypes.bool,
        behavior: React.PropTypes.func,
    },
    render: function () {
        var parent = this
        return (
            React.createElement(MenuButton, {
                name: this.props.name,
                displayName: this.props.displayName,
                behavior: this.props.behavior,
                disabled: this.props.locked,
                className: 'big' + (this.props.locked ? ' disabled' : '')
            })
        )
    }
})

var WideMenuButton = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        locked: React.PropTypes.bool,
        behavior: React.PropTypes.func,
        extraClasses: React.PropTypes.string,
    },
    render: function () {
        var parent = this
        return (
            React.createElement(MenuButton, {
                name: this.props.name,
                displayName: this.props.displayName,
                behavior: this.props.behavior,
                disabled: this.props.locked,
                className: 'big wide' + (this.props.locked ? ' locked' : '') + this.props.extraClasses
            })
        )
    }
})

var CurrencyMenuButton = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        behavior: React.PropTypes.func,
        currencyType: React.PropTypes.string.isRequired,
        currencyCost: React.PropTypes.number.isRequired
    },
    render: function () {
        var parent = this

        var currencyType = this.props.currencyType
        var cost = this.props.currencyCost
        var newCurrencyBalance = (currencyType == 'ss' ? globalState.currency : globalState.premiumEssence) - cost
        var enoughCurrency = newCurrencyBalance >= 0
        var currencyName = currencyType == 'ss' ? loc('essence', 'Essence') : loc('premium_essence', 'Premium Essence')
        var currencyButtonColor = currencyType == 'ss' ? 'orange' : 'purple'

        return (
            React.createElement(MenuButton, {
                name: this.props.name,
                displayName: this.props.displayName,
                behavior: this.props.behavior,
                disabled: this.props.locked || (!enoughCurrency && cost > 0),
                className: 'currency em' + ' ' + currencyButtonColor + (!enoughCurrency ? ' disabled' : ''),
                content: React.createElement('span', {},
                    React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/Essence_32.png' }),
                    cost,
                    //enoughCurrency && React.createElement('div', { className: 'currency-balance' }, loc('new_balance', 'New balance: ' + newCurrencyBalance, [newCurrencyBalance])),
                    enoughCurrency && React.createElement('div', { className: 'currency-balance' }, loc('unlock_with', 'Unlock with ' + currencyName, [currencyName])),
                    !enoughCurrency && React.createElement('div', { className: 'currency-balance' }, loc('not_enough_money', 'Not enough ' + currencyName, [currencyName]))
                )
            })
        )
    }
})

var BillboardMenuButton = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        description: React.PropTypes.string,
        behavior: React.PropTypes.func,
        disabled: React.PropTypes.bool,
        disabledTooltip: React.PropTypes.string,
        image: React.PropTypes.string,
        mouseoverImage: React.PropTypes.string,
        inverted: React.PropTypes.bool,
        tooltip: React.PropTypes.string,
        tooltipTitle: React.PropTypes.string,
        greenTooltip: React.PropTypes.string,
        greenTooltipTitle: React.PropTypes.string,
        yellowTooltip: React.PropTypes.string,
        yellowTooltipTitle: React.PropTypes.string,
        redTooltip: React.PropTypes.string,
        redTooltipTitle: React.PropTypes.string,
        attachedIcons: React.PropTypes.array,
        descriptionClass: React.PropTypes.string,
        attachedLinkText: React.PropTypes.string,
        attachedLinkAction: React.PropTypes.func,
        widthOverride: React.PropTypes.string,
        extraClasses: React.PropTypes.string,
    },
    getInitialState: function() {
        return {
            hover: false,
        }
    },
    render: function () {
        var parent = this
        var customStyle = {}

        var inverted = this.props.inverted
        if (inverted) {
            customStyle = {
                background: '#151515',
            }
        }

        if (this.props.widthOverride) {
            customStyle.maxWidth = this.props.widthOverride
        }

        // No-scale mode for Legion Select (v5.00)
        var withImageSwap = false
        if (this.props.mouseoverImage)
            withImageSwap = true

        return (
            React.createElement('div', {
                className: 'billboard-border'
            },
                React.createElement(MenuButton, {
                    name: this.props.name,
                    displayName: this.props.displayName,
                    behavior: (!this.props.disabled ? this.props.behavior : null),
                    className: 'simple-tooltip billboard' + (this.props.disabled ? ' disabled' : '') + (withImageSwap ? ' with-image-swap' : '') + ' ' + this.props.extraClasses,
                    disabled: this.props.disabled,
                    content: React.createElement('div', { className: 'card-face' },
                        React.createElement('div', {
                            className: 'billboard',
                            onMouseOver: function () {
                                if (parent.props.disabled) return
                                if (!parent.props.mouseoverImage) return
                                parent.setState({ hover: true })
                            },
                            onMouseLeave: function () {
                                if (parent.props.disabled) return
                                if (!parent.props.mouseoverImage) return
                                parent.setState({ hover: false })
                            }
                        },
                            //this.state.hover && this.props.mouseoverImage && React.createElement('img', {
                            !this.props.disabled && this.props.mouseoverImage && React.createElement('img', {
                                className: 'big fade-fast', src: 'hud/img/' + this.props.mouseoverImage, style: {
                                    position: 'absolute', left: '0', zIndex: '2', pointerEvents: 'none',
                                    opacity: parent.state.hover ? 100 : 0,
                                    width: this.props.widthOverride
                                }
                            }),
                            this.props.image && React.createElement('img', {
                                className: 'big', src: 'hud/img/' + this.props.image, style: {
                                    width: this.props.widthOverride
                                }
                            }),
                            !this.props.disabled && this.props.mouseoverImage && React.createElement('img', {
                                className: 'big fade', src: 'hud/img/' + this.props.mouseoverImage, style: {
                                    position: 'absolute', left: '0', zIndex: '1', outlineOffset: '10px',
                                    opacity: parent.state.hover ? 100 : 0,
                                    width: this.props.widthOverride
                                }
                            }),
                            this.props.attachedIcons && this.props.attachedIcons.length > 0 && React.createElement('div', { className: 'attached-icons' },
                                this.props.attachedIcons.map(function (icon) {
                                    return React.createElement('img', { src: icon })
                                })
                            ),
                            //React.createElement('div', { className: 'centered-text', style: { width: '100%', height: '80px' } },
                            React.createElement('div', { className: 'centered-text' + (this.props.descriptionClass ? ' ' + this.props.descriptionClass : ' billboard-description') },
                                React.createElement('div', { className: 'centered-text-wrapper' },
                                    React.createElement('div', {
                                        className: 'name' + (inverted ? ' inverted' : ''),
                                        dangerouslySetInnerHTML: {
                                            __html: this.props.displayName
                                        }
                                    }),
                                    React.createElement('div', { className: 'description', dangerouslySetInnerHTML: { __html: this.props.description } })
                                )
                            ),
                            // v9.09: now we can still use disabledTooltip even if not disabled, for campaign DLC stuff
                            //this.props.disabled &&
                            this.props.disabledTooltip != null && this.props.disabledTooltip.length > 0 && React.createElement('span', {
                                className: 'tooltiptext',
                                style: { width: 'calc(100% - 28px)', zIndex: '2', top: '0', bottom: 'auto' }
                            },
                                React.createElement('span', {
                                    dangerouslySetInnerHTML: { __html: this.props.disabledTooltip }
                                })
                            ),
                            this.props.greenTooltipTitle && React.createElement('div', {
                                className: 'simple-tooltip',
                                style: { background: 'rgba(46, 200, 70, 1)', width: '100%', float: 'left', textShadow: '0px 0px 3px #404040' },
                            },
                                React.createElement('span', { className: 'tooltiptext', style: { width: '230px', left: '-4px' } },
                                    React.createElement('span', {
                                        dangerouslySetInnerHTML: {
                                            __html: this.props.greenTooltip
                                        }
                                    })
                                ),
                                this.props.greenTooltipTitle
                            ),
                            this.props.yellowTooltipTitle && React.createElement('div', {
                                className: 'simple-tooltip',
                                style: { background: 'rgba(234, 181, 24, 1)', width: '100%', float: 'left', color: '#404040' },
                            },
                                React.createElement('span', { className: 'tooltiptext', style: { width: '230px', left: '-4px' } },
                                    React.createElement('span', {
                                        style: {
                                            color: '#ffff33'
                                        },
                                        dangerouslySetInnerHTML: {
                                            __html: this.props.yellowTooltip
                                        }
                                    })
                                ),
                                this.props.yellowTooltipTitle
                            ),
                            this.props.redTooltipTitle && React.createElement('div', {
                                className: 'simple-tooltip',
                                style: { background: 'rgba(255, 87, 87, 1)', width: '100%', float: 'left', color: '#404040' },
                            },
                                React.createElement('span', { className: 'tooltiptext', style: { width: '230px', left: '-4px' } },
                                    React.createElement('span', {
                                        style: {
                                            color: '#ff3333'
                                        },
                                        dangerouslySetInnerHTML: {
                                            __html: this.props.redTooltip
                                        }
                                    })
                                ),
                                this.props.redTooltipTitle
                            ),
                            this.props.tooltipTitle && React.createElement('div', {
                                className: 'simple-tooltip',
                                style: { background: 'rgba(57, 76, 85, 1)', width: '100%', float: 'left' },
                            },
                                React.createElement('span', { className: 'tooltiptext', style: { width: '230px', left: '-4px' } },
                                    React.createElement('span', {
                                        dangerouslySetInnerHTML: {
                                            __html: this.props.yellowTooltip ? '<span style="color: #ffff33">' + this.props.yellowTooltip + '</span><br/><br/>' + this.props.tooltip
                                                : this.props.tooltip
                                        }
                                    })
                                ),
                                this.props.tooltipTitle
                            )
                        )
                    ),
                    style: customStyle
                }),
                this.props.attachedLinkText && React.createElement('div', {
                    className: 'billboard-attached-link',
                    onMouseDown: function (e) {
                        if (parent.props.attachedLinkAction)
                            parent.props.attachedLinkAction()
                    }
                },
                    this.props.attachedLinkText
                )
            )
        )
    }
})

var TextMenuButton = React.createClass({
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
    render: function () {
        var parent = this

        var button = React.createElement(MenuButton, {
            name: this.props.name,
            displayName: this.props.displayName,
            behavior: (this.props.disabled ? function () {
                console.log('Menu item is disabled: ' + parent.props.name)
            } : parent.props.behavior),
            className: 'textonly big '
                + (this.props.huge ? ' huge' : '')
                + (this.props.disabled ? ' disabled' : ' enabled'),
            smallText: this.props.smallText,
            style: this.props.style,
        })

        if (this.props.tooltip)
            return (
                React.createElement('div', { className: 'simple-tooltip' },
                    button,
                    React.createElement('span', { className: 'tooltiptext' }, this.props.tooltip)
                )
            )

        return button
    }
})

var SmallTextMenuButton = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        behavior: React.PropTypes.func,
    },
    render: function () {
        var parent = this
        return (
            React.createElement(MenuButton, {
                name: this.props.name,
                displayName: this.props.displayName,
                behavior: this.props.behavior,
                className: 'textonly'
            })
        )
    }
})
