(function() {

    //common is the module used for services
    var app = angular.module("a2b", ['es-services','kb-services','superfacts-services','wj','angular-loading-bar','ui.bootstrap']);

    app.filter('unsafe', function($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    })

    app.filter('titlecase', function() {
        return function(s) {
            s = ( s === undefined || s === null ) ? '' : s;
            return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
                return ch.toUpperCase();
            });
        };
    });
}());