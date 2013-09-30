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
                        //console.log("got nsdapi grant");
                        port.postMessage({status: "ok", url:request.url});
                    }
                    else if (response.type == "nsdapirefused") {
                        //console.log("got nsdapi grant");
                        port.postMessage({status: "ko", url:request.url});
                    }
                    chrome.runtime.onMessage.removeListener(listener);
                    pendingRequests[port.sender.tab.id] = null;
                }
            }
        );
    }
}

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


function nsResolver(prefix) {
  var ns = {
    'SOAP-ENV' : 'http://schemas.xmlsoap.org/soap/envelope/',
  };
  return ns[prefix] || null;
}
function getSOAPBodyContent(data) {
    var parser=new DOMParser();
    var doc = parser.parseFromString(data,'text/xml');
    var body = doc.evaluate( '//SOAP-ENV:Body/*' ,doc.documentElement, nsResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
    return new XMLSerializer().serializeToString(body.singleNodeValue);
}

var soapSchema = loadResource("xsd/soap.xsd");
function validateSoapEnvelope(msg) {
    var Module = {
        xml: msg,
        schema: soapSchema,
        arguments: ["--noout", "--schema", "msg.xsd", "msg.xml"]
    };
    var result = validateXML(Module);
    var isValid = result.search("msg.xml validates") >= 0;
    console.log("soap validation: "+isValid);
    return isValid;
}
function validateSoapBodyContent(data, schema) {
    var Module = {
        xml: getSOAPBodyContent(data),
        schema: schema,
        arguments: ["--noout", "--schema", "msg.xsd", "msg.xml"]
    };
    var result = validateXML(Module);
    var isValid = result.search("msg.xml validates") >= 0;
    console.log("body validation: "+isValid);
    return isValid;
}



function saxonTransform(data) {
    var xslString = loadResource("test.xsl");
    var xsl = Saxon.parseXML(xslString);
    var xml = Saxon.parseXML(data);
    var proc = Saxon.newXSLT20Processor(xsl);
    var result = proc.transformToDocument(xml);
    var result2 = Saxon.serializeXML(result);
    return result2;
}

var cdSchema = loadResource("xsd/upnp_av_contentdirectory-inline.xsd");
var schemaValidation = {};
schemaValidation["upnp:urn:schemas-upnp-org:service:ContentDirectory:1"] = {
    authorizedVerbs: {
        GET: function(url) {return true;},// should restrict to content only
        POST: function(url) {return true;}
    },
    validateHeaders: function() {return true;},
    contentValidation: [validateSoapEnvelope, function(data) {return validateSoapBodyContent(data,cdSchema);}]
};

function validateXHRRequest(request) {
    //console.log("validating xhr req");
    var sv = schemaValidation[request.service.type];
    if (sv == null)
        return false;
    var validateUrl = sv.authorizedVerbs[request.verb.toUpperCase()];
    if (validateUrl == null) {
        return false;
    }
    if (!validateUrl(request.url)) {
        return false;
    }
    if (sv.validateHeaders && !sv.validateHeaders(request.headers)) {
        return false;
    }
    if (request.verb == 'POST' || request.verb == 'PUT') {
        if (sv.contentValidation != null) {
            for (var i=0; i < sv.contentValidation.length; i++){
                if (!sv.contentValidation[i](request.data))
                    return false;
            }
        }
    }
    return true;
}

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

//document.addEventListener("ready", function(e) {
    //loadScript("xmllint.js", function () {console.log("xmllint.js loaded")});
    //loadScript("saxon-ce/Saxonce.nocache.js", function () {console.log("saxon-ce loaded")});
//});


console.log("bg loaded");
