//every begining has a begining, and this is this begining. And, being that
//this is the begining, take it with a grain of salt as there is quite a road
//yet being paved; as I am learning, all code and documentation are "as is"


//import { useState } from 'react';

//"export default"  makes this the main component in the file.
//returns a component that contains the filter table with a little
//header above
export default function SimpleCalculator() {

    const createDigits = () => {
        const digits = [];
        for(let i=1; i<10; i++){
            digits.push( <button key={i}>{i}</button>)
        }
        return digits;
    }

    return (
        <>
        <div className="app">
            <div className="calculator">
                <div className="calc-display">
                    <span>(0)</span> 0
                </div>
                <div className="operators">
                    <button>/</button>
                    <button>*</button>
                    <button>+</button>
                    <button>-</button>

                    <button>DEL</button>
                </div>
                <div className="digits">
                    {createDigits()}
                    <button>0</button>
                    <button>.</button>
                    <button>=</button>
                </div>
            </div>
        </div>
        </>
    );

}// end main function

