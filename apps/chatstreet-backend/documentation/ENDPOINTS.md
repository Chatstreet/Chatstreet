# Backend Endpoint Documentation

A swagger documentation is also available under the `/swagger` endpoint.

Note, the endpoints documented here are only available in the refactored version of the backend. The old backend uses different endpoints.

| Method | Route | Restricted |  Description | Payload | Returns |
|-|-|-|-|-|-|
| `GET` | `/api/v1/health` || Used for Deployments to determine if the backend is up and healthy. |-| A string 'ok' or nothing when down. |
| `POST` | `/api/v1/token/auth` || Login Endpoint, validates credentials. | User or Email & Password | JWT Token if valid credentials. |
| `POST` | `/api/v1/token/register` || Used to register a new user. | User account information. | User account information if successful. |
| `GET` | `/api/v1/token/verify` || Used to check if the user is logged in and the token is still valid. | - | User email address and id if successful. |
| `POST` | `/api/v1/secure/token/refresh` | ✔ | Used to refresh the JWT access token. | - | New JWT token if the old one is still valid. |
| `DELETE` | `/api/v1/secure/token/logout` | ✔ | Used to remove all of the JWT tokens from cookies. | - | Remove token cookies header. |
| `GET` | `/api/v1/pwd/reset` || Used if the user wants to reset his/her password. | Username and user tag or email address in query parameter | Allways successful (backend tries to send reset email) |
| `POST` | `/api/v1/pwd/reset` || Used when the user changes his/her password. | Password and password reset code as payload. | Successful or invalid code. |
| `GET` | `/api/v1/secure/users/{id}` | ✔ | Used to get all the data relevant for the users account | - | Username, user tag, description, avatar etc. |
| `PATCH` | `/api/v1/secure/users/{id}` | ✔ | Used to update single or multiple user account settings. | All available user account / settings parameters. | Username, user tag, description, avatar etc. (all available user data) |
| `GET` | `/api/v1/secure/users/{id}/invites` | ✔ | Used to get a list of all the invitations the user recieved. | - | List of all the invitations. |
| `GET` | `/api/v1/secure/users/{id}/invites/{id}` | ✔ | Used to get a specific invitation by the id of the invitation. | - | A specific invitation. |
| `POST` | `/api/v1/secure/users/{id}/invites/{id}` | ✔ | Used to respond to an invitation (accepting or declining). | The response of the user. | A specific invitation. |
| `GET` | `/api/v1/secure/users/{id}/invited` | ✔ | Used to get a list of the accounts the specific user invented. | - | A list of users that have been invited by the specific user. |
| `GET` | `/api/v1/secure/users/{id}/invited/{id}` | ✔ | Used to retrieve a specific invite of the user. | - | A specific user invite, identified by its id. |
| `POST` | `/api/v1/secure/users/{id}/invited` | ✔ | Used to invite a new user. | - | The username and tag of the user that will be invited. |
| `DELETE` | `/api/v1/secure/users/{id}/invited/{id}` | ✔ | Used to remove a specific invitation of the user. | - | The specific invitiation identified by its id. |
| `GET` | `/api/v1/secure/users/{id}/friends` | ✔ | Used to get all the friends of the user. | - | A list with users that are friends of the user. |
| `GET` | `/api/v1/secure/users/{id}/friends/{id}` | ✔ | Used to retrieve a specific friend by his user id. | - | A specific friend of the user. |
| `DELETE` | `/api/v1/secure/users/{id}/friends/{id}` | ✔ | Used to remove a friend of the user by his id. | - | The specific user that has been removed from the friends list. |
| `GET` | `/api/v1/secure/users/{id}/blocked` | ✔ | Used to get a list of all the accounts blocked by the user. | - | A list of all the users blocked by the user. |
| `GET` | `/api/v1/secure/users/{id}/blocked/{id}` | ✔ | Used to get a specific account blocked by the user. | - | A specific user which has been blocked by the user. |
| `POST` | `/api/v1/secure/users/{id}/blocked` | ✔ | Used to block a specific user. | - | The username and tag of the user that will be blocked. |
| `DELETE` | `/api/v1/secure/users/{id}/blocked/{id}` | ✔ | Used to unblock a specific user by his user id | - | The specific user which has been unblocked. |
| `GET` | `/api/v1/secure/users/{id}/chats` | ✔ | Used to retrieve a list of all the chats of the user. | - | A list of all the chats of the user (also empty chats with friends). |
| `GET` | `/api/v1/secure/users/{id}/chats/{id}` | ✔ | Used to get a specific chat by the chat id. | - | A specific chat by its id. |
| `POST` | `/api/v1/secure/users/{id}/chats` | ✔ | Used to post a message in the chat with a specific friend. | The content of the message. | The newly posted message. |
| `PATCH` | `/api/v1/secure/users/{id}/chats/{id}` | ✔ | Used to update a specific message. | The new content of the message. | The content of the updated message. |
| `DELETE` | `/api/v1/secure/users/{id}/chats/{id}` | ✔ | Used to delete a specific message. | - | The content of the deleted message. |
| `GET` | `/api/v1/secure/users/{id}/keys` | ✔ | Used to retrieve the public and private key of the user. | - | Public and private key of the user. |

---
<div style="display: flex; justify-content: space-between; align-items: center;">
	<p>Last Update:</p>
	<p>25.05.2023</p>
</div>