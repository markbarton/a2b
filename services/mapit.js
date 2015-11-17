(function(){

    'use strict';
    angular
        .module('es-services',[])
        .service('mapit', mapit);

    function mapit($http,GENERAL_CONFIG) {

        var client = new elasticsearch.Client({
            host: GENERAL_CONFIG.ELASTIC_SEARCH
        });

        return {
            getLocations:getLocations
        }


        function getLocations(value){
            var self=this
            var args=[]
            args[0]={query_string: {"default_field": "title", "query": value + '*', "default_operator": "and"}}
            return client.search({
                index: 'mapitindex',
                size: 1000,
                body: {
                    query: {
                        bool: {
                            must: args
                        }
                    }
                }

            }).then(function (res){
                  var addresses = [];
                angular.forEach(res.hits.hits, function (item) {
                    if (item._source.type == 'city code') {
                        item._source.autoTitle='<span class="generalImage"></span> '+ item._source.title
                        item._source.type = 'City Code'


                    } else if (item._source.type == 'rail') {
                            item._source.autoTitle='<span class="generalImage"></span> '+ item._source.title
                            item._source.type = 'Rail Station'
                    } else if (item._source.type == 'featured' || item._source.type == 'hotel') {
                            item._source.autoTitle='<span class="hotelImage"></span> '+ item._source.title
                            item._source.type = 'Hotel'
                    } else if (item._source.type == 'cruise port') {
                            item._source.autoTitle='<span class="cruiseImage"></span> '+ item._source.title
                            item._source.type = 'Cruise Port'
                    } else if (item._source.type == 'carhire') {
                        item._source.type = 'Car Hire Depot'
                            item._source.autoTitle='<span class="generalImage"></span> '+ item._source.title

                        } else {
                        item._source.type = toTitleCase(item._source.type);
                            item._source.autoTitle='<span class="generalImage"></span> '+ item._source.title
                        }
                addresses.push(item._source);
                });
                return addresses;
            });

        }

        function toTitleCase(str) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }

    }

})();