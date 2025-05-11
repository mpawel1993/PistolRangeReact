export const Field = ({text}: {text:string}) => {

    const gradientStyle = {
        background: "linear-gradient(to right, #ff7e5f, #feb47b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "20px",
    };

    return (<div style={gradientStyle}>{text}</div>);
}
export default Field;