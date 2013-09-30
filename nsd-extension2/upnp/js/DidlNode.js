/*
<DIDL-Lite  xmlns:dc="http://purl.org/dc/elements/1.1/" 
            xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" 
            xmlns:dlna="urn:schemas-dlna-org:metadata-1-0/" 
            xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">
    <container  parentID="0" 
                id="Music" 
                childCount="2" 
                restricted="1">
        <dc:title>Music</dc:title>
        <upnp:class>object.container.storageFolder</upnp:class>
        <upnp:storageUsed>-1</upnp:storageUsed>
    </container>
    <container  parentID="0" 
                id="Pictures" 
                childCount="4" 
                restricted="1">
        <dc:title>Pictures</dc:title>
        <upnp:class>object.container.storageFolder</upnp:class>
        <upnp:storageUsed>-1</upnp:storageUsed>
    </container>
    <container  parentID="0" 
                id="Videos" 
                childCount="4" 
                restricted="1">
        <dc:title>Videos</dc:title>
        <upnp:class>object.container.storageFolder</upnp:class>
        <upnp:storageUsed>-1</upnp:storageUsed>
    </container>
  </DIDL-Lite>
*/

var DidlNode = function(contentDirectoryIndex, xDidl, callback) {

    var self = this;

    this.contentHandler = new DefaultHandler2();

    this.index = contentDirectoryIndex;
    this.url = undefined;
    this.rawDidl = xDidl;
    this.callback = callback;

    this.nodes = new Array();
    
    //console.log("xDidl" + xDidl);

    this.contentHandler.startElement = function(namespaceURI, localName, qName, atts) {
        if ( (localName == "container") || (localName == "item") )  {
            for (var i = 0 ; i < atts.getLength() ; i++)
                if (atts.getLocalName(i) == "id") {
                    self.currentEntry = new Entry(self.index, atts.getValue(i), self.rawDidl);
                    self.nodes[self.nodes.length] = self.currentEntry;
                    self.callback(atts.getValue(i), self.currentEntry);
                } 
        } else if (localName == "title") {
            self.contentHandler.characters = function(ch, start, length) {
                self.currentEntry.setTitle(ch);
            }
        } else if (localName == "class") {
            self.contentHandler.characters = function(ch, start, length) {
                //console.log(">>> class : " + ch);
                if ( (ch == "object.container.storageFolder") ||
                     (ch == "object.container.album") ||
                     (ch == "object.container.album.musicAlbum") ||
                     (ch == "object.container.album.photoAlbum") )
                    self.currentEntry.setType("container");
                else if (ch == "object.item.videoItem")
                    self.currentEntry.setType("video_item");
                else if (ch == "object.item.audioItem.musicTrack")
                    self.currentEntry.setType("audio_item");
                else if ( (ch == "object.item.imageItem.photo") ||
                          (ch == "object.item.imageItem") )
                    self.currentEntry.setType("image_item");
            }
        } else if (localName == "res") {
            if (self.currentEntry.url == undefined) {
                self.contentHandler.characters = function(ch, start, length) {
                    self.currentEntry.setUrl(ch);
                }
            }
            for (var i = 0 ; i < atts.getLength() ; i++) {
                var prop = atts.getLocalName(i);
                if (prop == "size") self.currentEntry.size = atts.getValue(i);
                else if (prop == "protocolInfo") self.currentEntry.protocolInfo = atts.getValue(i); 
                else if (prop == "duration") self.currentEntry.duration = atts.getValue(i); 
                else if (prop == "bitrate") self.currentEntry.bitrate = atts.getValue(i); 
                else if (prop == "sampleFrequency") self.currentEntry.sampleFrequency = atts.getValue(i); 
                else if (prop == "nrAudioChannels") self.currentEntry.nrAudioChannels = atts.getValue(i); 
                else if (prop == "resolution") self.currentEntry.resolution = atts.getValue(i); 
                else if (prop == "colorDepth") self.currentEntry.colorDepth = atts.getValue(i); 
            }
        }

    }

    this.contentHandler.endElement = function(ch, start, length) {
        self.contentHandler.characters = DefaultHandler2.prototype.characters;
    }

	this.saxParser = XMLReaderFactory.createXMLReader();

	this.saxParser.setHandler(this.contentHandler);
	this.saxParser.parseString(xDidl);
}

DidlNode.prototype.getNodes = function() {
    return this.nodes;
}

// Entry definition
var Entry = function(contentDirectoryIndex, id, didl) {
    this.index = contentDirectoryIndex;
    this.id = id;
    this.didl = didl;
}

Entry.prototype.setType = function(type) {
    this.type = type;
}

Entry.prototype.setTitle = function(title) {
    this.title = title;
}

Entry.prototype.setUrl = function(url) {
    this.url = url;
}

Entry.prototype.getId = function() {
    return this.id;
}

Entry.prototype.getTitle = function() {
    return this.title;
}

Entry.prototype.toJSON = function() {
    return {    data  : this.title, 
                attr  : {   id      : this.id, 
                            rel     : this.type, 
                            index   : this.index,
                            didl    : this.didl,
                            
                            // item Metadata
                            url             : this.url,
                            size            : this.size, 
                            protocolInfo    : this.protocolInfo,
                            duration        : this.duration,
                            bitrate         : this.bitrate,
                            sampleFrequency : this.sampleFrequency,
                            nrAudioChannels : this.nrAudioChannels,
                            resolution      : this.resolution,
                            colorDepth      : this.colorDepth 
                        },
                state : "closed"
                };
}
