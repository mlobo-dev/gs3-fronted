import React from 'react';
import Navbar from '../../components/navbar';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './home.css';
function Home() {
  return (
    <>
      {!useSelector((state) => state.usuarioLogado) && <Redirect to="/login" />}
      <Navbar />
      <h1>Home</h1>
    </>
  );
}
export default Home;
