// Window in the top left when you select a unit in-game
// =============================================================================================

var TargetFrame = React.createClass({
    propTypes: {
        theme: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            enabled: false,
            tooltip: false,
            name: "",
            showExtended: true,
            description: "",
            longDescription: "",
            image: "",
            hp: 0,
            maxHp: 0,
            mana: 0,
            maxMana: 0,
            minDamage: 0,
            maxDamage: 0,
            attackType: 'Attack',
            armorType: 'Armor',
            attackTypeDescription: "",
            armorTypeDescription: "",
            color: "",
            arrowText: "",
            buttonText: "",
            unitType: "",
            attackTarget: -1,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.enablePopout = function (enabled) {
            parent.setState({ enabled: enabled })
        }
        bindings.setTargetProperties = function (properties) {
            parent.setState(properties)

            // Smelly to force it to refresh (v6.03)
            engine.trigger('refreshTargetArmorTypeTooltip', properties.armorTypeDescription)
        }
        bindings.renderTutorialArrowText['buffs'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, buttonText: buttonText })
        }
        bindings.refreshTargetAttackTarget = function (value) { parent.setState({ attackTarget: value }) }
    },
    render: function () {
        var parent = this
        if (this.state.image == null || this.state.image.length == 0) {
            return null
        }
        return (
            React.createElement('div', { id: 'TargetFrameWindow', className: (!this.state.enabled ? ' hidden' : '') },
                React.createElement('div', { id: 'TargetFrame', className: (!this.state.enabled ? ' hidden' : '') },
                    React.createElement('div', { className: 'panel' + ((this.props.theme != "") ? ' ' + this.props.theme : '') },
                        React.createElement('div', {
                            className: 'thumb',
                            style: {
                                borderBottom: "6px solid #" + this.state.color
                            },
                            onMouseOver: function () { parent.setState({ tooltip: true }) },
                            onMouseLeave: function () {
                                parent.setState({
                                    tooltip: false,
                                    //showExtended: false,
                                })
                            },
                            onMouseDown: function (e) {
                                if (e.nativeEvent.which == 3) {
                                    engine.call('OnSelectAttackTarget', parent.state.attackTarget)
                                    return
                                }

                                //console.log("Codex Lockup Bug Hack: reload codex from UI")
                                engine.trigger('loadView', 'codex')
                                engine.trigger('selectSubmenu', 2)

                                // v9.07
                                // v10.02: Switched selectSubmenu line above with OnFetchCodexInfoForUnit, now also seems to work with targets in game
                                setTimeout(function () {
                                    //console.log("Codex Lockup Bug Hack: reload submenu with target unit")
                                    engine.call('OnFetchCodexInfoForUnit', parent.state.unitType)
                                }, 100)
                            }
                        },
                            React.createElement('img', { src: 'hud/img/' + (this.state.image ? this.state.image : "icons/NoIcon.png") })
                        ),
                        React.createElement('ul', { className: 'vitals' },
                            React.createElement('div', { className: 'name', dangerouslySetInnerHTML: { __html: this.state.name } }),
                            React.createElement(TargetHp, { initialHp: this.state.hp, maxHp: this.state.maxHp }),
                            (this.state.maxMana > 0) && React.createElement(TargetMana, { initialMana: this.state.mana, maxMana: this.state.maxMana })
                        ),
                        React.createElement(TargetStats, {
                            attackType: this.state.attackType,
                            armorType: this.state.armorType,
                            minDamage: this.state.minDamage,
                            maxDamage: this.state.maxDamage,
                            attackTypeDescription: this.state.attackTypeDescription,
                            armorTypeDescription: this.state.armorTypeDescription,
                        })
                    ),
                    React.createElement(TargetBuffs, {}),
                    this.state.name && React.createElement(Tooltip, {
                        header: this.state.name,
                        text: (this.state.showExtended) ? this.state.longDescription : this.state.description,
                        enabled: this.state.tooltip,
                        valign: "below"
                    }),
                    this.state.arrowText && React.createElement('div', {
                        className: 'arrow-text',
                        style: {
                            bottom: '-194px',
                            width: '230px',
                            left: '110px',
                        },
                    },
                        React.createElement('div', {
                            dangerouslySetInnerHTML: {
                                __html: this.state.arrowText
                            }
                        }),
                        this.state.buttonText && React.createElement('div', {
                            className: 'button em',
                            dangerouslySetInnerHTML: {
                                __html: parent.state.buttonText
                            },
                            style: {
                                marginTop: '24px',
                                //fontSize: '24px'
                            },
                            onMouseDown: function (e) {
                                engine.call('OnTutorialContinuePressed')
                                parent.setState({ arrowText: '', buttonText: '' })
                            }
                        }),
                        React.createElement('div', {
                            className: 'arrow-image up',
                            style: {
                                left: '-64px',
                                bottom: '34px',
                            }
                        })
                    )
                )
            )
        )
    }
})

var TargetStats = React.createClass({
    propTypes: {
        attackType: React.PropTypes.string,
        armorType: React.PropTypes.string,
        minDamage: React.PropTypes.number,
        maxDamage: React.PropTypes.number,
        attackTypeDescription: React.PropTypes.string,
        armorTypeDescription: React.PropTypes.string,
    },
    getInitialState: function () {
        return {
            bonusDamage: 0,
            damageReductionStr: 0,
            attackTypeTooltip: false,
            armorTypeTooltip: false,
            armorTypeDescription: this.props.armorTypeDescription // Smelly pattern!!!!
            // Since it will initialize to the correct armorType first run, then future ones
            // it relies on refreshTargetArmorTypeTooltip to be called... smelly :(
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshTargetBonusDamage = function (value) { parent.setState({ bonusDamage: value }) }
        bindings.refreshTargetDamageReduction = function (text) { parent.setState({ damageReductionStr: text }) }
        bindings.refreshTargetArmorTypeTooltip = function (value) { parent.setState({ armorTypeDescription: value }) }
    },
    render: function () {
        if (this.state.bonusDamage == 0)
            var bonusDamageStr = null
        else if (this.state.bonusDamage > 0)
            var bonusDamageStr = React.createElement('span', { style: { color: '#33ff33' } }, "+" + this.state.bonusDamage)
        else if (this.state.bonusDamage < 0)
            var bonusDamageStr = React.createElement('span', { style: { color: '#ff3333' } }, this.state.bonusDamage)

        var parent = this
        return (
            React.createElement('div', { className: 'stats' },
                React.createElement('div', { className: 'centered-text' },
                    React.createElement('div', { className: 'centered-text-wrapper' },
                        React.createElement('ul', {},
                            React.createElement('li', {
                                onMouseOver: function () { parent.setState({ attackTypeTooltip: true }) },
                                onMouseLeave: function () { parent.setState({ attackTypeTooltip: false }) }
                            },
                                React.createElement('img', { className: 'resource-icon', src: 'hud/img/icons/' + this.props.attackType + '.png' }),
                                (this.props.minDamage == this.props.maxDamage) ?
                                    this.props.maxDamage : this.props.minDamage + "-" + this.props.maxDamage,
                                bonusDamageStr),
                            React.createElement('li', {
                                onMouseOver: function () { parent.setState({ armorTypeTooltip: true }) },
                                onMouseLeave: function () { parent.setState({ armorTypeTooltip: false }) }
                            },
                                React.createElement('img', { className: 'resource-icon', src: 'hud/img/icons/' + this.props.armorType + '.png' }),
                                React.createElement('span', {
                                    dangerouslySetInnerHTML: {
                                        __html: parent.state.damageReductionStr
                                    }
                                })
                            )
                        ),
                        React.createElement(Tooltip, {
                            header: '',
                            text: this.props.attackTypeDescription,
                            enabled: this.state.attackTypeTooltip,
                            valign: "below",
                            extraClasses: 'attack-type-tooltip',
                        }),
                        React.createElement(Tooltip, {
                            header: '',
                            text: this.state.armorTypeDescription,
                            enabled: this.state.armorTypeTooltip,
                            valign: "below",
                            extraClasses: 'attack-type-tooltip',
                        })
                    )
                )
            )
        )
    }
})

var TargetHp = React.createClass({
    propTypes: {
        initialHp: React.PropTypes.number,
        maxHp: React.PropTypes.number
    },
    getInitialState: function () {
        return {
            hp: this.props.initialHp
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshUnitHp[1] = function (value) { parent.setState({ hp: value }) }
    },
    render: function () {
        var fillPercent = (this.props.maxHp > 0) ? this.state.hp / this.props.maxHp : 0
        fillPercent = Math.min(1, fillPercent)
        return (
            React.createElement('li', { className: 'hp' },
                React.createElement('div', {
                    className: "progress-container",
                    style: { width: '128px', height: '20px' }
                },
                    React.createElement('div', {
                        className: "progress-bar custom", style: {
                            width: (100 * fillPercent) + "%",
                        }
                    }),
                    (this.props.maxHp > 0) && React.createElement('span', { className: 'value' }, this.state.hp + "/" + this.props.maxHp)
                )
            )
        )
    }
})

// Copy & pasted from TargetHp *Smelly* but gets the job done
var TargetMana = React.createClass({
    propTypes: {
        initialMana: React.PropTypes.number,
        maxMana: React.PropTypes.number
    },
    getInitialState: function () {
        return {
            mana: this.props.initialMana
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshUnitMana[1] = function (value) { parent.setState({ mana: value }) }
    },
    render: function () {
        var fillPercent = (this.props.maxMana > 0) ? this.state.mana / this.props.maxMana : 0;
        fillPercent = Math.min(1, fillPercent)

        //var manaValue = (Math.round(this.state.mana * 2) / 2).toFixed(1);
        var manaValue = this.state.mana.toFixed(0)

        if (fillPercent > 0 && fillPercent < 1)
            manaValue = this.state.mana.toFixed(1)

        return (
            React.createElement('li', { className: 'hp' },
                React.createElement('div', {
                    className: "progress-container",
                    style: { width: '128px', height: '20px' }
                },
                    React.createElement('div', {
                        className: "progress-bar mana", style: {
                            width: (100 * fillPercent) + "%",
                        }
                    }),
                    (this.props.maxMana > 0) && React.createElement('span', { className: 'value' }, manaValue + "/" + this.props.maxMana)
                )
            )
        )
    }
})

var TargetBuffs = React.createClass({
    getInitialState: function () {
        return {
            buffs: [],
            hoveredIndex: -1
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshTargetBuffs = function (values) {
            parent.setState({ buffs: values })
        }
    },
    render: function () {
        var parent = this
        return (
            React.createElement('ul', { className: 'buffs' },
                this.state.buffs.map(function (buff) {
                    return React.createElement('li', {
                        key: buff.key,
                        className: 'buff',
                        onMouseOver: function () { parent.setState({ hoveredIndex: buff.key }) },
                        onMouseLeave: function () { parent.setState({ hoveredIndex: -1 }) },
                    },
                        React.createElement('img', { className: 'icon ' + buff.border, src: 'hud/img/' + buff.image }),
                        buff.stacks != null && buff.stacks > 0 && React.createElement('div', { className: 'icon-stacks' },
                            buff.stacks
                        ),
                        React.createElement(Tooltip, {
                            header: buff.header,
                            image: (buff.image ? buff.image : "icons/NoIcon.png"),
                            text: buff.subheader,
                            enabled: parent.state.hoveredIndex == buff.key,
                            valign: "below",
                            align: "left"
                        })
                    )
                })
            )
        )
    }
})