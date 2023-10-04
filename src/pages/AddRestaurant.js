import styles from '../styles/pages/Profile.module.css';

import { Helmet } from 'react-helmet';
import AddRestaurant from '../components/AddRestaurant';


const Profile = () => {


  return (
    <>
      <Helmet>
        <title>Profile - Nhost</title>
      </Helmet>

      <div style={{padding: 30}}>
        <div style={{padding: 30, fontSize: 20}}>
        <h2 className={styles.title}>
          Submit a new restaurant and food challenge
        </h2>
        </div>
        <AddRestaurant/>          
      </div>
    </>
  );
};

export default Profile;
