import Field from "./field";
import {useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import learningImage from '../assets/learning_image.png';
import {WeaponLawCategory} from "../model/model";
import {replaceUnderscoreWithSpace} from "../utils";

const SetOfQuestionsPage = () => {

    const navigate = useNavigate();

    return (<div>
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: '10px'
        }}>
            <img style={{
                width: '50%',
                height: 'auto'
            }} src={learningImage} alt="Logo"/>
        </div>
        <div onClick={() => navigate('/nauka/' + WeaponLawCategory.USTAWA_O_BRONI_I_AMUNICJI.toLowerCase())}>
            <Field text={replaceUnderscoreWithSpace(WeaponLawCategory.USTAWA_O_BRONI_I_AMUNICJI)}/>
        </div>
        <div onClick={() => navigate('/nauka/' + WeaponLawCategory.PRZECHOWYWANIE_I_NOSZENIE_BRONI.toLowerCase())}>
            <Field text={replaceUnderscoreWithSpace(WeaponLawCategory.PRZECHOWYWANIE_I_NOSZENIE_BRONI)}/>
        </div>
        <div
            onClick={() => navigate('/nauka/' + WeaponLawCategory.PRZEWOZENIE_BRONI_SRODKAMI_TRANSPORTU_PUBLICZNEGO.toLowerCase())}>
            <Field
                text={replaceUnderscoreWithSpace(WeaponLawCategory.PRZEWOZENIE_BRONI_SRODKAMI_TRANSPORTU_PUBLICZNEGO)}/>
        </div>
        <div onClick={() => navigate('/nauka/' + WeaponLawCategory.BEZPIECZENSTWO_NA_STRZELNICACH.toLowerCase())}>
            <Field text={replaceUnderscoreWithSpace(WeaponLawCategory.BEZPIECZENSTWO_NA_STRZELNICACH)}/>
        </div>
        <div onClick={() => navigate('/nauka/' + WeaponLawCategory.SANKCJE_KARNE.toLowerCase())}>
            <Field text={replaceUnderscoreWithSpace(WeaponLawCategory.SANKCJE_KARNE)}/>
        </div>
        <div
            onClick={() => navigate('/nauka/' + WeaponLawCategory.OBRONA_KONIECZNA_I_STAN_WYZSZEJ_KONIECZNOSCI.toLowerCase())}>
            <Field text={replaceUnderscoreWithSpace(WeaponLawCategory.OBRONA_KONIECZNA_I_STAN_WYZSZEJ_KONIECZNOSCI)}/>
        </div>

        <div style={{display: "flex", gap: "10px"}}>
            <button style={navButtonStyle} onClick={() => navigate('/activity-page')}>
                <HomeIcon/>
            </button>

            <div style={{
                flex: 1,
            }} onClick={() => navigate('/nauka/' + WeaponLawCategory.WSZYSTKIE.toLowerCase())}>
                <Field text={WeaponLawCategory.WSZYSTKIE}/>
            </div>
        </div>

    </div>);
}

const navButtonStyle = {
    flex: 0.5,
    marginBottom: 10,
    background: "linear-gradient(to right, #94c02b, #71912a)",
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
}

export default SetOfQuestionsPage;