nsdExperiments
==============

Experiments on interacting with local services through browser extensions (Chrome currently).
Discovery of local services expected to happen through http://www.w3.org/TR/discovery-api/.

These extensions are for experimental purposes only and should not be used as is for any other purpose.

Currently, two chrome modules can be found in nsd-extension1 and nsd-extension2 that allow interacting with UPnP ContentDirectory (v1) services.
Both extensions require user granting before starting to exchange any message with a given service.
- nsd-extension1 validates HTTP requests generated by web applications before sending them using XMLHTTPRequest
- nsd-extension2 receives higher-level function calls from web applications. The extension generates the related HTTP request and sends it.

nsd-extension1 validates HTTP requests content using JavaScript xmllint (http://syssgx.github.io/xml.js/) and UPnP provided schemas.
Additional checking may be done using XSLT or specific purpose code.

nsd-extension2 generates HTTP requests using the JavaScript ohnet library (https://github.com/openhome/ohNet/)


To test these extensions:
- install nsd-extension1 and/or nsd-exteniosn2 as unpacked extensions using Chrome
- launch a chrome tab on demo/demo-nsd-extension1.html and/or demo/demo-nsd-extension2.html

Since no SSDP discovery happens, the text input can be used to set the control URL of the targeted web service.
Otherwise, the user granting process will work but probably not the actual interaction with the service.
