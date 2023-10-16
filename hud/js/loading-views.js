// Loading screen
// =============================================================================================

var LoadingView = React.createClass({
    getInitialState: function () {
        return {
            progress: 0,
            text: "",
            leftMessage: "",
            rightMessage: "",
            tooltipText: "",
            tip: "",
            tip2: "",
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshLoadingProgress = function (progress, text) {
            progress = Math.min(Math.max(progress, 0), 1)
            parent.setState({
                progress: progress,
                text: text,
            })
        }
        bindings.refreshLeftTeamLoadingMessage = function (message, tooltipText) {
            parent.setState({ leftMessage: message, tooltipText: tooltipText })
        }
        bindings.refreshRightTeamLoadingMessage = function (message, tooltipText) {
            parent.setState({ rightMessage: message, tooltipText: tooltipText })
        }
        bindings.refreshLoadingTip = function (tip) {
            parent.setState({ tip: tip })
        }
        bindings.refreshLoadingTip2 = function (tip) {
            parent.setState({ tip2: tip })
        }
    },
    render: function () {
        var done = this.state.progress == 1
        return (
            React.createElement('div', {
                id: "LoadingView",
                onMouseDown: function (e) { // v1.50
                    engine.trigger('enableChat', false)

                    if (e.button === 1) e.preventDefault(); // Disable middle-click scroll
                },
                style: {
                    pointerEvents: 'all'
                }
            },
                React.createElement('div', { className: 'anchor1' },
                    React.createElement('div', { className: 'loadingStickerColumn' },
                        React.createElement(LoadingSticker, { player: 1, flipped: false }),
                        React.createElement(LoadingSticker, { player: 2, flipped: false }),
                        React.createElement(LoadingSticker, { player: 3, flipped: false }),
                        React.createElement(LoadingSticker, { player: 4, flipped: false }),
                        React.createElement('div', { className: 'message' },
                            React.createElement('div', {
                                className: 'simple-tooltip',
                            },
                                React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: this.state.leftMessage
                                    }
                                }),
                                React.createElement('span', { className: 'tooltiptext' },
                                    this.state.tooltipText
                                )
                            )
                        )
                    )
                ),
                React.createElement('div', { className: 'anchor3' },
                    React.createElement('div', { className: 'loadingStickerColumn' },
                        React.createElement(LoadingSticker, { player: 5, flipped: true }),
                        React.createElement(LoadingSticker, { player: 6, flipped: true }),
                        React.createElement(LoadingSticker, { player: 7, flipped: true }),
                        React.createElement(LoadingSticker, { player: 8, flipped: true }),
                        React.createElement('div', { className: 'message' },
                            React.createElement('div', {
                                className: 'simple-tooltip',
                            },
                                React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: this.state.rightMessage
                                    }
                                }),
                                React.createElement('span', { className: 'tooltiptext' },
                                    this.state.tooltipText
                                )
                            )
                        )
                    )
                ),
                React.createElement('div', {
                    className: 'anchor1', style: {
                    }
                },
                    React.createElement('div', {
                        style: {
                            textAlign: 'center',
                            lineHeight: 'normal',
                        }
                    },
                        React.createElement('span', {
                            style: { color: "#666" }
                        },
                            this.state.text
                        )
                    )
                ),
                React.createElement('div', {
                    className: 'anchor6', style: {
                        marginBottom: "200px"
                    }
                },
                    React.createElement('div', {
                        style: {
                            textAlign: 'center',
                            lineHeight: 'normal',
                        }
                    },
                        React.createElement(LoadingStickerSpectator, { player: 13 }),
                        React.createElement(LoadingStickerSpectator, { player: 14 }),
                        React.createElement(LoadingStickerSpectator, { player: 15 }),
                        React.createElement(LoadingStickerSpectator, { player: 16 })
                    )
                ),
                React.createElement('div', {
                    className: 'anchor6', style: {
                        marginBottom: "80px"
                    }
                },
                    React.createElement('div', {
                        style: {
                            textAlign: 'center',
                            lineHeight: 'normal',
                        }
                    },
                        globalState.guildWarActive && React.createElement('div', {
                            style: { marginBottom: '1vh', display: 'block' },
                            className: 'simple-tooltip'
                        },
                            React.createElement('img', {
                                src: 'hud/img/icons/GuildWar.png',
                                style: { height: '32px', verticalAlign: 'middle', }
                            }),
                            React.createElement('span', {
                                style: { color: "#ff8800", marginLeft: '6px' }
                            },
                                loc('guild_war_match', 'This is a Guild War match!')
                            ),
                            React.createElement('span', {
                                className: 'tooltiptext auto',
                                dangerouslySetInnerHTML: {
                                    __html: loc('guild_faq_category_2_bullet_1', 'Every Saturday from 6 pm to 10 pm PST is a Guild War')
                                        + '<br/>' + loc('guild_faq_category_2_bullet_2', 'During a Guild War, the guild earns Victory Points (VP) when members win games:')
                                        + '<ul class="bulleted-tooltip">'
                                        + '<li>' + loc('guild_faq_category_2_bullet_3', '1st win: +5 VP (+5 additional VP if partied)') + '</li>'
                                        + '<li>' + loc('guild_faq_category_2_bullet_4', '2nd win: +5 VP (+5 additional VP if partied)') + '</li>'
                                        + '<li>' + loc('guild_faq_category_2_bullet_5', '3rd win: +5 VP (+5 additional VP if partied)') + '</li>'
                                        + '<li>' + loc('guild_faq_category_2_bullet_6', '4th win: +15 VP (+5 additional VP if partied)') + '</li>'
                                        + '<li>' + loc('guild_faq_category_2_bullet_7', 'No additional bonuses after 5 wins.') + '</li>'
                                        + '</ul>'
                                }
                            })
                        ),
                        this.state.tip && React.createElement('span', {
                            style: { color: "#fff" }
                        },
                            React.createElement('span', {
                                style: { color: "#33ff33" }
                            },
                                loc('loading_screen_tip', 'TIP:') + ' '
                            ),
                            React.createElement('span', {
                                dangerouslySetInnerHTML: {
                                    __html: linkify(this.state.tip)
                                }
                            })
                        ),
                        this.state.tip2 && React.createElement('div', {
                            style: { color: "#fff" }
                        },
                            React.createElement('span', {
                                dangerouslySetInnerHTML: {
                                    __html: linkify(this.state.tip2)
                                }
                            })
                        )
                    )
                )
            )
        )
    }
})

var LoadingSticker = React.createClass({
    propTypes: {
        player: React.PropTypes.number,
        flipped: React.PropTypes.bool
    },
    getInitialState: function () {
        return {
            name: "",
            guild: "",
            tagline: "",
            level: 0,
            rating: 0,
            image: "icons/NoIcon.png",
            stacks: 0,
            progress: 0,
            countryCode: "",
            lastSeasonRating: 0,
            countryName: "",
            disabled: false,
            isAlly: false,
            guildAvatar: "",
            guildAvatarStacks: 0,
            overrideRatingWithWins: 0,
            overrideRatingWithLosses: 0,
            incomeBonus: 0,
            newPlayer: false,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshLoadingSticker[this.props.player] = function (loadingStickerProperties) {
            //console.log('bindings.refreshLoadingSticker player: ' + parent.props.player + ', guild: ' + loadingStickerProperties.guild)
            console.log('loadingStickerProperties: ' + JSON.stringify(loadingStickerProperties))
            parent.setState({
                name: loadingStickerProperties.name,
                guild: loadingStickerProperties.guild,
                tagline: loadingStickerProperties.tagline,
                level: loadingStickerProperties.level,
                rating: loadingStickerProperties.rating,
                image: loadingStickerProperties.image,
                countryCode: loadingStickerProperties.countryCode,
                lastSeasonRating: loadingStickerProperties.lastSeasonRating,
                countryName: loadingStickerProperties.countryName,
                disabled: loadingStickerProperties.disabled,
                suffix: loadingStickerProperties.suffix,
                isAlly: loadingStickerProperties.isAlly,
                stacks: loadingStickerProperties.avatarStacks,
                guildAvatar: loadingStickerProperties.guildAvatar,
                guildAvatarStacks: loadingStickerProperties.guildAvatarStacks,
                overrideRatingWithWins: loadingStickerProperties.overrideRatingWithWins,
                overrideRatingWithLosses: loadingStickerProperties.overrideRatingWithLosses,
                incomeBonus: loadingStickerProperties.incomeBonus,
                newPlayer: loadingStickerProperties.newPlayer,
            })
        }
        bindings.refreshLoadingStickerProgress[this.props.player] = function (progress) {
            progress = Math.min(Math.max(progress, 0), 1)
            parent.setState({ progress: progress })
        }
    },
    render: function () {
        var done = this.state.progress == 1

        var isClassic = globalState.matchmakerQueue == 'Classic' || globalState.matchmakerQueue == 'ClassicNoob'
        var ratingImage = getRatingImageSimplified(this.state.rating, isClassic)

        // S3: show last season rating
        var ratingClass = getRatingClass(this.state.lastSeasonRating, false)
        var ratingClassThisSeason = getRatingClass(this.state.rating, isClassic)

        // v4.05: hide rating image if it's the other team
        //if (!this.state.isAlly) {
        //    ratingImage = getRatingImageSimplified(0)
        //    ratingClass = getRatingClass(0)
        //    ratingClassThisSeason = getRatingClass(0)
        //}

        if (this.state.disabled)
            return null

        var showSuffix = this.state.suffix != null && this.state.suffix != undefined && this.state.suffix.length > 0
        //console.log("render loadingSticker player " + this.props.player + ", suffix: " + this.state.suffix + ", showSuffix: " + showSuffix)

        var prettySuffix = ''
        if (this.state.suffix != null) {
            if (this.state.suffix == 'D')
                prettySuffix = ' <img src="hud/img/small-icons/2.png">'
            else if (this.state.suffix == 'T')
                prettySuffix = ' <img src="hud/img/small-icons/3.png">'
            else if (this.state.suffix == 'F')
                prettySuffix = ' <img src="hud/img/small-icons/4.png">'
            else if (this.state.suffix == 'B')
                prettySuffix = ' <img src="hud/img/small-icons/5.png">'
            else if (this.state.suffix == 'Q')
                prettySuffix = ' (Q)'
            else if (this.state.suffix.length > 0)
                prettySuffix = ' (' + this.state.suffix + ')'
        }

        var showWinsOverride = this.state.overrideRatingWithWins != null && (this.state.overrideRatingWithWins > 0 || this.state.overrideRatingWithLosses > 0)

        // SMELLY COPY AND PASTING BECAUSE OF MIRROR
        // STILL... really dirty

        //console.log('TEST: Loading Sticker name: ' + this.state.name + ', rating: ' + this.state.rating + ', isAlly: ' + this.state.isAlly
        //    + ', incomeBonus: ' + this.state.incomeBonus + ', ratingImage: ' + ratingImage + ', isClassic: ' + isClassic)

        return (
            React.createElement('div', { className: 'loadingSticker ' + ratingClass + (done ? ' done' : '') },
                this.state.newPlayer && React.createElement('div', { className: 'new-player' + (this.props.flipped ? ' flipped' : '') },
                    React.createElement('div', { className: 'simple-tooltip' },
                        React.createElement('span', { className: 'tooltiptext' },
                            React.createElement('span', {
                                dangerouslySetInnerHTML: {
                                    __html: loc('new_player_in_loading_screen', 'New player. Please be kind :innocent:. 30% Essence bonus if you win on their team.')
                                }
                            })
                        ),
                        React.createElement('img', { className: 'new-player-image', src: 'hud/img/emotes/innocent.png '})
                    )
                ),
                React.createElement('img', { className: 'loadingBorder', src: icons['border_' + ratingClass] }),
                React.createElement('div', { style: { height: '12px' } }), // Spacer
                this.props.flipped && React.createElement('div', { className: 'loadingStickerNameContainer' + (this.props.flipped ? ' flipped' : '') },
                    (globalState.shopEnabled && this.state.guildAvatar) && React.createElement('div', { className: 'loadingStickerGuild' },
                        this.state.guildAvatar && React.createElement('div', {
                            style: { position: 'relative', display: 'inline-block' }
                        },
                            React.createElement('div', { className: 'img-container ' + getGuildAvatarStacksClass(this.state.guildAvatarStacks) },
                                React.createElement('img', { src: 'hud/img/' + this.state.guildAvatar, className: 'guild-avatar' })
                            )
                        ),
                        this.state.guild
                    ),
                    !(globalState.shopEnabled && this.state.guildAvatar) && React.createElement('div', { style: { height: '20px' }}),
                    React.createElement('div', { className: 'loadingStickerName' },
                        this.state.countryCode && React.createElement('span', {
                            className: 'simple-tooltip flag-icon flag-icon-' + this.state.countryCode
                        },
                            React.createElement('span', { className: 'tooltiptext' }, this.state.countryName)
                        ),
                        React.createElement('span', {
                            dangerouslySetInnerHTML: {
                                __html: this.state.name + ' ' + prettySuffix
                            }
                        })
                    ),
                    React.createElement('div', { className: 'loadingStickerTagline', style: { paddingLeft: '8px' } },
                        this.state.tagline
                        //"They hold 100% of the mercs you don't send"
                    )
                ),
                React.createElement('div', { className: 'loadingStickerImageContainer' },
                    React.createElement('div', { className: getAvatarStacksClass(this.state.stacks) },
                        React.createElement('img', { src: 'hud/img/' + this.state.image, className: 'loadingStickerImage' })
                    ),
                    this.state.level > 0 && React.createElement('div', {
                        className: 'loadingStickerLevel ' + ratingClassThisSeason + (this.props.flipped ? ' flipped' : '') + ' simple-tooltip',
                        style: {
                            display: 'block',
                            zIndex: '1'
                        }
                    },
                        !this.props.flipped && this.state.isAlly && this.state.incomeBonus >= 1 && React.createElement('img', { style: { height: '12px', width: '12px' }, src: 'hud/img/icons/income.png' }),
                        !this.props.flipped && this.state.isAlly && this.state.incomeBonus >= 5 && React.createElement('img', { style: { height: '12px', width: '12px' }, src: 'hud/img/icons/income.png' }),
                        !this.props.flipped && this.state.isAlly && this.state.incomeBonus >= 10 && React.createElement('img', { style: { height: '12px', width: '12px' }, src: 'hud/img/icons/income.png' }),
                        !showWinsOverride && ratingImage && React.createElement('img', { src: ratingImage }),
                        !showWinsOverride && ratingImage && React.createElement('span', { className: 'rating-numeral', style: { width: '4px', display: 'inline-block' } }, getRatingDivisionNumeral(this.state.rating, isClassic)),
                        showWinsOverride && React.createElement('span', { className: 'rating-wins-override ' + getWinsColorClass(this.state.overrideRatingWithWins) }, 'W/L: ' + this.state.overrideRatingWithWins + ' - ' + this.state.overrideRatingWithLosses),
                        this.props.flipped && this.state.isAlly && this.state.incomeBonus >= 1 && React.createElement('img', { style: { height: '12px', width: '12px', marginLeft: '-4px' }, src: 'hud/img/icons/income.png' }),
                        this.props.flipped && this.state.isAlly && this.state.incomeBonus >= 5 && React.createElement('img', { style: { height: '12px', width: '12px' }, src: 'hud/img/icons/income.png' }),
                        this.props.flipped && this.state.isAlly && this.state.incomeBonus >= 10 && React.createElement('img', { style: { height: '12px', width: '12px' }, src: 'hud/img/icons/income.png' }),
                        React.createElement('span', { className: 'tooltiptext auto' }, getLocalizedRankName(ratingClassThisSeason, isClassic))
                        //this.state.rating
                    )
                ),
                !this.props.flipped && React.createElement('div', { className: 'loadingStickerNameContainer' + (this.props.flipped ? ' flipped' : '') },
                    globalState.shopEnabled && this.state.guildAvatar && React.createElement('div', { className: 'loadingStickerGuild' },
                        this.state.guildAvatar && React.createElement('div', {
                            style: { position: 'relative', display: 'inline-block' }
                        },
                            React.createElement('div', { className: 'img-container ' + getGuildAvatarStacksClass(this.state.guildAvatarStacks) },
                                React.createElement('img', { src: 'hud/img/' + this.state.guildAvatar, className: 'guild-avatar' })
                            )
                        ),
                        this.state.guild
                    ),
                    !(globalState.shopEnabled && this.state.guildAvatar) && React.createElement('div', { style: { height: '20px' }}),
                    React.createElement('div', { className: 'loadingStickerName' },
                        this.state.countryCode && React.createElement('span', {
                            className: 'simple-tooltip flag-icon flag-icon-' + this.state.countryCode
                        },
                            React.createElement('span', { className: 'tooltiptext' }, this.state.countryName)
                        ),
                        React.createElement('span', {
                            dangerouslySetInnerHTML: {
                                __html: this.state.name + ' ' + prettySuffix
                            }
                        })
                    ),
                    React.createElement('div', { className: 'loadingStickerTagline', style: { paddingRight: '8px' } },
                        this.state.tagline
                    )
                ),
                !done && React.createElement('div', { className: "progress-container" },
                    React.createElement('div', {
                        className: "progress-bar loading", style: {
                            width: (100 * this.state.progress) + "%"
                        }
                    })
                )
            )
        )
    }
})

var LoadingStickerSpectator = React.createClass({
    propTypes: {
        player: React.PropTypes.number,
    },
    getInitialState: function () {
        return {
            name: "",
            progress: 0,
            disabled: false,
            countryCode: "",
            countryName: "",
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshLoadingSticker[this.props.player] = function (loadingStickerProperties) {
            parent.setState({
                name: loadingStickerProperties.name,
                disabled: loadingStickerProperties.disabled,
                countryName: loadingStickerProperties.countryName,
                countryCode: loadingStickerProperties.countryCode,
            })
        }
        bindings.refreshLoadingStickerProgress[this.props.player] = function (progress) {
            progress = Math.min(Math.max(progress, 0), 1)
            parent.setState({ progress: progress })
        }
    },
    render: function () {
        if (this.state.progress == 0) return null
        var done = this.state.progress == 1

        if (this.state.disabled)
            return null

        return (
            React.createElement('div', { className: 'loadingStickerSpectator' + (done ? ' done' : '') },
                React.createElement('div', { className: 'loadingStickerNameContainer' },
                    this.state.countryCode && React.createElement('span', {
                        className: 'simple-tooltip flag-icon flag-icon-' + this.state.countryCode,
                        style: { marginRight: '4px' }
                    },
                        React.createElement('span', { className: 'tooltiptext' }, this.state.countryName)
                    ),
                    React.createElement('div', {
                        className: 'loadingStickerName',
                        dangerouslySetInnerHTML:
                        {
                            __html: this.state.name
                        }
                    })
                ),
                !done && React.createElement('div', { className: "progress-container" },
                    React.createElement('div', {
                        className: "progress-bar loading", style: {
                            width: (100 * this.state.progress) + "%"
                        }
                    })
                ),
                done && React.createElement('div', { className: 'ready' },
                    "[" + loc('ready', 'Ready') + "]"
                )
            )
        )
    }
})

console.log("--- DONE LOADING LOADING VIEWS ---")