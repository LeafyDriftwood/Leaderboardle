import { colorMap } from "./Utils"
import { borderMap } from "./Utils"

import './commonStyle.css'


interface KeyboardProps {
    colors: {[key: string]: string}
    updateKey: (key: string) => void
}

function Keyboard (props: KeyboardProps) {

    return (
        <div id="keyboard-cont">
        <div className="first-row">
            <button className="keyboard-button" style = {{background: colorMap[props.colors["q"]]}} onClick = {() => props.updateKey("q")}>q</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["w"]]}} onClick = {() => props.updateKey("w")}>w</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["e"]]}} onClick = {() => props.updateKey("e")}>e</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["r"]]}} onClick = {() => props.updateKey("r")}>r</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["t"]]}} onClick = {() => props.updateKey("t")}>t</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["y"]]}} onClick = {() => props.updateKey("y")}>y</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["u"]]}} onClick = {() => props.updateKey("u")}>u</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["i"]]}} onClick = {() => props.updateKey("i")}>i</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["o"]]}} onClick = {() => props.updateKey("o")}>o</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["p"]]}} onClick = {() => props.updateKey("p")}>p</button>
        </div>
        <div className="second-row">
            <button className="keyboard-button" style = {{background: colorMap[props.colors["a"]]}} onClick = {() => props.updateKey("a")}>a</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["s"]]}} onClick = {() => props.updateKey("s")}>s</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["d"]]}} onClick = {() => props.updateKey("d")}>d</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["f"]]}} onClick = {() => props.updateKey("f")}>f</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["g"]]}} onClick = {() => props.updateKey("g")}>g</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["h"]]}} onClick = {() => props.updateKey("h")}>h</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["j"]]}} onClick = {() => props.updateKey("j")}>j</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["k"]]}} onClick = {() => props.updateKey("k")}>k</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["l"]]}} onClick = {() => props.updateKey("l")}>l</button>
        </div>
        <div className="third-row">
            <button className="keyboard-button" onClick = {() => props.updateKey("Backspace")}>Del</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["z"]]}} onClick = {() => props.updateKey("z")}>z</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["x"]]}} onClick = {() => props.updateKey("x")}>x</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["c"]]}} onClick = {() => props.updateKey("c")}>c</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["v"]]}} onClick = {() => props.updateKey("v")}>v</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["b"]]}} onClick = {() => props.updateKey("b")}>b</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["n"]]}} onClick = {() => props.updateKey("n")}>n</button>
            <button className="keyboard-button" style = {{background: colorMap[props.colors["m"]]}} onClick = {() => props.updateKey("m")}>m</button>
            <button className="keyboard-button" onClick = {() => props.updateKey("Enter")}>Enter</button>
        </div>
    </div>
    )
}

export default Keyboard