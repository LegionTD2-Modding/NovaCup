// In-game icons on the left of the screen (muted warning, found card icon, boost enabled, etc)
// ===============================================================================

var MatchModifiers = React.createClass({
    getInitialState: function () {
        return {
            modifiers: [],
        }
    },
    componentWillMount: function () {
        var parent = this
        bindings.refreshMatchModifiers = function (modifiers) {
            parent.setState({ modifiers: modifiers })
        }
    },
    render: function () {
        var parent = this
        if (this.state.modifiers.length == 0) {
            return null
        }
        return (
            React.createElement('div', { id: 'MatchModifiers' },
                React.createElement('ul', { className: 'items icons' },
                    this.state.modifiers.map(function (modifier) {

                        // If it isn't a card, let's not show rarity, so cards pop more and it is 
                        // obvious that cards are clickable
                        //if (modifier.itemclass != 'card')
                        //    modifier.rarity = ""

                        return React.createElement('li', {
                            key: modifier.key,
                            className: 'modifier simple-tooltip flipped',
                            onMouseDown: function (e) {
                                if (modifier.itemclass == 'card')
                                    engine.trigger('showCardArtFromMatchModifier', modifier)
                                if (modifier.itemclass == 'trophy')
                                    engine.trigger('showTrophyFromMatchModifier', modifier)
                            }
                        },
                            React.createElement('img', { className: 'icon ' + modifier.rarity, src: 'hud/img/' + modifier.image }),
                            modifier.stacks != null && modifier.stacks > 0 && React.createElement('div', { className: 'icon-stacks' },
                                modifier.stacks
                            ),
                            React.createElement('span', { className: 'tooltiptext' },
                                React.createElement('div', {
                                    className: modifier.rarity,
                                    dangerouslySetInnerHTML: {
                                        __html: modifier.header
                                    }
                                }),
                                React.createElement('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: modifier.subheader
                                    }
                                })
                            )
                        )
                    })
                )
            )
        )
    }
})