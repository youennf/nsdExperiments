if (document.querySelector('#NSDAPI2') != null) {

    var services = {};
    var bgPort = null;


    function checkAccess(e) {
        if (bgPort == null)
            bgPort = chrome.runtime.connect({name: "nsdapi"});
        
        //console.log("port:"+bgPort);
        bgPort.onMessage.addListener(function(msg) {
            //console.log("received msg:"+msg);
            if (msg.status == "ok") {
                var service = services[e.detail.url];
                service.granted = true;
                sendOK({url: msg.url, type: service.serviceType});
            }
            else if(msg.status == "ko") {
                var service = services[e.detail.url];
                service.granted = false;
                services[msg.url] = null;
                sendKO(service);
            }
            else if (msg.status == "upnpresponse") {
                var pendingRequest = pendingRequests[msg.id];
                if (pendingRequest != null) {
                    pendingRequests[msg.id] = null;
                    pendingRequest.callback(true,pendingRequest.request, msg.data);
                }
            }
        });
        //console.log("sending msg nsdapirequest");
        services[e.detail.url] = {name: e.detail.name, url: e.detail.url,serviceType: e.detail.type, granted: false};
        //TODO: validate name and url correspondance (in particular IP address)
        bgPort.postMessage({type: "nsdapirequest",name: e.detail.name, url: e.detail.url,serviceType: e.detail.type});
        //console.log("sent msg nsdapirequest");
    }

    function sendOK(service) {
        //console.log("sending: "  + JSON.stringify(service));
        var event = new CustomEvent('nsdapicallagreed', {'detail' : service});
        document.dispatchEvent(event);
    }
    function sendKO(service) {
        var event = new CustomEvent('nsdapicallfailed', {'detail' : service});
        document.dispatchEvent(event);
    }
    function sendMessage(request, callback) {
        var service = services[request.service.url];
        if (service != null && service.granted) {
            pendingRequests[idCount] = {request: request, id: idCount, callback: callback};
            bgPort.postMessage({type: 'upnprequest', detail:{id:idCount,call:request}});
            idCount++;
        } 
        else
            callback(false, request);
    }

    var idCount  = 0;
    var pendingRequests = {};


    document.addEventListener("nsdapicallrequest", function (e) {checkAccess(e)});
    document.addEventListener("nsdxhr-req", function (e) {
        //console.log("nsdxhr-req");
        var request = e.detail;
        sendMessage(request, function(status,req,data) {
            var detail;
            if (status) {
                detail =  {status:status,id: req.id, data:data};
            }
            else {
                console.log("not authorized");
                detail = {status:false,id: req.id, data: "unauthorized"};
            }
            var event = new CustomEvent('nsdxhr-res', {'detail' : detail});
            document.dispatchEvent(event);
        });
    });


    console.log("NSDAPI2 extension loaded");
}
