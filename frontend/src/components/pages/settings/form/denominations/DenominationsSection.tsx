import * as React from 'react';
import './DenominationsSection.css'

interface IDenominationsSectionProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function DenominationsSection(props: IDenominationsSectionProps): JSX.Element | null {
  return (
    <section className='denominations-section-wrapper settings-section'>
      <h2>calculator denominations</h2>
    </section>
  );
}