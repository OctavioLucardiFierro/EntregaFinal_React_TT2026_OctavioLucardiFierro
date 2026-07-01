import "./Footer.css";

// Footer replicado del proyecto Pre-Entrega (mismas clases y estilos).
const team = [
  { name: "Octavio Lucardi Fierro", role: "CEO", initials: "OLF" },
  { name: "Enzo Lucardi Fierro", role: "Ventas", initials: "ELF" },
  { name: "Lisa Minci", role: "Atención al cliente", initials: "LM" },
];

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerTop">
        <div className="footerInfo">
          <h3 className="footerBrand">
            <span className="footerBrandPS">PS</span> Store
          </h3>
          <p className="footerDesc">
            Tu tienda de juegos PlayStation. Proyecto integrador del curso React
            TalentoTech 2026.
          </p>
          <p className="footerContact">contacto@psstore.com.ar</p>
        </div>

        <div className="footerTeam">
          <h4 className="footerTeamTitle">Equipo</h4>
          <div className="footerCards">
            {team.map((member) => (
              <div className="footerCard" key={member.name}>
                <div className="footerAvatar">{member.initials}</div>
                <div>
                  <p className="footerCardName">{member.name}</p>
                  <p className="footerCardRole">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footerBottom">
        <span>© 2026 PS Store</span>
      </div>
    </footer>
  );
};

export default Footer;
