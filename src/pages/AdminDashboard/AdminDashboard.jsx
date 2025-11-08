import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Nav, Modal, Form, Alert, Badge, Spinner, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBuilding, faComments, faEnvelope, faBlog, faChartLine, faUsers, faSignOutAlt,
    faCog, faKey, faEdit, faTrash, faPlus, faEye, faStar
} from '@fortawesome/free-solid-svg-icons';
import { publicService, adminService, authService, blogService, commentsService } from '../../services/api';
import { getMediaUrl } from '../../utils/config';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();

    // State Management
    const [activeSection, setActiveSection] = useState('overview');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });

    // Overview Stats
    const [stats, setStats] = useState({ companies: 0, reviews: 0, cities: 0, services: 0 });
    const [recentCompanies, setRecentCompanies] = useState([]);

    // Companies Management
    const [companies, setCompanies] = useState([]);
    const [companiesPage, setCompaniesPage] = useState(1);
    const [companiesTotalPages, setCompaniesTotalPages] = useState(1);
    const [companiesSearch, setCompaniesSearch] = useState('');
    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [companyForm, setCompanyForm] = useState({
        username: '', password: '', email: '', company_name: '',
        description: '', address: '', city: '', region: '', contact_email: ''
    });

    // Reviews Management
    const [reviews, setReviews] = useState([]);
    const [reviewsPage, setReviewsPage] = useState(1);
    const [reviewsTotalPages, setReviewsTotalPages] = useState(1);

    // Messages Management
    const [messages, setMessages] = useState([]);
    const [messagesPage, setMessagesPage] = useState(1);
    const [messagesTotalPages, setMessagesTotalPages] = useState(1);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    // Blog Management
    const [blogPosts, setBlogPosts] = useState([]);
    const [blogPage, setBlogPage] = useState(1);
    const [blogTotalPages, setBlogTotalPages] = useState(1);
    const [showBlogModal, setShowBlogModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [blogForm, setBlogForm] = useState({
        title: '',
        content: '',
        author: '',
        slug: '',
        excerpt: '',
        category: '',
        status: 'draft',
        published_at: '',
        tags: []
    });
    const [tagsInput, setTagsInput] = useState('');
    const [blogImage, setBlogImage] = useState(null);

    // Comments Moderation
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [commentsPost, setCommentsPost] = useState(null);
    const [commentsList, setCommentsList] = useState([]);
    const [commentsStatus, setCommentsStatus] = useState('pending');
    const [commentsLoading, setCommentsLoading] = useState(false);

    // Settings
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [categories, setCategories] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
    const [editingCategory, setEditingCategory] = useState(null);

    // Load initial data
    useEffect(() => {
        if (activeSection === 'overview') fetchOverviewData();
        else if (activeSection === 'companies') fetchCompanies();
        else if (activeSection === 'reviews') fetchReviews();
        else if (activeSection === 'messages') fetchMessages();
        else if (activeSection === 'blog') fetchBlogPosts();
        else if (activeSection === 'settings') fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSection, companiesPage, reviewsPage, messagesPage, blogPage]);

    // Alert helper
    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
    };

    // ==================== OVERVIEW SECTION ====================
    const fetchOverviewData = async () => {
        setLoading(true);
        try {
            const response = await publicService.getWebsiteStats();
            if (response.success) {
                setStats({
                    companies: response.data.companies,
                    reviews: response.data.reviews,
                    cities: response.data.cities,
                    services: response.data.services
                });
                setRecentCompanies(response.data.recent_companies || []);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            showAlert('danger', 'فشل في تحميل الإحصائيات');
        } finally {
            setLoading(false);
        }
    };

    // ==================== COMPANIES SECTION ====================
    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllCompanies({ page: companiesPage, limit: 10, search: companiesSearch });
            if (response.success) {
                setCompanies(response.data);
                setCompaniesTotalPages(response.pagination.pages);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
            showAlert('danger', 'فشل في تحميل الشركات');
        } finally {
            setLoading(false);
        }
    };

    const handleCompanySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingCompany) {
                await adminService.updateCompany(editingCompany.id, companyForm);
                showAlert('success', 'تم تحديث الشركة بنجاح');
            } else {
                await adminService.createCompany(companyForm);
                showAlert('success', 'تم إضافة الشركة بنجاح');
            }
            setShowCompanyModal(false);
            setEditingCompany(null);
            setCompanyForm({ username: '', password: '', email: '', company_name: '', description: '', address: '', city: '', region: '', contact_email: '' });
            fetchCompanies();
        } catch (error) {
            showAlert('danger', error.response?.data?.message || 'فشل في حفظ الشركة');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCompany = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه الشركة؟')) return;
        setLoading(true);
        try {
            await adminService.deleteCompany(id);
            showAlert('success', 'تم حذف الشركة بنجاح');
            fetchCompanies();
        } catch (error) {
            showAlert('danger', 'فشل في حذف الشركة');
        } finally {
            setLoading(false);
        }
    };

    const openCompanyModal = (company = null) => {
        if (company) {
            setEditingCompany(company);
            setCompanyForm({
                username: company.username || '',
                password: '',
                email: company.email || '',
                company_name: company.company_name || '',
                description: company.description || '',
                address: company.address || '',
                city: company.city || '',
                region: company.region || '',
                contact_email: company.contact_email || ''
            });
        } else {
            setEditingCompany(null);
            setCompanyForm({ username: '', password: '', email: '', company_name: '', description: '', address: '', city: '', region: '', contact_email: '' });
        }
        setShowCompanyModal(true);
    };

    // ==================== REVIEWS SECTION ====================
    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllReviews({ page: reviewsPage, limit: 10 });
            if (response.success) {
                setReviews(response.data);
                setReviewsTotalPages(response.pagination?.pages || 1);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            showAlert('danger', 'فشل في تحميل المراجعات');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه المراجعة؟')) return;
        setLoading(true);
        try {
            await adminService.deleteReview(id);
            showAlert('success', 'تم حذف المراجعة بنجاح');
            fetchReviews();
        } catch (error) {
            showAlert('danger', 'فشل في حذف المراجعة');
        } finally {
            setLoading(false);
        }
    };

    // ==================== MESSAGES SECTION ====================
    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await adminService.getContactMessages({ page: messagesPage, limit: 10 });
            if (response.success) {
                setMessages(response.data);
                setMessagesTotalPages(response.pagination?.pages || 1);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            showAlert('danger', 'فشل في تحميل الرسائل');
        } finally {
            setLoading(false);
        }
    };

    const handleViewMessage = async (message) => {
        setSelectedMessage(message);
        setShowMessageModal(true);
        if (!message.is_read) {
            try {
                await adminService.markMessageAsRead(message.id);
                fetchMessages();
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
        setLoading(true);
        try {
            await adminService.deleteContactMessage(id);
            showAlert('success', 'تم حذف الرسالة بنجاح');
            fetchMessages();
        } catch (error) {
            showAlert('danger', 'فشل في حذف الرسالة');
        } finally {
            setLoading(false);
        }
    };

    // ==================== BLOG SECTION ====================
    const fetchBlogPosts = async () => {
        setLoading(true);
        try {
            const response = await blogService.getBlogPosts({ page: blogPage, limit: 10 });
            if (response.success) {
                setBlogPosts(response.data);
                setBlogTotalPages(response.pagination?.pages || 1);
            }
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            showAlert('danger', 'فشل في تحميل المقالات');
        } finally {
            setLoading(false);
        }
    };

    const handleBlogSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const normalizedTags = tagsInput
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0);

            const dataToSend = {
                ...blogForm,
                content: (blogForm.content || '').replace(/\n/g, '<br />'),
                tags: normalizedTags
            };
            if (editingBlog) {
                await adminService.updateBlogPost(editingBlog.id, dataToSend, blogImage);
                showAlert('success', 'تم تحديث المقال بنجاح');
            } else {
                await adminService.createBlogPost(dataToSend, blogImage);
                showAlert('success', 'تم إضافة المقال بنجاح');
            }
            setShowBlogModal(false);
            setEditingBlog(null);
            setBlogForm({ title: '', content: '', author: '', slug: '', excerpt: '', category: '', status: 'draft', published_at: '', tags: [] });
            setTagsInput('');
            setBlogImage(null);
            fetchBlogPosts();
        } catch (error) {
            showAlert('danger', error.response?.data?.message || 'فشل في حفظ المقال');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
        setLoading(true);
        try {
            await adminService.deleteBlogPost(id);
            showAlert('success', 'تم حذف المقال بنجاح');
            fetchBlogPosts();
        } catch (error) {
            showAlert('danger', 'فشل في حذف المقال');
        } finally {
            setLoading(false);
        }
    };

    const openBlogModal = (blog = null) => {
        if (blog) {
            setEditingBlog(blog);
            setBlogForm({
                title: blog.title || '',
                content: (blog.content || '').replace(/<br\s*\/?>(\r\n|\n|\r)?/gi, '\n'),
                author: blog.author || '',
                slug: blog.slug || '',
                excerpt: blog.excerpt || '',
                category: blog.category || '',
                status: blog.status || 'draft',
                published_at: blog.published_at ? new Date(blog.published_at).toISOString().slice(0, 16) : '',
                tags: Array.isArray(blog.tags) ? blog.tags : (blog.tags ? blog.tags : [])
            });
            setTagsInput((Array.isArray(blog.tags) ? blog.tags : []).join(', '));
        } else {
            setEditingBlog(null);
            setBlogForm({ title: '', content: '', author: '', slug: '', excerpt: '', category: '', status: 'draft', published_at: '', tags: [] });
            setTagsInput('');
        }
        setBlogImage(null);
        setShowBlogModal(true);
    };

    // ==================== COMMENTS MODERATION ====================
    const openCommentsModal = async (post) => {
        setCommentsPost(post);
        setShowCommentsModal(true);
        await fetchCommentsForPost(post, commentsStatus);
    };

    const fetchCommentsForPost = async (post, status) => {
        if (!post) return;
        setCommentsLoading(true);
        try {
            const res = await commentsService.getPostCommentsAdmin(post.slug || post.id, { status });
            if (res.success) setCommentsList(res.data || []);
        } catch (e) {
            setCommentsList([]);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleApproveComment = async (commentId) => {
        try {
            await commentsService.approveComment(commentId);
            showAlert('success', 'تمت الموافقة على التعليق');
            await fetchCommentsForPost(commentsPost, commentsStatus);
        } catch (e) {
            showAlert('danger', 'فشل في الموافقة على التعليق');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('حذف هذا التعليق؟')) return;
        try {
            await commentsService.deleteComment(commentId);
            showAlert('success', 'تم حذف التعليق');
            await fetchCommentsForPost(commentsPost, commentsStatus);
        } catch (e) {
            showAlert('danger', 'فشل في حذف التعليق');
        }
    };

    // ==================== SETTINGS SECTION ====================
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await publicService.getCategories();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            showAlert('danger', 'فشل في تحميل الفئات');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            showAlert('danger', 'كلمات المرور غير متطابقة');
            return;
        }
        setLoading(true);
        try {
            await authService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            showAlert('success', 'تم تغيير كلمة المرور بنجاح');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            showAlert('danger', error.response?.data?.message || 'فشل في تغيير كلمة المرور');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // ==================== RENDER ====================
    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <h4>لوحة تحكم المدير</h4>
                    <p className="text-muted mb-0">مرحباً، {currentUser?.username}</p>
                </div>

                <Nav className="flex-column sidebar-nav">
                    <Nav.Link className={activeSection === 'overview' ? 'active admin-nav-link' : 'admin-nav-link'} onClick={() => setActiveSection('overview')}>
                        <FontAwesomeIcon icon={faChartLine} className="me-2" />نظرة عامة
                    </Nav.Link>
                    <Nav.Link className={activeSection === 'companies' ? 'active admin-nav-link' : 'admin-nav-link'} onClick={() => setActiveSection('companies')}>
                        <FontAwesomeIcon icon={faBuilding} className="me-2" />إدارة الشركات
                    </Nav.Link>
                    <Nav.Link className={activeSection === 'reviews' ? 'active admin-nav-link' : 'admin-nav-link'} onClick={() => setActiveSection('reviews')}>
                        <FontAwesomeIcon icon={faComments} className="me-2" />المراجعات
                    </Nav.Link>
                    <Nav.Link className={activeSection === 'messages' ? 'active admin-nav-link' : 'admin-nav-link'} onClick={() => setActiveSection('messages')}>
                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />الرسائل
                    </Nav.Link>
                    <Nav.Link className={activeSection === 'blog' ? 'active admin-nav-link' : 'admin-nav-link'} onClick={() => setActiveSection('blog')}>
                        <FontAwesomeIcon icon={faBlog} className="me-2" />المدونة
                    </Nav.Link>
                    <Nav.Link className={activeSection === 'settings' ? 'active admin-nav-link' : 'admin-nav-link'} onClick={() => setActiveSection('settings')}>
                        <FontAwesomeIcon icon={faCog} className="me-2" />الإعدادات
                    </Nav.Link>
                </Nav>

                <div className="sidebar-footer">
                    <Button variant="outline-danger" onClick={handleLogout} className="w-100">
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />تسجيل الخروج
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-content">
                <Container fluid>
                    {alert.show && <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, type: '', message: '' })}>{alert.message}</Alert>}

                    {/* OVERVIEW SECTION */}
                    {activeSection === 'overview' && (
                        <>
                            <Row className="mb-4">
                                <Col><h2>نظرة عامة</h2><p className="text-muted">إحصائيات ومعلومات المنصة</p></Col>
                            </Row>
                            <Row className="mb-4">
                                <Col md={3} className="mb-3">
                                    <Card className="stat-card stat-card-primary">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div><p className="stat-label">الشركات المسجلة</p><h3 className="stat-value">{stats.companies}</h3></div>
                                                <div className="stat-icon"><FontAwesomeIcon icon={faBuilding} size="2x" /></div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3} className="mb-3">
                                    <Card className="stat-card stat-card-success">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div><p className="stat-label">المراجعات</p><h3 className="stat-value">{stats.reviews}</h3></div>
                                                <div className="stat-icon"><FontAwesomeIcon icon={faComments} size="2x" /></div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3} className="mb-3">
                                    <Card className="stat-card stat-card-info">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div><p className="stat-label">المدن</p><h3 className="stat-value">{stats.cities}</h3></div>
                                                <div className="stat-icon"><FontAwesomeIcon icon={faUsers} size="2x" /></div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={3} className="mb-3">
                                    <Card className="stat-card stat-card-warning">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div><p className="stat-label">الخدمات</p><h3 className="stat-value">{stats.services}</h3></div>
                                                <div className="stat-icon"><FontAwesomeIcon icon={faCog} size="2x" /></div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Card>
                                        <Card.Header><h5 className="mb-0">أحدث الشركات المسجلة</h5></Card.Header>
                                        <Card.Body>
                                            {recentCompanies.length > 0 ? (
                                                <Table responsive hover>
                                                    <thead><tr><th>الشعار</th><th>اسم الشركة</th><th>تاريخ التسجيل</th><th>الإجراءات</th></tr></thead>
                                                    <tbody>
                                                        {recentCompanies.map((company) => (
                                                            <tr key={company.id}>
                                                                <td>
                                                                    {company.logo_path ? (
                                                                        <img src={getMediaUrl(company.logo_path)} alt={company.company_name}
                                                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                                                                    ) : (<div style={{ width: '50px', height: '50px', background: '#e9ecef', borderRadius: '8px' }}></div>)}
                                                                </td>
                                                                <td>{company.company_name}</td>
                                                                <td>{new Date(company.created_at).toLocaleDateString('ar-EG')}</td>
                                                                <td><Button size="sm" variant="outline-primary" onClick={() => navigate(`/companies/${company.id}`)}>عرض التفاصيل</Button></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            ) : (<p className="text-muted text-center py-4">لا توجد شركات مسجلة حتى الآن</p>)}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    )}

                    {/* COMPANIES SECTION */}
                    {activeSection === 'companies' && (
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Header className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">إدارة الشركات</h5>
                                        <div className="d-flex gap-2">
                                            <Form.Control type="text" placeholder="بحث..." value={companiesSearch} onChange={(e) => setCompaniesSearch(e.target.value)} style={{ width: '200px' }} />
                                            <Button variant="primary" onClick={() => openCompanyModal()}>
                                                <FontAwesomeIcon icon={faPlus} className="me-2" />إضافة شركة
                                            </Button>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        {loading ? (
                                            <div className="text-center py-5"><Spinner animation="border" /></div>
                                        ) : companies.length > 0 ? (
                                            <>
                                                <Table responsive hover>
                                                    <thead><tr><th>الاسم</th><th>البريد</th><th>المدينة</th><th>تاريخ التسجيل</th><th>الإجراءات</th></tr></thead>
                                                    <tbody>
                                                        {companies.map((company) => (
                                                            <tr key={company.id}>
                                                                <td>{company.company_name}</td>
                                                                <td>{company.email}</td>
                                                                <td>{company.city || '-'}</td>
                                                                <td>{new Date(company.created_at).toLocaleDateString('ar-EG')}</td>
                                                                <td>
                                                                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openCompanyModal(company)}>
                                                                        <FontAwesomeIcon icon={faEdit} />
                                                                    </Button>
                                                                    <Button size="sm" variant="outline-danger" onClick={() => handleDeleteCompany(company.id)}>
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                {companiesTotalPages > 1 && (
                                                    <Pagination className="justify-content-center">
                                                        {[...Array(companiesTotalPages)].map((_, i) => (
                                                            <Pagination.Item key={i + 1} active={companiesPage === i + 1} onClick={() => setCompaniesPage(i + 1)}>{i + 1}</Pagination.Item>
                                                        ))}
                                                    </Pagination>
                                                )}
                                            </>
                                        ) : (<p className="text-center text-muted py-5">لا توجد شركات</p>)}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {/* REVIEWS SECTION */}
                    {activeSection === 'reviews' && (
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Header><h5 className="mb-0">إدارة المراجعات</h5></Card.Header>
                                    <Card.Body>
                                        {loading ? (
                                            <div className="text-center py-5"><Spinner animation="border" /></div>
                                        ) : reviews.length > 0 ? (
                                            <>
                                                <Table responsive hover>
                                                    <thead><tr><th>اسم المراجع</th><th>التقييم</th><th>التعليق</th><th>الشركة</th><th>التاريخ</th><th>الإجراءات</th></tr></thead>
                                                    <tbody>
                                                        {reviews.map((review) => (
                                                            <tr key={review.id}>
                                                                <td>{review.reviewer_name}</td>
                                                                <td>
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <FontAwesomeIcon key={i} icon={faStar} style={{ color: i < review.rating ? '#ffc107' : '#e9ecef' }} />
                                                                    ))}
                                                                </td>
                                                                <td>{review.comment.substring(0, 50)}...</td>
                                                                <td>{review.company_name || `شركة #${review.company_id}`}</td>
                                                                <td>{new Date(review.created_at).toLocaleDateString('ar-EG')}</td>
                                                                <td>
                                                                    <Button size="sm" variant="outline-danger" onClick={() => handleDeleteReview(review.id)}>
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                {reviewsTotalPages > 1 && (
                                                    <Pagination className="justify-content-center">
                                                        {[...Array(reviewsTotalPages)].map((_, i) => (
                                                            <Pagination.Item key={i + 1} active={reviewsPage === i + 1} onClick={() => setReviewsPage(i + 1)}>{i + 1}</Pagination.Item>
                                                        ))}
                                                    </Pagination>
                                                )}
                                            </>
                                        ) : (<p className="text-center text-muted py-5">لا توجد مراجعات</p>)}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {/* MESSAGES SECTION */}
                    {activeSection === 'messages' && (
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Header><h5 className="mb-0">الرسائل الواردة</h5></Card.Header>
                                    <Card.Body>
                                        {loading ? (
                                            <div className="text-center py-5"><Spinner animation="border" /></div>
                                        ) : messages.length > 0 ? (
                                            <>
                                                <Table responsive hover>
                                                    <thead><tr><th>الاسم</th><th>البريد</th><th>الموضوع</th><th>التاريخ</th><th>الحالة</th><th>الإجراءات</th></tr></thead>
                                                    <tbody>
                                                        {messages.map((message) => (
                                                            <tr key={message.id} style={{ fontWeight: message.is_read ? 'normal' : 'bold' }}>
                                                                <td>{message.name}</td>
                                                                <td>{message.email}</td>
                                                                <td>{message.subject || 'بدون موضوع'}</td>
                                                                <td>{new Date(message.created_at).toLocaleDateString('ar-EG')}</td>
                                                                <td>
                                                                    {message.is_read ? (
                                                                        <Badge bg="secondary">مقروءة</Badge>
                                                                    ) : (
                                                                        <Badge bg="primary">جديدة</Badge>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleViewMessage(message)}>
                                                                        <FontAwesomeIcon icon={faEye} />
                                                                    </Button>
                                                                    <Button size="sm" variant="outline-danger" onClick={() => handleDeleteMessage(message.id)}>
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                {messagesTotalPages > 1 && (
                                                    <Pagination className="justify-content-center">
                                                        {[...Array(messagesTotalPages)].map((_, i) => (
                                                            <Pagination.Item key={i + 1} active={messagesPage === i + 1} onClick={() => setMessagesPage(i + 1)}>{i + 1}</Pagination.Item>
                                                        ))}
                                                    </Pagination>
                                                )}
                                            </>
                                        ) : (<p className="text-center text-muted py-5">لا توجد رسائل</p>)}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {/* BLOG SECTION */}
                    {activeSection === 'blog' && (
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Header className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">إدارة المدونة</h5>
                                        <Button variant="primary" onClick={() => openBlogModal()}>
                                            <FontAwesomeIcon icon={faPlus} className="me-2" />إضافة مقال
                                        </Button>
                                    </Card.Header>
                                    <Card.Body>
                                        {loading ? (
                                            <div className="text-center py-5"><Spinner animation="border" /></div>
                                        ) : blogPosts.length > 0 ? (
                                            <>
                                                <Table responsive hover>
                                                    <thead><tr><th>العنوان</th><th>المحتوى</th><th>التاريخ</th><th>الإجراءات</th></tr></thead>
                                                    <tbody>
                                                        {blogPosts.map((post) => (
                                                            <tr key={post.id}>
                                                                <td>{post.title}</td>
                                                                <td>{post.content}...</td>
                                                                <td>{new Date(post.created_at).toLocaleDateString('ar-EG')}</td>
                                                                <td>
                                                                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openBlogModal(post)}>
                                                                        <FontAwesomeIcon icon={faEdit} />
                                                                    </Button>
                                                                    <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => openCommentsModal(post)}>
                                                                        <FontAwesomeIcon icon={faComments} /> التعليقات
                                                                    </Button>
                                                                    <Button size="sm" variant="outline-danger" onClick={() => handleDeleteBlog(post.id)}>
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                                {blogTotalPages > 1 && (
                                                    <Pagination className="justify-content-center">
                                                        {[...Array(blogTotalPages)].map((_, i) => (
                                                            <Pagination.Item key={i + 1} active={blogPage === i + 1} onClick={() => setBlogPage(i + 1)}>{i + 1}</Pagination.Item>
                                                        ))}
                                                    </Pagination>
                                                )}
                                            </>
                                        ) : (<p className="text-center text-muted py-5">لا توجد مقالات</p>)}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {/* SETTINGS SECTION */}
                    {activeSection === 'settings' && (
                        <>
                            <Row className="mb-4">
                                <Col md={6}>
                                    <Card>
                                        <Card.Header><h5 className="mb-0">تغيير كلمة المرور</h5></Card.Header>
                                        <Card.Body>
                                            <Form onSubmit={handlePasswordChange}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>كلمة المرور الحالية</Form.Label>
                                                    <Form.Control type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>كلمة المرور الجديدة</Form.Label>
                                                    <Form.Control type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>تأكيد كلمة المرور الجديدة</Form.Label>
                                                    <Form.Control type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
                                                </Form.Group>
                                                <Button type="submit" variant="primary" disabled={loading}>
                                                    {loading ? <Spinner animation="border" size="sm" /> : <><FontAwesomeIcon icon={faKey} className="me-2" />تغيير كلمة المرور</>}
                                                </Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card>
                                        <Card.Header className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">الفئات</h5>
                                            <Button size="sm" variant="primary" onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', description: '' }); setShowCategoryModal(true); }}>
                                                <FontAwesomeIcon icon={faPlus} />
                                            </Button>
                                        </Card.Header>
                                        <Card.Body>
                                            {loading ? (
                                                <div className="text-center py-3"><Spinner animation="border" size="sm" /></div>
                                            ) : categories.length > 0 ? (
                                                <div className="list-group">
                                                    {categories.map((cat) => (
                                                        <div key={cat.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <strong>{cat.name}</strong>
                                                                <br />
                                                                <small className="text-muted">{cat.description}</small>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Badge bg="primary" className="me-2">{cat.company_count || 0} شركة</Badge>
                                                                <Button size="sm" variant="outline-primary" onClick={() => { setEditingCategory(cat); setCategoryForm({ name: cat.name || '', description: cat.description || '' }); setShowCategoryModal(true); }}>تعديل</Button>
                                                                <Button size="sm" variant="outline-danger" onClick={async () => {
                                                                    if (!window.confirm('حذف هذه الفئة؟')) return;
                                                                    setLoading(true);
                                                                    try {
                                                                        await adminService.deleteCategory(cat.id);
                                                                        showAlert('success', 'تم حذف الفئة');
                                                                        fetchCategories();
                                                                    } catch (e) {
                                                                        showAlert('danger', e.response?.data?.message || 'فشل في حذف الفئة');
                                                                    } finally {
                                                                        setLoading(false);
                                                                    }
                                                                }}>حذف</Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (<p className="text-muted text-center">لا توجد فئات</p>)}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    )}
                </Container>
            </div>

            {/* MODALS */}

            {/* Company Modal */}
            <Modal show={showCompanyModal} onHide={() => setShowCompanyModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingCompany ? 'تعديل شركة' : 'إضافة شركة جديدة'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleCompanySubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>اسم المستخدم</Form.Label>
                                    <Form.Control type="text" value={companyForm.username} onChange={(e) => setCompanyForm({ ...companyForm, username: e.target.value })} required disabled={editingCompany} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>كلمة المرور {editingCompany && '(اتركها فارغة إذا لم تريد تغييرها)'}</Form.Label>
                                    <Form.Control type="password" value={companyForm.password} onChange={(e) => setCompanyForm({ ...companyForm, password: e.target.value })} required={!editingCompany} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>البريد الإلكتروني</Form.Label>
                                    <Form.Control type="email" value={companyForm.email} onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })} required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>اسم الشركة</Form.Label>
                                    <Form.Control type="text" value={companyForm.company_name} onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })} required />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>الوصف</Form.Label>
                            <Form.Control as="textarea" rows={3} value={companyForm.description} onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })} />
                        </Form.Group>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>المدينة</Form.Label>
                                    <Form.Control type="text" value={companyForm.city} onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>المنطقة</Form.Label>
                                    <Form.Control type="text" value={companyForm.region} onChange={(e) => setCompanyForm({ ...companyForm, region: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>بريد التواصل</Form.Label>
                                    <Form.Control type="email" value={companyForm.contact_email} onChange={(e) => setCompanyForm({ ...companyForm, contact_email: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>العنوان</Form.Label>
                            <Form.Control type="text" value={companyForm.address} onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCompanyModal(false)}>إلغاء</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : (editingCompany ? 'تحديث' : 'إضافة')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Message Modal */}
            <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>تفاصيل الرسالة</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMessage && (
                        <>
                            <p><strong>الاسم:</strong> {selectedMessage.name}</p>
                            <p><strong>البريد الإلكتروني:</strong> {selectedMessage.email}</p>
                            <p><strong>الموضوع:</strong> {selectedMessage.subject || 'بدون موضوع'}</p>
                            <p><strong>التاريخ:</strong> {new Date(selectedMessage.created_at).toLocaleString('ar-EG')}</p>
                            <hr />
                            <p><strong>الرسالة:</strong></p>
                            <p>{selectedMessage.message}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMessageModal(false)}>إغلاق</Button>
                </Modal.Footer>
            </Modal>

            {/* Blog Modal */}
            <Modal show={showBlogModal} onHide={() => setShowBlogModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editingBlog ? 'تعديل مقال' : 'إضافة مقال جديد'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleBlogSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>العنوان</Form.Label>
                            <Form.Control type="text" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} required />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>الكاتب</Form.Label>
                                    <Form.Control type="text" value={blogForm.author} onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>المعرف (Slug)</Form.Label>
                                    <Form.Control type="text" value={blogForm.slug} onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })} placeholder="مثال: modern-kitchen-ideas" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>المحتوى</Form.Label>
                            <Form.Control as="textarea" rows={8} value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>المقتطف</Form.Label>
                            <Form.Control as="textarea" rows={3} value={blogForm.excerpt} onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>الفئة</Form.Label>
                                    <Form.Control type="text" value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>الوسوم (افصلها بفواصل)</Form.Label>
                                    <Form.Control type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="تشطيبات, ديكور, تصميم" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>الحالة</Form.Label>
                                    <Form.Select value={blogForm.status} onChange={(e) => setBlogForm({ ...blogForm, status: e.target.value })}>
                                        <option value="draft">مسودة</option>
                                        <option value="published">منشور</option>
                                        <option value="archived">مؤرشف</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>تاريخ النشر</Form.Label>
                                    <Form.Control type="datetime-local" value={blogForm.published_at} onChange={(e) => setBlogForm({ ...blogForm, published_at: e.target.value })} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>الصورة</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={(e) => setBlogImage(e.target.files[0])} />
                            <Form.Text className="text-muted">{editingBlog && 'اترك الحقل فارغاً إذا لم تريد تغيير الصورة'}</Form.Text>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowBlogModal(false)}>إلغاء</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : (editingBlog ? 'تحديث' : 'نشر')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Comments Moderation Modal */}
            <Modal show={showCommentsModal} onHide={() => setShowCommentsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>تعليقات المقال: {commentsPost?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex align-items-center mb-3">
                        <Form.Select value={commentsStatus} onChange={async (e) => { setCommentsStatus(e.target.value); await fetchCommentsForPost(commentsPost, e.target.value); }} style={{ maxWidth: 200 }}>
                            <option value="pending">قيد المراجعة</option>
                            <option value="approved">معتمدة</option>
                            <option value="spam">سبام</option>
                        </Form.Select>
                    </div>
                    {commentsLoading ? (
                        <div className="text-center py-4"><Spinner animation="border" /></div>
                    ) : commentsList.length === 0 ? (
                        <p className="text-muted mb-0">لا توجد تعليقات</p>
                    ) : (
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>الاسم</th>
                                    <th>البريد</th>
                                    <th>التعليق</th>
                                    <th>الحالة</th>
                                    <th>التاريخ</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commentsList.map((c) => (
                                    <tr key={c.id}>
                                        <td>{c.user_name || 'زائر'}</td>
                                        <td>{c.user_email || '-'}</td>
                                        <td style={{ maxWidth: 400, whiteSpace: 'pre-wrap' }}>{c.content}</td>
                                        <td>
                                            <Badge bg={c.status === 'approved' ? 'success' : c.status === 'pending' ? 'warning' : 'secondary'}>
                                                {c.status === 'approved' ? 'معتمدة' : c.status === 'pending' ? 'قيد المراجعة' : 'سبام'}
                                            </Badge>
                                        </td>
                                        <td>{new Date(c.created_at).toLocaleString('ar-EG')}</td>
                                        <td>
                                            {c.status !== 'approved' && (
                                                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleApproveComment(c.id)}>اعتماد</Button>
                                            )}
                                            <Button size="sm" variant="outline-danger" onClick={() => handleDeleteComment(c.id)}>حذف</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCommentsModal(false)}>إغلاق</Button>
                </Modal.Footer>
            </Modal>

            {/* Category Modal */}
            <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingCategory ? 'تعديل فئة' : 'إضافة فئة جديدة'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    try {
                        if (editingCategory) {
                            await adminService.updateCategory(editingCategory.id, categoryForm);
                            showAlert('success', 'تم تعديل الفئة بنجاح');
                        } else {
                            await adminService.createCategory(categoryForm);
                            showAlert('success', 'تم إضافة الفئة بنجاح');
                        }
                        setShowCategoryModal(false);
                        setEditingCategory(null);
                        setCategoryForm({ name: '', description: '' });
                        fetchCategories();
                    } catch (error) {
                        showAlert('danger', error.response?.data?.message || 'فشل في حفظ الفئة');
                    } finally {
                        setLoading(false);
                    }
                }}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>اسم الفئة</Form.Label>
                            <Form.Control type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>الوصف</Form.Label>
                            <Form.Control as="textarea" rows={3} value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>إلغاء</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : (editingCategory ? 'تحديث' : 'إضافة')}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
