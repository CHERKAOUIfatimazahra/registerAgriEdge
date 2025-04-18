import { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Le nom complet est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .matches(
      /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/,
      'Le nom ne doit contenir que des lettres'
    ),
  email: Yup.string()
    .required('L\'email est requis')
    .email('Format d\'email invalide')
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      'Format d\'email invalide'
    ),
  company: Yup.string()
    .required('L\'entreprise est requise')
    .min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères')
    .matches(
      /^[a-zA-Z0-9À-ÖØ-öø-ÿ\s'&._-]+$/,
      'Le nom de l\'entreprise contient des caractères non autorisés'
    ),
  position: Yup.string()
    .matches(
      /^[a-zA-Z0-9À-ÖØ-öø-ÿ\s'&._-]+$/,
      'Le poste contient des caractères non autorisés'
    ),
  phone: Yup.string()
    .required('Le numéro de téléphone est requis')
    .min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres'),
  country: Yup.string()
    .required('Le pays est requis')
    .matches(
      /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/,
      'Le pays ne doit contenir que des lettres'
    ),
  interests: Yup.array()
    .min(1, 'Sélectionnez au moins une solution d\'intérêt'),
  otherInterest: Yup.string()
    .when('interests', {
      is: (interests) => Array.isArray(interests) && interests.includes('other'),
      then: () => Yup.string()
        .required('Veuillez préciser votre autre intérêt')
        .matches(
          /^[a-zA-Z0-9À-ÖØ-öø-ÿ\s'&._-]+$/,
          'L\'intérêt contient des caractères non autorisés'
        ),
      otherwise: () => Yup.string()
    })
});

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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
      toast.success('Connexion réussie!');
    } catch (error) {
      toast.error('Email ou mot de passe incorrect');
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const registrationsRef = collection(db, 'registrations');
      const q = query(registrationsRef, where('email', '==', email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const emailExists = await checkEmailExists(registerData.email);
      if (emailExists) {
        toast.error('Cet email est déjà inscrit à l\'événement');
        return;
      }

      await register(registerData.email, registerData.password);
      toast.success('Inscription réussie!');
      setShowRegister(false);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Cet email est déjà utilisé pour un compte');
      } else {
        toast.error('Erreur lors de l\'inscription: ' + error.message);
      }
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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    if (touched[name]) {
      try {
        await validationSchema.validateAt(name, newFormData);
        setErrors({ ...errors, [name]: undefined });
      } catch (error) {
        setErrors({ ...errors, [name]: error.message });
      }
    }
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

      if (checked) {
        setFormData({
          ...formData,
          interests: [...formData.interests, value]
        });
      } else {
        setFormData({
          ...formData,
          interests: formData.interests.filter(interest => interest !== value),
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

  const handlePhoneChange = (value, country) => {
    setFormData({ ...formData, phone: value, country: country.name });
    setTouched({ ...touched, phone: true, country: true });
    
    try {
      validationSchema.validateAt('phone', { phone: value });
      setErrors({ ...errors, phone: undefined });
    } catch (error) {
      setErrors({ ...errors, phone: error.message });
    }
  };

  const handleBlur = async (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    try {
      await validationSchema.validateAt(name, formData);
      setErrors({ ...errors, [name]: undefined });
    } catch (error) {
      setErrors({ ...errors, [name]: error.message });
    }
  };

  const handleEmailChange = async (e) => {
    const { value } = e.target;
    setFormData({ ...formData, email: value });

    if (touched.email) {
      try {
        await validationSchema.validateAt('email', { email: value });
        
        if (value) {
          const emailExists = await checkEmailExists(value);
          if (emailExists) {
            setErrors({
              ...errors,
              email: 'Cet email est déjà inscrit à l\'événement'
            });
          } else {
            setErrors({
              ...errors,
              email: undefined
            });
          }
        }
      } catch (error) {
        setErrors({
          ...errors,
          email: error.message
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        toast.error('Cet email est déjà inscrit à l\'événement');
        setErrors({
          ...errors,
          email: 'Cet email est déjà inscrit à l\'événement'
        });
        setTouched({
          ...touched,
          email: true
        });
        return;
      }

      const sanitizedData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        company: formData.company.trim(),
        position: formData.position.trim(),
        phone: formData.phone.trim(),
        country: formData.country.trim(),
        interests: formData.interests.map(i => i.trim()),
        creatorEmail: currentUser.email,
        timestamp: new Date().toISOString()
      };

      if (showOtherField && formData.otherInterest) {
        sanitizedData.otherInterest = formData.otherInterest.trim();
      }

      const registrationsRef = collection(db, 'registrations');
      await addDoc(registrationsRef, sanitizedData);

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
      setTouched({});
      setErrors({});
      
      toast.success('Inscription réussie!');
    } catch (error) {
      if (error.inner) {
        const validationErrors = {};
        error.inner.forEach(err => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
        toast.error('Veuillez corriger les erreurs dans le formulaire');
      } else {
        toast.error('Erreur lors de l\'inscription. Veuillez réessayer.');
        console.error('Submission error:', error);
      }
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
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" 
          style={{ 
            backgroundImage: "url('agriedged.png')", 
            backgroundSize: "cover",
          }}>
            <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
            
            <div className="relative z-10 w-full max-w-md mx-4 my-6 rounded-xl shadow-2xl overflow-hidden">
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
              
              <div className="bg-white p-6">
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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" 
         style={{ 
           backgroundImage: "url('agriedged.png')", 
           backgroundSize: "cover" 
         }}>
      <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-5xl mx-4 my-6 flex flex-col md:flex-row rounded-xl shadow-2xl overflow-hidden">
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
        <div className="w-full md:w-3/5 bg-white p-6 flex flex-col max-h-screen overflow-y-auto">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg flex-grow">
            <h2 className="text-gray-800 text-xl font-bold mb-4 border-b border-gray-200 pb-3">Inscrivez-vous Maintenant</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom Complet *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                      errors.fullName && touched.fullName ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm`}
                    placeholder="Entrez votre nom complet"
                  />
                  {errors.fullName && touched.fullName && (
                    <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleEmailChange}
                    onBlur={handleBlur}
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                      errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm`}
                    placeholder="Entrez votre email"
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Entreprise/Organisation *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                      errors.company && touched.company ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm`}
                    placeholder="Entrez le nom de votre entreprise"
                  />
                  {errors.company && touched.company && (
                    <p className="mt-1 text-xs text-red-500">{errors.company}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Poste/Titre
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                      errors.position && touched.position ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm`}
                    placeholder="Entrez votre poste"
                  />
                  {errors.position && touched.position && (
                    <p className="mt-1 text-xs text-red-500">{errors.position}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de Téléphone *
                  </label>
                  <PhoneInput
                    country={'ma'}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    inputProps={{
                      name: 'phone',
                      required: true,
                      className: `appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                        errors.phone && touched.phone ? 'border-red-500' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm`
                    }}
                    containerClass="phone-input"
                    buttonClass={errors.phone && touched.phone ? 'phone-input-error' : ''}
                  />
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Pays *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                      errors.country && touched.country ? 'border-red-500' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm`}
                    placeholder="Entrez votre pays"
                  />
                  {errors.country && touched.country && (
                    <p className="mt-1 text-xs text-red-500">{errors.country}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-3">
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

                    <div className="flex items-center mb-2 sm:mb-0">
                      <input
                        type="checkbox"
                        id="other"
                        name="interests"
                        value="other"
                        checked={formData.interests.includes("other")}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 focus:ring-green-500 border-gray-300 rounded"
                        style={{ color: brandColors.green }}
                      />
                      <label htmlFor="other" className="ml-2 block text-sm text-gray-700">Autre</label>
                    </div>
                  </div>
                  
                  {showOtherField && (
                    <div className="mt-3">
                      <input
                        type="text"
                        id="otherInterest"
                        name="otherInterest"
                        value={formData.otherInterest}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`appearance-none rounded-lg relative block w-full px-3 py-2 border ${
                          errors.otherInterest && touched.otherInterest ? 'border-red-500' : 'border-gray-300'
                        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm`}
                        placeholder="Précisez votre intérêt"
                      />
                      {errors.otherInterest && touched.otherInterest && (
                        <p className="mt-1 text-xs text-red-500">{errors.otherInterest}</p>
                      )}
                    </div>
                  )}
                  
                  {errors.interests && touched.interests && (
                    <p className="mt-1 text-xs text-red-500">{errors.interests}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-gray-900 transition duration-200"
                  style={{ backgroundColor: brandColors.green }}
                >
                  {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire à l\'Événement'}
                </button>
              </div>
            </form>
            
            <p className="mt-6 text-center text-xs text-gray-600">
              © 2025 AgriEdge SA. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}