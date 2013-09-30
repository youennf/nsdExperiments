var request;
var typeTranslation = {};
typeTranslation["upnp-test"] = "Test Service";
typeTranslation["upnp:urn:schemas-upnp-org:service:ContentDirectory:1"] = "UPnP Media Folder";

function getTypeInfo(type) {
    var info = typeTranslation[type];
    return info != null ?info:type;
}

function getServiceName(request) {
    if (request.name) 
        return request.name;
     return request.url;
}

function getDomain(url) {
    var l = document.createElement("a");
    l.href = url;
    return l.hostname;
}

function updateRequest(newRequest) {
    request = newRequest;
    console.log(request);
    document.querySelector('#count').innerText = 
                getServiceName(request) + " (" + getTypeInfo(request.serviceType) + " at "+ getDomain(request.url)+")";
    //validate();
}

var gotAnswer = false;
function validate() {
    if (!gotAnswer) {
        gotAnswer = true;
        console.log("validated");
        chrome.runtime.sendMessage({nsdId: request.nsdId, type:"nsdapigrant"}, function(){});
        window.close();
    }
}

function cancel() {
    if (!gotAnswer) {
        gotAnswer = true;
        console.log("canceled");
        chrome.runtime.sendMessage({nsdId: request.nsdId, type:"nsdapirefused"}, function(){});
        window.close();
    }
}

document.getElementById("validate").addEventListener("click",validate,false);
document.getElementById("refuse").addEventListener("click",cancel,false);
document.addEventListener("beforeunload",cancel);
window.addEventListener("beforeunload",cancel);
document.addEventListener("pagehide",cancel);
window.addEventListener("pagehide",cancel);
window.addEventListener("close",cancel);
document.addEventListener("close",cancel);
window.onunload = cancel;

chrome.runtime.onMessage.addListener(
    function listener(newRequest, sender, sendResponse) {
        console.log("received update");
        if (newRequest.type == "updatensdapirequest" && request.nsdId == newRequest.request.nsdId) {
            updateRequest(newRequest.request);
        }
    }
);

updateRequest(JSON.parse(window.location.hash.substring(1)));