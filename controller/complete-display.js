(function (module) {

    var completeDisplayController = function (booking,$scope,a2b) {

        var vm = this;
        vm.bookingInfo = booking.superfactsBookingInfo;
        vm.selectedCar = a2b.selectedCar;
        vm.reserveResults = a2b.reserveResults;
        vm.formattedData = a2b.formattedData;
        vm.confirmedBookingReference=a2b.confirmedBookingReference

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

        $scope.$watch(function () {
                return a2b.confirmedBookingReference;
            },
            function (newVal, oldVal) {
                if (newVal) {
                    vm.confirmedBookingReference = newVal;
                }else{
                    vm.confirmedBookingReference =""
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


    module.controller("completeDisplayController", completeDisplayController);

}(angular.module("a2b")));