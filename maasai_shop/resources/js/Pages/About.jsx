import React from 'react';
import { Link, Head } from '@inertiajs/react';
import Layout from '../Layouts/Layout';

export default function About({title, auth }) {
  return (
    <Layout auth={auth} >
      <Head title="About" />
      <h1>{title}</h1>
    </Layout>
  );
}