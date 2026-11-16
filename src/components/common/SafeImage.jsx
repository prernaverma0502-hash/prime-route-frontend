import React, { useState } from 'react';

const FALLBACK_AVATAR = '/placeholders/avatar-default.svg';
const FALLBACK_VEHICLE = '/placeholders/vehicle-default.svg';

export default function SafeImage({
  src,
  alt = '',
  fallbackType = 'avatar', // 'avatar' | 'vehicle'
  className = '',
  ...props
}) {
  const fallback = fallbackType === 'vehicle' ? FALLBACK_VEHICLE : FALLBACK_AVATAR;
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
      {...props}
    />
  );
}

