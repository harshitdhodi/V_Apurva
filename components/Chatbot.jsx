"use client"
import React, { useEffect } from 'react';

const Chatbot = () => {
  useEffect(() => {
    // Tawk.to chatbot script
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/6911a8861b866219575e58de/1j9mfkjh1";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    // Optional custom button styling
    const style = document.createElement("style");
    style.innerHTML = `
      .tawk-button {
        background-color: #ec2127 !important;
        border-color: #ec2127 !important;
      }
      .tawk-button:hover {
        background-color: #d41e22 !important;
        border-color: #d41e22 !important;
      }
    `;
    document.head.appendChild(style);

    // Optional Tawk.to API customization
    window.Tawk_API.onLoad = function () {
      if (window.Tawk_API.setAttributes) {
        window.Tawk_API.setAttributes(
          {
            widgetColor: '#ec2127',
          },
          function (error) {
            if (error) {
              console.error('Error setting Tawk.to attributes:', error);
            }
          }
        );
      }
    };

    // Cleanup on component unmount
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return <div id="chatbot-container"></div>;
};

export default Chatbot;