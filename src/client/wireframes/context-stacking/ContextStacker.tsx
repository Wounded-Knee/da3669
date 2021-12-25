/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { useOnMount } from '../../lib/useOnMount';

export const ContextStacker = (props) => {
  const { child, ancestorProps, changeAncestorProps = (props) => props, ...forwardProps } = props;
  const { depthLimit, depth = 0, text, color, callback } = props;
  const descendantProps = changeAncestorProps(ancestorProps) || {};
  const finalDescendant = !child || depth >= depthLimit;

  useEffect(() => {
    if (finalDescendant) {
      console.log('callback');
      callback(descendantProps);
    }
  }, [finalDescendant]);

  return (
    <>
      <p style={{ color }}>
        {depth}: {text}
      </p>
      {!finalDescendant ? (
        React.cloneElement(child, { ...forwardProps, ...child.props, ancestorProps: descendantProps, depth: depth + 1 })
      ) : (
        <></>
      )}
    </>
  );
};
