import React from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';

// Define your GraphQL query
const YOUR_GRAPHQL_QUERY = gql`
query data {
    restaurants {
      id
      name
      phone_number
      address
      latitude
      longitude
      menu_item_id
      menu_item {
        id
        title
        details
        image
        price
        price_if_won
        prize
      }
    }
  }
`;

const DataDownloadComponent = () => {
  const { loading, error, data } = useQuery(YOUR_GRAPHQL_QUERY);

  // Function to trigger the download
  const downloadData = () => {
    const jsonData = JSON.stringify(data); // Convert data to JSON
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {/* Display your data */}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

      {/* Button to trigger the download */}
      <button onClick={downloadData}>Download Data</button>
    </div>
  );
};

export default DataDownloadComponent;