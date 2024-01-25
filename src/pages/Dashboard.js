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

const GET_RESTAURANT_TOTAL_COUNT = gql`
  subscription RestaurantsCount {
    restaurants_aggregate {
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

const GET_USERS_COUNT = gql`
  subscription users {
    usersAggregate {
      aggregate {
        count
      }
    }
  }
`;

const GET_CORRECTIONS_COUNT = gql`
  subscription corrections {
    corrections_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const Dashboard = () => {
  const users = useUserData();
  const { data: feedbackCountData, error: feedbackCountError } =
    useSubscription(GET_FEEDBACK_COUNT);
  const { data: restaurantsCountData, error: restaurantsCountError } =
    useSubscription(GET_RESTAURANTS_COUNT);
  const { data: restaurantsTotalCountData, error: restaurantsTotalCountError } =
    useSubscription(GET_RESTAURANT_TOTAL_COUNT);
  const { data: userCountData, error: userCountError } =
    useSubscription(GET_USERS_COUNT);
  const { data: correctionsCountData, error: correctionsCountError } =
    useSubscription(GET_CORRECTIONS_COUNT);

  if (feedbackCountError) {
    console.error("Error subscribing to feedback count:", feedbackCountError);
  }

  if (restaurantsCountError) {
    console.error(
      "Error subscribing to restaurants count:",
      restaurantsCountError
    );
  }
  if (restaurantsTotalCountError) {
    console.error(
      "Error subscribing to restaurants count:",
      restaurantsTotalCountError
    );
  }
  if (userCountError) {
    console.error(
      "Error subscribing to restaurants count:", 
      userCountError
    );
  }
  if (correctionsCountError) {
    console.error(
      "Error subscribing to restaurants count:",
      correctionsCountError
    );
  }
  const feedbackCount =
    feedbackCountData?.feedbackform_aggregate?.aggregate?.count ?? 
    "Loading...";
  const restaurantsCount =
    restaurantsCountData?.restaurants_submit_aggregate?.aggregate?.count ??
    "Loading...";
  const restaurantsTotalCount =
    restaurantsTotalCountData?.restaurants_aggregate?.aggregate?.count ??
    "Loading...";
  const userCount =
    userCountData?.usersAggregate?.aggregate?.count ?? 
    "Loading...";
  const correctionsCount =
    correctionsCountData?.corrections_aggregate?.aggregate?.count ??
    "Loading...";

  const boxStyle = {
    fontSize: "24px",
    width: "280px",
    height: "200px",
    padding: "10px",
    margin: "10px",
    textAlign: "center",
    boxSizing: "border-box",
    backgroundColor: "#fafafa",
  };

  const boxRow = {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
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
        <div style={boxRow}>
          <p style={boxStyle}>
            Feedback count: <br />
            <br />
            {feedbackCount}
          </p>
          <p style={boxStyle}>
            Restaurants To Add: <br />
            <br />
            {restaurantsCount}
          </p>
          <p style={boxStyle}>
            Restaurants in Total <br />
            <br />
            {restaurantsTotalCount}
          </p>
          <p style={boxStyle}>
            Number of Users <br />
            <br />
            {userCount}
          </p>
          <p style={boxStyle}>
            Number of Corrections <br />
            <br />
            {correctionsCount}
          </p>
        </div>
        {/* <DataDownloadComponent/> */}
      </div>
    </>
  );
};

export default Dashboard;
