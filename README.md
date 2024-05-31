# Project Setup and Usage Guide


## Setting Up the Environment


### 1. MongoDB
Ensure MongoDB is installed and running on your machine or available on a server. You will need the connection string to connect the application to MongoDB.

### 2. C++ Server (Ex4 Server)

Go there: [ex4_cpp_server directory]https://github.com/davidNidam1/Ex1/tree/ex4_cpp_server

Navigate to the ex4_cpp_server directory and compile the server code, do it via 2 terminals:


#### First Terminal (step 2.1):
 
`cd ./src`

`g++ -o ex1 ./Server.cpp ./Blacklist.cpp ./BloomFilter.cpp ./Hashs.cpp ./InputOutput.cpp`

`./ex1/Server.cpp`


#### Second Terminal (step 2.2):

`cd ./src`

`g++ -o ex1 ./Client.cpp ./Blacklist.cpp ./BloomFilter.cpp ./Hashs.cpp ./InputOutput.cpp`

`./ex1/Client.cpp`


### 3. Ex3 Server
Navigate to the ex4_server_updated directory:

`cd ex4_server_updated`

Install the necessary dependencies:

`npm install`

Start the server:

`npm start`

Ensure this server is configured to connect to MongoDB.


### 4. Ex2 Web

Go there: [Ex4_branch directory]https://github.com/davidNidam1/Ex2_Web/tree/Ex4_branch

Navigate to the ex4_branch directory:

`cd ex4_branch`

Install the necessary dependencies:

`npm install`

`npm install react-confetti`

Start the web server:

`npm start`


## User Management

### Registration
Access the registration endpoint of the web server.
Submit the registration form with required details.
The form will be handled by the Ex3 server, which interacts with MongoDB to store user details.
Login
Access the login endpoint of the web server.
Submit the login form with your credentials.
The upgraded Ex3 server will verify the credentials against the MongoDB database.

### Post Management
#### Creating a Post
Use the client (compiled from Ex4 server) to send a request to create a post.
The upgraded Ex3 server will handle the request and interact with MongoDB to store the new post.
#### Editing a Post
Use the client to send a request to edit a post.
The upgraded Ex3 server will handle the request and update the post details in MongoDB.
#### Deleting a Post
Use the client to send a request to delete a post.
The upgraded Ex3 server will handle the request and remove the post from MongoDB.
#### Viewing Posts
Use the client to send a request to view posts.
The upgraded Ex3 server will fetch the posts from MongoDB and send them back to the client for display.





