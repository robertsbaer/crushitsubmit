import { gql, useMutation, useSubscription } from "@apollo/client";
import React, { useState } from "react";

const POST_EVENT_MUTATION = gql`
  mutation MyMutation($event: oneoff_insert_input!) {
    insert_oneoff(objects: [$event]) {
      returning {
        date
        details
        id
        image
        location
        prize
        title
        website
      }
    }
  }
`;

const EVENTS_SUBSCRIPTION = gql`
  subscription Events {
    oneoff {
      id
      date
      details
      image
      location
      prize
      title
      website
    }
  }
`;

function PostEventForm() {
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    date: "",
    location: "",
    prize: "",
    image: "",
    website: "",
  });

  const [postEvent] = useMutation(POST_EVENT_MUTATION);
  const {
    data: subscriptionData,
    loading: subscriptionLoading,
    error: subscriptionError,
  } = useSubscription(EVENTS_SUBSCRIPTION);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postEvent({ variables: { event: formData } });
      console.log("Event posted successfully:", response.data);
    } catch (error) {
      console.error("Error posting event:", error);
    }
  };

  const formFields = [
    { name: "title", type: "text", placeholder: "Title" },
    { name: "details", type: "text", placeholder: "Details" },
    { name: "date", type: "date", placeholder: "Date" },
    { name: "location", type: "text", placeholder: "Location" },
    { name: "prize", type: "text", placeholder: "Prize" },
    { name: "image", type: "text", placeholder: "Image URL" },
    { name: "website", type: "text", placeholder: "Website" },
  ];

  const cardStyle = {
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)", // Adds a subtle shadow to the card
    transition: "0.3s", // Smooth transition for hover effects
    borderRadius: "5px", // Slightly rounded corners for the card
    padding: "16px", // Spacing inside the card
    backgroundColor: "white", // Card background color
    width: "calc(50% - 10px)", // Adjusts each event's container to fit 2 per row
    marginBottom: "20px",
    marginRight: "10px", // Consistent spacing around cards
  };

  const eventContainerStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: "calc(100% - 240px)", // Adjust based on form width
  };

  const getCurrentDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1); // Set to yesterday
    return today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const isPastEvent = (date) => {
    return new Date(date) < new Date(getCurrentDate());
  };

  let pastEvents = [];
  let upcomingEvents = [];

  if (subscriptionData && subscriptionData.oneoff) {
    // Separate past and upcoming events
    pastEvents = subscriptionData.oneoff.filter((event) =>
      isPastEvent(event.date)
    );
    upcomingEvents = subscriptionData.oneoff.filter(
      (event) => !isPastEvent(event.date)
    );

    // Sort the events by date
    pastEvents.sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
    upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date)); // Nearest future date first
  }

  const renderFormField = ({ name, type, placeholder }) => (
    <>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formData[name]}
        onChange={handleChange}
      />
      <br />
    </>
  );

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <form onSubmit={handleSubmit} style={{ paddingRight: 100 }}>
        {formFields.map((field) => renderFormField(field))}
        <button type="submit">Post Event</button>
      </form>

      <div style={{}}>
        <h2 style={{ marginTop: "20px", fontSize: 40 }}>Current Events</h2>
        <div style={eventContainerStyle}>
          {upcomingEvents.map((event, index) => (
            <div key={event.id} style={cardStyle}>
              <img
                src={event.image}
                alt={event.title}
                style={{ width: "100%", height: "auto", borderRadius: "5px" }}
              />
              <p>{event.date}</p>
              <h2>{event.title}</h2>
              <p>{event.details}</p>
              <p>{event.location}</p>
              <p>{event.prize}</p>
              <a href={event.website} style={{backgroundColor: 'lightgreen', padding: 10, borderRadius: 10}}>Event Website</a>
            </div>
          ))}
        </div>

        {/* Render Past Events Section */}
        {pastEvents.length > 0 && (
          <div style={{ width: "100%" }}>
            <h2 style={{ marginTop: "20px", fontSize: 40 }}>Past Events</h2>
            <div style={eventContainerStyle}>
              {pastEvents.map((event, index) => (
                <div key={event.id} style={cardStyle}>
                  <h2>{event.title}</h2>
                  <p>{event.details}</p>
                  <p>{event.date}</p>
                  <p>{event.location}</p>
                  <p>{event.prize}</p>
                  <img
                    src={event.image}
                    alt={event.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "5px",
                    }}
                  />
                  <a href={event.website}>Event Website</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostEventForm;
