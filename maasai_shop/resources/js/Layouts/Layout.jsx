import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import styles from '../../css/components/Layout.module.css';
import logo from '../../images/logo.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faXmark } from '@fortawesome/free-solid-svg-icons'; // Import specific icons

const Layout = ({ children }) => {
    const { auth } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const isActive = (url) => {
        return window.location.pathname.startsWith(url);
    };

    return (
        <div className={styles.fontSans}>
            <header className={styles.header}>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <div className={styles.logoNav}>
                            <div className={styles.logo}>
                                <Link href="/">
                                    <img className={styles.logoImage} src={logo} alt="Logo" />
                                </Link>
                            </div>
                            <div className={styles.navLinks}>
                                <Link href="/shop" className={styles.navLink}>
                                    Shop
                                </Link>
                                <Link href="/about" className={styles.navLink}>
                                    About
                                </Link>
                                <Link href="/contacts" className={styles.navLink}>
                                    Contacts
                                </Link>
                            </div>
                        </div>
                        <div className={styles.authCart}>
                            {auth?.user ? (
                                <>
                                    <Link
                                        href="/admin/dashboard"
                                        className={`${styles.authLink} ${isActive('/admin/dashboard') ? styles.activeLink : ''}`}
                                    >
                                        Admin
                                    </Link>
                                    <Link
                                        as="button"
                                        method="post"
                                        href="/logout"
                                        className={`${styles.authLink} ${isActive('/logout') ? styles.activeLink : ''}`}
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className={styles.authLink}>
                                        Log in
                                    </Link>
                                    <Link href="/register" className={styles.authLink}>
                                        Register
                                    </Link>
                                </>
                            )}
                            <button onClick={toggleModal} className={styles.cartButton}>
                                <FontAwesomeIcon icon={faBagShopping} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main style={{ paddingTop: '120px', backgroundColor: '#FFFAE5' }}>{children}</main> {/* Adjust padding-top to match header height */}
            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <p className={styles.footerText}>&copy; 2024 Your Company</p>
                </div>
            </footer>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalBackdrop}></div>
                    <div className={styles.modalContent}>
                        <div className={styles.modalBody}>
                            <div className={styles.modalIcon}>
                                <FontAwesomeIcon icon={faBagShopping} />
                            </div>
                            <div className={styles.modalText}>
                                <h3 className={styles.modalTitle}>Shopping Cart</h3>
                                <div className={styles.modalMessage}>
                                    <p>Your shopping cart is currently empty.</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button type="button" className={styles.modalCloseButton} onClick={toggleModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;