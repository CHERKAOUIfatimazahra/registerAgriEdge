import { useState } from "react";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../firebaseConfig';
import { toast } from 'react-toastify';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    position: "",
    phone: "",
    country: "",
    interests: [],
    otherInterest: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherField, setShowOtherField] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    
    if (value === "other") {
      setShowOtherField(checked);
      if (!checked) {
        setFormData({
          ...formData,
          otherInterest: ""
        });
      }
      return;
    }
    
    if (checked) {
      setFormData({ 
        ...formData, 
        interests: [...formData.interests, value] 
      });
    } else {
      setFormData({
        ...formData,
        interests: formData.interests.filter(interest => interest !== value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const db = getFirestore(app);
      const registrationsRef = collection(db, 'registrations');
      
      if (!formData.fullName || !formData.email || !formData.company || !formData.phone || !formData.country) {
        throw new Error('Please fill in all required fields');
      }

      const submissionData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        position: formData.position.trim(),
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        interests: formData.interests || [],
        timestamp: new Date().toISOString()
      };

      if (showOtherField && formData.otherInterest) {
        submissionData.otherInterest = formData.otherInterest.trim();
      }

      console.log('Submitting data:', submissionData);
      
      const docRef = await addDoc(registrationsRef, submissionData);

      console.log('Document written with ID: ', docRef.id);
      toast.success('Registration successful!');
      
      setFormData({
        fullName: "",
        email: "",
        company: "",
        position: "",
        phone: "",
        country: "",
        interests: [],
        otherInterest: ""
      });
      setShowOtherField(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const brandColors = {
    green: "#bcd630",
    darkGray: "#4d4d4d",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" 
         style={{ 
           backgroundImage: "url('agriedge.png')", 
           backgroundSize: "cover" 
         }}>
      <div className="w-full max-w-5xl mx-4 my-6 flex flex-col md:flex-row rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
        {/* Left Side - Logo and Event Info */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-gray-800 to-gray-900 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,0 L800,0 L400,600 Z" fill={brandColors.green} />
              <path d="M0,800 L800,800 L600,200 Z" fill={brandColors.green} />
              <path d="M0,0 L0,800 L300,400 Z" fill={brandColors.green} />
              <path d="M800,0 L800,800 L500,400 Z" fill={brandColors.green} />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-48">
                <img 
                  src="/agriedge.png" 
                  alt="Logo AgriEdge" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            <h2 className="text-white text-center text-2xl font-bold mt-4">AgriEdge</h2>
            <h3 className="text-gray-300 text-center text-lg font-light mb-6">Inscription à l'Événement</h3>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mt-4 border border-gray-700 backdrop-blur-sm">
              <h4 className="text-white text-base font-semibold mb-3">Détails de l'Événement</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="bg-gray-700 bg-opacity-50 rounded-full p-2 mr-3" style={{ color: brandColors.green }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-200 text-sm">15-17 Avril 2025</p>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-gray-700 bg-opacity-50 rounded-full p-2 mr-3" style={{ color: brandColors.green }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-200 text-sm">Centre d'Exposition de Casablanca</p>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-gray-700 bg-opacity-50 rounded-full p-2 mr-3" style={{ color: brandColors.green }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <p className="text-gray-200 text-sm">Découvrez l'avenir de l'AgriTech</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center relative z-10 border-t border-gray-700 pt-4">
            <p className="text-gray-400 text-xs mb-1">Des questions ? Contactez-nous :</p>
            <p className="text-white text-sm font-semibold">info@agriedge.com</p>
          </div>
        </div>
        
        {/* Right Side - Registration Form */}
        <div className="w-full md:w-3/5 bg-white bg-opacity-75 backdrop-blur-md p-6">
          <div className="bg-white bg-opacity-90 rounded-xl p-6 shadow-lg">
            <h2 className="text-gray-800 text-xl font-bold mb-4 border-b border-gray-200 pb-3">Inscrivez-vous Maintenant</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Nom Complet *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    style={{ focusRing: brandColors.green }}
                    placeholder="Entrez votre nom complet"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Entrez votre email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Entreprise/Organisation *</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Entrez le nom de votre entreprise"
                  />
                </div>
                
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Poste/Titre</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Entrez votre poste"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Numéro de Téléphone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Entrez votre numéro de téléphone"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Entrez votre pays"
                  />
                </div>
              </div>
              
              <div className="mt-3 mb-5">
                <p className="text-sm font-medium text-gray-700 mb-2">Solutions d'Intérêt</p>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="sm:grid sm:grid-cols-2 gap-x-4 gap-y-2">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <input
                        type="checkbox"
                        id="aqua-edge"
                        name="interests"
                        value="AquaEdge"
                        checked={formData.interests.includes("AquaEdge")}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 focus:ring-green-500 border-gray-300 rounded"
                        style={{ color: brandColors.green }}
                      />
                      <label htmlFor="aqua-edge" className="ml-2 block text-sm text-gray-700">AquaEdge</label>
                    </div>
                  
                    <div className="flex items-center mb-2 sm:mb-0">
                      <input
                        type="checkbox"
                        id="ferti-edge"
                        name="interests"
                        value="FertiEdge"
                        checked={formData.interests.includes("FertiEdge")}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 focus:ring-green-500 border-gray-300 rounded"
                        style={{ color: brandColors.green }}
                      />
                      <label htmlFor="ferti-edge" className="ml-2 block text-sm text-gray-700">FertiEdge</label>
                    </div>
                    
                    <div className="flex items-center mb-2 sm:mb-0">
                      <input
                        type="checkbox"
                        id="yield-edge"
                        name="interests"
                        value="YieldEdge"
                        checked={formData.interests.includes("YieldEdge")}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 focus:ring-green-500 border-gray-300 rounded"
                        style={{ color: brandColors.green }}
                      />
                      <label htmlFor="yield-edge" className="ml-2 block text-sm text-gray-700">YieldEdge</label>
                    </div>
                    
                    <div className="flex items-center mb-2 sm:mb-0">
                      <input
                        type="checkbox"
                        id="trial-edge"
                        name="interests"
                        value="TrialEdge"
                        checked={formData.interests.includes("TrialEdge")}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 focus:ring-green-500 border-gray-300 rounded"
                        style={{ color: brandColors.green }}
                      />
                      <label htmlFor="trial-edge" className="ml-2 block text-sm text-gray-700">TrialEdge</label>
                    </div>

                    <div className="flex items-center col-span-2 mb-2">
                      <input
                        type="checkbox"
                        id="other"
                        name="other"
                        value="other"
                        checked={showOtherField}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 focus:ring-green-500 border-gray-300 rounded"
                        style={{ color: brandColors.green }}
                      />
                      <label htmlFor="other" className="ml-2 block text-sm text-gray-700">Autre</label>
                    </div>

                    {showOtherField && (
                      <div className="col-span-2 mt-2 mb-2">
                        <input
                          type="text"
                          id="otherInterest"
                          name="otherInterest"
                          value={formData.otherInterest}
                          onChange={handleChange}
                          className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                          placeholder="Précisez votre solution d'intérêt"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-gray-900 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: brandColors.green }}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Compléter l\'Inscription'}
                </button>
              </div>
              
              <p className="mt-3 text-center text-xs text-gray-600">
                © 2025 AgriEdge SA.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}