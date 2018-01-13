var mongoose = require('mongoose');
var Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

var UserSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, required: true }, //not needed
  password: { type: String, required: true },
  balance: { type: Number} //required: true
});
 
var ItemSchema = Schema({
  owner: { type: ObjectId, ref: 'User' }, //not needed
  description: { type: String, default: '' },
  createdOn: { type: Date, default: Date.now },
  tokenValue: { type: Number, default: 10},
  availableQuantity: { type: Number, default: 100},
  //image : { type: img }
  tags: [ { type: String } ]
});
 
var RedeemedItemSchema = Schema({
  item: {type: String, required: true, unique: false },  
  quantityRedeemed:{type: Number, default: 10,},
  tokenValue: { type: Number, default: 10},
  redeemedOn: { type: Date, default: Date.now },
  redeemers: [ { type: String } ]    
});
 
//csci2720.redeemeditems.dropIndex('redeemer_1'); 
var User = mongoose.model('User', UserSchema);
var Item = mongoose.model('Item', ItemSchema);
var RedeemedItem = mongoose.model('RedeemedItem', RedeemedItemSchema);


class PaginationData { 
  constructor (props) {
    if (props === undefined)
      return; 

    for (let key in props) {
      this[key] = props[key];
    }
  }

  validate() { // Ensure all required properties have a value.
    let requiredProperties =
      [ 'pageCount', 'pageSize', 'currentPage', 'items', 'params' ];
    for (let p of requiredProperties) {
      if (this[p] === undefined) {
        console.error(this, `Property '${p}' is undefined.`);
      }
    }
  }
}
 
// Place holder. The parameter orderBy is not used in this example.
async function getItems(page, orderBy, order){

  // Determine the sorting order
  // In this example, orderBy == 1 => order by 'createdOn'
  // let orderBy == 2 => order by 'tokenValue'
  orderBy = orderBy || 1;   // Default to 1
  order = (order == 1 || order == -1) ? order : 1;

  let pData = new PaginationData( {
     pageSize: 10,
     params: {
       orderBy: orderBy,
       order: order
     }
  }); 
     

  let condition = {};   // Retrieve all items

  let itemCount = await Item.count(condition);

  pData.pageCount = Math.ceil(itemCount / pData.pageSize);

  // Ensure the current page number is between 1 and pData.pageCount
  page = (!page || page <= 0) ? 1 : page;
  page = (page >= pData.pageCount) ? pData.pageCount : page;
  pData.currentPage = page;

  // Construct parameter for sorting
  let sortParam = {};
  if (orderBy == 1)
    sortParam = { createdOn: order };  // sort by createdOn
  else if (orderBy == 2)
    sortParam = { tokenValue: order };  //sort by tokenValue
    
    
  // ----- Construct query and retrieve items from DB -----
  // Construct query

  pData.items = await Item.
    find(condition).
    skip(pData.pageSize * (pData.currentPage-1)).
    limit(pData.pageSize).
    sort(sortParam).
    exec();

  pData.validate(); // Make sure all required properties exist.
  return pData;
}

async function getAUsersRedeemeditems(username) {  
    let result = await RedeemedItem.
    find({redeemer: username});    //find items in redeemedItems list that has the logged in user as it's redeemer
    
    return(result);
}

// get full redeemedItems list
async function getRedeemedItemsList() { 
    let redeemedItemsList = await RedeemedItem.
    find({}).exec();  
    return (redeemedItemsList);
}


async function getItem(id) {
  let _id = new mongoose.Types.ObjectId(id);
  let result = await Item.
    findOne( {_id: _id} ).
    populate('owner', 'username'). // only return the owner's username
    exec();
  return result;
} 
/*
function IsItemInRedeemedList(itemName) { 
    RedeemedItem.findOne( {item: itemName}, 
    function(err, result) {
       if (err) {
         console.log(err);
         return false;
        }
        if(result){
         console.log(" result from IsItemInRedeemedList is :"+ result);
          return true;  
        }else{
          console.log("IsItemInRedeemedList returned false:");
          return false; 
        } 
    });     
} 

*/


async function IsItemInRedeemedList(itemName) {
 let result = await RedeemedItem.findOne( {item: itemName},'item').
              exec(); 
 if (result){
 console.log(" result from IsItemInRedeemedList is true");
 return true;
 } else{
console.log(" result from IsItemInRedeemedList is false");
 return false;  
 }
}  
 
 

async function getAUsersToken(user) {
   let result = await User.findOne( {username: user},'balance').
                exec();    
       
    console.log("USer's token balance is : "+result.balance); 
    return result.balance;
}
    
function UpdateRedeemedList(itemName,redeemer){
    //find item in list and add redeemer to list of redeemers
    RedeemedItem.update( {item: itemName}, {$push: { redeemers : redeemer }},
    { $inc : {quantityRedeemed : 1}},
    function(err, updatedItems){
        if (err) {
         console.log(err);
         console.log("Couldn't update RedeemedList");
        }else{                    
           console.log("Redeemed Items updated"+ updatedItems);
     //deduct item tokenValue from user's balance
           RedeemedItem.find(   
           { item: itemName }, 

           function(err, updatedRedeemList){
               if (err) {
                 console.log("Couldn't fetch updatedRedeemedList");
               }
             console.log("They are "+ updatedRedeemList);
            });
        }
    });     
   
}
 
        

    // create a new redeemed item
function createNewRedeemedItem(itemName,redeemer,tokenValue){

    console.log("about to create redeemed item:"+ itemName+" "+redeemer+" "+tokenValue); 
       var newRedeemedItem = {
       item : itemName,
       redeemers : redeemer,
       quantityRedeemed: 1,
       tokenValue: tokenValue, 
       redeemedOn : Date.now() 
       };
 
       //add to database    
       RedeemedItem.create(newRedeemedItem, function(err, _redeemedItem) {
       if (err) {
            console.log(err);
            console.log("Couldn't create new Redeemed item");
            return false;    
        }else{
          console.log("newRedeemed item created"+ _redeemedItem); 
            //deduct item tokenValue from user's balance
            
          return true;
         } 
       });  
   }     
  


// Place holder for authentication
function authenticate(username, password) {  
  return (username === 'CJ' && password === '123');  
    //check with db
    //maybe hash password
}  
 
module.exports = {
  User: User,
  Item: Item,
  RedeemedItem: RedeemedItem,
  authenticate: authenticate,
  getItems: getItems,
  getItem: getItem,
  getAUsersToken:getAUsersToken, 
  getRedeemedItemsList: getRedeemedItemsList,
  IsItemInRedeemedList: IsItemInRedeemedList,
  UpdateRedeemedList: UpdateRedeemedList,
  createNewRedeemedItem: createNewRedeemedItem
}
