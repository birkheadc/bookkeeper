import * as React from 'react';
import './CsvUploadForm.css'

interface ICsvUploadFormProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function CsvUploadForm(props: ICsvUploadFormProps): JSX.Element | null {

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    
  }

  return (
    <form className='csv-upload-form-wrapper standard-form' onSubmit={submit}>
      <input className='standard-input' type='file'></input>
      <button type='submit'>upload</button>
    </form>
  );
}