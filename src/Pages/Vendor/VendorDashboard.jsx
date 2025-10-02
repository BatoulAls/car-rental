import React, { useEffect, useState } from 'react';
import {useAuth} from '../../context/AuthContext';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import '../../styles/VendorDashboard.css'; 

const VendorDashboard = () => {
  const {token} = useAuth();
  const[dashboardData,setDashboardData]=useState({
    totalCars:10,
    totalActiveCars:4,
    totalBooking:5,
    MonthlyBooking:9
  })
  const[error,seterror]=useState('');
  const[loading,setloading]=useState(true)
  useEffect(()=>{
    if(!token) return;
    const fetchData=async()=>{
      try{
        const response= await axios.get('http://localhost:5050/api/vendor/dashboard',{
          headers:{Authorization:`Bearer ${token}`},
        })
        setDashboardData(response.data);

      }
      catch(error){
        console.log(error)
        seterror(error.response.data.message)

      }
      finally{
        setloading(false)
      }
    }
    fetchData()
  },[token])

 

  const carStatusData = [
    { name: 'Active', value: dashboardData.totalActiveCars, color: '#10b981' },
    { name: 'Inactive', value: dashboardData.totalCars - dashboardData.totalActiveCars, color: '#ef4444' }
  ];


  const cards = [
    { title: 'Total Cars', value: dashboardData.totalCars, icon: '🚗', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { title: 'Active Cars', value: dashboardData.totalActiveCars, icon: '✨', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { title: 'Total Bookings', value: dashboardData.totalBooking, icon: '📈', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'},
    { title: 'Monthly Bookings', value: dashboardData.MonthlyBooking, icon: '🎯', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
  ];
  if (loading) return <div>Loading...</div>;
if (error) return <div>{error}</div>;

  return (
    <div className="vendor1-dashboard">
    
      <div className="vendor1-header">
        <div>
          <h1 className="vendor1-title">Vendor Dashboard</h1>
          <p className="vendor1-subtitle">Track your business performance in real-time</p>
        </div>
        <div className="vendor1-date-box">
          <span className="vendor1-date-text">📅 {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="vendor1-grid">
        {cards.map((card, index) => (
          <div key={index} className="card1-hover">
            <div className="card1" style={{ background: card.gradient }}>
              <div className="card1-content">
                <div className="card1-top">
                  <div className="icon1-circle">
                    <span className="icon1">{card.icon}</span>
                  </div>
                  
                </div>
                <div className="card1-bottom">
                  <h2 className="value1">{card.value.toLocaleString()}</h2>
                  <p className="card1-title">{card.title}</p>
                </div>
              </div>
              <div className="card1-glow"></div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="charts1-grid">
        {/*<div className="chart-card">
          <h3 className="chart-title">📊 Monthly Bookings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#667eea" strokeWidth={3} dot={{ fill: '#667eea', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>*/}

        <div className="chart1-card">
          <h3 className="chart1-title">🚗 Car Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={carStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                {carStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    {  /*<div className="charts-grid">
        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
          <h3 className="chart-title">🏆 Top Performing Cars</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCarsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" angle={-15} textAnchor="end" height={80} />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="bookings" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#764ba2" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>*/}
    </div>
  );
};

export default VendorDashboard;
