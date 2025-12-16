import AppHeader from "../components/layout/AppHeader";
import "./../styles/AboutUsStyle.css";

export default function AboutUs() {
  return (
    <>
      <AppHeader title="Omkring SIR98" />
      <div style={{ marginTop: 70 }} />

      <div className="about-container">


            {/* 🔹 Boks: Om foreningen */}
        <div className="about-box-3">
          <h3>Om foreningen</h3>
          <p>
            SIR98 er en forening med fokus på fællesskab, bevægelse og engagement.
            Foreningen tilbyder forskellige aktiviteter og arrangementer for
            sine medlemmer.
          </p>
                  {/* Eksternt link */}
            <div className="about-link" >
            <a
                href="https://if-sir98.dk/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Se mere på SIR98's hjemmeside
            </a>
            </div>
        </div>



        {/* 🔹 Boks: Om applikationen */}
        <div className="about-box-1">
          <h3>Om applikationen</h3>
          <p>
            Denne applikation er udviklet for at give medlemmer
            et nemt overblik over aktiviteter, træning og begivenheder i
            foreningen.
          </p>
          <p>
            Formålet er at samle vigtig information ét sted og gøre det lettere
            at følge med i, hvad der sker.
          </p>
        </div>

        {/* 🔹 Boks: Formål */}
        <div className="about-box-2">
          <h3>Formål</h3>
          <p>
            Appen skal fungere som et supplement til foreningens øvrige
            kommunikationskanaler og give et hurtigt og overskueligt indblik i
            foreningens tilbud.
          </p>
        </div>

    



        
      </div>
    </>
  );
}
