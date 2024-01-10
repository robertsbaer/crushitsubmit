import styles from "../styles/pages/Dashboard.module.css";

import { Helmet } from "react-helmet";
import { useOutletContext } from "react-router-dom";
import DataDownloadComponent from "../components/Download";
import Restaurants from '../components/Restaurants';

const Dashboard = () => {
  const { user } = useOutletContext();

  return (
    <>
      <Helmet>
        <title>Dashboard - Nhost</title>
      </Helmet>

      <div>
        <p className={styles["welcome-text"]}>
          Welcome,
          {user?.metadata?.firstName && user?.metadata?.lastName
            ? ` ${user.metadata.firstName} ${user.metadata.lastName}`
            : user?.metadata?.firstName
            ? ` ${user.metadata.firstName}`
            : " stranger"}
          <span role="img" alt="hello">
            👋
          </span>
        </p>

        <h2 className={styles.title}>
          Submit a new restaurant and food challenge
        </h2>
        <div>
          <Restaurants />
          {/* <AddRestaurant /> */}
        </div>
        <DataDownloadComponent/>
      </div>
    </>
  );
};

export default Dashboard;
