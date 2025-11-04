import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarAlt, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './Blog.css';
import { blogService } from '../../services/api';
import { getMediaUrl } from '../../utils/config';
const Blog = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const data = await blogService.getBlogPosts();
      setPosts(data.data);
      setFilteredPosts(data.data);
      setLoading(false);
    };
    fetchBlogPosts();
  }, []);

  // Filter posts based on search
  useEffect(() => {
    if (!search) {
      setFilteredPosts(posts);
      return;
    }

    const results = posts.filter(post =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredPosts(results);
    setCurrentPage(1); // Reset to first page on search
  }, [search, posts]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format date to Arabic format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  return (
    <div className="blog-page">
      <div className="page-banner">
        <h1>{t('blog')}</h1>
      </div>

      <Container className="py-5">
        {/* Search bar */}
        <Row className="mb-4">
          <Col md={8} className="mx-auto">
            <Card className="search-card">
              <Card.Body>
                <InputGroup>
                  <Form.Control
                    placeholder="ابحث في المدونة..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button variant="primary">
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Blog Posts */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
          </div>
        ) : (
          <>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-5">
                <h3>لا توجد مقالات مطابقة</h3>
              </div>
            ) : (
              <>
                <Row>
                  {currentPosts.map(post => (
                    <Col lg={4} md={6} key={post.id} className="mb-4">
                      <Card className="blog-card h-100">
                        <div className="blog-card-img">
                          <img src={getMediaUrl(post.image_path) || ''} alt={post.title} />
                          {post.category && (
                            <span className="blog-category">{post.category}</span>
                          )}
                        </div>
                        <Card.Body>
                          <div className="blog-meta">
                            <span>
                              <FontAwesomeIcon icon={faCalendarAlt} /> {formatDate(post.published_at || post.created_at)}
                            </span>
                            {post.author && <span>{post.author}</span>}
                          </div>
                          <Card.Title>{post.title}</Card.Title>
                          <Card.Text>{post.excerpt}</Card.Text>
                        </Card.Body>
                        <Card.Footer className="bg-white border-0">
                          <Link to={`/blog/${post.slug || post.id}`} className="btn btn-outline-primary">
                            اقرأ المزيد
                          </Link>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <Button
                          className="page-link"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <FontAwesomeIcon icon={faArrowRight} />
                        </Button>
                      </li>

                      {[...Array(totalPages)].map((_, idx) => (
                        <li
                          key={idx}
                          className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}
                        >
                          <Button
                            className="page-link"
                            onClick={() => setCurrentPage(idx + 1)}
                          >
                            {idx + 1}
                          </Button>
                        </li>
                      ))}

                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <Button
                          className="page-link"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          <FontAwesomeIcon icon={faArrowLeft} />
                        </Button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Blog;
