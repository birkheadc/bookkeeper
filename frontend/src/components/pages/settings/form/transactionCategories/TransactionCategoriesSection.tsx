import * as React from 'react';
import './TransactionCategoriesSection.css'

interface ITransactionCategoriesSectionProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function TransactionCategoriesSection(props: ITransactionCategoriesSectionProps): JSX.Element | null {
  return (
    <section className='transaction-categories-section settings-section'>
      <h2>transaction categories</h2>
    </section>
  );
}