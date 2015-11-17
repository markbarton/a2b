(function (module) {

    var completeController = function (GENERAL_CONFIG,booking,a2b,$rootScope) {

        var vm = this;

        vm.completeBooking='';

        //Reset everything
        vm.cancel=function(){
            a2b.reserveResults="";
            a2b.formattedData="";
            a2b.results="";
            vm.selectedBooking="";
            a2b.confirmedBookingReference="";
            $rootScope.$broadcast('stage-complete',{stage:'booking'});

        }

        //Send Booking Information to Superfacts
        vm.sendToSuperfacts=function(){

            //Need content to send to Superfacts
            vm.formattedData = {}
            vm.formattedData.depDate=a2b.formattedData.ArrDate;
            vm.formattedData.depTime=a2b.formattedData.ArrTime;
            vm.formattedData.retDate=a2b.formattedData.RetDate;
            vm.formattedData.retTime=a2b.formattedData.RetTime;
            vm.formattedData.from=a2b.formattedData.DepLocation.title;
            vm.formattedData.to=a2b.formattedData.RetLocation.title;
            vm.formattedData.sectorType=a2b.formattedData.SectorTypeDisplay;
            vm.formattedData.transportType=a2b.selectedCar.car;
            vm.formattedData.reference=vm.completeBooking[0].VoucherInfo[0].BookingRef[0];
            vm.formattedData.cost=a2b.reserveResults[0].HolidayValue[0]
            vm.user=GENERAL_CONFIG.CURRENT_USER


            booking.postSuperfacts(vm.formattedData).then(function (success){

                var location=success.headers().location;
                if(location!=undefined){
                    unids=location.split("/")
                    unid=unids[unids.length-1]
                }

                //Now call the Agent to process it - passing the UNID as the arguement
                booking.agentSuperfacts(unid).then(function(success){
                    console.log(success)
                    //$alert({title: 'Posted to Superfacts', content: 'The contents have now been posted to Superfacts!', placement: 'top', type: 'success', show: true,duration:6,keyboard:true});
                })
            })
        }


        vm.book=function(){
            //Need to prepare data to send to booking;
            vm.formattedData = {}
            vm.formattedData.TransacNo=a2b.reserveResults[0].TransacNo[0];
            vm.formattedData.PropertyName=a2b.formattedData.RetLocation.title;
            vm.formattedData.AccommodationAddress=a2b.formattedData.RetLocation.title;
            vm.formattedData.DepPoint=a2b.formattedData.DeparturePointCode;
            vm.formattedData.RetPoint=a2b.formattedData.ArrivalPointCode;
            vm.formattedData.DepInfo=vm.DepInfo;
            vm.formattedData.RetInfo=vm.RetInfo;
            vm.formattedData.Remark=vm.Remark;
            vm.formattedData.LastName=booking.superfactsBookingInfo.lead_surname;
            vm.formattedData.FirstName=booking.superfactsBookingInfo.lead_firtsname;
            vm.formattedData.Title=booking.superfactsBookingInfo.title;


            a2b.book(vm.formattedData).then(function (results) {
                vm.completeBooking=results;
                //Get Booking Reference to Update Local Booking
                var confirmedBookingReference=results[0].VoucherInfo[0].BookingRef[0]
                var bookingStatus=results[0].VoucherInfo[0].BookingStatus[0]

                //If confirmed then update the local booking with status + confirmed booking reference + the rest of it
                vm.formattedData = {}
                vm.formattedData.confirmedBookingReference=confirmedBookingReference;
                vm.formattedData.status=bookingStatus;
                vm.formattedData.confirmedBooking=JSON.stringify(results[0]);
                vm.formattedData.confirmedBy="Test User";
                vm.formattedData.confirmedDate=moment().format("D/M/YYYY h:mm:ss a")

                booking.updateBooking(vm.formattedData,a2b.reserveResults[0].TransacNo[0]).then(function(results){
                    console.log(results)
                })

            })

        }

        function postSuperfacts(){
            SuperFactsFactory.postSuperfacts({'user':GENERAL_CONFIG.CURRENT_USER,'content':limo.superfactsProcessed}).then(function (success){

                var location=success.headers().location;
                if(location!=undefined){
                    unids=location.split("/")
                    unid=unids[unids.length-1]
                }

                //Now call the Agent to process it - passing the UNID as the arguement
                SuperFactsFactory.agentSuperfacts(unid).then(function(success){
                    $alert({title: 'Posted to Superfacts', content: 'The contents have now been posted to Superfacts!', placement: 'top', type: 'success', show: true,duration:6,keyboard:true});
                })
            })
        }


        //helper function to make sure text content is not greater than 72 chars in length
        function prepareSuperfactsContent(content){
            //Loop over every charcter of the superfacts editable content when char count = 72 then add a new line.
            var processedOutput=""

            var splitNewLines = content.split("\n");

            //Loop over
            for(var k=0;k<splitNewLines.length;k++){
                //Check line length
                var counter=1

                if(splitNewLines[k].length>72){
                    //Need to break down into 72 chars
                    for(var i=1;i<=splitNewLines[k].length;i++){
                        if(counter==72){
                            counter=1;
                            processedOutput+="\n"
                        }
                        if(counter==1){
                            //Check for space at begining of the line
                            var checkChar=right(left(splitNewLines[k],i),1)
                            if(checkChar==' '){
                                i+=1
                            }
                        }
                        processedOutput+=right(left(splitNewLines[k],i),1)
                        counter+=1;
                    }
                    processedOutput+="\n"

                }else{
                    processedOutput+=splitNewLines[k]+"\n"
                }
            }

            //Now remove any non ASCII Chars

            var filteredOutput='';
            for(i=1;i<=processedOutput.length;i++) {
                var checkChar = right(left(processedOutput, i), 1)
                var ch = checkChar.charCodeAt(0);
                if (ch>31 && ch<127) {
                    if (ch != 91 && ch != 58) {
                        filteredOutput += checkChar
                    }
                }
                if (ch == 13 || ch == 10) {
                    filteredOutput += checkChar
                }
            }

            return filteredOutput;
        }

        function left(str, n){
            if (n <= 0)
                return "";
            else if (n > String(str).length)
                return str;
            else
                return String(str).substring(0,n);
        }
        function right(str, n){
            if (n <= 0)
                return "";
            else if (n > String(str).length)
                return str;
            else {
                var iLen = String(str).length;
                return String(str).substring(iLen, iLen - n);
            }
        }


};

    module.controller("completeController", completeController);

}(angular.module("a2b")));