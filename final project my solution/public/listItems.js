// Client-side JS code for the page /listITems

$(document).ready(function() { 

      
  var queryTimeIncreasing = { page:1, orderBy:1, order:1};
  var queryTimeDecreasing = { page:1,orderBy:1, order:-1};
  var queryTokenValueIncreasing = { page:1, orderBy:2, order:1};
  var queryTokenValueDecreasing = { page:1,orderBy:2, order:-1};
  var currQuery;     //to store the current request/'listing preferences'
  var ajaxResponse;   //store last response recieved. to be used for displaying items in detail
       
    //send ajax request when link is clicked
  $("#TimeIncreasing").on('click', function(event) {
  event.preventDefault();
  sendAjaxForItems(queryTimeIncreasing);
  currQuery = queryTimeIncreasing;
});
    
 $("#TimeDecreasing").on('click', function(event) {
  event.preventDefault();
  sendAjaxForItems(queryTimeDecreasing);
  currQuery = queryTimeDecreasing;  
});
  
 $("#TokenValueIncreasing").on('click', function(event) {
  event.preventDefault();
  sendAjaxForItems(queryTokenValueIncreasing);
  currQuery = queryTokenValueIncreasing;   
});
    
 $("#TokenValueDecreasing").on('click', function(event) {
  event.preventDefault();
  sendAjaxForItems(queryTokenValueDecreasing);
  currQuery = queryTokenValueDecreasing; 
});

  //listen to click on an item link, display item in detail
 $(document).on('click','.itemlink', function(event){
   event.preventDefault();  
   var itemId = $(this).prop("id"); 
   $(this).removeClass("itemlink").addClass("collapse");
   displayAnItem(itemId);    
 });   

 $(document).on('click','.collapse', function(event){
   event.preventDefault();    
   $(this).children('.ephemeral').remove();
   $(this).removeClass("collapse").addClass("itemlink");
 });   
     
    //listen to click on  the page buttons
 $(document).on('click', '.navigate',function() { 
      //get id of button
    var pageNumber = $(this).prop("id");
      //do nothing if button number is same as page number    
    if (currQuery.page != pageNumber){     
      currQuery.page = pageNumber; 
      sendAjaxForItems(currQuery);  //send request in currrent listing preference for the page chosen  
    }
});
    
    //listen to click on  redeem buttons
 $(document).on('click', '.redeem',function() {   
     var item = $(this).siblings('a').text(); //get name of the item
     if(item){ 
     console.log("item to be redeemed is "+item);
     } 
     var Query = {tokenValue : 5, item : item}; 
     sendAjaxForRedemption(Query);     
}); 
    
    
        
 
     
    
                        /******** Helper Functions **********/    

   function sendAjaxForRedemption(info){
      $.ajax({
     // contentType: 'application/json',
      data: info,
      url: '/ajax/redeemItem',
      type: 'GET',
      success: function(result) {
        console.log("redemption request returned success");
      }
      }); 
     console.log("redemption request sent");
   }
       
   //function to send ajax request via /items    
   function sendAjaxForItems(info){
      $.ajax({
     // contentType: 'application/json',
      data: info,
      url: '/ajax/items',
      type: 'GET',
      success: function(result) {
        ajaxResponse = result;
        displayItems(result);        
      }
      }); 
   console.log("client sent request");
   }
    
  
    //funtion to display details of one item
   function displayAnItem(itemId) { 
      if (ajaxResponse){
        for(var index = 0 ;index < ajaxResponse.items.length; index++ ){
            if(itemId == ajaxResponse.items[index]._id){
                console.log("match found");
               var matchedItem = ajaxResponse.items[index];
               var Name = matchedItem.description;           
               var TokenValue = matchedItem.tokenValue;
               var AvailableQuantity = matchedItem.availableQuantity;
               var Tags = "";
               for(var index = 0 ;index < matchedItem.tags.length; index++ ){
                 Tags = Tags + matchedItem.tags[index] + " ";
                }
               var CreatedOn = matchedItem.createdOn;               


                 //html of detailed item interface    
                let detailedItemHtml = '<li>Name: '+ Name+ '</li> \
                <li>Token Value: '+ TokenValue+ '</li> \
                <li>Available Quantity: '+ AvailableQuantity+ '</li> \
                <li>Listed On: '+ CreatedOn+ '</li> \
                <li>Token Value: '+ TokenValue+ '</li> \
                <li>Tags: '+ Tags+ '</li> \
                <li>Item ID: '+ itemId+ '</li>' ; 

                var Item = document.createElement("ul");
                Item.className = "ephemeral";
                Item.innerHTML = detailedItemHtml;
                
                //insert html in item's list element              
                $('#'+ itemId).append(Item);
                // return(Item);
                 console.log("Just before break");
                break;
            }else{
            console.log("item can't be listed in detail");
            }
             console.log("After break");
        }
    } 
         
   }
 
   //funtion to display items returned by ajax request
   function displayItems(rawAjaxResponse) {     
    
    //delete the present item listing
    $('#listOfItems').find("li").remove();     
       
   //get individual attributes all items and pass to makeAnItem
    for(var index = 0 ;index < rawAjaxResponse.items.length; index++ ){
        
      var id = rawAjaxResponse.items[index]._id;     
      var description = rawAjaxResponse.items[index].description;
      var tokenValue = rawAjaxResponse.items[index].tokenValue;
      var availableQuantity = rawAjaxResponse.items[index].availableQuantity;
      var createdOn = rawAjaxResponse.items[index].createdOn;           
      
      var Item = makeAnItem(id,"",description,tokenValue,availableQuantity, createdOn); 
      $('#listOfItems').append(Item);    //insert item into page
    }
       // display navigation buttons
    makePageButtons(rawAjaxResponse);
   }
        
    //function to create an html li element to be inserted into page
   function makeAnItem(id,itemLink,description,tokenValue,availableQuantity, createdOn){
        
        let itemHtml = ' <a href="" class ="itemlink" id= "'  
        + id+ '">'   
        + description + '</a>  <span>'     
        + tokenValue + '</span> <span>'  
        + availableQuantity+ '</span> <span>' 
        + createdOn + '</span> <button class="redeem">Redeem</button>'     
        ; 
// onclick=displayAnItem('+id+')
        var Item = document.createElement("li");
        Item.innerHTML = itemHtml; 
        Item.className= "anItem";     
        return(Item);
 } 
    
   // function to make button html elements
    function makePageButtons(rawAjaxResponse){  //TODO: Trim code: create button only
        
      //clear existing buttons
      $('#pagebuttons').find(".navigate").remove();    
        
      let params = JSON.parse(JSON.stringify(rawAjaxResponse.params)); // Copy the params object      
    
     for (var index = 0; index < rawAjaxResponse.pageCount; index++) {
         params.page = index+1;
         //let q = Query.stringify(params); '+ q + '
        
         var someElement = document.createElement("button");
         someElement.innerHTML = params.page;
         someElement.className= "navigate";
         someElement.id = params.page;   //set id as page number          
         $('#pagebuttons').append(someElement);  //display button on page
      }
        
    }  
    
});
