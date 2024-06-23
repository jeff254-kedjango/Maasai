import React from 'react';
import { Link, Head } from '@inertiajs/react';
import MainSwiper from '../Components/UsedComponents/MainSwiper';
export default function Home({title}) {
  return (
    <div>
      <Head title="Home" />
      <MainSwiper />
    </div>
  );
}