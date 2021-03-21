import * as React from 'react';
import { StackActions } from '@react-navigation/routers';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
export function push(name, params) {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}