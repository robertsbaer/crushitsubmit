import { useState } from 'react';
import { useChangePassword } from '@nhost/react';
import styles from '../styles/components/ResetPassword.module.css';

const ResetPassword = ({ token }) => {
  const [password, setPassword] = useState('');
  const { changePassword, isLoading, isSuccess, isError, error } = useChangePassword();

  const validatePassword = (password) => {
    // Example validation: minimum 8 characters, at least one number, one uppercase, one lowercase
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      // Handle invalid password format
      console.error("Password doesn't meet the required format");
      return;
    }
    try {
      await changePassword(token, password);
    } catch (err) {
      // Handle the error if the password change fails
      console.error(err);
    }
  };

  if (isSuccess) {
    return <p>Password updated successfully. Please reopen the app to continue.</p>;
  }

  return (
    <div className={styles.resetPasswordContainer}>
      <form className={styles.resetPasswordForm} onSubmit={handleOnSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Reset Password'}
        </button>
        {isError && error ? <p>{error.message}</p> : null}
      </form>
    </div>
  );
};

export default ResetPassword;
