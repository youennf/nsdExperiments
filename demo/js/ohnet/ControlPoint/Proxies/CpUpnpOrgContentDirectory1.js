 

/**
* Service Proxy for CpProxySchemasUpnpOrgContentDirectory1
* @module ohnet
* @class ContentDirectory
*/
    
var CpProxySchemasUpnpOrgContentDirectory1 = function(url){ 

    this.url = url;  // upnp control url
    this.domain = "schemas-upnp-org";
    this.type = "ContentDirectory";
    this.version = "1";
    this.serviceName = "upnp.org-ContentDirectory-1";
    this.subscriptionId = "";  // Subscription identifier unique to each Subscription Manager 
    
    // Collection of service properties
    this.serviceProperties = {};
    this.serviceProperties["TransferIDs"] = new ohnet.serviceproperty("TransferIDs","string");
    this.serviceProperties["SystemUpdateID"] = new ohnet.serviceproperty("SystemUpdateID","int");
    this.serviceProperties["ContainerUpdateIDs"] = new ohnet.serviceproperty("ContainerUpdateIDs","string");

                      
}

CpProxySchemasUpnpOrgContentDirectory1.prototype.setAlternateTransport = function (service, alternateTransport) {
    this.service = service;
    this.alternateTransport = alternateTransport;
}

CpProxySchemasUpnpOrgContentDirectory1.prototype.createOhnetSoapRequest = function (functionName) {
    var request = new ohnet.soaprequest(functionName, this.url, this.domain, this.type, this.version);    
    var _this = this;
    if (_this.alternateTransport != null && _this.service != null) {
        request.createAjaxRequest = function (successFunction, errorFunction) {
            _this.alternateTransport(_this.service, "POST", 
                {"SOAPAction": request.getSoapAction(), 'Content-type': 'text/xml'},
                request.envelope, function(response) {
                    if (response.status == 200) {
                        var responseText = response.data;
                        var parser=new DOMParser();
                        var responseXML = parser.parseFromString(response.data,'text/xml');
                        if (successFunction)
                            successFunction({responseXML: responseXML, responseText: responseText});
                    }
                    else {
                        if (errorFunction)
                            errorFunction(request);
                    }
            });
        }
    }
    return request;
}

/**
* Subscribes the service to the subscription manager to listen for property change events
* @method Subscribe
* @param {Function} serviceAddedFunction The function that executes once the subscription is successful
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.subscribe = function (serviceAddedFunction) {
    ohnet.subscriptionmanager.addService(this,serviceAddedFunction);
}


/**
* Unsubscribes the service from the subscription manager to stop listening for property change events
* @method Unsubscribe
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.unsubscribe = function () {
    ohnet.subscriptionmanager.removeService(this.subscriptionId);
}


    

/**
* Adds a listener to handle "TransferIDs" property change events
* @method TransferIDs_Changed
* @param {Function} stateChangedFunction The handler for state changes
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.TransferIDs_Changed = function (stateChangedFunction) {
    this.serviceProperties.TransferIDs.addListener(function (state) 
    { 
        stateChangedFunction(ohnet.soaprequest.readStringParameter(state)); 
    });
}
    

/**
* Adds a listener to handle "SystemUpdateID" property change events
* @method SystemUpdateID_Changed
* @param {Function} stateChangedFunction The handler for state changes
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.SystemUpdateID_Changed = function (stateChangedFunction) {
    this.serviceProperties.SystemUpdateID.addListener(function (state) 
    { 
        stateChangedFunction(ohnet.soaprequest.readIntParameter(state)); 
    });
}
    

/**
* Adds a listener to handle "ContainerUpdateIDs" property change events
* @method ContainerUpdateIDs_Changed
* @param {Function} stateChangedFunction The handler for state changes
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.ContainerUpdateIDs_Changed = function (stateChangedFunction) {
    this.serviceProperties.ContainerUpdateIDs.addListener(function (state) 
    { 
        stateChangedFunction(ohnet.soaprequest.readStringParameter(state)); 
    });
}


/**
* A service action to GetSearchCapabilities
* @method GetSearchCapabilities
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.GetSearchCapabilities = function(successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("GetSearchCapabilities");     
    request.send(function(result){
        result["SearchCaps"] = ohnet.soaprequest.readStringParameter(result["SearchCaps"]); 
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}


/**
* A service action to GetSortCapabilities
* @method GetSortCapabilities
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.GetSortCapabilities = function(successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("GetSortCapabilities");     
    request.send(function(result){
        result["SortCaps"] = ohnet.soaprequest.readStringParameter(result["SortCaps"]); 
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}


/**
* A service action to GetSystemUpdateID
* @method GetSystemUpdateID
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.GetSystemUpdateID = function(successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("GetSystemUpdateID");     
    request.send(function(result){
        result["Id"] = ohnet.soaprequest.readIntParameter(result["Id"]); 
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}


/**
* A service action to Browse
* @method Browse
* @param {String} ObjectID An action parameter
* @param {String} BrowseFlag An action parameter
* @param {String} Filter An action parameter
* @param {Int} StartingIndex An action parameter
* @param {Int} RequestedCount An action parameter
* @param {String} SortCriteria An action parameter
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.Browse = function(ObjectID, BrowseFlag, Filter, StartingIndex, RequestedCount, SortCriteria, successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("Browse");     
    request.writeStringParameter("ObjectID", ObjectID);
    request.writeStringParameter("BrowseFlag", BrowseFlag);
    request.writeStringParameter("Filter", Filter);
    request.writeIntParameter("StartingIndex", StartingIndex);
    request.writeIntParameter("RequestedCount", RequestedCount);
    request.writeStringParameter("SortCriteria", SortCriteria);
    request.send(function(result){
        result["Result"] = ohnet.soaprequest.readStringParameter(result["Result"]); 
        result["NumberReturned"] = ohnet.soaprequest.readIntParameter(result["NumberReturned"]); 
        result["TotalMatches"] = ohnet.soaprequest.readIntParameter(result["TotalMatches"]); 
        result["UpdateID"] = ohnet.soaprequest.readIntParameter(result["UpdateID"]); 
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}


/**
* A service action to Search
* @method Search
* @param {String} ContainerID An action parameter
* @param {String} SearchCriteria An action parameter
* @param {String} Filter An action parameter
* @param {Int} StartingIndex An action parameter
* @param {Int} RequestedCount An action parameter
* @param {String} SortCriteria An action parameter
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.Search = function(ContainerID, SearchCriteria, Filter, StartingIndex, RequestedCount, SortCriteria, successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("Search");     
    request.writeStringParameter("ContainerID", ContainerID);
    request.writeStringParameter("SearchCriteria", SearchCriteria);
    request.writeStringParameter("Filter", Filter);
    request.writeIntParameter("StartingIndex", StartingIndex);
    request.writeIntParameter("RequestedCount", RequestedCount);
    request.writeStringParameter("SortCriteria", SortCriteria);
    request.send(function(result){
        result["Result"] = ohnet.soaprequest.readStringParameter(result["Result"]); 
        result["NumberReturned"] = ohnet.soaprequest.readIntParameter(result["NumberReturned"]); 
        result["TotalMatches"] = ohnet.soaprequest.readIntParameter(result["TotalMatches"]); 
        result["UpdateID"] = ohnet.soaprequest.readIntParameter(result["UpdateID"]); 
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}


/**
* A service action to CreateObject
* @method CreateObject
* @param {String} ContainerID An action parameter
* @param {String} Elements An action parameter
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.CreateObject = function(ContainerID, Elements, successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("CreateObject");     
    request.writeStringParameter("ContainerID", ContainerID);
    request.writeStringParameter("Elements", Elements);
    request.send(function(result){
        result["ObjectID"] = ohnet.soaprequest.readStringParameter(result["ObjectID"]); 
        result["Result"] = ohnet.soaprequest.readStringParameter(result["Result"]); 
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}


/**
* A service action to DestroyObject
* @method DestroyObject
* @param {String} ObjectID An action parameter
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.DestroyObject = function(ObjectID, successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("DestroyObject");     
    request.writeStringParameter("ObjectID", ObjectID);
    request.send(function(result){
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}


/**
* A service action to UpdateObject
* @method UpdateObject
* @param {String} ObjectID An action parameter
* @param {String} CurrentTagValue An action parameter
* @param {String} NewTagValue An action parameter
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.UpdateObject = function(ObjectID, CurrentTagValue, NewTagValue, successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("UpdateObject");     
    request.writeStringParameter("ObjectID", ObjectID);
    request.writeStringParameter("CurrentTagValue", CurrentTagValue);
    request.writeStringParameter("NewTagValue", NewTagValue);
    request.send(function(result){
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}


/**
* A service action to ImportResource
* @method ImportResource
* @param {String} SourceURI An action parameter
* @param {String} DestinationURI An action parameter
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.ImportResource = function(SourceURI, DestinationURI, successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("ImportResource");     
    request.writeStringParameter("SourceURI", SourceURI);
    request.writeStringParameter("DestinationURI", DestinationURI);
    request.send(function(result){
        result["TransferID"] = ohnet.soaprequest.readIntParameter(result["TransferID"]); 
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}


/**
* A service action to ExportResource
* @method ExportResource
* @param {String} SourceURI An action parameter
* @param {String} DestinationURI An action parameter
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.ExportResource = function(SourceURI, DestinationURI, successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("ExportResource");     
    request.writeStringParameter("SourceURI", SourceURI);
    request.writeStringParameter("DestinationURI", DestinationURI);
    request.send(function(result){
        result["TransferID"] = ohnet.soaprequest.readIntParameter(result["TransferID"]); 
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}


/**
* A service action to StopTransferResource
* @method StopTransferResource
* @param {Int} TransferID An action parameter
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.StopTransferResource = function(TransferID, successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("StopTransferResource");     
    request.writeIntParameter("TransferID", TransferID);
    request.send(function(result){
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}


/**
* A service action to GetTransferProgress
* @method GetTransferProgress
* @param {Int} TransferID An action parameter
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.GetTransferProgress = function(TransferID, successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("GetTransferProgress");     
    request.writeIntParameter("TransferID", TransferID);
    request.send(function(result){
        result["TransferStatus"] = ohnet.soaprequest.readStringParameter(result["TransferStatus"]); 
        result["TransferLength"] = ohnet.soaprequest.readStringParameter(result["TransferLength"]); 
        result["TransferTotal"] = ohnet.soaprequest.readStringParameter(result["TransferTotal"]); 
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}


/**
* A service action to DeleteResource
* @method DeleteResource
* @param {String} ResourceURI An action parameter
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.DeleteResource = function(ResourceURI, successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("DeleteResource");     
    request.writeStringParameter("ResourceURI", ResourceURI);
    request.send(function(result){
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}


/**
* A service action to CreateReference
* @method CreateReference
* @param {String} ContainerID An action parameter
* @param {String} ObjectID An action parameter
* @param {Function} successFunction The function that is executed when the action has completed successfully
* @param {Function} errorFunction The function that is executed when the action has cause an error
*/
CpProxySchemasUpnpOrgContentDirectory1.prototype.CreateReference = function(ContainerID, ObjectID, successFunction, errorFunction){ 
    var request = this.createOhnetSoapRequest("CreateReference");     
    request.writeStringParameter("ContainerID", ContainerID);
    request.writeStringParameter("ObjectID", ObjectID);
    request.send(function(result){
        result["NewID"] = ohnet.soaprequest.readStringParameter(result["NewID"]); 
    
        if (successFunction){
            successFunction(result);
        }
    }, function(message, transport) {
        if (errorFunction) {errorFunction(message, transport);}
    });
}



