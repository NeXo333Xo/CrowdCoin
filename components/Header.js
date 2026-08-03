import react from "react";
import Link from "next/link";

const Header = () => {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm border mb-5">
        <div className="navbar-start">
          <Link href="/">
            <a className="btn btn-soft text-xl">CrowdCoin</a>
          </Link>
        </div>

        <div className="navbar-end">
            <Link href="/">
              <a className="btn btn-soft text-xl">Campaigns</a>
            </Link>
            <Link href="/campaigns/new">
              <button className="btn btn-primary text-xl ml-2">+</button>
            </Link>
        </div>

      </div>
    </>
  );
};

export default Header;
