import {allQuestionsAtom, categories} from "../atoms";
import Field from "./field";
import {useNavigate} from "react-router-dom";
import {useAtomValue} from "jotai";
import HomeIcon from "@mui/icons-material/Home";

const SetOfQuestionsPage = () => {

    const navigate = useNavigate();
    const baseQuestions = useAtomValue(allQuestionsAtom);

    const handleNavigateToAll = (categoryName: string) => {
        let storageKey = 'all';
        navigate('/learining-page', {
            state: {questions: baseQuestions, categoryName, storageKey}
        });
    }

    const handleNavigateToActOfGunAndAmmo = (categoryName: string) => {
        let storageKey = 'ActOfGunAndAmmo';
        let set1 = baseQuestions.filter(x => x.id > 0 && x.id <= 145);
        let set2 = baseQuestions.filter(x => x.id >= 154 && x.id <= 158);
        let set3 = baseQuestions.filter(x => x.id >= 164 && x.id <= 169);
        let actual = [...set1, ...set2, ...set3];
        assignId(actual);
        navigate('/learining-page', {
            state: {questions: actual, categoryName: categoryName, storageKey: storageKey}
        });
    }

    const handleNavigationToCarryGun = (categoryName: string) => {
        let storageKey = 'CarryGun';
        let actual = baseQuestions.filter(x => x.id >= 146 && x.id <= 153);
        assignId(actual);
        navigate('/learining-page', {
            state: {questions: actual, categoryName: categoryName, storageKey: storageKey}
        });
    }

    const handleNavigationToPublicTransport = (categoryName: string) => {
        let storageKey = 'PublicTransport';
        let actual = baseQuestions.filter(x => x.id >= 159 && x.id <= 163);
        assignId(actual);
        navigate('/learining-page', {
            state: {questions: actual, categoryName: categoryName, storageKey: storageKey}
        });
    }

    const handleNavigationToSafetyOnShootingRange = (categoryName: string) => {
        let storageKey = 'SafetyOnShootingRange';
        let actual = baseQuestions.filter(x => x.id >= 170 && x.id <= 184);
        assignId(actual);
        navigate('/learining-page', {
            state: {questions: actual, categoryName: categoryName, storageKey: storageKey}
        });
    }

    const handleNavigationToCriminalSanctions = (categoryName: string) => {
        let storageKey = 'CriminalSanctions';
        let set1 = baseQuestions.filter(x => x.id >= 185 && x.id <= 193);
        let set2 = baseQuestions.filter(x => x.id >= 197 && x.id <= 200);
        let actual = [];
        actual = [...set1, ...set2];
        assignId(actual);
        navigate('/learining-page', {
            state: {questions: actual, categoryName: categoryName, storageKey: storageKey}
        });
    }

    const handleNavigationToSelfDefence = (categoryName: string) => {
        let storageKey = 'SelfDefence';
        let actual = baseQuestions.filter(x => x.id >= 194 && x.id <= 196);
        assignId(actual)
        navigate('/learining-page', {
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
        <div style={{color: 'black' , height:20}}></div>

        <div onClick={() => handleNavigateToAll(categories[0])}>
            <Field text={categories[0]}/>
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
        <button style={navButtonStyle} onClick={() =>             navigate('/activity-page')}>
             <HomeIcon/>
         </button>
    </div>);
}

const navButtonStyle = {
    padding: 15,
    margin: 10,
    fontFamily: 'Bahnschrift',
    fontSize: 20,
    background: "linear-gradient(to right, #94c02b, #71912a)",
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    outline: 'none',
    width: '100%',
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
}

export default SetOfQuestionsPage;