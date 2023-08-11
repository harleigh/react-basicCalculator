//every begining has a begining, and this is this begining. And, being that
//this is the begining, take it with a grain of salt as there is quite a road
//yet being paved; as I am learning, all code and documentation are "as is"


//TODO: repeating decimals 

import { useState } from 'react';
import { evaluate } from 'mathjs'

//"export default"  makes this the main component in the file.
//returns a component that contains the filter table with a little
//header above
export default function SimpleCalculator() {

    const [calcExpr, setCalcExpr] = useState("");
    const [resultCalc, setResultCalc] = useState("0");
    const [decimalPlaced, setDecimalPlaced] = useState(false)
    const divSym = "/"
    const multSym = "*"
    const plusSym = "+"
    const minusSym = "-"
    const deciSym = "."
    const ops = [divSym, multSym, plusSym, minusSym, deciSym];

    const isOperator = (v) => {
        return ops.includes(v);
    }
    const isEmpty = (v) => {
        return v==="";
    }

    const makesInvalidExpr = (newEntry) => {
        const lastInDisplay = calcExpr.slice(-1);
        const case1 = isOperator(newEntry) && isOperator(lastInDisplay);
        const case2 = isOperator(newEntry) && isEmpty(calcExpr)
        const case3 = decimalPlaced && newEntry===deciSym;
        //return (isOperator(newEntry) && (isOperator(lastInDisplay) || isEmpty(calcExpr)));
        return (case1 || case2 || case3);
    }

    /**
     * user has hit a button on the calculator display, must update calculator 
     */
    const updateCalcDisp = (v) => {

        if( makesInvalidExpr(v) ) { return;}
        
        const newCalcExpr = calcExpr + v;
        setCalcExpr( newCalcExpr );

        if(v === deciSym){
            setDecimalPlaced(true)
        }
        else if(isOperator(v)){
            setDecimalPlaced(false)
        }

        if(!isOperator(v)){
            performEvaluation(newCalcExpr);
        }
    }

    const performEvaluation = (expr) => {
        const calculatedResult = evaluate(expr).toString();
        setResultCalc( calculatedResult );
    }

    /**
     * Note: digit 0 is to be below all other digits per calculator
     *       visual design
     * @returns an array of buttons representing 0 through 9 for the 
     *          calculator
     */
    const createDigits = () => {
        const digits = [];
        for(let i=1; i<10; i++){
            digits.push( <button key={i}
                         onClick={()=>updateCalcDisp(i.toString())}
                         > {i} </button>)
        }
        //push the button for the 0 digit for the calculator
        digits.push( <button key={0}
            onClick={()=>updateCalcDisp("0")}
            > 0 </button>)

        return digits;
    }


    //the markup component (calculator)
    return (
        <>
        <div className="app">
            <div className="calculator">
                <div className="calc-display">
                    <span>({resultCalc})</span> {calcExpr}
                </div>
                <div className="operators">
                    <button onClick={()=>updateCalcDisp(divSym)}>{divSym}</button>
                    <button onClick={()=>updateCalcDisp(multSym)}>{multSym}</button>
                    <button onClick={()=>updateCalcDisp(plusSym)}>{plusSym}</button>
                    <button onClick={()=>updateCalcDisp(minusSym)}>{minusSym}</button>

                    <button>DEL</button>
                </div>
                <div className="digits">
                    {createDigits()}
                    <button onClick={()=>updateCalcDisp(deciSym)}>{deciSym}</button>
                    <button>=</button>
                </div>
            </div>
        </div>
        </>
    );
}// end main function

