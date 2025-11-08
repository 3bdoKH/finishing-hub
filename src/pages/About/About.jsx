import React, { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding, faUsers, faUserShield, faHandshake,
  faPaintRoller, faHammer, faCouch, faBath
} from '@fortawesome/free-solid-svg-icons';
import './About.css';
import about from '../../media/about.jpeg';
const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="about-page">
      <div className="page-banner">
        <h1>عن دليل التشطيب</h1>
      </div>

      <Container className="py-5">
        {/* About Us Section */}
        <Row className="mb-5">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="about-image">
              <img src={about} alt="عن دليل التشطيب" />
            </div>
          </Col>
          <Col lg={6}>
            <div className="about-content">
              <h2>من نحن</h2>
              <p>
                دليل التشطيب هو منصة رائدة في مجال ربط أصحاب المنازل والمكاتب بأفضل شركات التشطيب والتجديد في مصر. تأسست عام 2023 بهدف توفير حلول سهلة وفعالة لكل من يبحث عن خدمات التشطيب ذات الجودة العالية.
              </p>
              <p>
                نحن نؤمن بأن عملية تشطيب المنزل أو المكتب يجب أن تكون تجربة ممتعة وخالية من التعقيدات. لذلك، نقدم منصة متكاملة تساعدك في العثور على أفضل شركات التشطيب التي تناسب احتياجاتك وميزانيتك بكل سهولة.
              </p>
              <h3>رؤيتنا</h3>
              <p>
                أن نكون الوجهة الأولى لكل من يبحث عن خدمات التشطيب والتجديد في مصر، وأن نساهم في رفع مستوى الجودة في قطاع التشطيبات والديكور.
              </p>
              <h3>رسالتنا</h3>
              <p>
                تسهيل عملية البحث عن شركات التشطيب المناسبة وتوفير منصة تتيح المقارنة بين مختلف الخيارات، مع ضمان الشفافية والجودة في الخدمات المقدمة.
              </p>
            </div>
          </Col>
        </Row>

        {/* Our Values */}
        <Row className="mb-5">
          <Col lg={12} className="text-center mb-4">
            <h2 className="section-title">قيمنا</h2>
            <p className="section-subtitle">المبادئ التي نلتزم بها في كل ما نقدمه من خدمات</p>
          </Col>
          <Col md={3}>
            <div className="value-item text-center">
              <div className="value-icon">
                <FontAwesomeIcon icon={faUserShield} />
              </div>
              <h4>الجودة</h4>
              <p>نلتزم بتقديم أعلى معايير الجودة في جميع خدماتنا</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="value-item text-center">
              <div className="value-icon">
                <FontAwesomeIcon icon={faHandshake} />
              </div>
              <h4>الشفافية</h4>
              <p>نؤمن بأهمية الوضوح والصدق في التعامل مع عملائنا وشركائنا</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="value-item text-center">
              <div className="value-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h4>التعاون</h4>
              <p>نعمل سوياً لتحقيق أفضل النتائج وتجاوز توقعات العملاء</p>
            </div>
          </Col>
          <Col md={3}>
            <div className="value-item text-center">
              <div className="value-icon">
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <h4>الابتكار</h4>
              <p>نسعى دائماً لتطوير حلول مبتكرة تلبي احتياجات السوق المتغيرة</p>
            </div>
          </Col>
        </Row>

        {/* Services */}
        <Row className="mb-5">
          <Col lg={12} className="text-center mb-4">
            <h2 className="section-title">خدماتنا</h2>
            <p className="section-subtitle">نقدم مجموعة متنوعة من الخدمات لتلبية احتياجات عملائنا</p>
          </Col>

          <Col md={6} lg={3} className="mb-4">
            <Card className="service-card h-100">
              <Card.Body className="text-center">
                <div className="service-icon">
                  <FontAwesomeIcon icon={faPaintRoller} />
                </div>
                <h4>تشطيبات كاملة</h4>
                <p>خدمات تشطيب متكاملة للشقق والفلل والمكاتب بأعلى جودة</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} className="mb-4">
            <Card className="service-card h-100">
              <Card.Body className="text-center">
                <div className="service-icon">
                  <FontAwesomeIcon icon={faHammer} />
                </div>
                <h4>أعمال التجديد</h4>
                <p>تجديد وتحديث المساحات السكنية والتجارية بأحدث التصاميم</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} className="mb-4">
            <Card className="service-card h-100">
              <Card.Body className="text-center">
                <div className="service-icon">
                  <FontAwesomeIcon icon={faCouch} />
                </div>
                <h4>تصميم داخلي</h4>
                <p>تصميمات داخلية عصرية وفريدة تناسب مختلف الأذواق</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3} className="mb-4">
            <Card className="service-card h-100">
              <Card.Body className="text-center">
                <div className="service-icon">
                  <FontAwesomeIcon icon={faBath} />
                </div>
                <h4>تشطيبات خاصة</h4>
                <p>خدمات متخصصة لتشطيب المطابخ والحمامات وغرف النوم</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* How It Works */}
        <Row>
          <Col lg={12} className="text-center mb-4">
            <h2 className="section-title">كيف يعمل موقع دليل التشطيب</h2>
            <p className="section-subtitle">عملية بسيطة وسهلة للعثور على شركة التشطيب المناسبة</p>
          </Col>

          <Col md={4} className="mb-4">
            <div className="step-item">
              <div className="step-number">1</div>
              <h4>استعرض الشركات</h4>
              <p>تصفح قائمة شركات التشطيب المتاحة وقارن بينها بناءً على الخدمات والتقييمات والأسعار</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="step-item">
              <div className="step-number">2</div>
              <h4>اختر الشركة المناسبة</h4>
              <p>اختر الشركة التي تناسب احتياجاتك وميزانيتك، واطلع على تفاصيل خدماتها ومشاريعها السابقة</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="step-item">
              <div className="step-number">3</div>
              <h4>تواصل مع الشركة</h4>
              <p>تواصل مباشرة مع الشركة التي اخترتها لمناقشة التفاصيل والبدء في تنفيذ مشروعك</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default About;
