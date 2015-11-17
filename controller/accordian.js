(function (module) {

    var accordionController = function ($scope,booking) {
        $scope.currentPanel={};
        $scope.currentPanel.booking=true


        $scope.bookingInfo = booking.bookingInfo;

        //Set watch on service value
        $scope.$watch(function () {
                return booking.bookingInfo;
            },
            function (newVal, oldVal) {
                if (newVal) {
                    $scope.bookingInfo = newVal;
                }
            }, true);

        $scope.$on('stage-complete', function(event, args) {
            $scope.currentPanel[args.stage]=true;

        });

    };

    module.controller("accordionController", accordionController);

}(angular.module("a2b")));