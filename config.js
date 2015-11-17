/**
 * Created by Mark on 08/01/2015.
 */

var config_module = angular.module('a2b');
var config_data = {
    'GENERAL_CONFIG': {
       'VIEWTRAIL_API_URL': 'https://secure.trailfinders.com', //KB API Server
      // 'LOCAL_KB_API_URL': 'http://localhost:8444', //KB API Server - running local - need 2 version because of a2b ip lock
       'LOCAL_KB_API_URL': 'http://bromo.trailfinders.com:8444', //KB API Server - running local - need 2 version because of a2b ip lock
       'KB_API_URL': 'http://bromo.trailfinders.com:8444', //KB API Server
       'ELASTIC_SEARCH': '57.202.130.126:9200', //ES
        'INTRANET_URL': 'http://intranet.trailfinders.com'

    }
}

angular.forEach(config_data,function(key,value) {
    config_module.constant(value,key);
})

//Depending on the Referer set the Symbol and the name & telephone number & domain
function setSiteSpecific(){
    var hostname=window.location.hostname;
    var elements=hostname.toLowerCase().split(".");

    if(elements[elements.length-1]!=='com'){
        return({'symbol':'\u20AC','name':'EUR','telephone':'01 702 9102','domain':'ie'});
    }else{
        return({'symbol':'\u00A3','name':'GBP','telephone':'020 7408 9003','domain':'com'});
    }
}