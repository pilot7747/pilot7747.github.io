'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope, FaTwitter } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si';

export default function Footer() {
  return (
    <footer className="bg-alternate py-10 mt-20">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold">Nikita Pavlichenko</h2>
            <p className="text-muted mt-1">
              Senior Machine Learning Engineer
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://github.com/pilot7747" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted icon-link"
              aria-label="GitHub"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <a 
              href="https://www.linkedin.com/in/nikita-pavlichenko/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted icon-link"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a 
              href="mailto:nikita.v.pavlichenko@gmail.com" 
              className="text-muted icon-link"
              aria-label="Email"
            >
              <FaEnvelope className="w-6 h-6" />
            </a>
            <a 
              href="https://scholar.google.com/citations?user=2mSLYhcAAAAJ" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted icon-link"
              aria-label="Google Scholar"
            >
              <SiGooglescholar className="w-6 h-6" />
            </a>
          </div>
        </div>
        
        <div className="border-t mt-6 pt-6" style={{ borderColor: "#e5e7eb" }}>
          <p className="text-center text-muted text-sm">
            &copy; {new Date().getFullYear()} Nikita Pavlichenko. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 