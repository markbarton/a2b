(function (module) {

    var queryDisplayController = function (a2b, $scope) {

        var vm = this;
        vm.formattedData = a2b.formattedData;
        vm.results = a2b.results;
        //Set watch on service value
        $scope.$watch(function () {
                return a2b.formattedData;
            },
            function (newVal, oldVal) {
                if (newVal) {
                    vm.formattedData = newVal;
                }
            }, true);

        $scope.$watch(function () {
                return a2b.results;
            },
            function (newVal, oldVal) {
                if (newVal) {
                    vm.results = newVal;
                }else{
                    vm.results =""
                }
            }, true);

    };

    module.controller("queryDisplayController", queryDisplayController);

}(angular.module("a2b")));