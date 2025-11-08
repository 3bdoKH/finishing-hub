import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Card, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faStar, faArrowLeft, faArrowRight, faMapMarkerAlt, faCheck, faPhone, faShieldAlt, faAward, faCertificate, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './Home.css';
import { getApiBaseUrl, getMediaUrl } from '../../utils/config';
import { publicService, blogService } from '../../services/api';
import bannerImage from '../../media/banner.png';
const Home = () => {
    const { t } = useTranslation();
    const [featuredCompanies, setFeaturedCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState(null);
    const [blogPosts, setBlogPosts] = useState([]);
    const [email, setEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState('');
    const statsRef = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [animatedStats, setAnimatedStats] = useState({
        companies_count: 0,
        categories_count: 0,
        reviews_count: 0,
        cities_count: 0
    });
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

    const faqs = [
        {
            id: 1,
            question: 'ما هي منصة  دليل التشطيبات؟',
            answer: 'منصة تشطيب كومبانيز هي أول منصة عربية متخصصة في ربط أصحاب المشاريع بأفضل شركات التشطيبات والديكور. نوفر لك إمكانية البحث والمقارنة بين مئات الشركات المعتمدة والموثوقة.'
        },
        {
            id: 2,
            question: 'هل الخدمة مجانية للعملاء؟',
            answer: 'نعم، استخدام المنصة مجاني بالكامل للعملاء. يمكنك البحث عن الشركات، مشاهدة التقييمات، والتواصل معهم دون أي رسوم.'
        },
        {
            id: 3,
            question: 'كيف يمكنني التأكد من جودة الشركات المسجلة؟',
            answer: 'نقوم بفحص وتدقيق جميع الشركات المسجلة على المنصة. كما يمكنك الاطلاع على تقييمات العملاء السابقين ومشاريعهم المنجزة قبل اتخاذ قرارك.'
        },
        {
            id: 4,
            question: 'هل يمكنني الحصول على عروض أسعار من عدة شركات؟',
            answer: 'بالتأكيد! يمكنك التواصل مع عدة شركات في نفس الوقت والحصول على عروض أسعار مختلفة لمقارنتها واختيار الأنسب لك.'
        },
        {
            id: 5,
            question: 'كيف يمكنني تسجيل شركتي على المنصة؟',
            answer: 'يمكنك التسجيل من خلال صفحة "انضم إلينا" أو التواصل معنا مباشرة. سيقوم فريقنا بمراجعة طلبك والتواصل معك خلال 24 ساعة.'
        }
    ];

    const trustBadges = [
        { id: 1, icon: faShieldAlt, title: 'شركات موثوقة', desc: '100% معتمدة ومفحوصة' },
        { id: 2, icon: faAward, title: 'أفضل الأسعار', desc: 'مقارنة وعروض حصرية' },
        { id: 3, icon: faCertificate, title: 'ضمان الجودة', desc: 'التزام بالمعايير العالمية' },
        { id: 4, icon: faCheck, title: 'دعم متواصل', desc: 'فريق دعم على مدار الساعة' }
    ];
    const topCities = [
        "القاهرة",
        "الجيزة",
        "القليوبية",
        "الإسكندرية",
        "البحيرة",
        "مطروح",
        "دمياط",
        "الدقهلية",
        "كفر الشيخ",
        "الغربية",
        "المنوفية",
        "الشرقية",
        "بورسعيد",
        "الإسماعيلية",
        "السويس",
        "شمال سيناء",
        "جنوب سيناء",
        "بني سويف",
        "الفيوم",
        "المنيا",
        "أسيوط",
        "سوهاج",
        "قنا",
        "الأقصر",
        "أسوان",
        "البحر الأحمر",
        "الوادي الجديد"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [companiesRes, categoriesRes, statsRes, blogRes] = await Promise.all([
                    fetch(`${getApiBaseUrl()}/public/companies`).then(r => r.json()),
                    publicService.getCategories(),
                    publicService.getWebsiteStats().catch(() => ({ success: false, data: null })),
                    blogService.getBlogPosts({ page: 1, pageSize: 6 }).catch(() => ({ success: false, data: { items: [] } }))
                ]);
                setFeaturedCompanies(companiesRes?.data || []);
                setCategories(categoriesRes?.data || []);
                setStats(statsRes?.data || null);
                setBlogPosts(blogRes?.data?.items || blogRes?.data || []);
                console.log(statsRes)
            } catch (_) {
                // ignore errors for homepage softness
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Counter animation effect
    useEffect(() => {
        const animateCounters = () => {
            const duration = 2000;
            const steps = 60;
            const stepDuration = duration / steps;

            let currentStep = 0;
            const timer = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;

                setAnimatedStats({
                    companies_count: Math.floor((stats?.companies || 0) * progress),
                    categories_count: Math.floor((stats?.services || 0) * progress),
                    reviews_count: Math.floor((stats?.reviews || 0) * progress),
                    cities_count: Math.floor((stats?.cities || 0) * progress)
                });

                if (currentStep >= steps) {
                    clearInterval(timer);
                    setAnimatedStats({
                        companies_count: stats?.companies || 0,
                        categories_count: stats?.services || 0,
                        reviews_count: stats?.reviews || 0,
                        cities_count: stats?.cities || 0
                    });
                }
            }, stepDuration);
        };

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated && stats) {
                    setHasAnimated(true);
                    animateCounters();
                }
            },
            { threshold: 0.3 }
        );

        const currentRef = statsRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [stats, hasAnimated]);

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setNewsletterStatus('error');
            return;
        }

        // Simulate API call
        setNewsletterStatus('loading');
        setTimeout(() => {
            setNewsletterStatus('success');
            setEmail('');
            setTimeout(() => setNewsletterStatus(''), 3000);
        }, 1000);
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        rtl: true,
        prevArrow: <Button variant="outline-primary" className="slick-arrow slick-prev"><FontAwesomeIcon icon={faArrowRight} /></Button>,
        nextArrow: <Button variant="outline-primary" className="slick-arrow slick-next"><FontAwesomeIcon icon={faArrowLeft} /></Button>,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: true,
                    infinite: true,
                    autoplay: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: true,
                    infinite: true,
                    autoplay: true
                }
            },
            {
                breakpoint: 430,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: true,
                    arrows: false,
                    infinite: true,
                    autoplay: true
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
                            <span className="hero-badge">أفضل منصة لشركات التشطيبات</span>
                            <h1 className="hero-title">{t('welcomeMessage')}</h1>
                            <p className="lead hero-subtitle">{t('findCompanies')}</p>
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
                                <Link to="/companies" className="btn btn-primary btn-lg me-2">
                                    {t('exploreNow')}
                                </Link>
                                <Link to="/about" className="btn btn-outline-light btn-lg">
                                    تعرّف علينا
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Sponsors Banner Section */}
            <section className="sponsors-banner-section py-4">
                <Container>
                    <div className="sponsors-banner-content">
                        <h3 className="sponsors-title mb-4">رعاة الموقع</h3>
                        <div className="sponsors-logos">
                            <div className="sponsor-item">
                                <img src={bannerImage} alt="Sponsor" className="sponsor-logo" onClick={() => window.open('https://emereld-marketing.online', '_blank')} />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Categories Section */}
            <section className="categories-section py-5">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-title mb-3">تصفح حسب الفئة</h2>
                        <p className="section-subtitle text-muted">اختر الخدمة التي تبحث عنها من بين مجموعة متنوعة من فئات التشطيب</p>
                    </div>
                    <Row className="g-3 mt-1">
                        {(categories || []).slice(0, 12).map((cat) => (
                            <Col key={cat.id} xs={6} sm={4} md={3} lg={2}>
                                <Link to={`/companies?category=${cat.id}`} className="text-decoration-none">
                                    <div className="category-card p-3 h-100">
                                        <div className="category-avatar mb-2">
                                            <span>{(cat.name || '').slice(0, 2)}</span>
                                        </div>
                                        <div className="category-name text-truncate">{cat.name}</div>
                                    </div>
                                </Link>
                            </Col>
                        ))}
                        {(!categories || categories.length === 0) && (
                            <Col>
                                <div className="text-muted">لا توجد فئات متاحة حالياً</div>
                            </Col>
                        )}
                    </Row>
                    <div className="text-center mt-5">
                        <Link to="/companies" className="btn btn-view-all">
                            عرض جميع الشركات
                            <FontAwesomeIcon icon={faArrowLeft} className="ms-2" />
                        </Link>
                    </div>
                </Container>
            </section>

            <section className="featured-section py-5">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-title mb-3">{t('featuredCompanies')}</h2>
                        <p className="section-subtitle text-muted">اكتشف أفضل شركات التشطيب المميزة والموثوقة</p>
                    </div>
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
                                        <Card className="company-card h-100 hover-lift">
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
                            <div className="text-center mt-5">
                                <Link to="/companies" className="btn btn-view-all-outline">
                                    {t('viewAll')}
                                    <FontAwesomeIcon icon={faArrowLeft} className="ms-2" />
                                </Link>
                            </div>
                        </>
                    )}
                </Container>
            </section>

            {/* Trust Badges Section */}
            <section className="trust-section py-5">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-title mb-3">لماذا تختار منصتنا؟</h2>
                        <p className="section-subtitle text-muted">نوفر لك تجربة موثوقة وآمنة للعثور على أفضل شركات التشطيب</p>
                    </div>
                    <Row className="g-4">
                        {trustBadges.map((badge) => (
                            <Col key={badge.id} xs={6} md={3}>
                                <div className="trust-badge text-center">
                                    <div className="trust-icon mb-3">
                                        <FontAwesomeIcon icon={badge.icon} size="3x" />
                                    </div>
                                    <h5 className="trust-title">{badge.title}</h5>
                                    <p className="trust-desc">{badge.desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Stats Section */}
            <section className="stats-section py-5 bg-light" ref={statsRef}>
                <Container>
                    <Row className="g-4 text-center">
                        <Col xs={6} md={3}>
                            <div className="stat-card p-4">
                                <div className="stat-number">
                                    {hasAnimated ? animatedStats.companies_count : (stats?.companies_count ?? '—')}
                                    {hasAnimated && animatedStats.companies_count > 0 && '+'}
                                </div>
                                <div className="stat-label">شركة مسجلة</div>
                            </div>
                        </Col>
                        <Col xs={6} md={3}>
                            <div className="stat-card p-4">
                                <div className="stat-number">
                                    {hasAnimated ? animatedStats.categories_count : (stats?.categories_count ?? '—')}
                                    {hasAnimated && animatedStats.categories_count > 0 && '+'}
                                </div>
                                <div className="stat-label">فئة</div>
                            </div>
                        </Col>
                        <Col xs={6} md={3}>
                            <div className="stat-card p-4">
                                <div className="stat-number">
                                    {hasAnimated ? animatedStats.reviews_count : (stats?.reviews_count ?? '—')}
                                    {hasAnimated && animatedStats.reviews_count > 0 && '+'}
                                </div>
                                <div className="stat-label">تقييم منشور</div>
                            </div>
                        </Col>
                        <Col xs={6} md={3}>
                            <div className="stat-card p-4">
                                <div className="stat-number">
                                    {hasAnimated ? animatedStats.cities_count : (stats?.cities_count ?? '—')}
                                    {hasAnimated && animatedStats.cities_count > 0 && '+'}
                                </div>
                                <div className="stat-label">مدينة مُغطاة</div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Services Section */}
            <section className="services-section py-5 bg-light">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-title mb-3">خدماتنا المتميزة</h2>
                        <p className="section-subtitle text-muted">نقدم مجموعة شاملة من خدمات التشطيب والديكور</p>
                    </div>
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
                    <div className="text-center mb-5">
                        <h2 className="section-title mb-3">كيف تعمل منصتنا؟</h2>
                        <p className="section-subtitle text-muted">ثلاث خطوات بسيطة للوصول إلى أفضل شركات التشطيب</p>
                    </div>
                    <Row className="g-4">
                        <Col md={4}>
                            <Card className="h-100 text-center p-4 how-it-works-card">
                                <Card.Body>
                                    <div className="step-number mb-3">01</div>
                                    <div className="step-icon mb-4">
                                        <FontAwesomeIcon icon={faSearch} size="2x" />
                                    </div>
                                    <h5 className="fw-bold mb-3">ابحث وقارن</h5>
                                    <p className="mb-0 text-muted">استكشف أفضل شركات التشطيبات وقارن التقييمات والخدمات والأسعار.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="h-100 text-center p-4 how-it-works-card">
                                <Card.Body>
                                    <div className="step-number mb-3">02</div>
                                    <div className="step-icon mb-4">
                                        <FontAwesomeIcon icon={faPhone} size="2x" />
                                    </div>
                                    <h5 className="fw-bold mb-3">تواصل بسهولة</h5>
                                    <p className="mb-0 text-muted">تواصل مباشرة مع الشركة عبر الهاتف أو واتساب لطلب عرض سعر.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="h-100 text-center p-4 how-it-works-card">
                                <Card.Body>
                                    <div className="step-number mb-3">03</div>
                                    <div className="step-icon mb-4">
                                        <FontAwesomeIcon icon={faCheck} size="2x" />
                                    </div>
                                    <h5 className="fw-bold mb-3">اختَر ونفّذ</h5>
                                    <p className="mb-0 text-muted">اختَر الأنسب وابدأ التنفيذ بثقة اعتمادًا على تقييمات العملاء.</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Browse by City Section */}
            <section className="browse-city-section py-5 bg-light">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-title mb-3">تصفح الشركات حسب المدينة</h2>
                        <p className="section-subtitle text-muted">اختر مدينتك واعثر على أفضل الشركات القريبة منك</p>
                    </div>
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
            <section className="testimonials-section py-5">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-title mb-3">أحدث التقييمات</h2>
                        <p className="section-subtitle text-muted">اقرأ آراء العملاء الذين جربوا خدمات شركاتنا</p>
                    </div>
                    <Slider dots arrows={false} autoplay rtl slidesToShow={3} slidesToScroll={1}
                        responsive={[{ breakpoint: 992, settings: { slidesToShow: 2 } }, { breakpoint: 576, settings: { slidesToShow: 1 } }]}>
                        {latestReviews.map((rev) => (
                            <div key={rev.id} className="p-2">
                                <Card className="testimonial-card h-100">
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
                            </div>
                        ))}
                    </Slider>
                </Container>
            </section>

            {/* Blog Section */}
            <section className="blog-section py-5 bg-light">
                <Container>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="section-title mb-0">المقالات</h2>
                        <Link to="/blog" className="text-decoration-none small fw-semibold">عرض الكل</Link>
                    </div>
                    <Row className="g-4 mt-1">
                        {(blogPosts || []).slice(0, 3).map((post) => (
                            <Col key={post.id || post._id} md={4}>
                                <Card className="blog-card h-100 hover-lift">
                                    {post.image_path && (
                                        <div className="card-img-container">
                                            <Card.Img variant="top" src={getMediaUrl(post.image_path)} alt={post.title} />
                                        </div>
                                    )}
                                    <Card.Body>
                                        <h5 className="mb-2 text-truncate">{post.title}</h5>
                                        <p className="text-muted mb-3">{(post.excerpt || post.content || '').slice(0, 100)}...</p>
                                        <Link to={`/blog/${post.id || post.slug}`} className="stretched-link"></Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                        {(!blogPosts || blogPosts.length === 0) && (
                            <Col>
                                <div className="text-muted">لا توجد مقالات متاحة حالياً</div>
                            </Col>
                        )}
                    </Row>
                </Container>
            </section>

            {/* FAQ Section */}
            <section className="faq-section py-5">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-title">الأسئلة الشائعة</h2>
                        <p className="text-muted">إجابات على أكثر الأسئلة تكرارًا</p>
                    </div>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Accordion defaultActiveKey="0" className="faq-accordion">
                                {faqs.map((faq, index) => (
                                    <Accordion.Item key={faq.id} eventKey={index.toString()} className="faq-item">
                                        <Accordion.Header className="faq-header">
                                            <span className="faq-question">{faq.question}</span>
                                        </Accordion.Header>
                                        <Accordion.Body className="faq-body">
                                            {faq.answer}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-section py-5">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6} className="mb-4 mb-lg-0">
                            <div className="newsletter-content">
                                <div className="newsletter-icon mb-3">
                                    <FontAwesomeIcon icon={faEnvelope} size="3x" />
                                </div>
                                <h2 className="newsletter-title">اشترك في نشرتنا البريدية</h2>
                                <p className="newsletter-desc">احصل على آخر الأخبار والعروض الحصرية والنصائح المفيدة في عالم التشطيبات والديكور</p>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                                <div className="input-group newsletter-input-group">
                                    <input
                                        type="email"
                                        className="form-control newsletter-input"
                                        placeholder="أدخل بريدك الإلكتروني"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                                    />
                                    <Button
                                        type="submit"
                                        className="newsletter-btn"
                                        disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                                    >
                                        {newsletterStatus === 'loading' ? 'جاري الإرسال...' :
                                            newsletterStatus === 'success' ? 'تم الاشتراك!' : 'اشترك الآن'}
                                    </Button>
                                </div>
                                {newsletterStatus === 'error' && (
                                    <small className="text-danger mt-2 d-block">الرجاء إدخال بريد إلكتروني صحيح</small>
                                )}
                                {newsletterStatus === 'success' && (
                                    <small className="text-success mt-2 d-block">شكرًا لاشتراكك! سنرسل لك آخر التحديثات قريبًا.</small>
                                )}
                            </form>
                        </Col>
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
