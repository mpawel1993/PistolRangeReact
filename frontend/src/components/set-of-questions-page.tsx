import {useNavigate, useSearchParams} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import MenuButton from "./menu-button";
import learningImage from "../assets/learning_image.png";
import {ALL_CATEGORIES, CATEGORIES} from "../model";
import {formatCategory} from "../utils";

export const SetOfQuestionsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("random") === "true" ? "?random=true" : "";

    const open = (category: string) => navigate(`/nauka/${category.toLowerCase()}${query}`);

    return (
        <main className="page">
            <img className="hero hero--small" src={learningImage} alt="Nauka"/>
            <div className="menu menu--grid">
                {CATEGORIES.map(category => (
                    <MenuButton key={category} onClick={() => open(category)}>{formatCategory(category)}</MenuButton>
                ))}
            </div>
            <div className="menu-footer">
                <MenuButton className="menu-button--icon" label="Strona główna" onClick={() => navigate("/activity-page")}>
                    <HomeIcon/>
                </MenuButton>
                <MenuButton onClick={() => open(ALL_CATEGORIES)}>{ALL_CATEGORIES}</MenuButton>
            </div>
        </main>
    );
}

export default SetOfQuestionsPage;
