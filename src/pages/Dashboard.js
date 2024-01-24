import { gql, useSubscription } from "@apollo/client";
import { useUserData } from "@nhost/react";
import { Helmet } from "react-helmet";
import styles from "../styles/pages/Dashboard.module.css";

const GET_FEEDBACK_COUNT = gql`
  subscription FeedbackCount {
    feedbackform_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const GET_RESTAURANTS_COUNT = gql`
  subscription RestaurantsCount {
    restaurants_submit_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const Dashboard = () => {
  const users = useUserData();
  const { data: feedbackCountData, error: feedbackCountError } = useSubscription(GET_FEEDBACK_COUNT);
  const { data: restaurantsCountData, error: restaurantsCountError } = useSubscription(GET_RESTAURANTS_COUNT);

  if (feedbackCountError) {
    console.error("Error subscribing to feedback count:", feedbackCountError);
  }

  if (restaurantsCountError) {
    console.error("Error subscribing to restaurants count:", restaurantsCountError);
  }

  const feedbackCount = feedbackCountData?.feedbackform_aggregate?.aggregate?.count ?? 'Loading...';
  const restaurantsCount = restaurantsCountData?.restaurants_submit_aggregate?.aggregate?.count ?? 'Loading...';

  const boxStyle = {
    fontSize: "24px",
    width: "200px",
    height: "200px",
    padding: "20px",
    margin: "20px",
    textAlign: "center",
    boxSizing: "border-box",
    backgroundColor: "#fafafa"
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Nhost</title>
      </Helmet>

      <div>
        <p className={styles["welcome-text"]}>
          Welcome, {users?.displayName}
          <span role="img" aria-label="hello">
            👋
          </span>
        </p>
        <div>
          <p style={boxStyle}>
            Feedback count: {feedbackCount}
          </p>
          <p style={boxStyle}>
            Restaurants count: {restaurantsCount}
          </p>
          {/* Add other notifications */}
        </div>
        {/* <DataDownloadComponent/> */}
      </div>
    </>
  );
};

export default Dashboard;
