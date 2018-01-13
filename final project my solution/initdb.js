// This file contains code to repopulate the DB with test data

var mongoose = require('mongoose');

require('./js/db.js'); // Set up connection and create DB if it does not exists yet
 
var model = require('./js/model.js');
 
// Remove existing data from Users and Items collections and
// repopulate them with test data
model.User.remove({}, function(err) {
  if (err)
    return console.log(err);

model.Item.remove({}, function(err) {
    if (err)
      return console.log(err);
    
model.RedeemedItem.remove({}, function(err) {
    if (err)
      return console.log(err);
    
    // Populate data only after both collections are cleared.
    populateData();
   });
  });
});

// ----------------------------------------------------------------------


function populateData() {
  var t = [ 'yummy', 'delicious', 'yuk', 'pretty', 'funny',
            'pricy', 'meh', 'interesting', 'omg', 'bravo' ];

  var items = [
    _item(0, 'Apple', new Date(2016, 11, 10), 15, 30, [t[0], t[1], t[3], t[4]]),
    _item(1, 'Orange', new Date(2016, 10, 10), 12, 30, [t[3], t[5], t[8], t[4]]),
    _item(2, 'Strawberry', new Date(2016, 1, 12), 25, 30, [t[0], t[9], t[3], t[4]]),
    _item(3, 'Watermelon', new Date(2016, 3, 13), 13, 30, [t[0], t[1], t[6], t[4]]),
    _item(0, 'Pear', new Date(2016, 4, 30), 9, 30, [t[0], t[2], t[8], t[7]]),
    _item(2, 'Peach', new Date(2016, 2, 20), 10, 30, [t[1], t[1], t[3], t[4]]),
    _item(4, 'Pineapple', new Date(2016, 1, 15), 21, 30, [t[2], t[7], t[4], t[4]]),
    _item(5, 'Grape', new Date(2016, 1, 1), 11, 30, [t[0], t[9], t[8], t[3]]),
    _item(5, 'Banana', new Date(2016, 6, 20), 7, 30, [t[0], t[2], t[3], t[1]]),
    _item(10, 'Mango', new Date(2016, 3, 10), 8, 30, [t[7], t[1], t[3], t[2]]),
    _item(8, 'Plum', new Date(2016, 1, 20), 10, 30, [t[0], t[1], t[3], t[3]]),
    _item(4, 'Lychee', new Date(2016, 10, 10), 10, 30, [t[0], t[1], t[7], t[4]]),
    _item(8, 'Kiwi', new Date(2016, 9, 11), 10, 30, [t[9], t[4], t[8], t[2]]),
    _item(7, 'Fig', new Date(2016, 1, 12), 10, 27, [t[2], t[1], t[5], t[6]]),
    _item(1, 'Green Apple', new Date(2015, 11, 10), 17, 30, [t[0], t[2], t[4], t[7]]),
    _item(1, 'Apricot', new Date(2015, 2, 12), 5, 30, [t[8], t[0], t[2], t[3]])
  ];
     
     
  var users = [
    _user('john', 'john@example.com', '123', 4),
    _user('jane', 'jane@yahoo.com', '123',34),
    _user('eric', 'eric@gmail.com', '123',34), 
    _user('matt', 'matt@gmail.com', '123',45),
    _user('jill', 'jill@yahoo.com', '123',56),
    _user('bill', 'bill@gmail.com', '123',67),
    _user('bob', 'bob@hotmail.com', '123',87),
    _user('charles', 'charles@hotmail.com', '123',45),
    _user('susan', 'susan@gmail.com', '123',74),
    _user('tanya', 'tanya@foo.com', '123',74), 
    _user('fred', 'fred@bar.com', '123',34),
    _user('CJ', 'CJ@bar.com', '123',100)
  ];   

  var redeemedItems = [  
      //_redeemedItem('Kiwi',2,30,new Date(2016, 12, 22),['john','matt']),
      _redeemedItem('Apricot',2,5,new Date(2017, 12, 22),['manny','CJ']),
      _redeemedItem('Fig',3,27,new Date(2010, 12, 22),['CJ','manny','john']),
      _redeemedItem('Mango',3,30,new Date(2016, 12, 22),['CJ','john','matt']),
      _redeemedItem('Kiwi',2,30,new Date(2016, 12, 22),['john','matt']) 
  ];
      
     
  // Insert all users at once
  model.User.create(users, function(err, _users) {
    if (err) handleError(err);
  
    // _users are now saved to DB and have _id
    // Replace the owner indexes by their _ids 
    for (var i = 0; i < items.length; i++) {
      var ownerIdx = items[i].owner;
      items[i].owner = _users[ownerIdx]._id;
    }

    // Insert all items
    model.Item.create(items, function(err, _items) {
      if (err) handleError(err);
        
    // Initiallize redeemed items list
    model.RedeemedItem.create(redeemedItems, function(err, _redeemedItems) {
      if (err) handleError(err);

        
      // Success
      console.log(_users);
      console.log(_items);
      console.log(_redeemedItems);
      mongoose.connection.close();
    });
  });
});
    
}
   

function _user(username, email, password, balance) {
  return {
    username: username,
    email: email,
    password: password,
    balance: balance
  };
}
  
function _item(ownerIdx, description, createdOn, tokenValue,availableQuantity,  tags) { 
  return { 
    owner: ownerIdx,
    description: description,
    createdOn: createdOn,    
    tokenValue:tokenValue,
    availableQuantity: availableQuantity,
    tags:tags
  }; 
}
 
function _redeemedItem(item, quantityRedeemed, tokenValue,redeemedOn,redeemers) {
  return {
    item : item,      
    quantityRedeemed: quantityRedeemed,
    tokenValue: tokenValue, 
    redeemedOn: redeemedOn, 
    redeemers: redeemers 
  };
}


function handleError(err) {
  console.log(err);
  mongoose.connection.close();
}
