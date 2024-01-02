import * as React from 'react';
import './EmptyDisplayCards.css'

interface IEmptyDisplayCardsProps {
  num: number
}

/**
*
* @returns {JSX.Element | null}
*/
export default function EmptyDisplayCards(props: IEmptyDisplayCardsProps): JSX.Element | null {
  return (
    <>
      {
        Array.from({ length: props.num }).map(
          (item, index) =>
          <div key={`empty-display-card-key-${index}`} className='browse-page-display-card-outer-wrapper'>
            <div className='empty-display-card-wrapper'></div>
          </div>
        )
      }
    </>
  );
}