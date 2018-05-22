/**
* filter function to return values from a selected list
* @param arrMatches
* @param arrExceptions
* @return string
*/
var objChoices = {
  intLastIndex:0,
  intPresentIndex:0,
  objSkipOptions:{},
  arrOptions:[],
  objExceptionButton:false,//hold the exception button object for disabling

  //move the counter
  Increment:function(){
   this.intLastIndex = this.intPresentIndex;
   if((this.intPresentIndex+1) < this.arrOptions.length)
    this.intPresentIndex++;
   else
    this.intPresentIndex = 0;
   return true;
  },

  //normalize our skip options
  NormalizeSkips:function(objSkipTimes){
   for(i in objSkipTimes){
    if(this.objSkipOptions.hasOwnProperty(i))
     this.objSkipOptions[i] += objSkipTimes[i];
    else
      this.objSkipOptions[i] = objSkipTimes[i];
   }
    return true;
  },

  //decrement our skip options
  DecrementSkips:function(){
   var strOptionName = this.arrOptions[this.intPresentIndex];
   //check our skip options for our present index
   if(this.objSkipOptions.hasOwnProperty(this.arrOptions[this.intPresentIndex])){
     this.objSkipOptions[strOptionName]--;
     if(this.objSkipOptions[strOptionName] < 1){
      //remove this index from our skip array
      delete this.objSkipOptions[strOptionName];
     }
     //move our counter
     this.Increment();
   }
   return true;
  },

  //get the next choice
  GetNext:function(){
    //make sure we're loaded
    if(!Array.isArray(this.arrOptions) || this.arrOptions.length === 0){
     console.log('No options loaded at this time');
     return false;
    }
    //check for skipped values
    this.DecrementSkips();
    //load our return value
    var varChosenOption = this.arrOptions[this.intPresentIndex];
    //establish our next pointer
    this.Increment();
    //return our available option
    return 'Chosen Option '+varChosenOption;
  },

  //load our parameters to be iterated through
  LoadOptions:function(arrOptions,arrSkipTimes){
    //load this data set locally to avoid a required parameter for each call
    this.arrOptions = arrOptions;
    //reset our skips for the new data set
    this.arrSkipOptions = [];
    //normalize our skip terms to see if they have been updated
    this.NormalizeSkips(arrSkipTimes);
    return true;
  }
};

//simple function to load our selected choice
function LoadChoice(boolUseExceptions){
  if(typeof(boolUseExceptions) == 'boolean' && boolUseExceptions){
    objChoices.NormalizeSkips(objExceptions);
  }
  //load our result
  var strChoice = objChoices.GetNext();
  var objDisplay = document.getElementById("round_robin");
  if(objDisplay)
    objDisplay.innerHTML = strChoice;
  //check to see if our exceptions have completed
  AreExceptionsDisabled();
  return true;
}

//determine if the load exceptions button is disabled
function AreExceptionsDisabled(){
 if(typeof(objChoices.objSkipOptions) == 'object' && Object.keys(objChoices.objSkipOptions).length > 0){
    if(typeof(objChoices.objExceptionButton) == 'object')
        objChoices.objExceptionButton.disabled = true;
 }
 else{
    if(typeof(objChoices.objExceptionButton) == 'object')
        objChoices.objExceptionButton.disabled = false;
  }
}

/******************************************************************************
*       High/Low example
*******************************************************************************/
function GetHighLow(arrSampleNumbers,boolGetHigh){
 var objDescribedNth = document.getElementById("highlowvalue");
 var objDisplayElement = document.getElementById("highlow");
 if(!objDisplayElement){
  console.log('Something terrible has happened, and the high/low feature cannot be displayed at this time');
  return false;
 }
 var intNth = 1;
 //sort our number array
 arrSampleNumbers.sort(function(a,b){
    return a - b
 });
 //make sure
 if(objDescribedNth){
   if(objDescribedNth.value <= arrSampleNumbers.length)
    intNth = (objDescribedNth.value - 1);
   else
    intNth = (arrSampleNumbers.length - 1);
   if(intNth < 0)
    intNth = 0;
 }
 if(typeof(boolGetHigh) == 'boolean' && boolGetHigh){
   //show our results
   objDisplayElement.innerHTML = arrSampleNumbers[(arrSampleNumbers.length - (intNth + 1))];
 }
 else{
   //show our results
   objDisplayElement.innerHTML = arrSampleNumbers[intNth];
 }
 return true;
}

/**
* make a random number array
* @return array()
*/
function MakeRandomNumberArray(){
 var strNumberDisplay = '[';
 var arrRandomNumbers = [];
 var objRandomDisplay = document.getElementById('randomdisplay');
 if(!objRandomDisplay){
  console.log('Something terrible has happened, and the high/low feature cannot be used at this time');
  return false;
 }
 //make our initial random number count between 2 and 20 numbers
 var intTotalNumbers = Math.floor(Math.random() * (20 - 5)) + 5;
 for(i=0;i<intTotalNumbers;i++){
  arrRandomNumbers[i] = Math.floor(Math.random() * (2000 - 1)) + 1;
  strNumberDisplay += arrRandomNumbers[i];
  if(i != (intTotalNumbers - 1))
    strNumberDisplay += ',';
 }
 //wrap up our display
 strNumberDisplay += ']';
 //sort our number array
 var arrSampleNumbers = arrRandomNumbers.sort(function(a,b){
    return a - b
});
 strNumberDisplay += '<br /><br />Numbers ordered '+JSON.stringify(arrSampleNumbers);
 strNumberDisplay +='<br /><br />Total Numbers ['+intTotalNumbers+']';
 objRandomDisplay.innerHTML = strNumberDisplay;
 return arrRandomNumbers;
}