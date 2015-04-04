var shopping = angular.module('shopping');
shopping.filter('findByName', function(){
    return function(inputArray, name){
        for(var i = 0;i<inputArray.length; i++){
            if(inputArray[i].name == name){
                return inputArray[i];
            }
        }
        return null;
    }
})