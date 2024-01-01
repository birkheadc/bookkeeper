import * as React from 'react';
import './DetailPage.css'

interface IDetailPageProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function DetailPage(props: IDetailPageProps): JSX.Element | null {
  return (
    <main className='detail-page-wrapper'>
      <h1>detail</h1>
    </main>
  );
}