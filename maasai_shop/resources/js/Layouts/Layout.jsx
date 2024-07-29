import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import styles from '../../css/components/Layout.module.css';
import logo from '../../images/zoe-clear.png';
import { useCart } from '../Pages/CartContext';
import logowhite from '../../images/zoe-clear.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBagShopping,
    faXmark,
    faArrowRightFromBracket,
    faUserShield,
    faUser,
    faPlus,
    faMinus,
    faTrashCan,
    faPenToSquare,
    faClock,
    faCartArrowDown,
    faEnvelope,
    faPhone
} from '@fortawesome/free-solid-svg-icons';
import { formatNumber } from '../utils/formatNumber';

const Layout = ({ children }) => {
    const { auth } = usePage().props;
    const { cart, total, increaseQuantity, decreaseQuantity, deleteFromCart, clearCart } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false); // New state for scroll detection

    const baseUrl = import.meta.env.VITE_APP_URL || 'http://127.0.0.1:8000/';

    // Ensure roles are defined and is an array before checking
    const isAdminOrStaff = auth && Array.isArray(auth.roles) && (auth.roles.includes('admin') || auth.roles.includes('staff'));

    // console.log("roles", isAdminOrStaff);

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

    // Effect to handle scroll detection
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={styles.fontSans}>
            <header className={`${styles.header} ${!isScrolled ? styles.headerTransparent : ''}`}>
                <div className={styles.HeaderBanner}>
                    <div className={styles.BannerPitch}>
                        <h5>24Hrs Delivery Time and Free shipping within Nairobi and its environs.</h5>
                    </div>
                    <div className={styles.BannerIcon}>
                        <p>Customer Care :</p>
                        <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div className={styles.BannerIcon}>
                        <FontAwesomeIcon icon={faPhone} />
                        <p>(+254) 713-08-33-78</p>
                    </div>
                    <div className={styles.BannerIcon}>
                        <FontAwesomeIcon icon={faClock} />
                        <p>8:00 am - 10:00 pm</p>
                    </div>
                </div>
                <div className={styles.container}>
                    <div className={styles.headerContent}>
                        <div className={styles.logoNav}>
                            <div className={styles.logo}>
                                <Link href="/">
                                    <img className={styles.logoImage} src={logo} alt="Logo" />
                                </Link>
                            </div>
                        </div>
                        <div className={styles.PageLinks}>
                            <div className={styles.navLinks}>
                                <Link href="/shop" className={styles.navLink}>
                                    Shop
                                </Link>
                                <Link href="/blog" className={styles.navLink}>
                                    Blog
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
                                    {isAdminOrStaff && (
                                        <Link
                                            href="/admin/dashboard"
                                            className={`${styles.authLink} ${isActive('/admin/dashboard') ? styles.activeLink : ''}`}
                                        >
                                            <FontAwesomeIcon icon={faUserShield} />
                                            <p>Admin</p>
                                        </Link>
                                    )}
                                    <Link
                                        as="button"
                                        method="post"
                                        href="/logout"
                                        className={`${styles.authLink} ${isActive('/logout') ? styles.activeLink : ''}`}
                                        onClick={handleLogout}
                                    >
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} />
                                        <p>Logout</p>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className={styles.authLink}>
                                        <FontAwesomeIcon icon={faUser} />
                                        <p>Log In</p>
                                    </Link>
                                    <Link href="/register" className={styles.authLink}>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                        <p>Sign Up</p>
                                    </Link>
                                </>
                            )}
                            <button onClick={toggleModal} className={styles.cartButton}>
                                {cart && cart.length !== 0 &&
                                    <div className={styles.cartNotification}>
                                        <p>{cart.length}</p>
                                    </div>
                                }
                                <FontAwesomeIcon className={isModalOpen ? styles.cartIconActive : styles.cartIcon} icon={faCartArrowDown} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main style={{ paddingTop: '160px', paddingBottom: '20px', height: 'auto', backgroundColor: '#FFFAE5' }}>
                {children}
            </main>
            <footer className={styles.footer}>
                <div className={styles.footerThinner}></div>
                <div className={styles.footerContainer}>
                    <div className={styles.footerLogo}>
                        <img src={logowhite} alt="maasai-logo" />
                    </div>
                    <div className={styles.footerDetailsContainer}>
                        <h6>We offer an unparalleled selection of premium baby clothing, toys, and nursery decor. Each piece meticulously chosen for its quality, comfort, and aesthetic appeal. Check out our Newsletters for promotions and New Stock sales.</h6>
                        <p className={styles.footerText}>&copy; 2024 Maasai Retailers</p>
                        <div className={styles.footerDetailsSection}>
                            <div className={styles.footerDetails}>
                                <small>Cell: ( +254 ) 783-469-713</small>
                                <small>Nairobi ( Kenya )</small>
                                <small>info@zoeskidsbabyshop.co.ke</small>
                            </div>
                            <div className={styles.footerDetails}>
                                <small>Frequently Asked Quenstions ( FAQ's )</small>
                                <small>Returns and Exchange Policy</small>
                                <small>Shipping and Delivery Information</small>
                                <small>Contacts</small>
                            </div>
                            <div className={styles.legalDetails}>
                                <small>Privacy Policy</small>
                                <small>Terms and Conditions</small>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalBackdrop}></div>
                    <div className={styles.modalContent}>
                        <div className={styles.modalBody}>
                            <div className={styles.modalTitle}>
                                <div className={styles.modalIcon}>
                                    <FontAwesomeIcon icon={faCartArrowDown} />
                                </div>
                                <h3 className={styles.modalTitle}>Shopping Cart</h3>
                            </div>
                            <div className={styles.modalText}>
                                
                                {cart.length === 0 ? (
                                    <div className={styles.modalMessage}>
                                        <p>Your shopping cart is currently empty.</p>
                                    </div>
                                ) : (
                                    <div className={styles.modalCartProductsContainer}>
                                        {cart && cart.map((item, index) => (
                                            <div key={index} className={styles.CartCard}>
                                                <div className={styles.CartImage}>
                                                    <img src={`${baseUrl}/storage/${item.product.image1}`} alt={item.product.name} />
                                                </div>
                                                <div className={styles.CartDetails}>
                                                    <p>{item.product.name}</p>
                                                </div>
                                                <div className={styles.CartAdjustment}>
                                                    <div className={styles.CartAdjustmentQty} onClick={() => increaseQuantity(item.product)}>
                                                        <small>Units - <span>{item.quantity}</span></small>
                                                    </div>
                                                    <div className={styles.CartPrice}>
                                                        <small>Kes {formatNumber((item.product.sale_price && item.product.price > item.product.sale_price ? item.product.sale_price : item.product.price) * item.quantity)}</small>
                                                    </div>
                                                    <div className={styles.CartAdjustmentBtns} onClick={() => increaseQuantity(item.product)}>
                                                        <small>
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </small>
                                                    </div>
                                                    <div className={styles.CartAdjustmentBtns} onClick={() => decreaseQuantity(item.product)}>
                                                        <small>
                                                            <FontAwesomeIcon icon={faMinus} />
                                                        </small>
                                                    </div>
                                                    <div className={styles.CartAdjustmentBtns} onClick={() => deleteFromCart(item.product)}>
                                                        <small>
                                                            <FontAwesomeIcon icon={faTrashCan} />
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <div className={styles.modalTotal}>
                                <h4>Total: <span>{formatNumber(total)}</span></h4>
                            </div>
                            <Link href='/checkout'>
                                <button type="button" className={styles.modalCheckoutButton}>
                                    Proceed to Checkout
                                </button>
                            </Link>
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