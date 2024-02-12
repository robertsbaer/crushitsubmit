import { gql, useSubscription } from "@apollo/client";
import React, { useState } from "react";
import "./UserCompetitionDisplay.css";

const GET_USERS = gql`
  subscription GetUsers {
    users {
      id
      displayName
      createdAt
      avatarUrl
      lastSeen
    }
  }
`;

const GET_COMPETITIONS = gql`
  subscription GetCompetitions {
    competition {
      id
      user
      restaurant
      attempt
      win
    }
  }
`;

const GET_RESTAURANTS = gql`
  subscription GetRestaurants {
    restaurants {
      id
      name
    }
  }
`;

function UserCompetitionDisplay() {
  const { data: usersData } = useSubscription(GET_USERS);
  const { data: competitionData } = useSubscription(GET_COMPETITIONS);
  const { data: restaurantsData } = useSubscription(GET_RESTAURANTS);
  const [search, setSearch] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const [lastSeenFilter, setLastSeenFilter] = useState("all"); // New state for lastSeen filter

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurantsData?.restaurants.find((r) => r.id === restaurantId);
    return restaurant ? restaurant.name : "Unknown";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = [
      "January", "February", "March",
      "April", "May", "June",
      "July", "August", "September",
      "October", "November", "December"
    ];
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const applyLastSeenFilter = (users, filter) => {
    const now = new Date();
    return users.filter(user => {
      const lastSeenDate = new Date(user.lastSeen);
      switch (filter) {
        case 'today':
          return lastSeenDate.toDateString() === now.toDateString();
        case 'thisWeek':
          const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          return lastSeenDate >= oneWeekAgo;
        case 'thisMonth':
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return lastSeenDate >= oneMonthAgo;
        default:
          return true; // 'all' or undefined filter
      }
    });
  };

  let sortedAndFilteredUsers = applyLastSeenFilter([...(usersData?.users || [])], lastSeenFilter)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    })
    .filter(user => user.displayName.toLowerCase().includes(search.toLowerCase()));

  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  return (
    <div className="container">
      <select className="select-box" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
      <select className="select-box" value={lastSeenFilter} onChange={(e) => setLastSeenFilter(e.target.value)}>
        <option value="all">All Users</option>
        <option value="today">Seen Today</option>
        <option value="thisWeek">Seen This Week</option>
        <option value="thisMonth">Seen This Month</option>
      </select>
      <input
        className="search-box"
        type="text"
        placeholder="Search Users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="user-list">
      {sortedAndFilteredUsers.map((user) => {
          const userCompetitions =
            competitionData?.competition?.filter(
              (competition) => competition.user === user.id
            ) || [];

          const isExpanded = expandedUserId === user.id;
          const displayedCompetitions = isExpanded
            ? userCompetitions
            : userCompetitions.slice(0, 1);

          return (
            <li key={user.id} className="user-item">
              <div className="user-info">
              <img src={user.avatarUrl} alt={user.displayName} className="user-avatar" />
                <h3 className="user-name">{user.displayName}</h3>
              </div>
              <h1 className="user-date">Joined: {formatDate(user.createdAt)}</h1>
              <h1 className="user-date">Last Seen: {formatDate(user.lastSeen)}</h1>
              <ul className="competition-list">
                {displayedCompetitions.map((comp) => (
                  <li key={comp.id} className="user-item">
                    <p>Restaurant: {getRestaurantName(comp.restaurant)}</p>
                    <p>Attempt: {comp.attempt ? "Yes" : "No"}</p>
                    <p>Win: {comp.win ? "Yes" : "No"}</p>
                  </li>
                ))}
              </ul>
              {userCompetitions.length > 1 && (
                <button onClick={() => toggleExpand(user.id)}>
                  {isExpanded ? "Less" : "More"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserCompetitionDisplay;
