(function (module) {

    var reserveDisplayController = function (a2b, $scope) {

       var vm = this;

        vm.selectedCar = a2b.selectedCar;
        vm.reserveResults = a2b.reserveResults;
        vm.formattedData = a2b.formattedData;

        $scope.$watch(function () {
                return a2b.formattedData;
            },
            function (newVal, oldVal) {
                if (newVal) {
                    vm.formattedData = newVal;
                }else{
                    vm.formattedData =""
                }
            }, true);


        //Set watch on service value
        $scope.$watch(function () {
                return a2b.reserveResults;
            },
            function (newVal, oldVal) {
                if (newVal) {
                    vm.reserveResults = newVal;
                }else{
                    vm.reserveResults=""
                }
            }, true);

        $scope.$watch(function () {
                return a2b.selectedCar;
            },
            function (newVal, oldVal) {
                if (newVal) {
                    vm.selectedCar = newVal;
                }else{
                    vm.selectedCar =""
                }
            }, true);

    };

    module.controller("reserveDisplayController", reserveDisplayController);

}(angular.module("a2b")));