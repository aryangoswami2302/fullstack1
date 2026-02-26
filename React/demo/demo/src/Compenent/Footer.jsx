// Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto ">
      <Container>
        <Row>
          {/* Company Info */}
          <Col md={4} sm={12} className="mb-3">
            <h5>MyCompany</h5>
            <p>
              Building modern web solutions with passion and precision.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} sm={6} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/about" className="text-light text-decoration-none">About</a></li>
              <li><a href="/services" className="text-light text-decoration-none">Services</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col md={4} sm={6} className="mb-3">
            <h5>Contact</h5>
            <p>Email: info@mycompany.com</p>
            <p>Phone: +91 98765 43210</p>
            <div>
              <a href="#" className="text-light me-3"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-light me-3"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-light"><i className="bi bi-instagram"></i></a>
            </div>
          </Col>
        </Row>

        <hr className="border-light" />
        <Row>
          <Col className="text-center">
            <small>&copy; {new Date().getFullYear()} MyCompany. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
