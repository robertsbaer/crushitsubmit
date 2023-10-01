import React, { useState } from "react";
import { useMutation, gql, useApolloClient } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";

const ADD_MENU_ITEM = gql`
  mutation CreateMenuItem(
    $id: uuid!
    $title: String!
    $details: String!
    $price: numeric!
    $priceIfWon: numeric!
    $prize: String!
    $numberOfWinners: Int!
    $image: String!
  ) {
    insert_menu_item(
      objects: {
        id: $id
        title: $title
        details: $details
        price: $price
        price_if_won: $priceIfWon
        prize: $prize
        number_of_winners: $numberOfWinners
        image: $image
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const ADD_RESTAURANT = gql`
  mutation CreateRestaurant(
    $name: String!
    $phone_number: String!
    $latitude: numeric!
    $longitude: numeric!
    $address: String!
    $menuItemId: uuid!
  ) {
    insert_restaurants(
      objects: {
        name: $name
        phone_number: $phone_number
        latitude: $latitude
        longitude: $longitude
        address: $address
        menu_item_id: $menuItemId
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const CHECK_RESTAURANT_EXISTS = gql`
  query CheckRestaurantExists($name: String!) {
    restaurants(where: { name: { _eq: $name } }) {
      id
    }
  }
`;

const AddRestaurant = () => {
  const client = useApolloClient();
  const [addMenuItem] = useMutation(ADD_MENU_ITEM);
  const [addRestaurant] = useMutation(ADD_RESTAURANT);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    latitude: "",
    longitude: "",
    address: "",
    menuItemTitle: "",
    menuItemDetails: "",
    menuItemPrice: "",
    menuItemPriceIfWon: "",
    menuItemPrize: "",
    menuItemNumberOfWinners: "",
    menuItemImage: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    console.log("handleSubmit called");
    e.preventDefault();

    // Check if the restaurant already exists
    const { data } = await client.query({
        query: CHECK_RESTAURANT_EXISTS,
        variables: { name: formData.name },
      });
      if (data.restaurants.length > 0) {
        alert("A restaurant with this name already exists!");
        return;
      }

    const newId = uuidv4(); // Generate a new UUID

    try {
      // First, create the menu_item record:
      await addMenuItem({
        variables: {
          id: newId,
          title: formData.menuItemTitle,
          details: formData.menuItemDetails,
          price: parseFloat(formData.menuItemPrice),
          priceIfWon: parseFloat(formData.menuItemPriceIfWon),
          prize: formData.menuItemPrize,
          numberOfWinners: parseInt(formData.menuItemNumberOfWinners, 10),
          image: formData.menuItemImage,
        },
      });

      // Then, create the restaurant record with the same UUID:
      await addRestaurant({
        variables: {
          name: formData.name,
          phone_number: formData.phone_number,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          address: formData.address,
          menuItemId: newId,
        },
      });

      alert("Restaurant and menu item added successfully!");
    } catch (error) {
      console.error("Error adding restaurant and menu item: ", error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <input
        type="text"
        name="name"
        placeholder="Restaurant Name"
        onChange={handleInputChange}
        value={formData.name}
        required
        style={{
          padding: 20,
          margin: 15,
          backgroundColor: "pink",
          width: "50%",
        }}
      />
      <input
        type="text"
        name="phone_number"
        placeholder="Phone Number"
        onChange={handleInputChange}
        value={formData.phone_number}
        required
        style={{
          padding: 20,
          margin: 15,
          backgroundColor: "pink",
          width: "50%",
        }}
      />
      <input
        type="text"
        step="any"
        name="latitude"
        placeholder="Latitude"
        onChange={handleInputChange}
        value={formData.latitude}
        required
        style={{
          padding: 20,
          margin: 15,
          backgroundColor: "pink",
          width: "50%",
        }}
      />
      <input
        type="text"
        step="any"
        name="longitude"
        placeholder="Longitude"
        onChange={handleInputChange}
        value={formData.longitude}
        required
        style={{
          padding: 20,
          margin: 15,
          backgroundColor: "pink",
          width: "50%",
        }}
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        onChange={handleInputChange}
        value={formData.address}
        required
        style={{
          padding: 20,
          margin: 15,
          backgroundColor: "pink",
          width: "50%",
        }}
      />
      {/* Menu Item Fields */}
      <input
        type="text"
        name="menuItemTitle"
        placeholder="Menu Item Title"
        onChange={handleInputChange}
        value={formData.menuItemTitle}
        required
        style={{
          padding: 20,
          margin: 15,
          backgroundColor: "pink",
          width: "50%",
        }}
      />
      <textarea
        name="menuItemDetails"
        placeholder="Menu Item Details"
        onChange={handleInputChange}
        value={formData.menuItemDetails}
        required
        style={{
          padding: 20,
          margin: 15,
          backgroundColor: "pink",
          width: "50%",
        }}
      />
      <input
        type="text"
        step="any"
        name="menuItemPrice"
        placeholder="Price"
        onChange={handleInputChange}
        value={formData.menuItemPrice}
        required
        style={{
          padding: 20,
          margin: 15,
          backgroundColor: "pink",
          width: "50%",
        }}
      />
      <input
        type="text"
        step="any"
        name="menuItemPriceIfWon"
        placeholder="Price If Won"
        onChange={handleInputChange}
        value={formData.menuItemPriceIfWon}
        required
        style={{
          padding: 20,
          margin: 15,
          backgroundColor: "pink",
          width: "50%",
        }}
      />
      <textarea
        type="text"
        name="menuItemPrize"
        placeholder="Prize"
        onChange={handleInputChange}
        value={formData.menuItemPrize}
        required
        style={{
          padding: 20,
          margin: 15,
          backgroundColor: "pink",
          width: "50%",
        }}
      />
      <input
        type="text"
        name="menuItemNumberOfWinners"
        placeholder="Number of Winners"
        onChange={handleInputChange}
        value={formData.menuItemNumberOfWinners}
        style={{
          padding: 20,
          margin: 15,
          backgroundColor: "pink",
          width: "50%",
        }}
      />
      <input
        type="url"
        name="menuItemImage"
        placeholder="Image URL"
        onChange={handleInputChange}
        value={formData.menuItemImage}
        required
        style={{
          padding: 20,
          margin: 15,
          backgroundColor: "pink",
          width: "50%",
        }}
      />
      <button type="submit" style={{ padding: 30, margin: 15 }}>
        Submit
      </button>
    </form>
  );
};

export default AddRestaurant;
