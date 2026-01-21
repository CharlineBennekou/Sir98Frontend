import AppHeader from "../components/layout/AppHeader";
import "./../styles/installation.css";

import androidGoogle1 from "../assets/installation/Android-Google-1.png";
import androidGoogle2 from "../assets/installation/Android-Google-2.png";
import androidGoogle3 from "../assets/installation/Android-Google-3.png";

export default function AboutUs() {
  return (
    <>
      <AppHeader title="Installation guide" />
      <div style={{ marginTop: 70 }} />


      <div className="about-container">


            {/* 🔹 Boks: Om foreningen */}
        <div className="about-box-3">
          <h3>Android - guide</h3>
          <p>Sådan installerer du denne app på android med Google.</p>
          <div className="installation">
            <img src={androidGoogle1}/>
            <img src={androidGoogle2}/>
            <img src={androidGoogle3}/>
          </div>
          <b>Færdig!</b>
        </div>



        {/* 🔹 Boks: Om applikationen */}
        <div className="about-box-1">
          <h3>Iphone og IOS</h3>
        </div>

        {/* 🔹 Boks: Formål */}
        <div className="about-box-2">
          <h3>Google</h3>
        </div>

    



        
      </div>
    </>
  );
}
