'use client';

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import PropTypes from 'prop-types';

export const GlareCard = ({ user }) => {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="group relative w-[400px] rounded-xl border border-white/10 bg-gray-900 px-8 py-12 shadow-2xl"
      onMouseMove={handleMouseMove}
      style={{ margin: '0 auto' }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.15),
              transparent 80%
            )
          `,
        }}
      />
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
  }),
};