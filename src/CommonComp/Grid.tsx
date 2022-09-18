import Row from './Row'

interface GridProps {
    values: string[][];
    colors: string[][];
    borderColors: string[][];
    shrunk: boolean;
}

function Grid (props: GridProps) {


    if (props.shrunk) {
        return (
            <div className = "grid" >
                {props.values.map((ele, index) => (
                    <Row key={index} borderColors ={props.borderColors[index]} 
                        colors ={props.colors[index]} 
                        values={props.values[index]}
                        shrunk = {props.shrunk} />
                ))}
          
            </div>
        )

    }
    else {

        return (
            <div className = "grid" >
                {props.values.map((ele, index) => (
                    <Row key={index} borderColors ={props.borderColors[index]} 
                        colors ={props.colors[index]} 
                        values={props.values[index]}
                        shrunk = {props.shrunk} />
                ))}
        
            </div>
        )
    }

}

export default Grid