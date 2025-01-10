import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;