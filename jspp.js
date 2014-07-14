var copy = function(obj){
    if(obj == null || typeof obj != 'object')
        return obj;   
    if(obj instanceof Date){
    	var date = new Date();
    	date.setTime(obj.getTime());
    	return date;
    } 
    var temp = new obj.constructor(); 
    for(var key in obj)
        temp[key] = copy(obj[key]);    
    return temp;
};

var Class = function(params){
	if(params.public){
		var p = params;
		var def = "function(){";
		var end = "}";
		if(p.init){
			if(typeof p.init == "function"){
				def = "function" + p.init.toString().split("){")[0].substr(9) + "){";
				end = p.init.toString().substr(def.length + 2);
			}else{
				console.log(new Error("'init' must be a function."));
			}
		}
		if(p.inherit){
			if(typeof p.inherit != 'function'){
				for(var i = 0; i < p.inherit.length; i++){
                    var s = p.inherit[i].toString();
					if(s.split("\n//init//\n").length > 1){
						def += s.slice(s.indexOf("){") + 2).split("\n//init//\n")[0];
					}else{
						console.log(new Error("Inheritance of non-jpp style class is forbidden."));
						return null;
					}
				}
			}else{
                var s = p.inherit.toString();
				if(s.split("\n//init//\n").length > 1){
					def += s.slice(s.indexOf("){") + 2).split("\n//init//\n")[0];
				}else{
					console.log(new Error("Inheritance of non-jpp style class is forbidden."));
					return null;
				}
			}
		}
		for(var prop in p.private){
			if(p.private.hasOwnProperty(prop)){
				def += "var " + prop + " = ";
				if(typeof p.private[prop] == "function"){
					def += p.private[prop].toString();
				}else{
					def += JSON.stringify(p.private[prop]); 
				}
				def += ";";
			}
		}
		for(var prop in p.public){
			if(p.public.hasOwnProperty(prop)){
				def += "this." + prop + " = ";
				if(typeof p.public[prop] == "function"){
					def += p.public[prop].toString();
				}else{
					def += JSON.stringify(p.public[prop]); 
				}
				def += ";";
			}
		}
		eval("var cls = " + def + "\n//init//\n" + end);
		return cls;
	}else{
		console.log(new SyntaxError("No public access defined."));
		return null;
	}
};

var jspp = new function(){
    var self = this;
	var scripts = {
		main: function(){
			return null;
		}
	};
    var events = {
        click: [],
        mousedown: [],
        mouseup: [],
        mouseenter: [],
        mouseleave: [],
        mousemove: [],
        change: [],
        contextmenu: [],
        dblclick: [],
        focus: [],
        input: [],
        keydown: [],
        keypress: [],
        keyup: [],
        mousewheel: [],
        scroll: [],
        select: [],
        inUse: []
    };
    var styles = {};
    var elements = {};
	self.define = function(){
		var name = arguments;
		if(name.length > 1){
			var temp = [];
			for(var i = 0; i < name.length; i++){
				temp.push(scripts[name[i]]());
			}
			return temp;
		}
		return scripts[name[0]]();
	};
	self.include = function(){
		var name = arguments;
		if(name.length > 1){
			var temp = [];
			for(var i = 0; i < name.length; i++){
				temp.push(scripts[name[i]]);
			}
			return temp;
		}
		return scripts[name[0]];
	};
    self.stylize = function(){
        var name = arguments;
        for(var i = 0; i < name.length; i++){
            self.Style(styles[name[i]].selector, styles[name[i]].rules);
        }
    };
    self.main = scripts.main;
    self.Get = function(Url, success, failure){
        var request = new XMLHttpRequest();
        request.onreadystatechange = function(){
            if(request.readyState == 4 && request.status == 200)
                success(request.responseText);
            else if(failure)
                failure(request);
        };
        request.open('GET',Url);
        request.send(null);
        return self;
    };
	self.Script = function(name, data){
        if(typeof data == "string"){
            self.Get(data, function(response){
                scripts[name] = eval("new function(){" + response + "}()");
            });
        }
		scripts[name] = data;
        self.main = scripts.main;
	    return self;
    };
    self.Event = function(type, target, response){
        if(events[type] && type != 'inUse'){
            if(events.inUse.indexOf(type) == -1){
                events.inUse.push(type);
                document.body.addEventListener(type, function(e){
                    var success = function(i){
                        events[type][i].response(e);
                    };
                    for(var i = 0; i < events[type].length; i++){
                        if(events[type][i].element instanceof Array || events[type][i].element instanceof NodeList){
                            for(var j = 0; j < events[type][i].element.length; j++){
                                if(e.target == events[type][i].element[j]){
                                    success(i);
                                    break;
                                }
                            }
                        }else{
                            if(e.target == events[type][i].element || events[type][i].element == any){
                                success(i);
                            }
                        }
                    }
                });
            }
            if(typeof target == 'string'){
                target = document.querySelectorAll(target);
            }
            events[type].push({
                element: target,
                response: response
            });
        }
        return self;
    };
    self.Style = function(name, selector, rules){
        var style = document.getElementById('js-style');
        if(!style){
            style = document.createElement('style');
            style.setAttribute('id','js-style');
            document.head.appendChild(style);
        }
        if(rules == undefined || rules.apply){
            if(rules != undefined){
                styles[name] = {
                    selector: selector,
                    rules: rules
                };
            }else{
                rules = selector;
                selector = name;
            }
            var exists = false;
            if(typeof rules == 'function'){
                rules = rules();
            }
            var content = "";
            for(var i = 0; i < style.sheet.rules.length; i++){
                if(style.sheet.rules[i].selectorText == selector){
                    exists = true;
                    for(var prop in rules){
                        if(rules.hasOwnProperty(prop) && style.sheet.rules[i].style.hasOwnProperty(prop)){
                            style.sheet.rules[i].style[prop] = rules[prop];
                        }
                    }
                }
                content += style.sheet.rules[i].cssText + " ";
            }
            style.innerHTML = content;
            if(!exists){
                var length = style.sheet.rules.length;
                if(typeof selector == 'string'){
                    style.innerHTML += " " + selector + "{}";
                    for(var prop in rules){
                        if(rules.hasOwnProperty(prop) && style.sheet.rules[length].style.hasOwnProperty(prop)){
                            style.sheet.rules[length].style[prop] = rules[prop];
                        }
                    }
                    content += style.sheet.rules[length].cssText + " ";
                    style.innerHTML = content;
                }else{
                    var toCSS = function(str){
                        var result = "";
                        for(var i = 0; i < str.length; i++){
                            if(str.charAt(i) == str.charAt(i).toUpperCase()){
                                result += "-" + str.charAt(i).toLowerCase();
                            }else{
                                result += str.charAt(i);
                            }
                        }
                        return result;
                    };
                    var style = "";
                    for(var prop in rules){
                        if(rules.hasOwnProperty(prop)){
                            style += toCSS(prop) + ":" + rules[prop] + ";";
                        }
                    }
                    if(selector instanceof NodeList || selector instanceof Array){
                        for(var i = 0; i < selector.length; i++){
                            selector[i].style = style;
                        }
                    }else{
                        selector.style = style;
                    }
                }
            }

        }else{
            styles[name] = {
                selector: selector,
                rules: rules
            };
        }
        return self;
    };
    self.Element = function(tag, def, template){
        if(def.substr(0,5) == 'HTML:'){
            self.Get(def.substr(5), function(response){
                elements[tag] = {
                    def: response,
                    template: template,
                    count: 0
                };
                update(tag);
            });
        }else{
            elements[tag] = {
                def: def,
                template: template,
                count: 0
            };
            update(tag);
        }
        var update = function(tag){
            var replace = document.getElementsByTagName(tag);
            if(replace.length > 0){
                for(var i = 0; i < replace.length; i++){
                    var e = document.createElement('div');
                    if(elements[tag].template){
                        var temp = elements[tag].def.split("||");
                        var data = elements[tag].template(replace[i].innerHTML);
                        var content = "";
                        for(var j = 0; j < temp.length; j++){
                            if(j % 2 == 0){
                                content += temp[j];
                            }else{
                                content += eval(temp[j]);
                            }
                        }
                        e.innerHTML = content;
                    }else{
                        e.innerHTML = elements[tag].def;
                    }
                    e.id = tag + elements[tag].count++;
                    e.className += " " + tag;
                    replace[i].parentNode.replaceChild(e, replace[i]);
                    for(var prop in elements){
                        if(document.getElementsByTagName(prop).length > 0){
                            update(prop);
                        }
                    }
                }
            }
        }
        return self;
    };
}();

var define = jspp.define;
var include = jspp.include;
var stylize = jspp.stylize;
var any = document.body;