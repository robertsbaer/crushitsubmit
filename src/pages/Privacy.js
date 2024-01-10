
import { Helmet } from "react-helmet";
import { useOutletContext } from "react-router-dom";


const Privacy = () => {
  const { user } = useOutletContext();

  return (
    <>
      <Helmet>
        <title>Dashboard - Nhost</title>
      </Helmet>

      <div>
        <h2>Privacy Policy for Crush It</h2>
        <p>Last updated: December 30, 2023</p>
        <h3>1. Introduction</h3>
        <p>
          Welcome to Crush'd! This Privacy Policy is designed to help you
          understand how we collect, use, disclose, and safeguard your personal
          information. Please take a moment to review this policy carefully.
        </p>
        <h3>2. Information We Collect</h3>
        <p>
          a. <strong>Information You Provide</strong>: We may collect personal
          information you provide directly to us, such as your name, email,
          username, and other information when you create an account or
          communicate with us.
        </p>
        <h3>3. How We Use Your Information</h3>
        <p>
          a. <strong>Personalization</strong>: We may use your information to
          personalize your experience within the app.
        </p>
        <h3>4. Security</h3>
        <p>
          We take reasonable measures to protect your personal information from
          unauthorized access, disclosure, or alteration. However, no method of
          transmission over the internet or electronic storage is completely
          secure, and we cannot guarantee absolute security.
        </p>
        <h3>5. Your Choices</h3>
        <p>
          a. <strong>Access and Update</strong>: You may have the right to access
          and update the personal information we hold about you. You can do so by
          contacting us.
        </p>
        <p>
          b. <strong>Delete Account</strong>: You may have the option to delete
          your account and associated data.
        </p>
        <h3>7. Changes to this Policy</h3>
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will notify you of significant changes through the app or other means.
          By continuing to use Crush It after those changes become effective,
          you agree to be bound by the revised Privacy Policy.
        </p>
        <h3>8. Contact Us</h3>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy
          Policy or your personal information, please contact us at{' '}
          <a href="mailto:robertsbaer@yahoo.com">Contact@crushit.com</a>.
        </p>
        <p>9. Effective Date</p>
        <p>This Privacy Policy was last updated on October 30, 2023.</p>
      </div>

    </>
  );
};

export default Privacy;
