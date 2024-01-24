import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Helmet } from 'react-helmet';
import styles from '../styles/pages/FeedbackStyles.module.css';

const GET_FEEDBACK = gql`
  subscription Feedback {
    feedbackform {
      id
      user
      title
      feedback
    }
  }
`;

const GET_USERS = gql`
  query Users {
    users {
      id
      displayName
    }
  }
`;

const DELETE_FEEDBACK = gql`
  mutation delete_feedbackform($feedbackItemId: uuid!) {
    delete_feedbackform(where: {id: {_eq: $feedbackItemId}}) {
      affected_rows
    }
  }
`;


const Feedback = () => {
    const { loading: feedbackLoading, error: feedbackError, data: feedbackData } = useSubscription(GET_FEEDBACK);
    const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS);

    // useMutation hook for deleting feedback
    const [deleteFeedback, { loading: deleting, error: deleteError }] = useMutation(DELETE_FEEDBACK, {
        update(cache, { data: { deleteFeedback } }) {
            cache.modify({
                fields: {
                    feedbackform(existingFeedbackRefs, { readField }) {
                        return existingFeedbackRefs.filter(feedbackRef => readField('id', feedbackRef) !== deleteFeedback.id);
                    }
                }
            });
        }
    });

    // Function to handle delete button click
    const handleDelete = (feedbackItemId) => {
      deleteFeedback({ variables: { feedbackItemId } });
  };

    if (feedbackLoading || usersLoading) return <p>Loading...</p>;
    if (feedbackError) return <p>Error: {feedbackError.message}</p>;
    if (usersError) return <p>Error: {usersError.message}</p>;
    if (deleteError) return <p>Error in delete operation: {deleteError.message}</p>;

    let feedbackWithUserNames = [];
    if (usersData && feedbackData) {
        feedbackWithUserNames = feedbackData.feedbackform.map(fb => {
          const user = usersData.users.find(u => u.id === fb.user);
          return {
            ...fb,
            userDisplayName: user ? user.displayName : 'Unknown User'
          };
        });
    }

    return (
      <>
        <Helmet>
          <title>Feedback - Crush'd</title>
        </Helmet>

        <div className={styles.feedbackContainer}>
          <h2>Feedback</h2>
          {feedbackWithUserNames.map((feedback) => (
            <div key={feedback.id} className={styles.feedbackEntry}>
              <h3>{feedback.title}</h3>
              <p>By: {feedback.userDisplayName}</p>
              <p>{feedback.feedback}</p>
              <button onClick={() => handleDelete(feedback.id)}>Delete</button>
            </div>
          ))}
        </div>
      </>
    );
};

export default Feedback;

