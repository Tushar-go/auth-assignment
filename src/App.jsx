import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
  const setToken = (token) => localStorage.setItem("jwt_token", token);
  const setRefreshToken = (token) => localStorage.setItem("refresh_token", token);

  const navigate = useNavigate();

  const loginHandler = async () => {
    try {
      const response = await axios.post(
        "https://api.escuelajs.co/api/v1/auth/login",
        {
          email: "john@mail.com",
          password: "changeme",
        }
      );

      setToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token);

      navigate("/profile");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className=" bg-slate-200 h-screen w-full flex flex-col justify-center items-center gap-4">
      <h1 className=" font-medium text-xl">Click On Login Button</h1>
      <button
        onClick={loginHandler}
        className="text-white bg-blue-700 hover:bg-blue-800   font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
      >
        Login
      </button>
    </div>
  );
}

export default App;
