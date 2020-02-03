/* begin Page */
var artEventHelper = {
  'bind' : function (obj, evt, fn) {
    if (obj.addEventListener)
      obj.addEventListener(evt, fn, false);
    else if (obj.attachEvent)
      obj.attachEvent('on' + evt, fn);
    else
      obj['on' + evt] = fn;
  }
};

var artLoadEvent = {
  list: [],
  init: function() {
    if (arguments.callee.done) return;
    arguments.callee.done = true;
    for (var i = 0; i < artLoadEvent.list.length; i++) { artLoadEvent.list[i](); }
  },
  add: function(f) {
    artLoadEvent.list.push(f);
  },
  bindInit: function() {
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", artLoadEvent.init, false);
    }
    /*@cc_on @*/
    /*@if (@_win32)
    document.write('<script id="__ie_onload" defer="defer" src="javascript:void(0)"><\/script>');
    var script = document.getElementById("__ie_onload");
    script.onreadystatechange = function() {
      if (this.readyState == "complete") {
       artLoadEvent.init();
      }
    };
    /*@end @*/
    if (/WebKit/i.test(navigator.userAgent)) {
      var _timer = setInterval(function() {
        if (/loaded|complete/.test(document.readyState)) {
          clearInterval(_timer);
          artLoadEvent.init();
        }
      }, 10);
    }
    artEventHelper.bind(window, 'load', artLoadEvent.init);
  }
};
artLoadEvent.bindInit();


(function () {
  // fix ie blinking
  var m = document.uniqueID && document.compatMode && !window.XMLHttpRequest && document.execCommand;
  try{ if(!!m) { m("BackgroundImageCache", false, true); } }
  catch(oh){};
})();

function xGetElementsByClassName(clsName, parentEle, tagName) {
  var elements = null;
  var found = [];
  var slash = String.fromCharCode(92);
  var re = new RegExp(slash + "b" + clsName + slash + "b");
  if (!parentEle) parentEle = document;
  if (!tagName) tagName = '*';
  elements = parentEle.getElementsByTagName(tagName);
  if (elements) {
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].className.search(re) != -1) {
        found[found.length] = elements[i];
      }
    }
  }
  return found;
}

function artButtonSetupJsHover(btn)
{
  artEventHelper.bind(btn, 'mouseover', function() {
    var spans = btn.getElementsByTagName("span");
    if (spans.length > 0)
      spans[0].className += " hover";
  });
  artEventHelper.bind(btn, 'mouseout', function() {
    var spans = btn.getElementsByTagName("span");
    if (spans.length > 0)
      spans[0].className = spans[0].className.replace(/hover/, "");
  });
}

function artButtonsSetupJsHover() {
  var elements = xGetElementsByClassName("btn", document, "span");
  for (var i = 0; i < elements.length; i++) {
    if (!elements[i].tagName) continue;
    artButtonSetupJsHover(elements[i].parentNode);
  }
}

artLoadEvent.add(artButtonsSetupJsHover);
/* end Page */

/* begin Menu */
function Insert_Separators()
{
  var menus = xGetElementsByClassName("menu", document);
  for (var i = 0; i < menus.length; i++) {
    var menu = menus[i];
    var childs = menu.childNodes;
    var listItems = [];
    for (var j = 0; j < childs.length; j++){
      var el = childs[j];
      if (String(el.tagName).toLowerCase() == "li")listItems.push(el);
    }
    for (var j = 0; j < listItems.length - 1; j++){
      var span = document.createElement('span');
      span.className = 'separator';
      var li = document.createElement('li');
      li.appendChild(span);
      listItems[j].parentNode.insertBefore(li, listItems[j].nextSibling);
    }
  }
}
artLoadEvent.add(Insert_Separators);

function Menu_IE6Setup() {
  var isIE6 = navigator.userAgent.toLowerCase().indexOf("msie") != -1 
    && navigator.userAgent.toLowerCase().indexOf("msie 7") == -1;
  if (!isIE6) return;
  var aTmp2, i, j, oLI, aUL, aA;
  var aTmp = xGetElementsByClassName("menu", document, "ul");
  for (i=0;i<aTmp.length;i++) {
    aTmp2 = aTmp[i].getElementsByTagName("li");
    for (j=0;j<aTmp2.length;j++) {
      oLI = aTmp2[j];
      aUL = oLI.getElementsByTagName("ul");
      if (aUL && aUL.length) {
        oLI.UL = aUL[0];
        aA = oLI.getElementsByTagName("a");
        if (aA && aA.length)
          oLI.A = aA[0];
        oLI.onmouseenter = function() {
          this.className += " menuhover";
          this.UL.className += " menuhoverUL";
          if (this.A) this.A.className += " menuhoverA";
        };
        oLI.onmouseleave = function() {
          this.className = this.className.replace(/menuhover/,"");
          this.UL.className = this.UL.className.replace(/menuhoverUL/,"");
          if (this.A) this.A.className = this.A.className.replace(/menuhoverA/,"");
        };
      }
    }
  }
}
artLoadEvent.add(Menu_IE6Setup);
/* end Menu */

