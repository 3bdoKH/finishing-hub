import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch, faStar, faFilter, faMapMarkerAlt,
    faPhone, faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import './Companies.css';
import { getMediaUrl } from '../../utils/config';
const Companies = () => {
    const { t } = useTranslation();
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 8;

    // Categories list
    const categories = useMemo(() => ([
        { id: 'all', name: 'كل الفئات' },
        { id: 'painting', name: 'دهانات' },
        { id: 'flooring', name: 'أرضيات' },
        { id: 'kitchen', name: 'مطابخ' },
        { id: 'bathroom', name: 'حمامات' },
        { id: 'electrical', name: 'كهرباء' },
        { id: 'plumbing', name: 'سباكة' },
        { id: 'carpentry', name: 'نجارة' }
    ]), []);

    // Locations list
    const locations = useMemo(() => ([
        { id: 'all', name: 'كل المحافظات' },
        { id: 'cairo', name: 'القاهرة' },
        { id: 'giza', name: 'الجيزة' },
        { id: 'alexandria', name: 'الإسكندرية' },
        { id: 'mansoura', name: 'المنصورة' },
        { id: 'aswan', name: 'أسوان' },
        { id: 'luxor', name: 'الأقصر' }
    ]), []);

    // Ratings list
    const ratings = [
        { id: 'all', name: 'الكل' },
        { id: '5', name: '5 نجوم' },
        { id: '4', name: '4 نجوم وأعلى' },
        { id: '3', name: '3 نجوم وأعلى' }
    ];

    useEffect(() => {
        // Fetch companies from the API
        const fetchCompanies = async () => {
            try {
                const response = await fetch(`https://winchelmohandes-furniture.online/api/public/companies`);
                if (!response.ok) {
                    throw new Error('Failed to fetch companies');
                }

                const data = await response.json();
                console.log(data);
                if (data.success && Array.isArray(data.data)) {
                    setCompanies(data.data);
                    setFilteredCompanies(data.data);
                } else {
                    // If no companies returned or error, use mock data for demo
                    const mockCompanies = Array(20).fill().map((_, idx) => ({
                        id: idx + 1,
                        name: `شركة ${idx + 1} للتشطيبات`,
                        description: 'شركة متخصصة في تشطيبات الشقق والفلل والمكاتب بأعلى جودة',
                        logo: `/sample/company${(idx % 4) + 1}.jpg`,
                        rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0-5.0
                        location: locations[Math.floor(Math.random() * (locations.length - 1)) + 1].name,
                        categories: [
                            categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
                            categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id
                        ],
                        phone: '01234567890',
                        address: 'شارع التحرير، القاهرة'
                    }));
                    setCompanies(mockCompanies);
                    setFilteredCompanies(mockCompanies);
                }
            } catch (error) {
                console.error("Error fetching companies:", error);
                // Use mock data as fallback
                const mockCompanies = Array(20).fill().map((_, idx) => ({
                    id: idx + 1,
                    name: `شركة ${idx + 1} للتشطيبات`,
                    description: 'شركة متخصصة في تشطيبات الشقق والفلل والمكاتب بأعلى جودة',
                    logo: `/sample/company${(idx % 4) + 1}.jpg`,
                    rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0-5.0
                    location: locations[Math.floor(Math.random() * (locations.length - 1)) + 1].name,
                    categories: [
                        categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
                        categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id
                    ],
                    phone: '01234567890',
                    address: 'شارع التحرير، القاهرة'
                }));
                setCompanies(mockCompanies);
                setFilteredCompanies(mockCompanies);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [locations, categories]);

    // Filter companies based on search and filters
    useEffect(() => {
        let result = companies;

        // Apply search
        if (search) {
            result = result.filter(company =>
                company.name.toLowerCase().includes(search.toLowerCase()) ||
                company.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply category filter
        if (categoryFilter && categoryFilter !== 'all') {
            result = result.filter(company =>
                company.categories.includes(categoryFilter)
            );
        }

        // Apply location filter
        if (locationFilter && locationFilter !== 'all') {
            result = result.filter(company =>
                company.location.toLowerCase().includes(locations.find(loc => loc.id === locationFilter).name.toLowerCase())
            );
        }

        // Apply rating filter
        if (ratingFilter && ratingFilter !== 'all') {
            result = result.filter(company =>
                parseFloat(company.rating) >= parseInt(ratingFilter)
            );
        }

        setFilteredCompanies(result);
        setCurrentPage(1); // Reset to first page on filter change
    }, [search, categoryFilter, locationFilter, ratingFilter, companies, locations]);

    // Pagination
    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
    const currentCompanies = filteredCompanies.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="companies-page">
            <div className="page-banner">
                <h1>{t('companies')}</h1>
            </div>

            <Container className="py-5">
                <Row>
                    {/* Search and Filters */}
                    <Col lg={12} className="mb-4">
                        <Card className="search-card">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col md={8}>
                                        <InputGroup>
                                            <Form.Control
                                                placeholder={t('searchCompanies')}
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                            <Button variant="primary" style={{ borderRadius: '10px 0px 0px 10px !important' }}>
                                                <FontAwesomeIcon icon={faSearch} /> بحث
                                            </Button>

                                        </InputGroup>
                                    </Col>
                                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="filter-toggle-btn"
                                        >
                                            <FontAwesomeIcon icon={faFilter} /> {t('filter')}
                                        </Button>
                                    </Col>
                                </Row>

                                {showFilters && (
                                    <Row className="mt-3 filter-options">
                                        <Col md={4} className="mb-3">
                                            <Form.Label>{t('categories')}</Form.Label>
                                            <Form.Select
                                                value={categoryFilter}
                                                onChange={(e) => setCategoryFilter(e.target.value)}
                                            >
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                        <Col md={4} className="mb-3">
                                            <Form.Label>{t('location')}</Form.Label>
                                            <Form.Select
                                                value={locationFilter}
                                                onChange={(e) => setLocationFilter(e.target.value)}
                                            >
                                                {locations.map(location => (
                                                    <option key={location.id} value={location.id}>{location.name}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                        <Col md={4} className="mb-3">
                                            <Form.Label>{t('rating')}</Form.Label>
                                            <Form.Select
                                                value={ratingFilter}
                                                onChange={(e) => setRatingFilter(e.target.value)}
                                            >
                                                {ratings.map(rating => (
                                                    <option key={rating.id} value={rating.id}>{rating.name}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Companies Listing */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">جاري التحميل...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {filteredCompanies.length === 0 ? (
                            <div className="text-center py-5">
                                <h3>{t('noCompanies')}</h3>
                            </div>
                        ) : (
                            <>
                                <Row>
                                    <Col md={12} className="mb-3">
                                        <p className="results-count">
                                            إجمالي النتائج: {filteredCompanies.length} شركة
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    {currentCompanies.map(company => (
                                        <Col lg={6} key={company.id} className="mb-4">
                                            <Card className="company-list-card">
                                                <Row className="g-0">
                                                    <Col md={4} className="company-logo-container">
                                                        <img
                                                            src={getMediaUrl(company.logo_path)}
                                                            alt={company.company_name}
                                                            className="company-logo img-fluid rounded-start"
                                                        />
                                                    </Col>
                                                    <Col md={8}>
                                                        <Card.Body>
                                                            <div className="d-flex justify-content-between">
                                                                <Card.Title>{company.company_name}</Card.Title>
                                                                <span className="company-rating">
                                                                    <FontAwesomeIcon icon={faStar} className="text-warning" /> {company.rating}
                                                                </span>
                                                            </div>
                                                            <Card.Text className="company-description">
                                                                {company.description}
                                                            </Card.Text>
                                                            <div className="company-details mb-2">
                                                                <p className="mb-1">
                                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                                                                    {company.address}
                                                                </p>
                                                                <p className="mb-1">
                                                                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                                                                    {company.contact_email}
                                                                </p>
                                                            </div>
                                                            {Array.isArray(company.categories) && company.categories.length > 0 && (
                                                                <div className="mb-3">
                                                                    {(company.categories || []).slice(0, 4).map((cat) => (
                                                                        <span key={cat.id || cat} className="badge bg-light text-dark border me-1">{cat.name || cat}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <Link to={`/companies/${company.id}`} className="btn btn-outline-primary">
                                                                عرض التفاصيل
                                                            </Link>
                                                        </Card.Body>
                                                    </Col>
                                                </Row>
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
                                                    <FontAwesomeIcon icon={faChevronRight} />
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
                                                    <FontAwesomeIcon icon={faChevronLeft} />
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

export default Companies;
