import NavLink from "./NavLink";

const Footer = ({ footerMenu: menu }) => {
  return (
    <footer className="footer_section bg-gray-200 px-3 py-2 flex justify-between items-center">
      <p>
        All Rights Reserved <a href="/#">hrrarya</a>; Copyright 2021
      </p>
      <div className="footer_menu">
        <nav>
          {menu &&
            menu.map((m) => (
              <NavLink
                key={m.id}
                href={`/page/${m.path.replace("/", "")}`}
                classes="header-menu ml-3"
              >
                {m.label}
              </NavLink>
            ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
