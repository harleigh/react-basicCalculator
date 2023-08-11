//every begining has a begining, and this is this begining. And, being that
//this is the begining, take it with a grain of salt as there is quite a road
//yet being paved; as I am learning, all code and documentation are "as is"


//TODO: repeating decimals 

import { useState } from 'react';
import { evaluate, format } from 'mathjs'

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

    const numFixedPts = 7
    const emptyDisplay = ""
    const defaultResultCalc = "0"
    const [calcExpr, setCalcExpr] = useState(emptyDisplay);
    const [resultCalc, setResultCalc] = useState(defaultResultCalc);
    const [decimalPlaced, setDecimalPlaced] = useState(false)
    const divSym = "/"
    const multSym = "*"
    const plusSym = "+"
    const minusSym = "-"
    const deciSym = "."
    const equSym = "="
    const ops = [divSym, multSym, plusSym, minusSym, deciSym];

    /**
     * A digit is 0 through 9.
     * Special case: Watch out if v is the empty string (e.g. user
     * hits equals sign on a blank calculator display)
     */
    const isDigit = (v) => {
        return "0123456789".includes(v) && v!=="";
    }

    const isOperator = (v) => {
        return ops.includes(v);
    }
    const emptyCalcExpr = () => {
        return calcExpr===emptyDisplay;
    }

    //evaluates and returns a calculator expression, using the mathjs library
    const performEvaluation = (expr) => {
        const evaluatedExpr = evaluate(expr)
        const formattedExpr = format(evaluatedExpr, numFixedPts)
        return formattedExpr.toString()
    }

    /**
     * This manages the flag representing whether the decimal key has
     * been pressed. This flag is used in determining whether the user
     * is entering a valid mathematical expression.
     *      e.g. 0.8, 0.011, 000.91331 are each valid
     *      e.g. 0.8. , 0.77000.01 are not valid
     * The user is allowed to place another decimal only if an operator
     * key has been hit  with "9.7 +" the user can use the decimal place
     * once again
     * 
     * @param {*} newCalcEntry This is entry from the button that the user
     *     pressed on the calculator
     */
    const manageDecimalPoint = (newCalcEntry) => {
        if(newCalcEntry === deciSym){
            setDecimalPlaced(true)
        }
        else if(isOperator(newCalcEntry)){
            setDecimalPlaced(false)
        }
    }// end managaing the decimal flag

    const validEvaluation = (amt) => {
        return (amt !=="Infinity" && !isNaN(amt))
    }

    /**
     * Note: This is such a simple calculator, we can brute-out all the cases
     *       of errors.  In a new calculator (with say, parenthesis) the divide
     *       by zero case would be more of an issue.
     * case1: the new entry is an operator, and the last entry in the display
     *        is an operator
     * case2: there is nothing in the calculator expression and the user tried
     *        to apply an operator (e.g. they hit the plus sign before any
     *        numbers are in the display)
     * case3: Watches for multiple decimal points.  If the decimal place is 
     *        currently being used and the user hit the decimal place again, 
     *        then the user has given an invalid expression for the calculator
     *        display  
     * case4: We are avoiding a NaN or Infinty divide by zero scenario here. 
     *        Becuase the running total is always updated at each entry key,
     *        the user can get a divide by zero entering "3/0.5" as first they
     *        have to enter "3"->"3/"->"3/0"->"3/0.5", so the user is still valid
     *        at "3/0" provided they hit a number key or the decimal key.
     *    TODO:ADD DEL key to case 4
     * @param {*} newEntry entry that user has pressed (as a button)
     * @returns true if and only if the new entry the user attempted to add
     *          to the display results in an invalid math expression 
     */
    const makesInvalidExpr = (newEntry) => {
        const lastInDisplay = calcExpr.slice(-1);
        const case1 = isOperator(newEntry) && isOperator(lastInDisplay);
        const case2 = isOperator(newEntry) && emptyCalcExpr()
        const case3 = decimalPlaced && newEntry===deciSym;
        const case4 = !validEvaluation(resultCalc) && !isDigit(newEntry) && newEntry!==deciSym;
        return (case1 || case2 || case3 || case4);
    }

    const evalRunningTotal = ( expr ) => {
        const lastKeyPressed = expr.slice(-1)
        if(!isOperator(lastKeyPressed)){
            const calculatedResult = performEvaluation(expr);
            setResultCalc( calculatedResult );
        }
    } 

    /**
     * user has hit a button on the calculator, must update calculator
     * display and the running total if and only if the new entry that they
     * hit on the calculator makes a valid expression.
     * 
     * If the entry from the user is valid: we update the expression in the
     * calculator display, we manage the decimal point, and as long as the 
     * user has not entered an operator (which includes the decimal point),
     * we update the running total of the displaied calculator expression.
     */
    const updateCalcDisp = (newCalcEntry) => {

        if( makesInvalidExpr(newCalcEntry) ) {return;}
        
        const newCalcExpr = calcExpr + newCalcEntry;
        setCalcExpr( newCalcExpr );

        //manage the decimal point flag: 
        manageDecimalPoint(newCalcEntry)

        //evaluate the running display result on the calculator
        /* if(!isOperator(newCalcEntry)){
            const calculatedResult = performEvaluation(newCalcExpr);
            setResultCalc( calculatedResult );
        } */
        evalRunningTotal(newCalcExpr)
    }// end updating the calculator display


    /**
     * Case: User hit equals button
     * --On (valid) equal sign press, the calculator expression in the display
     *   e.g. "(5) 1+4" is changed to what the running amount is "(5) 5"
     * --A valid expression for us to apply the equals functionality is when
     *   the last entry in the calc display is a number.
     */
    const applyEqualsKey = () => {
        const lastInDisplay = calcExpr.slice(-1);
        if( isDigit(lastInDisplay) ){ 
            const evaluatedExpr = performEvaluation(calcExpr);
            if( validEvaluation(evaluatedExpr)) {
                setCalcExpr(evaluatedExpr);
                setResultCalc( evaluatedExpr )
            }
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


    /**
     * remove the last element on the calculator display
     * and then update the display
     */
    const applyDelKey = () => {
        if(emptyCalcExpr()){return}
        console.log("Trying to delete key")
        const newCalcExpr = calcExpr.slice(0,-1);
        setCalcExpr(newCalcExpr)
        if(newCalcExpr!==""){
            const lastEntry = newCalcExpr.slice(-1)
            if(!isOperator(lastEntry)) { //e.g. was "2+57" now "2+5"
                evalRunningTotal(newCalcExpr)
            }
            else{//e.g. was "9-2" now "9-" so running total should be 9
                evalRunningTotal(newCalcExpr.slice(0,-1))
            }
        }
        else {//we deleted everything off the calculator display
            setResultCalc(defaultResultCalc)
        }
    }

    const applyClearKey = () => {
        setCalcExpr(emptyDisplay)
        setResultCalc(defaultResultCalc);
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
                    <button onClick={() => null}>MS</button>
                    <button onClick={() => null}>MR</button>
                    <button onClick={() => null}>MC</button>
                    <button onClick={applyClearKey}>CLR</button>
                </div>
                <div className="operators">
                    <button onClick={()=>updateCalcDisp(divSym)}>{divSym}</button>
                    <button onClick={()=>updateCalcDisp(multSym)}>{multSym}</button>
                    <button onClick={()=>updateCalcDisp(plusSym)}>{plusSym}</button>
                    <button onClick={()=>updateCalcDisp(minusSym)}>{minusSym}</button>

                    <button onClick={applyDelKey}>DEL</button>
                </div>
                <div className="digits">
                    {createDigits()}
                    <button onClick={()=>updateCalcDisp(deciSym)}>{deciSym}</button>
                    <button onClick={()=>applyEqualsKey()}>{equSym}</button>
                </div>
            </div>
        </div>
        </>
    );
}// end main function

