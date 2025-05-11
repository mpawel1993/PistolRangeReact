// @ts-ignore
export const AnswerField = ({option, possibleAnswer, gradientColours, isPicked, disabled}) => {
    return (<button disabled={disabled} style={{
        background: "linear-gradient(to right," + gradientColours + ")",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
        padding: 15,
        margin: 10,
        fontFamily: 'Bahnschrift',
        fontSize: 20,
        color: '#2b2a29',
        border: 'none',
        borderRadius: 10,
        cursor: 'pointer',
        width: '90%',
        outline: 'none',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
        opacity: isPicked ? 0.5 : 1,
        pointerEvents: isPicked ? 'none' : 'auto'
    }}>
        {possibleAnswer}
    </button>);
}
export default AnswerField;