// use aws-sdk to create interface w/ DynamoDB
const AWS = require("aws-sdk");
// use file system package to read the users.json file
const fs = require("fs");

// configuration using DocumentClient() class to create dynamodb service object
// this class offers a level of abstraction that enables us to use JavaScript objects as arguments and return native JavaScript types
// This constructor helps map objects, which reduces impedance mismatching and speeds up the development process
AWS.config.update({
  region: "us-east-2",
});
const dynamodb = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
});

// use fs package to read users.json and assign object to allUsers constant
console.log("Importing thoughts into DynamoDB. Please wait.");
const allUsers = JSON.parse(
  fs.readFileSync("./server/seed/users.json", "utf8")
);

// loop over allUsers and create a params object
allUsers.forEach((user) => {
  const params = {
    TableName: "Thoughts",
    Item: {
      username: user.username,
      createdAt: user.createdAt,
      thought: user.thought,
    },
  };
// make call to database with the service interface object dynamodb
  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error("Unable to add thought", user.username, ". Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("PutItem succeeded:", user.username);
    }
  });
});
