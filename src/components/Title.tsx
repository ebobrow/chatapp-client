import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '../constants';

export const Title: React.FC = ({ children }) => {
  return (
    <Helmet>
      <title>
        {APP_NAME} | {children}
      </title>
    </Helmet>
  );
};
