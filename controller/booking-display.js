(function (module) {

    var bookingDisplayController = function (booking,$scope) {

        var vm = this;
        vm.bookingInfo = booking.superfactsBookingInfo;

        //Set watch on service value
        $scope.$watch(function () {
                return booking.superfactsBookingInfo;
            },
            function (newVal, oldVal) {
                if (newVal) {
                    vm.bookingInfo = newVal;
                }else{
                    vm.bookingInfo ="";
                }
            }, true);

};

    module.controller("bookingDisplayController", bookingDisplayController);

}(angular.module("a2b")));