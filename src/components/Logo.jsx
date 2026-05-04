import React from 'react';
import { Link } from 'react-router-dom';

function Logo({ size = 'large' }) {
  const containerSize = size === 'large' ? 'space-x-3' : 'space-x-2';
  const imgSize = size === 'large' ? 'h-10 w-10' : 'h-8 w-8';
  const textSize = size === 'large' ? 'text-xl' : 'text-base';
  const subtextSize = size === 'large' ? 'text-xs' : 'text-[10px]';
  
  return (
    <Link to="/dashboard" className={`flex items-center ${containerSize}`}>
      <img 
        src="/images/logo.jpg" 
        alt="BioLearn Logo" 
        className={`${imgSize} rounded-lg object-cover`}
      />
      <div>
        <span className={`${textSize} font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent`}>
          BioLearn
        </span>
        <span className={`${subtextSize} text-gray-500 block -mt-1`}></span>
      </div>
    </Link>
  );
}

export default Logo;
