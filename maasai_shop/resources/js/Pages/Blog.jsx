import React, { useState, useRef } from 'react';
import Layout from '../Layouts/Layout';
import styles from '../../css/Blog.module.css';
import { Head, Link } from '@inertiajs/react';
import blogImage from '../../images/LayoutPics/pic1.jpg';

function Blog({ blogs }) {
  const blogHeaderRef = useRef(null);

  const [inputValue, setInputValue] = useState(1);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(9);

  const pages = blogs ? Math.ceil(blogs.length / 9) : 0;

  const handlePagination = (e) => {
    setEnd(e * 9);
    setStart((e * 9) - 9);
    blogHeaderRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // const handleClick = () => {
  //   const numberValue = parseInt(inputValue, 10); // Parse the input to a number
  //   if (!isNaN(numberValue)) { // Check if it's a valid number
  //     // Update state with the parsed number
  //     if (numberValue <= pages && numberValue > 0) {
  //       setInputValue(numberValue);
  //       handlePagination(numberValue);
  //     }
  //   } else {
  //     // Handle invalid input (optional)
  //     // console.error('Please enter a valid number');
  //   }
  // };

  const handleClick = () => {
    const numberValue = parseInt(inputValue, 10);
    if (!isNaN(numberValue) && numberValue <= pages && numberValue > 0) {
      setInputValue(numberValue);
      handlePagination(numberValue);
      blogHeaderRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const filteredBlogs = blogs ? blogs.slice(start, end) : [];

  return (
    <Layout>
      <Head title="Blog" />
      <div className={styles.BlogSection}>
        <div className={styles.ProductCategoryContainer}>
          <div className={styles.ProductCategoryImage}>
            <img src={blogImage} alt="Blog Image" />
            <div className={styles.ProductCategoryOverlay}>
              <div className={styles.ProductCategoryText}>
                <h2>Blog Articles.</h2>
                <h5>These are articles on use case recommendations of products, version updates, maintenance, and different warranty provisions of popular items.</h5>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.BlogContainer}>
          <div className={styles.BlogHeader} ref={blogHeaderRef}>
            <h2>Blog Articles.</h2>
          </div>
          {blogs.length === 0 && (
            <div className={styles.NoBlogContainer}>
              <h5>There are no articles to display. Refresh the page if it's a network error.</h5>
            </div>
          )}
          {blogs.length > 0 && (
            <div className={styles.BlogArticlesContainer}>
              <div className={styles.BlogArticlesSection}>
                {filteredBlogs.map((blog, index) => (
                  <div key={index} className={styles.BlogCard}>
                    <img src={`/storage/${blog.image}`} alt={blog.title} className={styles.BlogCardImage} />
                    <div className={styles.BlogCardOverlay}>
                      <div className={styles.BlogCardContent}>
                        <h3>{blog.title}</h3>
                        <Link href={`/blog/${blog.slug}`} className={styles.BlogCardLink}>
                          Read more
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {filteredBlogs.length === 0 && (
            <div className={styles.NoBlogContainer}>
              <h4>No Blog to Display...</h4>
              <p> Adjust your Filters or refresh the Page if it's a Network error.</p>
            </div>
          )}
          <div className={styles.BlogPagination}>
            <div className={styles.PaginationContainer}>
              <button onClick={handleClick}>Submit</button>
              <input
                type="number"
                value={inputValue >= 1 && inputValue <= pages ? inputValue : ''}
                onChange={handleInputChange}
                placeholder="Page"
              />
            </div>
            <p>Page {inputValue} / {pages} </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Blog;