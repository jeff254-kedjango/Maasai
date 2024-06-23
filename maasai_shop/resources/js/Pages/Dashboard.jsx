import React, {useState } from 'react';
import Layout from '@/Layouts/Layout';
import { Head, usePage } from '@inertiajs/react';
import styles from '../../css/Dashboard.module.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFolder, faChartLine, faCommentsDollar, faPeopleGroup, faUserPlus, faEarthAmericas } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import ProductList from '@/Components/UsedComponents/ProductList';
import CategoryList from '@/Pages/CategoryList';
import AdvertList from '../Pages/AdvertList'

export default function Dashboard({ orders, products, adverts, categories, newOrders }) {
    const { flash } = usePage().props;
    const [show, setShow] = useState(0);

    // console.log(flash)

    return (
        <Layout
        >
            <Head title="Dashboard" />
            <div className={styles.DashboardSection}>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">Welcome to your Admin Dashboard</div>
                        </div>
                    </div>
                </div>
                {flash?.success && (
                    <div className={styles.alertSuccess}>
                        {flash.success}
                    </div>
                )}
                <div className={styles.AdminSection}>
                    <div className={styles.SidebarContainer}>
                        <div className={styles.SidebarCards}>
                            <div className={styles.SidebarIcon}>
                                <FontAwesomeIcon icon={faFolder} />
                            </div>
                            <div className={styles.SidebarTitle}>
                                <p>New Orders</p>
                            </div>
                        </div>
                        <div className={styles.SidebarCards}>
                            <div className={styles.SidebarIcon}>
                                <FontAwesomeIcon icon={faChartLine} />
                            </div>
                            <div className={styles.SidebarTitle}>
                                <p>Treding Products</p>
                            </div>
                        </div>
                        <div className={styles.SidebarCards}>
                            <div className={styles.SidebarIcon}>
                                <FontAwesomeIcon icon={faCommentsDollar} />
                            </div>
                            <div className={styles.SidebarTitle}>
                                <p>Total Sales</p>
                            </div>
                        </div>
                        <div className={styles.SidebarCards}>
                            <div className={styles.SidebarIcon}>
                                <FontAwesomeIcon icon={faPeopleGroup} />
                            </div>
                            <div className={styles.SidebarTitle}>
                                <p>Total Visits</p>
                            </div>
                        </div>

                        <div className={styles.SidebarCards}>
                            <div className={styles.SidebarIcon}>
                                <FontAwesomeIcon icon={faEarthAmericas} />
                            </div>
                            <div className={styles.SidebarTitle}>
                                <p>Subscribers</p>
                            </div>
                        </div>

                        <div className={styles.SidebarCards}>
                            <div className={styles.SidebarIcon}>
                                <FontAwesomeIcon icon={faUserPlus} />
                            </div>
                            <div className={styles.SidebarTitle}>
                                <p>Users</p>
                            </div>
                        </div>

                    </div>
                    <div className={styles.AdminContainer}>
                        { show == 1 ?
                        < ProductList products={products}  setShow={setShow} />
                        :
                        <div className={styles.AdminCards}>
                            <div  className={styles.AdminTitle}>
                                <h3>Products</h3>
                            </div>
                            <div className={styles.AdminIcon}>
                                <FontAwesomeIcon onClick={()=>setShow(1)} className={styles.icon} icon={faChevronDown} />
                            </div>
                        </div>

                        }

                        { show == 2 ?
                            <CategoryList setShow={setShow} categories={categories} />
                            :
                            <div className={styles.AdminCards}>
                                <div  className={styles.AdminTitle}>
                                    <h3>Categories</h3>
                                </div>
                                <div className={styles.AdminIcon}>
                                    <FontAwesomeIcon onClick={()=>setShow(2)} className={styles.icon} icon={faChevronDown} />
                                </div>
                            </div>
                        }

                        <div className={styles.AdminCards}>
                            <div  className={styles.AdminTitle}>
                                <h3>Orders</h3>
                            </div>
                            <div className={styles.AdminIcon}>
                                <FontAwesomeIcon className={styles.icon} icon={faChevronDown} />
                            </div>
                        </div>
                        { show == 4 ? 
                            <AdvertList setShow={setShow} adverts={adverts} />
                            :
                            <div className={styles.AdminCards}>
                                <div  className={styles.AdminTitle}>
                                    <h3>Adverts</h3>
                                </div>
                                <div className={styles.AdminIcon}>
                                    <FontAwesomeIcon onClick={()=>setShow(4)} className={styles.icon} icon={faChevronDown} />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Layout>
    );
}
