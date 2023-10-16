// Only used for Lock-In for now...
// but maybe can be used beyond that??? would have to remove hardcodes
// =============================================================================================

var IconSelectionView = React.createClass({
    firstColumnCategories: [
        "atlantean_legion_id",
        "divine_legion_id",
        "element_legion_id",
        "forsaken_legion_id",
        "grove_legion_id",
        //"mech_legion_id",
        //"nomad_legion_id",
        //"shrine_legion_id",
        //"mastermind_legion_id",
    ],
    secondColumnCategories: [
        "mech_legion_id",
        "nomad_legion_id",
        "shrine_legion_id",
        "mastermind_legion_id",
        "mastermind_legion_id_A",
        "mastermind_legion_id_B",
        "mastermind_legion_id_C",
        "mastermind_legion_id_D",
    ],
    getInitialState: function () {
        return {
            handlerKey: '',
            title: '',
            items: [],
            dropdown1FilterIndex: 0,
            dropdown2FilterIndex: 0,
            currentSelectionItems: [],
            maxSelections: 1
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshIconSelectionItems = function (handlerKey, title, items, maxSelections) {

            console.log('bindings.refreshIconSelectionItems handlerKey: ' + handlerKey + ', title: ' + title + ', maxSelections: ' + maxSelections)
            parent.setState({ handlerKey: handlerKey, title: title, items: items, maxSelections: maxSelections, currentSelectionItems: [] })
        }
    },
    render: function () {
        var parent = this

        if (this.state.items == null || this.state.items.length == 0) {
            //console.log("No icon selection items")
            return null
        }

        //console.log('this.state.items: ' + JSON.stringify(this.state.items))

        // Group into buckets
        var filteredItems = {}
        this.state.items.map(function (item) {

            if (!(item.category in filteredItems)) {
                //console.log('push new category: ' + item.category)
                filteredItems[item.category] = []
            }

            //console.log('push item with category ' + item.category)
            filteredItems[item.category].push(item)
        })

        //console.log('filteredItems: ' + JSON.stringify(filteredItems))
        //console.log('keys: ' + JSON.stringify(Object.keys(filteredItems)))

        // later, could make this more generic
        var dropdown1Items = [
            { key: 0, text: loc('all_difficulties', 'All Difficulties'), html: loc('all_difficulties', 'All Difficulties'), action: function () { parent.setState({ dropdown1FilterIndex: 0 }) } },
            { key: 1, text: loc('easy_bots', 'Easy'), html: loc('easy_bots', 'Easy'), action: function () { parent.setState({ dropdown1FilterIndex: 1 }) } },
            { key: 2, text: loc('medium_bots', 'Medium'), html: loc('medium_bots', 'Medium'), action: function () { parent.setState({ dropdown1FilterIndex: 2 }) } },
            { key: 3, text: loc('hard_bots', 'Hard'), html: loc('hard_bots', 'Hard'), action: function () { parent.setState({ dropdown1FilterIndex: 3 }) } }
        ]

        // later, could make this more generic
        var k = 0
        var dropdown2Items = [
            { key: k++, text: loc('all_roles', 'All Roles'), html: loc('all_roles', 'All Roles'), action: function () { parent.setState({ dropdown2FilterIndex: 0 }) } },
            { key: k++, text: loc('role_dps', 'DPS'), html: '<img src="hud/img/small-icons/role_dps.png"> ' + loc('role_dps', 'DPS'), action: function () { parent.setState({ dropdown2FilterIndex: 1 }) } },
            { key: k++, text: loc('role_aura', 'Aura'), html: '<img src="hud/img/small-icons/role_aura.png"> ' + loc('role_aura', 'Aura'), action: function () { parent.setState({ dropdown2FilterIndex: 2 }) } },
            { key: k++, text: loc('role_versatile', 'Versatile'), html: '<img src="hud/img/small-icons/role_balanced.png"> ' + loc('role_versatile', 'Versatile'), action: function () { parent.setState({ dropdown2FilterIndex: 3 }) } },
            { key: k++, text: loc('role_tank', 'Tank'), html: '<img src="hud/img/small-icons/role_tank.png"> ' + loc('role_tank', 'Tank'), action: function () { parent.setState({ dropdown2FilterIndex: 4 }) } },
            { key: k++, text: loc('role_aoe', 'AoE'), html: '<img src="hud/img/small-icons/aoe.png"> ' + loc('role_aoe', 'AoE'), action: function () { parent.setState({ dropdown2FilterIndex: 5 }) } },
            { key: k++, text: loc('role_carry', 'Carry'), html: '<img src="hud/img/small-icons/carry.png"> ' + loc('role_carry', 'Carry'), action: function () { parent.setState({ dropdown2FilterIndex: 6 }) } },
            { key: k++, text: locName('mana', 'Mana'), html: '<img src="hud/img/small-icons/mana.png"> ' + locName('mana', 'Mana'), action: function () { parent.setState({ dropdown2FilterIndex: 7 }) } }
        ]

        var itemCounter = 0

        return React.createElement('div', {
            className: 'fullscreen',
            onMouseDown: function (e) { // v1.50
                engine.trigger('enableChat', false)
            },
            style: {
                pointerEvents: 'all'
            }
        },
            React.createElement('div', { id: 'IconSelection' },
                React.createElement('div', { className: 'fullscreen-icon-selection-container scrollable' },
                    React.createElement('div', {
                        className: 'fullscreen-icon-selection-title',
                        dangerouslySetInnerHTML: {
                            __html: parent.state.title
                        }
                    }),

                    React.createElement('div', { className: 'icon-selection-dropdowns' },
                        React.createElement('div', {
                            className: 'dropdown-container icon-selection-filter', style: {}
                        },
                            React.createElement(DropdownLinks, {
                                choices: dropdown1Items,
                                defaultValue: dropdown1Items[0].html,
                                actualValue: dropdown1Items[parent.state.dropdown1FilterIndex].html
                            })
                        ),

                        React.createElement('div', {
                            className: 'dropdown-container icon-selection-filter', style: {}
                        },
                            React.createElement(DropdownLinks, {
                                choices: dropdown2Items,
                                defaultValue: dropdown2Items[0].html,
                                actualValue: dropdown2Items[parent.state.dropdown2FilterIndex].html
                            })
                        )
                    ),
                    React.createElement('div', { className: 'icon-selection-container-wrapper' },
                        React.createElement('div', { className: 'icon-selection-container-icons' },
                            Object.keys(filteredItems).map(function (category) {
                                if (!_.includes(parent.firstColumnCategories, category)) return null

                                return CreateIconSelectionRow(parent, filteredItems, category)
                            })
                        ),
                        parent.secondColumnCategories.length > 0 && React.createElement('div', { className: 'icon-selection-container-icons' },
                            Object.keys(filteredItems).map(function (category) {
                                if (!_.includes(parent.secondColumnCategories, category)) return null

                                return CreateIconSelectionRow(parent, filteredItems, category)
                            })
                        )
                    )
                )
            )
        )
    }
})

var CreateIconSelectionRow = function (parent, filteredItems, category) {
    var itemsInCategory = filteredItems[category]

    return React.createElement(parent.state.dropdown2FilterIndex == 0 ? 'div' : 'span', { className: 'fullscreen-icon-selection-category' },
        itemsInCategory.map(function (item) {
            var grayedOut = false
            grayedOut |= parent.state.dropdown2FilterIndex == 1 && item.role != 'role_dps'
            grayedOut |= parent.state.dropdown2FilterIndex == 2 && item.role != 'role_aura' && !_.includes(item.secondaryRoles, 'role_upgrade_aura') && !_.includes(item.secondaryRoles, 'role_aura_secondary')
            grayedOut |= parent.state.dropdown2FilterIndex == 3 && item.role != 'role_balanced'
            grayedOut |= parent.state.dropdown2FilterIndex == 4 && item.role != 'role_tank'
            grayedOut |= parent.state.dropdown2FilterIndex == 5 && !_.includes(item.secondaryRoles, 'role_aoe') && !_.includes(item.secondaryRoles, 'role_upgrade_aoe')
            grayedOut |= parent.state.dropdown2FilterIndex == 6 && !_.includes(item.secondaryRoles, 'role_carry') && !_.includes(item.secondaryRoles, 'role_upgrade_carry')
            grayedOut |= parent.state.dropdown2FilterIndex == 7 && !_.includes(item.secondaryRoles, 'role_mana') && !_.includes(item.secondaryRoles, 'role_upgrade_mana')

            grayedOut |= parent.state.dropdown1FilterIndex == 1 && item.difficulty != 'rolldiff_e'
            grayedOut |= parent.state.dropdown1FilterIndex == 2 && item.difficulty != 'rolldiff_m'
            grayedOut |= parent.state.dropdown1FilterIndex == 3 && item.difficulty != 'rolldiff_h'

            var isSelected = _.includes(parent.state.currentSelectionItems, item.key)

            return React.createElement('div', {
                className: 'simple-tooltip' + (isSelected ? ' selected' : ''),
                onMouseDown: function (e) {
                    if (grayedOut) return

                    console.log('Clicked ' + item.key)

                    if (e.nativeEvent.which == 3) {
                        console.log('OnIconSelectionSubmit ' + parent.state.handlerKey + '_rightclick, ' + item.key)
                        engine.call('OnIconSelectionSubmit', parent.state.handlerKey + '_rightclick', item.key, parent.state.currentSelectionItems)
                        return
                    }

                    if (isSelected) {
                        console.log('Clicked ' + item.key + ' which already is selected, so deselect it')

                        const arrayIndexToRemove = parent.state.currentSelectionItems.indexOf(item.key);
                        if (arrayIndexToRemove > -1) {
                            parent.state.currentSelectionItems.splice(arrayIndexToRemove, 1);
                            parent.setState({ currentSelectionItems: parent.state.currentSelectionItems })
                        } else {
                            console.warn('Could not find item.key ' + item.key)
                        }
                        return
                    }

                    parent.state.currentSelectionItems.push(item.key)
                    parent.setState({ currentSelectionItems: parent.state.currentSelectionItems })

                    console.log('now selected ' + parent.state.currentSelectionItems.length + '/' + parent.state.maxSelections)

                    if (parent.state.currentSelectionItems.length > parent.state.maxSelections) {
                        console.warn('exceeded max selections')
                        parent.state.currentSelectionItems = parent.state.currentSelectionItems.slice(0, parent.state.maxSelections)
                    }

                    if (parent.state.currentSelectionItems.length >= parent.state.maxSelections) {
                        console.log('hit max selections')
                        console.log('OnIconSelectionSubmit ' + parent.state.handlerKey + ', item.key: ' + item.key + ', selections: ' + parent.state.currentSelectionItems)
                        engine.call('OnIconSelectionSubmit', parent.state.handlerKey, item.key, parent.state.currentSelectionItems)
                        return
                    }
                }
            },
                React.createElement('img', { className: 'icon' + (grayedOut ? ' disabled' : ''), src: 'hud/img/' + item.icon }),
                // Too noisy, nvm
                //(item.role != null && item.role.length > 0) && React.createElement('div', { className: 'action-role' }, React.createElement('img', { src: 'hud/img/small-icons/' + item.role + '.png' })),
                React.createElement('span', {
                    className: 'tooltiptext auto',
                    dangerouslySetInnerHTML: {
                        __html: item.name
                    }
                })
            )
        })
    )
}

/* Some smelly copy & paste going on here... */
var BigMessage = React.createClass({
    getInitialState: function () {
        return {
            bigText: '',
            buttonText: '',
            hideArrow: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.renderTutorialArrowText['big'] = function (props, buttonText) {
            parent.setState({ bigText: props.message, buttonText: buttonText, hideArrow: props.hideArrow, mirror: props.mirror })
        }
    },
    render: function () {
        var parent = this
        if (!parent.state.bigText)
            return null

        var marginTopValue = this.state.mirror ? 200 : -350

        // To fix small-res from being able to progress
        if (globalState.screenHeight < 1080)
            marginTopValue *= 0.7

        //console.log('marginTopValue: ' + marginTopValue)

        return (
            React.createElement('div', { className: 'centered-text', style: { height: '100vh', width: '100vw' } },
                React.createElement('div', { className: 'centered-text-wrapper' },
                    React.createElement('div', {
                        className: 'big-text',
                        style: {
                            marginTop: marginTopValue + 'px',
                        }
                    },
                        React.createElement('div', {
                            className: 'big-text-content',
                            dangerouslySetInnerHTML: {
                                __html: parent.state.bigText
                            }
                        }),
                        (parent.state.buttonText) &&
                        React.createElement('div', { className: 'button-container' },
                            React.createElement('div', {
                                className: 'button em',
                                dangerouslySetInnerHTML: {
                                    __html: parent.state.buttonText
                                },
                                style: {
                                },
                                onMouseDown: function (e) {
                                    parent.setState({ bigText: '', buttonText: '' })
                                    engine.call('OnTutorialContinuePressed')
                                }
                            }),
                            (!parent.state.hideArrow) && React.createElement('div', {
                                className: 'arrow-image down',
                                style: {
                                    left: 'calc(50vw - 45px)',
                                }
                            })
                        )
                    )
                )
            )
        )
    }
})
