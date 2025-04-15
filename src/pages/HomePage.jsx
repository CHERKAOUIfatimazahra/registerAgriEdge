import { useState, useEffect } from "react";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

export default function RegistrationForm() {
  const { currentUser, login, register, logout } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    position: "",
    phone: "",
    country: "",
    interests: [],
    otherInterest: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtherField, setShowOtherField] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
      toast.success('Connexion réussie!');
    } catch (error) {
      toast.error('Email ou mot de passe incorrect');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      await register(registerData.email, registerData.password);
      toast.success('Inscription réussie!');
      setShowRegister(false);
    } catch (error) {
      toast.error('Erreur lors de l\'inscription: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie!');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
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
      const registrationsRef = collection(db, 'registrations');
      
      if (!formData.fullName || !formData.email || !formData.company || !formData.phone || !formData.country) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      const submissionData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        position: formData.position.trim(),
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        interests: formData.interests || [],
        userId: currentUser.uid,
        timestamp: new Date().toISOString()
      };

      if (showOtherField && formData.otherInterest) {
        submissionData.otherInterest = formData.otherInterest.trim();
      }
      
      await addDoc(registrationsRef, submissionData);

      toast.success('Inscription réussie!');
      
      setFormData({
        fullName: "",
        email: "",
        company: "",
        position: "",
        phone: "",
        country: "",
        interests: [],
        otherInterest: "",
      });
      setShowOtherField(false);
    } catch (error) {
      toast.error(`Échec de l'inscription vérifiez votre connexion internet et réessayez`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateToAdmin = () => {
    window.location.href = '/admin';
  };

  const brandColors = {
    green: "#bcd630",
    darkGray: "#4d4d4d",
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" 
          style={{ 
            backgroundImage: "url('agriedged.png')", 
            backgroundSize: "cover",
          }}>
            <div className="fixed top-0 left-0 h-screen w-full backdrop-blur-sm"></div>
        <div className="w-full max-w-md mx-4 my-6 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-green-900 p-6">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center ring-2 ring-white ring-opacity-30 overflow-hidden">
                <img 
                  src="/agriedge.png" 
                  alt="Logo AgriEdge" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <h2 className="text-white text-center text-2xl font-bold mb-2">AgriEdge</h2>
            <div className="w-16 h-1 bg-green-400 mx-auto mb-6"></div>
          </div>
          
          <div className="bg-white bg-opacity-90 p-6">
            {!showRegister ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    required
                    placeholder="Entrez votre email"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe:
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    required
                    placeholder="Entrez votre mot de passe"
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-gray-900 transition duration-200"
                    style={{ backgroundColor: brandColors.green }}
                  >
                    Se connecter
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowRegister(true)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Créer un compte
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    required
                    placeholder="Entrez votre email"
                  />
                </div>
                
                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe:
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    required
                    placeholder="Entrez votre mot de passe"
                  />
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe:
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    required
                    placeholder="Confirmez votre mot de passe"
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-gray-900 transition duration-200"
                    style={{ backgroundColor: brandColors.green }}
                  >
                    S'inscrire
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowRegister(false)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Retour à la connexion
                  </button>
                </div>
              </form>
            )}
            
            <p className="mt-3 text-center text-xs text-gray-600">
              © 2025 AgriEdge SA.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" 
         style={{ 
           backgroundImage: "url('agriedged.png')", 
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
              <div className="w-40 h-40 bg-white bg-opacity-10 rounded-full flex items-center justify-center ring-2 ring-white ring-opacity-30 overflow-hidden">
                <img 
                  src="/agriedge.png" 
                  alt="Logo AgriEdge" 
                  className="w-full h-full object-contain"
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
            <p className="text-green-200 text-sm mb-1">Utilisateur connecté :</p>
            <p className="text-white text-lg font-semibold">{currentUser.email}</p>
            <div className="flex flex-col space-y-2 mt-2">
              <button 
                onClick={handleLogout}
                className="text-sm text-red-300 hover:text-red-200 transition"
              >
                Se déconnecter
              </button>
              <button 
                onClick={navigateToAdmin}
                className="text-sm bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md transition"
              >
                Accéder au Dashboard Admin
              </button>
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