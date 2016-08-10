# Intermediate Node Assessment

## Set up your node server

* The file must be called server.js
* There is a package.json included with dependencies in it, you should know what to do.
* It must use express, and body parser (Set up the app and use the body parser)
* You will want to require the included `users.json file`  `var users = require('./users.json');`
* At the bottom of the file you must `module.exports` your express app.
* Listen on port 3000.


## Setup your endpoints
Create the following endpoints in `server.js` using express.

* Every endpoint will be using the users collection, found in `users.json`.
* Each endpoint in this readme is followed by the path that will be tested. For example, 'Get all users.' will be tested by doing a `GET` request to `/api/users`.
* You can test your work by running `npm test` in your CLI.
* When you are finished, you should have `11 tests passed`.
* Be sure to use the correct method (GET, POST, PUT, or DELETE) and the correct path (i.e. `/api/users`).
* All responses must return a status of 200, unless otherwise specified

##### Make the following endpoints.

1.  Get all users. Return all users from the users array.
   `GET: /api/users`
   
2.  Get all users by language. You will receive the `language` as a query ('english, french, spanish or klingon.').  Return an array of all users that have the same language specified in the query.
   `GET: /api/users?language=klingon`

3.  Get all users, filtering by privilege. You will receive the privilege as a url parameter. ('admin, moderator, user').  Return an array of all users with the same privilege specified in the parameter.
   `GET: /api/users/admin`

4. Find one user by id. Use the url params to get the id. Make sure that a get request for a user that does not exists returns 404.
    `GET: /api/users/` + userId

5. Create a new user.  You will receive the data on the body.  All users will need an id property.   Manage the value so that it increments each time.  Collections should be initialized with a defualt array.  Return a valid status code and the new user object you created (with the id on it).  
   `POST: /api/users`

6. Create a new admin user. You will receive their privilege as a url parameter. ('admin, moderator, or user').  Return a valid status code.  Make sure to set the privilege correctly.
   `POST: /api/users/admin`

7.  Change a user's language. The language will be sent in the body `{language: "New language"}`. Update the user in your array and then return a valid status code and the updated user object.
   `POST: /api/users/language` + userId

8.  Add to a users favorite forums. Use params to get a user by id. You will receive the data on the body `{add: 'New Forum'}`. Return a valid status code.
   `POST: /api/users/forums/` + userId

9. Remove from a users favorite forums. Use delete REST method. You will receive the user id in the url params. You will receive the forum to delete in the query. You will need to search your array and splice it out.
   `DELETE: /api/users/forums/` + userID + `?favorite=` + forum name.

10.  Ban (delete) a user. Use REST method delete and the query params to delete a user by their id number.
   `DELETE: /api/users/` + userID

11. Change your get all users (#1) endpoint so that it uses queries. Allow queries for age, language, city, state, and gender.


12. Update one user by id.  (You'll need to find your user then use a for in loop to update properties).
   `PUT: /api/users/` + userId