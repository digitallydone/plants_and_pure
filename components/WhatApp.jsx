// Path: components/WhatApp.jsx
"use client";
import { FloatingWhatsApp } from "react-floating-whatsapp";
// import { useTheme } from "next-themes";

const WhatApp = () => {


  return (
    <div>
      <FloatingWhatsApp
        // avatar="/profile.png"
        notificationSound
        // darkMode={theme === "dark" ? true : false}
        chatMessage="Hello! what can we help you?"
        phoneNumber=""
        statusMessage="Typically replies within 5mins"
        accountName="Plant and Pure"
        chatboxClassName=""
        allowEsc
        // allowClickAway
      />
    </div>
  );
};

export default WhatApp;