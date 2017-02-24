# harker-courses :apple:

## Development To-Do

- Organize and render list of courses to browse on home page
- Generate individual course pages for each course
- Move review form to each course page, such that the course ID/name does not need to be a field in filling out the review.
- Add TravisCI for deployment


## Details

### Course Pages

Each course page will be rendered with the specific ID of the course, so that each course has a unique webpage with course specific content.

Each course will show the reviews that have been posted, and offer a form to submit a review for that specific course on the right side of the page (as shown in the design).

### Verification/Login

Due to anonymity, we will need to verify if students are from Harker or not. In order to do this, students will log into their Google account (student account), but post anonymously. This is also to be able to track and maintain malicious activity and posts, and ban from the platform if necessary.

Login for Google will be done through Firebase.

When signed in, account information will not be shown in header, as we want to remind that each post will be previewed on the website anonymously. That way, we only have to show the Login button if relevant.
