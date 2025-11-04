import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faStar, faArrowLeft, faArrowRight, faMapMarkerAlt, faCheck, faPhone } from '@fortawesome/free-solid-svg-icons';
import './Home.css';
import { getApiBaseUrl, getMediaUrl } from '../../utils/config';
const Home = () => {
    const { t } = useTranslation();
    const [featuredCompanies, setFeaturedCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [latestReviews] = useState([
        {
            id: 1,
            companyId: 1,
            companyName: 'شركة الأهرام للتشطيبات',
            reviewer: 'أحمد علي',
            rating: 5,
            comment: 'شغل ممتاز والتزام بالمواعيد. أنصح بالتعامل معهم.',
        },
        {
            id: 2,
            companyId: 3,
            companyName: 'المستقبل للديكور',
            reviewer: 'منة محمد',
            rating: 4,
            comment: 'تصميمات عصرية وخدمة محترمة، يوجد مجال للتحسين في التسليم.',
        },
        {
            id: 3,
            companyId: 2,
            companyName: 'النور للتشطيبات',
            reviewer: 'كريم سامي',
            rating: 5,
            comment: 'أسعار مناسبة مقابل جودة عالية جدًا.',
        },
    ]);
    const topCities = ['القاهرة', 'الجيزة', 'الإسكندرية', 'المنصورة', 'طنطا', 'أسيوط'];

    useEffect(() => {
        // This would be replaced with a real API call
        const fetchFeaturedCompanies = async () => {
            const response = await fetch(`${getApiBaseUrl()}/public/companies`);
            const data = await response.json();
            setFeaturedCompanies(data.data);
            console.log(data.data);
            setLoading(false);
        };
        fetchFeaturedCompanies();

    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        rtl: true,
        prevArrow: <Button variant="outline-primary" className="slick-arrow slick-prev"><FontAwesomeIcon icon={faArrowRight} /></Button>,
        nextArrow: <Button variant="outline-primary" className="slick-arrow slick-next"><FontAwesomeIcon icon={faArrowLeft} /></Button>,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="overlay"></div>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} className="text-center">
                            <h1>{t('welcomeMessage')}</h1>
                            <p className="lead">{t('findCompanies')}</p>
                            <div className="search-box">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="ابحث عن شركات التشطيب..."
                                        aria-label="Search companies"
                                    />
                                    <Button variant="primary" className="search-btn">
                                        <FontAwesomeIcon icon={faSearch} /> بحث
                                    </Button>
                                </div>
                            </div>
                            <div className="hero-buttons">
                                <Link to="/companies" className="btn btn-primary btn-lg">
                                    {t('exploreNow')}
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Featured Companies Section */}
            <section className="featured-section py-5">
                <Container>
                    <h2 className="section-title">{t('featuredCompanies')}</h2>
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">جاري التحميل...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Slider {...sliderSettings} className="featured-companies-slider">
                                {featuredCompanies.map(company => (
                                    <div key={company.id} className="p-2">
                                        <Card className="company-card h-100">
                                            <div className="card-img-container">
                                                <Card.Img variant="top" src={getMediaUrl(company.logo_path)} alt={company.company_name} />
                                            </div>
                                            <Card.Body>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <Card.Title>{company.company_name}</Card.Title>
                                                    <span className="rating">
                                                        <FontAwesomeIcon icon={faStar} className="text-warning" /> {company.review_count}
                                                    </span>
                                                </div>
                                                <Card.Text>{company.description.slice(0, 80)}...</Card.Text>
                                            </Card.Body>
                                            <Card.Footer className="bg-white border-0">
                                                <Link to={`/companies/${company.id}`} className="btn btn-outline-primary btn-sm w-100">
                                                    عرض التفاصيل
                                                </Link>
                                            </Card.Footer>
                                        </Card>
                                    </div>
                                ))}
                            </Slider>
                            <div className="text-center mt-4">
                                <Link to="/companies" className="btn btn-outline-primary">
                                    {t('viewAll')}
                                </Link>
                            </div>
                        </>
                    )}
                </Container>
            </section>

            {/* Services Section */}
            <section className="services-section py-5 bg-light">
                <Container>
                    <h2 className="section-title">خدماتنا</h2>
                    <Row className="g-4">
                        <Col md={4}>
                            <div className="service-card text-center p-4">
                                <div className="service-icon mb-3">
                                    <i className="fas fa-paint-roller fa-3x"></i>
                                </div>
                                <h3>تشطيب كامل</h3>
                                <p>تشطيب كامل للشقق والفلل والمكاتب بأعلى جودة وأقل تكلفة.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="service-card text-center p-4">
                                <div className="service-icon mb-3">
                                    <i className="fas fa-drafting-compass fa-3x"></i>
                                </div>
                                <h3>تصميم داخلي</h3>
                                <p>تصميمات داخلية عصرية ومميزة تلبي احتياجاتك وتناسب ذوقك.</p>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="service-card text-center p-4">
                                <div className="service-icon mb-3">
                                    <i className="fas fa-tools fa-3x"></i>
                                </div>
                                <h3>صيانة وتجديد</h3>
                                <p>خدمات صيانة وتجديد للمباني القائمة بالإضافة إلى أعمال الإصلاح.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section py-5">
                <Container>
                    <h2 className="section-title">كيف تعمل منصتنا؟</h2>
                    <Row className="g-4 mt-1">
                        <Col md={4}>
                            <Card className="h-100 text-center p-3">
                                <Card.Body>
                                    <div className="mb-3 text-primary">
                                        <FontAwesomeIcon icon={faSearch} size="2x" />
                                    </div>
                                    <h5>ابحث وقارن</h5>
                                    <p className="mb-0">استكشف أفضل شركات التشطيبات وقارن التقييمات والخدمات والأسعار.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="h-100 text-center p-3">
                                <Card.Body>
                                    <div className="mb-3 text-success">
                                        <FontAwesomeIcon icon={faPhone} size="2x" />
                                    </div>
                                    <h5>تواصل بسهولة</h5>
                                    <p className="mb-0">تواصل مباشرة مع الشركة عبر الهاتف أو واتساب لطلب عرض سعر.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="h-100 text-center p-3">
                                <Card.Body>
                                    <div className="mb-3 text-warning">
                                        <FontAwesomeIcon icon={faCheck} size="2x" />
                                    </div>
                                    <h5>اختَر ونفّذ</h5>
                                    <p className="mb-0">اختَر الأنسب وابدأ التنفيذ بثقة اعتمادًا على تقييمات العملاء.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Browse by City Section */}
            <section className="browse-city-section py-5 bg-light">
                <Container>
                    <h2 className="section-title">تصفح الشركات حسب المدينة</h2>
                    <Row className="g-3 mt-1">
                        {topCities.map((city) => (
                            <Col key={city} xs={6} md={4} lg={3}>
                                <Link to={`/companies?city=${encodeURIComponent(city)}`} className="text-decoration-none">
                                    <Card className="h-100 p-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                                            <span className="fw-semibold text-dark">{city}</span>
                                        </div>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Latest Reviews Section */}
            <section className="latest-reviews-section py-5">
                <Container>
                    <h2 className="section-title">أحدث التقييمات</h2>
                    <Row className="g-4 mt-1">
                        {latestReviews.map((rev) => (
                            <Col key={rev.id} md={4}>
                                <Card className="h-100">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h5 className="mb-0">{rev.reviewer}</h5>
                                            <div className="rating">
                                                {[...Array(5)].map((_, i) => (
                                                    <FontAwesomeIcon key={i} icon={faStar} className={i < rev.rating ? 'text-warning' : 'text-muted'} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-muted mb-2">عن <Link to={`/companies/${rev.companyId}`}>{rev.companyName}</Link></p>
                                        <p className="mb-0">{rev.comment}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-5">
                <Container className="text-center">
                    <h2>هل أنت مالك شركة تشطيبات؟</h2>
                    <p className="lead">انضم إلينا اليوم وقم بزيادة مبيعاتك والوصول إلى عملاء جدد</p>
                    <Button variant="primary" size="lg" className="mt-3">
                        اتصل بنا الآن
                    </Button>
                </Container>
            </section>
        </>
    );
};

export default Home;
