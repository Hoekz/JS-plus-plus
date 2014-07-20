JS-plus-plus
============

My first real attempt at a Javascript Library.  Inspired by AngularJS, provides an easy way to make a more dynamic web page.  Also provides an easy way to create classes with a similar syntax to that of C++.  It does use the eval statement which I know to be rather taboo among developers, but feel it's used in a secure and helpful way.  Always want feedback and always want to improve.

Copy
============
In this library, a copy function is included for easy complete copying.

Class Definitions
============
To write a class definition, use the function Class:

`var Class = function(params){...};`

The params variable is an object with up to 4 properties:

```
public (required)
private
init
inherit
```

The suggested syntax is as follows:

```javascript
var myClass = Class({
  //inherit: someClass,
  init: function(arg1, arg2, arg3){
    privateVar = arg1;
    this.publicVar = arg2;
    var newPrivateVar = arg3;
  },
  private:{
    privateVar: "some value"
  },
  public:{
    publicVar: "public value"
  }
});
```

The Class function then quite literally writes a javascript-style class where variables (var) are private and variables bound to the function (this.varName) are public.  This means that when referencing a private variable in a function, simply use its name.  If referencing a public variable, you must access it with "this.name".  Inheritance works by taking a class written by the Class function and appending its definition minus its initiator to the new definition.

The JSPP Interface
===========
The jspp object is inspired by AngularJS, but has it's own features.  In jspp, there are two groups of functions: Getters and Setters.  All Setter functions return the jspp object, allowing for chained definitions.  The Setters include:

```
Script: defines a new script (module) of code
Event: defines a new response for an event on a given target or targets
Style: defines a new style for a given element or Selector text
Element: defines a new HTML element with a given tag name, text template, and an optional templating function
```

When writing a new Setter definition, be sure to use clear names and remember to use the proper syntax.  Getter functions return various values and therefore cannot be used in chains.  The Getters include:

```
include: returns (a) script(s) as is
define: returns (a) script(s) definition (i.e. executes a script as a function)
stylize: no return, applies the named styles to the jspp stylesheet
Get: returns HTTP Request of URL
```

Getters should be used inside of Scripts and Events, but can also be used in template definitions, style definitions, and other locations.


For more information on these functions, see Setters.md and Getters.md
