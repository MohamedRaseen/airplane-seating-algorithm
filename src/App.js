
import { useState, useEffect, useRef } from 'react';
import './App.scss';

const App = () => {

  const [column, setColumn] = useState(1);
  const [row, setRow] = useState(1);
  const [flightSeats, setFlightSeats] = useState([]);
  const [passengers, updatePassengers] = useState();
  const seatAllocationQueue = ['aisle', 'window', 'middle'];
  const passengersCountEl = useRef(null), error = useRef(null);

  useEffect(() =>{
    cleanupSeats(document.getElementsByTagName('td'));
    if(passengers && passengers > 0){
      let startSeatNo = 1,isSeatsAllocated = false;
      for(let allocationQueueIndex=0; ((allocationQueueIndex < seatAllocationQueue.length) && !isSeatsAllocated); allocationQueueIndex++){
        
        let seatElements = document.getElementsByClassName(seatAllocationQueue[allocationQueueIndex]);
        
        if(seatElements?.length > 0){
          seatElements = Array.from(seatElements);
          startSeatNo = allocatedSeatsForPassengers(seatElements.slice(0,passengers), startSeatNo, passengers);
          isSeatsAllocated = startSeatNo > passengers;
        }
      }

      error.current.innerText = (isSeatsAllocated ? '' :`seats are not sufficient, need ${passengers - (startSeatNo - 1)} more seats`);
    }
    
  },[flightSeats, passengers]);

  const cleanupSeats = (seats) =>{
    seats?.length > 0 && Array.from(seats).map(seat => seat.innerText = '');
  }

  const allocatedSeatsForPassengers = (elements, startSeatNo, passengers) =>{
    let splittedElements = [];
    elements && elements.length > 0 && elements.map((element) =>{
        let elementBounding = element?.getBoundingClientRect();
        let splittedElement = splittedElements.length > 0 && splittedElements.find(ele => ele?.top === elementBounding?.top);
        splittedElement ? splittedElement?.elements?.push(element) : splittedElements.push({ top: elementBounding?.top, elements:[element]});
    });
    splittedElements.map(a => a.elements).flat().slice(0,(passengers-(startSeatNo - 1))).map(ele => ele.innerText = startSeatNo++);
    return startSeatNo;
  }

  const getSeatClass = (isWindow, isAisle) =>{
    let seatClass = 'seat';
    seatClass = (seatClass + (isWindow ? ` ${seatAllocationQueue[1]}` : isAisle ? ` ${seatAllocationQueue[0]}` :` ${seatAllocationQueue[2]}`));
    return seatClass;
  }

  return (
    <div className='app-container'>
      <div className='column-row-container'>
        <div className='column'>
          <span>Enter Number of Columns:</span>
          <input type='number' min="1" value={column} onChange={(e) => e?.target?.value && setColumn(Number(e.target.value))} />
        </div>
        <div className='row'>
          <span>Enter Number of Rows:</span>
          <input type='number' min="1" value={row} onChange={(e) => e?.target?.value && setRow(Number(e.target.value))} />
        </div>
        <div className='seat-cta' onClick={() => {
          flightSeats.push([column, row]);
          setColumn(1);
          setRow(1);
          setFlightSeats(flightSeats.slice());
        }}>Construct Seats</div>
      </div>
      <div className='passenger-input-container'>
        <input type='number' ref={passengersCountEl}/>
        <div className='passenger-cta' onClick={() => {
          updatePassengers(passengersCountEl.current.value);
        }}>Allocate Passengers</div>
        <div className='error' ref={error}></div>
      </div>
      <h3> Flight Seats</h3>
      <div className='seats-container'>
        {
          flightSeats && flightSeats.length > 0 &&
          flightSeats.map((seatContainer, index) =>{
            console.log('seatContainer', seatContainer);
            if(seatContainer && seatContainer.length > 0){
              let columnCount = seatContainer[0], rowCount = seatContainer[seatContainer.length -1];
              let isWindowSeatApplicable = (index === 0) || (index === flightSeats.length -1);
              return(
                  <table>
                    {
                      [...Array(rowCount)].map((row, rowIdx) => {
                        return(
                          <tr>
                            {
                              [...Array(columnCount)].map((col, colIdx) => {
                                let isWindow = isWindowSeatApplicable && ((index === 0 && colIdx === 0) || ((index === flightSeats.length -1) && (colIdx === columnCount -1)));
                                let isAisle = !isWindow && (colIdx === 0) || (colIdx === columnCount -1)
                                return(
                                  <td className={getSeatClass(isWindow, isAisle)}></td>
                                )
                              })
                            }
                          </tr>
                        )
                      })
                    }
                  </table>
                )
            }
          })
        }
      </div>
    </div>
  )
}

export default App;
