# React Auth App
I created Authentication react app where i made simple login flow

 Understanding of how did jwt works 
 -
 - when client send our data like email and password in return server give us token back which is access token and refresh token and client need to store it in whether local storage or session storage

 - access token - client can access the backend server routes and can recieve data 
- refresh token - This token helps us to refresh access token when it gets expired , so that user dont need to login or signup again and again when the session of access token gets expired.


Implementation of Authentication in Application
-
- In this Application there are two pages - one is login page another is profile page 
- So in Log in Page , there is login button which sends user data (email and password) and our client recieves access token and refresh token, which we stored using localstorage and navigate page to profile page 
- So before going to profile page , i added checks using Protected route to check
- 1. does token present in localstorage or not to make sure user logged in or not
- 2. making request to profile api to make sure token is not expired or if it throw error then we make server request to get new access token then to clear old tokens and add new tokens to localstorage

- In the profile page route there is card component which shows the logged in user data and there is logout button
- when clicked on logout button it clears tokens from localstorage and navigate back to login page
