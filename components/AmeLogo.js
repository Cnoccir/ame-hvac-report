import React from 'react';
import Image from 'next/image';

const AmeLogo = ({ size = "large" }) => {
  const logoHeight = size === "large" ? 60 : 32;
  const logoWidth = size === "large" ? 180 : 100;
  
  return (
    <div className={`${size === "large" ? "w-64" : "w-32"} h-auto`}>
      {/* Using the actual logo from S3 */}
      <div className="relative">
        <Image 
          src="https://ame-techassist-bucket.s3.us-east-1.amazonaws.com/ame-report-images/tutor-logo.png"
          alt="AME Inc. Logo"
          width={logoWidth}
          height={logoHeight}
          style={{
            objectFit: 'contain',
            objectPosition: 'left',
            maxWidth: '100%',
            height: 'auto'
          }}
          unoptimized={true} // To ensure direct loading from S3
        />
      </div>
    </div>
  );
};

export default AmeLogo;