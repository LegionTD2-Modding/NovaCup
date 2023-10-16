// Options menu
// =============================================================================================

var options = {}
var optionsBindings = {}

function setOptionsValue(key, value, defaultValue, possibleValues) {
    options[key] = value

    if (typeof optionsBindings[key] === "function") {
        optionsBindings[key](value, defaultValue, possibleValues)
        return
    }
    //} else {
    //    console.log("WARNING: Missing options key: " + key + ". Are you sure it is defined in the UI?")
    //}
}

function setOptionsValue(key, value, defaultValue, min, max) {
    options[key] = value

    if (typeof optionsBindings[key] === "function") {
        optionsBindings[key](value, defaultValue, min, max)
        return
    }
    //} else {
    //    console.log("WARNING: Missing options key: " + key + ". Are you sure it is defined in the UI?")
    //}
}

// For use in the options menu only!
var DropdownMenu = React.createClass({
    propTypes: {
        field: React.PropTypes.string.isRequired,
    },
    getInitialState: function () {
        return {
            value: "",
            defaultValue: "",
            possibleValues: ["undefined"],
            show: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        //console.log("parent.props.field is " + parent.props.field)
        optionsBindings[parent.props.field] = function (value, defaultValue, possibleValues) {
            //console.log("Set " + parent.props.field + " to " + value)
            parent.setState({
                value: value,
                defaultValue: defaultValue,
                possibleValues: possibleValues,
            })
        }
    },
    render: function () {
        var parent = this

        var locFieldName = convertDisplayNameToApexId(this.state.value)
        var locValue = loc(locFieldName, parent.state.value)

        // v7.05.2
        locValue = locValue.replace(/@ \d+Hz/gm, '')

        // Add flag (v2.41a experimental, removed since chinese ppl get mad)
        //locValue = getFlagHtml(locFieldName) + " " + locValue

        return (
            React.createElement('div', {},
                React.createElement('div', {
                    className: "hide-popup-backer fixed" + (this.state.show ? '' : ' hidden'),
                    onMouseDown: function (event) {
                        parent.setState({ show: false })
                    }
                }),
                React.createElement('div', {
                    className: 'dropdown-button button',
                    onMouseEnter: function (e) {
                        engine.call("OnMouseOverVeryLight", 0)
                    },
                    onMouseDown: function (event) {
                        if (event.nativeEvent.which == 1)
                            parent.setState({ show: true })
                        else if (event.nativeEvent.which == 3) {
                            options[parent.props.field] = parent.state.defaultValue
                            parent.setState({ value: parent.state.defaultValue })
                        }
                        engine.call('OnClickDropdownButton')
                    }
                },
                    React.createElement('span', {
                        dangerouslySetInnerHTML: {
                            // 9662 was nice, but missing on Mac
                            //__html: locValue + '<span style="float: right; width: 0px;">' + String.fromCharCode(9662) + '</span>'
                            __html: locValue + '<span style="float: right; width: 0px;"><img src="hud/img/small-icons/sort-triangle.png"></span>'

                        }
                    })
                ),
                React.createElement('div', { className: 'dropdown-panel' + (this.state.show ? '' : ' hidden') },
                    this.state.possibleValues.map(function (item) {
                        var itemLocName = convertDisplayNameToApexId(item)

                        // Add flag (v2.41a experimental, removed since chinese ppl get mad)
                        //var itemLocValue = getFlagHtml(itemLocName) + " " + loc(itemLocName, item)
                        var itemLocValue = loc(itemLocName, item)

                        // v7.05.2
                        itemLocValue = itemLocValue.replace(/@ \d+Hz/gm, '')

                        return React.createElement('div', {
                            key: item,
                            className: 'dropdown-item' + ((item == parent.state.value) ? ' selected' : ''),
                            style: {
                                fontFamily: parent.props.field == 'Language' ? 'MenuFont_chat' : ''
                            },
                            onMouseEnter: function (e) {
                                engine.call("OnMouseOverVeryLight", 0)
                            },
                            onMouseDown: function (e) {
                                options[parent.props.field] = item
                                parent.setState({ show: false, value: item })
                                engine.call('OnClickDropdownOption')
                            }
                        },
                            React.createElement('span', {
                                dangerouslySetInnerHTML: {
                                    __html: itemLocValue
                                }
                            })
                        )
                    })
                )
            )
        )
    }
})

var ToggleButton = React.createClass({
    propTypes: {
        field: React.PropTypes.string.isRequired,
    },
    getInitialState: function () {
        return {
            value: "",
            defaultValue: "",
            possibleValues: ["undefined"],
        }
    },
    componentWillMount: function () {
        var parent = this
        var locFieldName = convertDisplayNameToApexId(this.state.value)

        //console.log("parent.props.field is " + parent.props.field)
        optionsBindings[parent.props.field] = function (value, defaultValue, possibleValues) {
            //console.log("Set " + parent.props.field + " to " + value)
            parent.setState({
                value: value,
                possibleValues: possibleValues,
                defaultValue: defaultValue
            })
        }
    },
    getNextValue: function () {
        var currentIndex = -1
        for (var i = 0; i < this.state.possibleValues.length; i++) {
            if (this.state.value == this.state.possibleValues[i]) {
                currentIndex = i
                break
            }
        }
        var nextIndex = (currentIndex + 1) % this.state.possibleValues.length
        //console.log("nextIndex: " + nextIndex + " given that currentIndex: " + currentIndex + " and number of options was " + this.state.possibleValues.length)

        return this.state.possibleValues[nextIndex]
    },
    render: function () {
        var parent = this
        var locFieldName = convertDisplayNameToApexId(this.state.value)
        var text = loc(locFieldName, parent.state.value)

        return (
            React.createElement('div', {},
                React.createElement('div', {
                    className: 'toggle-button button',
                    style: {
                        background: text == loc('off', 'Off') ? '#909090' : '',
                        outline: text == loc('off', 'Off') ? '1px solid white' : ''
                    },
                    onMouseDown: function (event) {
                        var nextValue = ""
                        if (event.nativeEvent.which == 1)
                            nextValue = parent.getNextValue()
                        else if (event.nativeEvent.which == 3)
                            nextValue = parent.state.defaultValue

                        parent.setState({
                            value: nextValue
                        })
                        options[parent.props.field] = nextValue
                    }
                },
                    text
                )
            )
        )
    }
})

var Slider = React.createClass({
    propTypes: {
        field: React.PropTypes.string.isRequired,
    },
    getInitialState: function () {
        return {
            value: "",
            defaultValue: "",
            min: 0,
            max: 0,
            enabled: true,
        }
    },
    componentWillMount: function () {
        var parent = this
        optionsBindings[parent.props.field] = function (value, defaultValue, min, max) {
            parent.setState({
                value: value,
                defaultValue: defaultValue,
                min: min,
                max: max,
            })
        }
        bindings.setOptionEnabled[parent.props.field] = function (enabled) {
            parent.setState({
                enabled: enabled
            })

            // Force refresh the slider, or else it won't update
            var slider = parent.refs.sliderElement
            if (slider == null || slider.length == 0) return
            slider.rangeSlider.update();
        }
    },
    componentDidUpdate: function () {
        var parent = this
        var slider = this.refs.sliderElement
        if (slider == null || slider.length == 0) return

        rangeSlider.create(slider, {
            polyfill: true,     // Boolean, if true, custom markup will be created
            rangeClass: 'rangeSlider',
            disabledClass: 'rangeSlider--disabled',
            fillClass: 'rangeSlider__fill',
            bufferClass: 'rangeSlider__buffer',
            handleClass: 'rangeSlider__handle',
            startEvent: ['mousedown', 'touchstart', 'pointerdown'],
            moveEvent: ['mousemove', 'touchmove', 'pointermove'],
            endEvent: ['mouseup', 'touchend', 'pointerup'],
            vertical: false,    // Boolean, if true slider will be displayed in vertical orientation
            min: parent.state.min,          // Number , 0
            max: parent.state.max,          // Number, 100
            step: null,         // Number, 1
            value: parent.state.value,        // Number, center of slider
            buffer: null,       // Number, in percent, 0 by default
            stick: null,        // [Number stickTo, Number stickRadius] : use it if handle should stick to stickTo-th value in stickRadius
            borderRadius: 10,    // Number, if you use buffer + border-radius in css for looks good,
            onInit: function () {
                //console.info('onInit')
            },
            onSlideStart: function (position, value) {
                //console.info('onSlideStart', 'position: ' + position, 'value: ' + value);
            },
            onSlide: function (position, value) {
                //console.log('min: ' + parent.state.min + ', max: ' + parent.state.max + ', value: ' + value)
                var percentValue = (parent.state.min + (value * (parent.state.max - parent.state.min))).toFixed(0)
                parent.setState({ value: percentValue })
                options[parent.props.field] = percentValue
                //console.log('onSlide', 'position: ' + position, 'value: ' + value);
            },
            onSlideEnd: function (position, value) {
                //console.warn('onSlideEnd', 'position: ' + position, 'value: ' + value);
            }
        });
    },
    render: function () {
        var parent = this

        return (
            React.createElement('div', {},
                React.createElement('div', {
                    className: 'option-slider-value',
                    onMouseDown: function (event) {
                        if (event.nativeEvent.which == 3) {
                            parent.setState({ value: parent.state.defaultValue })
                            options[parent.props.field] = parent.state.defaultValue

                            // Force refresh the slider, or else it won't update
                            var slider = parent.refs.sliderElement
                            if (slider == null || slider.length == 0) return
                            slider.rangeSlider.value = parent.state.defaultValue
                            slider.rangeSlider.update();
                        }
                    }
                },
                    parent.state.value
                ),
                React.createElement('div', {
                    className: 'option-slider'
                },
                    React.createElement('input', {
                        type: 'range',
                        ref: 'sliderElement',
                        min: parent.state.min,
                        max: parent.state.max,
                        step: "1",
                        dataBuffer: "60",
                        disabled: !parent.state.enabled,
                    })
                )
            )
        )
    }
})

var Hotkey = React.createClass({
    propTypes: {
        field: React.PropTypes.string.isRequired,
    },
    getInitialState: function () {
        return {
            value: options[this.props.field]
        }
    },
    componentWillMount: function () {
        var parent = this
        optionsBindings[parent.props.field] = function (value) {
            parent.setState({
                value: value,
            })
            options[parent.props.field] = value
        }
    },
    render: function () {
        var parent = this

        var displayName = this.state.value

        // Friendly texts
        if (_.startsWith(displayName, 'Alpha'))
            displayName = displayName.substring('Alpha'.length, displayName.length)
        if (displayName == 'UpArrow')
            displayName = 'Up'
        if (displayName == 'DownArrow')
            displayName = 'Down'
        if (displayName == 'LeftArrow')
            displayName = 'Left'
        if (displayName == 'RightArrow')
            displayName = 'Right'
        if (displayName == 'LeftBracket')
            displayName = '['
        if (displayName == 'RightBracket')
            displayName = ']'

        return (
            React.createElement('div', {},
                React.createElement('div', {
                    className: 'toggle-button button simple-tooltip',
                    onMouseDown: function (event) {
                        if (event.nativeEvent.which == 1)
                            engine.call('ListenForHotkey', parent.props.field)
                        else if (event.nativeEvent.which == 3)
                            engine.call('ClearHotkey', parent.props.field)
                    }
                },
                    displayName,
                    React.createElement('span', { className: 'tooltiptext', style: { width: '320px' } }, loc('left_click_to_modify_hotkey', "Left-click to modify. Right-click to unbind."))
                )
            )
        )
    }
})
