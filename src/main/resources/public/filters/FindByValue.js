var shopping = angular.module('shopping');
shopping.filter('findByValue', function(){
    return function(inputArray, key, value){
        var result = [];
        for(var i = 0;i<inputArray.length; i++){
            if(inputArray[i][key] == value){
                result.push(inputArray[i]);
            }
        }
        return result;
    }
});

shopping.filter('findByValueInverse', function(){
    return function(inputArray, key, value){
        var result = [];
        for(var i = 0;i<inputArray.length; i++){
            if(inputArray[i][key] != value){
                result.push(inputArray[i]);
            }
        }
        return result;
    }
});