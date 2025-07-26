import React, { useState } from 'react';
import CityEmailForm from './CityEmailForm';

const FinalThankYouScreen = ({ userName, phone }) => {
  const [isFormCompleted, setIsFormCompleted] = useState(false);

  if (!isFormCompleted) {
    return (
      <CityEmailForm
        userName={userName}
        phone={phone}
        onComplete={(formData) => setIsFormCompleted(formData || true)}
      />
    );
  }

  // Get the name from formData if available, else fallback to userName
  const submittedName =
    typeof isFormCompleted === 'object' && isFormCompleted?.name
      ? isFormCompleted.name
      : userName;

  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4 text-center bg-black text-white">
      <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 ">
        Thank you! {submittedName}
      </h2>
      <p className="text-xl md:text-2xl mb-6">
        for showing so much patience and finishing the questionnaire
      </p>
      <p className="text-2xl md:text-3xl mb-10">
        You will receive your personalized investment plan very soon.
      </p>
      <p className="text-lg md:text-xl mb-2">For any query feel free to</p>
      <p className="text-lg md:text-xl mb-3">
        connect with us on <span className="font-semibold">9811151619</span>
      </p>
      
    </div>
  );
};

export default FinalThankYouScreen;
