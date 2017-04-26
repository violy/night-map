jQuery(document).ready(function($) {

    var map,zoom,
        styles,
        musicStyles,
        clubs = [], clubsJSON,
        zones = [], zonesJSON;

    function loadJsonFiles(){
        $.when(
            $.ajax('json/styles.json',{complete:function(req,status){
                if(status == 'success'){
                    styles = req.responseJSON;
                }
            }}),
            $.ajax('json/clubs.json',{complete:function(req,status){
                if(status == 'success'){
                    clubsJSON = req.responseJSON;
                }
            }}),
            $.ajax('json/music-styles.json',{complete:function(req,status){
                if(status == 'success'){
                    musicStyles = req.responseJSON;
                }
            }}),
            $.ajax('json/zones.json',{complete:function(req,status){
                if(status == 'success'){
                    zonesJSON = req.responseJSON;
                }
            }})
        ).then(function(){
            initMap();
            initZones();
            initClubs();
        })
    }

    function initMap() {
        var parisBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(48.89497, 2.257004),
            new google.maps.LatLng(48.815455, 2.434158)
        );
        map = new google.maps.Map(document.getElementById('map'), {
            //zoom: 12,
            disableDefaultUI: true,
            styles: styles
        });
        map.fitBounds(parisBounds);
        //limitMap(map, parisBounds);
        zoom = map.get('zoom');
        map.addListener('zoom_changed',zoomChanged);
    }

    function initZones() {
        _(zonesJSON.features).each(function(zone){
            console.log(zone);
            var paths = _(zone.geometry.coordinates[0]).map(function(coord){
                    return {lat:coord[1],lng:coord[0]};
                });
            paths.push(paths[0]);
            var polygon = new google.maps.Polygon({
                    map:map,
                    paths: paths,
                    strokeWeight: 0,
                    fillColor: zone.properties.fill,
                    fillOpacity: 0.4,
                    zIndex:200,
            });
            zones.push(polygon);
        });
    }

    function initClubs() {

        var infoWindowTemplate = _("<h5><%= title %></h5><div style='color:<%= color %>'><%= musicStyle %></div>").template();

        _(clubsJSON.features).each(function(club){

            var coord = club.geometry.coordinates,
                clubProperties = club.properties,
                title = clubProperties.title,
                musicStyle = clubProperties['music-style'],
                musicStyleData = _(musicStyles).findWhere({type:musicStyle}),
                position = new google.maps.LatLng(coord[1],coord[0]),
                fillColor = musicStyleData ? musicStyleData.color : '#fff';

            var  marker = new google.maps.Marker({
                position: position,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    strokeWeight:0,
                    fillColor:fillColor,
                    fillOpacity:1,
                    scale:3,
                },
                map: map
            });

            var label = new MapLabel({
                text: title,
                position: position,
                //map: map,
                left:10,
                top:20,
                fontColor:fillColor,
                strokeWeight:0,
                fontSize: 10,
                align: 'left',
                zIndex:100
            });

            clubProperties.color = fillColor;
            clubProperties.musicStyle = clubProperties['music-style'];

            var infoWindow = new google.maps.InfoWindow({
                content: infoWindowTemplate(club.properties)
            });

            marker.addListener('click', function() {
                infoWindow.open(map, marker);
            });

            clubs.push({marker:marker,label:label});
            if(!musicStyleData) console.log(club.properties)

        });
    }

    function zoomChanged(){
        zoom = map.get('zoom');
        _(zones).each(function(polygon){
            polygon.set('fillOpacity',zoom<16 ? 0.4 : 0.2);
        });
        _(clubs).each(function(club){
            if(zoom<14){
                club.label.setMap(null);
            }else{
                club.label.setMap(map);
            }
            //marker.set('icon',{scale:zoom<16 ? 3 : 6});
        });
        console.log(map.get('zoom'));
    }

    loadJsonFiles();

});