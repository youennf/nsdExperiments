var ServiceEvent = function(evt) {

    var self = this;

    this.contentHandler = new DefaultHandler2();

    this.ContainerUpdateIDs = "";
    this.SystemUpdateID = "";
     
    this.contentHandler.startElement = function(namespaceURI, localName, qName, atts) {
        if (localName == "ContainerUpdateIDs") {
            self.contentHandler.characters = function(ch, start, length) {
                self.ContainerUpdateIDs = ch;
            }
        } else if (localName == "SystemUpdateID") {
            self.contentHandler.characters = function(ch, start, length) {
                self.SystemUpdateID = ch;
            }
        }

    }

    this.contentHandler.endElement = function(ch, start, length) {
        self.contentHandler.characters = DefaultHandler2.prototype.characters;
    }

	this.saxParser = XMLReaderFactory.createXMLReader();

	this.saxParser.setHandler(this.contentHandler);
	this.saxParser.parseString(evt);
}

