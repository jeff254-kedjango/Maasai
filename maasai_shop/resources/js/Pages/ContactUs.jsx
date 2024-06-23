import React from 'react';
import Layout from '../Layouts/Layout';
import { Link, Head } from '@inertiajs/react';

function ContactUs({title, auth}) {
  return (
    <Layout auth={auth} >
      <Head title="Contact Us" />
      <h1>{title}</h1>
    </Layout>
  )
}

export default ContactUs;