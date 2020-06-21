/* framework pour utiliser des templates html.
je me suis inspirée de la foncionnalité de base d'angularjs.
display-test démontre son utilisation.

dépendence: display.css

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
	if (containsText (idTemplate, '.html')){
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
}}
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
	else if (containsText (this.outerHTML, '))')){
		var attributeList ="";
		var modelTmp;
		if (containsText (this.innerHTML, '))')){
			modelTmp = copyText (this.innerHTML);
			modelTmp = replace (modelTmp, '((', '{{');
			modelTmp = replace (modelTmp, '))', '}}');
			attributeList = attributeList +'$body:'+ modelTmp;
		}
		for (var a in this.attributes) if (typeof (this.attributes[a].value) == 'string' && this.attributes[a].name != 'model'
				&& containsText (this.attributes[a].value, '))')){
			modelTmp = copyText (this.attributes[a].value);
			modelTmp = replace (modelTmp, '((', '{{');
			modelTmp = replace (modelTmp, '))', '}}');
			attributeList = attributeList +'$'+ this.attributes[a].name +':'+ modelTmp;
		}
		this.setAttribute ('model', attributeList);
		for (var c=0; c< this.children.length; c++) if (this.tagName != 'SCRIPT') this.children[c].setModel();
}}
HTMLElement.prototype.getModel = function(){
	if (this.getAttribute ('model')){
		var modelTmp ="";
		var d=0;
		var attributeList = split (this.getAttribute ('model'), '$');
		var trash = attributeList.shift();
		if (slice (attributeList[0], 0,5) == 'body:'){
			modelTmp = slice (attributeList[0], 5);
			modelTmp = replace (modelTmp, '{{', '((');
			modelTmp = replace (modelTmp, '}}', '))');
			this.innerHTML = modelTmp;
			trash = attributeList.shift();
		}
		for (var a in attributeList){
			d= index (attributeList[a], ':');
			modelTmp = slice (attributeList[a], d+1);
			modelTmp = replace (modelTmp, '{{', '((');
			modelTmp = replace (modelTmp, '}}', '))');
			this.setAttribute (slice (attributeList[a], 0,d), modelTmp);
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
		if (inputList[i].getAttribute ('model') && containsText (inputList[i].getAttribute ('model'), '$value:'))
			inputList[i].addEventListener ('mouseleave', loadInput);
	}
	inputList = this.getElementsByTagName ('textarea');
	for (var i=0; i< inputList.length; i++){
		if (inputList[i].getAttribute ('model') && containsText (inputList[i].getAttribute ('model'), '$value:'))
			inputList[i].addEventListener ('mouseleave', loadInput);
}}
function loadInput (event){
	var varName = slice (event.target.getAttribute ('model'), 9,-2);
	debbyPlay [varName] = event.target.value;
	var nodeList = findContainerModel (varName, document.body);
	for (var n=0; n< nodeList.length; n++) nodeList[n].load();
	event.target.addEventListener ('mouseleave', loadInput);
}
// affichage de base
HTMLElement.prototype.clean = function(){
	this.innerHTML = clean (this.innerHTML);
	this.innerHTML = replace (this.innerHTML, '(( ', '((');
	this.innerHTML = replace (this.innerHTML, ' ))', '))');
}
HTMLElement.prototype.printVar = function (varName, value){
	var varType = value.constructor.name;
	// les variables simple
	if (varType == 'String' || varType == 'Number'){
		this.innerHTML = replace (this.innerHTML, '(('+ varName +'))', value);
		for (var a in this.attributes){
			if (typeof (this.attributes[a].value) == 'string' && containsText (this.attributes[a].value, '(('+ varName +'))'))
				this.setAttribute (this.attributes[a].name, replace (this.attributes[a].value, '(('+ varName +'))', value));
	}}
//	else if (varType == 'Array') this.printList (varName, value);
	else if (varType == 'Array') printList (varName, value, this);
	else if (varType == 'Object') for (var v in value) this.printVar (varName +'.'+v, value[v]);
}
printLink = function(){
	var linkList = document.getElementsByTagName ('a');
	var link = null, d;
	for (var l=0; l< linkList.length; l++){
		link = linkList[l].getAttribute ('href');
		d= rindex (link, '/');
		if (d == link.length -1){
			link = slice (link, 0,d);
			d= rindex (link, '/');
		}
		link = slice (link, d+1);
		if (containsText (link, '.')){
			d= rindex (link, '.');
			link = slice (link, 0,d);
		}
		if (containsText (link, '.')){
			d= rindex (link, '.');
			if (d == link.length -1){
				link = slice (link, 0,d);
				d= rindex (link, '.');
			}
			d=d+1;
			link = slice (link, d);
		}
		if (link[0] =='#') link = slice (link, 1);
		link = replace (link, '-', " ");
		link = replace (link, '_', " ");
		linkList[l].innerHTML = replace (linkList[l].innerHTML, '(())', link);
}}
HTMLElement.prototype.useTemplates = function(){
	// utiliser un template html
	var templateList = this.getElementsByTagName ('template');
	var insertList = this.getElementsByTagName ('insert');
	for (var f=0; f< insertList.length; f++){
		if (containsText (insertList[f].id, '.html')){
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
printList = function (varName, value, node){
	// afficher une liste imbriquée
	// récupérer les conteneurs directs
	if (value.constructor.name != 'Array' || value.length ==0) return;
	var nodeList = node.findContainerParenthesis (varName);
	if (! nodeList) nodeList =[];
	var nodeListTmp = node.findContainerFor (varName);
	if (nodeListTmp) for (var c in nodeListTmp) nodeList.push (nodeListTmp[c]);
	if (! nodeList) return;
	// récupérer les conteneurs parents, pour les listes imbriquées
	var container;
	if (value[0].constructor.name == 'Object') for (var n=0; n< nodeList.length; n++){
		for (var v=0; v< value.length -1; v++){
			container = nodeList[n].copy (true);
			for (var w in value[v]) container.printVar (w, value[v][w]);
		}
		for (var w in value[v]){
			nodeList[n].printVar (w, value[v][w]);
			nodeList[n].printVar (varName +'.'+w, value[v][w]);
		}
	}else{
		if (value[0].constructor.name == 'Array') for (var n=0; n< nodeList.length; n++) nodeList[n] = nodeList[n].findContainerList (value);
		for (var n=0; n< nodeList.length; n++){
			for (var v=0; v< value.length -1; v++){
				container = nodeList[n].copy (true);
				container.printVar (varName, value[v]);
			}
			nodeList[n].printVar (varName, value[v]);
}}}
HTMLElement.prototype.printList_vb = function (varName, value){
	// afficher une liste imbriquée
	// récupérer les conteneurs directs
	if (value.constructor.name != 'Array') return;
	var nodeList = this.findContainerParenthesis (varName);
	if (! nodeList) nodeList =[];
	var nodeListTmp = this.findContainerFor (varName);
	if (nodeListTmp) for (var c in nodeListTmp) nodeList.push (nodeListTmp[c]);
	if (! nodeList) return;
	// récupérer les conteneurs parents, pour les listes imbriquées
	if (value[0].constructor.name == 'Array') for (var l in nodeList) nodeList[l] = nodeList[l].findContainerList (value);
	var container;
	debug (varName, nodeList.length, value.length);
	console.log (nodeList, value);
	for (var l in nodeList){
	//	if (varName == 'listeSimple') debug (l, nodeList[l].tagName);
		for (v=0; v< value.length -1; v++){
			container = nodeList[l].copy (true);
		//	debugCondition (varName == 'listeSimple', container.tagName, container.innerText);
			container.printVar (varName, value[v]);
		}
		nodeList[l].printVar (varName, value[value.length -1]);
}}
HTMLElement.prototype.findContainerFor = function (varName){
	// retrouver le noeud contenant une liste d'objet, contenant un attribut for
//	if (this.tagName == 'selection' || this.tagName == 'carousel') return null;
	if (this.getAttribute ('for') && this.getAttribute ('for') == varName) return [ this ,];
	else if (
		! containsText (this.innerHTML, "for='" + varName +"'") &&
		! containsText (this.innerHTML, 'for="' + varName +'"')) return null;
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
	if (! model || ! containsText (model, '{{'+ varName +'}}')) return [];
	var nodeList =[];
	var nbOcurencies = count (model, '{{'+ varName +'}}');
	var c=0;
	while (nbOcurencies >0 && c< this.children.length){
		if (this.children[c].getAttribute ('model') && containsText (this.children[c].getAttribute ('model'), '{{'+ varName +'}}')){
			nodeListTmp = findContainerModel (varName, this.children[c]);
			if (nodeListTmp && nodeListTmp.length >0){
				for (var l in nodeListTmp) nodeList.push (nodeListTmp[l]);
				nbOcurencies -= count (this.children[c].getAttribute ('model'), '{{'+ varName +'}}');
	}} c++; }
	if (nbOcurencies) nodeList.push (this);
	return nodeList;
}
HTMLElement.prototype.findContainerParenthesis = function (varName){
	// retrouver le noeud contenant directement la variable, avec les parenthèses
	if (! containsText (this.outerHTML, '(('+ varName +'))')) return null;
	var nbOcurencies = count (this.outerHTML, '(('+ varName +'))');
	var nodeList =[];
	var nodeListTmp =[];
	var c=0;
	while (nbOcurencies >0 && c< this.children.length){
		if (containsText (this.children[c].outerHTML, '(('+ varName +'))')){
			nodeListTmp = this.children[c].findContainerParenthesis (varName);
			if (nodeListTmp && nodeListTmp.length >0){
				for (var l in nodeListTmp) nodeList.push (nodeListTmp[l]);
				nbOcurencies -= count (this.children[c].outerHTML, '(('+ varName +'))');
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
// fonctions modifiant un texte
copyText = function (text){
	var newText ="";
	for (var l in text) newText = newText + text[l];
	return newText;
}
index = function (text, word, pos){
	if (! pos) pos =0;
	return text.indexOf (word, pos);
}
rindex = function (text, word){
	return text.lastIndexOf (word);
}
containsText = function (text, word){
	if (index (text, word) >=0) return true;
	else return false;
}
count = function (text, word) {
	if (! containsText (text, word)) return 0;
	var pos =0, nb=0;
	while (pos >=0){
		pos = index (text, word, pos);
		if (pos <0) break;
		pos +=1; nb +=1;
	}
	return nb;
}
split = function (text, word){ return text.split (word); }
replace = function (text, strOld, strNew){
	if (! strNew) strNew ="";
	var tabText = split (text, strOld);
	return tabText.join (strNew);
}
slice = function (text, d,f){
	if (!f) f= text.length;
	else if (f<0) f= text.length +f;
	return text.slice (d,f);
}
strip = function (text){
	var toStrip = '\n \t/';
	var i=0, j=1;
	for (; i< text.length; i++) if (! containsText (toStrip, text[i])) break;
	for (; j<= text.length; j++) if (! containsText (toStrip, text [text.length -j])) break;
	j= text.length +1-j;
	return text.substring (i,j);
}
clean = function (text){
	text = replace (text, '\r');
	text = strip (text);
	while (containsText (text, '  ')) text = replace (text, '  ', ' ');
	text = replace (text, '\n ', '\n');
	text = replace (text, ' \n', '\n');
	text = replace (text, '\t\n', '\n');
	while (containsText (text, '\n\n')) text = replace (text, '\n\n', '\n');
	while (containsText (text, '_______')) text = replace (text, '_______', '______');
	while (containsText (text, '-------')) text = replace (text, '-------', '------');
	return text;
}
