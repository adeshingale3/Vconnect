// src/components/GenerateCard.jsx
import React from 'react';
import { GlareCard } from "../ui/GlareCard"; // Assuming this is your GlareCard component
import html2canvas from 'html2canvas';

const GenerateCard = ({ userData }) => {
  // Destructure the userData object
  const { name, nickname, auraPoints, participatedEvents, hostedEvents } = userData;

  return (
    
    <div className="profile-card-container mt-16">
      <div id="profile-card">
        <GlareCard
          name={name}
          nickname={nickname}
          auraPoints={auraPoints}
          participatedEvents={participatedEvents}
          hostedEvents={hostedEvents}
        />
      </div>
      {/* You can optionally add a button for downloading the profile card here */}
    </div>
  );
};

export default GenerateCard; // Default export of GenerateCard component
