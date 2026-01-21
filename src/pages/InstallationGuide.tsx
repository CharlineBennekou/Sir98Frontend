import AppHeader from "../components/layout/AppHeader";
import "./../styles/AboutUsStyle.css";

export default function AboutUs() {
  return (
    <>
      <AppHeader title="Installation guide" />
      <div style={{ marginTop: 70 }} />


      <div className="about-container">


            {/* 🔹 Boks: Om foreningen */}
        <div className="about-box-3">
          <h3>Android</h3>
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
