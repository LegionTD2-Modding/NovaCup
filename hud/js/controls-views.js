// Draggable HUD modules in-game
// ===============================================================================

// v8.04 janky way to get certain code to run on first init
var moduleSavedScreenWidth = {}
var Module = React.createClass({
    savedTop: -1,
    savedLeft: -1,
    forceNoDragging: false,
    propTypes: {
        moduleId: React.PropTypes.string.isRequired,
        height: React.PropTypes.number,
        width: React.PropTypes.number.isRequired,
/*        defaultTop: React.PropTypes.string.isRequired,
        defaultRight: React.PropTypes.string.isRequired,
        defaultBottom: React.PropTypes.string.isRequired,
        defaultLeft: React.PropTypes.string,*/
        defaultTop4k: React.PropTypes.string,
        defaultRight4k: React.PropTypes.string,
        defaultBottom4k: React.PropTypes.string,
        defaultLeft4k: React.PropTypes.string,
        zIndex: React.PropTypes.number,
        simple: React.PropTypes.bool, // Simple means left click will move it
        unclickable: React.PropTypes.bool,
        rtl: React.PropTypes.bool,
    },
    getInitialState: function () {
        this.needForRaf = false
        this.offsetX = 0
        this.offsetY = 0
        return {
            customStyle: 'init',
            draggingEnabled: false,
        }
    },
    getScale: function () {
        var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160
        // it is pretty big given how Amaz uses UI Scale to make his UI pretty dang big:
        // https://i.imgur.com/Ofbzt2H.jpg

        // weird override since ready button looks like shit otherwise
        // https://i.imgur.com/JNNkeVq.jpg
        if (uhd && this.props.moduleId == 'ReadyButton')
            return 'scale(1)'
        // same for subannouncement & others
        if (uhd && this.props.moduleId == 'SubAnnouncement')
            return 'scale(1)'
        if (uhd && this.props.moduleId == 'miniscoreboard')
            return 'scale(1.5)'
        if (uhd && this.props.moduleId == 'console')
            return 'scale(1)'

        return uhd ? 'scale(1.75)' : 'scale(1)'
    },
    componentWillMount: function () {
        var parent = this

        if (this.props.moduleId == "spectator"
            || this.props.moduleId == "objectives"
            || this.props.moduleId == "ReadyButton") {
            this.forceNoDragging = true
        }

        bindings.setModulePosition[this.props.moduleId] = function (left, top) {
            if (parent.props.width)
                left = Math.max(Math.min(left, window.innerWidth - parent.props.width), 0)
            else
                left = 0

            if (parent.props.height)
                top = Math.max(Math.min(top, window.innerHeight - parent.props.height), 0)
            else
                top = 0

            // v3.15 comment for future: we should either use left OR right, otherwise it's just incorrect to always assume use left
            // v3.15 comment for future:we should either use top OR bottom, otherwise it's just incorrect to always assume use top

            console.log("setModulePosition " + parent.props.moduleId + ", left: " + left + ", top: " + top)
            //console.log("width: " + parent.props.width + ", height: " + parent.props.height)
            //console.log("window.innerWidth: " + window.innerWidth + ", window.innerHeight: " + window.innerHeight)

            parent.savedLeft = left
            parent.savedTop = top

            parent.setState({
                customStyle: {
                    position: 'fixed',
                    top: top + 'px',
                    right: 'unset', /* currently assumes we always use top/left, so this is unsupported */
                    bottom: 'unset', /* currently assumes we always use top/left, so this is unsupported */
                    left: left + 'px',
                    width: parent.props.width ? (parent.props.width + 'px') : 'unset',
                    height: parent.props.height ? (parent.props.height + 'px') : 'unset',
                    pointerEvents: parent.props.unclickable ? 'none' : 'all',
                    direction: parent.props.rtl ? 'rtl' : 'ltr',
                    zIndex: parent.props.zIndex,
                }
            })

            // tell prefs
            engine.call('OnSetModulePosition', parent.props.moduleId, left, top)
        }
        bindings.resetModulePosition[this.props.moduleId] = function () {
            var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160

            // v8.03.11 call render if we haven't yet so we update our props
            if (parent.refs.module == null) {
                parent.forceUpdate()
            }

            var defaultTop = (uhd && parent.props.defaultTop4k) ? parent.props.defaultTop4k : parent.props.defaultTop
            var defaultLeft = (uhd && parent.props.defaultLeft4k) ? parent.props.defaultLeft4k : parent.props.defaultLeft
            var defaultRight = (uhd && parent.props.defaultRight4k) ? parent.props.defaultRight4k : parent.props.defaultRight
            var defaultBottom = (uhd && parent.props.defaultBottom4k) ? parent.props.defaultBottom4k : parent.props.defaultBottom

            // v8.04 to fix the bug where if you reset UI positions, then toggle off/on, it would snap back to the old saved positions
            console.log('resetModulePosition ' + parent.props.moduleId)
            globalState.modulePositionDefaults[parent.props.moduleId + "_top"] = -1
            globalState.modulePositionDefaults[parent.props.moduleId + "_left"] = -1

            parent.setState({
                customStyle: {
                    position: 'absolute',
                    bottom: defaultBottom,
                    right: defaultRight,
                    top: defaultTop,
                    left: defaultLeft ? defaultLeft : 'unset',
                    width: parent.props.width ? (parent.props.width + 'px') : 'unset',
                    height: parent.props.height ? (parent.props.height + 'px') : 'unset',
                    pointerEvents: parent.props.unclickable ? 'none' : 'all',
                    direction: parent.props.rtl ? 'rtl' : 'ltr',
                    zIndex: parent.props.zIndex,
                    transform: parent.getScale()
                }
            })

            // tell prefs
            console.log(parent.props.moduleId + ' reset to defaultLeft ' + defaultLeft
                + ' and defaultTop ' + defaultTop
                + ' and defaultRight ' + defaultRight
                + ' and defaultBottom ' + defaultBottom)
            engine.call('OnResetModulePosition', parent.props.moduleId)
        }
        bindings.startModuleDrag[this.props.moduleId] = function () {
            // Temporarily disable dragging on some elements that don't support it for whatever reason
            if (parent.forceNoDragging) {
                return
            }

            parent.needForRaf = true
            window.addEventListener('mousemove', parent.drag, false);
            window.addEventListener('mouseup', parent.endDrag, false);
            window.addEventListener('mouseout', util.onMouseLeaveWindow(parent.endDrag), false);
        }
        bindings.enableModuleDragging[this.props.moduleId] = function (enabled) {

            // Skip if hidden??? Would be nice but this doesn't seem to work :(
            //console.log("module " + parent.props.moduleId)
            //if (parent.refs.module == null) return
            //console.log("--> parentElement: " + parent.refs.module.offsetParent)
            //if (parent.refs.module.offsetParent == null) return
            //console.log("--> dragging for " + parent.props.moduleId + " set to: " + enabled)

            if (parent.forceNoDragging) return

            parent.setState({
                draggingEnabled: enabled
            })
        }

        // v3.15b: ah this doesn't seem to work with certain things... it should work in theory if reset to default UI works :/
        // temp: for now, just reset module every time we rendered it
        //bindings.resetModulePosition[parent.props.moduleId]()

        // Restore module positions from Client.ini
        // todo: we should fix this someday
        parent.savedTop = globalState.modulePositionDefaults[parent.props.moduleId + "_top"] != null ? globalState.modulePositionDefaults[parent.props.moduleId + "_top"] : -1
        parent.savedLeft = globalState.modulePositionDefaults[parent.props.moduleId + "_left"] != null ? globalState.modulePositionDefaults[parent.props.moduleId + "_left"] : -1

        // v4.02d hotfix: rerollWindow gets kinda messed up when you save/load its position for some reason (smelly)
        // so we just force it to not load for now
        // v8.04 note I think this is the same bug, super weird, it loses its style..
        // v8.05 our earlier fixes finally fixed this, I think?
        //if (parent.props.moduleId == 'rerollWindow') {
        //    console.log('rerollWindow override')
        //    parent.savedTop = -1
        //    parent.savedLeft = -1
        //}

        // todo: reset module position only if we don't have anything saved (otherwise keep saved position)
        if (parent.savedTop == -1 && parent.savedLeft == -1) {
            console.log("Module " + parent.props.moduleId + " didn't have savedTop/savedLeft so reset to default position")
            bindings.resetModulePosition[parent.props.moduleId]()
        }
        else {
            console.log("Module " + parent.props.moduleId + " had savedTop " + parent.savedTop + " and savedLeft " + parent.savedLeft + " so use that")
        }

        // Sanity checks
        //if (this.props.defaultLeft == 'unset') console.warn('WARNING: unset property is not supported by Coherent when resetting module position defaultLeft')
        //if (this.props.defaultTop == 'unset') console.warn('WARNING: unset property is not supported by Coherent when resetting module position defaultTop')
        // should we be checking if defaultBottom and defaultRight are unset or...?
        // or maybe it's okay as long as either defaultLeft or defaultRight is set? (same for top/bottom)? not sure
    },
    endDrag: function () {
        window.removeEventListener('mousemove', this.drag, false);
        window.removeEventListener('mouseup', this.endDrag, false);
        window.removeEventListener('mouseout', util.onMouseLeaveWindow(parent.endDrag), false);
    },
    drag: function (e) {

        xxxx = e

        var parent = this
        if (parent.needForRaf) {
            parent.needForRaf = false
            requestAnimationFrame(function () {
                parent.needForRaf = true
                engine.trigger('setModulePosition', parent.props.moduleId, e.pageX - parent.offsetX, e.pageY - parent.offsetY)
            })
        }
    },
    render: function () {
        var parent = this

        var customStyle = parent.state.customStyle

        // v8.04 fix for simple windows to save their position
        if (customStyle == 'init') {
            console.log('init test')
            engine.trigger('setModulePosition', parent.props.moduleId, parent.savedLeft, parent.savedTop)

            // Janky 4K Fix, needs to render once more to force the scale after the first pass
            setTimeout(function () {
                parent.forceUpdate()
            }, 1)
            return null
        }

        if (this.props.unclickable) {
            customStyle['pointerEvents'] = 'none'
        } else {
            customStyle['pointerEvents'] = 'all'
        }

        var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160

        if (this.refs.module != null) {
            // v8.03.10/11
            // Sooo smelly, but I'm not sure how else to do it, since we can't do it where the Modules are created since they only get created once
            switch (parent.props.moduleId) {
                case 'dashboard':
                    parent.props.defaultLeft4k = '-84px'
                    break
                case 'resources':
                    parent.props.defaultLeft4k = '804px'
                    parent.props.defaultTop4k = '-121px'
                    break
                case 'powerups':
                    parent.props.defaultLeft4k = '804px'
                    parent.props.defaultTop4k = '-324px'
                    break
                case 'rerollWindow':
                    parent.props.defaultBottom4k = '600px'
                    break
                case 'windshield':
                    parent.props.defaultLeft4k = '-34px'
                    parent.props.defaultTop4k = '-391px'
                    break
                case 'leftbox':
                    parent.props.defaultLeft4k = '-498px'
                    parent.props.defaultTop4k = '-222px'
                    break
                case 'masthead':
                    parent.props.defaultTop4k = '32px'
                    break
                case 'minimap':
                    parent.props.defaultTop4k = '48px'
                    parent.props.defaultRight4k = '48px'
                    break
                case 'feed':
                    parent.props.defaultLeft4k = '124px'
                    break
                case 'matchModifiers':
                    parent.props.defaultLeft4k = '-340px'
                    break
                case 'menubuttons':
                    parent.props.defaultTop4k = '-265px'
                    break
                case 'miniscoreboard':
                    parent.props.defaultLeft4k = '18px'
                    parent.props.defaultBottom4k = '-22px'
                    break
                case 'guideAttackTypes':
                    //parent.props.defaultRight4k = '100px'
                    //parent.props.defaultTop4k = '-525px'
                    break
                case 'guideWaves':
                    //parent.props.defaultRight4k = '142px'
                    break
                case 'console':
                    parent.props.defaultLeft4k = '0px'
                    parent.props.defaultTop4k = '-550px'
                    break
                case 'SubAnnouncement':
                    parent.props.defaultTop4k = '200px'
                    break
                case 'Announcement':
                    parent.props.defaultTop4k = '225px'
                    break
                case 'stackrank':
                    parent.props.defaultLeft4k = '-425px'
                    break
                case 'targetFrame':
                    parent.props.defaultLeft4k = '130px'
                    parent.props.defaultTop4k = '30px'
                    break
            }

            // v8.04 weird code for 4K to properly work
            // logic is really tricky/janky. Be careful to not overly resetModulePosition here, or else windows won't load properly from disk
            if (moduleSavedScreenWidth[this.props.moduleId] != globalState.screenWidth) {
                console.log('screen resolution for ' + this.props.moduleId + ' changed from ' + moduleSavedScreenWidth[this.props.moduleId] + ' to ' + globalState.screenWidth + ' --> reset module positions')
                moduleSavedScreenWidth[this.props.moduleId] = globalState.screenWidth

                if (parent.savedTop == -1 && parent.savedLeft == -1) {
                    console.log('savedTop and savedLeft were -1 so reset module position')
                    bindings.resetModulePosition[this.props.moduleId]()
                }
            }

            // v8.03.11 fix to force refresh the module style
            this.refs.module.style['transform'] = this.getScale()
        }

        //console.log('TEST: v8.04 Rerendering module ' + this.props.moduleId + ', uhd: ' + uhd + ', globalState.screenWidth: ' + globalState.screenWidth + ', customStyle: ' + JSON.stringify(parent.state.customStyle))

        return (
            React.createElement('div', {
                className: 'Module ' + this.props.moduleId + (!this.props.unclickable && parent.state.draggingEnabled ? ' draggable-border' : ''),
                style: customStyle,
                ref: 'module',
                onMouseDown: function (e) {
                    if (e.nativeEvent.ctrlKey && e.nativeEvent.shiftKey || parent.props.simple) {
                        parent.offsetX = e.nativeEvent.offsetX
                        parent.offsetY = e.nativeEvent.offsetY

                        yyyy = parent.refs.module
                        xxxx = e.nativeEvent

                        // v1.56: only allow dragging on outer window so that the position is more reliable/less glitchy
                        if (e.nativeEvent.target.parentElement === parent.refs.module
                            || e.nativeEvent.target == parent.refs.module) {
                            engine.trigger('startModuleDrag', parent.props.moduleId)
                        } else {
                            //console.log("e.nativeEvent.target.parentElement = " + e.nativeEvent.target.parentElement)
                            //console.log("parent.props.moduleId = " + parent.props.moduleId)
                        }
                    }
                },
                draggable: true
            },
                this.props.children
            )
        )
    }
})

var Tooltip = React.createClass({
    propTypes: {
        enabled: React.PropTypes.bool,
        actionId: React.PropTypes.number,
        header: React.PropTypes.string.isRequired,
        subheader: React.PropTypes.string,
        text: React.PropTypes.string,
        image: React.PropTypes.string,
        valign: React.PropTypes.string,
        align: React.PropTypes.string,
        flex: React.PropTypes.bool,
        grayedOut: React.PropTypes.bool,
        recommendation: React.PropTypes.string,
        extraClasses: React.PropTypes.string,
    },
    getInitialState: function () {
        return {
            enabledViaActionBinding: false
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.enableActionTooltip[this.props.actionId] = function (value) {
            parent.setState({ enabledViaActionBinding: value })
        }
    },
    getTooltipContent: function () {
        var parent = this
        return (
            React.createElement('div', { className: 'content' },
                parent.props.recommendation && React.createElement('div', { className: 'recommendation', dangerouslySetInnerHTML: { __html: parent.props.recommendation } }),
                React.createElement('div', { className: 'header', dangerouslySetInnerHTML: { __html: this.props.header } }),
                React.createElement('div', { className: 'subheader', dangerouslySetInnerHTML: { __html: this.props.subheader } }),
                React.createElement('div', { className: 'text', dangerouslySetInnerHTML: { __html: this.props.text } })
            )
        )
    },
    getTooltipLayout: function () {
        if (this.props.image) {
            return (
                React.createElement('div', {
                    className: 'tooltip-with-image'
                },
                    React.createElement('div', {
                        className: 'game-icon',
                    },
                        React.createElement('img', { src: 'hud/img/' + this.props.image })
                    ),
                    this.getTooltipContent()
                )
            )
        } else {
            return this.getTooltipContent()
        }
    },
    render: function () {
        var flipped = (this.props.valign == 'below')

        var deltaY = 20
        var customClasses = 'above'

        // Vertical animation
        if (flipped) {
            customClasses = 'below'
            deltaY = -20
        }

        // Horizontal alignment
        if (this.props.align == 'left')
            customClasses += ' left'
        else if (this.props.align == 'right')
            customClasses += ' right'
        else if (this.props.align == 'center')
            customClasses += ' center'

        // Custom classes that change the overall look & feel
        if (this.props.flex)
            customClasses += ' flex'
        if (this.props.grayedOut)
            customClasses += ' grayed-out'

        if (this.props.extraClasses)
            customClasses += ' ' + this.props.extraClasses

        return (
            React.createElement(
                VelocityComponent,
                GetAnimationPreset1(this.state.enabledViaActionBinding || this.props.enabled, 0, deltaY),
                React.createElement('div', { className: 'tooltip ' + customClasses },
                    this.getTooltipLayout()
                    //// v6.00 fix to force the layout to refresh (otherwise React doesn't realize there were changes)
                    //React.createElement('span', { style: { }}, this.props.text)
                )
            )
        )
    }
})

// For restocking. This is a timer that counts *down*
var ActionCountdown = React.createClass({
    disabledOverride: true, // v6.00 optimization, just basically disabling this component since it isn't needed
    propTypes: {
        actionId: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        show: React.PropTypes.bool.isRequired,
    },
    getInitialState: function () {
        return {
            duration: 0,
            startTime: 0,
            stock: 0,
            enabled: false
        }
    },
    updateTimer: function () {
        if (this.refs.canvas)
            this.runCooldown()
    },
    componentWillMount: function () {
        var parent = this
        bindings.startActionCountdown[this.props.actionId] = function (initialProgress, totalSeconds) {
            parent.setState({
                duration: totalSeconds * 1000,
                startTime: new Date().getTime() - totalSeconds * 1000 * initialProgress,
                enabled: true
            })
            parent.updateTimer()
        }
        bindings.refreshActionStock[this.props.actionId] = function (value) {
            if (value == -1) // special case to disable the stock
                parent.setState({ stock: 0, enabled: false })
            else
                parent.setState({ stock: value, enabled: true })
            parent.updateTimer()
        }

        // v6.00 optimization: I don't think we need action countdowns anymore basically
        if (!parent.disabledOverride)
            renderEvents.define("timer" + parent.props.actionId, this.updateTimer)
    },
    componentDidUpdate: function () {
        if (this.disabledOverride) return

        this.updateTimer()
    },
    render: function () {
        if (!this.state.enabled) return null
        return (
            React.createElement('div', { className: 'ActionOverlay' },
                React.createElement('canvas', {
                    ref: 'canvas',
                    height: this.props.height,
                    width: this.props.height
                })//,
                // v4.00 no longer showing this in UI to keep UI clean
                //React.createElement('div', { className: 'background', style: { border: '1px solid gold' } }),
                //React.createElement('div', { className: 'value' }, this.state.stock)
            )
        )
    },
    runCooldown: function () {
        var now = new Date().getTime()
        var timeElapsed = now - this.state.startTime

        //console.log("runCooldown actionCountdown " + this.props.actionId + " enabled: " + this.state.enabled + ", show: " + this.props.show
        //+ ", duration: " + this.state.duration)

        var canvas = this.refs.canvas
        if (!canvas) return
        var ctx = canvas.getContext('2d')

        // Sanity checks
        if (canvas.width > 4000 || canvas.height > 4000 || this.props.height > 4000) {
            console.log("Dimensions exceeded 4000, width: " + canvas.width + ", height: " + canvas.height + ", this.props.height: " + this.props.height)
            return
        }

        // Reset canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // v1.34b fix - we want the canvas to wipe every update
        if (!this.state.enabled) return
        //if (!this.props.show) return // v6.00 seems like we don't wanna bail too early here...?

        //console.log('timeElapsed: ' + timeElapsed)
        //console.log('this.state.duration: ' + this.state.duration)
        if (timeElapsed < this.state.duration) {
            var timeElapsedPercentage = (this.state.duration == 0) ? 0 : timeElapsed / this.state.duration
            //console.log('timeElapsed <= this.state.duration')
            //console.log('timeElapsedPercentage = ' + timeElapsedPercentage)

            // v4.00 Special case: if we are trying to communicate it is an "infinitely long" stock timer, then just draw a gray box
            // or don't draw anything... pretty smelly but it works
            if (this.state.duration >= 9999) {
                if (this.state.stock == 0) {
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.66)'
                    ctx.fillRect(0, 0, 64, 64);
                }
                return
            }

            var degrees = 360 * timeElapsedPercentage
            var radians = (degrees * Math.PI / 180).toFixed(2)
            var hypoteneuse = Math.sqrt(Math.pow(canvas.width, 2) + Math.pow(canvas.height, 2))
            var r = hypoteneuse / 2

            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            ctx.translate(canvas.width / 2 + 0.5, canvas.height / 2) // offset by 0.5 to smoothen a bit
            ctx.rotate(-Math.PI / 2)

            ctx.beginPath()

            // set style for A and B
            ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
            ctx.lineWidth = 2

            // A: draw line from (0,0) to (r,0)
            ctx.moveTo(0, 0)
            ctx.lineTo(r, 0)
            ctx.stroke()

            // B: draw line from (0,0) to current point
            ctx.moveTo(0, 0)
            ctx.lineTo(r * Math.cos(radians), r * Math.sin(radians))
            ctx.stroke()

            // C: arc from current point to end, and fill it in
            ctx.arc(0, 0, r, radians, Math.PI * 2, false)
            ctx.fill()

            ctx.closePath()
        }
    }
})

// For training/research. This is a timer that counts *up*
var ActionProgress = React.createClass({
    propTypes: {
        actionId: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        show: React.PropTypes.bool.isRequired,
    },
    getInitialState: function () {
        return {
            duration: 0,
            startTime: 0,
            queued: 0,
            enabled: false
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.startActionProgress[this.props.actionId] = function (initialProgress, totalSeconds) {
            parent.setState({
                duration: totalSeconds * 1000,
                startTime: new Date().getTime() - totalSeconds * 1000 * initialProgress,
                enabled: true
            })
            parent.forceUpdate()
        }
        bindings.refreshActionQueue[this.props.actionId] = function (value) {
            parent.setState({
                queued: value,
                enabled: value > 0
            })
            parent.forceUpdate()
        }
    },
    componentDidUpdate: function () {
        if (this.refs.canvas)
            this.runCooldown()
    },
    render: function () {
        if (!this.state.enabled) return null
        return (
            React.createElement('div', { className: 'ActionOverlay' },
                React.createElement('canvas', {
                    ref: 'canvas',
                    height: this.props.height,
                    width: this.props.height
                }),
                React.createElement('div', { className: (this.state.queued > 0 ? '' : 'hidden ') },
                    React.createElement('div', { className: 'background' }),
                    React.createElement('div', { className: 'value' }, this.state.queued)
                )
            )
        )
    },
    runCooldown: function () {
        var now = new Date().getTime()
        var timeElapsed = now - this.state.startTime

        //console.log("runCooldown actionProgress enabled: " + this.state.enabled + ", show: " + this.props.show)

        var canvas = this.refs.canvas
        if (!canvas) return
        var ctx = canvas.getContext('2d')

        // Sanity checks
        if (canvas.width > 4000 || canvas.height > 4000 || this.props.height > 4000) {
            console.log("Dimensions exceeded 4000, width: " + canvas.width + ", height: " + canvas.height + ", this.props.height: " + this.props.height)
            return
        }

        // Reset canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // v1.34b fix - we want the canvas to wipe every update
        if (!this.state.enabled) return
        if (!this.props.show) return

        if (timeElapsed < this.state.duration) {
            var timeElapsedPercentage = (this.state.duration == 0) ? 0 : timeElapsed / this.state.duration

            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            ctx.fillRect(timeElapsedPercentage * this.props.height,
                0,
                this.props.height - timeElapsedPercentage * this.props.height,
                this.props.height);

            requestAnimationFrame(this.runCooldown)
        }
    }
})

// For queueing up actions
var ActionQueue = React.createClass({
    propTypes: {
        actionId: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        show: React.PropTypes.bool.isRequired,
    },
    getInitialState: function () {
        return {
            duration: 0,
            startTime: 0,
            count: 0,
            enabled: false
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshActionPurchasingQueue[this.props.actionId] = function (value) {
            if (value == -1) // special case to disable the stock
                parent.setState({ count: 0, enabled: false })
            else
                parent.setState({ count: value, enabled: true })
            parent.forceUpdate()
        }
    },
    render: function () {
        if (!this.state.enabled) return null
        if (this.state.count == 0) return null
        return (
            React.createElement('div', { className: 'ActionQueue' },
                React.createElement('div', { className: 'background' }),
                React.createElement('div', { className: 'value' }, '+' + this.state.count)
            )
        )
    }
})

var Home = React.createClass({
    displayName: 'Home',
    props: {
        theme: React.PropTypes.string,
    },
    getInitialState: function () {
        return {
            enabled: false,
            arrowText: '',
            buttonText: '',
        }
    },
    componentWillMount: function () {
        var parent = this;
        bindings.enableHome = function (enabled) { parent.setState({ enabled: enabled }) }
        bindings.renderTutorialArrowText['home'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, buttonText: buttonText })
        }
    },
    render: function () {
        if (globalState.isSpectatorMode) return null
        return (
            React.createElement('div', {
                id: 'DashboardDefense',
                onMouseDown: function (e) {
                    console.log('home clicked')
                    engine.trigger("clickHome")
                }
            },
                React.createElement('div', {
                    className: 'graphic ' + ((this.state.enabled) ? '' : 'inactive') + ' ' + this.props.theme + ' simple-tooltip', style: {
                        width: '100%',
                        height: '100%',
                        //onMouseDown: function (e) { // no idea why this doesn't work
                        //    console.log('home clicked')
                        //    engine.trigger("clickHome")
                        //}
                    }
                },
                    React.createElement('span', {
                        className: 'tooltiptext',
                        style: {
                            zIndex: '2',
                        }
                    },
                        React.createElement('span', {
                            dangerouslySetInnerHTML: {
                                __html: loc('return_home_long', "Click here to return home (Hotkey: <span style='color: #ffcc00'>SPACE</span>)")
                            }
                        })
                    )
                ),
                this.state.arrowText && React.createElement('div', {
                    className: 'arrow-text',
                    style: {
                        bottom: '140px',
                        width: '300px',
                        left: '-40px',
                        pointerEvents: 'none',
                    }
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
                        className: 'arrow-image down',
                        style: {
                            left: '132px',
                            bottom: '-128px',
                        }
                    })
                )
            )
        )
    }
})

var Screen = React.createClass({
    displayName: 'Screen',
    propTypes: {
        theme: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            gold: 0,
            mythium: 0,
            supply: 0,
            supplyCap: 0,
            goldNextWave: 0,
            goldRemaining: 0,
            goldRushGold: 0,
            income: 0,
            goldGlow: false,
            mythiumGlow: false,
            supplyGlow: false,
            goldArrowText: '',
            mythiumArrowText: '',
            goldButtonText: '',
            mythiumButtonText: '',
            supplyArrowText: '',
            supplyButtonText: '',
            //recValueText: '',
            //recValueButtonText: '',
            goldArrowLeft: 0,
            goldArrowBottom: 0,
            goldArrowWidth: 0,
            estimatedTotalMythium: 0,
        }
    },
    goldGlowTimeout: null,
    mythiumGlowTimeout: null,
    supplyGlowTimeout: null,
    componentWillMount: function () {
        var parent = this;
        bindings.refreshGold = function (value) {
            if (parent.goldGlowTimeout)
                clearTimeout(parent.goldGlowTimeout)
            parent.goldGlowTimeout = setTimeout(function () { parent.setState({ goldGlow: false }) }, 500)
            parent.setState({ gold: value, goldGlow: true })
        }
        bindings.refreshMythium = function (value) {
            var spent = value < parent.state.mythium
            if (spent) {
                if (parent.mythiumGlowTimeout)
                    clearTimeout(parent.mythiumGlowTimeout)
                parent.mythiumGlowTimeout = setTimeout(function () { parent.setState({ mythiumGlow: false }) }, 500)
            }
            parent.setState({ mythium: value, mythiumGlow: spent })
        }
        bindings.refreshSupply = function (value) {
            if (parent.supplyGlowTimeout)
                clearTimeout(parent.supplyGlowTimeout)
            parent.supplyGlowTimeout = setTimeout(function () { parent.setState({ supplyGlow: false }) }, 500)
            parent.setState({ supply: value, supplyGlow: true })
        }
        bindings.refreshSupplyCap = function (value) {
            if (parent.supplyGlowTimeout)
                clearTimeout(parent.supplyGlowTimeout)
            parent.supplyGlowTimeout = setTimeout(function () { parent.setState({ supplyGlow: false }) }, 500)
            parent.setState({ supplyCap: value, supplyGlow: true })
        }
        bindings.renderTutorialArrowText['gold'] = function (props, buttonText) {
            parent.setState({
                goldArrowText: props.message, goldButtonText: buttonText,
                goldArrowLeft: -50,
                goldArrowBottom: 210,
                goldArrowWidth: 300,
            })
        }
        bindings.renderTutorialArrowText['mythium'] = function (props, buttonText) {
            parent.setState({ mythiumArrowText: props.message, mythiumButtonText: buttonText })
        }
        bindings.renderTutorialArrowText['supply'] = function (props, buttonText) {
            parent.setState({ supplyArrowText: props.message, supplyButtonText: buttonText })
        }
        bindings.renderTutorialArrowText['recvalue'] = function (props, buttonText) {
            parent.setState({
                goldArrowText: props.message,
                goldButtonText: buttonText,
                goldArrowLeft: 0,
                goldArrowBottom: 160,
                goldArrowWidth: 400,
            })
        }
        bindings.refreshGoldRemaining = function (goldNextWave, goldRemaining, income, goldRushGold) {
            // Smelly: magic value to keep old values
            if (goldNextWave == -1)
                goldNextWave = parent.state.goldNextWave
            if (goldRemaining == -1)
                goldRemaining = parent.state.goldRemaining
            if (goldRushGold == -1)
                goldRushGold = parent.state.goldRushGold

            parent.setState({ goldNextWave: goldNextWave, goldRemaining: goldRemaining, income: income, goldRushGold: goldRushGold })
        }
        bindings.refreshEstimatedMythium = function (estimatedTotalMythium) {
            parent.setState({ estimatedTotalMythium: estimatedTotalMythium })
        }
    },
    render: function () {
        var parent = this

        var supplyColor = ""
        if (this.state.supply >= this.state.supplyCap)
            supplyColor = "#ff3333"
        else if (this.state.supply >= (Number(this.state.supplyCap) * (13 / 15)))
            supplyColor = "#ffff33"

        if (globalState.isSpectatorMode) return null

        var totalRewardNextWave = this.state.goldRemaining + + this.state.goldNextWave + this.state.income + this.state.goldRushGold
        var estimatedTotalGold = this.state.gold + totalRewardNextWave

        return (
            React.createElement('div', {
                id: 'ResourcesWindow',
                className: 'panel' + ((this.props.theme != "") ? ' ' + this.props.theme : '')
            },
                React.createElement('div', {
                    className: 'centered-text',
                    style: {
                        height: '72px',
                        width: '86px',
                        margin: '1px 10px',
                    }
                },
                    React.createElement('div', { className: 'centered-text-wrapper' },
                        this.state.goldArrowText && React.createElement('div', {
                            className: 'arrow-text',
                            style: {
                                bottom: parent.state.goldArrowBottom + 'px',
                                width: parent.state.goldArrowWidth + 'px',
                                left: parent.state.goldArrowLeft + 'px',
                            },
                        },
                            React.createElement('div', {
                                dangerouslySetInnerHTML: {
                                    __html: this.state.goldArrowText
                                }
                            }),
                            this.state.goldButtonText && React.createElement('div', {
                                className: 'button em',
                                dangerouslySetInnerHTML: {
                                    __html: parent.state.goldButtonText
                                },
                                style: {
                                    marginTop: '24px',
                                    //fontSize: '24px'
                                },
                                onMouseDown: function (e) {
                                    engine.call('OnTutorialContinuePressed')
                                    parent.setState({ goldArrowText: '', goldButtonText: '' })
                                }
                            }),
                            React.createElement('div', {
                                className: 'arrow-image down',
                                style: {
                                    left: '60px',
                                }
                            })
                        ),
                        this.state.mythiumArrowText && React.createElement('div', {
                            className: 'arrow-text',
                            style: {
                                bottom: '216px',
                                width: '300px',
                                left: '-50px'
                            },
                        },
                            React.createElement('div', {
                                dangerouslySetInnerHTML: {
                                    __html: this.state.mythiumArrowText
                                }
                            }),
                            this.state.mythiumButtonText && React.createElement('div', {
                                className: 'button em',
                                dangerouslySetInnerHTML: {
                                    __html: parent.state.mythiumButtonText
                                },
                                style: {
                                    marginTop: '24px',
                                    /*fontSize: '24px'*/
                                },
                                onMouseDown: function (e) {
                                    engine.call('OnTutorialContinuePressed')
                                    parent.setState({ mythiumArrowText: '', mythiumButtonText: '' })
                                }
                            }),
                            React.createElement('div', {
                                className: 'arrow-image down',
                                style: {
                                    left: '60px',
                                    bottom: '-128px',
                                }
                            })
                        ),
                        //this.state.supplyArrowText && React.createElement('div', {
                        //    className: 'arrow-text',
                        //    style: {
                        //        bottom: '180px',
                        //        width: '300px',
                        //        left: '-50px'
                        //    },
                        //},
                        //    React.createElement('div', {
                        //        dangerouslySetInnerHTML: {
                        //            __html: this.state.supplyArrowText
                        //        }
                        //    }),
                        //    this.state.supplyButtonText && React.createElement('div', {
                        //        className: 'button em',
                        //        dangerouslySetInnerHTML: {
                        //            __html: parent.state.supplyButtonText
                        //        },
                        //        style: {
                        //            marginTop: '24px',
                        //            fontSize: '24px'
                        //        },
                        //        onMouseDown: function (e) {
                        //            engine.call('OnTutorialContinuePressed')
                        //            parent.setState({ supplyArrowText: '', supplyButtonText: '' })
                        //        }
                        //    }),
                        //    React.createElement('div', {
                        //        className: 'arrow-image down',
                        //        style: {
                        //            left: '60px',
                        //            bottom: '-148px',
                        //        }
                        //    })
                        //),
                        React.createElement('ul', {},
                            React.createElement('li', {
                                onMouseDown: function (e) {
                                    if (e.nativeEvent.which == 3 || globalState.isAltHeld) {
                                        console.log("OnPingGold")
                                        engine.call('OnPingGold')
                                    }
                                },
                                className: 'simple-tooltip'
                            },
                                React.createElement('img', { className: 'resource-icon', src: 'hud/img/icons/Gold.png' }),
                                React.createElement('span', { className: (this.state.goldGlow ? ' gold-glow' : '') }, this.state.gold),
                                React.createElement('span', { className: 'tooltiptext' },
                                    loc('gold_used_for', 'Gold is used for deploying fighters'),
                                    React.createElement('div', {
                                        style: { marginTop: '12px' }
                                    },
                                        loc('income', 'Income'),
                                        ': ',
                                        React.createElement('img', { src: 'hud/img/icons/Income.png' }),
                                        this.state.income
                                    ),
                                    this.state.goldNextWave > 0 && React.createElement('div', {},
                                        loc('bounty_next_wave', 'Bounty Next Wave'),
                                        ': ',
                                        React.createElement('img', { src: 'hud/img/icons/Gold.png' }),
                                        this.state.goldNextWave
                                    ),
                                    this.state.goldRemaining > 0 && React.createElement('div', {},
                                        loc('bounty_remaining', 'Bounty Remaining'),
                                        ': ',
                                        React.createElement('img', { src: 'hud/img/icons/Gold.png' }),
                                        this.state.goldRemaining
                                    ),
                                    this.state.goldRushGold > 0 && React.createElement('div', {},
                                        locName('gold_rush', 'Gold Rush'),
                                        ': ',
                                        React.createElement('img', { src: 'hud/img/icons/Gold.png' }),
                                        this.state.goldRushGold
                                    ),
                                    (this.state.income > 0 || this.state.goldNextWave > 0 || this.state.goldRemaining > 0) && React.createElement('div', {},
                                        loc('estimated_total', 'Estimated Total'),
                                        ': ',
                                        React.createElement('img', { src: 'hud/img/icons/Gold.png' }),
                                        estimatedTotalGold
                                    )
                                )
                            ),
                            React.createElement('li', {
                                onMouseDown: function (e) {
                                    if (e.nativeEvent.which == 3 || globalState.isAltHeld) {
                                        console.log("OnPingMythium")
                                        engine.call('OnPingMythium')
                                    }
                                },
                                className: 'simple-tooltip',
                                style: {
                                    marginTop: '-2px'
                                }
                            },
                                React.createElement('img', { className: 'resource-icon', src: 'hud/img/icons/Mythium.png' }),
                                React.createElement('span', { className: (this.state.mythiumGlow ? ' mythium-glow' : '') }, this.state.mythium),
                                React.createElement('span', { className: 'tooltiptext mythium' },
                                    loc('mythium_used_for', 'Mythium is used for hiring mercenaries'),
                                    React.createElement('div', {},
                                        loc('estimated_total', 'Estimated Total'),
                                        ': ',
                                        React.createElement('img', { src: 'hud/img/icons/Mythium.png' }),
                                        this.state.estimatedTotalMythium
                                    )

                                    //,
                                    // Maybe do something like this in the future? Seems not needed though / clutters for veteran players
                                    //React.createElement('div', {
                                    //    style: { marginTop: '12px' }
                                    //},
                                    //    'You have ',
                                    //    React.createElement('img', { className: 'resource-icon', src: 'hud/img/icons/Worker.png' }),
                                    //    '8, which gives you ',
                                    //    React.createElement('img', { className: 'resource-icon', src: 'hud/img/icons/Mythium.png' }),
                                    //    '8 per 10 sec'
                                    //)
                                )
                            )//,
                            //React.createElement('li', {
                            //    onMouseDown: function (e) {
                            //        if (e.nativeEvent.which == 3 || globalState.isAltHeld) {
                            //            console.log("OnPingSupply")
                            //            engine.call('OnPingSupply')
                            //        }
                            //    },
                            //    className: 'simple-tooltip'
                            //},
                            //    React.createElement('img', { className: 'resource-icon', src: 'hud/img/icons/Supply.png' }),
                            //    React.createElement('span', {
                            //        style: {
                            //            color: supplyColor
                            //        }
                            //    },
                            //        React.createElement('span', { className: (this.state.supplyGlow ? ' supply-glow' : '') }, this.state.supply + "/" + this.state.supplyCap),
                            //        React.createElement('span', { className: 'tooltiptext' }, loc('supply_used_for', 'Your supply cap limits how many fighters you can deploy'))
                            //    )
                            //)
                        )
                    )
                )
            )
        )
    }
})

var Windshield = React.createClass({
    displayName: 'Windshield',
    propTypes: {
        theme: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            enabled: false,
            actions: [],
            arrowText: '',
            arrowIndex: 0,
            windshieldArrowText: '',
            buttonText: '',
            autosend: false
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.enableWindshield = function (enabled) {
            if (parent.state.enabled == enabled) return // bail early if no change
            parent.setState({ enabled: enabled, })
            engine.call('OnSetWindshieldEnabled', enabled)
        }
        bindings.refreshWindshieldActions = function (actions) { parent.setState({ actions: actions }) }
        bindings.renderTutorialArrowText['mercenary1'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 0 })
        }
        bindings.renderTutorialArrowText['mercenary2'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 1 })
        }
        bindings.renderTutorialArrowText['mercenary3'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 2 })
        }
        bindings.renderTutorialArrowText['mercenary4'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 3 })
        }
        bindings.renderTutorialArrowText['mercenary5'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 4 })
        }
        bindings.renderTutorialArrowText['mercenary6'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 5 })
        }
        bindings.renderTutorialArrowText['mercenary7'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 6 })
        }
        bindings.renderTutorialArrowText['mercenary8'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 7 })
        }
        bindings.renderTutorialArrowText['mercenary9'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 8 })
        }
        bindings.renderTutorialArrowText['mercenary10'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 9 })
        }
        bindings.renderTutorialArrowText['mercenary11'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 10 })
        }
        bindings.renderTutorialArrowText['mercenary12'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 11 })
        }
        bindings.renderTutorialArrowText['mercenary13'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 12 })
        }
        bindings.renderTutorialArrowText['mercenary14'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 13 })
        }
        bindings.renderTutorialArrowText['mercenary15'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 14 })
        }
        bindings.renderTutorialArrowText['mercenary16'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 15 })
        }
        bindings.renderTutorialArrowText['mercenary17'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 16 })
        }
        bindings.renderTutorialArrowText['mercenary18'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 17 })
        }
        bindings.renderTutorialArrowText['mercenary19'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 18 })
        }
        bindings.renderTutorialArrowText['mercenary20'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 19 })
        }
        bindings.renderTutorialArrowText['mercenary21'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 20 })
        }
        bindings.renderTutorialArrowText['mercenary22'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 21 })
        }
        bindings.renderTutorialArrowText['mercenary23'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 22 })
        }
        bindings.renderTutorialArrowText['mercenary24'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 23 })
        }
        bindings.renderTutorialArrowText['windshield'] = function (props, buttonText) {
            parent.setState({ windshieldArrowText: props.message, buttonText: buttonText })
        }
        bindings.refreshAutosendEnabled = function (enabled) {
            parent.setState({ autosend: enabled })
        }
    },
    render: function () {
        var parent = this

        if (globalState.isSpectatorMode) return null

        var forceHide = false
        if (globalState.forceHideAutosend)
            forceHide = true

        return (
            React.createElement(Module, { moduleId: 'windshield', width: 490, height: 194, defaultLeft: '53px', defaultTop: '-300px', defaultBottom: '156px', defaultRight: 'unset', unclickable: (this.state.enabled ? false : true) },
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset2(this.state.enabled, 0, 20),
                    React.createElement('div', {
                        id: 'MercenariesWindow',
                        ref: 'mercWindow',
                        className: 'panel' + (this.props.theme != "" ? ' ' + this.props.theme : ''),
                    },
                        React.createElement('ul', {
                            className: 'actions-group',
                            style: {
                                position: 'absolute',
                                top: '2px',
                                left: '6px',
                            }
                        },
                            this.state.actions.map(function (action, index) {
                                action.show = parent.state.enabled // v1.34
                                var leftOffset = action.large ? (0 + 71 * ((action.index - 1) % 8)) + 'px' : (0 + 57 * ((action.index - 1) % 8)) + 'px'
                                var topOffset = action.large ? (20 + 64 * Math.floor((action.index - 1) / 8)) + 'px' : (10 + 57 * Math.floor((action.index - 1) / 8)) + 'px'

                                //var extraTopOffset = 0 // -57
                                //var topOffset = (extraTopOffset + (action.large ? (20 + 64 * Math.floor((action.index - 1) / 8)) + 'px' : (10 + 57 * Math.floor((action.index - 1) / 8)))) + 'px'
                                //action.topOffset = extraTopOffset

                                return React.createElement('div', { key: action.index },
                                    (parent.state.arrowIndex == index && parent.state.arrowText) &&
                                    React.createElement('div', {
                                        className: 'arrow-text',
                                        dangerouslySetInnerHTML: {
                                            __html: parent.state.arrowText
                                        },
                                        style: {
                                            left: 'calc(' + leftOffset + ' - 130px)',
                                            top: 'calc(' + topOffset + ' - 160px)', // does nothing ?
                                            width: '300px',
                                            right: '0',
                                        }
                                    }),
                                    (parent.state.arrowIndex == index && parent.state.arrowText) &&
                                    React.createElement('div', {
                                        className: 'arrow-image down',
                                        style: {
                                            left: leftOffset,
                                            top: 'calc(' + topOffset + ' - 103px)',
                                            bottom: '-10px',
                                        }
                                    }),
                                    React.createElement(Action, action)
                                )
                            })
                        ),
                        !forceHide && React.createElement('div', {
                            className: 'autosend simple-tooltip',
                            onMouseDown: function (e) {
                                if (e.nativeEvent.which == 1) {
                                    console.log('clicked auto')
                                    engine.call('OnToggleAutosend')

                                    if (isBrowserTest)
                                        engine.trigger('refreshAutosendEnabled', !parent.state.autosend)
                                }
                            }
                        },
                            parent.state.autosend && React.createElement('img', { className: 'autosend-check', src: 'hud/img/ui/accept-check.png' }),
                            !parent.state.autosend && React.createElement('img', { className: 'autosend-check autosend-check-disabled', src: 'hud/img/ui/accept-check-outline.png' }),
                            React.createElement('span', {
                                className: 'autosend-text' + (!parent.state.autosend ? ' autosend-text-disabled' : ''),
                                dangerouslySetInnerHTML: {
                                    __html: locName('autosend', 'AUTO')
                                }
                            }),
                            React.createElement('span', {
                                className: 'tooltiptext wide',
                                dangerouslySetInnerHTML: {
                                    __html: loc('autosend', 'Automatically hire mercenaries to maximize income')
                                }
                            })
                        )
                    )
                ),
                this.state.windshieldArrowText && React.createElement('div', {
                    className: 'arrow-text',
                    style: {
                        bottom: '140px',
                        width: '300px',
                        left: '200px',
                        pointerEvents: 'none',
                    }
                },
                    React.createElement('div', {
                        dangerouslySetInnerHTML: {
                            __html: this.state.windshieldArrowText
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
                            parent.setState({ windshieldArrowText: '', buttonText: '' })
                        }
                    }),
                    React.createElement('div', {
                        className: 'arrow-image down',
                        style: {
                            left: '128px',
                            bottom: '-128px',
                        }
                    })
                )
            )
        )
    }
})

var WindshieldLock = React.createClass({
    lastEnabledState: false,
    propTypes: {
        theme: React.PropTypes.string,
    },
    getInitialState: function () {
        return {
            enabled: false,
            defender: loc('the_enemy_team', 'the enemy team'),
            disabledMessage: '',
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.toggleWindshieldLock = function () {
            var enabled = !parent.state.enabled

            if (enabled && parent.state.disabledMessage.length > 0)
                return

            engine.trigger('enableWindshield', enabled)
            parent.setState({
                enabled: enabled
            })
        }
        bindings.resetWindshield = function () {
            parent.setState({ enabled: false })
        }
        bindings.refreshWindshieldDefender = function (defender) {
            parent.setState({ defender: defender })
        }
        // This is primarily used for tutorials. Set message to blank to remove the disable. 
        bindings.disableWindshield = function (message) {
            parent.setState({ disabledMessage: message })

            if (message.length > 0)
                engine.trigger('enableWindshield', false)
        }
    },
    componentDidUpdate: function () { // experimental
        if (this.lastEnabledState == this.state.enabled) return // bail early if no change
        this.lastEnabledState = this.state.enabled
        engine.call('OnWindshieldEnabled', this.state.enabled)
    },
    displayName: 'WindshieldLock',
    render: function () {
        if (globalState.isSpectatorMode) return null
        var parent = this

        return (
            React.createElement('div', {
                id: 'DashboardOffense',
                className: ((this.state.enabled || parent.state.disabledMessage.length > 0) ? 'inactive ' : '')
                    + this.props.theme + (globalState.isSpectatorMode ? ' hidden' : '')
                    + ' simple-tooltip',
                style: {
                    WebkitFilter: parent.state.disabledMessage.length > 0 ? 'grayscale(1)' : (!this.state.enabled ? 'none' : 'brightness(0.5) grayscale(0.75)'),
                },
                onMouseDown: function (e) {
                    //if (parent.state.disabledMessage.length > 0) return // v9.05

                    console.log('onMouseDown windshield ' + e.nativeEvent.which)
                    if (e.nativeEvent.which == 1 && parent.state.disabledMessage.length == 0)
                        engine.trigger('toggleWindshieldLock')
                    else if (e.nativeEvent.which == 3)
                        engine.call('OnRightClickWindshield')
                }
            },
                React.createElement('span', {
                    className: 'tooltiptext',
                    //style: {
                    //    fontFamily: 'MenuFont_chat',
                    //},
                    dangerouslySetInnerHTML: {
                        __html: (parent.state.disabledMessage.length > 0) ? parent.state.disabledMessage : loc('mercs_attack_who', 'Your mercenaries will attack ' + parent.state.defender + ' next wave' + '<br/><span style="color: #909090">Right click to jump to their lane</span>', [parent.state.defender])
                    }
                })
            )
        )
    }
})

var Leftbox = React.createClass({
    displayName: 'Leftbox',
    propTypes: {
        theme: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            enabled: false,
            actions: [],
            arrowText: '',
            arrowIndex: 0,
            leftboxArrowText: '',
            buttonText: '',
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.enableLeftbox = function (enabled) {
            if (parent.state.enabled == enabled) return // bail early if no change
            console.log('enable leftbox: ' + enabled)
            parent.setState({ enabled: enabled, })
            engine.call('OnSetLeftboxEnabled', enabled)
        }
        bindings.refreshLeftboxActions = function (actions) { parent.setState({ actions: actions }) }
        bindings.renderTutorialArrowText['upgrade1'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 0 })
        }
        bindings.renderTutorialArrowText['upgrade2'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 1 })
        }
        bindings.renderTutorialArrowText['upgrade3'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, arrowIndex: 2 })
        }
        bindings.renderTutorialArrowText['leftbox'] = function (props, buttonText) {
            parent.setState({ leftboxArrowText: props.message, buttonText: buttonText })
        }
    },
    render: function () {
        var parent = this

        if (globalState.isSpectatorMode) return null

        return (
            React.createElement(Module, { moduleId: 'leftbox', width: 69, height: 179, defaultLeft: '-120px', defaultTop: '-191px', defaultBottom: 'unset', defaultRight: 'unset', unclickable: (this.state.enabled ? false : true) },
                React.createElement(
                    VelocityComponent,
                    GetAnimationPreset2(this.state.enabled, 20, 0),
                    React.createElement('div', {
                        id: 'LeftboxWindow',
                        className: 'panel' + (this.props.theme != "" ? ' ' + this.props.theme : '')
                            + (this.props.theme == "day" ? ' inactive' : ''),
                    },
                        React.createElement('ul', {
                            className: 'actions-group',
                            style: {
                                position: 'absolute',
                                top: '0px',
                                left: '2px',
                            }
                        },
                            this.state.actions.map(function (action, index) {
                                action.show = parent.state.enabled // v1.34

                                // For arrow only
                                var actionsPerRow = 1
                                var leftOffset = action.large ? (0 + 71 * ((action.index - 1) % actionsPerRow)) + 'px' : (0 + 57 * ((action.index - 1) % actionsPerRow)) + 'px'
                                var topOffset = action.large ? (20 + 64 * Math.floor((action.index - 1) / actionsPerRow)) + 'px' : (10 + 57 * Math.floor((action.index - 1) / actionsPerRow)) + 'px'
                                action.actionsPerRow = actionsPerRow

                                return React.createElement('div', { key: action.index },
                                    (parent.state.arrowIndex == index && parent.state.arrowText) &&
                                    React.createElement('div', {
                                        className: 'arrow-text',
                                        dangerouslySetInnerHTML: {
                                            __html: parent.state.arrowText
                                        },
                                        style: {
                                            left: 'calc(' + leftOffset + ' - 130px)',
                                            top: 'calc(' + topOffset + ' - 160px)', // does nothing ?
                                            width: '300px',
                                            right: '0',
                                        }
                                    }),
                                    (parent.state.arrowIndex == index && parent.state.arrowText) &&
                                    React.createElement('div', {
                                        className: 'arrow-image down',
                                        style: {
                                            left: leftOffset,
                                            top: 'calc(' + topOffset + ' - 103px)',
                                            bottom: '-10px',
                                        }
                                    }),
                                    React.createElement(Action, action)
                                )
                            })
                        )
                    )
                ),
                this.state.leftboxArrowText && React.createElement('div', {
                    className: 'arrow-text',
                    style: {
                        bottom: '140px',
                        width: '300px',
                        left: '200px',
                        pointerEvents: 'none',
                    }
                },
                    React.createElement('div', {
                        dangerouslySetInnerHTML: {
                            __html: this.state.leftboxArrowText
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
                            parent.setState({ leftboxArrowText: '', buttonText: '' })
                        }
                    }),
                    React.createElement('div', {
                        className: 'arrow-image down',
                        style: {
                            left: '128px',
                            bottom: '-128px',
                        }
                    })
                )
            )
        )
    }
})

var LeftboxLock = React.createClass({
    lastEnabledState: false,
    propTypes: {
        theme: React.PropTypes.string,
    },
    getInitialState: function () {
        return {
            enabled: false,
            disabledMessage: '',
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.toggleLeftboxLock = function () {
            var enabled = !parent.state.enabled

            if (enabled && parent.state.disabledMessage.length > 0)
                return

            console.log('toggleLeftboxLock: ' + enabled)
            engine.trigger('enableLeftbox', enabled)
            parent.setState({
                enabled: enabled
            })

            if (enabled)
                engine.call('OnOpenKingUpgrades')
        }
        bindings.resetLeftbox = function () {
            parent.setState({ enabled: false })
        }
        // This is primarily used for tutorials. Set message to blank to remove the disable. 
        bindings.disableLeftbox = function (message) {
            parent.setState({ disabledMessage: message })

            if (message.length > 0)
                engine.trigger('enableLeftbox', false)
        }
    },
    componentDidUpdate: function () { // experimental
        if (this.lastEnabledState == this.state.enabled) return // bail early if no change
        this.lastEnabledState = this.state.enabled
        engine.call('OnLeftboxEnabled', this.state.enabled)
    },
    displayName: 'LeftboxLock',
    render: function () {
        if (globalState.isSpectatorMode) return null
        var parent = this

        return (
            React.createElement('div', {
                id: 'DashboardUpgrades',
                className: ((this.state.enabled || parent.state.disabledMessage.length > 0) ? 'inactive ' : '')
                    + this.props.theme + (globalState.isSpectatorMode ? ' hidden' : '')
                    + ' simple-tooltip',
                style: {
                    //WebkitFilter: parent.state.disabledMessage.length > 0 ? 'grayscale(1)' : (!this.state.enabled ? 'none' : 'brightness(0.5) grayscale(0.75)'),
                },
                onMouseDown: function (e) {
                    if (parent.state.disabledMessage.length > 0) return

                    console.log('onMouseDown leftbox ' + e.nativeEvent.which)
                    if (e.nativeEvent.which == 1)
                        engine.trigger('toggleLeftboxLock')
                    else if (e.nativeEvent.which == 3)
                        engine.call('OnRightClickLeftbox')
                }
            },
                React.createElement('span', {
                    className: 'tooltiptext',
                    dangerouslySetInnerHTML: {
                        __html: (parent.state.disabledMessage.length > 0) ? parent.state.disabledMessage : loc('king_upgrades_tooltip', 'Upgrade your King')
                    }
                })
            )
        )
    }
})

var Powerups = React.createClass({
    displayName: 'Powerups',
    propTypes: {
    },
    getInitialState: function () {
        return {
            powerupChoices: [],
            enabled: false,
            used: false,
            tooltip: '',
            unlockPercent: 0,
            arrowText: '',
            buttonText: '',
            calloutText: '',
            calloutTextShow: 0,
            calloutTextCounter: 0,
            calloutTextSize: 16,
        }
    },
    componentWillMount: function () {
        var parent = this;
        bindings.enablePowerupsWindow = function (enabled) {
            parent.setState({ enabled: enabled })
        }
        bindings.refreshPowerupUsed = function (used) {
            parent.setState({ used: used })
        }
        bindings.refreshPowerupsWindowTooltip = function (tooltip) {
            parent.setState({ tooltip: tooltip })
        }
        bindings.refreshPowerupChoices = function (powerupChoices) {
            parent.setState({ powerupChoices: powerupChoices })
        }
        bindings.refreshPowerupUnlockPercent = function (percent) {
            parent.setState({ unlockPercent: percent })
        }
        bindings.renderTutorialArrowText['powerups'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, buttonText: buttonText })
        }
        bindings.refreshPowerupCalloutText = function (text, effectType, fontSize) {
            //console.log('refreshPowerupCalloutText fontSize ' + fontSize)

            parent.setState({
                calloutText: '',
                calloutTextShow: 0,
                calloutTextSize: fontSize
            })

            setTimeout(function () {
                parent.setState({
                    calloutText: text,
                    calloutTextShow: 1,
                    calloutTextCounter: parent.state.calloutTextCounter + 1,
                    calloutTextSize: fontSize
                })

                if (parent.refs.powerupsWindow != null && effectType.length > 0) {
                    var fxOffset = getAbsoluteOffset(parent.refs.powerupsWindow)
                    engine.call('OnCreateVFX', effectType, fxOffset.x, fxOffset.y - 50)
                }

                var tempCounter = parent.state.calloutTextCounter
                setTimeout(function () {
                    if (tempCounter != parent.state.calloutTextCounter) return

                    parent.setState({
                        calloutTextShow: 2
                    })
                }, 1000)
            }, 60)
        }
    },
    createCalloutText: function () {
        var parent = this
        return React.createElement(
            VelocityComponent,
            GetAnimationPreset6(parent.state.calloutTextShow, 0, 0),
            React.createElement('div', {
                className: 'callout-text',
                style: { fontSize: parent.state.calloutTextSize },
                dangerouslySetInnerHTML: {
                    __html: parent.state.calloutText
                }
            })
        )
    },
    render: function () {
        var parent = this
        if (globalState.isSpectatorMode) return null

        // v8.04 just made it unlocked for everyone for now, feels bad if someone invited their friend and it's not available
        var powerupLevelRequirement = 1 // Unlocks when you reach this level
        // Maybe increase this later if we go F2P to encourage retention
        //var powerupLevelRequirement = 3 // Unlocks when you reach this level

        if (!parent.state.enabled || globalState.level < powerupLevelRequirement) {
            var backgroundIndex = Math.round(parent.state.unlockPercent * 10);
            if (backgroundIndex < 0) backgroundIndex = 0
            if (backgroundIndex > 10) backgroundIndex = 10

            if (parent.state.used) {
                return (
                    React.createElement('div', {
                        id: 'PowerupsWindow',
                        ref: 'powerupsWindow',
                        className: 'panel inactive simple-tooltip used'
                    },
                        parent.createCalloutText(),
                        parent.state.tooltip != null && parent.state.tooltip.length > 0 && React.createElement('span', {
                            className: 'tooltiptext',
                            dangerouslySetInnerHTML: {
                                __html: (globalState.level >= powerupLevelRequirement) ? parent.state.tooltip : loc('legion_spells_unlock', 'Legion Spells unlock after your account reaches level 2.')
                            }
                        })
                    )
                )
            }

            return (
                React.createElement('div', {
                    id: 'PowerupsWindow',
                    ref: 'powerupsWindow',
                    className: 'panel inactive simple-tooltip',
                    style: {
                        backgroundImage: 'url(hud/img/powerups/powerup-inactive-' + backgroundIndex + '.png)',
                        backgroundRepeat: 'no-repeat'
                    }
                },
                    parent.createCalloutText(),
                    parent.state.tooltip != null && parent.state.tooltip.length > 0 && React.createElement('span', {
                        className: 'tooltiptext',
                        dangerouslySetInnerHTML: {
                            __html: (globalState.level >= powerupLevelRequirement) ? parent.state.tooltip : loc('legion_spells_unlock', 'Legion Spells unlock after your account reaches level 2.')
                        }
                    })
                )
            )
        }

        return (
            React.createElement(
                VelocityComponent,
                GetAnimationPreset2(parent.state.enabled, 0, 20),
                React.createElement('div', {
                    id: 'PowerupsWindow',
                    ref: 'powerupsWindow',
                    className: 'panel'
                },
                    parent.createCalloutText(),
                    React.createElement('div', { className: 'background' }),
                    React.createElement('ul', {},
                        parent.state.powerupChoices.map(function (powerup, index) {
                            var xPos = index % 3
                            var yPos = Math.floor(index / 3)

                            return React.createElement('li', {
                                className: 'Action powerup-icon simple-tooltip',
                                style: {
                                    left: (9 + 58 * xPos) + 'px',
                                    bottom: (12 + 58 * yPos) + 'px'
                                },
                                onMouseDown: function (e) {
                                    if (e.nativeEvent.which == 1)
                                        engine.trigger('clickPowerup', powerup.apexId, powerup.isSubpowerup)
                                    else if (e.nativeEvent.which == 3)
                                        engine.trigger('rightClickPowerup', powerup.apexId)
                                },
                            },
                                React.createElement('span', {
                                    className: 'tooltiptext'
                                },
                                    React.createElement('div', {
                                        style: { color: '#33ff33' },
                                        dangerouslySetInnerHTML: {
                                            __html: powerup.name
                                        }
                                    }),
                                    React.createElement('div', {
                                        dangerouslySetInnerHTML: {
                                            __html: powerup.description
                                        }
                                    })
                                ),
                                React.createElement('img', {
                                    className: 'icon',
                                    src: 'hud/img/' + powerup.icon
                                })
                            )
                        })
                    ),
                    this.state.arrowText && React.createElement('div', {
                        className: 'arrow-text',
                        style: {
                            bottom: '240px',
                            width: '300px',
                            left: '-78px',
                        }
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
                            className: 'arrow-image down',
                            style: {
                                left: '128px',
                                bottom: '-128px',
                            }
                        })
                    )
                )
            )
        )
    }
})


var Dashboard = React.createClass({
    displayName: 'Dashboard',
    propTypes: {
        theme: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            actions: [],
            showRecommendedValues: true,
            currentValue: 0,
            recommendedValue: 0,
            greenMin: 0,
            greenMax: 0,
            yellowMin: 0,
            yellowMax: 0,
            redMin: 0,
            redMax: 0,
            fighterArrowText: '',
            fighterArrowIndex: 0,
        }
    },
    componentWillMount: function () {
        var parent = this;
        bindings.refreshDashboardActions = function (actions) {
            parent.setState({
                actions: actions,
            })
        }
        bindings.renderTutorialArrowText['fighter1'] = function (props, buttonText) {
            parent.setState({ fighterArrowText: props.message, fighterArrowIndex: 0 })
        }
        bindings.renderTutorialArrowText['fighter2'] = function (props, buttonText) {
            parent.setState({ fighterArrowText: props.message, fighterArrowIndex: 1 })
        }
        bindings.renderTutorialArrowText['fighter3'] = function (props, buttonText) {
            parent.setState({ fighterArrowText: props.message, fighterArrowIndex: 2 })
        }
        bindings.renderTutorialArrowText['fighter4'] = function (props, buttonText) {
            parent.setState({ fighterArrowText: props.message, fighterArrowIndex: 3 })
        }
        bindings.renderTutorialArrowText['fighter5'] = function (props, buttonText) {
            parent.setState({ fighterArrowText: props.message, fighterArrowIndex: 4 })
        }
        bindings.renderTutorialArrowText['fighter6'] = function (props, buttonText) {
            parent.setState({ fighterArrowText: props.message, fighterArrowIndex: 5 })
        }
    },
    render: function () {
        if (globalState.isSpectatorMode) return null

        //console.log('render dashboard with fighterArrowText: ' + this.state.fighterArrowText + ', fighterArrowIndex: ' + this.state.fighterArrowIndex)

        var parent = this

        return React.createElement('div', {
            id: 'DashboardWindow',
            className: 'panel' + (this.props.theme != "" ? ' ' + this.props.theme : '')
                + (this.props.theme == "day" ? ' inactive' : ''),
        },
            React.createElement('ul', {},
                this.state.actions.map(function (action, index) {
                    // todo: double-check action.key here, might be something wrong according to React.js warnings
                    action['large'] = true
                    action.show = true
                    //action.hideTooltip = parent.state.fighterArrowText.length > 0
                    var leftOffset = action.large ? (10 + 71 * ((action.index - 1) % 8)) + 'px' : (10 + 57 * ((action.index - 1) % 8)) + 'px'
                    return React.createElement('div', {
                        key: action.index
                    },
                        (parent.state.fighterArrowIndex == index && parent.state.fighterArrowText) &&
                        React.createElement('div', {
                            className: 'arrow-text',
                            dangerouslySetInnerHTML: {
                                __html: parent.state.fighterArrowText
                            },
                            style: {
                                bottom: '80px',
                                left: 'calc(' + leftOffset + ' - 130px)',
                                width: '300px',
                                right: '0',
                            }
                        }),
                        (parent.state.fighterArrowIndex == index && parent.state.fighterArrowText) &&
                        React.createElement('div', {
                            className: 'arrow-image down',
                            style: {
                                left: leftOffset,
                                bottom: '-48px',
                            }
                        }),
                        React.createElement(Action, action)
                    )
                })
            )
        )
    }
})

var Glovebox = React.createClass({
    displayName: 'Glovebox',
    propTypes: {
        theme: React.PropTypes.string
    },
    getInitialState: function () {
        return {
            // Hud V2: always open
            //enabled: true, //false, 
            actions: [],
            disabledMessage: '',
            arrowText: '',
            buttonText: '',
            researchArrowText: '',
            researchButtonText: '',
        }
    },
    componentWillMount: function () {
        var parent = this
        //bindings.enableGlovebox = function (enabled) {
        //    if (parent.state.enabled == enabled) return // bail early if no change
        //}
        //bindings.toggleGloveboxLock = function () {
        //    parent.forceUpdate()
        //}
        bindings.refreshGlovebox = function () {
            parent.forceUpdate()
        }
        bindings.refreshGloveboxActions = function (actions) { parent.setState({ actions: actions }) }
        // This is primarily used for tutorials. Set message to blank to remove the disable. 
        bindings.disableGlovebox = function (message) {
            parent.setState({ disabledMessage: message })
        }
        bindings.renderTutorialArrowText['worker'] = function (props, buttonText) {
            parent.setState({ arrowText: props.message, buttonText: buttonText })
        }
        bindings.renderTutorialArrowText['research'] = function (props, buttonText) {
            parent.setState({ researchArrowText: props.message, researchButtonText: buttonText })
        }
    },
    render: function () {
        var parent = this
        var disabled = parent.state.disabledMessage.length > 0
        if (globalState.isSpectatorMode) return null
        return (
            React.createElement('div', {
                style: {
                    id: 'DashboardTown',
                    position: 'absolute',
                    left: '445px',
                    top: '60px',
                    // causes some layering issues
                    //WebkitFilter: disabled ? 'grayscale(1)' : 'none',
                }
            },
                React.createElement('div', {
                    className: 'panel' + ((this.props.theme != "") ? ' ' + this.props.theme : '')
                },
                    React.createElement('ul', {
                        className: 'actions-group',
                        style: {
                            position: 'absolute',
                            top: '0',
                            left: '6px'
                        }
                    },
                        this.state.actions.map(function (action) {
                            //action.show = parent.state.enabled // v1.34
                            action.show = true

                            if (disabled) {
                                action.subheader = ''
                                action.description = parent.state.disabledMessage
                            }

                            return React.createElement(Action, action)
                        })
                    ),
                    this.state.arrowText && React.createElement('div', {
                        className: 'arrow-text',
                        style: {
                            bottom: '86px',
                            width: '300px',
                            left: '-128px',
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
                            className: 'arrow-image down',
                            style: {
                                left: '128px',
                            }
                        })
                    ),
                    this.state.researchArrowText && React.createElement('div', {
                        className: 'arrow-text',
                        style: {
                            bottom: '86px',
                            width: '300px',
                            left: '-70px',
                        },
                    },
                        React.createElement('div', {
                            dangerouslySetInnerHTML: {
                                __html: this.state.researchArrowText
                            }
                        }),
                        this.state.researchButtonText && React.createElement('div', {
                            className: 'button em',
                            dangerouslySetInnerHTML: {
                                __html: parent.state.researchButtonText
                            },
                            style: {
                                marginTop: '24px',
                                //fontSize: '24px'
                            },
                            onMouseDown: function (e) {
                                engine.call('OnTutorialContinuePressed')
                                parent.setState({ arrowText: '', researchButtonText: '' })
                            }
                        }),
                        React.createElement('div', {
                            className: 'arrow-image down',
                            style: {
                                left: '128px',
                            }
                        })
                    )
                )
            )
        )
    }
})


// This should only be re-rendered when a UI element is hidden/shown
// note: button positions are done absolutely to allow for the client to specify button positions (via index property)
var Action = React.createClass({
    propTypes: {
        actionId: React.PropTypes.number.isRequired,
        header: React.PropTypes.string.isRequired,
        subheader: React.PropTypes.string,
        description: React.PropTypes.string,
        longDescription: React.PropTypes.string,
        image: React.PropTypes.string.isRequired,
        index: React.PropTypes.number,
        large: React.PropTypes.bool,
        grayedOut: React.PropTypes.bool,
        emphasized: React.PropTypes.bool, // todo: deprecate
        recommendation: React.PropTypes.string,
        recommendationClass: React.PropTypes.string,
        show: React.PropTypes.bool,
        hideTooltip: React.PropTypes.bool,
        actionsPerRow: React.PropTypes.number,
        stacks: React.PropTypes.number,
        role: React.PropTypes.string,
    },
    getInitialState: function () {
        return {
            showExtended: false,
            hovered: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.showExtendedActionTooltip[parent.props.actionId] = function (enabled) {
            if (enabled && parent.props.longDescription != null && parent.props.longDescription.length > 0)
                parent.setState({ showExtended: true })
            else
                parent.setState({ showExtended: false })
        }
    },
    render: function () {
        var parent = this

        var actionsPerRow = 8
        var extraPadding = 10
        var verticalSpacing = 57
        if (this.props.actionsPerRow > 0) {
            actionsPerRow = this.props.actionsPerRow
            extraPadding = 5

            // King upgrade case
            if (this.props.actionsPerRow == 1)
                verticalSpacing = 54
        }

        if (this.props.stacks == -1) return null

        var hasStacks = this.props.stacks != null && this.props.stacks > 0
        var hasRole = this.props.role != null && this.props.role.length

        return (
            React.createElement('li', {
                className: 'Action',
                style: {
                    position: 'absolute',
                    left: this.props.large ? (4 + 2 * extraPadding + (verticalSpacing + 14) * ((this.props.index - 1) % actionsPerRow)) + 'px' : (extraPadding + verticalSpacing * ((this.props.index - 1) % actionsPerRow)) + 'px',
                    top: this.props.large ? (4 + 2 * extraPadding + (verticalSpacing + 7) * Math.floor((this.props.index - 1) / actionsPerRow)) + 'px' : (extraPadding + verticalSpacing * Math.floor((this.props.index - 1) / actionsPerRow)) + 'px'
                }
            },
                React.createElement('img', {
                    className: (this.props.large ? 'big icon' : 'icon') + (this.props.recommendationClass ? ' ' + this.props.recommendationClass : '')
                        + (this.props.grayedOut ? ' grayed-out' : ''),
                    src: 'hud/img/' + this.props.image,
                    onMouseOver: function () {
                        engine.trigger('enableActionTooltip', parent.props.actionId, true)
                        parent.setState({ hovered: true })
                    },
                    onMouseLeave: function () {
                        engine.trigger('enableActionTooltip', parent.props.actionId, false)
                        parent.setState({ showExtended: false, hovered: false })
                    },
                    onMouseDown: function (e) {
                        if (e.nativeEvent.which == 1)
                            engine.trigger('clickAction', parent.props.actionId)
                        else if (e.nativeEvent.which == 3)
                            engine.trigger('rightClickAction', parent.props.actionId, true)
                    },
                    onMouseUp: function (e) {
                        if (e.nativeEvent.which == 3)
                            engine.trigger('rightClickAction', parent.props.actionId, false)
                    }
                }),
                hasStacks && React.createElement('div', { className: 'action-stacks' + (this.state.hovered ? ' hover' : '') }, this.props.stacks),
                !hasStacks && hasRole && React.createElement('div', { className: 'action-role' + (this.state.hovered ? ' hover' : '') }, React.createElement('img', { src: 'hud/img/small-icons/' + this.props.role + '.png' })),
                !this.props.hideTooltip && React.createElement(Tooltip, { actionId: this.props.actionId, header: this.props.header, subheader: this.props.subheader, text: ((this.state.showExtended || globalState.alwaysShowExtendedTooltips) && this.props.longDescription != null && this.props.longDescription.length > 0) ? this.props.longDescription : this.props.description, align: 'left', grayedOut: this.props.grayedOut, recommendation: this.props.recommendation }),
                React.createElement(ActionCountdown, { actionId: this.props.actionId, height: 48, show: parent.props.show }),
                React.createElement(ActionProgress, { actionId: this.props.actionId, height: 48, show: parent.props.show }),
                React.createElement(ActionQueue, { actionId: this.props.actionId, height: 48, show: parent.props.show })
            )
        )
    },
})

// Menu button in the bottom right of the HUD
var HudMenuButton = React.createClass({
    render: function () {
        return (
            React.createElement('div', {
                className: 'hud-button simple-tooltip flipped',
                style: {
                    background: 'url(hud/img/small-icons/options.png)',
                    float: 'right'
                },
                onMouseDown: function (e) { engine.trigger('escape') }
            },
                React.createElement('span', { className: 'tooltiptext auto no-carat', style: { right: '120%', bottom: '0' } },
                    loc('options', "Options")
                )
            )
        )
    }
})

// Menu button in the bottom right of the HUD
var HudStackrankButton = React.createClass({
    render: function () {
        return (
            React.createElement('div', {
                className: 'hud-button simple-tooltip flipped',
                style: {
                    background: 'url(hud/img/small-icons/stats.png)',
                    float: 'right'
                },
                onMouseDown: function (e) { engine.trigger('toggleStackrank') }
            },
                React.createElement('span', { className: 'tooltiptext', style: { width: '100px', left: '-136px', bottom: '0' } },
                    loc('scores', "Scores")
                )
            )
        )
    }
})

var DamageTrackerButton = React.createClass({
    render: function () {
        return (
            React.createElement('div', {
                className: 'hud-button simple-tooltip flipped',
                style: {
                    background: 'url(hud/img/small-icons/stats.png)',
                    float: 'right'
                },
                onMouseDown: function (e) { engine.trigger('toggleDamageTracker') }
            },
                React.createElement('span', { className: 'tooltiptext auto no-carat', style: { width: '130px', left: '-175px', bottom: '0' } },
                    loc('damage_tracker', "Damage Tracker")
                )
            )
        )
    }
})

var LagIndicator = React.createClass({
    getInitialState: function () {
        return {
            enabled: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.enableLagIndicator = function (enabled) {
            parent.setState({ enabled: enabled })
        }
    },
    render: function () {
        var parent = this

        if (!this.state.enabled) return null

        return (
            React.createElement('div', { id: 'LagIndicator', },
                React.createElement('div', { className: 'content' },
                    React.createElement('img', {
                        src: 'hud/img/ui/loading-small.gif',
                    })
                )
            )
        )
    }
})

var ThrottleIndicator = React.createClass({
    getInitialState: function () {
        return {
            enabled: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.enableThrottleIndicator = function (enabled) {
            parent.setState({ enabled: enabled })
        }
    },
    render: function () {
        var parent = this

        if (!this.state.enabled) return null

        return (
            React.createElement('div', { id: 'ThrottleIndicator', },
                React.createElement('div', { className: 'content' },
                    React.createElement('img', {
                        src: 'hud/img/ui/ellipsis.gif',
                        className: 'throttle-gif'
                    })
                )
            )
        )
    }
})