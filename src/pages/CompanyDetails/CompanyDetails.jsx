import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Tab, Nav, Modal, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPhone, faEnvelope, faMapMarkerAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faThumbsUp, faCommentAlt, faShare, faCode } from '@fortawesome/free-solid-svg-icons';
import { getMediaUrl } from '../../utils/config';
import { publicService, reviewService } from '../../services/api';
import './CompanyDetails.css';

const CompanyDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [name, setName] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  useEffect(() => {
    // Fetch company details from API
    const fetchCompanyDetails = async () => {
      try {
        const response = await publicService.getCompanyDetails(id);
        console.log(response.data);
        if (response.success && response.data) {
          setCompany(response.data);
        }
        console.log('Company data:', response.data);
      } catch (error) {
        console.error("Error fetching company details:", error);
        // Use mock data as fallback
        setCompany({
          id: parseInt(id),
          name: `شركة ${id} للتشطيبات`,
          description: `شركة ${id} للتشطيبات هي إحدى الشركات الرائدة في مجال تشطيب وتجديد المنازل والشقق والفلل في مصر.`,
          logo: `/sample/company${(parseInt(id) % 4) + 1}.jpg`,
          rating: (Math.random() * 2 + 3).toFixed(1),
          reviewsCount: Math.floor(Math.random() * 50) + 10,
          location: 'القاهرة، مصر',
          address: 'شارع التحرير، وسط البلد، القاهرة',
          phone: ['01234567890'],
          whatsapp: ['01234567890'],
          email: 'info@company.com',
          website: 'www.company-example.com',
          social: { facebook: '#', instagram: '#' },
          since: '2015',
          services: ['تشطيب كامل للشقق', 'تشطيب فلل وقصور'],
          images: ['/sample/interior1.jpg', '/sample/interior2.jpg'],
          videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
          plans: [],
          reviews: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id]);


  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      alert('يرجى إختيار تقييم من 1 إلى 5 نجوم');
      return;
    }

    try {
      // Send review to API using reviewService
      const data = await reviewService.addReview(id, {
        reviewer_name: name,
        rating,
        comment: review
      });

      if (data.success) {
        alert('تم إضافة تقييمك بنجاح! شكراً على مشاركة رأيك');

        // Optimistically update recent reviews and counters
        const prevCount = Number(company.reviews?.count || 0);
        const prevAvg = Number(company.reviews?.avg_rating || 0);
        const newCount = prevCount + 1;
        const newAvg = ((prevAvg * prevCount) + rating) / newCount;

        setCompany({
          ...company,
          reviews: {
            ...company.reviews,
            count: newCount,
            avg_rating: newAvg.toFixed(1)
          },
          recent_reviews: [
            {
              id: data.data?.id || Date.now(),
              reviewer_name: name,
              rating,
              comment: review,
              created_at: new Date().toISOString()
            },
            ...(Array.isArray(company.recent_reviews) ? company.recent_reviews : [])
          ]
        });

        // Reset form
        setRating(0);
        setReview('');
        setName('');
      } else {
        throw new Error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(`حدث خطأ أثناء إرسال التقييم. يرجى المحاولة مرة أخرى. ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </Container>
    );
  }

  return (
    <div className="company-details-page">
      {/* Company Header */}
      <div className="company-header">
        <Container>
          <Row className="align-items-center">
            <Col md={3} className="text-center text-md-start mb-3 mb-md-0">
              <img src={getMediaUrl(company.logo_path)} alt={company.company_name} className="company-logo" />
            </Col>
            <Col md={6} className="mb-3 mb-md-0">
              <h1 className="company-name">{company.company_name}</h1>
              <div className="company-rating">
                <FontAwesomeIcon icon={faStar} className="text-warning" /> {company.reviews.avg_rating}
                <span className="reviews-count">({company.reviews.count} {t('reviews')})</span>
              </div>
              {Array.isArray(company.categories) && company.categories.length > 0 && (
                <div className="mt-2">
                  {company.categories.map((cat) => (
                    <span key={cat.id} className="badge bg-light text-dark border me-1">{cat.name}</span>
                  ))}
                </div>
              )}
              <div className="company-location">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> {company.address}
              </div>
            </Col>
            <Col md={3} className="text-center text-md-end">
              <Button variant="success" className="contact-btn mb-2 w-100" onClick={() => window.open(`https://wa.me/${company.whatsapp[0].number}`, '_blank')}>
                <FontAwesomeIcon icon={faWhatsapp} /> واتساب
              </Button>
              <Button variant="primary" className="contact-btn w-100" onClick={() => window.open(`tel:${company.phones[0].number}`, '_blank')}>
                <FontAwesomeIcon icon={faPhone} /> اتصل الآن
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Company Navigation */}
      <div className="company-nav">
        <Container>
          <Nav variant="tabs" defaultActiveKey="overview" onSelect={setActiveTab} className="company-tabs">
            <Nav.Item>
              <Nav.Link eventKey="overview">نبذة عن الشركة</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="gallery">{t('gallery')}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="services">{t('services')}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="pricing">{t('pricingPlans')}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="reviews">{t('reviews')}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="contact">{t('contactInfo')}</Nav.Link>
            </Nav.Item>
          </Nav>
        </Container>
      </div>

      {/* Company Content */}
      <Container className="py-4">
        <Tab.Content>
          {/* Overview Tab */}
          <Tab.Pane active={activeTab === 'overview'}>
            <Row>
              <Col lg={8}>
                <Card className="mb-4">
                  <Card.Body>
                    <h2 className="section-subtitle">نبذة عن الشركة</h2>
                    <p>{company.description}</p>
                    <div className="company-stats">
                      <div className="stat-item">
                        <span className="stat-label">التقييم:</span>
                        <span className="stat-value">
                          <FontAwesomeIcon icon={faStar} className="text-warning" /> {company.reviews.avg_rating}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">عدد التقييمات:</span>
                        <span className="stat-value">{company.reviews.count}</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="mb-4">
                  <Card.Body>
                    <h2 className="section-subtitle">خدمات الشركة</h2>
                    <Row>
                      {company.services.map((service, index) => (
                        <Col key={service.id} md={6}>
                          <div className="service-item">
                            <FontAwesomeIcon icon={faCheck} className="service-icon" /> {service.service_name || service}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <h2 className="section-subtitle">معرض الصور</h2>
                    <div className="gallery-preview">
                      {company.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="gallery-preview-item">
                          <img src={getMediaUrl(image.image_path || image)} alt={`صورة ${index + 1}`} />
                        </div>
                      ))}
                      <Button
                        variant="light"
                        className="show-more-btn"
                        onClick={() => setActiveTab('gallery')}
                      >
                        عرض المزيد
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="contact-card mb-4">
                  <Card.Body>
                    <h2 className="section-subtitle">{t('contactInfo')}</h2>

                    <div className="contact-item">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
                      <div>
                        <h5>العنوان</h5>
                        <p>{company.address}</p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                      <div>
                        <h5>الهاتف</h5>
                        {company.phones.map((phone, index) => (
                          <p key={index} className="mb-1" onClick={() => window.open(`tel:${phone.number}`, '_blank')}>{phone.number || phone}</p>
                        ))}
                      </div>
                    </div>

                    {company.whatsapp.length > 0 && (
                      <div className="contact-item">
                        <FontAwesomeIcon icon={faWhatsapp} className="contact-icon whatsapp-icon" />
                        <div>
                          <h5>واتساب</h5>
                          {company.whatsapp.map((whatsapp, index) => (
                            <p key={index} className="mb-1" onClick={() => window.open(`https://wa.me/${whatsapp.number}`, '_blank')}>{whatsapp.number || whatsapp}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="contact-item">
                      <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                      <div>
                        <h5>البريد الإلكتروني</h5>
                        <p>{company.contact_email}</p>
                      </div>
                    </div>

                    <div className="social-links">
                      {company.social_links?.facebook && (
                        <a href={company.social_links.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                          <FontAwesomeIcon icon={faFacebook} />
                        </a>
                      )}
                      {company.social_links?.instagram && (
                        <a href={company.social_links.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                          <FontAwesomeIcon icon={faInstagram} />
                        </a>
                      )}
                      {company.social_links?.website && (
                        <a href={company.social_links.website} target="_blank" rel="noopener noreferrer" className="social-link">
                          <FontAwesomeIcon icon={faCode} />
                        </a>
                      )}
                    </div>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <h2 className="section-subtitle">اترك تقييماً</h2>
                    <div className="rating-container mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`rating-star ${i < rating ? 'active' : ''}`}
                          onClick={() => setRating(i + 1)}
                        >
                          <FontAwesomeIcon icon={faStar} />
                        </span>
                      ))}
                    </div>
                    <Form onSubmit={handleReviewSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>الاسم</Form.Label>
                        <Form.Control
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>التعليق</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={review}
                          onChange={(e) => setReview(e.target.value)}
                          required
                        />
                      </Form.Group>
                      <Button variant="primary" type="submit" disabled={rating === 0}>
                        إرسال التقييم
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Gallery Tab */}
          <Tab.Pane active={activeTab === 'gallery'}>
            <Card>
              <Card.Body>
                <h2 className="section-subtitle">معرض الصور</h2>
                <div className="company-gallery">
                  {company.images.map((image, index) => (
                    <div key={index} className="gallery-item" style={{ cursor: 'pointer' }} onClick={() => { setActiveImageIndex(index); setShowImageModal(true); }}>
                      <img src={getMediaUrl(image.image_path || image)} alt={`صورة ${index + 1}`} />
                    </div>
                  ))}
                </div>

                {company.videos && company.videos.length > 0 && (
                  <>
                    <h3 className="section-subtitle mt-4">{t('videos')}</h3>
                    <div className="company-videos">
                      {company.videos.map((video, index) => (
                        <div key={index} className="video-item">
                          <iframe
                            src={getMediaUrl(video.video_path)}
                            title={`فيديو ${index + 1}`}
                            frameBorder="0"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Services Tab */}
          <Tab.Pane active={activeTab === 'services'}>
            <Card>
              <Card.Body>
                <h2 className="section-subtitle">خدمات الشركة</h2>
                <Row className="services-list">
                  {company.services.map((service, index) => (
                    <Col key={index} md={4} className="mb-3">
                      <div className="service-card">
                        <FontAwesomeIcon icon={faCheck} className="service-icon" />
                        <h4>{service.service_name || service}</h4>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Pricing Plans Tab */}
          <Tab.Pane active={activeTab === 'pricing'}>
            <Card>
              <Card.Body>
                <h2 className="section-subtitle">باقات الأسعار</h2>
                <Row>
                  {company.pricing_plans.map(plan => (
                    <Col key={plan.id} md={4}>
                      <div className="pricing-plan">
                        <div className="plan-header">
                          <h3>{plan.title}</h3>
                          <p>{plan.description}</p>
                          <div className="plan-price">
                            <span className="price">{plan.price_per_meter}</span>
                            <span className="period">{t('perMeter')}</span>
                          </div>
                        </div>
                        <div className="plan-features">
                          <ul>
                            {plan.pros.map((feature, i) => (
                              <li key={i}>
                                <FontAwesomeIcon icon={faCheck} className="feature-icon" /> {feature.pro_text}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="plan-footer">
                          <Button variant="outline-primary" className="select-plan-btn">
                            اختر هذه الباقة
                          </Button>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Reviews Tab */}
          <Tab.Pane active={activeTab === 'reviews'}>
            <Card className="mb-4">
              <Card.Body>
                <div className="reviews-header">
                  <h2 className="section-subtitle">{t('reviews')}</h2>
                  <div className="rating-summary">
                    <div className="average-rating">
                      <span className="rating-number">{company.reviews.avg_rating}</span>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <FontAwesomeIcon
                            key={i}
                            icon={faStar}
                            className={i < Math.round(company.reviews.avg_rating) ? 'text-warning' : 'text-muted'}
                          />
                        ))}
                      </div>
                      <span className="total-reviews">من {company.reviews.count} تقييم</span>
                    </div>
                  </div>
                </div>

                <div className="reviews-list">
                  {(Array.isArray(company.recent_reviews) ? company.recent_reviews : []).map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <h5>{review.reviewer_name}</h5>
                          <div className="review-date">{new Date(review.created_at).toLocaleDateString('ar-EG')}</div>
                        </div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={faStar}
                              className={i < review.rating ? 'text-warning' : 'text-muted'}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="review-content">{review.comment}</div>
                      <div className="review-actions">
                        <Button variant="link" size="sm" className="review-action-btn">
                          <FontAwesomeIcon icon={faThumbsUp} /> مفيد
                        </Button>
                        <Button variant="link" size="sm" className="review-action-btn">
                          <FontAwesomeIcon icon={faCommentAlt} /> رد
                        </Button>
                        <Button variant="link" size="sm" className="review-action-btn">
                          <FontAwesomeIcon icon={faShare} /> مشاركة
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="primary" className="mt-3" onClick={() => document.querySelector('#review-form').scrollIntoView({ behavior: 'smooth' })}>
                  {t('addReview')}
                </Button>
              </Card.Body>
            </Card>

            <Card id="review-form">
              <Card.Body>
                <h2 className="section-subtitle">اترك تقييماً</h2>
                <div className="rating-container mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`rating-star ${i < rating ? 'active' : ''}`}
                      onClick={() => setRating(i + 1)}
                    >
                      <FontAwesomeIcon icon={faStar} />
                    </span>
                  ))}
                </div>
                <Form onSubmit={handleReviewSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>الاسم</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>التعليق</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={rating === 0}>
                    إرسال التقييم
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Contact Tab */}
          <Tab.Pane active={activeTab === 'contact'}>
            <Row>
              <Col lg={6}>
                <Card className="mb-4 mb-lg-0">
                  <Card.Body>
                    <h2 className="section-subtitle">{t('contactInfo')}</h2>

                    <div className="contact-item">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
                      <div>
                        <h5>العنوان</h5>
                        <p>{company.address}</p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                      <div>
                        <h5>الهاتف</h5>
                        {company.phones.map((phone, index) => (
                          <p key={index} className="mb-1">
                            <a href={`tel:${phone.number || phone}`} className="contact-link">{phone.number || phone}</a>
                          </p>
                        ))}
                      </div>
                    </div>

                    {company.whatsapp.length > 0 && (
                      <div className="contact-item">
                        <FontAwesomeIcon icon={faWhatsapp} className="contact-icon whatsapp-icon" />
                        <div>
                          <h5>واتساب</h5>
                          {company.whatsapp.map((num, index) => (
                            <p key={index} className="mb-1">
                              <a
                                href={`https://wa.me/${num.number || num}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-link"
                              >
                                {num.number || num}
                              </a>
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="contact-item">
                      <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                      <div>
                        <h5>البريد الإلكتروني</h5>
                        <p><a href={`mailto:${company.contact_email}`} className="contact-link">{company.contact_email}</a></p>
                      </div>
                    </div>

                    <div className="social-links">
                      {company.social_links?.facebook && (
                        <a href={company.social_links.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                          <FontAwesomeIcon icon={faFacebook} />
                        </a>
                      )}
                      {company.social_links?.instagram && (
                        <a href={company.social_links.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                          <FontAwesomeIcon icon={faInstagram} />
                        </a>
                      )}
                      {company.social_links?.website && (
                        <a href={company.social_links.website} target="_blank" rel="noopener noreferrer" className="social-link">
                          <FontAwesomeIcon icon={faCode} />
                        </a>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={6}>
                <Card>
                  <Card.Body>
                    <h2 className="section-subtitle">تواصل مع الشركة</h2>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>الاسم</Form.Label>
                        <Form.Control type="text" required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>البريد الإلكتروني</Form.Label>
                        <Form.Control type="email" required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>رقم الهاتف</Form.Label>
                        <Form.Control type="tel" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>الرسالة</Form.Label>
                        <Form.Control as="textarea" rows={5} required />
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        إرسال الرسالة
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Container>
      {/* Image Viewer Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>معرض الصور</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {company?.images && company.images.length > 0 && (
            <Image
              src={getMediaUrl(company.images[activeImageIndex]?.image_path || company.images[activeImageIndex])}
              alt={`صورة ${activeImageIndex + 1}`}
              fluid
            />
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button
            variant="outline-secondary"
            onClick={() => setActiveImageIndex((prev) => (prev - 1 + company.images.length) % company.images.length)}
          >
            السابقة
          </Button>
          <div>{(activeImageIndex + 1)} / {company?.images?.length || 0}</div>
          <Button
            variant="outline-primary"
            onClick={() => setActiveImageIndex((prev) => (prev + 1) % company.images.length)}
          >
            التالية
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompanyDetails;
