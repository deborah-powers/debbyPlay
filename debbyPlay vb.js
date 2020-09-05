/* framework pour utiliser des templates html.
je me suis inspirée de la foncionnalité de base d'angularjs.
display-test démontre son utilisation.

dépendence:
	display.css
	text.js

________________________ fonctions utilisable par vous ________________________ */

// affichage de base
var debbyPlay ={
	// constantes pour afficher un popup de calendrier
	yearList: [ '2018', '2019', '2020' ],
	monthList: [ 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre' ],
	dayList: [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31' ]
};
HTMLElement.prototype.init = function(){
	this.useTemplates();
	this.clean();
	this.setModel();
}
HTMLElement.prototype.load = function(){
	this.getModel();
	for (var v in debbyPlay) this.printVar (v, debbyPlay[v]);
	this.setInput();
	printLink();
	this.createCalendar();
	this.createSelection();
	this.createCarousel();
	conditionnal();
}
HTMLElement.prototype.finish = function (fieldList){
	// fieldList =[ '((a))', '((b))' ]
	if (this.tagName == 'SCRIPT') return;
	if (fieldList && this.innerHTML.contain ('((')) for (var f=0; f< fieldList.length; f++)
		this.innerHTML = this.innerHTML.replace (fieldList[f]);
	else if (this.outerHTML.contain ('((')){
		for (var c=0; c< this.children.length; c++) this.children[c].finish();
		if (this.innerHTML.contain ('((')) this.innerHTML ="";
	}
}
// affichage conditionnel de certaines balises
function conditionnal(){
	var tagList = document.getElementsByTagName ('*');
	for (var t=0; t< tagList.length; t++) if (tagList[t].getAttribute ('if') &&! eval (tagList[t].getAttribute ('if')))
		tagList[t].className = 'hidden';
}
// afficher des sélecteurs. la target de funcRes est une string
HTMLElement.prototype.createSelection = function(){
	var selectList = this.getElementsByTagName ('selection');
	var title, option, varName, callback;
	for (var s=0; s< selectList.length; s++){
		varName = selectList[s].innerText[0].toLowerCase() + selectList[s].innerText.slice (1);
		selectList[s].innerHTML ="";
	//	varName = selectList[s].getAttribute ('for');
		title = createNode ('p', "", selectList[s]);
		for (var v in debbyPlay[varName]){
			option = createNode ('option', debbyPlay[varName][v], selectList[s], null, null, v);
			option.addEventListener ('click', updateSelection);
			if (window [selectList[s].getAttribute ('callback')]) option.addEventListener ('click', function (event){
				var callback = event.target.parentElement.getAttribute ('callback');
				window[callback] (event.target.innerText.toLowerCase());
		});}
		title.innerHTML = debbyPlay[varName][0];
		title.id =0;
}}
HTMLElement.prototype.createCarousel = function(){
	var selectList = this.getElementsByTagName ('carousel');
	var title, varName, callback, before, after, option;
	for (var s=0; s< selectList.length; s++){
		varName = selectList[s].innerText[0].toLowerCase() + selectList[s].innerText.slice (1);
		selectList[s].innerHTML ="";
		selectList[s].setAttribute ('for', varName);
	//	varName = selectList[s].getAttribute ('for');
		before = createNode ('p', '<', selectList[s]);
		title = createInput ('text', debbyPlay[varName][0], selectList[s]);
		after = createNode ('p', '>', selectList[s]);
		callback = null;
		title.addEventListener ('click', function (event){
			if (event.target.parentElement.getAttribute ('callback')) callback = window [event.target.parentElement.getAttribute ('callback')];
			setCurrent (event, callback);
		});
		before.addEventListener ('click', function (event){
			if (event.target.parentElement.getAttribute ('callback')) callback = window [event.target.parentElement.getAttribute ('callback')];
			setBefore (event, callback);
		});
		after.addEventListener ('click', function (event){
			if (event.target.parentElement.getAttribute ('callback')) callback = window [event.target.parentElement.getAttribute ('callback')];
			setAfter (event, callback);
		});
}}
showSelectionTitle = function (selection, option){
	/* lorsque le changement d'option necéssite de recharger le conteneur de la sélection,
	le titre affiché reprend la valeur par défaut, et non celle de l'option sélectionnée.
	showTitle est appelée après le rechargement (load) et permet d'afficher la bonne option.
	*/
	selection.children[0].innerHTML = option;
}
// fonction pour afficher un calendrier
HTMLElement.prototype.createCalendar = function(){
	// le callback a pour arguments: int year, string month, int monthId, int day
	const month31 = 'janvier mars mai juillet aout octobre decembre';
	const month30 = 'avril juin septembre novembre';
	var calList = this.getElementsByTagName ('calendar');
	for (var s=0; s< calList.length; s++){
		var years = createNode ('carousel', "", calList[s]);
		years.innerHTML = 'yearList';
	//	years.setAttribute ('for', 'yearList');
		var months = createNode ('selection', "", calList[s]);
		months.innerHTML = 'monthList';
	//	months.setAttribute ('for', 'monthList');
		var days = createNode ('selection', "", calList[s]);
		days.innerHTML = 'dayList';
	//	days.setAttribute ('for', 'dayList');
		calList[s].addEventListener ('click', function (event){
			var month = event.target.parentElement.parentElement.getElementsByTagName ('p')[2].innerText.toLowerCase();
			var monthNb =28;
			debbyPlay.dayList =[];
			if (month31.indexOf (month) >=0) monthNb =31;
			else if (month30.indexOf (month) >=0) monthNb =30;
			else{
				var year = parseInt (event.target.parentElement.parentElement.getElementsByTagName ('input')[0].value);
				if (year %400 ==0 || (year %100 >0 && year %4==0)) monthNb =29;
			}
			var dayList = event.target.parentElement.parentElement.lastChild;
			var currentNb = parseInt (dayList.lastChild.innerText);
			if (currentNb < monthNb){
				currentNb = currentNb +1;
				for (var currentNb; currentNb <= monthNb; currentNb ++)
					var option = createNode ('option', currentNb, dayList, null, null, currentNb);
			}
			else if (currentNb > monthNb){
				var strNb = monthNb.toString();
				while (dayList.lastChild.innerText > strNb) dayList.removeChild (dayList.lastChild);
		}});
		if (calList[s].getAttribute ('callback')) calList[s].addEventListener ('click', function (event){
			var year = parseInt (event.target.parentElement.parentElement.getElementsByTagName ('input')[0].value);
			var month = event.target.parentElement.parentElement.getElementsByTagName ('p')[2].innerText.toLowerCase();
			var monthId =1+ parseInt (event.target.parentElement.parentElement.getElementsByTagName ('p')[2].id);
			var day = parseInt (event.target.parentElement.parentElement.getElementsByTagName ('p')[3].innerText);
			var callback = event.target.parentElement.parentElement.getAttribute ('callback');
			window[callback] (year, month, monthId, day);
});}}
// utiliser un template
HTMLElement.prototype.useTemplate = function (idInsert, idTemplate){
	// utiliser un template html
	var insertList = this.getElementsByTagName ('insert');
	var insert;
	for (i in insertList) if (insertList[i].id == idInsert) insert = insertList[i];
	if (idTemplate.contain ('.html')){
		var xhttp = new XMLHttpRequest();
		xhttp.open ('GET', idTemplate, false);
		xhttp.send();
		if (xhttp.status ==200){
			insert.innerHTML = xhttp.responseText;
			insert = insert.children[0];
	}}
	else{
		var templateList = this.getElementsByTagName ('template');
		var template;
		for (var t in templateList) if (templateList[t].id == idTemplate) template = templateList[t];
		insert.innerHTML = template.innerHTML;
	}
	insert.load();
}
// utiliser un fichier json
useJson = function (jsonFile, varName){
	var xhttp = new XMLHttpRequest();
	xhttp.open ('GET', jsonFile, false);
	xhttp.send();
	if (xhttp.status ==200){
		var res = JSON.parse (xhttp.responseText);
		debbyPlay[varName] = res;
}}
useJsonAssync = function (jsonFile, varName, callback){
	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'text/json';
	var dispObj = this;
	xhttp.onreadystatechange = function(){
		if (this.readyState == 4){
			var res = JSON.parse (this.responseText);
			debbyPlay[varName] = res;
			if (callback) callback();
	}};
	xhttp.open ('GET', jsonFile, true);
	xhttp.send();
}
paramToUrl = function (url, params){
	if (params){
		url = url +'?';
		for (p in params) url = url +p+'='+ params[p] +'&';
		url = url.slice (0,-1);
	}
	url = encodeURI (url);
	return url;
}
paramFromUrl = function (url){
	url = decodeURI (url);
	var d= url.indexOf ('?') +1;
	var paramText = url.slice (d);
	var paramList = paramText.split ('&');
	var params ={};
	for (var p=0; p< paramList.length; p++){
		paramList[p] = paramList[p].split ('=');
		params [paramList[p][0]] = paramList[p][1];
	}
	return params;
}
useBackend = function (url, varName, params){
	url = paramToUrl (url, params);
	var xhttp = new XMLHttpRequest();
	xhttp.open ('GET', url, false);
	xhttp.send();
	if (xhttp.status ==200){
		var res = JSON.parse (xhttp.responseText);
		debbyPlay[varName] = res;
}}
// ________________________ fonctions appelées dans les précédentes ________________________

// conserver le template de la page afin de la recharger
HTMLElement.prototype.setModel = function(){
	if (this.tagName == 'SCRIPT') return;
	else if (this.outerHTML.contain ('))')){
		var attributeList ="";
		var modelTmp;
		if (this.innerHTML.contain ('))')){
			modelTmp = this.innerHTML.copy();
			modelTmp = modelTmp.replace ('((', '{{');
			modelTmp = modelTmp.replace ('))', '}}');
			attributeList = attributeList +'$body:'+ modelTmp;
		}
		for (var a in this.attributes) if (typeof (this.attributes[a].value) == 'string' && this.attributes[a].name != 'model'
				&& this.attributes[a].value.contain ('))')){
			modelTmp = this.attributes[a].value.copy();
			modelTmp = modelTmp.replace ('((', '{{');
			modelTmp = modelTmp.replace ('))', '}}');
			attributeList = attributeList +'$'+ this.attributes[a].name +':'+ modelTmp;
		}
		this.setAttribute ('model', attributeList);
		for (var c=0; c< this.children.length; c++) if (this.tagName != 'SCRIPT') this.children[c].setModel();
}}
HTMLElement.prototype.getModel = function(){
	if (this.getAttribute ('model')){
		var modelTmp ="";
		var d=0;
		var attributeList = this.getAttribute ('model').split ('$');
		var trash = attributeList.shift();
		if (attributeList[0].slice (0,5) == 'body:'){
			modelTmp = attributeList[0].slice (5);
			modelTmp = modelTmp.replace ('{{', '((');
			modelTmp = modelTmp.replace ('}}', '))');
			this.innerHTML = modelTmp;
			trash = attributeList.shift();
		}
		for (var a=0; a< attributeList.length; a++){
			d= attributeList[a].index (':');
			modelTmp = attributeList[a].slice (d+1);
			modelTmp = modelTmp.replace ('{{', '((');
			modelTmp = modelTmp.replace ('}}', '))');
			this.setAttribute (attributeList[a].slice (0,d), modelTmp);
		}
		this.setModel();
}}
// fonctions gérant mes sélecteurs
updateSelection = function (event){
	var title = event.target.parentElement.getElementsByTagName ('p')[0];
	title.innerText = event.target.innerText;
	title.id = event.target.value;
}
setCurrent = function (event, funcRes){
	var title = event.target.parentElement.getElementsByTagName ('input')[0];
	var list = debbyPlay [title.value, event.target.parentElement.getAttribute ('for')];
	var currentPos = list.indexOf (title.value);
	if (currentPos <0){
		currentPos = list.length -1;
		title.value = list[currentPos];
	}
	if (funcRes) funcRes (title.value);
}
setBefore = function (event, funcRes){
	var title = event.target.parentElement.getElementsByTagName ('input')[0];
	var list = debbyPlay [title.value, event.target.parentElement.getAttribute ('for')];
	var currentPos = list.indexOf (title.value);
	currentPos -=1;
	if (currentPos <0) currentPos = list.length -1;
	else if (currentPos >= list.length) currentPos =0;
	title.value = list[currentPos];
	if (funcRes) funcRes (title.value);
}
setAfter = function (event, funcRes){
	var title = event.target.parentElement.getElementsByTagName ('input')[0];
	var list = debbyPlay [title.value, event.target.parentElement.getAttribute ('for')];
	var currentPos = list.indexOf (title.value);
	currentPos +=1;
	if (currentPos <0) currentPos = list.length -1;
	else if (currentPos >= list.length) currentPos =0;
	title.value = list[currentPos];
	if (funcRes) funcRes (title.value);
}
// rendre les inputs interractifs
HTMLElement.prototype.setInput = function(){
	var inputList = this.getElementsByTagName ('input');
	for (var i=0; i< inputList.length; i++){
		if (inputList[i].getAttribute ('model') && inputList[i].getAttribute ('model').contain ('$value:'))
			inputList[i].addEventListener ('mouseleave', loadInput);
	}
	inputList = this.getElementsByTagName ('textarea');
	for (var i=0; i< inputList.length; i++){
		if (inputList[i].getAttribute ('model') && inputList[i].getAttribute ('model').contain ('$value:'))
			inputList[i].addEventListener ('mouseleave', loadInput);
}}
function loadInput (event){
	var varName = event.target.getAttribute ('model').slice (9,-2);
	debbyPlay [varName] = event.target.value;
	var nodeList = document.body.findContainerModel (varName);
	for (var n=0; n< nodeList.length; n++) nodeList[n].load();
	event.target.addEventListener ('mouseleave', loadInput);
}
// affichage de base
HTMLElement.prototype.clean = function(){
	this.innerHTML = this.innerHTML.clean();
	this.innerHTML = this.innerHTML.replace ('(( ', '((');
	this.innerHTML = this.innerHTML.replace (' ))', '))');
}
HTMLElement.prototype.printVar = function (varName, value){
	var varType = value.constructor.name;
	// les variables simple
	if (varType == 'String' || varType == 'Number'){
		this.innerHTML = this.innerHTML.replace ('(('+ varName +'))', value);
		for (var a in this.attributes){
			if (typeof (this.attributes[a].value) == 'string' && this.attributes[a].value.contain ('(('+ varName +'))'))
				this.setAttribute (this.attributes[a].name, this.attributes[a].value.replace ('(('+ varName +'))', value));
	}}
	else if (varType == 'Array') this.printList (varName, value);
	else if (varType == 'Object') for (var v in value) this.printVar (varName +'.'+v, value[v]);
}
printLink = function(){
	var linkList = document.getElementsByTagName ('a');
	var link = null, d;
	for (var l=0; l< linkList.length; l++){
		link = linkList[l].getAttribute ('href');
		d= link.rindex ('/');
		if (d == link.length -1){
			link = link.slice (0,d);
			d= link.rindex ('/');
		}
		link = link.slice (d+1);
		if (link.contain ('.')){
			d= link.rindex ('.');
			link = link.slice (0,d);
		}
		if (link.contain ('.')){
			d= link.rindex ('.');
			if (d == link.length -1){
				link = link.slice (0,d);
				d= link.rindex ('.');
			}
			d=d+1;
			link = link.slice (d);
		}
		if (link[0] =='#') link = link.slice (1);
		link = link.replace ('-', " ");
		link = link.replace ('_', " ");
		linkList[l].innerHTML = linkList[l].innerHTML.replace ('(())', link);
}}
HTMLElement.prototype.useTemplates = function(){
	// utiliser un template html
	var templateList = this.getElementsByTagName ('template');
	var insertList = this.getElementsByTagName ('insert');
	for (var f=0; f< insertList.length; f++){
		if (insertList[f].id.contain ('.html')){
			var xhttp = new XMLHttpRequest();
			xhttp.open ('GET', insertList[f].id, false);
			xhttp.send();
			if (xhttp.status ==200){
				insertList[f].innerHTML = xhttp.responseText;
				insertList[f] = insertList[f].children[0];
		}}
		else for (var t in templateList) if (templateList[t].id == insertList[f].id) insertList[f].innerHTML = templateList[t].innerHTML;
}}
useTemplateAssync = function (tagName, id){
	var tagDst = document.getElementsByTagName (tagName)[0];
	tagDst.style.display = 'block';
	var templateSrc =null;
	if (id.indexOf ('.html') >1){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function(){
			if (this.readyState == 4){
				tagDst.innerHTML = this.responseText;
				tagDst = tagDst.children[0];
				tagDst.init();
				tagDst.load();
		}};
		xhttp.open ('GET', id, true);
		xhttp.send();
	}
	else{
		templateSrc = document.getElementById (id);
		tagDst.innerHTML = templateSrc.innerHTML;
}}
HTMLElement.prototype.printList = function (varName, value){
	// afficher une liste imbriquée
	if (value.constructor.name != 'Array' || value.length ==0) return;
	var nodeList = this.findContainerParenthesis (varName);
	if (! nodeList) nodeList =[];
	var nodeListTmp = this.findContainerFor (varName);
	if (nodeListTmp) for (var c in nodeListTmp) nodeList.push (nodeListTmp[c]);
	if (! nodeList) return;
	// récupérer les conteneurs parents, pour les listes imbriquées
	var container;
	if (value[0].constructor.name == 'Object') for (var n=0; n< nodeList.length; n++){
		for (var v=0; v< value.length -1; v++){
			container = nodeList[n].copy (true);
			for (var w in value[v]){
				container.printVar (w, value[v][w]);
				container.printVar (varName +'.'+w, value[v][w]);
		}}
		for (var w in value[v]){
			nodeList[n].printVar (w, value[v][w]);
			nodeList[n].printVar (varName +'.'+w, value[v][w]);
	}}else{
		if (value[0].constructor.name == 'Array') for (var n=0; n< nodeList.length; n++) nodeList[n] = nodeList[n].findContainerList (value);
		for (var n=0; n< nodeList.length; n++){
			for (var v=0; v< value.length -1; v++){
				container = nodeList[n].copy (true);
				container.printVar (varName, value[v]);
			}
			nodeList[n].printVar (varName, value[v]);
}}}
HTMLElement.prototype.findContainerFor = function (varName){
	// retrouver le noeud contenant une liste d'objet, contenant un attribut for
//	if (this.tagName == 'selection' || this.tagName == 'carousel') return null;
	if (this.getAttribute ('for') && this.getAttribute ('for') == varName) return [ this ,];
	else if (
		! this.innerHTML.contain ("for='" + varName +"'") &&
		! this.innerHTML.contain ('for="' + varName +'"')) return null;
	var nodeList =[];
	var nodeListTmp =[];
	for (var c=0; c< this.children.length; c++){
		nodeListTmp = this.children[c].findContainerFor (varName);
		if (nodeListTmp) for (var l in nodeListTmp) nodeList.push (nodeListTmp[l]);
	}
	if (nodeList.length ==0) nodeList =null;
	else if (nodeList[0].tagName == 'SELECTION' || nodeList[0].tagName == 'CAROUSEL') nodeList =null;
	return nodeList;
}
HTMLElement.prototype.findContainerModel = function (varName){
	var model = this.getAttribute ('model');
	if (! model || ! model.contain ('{{'+ varName +'}}')) return [];
	var nodeList =[];
	var nbOcurencies = model.count ('{{'+ varName +'}}');
	var c=0;
	while (nbOcurencies >0 && c< this.children.length){
		if (this.children[c].getAttribute ('model') && this.children[c].getAttribute ('model').contain ('{{'+ varName +'}}')){
			nodeListTmp = this.children[c].findContainerModel (varName);
			if (nodeListTmp && nodeListTmp.length >0){
				for (var l in nodeListTmp) nodeList.push (nodeListTmp[l]);
				nbOcurencies -= this.children[c].getAttribute ('model').count ('{{'+ varName +'}}');
	}} c++; }
	if (nbOcurencies) nodeList.push (this);
	return nodeList;
}
HTMLElement.prototype.findContainerParenthesis = function (varName){
	// retrouver le noeud contenant directement la variable, avec les parenthèses
	if (! this.outerHTML.contain ('(('+ varName +'))') &&! this.outerHTML.contain ('(('+ varName +'.')) return null;
	var nbOcurencies = this.outerHTML.count ('(('+ varName +'))');
	nbOcurencies += this.outerHTML.count ('(('+ varName +'.');
	var nodeList =[];
	var nodeListTmp =[];
	var c=0;
	while (nbOcurencies >0 && c< this.children.length){
		if (this.children[c].outerHTML.contain ('(('+ varName +'))') || this.children[c].outerHTML.contain ('(('+ varName +'.')){
			nodeListTmp = this.children[c].findContainerParenthesis (varName);
			if (nodeListTmp && nodeListTmp.length >0){
				for (var l in nodeListTmp) nodeList.push (nodeListTmp[l]);
				nbOcurencies -= this.children[c].outerHTML.count ('(('+ varName +'))');
				nbOcurencies -= this.children[c].outerHTML.count ('(('+ varName +'.');
	}} c++; }
	if (nbOcurencies) nodeList.push (this);
	return nodeList;
}
HTMLElement.prototype.findContainerList = function (value){
	/* vérifier si une liste est imbriquée
	node est le conteneur trouvé avec findContainerParenthesis
	*/
	if (value.constructor.name == 'Array' && value[0].constructor.name == 'Array'){
		node = this.parentElement;
		node = node.findContainerList (value[0]);
	}
	return node;
}
// fonctions modifiant un noeud
function createNode (tag, text, parent, id, clazz, value){
	var newElement = document.createElement (tag);
	if (text) newElement.innerHTML = text;
	if (clazz) newElement.className = clazz;
	if (id) newElement.id = id;
	if (value) newElement.value = value;
	if (parent){
		parent.appendChild (newElement);
		return parent.children [parent.children.length -1];
	}
	else return newElement;
}
function createInput (type, value, parent, id, clazz, placeholder){
	var newElement = createNode ('input', null, parent, clazz, id, value);
	if (! type) type = 'text';
	newElement.type = type;
	if (placeholder) newElement.placeholder = placeholder;
	return parent.children [parent.children.length -1];
}
HTMLElement.prototype.copy = function (bind){
	var newNode = this.cloneNode();
	if (this.innerHTML) newNode.innerHTML = this.innerHTML;
	if (this.value) newNode.value = this.value;
	if (this.placeholder) newNode.placeholder = this.placeholder;
	if (this.type) newNode.type = this.type;
	if (this.parentNode && bind) this.parentNode.insertBefore (newNode, this);
	return newNode;
}
