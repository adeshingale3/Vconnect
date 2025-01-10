'use client';

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import PropTypes from 'prop-types';
import { INTEREST_OPTIONS } from '../constants/interests';

export const GlareCard = ({ user }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-8 shadow-lg">
      <div className="space-y-6">
        {/* Name Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            {user?.name || "Volunteer"}
          </h2>
          <div className="h-0.5 w-16 bg-sky-500 mx-auto"></div>
        </div>

        {/* Bio Section */}
        <div className="text-center">
          <p className="text-gray-400 italic">
            {user?.bio || "Making a difference in the community"}
          </p>
        </div>

        {/* Aura Points - Highlighted */}
        <div className="bg-sky-500/10 rounded-lg p-4 text-center">
          <h3 className="text-sky-500 text-sm font-semibold mb-1">AURA POINTS</h3>
          <span className="text-4xl font-bold text-white">
            {user?.auraPoints?.toFixed(1) || "0.0"}
          </span>
        </div>

        {/* Events Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm mb-1">Events Participated</h3>
            <span className="text-2xl font-bold text-white">
              {user?.participatedEvents || 0}
            </span>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="text-gray-400 text-sm mb-1">Events Hosted</h3>
            <span className="text-2xl font-bold text-white">
              {user?.hostedEvents || 0}
            </span>
          </div>
        </div>

        {/* Add this section after the Events Stats */}
        {user?.interests?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-gray-400 text-sm mb-2 text-center">Interests</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {user.interests.map((interestId) => {
                const interest = INTEREST_OPTIONS.find(opt => opt.id === interestId);
                return interest ? (
                  <span
                    key={interestId}
                    className="px-2 py-1 bg-white/5 rounded-full text-xs text-gray-300"
                  >
                    {interest.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

GlareCard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    bio: PropTypes.string,
    auraPoints: PropTypes.number,
    participatedEvents: PropTypes.number,
    hostedEvents: PropTypes.number,
    interests: PropTypes.arrayOf(PropTypes.string)
  }),
};