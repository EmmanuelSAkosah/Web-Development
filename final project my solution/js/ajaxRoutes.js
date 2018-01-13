let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({extended:false});
let jsonParser = bodyParser.json({});

let router = require('express').Router();

let model = require('./model.js');

module.exports = router;
 
router.get('/items', async (req, res) => {
    
  // Step 1: Retrieve input data from the request
   let page = req.query.page-0;       // Convert to number
   let orderBy = req.query.orderBy-0; // Convert to number
   let order = req.query.order-0;     // Convert to number

  // Step 2 (TODO): Validate input and check if the user
  // has the right to proceed. 

  // Step 3: Apply "business logic", and    
    
  // Step 4: Prepare the data needed by the view (client-side)
   let items = await model.getItems(page, orderBy, order);    
   res.json(items);
});

// list loggedinUser's items
router.get('/listMyItems', (req, res) => {
    
   if(req.session.user){
      console.log("username retrieved in ajaxroutes is :"+ req.session.user); 
      model.RedeemedItem.find({ redeemers: req.session.user }, 'item', 
        function(err, result) {
         if (err) {
            console.log(err);
            res.sendStatus(500);
          }else{
             
         console.log("loggedInUser's items are :"+ result);          
         res.json(result); 
        }
    }  
  );     
   }else{
    console.log("not logged in");
    res.redirect('/login');  
   }
      
}); 

router.get('/redeemItem', (req, res) => {
    //console.log("tokenvalue in ajax request is" + req.query.tokenValue);
    if (req.session.user){ //process item redemption if user is logged in
        console.log("User wishing to redeem is loggedin "+req.session.user);
        var username = req.session.user;
        var itemToBeRedeemed = req.query.item;
        
        // find user and get their tokens
         model.User.findOne(
        { username: username },
        'balance',    

        async function(err, result) {
         if (err) {
            console.log(err);
            res.sendStatus(500);
          }   
        console.log("User's current balance is " + result.balance+ "\n \
                    Item to be redeemed is :"+req.query.item); 
        if(result.balance >= req.query.tokenValue){         
          
           // if item has been redeemed before, update redeemed item 
            //var trueFalse = model.IsItemInRedeemedList(itemToBeRedeemed);
           let trueFalse = await model.IsItemInRedeemedList(itemToBeRedeemed);
            console.log("trueFalse is "+ trueFalse); 
           if( trueFalse ) { 
                
                //add user to list of redeemers
                console.log("has been redeemed before: Updating");
              if( model.UpdateRedeemedList(itemToBeRedeemed,username))                res.sendStatus(200);  
             }else{ //create newRedeemedItem otherwise
                  
                console.log("Item hasn't been redeemed before");              
                let result =  model.createNewRedeemedItem(itemToBeRedeemed ,username,req.query.tokenValue); 
                if(result){
                  console.log(" createNewRedeemedItem returned" +result);
                  res.sendStatus(200);  
                }
             }   
             
            
           }else{ 
             //user doesn't have enough tokens
             console.log("user doesn't have enough tokens");
             res.sendStatus(201); 
         }
        }
      );  
       
    }
    else{ //redirect to login page
       console.log("User wishing to redeem is not loggedin");
       res.redirect('/login');      
    }

});