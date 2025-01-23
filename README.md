# Well Spender

Well Spender is a user-friendly budgeting and expense management application designed to help users keep track of their finances effectively to achieve their financial goals efficiently.

## clone or download
```terminal
$ git clone https://github.com/KunKid-cmd/WellSpender.git
```

# Usage

notice, you need Frontend and Backend runs concurrently in different terminal session, in order to make them talk to each other

## Server-side usage

### Prepare your secret

(You need to add a `ACCESS_TOKEN_SECRET`, `PORT` and `MongoDB_Key` in `.env` to before you can run the server)

### Start

```terminal
$ cd backend  // go to server folder
$ npm i       // npm install packages
$ npm run start // run it locally
```

## Client-side usage

(You need provide `BASE_URL` to backend server in `frontend/well-spender-app/src/utils/constants.js` to make frontend connect to backend)

```terminal
$ cd frontend/well-spender-app/      // go to client folder
$ npm i                              // npm install packages
$ npm run dev                        // run it locally
```

# Dependencies(tech-stacks)
Client-side | Server-side
--- | ---
axios: ^1.7.9 | bcrypt: ^5.1.1
react: ^18.3.1 | cors: ^2.8.5
react-dom: ^18.3.1 | dotenv: ^16.4.7
react-router-dom: ^7.1.1 | express: ^4.21.2
react-toastify: ^11.0.3 | jsonwebtoken: ^9.0.2
 | mongoose: ^8.9.5
 | nodemon: ^3.1.9

# Sample screenshots of this project

dashboard
![image](https://github.com/user-attachments/assets/f1a89374-246a-4c00-ade7-c63d40b8274f)

Add transaction
![image](https://github.com/user-attachments/assets/fc08e1c7-9a9d-492c-9978-d43608807411)


