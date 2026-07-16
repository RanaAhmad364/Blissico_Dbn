import React from 'react';
import Marquee from '../components/Marquee';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Steps from '../components/Steps';
import StepCards from '../components/StepCards';
import Occasions from '../components/Occasions';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="home-page">
      <Marquee />
      <Navbar />
      <Hero />
      <Steps />
      <StepCards />
      <Occasions />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;