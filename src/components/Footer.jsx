import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();
  const phoneNumber = '+2347060771730';
  // Pre-filled message for WhatsApp
  const whatsappMessage = `Hello%20BioLearn%2C%20I%20need%20assistance%20with%20the%20biology%20learning%20platform.`;
  const whatsappLink = `https://wa.me/2347060771730?text=${whatsappMessage}`;
  
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-3 md:mb-0">
            <img 
              src="/images/logo.jpg" 
              alt="BioLearn Logo" 
              className="h-8 w-8 rounded-lg object-cover"
            />
            <div>
              <span className="font-semibold text-gray-700">BioLearn</span>
              <span className="text-gray-400 ml-1">by</span>
              <span className="font-bold text-green-600 ml-1">Deyoung Tech</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-center mb-3 md:mb-0">
            <div className="text-sm text-gray-500 text-center">
              © {currentYear} Deyoung Tech Innovations. All rights reserved.
            </div>
            {/* Contact Section with Clickable Number */}
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-400">📞 Contact:</span>
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center space-x-1"
              >
                <span>💬</span>
                <span>{phoneNumber}</span>
              </a>
            </div>
          </div>
          
          <div className="flex space-x-4 mt-3 md:mt-0">
            <Link to="/topics" className="text-sm text-gray-400 hover:text-green-600 transition">
              Topics
            </Link>
            <Link to="/ai" className="text-sm text-gray-400 hover:text-green-600 transition">
              AI Assistant
            </Link>
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-green-600 transition flex items-center space-x-1"
            >
              <span>📱</span>
              <span>WhatsApp</span>
            </a>
            {/* Removed Privacy link */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
