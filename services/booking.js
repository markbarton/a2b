(function () {

    'use strict';
    angular
        .module('superfacts-services', [])
        .service('booking', booking);

    function booking($http, GENERAL_CONFIG, $rootScope) {

        var superfactsBookingInfo; //Superfacts Summary Information
        var bookings; //A2B Bookings - in KB Mongo

        return {
            getSuperfactsBooking: getSuperfactsBooking,
            getBookings: getBookings,
            createBooking: createBooking,
            updateBooking: updateBooking,
            postSuperfacts:postSuperfacts,
            agentSuperfacts:agentSuperfacts
        }

        /***********A2B BOOKINGs ************/

        function createBooking(_data) {
            var self = this;
            return $http({
                method: "POST",
                url: GENERAL_CONFIG.LOCAL_KB_API_URL + "/api/a2b/localbooking",
                data:_data
            }).then(function (results) {
                console.log(results.data)
                return results.data
            })
        }

      function updateBooking(_data,reservationNumber) {
            var self = this;
            return $http({
                method: "PUT",
                url: GENERAL_CONFIG.LOCAL_KB_API_URL + "/api/a2b/localbooking/"+reservationNumber,
                data:_data
            }).then(function (results) {
                console.log(results.data)
                return results.data
            })
        }

        function getBookings(bookingNumber) {
            var self = this;
            return $http({
                method: "GET",
                url: GENERAL_CONFIG.LOCAL_KB_API_URL + "/api/a2b/localbooking/" + bookingNumber
            }).then(function (results) {
                //We need to rebuild nested Objects
                self.bookings = _.map(results.data,rebuildObject);
                console.log(self.bookings);
                return self.bookings
            })
        }

        function rebuildObject(obj){
           if(obj.depLocation){
               obj.depLocation=JSON.parse(obj.depLocation);
           }
            if(obj.retLocation){
                obj.retLocation=JSON.parse(obj.retLocation);
            }
            if(obj.reserve){
                obj.reserve=JSON.parse(obj.reserve);
            }
            if(obj.selectedCar){
                obj.selectedCar = JSON.parse(obj.selectedCar);
            }
            if(obj.quote){
                obj.quote= JSON.parse(obj.quote);
            }
            if(obj.formattedData){
                obj.formattedData= JSON.parse(obj.formattedData);
            }
            return obj
            }


        /*********SUPERFACTS BOOKING ****************/

        //Get Booking By Reference - this will give summary information from SUperfacts
        function getSuperfactsBooking(_bookingNumber) {
            var self = this;
            return $http({
                method: "GET",
                url: GENERAL_CONFIG.VIEWTRAIL_API_URL + "/api/superfacts/booking/" + _bookingNumber
            }).then(function (results) {
                self.superfactsBookingInfo = results.data;

                return results.data
            })
        }

        function getFullSuperfactsBooking(_bookingNumber, _bookingName) {
            return $http({
                method: "POST",
                url: GENERAL_CONFIG.VIEWTRAIL_API_URL + "/api/superfacts/booking",
                data: {"bookingName": _bookingName, "bookingNumber": _bookingNumber}
            }).then(function (results) {
                return results
            })
        }


        function postSuperfacts(bookingData){
            return $http({
                method: 'POST',
                //   url: API_URL + '/api/superfacts/' + bookingNumber+"/"+bookingName+"?flight=true"
                url: GENERAL_CONFIG.INTRANET_URL + '/magic.nsf/api/data/documents?form=ContentToCSV',
                data:bookingData
            });
        }
        function agentSuperfacts(unid){
            return $http({
                method: 'GET',
                //   url: API_URL + '/api/superfacts/' + bookingNumber+"/"+bookingName+"?flight=true"
                url: GENERAL_CONFIG.INTRANET_URL +'/magic.nsf/ProcessContentToCSV?openagent&unid='+unid
                //url: GENERAL_CONFIG.INTRANET_URL + '/magic.nsf/Test?openagent',

            });
        }

    }

})();