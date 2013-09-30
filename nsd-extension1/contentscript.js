if (document.querySelector('#NSDAPI1') != null) {

    var services = [];
    var bgPort = null;

    function validateXHRRequest(request, callback) {
        var service = services[request.service.url];
        if (service != null && service.granted) {
            chrome.runtime.sendMessage({type: 'validatexhrrequest', detail:request}, function(response){
                callback(response);
            });
        } 
        else
            callback(false);
    }

    function checkAccess(e) {
        if (bgPort == null)
            bgPort = chrome.runtime.connect({name: "nsdapi"});
        
        //console.log("port:"+bgPort);
        bgPort.onMessage.addListener(function(msg) {
            //console.log("received msg:"+msg);
            if (msg.status == "ok") {
                var service = services[msg.url];
                service.granted = true;
                sendOK({url: msg.url, type: service.serviceType});
            }
            else {
                var service = services[msg.url];
                if (service != null) {
                    service.granted = false;
                    services[msg.url] = null;
                    sendKO(service);
                }
            }
        });
        //console.log("sending msg nsdapirequest");
        services[e.detail.url] = {name: e.detail.name, url: e.detail.url,serviceType: e.detail.type, granted: false};
        //TODO: validate name and url correspondance (in particular IP address)
        bgPort.postMessage({type: "nsdapirequest",name: e.detail.name, url: e.detail.url,serviceType: e.detail.type});
        //console.log("sent msg nsdapirequest");
    }

    function sendMessage(request,xhr) {
        validateXHRRequest(request, function(isValid) {
            if (isValid) {
                //TODO: validate request (verb headers and data) according url and/or service information
                xhr.onreadystatechange = function(data) {
                    if (xhr.readyState == 4) {
                        var data = xhr.responseText;
                        //console.log(data);
                        var event = new CustomEvent('nsdxhr-res', {'detail' : 
                            {data: data,
                            id: request.id,
                            status: xhr.status,
                            headers: xhr.getAllResponseHeaders()}
                        });
                        document.dispatchEvent(event);
                    }
                }
                xhr.open(request.verb, request.service.url, true);
                if (request.headers != null) {
                    for (var key in request.headers) {
                        if (request.headers.hasOwnProperty(key))
                            xhr.setRequestHeader(key, request.headers[key]);
                    }
                }
                xhr.send(request.data);
            }
        });
    }

    function sendOK(service) {
        console.log("sending: "  + JSON.stringify(service));
        var event = new CustomEvent('nsdapicallagreed', {'detail' : service});
        document.dispatchEvent(event);
    }
    function sendKO(service) {
        var event = new CustomEvent('nsdapicallfailed', {'detail' : service});
        document.dispatchEvent(event);
    }

    document.addEventListener("nsdapicallrequest", function (e) {checkAccess(e)});
    document.addEventListener("nsdxhr-req", function (e) {
        //console.log("nsdxhr-req");
        var request = e.detail;
        var xhr = new XMLHttpRequest();
        sendMessage(request,xhr);
    });
    console.log("extension loaded");
}