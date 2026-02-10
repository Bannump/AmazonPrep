import React from 'react';

const LoginTest = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#ff0000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        border: '5px solid #000000',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#000000'
      }}>
        TEST: If you see this, React is working!
      </div>
    </div>
  );
};

export default LoginTest;
