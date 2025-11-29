import React from 'react';

const Debug = ({ data, title = "Debug Data" }) => {
  return (
    <div style={{ 
      background: '#f5f5f5', 
      padding: '1rem', 
      margin: '1rem 0', 
      border: '1px solid #ccc',
      fontSize: '14px',
      color: 'black',
    }}>
      <h3>🔍 {title}</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Debug;