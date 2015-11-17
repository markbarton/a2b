(function (module) {

    var queryController = function (GENERAL_CONFIG, mapit, a2b, booking, $scope) {

        var vm = this;
        vm.quote = {};
        vm.quote.booking = {};
        //Defaults
        vm.quote.SectorType = 'oneway';
        vm.quote.DepTime = '09:00'
        vm.quote.RetTime = '09:00'
        vm.quote.DepDate = moment().add(3, 'days').toDate();
        vm.quote.RetDate = moment().add(10, 'days').toDate();
        vm.quote.Adults = '2';
        vm.quote.Children = '0';
        vm.quote.Infants = '0';
        vm.haveDepCode = false;
        vm.haveRetCode = false;
        var cache = {};


        vm.bookingInfo = booking.superfactsBookingInfo;

        //Set watch on service value
        $scope.$watch(function () {
                return booking.superfactsBookingInfo;
            },
            function (newVal, oldVal) {
                if (newVal) {
                    vm.bookingInfo = newVal;
                }
            }, true);

        //Watch Departure
        $scope.$watch(function () {
            return vm.quote.DepLocation
        }, function (newVal, oldVal) {
            if (vm.quote.DepLocation) {
                if (vm.quote.DepLocation.code) {
                    vm.haveDepCode = true;
                } else {
                    vm.haveDepCode = false;
                }
            }
        })

        $scope.$watch(function () {
            return vm.quote.RetLocation
        }, function (newVal, oldVal) {
            if (vm.quote.RetLocation) {
                if (vm.quote.RetLocation.code) {
                    vm.haveRetCode = true;
                } else {
                    vm.haveRetCode = false;
                }
            }

        })

        //FindIT TypeAheads
        vm.getLocationInformation = function (query, max, callback) {
            // try getting the result from the cache
            var result = cache[query];
            if (result) {
                callback(result);
                return;
            }

            //Display loading symbol
            mapit.getLocations(query).then(function (results) {
                    // store result in cache
                    cache[query] = results;
                    // and return the result
                    callback(results);
                },
                function (error) {
                    console.log('error: ' + error.responseText);
                    cache[query] = null; // << no point in trying this query again
                    callback(null);
                }
            )
        }

        //Get Quote
        vm.getQuote = function () {
            vm.quote.error = "";
            vm.formattedData = {};
            //Set the stuff we know
            vm.formattedData.SectorType = vm.quote.SectorType;
            vm.formattedData.Adults = vm.quote.Adults;
            vm.formattedData.Children = vm.quote.Children;
            vm.formattedData.Infants = vm.quote.Infants;
            vm.formattedData.ArrDate = moment(vm.quote.DepDate).format("D/M/YYYY")
            vm.formattedData.ArrTime = moment(vm.quote.DepTime).format('HH:mm');
            vm.formattedData.RetDate = moment(vm.quote.RetDate).format("D/M/YYYY")
            vm.formattedData.RetTime = moment(vm.quote.RetTime).format('HH:mm');
            vm.formattedData.DepLocation = vm.quote.DepLocation;
            vm.formattedData.RetLocation = vm.quote.RetLocation;

            if (vm.formattedData.SectorType == 'return') {
                vm.formattedData.SectorTypeDisplay = 'Return'
            } else {
                vm.formattedData.SectorTypeDisplay = 'One Way'
                vm.formattedData.RetDate = '';
                vm.formattedData.RetTime = '';
            }


            //If we dont havea code in object one we MUST have one in object two. So we get it and set it.
            if (vm.quote.DepLocation.code && vm.quote.RetLocation.code) {
                console.log('1')
                vm.formattedData.ArrivalPointCode = vm.quote.RetLocation.code;
                vm.formattedData.DeparturePointCode = vm.quote.DepLocation.code;
                vm.formattedData.Latitude = '';
                vm.formattedData.Longitude = '';
            } else if (vm.quote.DepLocation.code) {
                console.log('2')
                vm.formattedData.DeparturePointCode = vm.quote.DepLocation.code;
                vm.formattedData.ArrivalPointCode = '';
                vm.formattedData.Latitude = vm.quote.RetLocation.geolocation.split(', ')[0];
                vm.formattedData.Longitude = vm.quote.RetLocation.geolocation.split(', ')[1];
            } else if (vm.quote.RetLocation.code) {
                console.log('3')
                vm.formattedData.ArrivalPointCode = vm.quote.RetLocation.code;
                vm.formattedData.DeparturePointCode = '';
                vm.formattedData.Latitude = vm.quote.DepLocation.geolocation.split(', ')[0];
                vm.formattedData.Longitude = vm.quote.DepLocation.geolocation.split(', ')[1];
            }
            a2b.getQuote(vm.formattedData).then(function (results) {
                vm.quote.results = results
            }, function (error) {
                vm.quote.error = error.data;
            })
        }


        vm.returnCarImage = function (code) {
            console.log(code);
            //PRI2 = Private Transfer 1 -2
            //PRI3 = Private Transfer 1 -3
            //MB2-10 = Private Minibus 2 - 10
            //EXEC = Excutive Transfer

            if (code === 'PRI2') {
                return 'images/private.jpg'
            }
        }


    };

    module.controller("queryController", queryController);

}(angular.module("a2b")));