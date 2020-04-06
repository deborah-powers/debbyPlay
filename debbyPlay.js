/* framework pour utiliser des templates html.
je me suis inspirée de la foncionnalité de base d'angularjs.
display-test démontre son utilisation.

dépendence: display.css

________________________ fonctions utilisable par vous ________________________ */

// affichage de base
var debbyPlay ={};
init = function (node){
	if (! node) node = document.body;
	useTemplates (node);
	cleanNode (node);
	setModel (node);
}
load = function (node){
	if (! node) node = document.body;
	getModel (node);
	for (var v in debbyPlay) printVar (v, debbyPlay[v], node);
	setInput (node);
	printLinks();
	createSelections (node);
	createCarousels (node);
}
// afficher des sélecteurs. la target de funcRes est une string
function createSelections (node){
	var selectList = node.getElementsByTagName ('selection');
	var title, option, varName, callback;
	for (var s=0; s< selectList.length; s++){
		varName = selectList[s].getAttribute ('for');
		title = createNode ('p', "", selectList[s]);
		for (var v in debbyPlay[varName]){
			option = createNode ('option', debbyPlay[varName][v], selectList[s], null, null, v);
			option.addEventListener ('click', updateSelection);
			if (this [selectList[s].getAttribute ('callback')]){
				var that = this;
				option.addEventListener ('click', function (event){
					var callback = event.target.parentElement.getAttribute ('callback');
					that[callback] (event.target.innerText.toLowerCase());
				});
			}
		}
		title.innerHTML = debbyPlay[varName][0];
		title.id =0;
}}
function createCarousels (node){
	var selectList = node.getElementsByTagName ('carousel');
	var title, varName, callback, before, after, option;
	for (var s=0; s< selectList.length; s++){
		varName = selectList[s].getAttribute ('for');
		callback = this [selectList[s].getAttribute ('callback')];
		before = createNode ('p', '<', selectList[s]);
		title = createInput ('text', debbyPlay[varName][0], selectList[s]);
		after = createNode ('p', '>', selectList[s]);
		title.addEventListener ('click', function (evt){ setCurrent (evt, callback) });
		before.addEventListener ('click', function (evt){ setBefore (evt, callback) });
		after.addEventListener ('click', function (evt){ setAfter (evt, callback) });
}}
useTemplate = function (idInsert, idTemplate, node){
	// utiliser un template html
	if (! node) node = document.body;
	var insertList = node.getElementsByTagName ('insert');
	if (containsText (idTemplate, '.html')){
		var xhttp = new XMLHttpRequest();
		xhttp.open ('GET', insertList[f].id, false);
		xhttp.send();
		if (xhttp.status ==200){
			for (var i in insertList){
				if (insertList[i].id == idInsert){
					insertList[i].innerHTML = xhttp.responseText;
					insertList[f] = insertList[f].children[0];
	}}}}
	else{
		var templateList = node.getElementsByTagName ('template');
		var template;
		for (var t in templateList){
			if (templateList[t].id == idTemplate) template = templateList[t];
		}
		for (var i in insertList){
			if (insertList[i].id == idInsert) insertList[i].innerHTML = template.innerHTML;
}}}
// utiliser un fichier json
useJson = function (jsonFile, varName, node){
	var xhttp = new XMLHttpRequest();
	xhttp.open ('GET', jsonFile, false);
	xhttp.send();
	if (xhttp.status ==200){
		var res = JSON.parse (xhttp.responseText);
		debbyPlay[varName] = res;
}}
useJsonAssync = function (jsonFile, varName, node, func){
	var xhttp = new XMLHttpRequest();
	xhttp.responseType = 'text/json';
	var dispObj = this;
	xhttp.onreadystatechange = function(){
		if (this.readyState == 4){
			var res = JSON.parse (this.responseText);
			debbyPlay[varName] = res;
			if (func) func();
	}};
	xhttp.open ('GET', jsonFile, true);
	xhttp.send();
}
// ________________________ fonctions appelées dans les précédentes ________________________

// conserver le template de la page afin de la recharger
function setModel (node){
	if (node.tagName == 'SCRIPT') return;
	else if (containsText (node.outerHTML, '))')){
		var attributeList ="";
		var modelTmp;
		if (containsText (node.innerHTML, '))')){
			modelTmp = copyText (node.innerHTML);
			modelTmp = replace (modelTmp, '((', '{{');
			modelTmp = replace (modelTmp, '))', '}}');
			attributeList = attributeList +'$body:'+ modelTmp;
		}
		for (var a in node.attributes){
			if (typeof (node.attributes[a].value) == 'string' && node.attributes[a].name != 'model' && containsText (node.attributes[a].value, '))')){
				modelTmp = copyText (node.attributes[a].value);
				modelTmp = replace (modelTmp, '((', '{{');
				modelTmp = replace (modelTmp, '))', '}}');
				attributeList = attributeList +'$'+ node.attributes[a].name +':'+ modelTmp;
			}
		}
		node.setAttribute ('model', attributeList);
		for (var c=0; c< node.children.length; c++){
			if (node.tagName != 'SCRIPT') setModel (node.children[c]);
		}
	}
}
function getModel (node){
	if (node.getAttribute ('model')){
		var modelTmp ="";
		var d=0;
		var attributeList = split (node.getAttribute ('model'), '$');
		var trash = attributeList.shift();
		if (slice (attributeList[0], 0,5) == 'body:'){
			modelTmp = slice (attributeList[0], 5);
			modelTmp = replace (modelTmp, '{{', '((');
			modelTmp = replace (modelTmp, '}}', '))');
			node.innerHTML = modelTmp;
			trash = attributeList.shift();
		}
		for (var a in attributeList){
			d= index (attributeList[a], ':');
			modelTmp = slice (attributeList[a], d+1);
			modelTmp = replace (modelTmp, '{{', '((');
			modelTmp = replace (modelTmp, '}}', '))');
			node.setAttribute (slice (attributeList[a], 0,d), modelTmp);
		}
		setModel (node);
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
function setInput (node){
	var inputList = node.getElementsByTagName ('input');
	for (var i=0; i< inputList.length; i++){
		if (inputList[i].getAttribute ('model') && containsText (inputList[i].getAttribute ('model'), '$value:'))
			inputList[i].addEventListener ('mouseleave', loadInput);
	}
	inputList = node.getElementsByTagName ('textarea');
	for (var i=0; i< inputList.length; i++){
		if (inputList[i].getAttribute ('model') && containsText (inputList[i].getAttribute ('model'), '$value:'))
			inputList[i].addEventListener ('mouseleave', loadInput);
}}
function loadInput (event){
	var varName = slice (event.target.getAttribute ('model'), 9,-2);
	debbyPlay [varName] = event.target.value;
	var nodeList = findContainerModel (varName, document.body);
	for (var n=0; n< nodeList.length; n++) load (nodeList[n]);
	event.target.addEventListener ('mouseleave', loadInput);
}
// affichage de base
cleanNode = function (node){
	node.innerHTML = clean (node.innerHTML);
	node.innerHTML = replace (node.innerHTML, '(( ', '((');
	node.innerHTML = replace (node.innerHTML, ' ))', '))');
}
printVar = function (varName, value, node){
	var varType = typeof (value);
	// les variables simple
	if (varType == 'string' || varType == 'number'){
		node.innerHTML = replace (node.innerHTML, '(('+ varName +'))', value);
		for (var a in node.attributes){
			if (typeof (node.attributes[a].value) == 'string' && containsText (node.attributes[a].value, '(('+ varName +'))'))
				node.setAttribute (node.attributes[a].name, replace (node.attributes[a].value, '(('+ varName +'))', value));
	}}
	// les listes
	else if (varType == 'object' && value[0]){
		printList (varName, value, node);
	}
	// les dictionnaires
	else if (varType == 'object'){
			for (var v in value) printVar (varName +'.'+v, value[v], node);
	}
}
printLinks = function(){
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
		link = replace (link, '-', " ");
		link = replace (link, '_', " ");
		linkList[l].innerHTML = replace (linkList[l].innerHTML, '(())', link);
}}
function useTemplates (node){
	// utiliser un template html
	var templateList = node.getElementsByTagName ('template');
	var insertList = node.getElementsByTagName ('insert');
	for (var f=0; f< insertList.length; f++){
		if (containsText (insertList[f].id, '.html')){
			var xhttp = new XMLHttpRequest();
			xhttp.open ('GET', insertList[f].id, false);
			xhttp.send();
			if (xhttp.status ==200){
				insertList[f].innerHTML = xhttp.responseText;
				insertList[f] = insertList[f].children[0];
		}}
		else{
			for (var t in templateList){
				if (templateList[t].id == insertList[f].id) insertList[f].innerHTML = templateList[t].innerHTML;
}}}}
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
				init (tagDst);
				load (tagDst);
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
	if (typeof (value) != 'object' || ! value[0]) return;
	var nodeList = findContainerParenthesis (varName, node);
	if (! nodeList) nodeList =[];
	var nodeListTmp = findContainerFor (varName, node);
	if (nodeListTmp){
		for (var c in nodeListTmp) nodeList.push (nodeListTmp[c]);
	}
	if (! nodeList) return;
	// récupérer les conteneurs parents, pour les listes imbriquées
	var v=0, container;
	if (value[0][0]){
		for (var l in nodeList){
			nodeList[l] = findContainerList (value, nodeList[l]);
			for (v=0; v< value.length -1; v++){
				container = copyNode (nodeList[l]);
				printVar (varName, value[v], container);
				printVar ("", value[v], container);
			}
			printVar (varName, value[v], nodeList[l]);
			printVar ("", value[v], nodeList[l]);
		}
	}
	// liste de dictionnaires
	else{
		for (var c in nodeList){
			v=0;
			for (v=0; v< value.length -1; v++){
				containerTmp = copyNode (nodeList[c]);
				for (var w in value[v]) printVar (w, value[v][w], containerTmp);
			}
			for (var w in value[v]) printVar (w, value[v][w], nodeList[c]);
		}
	}
}
findContainerFor = function (varName, node){
	// retrouver le noeud contenant une liste d'objet, contenant un attribut for
//	if (node.tagName == 'selection' || node.tagName == 'carousel') return null;
	if (node.getAttribute ('for') && node.getAttribute ('for') == varName) return [ node ,];
	else if (
		! containsText (node.innerHTML, "for='" + varName +"'") &&
		! containsText (node.innerHTML, 'for="' + varName +'"')) return null;
	var nodeList =[];
	var nodeListTmp =[];
	for (var c=0; c< node.children.length; c++){
		nodeListTmp = findContainerFor (varName, node.children[c]);
		if (nodeListTmp){
			for (var l in nodeListTmp) nodeList.push (nodeListTmp[l]);
		}
	}
	if (nodeList.length ==0) nodeList =null;
	else if (nodeList[0].tagName == 'SELECTION' || nodeList[0].tagName == 'CAROUSEL') nodeList =null;
	return nodeList;
}
function findContainerModel (varName, node){
	if (! node) node = document.body;
	var model = node.getAttribute ('model');
	if (! model || ! containsText (model, '{{'+ varName +'}}')) return [];
	var nodeList =[];
	var nbOcurencies = count (model, '{{'+ varName +'}}');
	var c=0;
	while (nbOcurencies >0 && c< node.children.length){
		if (node.children[c].getAttribute ('model') && containsText (node.children[c].getAttribute ('model'), '{{'+ varName +'}}')){
			nodeListTmp = findContainerModel (varName, node.children[c]);
			if (nodeListTmp && nodeListTmp.length >0){
				for (var l in nodeListTmp) nodeList.push (nodeListTmp[l]);
				nbOcurencies -= count (node.children[c].getAttribute ('model'), '{{'+ varName +'}}');
		}}
		c++;
	}
	if (nbOcurencies) nodeList.push (node);
	return nodeList;
}
findContainerParenthesis = function (varName, node){
	// retrouver le noeud contenant directement la variable, avec les parenthèses
	if (! containsText (node.outerHTML, '(('+ varName +'))')) return null;
	var nbOcurencies = count (node.outerHTML, '(('+ varName +'))');
	var nodeList =[];
	var nodeListTmp =[];
	var c=0;
	while (nbOcurencies >0 && c< node.children.length){
		if (containsText (node.children[c].outerHTML, '(('+ varName +'))')){
			nodeListTmp = findContainerParenthesis (varName, node.children[c]);
			if (nodeListTmp && nodeListTmp.length >0){
				for (var l in nodeListTmp) nodeList.push (nodeListTmp[l]);
				nbOcurencies -= count (node.children[c].outerHTML, '(('+ varName +'))');
			}
		}
		c++;
	}
	if (nbOcurencies) nodeList.push (node);
	return nodeList;
}
findContainerList = function (value, node){
	/* vérifier si une liste est imbriquée
	node est le conteneur trouvé avec findContainerParenthesis
	*/
	if (typeof (value) == 'object' && value[0] && typeof (value[0]) == 'object' && value[0][0]){
		node = node.parentElement;
		node = findContainerList (value[0], node);
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
function copyNode (node, bind=true){
	if (! node){
		var src = getStack()[1];
		console.log ('copie impossible, pas de noeud modèle\nfonction:\t' + src.func + '\nfichier:\t' + src.file + '\nligne:\t\t' + src.line);
		return null;
	}
	var newNode = node.cloneNode();
	if (node.innerHTML) newNode.innerHTML = node.innerHTML;
	if (node.value) newNode.value = node.value;
	if (node.placeholder) newNode.placeholder = node.placeholder;
	if (node.type) newNode.type = node.type;
	if (node.parentNode && bind) node.parentNode.insertBefore (newNode, node);
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
	for (; i< text.length; i++){
		if (! containsText (toStrip, text[i])) break;
	}
	for (; j<= text.length; j++){
		if (! containsText (toStrip, text [text.length -j])) break;
	}
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
