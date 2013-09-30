var ServiceConfig = function(config) {

    var self = this;

    this.contentHandler = new DefaultHandler2();

    this.friendlyName = "";
     
    this.contentHandler.startElement = function(namespaceURI, localName, qName, atts) {
        if (localName == "friendlyName") {
            self.contentHandler.characters = function(ch, start, length) {
                self.friendlyName = ch;
            }
        }

    }

    this.contentHandler.endElement = function(ch, start, length) {
        self.contentHandler.characters = DefaultHandler2.prototype.characters;
    }

	this.saxParser = XMLReaderFactory.createXMLReader();

	this.saxParser.setHandler(this.contentHandler);
	this.saxParser.parseString(config);
}

