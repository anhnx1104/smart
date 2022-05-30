import { parse } from 'query-string';
import type { FC } from 'react';
import { Fragment } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const TokenRoute: FC = ({ children }) => {
  const location = useLocation();
  const queryString = parse(location.search);
  if (!queryString || !queryString.email || !queryString.resetToken) {
    return <Navigate to="/login" replace />;
  }

  return <Fragment>{children}</Fragment>;
};

export default TokenRoute;
