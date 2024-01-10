import { Toaster } from 'react-hot-toast';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';


import { NhostClient, NhostProvider } from '@nhost/react';
import { NhostApolloProvider } from '@nhost/react-apollo';


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
          </Route>
        </Routes>
      </Router>

      <Toaster />
      </NhostApolloProvider>
      </NhostProvider>
  )
}

export default App