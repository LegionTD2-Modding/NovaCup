// Feed aka Kill Tracker (right side notifications, in-game)
// ===============================================================================

var Feed = React.createClass({
    nextKey: 0,
    getInitialState: function () {
        return {
            feedMessages: [],
            hovered: false
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.addFeedMessage = function (header, content, lifespan, image) {
            var feedObject = {
                key: parent.nextKey,
                header: header,
                content: content,
                lifespan: lifespan,
                image: image,
            }

            // For event history I think
            globalState.savedFeedMessages.push(feedObject)

            // We assume we won't need to recycle feed message keys for now
            parent.nextKey++

            // v3.00a
            if (header == "history_only") return

            // If reached max capacity, kill the oldest
            if (parent.state.feedMessages.length >= 8)
                parent.state.feedMessages.shift()

            parent.state.feedMessages.push(feedObject)
            parent.forceUpdate()

            // Lifespan
            setTimeout(function () { engine.trigger('closeFeedMessage', feedObject.key) }, feedObject.lifespan)
        }
        bindings.closeFeedMessage = function (id) {
            var newFeedMessages = []
            for (i in parent.state.feedMessages) {
                if (parent.state.feedMessages[i].key != id)
                    newFeedMessages.push(parent.state.feedMessages[i])
            }
            parent.setState({ feedMessages: newFeedMessages })
        }
        bindings.clearFeed = function () {
            parent.setState({ feedMessages: [] })
        }
    },
    render: function () {

        var isNarrow = globalState.screenWidth < 1800

        var parent = this
        return (
            React.createElement(Module, { moduleId: 'feed', width: 380, height: isNarrow ? 200 : 306, defaultLeft: '0px', defaultTop: '-74px', defaultBottom: 'unset', defaultRight: 'unset' },
                React.createElement('ul', {
                    id: 'feed',
                    onMouseOver: function () {
                        if (parent.state.feedMessages.length == 0) return
                        parent.setState({ hovered: true })
                        engine.call("OnMouseOverFeed")
                    },
                    onMouseLeave: function () {
                        parent.setState({ hovered: false })
                    }
                },
                    //React.createElement('img', {
                    //    src: 'hud/img/notifications/trash.png',
                    //    className: 'hud-button' + (this.state.hovered ? '' : ' invisible'),
                    //    style: {
                    //        textAlign: 'right',
                    //        float: 'right',
                    //        width: '32px'
                    //    },
                    //    onMouseDown: function (e) {
                    //        if (e.nativeEvent.which == 1) {
                    //            console.log("clear feed")
                    //            engine.trigger('clearFeed')
                    //        }
                    //    }
                    //}),
                    React.createElement(VelocityTransitionGroup, {
                        component: 'div',
                        enter: {
                            animation: {
                                translateX: '0px',
                                translateY: '0px',
                                opacity: 1,
                                height: '100%',
                            },
                            duration: 200
                        },
                        leave: {
                            animation: {
                                translateX: 0 + 'px',
                                translateY: -20 + 'px',
                                opacity: 0,
                                height: 0,
                            },
                            duration: 200
                        },
                    },
                        this.state.feedMessages.map(function (feedObject) {
                            return React.createElement(FeedMessage, {
                                key: feedObject.key,
                                header: feedObject.header,
                                content: feedObject.content,
                                image: feedObject.image,
                                id: feedObject.key
                            })
                        })
                    )
                )
            )
        )
    }
})

var FeedMessage = React.createClass({
    propTypes: {
        header: React.PropTypes.string,
        content: React.PropTypes.string,
        image: React.PropTypes.string,
        id: React.PropTypes.number,
    },
    render: function () {
        var parent = this
        return (
            React.createElement('li', {
                className: 'feedMessage',
                onMouseDown: function (e) {
                    if (e.nativeEvent.which == 1) {
                        console.log("close feed message " + parent.props.id)
                        engine.trigger('closeFeedMessage', parent.props.id)
                        engine.call("OnCloseFeedMessage")
                    }
                }//,
                //onMouseOver: function () { console.log("onMouseOver feedMessage") },
                //onMouseLeave: function () { console.log("onMouseLeave feedMessage") },
            },
                this.props.image && React.createElement('img', {
                    className: 'left-icon',
                    src: 'hud/img/' + this.props.image
                }),
                React.createElement('div', { className: 'text-container' },
                    React.createElement('div', {
                        className: 'header',
                        dangerouslySetInnerHTML: { __html: this.props.content }
                    })
                )
            )
        )
    }
})

// Client notifications (adapted aka sort of copy and pasted from above)
//========================================================================================================

var ClientNotifications = React.createClass({
    nextKey: 0,
    getInitialState: function () {
        return {
            notificationMessages: [],
            hovered: false
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.addNotificationMessage = function (header, content, duration, customStyle, customHeaderStyle, image) {
            var notificationObject = {
                key: parent.nextKey,
                header: header,
                content: content,
                lifespan: duration * 1000,
                customStyle: customStyle,
                customHeaderStyle: customHeaderStyle,
                image: image,
            }

            // We assume we won't need to recycle notification message keys for now
            parent.nextKey++

            // If reached max capacity, kill the oldest
            if (parent.state.notificationMessages.length >= 4)
                parent.state.notificationMessages.shift()

            parent.state.notificationMessages.push(notificationObject)
            parent.forceUpdate()

            // Lifespan
            setTimeout(function () { engine.trigger('closeNotificationMessage', notificationObject.key, true) }, notificationObject.lifespan)
        }
        bindings.closeNotificationMessage = function (id) {
            var newNotificationMessages = []
            for (i in parent.state.notificationMessages) {
                if (parent.state.notificationMessages[i].key != id)
                    newNotificationMessages.push(parent.state.notificationMessages[i])
            }
            parent.setState({ notificationMessages: newNotificationMessages })
        }
        bindings.clearNotifications = function () {
            parent.setState({ notificationMessages: [] })
            // should we reset the nextKey here? hmm
        }
    },
    componentDidUpdate: function() {
    },
    render: function () {
        var parent = this

        return (
            React.createElement('ul', {
                id: 'Notifications',
                onMouseOver: function () {
                    if (parent.state.notificationMessages.length == 0) return
                    parent.setState({ hovered: true })
                    engine.call("OnMouseOverNotification")
                },
                onMouseLeave: function () {
                    parent.setState({ hovered: false })
                }
            },
                React.createElement('div', { style: { textAlign: 'right' } },
                    React.createElement('img', {
                        src: 'hud/img/notifications/trash.png',
                        className: 'hud-button' + (this.state.hovered ? '' : ' invisible'),
                        onMouseDown: function (e) {
                            if (e.nativeEvent.which == 1) {
                                console.log("clear notifications")
                                engine.trigger('clearNotifications')
                            }
                        }
                    })
                ),
                React.createElement(VelocityTransitionGroup, {
                    component: 'div',
                    enter: {
                        animation: {
                            translateX: '0px',
                            translateY: '0px',
                            opacity: 1,
                            height: '100%',
                        },
                        duration: 200
                    },
                    leave: {
                        animation: {
                            translateX: 0 + 'px',
                            translateY: -20 + 'px',
                            opacity: 0,
                            height: 0,
                        },
                        duration: 200
                    },
                },
                    this.state.notificationMessages.map(function (notificationObject) {
                        return React.createElement(NotificationMessage, {
                            key: notificationObject.key,
                            header: notificationObject.header,
                            content: notificationObject.content,
                            id: notificationObject.key,
                            image: notificationObject.image,
                            customStyle: notificationObject.customStyle,
                            customHeaderStyle: notificationObject.customHeaderStyle,
                        })
                    })
                )
            )
        )
    }
})

var NotificationMessage = React.createClass({
    propTypes: {
        header: React.PropTypes.string,
        content: React.PropTypes.string,
        image: React.PropTypes.string,
        id: React.PropTypes.number,
        customStyle: React.PropTypes.string,
        customHeaderStyle: React.PropTypes.string,
    },
    render: function () {
        var parent = this
        return (
            React.createElement('li', {
                className: 'feedMessage',
                style: this.props.customStyle,
                onMouseDown: function (e) {
                    if (e.nativeEvent.which == 1) {
                        console.log("close notification message " + parent.props.id)
                        engine.trigger('closeNotificationMessage', parent.props.id)
                        engine.call("OnCloseNotificationMessage")
                    }
                },
            },
                this.props.image && React.createElement('img', {
                    className: 'left-icon',
                    src: 'hud/img/' + this.props.image
                }),
                React.createElement('div', { className: 'text-container' },
                    React.createElement('div', {
                        className: 'header',
                        style: this.props.customHeaderStyle,
                        dangerouslySetInnerHTML: { __html: this.props.header }
                    }),
                    React.createElement('div', {
                        className: 'content',
                        dangerouslySetInnerHTML: { __html: this.props.content }
                    })
                )
            )
        )
    }
})