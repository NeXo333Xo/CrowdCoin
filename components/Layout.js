import react from "react";
import Header from "./Header.js"

const Layout = (props) => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Header></Header>
            {props.children}
        </div>
    );
}

export default Layout;