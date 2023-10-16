// Searching for match, small window at the top of game lobby
// ===============================================================================

var SearchingForGame = React.createClass({
    lastVerifiedSeconds: 0,
    getInitialState: function () {
        return {
            estimatedTime: 0,
            startTime: 0,
            message: '',
            enabled: false,
            stopped: false,
            hurryUpEnabled: false,
            hurryUpUsed: false,
            warning: '',
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.startSearchGame = function (gameType, estimatedTime) {
            console.log('bindings.startSearchGame ' + gameType + ', estimatedTime: ' + estimatedTime)
            parent.lastVerifiedSeconds = 0
            parent.setState({
                estimatedTime: estimatedTime * 1000,
                startTime: new Date().getTime(),
                enabled: true,
                stopped: false,
                message: loc('searching', 'Searching...') + " (" + gameType + ")",
                warning: '',
                hurryUpUsed: false
            })
        }
        bindings.enterMatchmakingQueue = function (gameType) {
            console.log('bindings.enterMatchmakingQueue ' + gameType)
            parent.lastVerifiedSeconds = 0
            parent.setState({
                estimatedTime: 0,
                startTime: new Date().getTime(),
                enabled: true,
                stopped: false,
                message: loc('entering_queue', 'Entering queue...') + " (" + gameType + ")",
                warning: '',
                hurryUpUsed: false
            })
        }
        bindings.cancelSearchGame = function () {
            console.log('bindings.cancelSearchGame')
            parent.setState({ enabled: false, stopped: true, message: loc('leaving_queue', 'Leaving queue...') })
        }
        bindings.tryCancelSearchGame = function () {
            console.log('bindings.tryCancelSearchGame')
            parent.setState({
                stopped: true, message: loc('canceling_search', 'Canceling search...'),
                warning: loc('canceling_search_warning', '<span style="color: #ffff00">May take up to 7 seconds!</span>')
            })
        }
        bindings.foundGame = function () {
            console.log('bindings.foundGame')
            parent.setState({ stopped: true, message: loc('match_found', 'Match found!') })
            setTimeout(function () {
                parent.setState({ enabled: false })
            }, 1000)
        }
        bindings.enableHurryUpSearch = function (enabled) {
            parent.setState({ hurryUpEnabled: enabled })
        }
        bindings.hurryUpSearch = function () {
            parent.setState({ hurryUpUsed: true })
        }
        bindings.refreshExtraSearchText = function (text) {
            parent.setState({ extraText: text })
        }
        bindings.enteringMatchmakingHeartbeat = function () {
            if (!parent.state.enabled) return
            if (parent.state.stopped) return

            var now = new Date().getTime()
            var timeElapsed = now - parent.state.startTime
            var secondsElapsed = Math.round(timeElapsed * 0.001)
            var estimatedTimeSeconds = Math.round(parent.state.estimatedTime * 0.001)
            engine.call('OnEnteringMatchmakingHeartbeat', secondsElapsed, estimatedTimeSeconds)
        }
    },
    componentDidUpdate: function () {
        if (this.state.enabled && this.refs.canvas)
            this.runTick()
    },
    render: function () {
        //console.log('searching-views.js render() enabled: ' + this.state.enabled + ', stopped: ' + this.state.stopped
        //    + ', warning: ' + this.state.warning)

        var messageLength = this.state.message.length
        var extraWide = messageLength > 26

        var parent = this
        if (!this.state.enabled) return null
        return (
            React.createElement('div', {
                className: 'activity-monitor', style: {
                    height: this.state.estimatedTime > 0 ? (this.state.extraText ? '128px' : '108px') : '36px',
                    textAlign: this.state.estimatedTime > 0 ? 'left' : 'center',
                    background: this.state.estimatedTime > 0 ? 'rgba(255, 255, 255, 0.20)' : ''
                    //background: this.state.estimatedTime > 0 ? 'rgba(88, 100, 111, 0.90)' : ''
                    //background: this.state.estimatedTime > 0 ? 'rgba(134, 134, 134, 0.80)' : ''
                }
            },
                this.state.estimatedTime > 0 && React.createElement('div', { className: 'spinner' },
                    React.createElement('canvas', {
                        ref: 'canvas',
                        height: '64px',
                        width: '64px'
                    })
                ),
                React.createElement('div', {
                    className: 'content',
                    style: {
                        height: this.state.estimatedTime > 0 ? '' : 'unset',
                        position: this.state.estimatedTime > 0 ? '' : 'static'
                    }
                },
                    React.createElement('h2', {
                        style: {
                            background: this.state.estimatedTime == 0 ? 'rgba(255, 255, 255, 0.2)' : '',
                            padding: this.state.estimatedTime == 0 ? '6px' : '',
                            fontSize: extraWide ? '15px' : ''
                        }
                    }, this.state.message),
                    this.state.warning && React.createElement('div', {
                        style: {
                            marginTop: '12px'
                        },
                        dangerouslySetInnerHTML: {
                            __html: this.state.warning
                        }
                    }),
                    !this.state.warning && this.state.estimatedTime > 0 && React.createElement('p', {}, loc('estimated_time', "Estimated time") + ": " + (this.state.estimatedTime * 0.001).toString().toTimeString()),
                    !this.state.warning && this.state.estimatedTime > 0 && React.createElement('p', { ref: 'elapsedTime' }),
                    !this.state.warning && this.state.estimatedTime > 0 && this.state.extraText && React.createElement('p', { dangerouslySetInnerHTML: { __html: this.state.extraText } })
                ),
                this.state.estimatedTime > 0 && React.createElement('div', {
                    className: 'footer' + (parent.state.stopped ? ' disabled' : ''),
                    onClick: function () {
                        console.log('clicked search footer')

                        // v5.04d
                        if (parent.state.stopped) {
                            console.log('but was already stopped, so bail early to avoid spamming tryCancelSearchGame')
                            return
                        }

                        engine.trigger('tryCancelSearchGame')
                    }
                },
                    loc('cancel_search', 'Cancel Search')
                ),
                this.state.estimatedTime > 0 && this.state.hurryUpEnabled && this.state.hurryUpUsed && React.createElement('div', {
                    className: 'footer footer-2 disabled',
                    onClick: function () { engine.trigger('displayClientNotification', loc('already_in_progress', 'Already in progress'), loc('already_speeding_up_search', 'Matchmaker is already accelerating search'), 10) }
                },
                    loc('find_me_match_asap', 'Find me any match as soon as possible')
                ),
                this.state.estimatedTime > 0 && this.state.hurryUpEnabled && !this.state.hurryUpUsed && React.createElement('div', {
                    className: 'footer footer-2',
                    onClick: function () {
                        engine.trigger('hurryUpSearch')
                        engine.trigger('displayClientNotification', loc('speeding_up_search', 'Speeding up search'), loc('speeding_up_search_long', 'Expanded matchmaker rating constraints so you can get into a match sooner.'), 10)

                        // Estimated time is 2 minutes more
                        var now = new Date().getTime()
                        var timeElapsed = now - parent.state.startTime
                        parent.setState({
                            estimatedTime: (timeElapsed + (120 * 1000))
                        })
                    }
                },
                    loc('find_me_match_asap', 'Find me any match as soon as possible')
                )
            )
        )
    },
    runTick: function () {
        if (this.state.stopped) return

        var now = new Date().getTime()
        var timeElapsed = now - this.state.startTime

        var canvas = this.refs.canvas
        if (!canvas) return
        var ctx = canvas.getContext('2d')

        var elapsedTimeCounter = this.refs.elapsedTime
        if (!elapsedTimeCounter) return

        elapsedTimeCounter.textContent = loc('time_elapsed', 'Elapsed Time') + ": " + (timeElapsed * 0.001).toString().toTimeString()

        var secondsElapsed = Math.round(timeElapsed * 0.001)
        if ((secondsElapsed % 6) == 0 && secondsElapsed != this.lastVerifiedSeconds) {
            this.lastVerifiedSeconds = secondsElapsed
            engine.call('OnMatchmakingSearchHeartbeat', secondsElapsed, this.state.estimatedTime)
        }

        // Sanity checks
        if (canvas.width > 4000 || canvas.height > 4000) {
            console.log("Dimensions exceeded 4000, width: " + canvas.width + ", height: " + canvas.height)
            return
        }

        // Reset canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        var clockTimeElapsed = timeElapsed % this.state.estimatedTime

        var timeElapsedPercentage = (this.state.estimatedTime == 0) ? 0 : timeElapsed / this.state.estimatedTime
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

        requestAnimationFrame(this.runTick)
    }
})