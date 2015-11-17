(function (module) {

    var resultController = function (GENERAL_CONFIG, mapit, a2b, booking, $scope,$rootScope) {

        var vm = this;
        vm.results = a2b.results;


        //Set watch on service value
        $scope.$watch(function () {
                return a2b.results;
            },
            function (newVal, oldVal) {
                console.log(newVal,oldVal)
                if (newVal) {
                    vm.results = newVal;
                }else{
                    vm.results =""
                }
            }, true);

       //Reserve Car
        vm.reserve = function (selectedCar) {
            selectedCar.selected=true;
            a2b.reserve(selectedCar).then(function (results) {
                //We have a reservation - if this a new booking then we can save it
                var _data={};
                _data.bookno=booking.superfactsBookingInfo.bookno;
                _data.bookingName= booking.superfactsBookingInfo.lead_title + " " + booking.superfactsBookingInfo.lead_firstname + " " + booking.superfactsBookingInfo.lead_surname
                _data.sectorType=a2b.formattedData.SectorType;
                _data.arrDate=a2b.formattedData.ArrDate;
                _data.arrTime=a2b.formattedData.ArrTime;
                _data.retDate=a2b.formattedData.RetDate;
                _data.retTime=a2b.formattedData.RetTime;
               _data.adults=a2b.formattedData.Adults;
                _data.children=a2b.formattedData.Children;
                _data.infants=a2b.formattedData.Infants;
                _data.depLocation=JSON.stringify(a2b.formattedData.DepLocation);
                _data.retLocation=JSON.stringify(a2b.formattedData.RetLocation);
                _data.reserve=JSON.stringify(results);
                _data.reserveCode=results[0].TransacNo[0]
                _data.formattedData=JSON.stringify(a2b.formattedData);
                _data.selectedCar = JSON.stringify(selectedCar);
                _data.quote= JSON.stringify(a2b.results);
                _data.status='reserved'
                booking.createBooking(_data);
                $rootScope.$broadcast('stage-complete',{stage:'complete'})
            })
        }

    };

    module.controller("resultController", resultController);

}(angular.module("a2b")));