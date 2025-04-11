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
        <div className="w-full md:w-2/5 bg-gradient-to-br from-gray-900 to-green-900 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full">
              <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                <circle cx="400" cy="400" r="300" fill={brandColors.green} />
                <path d="M0,0 L800,0 L400,600 Z" fill="white" opacity="0.1" />
                <path d="M0,800 L800,800 L600,200 Z" fill="white" opacity="0.1" />
                <circle cx="200" cy="200" r="150" fill="white" opacity="0.05" />
                <circle cx="600" cy="600" r="200" fill="white" opacity="0.05" />
              </svg>
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="w-40 h-40 bg-white bg-opacity-10 rounded-full flex items-center justify-center p-2 ring-2 ring-white ring-opacity-30">
                <img 
                  src="/agriedge.png" 
                  alt="Logo AgriEdge" 
                  className="w-32 h-32 object-contain"
                />
              </div>
            </div>
            
            <h2 className="text-white text-center text-3xl font-bold mt-4 mb-2">AgriEdge</h2>
            <div className="w-16 h-1 bg-green-400 mx-auto mb-6"></div>
            <h3 className="text-green-100 text-center text-xl font-light mb-8">Inscription à l'Événement</h3>
            
            <div className="bg-black bg-opacity-30 rounded-lg p-4 backdrop-blur-sm border border-white border-opacity-10">
              <p className="text-green-200 text-center font-bold">Découvrir les dernières innovations en agriculture durable</p>
            </div>
          </div>
          
          <div className="mt-8 text-center relative z-10 border-t border-green-600 border-opacity-30 pt-4">
            <p className="text-green-200 text-sm mb-1">Des questions ? Contactez-nous :</p>
            <p className="text-white text-lg font-semibold">info@agriedge.com</p>
            <div className="flex justify-center mt-4 space-x-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/AgriEdgebu/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 cursor-pointer transition-all">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/agriedge/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 cursor-pointer transition-all">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/agriedge/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-10 flex items-center justify-center hover:bg-opacity-20 cursor-pointer transition-all">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </div>
              </a>
            </div>
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