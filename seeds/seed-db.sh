./wait-for mongodb:270127

mongoimport --db mongodb --collection users --file users.json
mongoimport --db mongodb --collection items --file items.json