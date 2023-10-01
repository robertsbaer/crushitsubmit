import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_RESTAURANTS = gql`
  query Restaurants {
    restaurants {
      id
      name
      phone_number
      latitude
      longitude
      address
      menu_item {
        id
        details
        title
        image
        number_of_winners
        price
        price_if_won
        prize
      }
    }
  }
`;

const Restaurants = () => {
  const { loading, error, data } = useQuery(GET_RESTAURANTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  return (
    <div>
      {data.restaurants.map(
        ({
          id,
          name,
          phone_number,
          latitude,
          longitude,
          address,
          menu_item,
        }) => (
          <div key={id} style={{backgroundColor: "pink", padding: 20, margin: 20}}>
            <h2>{name}</h2>
            <p>Phone: {phone_number}</p>
            <p>
              Location: {latitude}, {longitude}
            </p>
            <p>Address: {address}</p>
            {menu_item && (
              <ul>
                <li key={menu_item.id}>
                  {menu_item.title}: ${menu_item.price}<br />
                  {menu_item.details}<br />
                  <img src={menu_item.image} alt={menu_item.title} style={{height: 100, width: 100}}/>
                  {/* ...other item fields */}
                </li>
              </ul>
            )}
          </div>
        )
      )}
    </div>
  );

};

export default Restaurants;
