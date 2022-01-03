/** @jsxFrag React.Fragment */
/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx } from '@emotion/react';
import { useNodes } from '../lib/useNodes';
import { useParams } from 'react-router';
import { NodePicker } from './NodePicker';
import { Link } from './Branded';
import { useNavigate } from 'react-router-dom';
import mongoose from 'mongoose';
import { PassportContext } from './PassportContext';

export const Directory = () => {
  return <div></div>;
};
