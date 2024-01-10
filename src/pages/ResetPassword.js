import { useResetPassword } from '@nhost/react';
import { useState } from 'react';
import styles from '../styles/components/ResetPassword.module.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { resetPassword, isLoading, isSuccess, isError, error } = useResetPassword();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    resetPassword(password);
  }

  if (isSuccess) {
    return <p>Please reopen the app to continue.</p>
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
        {isError ? <p>{error?.message}</p> : null}
      </form>
    </div>
  );
};

export default ResetPassword;