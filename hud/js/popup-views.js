// Popups
// - In the future (tm) we should rewrite this to be much more elegant
// - One idea is to pass in HTML with named elements, then on button press (form submit), an object is returned
// with a dictionary with the keys being the named elements
// =============================================================================================

var IsStickyPopupOpen = function (viewName) {
    if (globalState.crashPopup)
        return true
    if (viewName == 'launcher' && globalState.unescapablePopup) // EXPERIMENTAL
        return true
    if (viewName == 'launcher' && globalState.lastPopupName == "reconnecttogame")
        return true

    // todo: add more sticky popups here?

    return false
}

var PopupView = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        header: React.PropTypes.string,
        description: React.PropTypes.string,
        items: React.PropTypes.array.isRequired,
        hasInput: React.PropTypes.bool,
        hasParagraphInput: React.PropTypes.bool,
        hasLoader: React.PropTypes.bool,
        onSubmit: React.PropTypes.func,
        customFullScreenBackground: React.PropTypes.string,
        customHeaderStyle: React.PropTypes.object,
        customDescriptionStyle: React.PropTypes.object,
        customInputStyle: React.PropTypes.object,
        multipleChoiceItems: React.PropTypes.array,
        multipleChoiceItemsDisplay: React.PropTypes.array,
        customClasses: React.PropTypes.string,
        customParagraphStyle: React.PropTypes.string,
        defaultInputValue: React.PropTypes.string,
        checkboxText: React.PropTypes.string,
        onCheckboxClicked: React.PropTypes.func,
    },
    getInitialState: function () {
        return {
            blurred: false
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.blurPopup = function (blurred) {
            parent.setState({ blurred: blurred })
        }
    },
    render: function () {
        return (
            // v6.xx shop zIndex for displaying Processing Payment on top of full screen popups
            React.createElement('div', { id: 'PopupView', style: { position: 'fixed', height: '100%', width: '100%', zIndex: '2' } },
                this.state.blurred && React.createElement('div', { className: 'fullscreen grayed-out' }),
                React.createElement('div', { className: 'fullscreen' },
                    React.createElement(PopupMenu, this.props)
                )
            )
        )
    }
})

var PopupMenu = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        header: React.PropTypes.string,
        description: React.PropTypes.string,
        items: React.PropTypes.array,
        hasInput: React.PropTypes.bool,
        hasParagraphInput: React.PropTypes.bool,
        hasLoader: React.PropTypes.bool,
        onSubmit: React.PropTypes.func,
        customFullScreenBackground: React.PropTypes.string,
        customHeaderStyle: React.PropTypes.object,
        customDescriptionStyle: React.PropTypes.object,
        customInputStyle: React.PropTypes.object,
        multipleChoiceItems: React.PropTypes.array,
        multipleChoiceItemsDisplay: React.PropTypes.array,
        customClasses: React.PropTypes.string,
        customParagraphStyle: React.PropTypes.object,
        defaultInputValue: React.PropTypes.string,
        checkboxText: React.PropTypes.string,
        onCheckboxClicked: React.PropTypes.func,
    },
    getInitialState: function () {
        console.log("PopupMenu initial state")
        return {
            inputValue: "",
            show: false,
            value: "", // multiple choice value
            selectedIndex: -1,
            firstLoad: true,
            checkboxState: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.submitPopupMenuInput = function () {
            var submissionValue = parent.state.inputValue

            var isImageMenu = parent.props.multipleChoiceItems && parent.props.multipleChoiceItems.length > 0 && parent.props.multipleChoiceItems[0].image != null
            if (parent.props.multipleChoiceItems && parent.props.multipleChoiceItems.length > 0) {
                if (isImageMenu)
                    submissionValue = parent.state.value
                else
                    submissionValue = "[" + parent.state.value + "]: " + parent.state.inputValue
            }

            if (parent.props.onSubmit)
                parent.props.onSubmit(submissionValue)

            console.log("submitPopupMenuInput: " + submissionValue)

            parent.setState({
                inputValue: "",
                value: "",
                firstLoad: true,
            })
        }
        bindings.popupCheckboxToggled = function (checked) {
            console.log("popupCheckboxToggled state: " + checked)
            parent.state.checkboxState = checked
        }
    },
    onFormInputChange: function (event) { this.setState({ inputValue: event.target.value, firstLoad: false }) },
    handleChange: function (e) {

        if (this.props.customInputStyle.blockNonWordCharacters) {
            var regex = new RegExp("^[a-zA-Z0-9.' -]+");
            if (!regex.test(e.key)) {
                e.preventDefault();
                return false;
            }
        }

        if (this.props.customInputStyle.blockSpecialWordCharacters) {
            var regex = new RegExp("^[a-zA-Z0-9]+");
            if (!regex.test(e.key)) {
                e.preventDefault();
                return false;
            }
        }

        if (this.props.customInputStyle.blockSpaces) {
            if (e.key === ' ') {
                e.preventDefault();
                return false
            }
        }

        if (e.key === 'Enter') {
            this.submit()
            e.target.blur()
        }
    },
    submit: function () {
        engine.trigger('submitPopupMenuInput')
        this.setState({
            inputValue: "",
            value: "",
            firstLoad: true,
        })
    },
    render: function () {
        var parent = this
        var isImageMenu = this.props.multipleChoiceItems && this.props.multipleChoiceItems.length > 0 && this.props.multipleChoiceItems[0].image != null
        // Initialize selected index/value
        // v6.05: Fixed bug where popups like avatar popup didn't load correct default selection
        if (isImageMenu && this.props.multipleChoiceItems && this.state.firstLoad) {
            var newSelectedIndex = -1
            var newSelectedImage = ""
            this.props.multipleChoiceItems.map(function (entry, index) {
                if (entry.selected != null && entry.selected && parent.state.selectedIndex != index) {
                    newSelectedIndex = index
                    newSelectedImage = entry.image
                }
            })
            if (newSelectedIndex != -1) {
                console.log('set selectedIndex to newSelectedIndex: ' + newSelectedIndex)
                parent.setState({ value: newSelectedImage, selectedIndex: newSelectedIndex })
            }
        }

        // Default to first value if this is a dropdown menu
        // v6.05 comment: This is meant for ReportPlayer menu I think, but might be malfunctioning
        if (!isImageMenu && this.props.multipleChoiceItems && this.props.multipleChoiceItems.length > 0 && this.state.value == "")
            this.setState({ value: this.props.multipleChoiceItems[0], selectedIndex: 0 })

        // v7.02 to hopefully fix the bug where Report Player dropdown doesn't populate the current item
        var defaultItem = parent.props.multipleChoiceItemsDisplay[0]
        if (parent.state.selectedIndex != -1)
            defaultItem = parent.props.multipleChoiceItemsDisplay[parent.state.selectedIndex]
        //console.log('TEST: parent.state.selectedIndex: ' + parent.state.selectedIndex)
        //console.log('TEST: ' + parent.props.multipleChoiceItemsDisplay[parent.state.selectedIndex])
        //console.log('TEST: defaultItem: ' + defaultItem)

        var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160

        return (
            React.createElement('div', {
                className: 'popup centered-text',
                style: {
                    background: this.props.customFullScreenBackground.length > 0 ? 'url(' + this.props.customFullScreenBackground + ')' : ''
                }
            },
                React.createElement('div', { className: 'centered-text-wrapper' },
                    // v8.02.3 special header buttons
                    React.createElement('div', {
                        style: {
                            textAlign: 'right'
                        }
                    },
                        this.props.items && this.props.items.map(function (item) {
                            var displayName = (item.displayName != null) ? item.displayName : item.name
                            if (item.buttonStyle == 3) {
                                return React.createElement('div', {
                                    style: {
                                        position: 'relative',
                                        right: '8px',
                                        top: uhd? '66px ' : '42px',
                                        display: 'inline-block'
                                    }
                                },
                                    React.createElement(MenuButton, {
                                        key: item.menuId,
                                        name: item.name,
                                        displayName: displayName,
                                        behavior: function () {
                                            parent.setState({ firstLoad: true, selectedIndex: -1 })
                                            engine.trigger('hidePopup', false)
                                            if (item.behavior != null) {
                                                console.log("running popup " + parent.props.header + " behavior for button: " + displayName)
                                                item.behavior()
                                            } else {
                                                console.log("behavior was null for " + parent.props.header)
                                            }
                                        }
                                    })
                                )
                            }
                        })
                    ),
                    React.createElement('div', { className: 'header', style: this.props.customHeaderStyle },
                        this.props.header && React.createElement('h1', {
                            dangerouslySetInnerHTML: { __html: this.props.header }
                        }),
                        this.props.hasLoader && React.createElement('img', { src: 'hud/img/ui/loading-small.gif', width: '50' }),
                        !isImageMenu && this.props.description && React.createElement('p', {
                            className: this.props.customClasses,
                            style: this.props.customParagraphStyle,
                            dangerouslySetInnerHTML: { __html: this.props.description },
                        }),
                        (this.props.multipleChoiceItems && this.props.multipleChoiceItems.length > 0) && React.createElement('div', {
                            className: 'popupDropdown' + (isImageMenu ? ' wide' : ''),
                        },
                            // Icon grid menu (e.g. Change Avatar)
                            // =======================================================
                            isImageMenu && React.createElement('div', { className: 'items collection scrollable', style: { maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden', marginBottom: '20px', paddingBottom: '8px' } },
                                this.props.description && React.createElement('p', {
                                    className: this.props.customClasses,
                                    style: this.props.customParagraphStyle,
                                    dangerouslySetInnerHTML: { __html: this.props.description },
                                }),
                                this.props.multipleChoiceItems && this.props.multipleChoiceItems.map(function (entry, index) {
                                    var stacks = 0
                                    if (entry.stacks != null && entry.stacks > 0)
                                        stacks = entry.stacks

                                    if (stacks == 0) {
                                        return (
                                            React.createElement('div', { className: 'simple-tooltip locked' + (index % 10 >= 8 ? ' flipped' : '') },
                                                React.createElement('div', { className: 'img-container' },
                                                    React.createElement('img', { src: 'hud/img/' + entry.image })
                                                ),
                                                entry.displayStacks >= 1 && React.createElement('div', { className: 'icon-stacks' }, entry.displayStacks),
                                                React.createElement('div', { className: 'tooltiptext auto' },
                                                    React.createElement('div', {
                                                        style: { color: "gray" },
                                                        dangerouslySetInnerHTML: {
                                                            __html: loc('currently_in_use', 'Currently In Use: ' + entry.name, [entry.name])
                                                        }
                                                    }),
                                                    React.createElement('div', { className: 'requires no-margin', }, entry.requires)
                                                )
                                            )
                                        )
                                    }
                                    var stacksClass = parent.props.name == 'guildavatar' ? getGuildAvatarStacksClass(entry.stacks) : getAvatarStacksClass(entry.stacks)
                                    var silverStacksRequired = parent.props.name == 'guildavatar' ? 15 : 3
                                    var goldStacksRequired= parent.props.name == 'guildavatar' ? 50 : 10

                                    //getGuildAvatarStacksClass
                                    return React.createElement('div', { className: 'simple-tooltip' + (index % 10 >= 8 ? ' flipped' : '') },
                                        React.createElement('div', { className: 'img-container ' + stacksClass },
                                            React.createElement('img', {
                                                src: 'hud/img/' + entry.image,
                                                className: (parent.state.selectedIndex == index ? ' selected' : ''),
                                                onMouseDown: function (e) {
                                                    parent.setState({ value: entry, selectedIndex: index, firstLoad: false })
                                                }
                                            })
                                        ),
                                        entry.rarity && React.createElement('img', { src: 'hud/img/shop/rarity/' + entry.rarity + '.png', className: 'rarity' }),
                                        entry.displayStacks >= 1 && entry.displayStacks <= (silverStacksRequired - 1) && React.createElement('div', { className: 'popup-icon stacks' }, 'x' + entry.displayStacks),
                                        entry.displayStacks >= silverStacksRequired && entry.displayStacks <= (goldStacksRequired - 1) && React.createElement('div', { className: 'popup-icon stacks silver' }, 'x' + entry.displayStacks),
                                        entry.displayStacks >= goldStacksRequired && React.createElement('div', { className: 'popup-icon stacks gold' }, 'x' + entry.displayStacks),
                                        React.createElement('div', { className: 'tooltiptext' },
                                            !entry.rarity && React.createElement('div', { style: { color: "#ffcc00" } }, entry.name),
                                            entry.rarity && React.createElement('div', { className: entry.rarity }, entry.name),
                                            React.createElement('div', { dangerouslySetInnerHTML: { __html: entry.description }})
                                            //React.createElement('div', { className: 'value' }, 'Value: ' + entry.value)
                                        )
                                    )
                                })
                            ),

                            // Text dropdown menu (e.g. Report Player)
                            // =======================================================

                            // v6.05: to fix ReportPlayer dropdown reason not being closable by clicking negative space
                            !isImageMenu && React.createElement('div', {
                                className: "hide-popup-backer fixed" + (this.state.show ? '' : ' hidden'),
                                onMouseDown: function (event) {
                                    parent.setState({ show: false })
                                }
                            }),

                            !isImageMenu && React.createElement('div', {
                                className: 'dropdown-button button',
                                onMouseDown: function (event) {
                                    if (event.nativeEvent.which == 1)
                                        parent.setState({ show: true })
                                }
                            },
                                defaultItem // v7.02
                                //parent.props.multipleChoiceItemsDisplay[parent.state.selectedIndex]
                            ),
                            !isImageMenu && React.createElement('div', { className: 'dropdown-panel' + (this.state.show ? '' : ' hidden') },
                                this.props.multipleChoiceItems.map(function (item, index) {
                                    return React.createElement('div', {
                                        key: item,
                                        className: 'dropdown-item' + ((item == parent.state.value) ? ' selected' : ''),
                                        onMouseDown: function (e) {
                                            parent.setState({ show: false, value: item, selectedIndex: index })
                                        }
                                    }, parent.props.multipleChoiceItemsDisplay[index])
                                })
                            )
                        ),
                        (this.props.hasInput || this.props.hasParagraphInput) && React.createElement(
                            (this.props.hasParagraphInput ? 'textarea' : 'input'), {
                                type: 'text',
                                name: 'formInput',
                                cols: (this.props.hasParagraphInput ? '50' : ''),
                                rows: (this.props.hasParagraphInput ? '5' : ''),
                                className: (this.props.hasParagraphInput) ? 'paragraph' : '',
                                onChange: this.onFormInputChange,
                                onKeyPress: (this.props.hasInput) ? this.handleChange : null,
                                value: this.state.firstLoad ? this.props.defaultInputValue : this.state.inputValue,
                                onPaste: this.props.customInputStyle.blockCopyPaste && function (e){
                                    e.preventDefault()
                                    return false;
                                },
                                //autoFocus: true, // Doesn't do anything
                                style: this.props.customInputStyle,
                                maxLength: (this.props.customInputStyle && this.props.customInputStyle.maxLength) ? this.props.customInputStyle.maxLength : ''
                            })
                    ),
                    React.createElement('div', { className: 'popup-content', style: this.props.customDescriptionStyle },
                        this.props.checkboxText && React.createElement('div',
                            {
                                className: 'checkbox-container',
                                onClick: function () { parent.props.onCheckboxClicked() }
                            },

                            React.createElement('div',
                                {
                                    className: 'checkbox-box inline'
                                },
                                parent.state.checkboxState && React.createElement('img',
                                    {
                                        className: 'checkbox-icon',
                                        src: 'hud/img/ui/accept-check.png',
                                        id: 'skip-news-checkbox'
                                    })
                            ),
                            React.createElement('label',
                                {
                                    className: 'checkbox-label',
                                    dangerouslySetInnerHTML: {
                                        __html: this.props.checkboxText + '<br>'
                                    }
                                })
                        ),
                        React.createElement('div', { className: 'confirmation-buttons' },
                            this.props.items && this.props.items.map(function (item) {
                                var displayName = (item.displayName != null) ? item.displayName : item.name

                                if (item.buttonStyle == 2) {
                                    return React.createElement(CurrencyMenuButton, {
                                        key: item.menuId,
                                        name: item.name,
                                        displayName: displayName,
                                        behavior: function () {
                                            parent.setState({ firstLoad: true, selectedIndex: -1 })

                                            engine.trigger('hidePopup', false)
                                            if (item.behavior != null) {
                                                console.log("running popup " + parent.props.header + " behavior for button: " + displayName)
                                                item.behavior()
                                            } else {
                                                console.log("behavior was null for " + parent.props.header)
                                            }
                                        },
                                        currencyType: item.currencyType,
                                        currencyCost: item.currencyCost,
                                    })
                                } else if (item.buttonStyle == 3) {
                                    return null
                                } else {
                                    // Special case: if it's an EM button and it's an image menu, only show it once we selected something
                                    if ((isImageMenu && item.buttonStyle == 1 && parent.state.selectedIndex == -1)) {
                                        return null
                                    }

                                    return React.createElement((item.buttonStyle == 1) ? EmphasizedMenuButton : StandardMenuButton, {
                                        key: item.menuId,
                                        name: item.name,
                                        displayName: displayName,
                                        locked: item.locked,
                                        behavior: function () {
                                            //console.log('Date.now(): ' + Date.now())
                                            //console.log('globalState.preventPopupOkBeforeTicks: ' + globalState.preventPopupOkBeforeTicks)
                                            if (Date.now() < globalState.preventPopupOkBeforeTicks) {
                                                console.log('clicked too quickly! bail')
                                                return
                                            }

                                            parent.setState({ firstLoad: true, selectedIndex: -1 })
                                            engine.trigger('hidePopup', false)
                                            if (item.behavior != null) {
                                                console.log("running popup " + parent.props.header + " behavior for button: " + displayName)
                                                item.behavior()
                                            } else {
                                                console.log("behavior was null for " + parent.props.header)
                                            }
                                        }
                                    })
                                }
                            })
                        )
                    )
                )
            )
        )
    }
})
