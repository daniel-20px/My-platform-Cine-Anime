import React from "react";

function Menu({ fecharMenu }) {
  return (
    <div className="Menu_pai">
      <div className="Menu_secury">
        <ul className="Menu_ul">
          <li className="li-menu">
            <a className="amenu" href="#home" onClick={fecharMenu}>Home</a>
          </li>
          <li className="li-menu">
            <a className="amenu" href="#contact" onClick={fecharMenu}>Contact</a>
          </li>
          <li className="li-menu">
            <a className="amenu" href="#services" onClick={fecharMenu}>Services</a>
          </li>
          <li className="li-menu">
            <a className="amenu" href="#link4" onClick={fecharMenu}>------</a>
          </li>
          <li className="li-menu">
            <a className="amenu" href="#link5" onClick={fecharMenu}>------</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Menu;
