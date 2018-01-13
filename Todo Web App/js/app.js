(function (window) {
	'use strict';
     console.log("JS Start");  
    
   
                /***** the MODEL   *****/
    
     // A ToDo item 
    function toDoItem(completed, description) {
        this.completed = completed;
        this.description = description;
    }
    
    //the model that represents the ToDo items.
    var theModel = new Object();
    theModel.items = [];               //propertiy 1, the array of toDo items
    theModel.numItems = 0;             //propertiy 2, number indicating length of the array.
    
   
                /***** end of MODEL ******/
    
    
    
    
    
                /***** Helper Functions *******/    
    
    // function to add a new item (in html) to toDo list
    function addToDoItem( toDoItemName,ID){ 
        
        // reusable html for a toDo item
        var todoItemHtml = 	'<div class="view">' +
                                '<input class="toggle" type="checkbox" checked>' +
                                '<label>' + toDoItemName + '</label>' +
                                '<button class="destroy" id="'+ID+'" ></button>' +
                            '</div>' +
                            '<input class="edit" value=" '+ toDoItemName +' ">';

         var todoItem = document.createElement("li");
         todoItem.className = 'uncompleted';     //initially mark as uncompleted  
         theModel.numItems++;   //update numItems in theModel and add ID 
         todoItem.innerHTML = todoItemHtml;        
                          
         $('#todo-list').append(todoItem);      //append to list         
    }
    
    // function to modify the description of an existn toDo
    function setToDoItem( toDoItemName,ID){        
         theModel.items[ID -1].description = toDoItemName;
         updateView();
    }
    
    //function to rebuild html based on the model
    function updateView() {
        
        //get rid of existing li elements in ul
        $('#todo-list').find("li").remove();
        
        //build list from the model
        console.log("rebuilding model. total of: "+ theModel.items.length +" items")
        for(var index = 0 ;index < theModel.items.length; index++ ){
            addToDoItem( theModel.items[index].description, index+1);        
        }       
        
        //Update toDo count
        $('.todo-count strong').html(theModel.items.length);
        
        //set plural of item accordingly              
        if(theModel.items.length == 1 ){           
            $('.todo-count span').html("item left");            
        }
        else{
            $('.todo-count span').html("items left"); 
        }
        
        console.log("View has been updated");             
    }
    
                /***** End of Helper Functions ******/
    
    
    
    
    
    
                /***** Event Handlers *******/ 
    
    //handle deletion: delete a todo item from the model
   function handleDelete(ID){       
        theModel.items.splice(ID - 1, 1);  //delete item from model
        theModel.numItems-- ;              //decrement numItems of theModel
        console.log("toDo item " +ID+" is deleted");
        updateView();
   }
 
    
    //function to clear all completed items
   function handleClearAll( IDs ){       
         for( var index = 0; index < IDs.length; index++){
             
            //check of the id in IDs correspond to id of li element 
            $('ul.todo-list li button').each(function(index, element){
                console.log( "elemS prop result:"+ $(element).prop('id') );                
                if ( IDs[index] == $(element).prop("id") ){
                  console.log( IDs[index] + " matched :"+ $(element).prop('id') );
                  theModel.items.splice(IDs[index] -1 -index , 1);  //delete item from model
                  theModel.numItems-- ;              //decrement numItems of theModel
                  console.log("toDo item "+ IDs[index]+" is deleted.lenght now "+theModel.items.length);
                  console.log(theModel.items)
               }
            })
               
         }
         
         updateView();
    }
         
    
    //handle changes to input field: add entered toDo to theModel
   function handleChange(){
        
      //add a new toDo item to list
      var inputText = document.getElementById("new-todo").value;
       
      if (inputText.length > 0){
        var myToDo = new toDoItem(true, inputText);      //make a toDo item         
        theModel.items.push(myToDo);                     //add toDo item to model
        theModel.numItems++;                             //update count       
        document.getElementById("new-todo").value = "";  // clear the textfield
       }
       
       console.log("Added " + inputText + " to theModel");
       updateView();
    }
    
    
    //function to mark all items as completed/uncompleted
    function handleToggleAll(togglestate){        
        //set checked prop to false or true depending on state of check-all button
        $('ul.todo-list li').find("input.toggle" ).prop("checked", !togglestate);        
              
        // mark toDo item as completed or uncompleted accordingly
        if (togglestate){
            $('ul.todo-list li').removeClass().addClass("completed");           
        }
        else{
            $('ul.todo-list li').removeClass().addClass("uncompleted");
        }
           
    }
    
             /***** End of Event Handlers *******/ 
    
    
    
    
    
    
                /***** Event Listeners *******/ 
    
     //listen to EnterKey press on main input field
    $('#new-todo').keypress(function(event){     
          if (event.keyCode == 13) {
            handleChange();
            }
    });
    
    
    //listen to EnterKey press on toDo input field
    $(document).on('keypress focusout','.edit',
    function(){ 
       if (event.type == 'keypress' && event.keyCode != 13 ){
                                    //do nothing
       }
     else{  
          console.log("toDo item being modified: "+  event.target.value);
          
          var toDoID = $(this).closest("li").find("button").eq(0).prop("id");
          var toDoDescription = event.target.value;
          setToDoItem(toDoDescription,toDoID);        
          $(this).closest("li").removeClass("editing");  //remove editing class
        }
    });    
    
    
    // listen to click on delete button
    $(document).on('click','.destroy',
    function(){    //click on destroy button 
      console.log("delete button was hit: "+ this.id);
      handleDelete(this.id);    // get the id  
    });
    
               
    //listen to click on an toDo item's checkbox
    $(document).on('click','.toggle',
    function(){                          //click on checkbox button 
      console.log("toggle button was hit: ");
        
     if( $(this).closest("li").prop("class") == "completed"){         
         $(this).closest("li").removeClass("completed").addClass("uncompleted");        
     }
     else{
         $(this).closest("li").removeClass("uncompleted").addClass("completed");
     }
        
    /* //notify the toggle-all button: flip it's state       
     console.log("the toggle-all state\(before change) is :"+ $(this).prop("checked"));
      $('.toggle-all').prop("checked", !$(this).prop("checked"));    
    */                                                               // a NOTE incuded for the ommission of this code and the feature
                                                                     //  it is supposed to provide
    });
    
    
    //listen to double click on toDo item
    $(document).on('dblclick','label',
    function(){                          //double click on a toDo item
      console.log("toDo item was double clicked ");        
      $(this).closest("li").addClass("editing");    
     
    });
  
    
    //listen to click on toggle-all checkbox 
    $(document).on('click','.toggle-all',
    function(){  
        console.log("toggle-all button was hit");
        var state = $(this).prop("checked");
        console.log("toggle state is:" + state );
        handleToggleAll( !state );
    });  

 
      //listen to click on 'clear completed'    
     $(document).on('click','.clear-completed',
     function(){  
        console.log("clear completed button was hit");     
        var itemIDsToDelete= [];
        $('li.completed button').each( function(index, element) {
        console.log( itemIDsToDelete.push( $(element).prop("id") ) );
        
        })
        console.log ( itemIDsToDelete);
        handleClearAll( itemIDsToDelete );
     })
          
    
    
     /***** End of Event Listeners *******/    
    
    
     console.log("JS Ends");  
    
})(window);
