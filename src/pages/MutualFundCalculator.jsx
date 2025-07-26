import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CallToAction from '../components/CallToAction';
import JoinCommunity from '../components/JoinCommunity';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Helmet } from 'react-helmet';


const SIPLumpsumCalculator = () => {

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Real Estate', href: '/real-estate' },
    { title: 'Insurance', href: '/insurance' },
    { title: 'Mutual Fund', href: '/mutual-fund' },
  ];
  
  const [sipData, setSipData] = useState({
    monthlyAmount: 5000,
    timePeriod: 10,
    expectedReturn: 12
  });
  const [lumpsumData, setLumpsumData] = useState({
    investmentAmount: 100000,
    timePeriod: 10,
    expectedReturn: 12
  });

 
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');

  const [activeTab, setActiveTab] = useState(type);

  const calculateSIP = () => {
    const monthlyAmount = sipData.monthlyAmount;
    const months = sipData.timePeriod * 12;
    const monthlyRate = sipData.expectedReturn / 12 / 100;
    
    const futureValue = monthlyAmount * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvestment = monthlyAmount * months;
    const returns = futureValue - totalInvestment;
    
    return {
      totalInvestment: Math.round(totalInvestment),
      returns: Math.round(returns),
      futureValue: Math.round(futureValue)
    };
  };

  const calculateLumpsum = () => {
    const principal = lumpsumData.investmentAmount;
    const rate = lumpsumData.expectedReturn / 100;
    const time = lumpsumData.timePeriod;
    
    const futureValue = principal * Math.pow((1 + rate), time);
    const returns = futureValue - principal;
    
    return {
      totalInvestment: principal,
      returns: Math.round(returns),
      futureValue: Math.round(futureValue)
    };
  };

  const sipResults = calculateSIP();
  const lumpsumResults = calculateLumpsum();
  const currentResults = activeTab === 'sip' ? sipResults : lumpsumResults;

  const chartData = [
    {
      name: 'Investment',
      value: currentResults.totalInvestment,
      color: '#8B5CF6'
    },
    {
      name: 'Returns',
      value: currentResults.returns,
      color: '#10B981'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (<>
  <Helmet>
  <title>Mutual Fund Calculator | MyInvestoryy</title>
  <meta name="description" content="Calculate SIP returns, lumpsum investments, and mutual fund projections with our free calculator. Plan your wealth creation journey with MyInvestoryy." />
  <meta property="og:title" content="Mutual Fund Calculator | MyInvestoryy" />
  <meta property="og:description" content="Calculate SIP returns, lumpsum investments, and mutual fund projections with our free calculator. Plan your wealth creation journey with MyInvestoryy." />
  <meta property="og:image" content="/og-image.png" />
  <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Mutual Fund Calculator | MyInvestoryy" />
  <meta name="twitter:description" content="Calculate SIP returns, lumpsum investments, and mutual fund projections with our free calculator. Plan your wealth creation journey with MyInvestoryy." />
  <meta name="twitter:image" content="/og-image.png" />
</Helmet>
  <Navbar links={navLinks} />

    <div className="min-h-screen bg-black p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-zinc-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600/90 via-emerald-900 to-emerald-600/90 text-white p-6 sm:p-8 md:p-12 text-center relative overflow-hidden">
          {/* Animated background patterns */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#00000055_1px,transparent_1px)] bg-[length:32px_32px]"></div>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-5xl jaini-regular sm:text-6xl font-extrabold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-white">
              Investment Calculator
            </h1>
            <p className="text-lg sm:text-2xl text-emerald-100/90 font-medium">
              Plan your financial future with our Smart SIP & Lumpsum Calculator
            </p>
            
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-0 w-24 h-24 -translate-y-1/2 -translate-x-1/2 animate-spin-slow">
              <div className="w-full h-full rounded-full border-4 border-emerald-400/20"></div>
              <div className="absolute inset-2 rounded-full border-4 border-emerald-400/20"></div>
              <div className="absolute inset-4 rounded-full border-4 border-emerald-400/20"></div>
            </div>
            <div className="absolute top-1/2 right-0 w-24 h-24 -translate-y-1/2 translate-x-1/2 animate-spin-slow" style={{ animationDirection: 'reverse' }}>
              <div className="w-full h-full rounded-full border-4 border-emerald-400/20"></div>
              <div className="absolute inset-2 rounded-full border-4 border-emerald-400/20"></div>
              <div className="absolute inset-4 rounded-full border-4 border-emerald-400/20"></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center bg-zinc-950/50 backdrop-blur-sm border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('sip')}
            className={`px-6 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-bold transition-all duration-300 relative hover:bg-emerald-500/5 ${
              activeTab === 'sip'
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-zinc-400 hover:text-emerald-400'
            }`}
          >
            <span className="relative z-10">SIP Calculator</span>
            {activeTab === 'sip' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('lumpsum')}
            className={`px-6 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-bold transition-all duration-300 relative hover:bg-emerald-500/5 ${
              activeTab === 'lumpsum'
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-zinc-400 hover:text-emerald-400'
            }`}
          >
            <span className="relative z-10">Lumpsum Calculator</span>
            {activeTab === 'lumpsum' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col xl:flex-row min-h-[700px]">
          {/* Form Section */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 bg-zinc-900/50 backdrop-blur-sm">
            {activeTab === 'sip' ? (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center space-x-4 mb-6 sm:mb-8">
                  <div className="w-2 sm:w-3 h-6 sm:h-8 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full"></div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">SIP Calculator</h2>
                </div>
                
                {/* Monthly Investment */}
                <div className="space-y-4 bg-zinc-800/50 p-4 sm:p-6 rounded-2xl border border-zinc-700/50 hover:border-emerald-500/30 transition-all duration-300">
                  <label className="block text-lg font-semibold text-zinc-300">
                    Monthly Investment Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 text-lg font-medium">₹</span>
                    <input
                      type="number"
                      value={sipData.monthlyAmount}
                      onChange={(e) => setSipData({...sipData, monthlyAmount: Number(e.target.value)})}
                      className="w-full pl-10 pr-6 py-4 border border-zinc-700 rounded-2xl focus:border-emerald-500 focus:outline-none transition-all bg-zinc-900/50 focus:bg-zinc-900/80 text-xl font-semibold text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Enter amount"
                    />
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="100000"
                    step="500"
                    value={sipData.monthlyAmount}
                    onChange={(e) => setSipData({...sipData, monthlyAmount: Number(e.target.value)})}
                    className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-zinc-500 font-medium">
                    <span>₹500</span>
                    <span className="text-emerald-400 font-semibold">{formatCurrency(sipData.monthlyAmount)}</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>

                {/* Time Period */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-zinc-300">
                    Investment Period
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={sipData.timePeriod}
                      onChange={(e) => setSipData({...sipData, timePeriod: Number(e.target.value)})}
                      className="w-full px-6 py-4 border border-zinc-700 rounded-2xl focus:border-emerald-500 focus:outline-none transition-all bg-zinc-800 focus:bg-zinc-750 text-xl font-semibold text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Years"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 text-lg font-medium">Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={sipData.timePeriod}
                    onChange={(e) => setSipData({...sipData, timePeriod: Number(e.target.value)})}
                    className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-zinc-500 font-medium">
                    <span>1 Year</span>
                    <span className="text-emerald-400 font-semibold">{sipData.timePeriod} Years</span>
                    <span>40 Years</span>
                  </div>
                </div>

                {/* Expected Return */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-zinc-300">
                    Expected Annual Return
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={sipData.expectedReturn}
                      onChange={(e) => setSipData({...sipData, expectedReturn: Number(e.target.value)})}
                      className="w-full px-6 py-4 border border-zinc-700 rounded-2xl focus:border-emerald-500 focus:outline-none transition-all bg-zinc-800 focus:bg-zinc-750 text-xl font-semibold text-white placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Return %"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 text-lg font-medium">%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={sipData.expectedReturn}
                    onChange={(e) => setSipData({...sipData, expectedReturn: Number(e.target.value)})}
                    className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-zinc-500 font-medium">
                    <span>1%</span>
                    <span className="text-emerald-400 font-semibold">{sipData.expectedReturn}%</span>
                    <span>30%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center space-x-4 mb-6 sm:mb-8">
                  <div className="w-2 sm:w-3 h-6 sm:h-8 bg-gradient-to-b from-purple-400 to-violet-500 rounded-full"></div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Lumpsum Calculator</h2>
                </div>
                
                {/* Investment Amount */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-zinc-300">
                    One-time Investment Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 text-lg font-medium">₹</span>
                    <input
                      type="number"
                      value={lumpsumData.investmentAmount}
                      onChange={(e) => setLumpsumData({...lumpsumData, investmentAmount: Number(e.target.value)})}
                      className="w-full pl-10 pr-6 py-4 border border-zinc-700 rounded-2xl focus:border-purple-500 focus:outline-none transition-all bg-zinc-800 focus:bg-zinc-750 text-xl font-semibold text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="Enter amount"
                    />
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={lumpsumData.investmentAmount}
                    onChange={(e) => setLumpsumData({...lumpsumData, investmentAmount: Number(e.target.value)})}
                    className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-purple"
                  />
                  <div className="flex justify-between text-sm text-zinc-500 font-medium">
                    <span>₹10,000</span>
                    <span className="text-purple-400 font-semibold">{formatCurrency(lumpsumData.investmentAmount)}</span>
                    <span>₹1,00,00,000</span>
                  </div>
                </div>

                {/* Time Period */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-zinc-300">
                    Investment Period
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={lumpsumData.timePeriod}
                      onChange={(e) => setLumpsumData({...lumpsumData, timePeriod: Number(e.target.value)})}
                      className="w-full px-6 py-4 border border-zinc-700 rounded-2xl focus:border-purple-500 focus:outline-none transition-all bg-zinc-800 focus:bg-zinc-750 text-xl font-semibold text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="Years"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 text-lg font-medium">Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={lumpsumData.timePeriod}
                    onChange={(e) => setLumpsumData({...lumpsumData, timePeriod: Number(e.target.value)})}
                    className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-purple"
                  />
                  <div className="flex justify-between text-sm text-zinc-500 font-medium">
                    <span>1 Year</span>
                    <span className="text-purple-400 font-semibold">{lumpsumData.timePeriod} Years</span>
                    <span>40 Years</span>
                  </div>
                </div>

                {/* Expected Return */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-zinc-300">
                    Expected Annual Return
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={lumpsumData.expectedReturn}
                      onChange={(e) => setLumpsumData({...lumpsumData, expectedReturn: Number(e.target.value)})}
                      className="w-full px-6 py-4 border border-zinc-700 rounded-2xl focus:border-purple-500 focus:outline-none transition-all bg-zinc-800 focus:bg-zinc-750 text-xl font-semibold text-white placeholder-zinc-500 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="Return %"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-zinc-400 text-lg font-medium">%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={lumpsumData.expectedReturn}
                    onChange={(e) => setLumpsumData({...lumpsumData, expectedReturn: Number(e.target.value)})}
                    className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-purple"
                  />
                  <div className="flex justify-between text-sm text-zinc-500 font-medium">
                    <span>1%</span>
                    <span className="text-purple-400 font-semibold">{lumpsumData.expectedReturn}%</span>
                    <span>30%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Results Section */}
            <div className="mt-8 sm:mt-10 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-zinc-800 rounded-2xl sm:rounded-3xl border border-zinc-700/50 hover:border-emerald-500/20 transition-all duration-300">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-full mr-3"></div>
                Investment Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="group bg-zinc-800/50 backdrop-blur-sm p-6 rounded-2xl text-center border border-zinc-700/50 hover:border-zinc-600/50 hover:bg-zinc-800/80 transition-all duration-300">
                  <div className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white mb-2">{formatCurrency(currentResults.totalInvestment)}</div>
                  <div className="text-zinc-400 font-medium group-hover:text-zinc-300 transition-colors">Total Investment</div>
                </div>
                <div className="group bg-zinc-800/50 backdrop-blur-sm p-6 rounded-2xl text-center border border-zinc-700/50 hover:border-emerald-500/30 hover:bg-emerald-900/10 transition-all duration-300">
                  <div className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-emerald-400 mb-2">{formatCurrency(currentResults.returns)}</div>
                  <div className="text-zinc-400 font-medium group-hover:text-emerald-300 transition-colors">Total Returns</div>
                </div>
                <div className="group bg-zinc-800/50 backdrop-blur-sm p-6 rounded-2xl text-center border border-zinc-700/50 hover:border-yellow-500/30 hover:bg-yellow-900/10 transition-all duration-300">
                  <div className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-yellow-400 mb-2">{formatCurrency(currentResults.futureValue)}</div>
                  <div className="text-zinc-400 font-medium group-hover:text-yellow-300 transition-colors">Future Value</div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section with enhanced styling */}
          <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center border-t xl:border-t-0 xl:border-l border-zinc-800 min-w-[300px] xl:max-w-[450px] w-full">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 sm:mb-8 flex items-center">
              <div className="w-2 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full mr-3"></div>
              Investment Breakdown
            </h3>
            <div className="w-full max-w-xs md:max-w-md lg:max-w-lg mb-6 sm:mb-8 bg-zinc-900/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-800/50">              <ResponsiveContainer width="100%" height={300} className="mt-4">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #3f3f46',
                      borderRadius: '1rem',
                      color: '#18181b',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '0.75rem 1rem'
                    }}
                    itemStyle={{
                      color: '#18181b',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    labelStyle={{
                      color: '#18181b',
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Enhanced Legend */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 w-full">
              {chartData.map((item, index) => (
                <div key={index} className="group flex items-center justify-between space-x-4 sm:space-x-6 bg-zinc-900/50 hover:bg-zinc-900/80 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-5 h-5 rounded-full ring-2 ring-offset-2 ring-offset-zinc-900 transition-all duration-300"
                      style={{ 
                        backgroundColor: item.color,
                        boxShadow: `0 0 20px ${item.color}40`
                      }}
                    ></div>
                    <span className="text-zinc-300 font-semibold text-lg group-hover:text-white transition-colors">{item.name}</span>
                  </div>
                  <span className="text-white font-bold text-lg">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>

            {/* Enhanced Growth Stats */}
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/50 to-zinc-800 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-zinc-700/50 hover:border-emerald-500/20 transition-all duration-300 w-full">
              <div className="text-center">
                <div className="text-xl font-bold text-zinc-300 mb-3">Total Growth</div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 mb-2 animate-gradient">
                  {((currentResults.futureValue / currentResults.totalInvestment - 1) * 100).toFixed(1)}%
                </div>
                <div className="text-zinc-500 font-medium">Return on Investment</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Hide number input spinners */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10B981, #059669);
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
          border: 3px solid #065f46;
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(16, 185, 129, 0.6);
        }
        
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10B981, #059669);
          cursor: pointer;
          border: 3px solid #065f46;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
        }

        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6, #7C3AED);
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
          border: 3px solid #581c87;
          transition: all 0.2s ease;
        }
        
        .slider-purple::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(139, 92, 246, 0.6);
        }
        
        .slider-purple::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8B5CF6, #7C3AED);
          cursor: pointer;
          border: 3px solid #581c87;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
        }

        @keyframes spin-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s linear infinite;
        }
      `}</style>
    </div>
    <div className="bg-black">
      <div className="mb-16">
        <CallToAction />
      </div>

      <JoinCommunity />
      <Footer />
    </div>
    </>);
};

export default SIPLumpsumCalculator;