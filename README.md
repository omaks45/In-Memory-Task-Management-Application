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
