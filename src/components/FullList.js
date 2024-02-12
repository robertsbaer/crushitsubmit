import { gql, useMutation, useSubscription } from "@apollo/client";
import React, { useState } from "react";
import styles from "../styles/components/FullList.module.css";

const GET_RESTAURANTS = gql`
  subscription Restaurants {
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

const UPDATE_MENU_ITEM = gql`
  mutation UpdateMenuItem($id: uuid!, $image: String!) {
    update_menu_item_by_pk(pk_columns: { id: $id }, _set: { image: $image }) {
      id
      image
    }
  }
`;

function FullList() {
    const { data, loading, error } = useSubscription(GET_RESTAURANTS);
    const [searchTerm, setSearchTerm] = useState("");
  const [updateMenuItem] = useMutation(UPDATE_MENU_ITEM);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);


  const handleImageUpdate = async () => {
    try {
      await updateMenuItem({
        variables: {
          id: selectedMenuItemId,
          image: newImageUrl,
        },
      });
      alert("Image updated successfully!");
      setNewImageUrl(""); // Reset the newImageUrl state to force a re-render
    } catch (error) {
      console.error("Error updating image: ", error.message);
    }
  };

  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
  
    const restaurants = data?.restaurants || [];
  
    const filteredRestaurants = searchTerm
    ? restaurants.filter(restaurant => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const searchTermsArray = lowerCaseSearchTerm.split(/\s+/);

        const nameMatch = searchTermsArray.every(term => 
          restaurant.name.toLowerCase().includes(term)
        );

        // Updated check for menu_item object including title
        const menuItemMatch = restaurant.menu_item && searchTermsArray.every(term => 
          restaurant.menu_item.details.toLowerCase().includes(term) || 
          restaurant.menu_item.title.toLowerCase().includes(term)
        );

        return nameMatch || menuItemMatch;
    })
    : restaurants;

  
    return (
      <>
        <input
          type="text"
          placeholder="Search Restaurants"
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.restaurantlistsearch}
        />
        {filteredRestaurants.map(
          ({
            id,
            name,
            phone_number,
            latitude,
            longitude,
            address,
            menu_item,
          }) => (
            <div key={id} className={styles.restaurantlist}>
              <div className={styles.restaurantheader}>
                <h3>{id}</h3>
                <h3>{name}</h3>
              </div>
              <div className={styles.restaurantinfo}>
                <p>Phone: {phone_number}</p>
                <p>
                  Location: {latitude}, {longitude}
                </p>
                <p>Address: {address}</p>
              </div>
              {menu_item && (
                <div className={styles.menuitem}>
                  <div>{menu_item.id}</div>
                  <div className={styles.menuitemheader}>{menu_item.title}</div>
                  <img src={menu_item.image} alt={menu_item.title} />
                  <div className={styles.menuitemdetails}>
                    <p>Details: {menu_item.details}</p>
                    <p>Price: {menu_item.price}</p>
                    <p>Price if Won: {menu_item.price_if_won}</p>
                    <p>Prize: {menu_item.prize}</p>
                  </div>
                  <input
            type="url"
            placeholder="New Image URL"
            onChange={(e) => {
              setNewImageUrl(e.target.value);
              setSelectedMenuItemId(menu_item.id);
            }}
          />
          <button onClick={handleImageUpdate}>Update Image</button>
                </div>
              )}
            </div>
          )
        )}
      </>
    );
  }
  

export default FullList;
