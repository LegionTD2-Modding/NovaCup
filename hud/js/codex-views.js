// Codex is the in-game game guide
// ===============================================================================

var CodexUnits = React.createClass({
    getInitialState: function () {
        return {
            selectedUnitData: globalState.lastCodexSelectedUnit,
            filterLegionIndex: 0,
            filterTierIndex: 0,
            filterAttackIndex: 0,
            filterDefenseIndex: 0,
            filterSearch: "",
            sortIndex: 0,
            gridView: true,
        }
    },
    componentDidMount: function () {
        console.log("CodexUnits component did mount - reset scroll")
        console.log("refs ", this.refs.unitsContainer)
        if (this.refs.unitsContainer != null)
            this.refs.unitsContainer.scrollTop = 0
    },
    componentWillMount: function() {
        var parent = this

        bindings.refreshCodexSelectedUnit = function (selectedUnitData) {
            console.log("CodexUnits refreshCodexSelectedUnit", selectedUnitData)
            parent.setState({ selectedUnitData: selectedUnitData })
            globalState.lastCodexSelectedUnit = selectedUnitData
        }
    },
    toggleGridView: function (e) {
        var parent = this
        //console.log("Grid view toggled: ", parent.state.gridView)
        this.setState({ gridView: !parent.state.gridView })

        engine.call('OnClickDropdownOption')
    },
    handleSearchChange: function (e) {
        //console.log('handleSearchChange ' + e.target.value + ', key: ' + e.key)
        this.setState({ filterSearch: e.target.value })
    },
    sortingChanged: function (index) {
        this.setState({ sortIndex: index })
        if (this.refs.unitsContainer != null)
            this.refs.unitsContainer.scrollTop = 0
    },
    render: function () {
        var parent = this
        if (!globalState.codexContent) return null

        var selectedUnitData = this.state.selectedUnitData
        var codex = globalState.codexContent

        if (selectedUnitData == null) return React.createElement('div', {}, "Error: no selected unit data")
        
        var legionDropdownItems = []
        codex.legions.map(function (legion, index) {
            if (index == 0 && legion.legionType != 'mastermind_legion_id') console.warn("legion 0 wasn't mastermind")
            legionDropdownItems.push({
                key: legion.legionType,
                text: legion.name,
                action: function () {
                    console.log('set filter legion index to ' + index)
                    parent.setState({ filterLegionIndex: index })
                },
                html: '<img class="tooltip-icon" src="hud/img/' + legion.image + '" />' + ' ' + legion.name
            })
        })

        var tierDropdownItems = [
            { key: 0, text: loc('all', 'All'), html: loc('all', 'All'), action: function () { parent.setState({ filterTierIndex: 0 }) } },
            { key: 1, text: 'T1', html: 'T1', action: function () { parent.setState({ filterTierIndex: 1 }) } },
            { key: 2, text: 'T2', html: 'T2', action: function () { parent.setState({ filterTierIndex: 2 }) } },
            { key: 3, text: 'T3', html: 'T3', action: function () { parent.setState({ filterTierIndex: 3 }) } },
            { key: 4, text: 'T4', html: 'T4', action: function () { parent.setState({ filterTierIndex: 4 }) } },
            { key: 5, text: 'T5', html: 'T5', action: function () { parent.setState({ filterTierIndex: 5 }) } },
            { key: 6, text: 'T6', html: 'T6', action: function () { parent.setState({ filterTierIndex: 6 }) } },
        ]

        var attackTypeDropdownItems = [
            //{ key: 0, text: loc('all_types', 'All Types'), html: loc('all_types', 'All Types'), action: function () { parent.setState({ filterAttackIndex: 0 }) } },
            { key: 0, text: loc('all', 'All'), html: loc('all', 'All'), action: function () { parent.setState({ filterAttackIndex: 0 }) } },
            { key: 1, text: 'Pierce', html: '<img src="hud/img/icons/Pierce.png" class="tooltip-icon"/>', action: function () { parent.setState({ filterAttackIndex: 1 }) } },
            { key: 2, text: 'Magic', html: '<img src="hud/img/icons/Magic.png" class="tooltip-icon"/>', action: function () { parent.setState({ filterAttackIndex: 2 }) } },
            { key: 3, text: 'Impact', html: '<img src="hud/img/icons/Impact.png" class="tooltip-icon"/>', action: function () { parent.setState({ filterAttackIndex: 3 }) } },
            { key: 4, text: 'Pure', html: '<img src="hud/img/icons/Pure.png" class="tooltip-icon"/>', action: function () { parent.setState({ filterAttackIndex: 4 }) } },
        ]

        var defenseTypeDropdownItems = [
            { key: 0, text: loc('all', 'All'), html: loc('all', 'All'), action: function () { parent.setState({ filterDefenseIndex: 0 }) } },
            { key: 1, text: 'Immaterial', html: '<img src="hud/img/icons/Immaterial.png" class="tooltip-icon"/>', action: function () { parent.setState({ filterDefenseIndex: 1 }) } },
            { key: 2, text: 'Swift', html: '<img src="hud/img/icons/Swift.png" class="tooltip-icon"/>', action: function () { parent.setState({ filterDefenseIndex: 2 }) } },
            { key: 3, text: 'Natural', html: '<img src="hud/img/icons/Natural.png" class="tooltip-icon"/>', action: function () { parent.setState({ filterDefenseIndex: 3 }) } },
            { key: 4, text: 'Arcane', html: '<img src="hud/img/icons/Arcane.png" class="tooltip-icon"/>', action: function () { parent.setState({ filterDefenseIndex: 4 }) } },
            { key: 5, text: 'Fortified', html: '<img src="hud/img/icons/Fortified.png" class="tooltip-icon"/>', action: function () { parent.setState({ filterDefenseIndex: 5 }) } },
        ]

        var sortingDropdownItems = [
            { key: 0, text: locName('default', 'Default'), html: '<img src="hud/img/ui/sort.png" class="tooltip-icon"/> ' + loc('default', 'Default'), action: function () { parent.sortingChanged(0) } },
            { key: 1, text: locName('total_value', 'Value'), html: '<img src="hud/img/ui/sort.png" class="tooltip-icon"/> ' + locName('total_value', 'Value'), action: function () { parent.sortingChanged(1) } },
            { key: 2, text: locName('offense', 'Offense'), html: '<img src="hud/img/ui/sort.png" class="tooltip-icon"/> ' + locName('offense', 'Offense'), action: function () { parent.sortingChanged(2) } },
            { key: 3, text: locName('defense', 'Defense'), html: '<img src="hud/img/ui/sort.png" class="tooltip-icon"/> ' + locName('defense', 'Defense'), action: function () { parent.sortingChanged(3) } },
            { key: 4, text: locName('offense', 'Offense') + ' ' + loc('per_x_gold', 'Per 100 Gold', [100]), html: '<img src="hud/img/ui/sort.png" class="tooltip-icon"/> ' + locName('offense', 'Offense') + ' ' + loc('per_x_gold', 'Per 100 Gold', [100]), action: function () { parent.sortingChanged(4) } },
            { key: 5, text: locName('defense', 'Defense') + ' ' + loc('per_x_gold', 'Per 100 Gold', [100]), html: '<img src="hud/img/ui/sort.png" class="tooltip-icon"/> ' + locName('defense', 'Defense') + ' ' + loc('per_x_gold', 'Per 100 Gold', [100]), action: function () { parent.sortingChanged(5) } },
            { key: 6, text: loc('range', 'Range'), html: '<img src="hud/img/ui/sort.png" class="tooltip-icon"/> ' + loc('range', 'Range'), action: function () { parent.sortingChanged(6) } },
        ]

        // since calc(%) and calc(vh) are not supported by coherent we just use something close enough
        var unitListHeight = globalState.screenHeight * 0.90 - 288
        var extraHeightRightSide = unitListHeight / 22.3
        if (globalState.screenHeight < 800) {
            unitListHeight = globalState.screenHeight * 0.83 - 288
            extraHeightRightSide = unitListHeight / 22.3 + 54
        }

        //console.log('globalState.screenHeight : ' + globalState.screenHeight)
        //console.log('globalState.screenWidth : ' + globalState.screenWidth)
        //console.log('unitListHeight: ' + unitListHeight)
        console.log("codex:", codex)

        var unitCategories = {}
        unitCategories["Fighter"] = []
        //unitCategories["King"] = []
        //unitCategories["Wave"] = []
        //unitCategories["Mercenary"] = []

        var selectedUnitKeyIndex = 0
        return (
            React.createElement('div', { ref: 'codex', className: 'codex' },
                React.createElement('div', { className: 'codex-units-list-wrapper' },
                    React.createElement('div', { className: 'units-list' },
                        React.createElement('div', { className: 'options' },
                            //React.createElement('div', {
                            //    className: 'dropdown-container legionSelect', style: {}
                            //},
                            //    React.createElement(DropdownLinks, {
                            //        choices: legionDropdownItems,
                            //        defaultValue: codex.legions[0].name,
                            //        actualValue: '<img class="tooltip-icon" src="hud/img/' + codex.legions[parent.state.filterLegionIndex].image + '" />' + ' ' + codex.legions[parent.state.filterLegionIndex].name
                            //    })
                            //),
                            React.createElement('div', {
                                className: 'dropdown-container tierSelect', style: {}
                            },
                                React.createElement("div", { className: 'label' }, locName('tier', "Tier")),
                                React.createElement(DropdownLinks, {
                                    choices: tierDropdownItems,
                                    defaultValue: loc('all', 'All'),
                                    actualValue: parent.state.filterTierIndex == 0 ? loc('all', 'All') : 'T' + parent.state.filterTierIndex,
                                })
                            ),

                            React.createElement('div', {
                                className: 'dropdown-container typeSelect', style: {}
                            },
                                React.createElement("div", { className: 'label' }, locName('damage', "Damage")),
                                React.createElement(DropdownLinks, {
                                    choices: attackTypeDropdownItems,
                                    defaultValue: loc('all', 'All'),
                                    actualValue: attackTypeDropdownItems[parent.state.filterAttackIndex].html,
                                })
                            ),

                            React.createElement('div', {
                                className: 'dropdown-container typeSelect', style: {}
                            },
                                React.createElement("div", { className: 'label' }, locName('defense', "Defense")),
                                React.createElement(DropdownLinks, {
                                    choices: defenseTypeDropdownItems,
                                    defaultValue: loc('all', 'All'),
                                    actualValue: defenseTypeDropdownItems[parent.state.filterDefenseIndex].html,
                                })
                            ),

                            React.createElement('div', { className: 'dropdown-container' },
                                React.createElement("div", { className: 'label' }, loc('view', "View")),
                                React.createElement('label', { className: 'toggleSwitch', onClick: '' },
                                    React.createElement('input', { type: 'checkbox', onChange: this.toggleGridView }),
                                    React.createElement('a', { href: '#' }),
                                    React.createElement('span', {},
                                        React.createElement('span', { className: 'left-span' },
                                            React.createElement('img', { className: 'ui-icon', src: 'hud/img/ui/gridview.png' })
                                        ),
                                        React.createElement('span', { className: 'right-span' },
                                            React.createElement('img', { className: 'ui-icon', src: 'hud/img/ui/textview.png' })
                                        )
                                    )
                                )
                            ),

                            React.createElement('div', {
                                className: 'dropdown-container unitSort', style: {}
                            },
                                React.createElement("div", { className: 'label' }, loc('sort', "Sort")),
                                React.createElement(DropdownLinks, {
                                    choices: sortingDropdownItems,
                                    defaultValue: loc('legion', 'Legion'),
                                    actualValue: sortingDropdownItems[parent.state.sortIndex].html,
                                })
                            ),

                            React.createElement('div', { className: 'unit-search-container' },
                                React.createElement('input', {
                                    ref: 'input',
                                    className: 'unit-search',
                                    placeholder: loc('search', 'Search'),
                                    onChange: this.handleSearchChange,
                                    maxLength: "50",
                                })
                            )
                        ),
                        React.createElement('div', { ref: 'unitsContainer', className: 'units scrollable', style: { height: unitListHeight + 'px' } },
                            codex.legions.map(function (legion) {
                                //console.log("legions", legion)
                                if (parent.state.filterLegionIndex != 0 && legion.legionType != codex.legions[parent.state.filterLegionIndex].legionType) return
                                var filteredUnits = codex.units.filter(function (unit) {
                                    var result = unit.legionType == legion.legionType
                                    //console.log("Filtering: " + unit.attackType + " == " + attackTypeDropdownItems[parent.state.filterAttackIndex].text )
                                    if (parent.state.filterLegionIndex != 0 && unit.legionType != codex.legions[parent.state.filterLegionIndex].legionType ||
                                        parent.state.filterTierIndex > 0 && (!unit.tier || unit.tier != parent.state.filterTierIndex) ||
                                        parent.state.filterAttackIndex > 0 && (!unit.attackType || unit.attackType.toLowerCase() != attackTypeDropdownItems[parent.state.filterAttackIndex].text.toLowerCase()) ||
                                        parent.state.filterDefenseIndex > 0 && (!unit.armorType || unit.armorType.toLowerCase() != defenseTypeDropdownItems[parent.state.filterDefenseIndex].text.toLowerCase()) ||
                                        parent.state.filterSearch.length > 0 && ((unit.prefix.toLowerCase() + " " + unit.name.toLowerCase()).indexOf(parent.state.filterSearch.toLowerCase()) == -1))
                                        result = false

                                    unit.legion = legion
                                    return result
                                })

                                switch (legion.legionType) {
                                    case "mastermind_legion_id":
                                    case "atlantean_legion_id":
                                    case "divine_legion_id":
                                    case "element_legion_id":
                                    case "forsaken_legion_id":
                                    case "grove_legion_id":
                                    case "mech_legion_id":
                                    case "nomad_legion_id":
                                    case "shrine_legion_id":
                                        Array.prototype.push.apply(unitCategories["Fighter"], filteredUnits)
                                        break
                                    case "nether_legion_id":
                                        unitCategories["Mercenary"] = filteredUnits
                                        break
                                    case "creature_legion_id":
                                        unitCategories["Wave"] = filteredUnits
                                        break
                                    case "aspect_legion_id":
                                        // Kings disabled for now
                                        //unitCategories["King"] = filteredUnits
                                        break
                                }
                                //console.log("filtered units: ", legion.legionType, filteredUnits)
                            }),

                            React.createElement('div', { className: 'tabbed-container' },
                                React.createElement(TabbedInlineMenu, {
                                    name: "codex-units-tabs",
                                    depth: 0,
                                    className: "codex-body-tabs",
                                    active: 0,
                                    items: [
                                        { key: selectedUnitKeyIndex++, menuId: selectedUnitKeyIndex, name: "Fighter", displayName: '<img src="hud/img/ui/defense_wht.png" width="32px" />', content: React.createElement(CodexUnitTab, { selectedUnitData: selectedUnitData, unitCategories: unitCategories["Fighter"], sortIndex: parent.state.sortIndex, gridView: parent.state.gridView }) },
                                        { key: selectedUnitKeyIndex++, menuId: selectedUnitKeyIndex, name: "Wave", displayName: '<img src="hud/img/ui/creep_wht.png" width="32px" />', content: React.createElement(CodexUnitTab, { selectedUnitData: selectedUnitData, unitCategories: unitCategories["Wave"], sortIndex: parent.state.sortIndex, gridView: parent.state.gridView }) },
                                        { key: selectedUnitKeyIndex++, menuId: selectedUnitKeyIndex, name: "Mercenary", displayName: '<img src="hud/img/ui/attack_wht.png" width="32px" />', content: React.createElement(CodexUnitTab, { selectedUnitData: selectedUnitData, unitCategories: unitCategories["Mercenary"], sortIndex: parent.state.sortIndex, gridView: parent.state.gridView }) }
                                    ]
                                })
                            )
                        )
                    ),
                    React.createElement('div', { className: 'units-content scrollable', style: { height: (100 + unitListHeight + extraHeightRightSide) + 'px' } },
                        selectedUnitData == null && React.createElement('div', {}, loc('loading', 'Loading...')),
                        selectedUnitData != null && React.createElement('div', { className: 'unit-container' },
                            //selectedUnitData.renderExists && React.createElement('img', {
                            //    src: 'hud/img/render/' + selectedUnitData.name + '.png', // Coherent doesn't seem to support .webp :(
                            //    className: 'unit-render'
                            //}),
                            React.createElement('div', { className: 'unit-details' },
                                React.createElement('div', { className: 'unit-name' },
                                    React.createElement('img', { className: 'unit-icon', src: 'hud/img/' + selectedUnitData.image }),
                                    selectedUnitData.name, selectedUnitData.suffix && React.createElement('span', { className: 'suffix' }, (' ' + selectedUnitData.suffix))
                                ),

                                React.createElement('div', { className: 'unit-subdetails' },
                                    selectedUnitData.cost > 0 && React.createElement('div', { className: 'unit-cost' },
                                        React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Gold.png' }),
                                        React.createElement('span', { className: 'stat' }, ' ' + selectedUnitData.cost + ' ')
                                    ),
                                    selectedUnitData.mythium > 0 && React.createElement('div', { className: 'unit-cost' },
                                        React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Mythium.png' }),
                                        React.createElement('span', { className: 'stat' }, ' ' + selectedUnitData.mythium + ' ')
                                    ),
                                    selectedUnitData.income > 0 && React.createElement('div', { className: 'unit-cost' },
                                        React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/Income.png' }),
                                        React.createElement('span', { className: 'stat' }, ' ' + selectedUnitData.income + ' ')
                                    ),
                                    //React.createElement('span', { className: 'unit-descriptor', style: { background: '#' + selectedUnitData.color } }, selectedUnitData.prefix),
                                    React.createElement('img', { className: 'legion-icon', src: 'hud/img/' + selectedUnitData.legionImage }),
                                    React.createElement('span', { className: 'unit-descriptor' }, selectedUnitData.legion)
                                ),
                                React.createElement('div', { className: 'unit-tooltip' }, selectedUnitData.description),
                                //React.createElement('div', { className: 'unit-tooltip', dangerouslySetInnerHTML: { __html: selectedUnitData.roles } } ),

                                React.createElement('div', { className: 'stat-wrapper' }, 
                                    selectedUnitData.upgradesFrom != null && selectedUnitData.upgradesFrom.length > 0 && selectedUnitData.upgradesFrom.map(function (unit) {
                                        return React.createElement('div', { className: 'stat-container' },
                                            React.createElement('div', { className: 'label' }, locName('upgrades_from', 'Upgrades from')),
                                            React.createElement('div', {
                                                className: 'stat hyperlink',
                                                onMouseDown: function (e) {
                                                    engine.call('OnFetchCodexInfoForUnit', unit.unitType)
                                                }
                                            },
                                                React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/' + unit.image }),
                                                ' ',
                                                unit.name,
                                                unit.suffix && React.createElement('span', { className: 'suffix' }, (' ' + unit.suffix))
                                            )
                                        )
                                    }),

                                    selectedUnitData.upgradesTo != null && selectedUnitData.upgradesTo.length > 0 && selectedUnitData.upgradesTo.map(function (unit) {
                                        return React.createElement('div', { className: 'stat-container' },
                                            React.createElement('div', { className: 'label' }, locName('upgrades_to', 'Upgrades to')),
                                            React.createElement('div', {
                                                className: 'stat hyperlink',
                                                onMouseDown: function (e) {
                                                    engine.call('OnFetchCodexInfoForUnit', unit.unitType)
                                                }
                                            },
                                                React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/' + unit.image }),
                                                ' ',
                                                unit.name,
                                                unit.suffix && React.createElement('span', { className: 'suffix' }, (' ' + unit.suffix))
                                            )
                                        )
                                    })
                                ),

                                React.createElement('a', {
                                    href: "#",
                                    onClick: function () {
                                        engine.call("OnOpenURL", "https://legiontd2.wiki.gg/wiki/" + selectedUnitData.name)
                                    },
                                    style: { fontSize: '12px', float: 'right' }
                                },
                                    React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/small-icons/external-link.png', style: { verticalAlign: "sub"} }),
                                    React.createElement('span', {}, loc('strategy_and_trivia', 'Strategy & Trivia'))
                                )
                            ),

                            React.createElement(CodexUnit3DPreview, { className: '3dpreview-container', selectedUnitData: selectedUnitData }),
                            React.createElement(CodexUnitStats, { selectedUnitData: selectedUnitData })
                        )
                        
                    )
                )
            )
        )
    }
})

var CodexUnitTab = React.createClass({
    propTypes: {
        selectedUnitData: React.PropTypes.object.isRequired,
        unitCategories: React.PropTypes.object.isRequired,
        sortIndex: React.PropTypes.object.isRequired,
        gridView: React.PropTypes.object.isRequired,
    },
    componentDidMount: function () {
        bindings.resetVideos = function () {
            console.log('bindings resetVideos')

            // Restart video on render
            var video = document.getElementById('unit-preview-video')
            console.log("video: " + video)
            if (video != null) {
                if (video.readyState === 4) { // Video is available, just reset directly
                    video.pause()
                    video.currentTime = 0
                    video.load()
                } else { // Video is still loading, add event to reset once its ready
                    video.addEventListener('canplay', function resetVideo() {
                        console.log("canplay")
                        video.pause()
                        video.currentTime = 0
                        video.load()
                        video.removeEventListener('canplay', resetVideo)
                    }, false)
                }
            }
        }
    },
    componentWillMount: function () {
        document.addEventListener("keydown", this.handleKey, false)
    },
    componentWillUnmount: function () {
        document.removeEventListener('keydown', this.handleKey, false)
    },
    unitTypesList: {},
    handleKey: function (evt) {
        var parent = this

        if (!globalState.codexContent) return null

        // Hack to disable arrow keys if this element is not visible
        var reactObject = this.refs.codex
        var top = 0
        if (reactObject != null)
            top = reactObject.getBoundingClientRect().top
        if (top == 0)
            return

        console.log('selectedUnitData unitType: ' + parent.props.selectedUnitData.unitType)
        console.log('parent.unitTypesList', parent.unitTypesList)
        var currentUnitTypeIndex = parseInt(_.invert(parent.unitTypesList)[parent.props.selectedUnitData.unitType])

        console.log('selectedUnitData currentUnitTypeIndex: ' + currentUnitTypeIndex)

        if (parent.props.gridView) return // Disable arrow hotkeys in gridview
        evt = evt || window.event

        if (window.innerWidth >= 1600) {
            // LEFT ←
            if (evt.keyCode == 37) {
                var nextIndex = Math.max(0, currentUnitTypeIndex - 1)
                console.log('OnFetchCodexInfoForUnit ' + nextIndex)
                engine.call('OnFetchCodexInfoForUnit', parent.unitTypesList[nextIndex])
                evt.preventDefault()
            }
            // UP ↑
            if (evt.keyCode == 38) {
                var nextIndex = Math.max(0, currentUnitTypeIndex - 2)
                console.log('OnFetchCodexInfoForUnit ' + nextIndex)
                engine.call('OnFetchCodexInfoForUnit', parent.unitTypesList[nextIndex])
                evt.preventDefault()
            }
            // RIGHT →
            if (evt.keyCode == 39) {
                var x = Object.keys(parent.unitTypesList).length - 1
                var y = currentUnitTypeIndex + 1
                //console.log('Math.min(' + x + ', ' + y + ') is: ' + (Math.min(x, y)))
                var nextIndex = Math.min(x, y)
                console.log('OnFetchCodexInfoForUnit ' + nextIndex)
                engine.call('OnFetchCodexInfoForUnit', parent.unitTypesList[nextIndex])
                evt.preventDefault()
            }
            // DOWN ↓
            if (evt.keyCode == 40) {
                var x = Object.keys(parent.unitTypesList).length - 1
                var y = currentUnitTypeIndex + 2
                //console.log('Math.min(' + x + ', ' + y + ') is: ' + (Math.min(x, y)))
                var nextIndex = Math.min(x, y)
                console.log('OnFetchCodexInfoForUnit ' + nextIndex)
                engine.call('OnFetchCodexInfoForUnit', parent.unitTypesList[nextIndex])
                evt.preventDefault()
            }
        } else {
            // UP ↑
            if (evt.keyCode == 38) {
                var nextIndex = Math.max(0, currentUnitTypeIndex - 1)
                console.log('OnFetchCodexInfoForUnit ' + nextIndex)
                engine.call('OnFetchCodexInfoForUnit', parent.unitTypesList[nextIndex])
                evt.preventDefault()
            }

            // DOWN ↓
            if (evt.keyCode == 40) {
                var x = Object.keys(parent.unitTypesList).length - 1
                var y = currentUnitTypeIndex + 1
                //console.log('Math.min(' + x + ', ' + y + ') is: ' + (Math.min(x, y)))
                var nextIndex = Math.min(x, y)
                console.log('OnFetchCodexInfoForUnit ' + nextIndex)
                engine.call('OnFetchCodexInfoForUnit', parent.unitTypesList[nextIndex])
                evt.preventDefault()
            }
        }




        //if (evt.keyCode == 38) {
        //    var nextIndex = Math.max(0, currentUnitTypeIndex - 1)
        //    console.log('OnFetchCodexInfoForUnit ' + nextIndex)
        //    engine.call('OnFetchCodexInfoForUnit', parent.unitTypesList[nextIndex])
        //    evt.preventDefault()
        //}
        //if (evt.keyCode == 40) {
        //    var x = Object.keys(parent.unitTypesList).length - 1
        //    var y = currentUnitTypeIndex + 1
        //    //console.log('Math.min(' + x + ', ' + y + ') is: ' + (Math.min(x, y)))
        //    var nextIndex = Math.min(x, y)
        //    console.log('OnFetchCodexInfoForUnit ' + nextIndex)
        //    engine.call('OnFetchCodexInfoForUnit', parent.unitTypesList[nextIndex])
        //    evt.preventDefault()
        //}
    },
    render: function () {
        var parent = this

        var unitIndex = 0

        var selectedUnitData = this.props.selectedUnitData

        var filteredUnits = parent.props.unitCategories

        if (selectedUnitData == null || filteredUnits == null) return React.createElement('div', {}, "")

        parent.unitTypesList = {}

        //console.log("UNITCATEGORIES2", filteredUnits)
        //console.log("Sort by " + parent.props.sortIndex)
        var maxValue = 0
        
        switch (parent.props.sortIndex) {
            case 0: // Default - Units are already sorted by legion, so bail early
                break
            case 1: // Value
                filteredUnits.sort(function (a, b) {
                    if (isBrowserTest) {
                        a.value = a.value == undefined ? Math.random(500) * 100 : a.value
                        b.value = b.value == undefined ? Math.random(500) * 100 : b.value
                    }

                    if (b.value < a.value) return -1
                    if (b.value > a.value) return 1
                    return 0
                })
                maxValue = Math.max.apply(Math, filteredUnits.map(function (unit) { return unit.value }))
                break
            case 2: // DPS
                filteredUnits.sort(function (a, b) {
                    if (isBrowserTest) {
                        a.dps = a.dps == undefined ? Math.random(400) * 100 : a.dps
                        b.dps = b.dps == undefined ? Math.random(400) * 100 : b.dps
                    }
                    if (b.dps < a.dps) return -1
                    if (b.dps > a.dps) return 1
                    return 0
                })
                maxValue = Math.max.apply(Math, filteredUnits.map(function (unit) { return unit.dps }))
                break
            case 3: // Health
                filteredUnits.sort(function (a, b) {
                    if (isBrowserTest) {
                        a.hp = a.hp == undefined ? Math.random(5000) * 100 : a.hp
                        b.hp = b.hp == undefined ? Math.random(5000) * 100 : b.hp
                    }
                    if (b.hp < a.hp) return -1
                    if (b.hp > a.hp) return 1
                    return 0
                })
                maxValue = Math.max.apply(Math, filteredUnits.map(function (unit) { return unit.hp }))
                break
            case 4: // DPS Per Gold
                filteredUnits.sort(function (a, b) {
                    if (isBrowserTest) {
                        a.dpsPerGold = a.dpsPerGold == undefined ? Math.random(10) * 100 : a.dpsPerGold
                        b.dpsPerGold = b.dpsPerGold == undefined ? Math.random(10) * 100 : b.dpsPerGold
                    }
                    if (b.dpsPerGold < a.dpsPerGold) return -1
                    if (b.dpsPerGold > a.dpsPerGold) return 1
                    return 0
                })
                maxValue = Math.max.apply(Math, filteredUnits.map(function (unit) { return unit.dpsPerGold }))
                break
            case 5: // Health Per Gold
                filteredUnits.sort(function (a, b) {
                    if (isBrowserTest) {
                        a.hpPerGold = a.hpPerGold == undefined ? Math.random(10) * 100 : a.hpPerGold
                        b.hpPerGold = b.hpPerGold == undefined ? Math.random(10) * 100 : b.hpPerGold
                    }
                    if (b.hpPerGold < a.hpPerGold) return -1
                    if (b.hpPerGold > a.hpPerGold) return 1
                    return 0
                })
                maxValue = Math.max.apply(Math, filteredUnits.map(function (unit) { return unit.hpPerGold }))
                break
            case 6: // Range
                filteredUnits.sort(function (a, b) {
                    if (isBrowserTest) {
                        a.range = a.range == undefined ? Math.random(800) : a.range
                        b.range = b.range == undefined ? Math.random(800) : b.range
                    }
                    if (b.range < a.range) return -1
                    if (b.range > a.range) return 1
                    return 0
                })
                maxValue = Math.max.apply(Math, filteredUnits.map(function (unit) { return unit.range }))
                break
        }

        
        //console.log("Max value: " + maxValue)

        //console.log("filteredUnits after sorting", filteredUnits)

        return filteredUnits.length > 0 && React.createElement('div', { ref: 'codex', className: 'legion-wrap', style: { background: "rgba(49, 62, 61, 0.85)" } },
            //React.createElement('h3', { className: 'unit-legion' }),
            filteredUnits.map(function (unit) {
                // for browser testing
                if (unit.unitType == null) unit.unitType = unit.name
                if (isBrowserTest) {
                    unit.description = "In addition to its burst attack, it also can boost its attack speed and heal itself. In addition to its burst attack, it also can boost its attack speed and heal itself."
                    //unit.value = Math.random(5000)
                }

                //console.log("unit:", unit)

                var sortValue = 0
                switch (parent.props.sortIndex) {
                    case 0: // Default - Units are already sorted by legion, so bail early
                        break
                    case 1: // Value
                        sortValue = unit.value
                        break
                    case 2: // DPS
                        sortValue = unit.dps
                        break
                    case 3: // Health
                        sortValue = unit.hp
                        break
                    case 4: // DPS Per Gold
                        sortValue = unit.dpsPerGold
                        break
                    case 5: // Health Per Gold
                        sortValue = unit.hpPerGold
                        break
                    case 6: // Range
                        sortValue = unit.range
                        break
                }

                // for arrow keys
                parent.unitTypesList[unitIndex] = unit.unitType
                unitIndex++
                //console.log("adding unitTypesList ", parent.unitTypesList )


                var highlight = (unit.unitType == selectedUnitData.unitType)

                return React.createElement('div', {
                    key: unit.unitType,
                    className: 'unit' + (highlight ? ' selected' : ' not-selected') + (parent.props.gridView ? ' gridview' : ' listview'),
                    onMouseOver: function () { engine.call("OnHoverSmallMenuItem") },
                    onMouseDown: function (e) {
                        console.log('clicked ' + unit.unitType)

                        if (isBrowserTest) {
                            console.log("isBrowserTest " + isBrowserTest)
                            testCodexSelectedUnitData.unitType = unit.unitType
                            testCodexSelectedUnitData.name = unit.name
                            testCodexSelectedUnitData.image = unit.image
                            testCodexSelectedUnitData.splash = "NoIcon.png"
                            testCodexSelectedUnitData.legionImage = unit.legion.image
                            testCodexSelectedUnitData.previewVideoExists = true
                            testCodexSelectedUnitData.renderExists = false
                            if (unit.name != "Atom" && unit.name != "Proton") {
                                console.log("Unit " + unit.name + " was not Atom or Proton, set render existing to true")
                                testCodexSelectedUnitData.renderExists = true
                            }
                            testCodexSelectedUnitData.roles = '[<img src="hud/img/small-icons/role_balanced.png"> <span style="color: #ffcc00">Versatile </span><img src="hud/img/small-icons/upgrade_subtle.png"><span style="color: #909090">AoE</span> <img src="hud/img/small-icons/upgrade_subtle.png"><span style="color: #909090">Aura</span> <img src="hud/img/small-icons/upgrade_subtle.png"><span style="color: #909090">Mana</span>]'

                            engine.trigger('refreshCodexSelectedUnit', testCodexSelectedUnitData)
                            console.log('refreshCodexSelectedUnit ', testCodexSelectedUnitData)
                        }

                        engine.call('OnClickSmallMenuItem')
                        engine.call('OnFetchCodexInfoForUnit', unit.unitType)
                    }
                },
                    React.createElement('div', { className: 'unit-wrap' + (parent.props.gridView ? ' gridview' : '') },
                        React.createElement('div', { className: 'unit-img-wrap' },
                            React.createElement('img', { className: 'unit-icon', src: 'hud/img/' + unit.image }),
                            parent.props.sortIndex > 0 && React.createElement('div', {
                                className: "progress-container",
                                style: { height: '15px' }
                            },
                                React.createElement('div', {
                                    className: "progress-bar unit-sort", style: {
                                        width: (100 * sortValue / maxValue) + "%",
                                    }
                                }),
                                Math.round(sortValue) > 0 && React.createElement('span', { className: 'value' }, Math.round(sortValue)),
                                Math.round(sortValue) <= 0 && React.createElement('span', { className: 'value' }, '-')
                            )
                        ),
                        !parent.props.gridView && React.createElement('div', { className: 'unit-infos' },
                            //legion.legionType == "creature_legion_id" && React.createElement('div', { className: 'unit-prefix' }, unit.prefix),
                            //' ',
                            React.createElement('span', {},
                                unit.legionType == "creature_legion_id" && unit.prefix + " - ",
                                unit.name,
                                unit.suffix && React.createElement('span', { style: { fontSize: '12px' } }, (' ' + unit.suffix))
                            ),
                            unit.description && React.createElement('span', { style: { fontSize: '12px' } }, (' ' + unit.description))
                        )
                    )
                )
            })
        )
    }
})

// Unused for now because high maintenance cost
//var CodexUnitVideo = React.createClass({
//    propTypes: {
//        selectedUnitData: React.PropTypes.object.isRequired,
//    },
//    componentWillMount: function () {
//        var parent = this
        
//    },
//    componentDidMount: function () {
//        bindings.resetVideos = function () {
//            console.log('bindings resetVideos')

//            // Restart video on render
//            var video = document.getElementById('unit-preview-video')
//            console.log("video: " + video)
//            if (video != null) {
//                if (video.readyState === 4) { // Video is available, just reset directly
//                    video.pause()
//                    video.currentTime = 0
//                    video.load()
//                } else { // Video is still loading, add event to reset once its ready
//                    video.addEventListener('canplay', function resetVideo() {
//                        console.log("canplay")
//                        video.pause()
//                        video.currentTime = 0
//                        video.load()
//                        video.removeEventListener('canplay', resetVideo)
//                    }, false)
//                }
//            }
//        }
//    },
//    render: function () {
//        var selectedUnitData = this.props.selectedUnitData
//        if (selectedUnitData == null) return React.createElement('div', {}, "Error: no selected unit data")

//        var unitName = selectedUnitData.name
//        // Extra handling for special units (summons or bosses) that can recycle a video clip
//        switch (unitName) {
//            case "Scorpion King":
//                unitName = "Scorpion"
//                selectedUnitData.previewVideoExists = true
//                break
//            case "Giant Quadrapus":
//                unitName = "Quadrapus"
//                selectedUnitData.previewVideoExists = true
//                break
//            case "Legion King":
//                unitName = "Legion Lord"
//                selectedUnitData.previewVideoExists = true
//                break
//            default:
//        }

//        console.log("Codex preview Unit name: " + unitName)

//        return (
//            React.createElement('div', { className: '', style: { marginTop: '10px', position: 'relative' } },
//                React.createElement('div', { className: '' },
//                    selectedUnitData.previewVideoExists && React.createElement('video', {
//                        src: 'hud/videos/codex/' + unitName + '.webm',
//                        muted: 'true', autoPlay: 'true', loop: 'true',
//                        className: 'media ',
//                        id: 'unit-preview-video',
//                        style: { width: '100%', outline: '1px solid rgba(218, 251, 248, 0.15)' }
//                    }),
//                    !selectedUnitData.previewVideoExists && React.createElement('div', { className: 'codex-video-missing' },
//                        React.createElement('img', {
//                            src: 'hud/img/ui/NoVideo.png'
//                        })
//                    )
//                )
//            )
//        )
//    }
//})

var CodexUnitStats = React.createClass({
    propTypes: {
        selectedUnitData: React.PropTypes.object.isRequired,
    },
    render: function () {
        var selectedUnitData = this.props.selectedUnitData
        if (selectedUnitData == null) return React.createElement('div', {}, "Error: no selected unit data")

        //console.log("CodexUnitStats selectedUnitData" + JSON.stringify(selectedUnitData))
        //console.log("CodexUnitStats globalstate last selected unit" + JSON.stringify(globalState.lastCodexSelectedUnit))
        //console.log("CodexUnitStats roles" + selectedUnitData.roles)

        return (
            React.createElement('div', { className: 'unit-stats-container' },
                React.createElement('div', { className: 'stats-table' },
                    React.createElement('div', { className: 'stats-wrapper'},
                        React.createElement('div', { className: 'stats-column', style: {} },
                            React.createElement('div', { className: 'subheader' }, locName('fighter_role', 'Role')),
                            selectedUnitData.roles && React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'unit-tooltip', dangerouslySetInnerHTML: { __html: selectedUnitData.roles } })
                            ),
                            React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'stat' }, selectedUnitData.prefix)
                            ),

                            React.createElement('div', { className: 'subheader' }, loc('stats', 'Stats')),
                            selectedUnitData.amountSpawned > 0 && React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, loc('x_per_spawn', 'x per spawn')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.amountSpawned)
                            ),
                            React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, locName('health', 'Health')),
                                React.createElement('div', { className: 'stat' },
                                    selectedUnitData.hp,
                                    selectedUnitData.totalValue > 0 && (' (' + (selectedUnitData.hp / selectedUnitData.totalValue).toFixed(2) + ' ' + loc('per_gold', 'per gold') + ')')
                                )
                            ),
                            selectedUnitData.mana > 0 && React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, locName('mana', 'Mana')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.mana)
                            ),
                            selectedUnitData.mana > 0 && React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, loc('mana_regen', 'Mana Regen')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.manaRegen.toFixed(2))
                            ),
                            React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, loc('dps', 'DPS')),
                                React.createElement('div', { className: 'stat' },
                                    selectedUnitData.dps,
                                    selectedUnitData.totalValue > 0 && (' (' + (selectedUnitData.dps / selectedUnitData.totalValue).toFixed(2) + ' ' + loc('per_gold', 'per gold') + ')')
                                )
                            ),
                            React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, locName('attack', 'Attack')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.damage)
                            ),
                            React.createElement('div', { className: 'stat-container simple-tooltip' },
                                React.createElement('div', { className: 'label' }, locName('attack_cooldown', 'Attack Cooldown')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.attackSpeed.toFixed(2) + 's'
                                    + ' (' + selectedUnitData.attackSpeedDescriptor + ')'
                                ),
                                React.createElement('span', { className: 'tooltiptext' }, loc('attack_cooldown', 'The time between attacks (in seconds). Lower value means faster attack.'))
                            ),
                            React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, loc('attacks_per_sec', 'Atk/sec')),
                                React.createElement('div', { className: 'stat' }, (1 / selectedUnitData.attackSpeed).toFixed(2))
                            ),
                            React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, loc('range', 'Range')),
                                React.createElement('div', { className: 'stat' },
                                    selectedUnitData.range,
                                    (selectedUnitData.range == 100) && ' (' + loc('melee', 'Melee') + ')'
                                )
                            ),
                            selectedUnitData.totalValue > 0 && React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, locName('total_value', 'Total Value')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.totalValue)
                            ),
                            selectedUnitData.bounty > 0 && React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, locName('bounty', 'Bounty')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.bounty)
                            ),
                            React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, loc('move_speed', 'Move Speed')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.mspd
                                    + ' (' + selectedUnitData.movementType + ')'
                                )
                            ),
                            React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, locName('hitbox', 'Hitbox')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.movementSize.toFixed(2))
                            ),
                            React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, locName('flags', 'Flags')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.flags)
                            )
                        ),
                        React.createElement('div', { className: 'attack-defense stats-column'},
                            React.createElement('div', { className: 'subheader' }, locName('attack_types_mission', 'Attack & Defense Types')),
                            React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, locName('attack_type', 'Attack Type')),
                                React.createElement('div', { className: 'stat simple-tooltip' },
                                    React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/' + selectedUnitData.attackType + '.png' }),
                                    ' ',
                                    locName(selectedUnitData.attackType + 'Attack', selectedUnitData.attackType),
                                    React.createElement('span', { className: 'tooltiptext', dangerouslySetInnerHTML: { __html: selectedUnitData.attackTypeDescription } })
                                )
                            ),
                            React.createElement('div', { className: 'stat-container' },
                                React.createElement('div', { className: 'label' }, locName('defense_type', 'Defense Type')),
                                React.createElement('div', { className: 'stat simple-tooltip' },
                                    React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/' + selectedUnitData.armorType + '.png' }),
                                    ' ',
                                    locName(selectedUnitData.armorType + 'Armor', selectedUnitData.armorType),
                                    React.createElement('span', { className: 'tooltiptext', dangerouslySetInnerHTML: { __html: selectedUnitData.armorTypeDescription } })
                                )
                            )
                        ),

                        selectedUnitData.abilities.length > 0 && React.createElement('div', { className: 'abilities stats-column' },
                            React.createElement('div', { className: 'subheader' }, locName('ability', 'Ability')),
                            //React.createElement('div', { className: 'subheader' }, 'Ability'),
                            selectedUnitData.abilities.map(function (ability) {
                                return React.createElement('div', { className: 'stat-container' },
                                    //!ability.abilityClass && React.createElement('div', { className: 'label' }, locName('ability', 'Ability')),
                                    ability.abilityClass == 'hidden' && React.createElement('div', { className: 'label' }, locName('hidden_ability', 'Hidden Ability')),
                                    ability.abilityClass == 'linked' && React.createElement('div', { className: 'label' }, locName('linked_ability', 'Linked Ability')),
                                    React.createElement('div', { className: 'stat simple-tooltip' },
                                        !ability.abilityClass && React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/' + ability.image }),
                                        ability.abilityClass && React.createElement('img', { className: 'tooltip-icon', src: 'hud/img/icons/NoIcon.png' }),
                                        ' ',
                                        React.createElement('span', { style: { color: '#ff8800' } }, ability.name),
                                        !ability.abilityClass && ': ',
                                        !ability.abilityClass && React.createElement('span', { dangerouslySetInnerHTML: { __html: ability.description } }),
                                        React.createElement('span', { className: 'tooltiptext', dangerouslySetInnerHTML: { __html: ability.extendedDescription } })
                                    )
                                )
                            })
                        ),
                        React.createElement('div', { className: 'stats-column' },
                            React.createElement('div', { className: 'subheader' }, locName('advanced_stats', 'Advanced Stats')),
                            React.createElement('div', { className: 'stat-container advanced simple-tooltip' },
                                React.createElement('div', { className: 'label' }, locName('turn_rate', 'Turn Rate')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.turnRate.toFixed(2)),
                                React.createElement('span', { className: 'tooltiptext' }, loc('turn_rate', 'Turn Rate'))
                            ),
                            React.createElement('div', { className: 'stat-container advanced simple-tooltip' },
                                React.createElement('div', { className: 'label' }, locName('projectile_speed', 'Projectile Speed')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.projectileSpeed),
                                React.createElement('span', { className: 'tooltiptext' }, loc('projectile_speed', 'Projectile Speed'))
                            ),
                            React.createElement('div', { className: 'stat-container advanced simple-tooltip' },
                                React.createElement('div', { className: 'label' }, locName('backswing', 'Backswing')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.backswing.toFixed(2) + 's'),
                                React.createElement('span', { className: 'tooltiptext' }, loc('backswing', 'Backswing'))
                            ),
                            React.createElement('div', { className: 'stat-container advanced simple-tooltip' },
                                React.createElement('div', { className: 'label' }, locName('effective_dps', 'Effective DPS')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.effectiveDps.toFixed(0)),
                                React.createElement('span', { className: 'tooltiptext' }, loc('effective_dps', 'Effective DPS'))
                            ),
                            React.createElement('div', { className: 'stat-container advanced simple-tooltip' },
                                React.createElement('div', { className: 'label' }, locName('effective_threat', 'Effective Threat')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.effectiveThreat.toFixed(0)),
                                React.createElement('span', { className: 'tooltiptext' }, loc('effective_threat', 'Effective Threat'))
                            ),
                            React.createElement('div', { className: 'stat-container advanced simple-tooltip' },
                                React.createElement('div', { className: 'label' }, locName('spawn_bias', 'Spawn Bias')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.spawnBias.toFixed(2)),
                                React.createElement('span', { className: 'tooltiptext' }, loc('spawn_bias', 'Spawn Bias'))
                            ),
                            selectedUnitData.legionType == 'nether_legion_id' && React.createElement('div', { className: 'stat-container advanced simple-tooltip' },
                                React.createElement('div', { className: 'label' }, locName('spawn_delay', 'Spawn Delay')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.spawnDelay.toFixed(2)),
                                React.createElement('span', { className: 'tooltiptext' }, loc('spawn_delay', 'Spawn Delay'))
                            ),
                            selectedUnitData.legionType == 'nether_legion_id' && React.createElement('div', { className: 'stat-container advanced simple-tooltip' },
                                React.createElement('div', { className: 'label' }, locName('stock_max', 'Stock Max')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.stockMax),
                                React.createElement('span', { className: 'tooltiptext' }, loc('stock_max', 'Stock Max'))
                            ),
                            selectedUnitData.legionType == 'nether_legion_id' && React.createElement('div', { className: 'stat-container advanced simple-tooltip' },
                                React.createElement('div', { className: 'label' }, locName('stock_time', 'Stock Time')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.stockTime),
                                React.createElement('span', { className: 'tooltiptext' }, loc('stock_time', 'Stock Time'))
                            ),
                            (selectedUnitData.mastermindGroups != "None") && React.createElement('div', { className: 'stat-container advanced simple-tooltip' },
                                React.createElement('div', { className: 'label' }, locName('mastermind_groups', 'Mastermind Groups')),
                                React.createElement('div', { className: 'stat' }, selectedUnitData.mastermindGroups),
                                React.createElement('span', { className: 'tooltiptext' }, loc('mastermind_groups', 'Mastermind Groups'))
                            )
                        )
                    )
                )
            )
        )
    }
})

var CodexUnit3DPreview = React.createClass({
    propTypes: {
        selectedUnitData: React.PropTypes.object.isRequired,
    },
    getInitialState: function () {
        return {
            selectedUnitData: globalState.lastCodexSelectedUnit
        }
    },
    render: function () {
        var selectedUnitData = this.state.selectedUnitData
        if (selectedUnitData == null) return React.createElement('div', {}, "Error: no selected unit data")

        return (
            React.createElement('div', { className: 'unit-3dpreview', style: { margin: '0px auto', position: 'relative', width: "60%" } },
                isBrowserTest && React.createElement('iframe', { style: { width: 100 + "%", height: 400 + "px" }, frameBorder: 0, allowFullscreen: "true", mozAllowFullscreen: "true", webkitAllowFullscreen: "true", src: "https://sketchfab.com/models/d0e69dc6d8544c6cb2ed08e488e1d7a9/embed?transparent=1&ampui_controls=0&ampautospin=0&ampautostart=1&ampui_infos=0" }),

                //<iframe class="stretchy-video" style="height:522px" src="https://sketchfab.com/models/d0e69dc6d8544c6cb2ed08e488e1d7a9/embed?transparent=1&ampui_controls=0&ampautospin=0&ampautostart=1&ampui_infos=0" frameborder="0" allowvr="" allowfullscreen="" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
                !isBrowserTest && React.createElement('img', {
                    src: 'liveview://codexLiveView',
                    className: 'sketchfab-embed',
                    style: {
                        outline: '1px solid rgba(218, 251, 248, 0.15)',
                        margin: "0 auto"
                    },
                    onMouseDown: function (e) {
                        console.log("codexLiveView mousedown " + e.nativeEvent.which)
                        engine.call('OnCodexUnitDragStart', e.nativeEvent.which)
                    },
                    onWheel: function (e) {
                        engine.call('OnCodexUnitZoom', e.nativeEvent.deltaY)
                        e.nativeEvent.preventDefault()
                    }
                }),
                React.createElement('div', {
                    className: 'change-pose simple-tooltip flipped flipped-y',
                    onMouseDown: function (e) {
                        engine.call('OnRefreshSkinPose')
                    }
                },
                    React.createElement('span', {
                        className: 'tooltiptext medium no-carat',
                        style: { left: '-260px' },
                        dangerouslySetInnerHTML: {
                            __html: loc('change_pose', 'Click to change pose<br>Hold right click & drag character to move<br>Hold left click & drag character to rotate<br>Mouse wheel to zoom')
                        }
                    })
                )
            )
        )
    }
})

var CodexSpells = React.createClass({
    getInitialState: function() {
        return {

        }
    },
    componentWillMount: function() {

    },
    render: function () {
        if (!globalState.codexContent) return null
        if (!globalState.codexContent.powerups) return "Error: could not find spells"

        return (
            React.createElement('div', { className: 'codex credits-menu' },
                React.createElement('div', { className: 'category' }, loc('legion_spells', "Legion Spells")),
                //React.createElement('p', {
                //    dangerouslySetInnerHTML: {
                //        __html: "Legion Spells are in-game upgrades that boost your economy, empower your units, or provide other benefits. At the start of the game, all players are given the same three randomized Legion Spells. After wave 10 ends, you must select and use one Legion Spell before wave 11 spawns."
                //    }
                //}),
                React.createElement('table', { className: 'generic-content-list' },
                    globalState.codexContent.powerups.map(function(powerup) {
                        return React.createElement('tr', {}, 
                            React.createElement('td', { className: 'simple-tooltip' },
                                React.createElement('td', {}, React.createElement('img', { className: 'with-border', style: { height: '32px' }, src: 'hud/img/' + powerup.image })),
                                powerup.extendedDescription && powerup.extendedDescription.length > 0 && React.createElement('span', {
                                    className: 'tooltiptext',
                                    dangerouslySetInnerHTML: {
                                        __html: powerup.extendedDescription
                                    }
                                })
                            ),
                            React.createElement('td', { style: { padding: '0 12px', color: "#8ff110" }}, React.createElement('span', {}, powerup.name)),
                            React.createElement('td', {}, React.createElement('span', {}, powerup.description))
                        )
                    })
                )
            )
        )
    }
})

var CodexKing = React.createClass({
    getInitialState: function () {
        return {

        }
    },
    componentWillMount: function () {

    },
    render: function () {
        if (!globalState.codexContent) return null
        if (!globalState.codexContent.king) return "Error: could not find king"

        return (
            React.createElement('div', { className: 'codex credits-menu' },
                React.createElement('div', { className: 'category' }, locName('king_upgrades_tooltip', "King Upgrades")),
                React.createElement('table', { className: 'generic-content-list' },
                    globalState.codexContent.king.researches.map(function (research) {
                        return React.createElement('tr', {},
                            React.createElement('td', {}, React.createElement('img', { className: 'with-border', style: { height: '32px' }, src: 'hud/img/' + research.image })),
                            React.createElement('td', { style: { padding: '0 12px', minWidth: '200px' } },
                                React.createElement('div', { style: { color: "#8ff110" }}, research.name),
                                React.createElement('div', {}, 
                                    React.createElement('img', { className: 'resource-icon', src: 'hud/img/icons/Mythium.png' }),
                                    React.createElement('span', {}, research.mythiumCost)
                                )
                            ),
                            React.createElement('td', {}, React.createElement('span', { style: { verticalAlign: 'top' } }, research.description))
                        )
                    })
                ),
                React.createElement('div', { className: 'category' }, locName('king_spells', "King Spells")),
                React.createElement('table', { className: 'generic-content-list' },
                    globalState.codexContent.king.abilities.map(function (ability) {
                        return React.createElement('tr', {},
                            React.createElement('td', {}, React.createElement('img', { className: 'with-border', style: { height: '32px' }, src: 'hud/img/' + ability.image })),
                            React.createElement('td', { style: { padding: '0 12px', minWidth: '200px' } },
                                React.createElement('div', { style: { color: "#8ff110" } }, ability.name),
                                React.createElement('div', {},
                                    React.createElement('img', { className: 'resource-icon', src: 'hud/img/icons/Mana.png' }),
                                    ability.manaCost > 0 && React.createElement('span', {}, ability.manaCost),
                                    ability.manaCost == 0 && React.createElement('span', {}, loc('passive_ability', 'Passive'))
                                )
                            ),
                            React.createElement('td', {}, React.createElement('span', { style: { verticalAlign: 'top' } }, ability.description))
                        )
                    })
                )
            )
        )
    }
})

var CodexEmojis = React.createClass({
    render: function () {
        if (!globalState.codexContent) return null
        if (!globalState.codexContent.emojis) return "Error: could not find emojis"

        return (
            React.createElement('div', { className: 'codex credits-menu' },
                React.createElement('div', { className: 'category' }, locName('emojis', "Emojis")),
                React.createElement('table', { className: 'generic-content-list' },
                    globalState.codexContent.emojis.map(function (emoji) {
                        return React.createElement('tr', {},
                            React.createElement('td', {}, React.createElement('img', { style: { height: '32px' }, src: 'hud/img/' + emoji.image })),
                            React.createElement('td', { style: { padding: '0 12px', color: "#8ff110" } }, React.createElement('span', {}, emoji.name))
                        )
                    })
                )
            )
        )
    }
})

var CodexDebugCommands = React.createClass({
    render: function () {
        if (!globalState.codexContent) return null
        if (!globalState.codexContent.debugCommands) return "Error: could not find debug commands"

        return (
            React.createElement('div', { className: 'codex credits-menu' },
                React.createElement('div', { className: 'category' }, locName('debug_commands', 'Debug Commands')),
                React.createElement('table', { className: 'generic-content-list' },
                    globalState.codexContent.debugCommands.map(function (command) {
                        if (command.commandType != 'debug') return null

                        return React.createElement('tr', {},
                            React.createElement('td', { style: { padding: '0 12px', color: "#8ff110", minWidth: '150px', } },
                                React.createElement('span', {
                                dangerouslySetInnerHTML: {
                                    __html: command.name
                                }
                            })),
                            React.createElement('td', {},
                                React.createElement('span', {
                                dangerouslySetInnerHTML: {
                                    __html: command.description
                                }
                            }))
                        )
                    })
                ),
                React.createElement('div', { className: 'category' }, locName('misc_commands', 'Misc Commands')),
                React.createElement('table', { className: 'generic-content-list' },
                    globalState.codexContent.debugCommands.map(function (command) {
                        if (command.commandType != '') return null

                        return React.createElement('tr', {},
                            React.createElement('td', { style: { padding: '0 12px', color: "#8ff110", minWidth: '150px', } }, React.createElement('span', {}, command.name)),
                            React.createElement('td', {}, React.createElement('span', {}, command.description))

                        )
                    }),
                    globalState.codexContent.debugCommands.map(function (command) {
                        if (command.commandType != 'lobby') return null

                        return React.createElement('tr', {},
                            React.createElement('td', { style: { padding: '0 12px', color: "#8ff110", minWidth: '150px', } }, React.createElement('span', {}, command.name)),
                            React.createElement('td', {}, React.createElement('span', {}, command.description))

                        )
                    })
                )
            )
        )
    }
})

var CodexHelp = React.createClass({
    getInitialState: function () {
        return {
            selectedIndex: 0
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshCodexSelectedHelp = function (index) {
            if (index >= globalState.codexContent.help.helpEntries.length) {
                console.log('WARNING: refreshCodexSelectedHelp called with invalid index: ' + index)
                return
            }

            var descriptionId = globalState.codexContent.help.helpEntries[index].key

            globalState.gameManualRead.push(descriptionId)
            parent.setState({ selectedIndex: index }) // Must come after we update globalState.gameManualRead

            engine.call('OnReadGameManual', descriptionId)
        }

        document.addEventListener("keydown", this.handleKey, false)
    },
    handleKey: function (evt) {
        var parent = this

        if (!globalState.codexContent) return null

        // Hack to disable arrow keys if this element is not visible
        var reactObject = this.refs.codexHelp
        var top = 0
        if (reactObject != null)
            top = reactObject.getBoundingClientRect().top
        if (top == 0)
            return

        evt = evt || window.event

        if (evt.keyCode == 38) {
            var nextIndex = Math.max(0, parent.state.selectedIndex - 1)
            engine.trigger('refreshCodexSelectedHelp', nextIndex )
            evt.preventDefault()
        }
        if (evt.keyCode == 40) {
            var x = globalState.codexContent.help.helpEntries.length - 1
            var y = parent.state.selectedIndex + 1
            //console.log('Math.min(' + x + ', ' + y + ') is: ' + (Math.min(x, y)))
            var nextIndex = Math.min(x, y)
            engine.trigger('refreshCodexSelectedHelp', nextIndex )
            evt.preventDefault()
        }
    },
    render: function () {
        if (!globalState.codexContent) return null
        if (!globalState.codexContent.help) return "Error: could not find help"

        var parent = this

        return (
            React.createElement('div', { className: 'codex credits-menu help-menu', ref: 'codexHelp' },
                React.createElement('div', { className: 'help-list scrollable' },
                    React.createElement('div', { className: 'sub-header' }, loc('table_of_contents', "Table of Contents")),
                    globalState.codexContent.help.helpEntries.map(function (entry, index) {
                        return React.createElement('div', {
                            className: 'help-list-row' + (parent.state.selectedIndex == index ? ' active' : ''),
                            onMouseDown: function () {
                                engine.trigger('refreshCodexSelectedHelp', index)
                            }
                        },
                            entry.name,
                            !_.includes(globalState.gameManualRead, entry.key) ? React.createElement('span', { className: 'new' }, loc('new_item', 'New!')) : ''
                        )
                    })
                ),
                React.createElement('div', { className: 'help-content scrollable' },
                    globalState.codexContent.help.helpEntries.map(function (entry, index) {
                        if (parent.state.selectedIndex != index) return null
                        return React.createElement('div', {
                            style: {
                                // this approach will load all the videos at once, which is unideal for coherent
                                //display: parent.state.selectedIndex != index ? 'none' : ''
                            }
                        },
                            React.createElement('div', { className: 'category' }, entry.name),
                            React.createElement('div', {
                                dangerouslySetInnerHTML: {
                                    __html: entry.content
                                }
                            })
                        )
                    })
                )
            )
        )
    }
})