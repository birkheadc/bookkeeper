import * as React from 'react';
import './CsvUploadForm.css'
import ResultDisplay from '../../../resultDisplay/ResultDisplay';
import { Result } from '../../../../types/result/result';
import { ReportsContext } from '../../../../app/contexts/reports/ReportsContext';

interface ICsvUploadFormProps {

}

/**
*
* @returns {JSX.Element | null}
*/
export default function CsvUploadForm(props: ICsvUploadFormProps): JSX.Element | null {

  const [ recentResult, setRecentResult ] = React.useState<Result>();
  const { uploadCsv } = React.useContext(ReportsContext);

  const [ file, setFile ] = React.useState<File>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file == null) return;
    setFile(file);
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await uploadCsv(file);
    setRecentResult(result);
  }

  return (
    <form className='csv-upload-form-wrapper standard-form' onSubmit={submit}>
      <ResultDisplay result={recentResult} />
      <input className='standard-input' type='file' onChange={handleChange}></input>
      <button className='standard-button' type='submit'>upload</button>
    </form>
  );
}