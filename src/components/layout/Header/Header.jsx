import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import logo from '../../../media/logo.png';
const Header = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <header className="site-header">
      <Navbar bg="light" expand="lg" expanded={expanded} className="py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="logo">
            <img src={logo} alt="دليل التشطيب" className="logo-img" />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
          >
            <FontAwesomeIcon icon={faBars} />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>{t('home')}</Nav.Link>
              <Nav.Link as={Link} to="/about" onClick={() => setExpanded(false)}>{t('about')}</Nav.Link>
              <Nav.Link as={Link} to="/companies" onClick={() => setExpanded(false)}>{t('companies')}</Nav.Link>
              <Nav.Link as={Link} to="/blog" onClick={() => setExpanded(false)}>{t('blog')}</Nav.Link>
              <Nav.Link as={Link} to="/contact" onClick={() => setExpanded(false)}>{t('contactUs')}</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown title={<span><FontAwesomeIcon icon={faUser} /> {t('login')}</span>} id="login-dropdown">
                <NavDropdown.Item as={Link} to="/login/company" onClick={() => setExpanded(false)}>
                  {t('companyLogin')}
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
