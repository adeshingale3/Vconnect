import React from 'react';

export function GlareCard({ name, nickname, auraPoints, participatedEvents, hostedEvents }) {
  return (
    
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg" style={{ width: '300px', height: '400px' }}>
      {/* Remove the SVG and display the user data */}
      <h2 className="text-xl font-bold mb-2">{name || "Name not set"}</h2>
      <p className="text-md text-gray-600 mb-2">{nickname || "Nickname not set"}</p>
      
      <div className="text-sm text-gray-800 mb-4">
        <p><strong>Aura Points:</strong> {auraPoints}</p>
        <p><strong>Participated Events:</strong> {participatedEvents}</p>
        <p><strong>Hosted Events:</strong> {hostedEvents}</p>
      </div>
    </div>
  );
}