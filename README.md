# User Documentation/Manual
To run the project, follow the project setup for the frontend and the backend. Then, the project can be accessed at `localhost:3000`.
## Project Setup - Frontend

The frontend is located in the `/frontend` directory of the project.
### Dependencies
#### npm
Project is created using React so we need Node.js and npm to run the project and install the dependencies
Installation guide: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
#### nvm
Node version management to ensure that the correct node version is used when installing the packages
Installation guide: https://github.com/nvm-sh/nvm

### Running the Project
1. Before running the project, move into the frontend directory and the user needs to run `nvm use` to ensure the right node version is used. Follow the instructions to install the appropriate node version.
2. Once the node version is installed, run `npm install` to install the packages necessary to run the project
3. After the packages are installed, run `npm run start` to start the project on localhost port 3000 which you can access at `localhost:3000`
## Project Setup - Backend
### Dependencies
#### Docker
The backend can be deployed on any operating system under the condition that docker is installed.
Follow these instructions to install docker
#### Docker-compose
Docker-compose creates the networking between the java backend and the postgreSQL database.
Follow these instructions to install docker-compose

### Running the Project
1. In the root project directory, run `./gradlew bootJar`. This creates an executable jar file.
2. Run `docker-compose up --build -d`. This builds and runs the web and database docker containers.

# Restarting the database
`docker-compose down && docker volume rm property-management-data && docker volume create --name=property-management-data`
