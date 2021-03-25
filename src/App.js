import './App.css';
import { timer, fromEvent } from 'rxjs'
import {map} from 'rxjs/operators'
import React from 'react'
import { useState } from 'react'

function App() {
  
  let time = 'HH: MM: SS'
  let start = false
  let wait = false
  let cl1 = false
  let seconds$

  let min = 0
  let sec = 0
  let hr = 0

  const [state, setState] = useState( {
    time1:time,
  } )

  let ClickStartStop = () => {
   
    if (!start) {
      start = true
      wait = false

      seconds$ = timer(0, 1000).pipe(
        map(() => {
          sec++
          if (sec > 59) {sec = 0; min++}
          if (min > 59) {min = 0; hr++ }
          if (hr > 99) {hr = 0}
          
        })
      ).subscribe({

        next: () => {
          let text = `${hr < 10 ? '0' + hr : hr}: ${min < 10 ? '0' + min : min}: ${sec < 10 ? '0' + sec : sec}`
          //console.log(text)
          setState({...state, time1:text})
        },
       
      })

    } else {
      start = false
      seconds$.unsubscribe()
      min = 0
      sec = 0
      hr = 0
      let text = `${hr < 10 ? '0' + hr : hr}: ${min < 10 ? '0' + min : min}: ${sec < 10 ? '0' + sec : sec}`
      setState({...state, time1:text})
    }

  }

  let ClickReset = () => {
    min = 0
    sec = 0
    hr = 0
  }

  React.useEffect(() => {
    let t300
       
    fromEvent(
      document.getElementById('Wait'),
      'click'
    ).pipe(

    ).subscribe(() => {
      if (!cl1) {
        cl1 = true
        t300 = setTimeout(() => { cl1 = false }, 300)
      } else {
        clearTimeout(t300)
        cl1 = false
        if (start) {
          seconds$.unsubscribe()
          if (!wait) {
            wait = true
          } else {
            wait = false
            start = false
            ClickStartStop()
          }
        }
      }

    })

    fromEvent(
      document.getElementById('StartStop'),
      'click'
    ).subscribe(() => {
      ClickStartStop()
    })

    fromEvent(
      document.getElementById('Reset'),
      'click'
    ).subscribe(() => {      
      ClickReset()
    })
  }, []) 

  return (
    <div className="App">
      <p>{`${state.time1}`}</p>
      <button
        id='StartStop'
        className='StartStop'
       // onClick={ClickStartStop}
      >Start / Stop
    </button>
      <button
        id='Wait'
        className='Wait'
      // onClick={ClickWait}
      >Wait
      </button>
      <button
        id='Reset'
        className='Reset'
       // onClick={ClickReset}
      >Reset
      </button>

    </div>
  );
}

export default App;
