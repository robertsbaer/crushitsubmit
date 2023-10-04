import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute'


import { NhostClient, NhostProvider } from '@nhost/react'
import { NhostApolloProvider } from '@nhost/react-apollo'

import AddRestaurant from './pages/AddRestaurant';


// const nhost = new NhostClient({
//   subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN,
//   region: process.env.REACT_APP_NHOST_REGION
// })

const nhost = new NhostClient({
  subdomain: "rjwcdbysooqghmplsuwa",
  region: "us-east-1"
});

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
      <Router>
      <Routes>
    {/* <Route path="sign-up" element={<SignUp />} />
    <Route path="sign-in" element={<SignIn />} /> */}
    <Route path="add-restaurant" element={<AddRestaurant />} />
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
    </Route>
</Routes>

      </Router>

      <Toaster />
      </NhostApolloProvider>
      </NhostProvider>
  )
}

export default App