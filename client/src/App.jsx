import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    marital_status: '',
    education_level: '',
    annual_income: '',
    savings: '',
    health_rating: '',
    chronic_conditions: '',
    adl_assistance: '',
    living_arrangement: '',
    retirement_plan: '',
    family_history: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [viewingResponses, setViewingResponses] = useState(false);
  const [allResponses, setAllResponses] = useState([]);
  const [loadingResponses, setLoadingResponses] = useState(false);

  const fetchAllResponses = async () => {
    setLoadingResponses(true);
    try {
      const response = await axios.get(`${API_URL}/responses`);
      setAllResponses(response.data);
      setLoadingResponses(false);
    } catch (err) {
      console.error('Failed to fetch responses:', err);
      setLoadingResponses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.age.trim()) return 'Age is required';
    if (isNaN(Number(formData.age))) return 'Age must be a number';
    if (!formData.gender) return 'Gender is required';
    if (!formData.annual_income.trim()) return 'Annual income is required';
    if (!formData.health_rating) return 'Health self-assessment is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    
    if (validationError) {
      setError(validationError);
      return;
    }

    const dataToSubmit = {
      ...formData,
      age: parseInt(formData.age),
      annual_income: formData.annual_income,
      savings: formData.savings
    };

    try {
      const response = await axios.post(`${API_URL}/responses`, dataToSubmit);
      setResponse(response.data);
      setSubmittedData(dataToSubmit);
      setSubmitted(true);
      setError('');
      // Refresh the list of responses
      fetchAllResponses();
    } catch (err) {
      setError('Failed to submit survey. Please try again.');
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      age: '',
      gender: '',
      marital_status: '',
      education_level: '',
      annual_income: '',
      savings: '',
      health_rating: '',
      chronic_conditions: '',
      adl_assistance: '',
      living_arrangement: '',
      retirement_plan: '',
      family_history: ''
    });
  };

  if (viewingResponses) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center">
        <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">All Survey Responses</h2>
                <button 
                  onClick={() => setViewingResponses(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Back to Form
                </button>
              </div>
              
              {loadingResponses ? (
                <div className="text-center py-4">Loading responses...</div>
              ) : (
                <div className="space-y-6">
                  {allResponses.length === 0 ? (
                    <div className="text-center py-4">No responses found.</div>
                  ) : (
                    allResponses.map((response, index) => (
                      <div key={response.id || index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <span className="font-medium">Name:</span> {response.name}
                          </div>
                          <div>
                            <span className="font-medium">Age:</span> {response.age}
                          </div>
                          <div>
                            <span className="font-medium">Gender:</span> {response.gender}
                          </div>
                          <div>
                            <span className="font-medium">Marital Status:</span> {response.marital_status}
                          </div>
                          <div>
                            <span className="font-medium">Education Level:</span> {response.education_level}
                          </div>
                          <div>
                            <span className="font-medium">Annual Income:</span> ${response.annual_income}
                          </div>
                          <div>
                            <span className="font-medium">Savings:</span> ${response.savings}
                          </div>
                          <div>
                            <span className="font-medium">Health Self-Rating:</span> {response.health_rating}
                          </div>
                          <div>
                            <span className="font-medium">Chronic Conditions:</span> {response.chronic_conditions}
                          </div>
                          <div>
                            <span className="font-medium">ADL Assistance:</span> {response.adl_assistance}
                          </div>
                          <div>
                            <span className="font-medium">Living Arrangement:</span> {response.living_arrangement}
                          </div>
                          <div>
                            <span className="font-medium">Retirement Plan:</span> {response.retirement_plan}
                          </div>
                          <div>
                            <span className="font-medium">Family History:</span> {response.family_history}
                          </div>
                          {response.created_at && (
                            <div className="text-sm text-gray-500 md:col-span-2">
                              Submitted: {new Date(response.created_at).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              
              <button 
                onClick={() => setViewingResponses(false)}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Survey
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted && submittedData) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center">
        <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="max-w-3xl mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h2 className="text-2xl font-bold mb-4">Thank you for your submission!</h2>
                  <p className="mb-4">Your response has been recorded successfully. This information will help our machine learning model predict your long-term care needs and associated costs.</p>
                  
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3">Your Submission:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <span className="font-medium">Name:</span> {submittedData.name}
                        </div>
                        <div>
                          <span className="font-medium">Age:</span> {submittedData.age}
                        </div>
                        <div>
                          <span className="font-medium">Gender:</span> {submittedData.gender}
                        </div>
                        <div>
                          <span className="font-medium">Marital Status:</span> {submittedData.marital_status}
                        </div>
                        <div>
                          <span className="font-medium">Education Level:</span> {submittedData.education_level}
                        </div>
                        <div>
                          <span className="font-medium">Annual Income:</span> ${submittedData.annual_income}
                        </div>
                        <div>
                          <span className="font-medium">Savings:</span> ${submittedData.savings}
                        </div>
                        <div>
                          <span className="font-medium">Health Self-Rating:</span> {submittedData.health_rating}
                        </div>
                        <div>
                          <span className="font-medium">Chronic Conditions:</span> {submittedData.chronic_conditions}
                        </div>
                        <div>
                          <span className="font-medium">ADL Assistance:</span> {submittedData.adl_assistance}
                        </div>
                        <div>
                          <span className="font-medium">Living Arrangement:</span> {submittedData.living_arrangement}
                        </div>
                        <div>
                          <span className="font-medium">Retirement Plan:</span> {submittedData.retirement_plan}
                        </div>
                        <div>
                          <span className="font-medium">Family History:</span> {submittedData.family_history}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 mt-6">
                    <button 
                      onClick={resetForm}
                      className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Submit Another Response
                    </button>
                    <button 
                      onClick={() => {
                        fetchAllResponses();
                        setViewingResponses(true);
                      }}
                      className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View All Responses
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center">
      <div className="relative py-3 sm:max-w-4xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Survey Application - Feedback Form</h1>
              <button 
                onClick={() => {
                  fetchAllResponses();
                  setViewingResponses(true);
                }}
                className="text-sm text-white px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700"
              >
                View Previous Responses
              </button>
            </div>
            
            <p className="mt-2 text-gray-600">Please provide the following information to help our machine learning model predict your long-term care needs and associated costs.</p>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Demographic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                    <select
                      name="marital_status"
                      value={formData.marital_status}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Separated">Separated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Education Level</label>
                    <select
                      name="education_level"
                      value={formData.education_level}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select education</option>
                      <option value="Less than high school">Less than high school</option>
                      <option value="High school">High school</option>
                      <option value="Some college">Some college</option>
                      <option value="Associate degree">Associate degree</option>
                      <option value="Bachelor's degree">Bachelor's degree</option>
                      <option value="Graduate degree">Graduate degree</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Living Arrangement</label>
                    <select
                      name="living_arrangement"
                      value={formData.living_arrangement}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select arrangement</option>
                      <option value="Live alone">Live alone</option>
                      <option value="Live with spouse/partner">Live with spouse/partner</option>
                      <option value="Live with family">Live with family</option>
                      <option value="Assisted living">Assisted living</option>
                      <option value="Nursing home">Nursing home</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Annual Income ($)</label>
                    <input
                      type="text"
                      name="annual_income"
                      value={formData.annual_income}
                      onChange={handleChange}
                      placeholder="e.g., 75000"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Savings ($)</label>
                    <input
                      type="text"
                      name="savings"
                      value={formData.savings}
                      onChange={handleChange}
                      placeholder="e.g., 250000"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Retirement Plan</label>
                    <select
                      name="retirement_plan"
                      value={formData.retirement_plan}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select plan</option>
                      <option value="401(k)">401(k)</option>
                      <option value="IRA">IRA</option>
                      <option value="Pension">Pension</option>
                      <option value="Multiple retirement accounts">Multiple retirement accounts</option>
                      <option value="No retirement savings">No retirement savings</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Health Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Health Self-Rating</label>
                    <select
                      name="health_rating"
                      value={formData.health_rating}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select rating</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Very Good">Very Good</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Chronic Conditions</label>
                    <select
                      name="chronic_conditions"
                      value={formData.chronic_conditions}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select option</option>
                      <option value="None">None</option>
                      <option value="1 condition">1 condition</option>
                      <option value="2 conditions">2 conditions</option>
                      <option value="3+ conditions">3+ conditions</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Need Assistance with Daily Activities</label>
                    <select
                      name="adl_assistance"
                      value={formData.adl_assistance}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select option</option>
                      <option value="No assistance needed">No assistance needed</option>
                      <option value="Minimal assistance">Minimal assistance</option>
                      <option value="Moderate assistance">Moderate assistance</option>
                      <option value="Significant assistance">Significant assistance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Family History of Long-Term Care Needs</label>
                    <select
                      name="family_history"
                      value={formData.family_history}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select option</option>
                      <option value="No history">No history</option>
                      <option value="Parents needed care">Parents needed care</option>
                      <option value="Grandparents needed care">Grandparents needed care</option>
                      <option value="Multiple family members needed care">Multiple family members needed care</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Assessment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 