import {useEffect, useState} from "react";

export const ExamSummary = ({goodCount} : {goodCount : number}) =>{


    return (<div style={{color:'#98c135'}}>
        UKOŃCZONO EGZAMIN

        { goodCount == 8 ? <div style={{color : 'red'}}>ZALICZONO</div> : <div style={{color : 'red'}}>NIE ZALICZONO</div>}
        <div style={{color : 'green'}}>DOBRZE: {goodCount} </div>
        <div style={{color : 'red'}}> ŹLE: {10 - goodCount}</div>
    </div>)
}
export default ExamSummary;