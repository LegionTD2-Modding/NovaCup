var cardArtTheme = 'metal' // 'lava'
getCardArt = function (item, showBuyButton, lockedDescription) {
    var splashImage = item.image.replace('Icons/', 'splashes/');
    splashImage = splashImage.replace('icons/', 'splashes/');
    var name = item.name.replace(' Card', '')
    var description = item.description
    var stacksThreshold = 1
    if (item.stacks && item.stacks > 0)
        stacksThreshold = getAvatarStacksThreshold(item.stacks)

    var cfCurrencyName = loc('card_fragments', 'Card Fragments')

    var cfPrice = 0
    if (item.price && item.price.cf && !isNaN(item.price.cf))
        cfPrice = item.price.cf
    var newCfBalance = globalState.cardFragments - cfPrice
    var enoughCF = newCfBalance >= 0

    var isNarrow = globalState.screenWidth < 1800
    var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160

    var indexForFlip = 0

    return React.createElement('div', { className: 'card-art-container' },
        globalState.getCardArtShowSecretCardSelection && React.createElement('div', {
            className: 'secret-card-selection-container'
        },
            React.createElement('div', {
                className: 'secret-card-selection',
                style: {
                    width: uhd ? '2000px' : '',
                    left: uhd ? '-816px' : '',
                    height: uhd ? '732px' : ''
                }
            },
                React.createElement('div', {
                    style: {
                        fontSize: '24px',
                        margin: '-10px 0 10px 0'
                    }
                },
                    //React.createElement('div', {}, loc('you_have_card_fragments', 'You have ' + globalState.cardFragments, [globalState.cardFragments])),
                    React.createElement('div', {}, loc('select_card_to_unlock', 'Select card to unlock'))
                ),
                React.createElement('div', { className: 'items scrollable' },
                    globalState.allCardTypes.map(function (card, index) {
                        var splash = ''
                        if (uhd) {
                            splash = card.image.replace('icons/', 'splashes/')
                            splash = card.image.replace('Icons/', 'splashes/')
                        }

                        var flipTooltip = false
                        var flipTooltipY = false
                        if (indexForFlip % 12 >= 10)
                            flipTooltip = true
                        if (indexForFlip <= 12)
                            flipTooltipY = true
                        indexForFlip++

                        return React.createElement('div', {
                            className: 'simple-tooltip equipped' + (flipTooltip ? ' flipped' : '') + (flipTooltipY ? ' flipped-y' : ''),
                            onMouseEnter: function () {
                                engine.call("OnMouseOverLight", card.name.length)
                            }
                        },
                            React.createElement('img', {
                                src: 'hud/img/' + (uhd ? splash : card.image),
                                className: 'card icon',
                                style: {
                                    width: uhd ? '128px' : (isNarrow ? '36px' : '')
                                },
                                onMouseDown: function (e) {
                                    console.log('click card: ' + card.name)
                                    globalState.getCardArtShowSecretCardSelection = false
                                    showFullScreenPopup(getCardArt(card, true, false))
                                }
                            }),
                            React.createElement('img', { src: 'hud/img/shop/rarity/' + card.rarity + '.png', className: 'rarity' }),
                            React.createElement('div', { className: 'tooltiptext auto' },
                                React.createElement('div', { className: card.rarity },
                                    card.name,
                                    React.createElement('img', { src: 'hud/img/shop/currency/CardFragments_16.png' }),
                                    React.createElement('span', { style: { color: '#fff' } },
                                        card.price.cf
                                    )
                                ),
                                //React.createElement('div', {
                                //    dangerouslySetInnerHTML: {
                                //        __html: card.description
                                //    }
                                //}),
                                React.createElement('div', {},
                                    React.createElement('span', {
                                        dangerouslySetInnerHTML: {
                                            __html: loc('you_have_card_fragments', 'You have <img class="tooltip-icon" src="hud/img/icons/CardFragment.png">' + globalState.cardFragments, [globalState.cardFragments])
                                        }
                                    })
                                )
                            )
                        )
                    })
                )
            )
        ),
        React.createElement('img', { className: 'back ' + cardArtTheme, src: 'hud/img/cards/' + cardArtTheme + '/back.png' }),
        React.createElement('img', { className: 'front-bg ' + cardArtTheme, src: 'hud/img/cards/' + cardArtTheme + '/front_bg.png' }),
        React.createElement('img', { className: 'splash-image ' + cardArtTheme, src: 'hud/img/' + splashImage }),
        React.createElement('img', { className: 'front-frame ' + cardArtTheme + ' ' + item.rarity, src: 'hud/img/cards/' + cardArtTheme + '/front_frame_' + stacksThreshold + '.png' }),
        React.createElement('div', { className: 'front-name ' + cardArtTheme }, name),
        !lockedDescription && React.createElement('div', { className: 'front-description ' + cardArtTheme, dangerouslySetInnerHTML: { __html: description } }),
        lockedDescription && React.createElement('div', { className: 'front-description ' + cardArtTheme },
            React.createElement('img', { src: 'hud/img/shop/lock_big.png' })
        ),
        // Old sell code
        //showSellButton && React.createElement('div', { className: 'convert-container' },
        //    React.createElement('span', {
        //        className: 'button',
        //        style: { marginRight: '16px' },
        //        onMouseDown: function (e) {
        //            engine.trigger('escape')
        //        }
        //    }, loc('back', 'Back')),
        //    React.createElement('span', {
        //        className: 'convert button em',
        //        onMouseDown: function (e) {
        //            console.log('convert ' + name + ' (' + item.id + ') to essence')
        //            engine.call('OnClickConvertToEssence', item.id)

        //            if (!isUnityHost)
        //                engine.trigger('loadConfirmConversionPopup', item.id, name, item.image, globalState.currency, globalState.currency + 1000, 1, 0)
        //        }
        //    }, loc('convert_to_essence', 'Convert to Essence'))
        //),
        showBuyButton && React.createElement('div', { className: 'convert-container' },
            //React.createElement('span', {
            //    className: 'button big',
            //    style: { marginRight: '16px' },
            //    onMouseDown: function (e) {
            //        engine.trigger('escape')
            //    }
            //}, loc('back', 'Back')),
            !globalState.isInGame && cfPrice > 0 && React.createElement('div', {
                className: 'button currency em slate' + (!enoughCF ? ' disabled simple-tooltip' : ''),
                onMouseEnter: function (e) {
                    engine.call("OnMouseOverMedium", 1)
                },
                onMouseDown: function (e) {
                    if (!enoughCF) {
                        engine.trigger('notEnoughCF')
                        return
                    }
                    loadConfirmPurchasePopup({
                        itemType: item.id,
                        name: item.name,
                        image: item.image,
                        essence: globalState.currency,
                        newEssence: globalState.currency,
                        premiumEssence: globalState.premiumEssence,
                        newPremiumEssence: globalState.premiumEssence,
                        cardFragments: globalState.cardFragments,
                        newCardFragments: newCfBalance,
                    },
                        function () {
                            engine.call('OnBuyItem', item.id, 'CF')
                        }
                    )
                }
            },
                React.createElement('div', { className: 'currency-button-container' },
                    React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/CardFragments_32.png' }),
                    item.price.cf,
                    enoughCF && React.createElement('div', { className: 'currency-balance' }, loc('unlock_with', 'Unlock with Card Fragments', [cfCurrencyName])),
                    !enoughCF && React.createElement('div', { className: 'currency-balance' }, loc('not_enough_money', 'Not enough ' + cfCurrencyName, [cfCurrencyName])),
                    !enoughCF && React.createElement('span', { className: 'tooltiptext auto' }, loc('unlock_cards_to_earn_card_fragments', 'Unlock cards from the Card Trader to earn Card Fragments'))
                )
            ),
            React.createElement('span', {
                className: 'button',
                onMouseDown: function (e) {
                    if (!globalState.getCardArtShowSecretCardSelection) {
                        globalState.getCardArtShowSecretCardSelection = true
                        showFullScreenPopup(getCardArt(item, true, false))
                    } else {
                        engine.trigger('escape')
                    }
                },
                style: {
                    textTransform: 'uppercase',
                    display: 'inline-block'
                }
            },
                !globalState.getCardArtShowSecretCardSelection && loc('select_card_to_unlock', 'Select Card to Unlock'),
                globalState.getCardArtShowSecretCardSelection && loc('cancel', 'Cancel')
            )
            //React.createElement('span', {
            //    className: 'button currency em',
            //    onMouseDown: function (e) {
            //        console.log('convert ' + name + ' (' + item.id + ') to essence')
            //        engine.call('OnClickConvertToEssence', item.id)

            //        if (!isUnityHost)
            //            engine.trigger('loadConfirmConversionPopup', item.id, name, item.image, globalState.currency, globalState.currency + 1000, 1, 0)
            //    }
            //}, loc('unlock_with', 'Unlock with Card Fragments', [loc('card_fragments', 'Card Fragments')]))
        )
    )
}

getSmallCardArt = function (item) {
    var lockedDescription = item.stacks == 0
    var splashImage = item.image.replace('Icons/', 'splashes/');
    splashImage = splashImage.replace('icons/', 'splashes/');
    var name = item.name.replace(' Card', '')
    var description = item.description
    var stacksThreshold = 1
    if (item.stacks && item.stacks > 0)
        stacksThreshold = getAvatarStacksThreshold(item.stacks)

    return React.createElement('div', { className: 'small-card-art card-art-container' },
        //React.createElement('img', { className: 'back ' + cardArtTheme, src: 'hud/img/cards/' + cardArtTheme + '/back.png' }),
        React.createElement('img', { className: 'front-bg ' + cardArtTheme, src: 'hud/img/cards/' + cardArtTheme + '/front_bg.png' }),
        React.createElement('img', { className: 'splash-image lazyload ' + cardArtTheme, 'data-src': 'hud/img/' + splashImage }),
        React.createElement('img', { className: 'front-frame ' + cardArtTheme + ' ' + item.rarity, src: 'hud/img/cards/' + cardArtTheme + '/front_frame_' + stacksThreshold + '.png' }),
        React.createElement('div', { className: 'front-name ' + cardArtTheme }, name),
        item.stacks > 1 && React.createElement('div', {
            className: 'front-stacks',
            style: {
                background: item.stacks >= 3 ? (item.stacks >= 10 ? 'linear-gradient(0deg, rgba(255,216,63,1) 0%, rgba(137,118,52,1) 100%)' : 'linear-gradient(0deg, rgba(188,198,220,1) 0%, rgba(114,124,148,1) 100%)') : '',
                borderLeft: item.stacks >= 3 ? (item.stacks >= 10 ? '1px solid rgb(232, 222, 127)' : '1px solid rgb(206, 206, 206)') : '',
                borderRight: item.stacks >= 3 ? (item.stacks >= 10 ? '1px solid rgb(232, 222, 127)' : '1px solid rgb(206, 206, 206)') : '',
                borderBottom: item.stacks >= 3 ? (item.stacks >= 10 ? '1px solid rgb(232, 222, 127)' : '1px solid rgb(206, 206, 206)') : ''
            }
        }, 'x' + item.stacks),
        !lockedDescription && React.createElement('div', { className: 'front-description ' + cardArtTheme, dangerouslySetInnerHTML: { __html: description } }),
        lockedDescription && React.createElement('div', { className: 'front-description ' + cardArtTheme },
            React.createElement('img', { className: '', src: 'hud/img/shop/lock_big.png' })
        )
    )
}

getTrophyArt = function (item, hideDescription) {
    var splashImage = item.image.replace('Icons/', 'splashes/');
    splashImage = splashImage.replace('icons/', 'splashes/');
    var name = item.name.replace(' Trophy', '')

    var isBigSplash = !hideDescription // Smelly
    console.log('trophy ' + item.name + ' had ' + item.stacks + ' stacks, splashImage: ' + splashImage)

    return React.createElement('div', {
        className: 'card-art-container wide',
    },
        isBigSplash && React.createElement('div', {
            style: {
                background: 'rgba(0, 0, 0, 0.5)',
                position: 'absolute', /* fixed doesnt work ingame */
                width: '150vw',
                height: '150vh',
                top: '-50vh',
                left: '-50vw'
            }
        }),
        isBigSplash && React.createElement('img', { className: 'front-image-only', src: 'hud/img/' + splashImage }),
        !isBigSplash && React.createElement('img', { className: 'front-image-only lazyload ' + item.rarity, 'data-src': 'hud/img/' + splashImage }),
        React.createElement('div', { className: 'front-name-only' + (item.stacks > 0 ? ' ' + item.rarity : ''), style: { marginTop: '12px', color: (item.stacks == 0) ? '#909090' : '' } }, name),
        !isBigSplash && item.stacks > 1 && React.createElement('div', {
            className: 'front-stacks'
            //style: {
            //    background: item.stacks >= 3 ? (item.stacks >= 10 ? 'rgba(255, 216, 63, 0.80)' : 'rgba(164, 228, 244, 0.8)') : ''
            //}
        }, 'x' + item.stacks),
        !isBigSplash && item.stacks <= 1 && React.createElement('div', {
            className: 'front-stacks-spacer'
        }),
        !isBigSplash && React.createElement('span', { className: 'tooltiptext' },
            React.createElement('div', { className: 'requires', }, item.name),
            React.createElement('div', { className: '', }, item.description)
        ),
        !hideDescription && React.createElement('div', {
            className: 'front-description-only',
            dangerouslySetInnerHTML: {
                __html: item.description
            }
        })
    )
}

getRankupArt = function (item, rating) {
    var splashImage = item.image.replace('Icons/', 'splashes/');
    splashImage = splashImage.replace('icons/', 'splashes/');
    var name = item.name.replace(' Trophy', '')

    return React.createElement('div', { id: 'RankUp', className: 'card-art-container wide' },
        React.createElement('img', { className: 'front-image-only', src: 'hud/img/' + splashImage }),
        //React.createElement('span', {
        //    className: 'rating-numeral', style: {
        //        right: '96px', marginRight: '-16px', width: '20px', display: 'inline-block',
        //        fontSize: '90px', bottom: '0px'
        //    }
        //}, getRatingDivisionNumeral(rating)),
        //React.createElement('div', { className: 'front-name-only ' + item.rarity }, name),
        React.createElement('div', { className: 'front-name-only' }, loc('congratulations', 'Congratulations') + ' ' + globalState.savedUsername + '!'),
        React.createElement('div', {
            className: 'front-description-only',
            dangerouslySetInnerHTML: {
                //__html: loc('rating_rank_congratulations', 'You have been promoted to the rank of ' + item.name + '.<br>You have secured ' + item.name + ' or higher end of season rewards.<br><span style="color: #ffcc00">You have achieved a Season Goal and earned <img class="tooltip-icon" src="hud/img/shop/currency/Essence_20.png">10,000.</span><br><br>Best of luck in your future games.', [item.name])
                __html: loc('rating_rank_congratulations', 'You have been promoted to the rank of ' + item.name + '.<br>You have secured ' + item.name + ' or higher end of season rewards.<br><br>Best of luck in your future games.', [item.name])
            }
        }),
        React.createElement('div', { className: 'front-description-buttons' },
            React.createElement('div', { className: 'confirmation-buttons' },
                React.createElement('div', {
                    className: 'button big',
                    onMouseDown: function (e) {
                        engine.trigger('hideFullScreenPopup')
                    }
                }, loc('ok', 'Ok'))
            )
        )
    )
}

getSeasonGoalArt = function (rating, essence, extraRewardText) {
    return React.createElement('div', { id: 'RankUp', className: 'card-art-container wide' },
        React.createElement('img', { className: 'front-image-only', src: 'hud/img/goals/big.png' }),
        React.createElement('div', { className: 'front-name-only' }, loc('congratulations', 'Congratulations') + ' ' + globalState.savedUsername + '!'),
        React.createElement('div', {
            className: 'front-description-only',
            dangerouslySetInnerHTML: {
                __html: loc('season_goal_congratulations', 'You have been achieved a Season Goal by reaching a rating of at least ' + rating + '.<br>You earned |img(shop/currency/Essence_20.png)' + 10000 + '<br><br>Best of luck in your future games.', [rating, essence, extraRewardText])
            }
        }),
        React.createElement('div', { className: 'front-description-buttons' },
            React.createElement('div', { className: 'confirmation-buttons' },
                React.createElement('div', {
                    className: 'button big',
                    onMouseDown: function (e) {
                        engine.trigger('hideFullScreenPopup')
                    }
                }, loc('ok', 'Ok'))
            )
        )
    )
}

getBeatCampaignArt = function (campaignMapIndex) {
    var splashImage = 'campaign/Campaign' + campaignMapIndex + '.png'
    var name = locName('campaign_' + campaignMapIndex, 'Campaign ' + campaignMapIndex)

    // unsure if this should have a new Id or not...
    return React.createElement('div', { id: 'RankUp', className: 'card-art-container wide' },
        React.createElement('img', { className: 'front-image-only', src: 'hud/img/' + splashImage }),
        React.createElement('div', { className: 'front-name-only' }, loc('congratulations', 'Congratulations') + ' ' + globalState.savedUsername + '!'),
        React.createElement('div', {
            className: 'front-description-only',
            dangerouslySetInnerHTML: {
                __html: loc('beat_campaign_congratulations', 'You have beaten the campaign: ' + name + '.<br>We hope you enjoyed it. Next up: Hard Mode!<br><br>Best of luck in your future games.', [name])
            }
        }),
        React.createElement('div', { className: 'front-description-buttons' },
            React.createElement('div', { className: 'confirmation-buttons' },
                React.createElement('div', {
                    className: 'button big',
                    onMouseDown: function (e) {
                        engine.trigger('hideFullScreenPopup')
                    }
                }, loc('ok', 'Ok'))
            )
        )
    )
}

// For Equip/Shop view, for skins only
// skinEntry corresponds to HudStore.cs > skinEntry
// selectedSkin corresponds to HudStore.cs > Item
getEquipWindow = function (skinEntry, selectedSkin) {
    //console.log('getEquipWindow skinEntry: ' + JSON.stringify(skinEntry))
    //console.log('getEquipWindow selectedSkin: ' + JSON.stringify(selectedSkin))

    var isMyProfile = globalState.currentView == 'store' || (globalState.mainProfile.name == globalState.savedUsername)

    // Could be useful (?)
    var itemClass = skinEntry.itemClass

    var showThumbnails = itemClass == 'fightercosmetic' || itemClass == 'lanecosmetic'
    var isEquippable = itemClass == 'fightercosmetic' || itemClass == 'lanecosmetic' || itemClass == "clientbg" || itemClass == "gamecoach"
    var showSmallerSplash = itemClass == 'gamecoach'
    var showGameCoachBubble = itemClass == 'gamecoach'

    globalState.gameCoachShopTooltipIndex = 0
    var elem = document.getElementById('game-coach-shop-container');
    if (elem != null)
        elem.innerHTML = globalState.gameCoachShopTooltips[globalState.gameCoachShopTooltipIndex]

    // Special case: selected skin is default skin --> populate a dummy skin object
    if (isSkinADefaultSkin(selectedSkin)) {
        selectedSkin = {
            id: skinEntry.unitType,
            image: skinEntry.icon,
            name: skinEntry.name,
            isEquipped: isSkinADefaultSkin(skinEntry.currentSkin),
            rarity: 'common',
            stacks: 1,
            price: {
                ss: 0,
                pe: 0,
                rm: 0
            }
        }
    }

    // Show live previews for anything with a unit type specified (unit skins)
    // Otherwise it will use a Splash image based on the image path
    var showLivePreview = skinEntry.unitType != ""
    var splashImage = selectedSkin.image.replace('Icons/', 'splashes/');
    splashImage = splashImage.replace('icons/', 'splashes/');
    var name = selectedSkin.name

    // Special case: client background --> show video !?
    var videoPreview = ''
    if (itemClass == "clientbg") {
        var videoName = selectedSkin.key.toLowerCase().replace('_background_item_id', '').replace('_', '').replace(' ', '')
        //console.log('videoName: ' + videoName)
        videoPreview = 'hud/videos/bg/' + videoName + '/' + videoName + '.webm'
        selectedSkin.description = loc('client_background_long', 'This will change the appearance of your client background, which is displayed on all menu screens.')
    }

    var itemAvailableForPurchase = selectedSkin.stacks == 0 && (selectedSkin.price.pe > 0 || selectedSkin.price.ss > 0)
    var newEssenceBalance = globalState.currency - selectedSkin.price.ss
    var newPEBalance = globalState.premiumEssence - selectedSkin.price.pe
    var enoughSS = newEssenceBalance >= 0
    var enoughPE = newPEBalance >= 0
    var ssCurrencyName = loc('essence', 'Essence')
    var peCurrencyName = loc('premium_essence', 'Premium Essence')

    console.log('selectedSkin ' + name + ' itemAvailableForPurchase: ' + itemAvailableForPurchase)
    console.log('selectedSkin ' + name + ' stacks: ' + selectedSkin.stacks)
    console.log('selectedSkin ' + name + ' price.pe: ' + selectedSkin.price.pe)
    console.log('selectedSkin ' + name + ' price.ss: ' + selectedSkin.price.ss)

    return React.createElement('div', { className: 'skin-equip-window' + (showLivePreview ? ' model-previewer' : '') },
        showThumbnails && React.createElement('div', { className: 'skin-equip-thumbnails items' },
            // Default skin
            React.createElement('div', {
                className: 'simple-tooltip equipped' + (isSkinADefaultSkin(selectedSkin) ? ' equipped-on' : '')
            },
                React.createElement('img', {
                    src: 'hud/img/' + skinEntry.defaultIcon,
                    className: 'skin-thumbnail icon',// 'common',
                    onMouseEnter: function (e) {
                        engine.call('OnMouseOverLight', skinEntry.name.length)
                    },
                    onMouseDown: function (e) {
                        console.log('selected default skin')
                        engine.trigger('refreshSelectedSkin', skinEntry, {})
                        engine.call('OnClickLight')
                    }
                }),
                React.createElement('div', { className: 'tooltiptext auto' },
                    React.createElement('div', { className: 'common' }, skinEntry.name)
                    //React.createElement('div', {}, entry.description) // too much upkeep to have description
                    // Unless we want flavor text, COULD BE FUN!
                )
            ),
            // Premium skins
            skinEntry.allSkins.map(function (skin) {
                var isCurrentlyEquipped = selectedSkin.id == skin.id
                return React.createElement('div', {
                    className: 'simple-tooltip equipped' + (isCurrentlyEquipped ? ' equipped-on' : '')
                },
                    skin.stacks == 0 && React.createElement('img', {
                        src: 'hud/img/shop/lock.png',
                        className: 'equipped-lock',
                    }),
                    React.createElement('img', {
                        src: 'hud/img/' + skin.image,
                        className: 'skin-thumbnail icon',
                        onMouseEnter: function (e) {
                            engine.call('OnMouseOverLight', skinEntry.name.length)
                        },
                        onMouseDown: function (e) {
                            console.log('selected ' + skin.name)
                            engine.trigger('refreshSelectedSkin', skinEntry, skin)
                            engine.call('OnClickLight')
                        }
                    }),
                    skin.rarity && React.createElement('img', { src: 'hud/img/shop/rarity/' + skin.rarity + '.png', className: 'rarity' }),
                    React.createElement('div', { className: 'tooltiptext auto' },
                        React.createElement('div', { className: skin.rarity }, skin.name)
                        //React.createElement('div', {}, entry.description) // too much upkeep to have description
                        // Unless we want flavor text, COULD BE FUN!
                    )
                )
            })
        ),
        // Smelly copy & pasted from Codex view, just seems like a lot of work to DRY it out
        React.createElement('div', { className: 'card-art-container wide' },
            !showLivePreview && videoPreview.length == 0 && React.createElement('img', {
                className: 'front-image-only' + ' ' + selectedSkin.rarity + (showSmallerSplash ? ' smaller' : ''),
                src: 'hud/img/' + splashImage
            }),
            !showLivePreview && videoPreview.length > 0 && React.createElement('video', {
                className: 'front-video-preview' + ' ' + selectedSkin.rarity,
                autoPlay: true,
                loop: true,
                src: videoPreview
            }),
            showLivePreview && React.createElement('img', {
                src: 'liveview://codexLiveView',
                className: 'front-image-only' + ' ' + selectedSkin.rarity,
                style: {
                    background: 'rgba(27, 33, 33, 0.95)',
                    /* Make sure this is exactly 460x400 or else it will look skewed */
                    /* Should match the Coherent Live View dimensions in Unity */
                    width: '500px',
                    height: '435px',
                    left: '2px'
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
            showLivePreview && React.createElement('div', {
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
            ),
            React.createElement('div', { className: 'front-name-only name ' + selectedSkin.rarity + (selectedSkin.description ? '' : ' no-description') + (showSmallerSplash ? ' smaller' : '') }, selectedSkin.name),
            React.createElement('div', { className: 'floating-description' + (showSmallerSplash ? ' smaller' : '') },
                React.createElement('span', {
                    dangerouslySetInnerHTML: {
                        __html: selectedSkin.description
                    }
                })
            ),
            showGameCoachBubble && React.createElement('div', {
                className: 'game-coach game-coach-bubble',
                onMouseDown: function (e) {
                    var elem = document.getElementById('game-coach-shop-container');

                    globalState.gameCoachShopTooltipIndex++
                    if (globalState.gameCoachShopTooltipIndex >= globalState.gameCoachShopTooltips.length)
                        globalState.gameCoachShopTooltipIndex = 0

                    elem.innerHTML = globalState.gameCoachShopTooltips[globalState.gameCoachShopTooltipIndex]

                    engine.call('OnGameCoachClickToCycle', selectedSkin.id)
                }
            },
                React.createElement('img', { src: 'hud/img/' + getGameCoachIconExplicit(skinEntry.key) + '.png', className: 'game-coach-icon' }),
                React.createElement('div', { className: 'game-coach-name' },
                    loc('click_to_cycle', 'Click to cycle')
                ),
                React.createElement('div', { id: 'game-coach-shop-container', className: 'game-coach-text' },
                    React.createElement('span', {
                        dangerouslySetInnerHTML: {
                            __html: globalState.gameCoachShopTooltips[0]
                        }
                    })
                )
            ),
            React.createElement('div', {
                className: 'front-description-buttons',
                style: {
                    width: '800px',
                    left: '-150px'
                }
            },
                React.createElement('div', {
                    className: 'confirmation-buttons',
                    style: {
                        textAlign: 'center'
                    }
                },
                    React.createElement('div', {
                        className: 'button big',
                        onMouseEnter: function (e) {
                            engine.call('OnMouseOverMedium', 1)
                        },
                        onMouseDown: function (e) {
                            // Close previewer
                            engine.trigger('hideFullScreenPopup')
                            engine.call('OnClickMenuButton')
                        }
                    }, loc('back', 'Back')),
                    // My profile and not in-game, and item has stacks --> Equip/Unequip
                    isMyProfile && !globalState.isInGame && selectedSkin.stacks > 0 && React.createElement('div', {
                        className: 'button big em' + (selectedSkin.isEquipped || !isEquippable ? ' disabled' : ''),
                        onMouseEnter: function (e) {
                            engine.call('OnMouseOverMedium', skinEntry.name.length)
                        },
                        onMouseDown: function (e) {
                            if (selectedSkin.isEquipped) return
                            if (!isEquippable) return

                            // Close previewer
                            engine.trigger('hideFullScreenPopup', true)
                            engine.call('OnClickMenuButton')

                            // Unequip current skin, unless it is the default skin (which is never truly equipped
                            // so it never has to be unequipped)
                            if (!isSkinADefaultSkin(skinEntry.currentSkin))
                                engine.call("OnEquipCosmetic", skinEntry.currentSkin.id, false)

                            // Equip new skin, unless it is the default skin
                            if (!isSkinADefaultSkin(selectedSkin)) {
                                engine.call("OnEquipCosmetic", selectedSkin.id, !selectedSkin.isEquipped)
                                engine.call("OnShowEquipCosmeticPopup", selectedSkin.image)
                            } else {
                                engine.call("OnShowEquipCosmeticPopup", skinEntry.defaultIcon)
                            }
                        }
                    },
                        isEquippable && !selectedSkin.isEquipped && loc('equip', 'Equip'),
                        isEquippable && selectedSkin.isEquipped && loc('already_equipped', 'Already Equipped'),
                        !isEquippable && loc('owned', 'Owned')
                    ),
                    // My profile and not in-game, and Item has no stacks --> Buy/Unavailable for Purchase
                    isMyProfile && !globalState.isInGame && selectedSkin.stacks == 0 && (!itemAvailableForPurchase || selectedSkin.price.pe > 0) && React.createElement('div', {
                        className: 'button currency em purple' + ((!itemAvailableForPurchase || !enoughPE) ? ' disabled simple-tooltip' : '')
                            + (!itemAvailableForPurchase ? ' big' : ''),
                        onMouseEnter: function (e) {
                            engine.call('OnMouseOverMedium', selectedSkin.id.length)
                        },
                        onMouseDown: function (e) {
                            // Unavailable for purchase --> nothing to do
                            if (!itemAvailableForPurchase) return

                            if (!enoughPE) {
                                engine.trigger('notEnoughPE')
                                return
                            }

                            // Close previewer
                            engine.trigger('hideFullScreenPopup', true)

                            // Buy item instantly
                            //engine.call('OnBuyItem', selectedSkin.key, 'PE')

                            // Buy item ask for confirmation first
                            loadConfirmPurchasePopup({
                                itemType: selectedSkin.key,
                                name: selectedSkin.name,
                                image: selectedSkin.image,
                                essence: globalState.currency,
                                newEssence: globalState.currency,
                                premiumEssence: globalState.premiumEssence,
                                newPremiumEssence: newPEBalance
                            },
                                function () {
                                    console.log('OnBuyItem ' + selectedSkin.key)
                                    engine.call('OnBuyItem', selectedSkin.key, 'PE')
                                }
                            )
                        }
                    },
                        !itemAvailableForPurchase && loc('not_available', 'Not Available'),
                        itemAvailableForPurchase &&
                        React.createElement('div', { className: 'currency-button-container' },
                            React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/PremiumEssence_32.png' }),
                            selectedSkin.price.pe,
                            //enoughPE && React.createElement('div', { className: 'currency-balance' }, loc('new_balance', 'New balance: ' + newPEBalance, [newPEBalance])),
                            enoughPE && React.createElement('div', { className: 'currency-balance' }, loc('unlock_with', 'Unlock with Premium Essence', [peCurrencyName])),
                            !enoughPE && React.createElement('div', { className: 'currency-balance' }, loc('not_enough_money', 'Not enough ' + peCurrencyName, [peCurrencyName])),
                            !enoughPE && React.createElement('span', { className: 'tooltiptext auto' }, loc('buy_item', 'Buy Premium Essence', [loc('premium_essence', 'Premium Essence')]))
                        )
                    ),
                    // My profile and not in-game, and Item has no stacks and is buyable with Essence --> Buy/hide button
                    isMyProfile && !globalState.isInGame && selectedSkin.stacks == 0 && selectedSkin.price.ss > 0 && React.createElement('div', {
                        className: 'button currency em orange' + (!enoughSS ? ' disabled simple-tooltip' : ''),
                        onMouseEnter: function (e) {
                            engine.call('OnMouseOverMedium', selectedSkin.id.length)
                        },
                        onMouseDown: function (e) {
                            if (!enoughSS) {
                                engine.trigger('notEnoughSS')
                                return
                            }

                            // Close previewer
                            engine.trigger('hideFullScreenPopup')

                            // Buy item instantly
                            //engine.call('OnBuyItem', selectedSkin.key, 'SS')

                            // Buy item ask for confirmation first
                            loadConfirmPurchasePopup({
                                itemType: selectedSkin.key,
                                name: selectedSkin.name,
                                image: selectedSkin.image,
                                essence: globalState.currency,
                                newEssence: newEssenceBalance,
                                premiumEssence: globalState.premiumEssence,
                                newPremiumEssence: globalState.premiumEssence
                            },
                                function () {
                                    console.log('OnBuyItem ' + selectedSkin.key)
                                    engine.call('OnBuyItem', selectedSkin.key, 'SS')
                                }
                            )
                        }
                    },
                        React.createElement('div', { className: 'currency-button-container' },
                            React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/Essence_32.png' }),
                            selectedSkin.price.ss,
                            //enoughSS && React.createElement('div', { className: 'currency-balance' }, loc('new_balance', 'New balance: ' + newEssenceBalance, [newEssenceBalance])),
                            enoughSS && React.createElement('div', { className: 'currency-balance' }, loc('unlock_with', 'Unlock with Essence', [ssCurrencyName])),
                            !enoughSS && React.createElement('div', { className: 'currency-balance' }, loc('not_enough_money', 'Not enough ' + ssCurrencyName, [ssCurrencyName])),
                            !enoughSS && React.createElement('span', { className: 'tooltiptext auto' }, loc('play_more_games_to_earn_essence', 'Play more games to earn Essence'))
                        )
                    )
                )
            )
        )
    )
}

// For Recharge window typically, but maybe can be reused
// Maybe not though, because it deals with payment processor and OnBuyCurrency
getMiniShopWindow = function (items, paymentProcessorIndex, miniShopData) {

    // Payment Processor Dropdown (originally thought we'd allow PayPal and other things, but nvm that's too much work, fraud detection, etc.)
    var paymentProcessorItems = [
        { key: 0, id: 'steam', image: 'hud/img/shop/Steam.png' },
    ]

    var sortDropdownItems = []
    var sortDropdownItemsActions = []
    var selectedNexusCreatorId = ''
    var nexusPayload = miniShopData.nexusPayload

    var giftTarget = globalState.giftTargetName == "" ?
        React.createElement('span', {
            className: '',
            dangerouslySetInnerHTML: {
                __html: loc('send_as_gift', 'Send as Gift')
            }
        }) :
        React.createElement('span', { className: '' },
            loc('sending_gift_to', 'Sending a gift to') + ': ',
            React.createElement('img', { className: 'avatar-icon', src: 'hud/img/' + globalState.giftTargetAvatar }),
            " " + globalState.giftTargetName,
            React.createElement('span', { style: { color: '#909090' } }, ' (' + loc('click_to_cancel', 'Click to cancel') + ')')
        ) 

    console.log('miniShopData.nexusSelectedCreator: ' + miniShopData.nexusSelectedCreator)
    console.log('globalState.miniShopData.nexusSelectedCreator: ' + globalState.miniShopData.nexusSelectedCreator)

    if (isBrowserTest) {
        globalState.level = 8
    }

    if (nexusPayload != null) {
        var nexusCreators = nexusPayload.creators
        if (miniShopData.nexusSelectedCreator != -1) {
            selectedNexusCreatorId = nexusPayload.creators[miniShopData.nexusSelectedCreator].id
            console.log('Found selectedNexusCreatorId: ' + selectedNexusCreatorId)
        }

        nexusCreators.map(function (item, index) {
            var i = index
            var creator = nexusCreators[i]

            sortDropdownItemsActions[i] = function () {
                console.log('click ' + i + ', creator: ' + creator.name)
                miniShopData.nexusSelectedCreator = i
                showFullScreenPopup(getMiniShopWindow(items, paymentProcessorIndex, miniShopData), false)
            }

            sortDropdownItems.push({
                key: i,
                text: creator.name,
                action: sortDropdownItemsActions[i]
            })
        })
    }

    // Nova Boost timer
    var secondsUntilNovaBoostEnd = Math.max(0, Math.round((globalState.novaCupEndDate - new Date()) / 1000))
    globalState.novaBoostActive = secondsUntilNovaBoostEnd > 0

    var hours = Math.floor((secondsUntilNovaBoostEnd % (60 * 60 * 24)) / (60 * 60)).toFixed(0)
    var minutes = Math.floor((secondsUntilNovaBoostEnd % (60 * 60)) / 60).toFixed(0)
    var seconds = (secondsUntilNovaBoostEnd % 60).toFixed(0)
    console.log('secondsUntilNovaBoostEnd: ' + secondsUntilNovaBoostEnd)
    miniShopData.time = secondsUntilNovaBoostEnd
    if (miniShopData.time > 0) {
        setTimeout(function () {
            if (!globalState.fullScreenPopup || miniShopData.bail) {
                miniShopData.bail = false
                console.log('bail from minishop')
                return
            }
            showFullScreenPopup(getMiniShopWindow(items, paymentProcessorIndex, miniShopData), false, true)
        }, 1000)
    }

    return React.createElement('div', { className: 'mini-shop-window' + ((globalState.isGiftingPE) ? ' gifting' : '') },
        React.createElement('div', { className: 'items-container store-container' },
            React.createElement('div', { className: 'items' },
                React.createElement('div', {
                    style: {
                        display: 'block',
                        height: '8vh',
                        lineHeight: '6vh',
                        fontSize: '3vh'
                    }
                },
                    !globalState.isGiftingPE && loc('buy_item', 'Buy Premium Essence', [loc('premium_essence', 'Premium Essence')]),
                    globalState.isGiftingPE && loc('gift_premium_essence', 'Gift Premium Essence')
                ),
                !globalState.isGiftingPE && globalState.level < 4 && !globalState.freeAccount && React.createElement('div', { className: 'gift-a-friend' },
                    React.createElement('span', {
                        className: 'simple-tooltip gift-a-friend-disabled'
                    },
                        React.createElement('img', { className: 'gift-a-friend-icon', src: 'hud/img/guilds/Reward.png' }),
                        loc('gift_a_friend', 'Gift a Friend (FREE)'),
                        React.createElement('span', {
                            className: 'tooltiptext wide',
                            dangerouslySetInnerHTML: {
                                __html: loc('unlocked_after_account_level', 'Unlocked after account reaches level ' + 4, [4])
                            }
                        })
                    )
                ),
                !globalState.isGiftingPE && globalState.level >= 4 && !globalState.freeAccount && React.createElement('div', { className: 'gift-a-friend' },
                    //globalState.giftAFriend != '' && React.createElement('span', {
                    //    className: 'simple-tooltip gift-a-friend-disabled'
                    //},
                    //    React.createElement('img', { className: 'gift-a-friend-icon', src: 'hud/img/guilds/Reward.png' }),
                    //    loc('gift_a_friend', 'Gift a Friend (FREE)'),
                    //    React.createElement('span', { className: 'tooltiptext' },
                    //        loc('already_used_on', 'Already used on ' + globalState.giftAFriend, [globalState.giftAFriend])
                    //    )
                    //),
                    globalState.giftAFriend == '' && React.createElement('a', {
                        className: 'text-link',
                        onMouseDown: function () {
                            engine.trigger('searchGiftAFriend')
                        }
                    },
                        React.createElement('img', { className: 'gift-a-friend-icon', src: 'hud/img/guilds/Reward.png' }),
                        loc('gift_a_friend', 'Gift a Friend (FREE)')
                    )
                ),

                // Gifting PE Step 1: Check the checkbox to enter a friends name
                globalState.giftAFriend != '' && globalState.level >= 8 && React.createElement('div',
                    {
                        className: 'send-as-gift-link' + (globalState.giftTargetId.length > 0 ? ' active' : ''),
                        onClick: function () {
                            // If it isn't checked already, show search popup, otherwise uncheck and clear all giftee information
                            if (!globalState.isGiftingPE)
                                engine.trigger('searchGiftPE', "")
                            else {
                                var playerData = {}
                                playerData.playFabId = ""
                                playerData.displayName = ""
                                playerData.avatarUrl = ""
                                playerData.guild = ""
                                playerData.level = 0
                                playerData.rating = ""
                                engine.trigger("updateGiftRecipient", playerData, false)
                            }
                        }
                    },
                    React.createElement('img', { className: 'gift-a-friend-icon', src: 'hud/img/guilds/Reward.png' }),
                    giftTarget
                ),

                // v10.06.4: Redeem Code link
                React.createElement('div',
                    {
                        className: 'send-as-gift-link',
                        style: {
                            marginLeft: '12px',
                            verticalAlign: 'bottom',
                            height: '20px'
                        },
                        onClick: function () {
                            engine.trigger('requestCouponCode', '')
                        }
                    },
                    locName('redeem_code', 'Redeem Code')
                ),
                React.createElement('br'),

                // Currency items
                items && items.map(function (item, index) {

                    var splashImage = item.image.replace('Icons/', 'splashes/');
                    splashImage = splashImage.replace('icons/', 'splashes/');

                    return React.createElement('div', {
                        className: 'equipped store-item'
                    },
                        React.createElement('div', {
                            className: 'item-image',
                            style: {
                                background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.32) 75%, rgba(0,0,0,0.80) 100%),'
                                    + 'url(hud/img/' + splashImage + ')',
                                backgroundSize: 'cover',
                                transform: globalState.isMac ? 'scale(-1)' : ''
                            },
                            onMouseEnter: function (e) {
                                engine.call('OnMouseOverMedium', index)
                            },
                            onMouseDown: function (e) {
                                console.log('clicked item ' + item.name + ', paymentProcessorIndex: ' + paymentProcessorIndex + ', selectedNexusCreatorId: ' + selectedNexusCreatorId)
                                miniShopData.bail = true

                                if (!globalState.isGiftingPE)
                                    engine.call('OnBuyCurrency', item.id, paymentProcessorItems[paymentProcessorIndex].id, selectedNexusCreatorId, globalState.isGiftingPE, globalState.giftTargetId, globalState.giftTargetName)
                                else {
                                    var targetData = {}
                                    targetData.targetDisplayName = globalState.giftTargetName
                                    targetData.targetPlayFabId = globalState.giftTargetId
                                    targetData.avatarUrl = globalState.avatarUrl

                                    var paymentInfoData = {}
                                    paymentInfoData.item = item
                                    paymentInfoData.paymentProcessorId = paymentProcessorItems[paymentProcessorIndex].id
                                    paymentInfoData.nexusCreatorId = selectedNexusCreatorId

                                    var friendWarning = globalState.giftTargetIsFriend ? "" : "<br/><br/><span style='color: #ffff33'>" + loc('gift_not_friend_warning', 'Caution: This player is not on your friends list! Be sure to double-check the spelling.') + '</span>'

                                    var friendName = "<img src='hud/img/" + globalState.giftTargetAvatar + "' class='tooltip-icon-big' style='margin-right: 2px' /> " + globalState.giftTargetName + " "
                                        + "<span class='guild-abbr', style='margin-left: 0px'>" + globalState.giftTargetGuild + "</span>"
                                        + "<span style='margin-left: 0'>" + globalState.giftTargetRating + "</span>"

                                    var enterMessage = "<br/><br/>" + loc('gift_enter_message', 'Enter a message for ' + globalState.giftTargetName + ' along with your gift:', [globalState.giftTargetName]) + ': '

                                    var props = {}
                                    props.header = loc('confirm_purchase', 'Confirm Purchase')
                                    props.description = loc('gift_will_be_sent_to', "A gift of <img src='hud/img/shop/currency/PremiumEssence_32.png' class='currency-icon' /> " + item.value + " will be sent to", [item.value]) + ' ' + friendName + friendWarning + enterMessage
                                    props.data = targetData
                                    props.data2 = paymentInfoData
                                    engine.trigger("showConfirmGiftPEPopupInput", props)
                                }

                            }
                        }),
                        React.createElement('div', { className: 'title' }, item.name),
                        React.createElement('div', { className: 'price' },
                            //React.createElement('div', {
                            //    className: 'price-subtext', style: { color: '#ccc' } },
                            //    item.price.rm_usd + ' ' + locName('premium_essence', 'PE')
                            //),
                            //React.createElement('div', { className: 'price-subtext' },
                            //    item.description + ' ' + locName('premium_essence', 'PE')
                            //),
                            React.createElement('div', {
                                className: 'price-subtext', style: { color: '#ccc' },
                                dangerouslySetInnerHTML: {
                                    __html: item.description
                                }
                            }),
                            React.createElement('img', {
                                className: 'currency-icon big', src: 'hud/img/shop/currency/PremiumEssence_32.png', style: {
                                    marginLeft: '-4px' // I don't know why this correction is needed, ideally we do without it
                                }
                            }),
                            // maybe we can highlight in green? nah too much green
                            //React.createElement('span', { className: ((item.firstTimePeBonus === true) ? 'highlighted ' : '') + 'currency-text big'  }, item.value)
                            React.createElement('span', { className: 'currency-text big' }, item.value)
                        )
                    )
                })
            ),
            nexusPayload != null && React.createElement('div', { id: 'Nexus', className: miniShopData.nexusSelectedCreator >= 0 ? 'active' : '' },
                React.createElement('div', { className: 'title' },
                    React.createElement('img', { className: 'title-icon', src: 'hud/img/shop/nexus-small.png' }),
                    locName('creator_boost', 'Creator Boost'),
                    React.createElement('span', {
                        className: 'simple-tooltip flipped-y',
                        onMouseDown: function (e) {
                            if (e.nativeEvent.which == 2) return
                            engine.call("OnOpenURL", "http://legiontd2.com/creator")
                        },
                        style: {
                            fontSize: '14px',
                            color: '#c0c0c0',
                            marginLeft: '6px'
                        },
                    },
                        '[?]',
                        React.createElement('span', {
                            className: 'tooltiptext extra-wide',
                            dangerouslySetInnerHTML: {
                                __html: loc('creator_boost_long', '|c(ffcc00):Creator Boost:|r Enter your favorite content creator\'s Creator Code, and AutoAttack Games will donate 14% revenue from your purchase directly to that creator! You yourself will also receive ' + globalState.creatorCodeCreatorPercentText + ' bonus premium essence whenever you do this!<br><br>Are you a content creator?Register a creator code here: ', [globalState.creatorCodeCreatorPercentText])
                                    + linkify('nexus.gg/legion')
                                //__html: loc('creator_boost_long', '|c(ffcc00):Creator Boost:|r Simply enter your favorite content creator\'s Creator Code to donate a portion of your purchase directly to them! <br> <br>|c(ffcc00):Nova Boost:|r During Nova Cup weekends, you yourself will also receive bonus premium essence whenever you support a creator.<br><br>Are you a content creator?Register a creator code here: ')
                                //    + linkify('nexus.gg/legion')
                            },
                            style: {
                                marginLeft: '20px'
                            }
                        })
                    )
                ),
                React.createElement('div', { className: 'subtitle' },
                    loc('creator_boost', 'Support a Legion TD 2 Creator by entering their creator code.')
                ),
                // Actually let's have a button so it's a new popup
                miniShopData.nexusSelectedCreator >= 0 && React.createElement('div', { className: 'currently-supporting' },
                    globalState.selectedCreatorAvatar && React.createElement('img', { className: 'creator-avatar', src: globalState.selectedCreatorAvatar }),
                    React.createElement('div', { style: { display: 'inline-block' } },
                        React.createElement('span', {
                            dangerouslySetInnerHTML: {
                                __html: '<span style="color: #9bc8c2; margin-right: 3px;">' + loc('currently_supporting_simple', 'Currently Supporting') + ':</span>'
                                    + sortDropdownItems[miniShopData.nexusSelectedCreator].text,
                            }
                        }),
                        React.createElement('div', { className: 'about' },
                            React.createElement('div', {
                                dangerouslySetInnerHTML: {
                                    __html: loc('currently_supporting_long', 'AutoAttack Games will donate ' + globalState.creatorCodeCreatorPercentText + ' revenue from your purchase to ' + sortDropdownItems[miniShopData.nexusSelectedCreator].text, [globalState.creatorCodeCreatorPercentText, sortDropdownItems[miniShopData.nexusSelectedCreator].text])
                                    //__html: '<span style="color: #9bc8c2; margin-right: 3px;">' + locName('creator_boost', 'Creator Boost') + ':</span>'
                                    //    + loc('currently_supporting_long', globalState.creatorCodeCreatorPercentText + ' of your purchase will be donated to ' + sortDropdownItems[miniShopData.nexusSelectedCreator].text, [globalState.creatorCodeCreatorPercentText, sortDropdownItems[miniShopData.nexusSelectedCreator].text])
                                },
                            }),
                            //secondsUntilNovaBoostEnd != null && secondsUntilNovaBoostEnd > 0 && globalState.creatorCodePurchaserPercentText != '' && React.createElement('div', {
                            globalState.creatorCodePurchaserPercentText != '' && React.createElement('div', {
                                className: 'boost',
                                dangerouslySetInnerHTML: {
                                    __html: loc('creator_code_pe_bonus', 'You also will receive ' + globalState.creatorCodePurchaserPercentText + ' bonus premium essence!', [globalState.creatorCodePurchaserPercentText])
                                    //__html: '<span style="color: #9bc8c2; margin-right: 3px;">' + locName('nova_boost', 'Nova Boost') + ':</span>'
                                    //    + loc('creator_code_pe_bonus', 'You also will receive ' + globalState.creatorCodePurchaserPercentText + ' bonus premium essence!', [globalState.creatorCodePurchaserPercentText])
                                }
                            })
                            // v10.04 not worth drawing attention to this if boost isn't active
                            //,
                            //(secondsUntilNovaBoostEnd == null || secondsUntilNovaBoostEnd == 0 || globalState.creatorCodePurchaserPercentText == '') && React.createElement('div', {
                            //    className: 'boost inactive',
                            //    dangerouslySetInnerHTML: {
                            //        __html: '<span style="color: #909090; margin-right: 3px;">' + locName('nova_boost', 'Nova Boost') + ' (' + loc('inactive', 'inactive') + '):</span>'
                            //            + loc('nova_boost_inactive', 'Special bonus during Nova Cup weekends')
                            //    }
                            //})
                        )
                    )   
                ),
                miniShopData.nexusSelectedCreator >= 0 && React.createElement('div', {
                    className: 'button em red',
                    onMouseDown: function (e) {
                        console.log('cancel')
                        miniShopData.nexusSelectedCreator = -1
                        showFullScreenPopup(getMiniShopWindow(items, 0, miniShopData), false)

                        engine.call('OnCancelCreatorCode')
                    }
                },
                    loc('cancel', 'Cancel')
                ),
                miniShopData.nexusSelectedCreator < 0 && React.createElement('div', {
                    className: 'currently-supporting narrow',
                    dangerouslySetInnerHTML: {
                        __html: loc('not_supporting_a_creator', 'You are not currently supporting a content creator. Enter a creator code to unlock a ' + globalState.creatorCodePurchaserPercentText + ' premium essence bonus!', [globalState.creatorCodePurchaserPercentText])
                    }
                }),
                miniShopData.nexusSelectedCreator < 0 && React.createElement('div', {
                    className: 'button',
                    onMouseDown: function (e) {
                        console.log('enter code')
                        engine.trigger('enterContentCreatorCode', '')
                    }
                },
                    loc('enter_code', 'Enter Code')
                ),
                secondsUntilNovaBoostEnd != null && secondsUntilNovaBoostEnd > 0 && React.createElement('div', {
                    className: 'boost-alert',
                    dangerouslySetInnerHTML: {
                        __html: '<span style="color: #8ff110">' + loc('nova_boost_active', 'Nova Boost Active!') + '</span> ' + '(' + hours + 'h ' + minutes + 'm ' + seconds + 's remaining)'
                    }
                })
                //,
                // Let's not draw attention if the event is inactive
                //miniShopData.nexusSelectedCreator < 0 && (secondsUntilNovaBoostEnd == null || secondsUntilNovaBoostEnd == 0) && React.createElement('div', {
                //    className: 'boost-alert',
                //    dangerouslySetInnerHTML: {
                //        __html: '<span style="color: ' + (miniShopData.nexusSelectedCreator < 0 ? '#404040' : '#909090') + '">' + locName('nova_boost', 'Nova Boost') + ' (' + loc('inactive', 'inactive') + '): ' + loc('nova_boost_inactive', 'Special bonus during Nova Cup weekends')
                //    }
                //})
                // OLD DROPDOWN
                //React.createElement('div', {
                //    className: 'dropdown-container inline extra-wide',
                //},
                //    React.createElement(DropdownLinks, {
                //        choices: sortDropdownItems,
                //        defaultValue: sortDropdownItems[miniShopData.nexusSelectedCreator].text,
                //        actualValue: sortDropdownItems[miniShopData.nexusSelectedCreator].text
                //    })
                //)
            )
        ),
        React.createElement('div', { className: 'front-description-buttons' },
            React.createElement('div', { className: 'confirmation-buttons' },
                React.createElement('div', {
                    className: 'button big',
                    onMouseEnter: function (e) {
                        engine.call("OnMouseOverMedium", 4) // just use length so we don't leak strings 
                    },
                    onMouseDown: function (e) {
                        engine.trigger('hideFullScreenPopup')
                    }
                }, loc('back', 'Back'))
            )
        )
    )
}

// Item should be the "Mysterious Card" item
getCardWizardWindow = function (item, cards, remainingSeconds) {
    globalState.cardStockUntilRemainingSeconds = remainingSeconds
    return React.createElement(cardWizardWindow, { item: item, cards: cards })
}

var cardWizardWindow = React.createClass({
    timer: null,
    propTypes: {
        item: React.PropTypes.object,
        cards: React.PropTypes.array,
    },
    getInitialState: function () {
        return {
            seconds: 0,
            dialogue: '',
            cardFragments: globalState.cardFragments,
            cardTraderPity: globalState.cardTraderPity,
            showMyStacks: false,
            rerolls: globalState.cardTraderRerolls,
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshCardFragments = function (cardFragments, cardTraderPity) {
            parent.setState({
                cardFragments: cardFragments,
                cardTraderPity: cardTraderPity
            })
        }
        bindings.refreshCardTraderRerolls = function (rerolls) {
            parent.setState({
                rerolls: rerolls
            })
        }
    },
    componentDidMount: function () {
        this.updateTimer()
    },
    componentDidUpdate: function () {
        this.updateTimer()
    },
    updateTimer: function () {
        var parent = this

        // SMELLY way to stop timerTick when we close the popup
        // I wish componentWillUnmount worked here, but it doesn't
        //var shouldEnableTimer = globalState.fullScreenPopup && this.timer == null
        //var shouldDisableTimer = !globalState.fullScreenPopup && this.timer != null
        var shouldEnableTimer = globalState.currentView == 'store' && this.timer == null
        var shouldDisableTimer = globalState.currentView != 'store' && this.timer != null

        //console.log('shouldEnableTimer: ' + shouldEnableTimer)
        //console.log('globalState.currentView: ' + globalState.currentView)
        //console.log('globalState.fullScreenPopup: ' + globalState.fullScreenPopup)
        //console.log('shouldDisableTimer: ' + shouldDisableTimer)
        //console.log('this.timer ' + this.timer)

        if (shouldEnableTimer) {
            this.timer = setInterval(function () {
                //console.log('timerTick, currentView: ' + globalState.currentView)

                if (globalState.currentView != 'store') {
                    console.log('clear timeout because view was not equal to store')
                    clearTimeout(parent.timer)
                    return
                }

                parent.setState({
                    seconds: Math.max(0, parent.state.seconds - 1),
                })
            }, 1000)

            this.setState({
                seconds: globalState.cardStockUntilRemainingSeconds
            })

            return
        }

        if (shouldDisableTimer && this.timer != null) {
            clearInterval(this.timer)
            this.timer = null
        }
    },
    refreshDialogue: function () {
        var dialogueOptions = [
            loc('card_trader_dialogue_1', 'Your card collection could use a fresh look!'),
            loc('card_trader_dialogue_2', 'Nice choice! Now just hand over the essence...'),
            loc('card_trader_dialogue_3', 'Today is your lucky day!'),
            loc('card_trader_dialogue_4', 'Don\'t delay, trade today!'),
            loc('card_trader_dialogue_5', 'Happy trading! And may the odds be ever in your favor.'),
            loc('card_trader_dialogue_6', 'What\'s here today will be gone tomorrow!'),
            loc('card_trader_dialogue_7', 'You want it? I got it!'),
            loc('card_trader_dialogue_8', 'You want it? I got it!'),
            loc('card_trader_dialogue_9', 'You want it? I got it!'),
            loc('card_trader_dialogue_10', 'You want it? I got it!'),
            loc('card_trader_dialogue_11', 'You want it? I got it!'),
            loc('card_trader_dialogue_12', 'You want it? I got it!'),
            loc('card_trader_dialogue_13', 'You want it? I got it!'),
            loc('card_trader_dialogue_14', 'You want it? I got it!'),
            loc('card_trader_dialogue_15', 'You want it? I got it!'),
            loc('card_trader_dialogue_16', 'You want it? I got it!'),
            loc('card_trader_dialogue_17', 'You want it? I got it!'),
            loc('card_trader_dialogue_18', 'You want it? I got it!'),
            loc('card_trader_dialogue_19', 'You want it? I got it!'),
            loc('card_trader_dialogue_20', 'You want it? I got it!'),
            loc('card_trader_dialogue_21', 'You want it? I got it!'),
            loc('card_trader_dialogue_22', 'You want it? I got it!'),
            loc('card_trader_dialogue_23', 'You want it? I got it!'),
            loc('card_trader_dialogue_24', 'You want it? I got it!'),
        ]

        var randomDialogueIndex = Math.floor(Math.random() * dialogueOptions.length)
        var randomDialogueOption = dialogueOptions[randomDialogueIndex]
        this.setState({ dialogue: randomDialogueOption })
    },
    render: function () {
        var parent = this
        var item = this.props.item
        var cards = this.props.cards

        var newEssenceBalance = globalState.currency - item.price.ss
        var newPEBalance = globalState.premiumEssence - item.price.pe
        var enoughSS = newEssenceBalance >= 0
        var enoughPE = newPEBalance >= 0
        var ssCurrencyName = loc('essence', 'Essence')
        var peCurrencyName = loc('premium_essence', 'Premium Essence')

        var days = Math.floor(this.state.seconds / (60 * 60 * 24)).toFixed(0)
        var hours = Math.floor((this.state.seconds % (60 * 60 * 24)) / (60 * 60)).toFixed(0)
        var minutes = Math.floor((this.state.seconds % (60 * 60)) / 60).toFixed(0)
        var seconds = (this.state.seconds % 60).toFixed(0)
        var isRestocking = this.state.seconds <= 0

        var isNarrow = globalState.screenWidth < 1800
        var isUHD = globalState.screenWidth >= 1921
        var uhd = globalState.screenWidth == 3840 && globalState.screenHeight == 2160

        var pityPoints = this.state.cardTraderPity

        //console.log("total seconds: " + this.state.seconds) 
        //console.log('days: ' + days)
        //console.log('hours: ' + hours)
        //console.log('minutes: ' + minutes)
        //console.log('seconds: ' + seconds)

        if (this.state.dialogue.length == 0) {
            this.refreshDialogue()
        }

        return React.createElement('div', { className: 'card-wizard-window' },
            React.createElement('div', { className: 'card-wizard-video-container-spacer' }),
            React.createElement('div', {
                className: 'card-wizard-video-container' + (isNarrow ? ' narrow' : ''),
                onMouseDown: function (e) {
                    console.log('click video')
                    parent.refreshDialogue()
                }
            },
                globalState.enableVideoRendering && React.createElement('video', {
                    src: 'hud/videos/shop/card-trader.webm',
                    autoPlay: 'true', loop: 'true', muted: 'true',
                    style: {
                        height: isUHD ? '90vh' : '900px',
                        width: isUHD ? '80vw' : '1200px'
                    }
                }),
                !globalState.enableVideoRendering && React.createElement('div', {
                    style: {
                        backgroundImage: 'url(hud/videos/shop/card-trader.jpg)',
                        // Gif looks nice, but takes too long to load, and too big of a transition because of the lines glitch
                        // and it's already so blurry I don't think we can compress it anymore
                        // I think the slowness is due to how much space it *takes up* moreso than how much resolution is
                        // at the source
                        //backgroundImage: 'url(hud/videos/shop/card-trader.gif)',
                        //backgroundImage: 'url(hud/img/shop/bigcardwizardtest.png)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: isUHD ? 'cover' : 'contain',
                        backgroundPosition: isUHD ? 'center -20vh' : (isNarrow ? 'center -290px' : 'center -100px'),
                        height: isUHD ? '90vh' : '900px',
                        width: isUHD ? '80vw' : '1200px'
                    }
                }),
                // First frame placeholder (very compressed) to prevent black flickering
                globalState.enableVideoRendering && React.createElement('div', {
                    style: {
                        backgroundImage: 'url(hud/videos/shop/card-trader.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: isUHD ? 'cover' : 'contain',
                        backgroundPosition: isUHD ? 'center -20vh' : (isNarrow ? 'center -290px' : 'center -100px'),
                        height: isUHD ? '90vh' : '900px',
                        width: isUHD ? '80vw' : '1200px',
                        zIndex: '-2', /* -1 works in view, but not ingame */
                        /* Known bug also, the slashes appear on top of this, in-game only, idk why */
                        position: 'absolute',
                        top: '0'
                    }
                })
            ),
            React.createElement('div', { className: 'card-wizard-dialogue' + (isNarrow ? ' narrow' : '') },
                React.createElement('div', { className: 'card-wizard-dialogue-text' },
                    !isRestocking && parent.state.dialogue,
                    isRestocking && loc('card_trader_check_back_soon', 'Check back soon!')
                )
            ),
            !isRestocking && React.createElement('div', {
                className: 'items cards',
                style: {
                    width: isNarrow ? '380px' : ''
                }
            },
                React.createElement('div', { className: 'intro' },
                    React.createElement('span', {
                        dangerouslySetInnerHTML: {
                            __html: loc('card_trader_offer', 'The Card Trader offers you a random card from 24 cards everyday. Each card has an equal chance of being picked. <br><br>Each time you unlock a random card, you also gain <img class="tooltip-icon" src="hud/img/icons/CardFragment.png"><span style="color: #fff">Card Fragments</span>, which you may spend to unlock a card of your choice.')
                        }
                    }),
                    React.createElement('div', {
                        style: {
                            marginTop: '10px'
                        }
                    },
                        React.createElement('span', {
                            className: 'simple-tooltip',
                            style: {
                                color: '#c0c0c0'
                            }
                        },
                            React.createElement('img', { src: 'hud/img/small-icons/help.png', style: { verticalAlign: 'bottom', marginRight: '5px' } }),
                            loc('what_cards_used_for', 'What are cards used for?'),
                            React.createElement('span', {
                                className: 'tooltiptext ultra-wide',
                                dangerouslySetInnerHTML: {
                                    __html: loc('what_cards_used_for_long', 'Cards are collectibles that can be used as avatars, shown off in game as monuments, and donated for Guild XP. x3/x10 of the same card have special effects.')
                                },
                                style: {
                                    textShadow: 'none'
                                }
                            })
                        )
                    )
                ),
                React.createElement('div', { className: 'label' },
                    loc('todays_cards', "Today's Cards"),
                    React.createElement('div', { className: 'label-time', ref: 'cardStockTimer' },
                        loc('days_hours_minutes_seconds_remaining',
                            " (" + days + "d " + hours + "h " + _.padStart(minutes.toString(), 2, '0') + "m " + _.padStart(seconds.toString(), 2, '0') + "s remaining)",
                            [days, hours, _.padStart(minutes.toString(), 2, '0'), _.padStart(seconds.toString(), 2, '0')])
                    )
                ),
                React.createElement('div', { className: 'card-container' },
                    cards && cards.map(function (card, index) {

                        var splash = ''
                        if (uhd) {
                            splash = card.image.replace('icons/', 'splashes/')
                            splash = card.image.replace('Icons/', 'splashes/')
                        }

                        return React.createElement('div', {
                            className: 'simple-tooltip equipped',
                            onMouseDown: function (e) {
                                // No preview for now IMO, so it's a reward to be able to read the descriptions
                                // Plus it will be annoying to make the new popup not close the old popup
                                // although I guess it could reopen it
                                //showFullScreenPopup(getCardArt(card, false, true))

                                // v9.03 now that we allow unlocking specific cards, let's show all of the descriptions IMO
                                globalState.getCardArtShowSecretCardSelection = false
                                showFullScreenPopup(getCardArt(card, true, false))

                                // v9.06 play sound
                                engine.call("OnCardTraderBrowse");
                            },
                            onMouseEnter: function () {
                                engine.call("OnMouseOverLight", index)
                            },
                        },
                            React.createElement('img', {
                                src: 'hud/img/' + (uhd ? splash : card.image),
                                className: 'card icon',
                                style: {
                                    width: isNarrow ? '36px' : ''
                                }
                            }),
                            parent.state.showMyStacks && card.stacks == 0 && React.createElement('div', { className: 'stacks zero' }, '-'),
                            parent.state.showMyStacks && card.stacks >= 1 && card.stacks <= 2 && React.createElement('div', { className: 'stacks' }, 'x' + card.stacks),
                            parent.state.showMyStacks && card.stacks >= 3 && card.stacks <= 9 && React.createElement('div', { className: 'stacks silver' }, 'x' + card.stacks),
                            parent.state.showMyStacks && card.stacks >= 10 && React.createElement('div', { className: 'stacks gold' }, 'x' + card.stacks),
                            React.createElement('img', { src: 'hud/img/shop/rarity/' + card.rarity + '.png', className: 'rarity' }),
                            React.createElement('div', { className: 'tooltiptext' + (card.rarity != 'secret' ? ' auto' : '') },
                                React.createElement('div', { className: card.rarity }, card.name),
                                card.rarity == 'secret' && React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: card.description
                                    }
                                })
                            )
                        )
                    })
                )
            ),
            React.createElement('div', {
                className: 'front-description-buttons',
                style: {
                    width: isUHD ? (uhd ? '2100px' : '1300px') : ''
                }
            },
                React.createElement('div', { className: 'confirmation-buttons' },
                    !isRestocking && !globalState.isInGame && React.createElement('div', {
                        className: 'button currency em orange' + (!enoughSS ? ' disabled simple-tooltip' : ''),
                        onMouseEnter: function (e) {
                            engine.call("OnMouseOverMedium", 1)
                        },
                        onMouseDown: function (e) {
                            if (!enoughSS) {
                                engine.trigger('notEnoughSS')
                                return
                            }
                            loadConfirmPurchasePopup({
                                itemType: 'mysterious_card_item_id',
                                name: locName('mysterious_card_item', 'Mysterious Card'),
                                image: 'icons/items/MysteriousCard.png',
                                essence: globalState.currency,
                                newEssence: newEssenceBalance,
                                premiumEssence: globalState.premiumEssence,
                                newPremiumEssence: globalState.premiumEssence,
                                cardFragments: globalState.cardFragments,
                                newCardFragments: globalState.cardFragments + 1
                            },
                                function () {
                                    engine.call('OnBuyItem', item.id, 'SS')
                                }
                            )
                        }
                    },
                        React.createElement('div', { className: 'currency-button-container' },
                            React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/Essence_32.png' }),
                            item.price.ss,
                            //enoughSS && React.createElement('div', { className: 'currency-balance' }, loc('new_balance', 'New balance: ' + newEssenceBalance, [newEssenceBalance])),
                            enoughSS && React.createElement('div', { className: 'currency-balance' }, loc('unlock_with', 'Unlock with Essence', [ssCurrencyName])),
                            !enoughSS && React.createElement('div', { className: 'currency-balance' }, loc('not_enough_money', 'Not enough ' + ssCurrencyName, [ssCurrencyName])),
                            !enoughSS && React.createElement('span', { className: 'tooltiptext auto' }, loc('play_more_games_to_earn_essence', 'Play more games to earn Essence'))
                        )
                    ),
                    !isRestocking && !globalState.isInGame && React.createElement('div', {
                        className: 'button currency em purple' + (!enoughPE ? ' disabled simple-tooltip' : ''),
                        onMouseEnter: function (e) {
                            engine.call("OnMouseOverMedium", 2)
                        },
                        onMouseDown: function (e) {
                            if (!enoughPE) {
                                engine.trigger('notEnoughPE')
                                return
                            }
                            loadConfirmPurchasePopup({
                                itemType: 'mysterious_card_item_id',
                                name: locName('mysterious_card_item', 'Mysterious Card'),
                                image: 'icons/items/MysteriousCard.png',
                                essence: globalState.currency,
                                newEssence: globalState.currency,
                                premiumEssence: globalState.premiumEssence,
                                newPremiumEssence: newPEBalance,
                                cardFragments: globalState.cardFragments,
                                newCardFragments: globalState.cardFragments + 3
                            },
                                function () {
                                    engine.call('OnBuyItem', item.id, 'PE')
                                }
                            )
                        }
                    },
                        React.createElement('div', { className: 'currency-button-container' },
                            React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/PremiumEssence_32.png' }),
                            item.price.pe,
                            //enoughPE && React.createElement('div', { className: 'currency-balance' }, loc('new_balance', 'New balance: ' + newPEBalance, [newPEBalance])),
                            enoughPE && React.createElement('div', { className: 'currency-balance' }, loc('unlock_with', 'Unlock with Premium Essence', [peCurrencyName])),
                            !enoughPE && React.createElement('div', { className: 'currency-balance' }, loc('not_enough_money', 'Not enough ' + peCurrencyName, [peCurrencyName])),
                            !enoughPE && React.createElement('span', { className: 'tooltiptext auto' }, loc('buy_item', 'Buy Premium Essence', [loc('premium_essence', 'Premium Essence')]))
                        )
                    ),
                    !isRestocking && !globalState.isInGame && React.createElement('div', {
                        className: 'button',
                        style:
                        {
                            display: 'inline-block',
                            verticalAlign: 'bottom'
                        },
                        onMouseEnter: function (e) {
                            engine.call("OnMouseOverMedium", 1)
                        },
                        onMouseDown: function (e) {
                            engine.trigger('openSellCardMenu')
                        }
                    },
                        locName('sell', 'Sell')
                    ),
                    React.createElement('div', {
                        className: 'fragments simple-tooltip',
                        onMouseDown: function (e) {
                            globalState.getCardArtShowSecretCardSelection = true

                            // Select first card by default
                            var item = globalState.mysteriousCardStock[0]
                            showFullScreenPopup(getCardArt(item, true, false))
                        }
                    },
                        React.createElement('span', {
                            dangerouslySetInnerHTML: {
                                __html: loc('you_have_card_fragments', 'You have <img class="tooltip-icon" src="hud/img/icons/CardFragment.png">' + parent.state.cardFragments, [parent.state.cardFragments])
                            }
                        }),
                        React.createElement('span', {
                            className: 'tooltiptext wide',
                            dangerouslySetInnerHTML: {
                                __html: loc('card_fragments_tooltip', 'Every time you unlock a card from the Card Trader with |proper(essence), you earn <img class="tooltip-icon" src="hud/img/shop/currency/CardFragments_20.png">1.|n|nEvery time you unlock a card from the Card Trader with |proper(premium_essence), you earn <img class="tooltip-icon" src="hud/img/shop/currency/CardFragments_20.png">3.')
                            }
                        })
                    ),
                    React.createElement('div', {
                        className: "pity progress-container simple-tooltip",
                        style: { width: '100px', height: '36px', background: 'rgba(0, 0, 0, 0.75)', border: 'none' }
                    },
                        React.createElement('div', {
                            className: "progress-bar slate", style: {
                                width: (100 * (pityPoints / 10)) + "%",
                            }
                        }),
                        React.createElement('span', { className: 'value', style: { lineHeight: '36px' } },
                            React.createElement('img', {
                                src: 'hud/img/emotes/Care.png', style: {
                                    height: '24px', position: 'relative', zIndex: '1', top: '6px', verticalAlign: 'top', marginRight: '3px'
                                }
                            }),
                            pityPoints + '/10'
                        ),
                        React.createElement('span', {
                            className: 'tooltiptext wide',
                            dangerouslySetInnerHTML: {
                                __html: loc('card_trader_pity', 'If you unlock 10 cards in a row without drawing a secret card, the Card Trader has pity on you...and gives you a FREE <img src="hud/img/icons/CardFragment.png" class="tooltip-icon">10!')
                            }
                        })
                    ),
                    React.createElement('div', {
                        className: 'reroll button simple-tooltip' + (parent.state.rerolls <= 0 ? ' disabled' : ''),
                        onMouseDown: function (e) {
                            console.log("OnRerollCardTrader")

                            if (parent.state.rerolls <= 0) {
                                console.log('Bail early since rerolls was: ' + parent.state.rerolls)
                                return
                            }

                            engine.call('OnRerollCardTrader')
                        }
                    },
                        React.createElement('img', { src: 'hud/img/icons/small/Dice.png', className: 'reroll-icon' }),
                        React.createElement('span', { className: 'reroll-charges' }, parent.state.rerolls),
                        React.createElement('span', { className: 'tooltiptext' },
                            loc('card_trader_reroll', 'You gain 1x reroll per day, up to a maximum of 4x rerolls.')
                        )
                    ),
                    React.createElement('div', {
                        className: 'show-my-stacks',
                        onMouseDown: function (e) {
                            parent.setState({ showMyStacks: !parent.state.showMyStacks })
                        }
                    },
                        React.createElement('div', { className: 'checkbox-box' },
                            parent.state.showMyStacks && React.createElement('img', { className: 'checkbox-icon', src: 'hud/img/ui/accept-check.png' })
                        ),
                        React.createElement('span', {}, loc('show_my_stacks', 'Show my stacks'))
                    )
                )
            )
        )
    }
})

getRankedFAQ = function () {
    var rating = globalState.profile.peakRatingThisSeason

    // Smelly "fix" that just makes everyone under level 3 be unranked
    // Ideally it would check rankedGamesPlayedThisSeason, but we don't have easy access to that without hitting backend
    if (globalState.profile.level < 3)
        rating = 0

    return React.createElement('div', { id: 'RankedFAQ', className: 'faq-container' },
        React.createElement('div', { className: 'content' },
            React.createElement('div', { className: 'left' },
                React.createElement('div', { className: 'title category' }, loc('ranked_faq_title', 'Ranked FAQ')),
                React.createElement('div', { style: { marginBottom: '24px' } }, loc('ranked_faq_subtitle', 'Welcome to Season 6. Season 6 ends in December 2020 (exact date TBA).')),
                React.createElement('div', { className: 'category' }, loc('ranked_faq_category_1', 'How does Ranked work?')),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, loc('ranked_faq_category_1_bullet_1', 'Complete against teams of similar skill')),
                    React.createElement('li', { className: '' }, loc('ranked_faq_category_1_bullet_2', 'Earn rating points each match to climb tiers')),
                    React.createElement('li', { className: '' }, loc('ranked_faq_category_1_bullet_3', 'The harder your opponent, the more points you gain if you win (and the fewer points you lose if you are defeated)'))
                ),
                React.createElement('div', { className: 'category' }, loc('ranked_faq_category_2', 'Seasons')),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, loc('ranked_faq_category_2_bullet_1', 'A new season starts every 6 months.')),
                    React.createElement('li', { className: '' }, loc('ranked_faq_category_2_bullet_2', 'Your peak rating determines your season rewards.')),
                    React.createElement('li', { className: '' }, loc('ranked_faq_category_2_bullet_3', 'At the beginning of a season, your rating is "soft" reset to a lower rating.')),
                    React.createElement('li', { className: '' }, loc('ranked_faq_category_2_bullet_4', 'Your first 10 ranked games each season have 2x rating changes.'))
                ),
                React.createElement('div', { className: 'category' }, loc('ranked_faq_category_3', 'Season Rewards')),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, loc('ranked_faq_category_3_bullet_1', 'Loading screen border for next season.')),
                    React.createElement('li', { className: '' }, loc('ranked_faq_category_3_bullet_2', 'Badge that shows up in your profile and that you can use as an avatar.')),
                    React.createElement('li', { className: '' }, loc('ranked_faq_category_3_bullet_3', 'Bragging rights!'))
                )
            ),
            React.createElement('div', { className: 'right right-1' },
                React.createElement('div', { className: 'ranked-tier' + (rating < 1000 ? ' current' : '') },
                    React.createElement('img', { className: 'ranked-badge', src: 'hud/img/icons/Ranks/Unranked.png' }),
                    React.createElement('div', { className: 'ranked-tier-name' }, loc('unranked_rank', 'Unranked')),
                    rating < 1000 && React.createElement('div', { className: 'ranked-tier-current' }, loc('ranked_faq_your_peak_rating', 'Your Peak Rating: ' + rating, [rating]))
                ),
                React.createElement('div', { className: 'ranked-tier' + (rating < 1200 && rating >= 1000 ? ' current' : '') },
                    React.createElement('img', { className: 'ranked-badge', src: 'hud/img/icons/Ranks/Bronze.png' }),
                    React.createElement('div', { className: 'ranked-tier-name' }, loc('bronze_rank', 'Bronze') + ' (1000+)'),
                    rating < 1200 && rating >= 1000 && React.createElement('div', { className: 'ranked-tier-current' }, loc('ranked_faq_your_peak_rating', 'Your Peak Rating: ' + rating, [rating]))
                ),
                React.createElement('div', { className: 'ranked-tier' + (rating < 1400 && rating >= 1200 ? ' current' : '') },
                    React.createElement('img', { className: 'ranked-badge', src: 'hud/img/icons/Ranks/Silver.png' }),
                    React.createElement('div', { className: 'ranked-tier-name' }, loc('silver_rank', 'Silver') + ' (1200+)'),
                    rating < 1400 && rating >= 1200 && React.createElement('div', { className: 'ranked-tier-current' }, loc('ranked_faq_your_peak_rating', 'Your Peak Rating: ' + rating, [rating]))
                ),
                React.createElement('div', { className: 'ranked-tier' + (rating < 1600 && rating >= 1400 ? ' current' : '') },
                    React.createElement('img', { className: 'ranked-badge', src: 'hud/img/icons/Ranks/Gold.png' }),
                    React.createElement('div', { className: 'ranked-tier-name' }, loc('gold_rank', 'Gold') + ' (1400+)'),
                    rating < 1600 && rating >= 1400 && React.createElement('div', { className: 'ranked-tier-current' }, loc('ranked_faq_your_peak_rating', 'Your Peak Rating: ' + rating, [rating]))
                ),
                React.createElement('div', { className: 'ranked-tier' + (rating < 1800 && rating >= 1600 ? ' current' : '') },
                    React.createElement('img', { className: 'ranked-badge', src: 'hud/img/icons/Ranks/Platinum.png' }),
                    React.createElement('div', { className: 'ranked-tier-name' }, loc('platinum_rank', 'Platinum') + ' (1600+)'),
                    rating < 1800 && rating >= 1600 && React.createElement('div', { className: 'ranked-tier-current' }, loc('ranked_faq_your_peak_rating', 'Your Peak Rating: ' + rating, [rating]))
                ),
                React.createElement('div', { className: 'ranked-tier' + (rating < 2000 && rating >= 1800 ? ' current' : '') },
                    React.createElement('img', { className: 'ranked-badge', src: 'hud/img/icons/Ranks/Diamond.png' }),
                    React.createElement('div', { className: 'ranked-tier-name' }, loc('diamond_rank', 'Diamond') + ' (1800+)'),
                    rating < 2000 && rating >= 1800 && React.createElement('div', { className: 'ranked-tier-current' }, loc('ranked_faq_your_peak_rating', 'Your Peak Rating: ' + rating, [rating]))
                )
            ),
            React.createElement('div', { className: 'right right-2' + (rating < 2200 && rating >= 2000 ? ' current' : '') },
                React.createElement('div', { className: 'ranked-tier' },
                    React.createElement('img', { className: 'ranked-badge', src: 'hud/img/icons/Ranks/Expert.png' }),
                    React.createElement('div', { className: 'ranked-tier-name' }, loc('expert_rank', 'Expert') + ' (2000+)'),
                    rating < 2200 && rating >= 2000 && React.createElement('div', { className: 'ranked-tier-current' }, loc('ranked_faq_your_peak_rating', 'Your Peak Rating: ' + rating, [rating]))
                ),
                React.createElement('div', { className: 'ranked-tier' + (rating < 2400 && rating >= 2200 ? ' current' : '') },
                    React.createElement('img', { className: 'ranked-badge', src: 'hud/img/icons/Ranks/Master.png' }),
                    React.createElement('div', { className: 'ranked-tier-name' }, loc('master_rank', 'Master') + ' (2200+)'),
                    rating < 2400 && rating >= 2200 && React.createElement('div', { className: 'ranked-tier-current' }, loc('ranked_faq_your_peak_rating', 'Your Peak Rating: ' + rating, [rating]))
                ),
                React.createElement('div', { className: 'ranked-tier' + (rating < 2600 && rating >= 2400 ? ' current' : '') },
                    React.createElement('img', { className: 'ranked-badge', src: 'hud/img/icons/Ranks/SeniorMaster.png' }),
                    React.createElement('div', { className: 'ranked-tier-name' }, loc('senior_master_rank', 'Senior Master') + ' (2400+)'),
                    rating < 2600 && rating >= 2400 && React.createElement('div', { className: 'ranked-tier-current' }, loc('ranked_faq_your_peak_rating', 'Your Peak Rating: ' + rating, [rating]))
                ),
                React.createElement('div', { className: 'ranked-tier' + (rating < 2800 && rating >= 2600 ? ' current' : '') },
                    React.createElement('img', { className: 'ranked-badge', src: 'hud/img/icons/Ranks/Grandmaster.png' }),
                    React.createElement('div', { className: 'ranked-tier-name' }, loc('grandmaster_rank', 'Grandmaster') + ' (2600+)'),
                    rating < 2800 && rating >= 2600 && React.createElement('div', { className: 'ranked-tier-current' }, loc('ranked_faq_your_peak_rating', 'Your Peak Rating: ' + rating, [rating]))
                ),
                React.createElement('div', { className: 'ranked-tier' + (rating >= 2800 ? ' current' : '') },
                    React.createElement('img', { className: 'ranked-badge', src: 'hud/img/icons/Ranks/Legend.png' }),
                    React.createElement('div', { className: 'ranked-tier-name' }, loc('legend_rank', 'Legend') + ' (2800+)'),
                    rating >= 2800 && React.createElement('div', { className: 'ranked-tier-current' }, loc('ranked_faq_your_peak_rating', 'Your Peak Rating: ' + rating, [rating]))
                )
            )
        ),
        React.createElement('div', { className: 'front-description-buttons' },
            React.createElement('div', { className: 'confirmation-buttons' },
                React.createElement('div', {
                    className: 'button big',
                    onMouseDown: function (e) {
                        engine.trigger('hideFullScreenPopup')
                    }
                }, loc('ok', 'Ok'))
            )
        )
    )
}

getCardWizardBackgroundWindow = function () {
    return React.createElement(cardWizardBackgroundWindow)
}

var cardWizardBackgroundWindow = React.createClass({
    getInitialState: function () {
        return {
            animationStateNumber: 0,
            name: '',
            description: '',
            splashImage: '',
            rarity: '',
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.setCardWizardBackgroundAnimationState = function (stateNumber) {
            parent.setState({ animationStateNumber: stateNumber })
        }
        bindings.setCardWizardCardInfo = function (name, description, splashImage, rarity) {
            parent.setState({
                name: name,
                description: description,
                splashImage: splashImage,
                rarity: rarity
            })
        }
    },
    render: function () {
        console.log('render with animationStateNumber: ' + this.state.animationStateNumber)

        //var name = "Alpha Male"
        //var description = "I am big cat"
        //var splashImage = "splashes/AlphaMale.png"
        //var rarity = "epic"
        var name = this.state.name
        var description = this.state.description
        var splashImage = this.state.splashImage
        var rarity = this.state.rarity
        var shiny = rarity == 'secret'
        // v9.03 shiny cards lag like crazy for some reason, super lame. just rely on VFX I guess.
        shiny = false

        var cardArt = React.createElement('div', {
            className: 'card-art-container',
            onMouseDown: function (e) {
                console.log('click card to exit')
                engine.call('OnExitCardWizard')
                engine.trigger('setCardWizardInProgress', false)
            }
        },
            //React.createElement('img', { className: 'back ' + cardArtTheme, src: 'hud/img/cards/' + cardArtTheme + '/back.png' }),
            React.createElement('img', { className: 'front-bg ' + cardArtTheme, src: 'hud/img/cards/' + cardArtTheme + '/front_bg.png' }),
            React.createElement('img', { className: 'splash-image ' + cardArtTheme, src: 'hud/img/' + splashImage }),
            React.createElement('img', { className: 'front-frame ' + cardArtTheme + ' ' + rarity, src: 'hud/img/cards/' + cardArtTheme + '/front_frame.png' }),
            React.createElement('div', { className: 'front-name ' + cardArtTheme }, name),
            React.createElement('div', { className: 'front-description ' + cardArtTheme, dangerouslySetInnerHTML: { __html: description } })
        )

        return React.createElement('div', {},
            (this.state.animationStateNumber == 0 || this.state.animationStateNumber == 1 || this.state.animationStateNumber == 2 || this.state.animationStateNumber == 3 || this.state.animationStateNumber == 4)
            && React.createElement('div', { className: 'fade-to-black' + (this.state.animationStateNumber == 1 ? ' start-animation' : '') }),
            (this.state.animationStateNumber == 2 || this.state.animationStateNumber == 3)
            && React.createElement('div', { className: 'card-wizard-animation-silhouette' + (this.state.animationStateNumber == 3 ? ' start-animation' : '') + (shiny ? ' shiny' : '') }),
            (this.state.animationStateNumber == 2 || this.state.animationStateNumber == 3 || this.state.animationStateNumber == 4)
            && React.createElement('div', { className: 'card-wizard-animation-background' }),
            (this.state.animationStateNumber == 4)
            && cardArt,
            // Preload images since the preloader sometimes doesn't work
            (this.state.animationStateNumber == 0 || this.state.animationStateNumber == 1)
            && React.createElement('div', { className: 'card-wizard-animation-silhouette', style: { opacity: 0.001 } }),
            (this.state.animationStateNumber == 0 || this.state.animationStateNumber == 1)
            && React.createElement('div', { className: 'card-wizard-animation-background', style: { opacity: 0.001 } })
        )
    }
})

var getChallengeVictoryWindow = function (props) {
    return React.createElement(challengeVictoryWindow, props)
}

var challengeVictoryWindow = React.createClass({
    propTypes: {
        challengeBuild: null
    },
    render: function () {
        var parent = this

        if (this.props.challengePlayFabId == null) return null

        return React.createElement('div', { id: 'ChallengeVictory', className: '' },
            React.createElement('div', {
                style: {
                    padding: '28px 0 20px 0',
                    width: '60vw',
                    margin: 'auto',
                    color: '#8ff110',
                    fontSize: '64px',
                    textTransform: 'uppercase'
                }
            },
                React.createElement('img', { src: 'hud/img/icons/Challenger.png', style: { margin: '12px 8px 0 0', verticalAlign: 'top', width: '3vw' } }),
                loc('new_record', 'New Record!'),
                React.createElement('img', { src: 'hud/img/icons/Challenger.png', style: { margin: '12px 0 0 8px', verticalAlign: 'top', width: '3vw' } })
            ),
            React.createElement('div', {
                style: {
                    padding: '0 16px 16px 16px',
                    width: '560px',
                    margin: 'auto'
                },
                dangerouslySetInnerHTML: {
                    __html: this.props.message
                    //__html: "something something " + generateRatingImageHtml(2286) + " ithion"
                }
            }),
            React.createElement('div', {
                className: 'builds',
                style: {
                    position: 'relative',
                    height: '410px',
                }
            },
                React.createElement('div', { className: 'challenge-build-container mine' },
                    React.createElement('div', {
                        style: {
                            color: '#ffcc00',
                            position: 'absolute',
                            top: '3px',
                            left: '0',
                            width: '100%',
                            textAlign: 'center',
                        }
                    },
                        getRatingImage(this.props.myRating) && React.createElement('img', {
                            src: getRatingImage(this.props.myRating),
                            style: { height: '24px', verticalAlign: 'middle' }
                        }),
                        getRatingImage(this.props.myRating) && React.createElement('span', {
                            className: 'rating-numeral', style: {
                                right: '15px', marginRight: '-16px', width: '20px', display: 'inline-block'
                            }
                        }, getRatingDivisionNumeral(this.props.myRating)),
                        loc('player_score', globalState.savedUsername + "'s score", [globalState.savedUsername]),
                        ': ',
                        this.props.myScore.toFixed(0)
                    ),
                    React.createElement('div', { className: 'building-grid' }),
                    this.props.myTowers.map(function (fighterPosition) {
                        return React.createElement('span', {},
                            React.createElement('img', {
                                className: 'tower-icon',
                                src: fighterPosition.icon,
                                style: {
                                    position: 'absolute',
                                    left: fighterPosition.x * 24 - 8,
                                    bottom: fighterPosition.y * 24
                                }
                            })
                        )
                    }),
                    parent.props.myLegionSpell && React.createElement('img', {
                        src: 'hud/img/' + parent.props.myLegionSpellIcon,
                        className: 'powerup',
                        height: '12px',
                        width: '12px',
                        style: {
                            position: 'absolute',
                            left: parent.props.myLegionSpellX * 24 + 3,
                            bottom: parent.props.myLegionSpellZ * 24 + 1
                        }
                    })
                ),
                React.createElement('div', { className: 'challenge-build-container' },
                    React.createElement('div', {
                        style: {
                            color: '#ffcc00',
                            position: 'absolute',
                            top: '3px',
                            left: '0',
                            width: '100%',
                            textAlign: 'center',
                        }
                    },
                        getRatingImage(this.props.challengeRating) && React.createElement('img', {
                            src: getRatingImage(this.props.challengeRating),
                            style: { height: '24px', verticalAlign: 'middle' }
                        }),
                        getRatingImage(this.props.challengeRating) && React.createElement('span', {
                            className: 'rating-numeral', style: {
                                right: '15px', marginRight: '-16px', width: '20px', display: 'inline-block'
                            }
                        }, getRatingDivisionNumeral(this.props.challengeRating)),
                        loc('player_score', this.props.challengeName + "'s score", [this.props.challengeName]),
                        ': ',
                        this.props.challengeScore.toFixed(0)
                    ),
                    React.createElement('div', { className: 'building-grid' }),
                    this.props.challengeTowers.map(function (fighterPosition) {
                        return React.createElement('span', {},
                            React.createElement('img', {
                                className: 'tower-icon',
                                src: fighterPosition.icon,
                                style: {
                                    position: 'absolute',
                                    left: fighterPosition.x * 24 - 8,
                                    bottom: fighterPosition.y * 24
                                }
                            })
                        )
                    }),
                    parent.props.challengeLegionSpell && React.createElement('img', {
                        src: 'hud/img/' + parent.props.challengeLegionSpellIcon,
                        className: 'powerup',
                        height: '12px',
                        width: '12px',
                        style: {
                            position: 'absolute',
                            left: parent.props.challengeLegionSpellX * 24 + 3,
                            bottom: parent.props.challengeLegionSpellZ * 24 + 1
                        }
                    })
                )
            ),
            React.createElement('div', {
                style: {
                    marginTop: '12px'
                }
            },
                React.createElement('span', { style: { color: '#ffcc00', marginRight: '4px' } }, loc('mercenary_value_received', 'Mercenaries Received: ')),
                this.props.challengeMercenaryIcons.map(function (icon) {
                    return React.createElement('img', { src: icon, style: { height: '24px', width: '24px' } })
                })
            ),
            React.createElement('div', { className: 'front-description-buttons' },
                React.createElement('div', { className: 'confirmation-buttons' },
                    React.createElement('div', {
                        className: 'button big',
                        onMouseDown: function (e) {
                            engine.trigger('hideFullScreenPopup')
                        }
                    }, loc('ok', 'Ok'))
                )
            )
        )
    }
})

var getLastWeekWinnerWindow = function (props) {
    return React.createElement(lastWeekWinnerWindow, props)
}

var lastWeekWinnerWindow = React.createClass({
    propTypes: {
        challengeBuild: null
    },
    render: function () {
        var parent = this
        return React.createElement('div', { id: 'ChallengeVictory', className: '' },
            React.createElement('div', {
                style: {
                    padding: '28px 0 20px 0',
                    width: '600px',
                    margin: 'auto',
                    color: '#8ff110',
                    fontSize: '36px',
                    textTransform: 'uppercase'
                }
            },
                React.createElement('img', { src: 'hud/img/icons/Challenger.png', style: { margin: '12px 8px 0 0', verticalAlign: 'middle' } }),
                loc('last_week_challenge', "Last week's challenge"),
                React.createElement('img', { src: 'hud/img/icons/Challenger.png', style: { margin: '12px 0 0 8px', verticalAlign: 'middle' } })
            ),
            React.createElement('div', {
                style: {
                    padding: '0 16px 16px 16px',
                    width: '560px',
                    margin: 'auto'
                }
            }),
            React.createElement('div', {
                className: 'builds',
                style: {
                    position: 'relative',
                    height: '410px',
                }
            },
                React.createElement('div', { className: 'challenge-build-container mine' },
                    React.createElement('div', {
                        style: {
                            color: '#ffcc00',
                            position: 'absolute',
                            top: '3px',
                            left: '0',
                            width: '100%',
                            textAlign: 'center',
                        }
                    },
                        getRatingImage(this.props.myRating) && React.createElement('img', {
                            src: getRatingImage(this.props.myRating),
                            style: { height: '24px', verticalAlign: 'middle' }
                        }),
                        getRatingImage(this.props.myRating) && React.createElement('span', {
                            className: 'rating-numeral', style: {
                                right: '15px', marginRight: '-16px', width: '20px', display: 'inline-block'
                            }
                        }, getRatingDivisionNumeral(this.props.myRating)),
                        loc('player_score', this.props.myDisplayName + "'s score", [this.props.myDisplayName]),
                        ': ',
                        this.props.myScore.toFixed(0)
                    ),

                    React.createElement('div', { className: 'building-grid' }),
                    this.props.myTowers.map(function (fighterPosition) {
                        return React.createElement('span', {},
                            React.createElement('img', {
                                className: 'tower-icon',
                                src: fighterPosition.icon,
                                style: {
                                    position: 'absolute',
                                    left: fighterPosition.x * 24 - 8,
                                    bottom: fighterPosition.y * 24
                                }
                            })
                        )
                    }),
                    parent.props.legionSpellIcon && React.createElement('img', {
                        src: 'hud/img/' + parent.props.legionSpellIcon,
                        className: 'powerup',
                        height: '12px',
                        width: '12px',
                        style: {
                            position: 'absolute',
                            left: parent.props.myLegionSpellX * 24 + 3,
                            bottom: parent.props.myLegionSpellZ * 24 + 1
                        }
                    })
                ),
                React.createElement('div', { className: 'challenge-build-container' },
                    React.createElement('div', {
                        style: {
                            color: '#ffcc00',
                            position: 'absolute',
                            top: '3px',
                            left: '0',
                            width: '100%',
                            textAlign: 'center',
                        }
                    },
                        getRatingImage(this.props.rating) && React.createElement('img', {
                            src: getRatingImage(this.props.rating),
                            style: { height: '24px', verticalAlign: 'middle' }
                        }),
                        getRatingImage(this.props.rating) && React.createElement('span', {
                            className: 'rating-numeral', style: {
                                right: '15px', marginRight: '-16px', width: '20px', display: 'inline-block'
                            }
                        }, getRatingDivisionNumeral(this.props.rating)),
                        loc('player_score', this.props.displayName + "'s score", [this.props.displayName]),
                        ': ',
                        this.props.score.toFixed(0)
                    ),
                    React.createElement('div', { className: 'building-grid' }),
                    this.props.towers.map(function (fighterPosition) {
                        return React.createElement('span', {},
                            React.createElement('img', {
                                className: 'tower-icon',
                                src: fighterPosition.icon,
                                style: {
                                    position: 'absolute',
                                    left: fighterPosition.x * 24 - 8,
                                    bottom: fighterPosition.y * 24
                                }
                            })
                        )
                    }),
                    parent.props.legionSpellIcon && React.createElement('img', {
                        src: 'hud/img/' + parent.props.legionSpellIcon,
                        className: 'powerup',
                        height: '12px',
                        width: '12px',
                        style: {
                            position: 'absolute',
                            left: parent.props.legionSpellX * 24 + 3,
                            bottom: parent.props.legionSpellZ * 24 + 1
                        }
                    })
                )
            ),
            React.createElement('div', {
                style: {
                    marginTop: '12px'
                }
            },
                React.createElement('span', { style: { color: '#ffcc00', marginRight: '4px' } }, loc('mercenary_value_received', 'Mercenaries Received: ')),
                this.props.mercenariesReceivedIcons.map(function (icon) {
                    return React.createElement('img', { src: icon, style: { height: '24px', width: '24px' } })
                })
            ),
            React.createElement('div', { className: 'front-description-buttons' },
                React.createElement('div', { className: 'confirmation-buttons' },
                    React.createElement('div', {
                        className: 'button big',
                        onMouseDown: function (e) {
                            engine.trigger('hideFullScreenPopup')
                        }
                    }, loc('ok', 'Ok'))
                )
            )
        )
    }
})

getGuildFAQ = function () {
    var guildLevel = 1

    if (globalState.selectedGuild && globalState.selectedGuild.level >= 1)
        guildLevel = globalState.selectedGuild.level

    return React.createElement('div', { id: 'GuildFAQ', className: 'faq-container' },
        React.createElement('div', { className: 'content' },
            React.createElement('div', { className: 'left' },
                React.createElement('div', { className: 'title category' },
                    React.createElement('img', { src: 'hud/img/guilds/Reward.png', style: { height: '28px', marginRight: '4px' } }),
                    loc('guild_faq', 'Guild Rewards')),
                React.createElement('div', {
                    style: { marginBottom: '24px' },
                    dangerouslySetInnerHTML: { __html: loc('guild_faq_subtitle', 'Your guild earns rewards as it levels up.') }
                }),
                React.createElement('div', { className: 'category' }, loc('guild_faq_category_1', 'How to earn Guild XP (GXP)')),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, loc('guild_faq_category_1_bullet_1', '+10 GXP when a member wins a game')),
                    //React.createElement('li', { className: '' }, loc('guild_faq_category_1_bullet_2', '+50 GXP when a new member joins')),
                    React.createElement('li', { className: '' }, loc('guild_faq_category_1_bullet_3', '+250 GXP when a member donates a card')),
                    /* todo should refactor these to all use html */
                    React.createElement('li', { className: '', dangerouslySetInnerHTML: { __html: loc('guild_faq_category_1_bullet_4', '+100-500 GXP when the guild finishes Top 10 in a Guild War') } })
                ),
                React.createElement('div', { className: 'category' }, loc('guild_faq_category_2', 'Guild War')),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, loc('guild_faq_category_2_bullet_1', 'Every Saturday between 8 am and 3 pm PST is a Guild War')),
                    React.createElement('li', { className: '' }, loc('guild_faq_category_2_bullet_2', 'During a Guild War, the guild earns Victory Points (VP) when members win games:')),
                    React.createElement('li', { className: '' }, loc('guild_faq_category_2_bullet_3', 'After 1st win: +5 VP')),
                    React.createElement('li', { className: '' }, loc('guild_faq_category_2_bullet_4', 'After 2rd win: +5 VP')),
                    React.createElement('li', { className: '' }, loc('guild_faq_category_2_bullet_5', 'After 3rd win: +5 VP')),
                    React.createElement('li', { className: '' }, loc('guild_faq_category_2_bullet_6', 'After 4th win: +15 VP')),
                    React.createElement('li', { className: '' }, loc('guild_faq_category_2_bullet_7', 'No bonuses after 5 wins.'))
                ),
                React.createElement('div', { className: 'category' }, loc('guild_faq_category_3', 'Guild War Rewards')),
                React.createElement('ul', { className: '' },
                    React.createElement('li', { className: '' }, loc('guild_faq_category_3_bullet_1', '1st Place: +1000 GXP')),
                    React.createElement('li', { className: '' }, loc('guild_faq_category_3_bullet_2', '2nd Place: +500 GXP')),
                    React.createElement('li', { className: '' }, loc('guild_faq_category_3_bullet_3', '3rd-50th Place: +250 GXP'))
                )
            ),
            React.createElement('div', { className: 'right right-1' },
                getGuildLevelElement(guildLevel, 1, 0),
                getGuildLevelElement(guildLevel, 2, 3000),
                getGuildLevelElement(guildLevel, 3, 7000), // Note this is the TOTAL xp
                getGuildLevelElement(guildLevel, 4, 12000),
                getGuildLevelElement(guildLevel, 5, 18000)
            ),
            React.createElement('div', { className: 'right right-2' },
                getGuildLevelElement(guildLevel, 6, 25000),
                getGuildLevelElement(guildLevel, 7, 33000),
                getGuildLevelElement(guildLevel, 8, 43000),
                getGuildLevelElement(guildLevel, 9, 55000),
                React.createElement('div', { className: 'ranked-tier current locked' },
                    React.createElement('img', { className: 'ranked-badge', src: 'hud/img/guilds/10.png' }),
                    React.createElement('div', { className: 'ranked-tier-name' },
                        React.createElement('div', {
                            dangerouslySetInnerHTML: {
                                __html: loc('guild_level_10_perk', 'All members receive +100 Premium Essence')
                            }
                        })
                    ),
                    React.createElement('div', { className: 'ranked-tier-current locked' }, loc('every_additional_guild_xp', 'Every Additional 15,000 GXP', ['15,000']))
                )
            )
        ),
        React.createElement('div', { className: 'front-description-buttons' },
            React.createElement('div', { className: 'confirmation-buttons' },
                React.createElement('div', {
                    className: 'button big',
                    onMouseDown: function (e) {
                        engine.trigger('hideFullScreenPopup')
                    }
                }, loc('ok', 'Ok'))
            )
        )
    )
}

var getGuildLevelElement = function (guildLevel, i, xpNeeded) {
    return React.createElement('div', { className: 'ranked-tier current' + (guildLevel < i ? ' locked' : '') },
        React.createElement('img', {
            className: 'ranked-badge', src: 'hud/img/guilds/0' + i + '.png'
        }),
        React.createElement('div', { className: 'ranked-tier-name' },
            //loc('level', 'Level ' + i, [i]),
            React.createElement('div', {
                dangerouslySetInnerHTML: {
                    __html: loc('guild_level_' + i + '_perk', 'Guild Level ' + i + ' Perk')
                }
            })
        ),
        guildLevel >= i && React.createElement('div', { className: 'ranked-tier-current' }, loc('unlocked', 'Unlocked!')),
        guildLevel < i && React.createElement('div', { className: 'ranked-tier-current locked' }, loc('amount_gxp', xpNeeded + ' GXP', [xpNeeded]))
    )
}

getFullScreenImagePreview = function (imageSrc) {
    return React.createElement('div', { className: 'card-art-container wide' },
        React.createElement('img', { className: 'front-image-only', src: imageSrc })
    )
}

// Use this as a template moving forward
getGuildWarTallyPopup = function (props) {
    return React.createElement('div', { id: 'GuildWarTally', className: 'generic-full-screen-popup with-background', },
        React.createElement('img', { className: 'splash', src: 'hud/img/splashes/GuildWar.png' }),
        React.createElement('div', { className: 'name' }, loc('guild_war_results', 'Guild War Results')),
        React.createElement('div', {
            className: 'description'
        },
            React.createElement('div', {
                dangerouslySetInnerHTML: {
                    __html: '<span class="label">' + loc('your_guild', 'Your Guild') + ':</span> ' + globalState.myGuildName
                        + ' (' + props.myGuildVP + ' VP)'
                }
            }),
            React.createElement('div', {
                dangerouslySetInnerHTML: {
                    __html: '<span class="label">' + loc('your_guild_rank', 'Your Guild Rank') + ':</span> #' + props.myGuildRank
                }
            }),
            React.createElement('div', {
                dangerouslySetInnerHTML: {
                    __html: '<span class="label">' + loc('you_contributed', 'You Contributed') + ':</span> ' + props.myVP + ' VP'
                }
            }),
            React.createElement('div', { style: { marginTop: '2vh' } },
                React.createElement('span', {
                    dangerouslySetInnerHTML: {
                        __html: '<span class="label">' + loc('top_guild', 'Top Guild') + ':</span> ' + props.topGuildName
                            + ' (' + props.topGuildVP + ' VP)'
                    }
                }),
                React.createElement('a', {
                    style: {
                        color: '#ffcc00', marginLeft: '6px', display: 'block'
                    },
                    onMouseDown: function (e) {
                        engine.trigger('hideFullScreenPopup')
                        engine.trigger('loadView', 'leaderboards')
                        engine.trigger('selectSubmenu', 5) // SMELLY!!!
                    }
                },
                    '[' + loc('view_all_rankings', 'View All Rankings') + ']'
                )
            )
        ),
        React.createElement('div', { className: 'confirmation-buttons' },
            React.createElement('div', {
                className: 'button big',
                onMouseDown: function (e) {
                    engine.trigger('hideFullScreenPopup')
                }
            }, loc('ok', 'Ok'))
        )
    )
}

getGenericImagePopup = function (props) {
    if (!props.imageStacksForBorder)
        props.imageStacksForBorder = 0

    return React.createElement('div', { id: 'GenericImagePopup', className: 'generic-full-screen-popup with-background', },
        React.createElement('div', { className: 'title', dangerouslySetInnerHTML: { __html: props.title } }),
        props.imageStacksForBorder == 0 && React.createElement('img', { className: 'splash', src: 'hud/img/' + props.image }),
        props.imageStacksForBorder > 0 && React.createElement('div', { className: 'img-container ' + getGuildAvatarStacksClass(props.imageStacksForBorder) },
            React.createElement('img', { className: 'splash', src: 'hud/img/' + props.image })
        ),
        React.createElement('div', { className: 'name', dangerouslySetInnerHTML: { __html: props.header } }),
        React.createElement('div', { className: 'description' },
            React.createElement('div', { dangerouslySetInnerHTML: { __html: props.description } })
        ),
        props.image2 && React.createElement('img', {
            src: 'hud/img/' + props.image2,
            style: {
                maxHeight: '20vh', marginTop: '2vh'
            }
        }),
        React.createElement('div', { className: 'confirmation-buttons' },
            React.createElement('div', {
                className: 'button big',
                onMouseDown: function (e) {
                    engine.trigger('hideFullScreenPopup')
                }
            }, loc('ok', 'Ok'))
        )
    )
}

getGenericIconsPopup = function (props) {
    return React.createElement('div', { id: 'GenericImagePopup', className: 'generic-full-screen-popup with-background', },
        React.createElement('div', { className: 'title', dangerouslySetInnerHTML: { __html: props.title } }),
        props.icons.map(function (icon) {
            return React.createElement('img', { className: 'popup-icon', src: 'hud/img/' + icon })
        }),
        React.createElement('div', { className: 'name', dangerouslySetInnerHTML: { __html: props.header } }),
        React.createElement('div', { className: 'description' },
            React.createElement('div', { dangerouslySetInnerHTML: { __html: props.description } })
        ),
        React.createElement('div', { className: 'confirmation-buttons' },
            React.createElement('div', {
                className: 'button big',
                onMouseDown: function (e) {
                    engine.trigger('hideFullScreenPopup')
                }
            }, loc('ok', 'Ok'))
        )
    )
}

getGuildCreationSplash = function () {
    return React.createElement('div', { className: 'card-art-container wide' },
        React.createElement('img', { className: 'front-image-only', src: 'hud/img/splashes/Guild.png' })
    )
}

getPlayCampaignWindow = function (missionId, missionName, missionHardDescription, starsHtml, hardModeEnabled) {

    var hardDisabledTooltip = ""
    if (!hardModeEnabled)
        hardDisabledTooltip = loc('hard_disabled', "Hard mode is unlocked after earning the first two stars.")

    return React.createElement('div', { className: 'mini-shop-window play-mission' },
        React.createElement('div', { className: 'items-container store-container' },
            React.createElement('div', { className: 'items' },
                React.createElement('div', {
                    style: {
                        display: 'block',
                        height: '8vh',
                        lineHeight: '6vh',
                        fontSize: '3vh'
                    }
                },
                    loc('play_mission', 'Play Mission: ' + missionName, [missionName])
                ),
                React.createElement('div', {
                    style: {
                        marginTop: '-28px',
                        marginBottom: '12px'
                    },
                    dangerouslySetInnerHTML: { __html: starsHtml }
                }),
                React.createElement('div', {
                    className: 'equipped store-item'
                },
                    React.createElement('div', {
                        className: 'item-image',
                        style: {
                            background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.32) 75%, rgba(0,0,0,0.80) 100%),'
                                + 'url(hud/img/campaign/PlayNormal.png)',
                            backgroundSize: 'cover',
                            transform: globalState.isMac ? 'scale(-1)' : ''
                        },
                        onMouseEnter: function (e) {
                            engine.call('OnMouseOverMedium', 1)
                        },
                        onMouseDown: function (e) {
                            console.log('clicked play normal ' + missionId)
                            engine.call('OnChooseMission', missionId, false)
                        }
                    }),
                    React.createElement('div', { className: 'title' }, loc('normal', 'Normal')),
                    React.createElement('div', { className: 'price' },
                        React.createElement('div', {
                            className: 'price-subtext', style: { color: '#ccc' },
                            dangerouslySetInnerHTML: {
                                __html: ''
                            }
                        })
                    )
                ),
                React.createElement('div', {
                    className: 'equipped store-item' + (!hardModeEnabled ? ' disabled simple-tooltip' : '')
                },
                    !hardModeEnabled && React.createElement('span', {
                        className: 'tooltiptext',
                        style: { width: 'calc(100% - 28px)', zIndex: '2', top: '0', bottom: 'auto' }
                    }, hardDisabledTooltip),
                    React.createElement('div', {
                        className: 'item-image',
                        style: {
                            background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.32) 75%, rgba(0,0,0,0.80) 100%),'
                                + 'url(hud/img/campaign/PlayHard.png)',
                            backgroundSize: 'cover',
                            transform: globalState.isMac ? 'scale(-1)' : ''
                        },
                        onMouseEnter: function (e) {
                            engine.call('OnMouseOverMedium', 2)
                        },
                        onMouseDown: function (e) {
                            if (!hardModeEnabled) return

                            console.log('clicked play hard ' + missionId)
                            engine.call('OnChooseMission', missionId, true)
                        }
                    }),
                    React.createElement('div', { className: 'title' }, loc('hard_bots', 'Hard')),
                    React.createElement('div', { className: 'price' },
                        React.createElement('div', {
                            className: 'price-subtext', style: {
                                color: '#ccc',
                                textShadow: '1px 1px 2px black, 0px 0px 6px black'
                            },
                            dangerouslySetInnerHTML: {
                                __html: missionHardDescription
                            }
                        })
                    )
                )
            )
        ),
        React.createElement('div', { className: 'front-description-buttons' },
            React.createElement('div', { className: 'confirmation-buttons' },
                React.createElement('div', {
                    className: 'button big',
                    onMouseEnter: function (e) {
                        engine.call("OnMouseOverMedium", 4)
                    },
                    onMouseDown: function (e) {
                        engine.trigger('hideFullScreenPopup')
                    }
                }, loc('back', 'Back'))
            )
        )
    )
}

var FriendInvitationMenuView = React.createClass({
    render: function () {
        return (
            React.createElement('div', { id: 'FriendInvitationMenuView' },
                React.createElement('div', {
                    className: 'fullscreen',
                    onMouseDown: function (e) { // v1.50
                        engine.trigger('enableChat', false)
                    },
                    style: {
                        pointerEvents: 'all'
                    }
                },
                    React.createElement(FriendInvitationMenu, {})
                )
            )
        )
    }
})


var FriendInvitationMenu = React.createClass({
    getInitialState: function () {
        return {
            friends: globalState.friends,
            alreadyInvited: [],
            selectedInvitationNumber: -1,
            header: globalState.inviteFriendMenuProps.header,
            popupName: globalState.inviteFriendMenuProps.popupName,
            friendTrigger: globalState.inviteFriendMenuProps.friendTrigger
        }
    },
    componentWillMount: function () {
        var parent = this

        bindings.refreshFriendInvitationFriendsList = function () {
            //console.log('refreshFriendInvitationFriendsList')
            parent.setState({
                friends: globalState.friends
            })
        }

        bindings.refreshFriendInvitationMenu = function (props) {
            parent.setState({
                alreadyInvited: [],
                header: props.header,
                popupName: props.popupName,
                friendTrigger: props.friendTrigger
            })
        }

        bindings.handleInvitedFriend = function (invitedFriend) {
            parent.state.alreadyInvited.push(invitedFriend)
            parent.setState({
                alreadyInvited: parent.state.alreadyInvited
            })
        }
    },
    render: function () {
        var parent = this

        // DEBUGGING
        //console.log('friends: ' + JSON.stringify(this.state.friends))

        if (this.state.friends == null) {
            return React.createElement('div', { className: 'centered-text overlay no-background' },
                React.createElement('div', {
                    className: 'centered-text-wrapper', style: { background: 'rgba(0, 0, 0, 0.5)' }
                },
                    React.createElement('div', {
                        id: 'FriendInvitationMenu', className: 'full-screen directory',
                        style: {
                            textAlign: 'center',
                            padding: '4vh'
                        }
                    },
                        React.createElement('img', {
                            src: 'hud/img/ui/loading-small.gif',
                        })
                    )
                )
            )
        }

        var sortedFriends = []
        for (var i in parent.state.friends) {
            var friend = parent.state.friends[i]

            sortedFriends.push(friend)
        }
        sortedFriends.sort(function (x, y) {
            if (!x.isPlayingLegionTD2 && y.isPlayingLegionTD2) return 1
            if (x.isPlayingLegionTD2 && !y.isPlayingLegionTD2) return -1

            if (x.currentView == 'connecting' && y.currentView != 'connecting') return 1
            if (x.currentView != 'connecting' && y.currentView == 'connecting') return -1

            var inGameX = x.playingAs != null && x.playingAs.length > 0 && x.playingAs != 'inqueue'
            var inGameY = y.playingAs != null && y.playingAs.length > 0 && y.playingAs != 'inqueue'

            if (inGameX && !inGameY) return 1
            if (!inGameX && inGameY) return -1

            // v8.06 let's break ties deterministically so names don't jump around, I think
            return x.name.localeCompare(y.name)

            //return 0
        })

        return (
            React.createElement('div', { className: 'centered-text overlay no-background' },
                React.createElement('div', {
                    className: 'centered-text-wrapper', style: { background: 'rgba(0, 0, 0, 0.5)' }
                },
                    React.createElement('div', { id: 'FriendInvitationMenu', className: 'full-screen directory' },
                        React.createElement('div', { className: 'directory-content' },
                            React.createElement('h1', { style: { display: 'inline-block' } }, parent.state.header),
                            React.createElement('div', {
                                className: 'button em',
                                onMouseDown: function (e) {
                                    console.log('click button')
                                    engine.trigger('loadPopup', parent.state.popupName)
                                },
                                style: {
                                    float: 'right', marginTop: '1vh'
                                }
                            },
                                loc('enter_name', 'Enter name')
                            ),
                            React.createElement('ul', { className: 'full-screen-entry-list scrollable' },
                                parent.state.friends == null || parent.state.friends.length == 0 && React.createElement('div', {
                                    onMouseDown: function (e) {
                                        if (e.nativeEvent.which == 2) return // v7.00 fix for middle-click glitchiness
                                        engine.call("OnOpenURL", "https://www.howtogeek.com/336931/how-to-make-your-steam-profile-private/")
                                    },
                                    dangerouslySetInnerHTML: {
                                        __html: loc('steam_private_profile', "If your friends list isn't showing up, make sure you are signed into Steam Friends |amp Chat. Also, change your Steam Profile settings to public. |n|n(Click here to see how)")
                                    }
                                }),
                                sortedFriends && sortedFriends.length > 0 && sortedFriends.map(function (friend, index) {

                                    // Omit image folder if this is raw image data (Steam avatar)
                                    var imageFolder = "hud/img/"
                                    if (_.startsWith(friend.image, 'data:image'))
                                        imageFolder = ""

                                    var cannotInvite = false
                                    var cannotInviteText = ''
                                    var cannotInviteColor = ''

                                    if (friend.playingAs != null && friend.playingAs.length > 0 && friend.playingAs != 'inqueue') {
                                        cannotInvite = true
                                        cannotInviteText = locName('online_in_game', 'In Game')
                                        cannotInviteColor = '#ffff00'
                                    }

                                    if (friend.currentView == 'connecting') {
                                        cannotInvite = true
                                        cannotInviteText = loc('entering_main_menu', 'Entering main menu')
                                        cannotInviteColor = '#ffff00'
                                    }

                                    if (!friend.online) {
                                        cannotInvite = true
                                        cannotInviteText = loc('offline', 'Offline')
                                        cannotInviteColor = '#909090'
                                    }

                                    if (friend.online && !friend.isPlayingLegionTD2) {
                                        cannotInvite = true
                                        cannotInviteText = loc('in_steam', 'In Steam')
                                        cannotInviteColor = '#60cbdd'
                                    }

                                    if (_.includes(parent.state.alreadyInvited, friend.name)) {
                                        cannotInvite = true
                                        cannotInviteText = loc('already_invited', 'Already Invited')
                                        cannotInviteColor = '#ff8800'
                                    }

                                    return React.createElement('div', { className: 'invite-friend' },
                                        React.createElement('img', { className: 'friend-image ' + getAvatarStacksClass(friend.avatarStacks), src: imageFolder + friend.image }),
                                        React.createElement('span', { className: 'friend-name' }, friend.name),
                                        !cannotInvite && !_.includes(parent.state.alreadyInvited, friend.name) && React.createElement('span', {
                                            className: 'friend-button', onMouseDown: function (e) {
                                                console.log('invite ' + friend.name + ', friendTrigger: ' + parent.state.friendTrigger)
                                                engine.trigger('handleInvitedFriend', friend.name)
                                                engine.trigger(parent.state.friendTrigger, friend.name)
                                            }
                                        }, '[' + loc('invite', 'Invite') + ']'),
                                        cannotInvite && React.createElement('span', {
                                            className: 'friend-button already-invited',
                                            style: {
                                                color: cannotInviteColor
                                            }
                                        }, '[' + cannotInviteText + ']')
                                    )
                                })
                            ),
                            React.createElement('div', { className: 'front-description-buttons' },
                                React.createElement('div', { className: 'confirmation-buttons' },
                                    React.createElement(MenuButton, {
                                        name: 'back',
                                        displayName: loc('back', 'Back'),
                                        className: 'big',
                                        behavior: function () {
                                            engine.trigger('escape')
                                        }
                                    })
                                )
                            )
                        )
                    )
                )
            )
        )
    }
})

acceptMatchFound = function () {
    if (globalState.matchFoundButtonPressed) {
        console.log('acceptMatchFound bail early since matchFoundButtonPressed already true')
        return
    }

    globalState.matchFoundButtonPressed = true

    console.log('OnMatchFoundAccepted')
    engine.call('OnMatchFoundAccepted')

    showFullScreenPopup(getMatchFound(), false, null, true, true)
}

declineMatchFound = function () {
    if (globalState.matchFoundButtonPressed) return
    if (globalState.matchFoundDeclinePressed) return
    globalState.matchFoundButtonPressed = true
    globalState.matchFoundDeclinePressed = true

    // Actually let's just have this come from serverside to have consistent logic
    // Delay a bit for feel
    if (!isUnityHost) {
        setTimeout(function () {
            engine.trigger('handleMatchDeclined')
        }, 1000)
    }

    console.log('OnMatchFoundDeclined')
    engine.call('OnMatchFoundDeclined')

    showFullScreenPopup(getMatchFound(), false, null, true, true)
}

getMatchFound = function () {
    if (globalState.matchFoundTimeMax <= 0) {
        console.warn('invalid matchFoundTimeMax: ' + globalState.matchFoundTimeMax)
        return
    }

    var timerPercent = globalState.matchFoundTimeRemaining / globalState.matchFoundTimeMax

    var color = 'slate'
    if (globalState.matchFoundButtonPressed)
        color = 'gray'
    if (!globalState.matchFoundButtonPressed && timerPercent <= 0.25)
        color = 'red'

    if (globalState.matchFoundDone) {
        engine.trigger('hideFullScreenPopup', true)
        globalState.matchFoundDone = false
        return
    }

    if (globalState.matchFoundTimeRemaining > 0) {
        setTimeout(function () {
            if (!globalState.matchFoundDeclinePressed && !globalState.matchFoundDone) {
                globalState.matchFoundTimeRemaining = globalState.matchFoundTimeRemaining - 50
                showFullScreenPopup(getMatchFound(), false, null, true, true)
            }
        }, 50)
    } else {
        if (!globalState.matchFoundDeclinePressed) {
            console.log('time is up! --> auto decline')
            declineMatchFound()
        }
    }

    return React.createElement('div', { id: 'MatchFound', className: 'faq-container' },
        React.createElement('h1', { className: 'title' }, loc('match_found', 'Match Found!')),
        React.createElement('div', { className: 'front-description-buttons' },
            React.createElement('div', { className: 'match-found-text' },
                globalState.matchFoundText
            ),
            React.createElement('div', {
                className: 'match-found-sub-text',
                dangerouslySetInnerHTML: {
                    __html: globalState.matchFoundSubtext
                }
            }),
            React.createElement('div', { className: 'timer' },
                React.createElement('div', { className: "progress-container" + (globalState.matchFoundButtonPressed ? ' inactive' : '') },
                    React.createElement('div', {
                        className: "progress-bar " + color, style: {
                            width: (100 * timerPercent) + "%"
                        }
                    })
                )
            ),
            React.createElement('div', { className: 'confirmation-buttons' },
                React.createElement('div', {
                    className: 'button big ' + (globalState.matchFoundButtonPressed ? 'disabled' : ''),
                    onMouseDown: function (e) {
                        declineMatchFound()
                    }
                }, loc('decline', 'Decline')),
                React.createElement('div', {
                    className: 'button big ' + (globalState.matchFoundButtonPressed ? 'disabled' : 'em'),
                    onMouseDown: function (e) {
                        console.log('triggerMatchFoundAccept via click')
                        acceptMatchFound()
                    }
                }, loc('accept', 'Accept'))
            )
        )
    )
}