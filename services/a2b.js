(function () {

    'use strict';
    angular
        .module('kb-services', [])
        .service('a2b', a2b);

    function a2b($http, GENERAL_CONFIG,$rootScope) {
        var formattedData;
        /**
        var formattedData={}; //Data passed to service for query
        var results={}; //results from query
        var selectedCar={}; //The selected car to reserve
        var completeBooking={};//The reserved object
         bookingResults
**/
        return {
            getQuote: getQuote,
            reserve:reserve,
            book:book
        }

        function reserve(selectedCar){
            var self=this;
            self.selectedCar=selectedCar;

            var reserveObj=self.formattedData;
            reserveObj.TransferCode=selectedCar.transfercode;

            return $http({
                method: "POST",
                url: GENERAL_CONFIG.KB_API_URL + "/api/a2b/reserve",
                data: reserveObj
            }).then(function (results) {
                self.reserveResults=results.data[0];
                 return results.data[0]
            })
        }

        function book(_data){
            var self=this;
            return $http({
                method: "POST",
                url: GENERAL_CONFIG.LOCAL_KB_API_URL + "/api/a2b/book",
                data: _data
            }).then(function (results) {
                self.completeBooking=results.data[0];
                 return results.data[0]
            })
        }

        function getQuote(_data) {
            var self=this;
            self.formattedData=_data;
            return $http({
                method: "POST",
                url: GENERAL_CONFIG.KB_API_URL + "/api/a2b/quote",
                data: _data
            }).then(function (results) {
                self.results=_.map(results.data[0], extractValues)
                $rootScope.$broadcast('stage-complete',{stage:'results'});
                return self.results
            })
        }

        //PRI2 = Private Transfer 1 -2
        //PRI3 = Private Transfer 1 -3
        //MB2-10 = Private Minibus 2 - 10
        //EXEC = Excutive Transfer

        function extractValues(value) {

            //Set Image
            var carCode=value.VehicleDetails[0].VehicleCode[0];
            var carimage='';
            if(carCode==='PRI2' || carCode==='PRI3'){
                carimage= '/codesource/a2b/images/private.jpg'
            }
            if(carCode==='MB2-10'){
                carimage= '/codesource/a2b/images/minibus.jpg'
            }
            if(carCode==='EXEC2'){
                carimage= '/codesource/a2b/images/private_luxury.jpg'
            }
            if(carCode==='LUX3'){
                carimage= '/codesource/a2b/images/private_luxury.jpg'
            }
            if(carCode==='SHUT1-1'){
                carimage= '/codesource/a2b/images/Shuttles.jpg'
            }

            return {
                'car': value.VehicleDetails[0].Vehicle[0],
                'carimage': carimage,
                'currencyCode': value.CurrencyCode[0],
                'price': value.TransferTotalPrice[0],
                'journeyTime': value.OutboundTransferDetails[0].OutboundJourneyTime[0],
                'departure': value.OutboundTransferDetails[0].OutboundOrigin[0],
                'destination': value.OutboundTransferDetails[0].OutboundDestination[0],
                'bags': value.VehicleDetails[0].NumberOfBags[0],
                'passengers': value.VehicleDetails[0].MinCapacity[0] + '-' + value.VehicleDetails[0].MaxCapacity[0],
                'transfercode': value.TransferCode[0]
            }
        }


    }

})();