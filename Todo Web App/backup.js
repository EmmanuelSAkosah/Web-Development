//back up code

(function (window) {
	'use strict';

    // A ToDo item 
    function toDoItem(completed, description) {
        this.completed = false;
        this.description = "";
    }
    
    //the model that represents the ToDo items.
    var theModel = new Object();
    theModel.items = new Array(10);
    theModel.numItems = 0;
    
    
    
    //eventhandler: handels change
    function handleChange(){
       console.log("the area was cicked");      
    }
    
    
    //the UpdateView function: rebuilds html based on changes to the model
    function UpdateView(theModel) {        
     $('new-todo').attr('placeholder','view has been updated');        
    }
    
    
    //event listener.
    $('#todoapp').on('change', handleChange);
  

    
    // bool new todo entered?
    function newToDoEntered(){        
        if (  $('#new-todo').text.length > 1)
            return true;
            
        return false;
    }
    
    
    //eventhandler: handels change
    function handleEnterKey(){
           console.log("Enter was pressed");
           updateView();        
    }
       
	// Your starting point. Enjoy the ride!

})(window);
