export const Field = ({text}: {text:string}) => {

    return (<div style={{
        background: "linear-gradient(to right, #94c02b, #71912a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
        padding: 15,
        marginBottom: 10,
        fontFamily:'Bahnschrift',
        fontSize: 20,
        color: '#2b2a29'
    }}>{text}</div>);
}
export default Field;