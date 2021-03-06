# harker-courses :apple: [![Build Status](https://travis-ci.com/n3a9/harker-courses.svg?token=oqxxEvW7knppYxyBV7jq&branch=master)](https://travis-ci.com/n3a9/harker-courses)

An online platform for Harker students to leave reviews on courses. Deployed platform can be found at [http://tiny.cc/harkercourses](http://tiny.cc/harkercourses) or [http://harker-courses.surge.sh](http://harker-courses.surge.sh). The latest deployment will be the latest release.

## Project Set Up

### Install and Run

First install dependencies with `yarn` or `npm install` in project directory.

Then, begin the server with `yarn start` and head to [http://localhost:3000/](http://localhost:3000/).

### Build & Deploy

1. `yarn build`
2. `cd build`
3. Rename `index.html` to `200.html`
4. `surge`

### Linting

`eslint --fix [file/directory]`

## Technical Details

### Code Style

Use Airbnb's style guide found [here](https://github.com/airbnb/javascript/tree/master/react).

### Course Pages

Each course page will be rendered with the specific ID of the course, so that each course has a unique webpage with course specific content.

Each course will show the reviews that have been posted, and offer a form to submit a review for that specific course on the right side of the page (as shown in the design).

### Verification/Login

Due to anonymity, we will need to verify if students are from Harker or not. In order to do this, students will log into their student Google account, but post anonymously. This is also to be able to track and maintain malicious activity and posts, and ban from the platform if necessary.

Although anyone will be able to sign in with any Google account, Firebase will check if it is from the correct Harker domain before allowing write access to the database.

When signed in, account information will not be shown in header, as we want to remind that each post will be previewed on the website anonymously. That way, we only have to show the Login button if relevant.

## Technology

Built using React & Firebase

## Authors and Contributors

[Neeraj](https://github.com/n3a9) & [Sumer](https://github.com/firebolt55439)
