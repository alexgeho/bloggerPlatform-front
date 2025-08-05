import {useNavigate} from "react-router-dom";

export default function Header() {

    const navigate = useNavigate();

    return (

        <header className="header">
            <h1>Blogger Platform</h1>
            <button className="signin" onClick={() => navigate("/register")}>
                Sign In
            </button>
        </header>

    );

}

