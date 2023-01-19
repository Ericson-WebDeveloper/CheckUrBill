import React from "react";
import Logo from "../assets/Logo.png";
type AboutProps = {};

const About = (props: AboutProps) => {
  return (
    <div className="flex flex-col h-auto space-y-4">
      <div className="flex flex-col h-[300px] justify-center items-center">
        <img src={Logo} className="w-56 h-full" alt="" />
      </div>
      <div className="flex w-full h-auto">
        <div className="flex flex-col space-y-4 container mx-[20px] md:mx-[100px] lg:mx-[150px] xl:mx-[300px]">
          <h1 className="text-4xl font-sans">About Us</h1>
          <p className="text-xl font-mono">
            CheckUrBills is more than just a platform where customers can view
            their bills, get monthly bill notifications, and pay using any bank
            accounts, credit card, GCash, and Paymaya. It is a movement to
            promote a customer payment habit that facilitates ease of collection
            and on-the-go payments.
          </p>
          <p className="text-xl font-mono">
            CheckUrBills started this 2020 with some Landbank merchants,
            primarily government agencies – NGAs, LGUs, SUCs, GOCCs, and
            government-sanctioned utilities (electric cooperatives, water
            districts). It kept on growing and growing; this only because we
            encourage the company to move forward, and explore more changes for
            online and digital innovation for its customers and clients.
          </p>
          <p className="text-xl font-mono">
            CheckUrBills is part of one of the top IT Solutions in the
            Philippines—PhilPaCS or Philippine Payment and Clearing System,
            promoting a digital and online society and delivering solutions no
            matter how difficult the challenges we have to overcome,
          </p>
          <p className="text-xl font-mono">And we just keep on making history.</p>
          <br /><br />
        </div>
      </div>
    </div>
  );
};

export default About;
