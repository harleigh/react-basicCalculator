//every begining has a begining, and this is this begining. And, being that
//this is the begining, take it with a grain of salt as there is quite a road
//yet being paved; as I am learning, all code and documentation are "as is"


//TODO: repeating decimals 

import { useState } from 'react';
import { evaluate } from 'mathjs'

//"export default"  makes this the main component in the file.
//returns a component that contains the filter table with a little
//header above

/**
 * The calculator has two special states that displays to the user:
 *   calcExpr: Which is a running amount of digits and math operations
 *             like "8+9/3-0.1-100"
 *   resultCalc: this is a running evaluation of the calculator
 *               expression and is displayed in parenthesis
 *               e.g. "(5) 3-1+3*1"
 * @returns A calculator component
 */
export default function SimpleCalculator() {

    const emptyDisplay = ""
    const [calcExpr, setCalcExpr] = useState(emptyDisplay);
    const [resultCalc, setResultCalc] = useState("0");
    const [decimalPlaced, setDecimalPlaced] = useState(false)
    const divSym = "/"
    const multSym = "*"
    const plusSym = "+"
    const minusSym = "-"
    const deciSym = "."
    const ops = [divSym, multSym, plusSym, minusSym, deciSym];


    const isDigit = (v) => {
        return "0123456789".includes(v) && !emptyCalcExpr();
    }

    const isOperator = (v) => {
        return ops.includes(v);
    }
    const emptyCalcExpr = () => {
        return calcExpr===emptyDisplay;
    }

    //evaluates and returns a calculator expression, using the mathjs library
    const performEvaluation = (expr) => {
        return evaluate(expr).toString();
    }


    /**
     * 
     * case1: the new entry is an operator, and the last entry in the display
     *        is an operator
     * case2: there is nothing in the calculator expression and the user tried
     *        to apply an operator (e.g. they hit the plus sign before any
     *        numbers are in the display)
     * case3: Watches for multiple decimal points.  If the decimal place is 
     *        currently being used and the user hit the decimal place again, 
     *        then the user has given an invalid expression for the calculator
     *        display  
     * @param {*} newEntry entry that user has pressed (as a button)
     * @returns true if and only if the new entry the user attempted to add
     *          to the display results in an invalid math expression 
     */
    const makesInvalidExpr = (newEntry) => {
        const lastInDisplay = calcExpr.slice(-1);
        const case1 = isOperator(newEntry) && isOperator(lastInDisplay);
        const case2 = isOperator(newEntry) && emptyCalcExpr()
        const case3 = decimalPlaced && newEntry===deciSym;
        //return (isOperator(newEntry) && (isOperator(lastInDisplay) || isEmpty(calcExpr)));
        return (case1 || case2 || case3);
    }

    /**
     * user has hit a button on the calculator, must update calculator
     * display and the running total 
     */
    const updateCalcDisp = (v) => {

        if( makesInvalidExpr(v) ) {return;}
        
        const newCalcExpr = calcExpr + v;
        setCalcExpr( newCalcExpr );

        //manage the decimal point: 
        if(v === deciSym){
            setDecimalPlaced(true)
        }
        else if(isOperator(v)){
            setDecimalPlaced(false)
        }

        if(!isOperator(v)){
            const calculatedResult = performEvaluation(newCalcExpr);
            setResultCalc( calculatedResult );
        }
    }


    /**
     * Case: User hit equals button
     * --On (valid) equal sign press, we evaluate the running calculator
     *   expression, compressing it to the evaluated value e.g. "1+3"
     *   becomes 4 on the running calculator expression. We also update
     *   the running result, so for our example of "1+3" display is "(4) 4"
     * --A valid expression for us to apply the equals functionality is when
     *   the last entry in the calc display is a number.
     */
    const applyEqualsKey = () => {
        const lastInDisplay = calcExpr.slice(-1);
        if( isDigit(lastInDisplay) ){ 
            const evaluatedExpr = performEvaluation(calcExpr);
            setCalcExpr(evaluatedExpr);
            setResultCalc( evaluatedExpr )
        }
    }//end apply equals key

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
    }// end creating the digits buttons



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
                    <button onClick={()=>applyEqualsKey()}>=</button>
                </div>
            </div>
        </div>
        </>
    );
}// end main function

