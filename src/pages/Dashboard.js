import styles from '../styles/pages/Dashboard.module.css';

import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// import Restaurants from '../components/Restaurants';
import AddRestaurant from '../components/AddRestaurant';

const Dashboard = () => {
  const { user } = useOutletContext();

  return (
    <>
      <Helmet>
        <title>Dashboard - Nhost</title>
      </Helmet>

      <div>
        <h2 className={styles.title}>Dashboard</h2>

        <p className={styles['welcome-text']}>
          Welcome, {user?.metadata?.firstName || 'stranger'}{' '}
          <span role="img" alt="hello">
            👋
          </span>
        </p>
        <div>
        {/* <Restaurants /> */}
        <AddRestaurant/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
