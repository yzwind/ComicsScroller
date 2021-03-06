console.log("reader starts");
var comics=comics || { };
comics.setImages=function(doc){
	var imgpath='';

	var script=doc.head.innerHTML.replace(/[\r\n]/g,'@@@').match(/(eval.*?)\/*@@@/)[1];
	(new Function(script+";comics.pageMax=pages;comics.imgpath=imgpath;comics.chapterId=currentchapter.toString();"))();
	var titlename=doc.evaluate("//*[@id=\"enjoy_b\"]/div[1]/div[1]/h1/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().text;
	comics.nextURL_tmp=doc.evaluate("//*[@id=\"enjoy_b\"]/div[2]/ul/li[6]/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().getAttribute("href");
	console.log("new nextURL: "+comics.nextURL_tmp);
	comics.preURL_tmp=doc.evaluate("//*[@id=\"enjoy_b\"]/div[2]/ul/li[2]/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().getAttribute("href");
	var chapterInfor=doc.evaluate("//*[@id=\"enjoy_b\"]/div[1]/div[1]/h2/a",doc,null,XPathResult.ANY_TYPE, null).iterateNext().text;
	comics.titleInfor=titlename+" / "+chapterInfor;
	// comics.chapterId=currentchapter.toString();
	if(comics.nextURL_tmp=="javascript:void(0);"){
		comics.maxChapter=comics.chapterId;
	}
	if(comics.preURL_tmp=="javascript:void(0);"){
		comics.minChapter_tmp=comics.chapterId;
	}
	var img_domain='';
	// comics.pageMax=pages;
	var verifystr=/http\:\/\/manhua.ali213.net\/comic\/\d*\/(\d*).html/.exec(doc.URL)[1];
	if (verifystr>144681){
		img_domain="http://mhimg1.ali213.net";
	}else{
		img_domain="http://mhimg.ali213.net";
	}
	var imgs =[]; 
	for(var i=0;i<comics.pageMax;i++){
		imgs[i]=img_domain+comics.imgpath+i+".jpg";
	}
	comics.images=imgs;	
	comics.appendImage();
	echo.init({
		offset: 2500,
		throttle: 100,
		unload: false,
		update: function () {
			if(comics.maxChapter!==comics.chapterId){
				var req=new XMLHttpRequest();
				req.open("GET",comics.nextURL_tmp,true);
				req.responseType="document";
				req.onload=function(){
					 // console.log(req.response);
					 var doc=req.response;
					 comics.setImages(doc);
				};
				req.send();
			}
		}
	});
};

document.onreadystatechange = function () {
	if (document.readyState == "interactive") {
		comics.createItem();
		comics.setImages(document);
		comics.chaptertxt.textContent=comics.titleInfor+" 第 1/"+comics.pageMax+"頁";
		comics.preURL=comics.preURL_tmp;
		comics.nextURL=comics.nextURL_tmp;
		// console.log("nextURL " +comics.nextURL);
		if(comics.nextURL==""){
			comics.maxChapter=comics.chapterId;
			comics.nextChapter.style.display="none";
		}
		if(comics.preURL==""){
			comics.minChapter=comics.chapterId;
			comics.preChapter.style.display="none";
		}
	}
}
