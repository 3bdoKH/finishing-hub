import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="site-footer">
            <Container>
                <Row className="py-5">
                    <Col md={4} className="footer-about mb-4">
                        <h4>دليل التشطيب</h4>
                        <p>منصة تشطيب توفر لك أفضل شركات التشطيب والتجديد في مصر، مع ضمان جودة الخدمات وسهولة التواصل.</p>
                    </Col>
                    <Col md={4} className="footer-links mb-4">
                        <h4>روابط مهمة</h4>
                        <ul className="list-unstyled">
                            <li><Link to="/">{t('home')}</Link></li>
                            <li><Link to="/about">{t('about')}</Link></li>
                            <li><Link to="/companies">{t('companies')}</Link></li>
                            <li><Link to="/blog">{t('blog')}</Link></li>
                            <li><Link to="/contact">{t('contactUs')}</Link></li>
                        </ul>
                    </Col>
                    <Col md={4} className="footer-contact mb-4">
                        <h4>{t('contactUs')}</h4>
                        <p>القاهرة، مصر</p>
                        <p>info@tashteeb.com</p>
                        <p>+20 123 456 7890</p>
                        <div className="social-icons">
                            <a href="#" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="#" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faLinkedin} /></a>
                        </div>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col className="text-center py-3">
                        <p>{t('copyright')} {currentYear} © دليل التشطيب</p>
                        <div className="footer-sub-links">
                            <Link to="/privacy-policy">{t('privacyPolicy')}</Link>
                            <Link to="/terms-of-service">{t('termsOfService')}</Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
