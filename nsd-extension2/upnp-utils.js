function createContentDirectory(service) {

    var contentDirectory;
    
    var version = service.type.split(':')[5];
    
    if (version == 1)
        contentDirectory = new CpProxySchemasUpnpOrgContentDirectory1(service.url);
    else if (version == 2)
        contentDirectory = new CpProxySchemasUpnpOrgContentDirectory2(service.url);
    else if (version == 3)
        contentDirectory = new CpProxySchemasUpnpOrgContentDirectory3(service.url);

    return contentDirectory;
}

function createAVTransport(service) {

    var avTransport;
    var version = service.type.split(':')[5];

    if (version == 1)
        avTransport = new CpProxySchemasUpnpOrgAVTransport1(service.url);
    else if (version == 2)
        avTransport = new CpProxySchemasUpnpOrgAVTransport2(service.url);

    return avTransport;
}

function browseEntry(contentDirectories, index, id, callback) {
    var contentDir = contentDirectories[index];

    //console.log("BrowseDirectChildren: " + id);
//    contentDir.Browse(id, "BrowseDirectChildren", "*", "0", "10", "+dc:title",
    contentDir.Browse(id, "BrowseDirectChildren", "@childCount", "0", "0", "+dc:title",
        function(msg) {
            var idx;
            //console.log("URL : " + contentDir.url);
            //console.log("[NumberReturned] : " + msg["NumberReturned"]);
            //console.log("[TotalMatches]   : " + msg["TotalMatches"]);
            //console.log("[UpdateID]       : " + msg["UpdateID"]);
                                           
            for (var idx = 0; idx < contentDirectories.length; idx++) 
                if (contentDir == contentDirectories[idx])
                    break;                            
            var nodes = parseDIDL(idx, msg["Result"]);
    
            callback(nodes);
        },
        function(errorMsg, msg) {
            console.log("ERROR : Browse failed :" + errorMsg);
        });
}

function browseMetadata(contentDirectories, index, id, callback) {
    var contentDir = contentDirectories[index];

    //console.log("BrowseMetadata: " + id);
    contentDir.Browse(id, "BrowseMetadata", "*", "0", "0", "+dc:title",
        function(msg) {
            //console.log("URL : " + contentDir.url);
            //console.log("[NumberReturned] : " + msg["NumberReturned"]);
            //console.log("[TotalMatches]   : " + msg["TotalMatches"]);
            //console.log("[UpdateID]       : " + msg["UpdateID"]);
            for (var idx = 0; idx < contentDirectories.length; idx++) 
                if (contentDir == contentDirectories[idx])
                    break;                            
            var node = parseDIDL(idx, msg["Result"]);
            callback(node);
        },
        function(errorMsg, msg) {
            console.log("Browse failed !!!");
        });
}

function parseDIDL(index, xDIDL) {
    var didlNode = new DidlNode(index, xDIDL, addEntry);
    return didlNode.getNodes();
}

function addEntry(key, entry) {
    //allEntries[key] = entry;
}

function getAVTransport() {
    // Get index from list UI
    var indexUI = $('input[name=list-choice]:checked').val();
    return avTransports[indexUI];
}

function play() {
    var avTransport = getAVTransport();
    
    avTransport.SetAVTransportURI(0, selectedNode.url, selectedNode.didl,
        function(msg) {
            //console.log("SetAVTransportURI succeed");
            avTransport.Play(0, "1",
                function(msg) { 
                    //console.log("Play succeed"); 
                }, 
                function(errorMsg, msg) { console.log("Play failed !!!");
            });
        }, 
        function(errorMsg, msg) {
            console.log("SetAVTransportURI failed !!!");
        });
}

function pause() {
    var avTransport = getAVTransport();

    avTransport.Pause(0, 
        function(msg) { 
            //console.log("Pause succeed"); 
        }, 
        function(errorMsg, msg) { console.log("Play failed !!!");
    });
}

function stop() {
    var avTransport = getAVTransport();

    avTransport.Stop(0,
        function(msg) { 
            //console.log("Stop succeed"); 
        }, 
        function(errorMsg, msg) { console.log("Play failed !!!");
    });
}
