import React from 'react';
import Layout from '../Layouts/Layout';
import styles from '../../css/BlogDetails.module.css';
import { Head, Link } from '@inertiajs/react';
import blogImage from '../../images/LayoutPics/pic1.jpg';
import Offers from '@/Components/ShopComponents/Offers'
import NewStock from '@/Components/ShopComponents/NewStock';
import { formatDate } from '@/utils/formatDate';
import { formatNumber } from '@/utils/formatNumber';

function BlogDetails({ blog, offers, newStock }) {
    console.log(blog.editor.name)
  return (
    <Layout>
        <Head title="Blog" />
        <div className={styles.BlogDetailsContainer}>
            <img src={`/storage/${blog.image}`} alt={blog.title} className={styles.BlogImage} />
            <div className={styles.BlogDetailsOverlay}>
                <h2>{blog.title}</h2>
                <small>{formatDate(blog.updated_at)}</small>
                <small>Views - {formatNumber(blog.total_views)}</small>
            </div>
            <div className={styles.BlogDetailsContentContainer}>
                {blog.paragraph1 && <p className={styles.Paragraph1}>{blog.paragraph1}</p>}
                {blog.paragraph2 && <p className={styles.ParagraphOut}>{blog.paragraph2}</p>}
                {blog.paragraph3 && <p className={styles.ParagraphOut}>{blog.paragraph3}</p>}
                {blog.paragraph4 && <p className={styles.ParagraphOut}>{blog.paragraph4}</p>}
                { blog.paragraph5 && 
                    <div className={styles.ParagraphContainers}>
                        <div className={styles.ImageSection}>
                            <img src={`/storage/${blog.image}`} alt={blog.title} className={styles.BlogImageSection} />
                        </div>
                        <div className={styles.ParagraphSection} >
                            {blog.paragraph5 && <p className={styles.Paragraph}>{blog.paragraph5}</p>}
                            {blog.paragraph6 && <p className={styles.Paragraph}>{blog.paragraph6}</p>}
                            {blog.paragraph7 && <p className={styles.Paragraph}>{blog.paragraph7}</p>}
                        </div>
                    </div>
                }
                {blog.paragraph8 && <p className={styles.ParagraphOut}>{blog.paragraph8}</p>}
                {blog.paragraph9 && <p className={styles.ParagraphOut}>{blog.paragraph9}</p>}
                {blog.paragraph10 && <p className={styles.ParagraphOut}>{blog.paragraph10}</p>}
                <small>by - {blog.editor.name}</small>
            </div>
            < NewStock products={newStock} />
            < Offers products={offers} />
        </div>
    </Layout>
  );
}

export default BlogDetails;