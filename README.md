# harker-courses

## Available Courses

This platform will have required courses (for the sake of determining Regular/Honors), as well as offered electives, even if the course is not available for the current year.

## Organization/Search

Sorting will (probably) be based on the organization of the course list provided on the Harker website. There will also be a search bar, which will have a dropdown of the following courses.

Each course will have an individual page based on course id, which search and direct link will lead to.

## Course Page Layout

The course page will consist of the ratings on top, and then a feed of reviews given by date. At the bottom, there will be a link to submit a review, which will lead the user to the review page, with the course id already filled out as a parameter in the form.

## Submit Review Page

Will have three parameters.

1. Course name/ID
2. Ratings (hardness, work load, etcc)
3. Verification Questionm

## Verification

Due to anonymity, we will need to verify if students are from Harker or not. In order to do this, there will be a set of questions asking about Harker, such as the names of certain buildings, or the names of administrators. A user will be able to cycle through at most 3 questions, all appearing in random order.

## Usage

### To run:

`git clone https://github.com/aggarwalneeraj141/harker-courses`

Create a folder `credentials`, and inside, `credentials.js`. Inside of this file, add your Firebase configuration script. So,

```
  var config = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "<SENDER_ID>",
  };
  firebase.initializeApp(config);
```

`npm install`

`npm start`

### To deploy:

`npm run build`

`npm run deploy`
