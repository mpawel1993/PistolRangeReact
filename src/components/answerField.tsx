// @ts-ignore
export const AnswerField = ({option, possibleAnswer, gradientColours, isPicked, disabled}) => {
    return (
        <>
            <div style={{
                display: "flex",
                alignItems: "center", // Centers items vertically
                justifyContent: "space-between", // Adjust spacing
                width: "100%", // Ensures full-width usage
            }}>
                <div style={isPicked ? {
                    color: 'white',
                    fontSize: 40,
                    paddingRight: 5,
                    backgroundColor: 'black',
                    textDecoration: 'underline'
                } : {
                    color: 'white',
                    fontSize: 40,
                    paddingRight: 5,
                    backgroundColor: 'black',
                }}>
                    {option.toUpperCase()}
                </div>

                <button disabled={disabled} style={{
                    background: "linear-gradient(to right," + gradientColours + ")",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: 'row',
                    padding: 15,
                    margin: 10,
                    fontFamily: 'Bahnschrift',
                    fontSize: 20,
                    color: 'black',
                    border: 'none',
                    cursor: 'pointer',
                    width: '95%',
                    outline: 'none',
                    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)',
                    opacity: isPicked ? 0.5 : 1,
                    pointerEvents: isPicked ? 'none' : 'auto'
                }}>
                    {possibleAnswer}
                </button>
            </div>
        </>);
}
export default AnswerField;