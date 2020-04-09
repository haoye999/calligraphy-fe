import React, { useState } from 'react';
import Layout from './components/Layout';
import Main from './components/Main';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <Layout loading={loading} >
      <Main setLoading={setLoading} />
    </Layout>
  );
}

export default App;
