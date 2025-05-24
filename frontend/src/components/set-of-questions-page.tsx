import {allQuestionsAtom, categories} from "../atoms";
import Field from "./field";
import {useNavigate} from "react-router-dom";
import {useAtomValue} from "jotai";
import HomeIcon from "@mui/icons-material/Home";
import learningImage from '../assets/learning_image.png';
import {WeaponLawCategory} from "../model/model";

const SetOfQuestionsPage = () => {

    const navigate = useNavigate();
    const baseQuestions = useAtomValue(allQuestionsAtom);

    const handleNavigateToActOfGunAndAmmo = (categoryName: string) => {
        let storageKey = 'ActOfGunAndAmmo';
        let set1 = baseQuestions.filter(x => x.displayId > 0 && x.displayId <= 145);
        let set2 = baseQuestions.filter(x => x.displayId >= 154 && x.displayId <= 158);
        let set3 = baseQuestions.filter(x => x.displayId >= 164 && x.displayId <= 169);
        let actual = [...set1, ...set2, ...set3];
        assignId(actual);
        navigate('/nauka', {
            state: {questions: actual, categoryName: categoryName, storageKey: storageKey}
        });
    }

    const handleNavigationToCarryGun = (categoryName: string) => {
        let storageKey = 'CarryGun';
        let actual = baseQuestions.filter(x => x.displayId >= 146 && x.displayId <= 153);
        assignId(actual);
        navigate('/nauka', {
            state: {questions: actual, categoryName: categoryName, storageKey: storageKey}
        });
    }

    const handleNavigationToPublicTransport = (categoryName: string) => {
        let storageKey = 'PublicTransport';
        let actual = baseQuestions.filter(x => x.displayId >= 159 && x.displayId <= 163);
        assignId(actual);
        navigate('/nauka', {
            state: {questions: actual, categoryName: categoryName, storageKey: storageKey}
        });
    }

    const handleNavigationToSafetyOnShootingRange = (categoryName: string) => {
        let storageKey = 'SafetyOnShootingRange';
        let actual = baseQuestions.filter(x => x.displayId >= 170 && x.displayId <= 184);
        assignId(actual);
        navigate('/nauka', {
            state: {questions: actual, categoryName: categoryName, storageKey: storageKey}
        });
    }

    const handleNavigationToCriminalSanctions = (categoryName: string) => {
        let storageKey = 'CriminalSanctions';
        let set1 = baseQuestions.filter(x => x.displayId >= 185 && x.displayId <= 193);
        let set2 = baseQuestions.filter(x => x.displayId >= 197 && x.displayId <= 200);
        let actual = [];
        actual = [...set1, ...set2];
        assignId(actual);
        navigate('/nauka', {
            state: {questions: actual, categoryName: categoryName, storageKey: storageKey}
        });
    }

    const handleNavigationToSelfDefence = (categoryName: string) => {
        let storageKey = 'SelfDefence';
        let actual = baseQuestions.filter(x => x.displayId >= 194 && x.displayId <= 196);
        assignId(actual)
        navigate('/nauka', {
            state: {questions: actual, categoryName: categoryName, storageKey: storageKey}
        });
    }

    const assignId = (array: any[]) => {
        let index = 1;
        array.forEach(a => {
            a.id = index;
            index++;
        });
    }

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
        <div onClick={() => handleNavigateToActOfGunAndAmmo(categories[1])}>
            <Field text={categories[1]}/>
        </div>
        <div onClick={() => handleNavigationToCarryGun(categories[2])}>
            <Field text={categories[2]}/>
        </div>
        <div onClick={() => handleNavigationToPublicTransport(categories[3])}>
            <Field text={categories[3]}/>
        </div>
        <div onClick={() => handleNavigationToSafetyOnShootingRange(categories[4])}>
            <Field text={categories[4]}/>
        </div>
        <div onClick={() => handleNavigationToCriminalSanctions(categories[5])}>
            <Field text={categories[5]}/>
        </div>
        <div onClick={() => handleNavigationToSelfDefence(categories[6])}>
            <Field text={categories[6]}/>
        </div>

        <div style={{display: "flex", gap: "10px"}}>
            <button style={navButtonStyle} onClick={() => navigate('/activity-page')}>
                <HomeIcon/>
            </button>

            <div style={{
                flex: 1,
            }} onClick={() => navigate('/nauka/' + WeaponLawCategory.WSZYSTKIE.toLowerCase())}>
                <Field text={categories[0]}/>
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