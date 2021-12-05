import React, { useEffect, useState } from 'react';

export const useDocTitle = (title) => {
  const [doctitle, setDocTitle] = useState(title);
  useEffect(() => {
    document.title = doctitle;
  }, [doctitle]);

  return [doctitle, setDocTitle];
};
