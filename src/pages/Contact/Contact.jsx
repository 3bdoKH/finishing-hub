import React from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt, faPhone, faEnvelope, faClock,
  faCheckCircle, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { contactService } from '../../services/api';
import useForm from '../../hooks/useForm';
import './Contact.css';

const Contact = () => {
  const { t } = useTranslation();

  const initialValues = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  const submitContactForm = async (data) => {
    return await contactService.submitContactForm(data);
  };

  const {
    values: formData,
    handleChange,
    handleSubmit,
    loading: isLoading,
    error,
    success: showSuccess
  } = useForm(initialValues, submitContactForm);

  return (
    <div className="contact-page">
      <div className="page-banner">
        <h1>{t('contactUs')}</h1>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center mb-5">
          <Col lg={8}>
            <div className="text-center mb-4">
              <h2>تواصل معنا</h2>
              <p className="lead">نحن هنا لمساعدتك والإجابة على جميع استفساراتك</p>
            </div>
          </Col>
        </Row>

        {/* Contact Information */}
        <Row className="mb-5">
          <Col md={3}>
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <h4>العنوان</h4>
              <p>شارع التحرير، وسط البلد، القاهرة، مصر</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <h4>هاتف</h4>
              <p>+20 123 456 7890</p>
              <p>+20 123 456 7891</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <h4>البريد الإلكتروني</h4>
              <p>info@tashteeb.com</p>
              <p>support@tashteeb.com</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="contact-info-card">
              <div className="contact-info-icon">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <h4>ساعات العمل</h4>
              <p>السبت - الخميس: 9 ص - 5 م</p>
              <p>الجمعة: مغلق</p>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Contact Form */}
          <Col lg={7} className="mb-4 mb-lg-0">
            <Card className="contact-form-card">
              <Card.Body>
                <h3 className="mb-4">أرسل لنا رسالة</h3>

                {showSuccess && (
                  <Alert variant="success" className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" size="lg" />
                    <div>تم إرسال رسالتك بنجاح! سنقوم بالرد عليك في أقرب وقت ممكن.</div>
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" size="lg" />
                    <div>{error}</div>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="formName">
                        <Form.Label>الاسم</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="formEmail">
                        <Form.Label>البريد الإلكتروني</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group controlId="formSubject" className="mb-3">
                    <Form.Label>الموضوع</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formMessage" className="mb-4">
                    <Form.Label>الرسالة</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div className="text-center">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Map */}
          <Col lg={5}>
            <div className="map-container">
              <iframe
                title="موقعنا على الخريطة"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27631.373467286772!2d31.2233356!3d30.0447689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Cairo%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1656494850854!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="contact-whatsapp mt-4">
              <h4>تواصل معنا عبر واتساب</h4>
              <p>للاستفسارات العاجلة، يمكنك التواصل معنا مباشرة عبر واتساب</p>
              <Button
                variant="success"
                size="lg"
                className="whatsapp-btn"
                href="https://wa.me/201234567890"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="me-2" />
                تواصل عبر واتساب
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* FAQ Section */}
      <div className="faq-section py-5 bg-light">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2>الأسئلة الشائعة</h2>
              <p className="lead">إليك بعض الإجابات على الأسئلة المتكررة</p>
            </Col>
          </Row>

          <Row>
            <Col lg={6} className="mb-4">
              <div className="faq-item">
                <h4>كيف يمكنني التسجيل كشركة؟</h4>
                <p>يمكنك التواصل معنا عبر نموذج الاتصال أعلاه أو إرسال بريد إلكتروني إلى info@tashteeb.com. سيقوم فريقنا بالتواصل معك خلال 24 ساعة لإكمال عملية التسجيل.</p>
              </div>
            </Col>
            <Col lg={6} className="mb-4">
              <div className="faq-item">
                <h4>ما هي تكلفة الاشتراك في المنصة؟</h4>
                <p>تختلف تكلفة الاشتراك حسب الباقة المختارة. يمكنك الاطلاع على باقاتنا والتكاليف الخاصة بها عن طريق التواصل مع فريق المبيعات.</p>
              </div>
            </Col>
            <Col lg={6} className="mb-4">
              <div className="faq-item">
                <h4>كيف يمكنني التعديل على بيانات الشركة؟</h4>
                <p>يمكنك تسجيل الدخول إلى حساب الشركة الخاص بك، والانتقال إلى لوحة التحكم، ثم تحديث البيانات المطلوبة بسهولة.</p>
              </div>
            </Col>
            <Col lg={6} className="mb-4">
              <div className="faq-item">
                <h4>هل يمكنني تغيير الصور والفيديوهات بعد التسجيل؟</h4>
                <p>نعم، يمكنك تحديث الصور والفيديوهات الخاصة بشركتك في أي وقت من خلال لوحة التحكم الخاصة بحساب الشركة.</p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center mt-3">
            <Col md={6} className="text-center">
              <p className="mb-0">لم تجد إجابة لسؤالك؟</p>
              <Button variant="outline-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                تواصل معنا مباشرة
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Contact;
