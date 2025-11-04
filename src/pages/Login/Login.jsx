import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { authService } from '../../services/api';
import './Login.css';

const Login = () => {
  const { type } = useParams(); // admin or company
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(type || 'company');
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  });
  const [showLoginError, setShowLoginError] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotPasswordSuccess, setShowForgotPasswordSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update tab when URL param changes
  useEffect(() => {
    if (type && (type === 'admin' || type === 'company')) {
      setActiveTab(type);
    }
  }, [type]);

  const handleLoginChange = (e) => {
    const { name, value, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowLoginError(false);

    try {
      // Use the API service which handles environment-based URLs
      let data;
      if (activeTab === 'admin') {
        data = await authService.loginAdmin({
          username: loginData.username,
          password: loginData.password
        });
      } else {
        data = await authService.loginCompany({
          username: loginData.username,
          password: loginData.password
        });
      }

      console.log('Login response:', data); // Debug log

      if (data.success && data.token) {
        // Login successful - store in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', data.user.role);
        localStorage.setItem('userId', data.user.id);

        console.log('Login successful! Redirecting to dashboard...');

        // Small delay to ensure localStorage is written, then redirect
        setTimeout(() => {
          if (data.user.role === 'admin') {
            console.log('Navigating to admin dashboard');
            window.location.href = '/admin/dashboard'; // Use window.location for full page reload
          } else {
            console.log('Navigating to company dashboard');
            window.location.href = '/company/dashboard'; // Use window.location for full page reload
          }
        }, 100);
      } else {
        // Login failed
        console.error('Login failed - no token in response:', data);
        setShowLoginError(true);
      }
    } catch (error) {
      console.error('Login error (full):', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      setShowLoginError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setShowForgotPasswordSuccess(true);
      setIsLoading(false);

      // Reset form after 3 seconds and go back to login
      setTimeout(() => {
        setShowForgotPasswordSuccess(false);
        setShowForgotPassword(false);
        setForgotPasswordData({
          email: ''
        });
      }, 3000);
    }, 1000);
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/login/${key}`);
    setShowLoginError(false);
  };

  return (
    <div className="login-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={5}>
            <div className="text-center mb-4">
              <h1>تسجيل الدخول</h1>
              <p className="text-muted">قم بتسجيل الدخول للوصول إلى لوحة التحكم</p>
            </div>

            <Card className="login-card">
              <Card.Body>
                {!showForgotPassword ? (
                  <>
                    <Tabs
                      activeKey={activeTab}
                      onSelect={handleTabChange}
                      className="mb-4 login-tabs"
                    >
                      <Tab eventKey="company" title={t('companyLogin')}>
                        {showLoginError && (
                          <Alert variant="danger" className="d-flex align-items-center mb-3">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                            <div>اسم المستخدم أو كلمة المرور غير صحيحة</div>
                          </Alert>
                        )}

                        <Form onSubmit={handleLoginSubmit}>
                          <Form.Group controlId="companyUsername" className="mb-3">
                            <Form.Label>اسم المستخدم</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <FontAwesomeIcon icon={faUser} />
                              </span>
                              <Form.Control
                                type="text"
                                name="username"
                                value={loginData.username}
                                onChange={handleLoginChange}
                                placeholder="أدخل اسم المستخدم"
                                required
                              />
                            </div>
                          </Form.Group>

                          <Form.Group controlId="companyPassword" className="mb-3">
                            <Form.Label>كلمة المرور</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <FontAwesomeIcon icon={faLock} />
                              </span>
                              <Form.Control
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                placeholder="أدخل كلمة المرور"
                                required
                              />
                            </div>
                          </Form.Group>

                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <Form.Check
                              type="checkbox"
                              id="rememberMe"
                              name="rememberMe"
                              label="تذكرني"
                              checked={loginData.rememberMe}
                              onChange={handleLoginChange}
                            />
                            <Button
                              variant="link"
                              className="forgot-password-link p-0"
                              onClick={() => setShowForgotPassword(true)}
                            >
                              نسيت كلمة المرور؟
                            </Button>
                          </div>

                          <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mb-3"
                            disabled={isLoading}
                          >
                            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                          </Button>
                        </Form>
                      </Tab>

                      <Tab eventKey="admin" title={t('adminLogin')}>
                        {showLoginError && (
                          <Alert variant="danger" className="d-flex align-items-center mb-3">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                            <div>اسم المستخدم أو كلمة المرور غير صحيحة</div>
                          </Alert>
                        )}

                        <Form onSubmit={handleLoginSubmit}>
                          <Form.Group controlId="adminUsername" className="mb-3">
                            <Form.Label>اسم المستخدم</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <FontAwesomeIcon icon={faUser} />
                              </span>
                              <Form.Control
                                type="text"
                                name="username"
                                value={loginData.username}
                                onChange={handleLoginChange}
                                placeholder="أدخل اسم المستخدم"
                                required
                              />
                            </div>
                          </Form.Group>

                          <Form.Group controlId="adminPassword" className="mb-3">
                            <Form.Label>كلمة المرور</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <FontAwesomeIcon icon={faLock} />
                              </span>
                              <Form.Control
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                placeholder="أدخل كلمة المرور"
                                required
                              />
                            </div>
                          </Form.Group>

                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <Form.Check
                              type="checkbox"
                              id="adminRememberMe"
                              name="rememberMe"
                              label="تذكرني"
                              checked={loginData.rememberMe}
                              onChange={handleLoginChange}
                            />
                            <Button
                              variant="link"
                              className="forgot-password-link p-0"
                              onClick={() => setShowForgotPassword(true)}
                            >
                              نسيت كلمة المرور؟
                            </Button>
                          </div>

                          <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mb-3"
                            disabled={isLoading}
                          >
                            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                          </Button>
                        </Form>
                      </Tab>
                    </Tabs>

                    <div className="text-center mt-3">
                      <p className="mb-0">هل أنت من أصحاب شركات التشطيب؟</p>
                      <Link to="/contact" className="register-link">
                        تواصل معنا للتسجيل
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="forgot-password-form">
                    <div className="text-center mb-4">
                      <h3>استعادة كلمة المرور</h3>
                      <p className="text-muted">أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور</p>
                    </div>

                    {showForgotPasswordSuccess && (
                      <Alert variant="success" className="d-flex align-items-center mb-3">
                        <div>تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.</div>
                      </Alert>
                    )}

                    <Form onSubmit={handleForgotPasswordSubmit}>
                      <Form.Group controlId="forgotPasswordEmail" className="mb-4">
                        <Form.Label>البريد الإلكتروني</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FontAwesomeIcon icon={faEnvelope} />
                          </span>
                          <Form.Control
                            type="email"
                            name="email"
                            value={forgotPasswordData.email}
                            onChange={handleForgotPasswordChange}
                            placeholder="أدخل البريد الإلكتروني"
                            required
                          />
                        </div>
                      </Form.Group>

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mb-3"
                        disabled={isLoading}
                      >
                        {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                      </Button>

                      <div className="text-center">
                        <Button
                          variant="link"
                          className="back-to-login"
                          onClick={() => setShowForgotPassword(false)}
                        >
                          العودة إلى تسجيل الدخول
                        </Button>
                      </div>
                    </Form>
                  </div>
                )}
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <p>
                بالعودة إلى الصفحة الرئيسية <Link to="/">اضغط هنا</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
