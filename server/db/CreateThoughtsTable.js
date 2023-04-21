// import required package
const AWS = require('aws-sdk');

// modify AWS config object that DynamoDB will use to connect to the local instance
AWS.config.update({
  region: 'us-east-2',
});

// create the DynamoDB Service Object\
// By specifying API version, ensuring API library were using is compatible with tutorial
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

// create a params object that will hold the schema and metadata of the table
const params = {
  TableName: 'Thoughts',
  KeySchema: [
    { AttributeName: 'username', KeyType: 'HASH' }, // Partition key
    { AttributeName: 'createdAt', KeyType: 'RANGE' }, // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'username', AttributeType: 'S' },
    { AttributeName: 'createdAt', AttributeType: 'N' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10,
  },
};

// uses params to make a call to DynamoDB instance and create a table
// use method createTable on dynamodb service object
// pass params object and use a callback function to capture the error and response
dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.error(
      'Unable to create table. Error JSON:',
      JSON.stringify(err, null, 2),
    );
  } else {
    console.log(
      'Created table. Table description JSON:',
      JSON.stringify(data, null, 2),
    );
  }
});

// params object explained:
// In the first line, we designate the table name as Thoughts.

// Next is the KeySchema property, which is where we define the partition key and the sort key. Here we see that the partition key is defined as the KeyType: "HASH" and the sort key is defined as the "RANGE". We'll use these terms interchangeably throughout this module.

// We defined the hash key as username and the range key as createdAt to create a unique composite key. One benefit of using createdAt as the sort key is that queries will automatically sort by this value, which conveniently orders thoughts by most recent entry.

// Next we see the AttributeDefinitions property. This defines the attributes we've used for the hash and range keys. We must assign a data type to the attributes we've declared. We assigned a string to the username and a number to createdAt, indicated by "S" and "N" respectively.

// Next is the ProvisionedThroughput property. This setting reserves a maximum write and read capacity of the database, which is how AWS factors in pricing.