var MinimapStats = React.createClass({
    getInitialState: function () {
        return {
            workers: 0,
            income: 0,
            value: 0,
            workersGlow: false,
            incomeGlow: false,
            valueGlow: false,
            incomeImage: 'hud/img/hudv2/income_arrow_0.png',
            mythiumImage: 'hud/img/hudv2/mythium_gain.gif',
            incomeOverlay: false,
            workerOverlay: false,
            mythiumGatherRate: 1,
            workerInterval: 10,
        }
    },
    workerTimeout: null,
    incomeTimeout: null,
    valueTimeout: null,
    incomeOverlayTimeout: null,
    workerOverlayTimeout: null,
    componentWillMount: function () {
        var parent = this
        bindings.setMinimapStats = function (workers, income, value) {
            var workersChanged = parent.state.workers != workers
            var incomeChanged = parent.state.income != income
            var valueChanged = parent.state.value != value

            if (workersChanged) {
                if (parent.workerTimeout)
                    clearTimeout(parent.workerTimeout)
                parent.workerTimeout = setTimeout(function () {
                    parent.setState({
                        workersGlow: false,
                    })
                }, 1000)
                parent.setState({ workersGlow: true })

                parent.setState({ workerOverlay: false })
                if (parent.workerOverlayTimeout)
                    clearTimeout(parent.workerOverlayTimeout)
                parent.workerOverlayTimeout = setTimeout(function () { parent.setState({ workerOverlay: true }) }, 100)
            }

            if (incomeChanged) {
                if (parent.incomeTimeout)
                    clearTimeout(parent.incomeTimeout)
                parent.incomeTimeout = setTimeout(function () {
                    parent.setState({
                        incomeGlow: false,
                    })
                }, 1000)
                parent.setState({ incomeGlow: true })

                parent.setState({ incomeOverlay: false })
                if (parent.incomeOverlayTimeout)
                    clearTimeout(parent.incomeOverlayTimeout)
                parent.incomeOverlayTimeout = setTimeout(function () { parent.setState({ incomeOverlay: true }) }, 100)
            }

            if (valueChanged) {
                if (parent.valueTimeout)
                    clearTimeout(parent.valueTimeout)
                parent.valueTimeout = setTimeout(function () { parent.setState({ valueGlow: false }) }, 1000)
                parent.setState({ valueGlow: true })
            }

            parent.setState({
                workers: workers,
                income: income,
                value: value,
            })
        }

        bindings.refreshResourceIncomeImage = function (image) {
            parent.setState({ incomeImage: image })
        }

        bindings.refreshResourceMythiumImage = function (image) {
            parent.setState({ mythiumImage: image })
        }

        bindings.refreshMythiumGatherRate = function (rate) {
            parent.setState({ mythiumGatherRate: rate })
        }
    },
    render: function () {
        if (globalState.isSpectatorMode) return null
        var parent = this

        return (
            React.createElement('div', {
                id: 'MinimapStats',
                //onMouseDown: function (e) {
                //    if (e.nativeEvent.which == 3) return
                //    engine.trigger('enableScoreboard', true)
                //}
            },
                React.createElement('div', {
                    className: 'centered-text',
                    style: {
                        height: '72px',
                        margin: '1px 0 0 0',
                    }
                },
                    React.createElement('ul', { className: 'centered-text-wrapper' },
                        React.createElement('li', {
                            className: 'simple-tooltip income',
                            style: { marginTop: '-3px' },
                            onMouseDown: function (e) {
                                if (e.nativeEvent.which == 3) {
                                    engine.call('OnPingIncome')
                                    return
                                }
                                engine.trigger('enableScoreboard', true)
                            }
                        },
                            React.createElement('img', {
                                className: 'income-image',
                                src: this.state.incomeImage,
                                style: {
                                    marginRight: '7px',
                                    height: '20px',
                                    top: '4px'
                                }
                            }),
                            React.createElement('div', { className: (this.state.incomeGlow ? 'gold-glow' : ''), style: { width: '60px', display: 'inline' } },
                                this.state.incomeGlow && React.createElement('img', { className: 'gif-overlay', src: parent.state.incomeOverlay ? 'hud/img/hudv2/animated_coins_once.gif' : '' }),
                                React.createElement('img', { className: 'resource-icon', src: 'hud/img/icons/Income.png' }),
                                this.state.income),
                            React.createElement('span', { className: 'tooltiptext' }, loc('mouseover_income', "After each wave is cleared, you receive gold equal to your income."))
                        ),
                        React.createElement('li', {
                            className: 'simple-tooltip workers',
                            style: { margin: '-2px 0 0 0' },
                            onMouseDown: function (e) {
                                if (e.nativeEvent.which == 3) {
                                    engine.call('OnPingWorkers')
                                    return
                                }
                                engine.trigger('enableScoreboard', true)
                            }
                        },
                            React.createElement('img', {
                                src: this.state.mythiumImage,
                                className: 'mythium-image',
                                style: {
                                    marginRight: '7px',
                                    height: '20px',
                                    top: '4px'
                                }
                            }),
                            React.createElement('div', { className: (this.state.workersGlow ? 'mythium-glow' : ''), style: { width: '60px', display: 'inline' } },
                                this.state.workersGlow && React.createElement('img', { className: 'gif-overlay', src: parent.state.workerOverlay ? 'hud/img/hudv2/animated_mythium_once.gif' : '' }),
                                React.createElement('img', { className: 'resource-icon', src: 'hud/img/icons/Worker.png' }),
                                this.state.workers),
                            React.createElement('span', { className: 'tooltiptext' }, 
                                loc('mouseover_workers', "Train workers to passively earn mythium."),
                                ' ',
                                loc('scoreboard_workers', "(+" + Math.round((parent.state.workers * parent.state.mythiumGatherRate) * 10) / 10 + " per " + parent.state.workerInterval + " sec)", [Math.round((parent.state.workers * parent.state.mythiumGatherRate) * 10) / 10, parent.state.workerInterval])
                            )
                        )
                    )
                )
            )
        )
    }
})

var MinimapLiveView = React.createClass({
    getInitialState: function () {
        return {
            flipped: false
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.flipMinimapFix = function (enabled) {
            parent.setState({ flipped: enabled })
        }
    },
    render: function () {
        console.log("Rendering MinimapView")
        return (
            React.createElement('img', {
                id: 'MinimapLiveView', src: 'liveview://minimapLiveView',
                className: this.state.flipped ? 'flipped' : ''
            })
        )
    }
})

var Minimap = React.createClass({
    getInitialState: function () {
        this.needForRaf = false
        this.anchorX = 0
        this.anchorY = 0
        this.width = 186, // 176,
        this.height = 128, // 128
        this.innerWidth = (186 - 24), // 156 // this doesn't really seem to do anything
        this.innerHeight = (128 - 16) // 108 // this doesn't really seem to do anything
        return {
            sizeX: 24, // 0,
            sizeY: 16, // 0,
            image: "2v2/minimap.png", //"minimap.png",
            scale: 1
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.startMinimapDrag = function () {
            parent.needForRaf = true
            window.addEventListener('mousemove', parent.drag, false);
            window.addEventListener('mouseup', parent.endDrag, false);
            window.addEventListener('mouseout', util.onMouseLeaveWindow(parent.endDrag), false);
        }
        bindings.setMinimapSize = function (x, y) {
            parent.innerWidth = parent.width - x
            parent.innerHeight = parent.height - y
            parent.setState({
                sizeX: x,
                sizeY: y
            })
        }
        bindings.setMinimapScale = function (scale) {
            // v2.11
            var width = 186
            var height = 128
            if (_.startsWith(parent.state.image, '2v2')) {
                width = 140
            }

            parent.width = scale * width
            parent.height = scale * height
            parent.innerWidth = scale * (width - 24)
            parent.innerHeight = scale * (height - 16)
            parent.setState({ scale: scale })
        }
        bindings.setMinimapImage = function (image) {
            parent.setState({ image: image })
            engine.trigger('setMinimapScale', parent.state.scale)
        }
    },
    endDrag: function () {
        window.removeEventListener('mousemove', this.drag, false);
        window.removeEventListener('mouseup', this.endDrag, false);
        window.removeEventListener('mouseout', util.onMouseLeaveWindow(parent.endDrag), false);
    },
    drag: function (e) {
        if (e.ctrlKey || e.shiftKey) {
            return
        }

        var parent = this
        if (parent.needForRaf) {
            parent.needForRaf = false
            requestAnimationFrame(function () {
                parent.needForRaf = true

                // x and y are percents
                x = Math.min(Math.max(0, e.pageX - parent.anchorX - parent.state.sizeX / 2), parent.width - parent.state.sizeX)
                y = Math.min(Math.max(0, e.pageY - parent.anchorY - parent.state.sizeY / 2), parent.height - parent.state.sizeY)
                engine.trigger('dragMinimap', x / parent.innerWidth, y / parent.innerHeight)
            })
        }
    },
    render: function () {
        var parent = this

        return (
            React.createElement('div', {
                onMouseDown: function (e) {
                    if (e.nativeEvent.ctrlKey || e.nativeEvent.shiftKey) {
                        return
                    }

                    if (e.nativeEvent.which == 1) {
                        parent.anchorX = e.nativeEvent.pageX - e.nativeEvent.offsetX
                        parent.anchorY = e.nativeEvent.pageY - e.nativeEvent.offsetY

                        // x and y are percents
                        x = Math.min(Math.max(0, e.pageX - parent.anchorX - parent.state.sizeX / 2), parent.width - parent.state.sizeX) / parent.innerWidth
                        y = Math.min(Math.max(0, e.pageY - parent.anchorY - parent.state.sizeY / 2), parent.height - parent.state.sizeY) / parent.innerHeight

                        if (globalState.isAltHeld) {
                            engine.call("OnMinimapPingStart", x, y)
                        } else {
                            console.log("drag minimap x: " + x + ", y: " + y)
                            engine.trigger('dragMinimap', x, y)
                            engine.trigger('startMinimapDrag')
                        }
                    }
                },
                style: {
                    //background: 'url(hud/img/hudv2/window_minimap.png) no-repeat',
                    opacity: '0.75',
                    height: this.height + 'px',
                    width: this.width + 'px',
                    position: 'absolute',
                    backgroundSize: 'contain',
                },
                draggable: true
            },
                React.createElement('div', {
                    id: 'MinimapContainer',
                    style: {
                        backgroundImage: 'url(hud/img/minimap/' + parent.state.image + ')',
                        height: (this.height - 0) + 'px', // 10
                        width: (this.width - 0) + 'px', // 20
                        pointerEvents: 'none',
                    },
                })
            )
        )
    }
})

var ImagePingChooser = React.createClass({
    iconWidth: 32,
    getInitialState: function () {
        return {
            image: "",
            enabled: false,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            mini: false,
            items: [],
            rotation: 0
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.enablePingChooser = function (enabled, x, y, mini) {
            //console.log("enablePingChooser: " + enabled)
            parent.setState({
                enabled: enabled,
                image: "smartping_blank.png",
                x: x,
                y: y,
                width: mini ? 64 : 256,
                height: mini ? 64 : 256,
                mini: mini,
            })
        }
        bindings.setPingChooserImage = function (image) {
            //console.log("setPingChooserImage: " + image)
            parent.setState({
                image: image,
            })
        }
        bindings.refreshPingWheelItems = function (items) {
            parent.setState({
                items: items
            })
        }
        bindings.setPingChooserHoverIndex = function (index) {
            parent.setState({
                // With 8 items
                // 0 --> 0
                // 1 --> 45
                // 2 --> 90
                // ...
                rotation: (index * 360 / parent.state.items.length)
            })

            engine.call("OnSetPingChooserHoverIndex", index)
        }
        bindings.mouseoverPingChooser = function (deltaX, deltaY) {
            var closestIndex = -1
            var minDist = 999999

            // Check middle first
            if (Math.abs(deltaX) <= 32 && Math.abs(deltaY) <= 32) {
                closestIndex = -1
            } else { // Wheel
                for (var index = 0; index < parent.state.items.length; index++) {
                    var dx = (deltaX - parent.state.width / 2 * parent.getDeltaCoordinates(index).x)
                    var dy = (deltaY - parent.state.height / 2 * parent.getDeltaCoordinates(index).y)
                    //var dist = dx * dx + dy * dy
                    var dist = Math.sqrt(dx * dx + dy * dy)
                    //console.log("dist to index " + index + " at " + deltaX + ", " + deltaY + " from "
                    //+ (parent.state.width / 2 * parent.getDeltaCoordinates(index).x) + ", "
                    //+ (parent.state.height / 2 * parent.getDeltaCoordinates(index).y) + " is: " + dist)
                    if (dist < minDist) {
                        minDist = dist
                        closestIndex = index
                    }
                }

                //console.log("given screenX: " + deltaX + ", screenY: " + deltaY + ", we should highlight index: " + closestIndex)
            }

            engine.trigger('setPingChooserHoverIndex', closestIndex)
            if (closestIndex == -1)
                engine.trigger('setPingChooserImage', 'smartping_0.png')
            else
                engine.trigger('setPingChooserImage', 'smartping_1.png')
        }
        bindings.activatePingChooserIndex = function (index) {
            if (index < 0 || index >= parent.state.items.length) {
                // console.log("bad ping index")
                return
            }

            //console.log('activate ping chooser index: ' + parent.state.items[index].payload)
            engine.call('OnActivatePingChooserPayload', parent.state.items[index].payload)
        }
    },
    getCoordinates: function (index) {
        var xy = { x: 0, y: 0 }
        var length = this.state.width / 2 - (this.iconWidth / 2)
        xy.x = (length + (length * 0.9) * this.getDeltaCoordinates(index).x).toFixed(4);
        xy.y = (length - (length * 0.9) * this.getDeltaCoordinates(index).y).toFixed(4);
        return xy
    },
    getDeltaCoordinates: function (index) {
        var xy = { x: 0, y: 0 }
        xy.x = Math.cos(-0.5 * Math.PI - 2 * (1 / this.state.items.length) * index * Math.PI).toFixed(4);
        xy.y = Math.sin(-0.5 * Math.PI - 2 * (1 / this.state.items.length) * index * Math.PI).toFixed(4);
        return xy
    },
    render: function () {
        var parent = this
        if (this.state.image == "") return null
        return (
            React.createElement('div', {
                id: "PingChooser",
                className: (this.state.enabled) ? '' : ' hidden',
                style: {
                    top: (this.state.y - this.state.height / 2) + 'px',
                    left: (this.state.x - this.state.width / 2) + 'px',
                },
            },
                React.createElement('img', {
                    src: 'hud/img/smartping/smartping_blank.png',
                    style: {
                        height: this.state.height + 'px',
                        width: this.state.width + 'px',
                    }
                }),
                React.createElement('img', {
                    src: 'hud/img/smartping/' + this.state.image,
                    style: {
                        height: this.state.height + 'px',
                        width: this.state.width + 'px',
                        transform: 'rotate(' + parent.state.rotation + 'deg)',
                        position: 'absolute',
                        left: '0',
                    },
                }),
                React.createElement('div', { className: 'pingwheel-items' },
                    this.state.items.map(function (item, index) {
                        var coords = parent.getCoordinates(index)
                        return React.createElement('div', { className: 'pingwheel-item-container' },
                            React.createElement('img', {
                                src: item.image,
                                className: 'pingwheel-item',
                                style: {
                                    height: parent.iconWidth + 'px',
                                    width: parent.iconWidth + 'px',
                                    left: coords.x + 'px',
                                    top: coords.y + 'px',
                                }
                            }),
                            _.startsWith(item.payload, 'send') && React.createElement('div', {
                                className: 'pingwheel-item-text',
                                style: {
                                    height: parent.iconWidth + 'px',
                                    width: parent.iconWidth + 'px',
                                    left: (parseInt(coords.x) + 35) + 'px',
                                    top: (parseInt(coords.y) + 15) + 'px',
                                }
                            }, item.payload.replace('send', ''))
                        )
                    })//,
                    //React.createElement('div', {
                    //    className: 'pingwheel-item',
                    //    style: {
                    //        position: 'absolute',
                    //        left: parent.getCoordinates(7).x + 'px',
                    //        top: '200px',
                    //        color: 'white',
                    //        fontFamily: 'Impact', // todo replace with global font
                    //        fontSize: '16px',
                    //        webkitTextStrokeWidth: '1px',
                    //        webkitTextStrokeColor: 'black',
                    //        textTransform: 'uppercase',
                    //    },
                    //},
                    //    loc('value', 'Value')
                    //)
                )
            )
        )
    }
})

var EmoteChooser = React.createClass({
    getInitialState: function () {
        return {
            enabled: false,
            active: false,
            x: 0,
            y: 0,
            height: 324, // SMELLY: HARDCODED
            width: 400,
            items: [],
            currentHoveredIndex: -1,
            showHint: globalState.emoteChooserShowHint
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.enableEmoteChooser = function (enabled, x, y, active) {
            parent.setState({
                enabled: enabled,
                x: x,
                y: y,
                active: active
            })
        }
        bindings.refreshEmoteChooserItems = function (items, showHint) {
            parent.setState({
                items: items,
                showHint: showHint
            })
        }
        bindings.activateEmoteChooserIndex = function (index) {
            if (index < 0 || index >= parent.state.items.length) {
                console.log("bad emote index")
                return
            }

            console.log('activate emote chooser index: ' + index)
            engine.call('OnActivateEmoteChooserIndex', index)

            parent.setState({
                enabled: false
            })
        }
    },
    render: function () {
        var parent = this
        if (this.state.image == "") return null

        var flipped = this.state.x > globalState.screenWidth / 2
        var flippedY = this.state.y < globalState.screenHeight / 2
        // Maybe more consistent idea... doesn't work though
        //var flipped = this.state.x + this.state.width > globalState.screenWidth
        //var flippedY = this.state.y + this.state.height > globalState.screenHeight

        return (
            React.createElement('div', {
                id: "EmoteChooser",
                className: (this.state.enabled) ? '' : ' hidden',
                style: {
                    bottom: !flippedY ? ((globalState.screenHeight - this.state.y - this.state.height / 2) + 'px') : '',
                    top: flippedY ? ((this.state.y - this.state.height / 2) + 'px') : '',
                    left: !flipped ? ((this.state.x - this.state.width / 2) + 'px') : '',
                    right: flipped ? ((globalState.screenWidth - this.state.x - this.state.width / 2) + 'px') : ''
                },
            },
                React.createElement('div', {
                    className: "hide-popup-backer fixed",
                    style: {
                        zIndex: '-1'
                    },
                    onMouseDown: function (event) {
                        bindings.enableEmoteChooser(false, 0, 0)
                    }
                }),
                React.createElement('div', {
                    className: 'items',
                    style:
                    {
                        pointerEvents: parent.state.active ? '' : 'none'
                    }
                },
                    this.state.items.map(function (item, index) {
                        if (!item.on) return

                        return React.createElement('div', { className: 'simple-tooltip emote-container' },
                            React.createElement('img', {
                                src: 'hud/img/' + item.image,
                                className: 'emote-item' + (item.enabled ? (parent.state.currentHoveredIndex == index ? ' hovered' : '') : ' disabled'),
                                onMouseUp: function (e) {
                                    if (!item.enabled) return
                                    if (!parent.state.active) return

                                    engine.trigger('activateEmoteChooserIndex', index)
                                },
                                onMouseEnter: function (e) {
                                    if (!item.enabled) return
                                    if (!parent.state.active) return

                                    parent.setState({ currentHoveredIndex: index })
                                    engine.call('OnRefreshEmoteChooserIndex', index)
                                },
                                onMouseLeave: function (e) {
                                    if (!item.enabled) return

                                    parent.setState({ currentHoveredIndex: -1 })
                                    engine.call('OnRefreshEmoteChooserIndex', -1)
                                }
                            }),
                            item.requiredItemDescription && React.createElement('span', { className: 'tooltiptext' },
                                loc('required', 'Required') + ': ' + locName(item.requiredItemDescription, '(item)')
                            )
                        )
                    }),
                    parent.state.showHint && React.createElement('div', {
                        className: 'emote-hint',
                        dangerouslySetInnerHTML: {
                            __html: loc('enable_emotes_hint', 'Customize your |desc(emotes) in |desc(options) |img(small-icons/right-arrow.png) |desc(social)')
                        }
                    })
                )
            )
        )
    }
})

var RecommendedValue = React.createClass({
    getInitialState: function () {
        return {
            waveNumber: 0,
            currentValue: 0,
            recommendedValue: 0,
            greenMin: 0,
            greenMax: 0,
            yellowMin: 0,
            yellowMax: 0,
            redMin: 0,
            redMax: 0,
            thresholdPercents: []
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshRecommendedValues = function (waveNumber, currentValue, recommendedValue, thresholds) {
            console.log('refreshRecommendedValues wave ' + waveNumber + ', currentValue: ' + currentValue
            + ', recommendedValue: ' + recommendedValue)

            var greenMin = thresholds.greenMin
            var greenMax = thresholds.greenMax
            var yellowMin = thresholds.yellowMin
            var yellowMax = thresholds.yellowMax
            var redMin = thresholds.redMin
            var redMax = thresholds.redMax

            parent.setState({
                waveNumber: waveNumber,
                currentValue: currentValue,
                showRecommendedValues: true,
                recommendedValue: recommendedValue,
                greenMin: greenMin,
                greenMax: greenMax,
                yellowMin: yellowMin,
                yellowMax: yellowMax,
                redMin: redMin,
                redMax: redMax,
                thresholdPercents: thresholds.thresholdPercents
            })
        }
    },
    render: function () {
        if (globalState.isSpectatorMode) return null

        var parent = this
        var recommendedValue = parent.state.recommendedValue
        var redMin = parent.state.redMin
        var redMax = parent.state.redMax
        var fillColor = '#ffffff'
        var tooltipText = ''

        if (parent.state.currentValue >= parent.state.greenMin && parent.state.currentValue <= parent.state.greenMax) {
            fillColor = '#8ff110'
            tooltipText = loc('near_recommended_value', 'Your value (' + parent.state.currentValue + ') is near the recommended value for this wave. Good job! If you have extra gold, consider <img class="tooltip-icon" src="hud/img/icons/Worker.png"> training workers to gather mythium.', [parent.state.currentValue])
        }
        else if (parent.state.currentValue >= parent.state.yellowMin && parent.state.currentValue <= parent.state.yellowMax) {
            fillColor = '#ffff33'
            if (parent.state.currentValue >= recommendedValue)
                tooltipText = loc('above_recommended_value', 'Your value (' + parent.state.currentValue + ') is above the recommended value for this wave. Consider <img class="tooltip-icon" src="hud/img/icons/Worker.png"> training workers to gather mythium.', [parent.state.currentValue])
            else
                tooltipText = loc('below_recommended_value', 'Your value (' + parent.state.currentValue + ') is below the recommended value for this wave. Consider deploying more fighters if you can.', [parent.state.currentValue])
        }
        else {
            fillColor = '#ff3333'
            if (parent.state.currentValue >= recommendedValue)
                tooltipText = loc('way_above_recommended_value', 'Your value (' + parent.state.currentValue + ') is well above the recommended value for this wave. You should <img class="tooltip-icon" src="hud/img/icons/Worker.png"> train workers to gather mythium.', [parent.state.currentValue])
            else
                tooltipText = loc('way_below_recommended_value', 'Your value (' + parent.state.currentValue + ') is well below the recommended value for this wave. There is a high chance you will leak unless you deploy more fighters.', [parent.state.currentValue])
        }

        var delta = parent.state.currentValue - recommendedValue
        //var deltaText = delta > 0 ? '+' + delta : delta
        var deltaText = Math.abs(delta)

        var recValuePercent = parent.state.recommendedValue > 0 ? parent.state.currentValue / parent.state.recommendedValue : 0
        var imageIndexThresholds = parent.state.thresholdPercents

        var imageIndex = 5
        var isRed = false
        var isYellow = false
        var isGreen = false

        //console.log('yellowMin: ' + parent.state.yellowMin)
        //console.log('yellowMax: ' + parent.state.yellowMax)
        //console.log('greenMin: ' + parent.state.greenMin)
        //console.log('greenMax: ' + parent.state.greenMax)

        if (parent.state.currentValue < parent.state.yellowMin || parent.state.currentValue > parent.state.yellowMax)
            isRed = true
        else if (parent.state.currentValue < parent.state.greenMin || parent.state.currentValue > parent.state.greenMax)
            isYellow = true
        else
            isGreen = true

        //console.log('isRed: ' + isRed)
        //console.log('isYellow: ' + isYellow)
        //console.log('isGreen: ' + isGreen)

        if (recValuePercent < imageIndexThresholds[0]) {
            imageIndex = 1
        }
        else if (recValuePercent >= imageIndexThresholds[0] && recValuePercent < imageIndexThresholds[1]) {
            imageIndex = 2
        }
        else if (recValuePercent >= imageIndexThresholds[1] && recValuePercent < imageIndexThresholds[2]) {
            imageIndex = 3
        }
        else if (recValuePercent >= imageIndexThresholds[2] && recValuePercent < imageIndexThresholds[3]) {
            imageIndex = 4
        }
        else if (recValuePercent >= imageIndexThresholds[3] && recValuePercent < imageIndexThresholds[4]) {
            imageIndex = 5
        }
        else if (recValuePercent >= imageIndexThresholds[4] && recValuePercent < imageIndexThresholds[5]) {
            imageIndex = 6
        }
        else if (recValuePercent >= imageIndexThresholds[5] && recValuePercent < imageIndexThresholds[6]) {
            imageIndex = 7
        }
        else if (recValuePercent >= imageIndexThresholds[6] && recValuePercent < imageIndexThresholds[7]) {
            imageIndex = 8
        }
        else if (recValuePercent >= imageIndexThresholds[7]) {
            imageIndex = 9
        }

        //console.log('recValuePercent: ' + recValuePercent + ', imageIndex: ' + imageIndex)

        var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160

        return React.createElement('div', { className: 'recommended-value-hitbox simple-tooltip' },
            React.createElement('div', {
                className: 'recommended-value-overlay text',
                onMouseDown: function (e) {
                    if (e.nativeEvent.which == 3) {
                        engine.call('OnPingValue')
                        return
                    }
                }
            },
                React.createElement('img', { className: 'resource-icon', src: uhd ? 'hud/img/icons/Value32.png' : 'hud/img/icons/Value.png', style: { marginBottom: '-2px' } }),
                React.createElement('span', { className: 'recommended-value-current-value' }, parent.state.currentValue),
                isRed && recValuePercent < 1 && React.createElement('span', { className: 'recommended-value-delta', style: { color: '#ff3333', fontSize: '0.75rem' } },
                    React.createElement('img', { src: 'hud/img/recvalue/red_down.png', style: { marginLeft: '2px' } }),
                    deltaText),
                isYellow && recValuePercent < 1 && React.createElement('span', { className: 'recommended-value-delta',  style: { color: '#ffff33', fontSize: '0.75rem' } },
                    React.createElement('img', { src: 'hud/img/recvalue/yellow_down.png', style: { marginLeft: '2px' } }),
                    deltaText),
                isGreen && delta != 0 && React.createElement('span', { style: { className: 'recommended-value-delta',  color: '#cccccc', fontSize: '0.75rem' } },
                    delta < 0 && React.createElement('img', { src: 'hud/img/recvalue/gray_down.png', style: { marginLeft: '2px' } }),
                    delta > 0 && React.createElement('img', { src: 'hud/img/recvalue/gray_up.png', style: { marginLeft: '2px' } }),
                    deltaText),
                isYellow && recValuePercent > 1 && React.createElement('span', { className: 'recommended-value-delta',  style: { color: '#ffff33', fontSize: '0.75rem' } },
                    React.createElement('img', { src: 'hud/img/recvalue/yellow_up.png', style: { marginLeft: '2px' } }),
                    deltaText),
                isRed && recValuePercent > 1 && React.createElement('span', { className: 'recommended-value-delta', style: { color: '#ff3333', fontSize: '0.75rem' } },
                    React.createElement('img', { src: 'hud/img/recvalue/red_up.png', style: { marginLeft: '2px' } }),
                    deltaText)
            ),
            React.createElement('div', {
                className: 'recommended-value fill', style: {
                    //backgroundImage: 'url(hud/img/recvalue/rec-value-v2_' + imageIndex + '.png)',
                    // For some reason preload code doesn't want to work for above, so we do spritesheet approach
                    backgroundImage: 'url(hud/img/recvalue/rec-value-v2_sheet.png)',
                    backgroundPosition: '0px ' + ((imageIndex - 1) * -36) + 'px',
                    backgroundSize: 'initial',
                    backgroundRepeat: 'no-repeat',
                }
            }),

            React.createElement('span', {
                className: 'tooltiptext extra-wide',
                style: { marginBottom: '10px' },
                dangerouslySetInnerHTML: {
                    __html: loc('recommended_value_this_wave', '<span style="color: #ffcc00">Recommended Value: ' + recommendedValue + '</span>', [recommendedValue]) + '<br />' + tooltipText
                }
            })
        )
    }
})