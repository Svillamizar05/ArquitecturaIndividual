import { Link } from "react-router-dom";

export default function Header() {
  return (
    <nav className=" py-4 mb-2">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-3xl font-bold">
          Carros Usados
        </Link>
        <div>
          <Link to="/CarForm" className="hover:text-sky-300 text-3xl font-bold">
            Vender mi vehículo
          </Link>
        </div>
      </div>
    </nav>
  );
}
