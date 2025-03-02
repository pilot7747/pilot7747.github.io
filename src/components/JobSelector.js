'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function JobSelector({ jobs }) {
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);

  return (
    <div className="job-selector">
      {/* Modern Tab Navigation */}
      <div className="job-tabs">
        {jobs.map((job, index) => (
          <button
            key={job.slug}
            onClick={() => setSelectedJobIndex(index)}
            className={`job-tab ${selectedJobIndex === index ? 'active' : ''}`}
          >
            {job.logo && (
              <div className="job-tab-logo-container">
                <Image
                  src={job.logo}
                  alt={`${job.company} logo`}
                  width={24}
                  height={24}
                  className="job-tab-logo"
                />
              </div>
            )}
            <span>{job.company}</span>
            {selectedJobIndex === index && (
              <motion.div 
                className="active-indicator" 
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      
      {/* Selected Job Content with Animation */}
      {jobs[selectedJobIndex] && (
        <motion.div 
          key={jobs[selectedJobIndex].slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="job-content"
        >
          <div className="job-header">
            {jobs[selectedJobIndex].logo && (
              <div className="job-content-logo">
                <Image
                  src={jobs[selectedJobIndex].logo}
                  alt={`${jobs[selectedJobIndex].company} logo`}
                  width={60}
                  height={60}
                  className="company-logo"
                />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold">{jobs[selectedJobIndex].title}</h3>
              <div className="job-meta">
                <span className="company">{jobs[selectedJobIndex].company}</span>
                <span className="location">{jobs[selectedJobIndex].location}</span>
              </div>
              <p className="job-date">{jobs[selectedJobIndex].range}</p>
            </div>
          </div>
          
          <div 
            className="job-description"
            dangerouslySetInnerHTML={{ __html: jobs[selectedJobIndex].contentHtml }}
          />
          
          {jobs[selectedJobIndex].url && (
            <a 
              href={jobs[selectedJobIndex].url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="job-link"
            >
              Visit website
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="icon" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </motion.div>
      )}
    </div>
  );
} 