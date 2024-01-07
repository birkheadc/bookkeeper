import * as React from 'react';
import './CsvPage.css'

interface ICsvPageProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function CsvPage(props: ICsvPageProps): JSX.Element | null {
  return (
    <main className='csv-page-wrapper'>
      <h1>upload csv</h1>
      <div className='csv-page-warning'>
        <h2 className='error'>WARNING!</h2>
        <p className='error'>This action will REPLACE the ENTIRE DATABASE.</p>
        <p className='error'>All information WILL BE LOST.</p>
        <p className='error'>Only proceed if you know what you are doing!</p>
      </div>
    </main>
  );
}