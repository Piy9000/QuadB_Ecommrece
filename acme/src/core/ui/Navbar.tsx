import { CircleUser, Search, ShoppingBag } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return <>
        <header className="flex justify-between items-center px-6 py-2.5  border-b-2 border-solid border-base-200">
            <NavLink to='/' className="logo text-2xl font-semibold">3legent</NavLink>
            <nav>
                <ul className="flex items-center text-base-content">
                    <li className="mx-3.5"><NavLink to="/">Home</NavLink></li>
                    <li className="mx-3.5"><NavLink to="/shop">Shop</NavLink></li>
                    <li className="mx-3.5"><NavLink to="/products">Product</NavLink></li>
                    <li className="mx-3.5"><NavLink to="/contact-us">Contact us</NavLink></li>
                </ul>
            </nav>
            <div className="icons">
                <button type="button" className="mx-2.5">
                    <Search strokeWidth={1.75} />
                </button>
                <button type="button" className="mx-2.5">
                    <ShoppingBag strokeWidth={1.75} />
                </button>
                <button type="button" className="mx-2.5">
                    <CircleUser strokeWidth={1.75} />
                </button>
            </div>
        </header>
    </>;
};
export default Navbar;