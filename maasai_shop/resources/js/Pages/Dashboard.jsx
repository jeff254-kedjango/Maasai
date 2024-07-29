import React, { useState, useEffect } from 'react';
import Layout from '@/Layouts/Layout';
import { Head, usePage } from '@inertiajs/react';
import styles from '../../css/Dashboard.module.css';
import SalesModal from '@/utils/SalesModal';
import SalesComponent from '@/utils/SalesComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFolderOpen, faChartLine, faCommentsDollar, faPeopleGroup, faUserPlus, faEarthAmericas, faMessage } from '@fortawesome/free-solid-svg-icons';
import ProductList from '@/Components/UsedComponents/ProductList';
import CategoryList from '@/Pages/CategoryList';
import AdvertList from '../Pages/AdvertList';
import BlogList from '../Pages/BlogList';
import OrderList from './OrderList';
import Analytics from '@/Components/Analytics';
import UsersAdmin from '@/Components/UsersAdmin';
import ProductTrends from '@/Components/ProductTrends';
import ContactModal from '../Components/ContactModal';

export default function Dashboard({ permissions }) {
    const { allContacts, contact, subs, blogs, trendingProducts, productRevenue, mostSoldProducts, reOrderedProducts, stockCheckData, listOfUsers, flash, success, dates, newUsers, returningUsers, orders, products, adverts, categories, newOrders, user } = usePage().props;
    const props = usePage().props;

    // console.log('Page props:', props);

    const [show, setShow] = useState(0);
    const [showSales, setShowSales] = useState(false);
    const [showAnalytics, setShowAnalytics ] = useState(false);
    const [showUsersAdmin, setShowUsersAdmin] = useState(false);
    const [showProductTrends, setShowProductTrends ] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false)
    const [cont , setCont ] = useState( contact.length );

    const [flashVisible, setFlashVisible] = useState(false);

    // console.log("mostSoldProducts", mostSoldProducts)
    // console.log("reOrderedProducts", reOrderedProducts)
    // console.log("stockCheckData", stockCheckData)
    // console.log("productRevenue", productRevenue)

    // console.log("blogs", blogs)

    // const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 10;

    const canEditProducts = permissions.includes('edit products');
    const canViewOrders = permissions.includes('view orders');


    // console.log('newUsers', newUsers);
    // console.log('returningUsers',returningUsers)
    // console.log('canEditProducts', canEditProducts );
    // console.log('canViewOrders', canViewOrders )

    // console.log('listOfUsers', listOfUsers);

    // console.log(orders);

    // console.log(subs);
    // console.log( "Flash Message", flash )

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setFlashVisible(true);
            const timer = setTimeout(() => {
                setFlashVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <Layout>
            <Head title="Dashboard" />
            <div className={styles.DashboardSection}>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className={styles.DashboardBanner}>
                            <div className={styles.DashboardContainer}>Welcome to your Admin Dashboard, {user.name}. </div>
                        </div>
                    </div>
                </div>
                {flashVisible && flash?.success && (
                    <div className={styles.alertSuccess}>
                        {flash.success}
                    </div>
                )}
                {flashVisible && flash?.error && (
                    <div className={styles.alertError}>
                        {flash.error}
                    </div>
                )}
                <div className={styles.AdminSection}>
                    <div className={styles.SidebarContainer}>
                        <div className={styles.SidebarCards}>
                            <div className={styles.SidebarIcon}>
                                <FontAwesomeIcon icon={faFolderOpen} />
                            </div>
                            <div className={styles.SidebarTitle}>
                                <p>New Orders</p>
                            </div>
                            { newOrders > 0 &&
                                <div className={styles.NeworderNotification}>
                                    <small>{newOrders && newOrders }</small>
                                </div>
                            }
                        </div>
                        <div className={styles.SidebarCards} onClick={()=> setShowContactModal(!showContactModal)}>
                            <div className={styles.SidebarIcon}>
                                <FontAwesomeIcon icon={faMessage} />
                            </div>
                            <div className={styles.SidebarTitle}>
                                <p>Messages</p>
                            </div>
                            { contact.length > 0 &&
                                <div className={styles.NeworderNotification}>
                                    <small>{ contact && contact.length }</small>
                                </div>
                            }
                        </div>
                        <div className={styles.SidebarCards} onClick={()=> setShowProductTrends(!showProductTrends)}>
                            <div className={styles.SidebarIcon}>
                                <FontAwesomeIcon icon={faChartLine} />
                            </div>
                            <div className={styles.SidebarTitle}>
                                <p>Product Trends</p>
                            </div>
                        </div>
                        <div className={styles.SidebarCards} onClick={()=> setShowSales(!showSales)}>
                            <div className={styles.SidebarIcon}>
                                <FontAwesomeIcon icon={faCommentsDollar} />
                            </div>
                            <div className={styles.SidebarTitle}>
                                <p>Total Sales</p>
                            </div>
                        </div>
                        <div className={styles.SidebarCards} onClick={()=> setShowAnalytics(!showAnalytics)} >
                            <div className={styles.SidebarIcon}>
                                <FontAwesomeIcon icon={faPeopleGroup} />
                            </div>
                            <div className={styles.SidebarTitle}>
                                <p>Total Visits</p>
                            </div>
                        </div>

                        <div className={styles.SidebarCards} >
                            <div className={styles.SidebarIcon}>
                                <FontAwesomeIcon icon={faEarthAmericas} />
                            </div>
                            <div className={styles.SidebarTitle}>
                                <p>Subscribers</p>
                            </div>
                        </div>

                        <div className={styles.SidebarCards} onClick={()=> setShowUsersAdmin(!showUsersAdmin)} >
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

                        {
                            show == 3 ? 
                            < OrderList setShow={setShow} orders={orders} />
                            :
                            <div className={styles.AdminCards}>
                                <div  className={styles.AdminTitle}>
                                    <h3>Orders</h3>
                                </div>
                                <div className={styles.AdminIcon}>
                                    <FontAwesomeIcon onClick={()=>setShow(3)} className={styles.icon} icon={faChevronDown} />
                                </div>
                            </div>
                        }

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

                        { show == 5 ? 
                            < BlogList setShow={setShow} blogs={blogs} />
                            :
                            <div className={styles.AdminCards}>
                                <div  className={styles.AdminTitle}>
                                    <h3>Blog</h3>
                                </div>
                                <div className={styles.AdminIcon}>
                                    <FontAwesomeIcon onClick={()=>setShow(5)} className={styles.icon} icon={faChevronDown} />
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </div>
            <SalesModal isOpen={showContactModal} onClose={() => setShowContactModal(false)}>
                <ContactModal allContacts={allContacts} contacts={contact} />
            </SalesModal>
            <SalesModal isOpen={showSales} onClose={() => setShowSales(false)}>
                <SalesComponent orders={orders} />
            </SalesModal>
            <SalesModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} > 
                <Analytics dates={dates} newUsers={newUsers} returningUsers={returningUsers} />
            </SalesModal>
            <SalesModal isOpen={ showUsersAdmin } onClose={() => setShowUsersAdmin(false)} > 
                < UsersAdmin listOfUsers={listOfUsers} />
            </SalesModal>
            <SalesModal isOpen={ showProductTrends } onClose={() => setShowProductTrends(false)} > 
                < ProductTrends trendingProducts={trendingProducts} productRevenue={productRevenue} mostSoldProducts={mostSoldProducts} reOrderedProducts={reOrderedProducts} stockCheckData={stockCheckData} />
            </SalesModal>
        </Layout>
    );
}