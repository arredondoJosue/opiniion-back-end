# opiniion-back-end

### Steps to run: 
``npm install``

- In the backendChallenge (1).txt file, I have provided the .env file creds that contains the mongodb credentials so that you can access the db I setup and test on your end. Its a read-only access for now but can alter if you need/want. 
- Once you have this info, create a .env file and paste them in
- then run: ``npx nodemon index.js``
- you should be able to then run api calls using postman/insomnia etc. if you aren't using the frontend interface
- hit at ``localhost:4000/user/logs``
- I implimented two methods that you can interchange in index.js by simply removing or adding the '2' in the api call. The first uses plain mongo and the second one uses mongoose. 



