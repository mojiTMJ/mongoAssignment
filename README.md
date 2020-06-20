mongoAssignment

Hey folks, this is my NoSQL course assignment, I have assigned some tasks to do a query in mongo database. To do this has also considered using containers in Linux as my database you can also use atlas mongo well documented, for the scenario I have created a docker-compose.yml file to specified by configuration and specified database setting to another file for my work space. Well to know more about this staff obviously you have to read more. :wink:

Clone the repo and move to the directory.
Let's start our database based on our docker container.

```bash
docker-compuse up
```

To check on our container we  use

```bash
docker ps -a
```

I will use shell to interact with mongo database you are free to use compose or any other drivers available for MongoDB, therefore

```bash
docker exec -it movieMongo bash
```

Professors asked to use a film database in JSON format, let's import this file to our database, from my bash I am going to move data file to directory which we can access it from inside the container

```bash
mv ./movieData.json  ./volumeMongo/
```

```bash
mongoimport --db movie --collection movies --authenticationDatabase admin --username userName --password passWord --type json --drop --file /data/db/MovieData.json --jsonArray
```

to access mongo shell you need to execute

```bash
mongo -u userName -p passWord
use movie
```

**A.** List the five countries that have been involved in producing the largest number of film?

```bash
db.movies.aggregate([ {'$match': {'countries': {'$exists': true, '$ne': null}}}, {'$group': {_id: '$countries', 'count': {'$sum': 1}}}, {'$sort': {'count': -1}},{'$limit': 5}])
```

**Ans:** In this query I tried to aggregate all not null value in countries document and group them based on the value that means by country name to count them how many times they accrue, for the last part I have to sort them in rivers mode to return top 5 countries.

**B.** List a group of films which are related to sports. Show the title of the films and the year they were released. Discuss briefly in your report your strategy to tackle this question?

```bash
db.movies.aggregate([ {'$match': {'genres': {'$regex': 'Sport', '$options': 'i'}}}, {$project: {'title': 1, 'year': 1, _id: 0}}, {'$sort': {'year': -1}}])
```

**Ans:** This query tries to group all document which has value 'Sport' in their genres document, I have used regex to also consider case-sensitive value 'sport', well at the second part I used the project to return only name and the year which film produced, and also ordered by the year.

**C.** Create a new field in the collection called “myRating”. This will require updating the collection. This field will contain a score, proposed by your team, which combines in a single value the information in the collection describing what a good film is. Remember that you have 3 rating agencies and also information about awards and nominations. Your task is to come up with a score that combines this information in a single number. The way to approach this question is left open to your creativity. Notice that there are no “wrong” or 1“correct” answers here. There are many possible valid alternatives or combinations of metrics. You should explain in the report your design choices.

```bash
db.movies.updateMany({},[{$addFields: {myRating: {$sum: ['$awards.wins', '$awards.nominations', '$imdb.rating', '$tomato.rating']}}}])
```

**Ans:** well for this query I thought about different scenarios but at the end, the simplest way for me was, to sum up all the scores and awards to show which one has more value, in my opinion, myRating document shows the sum of the awards. wins + awards.nominations + IMDb.rating + tomato.rating.

To check on result I suggest using this one

```bash
db.movies.find({},{title: 1, myRating: 1, _id: 0}).sort({myRating: -1}).pretty().limit(5)
```

**D.** Using your newly created rating score, recommend 3 good film for people who liked the “Star Trek” film. Discuss briefly in your report your strategy to tackle this question.

```bash
db.movies.find({$and: [{$or: [{$and: [{genres: {$in: ['Action', 'Advanture', 'Sci-Fi']}}, {'tomato.consensus.userRating': {$gte: 4.1}}]}, {$and: [{director: {'$regex': 'J.J. Abrams', '$options' : 'i'}}, {writers: {$in: ['Roberto Orci', 'Alex Kurtzman', 'Gene Roddenberry']}}]}, {$or: [{'tomato.consensus': {'$regex': 'Star Trek', '$options': 'i'}}, {title: {'$regex': 'Star Trek', '$options': 'i'}}]}]}, {title: {$ne: 'Star Trek'}}]}, {title: 1, myRating: 1, 'tomato.userRating': 1, _id: 0}).sort({myRating: -1, 'tomato.userRating': -1}).limit(3)
```

**Ans:** For this last query I have considered 3 scenarios to create my suggestion list, and also considered to not include our specific film:

1. The film has the same genres o has the higher o equal rate using tomato.userRating
2. or must have the same director or writers
3. or for my last scenario I have considered the film name in the title or in user tomato.consensus text.

These are just one way to see the problem there are thousands out there please create pull request to share your solution.


Happy Hacking :film_projector:

MojiTMJ