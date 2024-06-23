import React from 'react';
import Layout from '../Layouts/Layout';
import { Link, Head } from '@inertiajs/react';

function Admin({title, auth }) {
  return (
    <Layout auth={auth}>
      <Head title="Admin" />
      <h1>{title}</h1>
    </Layout>
  )
}

export default Admin