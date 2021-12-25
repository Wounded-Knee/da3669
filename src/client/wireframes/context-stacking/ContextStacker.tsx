/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useEffect } from 'react';
import { css, jsx } from '@emotion/react';

export const ContextStacker = (props) => {
  const {
    children: tmpChildren,
    ancestorProps,
    mutation,
    path,
    onClick = () => {},
    changeAncestorProps = (props) => props,
    ...forwardProps
  } = props;
  const [nav, ...forwardPath] = path;
  const children = tmpChildren ? (tmpChildren instanceof Array ? tmpChildren : [tmpChildren]) : [];
  const { setDepth, addPath, depthLimit, depth = 0, text, color, callback } = props;
  const descendantProps = {
    ...(changeAncestorProps(ancestorProps) || {}),
    ...mutation,
  };
  const depthReached = depth >= depthLimit;
  const finalDescendant = children.length === 0 || depthReached;
  const child = children[nav];

  useEffect(() => {
    if (!child) {
      callback(descendantProps);
    }
  }, [child]);

  return (
    <>
      <p
        onClick={() => setDepth(depth)}
        style={{ color }}
        css={css`
          text-shadow: 1px 1px 2px black;
        `}
      >
        {text}
      </p>
      {child &&
        React.cloneElement(child, {
          ...forwardProps,
          ...child.props,
          path: forwardPath,
          ancestorProps: descendantProps,
          depth: depth + 1,
        })}

      {!child &&
        children.length > 0 &&
        children.map((child, index) => (
          <button key={index} onClick={() => addPath(index)}>
            {child.props.text}
          </button>
        ))}
    </>
  );
};
