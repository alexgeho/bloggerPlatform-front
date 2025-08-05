import  Header  from "./Header.tsx";
import  Sidebar  from "./Sidebar";
import Home from "./Home.tsx";

export function Layout() {

    return (

<div className = "app">

    <Header />
    <Sidebar/>
    <Home />

</div>


    );
}
