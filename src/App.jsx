import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>

      <main>
        {/* Child components (Home, About) will render right here */}
        <Outlet />
      </main>
    </div>
  );
}

export default App;
