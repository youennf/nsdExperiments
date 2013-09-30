function getReadableFileSizeString(fileSizeInBytes) {

    var i = -1;
    var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
}


function displayMetadata(node) {
	// Success callback for network service discovery
	var metadataHTML = "<table style='border: 1px #000000 solid; border-collapse: collapse;'>\n";
	
	metadataHTML+= "<tr>\n";
	metadataHTML+= "<td style='border-bottom: 1px #000000 solid; padding: 5px; width: 700px;'>\n";
	metadataHTML+= "<p><b>Metadata #" + node.title + "</b>\n";
	metadataHTML+= "<ul>\n";
	if (node.url)               metadataHTML+= "<li><b>url             :</b> " + node.url + "</li>\n";
	if (node.description)       metadataHTML+= "<li><b>description     :</b> " + node.description + "</li>\n";
	if (node.size)              metadataHTML+= "<li><b>size            :</b> " + getReadableFileSizeString(node.size) + "</li>\n";
	if (node.protocolInfo)      metadataHTML+= "<li><b>protocolInfo    :</b> " + node.protocolInfo + "</li>\n";
	if (node.duration)          metadataHTML+= "<li><b>duration        :</b> " + node.duration + "</li>\n";
	if (node.bitrate)           metadataHTML+= "<li><b>bitrate         :</b> " + node.bitrate + "</li>\n";
	if (node.sampleFrequency)   metadataHTML+= "<li><b>sampleFrequency :</b> " + node.sampleFrequency + "</li>\n";
	if (node.nrAudioChannels)   metadataHTML+= "<li><b>nrAudioChannels :</b> " + node.nrAudioChannels + "</li>\n";
	if (node.resolution)        metadataHTML+= "<li><b>resolution      :</b> " + node.resolution + "</li>\n";
	if (node.colorDepth)        metadataHTML+= "<li><b>colorDepth      :</b> " + node.colorDepth + "</li>\n";
	metadataHTML+= "</ul>\n";
	metadataHTML+= "</p>\n";
	metadataHTML+= "</td>\n";
	metadataHTML+= "</tr>\n";

	metadataHTML+= "</table>\n";

	document.getElementById('metadata').innerHTML = metadataHTML;
}
