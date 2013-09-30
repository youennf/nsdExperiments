var nsdId = 0;
var pendingRequests = {};
function validateNSDRequest(request, port) {
    var pendingRequest = pendingRequests[port.sender.tab.id];
    if (pendingRequest != null)  {
        // update ongoing request
        //console.log("updating req");
        request.nsdId = pendingRequest.nsdId;
        pendingRequests[port.sender.tab.id] = request;
        chrome.runtime.sendMessage({type:"updatensdapirequest", request: request}, function(){});
        //console.log("showing infobar if needed");
        var url = "infobar.html#" + JSON.stringify(request);
        chrome.infobars.show({
            tabId: port.sender.tab.id,
            path: url
        }, function(window) {
            request.window = window;
        });
        //console.log("showed infobar if needed");
    }
    else {
        //console.log("new req");
        request.nsdId = nsdId++;
        pendingRequests[port.sender.tab.id] = request;
        var url = "infobar.html#" + JSON.stringify(request);
        var sessionId;
        //console.log(url);
        // Show the infobar on the tab where the request was sent.
        chrome.infobars.show({
            tabId: port.sender.tab.id,
            path: url
        }, function(window) {
            request.window = window;
        });
        //console.log("info bar showed on "+port.sender.tab.id);
        
        chrome.runtime.onMessage.addListener(
            function listener(response, sender, send) {
                if (response.nsdId == request.nsdId) {
                    //console.log("got resp:"+response);
                    if (response.type == "nsdapigrant") {
                        console.log("got nsdapi grant");
                        port.postMessage({status: "ok", url:request.url});
                        proxies[port] = {contentDirectories: []};
                    }
                    else if (response.type == "nsdapirefused") {
                        console.log("got nsdapi denial");
                        port.postMessage({status: "ko", url:request.url});
                    }
                    chrome.runtime.onMessage.removeListener(listener);
                    pendingRequests[port.sender.tab.id] = null;
                }
            }
        );
    }
}

var proxies = {};
chrome.runtime.onConnect.addListener(
    function(port) {
        //console.log("new port:" +port.name);
        if (port.name=="nsdapi") {
            port.onMessage.addListener(function(msg) {
                //console.log(msg);
                if (msg.type == "nsdapirequest") {
                    //console.log("nsdapirequest received");
                    port.url = msg.url;
                    validateNSDRequest(msg, port);
                }
                else if (msg.type == "upnprequest") {
                    var request = msg.detail;
                    var call = request.call;
                    var proxy = proxies[port];
                    if (proxy != null) {
                        if (call.func == "browseEntry") {
                            var index = call.args.index;
                            var id = call.args.id;
                            browseEntry(proxy.contentDirectories,index,id,
                                function(nodes) {
                                    port.postMessage({status:"upnpresponse", data: nodes, id: request.id});
                                }
                            );
                        }
                        else if (call.func == "browseMetadata") {
                            var index = call.args.index;
                            var id = call.args.id;
                            browseMetadata(proxy.contentDirectories,index,id,
                                function(nodes) {
                                    port.postMessage({status:"upnpresponse", data: nodes, id: request.id});
                                }
                            );
                        }
                        else if (call.func == "createContentDirectory") {
                            var contentDirectory = createContentDirectory(call.args.service);
                            proxy.contentDirectories.push(contentDirectory);
                            port.postMessage({status:"upnpresponse", data: "ok", id: request.id});
                        }
                    }
                }
            });
        }
        else  if (port.name == "nsdxhr") {
            port.onMessage.addListener(function(msg) {
                //console.log("nsdxhr:" +msg);
            });
        }
    }
);

chrome.runtime.onMessage.addListener(
    function listener(request, sender, sendResponse) {
        if (request.type == "validatexhrrequest") {
            var validation = validateXHRRequest(request.detail);
            sendResponse(validation);
        }
    });



function loadScript(url, callback)
{
    // adding the script tag to the head as suggested before
   var head = document.getElementsByTagName('head')[0];
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = url;

   // then bind the event to the callback function 
   // there are several events for cross browser compatibility
   script.onreadystatechange = callback;
   script.onload = callback;

   // fire the loading
   head.appendChild(script);
}

function loadResource(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send(null);
    return xhr.responseText;
}

loadScript("upnp/util/parser/jssaxparser/sax.js", function(){});
loadScript("upnp/util/parser/jssaxparser/DefaultHandlers.js", function(){});
loadScript("upnp/util/parser/jssaxparser/DummyContentHandler.js", function(){});
loadScript("upnp/util/ohnet/ControlPoint/lib/ohnet.soaprequest.js", function(){});
loadScript("upnp/util/ohnet/ControlPoint/lib/ohnet.serviceproperty.js", function(){});
loadScript("upnp/util/ohnet/ControlPoint/Proxies/CpUpnpOrgAVTransport1.js", function(){});
loadScript("upnp/util/ohnet/ControlPoint/Proxies/CpUpnpOrgAVTransport2.js", function(){});
loadScript("upnp/util/ohnet/ControlPoint/Proxies/CpUpnpOrgConnectionManager1.js", function(){});
loadScript("upnp/util/ohnet/ControlPoint/Proxies/CpUpnpOrgConnectionManager2.js", function(){});
loadScript("upnp/util/ohnet/ControlPoint/Proxies/CpUpnpOrgContentDirectory1.js", function(){});
loadScript("upnp/util/ohnet/ControlPoint/Proxies/CpUpnpOrgContentDirectory2.js", function(){});
loadScript("upnp/util/ohnet/ControlPoint/Proxies/CpUpnpOrgContentDirectory3.js", function(){});
loadScript("upnp/js/DidlNode.js", function(){});
loadScript("upnp/js/ServiceConfig.js", function(){});
loadScript("upnp/js/ServiceEvent.js", function(){});
loadScript("upnp-utils.js", function(){});

console.log("bg loaded");
