// Reusable menu components
// =============================================================================================

var TabbedView = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        items: React.PropTypes.array,
        enableApplyButton: React.PropTypes.bool,
        active: React.PropTypes.bool,
        customButton: React.PropTypes.object,
        standaloneTabs: React.PropTypes.bool,
        showCurrency: React.PropTypes.bool,
        showGuildCurrency: React.PropTypes.bool,
    },
    render: function () {
        return (
            React.createElement('div', { id: 'TabbedView' },
                React.createElement('div', { className: 'anchor1' }),
                React.createElement('div', { className: 'anchor2' }),
                React.createElement('div', { className: 'anchor3' }),
                React.createElement('div', { className: 'anchor4' }),
                React.createElement('div', { className: 'anchor5' }),
                React.createElement('div', { className: 'anchor6' }),
                React.createElement('div', { className: 'anchor7' }),
                React.createElement('div', { className: 'anchor8' }),
                React.createElement('div', {
                    className: 'fullscreen',
                    onMouseDown: function (e) { // v1.50
                        engine.trigger('enableChat', false)
                    },
                    style: {
                        pointerEvents: 'all'
                    }
                },
                    React.createElement(TabbedMenu, {
                        className: this.props.className,
                        name: "root", depth: 1, items: this.props.items, enableApplyButton: this.props.enableApplyButton,
                        active: this.props.active, customButton: this.props.customButton, standaloneTabs: this.props.standaloneTabs,
                        showCurrency: this.props.showCurrency, showGuildCurrency: this.props.showGuildCurrency
                    })
                )
            )
        )
    }
})

var TabbedMenu = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        depth: React.PropTypes.number.isRequired,
        items: React.PropTypes.array,
        enableApplyButton: React.PropTypes.bool,
        active: React.PropTypes.bool,
        customButton: React.PropTypes.object,
        standaloneTabs: React.PropTypes.bool,
        showCurrency: React.PropTypes.bool,
    },
    selected: -1,
    getInitialState: function () {
        return {
            vc: 0,
            rm: 0,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.selectSubmenu = function (menuId) {
            console.log('selectSubmenu ' + menuId)
            if (parent.selected != menuId) {
                //console.log('deactivate currently selected submenu: ' + parent.selected)
                engine.trigger('activateSubmenu', parent.selected, false)
            }
            parent.selected = menuId
            engine.trigger('activateSubmenu', menuId, true)
            engine.call('OnActivateSubmenu', menuId)
        }
        bindings.refreshTabCurrency = function (vc, rm) {
            parent.setState({ vc: vc, rm: rm})
        }
    },
    componentDidMount: function () {
        engine.trigger('selectSubmenu', 1)
    },
    componentDidUpdate: function () {
        engine.trigger('selectSubmenu', this.selected)
    },
    render: function () {
        var parent = this
        return (
            React.createElement('div', { className: 'overlay' },
                React.createElement('div', { className: 'TabbedMenu' },
                    globalState.currentView != "" && !globalState.smallResolution && React.createElement('div', { className: 'tabbed-menu-title' },
                        getLocalizedMenuTitle(globalState.currentView)
                    ),
                    React.createElement('div', { className: 'horizontal-tabs' },
                        React.createElement('div', { className: 'horizontal-tabs-wrapper' },
                            React.createElement('ul', { className: 'tabs' },
                                this.props.items && this.props.items.length > 1 && this.props.items.map(function (item) {
                                    if (!item) return null // Codex patch, just prevents some dumb warnings

                                    return React.createElement(TabbedMenuButton, {
                                        key: item.menuId,
                                        menuId: item.menuId,
                                        name: item.name,
                                        displayName: (item.displayName != null) ? item.displayName : item.name,
                                        depth: parent.props.depth,
                                        disabled: item.disabled,
                                        behavior: (parent.props.active) ? item.behavior : null,
                                    })
                                }),
                                parent.props.showCurrency && React.createElement('div', { className: 'tab-button currency' },
                                    React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/Essence_20.png' }),
                                    React.createElement('span', { className: 'currency-text' }, parent.state.vc),
                                    React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/PremiumEssence_20.png', style: { marginLeft: '6px' } }),
                                    React.createElement('span', { className: 'currency-text' }, parent.state.rm),
                                    React.createElement('li', {
                                        className: 'button em purple',
                                        style: {
                                            display: 'inline',
                                            marginLeft: '1vw'
                                        },
                                        onMouseDown: function (e) {
                                            engine.call('OnLoadRechargeWindow', globalState.isGiftingPE)
                                            if (isBrowserTest)
                                                engine.trigger('showMiniShopWindow', testCurrencyItems, 0)
                                        }
                                    },
                                        loc('buy', 'Buy'),
                                        ' ',
                                        React.createElement('img', { src: 'hud/img/shop/currency/PremiumEssence_20.png', className: 'currency-icon' }),
                                        //loc('buy_item', 'Buy Premium Essence', [loc('premium_essence', 'Premium Essence')])
                                        loc('premium_essence', 'Premium Essence')
                                        //loc('purchase', 'Purchase')
                                    )
                                )
                            )
                        )
                    ),
                    this.props.items && this.props.items.map(function (item) {
                        if (!item) return null // Codex patch, just prevents some dumb warnings

                        item.enableApplyButton = parent.props.enableApplyButton
                        if (parent.props.standaloneTabs) {
                            //console.log('standalone tabs is true for ' + item.name)
                            item.standaloneTabs = true
                        }
                        else {
                            //console.log('standalone tabs is false for ' + item.name)
                            item.standaloneTabs = false
                        }

                        item.className = parent.props.className

                        return React.createElement(TabbedMenuContent, item)
                    }),
                    React.createElement('div', { className: 'confirmation-buttons' },
                        this.props.enableApplyButton && React.createElement(EmphasizedMenuButton, {
                            name: "apply",
                            displayName: loc('apply', "apply"),
                            behavior: function () {
                                //engine.trigger("confirmApplyOptions");
                                engine.call('OnConfirmApplyOptions', options)
                                engine.trigger("confirmApplyOptions"); // Now after, so we show it localized to new language
                            }
                        }),
                        this.props.customButton != null && this.props.customButton.name && React.createElement(EmphasizedMenuButton, {
                            name: this.props.customButton.name,
                            displayName: this.props.customButton.name,
                            behavior: this.props.customButton.action,
                            locked: this.props.customButton.locked
                        }),
                        this.props.enableApplyButton && React.createElement(StandardMenuButton, {
                            name: loc('restore_defaults', 'Restore Defaults'),
                            displayName: loc('restore_defaults', 'Restore Defaults'),
                            behavior: function () {
                                engine.call('RestoreAllDefaults')
                            }
                        }),
                        React.createElement(StandardMenuButton, {
                            name: loc('back', 'Back'),
                            displayName: loc('back', 'Back'),
                            behavior: function () {

                                if (parent.props.enableApplyButton) {
                                    loadPopupYesCancel(loc('go_back_without_saving', "Go back without saving?"), "",
                                        function () {
                                            engine.trigger('escape')
                                            // engine.call("CancelOptions") // v2.45: no need to do this
                                        },
                                        function () {
                                        })
                                    return
                                }

                                engine.trigger('escape')
                            }
                        })
                    )
                )
            )
        )
    }
})

var TabbedInlineMenu = React.createClass({
    propTypes: {
        name: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        depth: React.PropTypes.number.isRequired,
        items: React.PropTypes.array,
        active: React.PropTypes.bool,
        resetVideos: React.PropTypes.bool
    },
    selected: -1,
    componentWillMount: function () {
        var parent = this
        bindings.selectInlineSubmenu = function (menuId) {
            console.log('bindings selectInlineSubmenu ' + menuId)
            if (parent.selected != menuId) {
                console.log('deactivate currently selected submenu: ' + parent.selected)
                engine.trigger('activateInlineSubmenu', parent.selected, false)
            }
            parent.selected = menuId
            engine.trigger('activateInlineSubmenu', menuId, true)
            console.log("Selected", parent.selected);

            console.log("componentDidMount resetVideos " + parent.props.resetVideos)
            if (parent.props.resetVideos)
                engine.trigger('resetVideos')
        }
    },
    componentDidMount: function () {
        engine.trigger('selectInlineSubmenu', 1)
    },
    componentDidUpdate: function () {
        engine.trigger('selectInlineSubmenu', this.selected)
    },
    render: function () {
        var parent = this
        return (
            React.createElement('div', { className: parent.props.className },
                React.createElement('div', { className: 'horizontal-tabs' },
                    React.createElement('div', { className: 'horizontal-tabs-wrapper' },
                        React.createElement('ul', { className: 'tabs' },
                            this.props.items && this.props.items.length > 1 && this.props.items.map(function (item) {
                                if (!item) return null // Codex patch, just prevents some dumb warnings

                                return React.createElement(TabbedInlineMenuButton, {
                                    key: item.menuId,
                                    menuId: item.menuId,
                                    name: item.name,
                                    displayName: (item.displayName != null) ? item.displayName : item.name,
                                    depth: parent.props.depth,
                                    disabled: item.disabled,
                                    behavior: (parent.props.active) ? item.behavior : null,
                                    inline: true
                                })
                            })
                        )
                    )
                ),
                this.props.items && this.props.items.map(function (item) {
                    if (!item) return null // Codex patch, just prevents some dumb warnings

                    if (parent.props.standaloneTabs) {
                        //console.log('standalone tabs is true for ' + item.name)
                        item.standaloneTabs = true
                    }
                    else {
                        //console.log('standalone tabs is false for ' + item.name)
                        item.standaloneTabs = false
                    }

                    //item.className = parent.props.className

                    return React.createElement(TabbedInlineMenuContent, item)
                })
            )
        )
    }
})

var TabbedInlineMenuButton = React.createClass({
    propTypes: {
        menuId: React.PropTypes.number.isRequired,
        depth: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        disabled: React.PropTypes.bool,
        behavior: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            active: false,
            inline: false
        }
    },
    componentWillMount: function () {
        var parent = this

        bindings.activateInlineSubmenuButton[this.props.menuId] = function (active) {
            parent.setState({ active: active })

            if (typeof parent.props.behavior === "function") {
                parent.props.behavior()
            }
        }
    },
    componentWillUnmount: function () {
        bindings.activateInlineSubmenuButton[this.props.menuId] = function (active) { }
    },
    render: function () {
        var parent = this
        return (
            React.createElement('li', {
                className: 'tab' + (this.state.active ? ' active' : '') + (this.props.disabled ? ' disabled' : ''),
                onMouseEnter: function (e) {
                    engine.call("OnMouseOverVeryLight", 0)
                },
                onMouseDown: function (e) {
                    if (parent.props.disabled) {
                        console.log("Tabbed menu button " + parent.props.name + " is disabled")
                        return
                    }
                    engine.trigger('selectInlineSubmenu', parent.props.menuId)
                    engine.call('OnClickTabbedMenuTab')
                },
                dangerouslySetInnerHTML: { __html: this.props.displayName }
            }
                
            )
        )
    }
})

var TabbedInlineMenuContent = React.createClass({
    propTypes: {
        menuId: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        content: React.PropTypes.object,
        narrow: React.PropTypes.bool,
        enableApplyButton: React.PropTypes.bool,
        standaloneTabs: React.PropTypes.bool
    },
    getInitialState: function () {
        return {
            enabled: false
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.activateInlineSubmenu[this.props.menuId] = function (enabled) {
            var wasEnabled = parent.state.enabled

            parent.setState({ enabled: enabled })

            console.log('TEST: activateInlineSubmenu menuId: ' + parent.props.menuId + ', name: ' + parent.props.name + ', wasEnabled: ' + wasEnabled + ', enabled: ' + enabled);
        }
    },
    componentWillUnmount: function () {
        var parent = this

        bindings.activateInlineSubmenu[this.props.menuId] = function (enabled) { }
    },
    render: function () {
        // why did we do this again? Ohhh because game guide is incredibly slow otherwise
        if (this.props.standaloneTabs && !this.state.enabled) return null

        // MYSTERIOUS codex "fix" for the liveview rerender bug. For some reason, wrapping the CodexUnits element in any div
        // of any kind breaks it. See email thread. But what's weird is that the LiveView is nested in several divs in the CodexUnits
        // element, but those seem to work fine. Well, if it works it works.
        // Since the Units page now omits the tab-content style, we apply them directly to the .codex element (Smelly workaround)
        if (this.props.name == 'Units')
            return this.state.enabled && this.props.content

        var parent = this
        return (
            React.createElement('div', {
                className: 'tab-content scrollable' + (this.state.enabled ? '' : ' hidden') + (this.props.narrow ? ' ' + (isStorePage ? 'narrow narrow-stretchy' : 'narrow') : '')
                    + (this.props.enableApplyButton ? ' enableApplyButton' : '') + (this.props.className ? (' ' + this.props.className) : ''),
                onMouseDown: function (e) {
                    //console.log('tab content onMouseDown ' + parent.props.name)
                    engine.trigger('onScrollbarMouseDown', parent.props.name)
                },
                onMouseUp: function (e) {
                    console.log('tab content onMouseUp ' + parent.props.name)
                    engine.trigger('onScrollbarMouseUp', parent.props.name)
                }
            },
                this.props.content
            )
        )
    }
})

var TabbedMenuButton = React.createClass({
    propTypes: {
        menuId: React.PropTypes.number.isRequired,
        depth: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        disabled: React.PropTypes.bool,
        behavior: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            active: false,
            inline: false
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.activateSubmenuButton[this.props.menuId] = function (active) {
            parent.setState({ active: active })

            if (typeof parent.props.behavior === "function") {
                parent.props.behavior()
            }
        }
    },
    componentWillUnmount: function () {
        var parent = this
        bindings.activateSubmenuButton[this.props.menuId] = function (active) { }
    },
    render: function () {
        var parent = this
        return (
            React.createElement('li', {
                className: 'tab' + (this.state.active ? ' active' : '') + (this.props.disabled ? ' disabled' : ''),
                onMouseEnter: function (e) {
                    engine.call("OnMouseOverVeryLight", 0)
                },
                onMouseDown: function (e) {
                    if (parent.props.disabled) {
                        console.log("Tabbed menu button " + parent.props.name + " is disabled")
                        return
                    }
                    engine.trigger('selectSubmenu', parent.props.menuId)
                    engine.call('OnClickTabbedMenuTab')
                }
            },
                React.createElement('span', {
                    dangerouslySetInnerHTML: {
                        __html: this.props.displayName
                    }
                })
            )
        )
    }
})

var TabbedMenuContent = React.createClass({
    propTypes: {
        menuId: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        content: React.PropTypes.object,
        narrow: React.PropTypes.bool,
        enableApplyButton: React.PropTypes.bool,
        standaloneTabs: React.PropTypes.bool
    },
    getInitialState: function () {
        return {
            enabled: false
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.activateSubmenu[this.props.menuId] = function (enabled) {

            // v8.02.4 hack to prevent UI from glitching after viewing campaign
            if (_.startsWith(parent.props.name, 'campaign')) {
                console.log('v8.02.4 HACK to stop campaign from messing with the tabs')
                return
            }

            var wasEnabled = parent.state.enabled

            parent.setState({ enabled: enabled })

            //console.log('TEST: activateSubmenu menuId: ' + parent.props.menuId + ', name: ' + parent.props.name + ', wasEnabled: ' + wasEnabled + ', enabled: ' + enabled
            //+ ', currentView: ' + globalState.currentView)

            // If there was a change, consider changing music/background
            // This is super smelly lol but we shouldn't need to reuse this too much
            if (wasEnabled != enabled) {
                if (enabled && parent.props.name == 'Card Trader') {
                    engine.trigger('setBackgroundImageOverride', 'hud/img/shop/card-wizard-background.jpg')
                } else {
                    engine.trigger('setBackgroundImageOverride', '')
                }
            }
        }

        bindings.activateInlineSubmenu[this.props.menuId] = function (enabled) {
            var wasEnabled = parent.state.enabled

            parent.setState({ enabled: enabled })

            console.log('TEST: activateInlineSubmenu menuId: ' + parent.props.menuId + ', name: ' + parent.props.name + ', wasEnabled: ' + wasEnabled + ', enabled: ' + enabled);
        }
    },
    componentWillUnmount: function () {
        var parent = this

        bindings.activateSubmenu[this.props.menuId] = function (enabled) {}

        if (parent.state.enabled && parent.props.name == 'Card Trader') {
            console.log('componentWillUnmount card trader')
            engine.trigger('setBackgroundImageOverride', '')
        }
    },
    render: function () {
        //console.log('TEST: ' + this.props.name + ' props: ' + JSON.stringify(this.props))
        //console.log('TEST: ' + this.props.name + ' state: ' + JSON.stringify(this.state))

        // why did we do this again? Ohhh because game guide is incredibly slow otherwise
        if (this.props.standaloneTabs && !this.state.enabled) return null

        // MYSTERIOUS codex "fix" for the liveview rerender bug. For some reason, wrapping the CodexUnits element in any div
        // of any kind breaks it. See email thread. But what's weird is that the LiveView is nested in several divs in the CodexUnits
        // element, but those seem to work fine. Well, if it works it works.
        // Since the Units page now omits the tab-content style, we apply them directly to the .codex element (Smelly workaround)
        if (this.props.name == 'Units')
            return this.state.enabled && this.props.content

        // HACKY shop override (later we should make narrow not restricted to a bool)
        var isStorePage = false
        if (this.props.name == 'Skins'
            || this.props.name == 'Consumables'
            || this.props.name == 'Account') {
            isStorePage = true
        }

        var parent = this
        return (
            React.createElement('div', {
                className: 'tab-content scrollable' + (this.state.enabled ? '' : ' hidden') + (this.props.narrow ? ' ' + (isStorePage ? 'narrow narrow-stretchy' : 'narrow') : '')
                    + (this.props.enableApplyButton ? ' enableApplyButton' : '') + (this.props.className ? (' ' + this.props.className) : ''),
                onMouseDown: function (e) {
                    //console.log('tab content onMouseDown ' + parent.props.name)
                    engine.trigger('onScrollbarMouseDown', parent.props.name)
                },
                onMouseUp: function (e) {
                    console.log('tab content onMouseUp ' + parent.props.name)
                    engine.trigger('onScrollbarMouseUp', parent.props.name)
                }
            },
                this.props.content
            )
        )
    }
})

// Billboard view (Play menu, Pregame menu, possibly more)
// =============================================================================================

// SMELLY COPY AND PASTED CODE WITH LegionSelectView
var BillboardView = React.createClass({
    propTypes: {
        items: React.PropTypes.array.isRequired,
        disableBackButton: React.PropTypes.bool,
        narrow: React.PropTypes.bool,
    },
    render: function () {
        return (
            React.createElement('div', { id: 'BillboardView' },
                React.createElement('div', {
                    className: 'fullscreen',
                    onMouseDown: function (e) { // v1.50
                        engine.trigger('enableChat', false)
                    },
                    style: {
                        pointerEvents: 'all'
                    }
                },
                    React.createElement(BillboardMenu, this.props)
                )
            )
        )
    }
})

var BillboardMenu = React.createClass({
    propTypes: {
        items: React.PropTypes.array,
        disableBackButton: React.PropTypes.bool,
        narrow: React.PropTypes.bool,
    },
    render: function () {
        var isWide = this.props.items.length <= 4
        var parent = this

        var isLegionSelectView = this.props.items.length >= 6

        var isExtraWide = (globalState.screenWidth / globalState.screenHeight > 1.78)

        var containerWidth = 'auto'
        if (this.props.narrow)
            containerWidth = '64vw'

        var widthOverride = ''
        if (isLegionSelectView && isExtraWide) {
            widthOverride = '10vw'
            containerWidth = '100vw'
        }

        // v9.00 for mastermind playstyles
        if (this.props.items.length == 10) {
            containerWidth = isExtraWide ? '64vw' : '80vw'
        }

        return (
            React.createElement('div', { className: 'centered-text overlay' },
                React.createElement('div', { className: 'centered-text-wrapper' },
                    React.createElement('div', { className: 'billboards' + (isWide ? " wide" : "") },
                        React.createElement('ul', { className: (isLegionSelectView ? 'legion-select' : 'regular-billboards'), style: { width: containerWidth, margin: 'auto' }}, /* 64vw is for legion select screen mainly */
                            this.props.items && this.props.items.map(function (item) {
                                if (!item) return null // Codex patch, just prevents some dumb warnings

                                return React.createElement(BillboardMenuButton, {
                                    key: item.menuId,
                                    name: item.name,
                                    displayName: (item.displayName != null) ? item.displayName : item.name,
                                    description: item.description,
                                    behavior: item.behavior,
                                    disabled: item.disabled,
                                    disabledTooltip: item.disabledTooltip,
                                    image: item.image,
                                    mouseoverImage: item.mouseoverImage,
                                    inverted: item.inverted,
                                    tooltip: item.tooltip,
                                    tooltipTitle: item.tooltipTitle,
                                    greenTooltip: item.greenTooltip,
                                    greenTooltipTitle: item.greenTooltipTitle,
                                    yellowTooltip: item.yellowTooltip,
                                    yellowTooltipTitle: item.yellowTooltipTitle,
                                    redTooltip: item.redTooltip,
                                    redTooltipTitle: item.redTooltipTitle,
                                    attachedIcons: item.attachedIcons,
                                    descriptionClass: item.descriptionClass,
                                    attachedLinkText: item.attachedLinkText,
                                    attachedLinkAction: item.attachedLinkAction,
                                    widthOverride: widthOverride,
                                    extraClasses: item.extraClasses,
                                })
                            })
                        ),
                        React.createElement('div', { className: 'confirmation-buttons' },
                            !this.props.disableBackButton && React.createElement(StandardMenuButton, {
                                name: loc('back', 'Back'),
                                displayName: loc('back', 'Back'),
                                behavior: function () { engine.trigger('escape') }
                            })
                        )
                    )
                )
            )
        )
    }
})

console.log("--- DONE LOADING MENU VIEWS ---")