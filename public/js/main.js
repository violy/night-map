jQuery(document).ready(function($) {

    var map,zoom,
        styles,
        zones = [],zonesJSON;

    function loadJsonFiles(){
        $.when(
            $.ajax('json/styles.json',{complete:function(req,status){
                if(status == 'success'){
                    styles = req.responseJSON;
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
        })
    }

    function initMap() {
        var parisBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(48.89497, 2.257004),
            new google.maps.LatLng(48.815455, 2.434158)
        );
        map = new google.maps.Map(document.getElementById('map'), {
            //zoom: 12,
            styles: styles
        });
        map.fitBounds(parisBounds);
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
                    zIndex:1
            });
            zones.push(polygon);
        });
    }

    function zoomChanged(){
        zoom = map.get('zoom');
        _(zones).each(function(polygon){
            polygon.set('fillOpacity',zoom<16 ? 0.4 : 0.2);
        });
        console.log(map.get('zoom'));
    }

    loadJsonFiles();

});