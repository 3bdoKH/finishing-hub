import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Form, Modal, Alert, Spinner, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faImages, faVideo, faDollarSign, faSignOutAlt, faCog, faKey, faHome,
  faEdit, faTrash, faPlus, faSave, faPhone, faTimes, faCheck
} from '@fortawesome/free-solid-svg-icons';
import { companyService, authService, publicService } from '../../services/api';
import { getMediaUrl } from '../../utils/config';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
  const locations = [
    { id: 'cairo', name: 'القاهرة' },
    { id: 'giza', name: 'الجيزة' },
    { id: 'alexandria', name: 'الإسكندرية' },
    { id: 'dakahlia', name: 'الدقهلية' },
    { id: 'beheira', name: 'البحيرة' },
    { id: 'kafr_el_sheikh', name: 'كفر الشيخ' },
    { id: 'gharbia', name: 'الغربية' },
    { id: 'menoufia', name: 'المنوفية' },
    { id: 'sharqia', name: 'الشرقية' },
    { id: 'damietta', name: 'دمياط' },
    { id: 'port_said', name: 'بورسعيد' },
    { id: 'ismailia', name: 'الإسماعيلية' },
    { id: 'suez', name: 'السويس' },
    { id: 'matrouh', name: 'مطروح' },
    { id: 'north_sinai', name: 'شمال سيناء' },
    { id: 'south_sinai', name: 'جنوب سيناء' },
    { id: 'beni_suef', name: 'بني سويف' },
    { id: 'fayoum', name: 'الفيوم' },
    { id: 'minya', name: 'المنيا' },
    { id: 'assiut', name: 'أسيوط' },
    { id: 'sohag', name: 'سوهاج' },
    { id: 'qena', name: 'قنا' },
    { id: 'luxor', name: 'الأقصر' },
    { id: 'aswan', name: 'أسوان' },
    { id: 'red_sea', name: 'البحر الأحمر' },
    { id: 'new_valley', name: 'الوادي الجديد' }
  ]
  const navigate = useNavigate();
  const { logout } = useAuth();

  // State Management
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [companyData, setCompanyData] = useState(null);

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    company_name: '', description: '', address: '', city: '', region: '',
    contact_email: '', social_links: { facebook: '', instagram: '', website: '' }
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Logo Upload
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Images Management
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Videos Management
  const [videoFiles, setVideoFiles] = useState([]);

  // Services Management
  const [services, setServices] = useState([]);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({ service_name: '' });

  // Phone Numbers
  const [phones, setPhones] = useState([]);
  const [whatsappNumbers, setWhatsappNumbers] = useState([]);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneType, setPhoneType] = useState('phone'); // 'phone' or 'whatsapp'
  const [phoneForm, setPhoneForm] = useState({ number: '' });

  // Pricing Plans
  const [pricingPlans, setPricingPlans] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [pricingForm, setPricingForm] = useState({ title: '', description: '', price_per_meter: '', pros: [] });
  const [newPro, setNewPro] = useState('');

  // Helper to check if pest control category is selected
  const isPestControlSelected = () => {
    const pestControlCategory = allCategories.find(cat => cat.name === 'مكافحة حشرات');
    return pestControlCategory && selectedCategoryIds.includes(pestControlCategory.id);
  };

  // Handle category checkbox change
  const handleCategoryChange = (categoryId, isChecked) => {
    const pestControlCategory = allCategories.find(cat => cat.name === 'مكافحة حشرات');

    if (isChecked) {
      // If checking pest control category, clear all other selections
      if (pestControlCategory && categoryId === pestControlCategory.id) {
        setSelectedCategoryIds([categoryId]);
      }
      // If checking another category while pest control is selected, replace pest control
      else if (isPestControlSelected()) {
        setSelectedCategoryIds([categoryId]);
      }
      // Otherwise, add to selection
      else {
        setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
      }
    } else {
      // If unchecking, remove from selection
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    }
  };

  // Password Change
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Load company data
  useEffect(() => {
    fetchCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCompanyData = async () => {
    setLoading(true);
    try {
      const response = await companyService.getProfile();
      if (response.success) {
        const data = response.data;
        setCompanyData(data);
        setProfileForm({
          company_name: data.company_name || '',
          description: data.description || '',
          address: data.address || '',
          city: data.city || '',
          region: data.region || '',
          contact_email: data.contact_email || '',
          social_links: data.social_links || { facebook: '', instagram: '', website: '' }
        });
        setServices(data.services || []);
        setPhones(data.phones || []);
        setWhatsappNumbers(data.whatsapp || []);
        setPricingPlans(data.pricing_plans || []);
        setSelectedCategoryIds((data.categories || []).map(c => c.id));
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      showAlert('danger', 'فشل في تحميل بيانات الشركة');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await publicService.getCategories();
        if (res.success) setAllCategories(res.data || []);
      } catch (e) { /* ignore */ }
    };
    loadCategories();
  }, []);

  // Alert helper
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
  };

  // ==================== PROFILE SECTION ====================
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await companyService.updateProfile(profileForm);
      showAlert('success', 'تم تحديث الملف الشخصي بنجاح');
      setIsEditingProfile(false);
      fetchCompanyData();
    } catch (error) {
      showAlert('danger', error.response?.data?.message || 'فشل في تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setLoading(true);
    try {
      await companyService.uploadLogo(logoFile);
      showAlert('success', 'تم تحديث الشعار بنجاح');
      setLogoFile(null);
      setLogoPreview(null);
      fetchCompanyData();
    } catch (error) {
      showAlert('danger', 'فشل في تحميل الشعار');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // ==================== IMAGES SECTION ====================
  const handleImagesUpload = async () => {
    if (imageFiles.length === 0) return;
    setLoading(true);
    try {
      await companyService.uploadImages(imageFiles);
      showAlert('success', `تم تحميل ${imageFiles.length} صورة بنجاح`);
      setImageFiles([]);
      setImagePreviews([]);
      fetchCompanyData();
    } catch (error) {
      showAlert('danger', error.response?.data?.message || 'فشل في تحميل الصور');
    } finally {
      setLoading(false);
    }
  };

  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;
    setLoading(true);
    try {
      await companyService.deleteImage(id);
      showAlert('success', 'تم حذف الصورة بنجاح');
      fetchCompanyData();
    } catch (error) {
      showAlert('danger', 'فشل في حذف الصورة');
    } finally {
      setLoading(false);
    }
  };

  // ==================== VIDEOS SECTION ====================
  const handleVideosUpload = async () => {
    if (videoFiles.length === 0) return;
    setLoading(true);
    try {
      await companyService.uploadVideos(videoFiles);
      showAlert('success', `تم تحميل ${videoFiles.length} فيديو بنجاح`);
      setVideoFiles([]);
      fetchCompanyData();
    } catch (error) {
      showAlert('danger', error.response?.data?.message || 'فشل في تحميل الفيديوهات');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الفيديو؟')) return;
    setLoading(true);
    try {
      await companyService.deleteVideo(id);
      showAlert('success', 'تم حذف الفيديو بنجاح');
      fetchCompanyData();
    } catch (error) {
      showAlert('danger', 'فشل في حذف الفيديو');
    } finally {
      setLoading(false);
    }
  };

  // ==================== SERVICES SECTION ====================
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingService) {
        await companyService.updateService(editingService.id, serviceForm.service_name);
        showAlert('success', 'تم تحديث الخدمة بنجاح');
      } else {
        await companyService.addService(serviceForm.service_name);
        showAlert('success', 'تم إضافة الخدمة بنجاح');
      }
      setShowServiceModal(false);
      setEditingService(null);
      setServiceForm({ service_name: '' });
      fetchCompanyData();
    } catch (error) {
      showAlert('danger', error.response?.data?.message || 'فشل في حفظ الخدمة');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    setLoading(true);
    try {
      await companyService.deleteService(id);
      showAlert('success', 'تم حذف الخدمة بنجاح');
      fetchCompanyData();
    } catch (error) {
      showAlert('danger', 'فشل في حذف الخدمة');
    } finally {
      setLoading(false);
    }
  };

  const openServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({ service_name: service.service_name });
    } else {
      setEditingService(null);
      setServiceForm({ service_name: '' });
    }
    setShowServiceModal(true);
  };

  // ==================== PHONE NUMBERS SECTION ====================
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (phoneType === 'phone') {
        await companyService.addPhoneNumber(phoneForm.number);
        showAlert('success', 'تم إضافة رقم الهاتف بنجاح');
      } else {
        await companyService.addWhatsAppNumber(phoneForm.number);
        showAlert('success', 'تم إضافة رقم الواتساب بنجاح');
      }
      setShowPhoneModal(false);
      setPhoneForm({ number: '' });
      fetchCompanyData();
    } catch (error) {
      showAlert('danger', error.response?.data?.message || 'فشل في إضافة الرقم');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhone = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الرقم؟')) return;
    setLoading(true);
    try {
      await companyService.deletePhoneNumber(id);
      showAlert('success', 'تم حذف رقم الهاتف بنجاح');
      fetchCompanyData();
    } catch (error) {
      showAlert('danger', 'فشل في حذف رقم الهاتف');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWhatsApp = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الرقم؟')) return;
    setLoading(true);
    try {
      await companyService.deleteWhatsAppNumber(id);
      showAlert('success', 'تم حذف رقم الواتساب بنجاح');
      fetchCompanyData();
    } catch (error) {
      showAlert('danger', 'فشل في حذف رقم الواتساب');
    } finally {
      setLoading(false);
    }
  };

  // ==================== PRICING PLANS SECTION ====================
  const handlePricingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingPlan) {
        await companyService.updatePricingPlan(editingPlan.id, pricingForm);
        showAlert('success', 'تم تحديث الباقة بنجاح');
      } else {
        await companyService.addPricingPlan(pricingForm);
        showAlert('success', 'تم إضافة الباقة بنجاح');
      }
      setShowPricingModal(false);
      setEditingPlan(null);
      setPricingForm({ title: '', description: '', price_per_meter: '', pros: [] });
      fetchCompanyData();
    } catch (error) {
      showAlert('danger', error.response?.data?.message || 'فشل في حفظ الباقة');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;
    setLoading(true);
    try {
      await companyService.deletePricingPlan(id);
      showAlert('success', 'تم حذف الباقة بنجاح');
      fetchCompanyData();
    } catch (error) {
      showAlert('danger', 'فشل في حذف الباقة');
    } finally {
      setLoading(false);
    }
  };

  const openPricingModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setPricingForm({
        title: plan.title || '',
        description: plan.description || '',
        price_per_meter: plan.price_per_meter || '',
        pros: plan.pros || []
      });
    } else {
      setEditingPlan(null);
      setPricingForm({ title: '', description: '', price_per_meter: '', pros: [] });
    }
    setShowPricingModal(true);
  };

  const addPro = () => {
    if (newPro.trim()) {
      setPricingForm({ ...pricingForm, pros: [...pricingForm.pros, { pro_text: newPro }] });
      setNewPro('');
    }
  };

  const removePro = (index) => {
    const newPros = pricingForm.pros.filter((_, i) => i !== index);
    setPricingForm({ ...pricingForm, pros: newPros });
  };

  // ==================== SETTINGS SECTION ====================
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

  if (loading && !companyData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="company-dashboard">
      {/* Sidebar */}
      <div className="company-sidebar">
        <div className="sidebar-header">
          <h4>لوحة تحكم الشركة</h4>
          <p className="text-muted mb-0">مرحباً، {companyData?.company_name}</p>
        </div>

        <Nav className="flex-column sidebar-nav">
          <Nav.Link className={activeSection === 'overview' ? 'active' : ''} onClick={() => setActiveSection('overview')}>
            <FontAwesomeIcon icon={faHome} className="me-2" />نظرة عامة
          </Nav.Link>
          <Nav.Link className={activeSection === 'profile' ? 'active' : ''} onClick={() => setActiveSection('profile')}>
            <FontAwesomeIcon icon={faUser} className="me-2" />الملف الشخصي
          </Nav.Link>
          <Nav.Link className={activeSection === 'gallery' ? 'active' : ''} onClick={() => setActiveSection('gallery')}>
            <FontAwesomeIcon icon={faImages} className="me-2" />معرض الصور
          </Nav.Link>
          <Nav.Link className={activeSection === 'videos' ? 'active' : ''} onClick={() => setActiveSection('videos')}>
            <FontAwesomeIcon icon={faVideo} className="me-2" />الفيديوهات
          </Nav.Link>
          <Nav.Link className={activeSection === 'pricing' ? 'active' : ''} onClick={() => setActiveSection('pricing')}>
            <FontAwesomeIcon icon={faDollarSign} className="me-2" />باقات الأسعار
          </Nav.Link>
          <Nav.Link className={activeSection === 'settings' ? 'active' : ''} onClick={() => setActiveSection('settings')}>
            <FontAwesomeIcon icon={faCog} className="me-2" />الإعدادات
          </Nav.Link>
        </Nav>

        <div className="sidebar-footer">
          <Button variant="outline-light" onClick={() => navigate(`/companies/${companyData?.id}`)} className="w-100 mb-2">
            <FontAwesomeIcon icon={faUser} className="me-2" />عرض صفحتي
          </Button>
          <Button variant="outline-danger" onClick={handleLogout} className="w-100">
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />تسجيل الخروج
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="company-content">
        <Container fluid>
          {alert.show && <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, type: '', message: '' })}>{alert.message}</Alert>}

          {/* OVERVIEW SECTION */}
          {activeSection === 'overview' && (
            <>
              <Row className="mb-4">
                <Col><h2>نظرة عامة</h2><p className="text-muted">معلومات سريعة عن شركتك</p></Col>
              </Row>
              <Row className="mb-4">
                <Col md={4} className="mb-3">
                  <Card className="stat-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div><p className="stat-label">الصور</p><h3 className="stat-value">{companyData?.images?.length || 0}</h3></div>
                        <div className="stat-icon"><FontAwesomeIcon icon={faImages} size="2x" /></div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="mb-3">
                  <Card className="stat-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div><p className="stat-label">الفيديوهات</p><h3 className="stat-value">{companyData?.videos?.length || 0}</h3></div>
                        <div className="stat-icon"><FontAwesomeIcon icon={faVideo} size="2x" /></div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="mb-3">
                  <Card className="stat-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div><p className="stat-label">الخدمات</p><h3 className="stat-value">{companyData?.services?.length || 0}</h3></div>
                        <div className="stat-icon"><FontAwesomeIcon icon={faCog} size="2x" /></div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card>
                    <Card.Header><h5 className="mb-0">معلومات الشركة</h5></Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <p><strong>اسم الشركة:</strong> {companyData?.company_name}</p>
                          <p><strong>البريد الإلكتروني:</strong> {companyData?.email}</p>
                          <p><strong>المدينة:</strong> {companyData?.city || 'غير محدد'}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>المنطقة:</strong> {companyData?.region || 'غير محدد'}</p>
                          <p><strong>العنوان:</strong> {companyData?.address || 'غير محدد'}</p>
                          <p><strong>عدد الباقات:</strong> {companyData?.pricing_plans?.length || 0}</p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {/* PROFILE SECTION */}
          {activeSection === 'profile' && (
            <Row>
              <Col>
                <Card className="mb-4">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">الشعار</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        {(logoPreview || companyData?.logo_path) && (
                          <Image
                            src={logoPreview || getMediaUrl(companyData?.logo_path)}
                            alt="Logo"
                            fluid
                            rounded
                            className="mb-3"
                            style={{ maxHeight: '200px', objectFit: 'contain' }}
                          />
                        )}
                      </Col>
                      <Col md={8}>
                        <Form.Group className="mb-3">
                          <Form.Label>اختر شعار جديد</Form.Label>
                          <Form.Control type="file" accept="image/*" onChange={handleLogoChange} />
                        </Form.Group>
                        {logoFile && (
                          <Button variant="primary" onClick={handleLogoUpload} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'تحميل الشعار'}
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">المعلومات الأساسية</h5>
                    {!isEditingProfile && (
                      <Button size="sm" variant="primary" onClick={() => setIsEditingProfile(true)}>
                        <FontAwesomeIcon icon={faEdit} className="me-2" />تعديل
                      </Button>
                    )}
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleProfileSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>اسم الشركة</Form.Label>
                            <Form.Control
                              type="text"
                              value={profileForm.company_name}
                              onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                              disabled={!isEditingProfile}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>بريد التواصل</Form.Label>
                            <Form.Control
                              type="email"
                              value={profileForm.contact_email}
                              onChange={(e) => setProfileForm({ ...profileForm, contact_email: e.target.value })}
                              disabled={!isEditingProfile}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>الوصف</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          value={profileForm.description}
                          onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                          disabled={!isEditingProfile}
                        />
                      </Form.Group>
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>المدينة</Form.Label>
                            <Form.Select
                              value={profileForm.city}
                              onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                              disabled={!isEditingProfile}
                            >
                              {locations.map((location) => (
                                <option key={location.id} value={location.name}>{location.name}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>المنطقة</Form.Label>
                            <Form.Control
                              type="text"
                              value={profileForm.region}
                              onChange={(e) => setProfileForm({ ...profileForm, region: e.target.value })}
                              disabled={!isEditingProfile}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>العنوان</Form.Label>
                            <Form.Control
                              type="text"
                              value={profileForm.address}
                              onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                              disabled={!isEditingProfile}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <h6>روابط التواصل الاجتماعي</h6>
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Facebook</Form.Label>
                            <Form.Control
                              type="url"
                              value={profileForm.social_links?.facebook || ''}
                              onChange={(e) => setProfileForm({ ...profileForm, social_links: { ...profileForm.social_links, facebook: e.target.value } })}
                              disabled={!isEditingProfile}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Instagram</Form.Label>
                            <Form.Control
                              type="url"
                              value={profileForm.social_links?.instagram || ''}
                              onChange={(e) => setProfileForm({ ...profileForm, social_links: { ...profileForm.social_links, instagram: e.target.value } })}
                              disabled={!isEditingProfile}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Website</Form.Label>
                            <Form.Control
                              type="url"
                              value={profileForm.social_links?.website || ''}
                              onChange={(e) => setProfileForm({ ...profileForm, social_links: { ...profileForm.social_links, website: e.target.value } })}
                              disabled={!isEditingProfile}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      {isEditingProfile && (
                        <div className="d-flex gap-2">
                          <Button variant="success" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : <><FontAwesomeIcon icon={faSave} className="me-2" />حفظ</>}
                          </Button>
                          <Button variant="secondary" onClick={() => setIsEditingProfile(false)}>إلغاء</Button>
                        </div>
                      )}
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* GALLERY SECTION */}
          {activeSection === 'gallery' && (
            <Row>
              <Col>
                <Card className="mb-4">
                  <Card.Header><h5 className="mb-0">إضافة صور جديدة (الحد الأقصى 30 صورة)</h5></Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Control type="file" multiple accept="image/*" onChange={handleImageFilesChange} />
                      <Form.Text>يمكنك اختيار عدة صور في نفس الوقت</Form.Text>
                    </Form.Group>
                    {imagePreviews.length > 0 && (
                      <div className="mb-3">
                        <p>معاينة ({imagePreviews.length} صورة):</p>
                        <Row>
                          {imagePreviews.map((preview, idx) => (
                            <Col key={idx} xs={6} md={3} className="mb-2">
                              <Image src={preview} thumbnail />
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                    {imageFiles.length > 0 && (
                      <Button variant="primary" onClick={handleImagesUpload} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : `تحميل ${imageFiles.length} صورة`}
                      </Button>
                    )}
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header><h5 className="mb-0">صور المعرض ({companyData?.images?.length || 0}/30)</h5></Card.Header>
                  <Card.Body>
                    {companyData?.images && companyData.images.length > 0 ? (
                      <Row>
                        {companyData.images.map((img) => (
                          <Col key={img.id} xs={6} md={3} className="mb-3">
                            <div className="position-relative">
                              <Image src={getMediaUrl(img.image_path)} thumbnail className="w-100" />
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0 m-1"
                                onClick={() => handleDeleteImage(img.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    ) : (<p className="text-center text-muted py-5">لا توجد صور في المعرض</p>)}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* VIDEOS SECTION */}
          {activeSection === 'videos' && (
            <Row>
              <Col>
                <Card className="mb-4">
                  <Card.Header><h5 className="mb-0">إضافة فيديوهات جديدة (الحد الأقصى 2 فيديو)</h5></Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="file"
                        multiple
                        accept="video/*"
                        onChange={(e) => setVideoFiles(Array.from(e.target.files))}
                      />
                    </Form.Group>
                    {videoFiles.length > 0 && (
                      <Button variant="primary" onClick={handleVideosUpload} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : `تحميل ${videoFiles.length} فيديو`}
                      </Button>
                    )}
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Header><h5 className="mb-0">الفيديوهات ({companyData?.videos?.length || 0}/2)</h5></Card.Header>
                  <Card.Body>
                    {companyData?.videos && companyData.videos.length > 0 ? (
                      <Row>
                        {companyData.videos.map((vid) => (
                          <Col key={vid.id} md={6} className="mb-3">
                            <div className="position-relative">
                              <video src={getMediaUrl(vid.video_path)} controls className="w-100" />
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0 m-2"
                                onClick={() => handleDeleteVideo(vid.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    ) : (<p className="text-center text-muted py-5">لا توجد فيديوهات</p>)}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* PRICING SECTION */}
          {activeSection === 'pricing' && (
            <Row>
              <Col>
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">باقات الأسعار ({pricingPlans.length}/3)</h5>
                    {pricingPlans.length < 3 && (
                      <Button variant="primary" onClick={() => openPricingModal()}>
                        <FontAwesomeIcon icon={faPlus} className="me-2" />إضافة باقة
                      </Button>
                    )}
                  </Card.Header>
                  <Card.Body>
                    {pricingPlans.length > 0 ? (
                      <Row>
                        {pricingPlans.map((plan) => (
                          <Col key={plan.id} md={4} className="mb-3">
                            <Card className="h-100">
                              <Card.Header className="text-center">
                                <h5>{plan.title}</h5>
                                <h3 className="text-primary">{plan.price_per_meter} جنيه/م²</h3>
                              </Card.Header>
                              <Card.Body>
                                <p>{plan.description}</p>
                                {plan.pros && plan.pros.length > 0 && (
                                  <ul>
                                    {plan.pros.map((pro, idx) => (
                                      <li key={idx}>{pro.pro_text}</li>
                                    ))}
                                  </ul>
                                )}
                              </Card.Body>
                              <Card.Footer>
                                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openPricingModal(plan)}>
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button size="sm" variant="outline-danger" onClick={() => handleDeletePlan(plan.id)}>
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </Card.Footer>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    ) : (<p className="text-center text-muted py-5">لا توجد باقات أسعار</p>)}
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
                    <Card.Header><h5 className="mb-0">الخدمات ({services.length}/10)</h5></Card.Header>
                    <Card.Body>
                      {services.length < 10 && (
                        <Button size="sm" variant="primary" className="mb-3" onClick={() => openServiceModal()}>
                          <FontAwesomeIcon icon={faPlus} className="me-2" />إضافة خدمة
                        </Button>
                      )}
                      {services.length > 0 ? (
                        <div className="list-group">
                          {services.map((service) => (
                            <div key={service.id} className="list-group-item d-flex justify-content-between align-items-center">
                              <span>{service.service_name}</span>
                              <div>
                                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openServiceModal(service)}>
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button size="sm" variant="outline-danger" onClick={() => handleDeleteService(service.id)}>
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (<p className="text-muted">لا توجد خدمات</p>)}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Card>
                    <Card.Header><h5 className="mb-0">أرقام الهاتف</h5></Card.Header>
                    <Card.Body>
                      <Button size="sm" variant="primary" className="mb-3" onClick={() => { setPhoneType('phone'); setShowPhoneModal(true); }}>
                        <FontAwesomeIcon icon={faPlus} className="me-2" />إضافة رقم هاتف
                      </Button>
                      {phones.length > 0 ? (
                        <div className="list-group">
                          {phones.map((phone) => (
                            <div key={phone.id} className="list-group-item d-flex justify-content-between align-items-center">
                              <span><FontAwesomeIcon icon={faPhone} className="me-2" />{phone.number}</span>
                              <Button size="sm" variant="outline-danger" onClick={() => handleDeletePhone(phone.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (<p className="text-muted">لا توجد أرقام هاتف</p>)}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header><h5 className="mb-0">أرقام واتساب</h5></Card.Header>
                    <Card.Body>
                      <Button size="sm" variant="success" className="mb-3" onClick={() => { setPhoneType('whatsapp'); setShowPhoneModal(true); }}>
                        <FontAwesomeIcon icon={faPlus} className="me-2" />إضافة رقم واتساب
                      </Button>
                      {whatsappNumbers.length > 0 ? (
                        <div className="list-group">
                          {whatsappNumbers.map((whatsapp) => (
                            <div key={whatsapp.id} className="list-group-item d-flex justify-content-between align-items-center">
                              <span><FontAwesomeIcon icon={faPhone} className="me-2" />{whatsapp.number}</span>
                              <Button size="sm" variant="outline-danger" onClick={() => handleDeleteWhatsApp(whatsapp.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (<p className="text-muted">لا توجد أرقام واتساب</p>)}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card>
                    <Card.Header><h5 className="mb-0">الفئات المرتبطة بالشركة</h5></Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>اختر الفئات</Form.Label>
                        <div className="categories-checkbox-list" style={{
                          maxHeight: '300px',
                          overflowY: 'auto',
                          border: '1px solid #dee2e6',
                          borderRadius: '0.25rem',
                          padding: '0.75rem'
                        }}>
                          {allCategories.map(cat => {
                            const pestControlCategory = allCategories.find(c => c.name === 'مكافحة حشرات');
                            const isPestControl = cat.name === 'مكافحة حشرات';
                            const isPestControlChecked = pestControlCategory && selectedCategoryIds.includes(pestControlCategory.id);
                            const isDisabled = !isPestControl && isPestControlChecked;

                            return (
                              <Form.Check
                                key={cat.id}
                                type="checkbox"
                                id={`category-${cat.id}`}
                                label={cat.name}
                                checked={selectedCategoryIds.includes(cat.id)}
                                disabled={isDisabled}
                                onChange={(e) => handleCategoryChange(cat.id, e.target.checked)}
                                className="mb-2"
                                style={{
                                  opacity: isDisabled ? 0.5 : 1,
                                  cursor: isDisabled ? 'not-allowed' : 'pointer'
                                }}
                              />
                            );
                          })}
                        </div>
                        <Form.Text className="text-muted">
                          <strong>ملاحظة:</strong> فئة "مكافحة حشرات" لا يمكن اختيارها مع فئات أخرى
                        </Form.Text>
                      </Form.Group>
                      <Button variant="primary" onClick={async () => {
                        setLoading(true);
                        try {
                          await companyService.updateCategories(selectedCategoryIds);
                          showAlert('success', 'تم تحديث الفئات بنجاح');
                          fetchCompanyData();
                        } catch (error) {
                          showAlert('danger', error.response?.data?.message || 'فشل في تحديث الفئات');
                        } finally {
                          setLoading(false);
                        }
                      }} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'حفظ الفئات'}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>

      {/* MODALS */}

      {/* Service Modal */}
      <Modal show={showServiceModal} onHide={() => setShowServiceModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingService ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleServiceSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>اسم الخدمة</Form.Label>
              <Form.Control type="text" value={serviceForm.service_name} onChange={(e) => setServiceForm({ service_name: e.target.value })} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowServiceModal(false)}>إلغاء</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : (editingService ? 'تحديث' : 'إضافة')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Phone Modal */}
      <Modal show={showPhoneModal} onHide={() => setShowPhoneModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>إضافة {phoneType === 'phone' ? 'رقم هاتف' : 'رقم واتساب'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePhoneSubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>الرقم</Form.Label>
              <Form.Control type="tel" value={phoneForm.number} onChange={(e) => setPhoneForm({ number: e.target.value })} placeholder="+20123456789" required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPhoneModal(false)}>إلغاء</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'إضافة'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Pricing Plan Modal */}
      <Modal show={showPricingModal} onHide={() => setShowPricingModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingPlan ? 'تعديل باقة' : 'إضافة باقة جديدة'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePricingSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>عنوان الباقة</Form.Label>
              <Form.Control type="text" value={pricingForm.title} onChange={(e) => setPricingForm({ ...pricingForm, title: e.target.value })} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>الوصف</Form.Label>
              <Form.Control as="textarea" rows={3} value={pricingForm.description} onChange={(e) => setPricingForm({ ...pricingForm, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>السعر لكل متر مربع (جنيه)</Form.Label>
              <Form.Control type="number" value={pricingForm.price_per_meter} onChange={(e) => setPricingForm({ ...pricingForm, price_per_meter: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>المزايا</Form.Label>
              <div className="d-flex gap-2 mb-2">
                <Form.Control type="text" value={newPro} onChange={(e) => setNewPro(e.target.value)} placeholder="أدخل ميزة" />
                <Button variant="success" onClick={addPro}>
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
              {pricingForm.pros.length > 0 && (
                <div className="list-group">
                  {pricingForm.pros.map((pro, idx) => (
                    <div key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                      <span><FontAwesomeIcon icon={faCheck} className="me-2 text-success" />{pro.pro_text}</span>
                      <Button size="sm" variant="outline-danger" onClick={() => removePro(idx)}>
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPricingModal(false)}>إلغاء</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : (editingPlan ? 'تحديث' : 'إضافة')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CompanyDashboard;
