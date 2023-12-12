Todo App

This is a Task Management application API

This application will allow users to create, view, update, and delete tasks, each with a title, description, duedate and status.

Authentication

JSON Web Token (JWT) is the authentication method used for securing this API because of  Its compactibility, URL-safe means of representing claims between two parties.  JWT is used here to verify the identity of the client/user making a request to the server.
The JWT is signed using a secret key known only to the server which is stored in the environment variable. This signature is added to the token, allowing the server to later verify the authenticity of the token.
When a user logs in or authenticates with your system, the server generates a JWT containing relevant information (claims) about the user. These claims can include user ID, roles, permissions, and any other information needed for authorization.

post http://localhost:5000/api/login
Content-Type: application/json

{
    "email": "FavourAde45@gmail.com",
    "password": "AdenijiEnoch23"
}
A token is generated with the json code format above which will be added to the header to authorize the user to access the app

Authentication Error:
If the token is not passed to the authorization header, the user receives an error message indicating unauthorized. i.e he/she would not be permitted to access the app.

The server sends the JWT back to the client/user as part of the authentication response. The client can store this token securely, typically in a secure HTTP-only cookie or local storage.
If the JWT has an expiration time, and the client needs to continue making requests, it may need to refresh the token before it expires.
The client can request a new JWT using a refresh token or by re-authenticating.i.e login again.

Base Url:
http://localhost:5000/api

Status code                         Description
200                                 ok: successful and server returned requested data
201                                 created: successful and a new resources is created
400                                 Bad request: when request is missing required parameter
401                                 unauthorized: when the token is not valid
404                                 Not found: when the requested result is not found on the server
500                                 Internal server error: when an unexpected condition is encountered on the server.

Endpoints:

Signin contains both the successful and error endpoints 

post http://localhost:5000/api/signup
{
    "name": "Justice Mark",
    "email": "MarkLens45@gmail.com",
    "password": "JusticeWinner34"
}
response message:
{
    "message": "User registration successful",
    "data": {
        "name": "Justice Mark",
        "email": "MarkLens45@gmail.com",
        "encry_password": "ebc15f29fd8f286af1a6ae85cac6228a44e6013f09c2b9efe14fa20b1b9937db",
        "salt": "5369c640-98a9-11ee-b7f7-b1c270eebc72",
        "_id": "6577e57fcbe1dbe29c54314b",
        "createdAt": "2023-12-12T04:45:51.154Z",
        "updatedAt": "2023-12-12T04:45:51.154Z",
        "__v": 0
    }
}
request error:
{
    "name": "Ma",
    "email": "MarkLens45@gmail.com",
    "password": "JusticeWinner34"
}
response message:
{
    "err": "Name atleast should be 3 characters"
}

{
    "name": "Mark Jordan",
    "email": "MarkLens45@gmail",
    "password": "JusticeWinner34"
}
response message:
{
    "err": "Email should be valid"
}

{
    "name": "Mark Jordan",
    "email": "MarkLens45@gmail.com",
    "password": "Jus34"
}
response message:
{
    "err": "Password at least should be 6 characters"
}

login endpoins:
http://localhost:5000/api/login
{
    "email": "MarkLens45@gmail.com",
    "password": "JusticeWinner34"
}
response message:
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc3ZTU3ZmNiZTFkYmUyOWM1NDMxNGIiLCJpYXQiOjE3MDIzNTcxODB9.0UUK2sF_EfHJQGIcfjsahQPPji2BqYmAMUPoWZkyf3w",
    "user": {
        "_id": "6577e57fcbe1dbe29c54314b",
        "name": "Justice Mark",
        "email": "MarkLens45@gmail.com"
    }
}
error request:
{
    "email": "MarkLen45@gmail.com",
    "password": "JusticeWinner34"
}
response message:
{
    "error": "Email was not found"
}

{
    "email": "MarkLens45@gmail.com",
    "password": "Justicinner34"
}
response message:
{
    "error": "Email and password do not match"
}