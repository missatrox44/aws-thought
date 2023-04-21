// import express and Router() to create routes
const express = require('express');
const router = express.Router();

// configure interface object
const AWS = require('aws-sdk');
const awsConfig = {
  region: 'us-east-2',
};
AWS.config.update(awsConfig);
const dynamodb = new AWS.DynamoDB.DocumentClient();
const table = 'Thoughts';

// GET route to access All Thoughts
router.get('/users', (req, res) => {
  const params = {
    TableName: table,
  };
  // Scan return all items in the table
  dynamodb.scan(params, (err, data) => {
    if (err) {
      res.status(500).json(err); // an error occurred
    } else {
      res.json(data.Items);
    }
  });
});

// GET route to access all thoughts from a User
router.get('/users/:username', (req, res) => {
  console.log(`Querying for thought(s) from ${req.params.username}.`);
  
  // declare params to define query call to DynamoDB
  const params = {
    TableName: table,
    KeyConditionExpression: '#un = :user',
    ExpressionAttributeNames: {
      '#un': 'username',
      '#ca': 'createdAt',
      '#th': 'thought',
    },
    ExpressionAttributeValues: {
      ':user': req.params.username,
    },
    ProjectionExpression: '#th, #ca',
    ScanIndexForward: false,
  };
  
  // query the DynamoDB table
  dynamodb.query(params, (err, data) => {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.status(500).json(err); // an error occurred
    } else {
      console.log("Query succeeded.");
      res.json(data.Items);
    }
  });
});

// POST route to Create new user
router.post('/users', (req, res) => {
  const params = {
    TableName: table,
    Item: {
      username: req.body.username,
      createdAt: Date.now(),
      thought: req.body.thought,
    },
  };
  // data base call
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error(
        'Unable to add item. Error JSON:',
        JSON.stringify(err, null, 2),
      );
      res.status(500).json(err); // an error occurred
    } else {
      console.log('Added item:', JSON.stringify(data, null, 2));
      res.json({ Added: JSON.stringify(data, null, 2) });
    }
  });
});

module.exports = router;


// PARAMS OBJECT EXPLAINED:
// KeyConditionExpression property specifies the search criteria
//As the name suggests, we can use expressions by using comparison operators such as <, =, <=, and BETWEEN to find a range of values.

// We need to retrieve all the thoughts from a specific user, so we used the = operator to specify all items that pertain to a single username. The #un and :user symbols are actually aliases that represent the attribute name and value. The #un represents the attribute name username. This is defined in the ExpressionAttributeNames property. While attribute name aliases have the # prefix, the actual value of this key is up to us. DynamoDB suggests using aliases as a best practice to avoid a list of reserved words from DynamoDB that can't be used as attribute names in the KeyConditionExpression. Because words such as time, date, user, and data can't be used, abbreviations or aliases can be used in their place as long as the symbol # precedes it.

//For the same reason, the attribute values can also have an alias, which is preceded by the : symbol. The attribute values also have a property that defines the alias relationship. In this case, the ExpressionAttributeValues property is assigned to req.params.username, which was received from the client. To reiterate, we're using the username selected by the user in the client to determine the condition of the search. This way, the user will decide which username to query.

// Next is the ProjectExpression property. This determines which attributes or columns will be returned. This is similar to the SELECT statement in SQL, which identifies which pieces of information is needed. In the preceding code statement, we specify that the thoughts and createdAt attributes should be returned. We didn't add the username, because this value is part of the condition criteria; therefore, this info is redundant and won't be rendered.

// Last is the ScanIndexForward property. This property takes a Boolean value. The default setting is true, which specifies the order for the sort key, which will be ascending. The sort key was assigned to the createdAt attribute when we first created the table. Because we want the most recent posts on top, we set the ScanIndexForward property to false so that the order is descending.