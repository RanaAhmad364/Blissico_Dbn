import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const previewRequests = new Map();

const getPreviewBlob = (src) => {
  if (!previewRequests.has(src)) {
    const request = api.get(src, { responseType: 'blob' })
      .then((response) => response.data)
      .finally(() => previewRequests.delete(src));
    previewRequests.set(src, request);
  }
  return previewRequests.get(src);
};

const ProtectedPreviewImage = ({ src, alt = '', ...imageProps }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src) {
      setPreviewUrl('');
      return undefined;
    }

    let cancelled = false;
    let objectUrl;
    setPreviewUrl('');
    setFailed(false);

    getPreviewBlob(src)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
        } else {
          setPreviewUrl(objectUrl);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${alt || 'Card'} preview unavailable`}
        title="The card preview could not be loaded."
        {...imageProps}
      />
    );
  }
  if (!previewUrl) return <div aria-hidden="true" {...imageProps} />;

  return <img src={previewUrl} alt={alt} {...imageProps} />;
};

export default ProtectedPreviewImage;
