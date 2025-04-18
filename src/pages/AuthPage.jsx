import { useState, useEffect } from "react";
import { auth, db } from '../firebaseConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { getFirestore, collection, getDocs, query, where, doc, setDoc, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';

export default function AuthPage() {
  const { login, register, currentUser } = useAuth();
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
      toast.success('Connexion réussie!');
      navigate('/');
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
    if (!registerData.fullName?.trim()) {
      toast.error('Le nom complet est requis');
      return;
    }

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

      const userCredential = await register(registerData.email, registerData.password);

      await updateProfile(userCredential.user, {
        displayName: registerData.fullName
      });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName: registerData.fullName.trim(),
        email: registerData.email.toLowerCase(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await addDoc(collection(db, 'registrations'), {
        fullName: registerData.fullName.trim(),
        email: registerData.email.toLowerCase(),
        createdAt: new Date(),
        creatorEmail: registerData.email.toLowerCase(),
        status: 'pending'
      });

      toast.success('Inscription réussie!');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Cet email est déjà utilisé pour un compte');
      } else {
        toast.error('Erreur lors de l\'inscription: ' + error.message);
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

  const brandColors = {
    green: "#bcd630",
    darkGray: "#4d4d4d",
  };

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
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet:
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={registerData.fullName}
                  onChange={handleRegisterChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                  required
                  placeholder="Entrez votre nom complet"
                />
              </div>

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