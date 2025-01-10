import { useState } from 'react';
import { addDoc, collection, doc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, ClockIcon, UsersIcon, StarIcon } from '@heroicons/react/24/outline';

const HostAnEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxVolunteers: '',
    auraPointsRequired: '0',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert('Please login to host an event');
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const eventData = {
        ...formData,
        hostedBy: auth.currentUser.uid,
        createdAt: new Date().toISOString(),
        participants: [],
        promotions: 0,
      };

      // Add event to events collection
      const eventRef = await addDoc(collection(db, 'events'), eventData);

      // Update user's hosted events count
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        hostedEvents: increment(1)
      });

      navigate('/browse-events');
    } catch (error) {
      console.error('Error hosting event:', error);
      alert('Error creating event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formSteps = [
    {
      title: "Basic Details",
      fields: ["title", "description"]
    },
    {
      title: "Event Schedule",
      fields: ["date", "time"]
    },
    {
      title: "Location & Requirements",
      fields: ["location", "maxVolunteers", "auraPointsRequired"]
    }
  ];

  const renderFormFields = () => {
    const currentFields = formSteps[currentStep - 1].fields;

    return (
      <div className="space-y-6">
        {currentFields.includes("title") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Give your event a catchy title"
              required
            />
          </div>
        )}

        {currentFields.includes("description") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Describe what volunteers will be doing"
              required
            />
          </div>
        )}

        {currentFields.includes("date") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CalendarIcon className="w-5 h-5 inline-block mr-2" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        )}

        {currentFields.includes("time") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ClockIcon className="w-5 h-5 inline-block mr-2" />
              Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        )}

        {currentFields.includes("location") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPinIcon className="w-5 h-5 inline-block mr-2" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter the city or specific location"
              required
            />
          </div>
        )}

        {currentFields.includes("maxVolunteers") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <UsersIcon className="w-5 h-5 inline-block mr-2" />
              Maximum Volunteers
            </label>
            <input
              type="number"
              name="maxVolunteers"
              value={formData.maxVolunteers}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter maximum number of volunteers needed"
              min="1"
              required
            />
          </div>
        )}

        {currentFields.includes("auraPointsRequired") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <StarIcon className="w-5 h-5 inline-block mr-2" />
              Required Aura Points
            </label>
            <input
              type="number"
              name="auraPointsRequired"
              value={formData.auraPointsRequired}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Minimum points required to join"
              min="0"
              required
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Host an Event</h1>
            <p className="mt-2 text-gray-600">Create a meaningful volunteer opportunity</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {formSteps.map((step, index) => (
                <div key={step.title} className="flex-1">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep > index + 1 ? 'bg-green-500 text-white' :
                      currentStep === index + 1 ? 'bg-blue-500 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {currentStep > index + 1 ? '✓' : index + 1}
                    </div>
                    <div className={`flex-1 h-1 ${
                      index < formSteps.length - 1 ? 
                      currentStep > index + 1 ? 'bg-green-500' :
                      'bg-gray-200' : 'hidden'
                    }`} />
                  </div>
                  <p className="text-sm mt-2 text-gray-600">{step.title}</p>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {renderFormFields()}

            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Previous
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type={currentStep === formSteps.length ? "submit" : "button"}
                onClick={() => {
                  if (currentStep < formSteps.length) {
                    setCurrentStep(prev => prev + 1);
                  }
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 
                  currentStep === formSteps.length ? 'Create Event' : 'Next'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HostAnEvent;