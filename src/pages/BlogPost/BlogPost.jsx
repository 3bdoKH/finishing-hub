import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser, faTag } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faLinkedinIn, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './BlogPost.css';
import { blogService, commentsService } from '../../services/api';
import { getMediaUrl } from '../../utils/config';
const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchBlogPost = async () => {
      const data = await blogService.getBlogPost(id);
      setPost(data.data);
      setLoading(false);
    };
    fetchBlogPost();
    const fetchRelatedPosts = async () => {
      const data = await blogService.getBlogPosts({ page: 1, limit: 3 });
      setRelatedPosts(data.data);
    };
    fetchRelatedPosts();

    const fetchComments = async () => {
      try {
        const res = await commentsService.getPostComments(id, { limit: 100 });
        if (res.success) setComments(res.data || []);
      } catch (e) {
        console.log(e)
      }
    };
    fetchComments();
  }, [id]);

  // Format date to Arabic format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  const renderStatusBadge = (status) => {
    if (!status) return null;
    const variant = status === 'published' ? 'success' : status === 'archived' ? 'secondary' : 'warning';
    const label = status === 'published' ? 'منشور' : status === 'archived' ? 'مؤرشف' : 'مسودة';
    return <Badge bg={variant} className="ms-2">{label}</Badge>;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await commentsService.addComment(id, {
        content: comment,
        user_name: name,
        user_email: email
      });
      if (res?.success) {
        alert(`شكراً ${name} على التعليق. سيتم مراجعته ونشره قريباً.`);
        setComment('');
        setName('');
        setEmail('');
      }
    } catch (err) {
      alert('تعذر إرسال التعليق. حاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !post) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </Container>
    );
  }
  return (
    <div className="blog-post-page">
      {/* Post Header */}
      <div className="post-header" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${getMediaUrl(post.image_path) || ''})` }}>
        <Container>
          <div className="post-meta">
            <span><FontAwesomeIcon icon={faCalendarAlt} /> {formatDate(post.published_at || post.created_at)}</span>
            {post.author && (
              <span><FontAwesomeIcon icon={faUser} /> {post.author}</span>
            )}
            {post.category && (
              <span><FontAwesomeIcon icon={faTag} /> {post.category}</span>
            )}
            {renderStatusBadge(post.status)}
          </div>
          <h1 className="post-title">{post.title}</h1>
          {post.excerpt && (
            <p className="post-excerpt mt-2">{post.excerpt}</p>
          )}
        </Container>
      </div>

      <Container className="py-5">
        <Row>
          <Col lg={8}>
            {/* Post Content */}
            <Card className="post-content mb-4">
              <Card.Body>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="post-tags">
                    <h5>الوسوم:</h5>
                    <div className="tags-container">
                      {JSON.parse(post.tags).map((tag, index) => (
                        <Link key={index} to={`/blog?tag=${encodeURIComponent(tag)}`} className="tag">
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {/* Share */}
                <div className="post-share">
                  <h5>مشاركة:</h5>
                  <div className="social-share">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn facebook"
                    >
                      <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post?.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn twitter"
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn linkedin"
                    >
                      <FontAwesomeIcon icon={faLinkedinIn} />
                    </a>
                    <a
                      href={`https://wa.me/?text=${post?.title} ${window.location.href}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="share-btn whatsapp"
                    >
                      <FontAwesomeIcon icon={faWhatsapp} />
                    </a>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Comments */}
            <Card className="mb-4">
              <Card.Body>
                <h3 className="section-title">التعليقات ({comments.length})</h3>

                {comments.length === 0 ? (
                  <p className="text-muted mb-0">لا توجد تعليقات بعد.</p>
                ) : (
                  <div className="comments-list">
                    {comments.map(c => (
                      <div key={c.id} className="comment-item">
                        <div className="comment-avatar">
                          {(c.user_name || 'زائر').charAt(0)}
                        </div>
                        <div className="comment-body">
                          <div className="comment-header">
                            <h5>{c.user_name || 'زائر'}</h5>
                            <span className="comment-date">{new Date(c.created_at).toLocaleDateString('ar-EG')}</span>
                          </div>
                          <p>{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Comment Form */}
            <Card>
              <Card.Body>
                <h3 className="section-title">اترك تعليقاً</h3>
                <Form onSubmit={handleCommentSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="اكتب تعليقك هنا..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="الاسم"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Control
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Col>
                  </Row>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    إرسال التعليق
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Sidebar */}
            <div className="blog-sidebar">
              {/* Author */}
              <Card className="mb-4">
                <Card.Body className="text-center">
                  {/* <div className="author-avatar">{post.author.charAt(0)}</div> */}
                  <h4>{post.author}</h4>
                  <p className="author-bio">كاتب ومتخصص في مجال التشطيبات والديكور الداخلي، يقدم نصائح وإرشادات للمقبلين على تشطيب منازلهم.</p>
                </Card.Body>
              </Card>

              {/* Related Posts */}
              <Card className="mb-4">
                <Card.Header className="bg-white">
                  <h4 className="sidebar-title">مقالات ذات صلة</h4>
                </Card.Header>
                <Card.Body>
                  {relatedPosts.map(post => (
                    <div key={post.id} className="related-post">
                      <div className="related-post-img">
                        <img src={getMediaUrl(post.image_path)} alt={post.title} />
                      </div>
                      <div className="related-post-content">
                        <h5>
                          <Link to={`/blog/${post.slug || post.id}`}>{post.title}</Link>
                        </h5>
                        <div className="related-post-date">
                          <FontAwesomeIcon icon={faCalendarAlt} /> {formatDate(post.published_at || post.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>

              {/* Tags Cloud */}
              <Card>
                <Card.Header className="bg-white">
                  <h4 className="sidebar-title">الوسوم</h4>
                </Card.Header>
                <Card.Body>
                  <div className="tags-cloud">
                    {['تشطيبات', 'ديكور', 'تصميم داخلي', 'تجديد', 'دهانات', 'أرضيات', 'إضاءة', 'مطابخ', 'حمامات', 'غرف نوم'].map((tag, index) => (
                      <Link key={index} to={`/blog?tag=${tag}`} className="tag">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BlogPost;
