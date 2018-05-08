import React from 'react';

import Login from './Login';

const About = () => (
  <div>
    <Login />
    <div id="about-detail">
      <h1>Welcome to Harker Courses</h1>
      <h2>Why?</h2>
      <p>
        Harker students are very fortunate to be able to be
        able to choose from a variety of electives.
      </p>

      <p>
        Harker Courses serve to give information to students about
        different electives and what they can expect out of the class.
        This way, students can best plan their four years at Harker in
        order to maximize their educational opportunity.
      </p>
      <h2>Leaving reviews</h2>
      <p>
        In order to leave a review, you need to be logged into your
        student account. This is only to verify that you are a Harker
        student. Any reviews that you leave will be authored as anonymous.
      </p>
      <p>
        Review content must be Harker appropriate. Try to focus reviews on
        amount of work, material in class, and what you got most out of the
        class.
      </p>

      <h2>BNBR</h2>
      <p>
        Stands for Be Nice Be Respectful. No racism, sexism, or other such
        -isms will be tolerated. We reserve the right to delete any review that
        breaks the Terms of Service. Please do not use this as a platform to
        personally attack teachers.
      </p>
    </div>
  </div>
);

export default About;
