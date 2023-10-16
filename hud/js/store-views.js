// Store
// =============================================================================================

var StorePage = React.createClass({
    propTypes: {
        categories: React.PropTypes.string.isRequired,
        menuIndex: React.PropTypes.number.isRequired
    },
    getInitialState: function () {
        return {
            shopCatalog: globalState.shopCatalog,
            filterCategoryIndex: 0,
            filterOwnedIndex: 0,
            sortIndex: 0,
            filterSearch: '',
            mysteriousCardItem: null,
            mysteriousCardStock: [],
            mysteriousCardStockSecondsRemaining: 0,
            showLoading: false,
        }
    },
    componentWillMount: function () {
        var parent = this

        bindings.refreshCatalog[parent.props.menuIndex] = function (catalog, mysteriousCardItem, mysteriousCardStock, mysteriousCardStockSecondsRemaining) {
            console.log('bindings.refreshCatalog index ' + parent.props.menuIndex)

            parent.setState({
                shopCatalog: catalog,
                mysteriousCardItem: mysteriousCardItem,
                mysteriousCardStock: mysteriousCardStock,
                mysteriousCardStockSecondsRemaining: mysteriousCardStockSecondsRemaining,
            })
        }

        bindings.forceRefreshShopView = function () {
            // JANKY
            if (isBrowserTest)
                engine.trigger('refreshCatalog', testCatalog, testMysteriousCardItem, testCardWizardCards, 1234567)
            else
                engine.call('RefreshStore')
        }

        bindings.refreshRandomizeBackground = function () {
            parent.forceUpdate()
        }

        bindings.refreshRandomizeGameCoach = function () {
            parent.forceUpdate()
        }

        //console.log('parent.props.menuIndex: ' + parent.props.menuIndex + ', globalState.storeMenuTabCount: ' + globalState.storeMenuTabCount)
        // I don't really get this index checking, seems really weird... maybe this is the final tab or something
        if (parent.props.menuIndex == globalState.storeMenuTabCount - 1) {
            if (isBrowserTest) {
                setTimeout(function () {
                    engine.trigger('refreshCatalog', testCatalog, testMysteriousCardItem, testCardWizardCards, 1234567)
                }, 1000)
            }
            else {
                console.log('StorePage index ' + parent.props.menuIndex + ' componentWillMount --> RefreshStore')
                engine.call('RefreshStore')
            }
        }
    },
    handleSearchChange: function (e) {
        this.setState({ filterSearch: e.target.value })
    },
    setFilterIndexDelayed: function (index) {
        var parent = this
        // Instant
        parent.setState({ filterOwnedIndex: index })

        // Fake loading to give you feedback when you switch categories but the items don't change much
        //parent.setState({ showLoading: true })
        //setTimeout(function () {
        //    parent.setState({ filterOwnedIndex: index, showLoading: false })
        //}, 333)
    },
    render: function () {
        var parent = this

        if (_.isEmpty(parent.state.shopCatalog) || !this.state.mysteriousCardItem) {
            return React.createElement('div', {
                style: {
                    width: '100%',
                    textAlign: 'center',
                    top: '20vh',
                    position: 'absolute'
                }
            },
                React.createElement('img', {
                    src: 'hud/img/ui/loading-small.gif',
                })
            )
        }

        var categories = parent.state.shopCatalog[parent.props.categories]

        console.log('randomizeBackground ' + globalState.randomizeBackground)
        console.log('randomizeGameCoach ' + globalState.randomizeGameCoach)

        //console.log('categories: ' + JSON.stringify(categories))
        //console.log('parent.state.mysteriousCardStock: ' + JSON.stringify(parent.state.mysteriousCardStock))

        var categoryDropdownItems = []
        // "All" option
        //categoryDropdownItems.push({
        //    key: 'all',
        //    text: loc('all_skin_types', 'All Skin Types'),
        //    action: function () {
        //        console.log('set category index to all')
        //        parent.setState({ filterCategoryIndex: 0 })
        //    },
        //    html: loc('all_skin_types', 'All Skin Types')
        //})
        // Other categories
        categories.map(function (category, index) {
            categoryDropdownItems.push({
                key: category,
                text: loc(category, category),
                action: function () {
                    console.log('set category index to ' + (index))
                    parent.setState({ filterCategoryIndex: (index) })
                }
            })
        })

        // Owned Dropdown
        // var availableIndex = 0 // Unused; just use Collection view to see your total owned
        // Smelly stuff here :(
        var unlockableIndex = 0
        var ownedIndex = 1
        var allIndex = 2
        var unvailableIndex = 3
        var ownedDropdownItems = [
            { key: 0, text: loc('shop_filter_unlockable', 'Unlockable'), action: function () { parent.setFilterIndexDelayed(0) } },
            { key: 1, text: loc('shop_filter_owned', 'Owned'), action: function () { parent.setFilterIndexDelayed(1) } },
            { key: 2, text: loc('all', 'All'), action: function () { parent.setFilterIndexDelayed(2) } },
            // v8.00 removed now that KS skins are available for all
            //{ key: 3, text: loc('shop_filter_unavailable', 'Unavailable'), action: function () { parent.setFilterIndexDelayed(2) } },
        ]

        // Sort Dropdown
        var sortDropdownItems = [
            { key: 0, text: loc('sort_release_date', 'Sort by Release Date (Newest)'), action: function () { parent.setState({ sortIndex: 0 }) } },
            { key: 1, text: loc('sort_release_date_reverse', 'Sort by Release Date (Oldest)'), action: function () { parent.setState({ sortIndex: 1 }) } },
            { key: 2, text: loc('sort_price', 'Sort by Price (Highest)'), action: function () { parent.setState({ sortIndex: 2 }) } },
            { key: 3, text: loc('sort_price_reverse', 'Sort by Price (Lowest)'), action: function () { parent.setState({ sortIndex: 3 }) } },
        ]

        var enableRowTypeDropdown = categories.length > 1
        var enableOwnedDropdown = parent.props.categories == 'skinCategories'
        var enableSearch = parent.props.categories == 'skinCategories'
        var enableCardWizardBuy = parent.props.categories == 'cardCategories'
        var enableSortDropdown = parent.props.categories == 'skinCategories'
        var enableReverseReleaseDateSort = parent.props.categories == 'clientBackgroundCategories'
            || parent.props.categories == 'gameCoachCategories'

        console.log('enableReverseReleaseDateSort: ' + enableReverseReleaseDateSort + ', sortIndex: ' + parent.state.sortIndex)

        // Sorts
        parent.state.shopCatalog.catalog.sort(function (a, b) {
            // Release date (newest first), then break ties by price, then by name
            if (parent.state.sortIndex == 0) {
                if (a.releaseDateNumber == b.releaseDateNumber) {
                    if (a.price.pe == b.price.pe)
                        return a.name > b.name ? 1 : -1
                    return a.price.pe > b.price.pe ? -1 : 1
                }

                // v9.05 for certain categories, sort by release date in reverse first
                if (enableReverseReleaseDateSort)
                    return a.releaseDateNumber < b.releaseDateNumber ? -1 : 1
                else
                    return a.releaseDateNumber > b.releaseDateNumber ? -1 : 1
            }

            // Release date (oldest first), then break ties by price, then by name
            if (parent.state.sortIndex == 1) {
                if (a.releaseDateNumber == b.releaseDateNumber) {
                    if (a.price.pe == b.price.pe)
                        return a.name > b.name ? 1 : -1
                    return a.price.pe > b.price.pe ? -1 : 1
                }
                return a.releaseDateNumber > b.releaseDateNumber ? 1 : -1
            }

            // Price (highest first)
            if (parent.state.sortIndex == 2) {
                if (a.price.pe == b.price.pe)
                    return a.name > b.name ? 1 : -1
                return a.price.pe > b.price.pe ? -1 : 1
            }

            // Price (lowest first)
            if (parent.state.sortIndex == 3) {
                if (a.price.pe == b.price.pe)
                    return a.name > b.name ? 1 : -1
                return a.price.pe > b.price.pe ? 1 : -1
            }

            console.warn('unknown sort index: ' + parent.state.sortIndex)
        })

        var introMessage = ''
        switch (parent.props.categories) {
            case 'skinCategories':
            case 'clientBackgroundCategories':
            case 'gameCoachCategories':
                introMessage = loc('cosmetics_intro', 'Legion TD 2 has no pay to win. There are optional cosmetics that support continued development. <br>You can also earn these cosmetics just by playing and participating in a guild.')
                break
            case 'accountCategories':
                introMessage = loc('playstyles_intro', 'Legion TD 2 has no pay to win. Playstyles and special builders can be unlocked with essence earned only from playing the game.<br>These playstyles give you alternative fun ways to play the game, but are equal in power to the standard playstyles.')
                break
            case 'consumableCategories':
            case 'cardCategories':
                break
        }
        console.log('parent.props.categories: ' + parent.props.categories)

        var itemCount = 0

        return (
            React.createElement('div', {
                className: 'store-container',
                style: {
                    background: enableCardWizardBuy ? 'none' : ''
                },
                onWheel: function (e) {
                    // hotfix for missing/cutoff cards
                    // It has to do with the webkit filter grayscale performance optimization
                    // So we force opacity change slightly to force a redraw
                    // See Coherent email thread for explanation
                    var elem = parent.refs.main
                    elem.style.opacity = "0.99"
                    elem.offsetHeight;
                    elem.style.opacity = "1"
                }
            },
                React.createElement('div', {
                    className: 'store-main',
                    ref: 'main'
                },
                    introMessage.length > 0 && React.createElement('div', {
                        className: 'store-intro',
                        dangerouslySetInnerHTML: {
                            __html: introMessage
                        }
                    }),
                    React.createElement('div', { className: 'filters' },
                        enableRowTypeDropdown && React.createElement('div', { className: 'dropdown-container inline' },
                            React.createElement(DropdownLinks, {
                                choices: categoryDropdownItems,
                                defaultValue: categoryDropdownItems[0].text,
                                actualValue: categoryDropdownItems[parent.state.filterCategoryIndex].text
                            })
                        ),
                        enableOwnedDropdown && React.createElement('div', { className: 'dropdown-container inline' },
                            React.createElement(DropdownLinks, {
                                choices: ownedDropdownItems,
                                defaultValue: ownedDropdownItems[0].text,
                                actualValue: ownedDropdownItems[parent.state.filterOwnedIndex].text
                            })
                        ),
                        enableSortDropdown && React.createElement('div', { className: 'dropdown-container inline extra-wide' },
                            React.createElement(DropdownLinks, {
                                choices: sortDropdownItems,
                                defaultValue: sortDropdownItems[0].text,
                                actualValue: sortDropdownItems[parent.state.sortIndex].text
                            })
                        ),
                        enableSearch && React.createElement('input', {
                            ref: 'input',
                            className: 'store-search',
                            placeholder: loc('search', 'Search'),
                            onChange: this.handleSearchChange,
                            //onKeyDown: function (e) {
                            //    console.log('key down: ' + e.nativeEvent.keyCode + ', ctrl: ' + e.nativeEvent.ctrlKey)
                            //    // hmmmm ingame doesn't fire both events sadly.. that sucks.
                            //    if (e.nativeEvent.ctrlKey && e.nativeEvent.keyCode == 65) {
                            //        console.log('ctrlA pressed')
                            //        parent.refs.input.select()
                            //    }
                            //},
                            maxLength: "50",
                        }),
                        enableSearch && React.createElement('div', {
                            className: 'simple-tooltip',
                            style: {
                                color: 'white',
                                display: 'inline',
                                position: 'relative',
                                right: '20px',
                                color: 'rgba(255, 255, 255, 0.5)'
                            },
                            onMouseDown: function (e) {
                                parent.refs.input.value = ''
                                parent.setState({ filterSearch: parent.refs.input.value })
                            },
                        },
                            React.createElement('img', { src: 'hud/img/small-icons/input-x.png' }),
                            React.createElement('span', { className: 'tooltiptext auto tight' }, loc('clear', 'Clear'))
                        ),
                        enableCardWizardBuy && getCardWizardWindow(parent.state.mysteriousCardItem, parent.state.mysteriousCardStock, parent.state.mysteriousCardStockSecondsRemaining)
                    ),
                    !enableCardWizardBuy && React.createElement('div', { className: 'store-items' },
                        parent.state.shopCatalog.catalog.length == 0 && React.createElement('div', {
                            style: {
                                background: 'rgba(0, 0, 0, 0.5)',
                                padding: '3rem'
                            }
                        },
                            loc('store_no_items', "No items available")
                        ),
                        parent.state.showLoading && React.createElement('div', {
                            style: {
                                width: '100%',
                                textAlign: 'center',
                            }
                        },
                            React.createElement('img', {
                                src: 'hud/img/ui/loading-small.gif',
                            })
                        ),
                        !parent.state.showLoading && parent.state.shopCatalog.catalog.length > 0 && React.createElement('div', { className: 'items' },
                            parent.state.shopCatalog.catalog.map(function (item) {
                                // Special case: Don't include Mysterious Card Item in the shop catalog displays, since it
                                // uses a special UI window (Card Trader)
                                // ^ This might be deprecated since we now have a category "Consumable (Not in Store)"
                                if (item.itemId == "mysterious_card_item_id")
                                    return null

                                // Page filter
                                if (!_.includes(categories, item.itemClass))
                                    return null

                                // Category filter
                                if (parent.state.filterCategoryIndex >= 0 && item.itemClass != categoryDropdownItems[parent.state.filterCategoryIndex].key) {
                                    //console.log('hide ' + item.name + ' since it did not match class: ' + categoryDropdownItems[parent.state.filterCategoryIndex].key)
                                    return null
                                }

                                // Owned filters
                                // If we are looking for Owned stuff, hide it if you don't own it
                                if (enableOwnedDropdown) {
                                    if (parent.state.filterOwnedIndex != allIndex) {
                                        if (parent.state.filterOwnedIndex == ownedIndex && item.stacks == 0)
                                            return null
                                        // If we are looking for Available stuff, hide it if you own it
                                        //if (parent.state.filterOwnedIndex == 2 && item.stacks > 0)
                                        //    return null
                                        // If you don't own it and it is Unavailable, hide unless it we are looking for Non-Owned stuff
                                        if (parent.state.filterOwnedIndex != unvailableIndex && item.price.pe == 0 && item.price.ss == 0 && item.stacks == 0)
                                            return null
                                        // If we are looking for Non-Owned stuff, hide it if you own it
                                        if (parent.state.filterOwnedIndex == unlockableIndex && item.stacks > 0)
                                            return null
                                        // If we are looking for Unavailable stuff, hide it if it is buyable
                                        if (parent.state.filterOwnedIndex == unvailableIndex && (item.price.pe > 0 || item.price.ss > 0))
                                            return null
                                    }
                                }

                                // Search filter
                                if (parent.state.filterSearch.length > 0 && (item.name.toLowerCase().indexOf(parent.state.filterSearch.toLowerCase()) == -1)) return

                                var itemAvailableForPurchase = item.stacks == 0 && (item.price.pe > 0 || item.price.ss > 0)

                                var itemIsEquipped = false
                                itemIsEquipped |= item.itemId == globalState.equippedClientBackgroundItem
                                itemIsEquipped |= item.itemId == globalState.equippedGameCoachItem

                                var onSale = (item.price.sale != null && item.price.sale != '')

                                itemCount++

                                return React.createElement('div', {
                                    className: 'store-item'
                                },
                                    React.createElement('div', {
                                        //className: 'item-image' + ' ' + item.rarity,
                                        className: 'item-image',
                                        onMouseDown: function (e) {
                                            console.log('click ' + item.name)
                                            engine.call("OnShowItemPreview", item.itemId)

                                            if (!isUnityHost)
                                                engine.trigger('refreshSelectedSkin', testConsumableSkinEntry, testConsumableSelectedSkin)
                                        },
                                        onMouseEnter: function (e) {
                                            parent.setState({ hoveredItemId: item.itemId })
                                            engine.call('OnMouseOverMedium', item.itemId.length)
                                        },
                                        onMouseOut: function (e) {
                                            parent.setState({ hoveredItemId: '' })
                                        },
                                        style: {
                                            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.32) 75%, rgba(0,0,0,0.80) 100%),'
                                                + 'url(hud/img/splashes/' + item.image + '.png)',
                                            backgroundSize: 'contain',
                                            transform: globalState.isMac ? 'scale(-1)' : '',
                                            outline: itemIsEquipped ? '1px solid #ffcc00' : ''
                                        }
                                    }),
                                    React.createElement('div', { className: 'name' }, item.name),
                                    parent.state.hoveredItemId == item.itemId && item.stacks == 0 && itemAvailableForPurchase && React.createElement('img', {
                                        src: 'hud/img/shop/unlock.png',
                                        className: 'equipped-lock',
                                    }),
                                    item.stacks == 0 && itemAvailableForPurchase && React.createElement('div', { className: 'price' },
                                        item.price.pe > 0 && React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/PremiumEssence_32.png' }),
                                        item.price.pe > 0 && React.createElement('span', {
                                            style: {
                                                color: onSale ? '#8ff110': ''
                                            }
                                        }, item.price.pe),
                                        (item.price.pe > 0 && item.price.ss > 0) && React.createElement('span', { style: { display: 'inline-block', width: '6px' }}), // Spacer
                                        item.price.ss > 0 && React.createElement('img', { className: 'currency-icon', src: 'hud/img/shop/currency/Essence_32.png' }),
                                        item.price.ss > 0 && item.price.ss
                                        //(item.price.sale != null && item.price.sale != '') ? React.createElement('div', { className: 'sale' }, loc('sale_off', item.price.sale + ' OFF', [item.price.sale])) : ''
                                    ),
                                    item.stacks == 0 && !itemAvailableForPurchase && React.createElement('div', { className: 'price disabled' },
                                        loc('not_available', 'Not Available')
                                    ),
                                    item.stacks > 0 && React.createElement('div', { className: 'price disabled' + (itemIsEquipped ? ' owned-and-equipped' : '') },
                                        itemIsEquipped ? loc('skin_equipped', 'Equipped') : loc('owned', 'Owned')
                                    ),
                                    React.createElement('img', { src: 'hud/img/shop/rarity/' + item.rarity + '.png', className: 'rarity' }),
                                    item.stacks == 0 && itemAvailableForPurchase && onSale ? React.createElement('div', { className: 'sale' },
                                        //item.price.sale
                                        loc('sale_off', item.price.sale + ' OFF!', [item.price.sale])
                                    ) : ''
                                    //React.createElement('div', { className: 'button em' },
                                    //    React.createElement('img', { src: 'hud/img/shop/currency/Essence_20.png', style: { width: '16px' } }),
                                    //    item.price.ss + ' / ' + item.price.pe
                                    //)
                                )
                            }),
                            // v10.00: special "Random" background
                            parent.props.categories == 'clientBackgroundCategories' && React.createElement('div', {
                                className: 'store-item',
                                onMouseDown: function (e) {
                                    engine.trigger('refreshRandomizeBackground', !globalState.randomizeBackground)
                                    parent.forceUpdate()

                                    console.log('OnEnableRandomizeBackground')
                                    engine.call('OnEnableRandomizeBackground', globalState.randomizeBackground)
                                }
                            },
                                React.createElement('div', {
                                    className: 'item-image',
                                    style: {
                                        backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.32) 75%, rgba(0,0,0,0.80) 100%),'
                                            + 'url(hud/img/splashes/RandomEquip.png)',
                                        backgroundSize: 'contain',
                                        transform: globalState.isMac ? 'scale(-1)' : '',
                                    }
                                }),
                                React.createElement('div', { className: 'name' },
                                    loc('randomize_on_startup', 'Randomize on Startup')),
                                React.createElement('div', { className: 'price disabled' + (globalState.randomizeBackground ? ' owned-and-equipped' : '') },
                                    globalState.randomizeBackground ? loc('on', 'On') : loc('off', 'Off')
                                )
                            ),
                            // v10.05: special "Random" game coach
                            parent.props.categories == 'gameCoachCategories' && React.createElement('div', {
                                className: 'store-item',
                                onMouseDown: function (e) {
                                    engine.trigger('refreshRandomizeGameCoach', !globalState.randomizeGameCoach)
                                    parent.forceUpdate()

                                    console.log('OnEnableRandomizeGameCoach')
                                    engine.call('OnEnableRandomizeGameCoach', globalState.randomizeGameCoach)
                                }
                            },
                                React.createElement('div', {
                                    className: 'item-image',
                                    style: {
                                        backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.32) 75%, rgba(0,0,0,0.80) 100%),'
                                            + 'url(hud/img/splashes/RandomEquip.png)',
                                        backgroundSize: 'contain',
                                        transform: globalState.isMac ? 'scale(-1)' : '',
                                    }
                                }),
                                React.createElement('div', { className: 'name' },
                                    loc('randomize_every_game', 'Randomize Every Game')),
                                React.createElement('div', { className: 'price disabled' + (globalState.randomizeGameCoach ? ' owned-and-equipped' : '') },
                                    globalState.randomizeGameCoach ? loc('on', 'On') : loc('off', 'Off')
                                )
                            ),
                            itemCount == 0 && React.createElement('div', {
                                style: {
                                    paddingBottom: '24px'
                                }
                            },
                                loc('store_no_items', 'No items available')
                            )
                        )
                    )
                )
            )
        )
    }
})


var Previewer = React.createClass({
    getInitialState: function () {
        return {
            selectedSkinKey: ''
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshSelectedSkin = function (skinEntry, skin) {
            var skinKey = skinEntry.key
            if (skinKey === undefined) {
                console.log('refreshSelectedSkin clear')
                parent.setState({
                    selectedSkinKey: '',
                })
                return
            }

            // Tell the client to update the 3D model, including customizations
            if (skinEntry.itemClass == "fightercosmetic" || skinEntry.itemClass == "lanecosmetic") {
                var isDefaultSkin = isSkinADefaultSkin(skin)
                if (isDefaultSkin) {
                    console.log('call OnPreviewDefaultSkin()')
                    engine.call("OnPreviewDefaultSkin", skinKey)
                }
                else {
                    console.log('call OnApplyPreviewUnitCustomizations() ' + skin.key)
                    engine.call("OnApplyPreviewUnitCustomizations", skin.key)
                }
            } else {
                console.log('was not a skin, so skip calling OnApplyPreviewUnitCustomizations')
            }

            // Update selected skin
            parent.setState({
                selectedSkinKey: skinKey
            })

            // Finally, show the previewer with the selected skin
            showFullScreenPopup(getEquipWindow(skinEntry, skin), false, function () {
                engine.trigger('refreshSelectedSkin', {}, {})
                engine.call('OnExitEquipWindow')
            })
        }
    },
    componentWillUnmount: function () {
        // Edge case if we get Match Found or otherwise load a view while previewing something
        // Although this should probably be already handled when the full screen popup is hidden...
        // Doesn't hurt to be extra safe, I guess!
        console.log('Previewer view unmounting --> clear out selectedSkin')
        engine.trigger('refreshSelectedSkin', {}, {})
    },
    render: function () {
        var parent = this
        return null
    }
})