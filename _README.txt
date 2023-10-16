HUD Overview
==============================================

.html			basically like a main method that imports all libraries and loads all scripts

layout.js		defines the overall view (markup) of the page
				elements created here should be styled in css

*-data.js		defines the content contained in layout.js
				classes defined here should *not* typically be styled, except for generic classes like 'content' etc.

bindings.js
				the glue that binds the game client to the view

How can I extend the HUD?
==============================================

1) (Optional) Add a class in layout.js if it's going to be a new layout element

2) Add a class in an existing *-data.js or make a new *-data.js file if needed. Create a new ReactClass and create an instance of it in the layout.

3) Look at other classes to see what you need to do... this typically involves defining a new binding in bindings.js and updating the
callback function defined in the dictionary in bindings.js