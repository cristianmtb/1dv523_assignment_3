# Examination 3 Report
### Auhtor
Cristian Babesh - cb223ai
## URL
https://46.101.156.130/  
I used Digital Ocean for hosting.
## Node Modules used
#### ExpressJS
#### ReactJS
   Chose it because I find it fast and easy to build front ends with. Also it offers XSS protection by default.
#### Express-ws
  https://www.npmjs.com/package/express-ws
  Offers WebSocket endpoints for express. I chose websockets because they offer more freedom than libraries like Socket.io
#### Octonode
  https://github.com/pksunkara/octonode
  Suggested in the assignment in order to authenticate github api calls.
#### Express-github-webhook
  https://github.com/Gisonrg/express-github-webhook
  Like octonode but for the webhook. It also makes sure the POST request comes from github.
#### Dotenv
  https://www.npmjs.com/package/dotenv
  Required in order to use the .env file for environment variable
## Security
  To make the application secure I took the following stepts:
  #### Code
  1. I tried to follow best practice rules when writting the code.
  1. All websocket messages from the client are ignored by the server.
  1. I didn't send possibly important information received from github to the client. For example the client never recevies any internal entity IDs that github send with the webhook and can possibly be used to reference the issues or the comments.
  1. I used a few external dependencies as possible and only used the most recent releases of them.
  #### Server
  1. Used a well establish hosting/infrastructure service: Digital Ocean
  1. Made sure to follow their setup instructions as close as possible.
  1. Configured the websocket to use wss instead of ws, which is the secured version.
  1. Configured the firewall on the server to only allow nginx and the SSH client to use the network. The server only listens to ports 22 (OpenSSH), 80 (nginx) and 443 (nginx).
  1. Configured nginx to use HTTPS as opposed to HTTP.
  1. When configuring nginx for HTTPS I generated an 4096 bits DH group for the TLS handshake as described here: https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-18-04#step-4-%E2%80%93-enabling-the-changes-in-nginx Step 1, at the end. The long DH group is supposed to provide more secure TLS encryption for the connections.
## Dev vs Production
The most striking difference between development and production is for React, where in order to go from development to production you have to build the project, the built being closer to a classic static website rather than a nodeJS application.

ExpressJS remains relatively the same between dev and production, with the difference being that instead of having it now in localhost you have the server exposed to the internet, so it's important to have good security before doing so.
## Reverse proxy
A reverse proxy does the communication with the client on the behalf of the actual web server. This way the server architecture/infrastucture can be hidden from outside view, so they provide anonimity for the actual servers. Furthermore reverse proxy can transforms requests from HTTPS to HTTP, thus allowing the server to use HTTP, which is a lot faster and simpler to code and maintain. A third thing some reverse proxy do is load balacing, which means that if there are 3 servers that provide the same service they will direct calls in such a way that no server is overloaded.

In our case I use nginx for anonimity and for converting between HTTPS and HTTP.
## Process manager
A process manager, PM2 in our case, makes sure the applications registered under it are running at all time. It also logs all events that happen during the lifetime of the application and, depending on how they are configured, they also restart the application if a crash occurs.

In my situation I used the default setup and options that Digital Ocean provides in their guide since it's the first time using such a program. According to the guides it is supposed to keep the application going indefinetly and restart the application in case of crashes or if the server reboots for any reason.
## TLS certificates
TLS stands for Transport Layer Security and it is a replacement for the SSL protocol. A TLS certificate is proof that the server in questions owns the public key based on which the encrypted communication will take place. 

In our case I had to self sign the TLS certificate, because most authorities that require you to have a domain name, while I only used the IP of the server. In an ideal situation the best course of action would be to buy a domaine name and register the certificate to it. I needed to have a TLS certificate in order to use HTTPS.
## Environment variables
An environment variable is setup seperately from the code and it's useful when you have a general variable you need to use in multiple places throughout the your application, but you also need to change it easily. A good example would be a url for a server that you make multiple calls to.

In my case I only used environment variables both in React and in Express to hold the ports at which the two applications listen to (for react only in development). Also for Express, I hold the github secret key in an environment variable.
