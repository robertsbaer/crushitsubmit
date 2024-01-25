import { Toaster } from "react-hot-toast";
import { Route, HashRouter as Router, Routes } from "react-router-dom";

import AddRestaurant from "./components/AddRestaurant";
import FullList from "./components/FullList";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Restaurants from "./components/Restaurants";
import Dashboard from "./pages/Dashboard";
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Corrections from "./components/Corrections";


import { NhostClient, NhostProvider } from "@nhost/react";
import { NhostApolloProvider } from "@nhost/react-apollo";

const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN,
  region: process.env.REACT_APP_NHOST_REGION,
});

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <Router>
          <Routes>
            <Route path="sign-up" element={<SignUp />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="fulllist" element={<FullList />} />
              <Route path="addrestaurant" element={<AddRestaurant />} />
              <Route path="restaurants" element={<Restaurants />} />
              <Route path="corrections" element={<Corrections />} />

            </Route>
          </Routes>
        </Router>

        <Toaster />
      </NhostApolloProvider>
    </NhostProvider>
  );
}

export default App;
