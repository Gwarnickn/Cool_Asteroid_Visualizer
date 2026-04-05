
const ScientificNotation = ({children}: {children: number}) => {
    const text = children.toExponential(5).replace("+","").split("e");
    return <span style={{paddingLeft: "unset", marginRight: `${8 * text[1].length}px`}}>{text[0]}×10<sup>{text[1]}</sup></span>
}
export default ScientificNotation;