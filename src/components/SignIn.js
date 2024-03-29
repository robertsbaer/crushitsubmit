import { useSignInEmailPassword } from '@nhost/react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import styles from '../styles/components/SignIn.module.css';
import Input from './Input';
import Spinner from './Spinner';

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();

  const allowedEmails = [
    process.env.REACT_APP_ALLOWED_EMAIL,
    process.env.REACT_APP_ALLOWED_EMAIL_2
  ];


  const { signInEmailPassword, isLoading, isSuccess, needsEmailVerification, isError, error } =
    useSignInEmailPassword()

    const handleOnSubmit = (e) => {
      e.preventDefault();
  
      if (allowedEmails.includes(email)) {
        signInEmailPassword(email, password);
      } else {
        // Handle the error for unauthorized email
        alert('Unauthorized email');
      }
    };

  const handleResetPasswordClick = () => {
    navigate('/reset-password');
  };

  if (isSuccess) {
    return <Navigate to="/" replace={true} />
  }

  const disableForm = isLoading || needsEmailVerification

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles['logo-wrapper']}>
        <img src={process.env.PUBLIC_URL + '/../public/logo.svg'} alt="logo" />
        </div>
        {needsEmailVerification ? (
          <p className={styles['verification-text']}>
            Please check your mailbox and follow the verification link to verify your email.
          </p>
        ) : (
          <form onSubmit={handleOnSubmit} className={styles.form}>
            <Input
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={disableForm}
              required
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={disableForm}
              required
            />

            <button type="submit" disabled={disableForm} className={styles.button}>
              {isLoading ? <Spinner size="sm" /> : 'Signin'}
            </button>

            {isError ? <p className={styles['error-text']}>{error?.message}</p> : null}
          </form>
        )}
      </div>

      <p className={styles.text}>
        No account yet?{' '}
        <Link to="/sign-up" className={styles.link}>
          Sign up
        </Link>
        <button onClick={handleResetPasswordClick}>Reset Password</button>
      </p>
    </div>
  )
}

export default SignIn