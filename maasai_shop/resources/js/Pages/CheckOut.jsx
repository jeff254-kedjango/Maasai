import React from 'react';
import Layout from '../Layouts/Layout';
import { Link, Head } from '@inertiajs/react';

function CheckOut({title, auth }) {
  return (
    <Layout auth={auth}>
      <Head title="Check Out" />
      <h1>{title}</h1>
    </Layout>
  )
}

export default CheckOut;