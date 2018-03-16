import React from 'react';
import { Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

let isLoggedIn = function() {
    let token = localStorage.getItem('authToken');
    if(token) {
      let decoded = jwt_decode(token);
      return decoded.userId;
    }
}

let logout = function() {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};

module.exports = { isLoggedIn, logout };