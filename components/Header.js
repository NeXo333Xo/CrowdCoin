import react from "react";
import Link from "next/link";

const Header = () => {
  return (
    <>
      <div className="navbar bg-base-100 shadow-sm border mb-5">
        <div className="navbar-start">
          <Link className="btn btn-soft text-xl" href="/">
            CrowdCoin
          </Link>
        </div>
        <div className="navbar-end">
          <Link className="btn btn-soft text-xl" href="/">
            Campaigns
          </Link>
          <Link href="/campaigns/new" className="btn btn-primary text-xl ml-2">
            +
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;
