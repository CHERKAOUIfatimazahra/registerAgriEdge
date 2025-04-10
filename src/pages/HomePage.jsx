import { useState } from "react";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    position: "",
    phone: "",
    country: "",
    interests: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Registration successful!");
    setFormData({
      fullName: "",
      email: "",
      company: "",
      position: "",
      phone: "",
      country: "",
      interests: []
    });
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
      <div className="w-full max-w-6xl mx-4 my-8 flex flex-col md:flex-row rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
        {/* Left Side - Logo and Event Info */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-gray-800 to-gray-900 p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,0 L800,0 L400,600 Z" fill={brandColors.green} />
              <path d="M0,800 L800,800 L600,200 Z" fill={brandColors.green} />
              <path d="M0,0 L0,800 L300,400 Z" fill={brandColors.green} />
              <path d="M800,0 L800,800 L500,400 Z" fill={brandColors.green} />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="w-60">
                <svg viewBox="0 0 300 100" className="w-full">
                  <g>
                    {/* Network nodes */}
                    <circle cx="30" cy="30" r="8" fill={brandColors.green} />
                    <circle cx="15" cy="50" r="3" fill={brandColors.green} />
                    <circle cx="40" cy="55" r="5" fill={brandColors.green} />
                    
                    {/* Text */}
                    <text x="65" y="50" fontFamily="Arial" fontWeight="bold" fontSize="34" fill={brandColors.green}>Agri</text>
                    <text x="140" y="50" fontFamily="Arial" fontWeight="bold" fontSize="34" fill={brandColors.darkGray}>Edge</text>
                  </g>
                </svg>
              </div>
            </div>
            
            <h2 className="text-white text-center text-3xl font-bold mt-8">AgriEdge</h2>
            <h3 className="text-gray-300 text-center text-xl font-light mb-8">Event Registration</h3>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 mt-6 border border-gray-700 backdrop-blur-sm">
              <h4 className="text-white text-lg font-semibold mb-4">Event Details</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-gray-700 bg-opacity-50 rounded-full p-2 mr-3" style={{ color: brandColors.green }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-200">April 15-17, 2025</p>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-gray-700 bg-opacity-50 rounded-full p-2 mr-3" style={{ color: brandColors.green }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-200">Casablanca Exhibition Center</p>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-gray-700 bg-opacity-50 rounded-full p-2 mr-3" style={{ color: brandColors.green }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <p className="text-gray-200">Discover the future of AgriTech</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center relative z-10 border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm mb-1">Questions? Contact us at:</p>
            <p className="text-white text-base font-semibold">info@agriedge.com</p>
          </div>
        </div>
        
        {/* Right Side - Registration Form */}
        <div className="w-full md:w-3/5 bg-white bg-opacity-75 backdrop-blur-md p-8">
          <div className="bg-white bg-opacity-90 rounded-xl p-8 shadow-lg">
            <h2 className="text-gray-800 text-2xl font-bold mb-6 border-b border-gray-200 pb-4">Register Now</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    style={{ focusRing: brandColors.green }}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company/Organization *</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Enter your company name"
                  />
                </div>
                
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position/Title</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Enter your position"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Enter your country"
                  />
                </div>
              </div>
              
              <div className="mt-4 mb-8">
                <p className="text-sm font-medium text-gray-700 mb-3">Areas of Interest</p>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-x-6 gap-y-3 border border-gray-200">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="precision-agriculture"
                      name="interests"
                      value="Precision Agriculture"
                      checked={formData.interests.includes("Precision Agriculture")}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 focus:ring-green-500 border-gray-300 rounded"
                      style={{ color: brandColors.green }}
                    />
                    <label htmlFor="precision-agriculture" className="ml-2 block text-sm text-gray-700">Precision Agriculture</label>
                  </div>
                
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="farm-management"
                      name="interests"
                      value="Farm Management Software"
                      checked={formData.interests.includes("Farm Management Software")}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 focus:ring-green-500 border-gray-300 rounded"
                      style={{ color: brandColors.green }}
                    />
                    <label htmlFor="farm-management" className="ml-2 block text-sm text-gray-700">Farm Management Software</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="iot-sensors"
                      name="interests"
                      value="IoT Sensors & Monitoring"
                      checked={formData.interests.includes("IoT Sensors & Monitoring")}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 focus:ring-green-500 border-gray-300 rounded"
                      style={{ color: brandColors.green }}
                    />
                    <label htmlFor="iot-sensors" className="ml-2 block text-sm text-gray-700">IoT Sensors & Monitoring</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="ai-ml"
                      name="interests"
                      value="AI & Machine Learning"
                      checked={formData.interests.includes("AI & Machine Learning")}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 focus:ring-green-500 border-gray-300 rounded"
                      style={{ color: brandColors.green }}
                    />
                    <label htmlFor="ai-ml" className="ml-2 block text-sm text-gray-700">AI & Machine Learning</label>
                  </div>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-gray-900 transition duration-200"
                  style={{ backgroundColor: brandColors.green }}
                >
                  Complete Registration
                </button>
              </div>
              
              <p className="mt-4 text-center text-xs text-gray-600">
              © 2025 AgriEdge SA.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}