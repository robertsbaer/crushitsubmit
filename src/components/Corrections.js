import React from "react";
import { useSubscription, useMutation, gql } from "@apollo/client";
import './Corrections.css';

const GET_CORRECTIONS = gql`
  subscription GetCorrections {
    corrections {
      id
      restaurant
      address
      correction
    }
  }
`;

const DELETE_CORRECTION = gql`
  mutation DeleteCorrection($id: uuid!) {
    delete_corrections(where: {id: {_eq: $id}}) {
        affected_rows
    }
  }
`;

const Corrections = () => {
  const { loading, error, data } = useSubscription(GET_CORRECTIONS);
  const [deleteCorrection] = useMutation(DELETE_CORRECTION);

  const handleDelete = (id) => {
    deleteCorrection({ variables: { id } });
    // Optionally refetch the corrections or update the cache
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="corrections-container">
      <h2>Subscription Corrections</h2>
      <ul className="corrections-list">
        {data.corrections.map(({ id, restaurant, address, correction }) => (
          <li key={id} className="correction-item">
            <h3 className="restaurant-name">{restaurant}</h3>
            <p className="address">Address: {address}</p>
            <p className="correction">Correction: {correction}</p>
            <button onClick={() => handleDelete(id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Corrections;
