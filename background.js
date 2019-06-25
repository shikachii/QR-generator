function genericOnClick(info, tab){
	var string = "url:" + tab.url + ", ";
	string += "title:" + tab.title;

	let url;

	if(info.linkUrl == undefined){
		url = info.pageUrl;
	}else{
		url = info.linkUrl;
	}

	chrome.tabs.sendRequest(tab.id, {})

	// alert(url + "\n" + url.length + "<canvas id='cv1' width='360' height='240'></canvas>");
}

var contexts = ["page", "link"]

for(var i = 0; i < contexts.length; i++){
	var context = contexts[i];
	var title = "Convert to QR : " + context;
	chrome.contextMenus.create({
		"title": title,
		"contexts":[context],
		"onclick": genericOnClick
	});
}
