(function (module) {

    var bookingController = function (booking,$rootScope,a2b) {

        var vm = this;

        //Manually display query accordian
        vm.newQuery=function(){
            a2b.reserveResults="";
            a2b.formattedData="";
            a2b.results="";
            vm.selectedBooking="";
            a2b.confirmedBookingReference="";
            $rootScope.$broadcast('stage-complete',{stage:'query'});
        }

        vm.getBooking=function(){
            vm.booking_loading=true;
            vm.bookingError="";
            vm.bookingInfo="";
            booking.getSuperfactsBooking(vm.quote.bookingNumber).then(function(results){
                vm.booking_loading=false;
                if (results.error != "") {
                    //Got an error so report it
                    vm.bookingError=results.error;
                    return
                }
                vm.bookingInfo=results;

                //Now check for any exisiting Bookings
                booking.getBookings(vm.quote.bookingNumber).then(function(results){

                    if(results.length==0){
                        console.log('no bookings');
                        //Got booking display next stage as there are no bookings
                        $rootScope.$broadcast('stage-complete',{stage:'query'});
                    }

                    vm.currentBookings=results;

                })


            },function(error){
                vm.bookingError='A systems error has occurred';
            })
        }

        vm.displayInfo=function(booking){
            a2b.reserveResults=booking.reserve;
            a2b.selectedCar=booking.selectedCar;
            a2b.formattedData=booking.formattedData;
            a2b.results=booking.quote;
            a2b.confirmedBookingReference=booking.confirmedBookingReference;
            vm.selectedBooking=booking._id;
        }

        vm.completeBooking=function(booking){
            a2b.reserveResults=booking.reserve;
            a2b.formattedData=booking.formattedData;
            a2b.selectedCar=booking.selectedCar;
            a2b.results=booking.quote;
            $rootScope.$broadcast('stage-complete',{stage:'complete'});
        }


};

    module.controller("bookingController", bookingController);

}(angular.module("a2b")));