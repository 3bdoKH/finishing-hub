import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Container className="text-center py-5">
        <div className="error-container">
          <h1 className="error-code">404</h1>
          <div className="error-divider"></div>
          <h2 className="error-message">الصفحة غير موجودة</h2>
          <p className="error-desc">
            نأسف، ولكن الصفحة التي تبحث عنها غير موجودة. قد تكون الصفحة قد تم نقلها أو حذفها أو ربما أدخلت عنوان غير صحيح.
          </p>
          <div className="error-actions">
            <Link to="/" className="btn btn-primary me-3">
              <FontAwesomeIcon icon={faHome} className="me-2" />
              العودة للصفحة الرئيسية
            </Link>
            <Link to="/companies" className="btn btn-outline-primary">
              <FontAwesomeIcon icon={faSearch} className="me-2" />
              استعراض الشركات
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotFound;
