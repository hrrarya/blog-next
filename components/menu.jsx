import React from "react";
import Link from "next/link";
import NavLink from "./NavLink";
import { useQuery } from "react-query";
import { request, gql } from "graphql-request";

const Header = ({ headerMenu: menu, siteInfo: site }) => {
  return (
    <div className="header_section bg-gray-200 px-3 py-2 flex justify-between items-center">
      <div className="header_section__left">
        <Link href="/">
          <a>
            <h1 className="text-3xl">{site?.title}</h1>
          </a>
        </Link>
        <p>{site?.description}</p>
      </div>
      <div className="header_section__right">
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
    </div>
  );
};

export default Header;
