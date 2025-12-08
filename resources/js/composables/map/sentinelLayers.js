const sentinelLayers = (map,layer)=> {


    let that = this;

    //Define OSM as base layer in addition to the default Google layers
    var osmMapType = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            return "http://tile.openstreetmap.org/" +
                zoom + "/" + coord.x + "/" + coord.y + ".png";
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        alt: "OpenStreetMap",
        name: "OSM",
        maxZoom: 19
    });

    //Define custom WMS tiled layer
    var SHLayer = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
            var proj = map.getProjection();
            var zfactor = Math.pow(2, zoom);
            // get Long Lat coordinates
            var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 512 / zfactor, coord.y * 512 / zfactor));
            var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 512 / zfactor, (coord.y + 1) * 512 / zfactor));

            //create the Bounding box string
            var bbox = (top.lng()) + "," +
                (bot.lat()) + "," +
                (bot.lng()) + "," +
                (top.lat());

            //base WMS URL
            var url = "https://services.sentinel-hub.com/ogc/wms/c2c37907-add0-45b6-8014-8675e7e19736";
            url += "?REQUEST=GetMap"; //WMS operation
            url += "&SERVICE=WMS";    //WMS service
            url += "&VERSION=1.1.1";  //WMS version
            url += "&LAYERS="+layer; //WMS layers NDVI,4_AGRICULTURE,6_MOISTURE_INDEX
            url += "&FORMAT=image/jpg"; //WMS format
            url += "&SRS=EPSG:4326";     //set WGS84
            url += "&BBOX=" + bbox;      // set bounding box
            url += "&WIDTH=512";         //tile size in google
            url += "&HEIGHT=512";


            return url;                 // return URL for the tile

        },
        tileSize: new google.maps.Size(512, 512)
    });
    map.mapTypes.set('OSM', osmMapType);
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    //add WMS layer
    map.overlayMapTypes.push(SHLayer);

}
export default sentinelLayers
