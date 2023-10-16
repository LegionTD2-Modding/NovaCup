//This file includes any chat-related objects
//===============================================================================

// enum of previewModes, in case you need a new preview - for example something that starts with "/t " 
// that gives different results than the other previewModes you can use this in here, define its control key 
// and change the OnPreviewInputChanged in C# accordingly.
const PreviewModes = Object.freeze({ "emote": 1, "whisper": 2 })

const ChatType = Object.freeze({ "ingame": 1, "bottomBar": 2 })

var ChatView = React.createClass({
    propTypes: {
        chatType: ChatType
    },
    hideTimer: null,
    getInitialState: function () {
        return {
            compact: false,
            inGameChatOutput: [],
            controlKeyUsedForPreviews: ":",
            enabled: false,
            globalChatEnabled: globalState.globalChatEnabled,
            //input: "",
            isInPreview: false,
            markedPreview: "",
            previewMode: PreviewModes.emote,
            title: globalState.lastChatViewTitle,
            visible: false,
            autoFillEnabled: true,
        }
    },
    whisperIndex: 0,
    componentWillMount: function () {
        var parent = this
        var chatId = this.props.chatType
        bindings.toggleChat[chatId] = function () {
            switch (chatId) {
                case ChatType.bottomBar:
                    engine.trigger('enableChat', !parent.state.enabled)
                    break
                case ChatType.ingame:
                    setTimeout(function () { bindings.enableChat[chatId](!parent.state.enabled) }, 10)
                    break
                default:
                    console.warn("used chatType is not implemented inside chat-toggleChat")
                    break
            }
        }
        bindings.enableChat[chatId] = function (enabled) {
            switch (chatId) {
                case ChatType.bottomBar:
                    parent.setState({ enabled: enabled })
                    if (enabled)
                        parent.autoScrollAndFocus()
                    break
                case ChatType.ingame:
                    if (parent.state.isInPreview) {
                        // if we false-positive here, this would result in chat failing to open
                        // but playing the sound (aka the bug fixed in v7.05.2)
                        //console.log('do nothing since isInPreview')
                        return
                    }
                    engine.call("OnEnableInGameChat", enabled)
                    globalState.inGameChatEnabled = enabled // v1.54
                    // Clear old timeout, so we don't close the chat prematurely
                    if (parent.hideTimer != null)
                        clearTimeout(parent.hideTimer)

                    if (enabled)
                        parent.setState({ enabled: true, visible: true })
                    else {
                        parent.setState({ enabled: false })
                        // Set timeout if console is closed by the user
                        if (!parent.state.enabled) {
                            parent.hideTimer = setTimeout(function () {
                                parent.setState({ visible: false })
                            }, globalState.chatTimeout)
                        }
                    }

                    // test all chat
                    //engine.trigger('refreshInGameChatInput', '/all ');
                    break
                default:
                    console.warn("used chatType is not implemented inside chat-enableChat")
                    break
            }
        }
        bindings.refreshChatInput[chatId] = function (lineContent) {
            switch (chatId) {
                case ChatType.bottomBar:
                    var inputRef = parent.getInputField()
                    if (inputRef)
                        inputRef.value = lineContent

                    //parent.setState({ input: lineContent })
                    parent.getInputField().value = lineContent
                    break
                case ChatType.ingame:
                    parent.setState({
                        //input: lineContent,
                        visible: true,
                        enabled: true,
                    })

                    //parent.setState({ input: lineContent })
                    parent.getInputField().value = lineContent
                    break
                default:
                    console.warn("used chatType is not implemented inside chat-refreshChatInput")
                    break
            }
        }
        bindings.updateMarkedPreview[chatId] = function (newPreview) {
            parent.setState({ markedPreview: newPreview })
        }
        bindings.updateAndUsePreview[chatId] = function (newPreview) {
            parent.setState({ markedPreview: newPreview }, parent.useMarkedPreviewByClick(newPreview))
        }
        bindings.enableChatAutoFill[chatId] = function (autoFillEnabled) {
            parent.setState({ autoFillEnabled: autoFillEnabled })
        }

        switch (chatId) {
            case ChatType.ingame:
                this.mountIngameChatFeatures()
                break
            case ChatType.bottomBar:
                this.mountBottomBarChatFeatures()
                break
            default:
                console.warn("used chatType is not implemented inside chat-mountSpecificFeatures")
                break
        }
    },
    componentDidMount: function () {
        this.autoScrollAndFocus()
    },
    componentDidUpdate: function () {
        if (this.props.chatType != ChatType.ingame) return
        this.autoScrollAndFocus()

        // Tell client whether we are in isInPreview mode
        engine.call('OnUpdateIsInPreview', this.state.isInPreview)
    },
    mountIngameChatFeatures: function () {
        var parent = this
        var chatId = this.props.chatType
        bindings.forceUpdateChatOutput = function () {
            //console.log('forceUpdateChatOutput')
            parent.forceUpdate()
        }
        bindings.writeChatOutput[chatId] = function (lineContent, forceUpdate) {
            // v1.50: split characters longer than 28
            //console.log('old line content: ' + lineContent)
            //lineContent = splitString(lineContent, 28)
            //console.log('new line content: ' + lineContent)
            if (parent.props.chatType != ChatType.ingame) return
            line = { key: parent.state.inGameChatOutput.length, content: lineContent }

            // A bit of performance hit, but seems not usually noticeable?
            // v8.03.10 guessing at some performance improvement, let's try only linkify if there's a / (?)
            if (_.includes(line.content, '/'))
                line.content = linkify(line.content)

            parent.state.inGameChatOutput.push(line)
            if (forceUpdate)
                parent.forceUpdate()

            //console.log("writeInGameChatOutput: " + lineContent)

            // Clear old timeout, so we don't close the chat prematurely
            if (parent.hideTimer != null) {
                //console.log("we received a message --> clear old timeout")
                clearTimeout(parent.hideTimer)
            }

            // If console is currently closed, but we receive a message, then make it visible
            // + set a new timeout 
            if (!parent.state.enabled) {
                parent.setState({ visible: true })

                //console.log("we received a message & console was closed --> set new timeout")
                parent.hideTimer = setTimeout(function () {
                    //console.log("timeout expired")
                    parent.setState({ visible: false })
                }, globalState.chatTimeout)
            }
        }
        bindings.clearChat[chatId] = function () {
            parent.setState({
                inGameChatOutput: [],
                //input: ""
            })
            parent.getInputField().value = ""
        }
        // v6.03 for fixing an edge case where your chat gets all locked up
        // v7.05.2 note this is SMELLY COPY AND PASTED!!! :(
        bindings.forceDisablePreview = function () {
            console.log('ingame chat forceDisablePreview')
            parent.setState({ isInPreview: false })
            parent.forceUpdate()
        }
    },
    mountBottomBarChatFeatures: function () {
        var parent = this
        // v8.05 fix I think
        bindings.forceUpdateChatOutput = function () {
            //console.log('forceUpdateChatOutput')
            parent.forceUpdate()
        }
        bindings.setChatRoomProperties = function (properties) {
            var inputObject = parent.getInputField()
            if (inputObject != null)
                inputObject.value = ""

            // todo: do something with properties.chatRoomType if we want, such as displaying guild chats with a different color
            var compact = false
            var prefix = ""
            //if (properties.chatRoomType == 'PostGame')
            //    prefix = loc('game_chatroom', 'Game') + ' '
            if (properties.chatRoomType == 'Guild')
                prefix = loc('guild_chatroom', 'Guild') + ' '
            else if (properties.chatRoomType == 'InGame')
                compact = true

            var titleLabel = (properties.chatRoomName.length > 30) ? properties.chatRoomName.substr(0, 30) + ' ...' : properties.chatRoomName

            parent.setState({
                title: prefix + titleLabel,
                //input: "",
                compact: compact
            })

            if (parent.getInputField() != null)
                parent.getInputField().value = ""

            globalState.lastChatViewTitle = prefix + titleLabel
        }
        bindings.enableGlobalChat = function (globalChatEnabled) {
            parent.setState({ globalChatEnabled: globalChatEnabled })
            if (globalChatEnabled)
                parent.autoScrollAndFocus()
        }
        
        // v6.03 for fixing an edge case where your chat gets all locked up
        // v7.05.2 note this is SMELLY COPY AND PASTED!!! :(
        bindings.forceDisablePreview = function () {
            console.log('bottom bar forceDisablePreview')
            parent.setState({ isInPreview: false })
            parent.forceUpdate()
        }
    },
    autoScrollAndFocus: function () {
        if (this.props.chatType == ChatType.ingame) {
            var output = this.refs.output
            if (output) {
                output.scrollTop = output.scrollHeight
            }
        }

        var input = this.getInputField()
        if (!input) return
        setTimeout(function () { input.focus() }, 20)
    },
    onInputChange: function (event) {
        if (this.props.chatType == ChatType.ingame && !this.state.enabled) return
        //this.setState({ input: event.target.value })
        this.adjustDropdownOffset()
        if (this.state.isInPreview) {
            var index = 0
            switch (this.state.previewMode) {
                case PreviewModes.emote:
                    index = event.target.value.lastIndexOf(this.state.controlKeyUsedForPreviews)
                    // if the control key used is not ":" we need to include it to evaluate which emotes to take 
                    // -> "<" should only autocomplete "<3" and not ":)"
                    if (this.state.controlKeyUsedForPreviews != ":") index--
                    break
                case PreviewModes.whisper:
                    // in the whisper-autocompletion the first two letters ("/w") are always ignored to evaluate the input
                    index = 2
                    break
                default:
                    console.warn("used preview-mode not implemented inside chat-onInputChange.")
                    break
            }

            // we call OnPreviewInputChanged to evaluate the input from the user in C#. For example on the input "hi :smi"
            // the index would be 3 (index of ":" = 3) and since the input-length (7) is longer than 4 (index + 1)
            // we use the substring of anything starting at 4 (so in this case "smi") to evaluate the emotes.
            if (event.target.value.length > index + 1)
                engine.call('OnPreviewInputChanged', event.target.value.substr(index + 1), this.state.previewMode)
            else
                engine.call('OnPreviewInputChanged', "", this.state.previewMode)
        }
    },
    onInputKeyPress: function (e) {
        // v7.05.2 ignore this if we don't actually have chat open
        // v8.01: shouldn't bail if this isn't an in-game chat, otherwise autocomplete doesn't work for non-in-game chats
        if (this.props.chatType == ChatType.ingame && !globalState.isChatActive) return

        // the keyPress-event does not trigger on special keys (enter, backspace, arrow keys,..)
        // only control-key that allows to quit the emote-completion is ":"
        if (this.state.isInPreview && e.key == ":") {
            this.setState({ isInPreview: false })
            this.useMarkedPreview(e)
        }
        // three control-keys to enter the emote-completion (":), ;), <3")
        else if (!this.state.isInPreview && (e.key == ":" || e.key == ";" || e.key == "<")) {
            //console.log('key was: ' + e.key + ' --> set IsInPreview to true, isChatActive: ' + globalState.isChatActive)
            this.setState({ previewMode: PreviewModes.emote, controlKeyUsedForPreviews: e.key, markedPreview: "", isInPreview: true })
        }
    },
    onInputKeyDown: function (e) {
        // the keyDown-event only maps the .key-Property on special keys
        if (this.state.isInPreview) {
            this.ValidateInputInPreviewMode(e)
            if (this.state.markedPreview != '')
                return
        }
        else {
            if (e.key == " ") {
                // enter the whisper-autocompletion (starts with "/w ")
                if (this.getInputField().value == "/w")
                    this.setState({ isInPreview: true, previewMode: PreviewModes.whisper, markedPreview: "" })
            }
        }

        switch (e.key) {
            case " ":
                if (e.target.value == '/r') {
                    engine.call('OnWhisperReply', -1) // special case, to avoid having an extra space
                    this.whisperIndex = 0

                    if (isUnityHost) break
                    switch (this.props.chatType) {
                        case ChatType.bottomBar:
                            engine.trigger('refreshChatInput', '/w Jules')
                            break
                        case ChatType.ingame:
                            engine.trigger('refreshInGameChatInput', '/w Jules ')
                            break
                        default:
                            console.warn("used chattype is not implemented inside chat-onInputKeyDown-\" \"")
                            break
                    }
                }
                break
            case "Tab":
                if (_.startsWith(e.target.value, '/w')) { // startsWith doesn't work in Coherent I think
                    engine.call('OnWhisperReply', ++this.whisperIndex)

                    if (isUnityHost) break
                    switch (this.props.chatType) {
                        case ChatType.bottomBar:
                            engine.trigger('refreshChatInput', '/w ' + testWhisperPeople[this.whisperIndex % testWhisperPeople.length] + ' ')
                            break
                        case ChatType.ingame:
                            engine.trigger('refreshInGameChatInput', '/w ' + testWhisperPeople[this.whisperIndex % testWhisperPeople.length] + ' ')
                            break
                        default:
                            console.warn("used chattype is not implemented inside chat-onInputKeyDown-Tab")
                            break
                    }
                }
                break
            case "Enter":
                this.SendMessage(e)
                break
        }
    },
    SendMessage: function (e) {
        this.whisperIndex = 0

        // v8.03.8
        switch (this.props.chatType) {
            case ChatType.bottomBar:
                break
            case ChatType.ingame:
                this.refs.ingameInput.blur()
                break
        }

        // v8.05.2
        // https://stackoverflow.com/questions/10992921/how-to-remove-emoji-code-using-javascript
        // nvm, not needed; we just sanitize in the client
        //var sanitizedValue = e.target.value.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
        //console.log('e.target.value: ' + e.target.value)
        //console.log('e.target.value sanitized: ' + sanitizedValue)

        if (e.target.value == "") // don't send empty messages
            return

        switch (this.props.chatType) {
            case ChatType.bottomBar:
                if (!isUnityHost)
                    engine.trigger('writeChatOutput', { content: '<span style="color: #ffcc00;">Lisk</span>: ' + e.target.value, playfabId: 'DCCE8539810097B0', displayName: 'Lisk' }, true)
                engine.call('OnWriteChatInput', e.target.value)
                break
            case ChatType.ingame:
                if (!isUnityHost)
                    engine.trigger('writeInGameChatOutput', e.target.value)
                engine.call('OnWriteConsoleInput', e.target.value)
                break
            default:
                console.warn("used chattype is not implemented inside chat-onInputKeyDown-Enter")
                break
        }

        var newInputValue = "";

        // v7.00: Remember when we use /g or /p
        if (this.state.autoFillEnabled && e.target.value.length > 2) {
            switch (e.target.value.substring(0, 3)) {
                case "/g ":
                    newInputValue = "/g ";
                    break;
                case "/p ":
                    if (globalState.party != null && globalState.party.length > 1)
                        newInputValue = "/p ";
                    else
                        newInputValue = "";
                    break;
                default:
                    newInputValue = "";
                    break;
            }
        }

        e.target.value = newInputValue
        //this.setState({ input: newInputValue })

        // reset span
        var span = this.getInputWidthSpan()
        span.innerText = ""
        bindings.updatePreviewDropdownPosition[this.props.chatType](0)

        // v1.61
        if (this.props.chatType == ChatType.bottomBar)
            setTimeout(function () { engine.trigger('autoscrollChatOutput') }, 40)
    },
    ValidateInputInPreviewMode: function (e) {
        switch (e.key) {
            case "Backspace":
                switch (this.state.previewMode) {
                    case PreviewModes.emote:
                        var lastKey = e.target.value[e.target.value.length - 1]
                        if (lastKey == this.state.controlKeyUsedForPreviews) {
                            this.setState({ isInPreview: false })
                        }
                        break
                    case PreviewModes.whisper:
                        if (this.getInputField().value.length < 4)
                            this.setState({ isInPreview: false })
                        break
                    default:
                        console.warn("used preview-mode not implemented inside chat-onInputKeyDown.")
                        break
                }
                break
            case "Escape": // v6.00
                this.setState({ isInPreview: false })
                break
            case "ArrowUp":
            case "ArrowDown":
                bindings.switchMarkedPreviewByArrowKeys[this.props.chatType](e)
                // prevent the cursor from jumping around
                e.preventDefault()
                break
            case "Enter":
            case " ":
                switch (this.props.chatType) {
                    case ChatType.bottomBar:
                        this.useMarkedPreview(e)
                        this.setState({ isInPreview: false })
                        break
                    case ChatType.ingame:
                        this.useMarkedPreview(e)

                        // Delay it ~50ms, otherwise the "togglechat" stuff will happen before this is set to false and it would send the message
                        // prematurely. We basically want to lock the chat open while isInPreview is true.
                        var parent = this
                        setTimeout(function () { parent.setState({ isInPreview: false }) }, 50)
                        break
                    default:
                        console.warn("used chattype is not implemented inside chat-onInputKeyDown-Enter")
                        break
                }
                break
        }
    },
    useMarkedPreview: function (e) {
        if (this.state.markedPreview === "") return

        switch (this.state.previewMode) {
            case PreviewModes.emote:
                e.target.value = e.target.value.substr(0, e.target.value.lastIndexOf(this.state.controlKeyUsedForPreviews)) + this.state.markedPreview
                // special behavior: remove the last ":" if the state was quit using the control-key.
                if (e.key == ":") e.target.value = e.target.value.substr(0, e.target.value.length - 1)
                break
            case PreviewModes.whisper:
                e.target.value = e.target.value.substr(0, 3) + this.state.markedPreview + " "
                break
            default:
                console.warn("used preview-mode not implemented inside chat-useMarkedPreview.")
                break
        }
        //this.setState({ input: e.target.value })
    },
    useMarkedPreviewByClick: function (preview) {
        if (preview == "") return
        var inputField = this.getInputField()
        switch (this.state.previewMode) {
            case PreviewModes.emote:
                inputField.value = inputField.value.substr(0, inputField.value.lastIndexOf(this.state.controlKeyUsedForPreviews)) + preview
                break
            case PreviewModes.whisper:
                inputField.value = inputField.value.substr(0, 3) + preview + " "
                break
            default:
                console.warn("used preview-mode not implemented inside chat-useMarkedPreviewByClick.")
                break
        }
        //this.setState({ input: inputField.value, isInPreview: false })
        this.setState({ isInPreview: false })
        this.autoScrollAndFocus()
    },
    adjustDropdownOffset: function () {
        if (this.state.isInPreview) return
        var span = this.getInputWidthSpan()
    
        //span.innerText = this.state.input
        span.innerText = this.getInputField().value

        bindings.updatePreviewDropdownPosition[this.props.chatType](span.offsetWidth)
    },
    getInputField: function () {
        switch (this.props.chatType) {
            case ChatType.bottomBar:
                return this.refs.bottomBarInput
            case ChatType.ingame:
                return this.refs.ingameInput
            default:
                console.warn("used chatType is not implemented inside chat-getInputField")
                break
        }
    },
    getInputWidthSpan: function () {
        switch (this.props.chatType) {
            case ChatType.bottomBar:
                return this.refs.inputWidthSpanBottomBar
            case ChatType.ingame:
                return this.refs.inputWidthSpanIngame
            default:
                console.warn("used chatType is not implemented inside chat-getInputWidthSpan")
                break
        }
    },
    renderIngameChat: function () {
        var parent = this
        var isNarrow = globalState.screenWidth < 1800
        var consoleBottomOffset = isNarrow ? '275px' : '128px'

        return React.createElement(Module, {
            moduleId: 'console', width: 498, height: 200, defaultLeft: '0', defaultTop: '-328px', defaultBottom: consoleBottomOffset, defaultRight: 'unset', unclickable: (this.state.enabled ? false : true)
        },
            React.createElement('div', { id: 'Console', className: 'inGameChatWindow' + (this.state.enabled ? ' active' : ' passive') },
                React.createElement('div', {
                    id: "ContextMenuBacker",
                    className: this.state.enabled ? '' : ' hidden',
                    onMouseDown: function (e) {
                        if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                        engine.trigger('enableInGameChat', false)
                    },
                    style: { zIndex: -1 }
                }),
                this.state.visible && React.createElement('div', {
                    ref: 'output', className: 'inGameChatOutput' + (this.state.enabled ? ' scrollable' : ' unscrollable'),
                },
                    React.createElement('table', {},
                        React.createElement('div', {},
                            this.state.inGameChatOutput.map(function (line) {
                                return React.createElement('div', {
                                    key: line.key,
                                    className: 'output-line',
                                    dangerouslySetInnerHTML: {
                                        __html: line.content
                                    }
                                })
                            })
                        )
                    )
                ),
                React.createElement('div', { className: this.state.isInPreview ? '' : 'hidden' },
                    React.createElement(DropdownPreviewMenu, { chatType: this.props.chatType })
                ),
                React.createElement('input', {
                    ref: 'ingameInput',
                    className: 'consoleInput' + (this.state.enabled ? '' : ' hidden'),
                    onChange: this.onInputChange,
                    onKeyDown: this.onInputKeyDown,
                    onKeyPress: this.onInputKeyPress,
                    onFocus: function () {
                        engine.call('OnRefreshInputFocus', true)
                    },
                    onBlur: function () {
                        engine.call('OnRefreshInputFocus', false)
                        setTimeout(function () { parent.autoScrollAndFocus() }, 10)
                    },
                    //value: this.state.input
                }),
                React.createElement('span', {
                    style: { position: "absolute", left: "-100%", opacity: 0 },
                    ref: 'inputWidthSpanIngame'
                })
            )
        )
    },
    renderBottomBarChat: function () {
        return React.createElement('div', {},
            React.createElement('div', { id: 'ChatViewContainer' },
                React.createElement('span', {},
                    React.createElement(
                        VelocityComponent,
                        GetAnimationPreset1(this.state.enabled, 0, -20),
                        React.createElement('div', {},
                            React.createElement(BottomBarChatContent, {
                                id: 'ChatView',
                                title: this.state.title,
                                compact: this.state.compact,
                                globalChatEnabled: this.state.globalChatEnabled,
                            })
                        )
                    ),
                    React.createElement('div', { className: this.state.isInPreview ? '' : 'hidden' },
                        React.createElement(DropdownPreviewMenu, { chatType: this.props.chatType })
                    )),
                React.createElement('div', {
                    id: 'ChatViewLabel',
                    onMouseDown: function (e) {
                        if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                        engine.trigger('enableChat', true)
                    }
                },
                    this.state.title
                ),
                React.createElement('input', {
                    ref: 'bottomBarInput',
                    className: 'consoleInput',
                    placeholder: loc('enter_message', 'Enter message'),
                    onChange: this.onInputChange,
                    onKeyDown: this.onInputKeyDown,
                    onKeyPress: this.onInputKeyPress,
                    onMouseDown: function (e) {
                        if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                        engine.trigger('enableChat', true)
                    },
                    onFocus: function () {
                        engine.call('OnRefreshInputFocus', true)
                    },
                    onBlur: function () {
                        engine.call('OnRefreshInputFocus', false)
                    },
                    maxLength: "300" /* should correspond with what is allowed by server */
                }),
                React.createElement('span', {
                    style: { position: "absolute", left: "-100%", opacity: 0 },
                    ref: 'inputWidthSpanBottomBar'
                })
            )
        )
    },
    render: function () {
        return (this.props.chatType == ChatType.ingame ? this.renderIngameChat() : this.renderBottomBarChat())
    }
})

var DropdownPreviewMenu = React.createClass({
    propTypes: {
        chatType: ChatType
    },
    getInitialState: function () {
        return {
            selectedIndex: 0,
            selectedPreviewOption: {},
            previewOptions: [],
            positionXOffset: 10
        }
    },
    componentWillMount: function () {
        var parent = this
        var chatId = this.props.chatType
        bindings.updatePreviewOptions[chatId] = function (previewList, markNoPreviewOption) {
            parent.setState({ previewOptions: previewList })
            if (previewList.length < 1 || markNoPreviewOption) {
                parent.setState({ selectedPreviewOption: "", selectedIndex: -1 })
                bindings.updateMarkedPreview[chatId]("")
            }
            else {
                parent.setState({ selectedPreview: parent.state.previewOptions[0], selectedIndex: 0 })
                bindings.updateMarkedPreview[chatId](previewList[0].name)
            }
        }
        bindings.updatePreviewDropdownPosition[chatId] = function (newOffset) {
            parent.setState({ positionXOffset: newOffset })
        }
        bindings.switchMarkedPreviewByArrowKeys[chatId] = function (e) {
            var oldIndex = parent.state.selectedIndex
            switch (e.key) {
                case "ArrowUp":
                    if (oldIndex <= 0) break
                    parent.setState({ selectedIndex: oldIndex - 1, selectedPreview: parent.state.previewOptions[oldIndex - 1] })
                    bindings.updateMarkedPreview[chatId](parent.state.previewOptions[oldIndex - 1].name)
                    break
                case "ArrowDown":
                    if (parent.state.previewOptions.length <= oldIndex + 1) break
                    parent.setState({ selectedIndex: oldIndex + 1, selectedPreview: parent.state.previewOptions[oldIndex + 1] })
                    bindings.updateMarkedPreview[chatId](parent.state.previewOptions[oldIndex + 1].name)
                    break
            }
        }
    },
    render: function () {
        var parent = this
        var showPreviewOptions = false
        switch (this.props.chatType) {
            case ChatType.bottomBar:
                showPreviewOptions = globalState.chatEnabled
                break
            case ChatType.ingame:
                showPreviewOptions = globalState.inGameChatEnabled
                break
            default:
                console.warn("used chatType is not implemented inside dropdownPreview-render")
                break
        }

        return (
            React.createElement('div', { id: "ChatPreview", style: { left: parent.state.positionXOffset } },
                React.createElement('div', {
                    className: 'chatPreviewDropdown' + (parent.state.previewOptions == undefined || parent.state.previewOptions.length <= 0 || !showPreviewOptions ? " hidden" : "")
                },
                    parent.state.previewOptions.map(function (entry, index) {
                        return React.createElement('div', {
                            key: index,
                            className: 'chatPreviewDropdownItem ' + (parent.state.selectedIndex != undefined && parent.state.selectedIndex == index ? ' selected' : '')
                                + (entry == undefined || entry.name == "" ? ' hidden' : ''),
                            onMouseDown: function (e) {
                                if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                parent.setState({ selectedIndex: index, selectedPreview: parent.state.previewOptions[index] })
                                bindings.updateAndUsePreview[parent.props.chatType](parent.state.previewOptions[index].name)
                            }
                        },
                            React.createElement('img', { src: entry != undefined && entry.icon != undefined ? entry.icon : "" }),
                            React.createElement('span', null, entry != undefined ? entry.originalName : "")
                        )
                    })
                )
            )
        )
    }
})

var BottomBarChatContent = React.createClass({
    forceUpdateTimeout: null,
    lastMessageCount: 0,
    propTypes: {
        compact: React.PropTypes.bool,
        globalChatEnabled: React.PropTypes.bool,
        title: React.PropTypes.string,
    },
    getInitialState: function () {
        return {
            inGameChatOutput: [],
            subscribers: { playerLists: [] },
            amountOfSubscribers: 0,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.writeChatOutput[ChatType.bottomBar] = function (message, forceUpdate) {
            line = message

            // A bit of performance hit, but seems not usually noticeable?
            // v8.03.12 maybe optimization
            if (_.includes(line.content, '/'))
                line.content = linkify(line.content)

            parent.state.inGameChatOutput.push(line)

            // v8.03.12 Performance hack to bail early if this element isn't visible, so menu doesn't lag too much if you aren't actively chatting
            var reactObject = parent.refs.inGameChat
            var top = 0
            if (reactObject != null)
                top = reactObject.getBoundingClientRect().top
            if (top == 0) {
                return
            }

            //console.log('writeChatOutput ' + message + ', forceUpdate: ' + forceUpdate)
            if (forceUpdate) {
                // v8.05.2 no longer used apparently
                //parent.handleNewMessages()

                parent.forceUpdate()
            } else {
                if (parent.forceUpdateTimeout)
                    clearTimeout(parent.forceUpdateTimeout)
                parent.forceUpdateTimeout = setTimeout(function () {
                    parent.forceUpdate()
                }, 100)
            }
        }
        bindings.refreshChatSubscribers = function (subscribers, amountOfSubscribers) {
            // v8.03.12 Performance hack to bail early if this element isn't visible, so menu doesn't lag too much if you aren't actively chatting
            var reactObject = parent.refs.inGameChat
            var top = 0
            if (reactObject != null)
                top = reactObject.getBoundingClientRect().top
            if (top == 0) {
                //console.log("Bail early since we had nonzero subscribers and hidden UI --> update state without calling render??")
                parent.state.subscribers = subscribers
                parent.state.amountOfSubscribers = amountOfSubscribers
                return
            }

            //console.log('TEST: refreshChatSubscribers amount: ' + amountOfSubscribers + ', subs: ' + JSON.stringify(subscribers))
            parent.setState({ subscribers: subscribers, amountOfSubscribers: amountOfSubscribers })
        }
        bindings.clearChat[ChatType.bottomBar] = function () {
            //console.log('TEST: clearChat')
            parent.state.inGameChatOutput = []
            parent.forceUpdate()
        }
        bindings.autoscrollChatOutput = function () {
            parent.autoScrollAndFocus()
        }
    },
    componentDidMount: function () {
        var output = this.refs.output
        this.autoScrollAndFocus()
    },
    componentDidUpdate: function () {
        var parent = this

        var lazyLoadedImages = document.getElementsByClassName("lazyloaded");
        for (var i = 0; i < lazyLoadedImages.length; i++) {
            if (lazyLoadedImages[i].getAttribute("src") != lazyLoadedImages[i].getAttribute("data-src"))lazyLoadedImages[i].classList.add("lazyload");
        }

        // v1.61: only autoscroll chat if we're at the bottom
        var output = this.refs.output
        var scrollHeight = output.scrollHeight - output.offsetHeight

        setTimeout(function () {
            //console.log('componentDidUpdate a bit delay')
            //console.log('scrollHeight: ' + output.scrollHeight)
            //console.log('offsetHeight: ' + output.offsetHeight)
            //console.log('offsetTop: ' + output.offsetTop)
            if (output != null && output.scrollTop >= scrollHeight - 36) {
                //console.log("we are at/close to the bottom " + output.scrollTop + "/" + scrollHeight + " so scroll")
                parent.autoScrollAndFocus()
            }
            else {
                //console.log("we are not at the bottom " + output.scrollTop + "/" + scrollHeight + " so do not scroll, just forceUpdate()")
                //parent.forceUpdate()
            }
        }, 30)
    },
    autoScrollAndFocus: function () {
        var output = this.refs.output
        xyz = output
        if (output) {
            //console.log('autoScrollAndFocus(): ' + output.scrollHeight)
            output.scrollTop = output.scrollHeight
            //output.scrollTopMax; // doesn't exist in coherent
        }
    },
    render: function () {
        var parent = this
        var subscriberKey = 0

        var isGlobalChat = parent.props.title == loc('global_chat', 'Global Chat') || "Local Chat"
        var isNarrow = globalState.screenWidth < 1800
        var chatDisabled = !parent.props.globalChatEnabled && isGlobalChat

        //console.log('TEST: render bottom bar, amountOfSubscribers: ' + this.state.amountOfSubscribers
        //    + ', this.state.inGameChatOutput.length: ' + this.state.inGameChatOutput.length)

        return (
            React.createElement('div', { id: 'InGameChat', className: 'inGameChatWindow', ref: 'inGameChat' },
                React.createElement('div', { className: 'topbar' },
                    React.createElement('div', {},
                        React.createElement('div', { className: 'title' },
                            this.props.title,
                            React.createElement('span', {
                                dangerouslySetInnerHTML: {
                                    __html: ' ' + loc('in_chat', '(' + this.state.amountOfSubscribers + ')',
                                        [this.state.amountOfSubscribers])
                                }
                            })
                        ),
                        React.createElement('div', {
                            className: 'button minimize',
                            onMouseDown: function (e) {
                                if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                                engine.trigger('enableChat', false)
                            }
                        }, "-"),
                        React.createElement('div', {
                            className: 'button gear',
                            onMouseDown: function (e) {
                                var left = e.nativeEvent.clientX
                                var top = e.nativeEvent.clientY

                                if (e.nativeEvent.which == 2) return // v2.22 fix

                                openContextMenu("", loc('chat_settings', 'Chat Settings'), chatMenu, left, top, true)
                            }
                        },
                            React.createElement('img', { src: 'hud/img/hudv2/gear16.png' })
                        )
                    )
                ),
                chatDisabled && React.createElement('div', {
                    className: 'chatOptIn', style: {
                        width: isNarrow ? '370px' : ''
                    }
                },
                    React.createElement('div', {},
                        loc('global_chat_moderated', 'Note: This is a moderated chat. Please be respectful and avoid spam/excessive venting, or you may be muted.')
                    ),
                    React.createElement('div', {
                        className: 'button normal',
                        onMouseDown: function (e) {
                            if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness

                            engine.trigger('enableGlobalChat', true)
                        }
                    },
                        //loc('enable_global_chat', 'Enable Global Chat')
                        // v8.03.8
                        loc('i_understand', 'I understand')
                    )
                ),

                // Lobby chat
                React.createElement('div', {
                    ref: 'output', className: 'inGameChatOutput scrollable'
                        + (this.props.compact ? ' compact' : '')
                        + (chatDisabled ? ' tall' : '')
                },
                    this.state.inGameChatOutput.map(function (line) {
                        line.content = twemoji.parse(line.content, {
                            className: 'emoji-icon'
                        })

                        // v10.02 parse line breaks
                        line.content = line.content.replace(/(?:\r\n|\r|\n)/g, '<br>');

                        // v8.03.8 always show chat now regardless of their setting
                        //if (chatDisabled && line.playFabId != '') return null

                        return React.createElement('div', {
                            className: 'output-line', style: { pointerEvents: 'all' } },
                            React.createElement('div', { className: 'simple-tooltip' },
                                line.tooltip && React.createElement('span', { className: 'tooltiptext auto', dangerouslySetInnerHTML: { __html: line.tooltip } }),
                                React.createElement('span', {
                                    style: { pointerEvents: 'all'},
                                    onMouseDown: function (e) {
                                        if (e.nativeEvent.which == 2 || line.playFabId == '') return

                                        var left = e.nativeEvent.clientX
                                        var top = e.nativeEvent = e.nativeEvent.clientY

                                        openContextMenu(line.playFabId, line.displayName, rightClickChatPersonMenu, left, top)
                                    }
                                    },
                                    React.createElement('span', { dangerouslySetInnerHTML: { __html: line.identifier } })
                                ),
                            React.createElement('span', { dangerouslySetInnerHTML: { __html: line.content } })
                            )
                        )
                    })
                ),
                React.createElement('div', {
                    className: 'inGameChatSubscribers scrollable' + (this.props.compact ? ' compact' : '')
                },
                    this.state.subscribers.playerLists.map(function (playerList) {
                        if (playerList.players.length < 1) return null

                        var useLazyLoad = playerList.players.length > 15

                        return React.createElement('div', {},
                            React.createElement('div', { className: 'memberGroupTitle' }, playerList.title + " (" + playerList.players.length + ")"),
                            playerList.players.map(function (player) {
                                return React.createElement('div', {
                                    key: subscriberKey++,
                                    className: 'subscriber-line',
                                    onMouseDown: function (e) {
                                        //if (e.nativeEvent.which != 3) return // Force right click
                                        var left = e.nativeEvent.clientX
                                        var top = e.nativeEvent.clientY

                                        if (e.nativeEvent.which == 2) return // v2.22 fix

                                        if (player.ingame)
                                            openContextMenu(player.playFabId, player.name, rightClickChatPersonMenuInGame, left, top)
                                        else
                                            openContextMenu(player.playFabId, player.name, rightClickChatPersonMenu, left, top)
                                    }
                                },
                                    React.createElement('span', { className: getAvatarStacksClass(player.avatarStacks) },
                                        // Lazy load: note, this seems to produce duplicated avatars sometimes... https://i.imgur.com/D1UcgPg.png
                                        useLazyLoad && React.createElement('img', { className: 'chat-avatar lazyload', 'alt': 'avatar', src: 'hud/img/icons/NoIcon.png', 'data-src': 'hud/img/' + player.avatar }),
                                        // Non-lazy load
                                        !useLazyLoad && React.createElement('img', { className: 'chat-avatar', src: 'hud/img/'+player.avatar })
                                    ),
                                    React.createElement('span', { style: { color: playerList.color } },
                                        player.name,
                                        player.suffix
                                    )
                                )
                            }))
                    })
                )
            )
        )
    }
})