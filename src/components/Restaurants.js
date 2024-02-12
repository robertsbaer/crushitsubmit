import { gql, useMutation, useSubscription } from "@apollo/client";
import React, { useCallback, useState } from "react";
import "./Restaurants.css"; // Importing the CSS file

const GET_RESTAURANTS = gql`
  subscription Restaurants {
    restaurants_submit {
      id
      name
      phone_number
      latitude
      longitude
      address
      user
      menu_item_submit {
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

const UPDATE_RESTAURANT = gql`
  mutation UpdateRestaurant(
    $id: uuid!
    $name: String!
    $phone_number: String!
    $latitude: numeric
    $longitude: numeric
    $address: String!
  ) {
    update_restaurants_submit(
      where: { id: { _eq: $id } }
      _set: {
        name: $name
        phone_number: $phone_number
        latitude: $latitude
        longitude: $longitude
        address: $address
      }
    ) {
      affected_rows
      returning {
        id
        name
        phone_number
        address
        latitude
        longitude
      }
    }
  }
`;

const UPDATE_MENU_ITEM = gql`
  mutation UpdateMenuItem(
    $id: uuid!
    $details: String!
    $title: String!
    $image: String
    $number_of_winners: Int
    $price: numeric
    $price_if_won: numeric
    $prize: String
  ) {
    update_menu_item_submit(
      where: { id: { _eq: $id } }
      _set: {
        details: $details
        title: $title
        image: $image
        number_of_winners: $number_of_winners
        price: $price
        price_if_won: $price_if_won
        prize: $prize
      }
    ) {
      affected_rows
      returning {
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

const INSERT_MENU_ITEM = gql`
  mutation InsertMenuItem(
    $title: String!
    $details: String!
    $price: numeric!
    $priceIfWon: numeric!
    $prize: String!
    $image: String!
  ) {
    insert_menu_item(
      objects: {
        title: $title
        details: $details
        price: $price
        price_if_won: $priceIfWon
        prize: $prize
        image: $image
      }
    ) {
      returning {
        id
      }
    }
  }
`;

const INSERT_RESTAURANT = gql`
  mutation InsertRestaurant(
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

const DELETE_RESTAURANT = gql`
  mutation DeleteRestaurant($restaurantId: uuid!) {
    delete_restaurants_submit(where: { id: { _eq: $restaurantId } }) {
      affected_rows
    }
  }
`;

// Mutation to delete a menu item
const DELETE_MENU_ITEM = gql`
  mutation DeleteMenuItem($menuItemId: uuid!) {
    delete_menu_item_submit(where: { id: { _eq: $menuItemId } }) {
      affected_rows
    }
  }
`;

const Restaurants = () => {
  const { loading, error, data } = useSubscription(GET_RESTAURANTS);
  const [updateRestaurant] = useMutation(UPDATE_RESTAURANT);
  const [updateMenuItem] = useMutation(UPDATE_MENU_ITEM);

  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const [editRestaurantData, setEditRestaurantData] = useState({});
  const [editMenuItemData, setEditMenuItemData] = useState({});

  const [insertMenuItem] = useMutation(INSERT_MENU_ITEM);
  const [insertRestaurant] = useMutation(INSERT_RESTAURANT);

  const [deleteRestaurant] = useMutation(DELETE_RESTAURANT);
  const [deleteMenuItem] = useMutation(DELETE_MENU_ITEM);

  // Handlers for editing restaurants
  const handleEditRestaurant = (restaurant) => {
    setEditingRestaurant(restaurant.id);
    setEditRestaurantData(restaurant);
  };

  const handleSaveRestaurant = async () => {
    await updateRestaurant({
      variables: {
        id: editRestaurantData.id,
        name: editRestaurantData.name,
        phone_number: editRestaurantData.phone_number,
        latitude: editRestaurantData.latitude,
        longitude: editRestaurantData.longitude,
        address: editRestaurantData.address,
      },
    });
    setEditingRestaurant(null);
  };

  // Handlers for editing menu items
  const handleEditMenuItem = (menuItem) => {
    setEditingMenuItem(menuItem.id);
    setEditMenuItemData(menuItem);
  };

  const handleDelete = async (restaurantId, menuItemId) => {
    try {
      // First delete the restaurant
      await deleteRestaurant({
        variables: {
          restaurantId: restaurantId,
        },
      });

      // Then delete the menu item
      await deleteMenuItem({
        variables: {
          menuItemId: menuItemId,
        },
      });

      // Optionally, handle UI changes after deletion
    } catch (error) {
      // Handle any errors here
      console.error("Error during deletion:", error);
    }
  };

  const handleSaveMenuItem = async () => {
    await updateMenuItem({
      variables: {
        id: editMenuItemData.id,
        details: editMenuItemData.details,
        title: editMenuItemData.title,
        image: editMenuItemData.image,
        number_of_winners: editMenuItemData.number_of_winners,
        price: editMenuItemData.price,
        price_if_won: editMenuItemData.price_if_won,
        prize: editMenuItemData.prize,
      },
    });
    setEditingMenuItem(null);
  };

  const [transferSuccess, setTransferSuccess] = useState(null);

  const transferData = useCallback(
    async (restaurantId) => {
      const restaurant = data.restaurants_submit.find(
        (r) => r.id === restaurantId
      );
      if (restaurant) {
        const menuItem = restaurant.menu_item_submit;
        const menuItemResponse = await insertMenuItem({
          variables: {
            title: menuItem.title,
            details: menuItem.details,
            price: menuItem.price,
            priceIfWon: menuItem.price_if_won,
            prize: menuItem.prize,
            image: menuItem.image,
          },
        });
        const menuItemId =
          menuItemResponse.data.insert_menu_item.returning[0].id;

        await insertRestaurant({
          variables: {
            name: restaurant.name,
            phone_number: restaurant.phone_number,
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
            address: restaurant.address,
            menuItemId: menuItemId,
          },
        });
        setTransferSuccess(
          `Data for ${restaurant.name} transferred successfully!`
        );
        // Optionally, clear the message after a few seconds
        setTimeout(() => setTransferSuccess(null), 5000);
      }
    },
    [data, insertMenuItem, insertRestaurant]
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="restaurants-container">
      {data &&
        data.restaurants_submit &&
        data.restaurants_submit.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <button onClick={() => transferData(restaurant.id)}>
              Transfer Data
            </button>
            <button
              onClick={() =>
                handleDelete(restaurant.id, restaurant.menu_item_submit.id)
              }
            >
              Delete Restaurant and Menu Item
            </button>
            {transferSuccess && (
              <div className="success-message">{transferSuccess}</div>
            )}

            <p>
              <strong>User:</strong> {editRestaurantData?.user}
            </p>

            {editingRestaurant === restaurant.id ? (
              <div>
                {/* Editable fields for restaurant, each on separate lines */}
                <label>Restaurant:</label>
                <input
                  value={editRestaurantData.name}
                  onChange={(e) =>
                    setEditRestaurantData({
                      ...editRestaurantData,
                      name: e.target.value,
                    })
                  }
                />
                <br />
                <label>Phone:</label>
                <input
                  value={editRestaurantData.phone_number}
                  onChange={(e) =>
                    setEditRestaurantData({
                      ...editRestaurantData,
                      phone_number: e.target.value,
                    })
                  }
                />
                <br />
                <label>Latitude:</label>
                <input
                  value={editRestaurantData.latitude}
                  onChange={(e) =>
                    setEditRestaurantData({
                      ...editRestaurantData,
                      latitude: e.target.value,
                    })
                  }
                />
                <br />
                <label>Longitude:</label>
                <input
                  value={editRestaurantData.longitude}
                  onChange={(e) =>
                    setEditRestaurantData({
                      ...editRestaurantData,
                      longitude: e.target.value,
                    })
                  }
                />
                <br />
                <label>Address:</label>
                <input
                  value={editRestaurantData.address}
                  onChange={(e) =>
                    setEditRestaurantData({
                      ...editRestaurantData,
                      address: e.target.value,
                    })
                  }
                />
                <br />
                <button onClick={handleSaveRestaurant}>Save</button>
              </div>
            ) : (
              <div>
                <p>{restaurant.id}</p>

                <h2>
                  <strong>Restaurant:</strong> {restaurant.name}
                </h2>
                <p>
                  <strong>Phone Number:</strong> {restaurant.phone_number}
                </p>
                <p>
                  <strong>Latitude:</strong> {restaurant.latitude}
                </p>
                <p>
                  <strong>Longitude:</strong> {restaurant.longitude}
                </p>
                <p>
                  <strong>Address:</strong> {restaurant.address}
                </p>
                <button onClick={() => handleEditRestaurant(restaurant)}>
                  Edit
                </button>
              </div>
            )}

            {restaurant.menu_item_submit && (
              <div>
                {editingMenuItem === restaurant.menu_item_submit.id ? (
                  <div>
                    {/* Editable fields for menu item, each on separate lines */}
                    <label>Title:</label>
                    <input
                      value={editMenuItemData.title}
                      onChange={(e) =>
                        setEditMenuItemData({
                          ...editMenuItemData,
                          title: e.target.value,
                        })
                      }
                    />
                    <br />
                    <label>Details:</label>
                    <textarea
                      value={editMenuItemData.details}
                      onChange={(e) =>
                        setEditMenuItemData({
                          ...editMenuItemData,
                          details: e.target.value,
                        })
                      }
                    />
                    <br />
                    <label>Image URL:</label>
                    <input
                      value={editMenuItemData.image}
                      onChange={(e) =>
                        setEditMenuItemData({
                          ...editMenuItemData,
                          image: e.target.value,
                        })
                      }
                    />
                    <br />
                    <label>Number of Winners:</label>
                    <input
                      value={editMenuItemData.number_of_winners}
                      onChange={(e) =>
                        setEditMenuItemData({
                          ...editMenuItemData,
                          number_of_winners: e.target.value,
                        })
                      }
                    />
                    <br />
                    <label>Price:</label>
                    <input
                      value={editMenuItemData.price}
                      onChange={(e) =>
                        setEditMenuItemData({
                          ...editMenuItemData,
                          price: e.target.value,
                        })
                      }
                    />
                    <br />
                    <label>Price if Won:</label>
                    <input
                      value={editMenuItemData.price_if_won}
                      onChange={(e) =>
                        setEditMenuItemData({
                          ...editMenuItemData,
                          price_if_won: e.target.value,
                        })
                      }
                    />
                    <br />
                    <label>Prize:</label>
                    <input
                      value={editMenuItemData.prize}
                      onChange={(e) =>
                        setEditMenuItemData({
                          ...editMenuItemData,
                          prize: e.target.value,
                        })
                      }
                    />
                    <br />
                    <button onClick={handleSaveMenuItem}>Save</button>
                  </div>
                ) : (
                  <div>
                    <p>{restaurant.menu_item_submit.id}</p>
                    <h3>{restaurant.menu_item_submit.title}</h3>
                    <p>
                      <strong>Details:</strong>{" "}
                      {restaurant.menu_item_submit.details}
                    </p>
                    <p>
                      <strong>Image URL:</strong> <br />
                      <img
                        style={{ width: 200 }}
                        src={restaurant.menu_item_submit.image}
                        alt="Menu Item"
                      />
                    </p>
                    {/* <p><strong>Number of Winners:</strong> {restaurant.menu_item_submit.number_of_winners}</p> */}
                    <p>
                      <strong>Price:</strong>{" "}
                      {restaurant.menu_item_submit.price}
                    </p>
                    <p>
                      <strong>Price if Won:</strong>{" "}
                      {restaurant.menu_item_submit.price_if_won}
                    </p>
                    <p>
                      <strong>Prize:</strong>{" "}
                      {restaurant.menu_item_submit.prize}
                    </p>
                    <button
                      onClick={() =>
                        handleEditMenuItem(restaurant.menu_item_submit)
                      }
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Restaurants;
