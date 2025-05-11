
// @ts-ignore
export const AnswerField = ({option, possibleAnswer, gradientColours, isPicked}) => {
    return (<div style={{
        background: "linear-gradient(to right, #ff7e5f, #feb47b)",
        display: "flex",
        justifyContent: "center",
        color: "white",
        fontSize: "20px",
        flexDirection: 'row',
        padding: 3,
        alignItems: 'center'
    }}>
        {possibleAnswer}
    </div>);
}
export default AnswerField;