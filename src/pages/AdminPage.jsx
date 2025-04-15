import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { CSVLink } from 'react-csv';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminPage() {
  const { currentUser, logout } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [userName, setUserName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const brandColors = {
    green: "#bcd630",
    darkGray: "#4d4d4d",
  };

  useEffect(() => {
    fetchRegistrations();
    fetchUserName();
  }, []);

  const fetchUserName = async () => {
    try {
      const userDoc = await getDocs(collection(db, 'users'));
      userDoc.forEach(doc => {
        if (doc.data().email === currentUser.email) {
          setUserName(doc.data().fullName);
        }
      });
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const registrationsRef = collection(db, 'registrations');
      const q = query(registrationsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const registrationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setRegistrations(registrationsData);
    } catch (error) {
      toast.error('Erreur lors de la récupération des enregistrements');
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
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

  const prepareCSVData = () => {
    return registrations.map(reg => ({
      'Nom Complet': reg.fullName,
      'Email': reg.email,
      'Entreprise': reg.company,
      'Poste': reg.position,
      'Téléphone': reg.phone,
      'Pays': reg.country,
      'Solutions d\'intérêt': reg.interests.join(', '),
      'Autre intérêt': reg.otherInterest || '',
      'Date d\'inscription': new Date(reg.timestamp).toLocaleString(),
      'Inscrit par': reg.teamMembre || 'N/A'
    }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Liste des inscriptions AgriEdge', 14, 15);

    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleString()}`, 14, 25);

    const tableColumn = [
      "Nom Complet",
      "Email",
      "Entreprise",
      "Pays",
      "Solutions d'intérêt",
      "Date d'inscription",
      "Inscrit par"
    ];
    
    const tableRows = registrations.map(reg => [
      reg.fullName,
      reg.email,
      reg.company,
      reg.country,
      [...reg.interests, reg.otherInterest].filter(Boolean).join(', '),
      new Date(reg.timestamp).toLocaleString(),
      reg.teamMembre || 'N/A'
    ]);
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [188, 214, 48],
        textColor: 0,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
    
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
    }
    
    doc.save('registrations.pdf');
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sortedData = [...registrations].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setRegistrations(sortedData);
  };

  const getFilteredRegistrations = () => {
    if (!searchTerm.trim()) return registrations;
    
    return registrations.filter(reg => {
      const searchLower = searchTerm.toLowerCase();
      return (
        reg.fullName?.toLowerCase().includes(searchLower) ||
        reg.email?.toLowerCase().includes(searchLower) ||
        reg.company?.toLowerCase().includes(searchLower) ||
        reg.country?.toLowerCase().includes(searchLower) ||
        reg.teamMembre?.toLowerCase().includes(searchLower)
      );
    });
  };

  const getCurrentItems = () => {
    const filtered = getFilteredRegistrations();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filtered.slice(indexOfFirstItem, indexOfLastItem);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
           style={{ 
             backgroundImage: "url('agriedged.png')", 
             backgroundSize: "cover" 
           }}>
        <div className="fixed top-0 left-0 h-screen w-full backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col items-center justify-center bg-white bg-opacity-70 p-8 rounded-xl shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: brandColors.green }}></div>
          <p className="mt-4 text-gray-700 font-medium">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat" 
         style={{ 
           backgroundImage: "url('agriedged.png')", 
           backgroundSize: "cover" 
         }}>
      <div className="fixed top-0 left-0 h-screen w-full backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-grow">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-br from-gray-900 to-green-900 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mr-4 ring-2 ring-white ring-opacity-30 overflow-hidden">
              <img 
                src="/agriedge.png" 
                alt="Logo AgriEdge" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Tableau de bord Admin</h1>
              <div className="w-16 h-1 bg-green-400 mt-2"></div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="bg-black bg-opacity-30 px-4 py-2 rounded-lg backdrop-blur-sm border border-white border-opacity-10">
              <span className="text-green-100">Connecté en tant que: {userName || currentUser.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-gray-900 font-medium transition duration-200 hover:shadow-md"
              style={{ backgroundColor: brandColors.green }}
            >
              Se déconnecter
            </button>
          </div>
        </div>

        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Liste des inscriptions
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={generatePDF}
                className="px-4 py-2 rounded-lg text-white transition duration-200 flex items-center bg-gray-700 hover:bg-gray-800"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </button>
              <CSVLink
                data={prepareCSVData()}
                filename="registrations.csv"
                className="px-4 py-2 rounded-lg text-gray-900 font-medium transition duration-200 flex items-center hover:shadow-md"
                style={{ backgroundColor: brandColors.green }}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV
              </CSVLink>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom, email, entreprise ou pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('fullName')}>
                    <div className="flex items-center">
                      Nom Complet
                      {sortConfig.key === 'fullName' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('email')}>
                    <div className="flex items-center">
                      Email
                      {sortConfig.key === 'email' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('company')}>
                    <div className="flex items-center">
                      Entreprise
                      {sortConfig.key === 'company' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('country')}>
                    <div className="flex items-center">
                      Pays
                      {sortConfig.key === 'country' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solutions d'intérêt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('timestamp')}>
                    <div className="flex items-center">
                      Date d'inscription
                      {sortConfig.key === 'timestamp' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                    Inscrit par
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentItems().length > 0 ? (
                  getCurrentItems().map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.country}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex flex-wrap gap-1">
                          {registration.interests && registration.interests.map((interest, index) => (
                            <span key={index} className="px-2 py-1 text-xs rounded-full" 
                                  style={{ backgroundColor: 'rgba(188, 214, 48, 0.2)', color: brandColors.darkGray }}>
                              {interest}
                            </span>
                          ))}
                          {registration.otherInterest && (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {registration.otherInterest}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(registration.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {registration.teamMembre || 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      Aucun résultat trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {getFilteredRegistrations().length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(getFilteredRegistrations().length / itemsPerPage)}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, getFilteredRegistrations().length)}
                      </span>{' '}
                      sur <span className="font-medium">{getFilteredRegistrations().length}</span> résultats
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Précédent</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {Array.from({ length: Math.ceil(getFilteredRegistrations().length / itemsPerPage) }, (_, i) => i + 1).map((number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === number
                              ? 'z-10 border-green-500 text-green-600 bg-green-50'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                          style={{ 
                            borderColor: currentPage === number ? brandColors.green : '',
                            color: currentPage === number ? brandColors.darkGray : ''
                          }}
                        >
                          {number}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === Math.ceil(getFilteredRegistrations().length / itemsPerPage)}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Suivant</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600">
              © 2025 AgriEdge SA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}