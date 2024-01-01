import * as React from 'react';
import './BrowsePage.css'

interface IBrowsePageProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function BrowsePage(props: IBrowsePageProps): JSX.Element | null {
  return (
    <main className='browse-page-wrapper'>
      <h1>browse</h1>
    </main>
  );
}