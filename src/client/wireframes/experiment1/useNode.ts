import React, { useState, useEffect } from 'react';
import { getNodeById } from './data';

export const useNode = (id) => {
  const [node, setNode] = useState({});

  useEffect(() => {
    getNodeById(id).then((node) => setNode(node));
  }, [id]);

  return {
    node,
  };
};
