import styles from "../styles/pages/Dashboard.module.css";

import { useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet";
// import Restaurants from '../components/Restaurants';
import AddRestaurant from "../components/AddRestaurant";

const Dashboard = () => {
  const { user } = useOutletContext();

  return (
    <>
      <Helmet>
        <title>Dashboard - Nhost</title>
      </Helmet>

      <div>
      <p className={styles['welcome-text']}>
  Welcome, 
  {user?.metadata?.firstName && user?.metadata?.lastName 
    ? ` ${user.metadata.firstName} ${user.metadata.lastName}` 
    : user?.metadata?.firstName 
    ? ` ${user.metadata.firstName}` 
    : ' stranger'} 
  <span role="img" alt="hello">
    👋
  </span>
</p>


        <h2 className={styles.title}>
          Submit a new restaurant and food challenge
        </h2>
        <div>
          {/* <Restaurants /> */}
          <AddRestaurant />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
